import { render, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AppRuntime } from '@/components/AppRuntime';

const { injectAnalyticsMock, injectSpeedInsightsMock } = vi.hoisted(() => ({
  injectAnalyticsMock: vi.fn(),
  injectSpeedInsightsMock: vi.fn()
}));

vi.mock('@vercel/analytics', () => ({
  inject: injectAnalyticsMock
}));

vi.mock('@vercel/speed-insights', () => ({
  injectSpeedInsights: injectSpeedInsightsMock
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/'
}));

vi.mock('next/web-vitals', () => ({
  useReportWebVitals: vi.fn()
}));

vi.mock('@/lib/webVitals', () => ({
  reportWebVital: vi.fn()
}));

type AnalyticsBeforeSend = (event: { url: string }) => { url: string } | null;
type SpeedInsightsBeforeSend = (event: { type: 'vital'; url: string }) => { type: 'vital'; url: string } | null;

describe('AppRuntime', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders analytics and speed insights with a 100% sample rate', async () => {
    render(<AppRuntime />);

    await waitFor(() => {
      expect(injectAnalyticsMock).toHaveBeenCalledTimes(1);
      expect(injectSpeedInsightsMock).toHaveBeenCalledTimes(1);
    });

    const speedInsightsProps = injectSpeedInsightsMock.mock.calls[0]?.[0] as { sampleRate?: number };
    expect(speedInsightsProps.sampleRate).toBe(1);
  });

  it('allows live-domain events in both telemetry filters', async () => {
    render(<AppRuntime />);
    await waitFor(() => {
      expect(injectAnalyticsMock).toHaveBeenCalledTimes(1);
      expect(injectSpeedInsightsMock).toHaveBeenCalledTimes(1);
    });

    const analyticsProps = injectAnalyticsMock.mock.calls[0]?.[0] as { beforeSend?: AnalyticsBeforeSend };
    const speedInsightsProps = injectSpeedInsightsMock.mock.calls[0]?.[0] as {
      beforeSend?: SpeedInsightsBeforeSend;
    };

    const analyticsEvent = { url: 'https://ivo-tech.com/en' };
    const speedInsightsEvent = { type: 'vital' as const, url: 'https://www.ivo-tech.com/en' };

    expect(analyticsProps.beforeSend?.(analyticsEvent)).toBe(analyticsEvent);
    expect(speedInsightsProps.beforeSend?.(speedInsightsEvent)).toBe(speedInsightsEvent);
  });

  it('drops preview-domain events in both telemetry filters', async () => {
    render(<AppRuntime />);
    await waitFor(() => {
      expect(injectAnalyticsMock).toHaveBeenCalledTimes(1);
      expect(injectSpeedInsightsMock).toHaveBeenCalledTimes(1);
    });

    const analyticsProps = injectAnalyticsMock.mock.calls[0]?.[0] as { beforeSend?: AnalyticsBeforeSend };
    const speedInsightsProps = injectSpeedInsightsMock.mock.calls[0]?.[0] as {
      beforeSend?: SpeedInsightsBeforeSend;
    };

    expect(analyticsProps.beforeSend?.({ url: 'https://preview-feature.vercel.app/' })).toBeNull();
    expect(speedInsightsProps.beforeSend?.({ type: 'vital', url: 'https://preview-feature.vercel.app/' })).toBeNull();
  });
});
