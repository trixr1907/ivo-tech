import { z } from 'zod';

const contactRequestSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
  intent: z.enum(['hiring', 'client']),
  intent_detail: z.enum(['hiring', 'project', 'collab']).optional().default('collab'),
  timeline_band: z.enum(['asap', '30d', '90d+']).optional().default('30d'),
  project_scope: z.enum(['audit', 'build', 'optimize', 'unknown']).optional().default('unknown'),
  company: z.string().trim().max(120).optional().default(''),
  message: z.string().trim().min(10).max(2000),
  locale: z.enum(['de', 'en']),
  sourcePath: z
    .string()
    .trim()
    .max(320)
    .refine((value) => value.startsWith('/'), 'sourcePath must be relative'),
  website: z.string().trim().max(200).optional().default(''),
  turnstileToken: z.string().trim().max(4096).optional().default('')
});

type ContactRequest = z.infer<typeof contactRequestSchema>;

type ContactOkResponse = {
  ok: true;
  requestId: string;
};

type ContactErrorCode = 'method_not_allowed' | 'invalid_payload' | 'rate_limited' | 'verification_failed' | 'delivery_failed';

type ContactErrorResponse = {
  ok: false;
  errorCode: ContactErrorCode;
};

export type ContactResponse = ContactOkResponse | ContactErrorResponse;

type RateBucket = {
  count: number;
  resetAt: number;
};

type RedisRestConfig = {
  url: string;
  token: string;
};

const globalRateStore = globalThis as typeof globalThis & { __ivoContactRateStore?: Map<string, RateBucket> };
const rateStore = globalRateStore.__ivoContactRateStore ?? new Map<string, RateBucket>();
globalRateStore.__ivoContactRateStore = rateStore;

const defaultRateLimit = 5;
const defaultRateWindowMs = 10 * 60 * 1000;

function getRateLimitConfig() {
  const parsedLimit = Number(process.env.CONTACT_RATE_LIMIT_PER_IP ?? '');
  const parsedWindowMinutes = Number(process.env.CONTACT_RATE_LIMIT_WINDOW_MINUTES ?? '');

  const limit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? Math.floor(parsedLimit) : defaultRateLimit;
  const windowMs =
    Number.isFinite(parsedWindowMinutes) && parsedWindowMinutes > 0
      ? Math.floor(parsedWindowMinutes * 60 * 1000)
      : defaultRateWindowMs;

  return { limit, windowMs };
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

async function isRateLimited(key: string) {
  const { limit, windowMs } = getRateLimitConfig();

  const persistentCount = await incrementPersistentCounter(`contact:ip:${key}`, windowMs);
  if (typeof persistentCount === 'number') {
    return persistentCount > limit;
  }

  return isRateLimitedInMemory(key);
}

function buildRequestId() {
  return `contact_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

async function verifyTurnstileToken(token: string, clientIp: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) return true;
  if (!token) return false;

  try {
    const form = new URLSearchParams();
    form.set('secret', secret);
    form.set('response', token);
    if (clientIp !== 'unknown') {
      form.set('remoteip', clientIp);
    }

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: form,
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) return false;

    const payload = (await response.json()) as { success?: boolean };
    return payload.success === true;
  } catch {
    return false;
  }
}

async function deliverToWebhook(request: ContactRequest, requestId: string) {
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL?.trim();
  if (!webhookUrl) return;

  const safeRequest = {
    name: request.name,
    email: request.email,
    intent: request.intent,
    intent_detail: request.intent_detail,
    timeline_band: request.timeline_band,
    project_scope: request.project_scope,
    company: request.company,
    message: request.message,
    locale: request.locale,
    sourcePath: request.sourcePath,
    website: request.website
  };

  const payload = {
    requestId,
    createdAt: new Date().toISOString(),
    source: 'ivo-tech.com',
    ...safeRequest
  };

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(5000)
  });

  if (!response.ok) {
    throw new Error(`Webhook rejected with status ${response.status}`);
  }
}

function createJsonResponse(status: number, body: ContactResponse) {
  return Response.json(body, { status });
}

export async function handleContactRequest(request: Request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, errorCode: 'method_not_allowed' satisfies ContactErrorCode }), {
      status: 405,
      headers: {
        'content-type': 'application/json',
        Allow: 'POST'
      }
    });
  }

  const clientIp = getClientIp(request);
  if (await isRateLimited(clientIp)) {
    return createJsonResponse(429, { ok: false, errorCode: 'rate_limited' });
  }

  let parsedBody: unknown;
  try {
    parsedBody = await request.json();
  } catch {
    return createJsonResponse(400, { ok: false, errorCode: 'invalid_payload' });
  }

  const parsed = contactRequestSchema.safeParse(parsedBody);
  if (!parsed.success) {
    return createJsonResponse(400, { ok: false, errorCode: 'invalid_payload' });
  }

  const parsedRequest = parsed.data;
  const requestId = buildRequestId();

  // Honeypot: silently accept bot submissions without processing.
  if (parsedRequest.website) {
    return createJsonResponse(200, { ok: true, requestId });
  }

  const isTurnstileValid = await verifyTurnstileToken(parsedRequest.turnstileToken, clientIp);
  if (!isTurnstileValid) {
    return createJsonResponse(403, { ok: false, errorCode: 'verification_failed' });
  }

  try {
    await deliverToWebhook(parsedRequest, requestId);
  } catch (error) {
    console.error('[contact-api] delivery failed', error);
    return createJsonResponse(502, { ok: false, errorCode: 'delivery_failed' });
  }

  if (!process.env.CONTACT_WEBHOOK_URL) {
    const safeRequest = {
      name: parsedRequest.name,
      email: parsedRequest.email,
      intent: parsedRequest.intent,
      intent_detail: parsedRequest.intent_detail,
      timeline_band: parsedRequest.timeline_band,
      project_scope: parsedRequest.project_scope,
      locale: parsedRequest.locale,
      sourcePath: parsedRequest.sourcePath
    };

    console.info('[contact-api] submission', {
      requestId,
      ...safeRequest
    });
  }

  return createJsonResponse(200, { ok: true, requestId });
}
