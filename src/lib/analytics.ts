import { track } from '@vercel/analytics';

type EventValue = string | number | boolean;
type EventPayloadInput = Record<string, EventValue | null | undefined>;

function sanitizePayload(payload: EventPayloadInput): Record<string, EventValue> {
  const entries = Object.entries(payload).filter(
    (entry): entry is [string, EventValue] => entry[1] !== null && entry[1] !== undefined
  );
  return Object.fromEntries(entries);
}

export function trackEvent(eventName: string, payload: EventPayloadInput = {}) {
  if (typeof window === 'undefined') return;

  const cleanPayload = sanitizePayload(payload);

  try {
    track(eventName, cleanPayload);
  } catch {
    // Keep UX flow resilient if analytics transport fails.
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: eventName, ...cleanPayload });
  }
}
