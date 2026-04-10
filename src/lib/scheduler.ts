import type { AttributionLocale } from '@/lib/attribution';
import { normalizeAttributionSource } from '@/lib/attribution';

type SchedulerPlacement = 'contact-form' | 'thank-you';

type SchedulerHrefParams = {
  locale: AttributionLocale;
  source: string;
  placement: SchedulerPlacement;
  heroVariant?: string;
};

const schedulerFallbackUrl = 'https://cal.com/ivo-tech/intro-call';

export function getSchedulerHref({ locale, source, placement, heroVariant }: SchedulerHrefParams) {
  const normalizedSource = normalizeAttributionSource(source, 'home');
  const normalizedVariant = normalizeAttributionSource(heroVariant, 'default');
  const configuredBase = process.env.NEXT_PUBLIC_SCHEDULER_URL?.trim() || schedulerFallbackUrl;

  try {
    const url = new URL(configuredBase);
    url.searchParams.set('locale', locale);
    url.searchParams.set('source', normalizedSource);
    url.searchParams.set('exp_hero', normalizedVariant);
    url.searchParams.set('utm_source', 'ivo-tech.com');
    url.searchParams.set('utm_medium', 'website');
    url.searchParams.set('utm_campaign', `scheduler-${placement}`);
    url.searchParams.set('utm_content', `hero-${normalizedVariant}`);
    return url.toString();
  } catch {
    return schedulerFallbackUrl;
  }
}
