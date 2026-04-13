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
    <header className="home-v2-header sticky top-0 z-30 bg-slate-950/70 backdrop-blur-md" style={{ borderBottom: '1px solid transparent', backgroundImage: 'linear-gradient(rgba(9,17,34,0.7), rgba(9,17,34,0.7)) padding-box, linear-gradient(90deg, transparent 0%, rgba(56,189,248,0.18) 35%, rgba(99,102,241,0.14) 65%, transparent 100%) border-box' }}>
      <div className="home-shell-container mx-auto flex h-14 w-full items-center justify-between gap-4 px-4 sm:px-6">
        <Link href={homeHref} className="flex items-center gap-2 font-display text-base font-bold tracking-tight text-slate-100 transition-opacity hover:opacity-80">
          <img
            src="/assets/logo/ivo-logo__mark-core__premium__dark__v1.1.0.svg"
            alt=""
            width={28}
            height={28}
            className="h-7 w-7 shrink-0"
          />
          <span>ivo-tech</span>
        </Link>

        <nav aria-label={t.navLabel} className="hidden items-center gap-4 text-sm font-medium text-slate-400 lg:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-slate-100">
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
          <Button asChild variant="ghost" size="sm" className="hidden text-slate-500 hover:text-slate-200 md:inline-flex">
            <Link href={locale === 'de' ? '/en' : '/'}>{locale === 'de' ? 'EN' : 'DE'}</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="hidden bg-gradient-to-r from-sky-500 to-blue-500 text-white hover:from-sky-400 hover:to-blue-400 md:inline-flex"
          >
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
