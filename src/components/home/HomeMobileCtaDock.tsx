'use client';

import Link from 'next/link';

type Locale = 'de' | 'en';

type HomeMobileCtaDockProps = {
  locale: Locale;
  projectsHref: string;
};

export function HomeMobileCtaDock({ locale, projectsHref }: HomeMobileCtaDockProps) {
  return (
    <div
      className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-50 md:hidden rounded-2xl border border-sky-500/30 bg-gradient-to-br from-slate-950/96 via-slate-900/95 to-slate-950/96 p-3 shadow-[0_22px_50px_rgba(3,8,18,0.55)] backdrop-blur-md"
      role="region"
      aria-label={locale === 'de' ? 'Schneller Einstieg' : 'Quick start'}
    >
      <p className="mb-2 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-sky-200/90">
        {locale === 'de' ? 'Schneller Einstieg' : 'Quick start'}
      </p>
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <a
          href="#contact"
          className="rounded-xl bg-sky-500 py-2.5 text-center text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-sky-400"
        >
          {locale === 'de' ? 'Kontakt' : 'Contact'}
        </a>
        <Link
          href={projectsHref}
          className="rounded-xl border border-slate-600/80 bg-slate-900/60 px-4 py-2.5 text-center text-sm font-semibold text-slate-100 transition hover:border-sky-400/50 hover:bg-slate-800/80"
        >
          {locale === 'de' ? 'Projekte' : 'Projects'}
        </Link>
      </div>
    </div>
  );
}
