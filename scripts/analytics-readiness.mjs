#!/usr/bin/env node

import process from 'node:process';

function isEnabled(raw) {
  const value = (raw ?? '').trim().toLowerCase();
  return value === '1' || value === 'true' || value === 'yes' || value === 'on';
}

function isValidUrl(raw) {
  try {
    const parsed = new URL(raw);
    void parsed;
    return true;
  } catch {
    return false;
  }
}

function parseWeights(raw) {
  const normalized = (raw ?? '').trim();
  if (!normalized) return null;

  const segments = normalized
    .split(',')
    .map((segment) => Number(segment.trim()))
    .filter((value) => Number.isFinite(value) && value >= 0);

  if (segments.length !== 3) return null;
  const total = segments[0] + segments[1] + segments[2];
  if (total <= 0) return null;
  return segments;
}

const args = new Set(process.argv.slice(2));
const strict = args.has('--strict');

const provider = (process.env.ANALYTICS_SINK_PROVIDER ?? '').trim().toLowerCase();
const sinkEnabled = isEnabled(process.env.NEXT_PUBLIC_ANALYTICS_SINK_ENABLED);
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ivo-tech.com';
const weights = parseWeights(process.env.NEXT_PUBLIC_HERO_EXPERIMENT_WEIGHTS ?? '');
const experimentEnabled = isEnabled(process.env.NEXT_PUBLIC_HERO_EXPERIMENT_ENABLED);

const checks = [];

checks.push({
  id: 'site-url',
  ok: isValidUrl(siteUrl),
  info: 'NEXT_PUBLIC_SITE_URL is a valid URL'
});

checks.push({
  id: 'sink-toggle',
  ok: sinkEnabled,
  info: 'NEXT_PUBLIC_ANALYTICS_SINK_ENABLED is enabled'
});

if (provider !== 'posthog' && provider !== 'plausible') {
  checks.push({
    id: 'sink-provider',
    ok: false,
    info: "ANALYTICS_SINK_PROVIDER is set to 'posthog' or 'plausible'"
  });
} else {
  checks.push({
    id: 'sink-provider',
    ok: true,
    info: `ANALYTICS_SINK_PROVIDER=${provider}`
  });
}

if (provider === 'posthog') {
  const posthogHost = process.env.ANALYTICS_SINK_POSTHOG_HOST ?? '';
  const posthogProjectKey = (process.env.ANALYTICS_SINK_POSTHOG_PROJECT_KEY ?? '').trim();
  checks.push({
    id: 'posthog-host',
    ok: isValidUrl(posthogHost),
    info: 'ANALYTICS_SINK_POSTHOG_HOST is a valid URL'
  });
  checks.push({
    id: 'posthog-key',
    ok: posthogProjectKey.length > 0,
    info: 'ANALYTICS_SINK_POSTHOG_PROJECT_KEY is configured'
  });
}

if (provider === 'plausible') {
  const plausibleHost = process.env.ANALYTICS_SINK_PLAUSIBLE_HOST ?? '';
  const plausibleDomain = (process.env.ANALYTICS_SINK_PLAUSIBLE_DOMAIN ?? '').trim();
  checks.push({
    id: 'plausible-host',
    ok: isValidUrl(plausibleHost),
    info: 'ANALYTICS_SINK_PLAUSIBLE_HOST is a valid URL'
  });
  checks.push({
    id: 'plausible-domain',
    ok: plausibleDomain.length > 0,
    info: 'ANALYTICS_SINK_PLAUSIBLE_DOMAIN is configured'
  });
}

checks.push({
  id: 'hero-toggle',
  ok: experimentEnabled,
  info: 'NEXT_PUBLIC_HERO_EXPERIMENT_ENABLED is enabled'
});

checks.push({
  id: 'hero-weights',
  ok: Boolean(weights),
  info: 'NEXT_PUBLIC_HERO_EXPERIMENT_WEIGHTS is valid CSV (default,outcome,speed)'
});

const failing = checks.filter((check) => !check.ok);

console.log('[analytics-readiness]');
for (const check of checks) {
  console.log(`- ${check.ok ? 'PASS' : 'FAIL'} ${check.id}: ${check.info}`);
}
console.log(`\nSummary: ${checks.length - failing.length}/${checks.length} checks passed.`);

if (strict && failing.length > 0) {
  process.exit(1);
}
