import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { handleAnalyticsRequest } from '@/server/analytics/handler';

const originalEnv = { ...process.env };

function clearAnalyticsRateStore() {
  const store = (
    globalThis as typeof globalThis & { __ivoAnalyticsRateStore?: Map<string, { count: number; resetAt: number }> }
  ).__ivoAnalyticsRateStore;
  store?.clear();
}

describe('handleAnalyticsRequest', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    clearAnalyticsRateStore();
  });

  it('rejects non-POST methods', async () => {
    const request = new Request('https://ivo-tech.com/api/analytics', { method: 'GET' });
    const response = await handleAnalyticsRequest(request);
    const payload = (await response.json()) as { ok: boolean; errorCode?: string };

    expect(response.status).toBe(405);
    expect(payload.ok).toBe(false);
    expect(payload.errorCode).toBe('method_not_allowed');
  });

  it('returns skipped when provider is disabled', async () => {
    delete process.env.ANALYTICS_SINK_PROVIDER;

    const request = new Request('https://ivo-tech.com/api/analytics', {
      method: 'POST',
      body: JSON.stringify({
        event: 'hero_cta_click',
        properties: { source: 'test' },
        url: 'https://ivo-tech.com/'
      }),
      headers: { 'content-type': 'application/json' }
    });

    const response = await handleAnalyticsRequest(request);
    const payload = (await response.json()) as { ok: boolean; status?: string; provider?: string };

    expect(response.status).toBe(202);
    expect(payload.ok).toBe(true);
    expect(payload.status).toBe('skipped');
    expect(payload.provider).toBe('none');
  });

  it('forwards events to PostHog when configured', async () => {
    process.env.ANALYTICS_SINK_PROVIDER = 'posthog';
    process.env.ANALYTICS_SINK_POSTHOG_PROJECT_KEY = 'ph_test_token';
    process.env.ANALYTICS_SINK_POSTHOG_HOST = 'https://us.i.posthog.com';

    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const request = new Request('https://ivo-tech.com/api/analytics', {
      method: 'POST',
      body: JSON.stringify({
        event: 'contact_form_submit_success',
        properties: { source: 'home_hero_primary', locale: 'de' },
        distinctId: 'anon_123',
        url: 'https://ivo-tech.com/contact',
        referrer: 'https://ivo-tech.com/'
      }),
      headers: { 'content-type': 'application/json' }
    });

    const response = await handleAnalyticsRequest(request);
    const payload = (await response.json()) as { ok: boolean; status?: string; provider?: string };

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]?.[0]).toBe('https://us.i.posthog.com/i/v0/e/');
    expect(response.status).toBe(202);
    expect(payload.ok).toBe(true);
    expect(payload.status).toBe('accepted');
    expect(payload.provider).toBe('posthog');
  });

  it('rate limits repeated requests from the same client ip', async () => {
    process.env.ANALYTICS_RATE_LIMIT_PER_IP = '1';
    process.env.ANALYTICS_RATE_LIMIT_WINDOW_SECONDS = '60';

    const body = JSON.stringify({
      event: 'contact_form_submit_success',
      properties: { source: 'home_hero_primary', locale: 'de' },
      url: 'https://ivo-tech.com/contact'
    });

    const first = await handleAnalyticsRequest(
      new Request('https://ivo-tech.com/api/analytics', {
        method: 'POST',
        body,
        headers: { 'content-type': 'application/json', 'x-forwarded-for': '10.0.0.1' }
      })
    );
    const second = await handleAnalyticsRequest(
      new Request('https://ivo-tech.com/api/analytics', {
        method: 'POST',
        body,
        headers: { 'content-type': 'application/json', 'x-forwarded-for': '10.0.0.1' }
      })
    );

    const secondPayload = (await second.json()) as { ok: boolean; errorCode?: string };

    expect(first.status).toBe(202);
    expect(second.status).toBe(429);
    expect(secondPayload.ok).toBe(false);
    expect(secondPayload.errorCode).toBe('rate_limited');
  });
});
