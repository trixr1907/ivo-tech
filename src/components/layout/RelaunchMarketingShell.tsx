'use client';

import type { ReactNode } from 'react';
import { useMemo } from 'react';

import { HomeBackgroundFXClient } from '@/app-pages/HomeBackgroundFXClient';
import { HomeMobileCtaDock } from '@/components/home/HomeMobileCtaDock';
import { HomeRelaunchFooter } from '@/components/home/HomeRelaunchFooter';
import { RelaunchStickyHeader, type RelaunchNavLink } from '@/components/layout/RelaunchStickyHeader';
import type { Locale } from '@/content/copy';
import { getHomeRelaunchCopy } from '@/content/homeRelaunchCopy';
import { cn } from '@/lib/cn';
import { getSchedulerHref } from '@/lib/scheduler';

type RelaunchMarketingShellProps = {
  locale: Locale;
  homeHref: string;
  navLinks: RelaunchNavLink[];
  /**
   * Ziel für Kontakt / Erstgespräch (mit ?source=…).
   * Bei `headerPrimary="scheduler"` wird dies der sekundäre Header-Button und die zweite Dock-Aktion.
   */
  desktopCtaHref: string;
  /** Label wenn `headerPrimary="contact"` oder für Rückwärtskompatibilität bei reinem Kontakt-CTA. */
  desktopCtaLabel: string;
  mobileNavCtaLabel: string;
  mobileNavCtaHref?: string;
  mobileNavCtaIntent?: 'hiring' | 'client' | 'collab';
  heroVariant?: 'default' | 'outcome' | 'speed';
  desktopContactTrackingSource: string;
  mobileNavPrimaryTrackingSource?: string;
  showFooter?: boolean;
  children: ReactNode;
  /** Extra classes on the outer shell (e.g. page-specific analytics hooks). */
  shellClassName?: string;
  desktopHeaderDataHubCta?: string;
  /**
   * `scheduler`: primär Kalender (wie Startseite), sekundär Kontakt (`desktopCtaHref`).
   * `contact`: nur ein Kontakt-Button (Legacy).
   */
  headerPrimary?: 'scheduler' | 'contact';
  /** Sticky Mobile-Dock unten (Booking + Kontakt/…). */
  showMobileDock?: boolean;
};

export function RelaunchMarketingShell({
  locale,
  homeHref,
  navLinks,
  desktopCtaHref,
  desktopCtaLabel,
  mobileNavCtaLabel,
  mobileNavCtaHref,
  mobileNavCtaIntent,
  heroVariant,
  desktopContactTrackingSource,
  mobileNavPrimaryTrackingSource,
  showFooter = true,
  children,
  shellClassName,
  desktopHeaderDataHubCta,
  headerPrimary = 'scheduler',
  showMobileDock = true
}: RelaunchMarketingShellProps) {
  const t = getHomeRelaunchCopy(locale);
  const schedulerSource = useMemo(
    () => desktopContactTrackingSource.replace(/-header$/, '') || 'marketing-shell',
    [desktopContactTrackingSource]
  );

  const schedulerHref = useMemo(
    () =>
      getSchedulerHref({
        locale,
        source: schedulerSource,
        placement: 'contact-form',
        heroVariant: heroVariant ?? 'default'
      }),
    [locale, schedulerSource, heroVariant]
  );

  const useScheduler = headerPrimary === 'scheduler';

  const primaryHref = useScheduler ? schedulerHref : desktopCtaHref;
  const primaryLabel = useScheduler ? t.headerBookingLabel : desktopCtaLabel;
  const secondaryHref = useScheduler ? desktopCtaHref : undefined;
  const secondaryLabel = useScheduler ? t.headerContactShortLabel : undefined;

  const mobilePrimaryHref = useScheduler ? schedulerHref : mobileNavCtaHref ?? desktopCtaHref;
  const mobilePrimaryLabel = useScheduler ? t.headerBookingLabel : mobileNavCtaLabel;
  const mobileSecondaryHref = useScheduler ? desktopCtaHref : undefined;
  const mobileSecondaryLabel = useScheduler ? t.headerContactShortLabel : undefined;

  return (
    <div className={['home-relaunch-shell relative min-h-screen', shellClassName].filter(Boolean).join(' ')}>
      <div className="home-relaunch-bg" aria-hidden="true">
        <div className="home-relaunch-fx-slot">
          <HomeBackgroundFXClient />
        </div>
        <div className="home-relaunch-noise" />
        <div className="home-relaunch-blob home-relaunch-blob-a" />
        <div className="home-relaunch-blob home-relaunch-blob-b" />
      </div>

      <div
        className={cn(
          'relative z-10 flex min-h-screen flex-col text-slate-100',
          showMobileDock && useScheduler && 'pb-[5.75rem] md:pb-0'
        )}
      >
        <RelaunchStickyHeader
          locale={locale}
          navLinks={navLinks}
          homeHref={homeHref}
          desktopCtaHref={primaryHref}
          desktopCtaLabel={primaryLabel}
          desktopSecondaryHref={secondaryHref}
          desktopSecondaryLabel={secondaryLabel}
          mobileNavCtaLabel={mobilePrimaryLabel}
          mobileNavCtaHref={mobilePrimaryHref}
          mobileNavSecondaryHref={mobileSecondaryHref}
          mobileNavSecondaryLabel={mobileSecondaryLabel}
          mobileNavCtaIntent={mobileNavCtaIntent}
          heroVariant={heroVariant}
          desktopContactTrackingSource={useScheduler ? `${desktopContactTrackingSource}-booking` : desktopContactTrackingSource}
          desktopSecondaryTrackingSource={useScheduler ? `${desktopContactTrackingSource}-contact` : undefined}
          mobileNavPrimaryTrackingSource={useScheduler ? `${mobileNavPrimaryTrackingSource ?? desktopContactTrackingSource}-booking` : mobileNavPrimaryTrackingSource}
          mobileNavSecondaryTrackingSource={useScheduler ? `${mobileNavPrimaryTrackingSource ?? desktopContactTrackingSource}-contact` : undefined}
          desktopHeaderDataHubCta={desktopHeaderDataHubCta}
        />
        {children}
        {showFooter ? <HomeRelaunchFooter locale={locale} /> : null}
        {showMobileDock && useScheduler ? (
          <HomeMobileCtaDock
            locale={locale}
            bookingHref={schedulerHref}
            secondaryHref={desktopCtaHref}
            secondaryLabel={t.headerContactShortLabel}
          />
        ) : null}
      </div>
    </div>
  );
}
