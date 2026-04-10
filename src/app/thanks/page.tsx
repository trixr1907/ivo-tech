import type { Metadata } from 'next';
import Link from 'next/link';

import { ThankYouTracker } from '@/components/thank-you/ThankYouTracker';
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
    <main className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <ThankYouTracker locale="de" source={source} heroVariant={heroVariant} />
      <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-soft sm:p-10">
        <p className="text-sm font-medium uppercase tracking-[0.08em] text-brand-700">Danke</p>
        <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-ink-900 sm:text-4xl">
          Anfrage erfolgreich gesendet.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-700">
          Wir melden uns in der Regel innerhalb eines Werktags mit einem konkreten nächsten Schritt. Falls dein Thema dringend ist, schreib bitte direkt an{' '}
          <a className="font-medium text-brand-700 hover:text-brand-800" href="mailto:contact@ivo-tech.com" data-thanks-cta="email">
            contact@ivo-tech.com
          </a>
          .
        </p>
        <ol className="mt-6 space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-ink-700">
          <li>1. Wir prüfen Ziel, Scope und technische Ausgangslage.</li>
          <li>2. Du erhältst einen klaren Vorschlag für den nächsten sinnvollen Schritt.</li>
          <li>3. Optional planen wir direkt einen kurzen Kickoff-Termin.</li>
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
            href="/"
            data-thanks-cta="secondary"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-ink-800 transition hover:bg-slate-100"
          >
            Zur Startseite
          </Link>
          <a
            href={schedulerHref}
            target="_blank"
            rel="noopener noreferrer"
            data-thanks-cta="scheduler"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-ink-800 transition hover:bg-slate-100"
          >
            Direkt Termin buchen
          </a>
        </div>
      </section>
    </main>
  );
}
