import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { AppRuntime } from '@/components/AppRuntime';

vi.mock('@vercel/analytics/react', () => ({
  Analytics: vi.fn(() => null)
}));

vi.mock('@vercel/speed-insights/next', () => ({
  SpeedInsights: vi.fn(() => null)
}));

vi.mock('@/components/BackgroundFX', () => ({
  BackgroundFX: vi.fn(() => null)
}));

type AnalyticsBeforeSend = (event: { url: string }) => { url: string } | null;
type SpeedInsightsBeforeSend = (event: { type: 'vital'; url: string }) => { type: 'vital'; url: string } | null;

describe('AppRuntime', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders analytics and speed insights with a 100% sample rate', () => {
    render(<AppRuntime />);

    expect(vi.mocked(Analytics)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(SpeedInsights)).toHaveBeenCalledTimes(1);

    const speedInsightsProps = vi.mocked(SpeedInsights).mock.calls[0]?.[0] as { sampleRate?: number };
    expect(speedInsightsProps.sampleRate).toBe(1);
  });

  it('allows live-domain events in both telemetry filters', () => {
    render(<AppRuntime />);

    const analyticsProps = vi.mocked(Analytics).mock.calls[0]?.[0] as { beforeSend?: AnalyticsBeforeSend };
    const speedInsightsProps = vi.mocked(SpeedInsights).mock.calls[0]?.[0] as {
      beforeSend?: SpeedInsightsBeforeSend;
    };

    const analyticsEvent = { url: 'https://ivo-tech.com/en' };
    const speedInsightsEvent = { type: 'vital' as const, url: 'https://www.ivo-tech.com/en' };

    expect(analyticsProps.beforeSend?.(analyticsEvent)).toBe(analyticsEvent);
    expect(speedInsightsProps.beforeSend?.(speedInsightsEvent)).toBe(speedInsightsEvent);
  });

  it('drops preview-domain events in both telemetry filters', () => {
    render(<AppRuntime />);

    const analyticsProps = vi.mocked(Analytics).mock.calls[0]?.[0] as { beforeSend?: AnalyticsBeforeSend };
    const speedInsightsProps = vi.mocked(SpeedInsights).mock.calls[0]?.[0] as {
      beforeSend?: SpeedInsightsBeforeSend;
    };

    expect(analyticsProps.beforeSend?.({ url: 'https://preview-feature.vercel.app/' })).toBeNull();
    expect(speedInsightsProps.beforeSend?.({ type: 'vital', url: 'https://preview-feature.vercel.app/' })).toBeNull();
  });
});
