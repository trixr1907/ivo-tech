import { z } from 'zod';

type EventValue = string | number | boolean;

const analyticsRequestSchema = z.object({
  event: z.string().trim().min(1).max(120),
  properties: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).default({}),
  distinctId: z.string().trim().min(1).max(160).optional(),
  url: z.string().trim().url().max(2048).optional(),
  path: z.string().trim().max(512).optional(),
  referrer: z.string().trim().max(2048).optional(),
  locale: z.string().trim().max(16).optional(),
  timestamp: z.string().trim().datetime().optional()
});

type AnalyticsRequest = z.infer<typeof analyticsRequestSchema>;

type AnalyticsSinkProvider = 'none' | 'posthog' | 'plausible';

type AnalyticsOkResponse = {
  ok: true;
  status: 'skipped' | 'accepted';
  provider: AnalyticsSinkProvider;
};

type AnalyticsErrorCode =
  | 'method_not_allowed'
  | 'invalid_payload'
  | 'rate_limited'
  | 'sink_not_configured'
  | 'sink_request_failed';

type AnalyticsErrorResponse = {
  ok: false;
  errorCode: AnalyticsErrorCode;
};

type AnalyticsResponse = AnalyticsOkResponse | AnalyticsErrorResponse;

type AnalyticsRateBucket = {
  count: number;
  resetAt: number;
};

const globalAnalyticsRateStore = globalThis as typeof globalThis & { __ivoAnalyticsRateStore?: Map<string, AnalyticsRateBucket> };
const analyticsRateStore = globalAnalyticsRateStore.__ivoAnalyticsRateStore ?? new Map<string, AnalyticsRateBucket>();
globalAnalyticsRateStore.__ivoAnalyticsRateStore = analyticsRateStore;

const defaultAnalyticsRateLimit = 120;
const defaultAnalyticsRateWindowMs = 60 * 1000;

function jsonResponse(status: number, body: AnalyticsResponse) {
  return Response.json(body, { status });
}

function getAnalyticsRateLimitConfig() {
  const parsedLimit = Number(process.env.ANALYTICS_RATE_LIMIT_PER_IP ?? '');
  const parsedWindowSeconds = Number(process.env.ANALYTICS_RATE_LIMIT_WINDOW_SECONDS ?? '');

  const limit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? Math.floor(parsedLimit) : defaultAnalyticsRateLimit;
  const windowMs =
    Number.isFinite(parsedWindowSeconds) && parsedWindowSeconds > 0
      ? Math.floor(parsedWindowSeconds * 1000)
      : defaultAnalyticsRateWindowMs;

  return { limit, windowMs };
}

function parseSinkProvider(): AnalyticsSinkProvider {
  const provider = (process.env.ANALYTICS_SINK_PROVIDER ?? '').trim().toLowerCase();
  if (provider === 'posthog' || provider === 'plausible') return provider;
  return 'none';
}

function sanitizeProperties(properties: Record<string, EventValue>) {
  return Object.fromEntries(Object.entries(properties).slice(0, 80));
}

function buildEventUrl(request: AnalyticsRequest) {
  if (request.url) return request.url;
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ivo-tech.com').trim() || 'https://ivo-tech.com';
  const normalizedPath = request.path?.startsWith('/') ? request.path : '/';
  try {
    return new URL(normalizedPath, base).toString();
  } catch {
    return 'https://ivo-tech.com/';
  }
}

function extractClientIp(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (!forwardedFor) return '';
  const first = forwardedFor.split(',')[0]?.trim();
  return first ?? '';
}

function isRateLimited(clientIp: string) {
  if (!clientIp) return false;

  const now = Date.now();
  const { limit, windowMs } = getAnalyticsRateLimitConfig();
  const bucket = analyticsRateStore.get(clientIp);

  if (!bucket || now > bucket.resetAt) {
    analyticsRateStore.set(clientIp, { count: 1, resetAt: now + windowMs });
    return false;
  }

  if (bucket.count >= limit) {
    return true;
  }

  bucket.count += 1;
  analyticsRateStore.set(clientIp, bucket);
  return false;
}

async function postToPostHog(payload: AnalyticsRequest, request: Request) {
  const projectKey = (process.env.ANALYTICS_SINK_POSTHOG_PROJECT_KEY ?? '').trim();
  const host = (process.env.ANALYTICS_SINK_POSTHOG_HOST ?? 'https://us.i.posthog.com').trim().replace(/\/+$/, '');
  if (!projectKey) return { ok: false, errorCode: 'sink_not_configured' } as const;

  const eventUrl = buildEventUrl(payload);
  const clientIp = extractClientIp(request);
  const distinctId = payload.distinctId?.trim() || `anon_${Date.now()}`;
  const body = {
    api_key: projectKey,
    event: payload.event,
    distinct_id: distinctId,
    properties: {
      ...sanitizeProperties(payload.properties),
      locale: payload.locale ?? payload.properties.locale,
      $current_url: eventUrl,
      $referrer: payload.referrer ?? '',
      $ip: clientIp || undefined
    },
    timestamp: payload.timestamp
  };

  try {
    const response = await fetch(`${host}/i/v0/e/`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000)
    });
    if (!response.ok) return { ok: false, errorCode: 'sink_request_failed' } as const;
    return { ok: true } as const;
  } catch {
    return { ok: false, errorCode: 'sink_request_failed' } as const;
  }
}

async function postToPlausible(payload: AnalyticsRequest, request: Request) {
  const domain = (process.env.ANALYTICS_SINK_PLAUSIBLE_DOMAIN ?? '').trim();
  const host = (process.env.ANALYTICS_SINK_PLAUSIBLE_HOST ?? 'https://plausible.io').trim().replace(/\/+$/, '');
  if (!domain) return { ok: false, errorCode: 'sink_not_configured' } as const;

  const eventUrl = buildEventUrl(payload);
  const props = Object.fromEntries(
    Object.entries(sanitizeProperties(payload.properties)).map(([key, value]) => [key, String(value)])
  );
  const userAgent = request.headers.get('user-agent') || 'ivo-tech-analytics-relay/1.0';
  const clientIp = extractClientIp(request);

  try {
    const response = await fetch(`${host}/api/event`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'user-agent': userAgent,
        ...(clientIp ? { 'x-forwarded-for': clientIp } : {})
      },
      body: JSON.stringify({
        name: payload.event,
        url: eventUrl,
        domain,
        props
      }),
      signal: AbortSignal.timeout(5000)
    });
    if (!response.ok) return { ok: false, errorCode: 'sink_request_failed' } as const;
    return { ok: true } as const;
  } catch {
    return { ok: false, errorCode: 'sink_request_failed' } as const;
  }
}

export async function handleAnalyticsRequest(request: Request) {
  if (request.method !== 'POST') {
    return jsonResponse(405, { ok: false, errorCode: 'method_not_allowed' });
  }

  if (isRateLimited(extractClientIp(request))) {
    return jsonResponse(429, { ok: false, errorCode: 'rate_limited' });
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return jsonResponse(400, { ok: false, errorCode: 'invalid_payload' });
  }

  const parsed = analyticsRequestSchema.safeParse(rawBody);
  if (!parsed.success) {
    return jsonResponse(400, { ok: false, errorCode: 'invalid_payload' });
  }

  const provider = parseSinkProvider();
  if (provider === 'none') {
    return jsonResponse(202, { ok: true, status: 'skipped', provider: 'none' });
  }

  const payload = parsed.data;
  const result = provider === 'posthog' ? await postToPostHog(payload, request) : await postToPlausible(payload, request);
  if (!result.ok) {
    return jsonResponse(result.errorCode === 'sink_not_configured' ? 503 : 502, {
      ok: false,
      errorCode: result.errorCode
    });
  }

  return jsonResponse(202, { ok: true, status: 'accepted', provider });
}
