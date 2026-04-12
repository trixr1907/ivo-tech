'use client';

import Link from 'next/link';
import { HomeMobileNav } from '@/components/home/HomeMobileNav';
import { Button } from '@/components/shadcn/button';
import type { Locale } from '@/content/copy';
import { getHomeRelaunchCopy } from '@/content/homeRelaunchCopy';
import { trackEvent } from '@/lib/analytics';

export type RelaunchNavLink = { href: string; label: string };

type RelaunchStickyHeaderProps = {
  locale: Locale;
  navLinks: RelaunchNavLink[];
  homeHref: string;
  desktopCtaHref: string;
  desktopCtaLabel: string;
  mobileNavCtaLabel: string;
  /** Defaults to `desktopCtaHref` (home uses `#contact` for the mobile sheet primary). */
  mobileNavCtaHref?: string;
  mobileNavCtaIntent?: 'hiring' | 'client' | 'collab';
  heroVariant?: 'default' | 'outcome' | 'speed';
  desktopContactTrackingSource: string;
  /** Analytics `source` for mobile menu primary; defaults to `home_mobile_nav_primary` on home flows. */
  mobileNavPrimaryTrackingSource?: string;
  /** Optional `data-hub-cta` on the desktop header CTA (hub E2E / analytics). */
  desktopHeaderDataHubCta?: string;
};

function trackDesktopContact(
  source: string,
  locale: Locale,
  intent: 'hiring' | 'client' | 'collab',
  variant: 'default' | 'outcome' | 'speed'
) {
  const path = typeof window === 'undefined' ? '' : `${window.location.pathname}${window.location.search}`;
  trackEvent('section_cta_click', { source, locale, intent, path, variant });
}

export function RelaunchStickyHeader({
  locale,
  navLinks,
  homeHref,
  desktopCtaHref,
  desktopCtaLabel,
  mobileNavCtaLabel,
  mobileNavCtaHref,
  mobileNavCtaIntent = 'client',
  heroVariant = 'default',
  desktopContactTrackingSource,
  mobileNavPrimaryTrackingSource,
  desktopHeaderDataHubCta
}: RelaunchStickyHeaderProps) {
  const t = getHomeRelaunchCopy(locale);
  const mobileHref = mobileNavCtaHref ?? desktopCtaHref;

  return (
    <header className="home-v2-header sticky top-0 z-30 border-b border-slate-800/70 bg-slate-950/65 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6">
        <Link href={homeHref} className="flex items-center gap-2.5 font-display text-lg font-semibold text-slate-100">
          <img
            src="/assets/logo/ivo-logo__mark-core__premium__dark__v1.1.0.svg"
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 shrink-0"
          />
          <span>ivo-tech</span>
        </Link>

        <nav aria-label={t.navLabel} className="hidden items-center gap-5 text-sm text-slate-300 lg:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <HomeMobileNav
            locale={locale}
            links={navLinks}
            ctaLabel={mobileNavCtaLabel}
            heroVariant={heroVariant}
            primaryCtaHref={mobileHref}
            primaryCtaIntent={mobileNavCtaIntent}
            primaryTrackingSource={mobileNavPrimaryTrackingSource}
          />
          <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
            <Link href={locale === 'de' ? '/en' : '/'}>{locale === 'de' ? 'EN' : 'DE'}</Link>
          </Button>
          <Button asChild size="sm" className="hidden bg-sky-500 text-slate-950 hover:bg-sky-400 md:inline-flex">
            <a
              href={desktopCtaHref}
              {...(desktopHeaderDataHubCta ? { 'data-hub-cta': desktopHeaderDataHubCta } : {})}
              onClick={() => trackDesktopContact(desktopContactTrackingSource, locale, mobileNavCtaIntent, heroVariant)}
            >
              {desktopCtaLabel}
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
