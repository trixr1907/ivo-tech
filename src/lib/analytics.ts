import { track } from '@vercel/analytics';

type EventValue = string | number | boolean;
type EventPayloadInput = Record<string, EventValue | null | undefined>;
type SinkEventPayload = {
  event: string;
  properties: Record<string, EventValue>;
  distinctId: string;
  url: string;
  path: string;
  referrer: string;
  locale: string;
  timestamp: string;
};
export type AnalyticsEventName =
  | 'hero_cta_click'
  | 'section_cta_click'
  | 'contact_submit'
  | 'scheduler_click'
  | 'thankyou_view'
  | 'case_open'
  | 'playbook_open'
  | 'authority_asset_view'
  | 'insight_card_click'
  | 'insights_hub_click'
  | 'nav_section_click'
  | 'trust_project_click'
  | 'insight_read_75'
  | 'cta_case_primary_click'
  | 'cta_primary_click'
  | 'cta_playbook_tertiary_click'
  | 'hero_variant_view'
  | 'service_page_view'
  | 'service_cta_click'
  | 'service_detail_view'
  | 'service_detail_cta_click'
  | 'hub_page_view'
  | 'hub_cta_click'
  | 'contact_quality_submit'
  | 'contact_form_start'
  | 'case_study_open'
  | 'cta_contact_click'
  | 'contact_form_submit'
  | 'contact_form_submit_success'
  | 'contact_form_success'
  | 'contact_form_error'
  | 'thank_you_view'
  | 'thank_you_cta_click'
  | 'scheduler_cta_click'
  | 'homepage_scroll_depth'
  | 'hero_video_play'
  | 'web_vital_recorded'
  | 'case_card_booking_click'
  | 'lead_magnet_direct_download'
  | 'lead_magnet_submit'
  | 'lead_magnet_success'
  | (string & {});

const eventAliasMap: Record<string, string[]> = {
  cta_primary_click: ['hero_cta_click'],
  cta_case_primary_click: ['section_cta_click'],
  cta_playbook_tertiary_click: ['playbook_open', 'section_cta_click'],
  contact_form_submit: ['contact_submit'],
  contact_form_submit_success: ['contact_submit'],
  scheduler_cta_click: ['scheduler_click'],
  thank_you_view: ['thankyou_view'],
  case_study_open: ['case_open'],
  hub_cta_click: ['section_cta_click'],
  service_cta_click: ['section_cta_click'],
  service_detail_cta_click: ['section_cta_click'],
  thank_you_cta_click: ['section_cta_click'],
  cta_contact_click: ['section_cta_click']
};

const analyticsFallbackHost = 'ivo-tech.com';
const analyticsSinkEndpoint = '/api/analytics';
const analyticsDistinctIdStorageKey = 'ivo_analytics_distinct_id';
const isAnalyticsSinkEnabled = (process.env.NEXT_PUBLIC_ANALYTICS_SINK_ENABLED ?? '').trim().toLowerCase() === 'true';
function normalizeEventName(eventName: string) {
  return eventName.trim().toLowerCase().replace(/[^a-z0-9_:-]+/g, '_');
}

function normalizeHost(value: string) {
  return value.trim().toLowerCase().replace(/\.$/, '');
}

function parseHost(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;

  try {
    const normalizedInput = trimmed.includes('://') ? trimmed : `https://${trimmed}`;
    return normalizeHost(new URL(normalizedInput).hostname);
  } catch {
    return null;
  }
}

function buildAllowedAnalyticsHosts() {
  const configuredSiteHost = parseHost(process.env.NEXT_PUBLIC_SITE_URL ?? '') ?? analyticsFallbackHost;
  const apexHost = configuredSiteHost.replace(/^www\./, '');
  const allowedHosts = new Set([configuredSiteHost, apexHost, `www.${apexHost}`]);
  const additionalHosts = (process.env.NEXT_PUBLIC_ANALYTICS_ALLOWED_HOSTS ?? '')
    .split(',')
    .map((entry) => parseHost(entry))
    .filter((host): host is string => Boolean(host));

  for (const host of additionalHosts) {
    allowedHosts.add(host);
  }

  return allowedHosts;
}

const allowedAnalyticsHosts = buildAllowedAnalyticsHosts();

export function isAnalyticsHostAllowed(hostname: string | null | undefined) {
  if (!hostname) return false;
  return allowedAnalyticsHosts.has(normalizeHost(hostname));
}

export function shouldTrackAnalyticsUrl(url: string | null | undefined) {
  if (!url) return false;
  try {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : `https://${analyticsFallbackHost}`;
    return isAnalyticsHostAllowed(new URL(url, baseUrl).hostname);
  } catch {
    return false;
  }
}

function sanitizePayload(payload: EventPayloadInput): Record<string, EventValue> {
  const entries = Object.entries(payload).filter(
    (entry): entry is [string, EventValue] => entry[1] !== null && entry[1] !== undefined
  );
  return Object.fromEntries(entries);
}

function buildFallbackDistinctId() {
  return `anon_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function getDistinctId() {
  if (typeof window === 'undefined') return buildFallbackDistinctId();

  try {
    const existing = window.localStorage.getItem(analyticsDistinctIdStorageKey)?.trim();
    if (existing) return existing;

    const randomUuid = window.crypto?.randomUUID?.() ?? buildFallbackDistinctId();
    const created = `anon_${randomUuid}`;
    window.localStorage.setItem(analyticsDistinctIdStorageKey, created);
    return created;
  } catch {
    return buildFallbackDistinctId();
  }
}

function buildSinkPayload(eventName: string, properties: Record<string, EventValue>): SinkEventPayload {
  const currentUrl = window.location.href;
  const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  const referrer = document.referrer || '';
  const locale = currentPath === '/en' || currentPath.startsWith('/en/') ? 'en' : 'de';

  return {
    event: eventName,
    properties,
    distinctId: getDistinctId(),
    url: currentUrl,
    path: currentPath,
    referrer,
    locale,
    timestamp: new Date().toISOString()
  };
}

function relayEventToSink(payload: SinkEventPayload) {
  if (!isAnalyticsSinkEnabled || typeof window === 'undefined') return;

  const body = JSON.stringify(payload);

  try {
    if (typeof window.navigator.sendBeacon === 'function') {
      const blob = new Blob([body], { type: 'application/json' });
      const sent = window.navigator.sendBeacon(analyticsSinkEndpoint, blob);
      if (sent) return;
    }
  } catch {
    // continue with fetch fallback
  }

  void fetch(analyticsSinkEndpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body,
    keepalive: true,
    credentials: 'omit'
  }).catch(() => {
    // Keep UX flow resilient if analytics relay fails.
  });
}

export function trackEvent(eventName: AnalyticsEventName, payload: EventPayloadInput = {}) {
  if (typeof window === 'undefined') return;
  if (!isAnalyticsHostAllowed(window.location.hostname)) return;

  const normalizedName = normalizeEventName(eventName);
  const aliasNames = eventAliasMap[normalizedName] ?? [];
  const eventNames = [...new Set([normalizedName, ...aliasNames])];
  const cleanPayload = sanitizePayload(payload);

  for (const name of eventNames) {
    try {
      track(name, cleanPayload);
    } catch {
      // Keep UX flow resilient if analytics transport fails.
    }

    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: name, ...cleanPayload });
    }

    relayEventToSink(buildSinkPayload(name, cleanPayload));
  }
}
