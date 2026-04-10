#!/usr/bin/env node

import process from 'node:process';

const args = new Set(process.argv.slice(2));
const strictAlerts = args.has('--strict-alerts');

function getArgValue(name) {
  const prefix = `${name}=`;
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith(prefix)) return arg.slice(prefix.length);
  }
  return '';
}

function asUtcDate(value) {
  const parsed = value ? new Date(`${value}T00:00:00Z`) : new Date();
  if (Number.isNaN(parsed.getTime())) return null;
  return new Date(Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate()));
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
  if (rows.length === 0) return 0;

  return rows.reduce((sum, row) => {
    if (Array.isArray(row?.metrics)) return sum + parseNumeric(row.metrics[0]);
    if (typeof row === 'number') return sum + row;
    if (row && typeof row === 'object') {
      if ('events' in row) return sum + parseNumeric(row.events);
      if ('value' in row) return sum + parseNumeric(row.value);
    }
    return sum;
  }, 0);
}

function extractDimensionMap(payload) {
  const rows = extractRows(payload);
  const map = new Map();
  for (const row of rows) {
    const key = Array.isArray(row?.dimensions) ? String(row.dimensions[0] ?? '') : String(row?.dimension ?? '');
    const value = Array.isArray(row?.metrics) ? parseNumeric(row.metrics[0]) : parseNumeric(row?.events ?? row?.value);
    if (!key) continue;
    map.set(key, (map.get(key) ?? 0) + value);
  }
  return map;
}

async function queryPlausible({ host, token, siteId, dateRange, filters = [], dimensions = [] }) {
  const response = await fetch(`${host}/api/v2/query`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      site_id: siteId,
      metrics: ['events'],
      date_range: dateRange,
      filters,
      dimensions
    }),
    signal: AbortSignal.timeout(12000)
  });

  const text = await response.text();
  let payload = {};
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = { raw: text };
  }

  if (!response.ok) {
    throw new Error(`Plausible query failed (${response.status}): ${text.slice(0, 280)}`);
  }

  return payload;
}

async function getEventCount(context, eventName, dateRange) {
  const payload = await queryPlausible({
    ...context,
    dateRange,
    filters: [['is', 'event:goal', [eventName]]]
  });
  return extractTotal(payload);
}

async function getUnknownSourceRatio(context, dateRange) {
  const [total, unknown] = await Promise.all([
    getEventCount(context, 'contact_form_start', dateRange),
    queryPlausible({
      ...context,
      dateRange,
      filters: [
        ['is', 'event:goal', ['contact_form_start']],
        ['is', 'event:props:source', ['unknown']]
      ]
    }).then(extractTotal)
  ]);

  return {
    total,
    unknown,
    ratio: total > 0 ? unknown / total : 0
  };
}

async function getHeroVariantDistribution(context, dateRange) {
  const payload = await queryPlausible({
    ...context,
    dateRange,
    filters: [['is', 'event:goal', ['hero_variant_view']]],
    dimensions: ['event:props:variant']
  });

  return extractDimensionMap(payload);
}

function percentage(deltaBase, current) {
  if (deltaBase <= 0) return 0;
  return ((current - deltaBase) / deltaBase) * 100;
}

async function main() {
  const token = (process.env.PLAUSIBLE_STATS_API_KEY ?? '').trim();
  const host = (process.env.ANALYTICS_SINK_PLAUSIBLE_HOST ?? 'https://plausible.io').trim().replace(/\/+$/, '');
  const siteId = deriveSiteId();
  const day = getArgValue('--day');
  const endDate = asUtcDate(day);

  if (!endDate) {
    console.error('[analytics-plausible-ops] Invalid --day value. Use YYYY-MM-DD.');
    process.exit(1);
  }

  if (!siteId) {
    console.error('[analytics-plausible-ops] Missing site id. Set ANALYTICS_SINK_PLAUSIBLE_DOMAIN or NEXT_PUBLIC_SITE_URL.');
    process.exit(1);
  }

  if (!token) {
    console.error('[analytics-plausible-ops] Missing PLAUSIBLE_STATS_API_KEY.');
    process.exit(1);
  }

  const currentStart = new Date(endDate);
  currentStart.setUTCDate(endDate.getUTCDate() - 6);
  const previousEnd = new Date(endDate);
  previousEnd.setUTCDate(endDate.getUTCDate() - 7);
  const previousStart = new Date(endDate);
  previousStart.setUTCDate(endDate.getUTCDate() - 13);

  const currentRange = [formatDate(currentStart), formatDate(endDate)];
  const previousRange = [formatDate(previousStart), formatDate(previousEnd)];

  const context = { host, token, siteId };
  const trackedEvents = [
    'cta_primary_click',
    'contact_form_start',
    'contact_form_submit_success',
    'thank_you_view',
    'thank_you_cta_click',
    'service_detail_view',
    'service_detail_cta_click'
  ];

  const eventRows = [];
  for (const eventName of trackedEvents) {
    const [current, previous] = await Promise.all([
      getEventCount(context, eventName, currentRange),
      getEventCount(context, eventName, previousRange)
    ]);
    eventRows.push({
      eventName,
      current,
      previous,
      wowDeltaPct: percentage(previous, current)
    });
  }

  const unknownSource = await getUnknownSourceRatio(context, currentRange);
  const variantMap = await getHeroVariantDistribution(context, currentRange);
  const variantTotal = [...variantMap.values()].reduce((sum, value) => sum + value, 0);

  const lookup = (name) => eventRows.find((row) => row.eventName === name)?.current ?? 0;
  const contactStartRate = lookup('cta_primary_click') > 0 ? lookup('contact_form_start') / lookup('cta_primary_click') : 0;
  const submitRate = lookup('contact_form_start') > 0 ? lookup('contact_form_submit_success') / lookup('contact_form_start') : 0;
  const thankYouNextStepRate = lookup('thank_you_view') > 0 ? lookup('thank_you_cta_click') / lookup('thank_you_view') : 0;

  const submitRow = eventRows.find((row) => row.eventName === 'contact_form_submit_success');
  const detailViewRow = eventRows.find((row) => row.eventName === 'service_detail_view');
  const detailCtaRow = eventRows.find((row) => row.eventName === 'service_detail_cta_click');

  const alerts = [
    {
      id: 'submit_success_wow_drop',
      triggered: Boolean(submitRow && submitRow.previous > 0 && submitRow.current < submitRow.previous * 0.7),
      note: 'contact_form_submit_success drops >30% WoW'
    },
    {
      id: 'detail_cta_efficiency_drop',
      triggered: Boolean(
        detailCtaRow &&
          detailViewRow &&
          detailCtaRow.previous > 0 &&
          detailCtaRow.current < detailCtaRow.previous * 0.8 &&
          detailViewRow.current >= detailViewRow.previous
      ),
      note: 'service_detail_cta_click drops >20% WoW while service_detail_view is flat/rising'
    },
    {
      id: 'unknown_source_spike',
      triggered: unknownSource.ratio > 0.25,
      note: 'source=unknown share >25% of contact_form_start'
    }
  ];

  console.log('[analytics-plausible-ops]');
  console.log(`Site: ${siteId}`);
  console.log(`Host: ${host}`);
  console.log(`Current range: ${currentRange[0]}..${currentRange[1]}`);
  console.log(`Previous range: ${previousRange[0]}..${previousRange[1]}`);

  console.log('\nEvent summary (current vs previous):');
  console.log('| Event | Current 7d | Previous 7d | WoW delta % |');
  console.log('| --- | ---: | ---: | ---: |');
  for (const row of eventRows) {
    console.log(`| ${row.eventName} | ${row.current} | ${row.previous} | ${row.wowDeltaPct.toFixed(1)} |`);
  }

  console.log('\nCore ratios (current window):');
  console.log(`- contact_start_rate: ${(contactStartRate * 100).toFixed(2)}%`);
  console.log(`- submit_rate: ${(submitRate * 100).toFixed(2)}%`);
  console.log(`- thank_you_next_step_rate: ${(thankYouNextStepRate * 100).toFixed(2)}%`);
  console.log(`- unknown_source_ratio: ${(unknownSource.ratio * 100).toFixed(2)}% (${unknownSource.unknown}/${unknownSource.total})`);

  console.log('\nHero variant distribution (current window):');
  if (variantTotal <= 0) {
    console.log('- no hero_variant_view events in current window');
  } else {
    for (const [variant, count] of variantMap.entries()) {
      const share = (count / variantTotal) * 100;
      console.log(`- ${variant}: ${count} (${share.toFixed(1)}%)`);
    }
  }

  console.log('\nAlert evaluation:');
  for (const alert of alerts) {
    console.log(`- ${alert.id}: ${alert.triggered ? 'TRIGGERED' : 'ok'} (${alert.note})`);
  }

  const anyTriggered = alerts.some((alert) => alert.triggered);
  if (strictAlerts && anyTriggered) {
    process.exit(1);
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[analytics-plausible-ops] Failed: ${message}`);
  process.exit(1);
});
