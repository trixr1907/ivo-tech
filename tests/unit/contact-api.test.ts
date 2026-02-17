/* @vitest-environment node */

import { afterEach, describe, expect, it, vi } from 'vitest';

import { handleContactRequest } from '@/server/contact/handler';

type ContactResponse =
  | { ok: true; requestId: string }
  | {
      ok: false;
      errorCode: 'method_not_allowed' | 'invalid_payload' | 'rate_limited' | 'verification_failed' | 'delivery_failed';
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
    intent_detail: 'hiring',
    timeline_band: '30d',
    project_scope: 'unknown',
    company: 'Acme GmbH',
    message: 'Ich moechte ein kurzes Hiring-Gespraech zum Team-Setup abstimmen.',
    locale: 'de',
    sourcePath: '/#contact',
    website: '',
    turnstileToken: '',
    ...overrides
  };
}

function createRequest(input: {
  method?: string;
  body?: Record<string, unknown>;
  ip?: string;
  headers?: Record<string, string>;
} = {}) {
  const { method = 'POST', body = createPayload(), ip = '127.0.0.1', headers = {} } = input;

  return new Request('http://localhost/api/contact', {
    method,
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': ip,
      ...headers
    },
    body: method === 'POST' ? JSON.stringify(body) : undefined
  });
}

async function parseResponse(response: Response) {
  const payload = (await response.json()) as ContactResponse;
  return { statusCode: response.status, payload, headers: response.headers };
}

describe('/api/contact', () => {
  afterEach(() => {
    clearRateStore();
    resetScopedEnv();
    vi.restoreAllMocks();
  });

  it('rejects non-POST methods', async () => {
    const result = await parseResponse(await handleContactRequest(createRequest({ method: 'GET' })));

    expect(result.statusCode).toBe(405);
    expect(result.headers.get('Allow')).toBe('POST');
    expect(result.payload).toEqual({ ok: false, errorCode: 'method_not_allowed' });
  });

  it('rejects invalid payloads', async () => {
    const result = await parseResponse(
      await handleContactRequest(
        createRequest({
          body: {
            name: 'x',
            email: 'invalid',
            sourcePath: 'contact'
          }
        })
      )
    );

    expect(result.statusCode).toBe(400);
    expect(result.payload).toEqual({ ok: false, errorCode: 'invalid_payload' });
  });

  it('accepts payloads when extended quality fields are omitted', async () => {
    vi.spyOn(console, 'info').mockImplementation(() => undefined);
    const payload = {
      ...createPayload(),
      intent_detail: undefined,
      timeline_band: undefined,
      project_scope: undefined
    };

    const result = await parseResponse(await handleContactRequest(createRequest({ body: payload })));

    expect(result.statusCode).toBe(200);
    expect(result.payload.ok).toBe(true);
  });

  it('silently accepts honeypot submissions', async () => {
    const result = await parseResponse(
      await handleContactRequest(
        createRequest({
          body: createPayload({ website: 'https://spam.invalid' })
        })
      )
    );

    expect(result.statusCode).toBe(200);
    expect(result.payload.ok).toBe(true);
  });

  it('applies per-IP rate limiting', async () => {
    process.env.CONTACT_RATE_LIMIT_PER_IP = '1';
    vi.spyOn(console, 'info').mockImplementation(() => undefined);

    const first = await parseResponse(await handleContactRequest(createRequest({ ip: '10.10.10.10' })));
    const second = await parseResponse(await handleContactRequest(createRequest({ ip: '10.10.10.10' })));

    expect(first.statusCode).toBe(200);
    expect(first.payload.ok).toBe(true);
    expect(second.statusCode).toBe(429);
    expect(second.payload).toEqual({ ok: false, errorCode: 'rate_limited' });
  });

  it('requires turnstile verification when secret is configured', async () => {
    process.env.TURNSTILE_SECRET_KEY = 'secret';

    const result = await parseResponse(
      await handleContactRequest(createRequest({ body: createPayload({ turnstileToken: '' }) }))
    );

    expect(result.statusCode).toBe(403);
    expect(result.payload).toEqual({ ok: false, errorCode: 'verification_failed' });
  });

  it('returns delivery_failed when webhook rejects submission', async () => {
    process.env.CONTACT_WEBHOOK_URL = 'https://example.com/hook';
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 500
    } as unknown as Response);

    const result = await parseResponse(await handleContactRequest(createRequest()));

    expect(result.statusCode).toBe(502);
    expect(result.payload).toEqual({ ok: false, errorCode: 'delivery_failed' });
  });
});
