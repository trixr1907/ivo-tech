'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { RelaunchMarketingShell } from '@/components/layout/RelaunchMarketingShell';
import { Button } from '@/components/shadcn/button';
import { copy, type Locale } from '@/content/copy';
import { CONTACT_EMAIL } from '@/lib/sitePublic';

type Props = {
  locale: Locale;
};

export function NotFoundPageClient({ locale }: Props) {
  const pathname = usePathname() || '/';
  const effectiveLocale: Locale = locale === 'en' || pathname.startsWith('/en') ? 'en' : 'de';
  const t = copy[effectiveLocale];

  const desc =
    effectiveLocale === 'de'
      ? 'Die angeforderte Seite existiert nicht (oder wurde verschoben).'
      : 'The page you requested does not exist (or has been moved).';

  const homeHref = effectiveLocale === 'en' ? '/en' : '/';

  const navLinks = [
    { href: `${homeHref}#featured`, label: t.nav.featured },
    { href: `${homeHref}#contact`, label: t.nav.contact }
  ];

  return (
    <RelaunchMarketingShell
      locale={effectiveLocale}
      shellClassName="not-found-page"
      homeHref={homeHref}
      navLinks={navLinks}
      desktopCtaHref={homeHref}
      desktopCtaLabel="Home"
      mobileNavCtaLabel="Home"
      mobileNavCtaHref={homeHref}
      desktopContactTrackingSource="not-found-header-home"
      mobileNavPrimaryTrackingSource="not-found-mobile-home"
    >
      <main id="main-content" className="mx-auto flex w-full max-w-[720px] flex-1 flex-col items-center justify-center px-4 pb-20 pt-16 sm:px-6">
        <section className="w-full rounded-3xl border border-slate-800/90 bg-slate-950/55 p-8 text-center shadow-[0_24px_80px_rgba(3,8,18,0.35)] backdrop-blur-sm sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sky-400/90">404</p>
          <h1 id="nf-title" className="mt-3 font-display text-3xl font-semibold text-slate-100 sm:text-4xl">
            {effectiveLocale === 'de' ? 'Nicht gefunden.' : 'Not found.'}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-300">{desc}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild className="bg-sky-500 text-slate-950 hover:bg-sky-400">
              <Link href={homeHref}>{effectiveLocale === 'de' ? 'Zurueck zur Startseite' : 'Back to home'}</Link>
            </Button>
            <Button asChild variant="outline" className="border-slate-600 bg-transparent text-slate-100 hover:bg-slate-800/60">
              <a href={`mailto:${CONTACT_EMAIL}`}>{effectiveLocale === 'de' ? 'Kontakt' : 'Contact'}</a>
            </Button>
          </div>
        </section>
      </main>
    </RelaunchMarketingShell>
  );
}
