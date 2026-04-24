import type { Metadata } from 'next';

import { ThanksRelaunchPage } from '@/app-pages/ThanksRelaunchPage';
import { getThankYouPrimaryCta, normalizeAttributionSource } from '@/lib/attribution';
import { getSchedulerHref } from '@/lib/scheduler';

type ThanksPageEnProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>;
};

export const metadata: Metadata = {
  title: 'Thanks for your request | ivo-tech',
  description: 'Thanks for your request. We will reply with a concrete next step shortly.',
  robots: { index: false, follow: false },
  alternates: {
    canonical: '/en/thanks',
    languages: {
      de: '/thanks',
      en: '/en/thanks',
      'x-default': '/thanks'
    }
  }
};

export default async function ThanksPageEn({ searchParams }: ThanksPageEnProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const sourceValue = resolvedSearchParams.source;
  const heroVariantValue = resolvedSearchParams.exp_hero;
  const source = normalizeAttributionSource(Array.isArray(sourceValue) ? sourceValue[0] : sourceValue, 'unknown');
  const heroVariant = normalizeAttributionSource(Array.isArray(heroVariantValue) ? heroVariantValue[0] : heroVariantValue, 'default');
  const primaryCta = getThankYouPrimaryCta('en', source);
  const schedulerHref = getSchedulerHref({ locale: 'en', source, placement: 'thank-you', heroVariant });

  return (
    <ThanksRelaunchPage
      locale="en"
      source={source}
      heroVariant={heroVariant}
      primaryCta={primaryCta}
      schedulerHref={schedulerHref}
    />
  );
}
