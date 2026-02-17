/* @vitest-environment node */

import type { NextApiRequest, NextApiResponse } from 'next';
import { afterEach, describe, expect, it, vi } from 'vitest';

import handler from '@/pages/api/contact';

type ContactResponse =
  | { ok: true; requestId: string }
  | { ok: false; errorCode: 'method_not_allowed' | 'invalid_payload' | 'rate_limited' | 'verification_failed' | 'delivery_failed' };

type MockResponse = {
  body?: ContactResponse;
  statusCode: number;
  headers: Record<string, string | string[]>;
  setHeader: (key: string, value: string | string[]) => MockResponse;
  status: (code: number) => MockResponse;
  json: (payload: ContactResponse) => MockResponse;
};

const scopedEnvKeys = [
  'CONTACT_WEBHOOK_URL',
  'CONTACT_RATE_LIMIT_PER_IP',
  'CONTACT_RATE_LIMIT_WINDOW_MINUTES',
  'TURNSTILE_SECRET_KEY'
] as const;

const initialEnv = Object.fromEntries(scopedEnvKeys.map((key) => [key, process.env[key]])) as Record<string, string | undefined>;

function resetScopedEnv() {
  for (const key of scopedEnvKeys) {
    const initial = initialEnv[key];
    if (initial === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = initial;
    }
  }
}

function clearRateStore() {
  const store = (
    globalThis as typeof globalThis & { __ivoContactRateStore?: Map<string, { count: number; resetAt: number }> }
  ).__ivoContactRateStore;
  store?.clear();
}

function createPayload(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    name: 'Test User',
    email: 'test@example.com',
    intent: 'hiring',
    company: 'Acme GmbH',
    message: 'Ich moechte ein kurzes Hiring-Gespraech zum Team-Setup abstimmen.',
    locale: 'de',
    sourcePath: '/#contact',
    website: '',
    turnstileToken: '',
    ...overrides
  };
}

function createReq(input: {
  method?: string;
  body?: Record<string, unknown>;
  ip?: string;
  headers?: Record<string, string | string[]>;
} = {}): NextApiRequest {
  const { method = 'POST', body = createPayload(), ip = '127.0.0.1', headers = {} } = input;

  return {
    method,
    body,
    headers,
    socket: { remoteAddress: ip }
  } as unknown as NextApiRequest;
}

function createRes(): MockResponse {
  const res = {
    statusCode: 200,
    body: undefined as ContactResponse | undefined,
    headers: {} as Record<string, string | string[]>,
    setHeader(key: string, value: string | string[]) {
      this.headers[key] = value;
      return this;
    },
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: ContactResponse) {
      this.body = payload;
      return this;
    }
  };

  return res as MockResponse;
}

describe('/api/contact', () => {
  afterEach(() => {
    clearRateStore();
    resetScopedEnv();
    vi.restoreAllMocks();
  });

  it('rejects non-POST methods', async () => {
    const req = createReq({ method: 'GET' });
    const res = createRes();

    await handler(req, res as unknown as NextApiResponse<ContactResponse>);

    expect(res.statusCode).toBe(405);
    expect(res.headers.Allow).toBe('POST');
    expect(res.body).toEqual({ ok: false, errorCode: 'method_not_allowed' });
  });

  it('rejects invalid payloads', async () => {
    const req = createReq({
      body: {
        name: 'x',
        email: 'invalid',
        sourcePath: 'contact'
      }
    });
    const res = createRes();

    await handler(req, res as unknown as NextApiResponse<ContactResponse>);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ ok: false, errorCode: 'invalid_payload' });
  });

  it('silently accepts honeypot submissions', async () => {
    const req = createReq({
      body: createPayload({ website: 'https://spam.invalid' })
    });
    const res = createRes();

    await handler(req, res as unknown as NextApiResponse<ContactResponse>);

    expect(res.statusCode).toBe(200);
    expect(res.body?.ok).toBe(true);
  });

  it('applies per-IP rate limiting', async () => {
    process.env.CONTACT_RATE_LIMIT_PER_IP = '1';
    vi.spyOn(console, 'info').mockImplementation(() => undefined);

    const req1 = createReq({ ip: '10.10.10.10' });
    const res1 = createRes();
    await handler(req1, res1 as unknown as NextApiResponse<ContactResponse>);

    const req2 = createReq({ ip: '10.10.10.10' });
    const res2 = createRes();
    await handler(req2, res2 as unknown as NextApiResponse<ContactResponse>);

    expect(res1.statusCode).toBe(200);
    expect(res1.body?.ok).toBe(true);
    expect(res2.statusCode).toBe(429);
    expect(res2.body).toEqual({ ok: false, errorCode: 'rate_limited' });
  });

  it('requires turnstile verification when secret is configured', async () => {
    process.env.TURNSTILE_SECRET_KEY = 'secret';

    const req = createReq({ body: createPayload({ turnstileToken: '' }) });
    const res = createRes();

    await handler(req, res as unknown as NextApiResponse<ContactResponse>);

    expect(res.statusCode).toBe(403);
    expect(res.body).toEqual({ ok: false, errorCode: 'verification_failed' });
  });

  it('returns delivery_failed when webhook rejects submission', async () => {
    process.env.CONTACT_WEBHOOK_URL = 'https://example.com/hook';
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 500
    } as unknown as Response);

    const req = createReq();
    const res = createRes();

    await handler(req, res as unknown as NextApiResponse<ContactResponse>);

    expect(res.statusCode).toBe(502);
    expect(res.body).toEqual({ ok: false, errorCode: 'delivery_failed' });
  });
});
