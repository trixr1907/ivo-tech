'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useReportWebVitals } from 'next/web-vitals';
import { Analytics, type BeforeSend } from '@vercel/analytics/react';
import type { SpeedInsightsProps } from '@vercel/speed-insights';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { isAnalyticsHostAllowed, shouldTrackAnalyticsUrl } from '@/lib/analytics';
import { reportWebVital } from '@/lib/webVitals';

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
  const pathname = usePathname();

  useReportWebVitals((metric) => {
    reportWebVital(metric, pathname || '/');
  });

  useEffect(() => {
    const locale = pathname === '/en' || pathname?.startsWith('/en/') ? 'en' : 'de';
    document.documentElement.lang = locale;
  }, [pathname]);

  return (
    <>
      <Analytics beforeSend={filterAnalyticsByHost} />
      <SpeedInsights beforeSend={filterSpeedInsightsByHost} sampleRate={1} />
    </>
  );
}
