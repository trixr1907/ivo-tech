import { z } from 'zod';

const contactRequestSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
  intent: z.enum(['hiring', 'client']),
  intent_detail: z.enum(['hiring', 'project', 'collab']).optional().default('collab'),
  timeline_band: z.enum(['asap', '30d', '90d+']).optional().default('30d'),
  project_scope: z.enum(['audit', 'build', 'optimize', 'unknown']).optional().default('unknown'),
  company: z.string().trim().max(120).optional().default(''),
  portfolio_reference: z.string().trim().max(280).optional().default(''),
  message: z.string().trim().min(10).max(2000),
  gdpr_consent: z.literal(true),
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

const defaultContactRecipients = ['contact@ivo-tech.com', 'ivo@ivo-tech.com'];

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

function buildSafeRequest(request: ContactRequest) {
  return {
    name: request.name,
    email: request.email,
    intent: request.intent,
    intent_detail: request.intent_detail,
    timeline_band: request.timeline_band,
    project_scope: request.project_scope,
    company: request.company,
    portfolio_reference: request.portfolio_reference,
    message: request.message,
    gdpr_consent: request.gdpr_consent,
    locale: request.locale,
    sourcePath: request.sourcePath,
    website: request.website
  };
}

function parseCsvList(value: string | undefined) {
  return (value ?? '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function getContactRecipients() {
  const configuredRecipients = parseCsvList(process.env.CONTACT_TO_EMAILS);
  if (configuredRecipients.length > 0) return configuredRecipients;
  return defaultContactRecipients;
}

function getContactFromAddress() {
  return process.env.CONTACT_FROM_EMAIL?.trim() ?? defaultContactRecipients[0];
}

function hasConfiguredDeliveryTarget() {
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL?.trim();
  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  return Boolean(webhookUrl || resendApiKey);
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
  if (!webhookUrl) return false;

  const safeRequest = buildSafeRequest(request);

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

  return true;
}

async function deliverToEmail(request: ContactRequest, requestId: string) {
  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  if (!resendApiKey) return false;

  const recipients = getContactRecipients();
  const fromAddress = getContactFromAddress();

  if (!fromAddress || recipients.length === 0) {
    throw new Error('Resend delivery misconfigured: CONTACT_FROM_EMAIL/CONTACT_TO_EMAILS');
  }

  const safeRequest = buildSafeRequest(request);
  const localeLabel = safeRequest.locale.toUpperCase();
  const intentLabel = safeRequest.intent === 'hiring' ? 'Hiring' : 'Client';
  const subject = `[ivo-tech.com] ${intentLabel} Anfrage (${localeLabel}) - ${safeRequest.name}`;
  const text = [
    `Request ID: ${requestId}`,
    `Created At: ${new Date().toISOString()}`,
    `Source: ivo-tech.com`,
    '',
    `Name: ${safeRequest.name}`,
    `Email: ${safeRequest.email}`,
    `Intent: ${safeRequest.intent}`,
    `Intent Detail: ${safeRequest.intent_detail}`,
    `Timeline Band: ${safeRequest.timeline_band}`,
    `Project Scope: ${safeRequest.project_scope}`,
    `Company: ${safeRequest.company || '-'}`,
    `Portfolio Reference: ${safeRequest.portfolio_reference || '-'}`,
    `GDPR Consent: ${safeRequest.gdpr_consent ? 'true' : 'false'}`,
    `Locale: ${safeRequest.locale}`,
    `Source Path: ${safeRequest.sourcePath}`,
    '',
    'Message:',
    safeRequest.message
  ].join('\n');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      from: fromAddress,
      to: recipients,
      reply_to: safeRequest.email,
      subject,
      text
    }),
    signal: AbortSignal.timeout(5000)
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Resend rejected with status ${response.status}${errorText ? `: ${errorText.slice(0, 180)}` : ''}`);
  }

  return true;
}

function normalizeError(error: unknown) {
  if (error instanceof Error) return error;
  return new Error(String(error));
}

async function deliverSubmission(request: ContactRequest, requestId: string) {
  const errors: Error[] = [];
  let delivered = false;

  try {
    delivered = (await deliverToEmail(request, requestId)) || delivered;
  } catch (error) {
    errors.push(normalizeError(error));
  }

  try {
    delivered = (await deliverToWebhook(request, requestId)) || delivered;
  } catch (error) {
    errors.push(normalizeError(error));
  }

  if (delivered) return;
  if (errors.length > 0) {
    throw errors[0];
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

  if (process.env.NODE_ENV === 'production' && !hasConfiguredDeliveryTarget()) {
    console.error('[contact-api] delivery failed: CONTACT_WEBHOOK_URL or RESEND_API_KEY must be configured in production');
    return createJsonResponse(503, { ok: false, errorCode: 'delivery_failed' });
  }

  const isTurnstileValid = await verifyTurnstileToken(parsedRequest.turnstileToken, clientIp);
  if (!isTurnstileValid) {
    return createJsonResponse(403, { ok: false, errorCode: 'verification_failed' });
  }

  try {
    await deliverSubmission(parsedRequest, requestId);
  } catch (error) {
    console.error('[contact-api] delivery failed', error);
    return createJsonResponse(502, { ok: false, errorCode: 'delivery_failed' });
  }

  if (process.env.NODE_ENV !== 'production' && !hasConfiguredDeliveryTarget()) {
    const safeRequest = buildSafeRequest(parsedRequest);

    console.info('[contact-api] submission', {
      requestId,
      name: safeRequest.name,
      email: safeRequest.email,
      intent: safeRequest.intent,
      intent_detail: safeRequest.intent_detail,
      timeline_band: safeRequest.timeline_band,
      project_scope: safeRequest.project_scope,
      gdpr_consent: safeRequest.gdpr_consent,
      locale: safeRequest.locale,
      sourcePath: safeRequest.sourcePath
    });
  }

  return createJsonResponse(200, { ok: true, requestId });
}
