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
  /** Optional zweiter Header-CTA (z. B. Kontaktformular), wenn Primär z. B. Kalender-Booking ist. */
  desktopSecondaryHref?: string;
  desktopSecondaryLabel?: string;
  mobileNavCtaLabel: string;
  /** Defaults to `desktopCtaHref` (home uses `#contact` for the mobile sheet primary). */
  mobileNavCtaHref?: string;
  mobileNavSecondaryHref?: string;
  mobileNavSecondaryLabel?: string;
  mobileNavCtaIntent?: 'hiring' | 'client' | 'collab';
  heroVariant?: 'default' | 'outcome' | 'speed';
  desktopContactTrackingSource: string;
  desktopSecondaryTrackingSource?: string;
  /** Analytics `source` for mobile menu primary; defaults to `home_mobile_nav_primary` on home flows. */
  mobileNavPrimaryTrackingSource?: string;
  mobileNavSecondaryTrackingSource?: string;
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
  desktopSecondaryHref,
  desktopSecondaryLabel,
  mobileNavCtaLabel,
  mobileNavCtaHref,
  mobileNavSecondaryHref,
  mobileNavSecondaryLabel,
  mobileNavCtaIntent = 'client',
  heroVariant = 'default',
  desktopContactTrackingSource,
  desktopSecondaryTrackingSource = 'home-header-secondary-contact',
  mobileNavPrimaryTrackingSource,
  mobileNavSecondaryTrackingSource,
  desktopHeaderDataHubCta
}: RelaunchStickyHeaderProps) {
  const t = getHomeRelaunchCopy(locale);
  const mobileHref = mobileNavCtaHref ?? desktopCtaHref;
  const mobileSecondaryHref = mobileNavSecondaryHref ?? desktopSecondaryHref;
  const mobileSecondaryLabel = mobileNavSecondaryLabel ?? desktopSecondaryLabel;

  return (
    <header className="home-v2-header sticky top-0 z-30 bg-slate-950/70 backdrop-blur-md" style={{ borderBottom: '1px solid transparent', backgroundImage: 'linear-gradient(rgba(9,17,34,0.7), rgba(9,17,34,0.7)) padding-box, linear-gradient(90deg, transparent 0%, rgba(56,189,248,0.18) 35%, rgba(99,102,241,0.14) 65%, transparent 100%) border-box' }}>
      <div className="home-shell-container mx-auto flex h-14 w-full items-center justify-between gap-3 px-4 sm:px-6">
        <Link href={homeHref} className="flex min-h-12 min-w-12 items-center gap-2 rounded-lg py-1 font-display text-base font-bold tracking-tight text-slate-100 transition-opacity hover:opacity-80">
          <img
            src="/assets/logo/ivo-logo__mark-core__premium__dark__v1.1.0.svg"
            alt="ivo-tech"
            width={28}
            height={28}
            className="h-7 w-7 shrink-0"
          />
          <span>ivo-tech</span>
        </Link>

        <nav aria-label={t.navLabel} className="hidden items-center gap-1 text-sm font-medium text-slate-400 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="min-h-12 rounded-lg px-3 py-2.5 transition-colors hover:text-slate-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <HomeMobileNav
            locale={locale}
            links={navLinks}
            ctaLabel={mobileNavCtaLabel}
            heroVariant={heroVariant}
            primaryCtaHref={mobileHref}
            secondaryCtaHref={mobileSecondaryHref}
            secondaryCtaLabel={mobileSecondaryLabel}
            primaryCtaIntent={mobileNavCtaIntent}
            primaryTrackingSource={mobileNavPrimaryTrackingSource}
            secondaryTrackingSource={mobileNavSecondaryTrackingSource}
          />
          <Button asChild variant="ghost" size="sm" className="hidden min-h-12 min-w-12 px-3 text-slate-500 hover:text-slate-200 md:inline-flex">
            <Link href={locale === 'de' ? '/en' : '/'} hrefLang={locale === 'de' ? 'en' : 'de'} lang={locale === 'de' ? 'en' : 'de'}>
              {locale === 'de' ? 'EN' : 'DE'}
            </Link>
          </Button>
          {desktopSecondaryHref && desktopSecondaryLabel ? (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="hidden min-h-12 border-slate-600 bg-transparent px-4 text-slate-100 hover:bg-slate-800/60 hover:border-slate-500"
            >
              <a
                href={desktopSecondaryHref}
                onClick={() => trackDesktopContact(desktopSecondaryTrackingSource, locale, mobileNavCtaIntent, heroVariant)}
              >
                {desktopSecondaryLabel}
              </a>
            </Button>
          ) : null}
          <Button
            asChild
            size="sm"
            className="hidden min-h-12 bg-gradient-to-r from-sky-500 to-blue-500 px-4 text-white hover:from-sky-400 hover:to-blue-400 md:inline-flex"
          >
            <a
              href={desktopCtaHref}
              target={desktopCtaHref.startsWith('http') ? '_blank' : undefined}
              rel={desktopCtaHref.startsWith('http') ? 'noopener noreferrer' : undefined}
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
