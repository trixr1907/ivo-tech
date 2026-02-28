import { trackEvent } from '@/lib/analytics';

type WebVitalName = 'CLS' | 'FCP' | 'INP' | 'LCP' | 'TTFB';
type WebVitalRating = 'good' | 'needs-improvement' | 'poor';

type WebVitalMetric = {
  id: string;
  name: WebVitalName;
  value: number;
  delta: number;
  rating?: WebVitalRating;
  navigationType?: string;
};

type SentryTarget = {
  envelopeUrl: string;
  authQuery: string;
};

export type WebVitalPayload = {
  id: string;
  name: WebVitalName;
  value: number;
  delta: number;
  rating: WebVitalRating | 'unknown';
  navigationType: string;
  path: string;
  threshold?: number;
  thresholdExceeded: boolean;
};

const THRESHOLDS: Partial<Record<WebVitalName, number>> = {
  LCP: 2500,
  INP: 200,
  CLS: 0.1
};

let sentryTargetCache: SentryTarget | null | undefined;

function buildSentryTarget(): SentryTarget | null {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN?.trim();
  if (!dsn) return null;

  try {
    const url = new URL(dsn);
    const projectPathParts = url.pathname.split('/').filter(Boolean);
    const projectId = projectPathParts.at(-1);
    if (!projectId || !url.username) return null;

    const basePath = projectPathParts.slice(0, -1).join('/');
    const normalizedBasePath = basePath ? `/${basePath}` : '';
    const envelopeUrl = `${url.protocol}//${url.host}${normalizedBasePath}/api/${projectId}/envelope/`;
    const authQuery = `sentry_key=${encodeURIComponent(url.username)}&sentry_version=7`;

    return { envelopeUrl, authQuery };
  } catch {
    return null;
  }
}

function getSentryTarget() {
  if (sentryTargetCache !== undefined) return sentryTargetCache;
  sentryTargetCache = buildSentryTarget();
  return sentryTargetCache;
}

function createEventId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID().replace(/-/g, '');
  }
  return `${Date.now().toString(16)}${Math.random().toString(16).slice(2, 18)}`.slice(0, 32);
}

function sendWebVitalAlert(payload: WebVitalPayload) {
  const sentryTarget = getSentryTarget();
  if (!sentryTarget) return;

  const endpoint = `${sentryTarget.envelopeUrl}?${sentryTarget.authQuery}`;
  const envelopeHeader = {
    sent_at: new Date().toISOString(),
    sdk: { name: 'ivo-tech.web-vitals', version: '1.0.0' }
  };
  const itemHeader = { type: 'event' };
  const eventPayload = {
    event_id: createEventId(),
    timestamp: Math.floor(Date.now() / 1000),
    platform: 'javascript',
    level: 'warning',
    logger: 'web-vitals',
    message: `Web vital threshold exceeded: ${payload.name}`,
    tags: {
      metric: payload.name,
      route: payload.path,
      rating: payload.rating
    },
    extra: payload
  };
  const body = `${JSON.stringify(envelopeHeader)}\n${JSON.stringify(itemHeader)}\n${JSON.stringify(eventPayload)}`;

  try {
    if (typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([body], { type: 'text/plain;charset=UTF-8' });
      const didQueue = navigator.sendBeacon(endpoint, blob);
      if (didQueue) return;
    }
  } catch {
    // Fall through to fetch transport.
  }

  void fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'text/plain;charset=UTF-8' },
    body,
    keepalive: true,
    mode: 'cors'
  }).catch(() => {
    // Best-effort reporting: never block rendering path.
  });
}

export function reportWebVital(metric: WebVitalMetric, path: string) {
  const threshold = THRESHOLDS[metric.name];
  const thresholdExceeded = typeof threshold === 'number' && metric.value > threshold;
  const payload: WebVitalPayload = {
    id: metric.id,
    name: metric.name,
    value: Number(metric.value.toFixed(2)),
    delta: Number(metric.delta.toFixed(2)),
    rating: metric.rating ?? 'unknown',
    navigationType: metric.navigationType ?? 'unknown',
    path,
    threshold,
    thresholdExceeded
  };

  trackEvent('web_vital_recorded', {
    metric: payload.name,
    value: payload.value,
    delta: payload.delta,
    rating: payload.rating,
    path: payload.path,
    thresholdExceeded: payload.thresholdExceeded
  });

  if (!thresholdExceeded) return;
  sendWebVitalAlert(payload);
}
