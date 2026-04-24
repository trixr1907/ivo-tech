import type { Metadata } from 'next';

import { ThanksRelaunchPage } from '@/app-pages/ThanksRelaunchPage';
import { getThankYouPrimaryCta, normalizeAttributionSource } from '@/lib/attribution';
import { getSchedulerHref } from '@/lib/scheduler';

type ThanksPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>;
};

export const metadata: Metadata = {
  title: 'Danke für deine Anfrage | ivo-tech',
  description: 'Vielen Dank für deine Anfrage. Wir melden uns zeitnah mit einem konkreten nächsten Schritt.',
  robots: { index: false, follow: false },
  alternates: {
    canonical: '/thanks',
    languages: {
      de: '/thanks',
      en: '/en/thanks',
      'x-default': '/thanks'
    }
  }
};

export default async function ThanksPage({ searchParams }: ThanksPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const sourceValue = resolvedSearchParams.source;
  const heroVariantValue = resolvedSearchParams.exp_hero;
  const source = normalizeAttributionSource(Array.isArray(sourceValue) ? sourceValue[0] : sourceValue, 'unknown');
  const heroVariant = normalizeAttributionSource(Array.isArray(heroVariantValue) ? heroVariantValue[0] : heroVariantValue, 'default');
  const primaryCta = getThankYouPrimaryCta('de', source);
  const schedulerHref = getSchedulerHref({ locale: 'de', source, placement: 'thank-you', heroVariant });

  return (
    <ThanksRelaunchPage
      locale="de"
      source={source}
      heroVariant={heroVariant}
      primaryCta={primaryCta}
      schedulerHref={schedulerHref}
    />
  );
}
