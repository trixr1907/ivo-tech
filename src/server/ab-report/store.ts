import { z } from 'zod';

const supportedEventNames = [
  'ab_home_variant_exposure',
  'cta_primary_click',
  'proof_asset_open',
  'contact_form_start',
  'contact_form_submit_success'
] as const;

export const abEventIngestSchema = z.object({
  event: z.enum(supportedEventNames),
  experiment: z.literal('home_cta_proof_v1'),
  variant: z.enum(['a', 'b']),
  locale: z.enum(['de', 'en']).optional(),
  path: z
    .string()
    .trim()
    .max(320)
    .optional()
    .default('/')
    .transform((value) => (value.startsWith('/') ? value : '/')),
  source: z.string().trim().max(120).optional().default('unknown'),
  occurredAt: z.string().datetime().optional()
});

export type AbEventIngest = z.infer<typeof abEventIngestSchema>;
export type AbEventName = AbEventIngest['event'];

export type AbEventCounts = Record<AbEventName, number>;

export type AbVariantSummary = {
  variant: 'a' | 'b';
  totals: AbEventCounts;
  rates: {
    ctaRateFromExposure: number;
    formStartRateFromExposure: number;
    submitRateFromExposure: number;
    submitRateFromFormStart: number;
  };
};

export type AbSourceSummary = {
  source: string;
  totalExposure: number;
  totalSubmitSuccess: number;
  a: AbVariantSummary;
  b: AbVariantSummary;
  deltaSubmitRateBvsA: number;
  decision: AbDecision;
  recommendedAction: string;
};

export type AbDecisionStatus = 'collecting_data' | 'no_significant_winner' | 'promote_a' | 'promote_b';

export type AbDecision = {
  status: AbDecisionStatus;
  reason: string;
  minExposurePerVariant: number;
  minSubmitEventsTotal: number;
  minDeltaPercentagePoints: number;
  exposureA: number;
  exposureB: number;
  submitA: number;
  submitB: number;
  deltaSubmitRateBvsA: number;
  confidence95: boolean;
  confidenceIntervalLow: number;
  confidenceIntervalHigh: number;
};

export type AbNextAction = {
  rank: number;
  source: string;
  decisionStatus: AbDecisionStatus;
  action: string;
  rationale: string;
  expectedAdditionalSubmits30d: number;
  projectedExposure30d: number;
  expectedLiftPer1000Exposure: number;
};

type DecisionConfig = {
  minExposurePerVariant: number;
  minSubmitEventsTotal: number;
  minDeltaPercentagePoints: number;
};

type AbRuntimeEnv = 'development' | 'staging' | 'production';

export type AbReport = {
  experiment: 'home_cta_proof_v1';
  generatedAt: string;
  windowDays: number;
  byDay: Array<{
    date: string;
    a: AbEventCounts;
    b: AbEventCounts;
  }>;
  variants: {
    a: AbVariantSummary;
    b: AbVariantSummary;
  };
  sources: AbSourceSummary[];
  decision: AbDecision;
  nextActions: AbNextAction[];
};

type RedisRestConfig = {
  url: string;
  token: string;
};

type RateBucket = {
  count: number;
  resetAt: number;
};

type DailySourceBucket = {
  a: AbEventCounts;
  b: AbEventCounts;
};

type DailyVariantStore = {
  a: AbEventCounts;
  b: AbEventCounts;
  sources: Record<string, DailySourceBucket>;
};

type AbStoreGlobals = {
  __ivoAbDailyStore?: Map<string, DailyVariantStore>;
  __ivoAbRateStore?: Map<string, RateBucket>;
};

const globalStore = globalThis as typeof globalThis & AbStoreGlobals;
const dailyStore = globalStore.__ivoAbDailyStore ?? new Map<string, DailyVariantStore>();
const rateStore = globalStore.__ivoAbRateStore ?? new Map<string, RateBucket>();
globalStore.__ivoAbDailyStore = dailyStore;
globalStore.__ivoAbRateStore = rateStore;

const abEventNameSet = new Set(supportedEventNames);
const defaultRateLimit = 240;
const defaultRateWindowMs = 10 * 60 * 1000;
const eventRetentionDays = 120;
const ingestFallbackHost = 'ivo-tech.com';
const defaultDecisionConfigByEnv: Record<AbRuntimeEnv, DecisionConfig> = {
  development: { minExposurePerVariant: 40, minSubmitEventsTotal: 4, minDeltaPercentagePoints: 0.75 },
  staging: { minExposurePerVariant: 70, minSubmitEventsTotal: 7, minDeltaPercentagePoints: 0.9 },
  production: { minExposurePerVariant: 120, minSubmitEventsTotal: 12, minDeltaPercentagePoints: 1 }
};
const defaultSourceDecisionConfigByEnv: Record<AbRuntimeEnv, DecisionConfig> = {
  development: { minExposurePerVariant: 15, minSubmitEventsTotal: 2, minDeltaPercentagePoints: 0.5 },
  staging: { minExposurePerVariant: 25, minSubmitEventsTotal: 3, minDeltaPercentagePoints: 0.75 },
  production: { minExposurePerVariant: 40, minSubmitEventsTotal: 5, minDeltaPercentagePoints: 1 }
};
const confidenceZ95 = 1.96;

function zeroCounts(): AbEventCounts {
  return {
    ab_home_variant_exposure: 0,
    cta_primary_click: 0,
    proof_asset_open: 0,
    contact_form_start: 0,
    contact_form_submit_success: 0
  };
}

function cloneCounts(counts: AbEventCounts): AbEventCounts {
  return {
    ab_home_variant_exposure: counts.ab_home_variant_exposure,
    cta_primary_click: counts.cta_primary_click,
    proof_asset_open: counts.proof_asset_open,
    contact_form_start: counts.contact_form_start,
    contact_form_submit_success: counts.contact_form_submit_success
  };
}

function createDailyStore(): DailyVariantStore {
  return { a: zeroCounts(), b: zeroCounts(), sources: {} };
}

function normalizeSourceLabel(value: string) {
  const normalized = value.trim().replace(/\s+/g, ' ').slice(0, 80);
  return normalized || 'unknown';
}

function encodeSourceKey(value: string) {
  return Buffer.from(normalizeSourceLabel(value).toLowerCase(), 'utf8').toString('base64url');
}

function decodeSourceKey(value: string) {
  try {
    const decoded = Buffer.from(value, 'base64url').toString('utf8');
    return normalizeSourceLabel(decoded);
  } catch {
    return 'unknown';
  }
}

function isAbEventName(value: string): value is AbEventName {
  return abEventNameSet.has(value as AbEventName);
}

function toPercent(numerator: number, denominator: number) {
  if (denominator <= 0) return 0;
  return Number(((numerator / denominator) * 100).toFixed(2));
}

function summarizeVariant(variant: 'a' | 'b', totals: AbEventCounts): AbVariantSummary {
  const exposure = totals.ab_home_variant_exposure;
  const cta = totals.cta_primary_click;
  const formStart = totals.contact_form_start;
  const submitSuccess = totals.contact_form_submit_success;

  return {
    variant,
    totals,
    rates: {
      ctaRateFromExposure: toPercent(cta, exposure),
      formStartRateFromExposure: toPercent(formStart, exposure),
      submitRateFromExposure: toPercent(submitSuccess, exposure),
      submitRateFromFormStart: toPercent(submitSuccess, formStart)
    }
  };
}

function sumCounts(target: AbEventCounts, source: AbEventCounts) {
  for (const event of supportedEventNames) {
    target[event] += source[event];
  }
}

function mergeSourceBucket(target: DailySourceBucket, source: DailySourceBucket) {
  sumCounts(target.a, source.a);
  sumCounts(target.b, source.b);
}

function getRateLimitConfig() {
  const parsedLimit = Number(process.env.AB_EVENT_RATE_LIMIT_PER_IP ?? '');
  const parsedWindowMinutes = Number(process.env.AB_EVENT_RATE_LIMIT_WINDOW_MINUTES ?? '');

  const limit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? Math.floor(parsedLimit) : defaultRateLimit;
  const windowMs =
    Number.isFinite(parsedWindowMinutes) && parsedWindowMinutes > 0
      ? Math.floor(parsedWindowMinutes * 60 * 1000)
      : defaultRateWindowMs;

  return { limit, windowMs };
}

function readPositiveNumberEnv(rawValue: string | undefined, fallback: number) {
  const parsed = Number(rawValue ?? '');
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return parsed;
}

function getAbRuntimeEnv(): AbRuntimeEnv {
  const raw = (process.env.NEXT_PUBLIC_APP_ENV ?? '').trim().toLowerCase();
  if (raw === 'production') return 'production';
  if (raw === 'staging') return 'staging';
  return 'development';
}

function getDecisionConfig(): DecisionConfig {
  const defaults = defaultDecisionConfigByEnv[getAbRuntimeEnv()];
  const minExposurePerVariant = Math.floor(
    readPositiveNumberEnv(process.env.AB_REPORT_MIN_EXPOSURE_PER_VARIANT, defaults.minExposurePerVariant)
  );
  const minSubmitEventsTotal = Math.floor(
    readPositiveNumberEnv(process.env.AB_REPORT_MIN_SUBMIT_EVENTS_TOTAL, defaults.minSubmitEventsTotal)
  );
  const minDeltaPercentagePoints = readPositiveNumberEnv(
    process.env.AB_REPORT_MIN_DELTA_PERCENTAGE_POINTS,
    defaults.minDeltaPercentagePoints
  );

  return {
    minExposurePerVariant,
    minSubmitEventsTotal,
    minDeltaPercentagePoints
  };
}

function getSourceDecisionConfig(): DecisionConfig {
  const defaults = defaultSourceDecisionConfigByEnv[getAbRuntimeEnv()];
  const minExposurePerVariant = Math.floor(
    readPositiveNumberEnv(process.env.AB_REPORT_SOURCE_MIN_EXPOSURE_PER_VARIANT, defaults.minExposurePerVariant)
  );
  const minSubmitEventsTotal = Math.floor(
    readPositiveNumberEnv(process.env.AB_REPORT_SOURCE_MIN_SUBMIT_EVENTS_TOTAL, defaults.minSubmitEventsTotal)
  );
  const minDeltaPercentagePoints = readPositiveNumberEnv(
    process.env.AB_REPORT_SOURCE_MIN_DELTA_PERCENTAGE_POINTS,
    defaults.minDeltaPercentagePoints
  );

  return {
    minExposurePerVariant,
    minSubmitEventsTotal,
    minDeltaPercentagePoints
  };
}

function computeDiffConfidenceInterval95({
  submitA,
  exposureA,
  submitB,
  exposureB
}: {
  submitA: number;
  exposureA: number;
  submitB: number;
  exposureB: number;
}) {
  if (exposureA <= 0 || exposureB <= 0) {
    return {
      deltaPercentagePoints: 0,
      lowPercentagePoints: 0,
      highPercentagePoints: 0,
      confidence95: false
    };
  }

  const rateA = submitA / exposureA;
  const rateB = submitB / exposureB;
  const diff = rateB - rateA;
  const variance = (rateA * (1 - rateA)) / exposureA + (rateB * (1 - rateB)) / exposureB;
  const standardError = Math.sqrt(Math.max(variance, 0));
  const margin = confidenceZ95 * standardError;
  const low = diff - margin;
  const high = diff + margin;
  const confidence95 = low > 0 || high < 0;

  return {
    deltaPercentagePoints: Number((diff * 100).toFixed(2)),
    lowPercentagePoints: Number((low * 100).toFixed(2)),
    highPercentagePoints: Number((high * 100).toFixed(2)),
    confidence95
  };
}

function evaluateDecision(a: AbVariantSummary, b: AbVariantSummary, config: DecisionConfig): AbDecision {
  const exposureA = a.totals.ab_home_variant_exposure;
  const exposureB = b.totals.ab_home_variant_exposure;
  const submitA = a.totals.contact_form_submit_success;
  const submitB = b.totals.contact_form_submit_success;
  const submitTotal = submitA + submitB;
  const confidence = computeDiffConfidenceInterval95({
    submitA,
    exposureA,
    submitB,
    exposureB
  });

  const base = {
    minExposurePerVariant: config.minExposurePerVariant,
    minSubmitEventsTotal: config.minSubmitEventsTotal,
    minDeltaPercentagePoints: config.minDeltaPercentagePoints,
    exposureA,
    exposureB,
    submitA,
    submitB,
    deltaSubmitRateBvsA: confidence.deltaPercentagePoints,
    confidence95: confidence.confidence95,
    confidenceIntervalLow: confidence.lowPercentagePoints,
    confidenceIntervalHigh: confidence.highPercentagePoints
  };

  if (exposureA < config.minExposurePerVariant || exposureB < config.minExposurePerVariant) {
    return {
      ...base,
      status: 'collecting_data',
      reason: `Mindestens ${config.minExposurePerVariant} Exposures pro Variante erforderlich.`
    };
  }

  if (submitTotal < config.minSubmitEventsTotal) {
    return {
      ...base,
      status: 'collecting_data',
      reason: `Mindestens ${config.minSubmitEventsTotal} Submit-Events gesamt erforderlich.`
    };
  }

  if (!confidence.confidence95) {
    return {
      ...base,
      status: 'no_significant_winner',
      reason: '95%-Konfidenzintervall schliesst 0 noch ein.'
    };
  }

  if (Math.abs(confidence.deltaPercentagePoints) < config.minDeltaPercentagePoints) {
    return {
      ...base,
      status: 'no_significant_winner',
      reason: `Delta liegt unter dem Business-Schwellenwert von ${config.minDeltaPercentagePoints.toFixed(2)} Prozentpunkten.`
    };
  }

  if (confidence.deltaPercentagePoints > 0) {
    return {
      ...base,
      status: 'promote_b',
      reason: 'Variante B ist signifikant und business-relevant besser.'
    };
  }

  return {
    ...base,
    status: 'promote_a',
    reason: 'Variante A ist signifikant und business-relevant besser.'
  };
}

function recommendSourceAction(source: string, decision: AbDecision) {
  if (decision.status === 'promote_b') {
    return `Source "${source}": CTA-Variante B als Standard ausspielen und nach 7 Tagen erneut pruefen.`;
  }

  if (decision.status === 'promote_a') {
    return `Source "${source}": CTA-Variante A als Standard halten und B in diesem Kanal pausieren.`;
  }

  if (decision.status === 'no_significant_winner') {
    return `Source "${source}": Keine Umstellung; weitere Daten sammeln oder den Test im Kanal schaerfen.`;
  }

  return `Source "${source}": Noch zu wenig Daten; Traffic im Kanal gezielt aufbauen.`;
}

function getSourceWinnerRate(summary: AbSourceSummary) {
  if (summary.decision.status === 'promote_b') return summary.b.rates.submitRateFromExposure / 100;
  if (summary.decision.status === 'promote_a') return summary.a.rates.submitRateFromExposure / 100;
  return null;
}

function estimateSourceUplift(summary: AbSourceSummary, windowDays: number) {
  const totalExposure = summary.totalExposure;
  if (totalExposure <= 0 || windowDays <= 0) {
    return {
      projectedExposure30d: 0,
      expectedAdditionalSubmits30d: 0,
      expectedLiftPer1000Exposure: 0
    };
  }

  const winnerRate = getSourceWinnerRate(summary);
  const blendedRate = summary.totalSubmitSuccess / totalExposure;
  const projectedExposure30d = (totalExposure / windowDays) * 30;
  const rateDelta = winnerRate === null ? 0 : Math.max(0, winnerRate - blendedRate);
  const expectedAdditionalSubmits30d = projectedExposure30d * rateDelta;
  const expectedLiftPer1000Exposure = rateDelta * 1000;

  return {
    projectedExposure30d: Number(projectedExposure30d.toFixed(2)),
    expectedAdditionalSubmits30d: Number(expectedAdditionalSubmits30d.toFixed(2)),
    expectedLiftPer1000Exposure: Number(expectedLiftPer1000Exposure.toFixed(2))
  };
}

function buildNextActions(sources: AbSourceSummary[], windowDays: number): AbNextAction[] {
  const enriched = sources.map((source) => {
    const uplift = estimateSourceUplift(source, windowDays);
    return {
      source: source.source,
      decisionStatus: source.decision.status,
      action: source.recommendedAction,
      rationale: source.decision.reason,
      expectedAdditionalSubmits30d: uplift.expectedAdditionalSubmits30d,
      projectedExposure30d: uplift.projectedExposure30d,
      expectedLiftPer1000Exposure: uplift.expectedLiftPer1000Exposure
    };
  });

  const positive = enriched
    .filter((item) => item.expectedAdditionalSubmits30d > 0)
    .sort((left, right) => {
      if (right.expectedAdditionalSubmits30d !== left.expectedAdditionalSubmits30d) {
        return right.expectedAdditionalSubmits30d - left.expectedAdditionalSubmits30d;
      }
      if (right.projectedExposure30d !== left.projectedExposure30d) {
        return right.projectedExposure30d - left.projectedExposure30d;
      }
      return left.source.localeCompare(right.source, 'de');
    });

  const fallback = enriched
    .filter((item) => item.expectedAdditionalSubmits30d <= 0)
    .sort((left, right) => {
      if (right.projectedExposure30d !== left.projectedExposure30d) {
        return right.projectedExposure30d - left.projectedExposure30d;
      }
      return left.source.localeCompare(right.source, 'de');
    });

  return [...positive, ...fallback].slice(0, 3).map((item, index) => ({
    rank: index + 1,
    ...item
  }));
}

function normalizeHost(value: string) {
  return value.trim().toLowerCase().replace(/\.$/, '');
}

function parseHost(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;

  try {
    const normalizedInput = trimmed.includes('://') ? trimmed : `https://${trimmed}`;
    return normalizeHost(new URL(normalizedInput).hostname);
  } catch {
    return null;
  }
}

function buildAllowedIngestHosts() {
  const configuredSiteHost = parseHost(process.env.NEXT_PUBLIC_SITE_URL ?? '') ?? ingestFallbackHost;
  const apexHost = configuredSiteHost.replace(/^www\./, '');
  const allowedHosts = new Set([configuredSiteHost, apexHost, `www.${apexHost}`]);
  const additionalHosts = `${process.env.NEXT_PUBLIC_ANALYTICS_ALLOWED_HOSTS ?? ''},${process.env.AB_EVENT_ALLOWED_HOSTS ?? ''}`
    .split(',')
    .map((entry) => parseHost(entry))
    .filter((host): host is string => Boolean(host));

  for (const host of additionalHosts) {
    allowedHosts.add(host);
  }

  return allowedHosts;
}

const allowedIngestHosts = buildAllowedIngestHosts();

function isOriginAllowed(request: Request) {
  const origin = request.headers.get('origin')?.trim();
  if (!origin) return true;

  const host = parseHost(origin);
  if (!host) return false;
  return allowedIngestHosts.has(host);
}

function getRedisRestConfig(): RedisRestConfig | null {
  const url = (process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL ?? '').trim();
  const token = (process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN ?? '').trim();
  if (!url || !token) return null;

  return {
    url: url.replace(/\/$/, ''),
    token
  };
}

function extractPipelineEntry(payload: unknown, index: number): unknown {
  if (Array.isArray(payload)) {
    return payload[index];
  }

  if (payload && typeof payload === 'object' && Array.isArray((payload as { result?: unknown[] }).result)) {
    return (payload as { result: unknown[] }).result[index];
  }

  return null;
}

function coerceHashResult(value: unknown): Record<string, number> {
  if (!value) return {};

  if (Array.isArray(value)) {
    const output: Record<string, number> = {};
    for (let i = 0; i < value.length; i += 2) {
      const key = value[i];
      const raw = value[i + 1];
      if (typeof key !== 'string') continue;
      const parsed = Number(raw);
      if (!Number.isFinite(parsed)) continue;
      output[key] = parsed;
    }
    return output;
  }

  if (typeof value === 'object') {
    const maybeResult = (value as { result?: unknown }).result;
    if (Array.isArray(maybeResult)) {
      return coerceHashResult(maybeResult);
    }

    const output: Record<string, number> = {};
    for (const [field, raw] of Object.entries(value as Record<string, unknown>)) {
      const parsed = Number(raw);
      if (!Number.isFinite(parsed)) continue;
      output[field] = parsed;
    }
    return output;
  }

  return {};
}

function getTodayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function parseIsoDate(value: string | undefined) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

function buildDailyRedisKey(date: string) {
  return `ab:home_cta_proof_v1:day:${date}`;
}

function buildSourceFieldKey(source: string, variant: 'a' | 'b', event: AbEventName) {
  return `source:${encodeSourceKey(source)}:${variant}:${event}`;
}

function buildRateRedisKey(ip: string) {
  return `ab:rate:ip:${ip}`;
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const first = forwardedFor.split(',')[0]?.trim();
    if (first) return first;
  }

  const realIp = request.headers.get('x-real-ip')?.trim();
  if (realIp) return realIp;

  return 'unknown';
}

function getDatesWindow(days: number) {
  const output: string[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date(now);
    date.setUTCDate(now.getUTCDate() - i);
    output.push(date.toISOString().slice(0, 10));
  }
  return output;
}

async function incrementPersistentCounter(key: string, windowMs: number): Promise<number | null> {
  const redis = getRedisRestConfig();
  if (!redis) return null;

  try {
    const response = await fetch(`${redis.url}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${redis.token}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify([
        ['INCR', key],
        ['PEXPIRE', key, String(windowMs), 'NX']
      ]),
      signal: AbortSignal.timeout(3500)
    });

    if (!response.ok) return null;

    const payload = (await response.json()) as unknown;
    const first = extractPipelineEntry(payload, 0);

    if (typeof first === 'number') return first;
    if (first && typeof first === 'object' && 'result' in first) {
      const value = (first as { result?: unknown }).result;
      const count = Number(value);
      return Number.isFinite(count) ? count : null;
    }

    return null;
  } catch {
    return null;
  }
}

function isRateLimitedInMemory(key: string) {
  const now = Date.now();
  const { limit, windowMs } = getRateLimitConfig();
  const bucket = rateStore.get(key);

  if (!bucket || now > bucket.resetAt) {
    rateStore.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  if (bucket.count >= limit) return true;

  bucket.count += 1;
  rateStore.set(key, bucket);
  return false;
}

async function isRateLimited(ip: string) {
  const { limit, windowMs } = getRateLimitConfig();
  const persistentCount = await incrementPersistentCounter(buildRateRedisKey(ip), windowMs);
  if (typeof persistentCount === 'number') {
    return persistentCount > limit;
  }

  return isRateLimitedInMemory(ip);
}

async function recordEventInRedis(payload: AbEventIngest) {
  const redis = getRedisRestConfig();
  if (!redis) return false;

  const date = parseIsoDate(payload.occurredAt) ?? getTodayIsoDate();
  const key = buildDailyRedisKey(date);
  const field = `${payload.variant}:${payload.event}`;
  const sourceField = buildSourceFieldKey(payload.source, payload.variant, payload.event);
  const ttlSeconds = eventRetentionDays * 24 * 60 * 60;

  try {
    const response = await fetch(`${redis.url}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${redis.token}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify([
        ['HINCRBY', key, field, '1'],
        ['HINCRBY', key, sourceField, '1'],
        ['EXPIRE', key, String(ttlSeconds), 'NX']
      ]),
      signal: AbortSignal.timeout(3500)
    });

    return response.ok;
  } catch {
    return false;
  }
}

function recordEventInMemory(payload: AbEventIngest) {
  const date = parseIsoDate(payload.occurredAt) ?? getTodayIsoDate();
  const existingDay = dailyStore.get(date);
  const day = existingDay ?? createDailyStore();
  day[payload.variant][payload.event] += 1;
  const sourceKey = encodeSourceKey(payload.source);
  const sourceBucket = day.sources[sourceKey] ?? { a: zeroCounts(), b: zeroCounts() };
  sourceBucket[payload.variant][payload.event] += 1;
  day.sources[sourceKey] = sourceBucket;
  dailyStore.set(date, day);
}

async function recordEvent(payload: AbEventIngest) {
  const persisted = await recordEventInRedis(payload);
  if (persisted) return;
  recordEventInMemory(payload);
}

function mapHashToCounts(hash: Record<string, number>, variant: 'a' | 'b'): AbEventCounts {
  const counts = zeroCounts();
  for (const event of supportedEventNames) {
    counts[event] = hash[`${variant}:${event}`] ?? 0;
  }
  return counts;
}

function mapHashToSourceBuckets(hash: Record<string, number>) {
  const buckets = new Map<string, DailySourceBucket>();

  for (const [field, rawCount] of Object.entries(hash)) {
    if (!field.startsWith('source:')) continue;
    if (!Number.isFinite(rawCount) || rawCount <= 0) continue;

    const [, encodedSource = '', variant = '', event = ''] = field.split(':');
    if ((variant !== 'a' && variant !== 'b') || !isAbEventName(event)) continue;

    const source = decodeSourceKey(encodedSource);
    const bucket = buckets.get(source) ?? { a: zeroCounts(), b: zeroCounts() };
    bucket[variant][event] += rawCount;
    buckets.set(source, bucket);
  }

  return buckets;
}

async function loadDailyHashesFromRedis(dates: string[]): Promise<Record<string, Record<string, number>> | null> {
  const redis = getRedisRestConfig();
  if (!redis) return null;

  try {
    const commands = dates.map((date) => ['HGETALL', buildDailyRedisKey(date)]);
    const response = await fetch(`${redis.url}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${redis.token}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify(commands),
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) return null;

    const payload = (await response.json()) as unknown;
    const map: Record<string, Record<string, number>> = {};

    dates.forEach((date, index) => {
      const entry = extractPipelineEntry(payload, index);
      map[date] = coerceHashResult(entry);
    });

    return map;
  } catch {
    return null;
  }
}

function loadDailyHashesFromMemory(dates: string[]) {
  const map: Record<string, Record<string, number>> = {};
  for (const date of dates) {
    const day = dailyStore.get(date);
    if (!day) {
      map[date] = {};
      continue;
    }

    const row: Record<string, number> = {};
    for (const variant of ['a', 'b'] as const) {
      for (const event of supportedEventNames) {
        row[`${variant}:${event}`] = day[variant][event];
      }
    }

    for (const [sourceKey, bucket] of Object.entries(day.sources ?? {})) {
      for (const variant of ['a', 'b'] as const) {
        for (const event of supportedEventNames) {
          row[`source:${sourceKey}:${variant}:${event}`] = bucket[variant][event];
        }
      }
    }
    map[date] = row;
  }

  return map;
}

export async function ingestAbEvent(request: Request) {
  if (request.method !== 'POST') {
    return Response.json({ ok: false, errorCode: 'method_not_allowed' as const }, { status: 405, headers: { Allow: 'POST' } });
  }

  if (!isOriginAllowed(request)) {
    return Response.json({ ok: false, errorCode: 'forbidden_origin' as const }, { status: 403 });
  }

  const clientIp = getClientIp(request);
  if (await isRateLimited(clientIp)) {
    return Response.json({ ok: false, errorCode: 'rate_limited' as const }, { status: 429 });
  }

  let parsedBody: unknown;
  try {
    parsedBody = await request.json();
  } catch {
    return Response.json({ ok: false, errorCode: 'invalid_payload' as const }, { status: 400 });
  }

  const parsed = abEventIngestSchema.safeParse(parsedBody);
  if (!parsed.success) {
    return Response.json({ ok: false, errorCode: 'invalid_payload' as const }, { status: 400 });
  }

  if (!abEventNameSet.has(parsed.data.event)) {
    return Response.json({ ok: false, errorCode: 'unsupported_event' as const }, { status: 400 });
  }

  await recordEvent(parsed.data);
  return Response.json({ ok: true }, { status: 202 });
}

export async function getAbReport(windowDays: number): Promise<AbReport> {
  const days = Number.isFinite(windowDays) ? Math.min(Math.max(Math.floor(windowDays), 1), 60) : 14;
  const dates = getDatesWindow(days);
  const decisionConfig = getDecisionConfig();
  const sourceDecisionConfig = getSourceDecisionConfig();

  const hashByDay = (await loadDailyHashesFromRedis(dates)) ?? loadDailyHashesFromMemory(dates);

  const totalsA = zeroCounts();
  const totalsB = zeroCounts();
  const totalsBySource = new Map<string, DailySourceBucket>();

  const byDay = dates.map((date) => {
    const hash = hashByDay[date] ?? {};
    const a = mapHashToCounts(hash, 'a');
    const b = mapHashToCounts(hash, 'b');
    sumCounts(totalsA, a);
    sumCounts(totalsB, b);

    const sourceBuckets = mapHashToSourceBuckets(hash);
    for (const [source, bucket] of sourceBuckets.entries()) {
      const target = totalsBySource.get(source) ?? { a: zeroCounts(), b: zeroCounts() };
      mergeSourceBucket(target, bucket);
      totalsBySource.set(source, target);
    }

    return {
      date,
      a,
      b
    };
  });

  const sources = Array.from(totalsBySource.entries())
    .map(([source, bucket]) => {
      const aSummary = summarizeVariant('a', cloneCounts(bucket.a));
      const bSummary = summarizeVariant('b', cloneCounts(bucket.b));
      const totalExposure = aSummary.totals.ab_home_variant_exposure + bSummary.totals.ab_home_variant_exposure;
      const totalSubmitSuccess = aSummary.totals.contact_form_submit_success + bSummary.totals.contact_form_submit_success;
      const sourceDecision = evaluateDecision(aSummary, bSummary, sourceDecisionConfig);
      return {
        source,
        totalExposure,
        totalSubmitSuccess,
        a: aSummary,
        b: bSummary,
        deltaSubmitRateBvsA: Number((bSummary.rates.submitRateFromExposure - aSummary.rates.submitRateFromExposure).toFixed(2)),
        decision: sourceDecision,
        recommendedAction: recommendSourceAction(source, sourceDecision)
      };
    })
    .filter((row) => row.totalExposure > 0 || row.totalSubmitSuccess > 0)
    .sort((left, right) => {
      if (right.totalExposure !== left.totalExposure) return right.totalExposure - left.totalExposure;
      if (right.totalSubmitSuccess !== left.totalSubmitSuccess) return right.totalSubmitSuccess - left.totalSubmitSuccess;
      return left.source.localeCompare(right.source, 'de');
    });

  const variantA = summarizeVariant('a', totalsA);
  const variantB = summarizeVariant('b', totalsB);
  const decision = evaluateDecision(variantA, variantB, decisionConfig);
  const nextActions = buildNextActions(sources, days);

  return {
    experiment: 'home_cta_proof_v1',
    generatedAt: new Date().toISOString(),
    windowDays: days,
    byDay,
    variants: {
      a: variantA,
      b: variantB
    },
    sources,
    decision,
    nextActions
  };
}
