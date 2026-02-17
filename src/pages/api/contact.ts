import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

const contactRequestSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
  intent: z.enum(['hiring', 'client']),
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

type ContactResponse = ContactOkResponse | ContactErrorResponse;

type RateBucket = {
  count: number;
  resetAt: number;
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

function getClientIp(req: NextApiRequest) {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (typeof forwardedFor === 'string') {
    const first = forwardedFor.split(',')[0]?.trim();
    if (first) return first;
  }
  if (Array.isArray(forwardedFor) && forwardedFor[0]) return forwardedFor[0];
  return req.socket.remoteAddress ?? 'unknown';
}

function isRateLimited(key: string) {
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

export default async function handler(req: NextApiRequest, res: NextApiResponse<ContactResponse>) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, errorCode: 'method_not_allowed' });
  }

  const clientIp = getClientIp(req);
  if (isRateLimited(clientIp)) {
    return res.status(429).json({ ok: false, errorCode: 'rate_limited' });
  }

  const parsed = contactRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ ok: false, errorCode: 'invalid_payload' });
  }

  const request = parsed.data;
  const requestId = buildRequestId();

  // Honeypot: silently accept bot submissions without processing.
  if (request.website) {
    return res.status(200).json({ ok: true, requestId });
  }

  const isTurnstileValid = await verifyTurnstileToken(request.turnstileToken, clientIp);
  if (!isTurnstileValid) {
    return res.status(403).json({ ok: false, errorCode: 'verification_failed' });
  }

  try {
    await deliverToWebhook(request, requestId);
  } catch (error) {
    console.error('[contact-api] delivery failed', error);
    return res.status(502).json({ ok: false, errorCode: 'delivery_failed' });
  }

  if (!process.env.CONTACT_WEBHOOK_URL) {
    const safeRequest = {
      name: request.name,
      email: request.email,
      intent: request.intent,
      locale: request.locale,
      sourcePath: request.sourcePath
    };
    console.info('[contact-api] submission', {
      requestId,
      name: safeRequest.name,
      email: safeRequest.email,
      intent: safeRequest.intent,
      locale: safeRequest.locale,
      sourcePath: safeRequest.sourcePath
    });
  }

  return res.status(200).json({ ok: true, requestId });
}
