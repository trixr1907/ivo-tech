#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const logPath = path.resolve(process.cwd(), 'docs/hero-experiment-log.md');

function getArgValue(name) {
  const prefix = `${name}=`;
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith(prefix)) return arg.slice(prefix.length);
  }
  return '';
}

function getDay() {
  const raw = getArgValue('--day');
  if (!raw) {
    const d = new Date();
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  }
  const parsed = new Date(`${raw}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid --day value: ${raw}. Use YYYY-MM-DD.`);
  }
  return parsed;
}

function formatDate(date) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function deriveSiteId() {
  const explicit = (process.env.ANALYTICS_SINK_PLAUSIBLE_DOMAIN ?? '').trim();
  if (explicit) return explicit;
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? '').trim();
  if (!siteUrl) return 'ivo-tech.com';
  try {
    return new URL(siteUrl).hostname;
  } catch {
    return 'ivo-tech.com';
  }
}

function parseNumeric(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  if (value && typeof value === 'object' && 'value' in value) {
    const nested = Number(value.value);
    if (Number.isFinite(nested)) return nested;
  }
  return 0;
}

function extractRows(payload) {
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.results?.rows)) return payload.results.rows;
  if (Array.isArray(payload?.rows)) return payload.rows;
  return [];
}

function extractTotal(payload) {
  const rows = extractRows(payload);
  return rows.reduce((sum, row) => {
    if (Array.isArray(row?.metrics)) return sum + parseNumeric(row.metrics[0]);
    if (typeof row === 'number') return sum + row;
    if (row && typeof row === 'object') return sum + parseNumeric(row.events ?? row.value);
    return sum;
  }, 0);
}

function extractDimensionMap(payload) {
  const rows = extractRows(payload);
  const map = new Map();
  for (const row of rows) {
    const key = Array.isArray(row?.dimensions) ? String(row.dimensions[0] ?? '') : '';
    if (!key) continue;
    const value = Array.isArray(row?.metrics) ? parseNumeric(row.metrics[0]) : parseNumeric(row.events ?? row.value);
    map.set(key, (map.get(key) ?? 0) + value);
  }
  return map;
}

async function queryPlausible({ host, token, siteId, day, filters = [], dimensions = [] }) {
  const payload = {
    site_id: siteId,
    metrics: ['events'],
    date_range: [day, day],
    filters,
    dimensions
  };
  const response = await fetch(`${host}/api/v2/query`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(12000)
  });

  const text = await response.text();
  let parsed = {};
  try {
    parsed = text ? JSON.parse(text) : {};
  } catch {
    parsed = { raw: text };
  }

  if (!response.ok) {
    throw new Error(`Plausible query failed (${response.status}): ${text.slice(0, 280)}`);
  }

  return parsed;
}

function formatPercent(numerator, denominator) {
  if (denominator <= 0) return 'n/a';
  return `${((numerator / denominator) * 100).toFixed(2)}%`;
}

function formatVariantDistribution(variantMap) {
  const keys = ['default', 'outcome', 'speed'];
  const total = keys.reduce((sum, key) => sum + (variantMap.get(key) ?? 0), 0);
  if (total <= 0) return 'n/a';
  const values = keys.map((key) => {
    const count = variantMap.get(key) ?? 0;
    return count.toFixed(0);
  });
  return values.join('/');
}

function replaceTableRow(content, day, values) {
  const escapedDay = day.replaceAll('-', '\\-');
  const rowPattern = new RegExp(`^\\|\\s*${escapedDay}\\s*\\|.*$`, 'm');
  if (!rowPattern.test(content)) {
    throw new Error(`Could not find table row for ${day} in ${logPath}`);
  }
  return content.replace(
    rowPattern,
    `| ${day} | ${values.distribution} | ${values.ctaPrimaryCtr} | ${values.contactStartRate} | ${values.submitSuccessRate} | ${values.notes} |`
  );
}

async function main() {
  const token = (process.env.PLAUSIBLE_STATS_API_KEY ?? '').trim();
  const host = (process.env.ANALYTICS_SINK_PLAUSIBLE_HOST ?? 'https://plausible.io').trim().replace(/\/+$/, '');
  const siteId = deriveSiteId();
  const date = getDay();
  const day = formatDate(date);

  if (!token) {
    console.error('[hero-log-sync-plausible] Missing PLAUSIBLE_STATS_API_KEY.');
    process.exit(1);
  }

  const [ctaPrimary, contactStart, submitSuccess, variants] = await Promise.all([
    queryPlausible({ host, token, siteId, day, filters: [['is', 'event:goal', ['cta_primary_click']]] }).then(extractTotal),
    queryPlausible({ host, token, siteId, day, filters: [['is', 'event:goal', ['contact_form_start']]] }).then(extractTotal),
    queryPlausible({ host, token, siteId, day, filters: [['is', 'event:goal', ['contact_form_submit_success']]] }).then(extractTotal),
    queryPlausible({
      host,
      token,
      siteId,
      day,
      filters: [['is', 'event:goal', ['hero_variant_view']]],
      dimensions: ['event:props:variant']
    }).then(extractDimensionMap)
  ]);

  const updatedValues = {
    distribution: formatVariantDistribution(variants),
    ctaPrimaryCtr: formatPercent(
      ctaPrimary,
      Array.from(variants.values()).reduce((sum, value) => sum + value, 0)
    ),
    contactStartRate: formatPercent(contactStart, ctaPrimary),
    submitSuccessRate: formatPercent(submitSuccess, contactStart),
    notes: `auto-sync plausible (${ctaPrimary.toFixed(0)} cta / ${contactStart.toFixed(0)} start / ${submitSuccess.toFixed(0)} submit)`
  };

  const source = readFileSync(logPath, 'utf8');
  const next = replaceTableRow(source, day, updatedValues);
  writeFileSync(logPath, next, 'utf8');

  console.log('[hero-log-sync-plausible]');
  console.log(`Updated row for ${day}`);
  console.log(`distribution=${updatedValues.distribution}`);
  console.log(`cta_primary_ctr=${updatedValues.ctaPrimaryCtr}`);
  console.log(`contact_start_rate=${updatedValues.contactStartRate}`);
  console.log(`submit_success_rate=${updatedValues.submitSuccessRate}`);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[hero-log-sync-plausible] Failed: ${message}`);
  process.exit(1);
});
