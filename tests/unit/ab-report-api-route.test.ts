import { afterEach, describe, expect, it } from 'vitest';

import { GET } from '@/app/api/internal/ab-report/route';
import { ingestAbEvent } from '@/server/ab-report/store';

const originalToken = process.env.INTERNAL_REPORT_TOKEN;

afterEach(() => {
  if (originalToken === undefined) {
    delete process.env.INTERNAL_REPORT_TOKEN;
  } else {
    process.env.INTERNAL_REPORT_TOKEN = originalToken;
  }
});

describe('internal ab report api route', () => {
  it('blocks access when token is configured and missing', async () => {
    process.env.INTERNAL_REPORT_TOKEN = 'topsecret';

    const response = await GET(new Request('https://ivo-tech.com/api/internal/ab-report?days=7'));
    expect(response.status).toBe(401);
  });

  it('returns report when key is valid', async () => {
    process.env.INTERNAL_REPORT_TOKEN = 'topsecret';

    await ingestAbEvent(
      new Request('https://ivo-tech.com/api/analytics/ab-event', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          event: 'ab_home_variant_exposure',
          experiment: 'home_cta_proof_v1',
          variant: 'b',
          source: 'unit_test'
        })
      })
    );

    const response = await GET(new Request('https://ivo-tech.com/api/internal/ab-report?days=1&key=topsecret'));
    expect(response.status).toBe(200);

    const payload = (await response.json()) as {
      ok: boolean;
      report: { windowDays: number; decision: { status: string; confidence95: boolean } };
    };
    expect(payload.ok).toBe(true);
    expect(payload.report.windowDays).toBe(1);
    expect(payload.report.decision.status).toBeTypeOf('string');
    expect(typeof payload.report.decision.confidence95).toBe('boolean');
  });

  it('returns csv when format=csv is requested', async () => {
    process.env.INTERNAL_REPORT_TOKEN = 'topsecret';

    await ingestAbEvent(
      new Request('https://ivo-tech.com/api/analytics/ab-event', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          event: 'cta_primary_click',
          experiment: 'home_cta_proof_v1',
          variant: 'a',
          source: 'unit_test'
        })
      })
    );

    const response = await GET(new Request('https://ivo-tech.com/api/internal/ab-report?days=1&format=csv&key=topsecret'));
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/csv');
    expect(response.headers.get('content-disposition')).toContain('attachment');

    const csv = await response.text();
    expect(csv).toContain('date,variant,exposure,cta_clicks');
    expect(csv).toContain(',a,');
    expect(csv).toContain(',b,');
  });

  it('returns source breakdown csv when breakdown=source is requested', async () => {
    process.env.INTERNAL_REPORT_TOKEN = 'topsecret';

    await ingestAbEvent(
      new Request('https://ivo-tech.com/api/analytics/ab-event', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          event: 'ab_home_variant_exposure',
          experiment: 'home_cta_proof_v1',
          variant: 'a',
          source: 'csv_source_unit'
        })
      })
    );

    const response = await GET(
      new Request('https://ivo-tech.com/api/internal/ab-report?days=1&format=csv&breakdown=source&key=topsecret')
    );
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/csv');
    expect(response.headers.get('content-disposition')).toContain('ab-home-cta-proof-source-');

    const csv = await response.text();
    expect(csv).toContain('source,total_exposure,total_submit_success');
    expect(csv).toContain('decision_status,decision_confidence95,recommended_action');
    expect(csv).toContain('csv_source_unit');
  });

  it('returns actions breakdown csv when breakdown=actions is requested', async () => {
    process.env.INTERNAL_REPORT_TOKEN = 'topsecret';

    const response = await GET(
      new Request('https://ivo-tech.com/api/internal/ab-report?days=1&format=csv&breakdown=actions&key=topsecret')
    );
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/csv');
    expect(response.headers.get('content-disposition')).toContain('ab-home-cta-proof-actions-');

    const csv = await response.text();
    expect(csv).toContain('rank,source,decision_status,expected_additional_submits_30d');
  });
});
