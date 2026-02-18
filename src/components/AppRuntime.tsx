'use client';

import { Analytics, type BeforeSend } from '@vercel/analytics/react';
import type { SpeedInsightsProps } from '@vercel/speed-insights';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { BackgroundFX } from '@/components/BackgroundFX';
import { isAnalyticsHostAllowed, shouldTrackAnalyticsUrl } from '@/lib/analytics';

const filterAnalyticsByHost: BeforeSend = (event) => {
  if (shouldTrackAnalyticsUrl(event.url)) return event;
  if (typeof window !== 'undefined' && isAnalyticsHostAllowed(window.location.hostname)) return event;
  return null;
};

const filterSpeedInsightsByHost: NonNullable<SpeedInsightsProps['beforeSend']> = (event) => {
  if (shouldTrackAnalyticsUrl(event.url)) return event;
  if (typeof window !== 'undefined' && isAnalyticsHostAllowed(window.location.hostname)) return event;
  return null;
};

export function AppRuntime() {
  return (
    <>
      <BackgroundFX />
      <Analytics beforeSend={filterAnalyticsByHost} />
      <SpeedInsights beforeSend={filterSpeedInsightsByHost} sampleRate={1} />
    </>
  );
}
