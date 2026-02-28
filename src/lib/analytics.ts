import { track } from '@vercel/analytics';

type EventValue = string | number | boolean;
type EventPayloadInput = Record<string, EventValue | null | undefined>;
export type AnalyticsEventName =
  | 'authority_asset_view'
  | 'proof_expand'
  | 'proof_asset_open'
  | 'insight_read_75'
  | 'audit_cta_click'
  | 'cta_case_primary_click'
  | 'cta_contact_secondary_click'
  | 'cta_primary_click'
  | 'contact_quality_submit'
  | 'contact_form_start'
  | 'case_study_open'
  | 'cta_contact_click'
  | 'cv_download'
  | 'contact_form_submit'
  | 'contact_form_submit_success'
  | 'contact_form_success'
  | 'contact_form_error'
  | 'hero_video_play'
  | 'web_vital_recorded'
  | (string & {});

const analyticsFallbackHost = 'ivo-tech.com';
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

export function trackEvent(eventName: AnalyticsEventName, payload: EventPayloadInput = {}) {
  if (typeof window === 'undefined') return;
  if (!isAnalyticsHostAllowed(window.location.hostname)) return;

  const normalizedName = normalizeEventName(eventName);
  const cleanPayload = sanitizePayload(payload);

  try {
    track(normalizedName, cleanPayload);
  } catch {
    // Keep UX flow resilient if analytics transport fails.
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: normalizedName, ...cleanPayload });
  }
}
