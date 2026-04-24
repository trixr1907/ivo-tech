'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { RelaunchMarketingShell } from '@/components/layout/RelaunchMarketingShell';
import { RelaunchPageMain } from '@/components/layout/RelaunchPageMain';
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
      <RelaunchPageMain variant="notFound">
        <section
          className="home-hero-card relative w-full text-center"
          aria-labelledby="nf-title"
        >
          <div className="home-hero-dot-grid" aria-hidden="true" />
          <div className="relative z-[1]">
            {/* Decorative large 404 */}
            <p
              className="select-none font-mono font-black leading-none text-slate-800/55"
              style={{ fontSize: 'clamp(5rem, 18vw, 9rem)' }}
              aria-hidden="true"
            >
              404
            </p>

            {/* Eyebrow label */}
            <p className="mt-[-0.75rem] text-[0.68rem] font-bold uppercase tracking-[0.18em] text-sky-400/80">
              {effectiveLocale === 'de' ? 'Seite nicht gefunden' : 'Page not found'}
            </p>

            <h1
              id="nf-title"
              className="mt-5 font-display font-bold tracking-tight text-white"
              style={{ fontSize: 'clamp(1.6rem, 4vw, 2.25rem)', lineHeight: 1.2 }}
            >
              {effectiveLocale === 'de'
                ? 'Diese Seite existiert nicht.'
                : "This page doesn't exist."}
            </h1>

            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-slate-400">
              {desc}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button asChild variant="hero" size="lg">
                <Link href={homeHref}>
                  {effectiveLocale === 'de' ? 'Zur Startseite' : 'Back to home'}
                </Link>
              </Button>
              <Button asChild variant="onDark" size="lg">
                <a href={`mailto:${CONTACT_EMAIL}`}>
                  {effectiveLocale === 'de' ? 'Kontakt' : 'Contact'}
                </a>
              </Button>
            </div>
          </div>
        </section>
      </RelaunchPageMain>
    </RelaunchMarketingShell>
  );
}
