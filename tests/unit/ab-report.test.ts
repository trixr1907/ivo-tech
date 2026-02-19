import { afterEach, describe, expect, it } from 'vitest';

import { getAbReport, ingestAbEvent } from '@/server/ab-report/store';

const originalMinExposure = process.env.AB_REPORT_MIN_EXPOSURE_PER_VARIANT;
const originalMinSubmit = process.env.AB_REPORT_MIN_SUBMIT_EVENTS_TOTAL;
const originalMinDelta = process.env.AB_REPORT_MIN_DELTA_PERCENTAGE_POINTS;
const originalSourceMinExposure = process.env.AB_REPORT_SOURCE_MIN_EXPOSURE_PER_VARIANT;
const originalSourceMinSubmit = process.env.AB_REPORT_SOURCE_MIN_SUBMIT_EVENTS_TOTAL;
const originalSourceMinDelta = process.env.AB_REPORT_SOURCE_MIN_DELTA_PERCENTAGE_POINTS;
const originalAppEnv = process.env.NEXT_PUBLIC_APP_ENV;

afterEach(() => {
  if (originalMinExposure === undefined) {
    delete process.env.AB_REPORT_MIN_EXPOSURE_PER_VARIANT;
  } else {
    process.env.AB_REPORT_MIN_EXPOSURE_PER_VARIANT = originalMinExposure;
  }

  if (originalMinSubmit === undefined) {
    delete process.env.AB_REPORT_MIN_SUBMIT_EVENTS_TOTAL;
  } else {
    process.env.AB_REPORT_MIN_SUBMIT_EVENTS_TOTAL = originalMinSubmit;
  }

  if (originalMinDelta === undefined) {
    delete process.env.AB_REPORT_MIN_DELTA_PERCENTAGE_POINTS;
  } else {
    process.env.AB_REPORT_MIN_DELTA_PERCENTAGE_POINTS = originalMinDelta;
  }

  if (originalSourceMinExposure === undefined) {
    delete process.env.AB_REPORT_SOURCE_MIN_EXPOSURE_PER_VARIANT;
  } else {
    process.env.AB_REPORT_SOURCE_MIN_EXPOSURE_PER_VARIANT = originalSourceMinExposure;
  }

  if (originalSourceMinSubmit === undefined) {
    delete process.env.AB_REPORT_SOURCE_MIN_SUBMIT_EVENTS_TOTAL;
  } else {
    process.env.AB_REPORT_SOURCE_MIN_SUBMIT_EVENTS_TOTAL = originalSourceMinSubmit;
  }

  if (originalSourceMinDelta === undefined) {
    delete process.env.AB_REPORT_SOURCE_MIN_DELTA_PERCENTAGE_POINTS;
  } else {
    process.env.AB_REPORT_SOURCE_MIN_DELTA_PERCENTAGE_POINTS = originalSourceMinDelta;
  }

  if (originalAppEnv === undefined) {
    delete process.env.NEXT_PUBLIC_APP_ENV;
  } else {
    process.env.NEXT_PUBLIC_APP_ENV = originalAppEnv;
  }
});

describe('server-side ab reporting', () => {
  it('accepts valid events and aggregates totals', async () => {
    const before = await getAbReport(1);
    const beforeCount = before.variants.a.totals.cta_primary_click;

    const response = await ingestAbEvent(
      new Request('https://ivo-tech.com/api/analytics/ab-event', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-forwarded-for': '203.0.113.10' },
        body: JSON.stringify({
          event: 'cta_primary_click',
          experiment: 'home_cta_proof_v1',
          variant: 'a',
          locale: 'de',
          path: '/',
          source: 'unit_test',
          occurredAt: new Date().toISOString()
        })
      })
    );

    expect(response.status).toBe(202);

    const after = await getAbReport(1);
    expect(after.variants.a.totals.cta_primary_click).toBeGreaterThanOrEqual(beforeCount + 1);
    expect(after.windowDays).toBe(1);
  });

  it('rejects invalid event payloads', async () => {
    const response = await ingestAbEvent(
      new Request('https://ivo-tech.com/api/analytics/ab-event', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          event: 'unknown_event',
          experiment: 'home_cta_proof_v1',
          variant: 'a'
        })
      })
    );

    expect(response.status).toBe(400);
  });

  it('rejects disallowed origins', async () => {
    const response = await ingestAbEvent(
      new Request('https://ivo-tech.com/api/analytics/ab-event', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          origin: 'https://evil.example'
        },
        body: JSON.stringify({
          event: 'cta_primary_click',
          experiment: 'home_cta_proof_v1',
          variant: 'a'
        })
      })
    );

    expect(response.status).toBe(403);
  });

  it('aggregates source attribution with variant deltas', async () => {
    const source = 'source_attribution_unit';
    const before = await getAbReport(1);
    const beforeSource = before.sources.find((entry) => entry.source === source);
    const beforeExposure = beforeSource?.totalExposure ?? 0;
    const beforeBSubmits = beforeSource?.b.totals.contact_form_submit_success ?? 0;

    await ingestAbEvent(
      new Request('https://ivo-tech.com/api/analytics/ab-event', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-forwarded-for': '203.0.113.51' },
        body: JSON.stringify({
          event: 'ab_home_variant_exposure',
          experiment: 'home_cta_proof_v1',
          variant: 'a',
          source
        })
      })
    );

    await ingestAbEvent(
      new Request('https://ivo-tech.com/api/analytics/ab-event', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-forwarded-for': '203.0.113.52' },
        body: JSON.stringify({
          event: 'ab_home_variant_exposure',
          experiment: 'home_cta_proof_v1',
          variant: 'b',
          source
        })
      })
    );

    await ingestAbEvent(
      new Request('https://ivo-tech.com/api/analytics/ab-event', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-forwarded-for': '203.0.113.53' },
        body: JSON.stringify({
          event: 'contact_form_submit_success',
          experiment: 'home_cta_proof_v1',
          variant: 'b',
          source
        })
      })
    );

    const after = await getAbReport(1);
    const sourceSummary = after.sources.find((entry) => entry.source === source);
    expect(sourceSummary).toBeDefined();
    expect(sourceSummary?.totalExposure).toBeGreaterThanOrEqual(beforeExposure + 2);
    expect(sourceSummary?.b.totals.contact_form_submit_success).toBeGreaterThanOrEqual(beforeBSubmits + 1);
    expect(sourceSummary?.deltaSubmitRateBvsA).toBeGreaterThan(0);
    expect(sourceSummary?.decision.status).toBeTypeOf('string');
    expect(sourceSummary?.recommendedAction.length).toBeGreaterThan(0);
  });

  it('keeps decision in collecting mode when sample gates are not met', async () => {
    process.env.AB_REPORT_MIN_EXPOSURE_PER_VARIANT = '100000';
    process.env.AB_REPORT_MIN_SUBMIT_EVENTS_TOTAL = '100000';
    process.env.AB_REPORT_MIN_DELTA_PERCENTAGE_POINTS = '1';

    const report = await getAbReport(1);
    expect(report.decision.status).toBe('collecting_data');
  });

  it('promotes variant b when b outperforms with confidence and enough sample size', async () => {
    process.env.AB_REPORT_MIN_EXPOSURE_PER_VARIANT = '20';
    process.env.AB_REPORT_MIN_SUBMIT_EVENTS_TOTAL = '8';
    process.env.AB_REPORT_MIN_DELTA_PERCENTAGE_POINTS = '1';

    let ipOctet = 100;
    async function sendEvent(event: 'ab_home_variant_exposure' | 'contact_form_submit_success', variant: 'a' | 'b') {
      ipOctet += 1;
      return ingestAbEvent(
        new Request('https://ivo-tech.com/api/analytics/ab-event', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'x-forwarded-for': `203.0.113.${ipOctet}`
          },
          body: JSON.stringify({
            event,
            experiment: 'home_cta_proof_v1',
            variant,
            source: 'decision_gate_unit'
          })
        })
      );
    }

    for (let i = 0; i < 40; i += 1) {
      await sendEvent('ab_home_variant_exposure', 'a');
      await sendEvent('ab_home_variant_exposure', 'b');
    }

    for (let i = 0; i < 2; i += 1) {
      await sendEvent('contact_form_submit_success', 'a');
    }
    for (let i = 0; i < 18; i += 1) {
      await sendEvent('contact_form_submit_success', 'b');
    }

    const report = await getAbReport(1);
    expect(report.decision.status).toBe('promote_b');
    expect(report.decision.confidence95).toBe(true);
    expect(report.decision.deltaSubmitRateBvsA).toBeGreaterThan(0);
  });

  it('promotes source-level variant b when source gates are met', async () => {
    process.env.AB_REPORT_SOURCE_MIN_EXPOSURE_PER_VARIANT = '20';
    process.env.AB_REPORT_SOURCE_MIN_SUBMIT_EVENTS_TOTAL = '8';
    process.env.AB_REPORT_SOURCE_MIN_DELTA_PERCENTAGE_POINTS = '1';

    let ipOctet = 160;
    const source = 'source_decision_unit';
    async function sendEvent(event: 'ab_home_variant_exposure' | 'contact_form_submit_success', variant: 'a' | 'b') {
      ipOctet += 1;
      return ingestAbEvent(
        new Request('https://ivo-tech.com/api/analytics/ab-event', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'x-forwarded-for': `203.0.113.${ipOctet}`
          },
          body: JSON.stringify({
            event,
            experiment: 'home_cta_proof_v1',
            variant,
            source
          })
        })
      );
    }

    for (let i = 0; i < 30; i += 1) {
      await sendEvent('ab_home_variant_exposure', 'a');
      await sendEvent('ab_home_variant_exposure', 'b');
    }

    for (let i = 0; i < 1; i += 1) {
      await sendEvent('contact_form_submit_success', 'a');
    }
    for (let i = 0; i < 12; i += 1) {
      await sendEvent('contact_form_submit_success', 'b');
    }

    const report = await getAbReport(1);
    const summary = report.sources.find((entry) => entry.source === source);
    expect(summary).toBeDefined();
    expect(summary?.decision.status).toBe('promote_b');
    expect(summary?.recommendedAction).toContain('CTA-Variante B');
  });

  it('returns top-3 next actions sorted by expected uplift', async () => {
    const report = await getAbReport(1);
    expect(report.nextActions.length).toBeLessThanOrEqual(3);

    for (let i = 1; i < report.nextActions.length; i += 1) {
      expect(report.nextActions[i - 1]?.expectedAdditionalSubmits30d ?? 0).toBeGreaterThanOrEqual(
        report.nextActions[i]?.expectedAdditionalSubmits30d ?? 0
      );
    }

    for (const action of report.nextActions) {
      expect(action.rank).toBeGreaterThan(0);
      expect(action.source.length).toBeGreaterThan(0);
      expect(action.action.length).toBeGreaterThan(0);
    }
  });

  it('uses staging defaults when NEXT_PUBLIC_APP_ENV=staging and no explicit gates are set', async () => {
    process.env.NEXT_PUBLIC_APP_ENV = 'staging';
    delete process.env.AB_REPORT_MIN_EXPOSURE_PER_VARIANT;
    delete process.env.AB_REPORT_MIN_SUBMIT_EVENTS_TOTAL;
    delete process.env.AB_REPORT_MIN_DELTA_PERCENTAGE_POINTS;
    delete process.env.AB_REPORT_SOURCE_MIN_EXPOSURE_PER_VARIANT;
    delete process.env.AB_REPORT_SOURCE_MIN_SUBMIT_EVENTS_TOTAL;
    delete process.env.AB_REPORT_SOURCE_MIN_DELTA_PERCENTAGE_POINTS;

    await ingestAbEvent(
      new Request('https://ivo-tech.com/api/analytics/ab-event', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-forwarded-for': '203.0.113.210' },
        body: JSON.stringify({
          event: 'ab_home_variant_exposure',
          experiment: 'home_cta_proof_v1',
          variant: 'a',
          source: 'staging_defaults_unit'
        })
      })
    );

    const report = await getAbReport(1);
    expect(report.decision.minExposurePerVariant).toBe(70);
    expect(report.decision.minSubmitEventsTotal).toBe(7);
    expect(report.decision.minDeltaPercentagePoints).toBe(0.9);

    const source = report.sources.find((entry) => entry.source === 'staging_defaults_unit');
    expect(source).toBeDefined();
    expect(source?.decision.minExposurePerVariant).toBe(25);
    expect(source?.decision.minSubmitEventsTotal).toBe(3);
    expect(source?.decision.minDeltaPercentagePoints).toBe(0.75);
  });
});
