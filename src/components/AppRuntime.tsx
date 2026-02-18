'use client';

import { Analytics, type BeforeSend } from '@vercel/analytics/react';

import { BackgroundFX } from '@/components/BackgroundFX';
import { isAnalyticsHostAllowed, shouldTrackAnalyticsUrl } from '@/lib/analytics';

const filterAnalyticsByHost: BeforeSend = (event) => {
  if (shouldTrackAnalyticsUrl(event.url)) return event;
  if (typeof window !== 'undefined' && isAnalyticsHostAllowed(window.location.hostname)) return event;
  return null;
};

export function AppRuntime() {
  return (
    <>
      <BackgroundFX />
      <Analytics beforeSend={filterAnalyticsByHost} />
    </>
  );
}
