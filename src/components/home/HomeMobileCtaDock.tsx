'use client';

import Link from 'next/link';

type Locale = 'de' | 'en';

type HomeMobileCtaDockProps = {
  locale: Locale;
  bookingHref: string;
  /** Zweiter Button (z. B. Projekte auf der Startseite, Kontakt auf Unterseiten). */
  secondaryHref: string;
  secondaryLabel: string;
};

export function HomeMobileCtaDock({ locale, bookingHref, secondaryHref, secondaryLabel }: HomeMobileCtaDockProps) {
  return (
    <div
      className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-50 md:hidden rounded-2xl border border-sky-500/30 bg-gradient-to-br from-slate-950/96 via-slate-900/95 to-slate-950/96 p-3 shadow-[0_22px_50px_rgba(3,8,18,0.55)] backdrop-blur-md"
      role="region"
      aria-label={locale === 'de' ? 'Schneller Einstieg' : 'Quick start'}
    >
      <p className="mb-2 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-sky-200/90">
        {locale === 'de' ? 'Beratung buchen' : 'Book a call'}
      </p>
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <a
          href={bookingHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-12 items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 px-3 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:from-sky-400 hover:to-blue-400"
        >
          {locale === 'de' ? 'Beratungsgespräch' : 'Consultation'}
        </a>
        <Link
          href={secondaryHref}
          className="flex min-h-12 min-w-12 max-w-[9rem] items-center justify-center rounded-xl border border-slate-600/80 bg-slate-900/60 px-3 py-3 text-center text-sm font-semibold text-slate-100 transition hover:border-sky-400/50 hover:bg-slate-800/80"
        >
          {secondaryLabel}
        </Link>
      </div>
    </div>
  );
}
