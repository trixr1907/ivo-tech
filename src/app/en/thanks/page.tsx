import type { Metadata } from 'next';
import Link from 'next/link';

import { ThankYouTracker } from '@/components/thank-you/ThankYouTracker';
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
    <main className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <ThankYouTracker locale="en" source={source} heroVariant={heroVariant} />
      <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-soft sm:p-10">
        <p className="text-sm font-medium uppercase tracking-[0.08em] text-brand-700">Thanks</p>
        <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-ink-900 sm:text-4xl">
          Request submitted successfully.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-700">
          We usually reply within one business day with a concrete next step. If your topic is urgent, email us directly at{' '}
          <a className="font-medium text-brand-700 hover:text-brand-800" href="mailto:contact@ivo-tech.com" data-thanks-cta="email">
            contact@ivo-tech.com
          </a>
          .
        </p>
        <ol className="mt-6 space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-ink-700">
          <li>1. We review your goal, scope, and current technical setup.</li>
          <li>2. You get a concrete recommendation for the next best step.</li>
          <li>3. If useful, we schedule a short kickoff call right away.</li>
        </ol>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href={primaryCta.href}
            data-thanks-cta="primary"
            className="inline-flex items-center justify-center rounded-full bg-brand-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-800"
          >
            {primaryCta.label}
          </Link>
          <Link
            href="/en"
            data-thanks-cta="secondary"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-ink-800 transition hover:bg-slate-100"
          >
            Back to homepage
          </Link>
          <a
            href={schedulerHref}
            target="_blank"
            rel="noopener noreferrer"
            data-thanks-cta="scheduler"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-ink-800 transition hover:bg-slate-100"
          >
            Book a call now
          </a>
        </div>
      </section>
    </main>
  );
}
