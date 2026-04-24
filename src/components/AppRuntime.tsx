'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useReportWebVitals } from 'next/web-vitals';
import type { BeforeSend } from '@vercel/analytics';
import type { BeforeSendMiddleware } from '@vercel/speed-insights';

import { isAnalyticsHostAllowed, shouldTrackAnalyticsUrl } from '@/lib/analytics';
import { reportWebVital } from '@/lib/webVitals';

const filterAnalyticsByHost: BeforeSend = (event) => {
  if (shouldTrackAnalyticsUrl(event.url)) return event;
  if (typeof window !== 'undefined' && isAnalyticsHostAllowed(window.location.hostname)) return event;
  return null;
};

const filterSpeedInsightsByHost: BeforeSendMiddleware = (event) => {
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
    let cancelled = false;

    const injectTelemetry = async () => {
      try {
        const [analyticsModule, speedInsightsModule] = await Promise.all([
          import('@vercel/analytics'),
          import('@vercel/speed-insights')
        ]);
        if (cancelled) return;

        analyticsModule.inject({
          beforeSend: filterAnalyticsByHost
        });
        speedInsightsModule.injectSpeedInsights({
          beforeSend: filterSpeedInsightsByHost,
          sampleRate: 1
        });
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('[AppRuntime] Failed to inject telemetry scripts:', error);
        }
      }
    };

    const requestIdle = (window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number })
      .requestIdleCallback;
    const cancelIdle = (window as unknown as { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;

    const handle = requestIdle ? requestIdle(injectTelemetry, { timeout: 1800 }) : window.setTimeout(injectTelemetry, 600);

    return () => {
      cancelled = true;
      if (requestIdle && cancelIdle) {
        cancelIdle(handle);
      } else if (!requestIdle) {
        clearTimeout(handle);
      }
    };
  }, []);

  useEffect(() => {
    const locale = pathname === '/en' || pathname?.startsWith('/en/') ? 'en' : 'de';
    document.documentElement.lang = locale;
  }, [pathname]);

  return null;
}
