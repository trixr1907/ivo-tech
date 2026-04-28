'use client';

import type { ReactNode } from 'react';
import { useMemo, useRef } from 'react';

import { HomeBackgroundFXClient } from '@/app-pages/HomeBackgroundFXClient';
import { HomeMobileCtaDock } from '@/components/home/HomeMobileCtaDock';
import { HomeRelaunchFooter } from '@/components/home/HomeRelaunchFooter';
import { HomeBackgroundParallax } from '@/components/layout/HomeBackgroundParallax';
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
  /** Inhalt oberhalb des Sticky-Headers (z.B. Scroll-Progress auf der Startseite). */
  preHeaderSlot?: ReactNode;
  /**
   * `source` für Cal.com-Links. Standard: `desktopContactTrackingSource` ohne Suffix `-header` am Ende.
   * Setzen, falls die Attribution exakt bleiben soll (z.B. `home-header`).
   */
  schedulerAttributionSource?: string;
  /** Mobile-Dock: zweite Aktion (Default: `desktopCtaHref` + Kurzlabel Kontakt). */
  mobileDockSecondaryHref?: string;
  mobileDockSecondaryLabel?: string;
  /**
   * Feste Analytics-Quellen für den Header (ohne automatische `-booking`/`-contact`-Ergänzung).
   * Z.B. Startseite mit historischen Event-Namen.
   */
  stickyHeaderTracking?: {
    desktopContactTrackingSource: string;
    desktopSecondaryTrackingSource?: string;
    mobileNavPrimaryTrackingSource?: string;
    mobileNavSecondaryTrackingSource?: string;
  };
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
  showMobileDock = true,
  preHeaderSlot,
  schedulerAttributionSource,
  mobileDockSecondaryHref,
  mobileDockSecondaryLabel,
  stickyHeaderTracking
}: RelaunchMarketingShellProps) {
  const t = getHomeRelaunchCopy(locale);
  const schedulerSource = useMemo(() => {
    const trimmed = schedulerAttributionSource?.trim();
    if (trimmed) return trimmed;
    return desktopContactTrackingSource.replace(/-header$/, '') || 'marketing-shell';
  }, [schedulerAttributionSource, desktopContactTrackingSource]);

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

  const dockSecondaryHref = mobileDockSecondaryHref ?? desktopCtaHref;
  const dockSecondaryLabel = mobileDockSecondaryLabel ?? t.headerContactShortLabel;

  const headerDesktopContactTs = stickyHeaderTracking
    ? stickyHeaderTracking.desktopContactTrackingSource
    : useScheduler
      ? `${desktopContactTrackingSource}-booking`
      : desktopContactTrackingSource;
  const headerDesktopSecondaryTs = stickyHeaderTracking?.desktopSecondaryTrackingSource
    ? stickyHeaderTracking.desktopSecondaryTrackingSource
    : useScheduler
      ? `${desktopContactTrackingSource}-contact`
      : undefined;
  const headerMobilePrimaryTs = stickyHeaderTracking?.mobileNavPrimaryTrackingSource
    ? stickyHeaderTracking.mobileNavPrimaryTrackingSource
    : useScheduler
      ? `${mobileNavPrimaryTrackingSource ?? desktopContactTrackingSource}-booking`
      : mobileNavPrimaryTrackingSource;
  const headerMobileSecondaryTs = stickyHeaderTracking?.mobileNavSecondaryTrackingSource
    ? stickyHeaderTracking.mobileNavSecondaryTrackingSource
    : useScheduler
      ? `${mobileNavPrimaryTrackingSource ?? desktopContactTrackingSource}-contact`
      : undefined;

  const bgRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className={['home-relaunch-shell relative min-h-screen', shellClassName].filter(Boolean).join(' ')}>
      <div ref={bgRef} className="home-relaunch-bg" aria-hidden="true">
        <HomeBackgroundParallax elRef={bgRef} />
        <div className="home-relaunch-fx-slot">
          <HomeBackgroundFXClient />
        </div>
        <div className="home-relaunch-noise" />
        <div className="home-relaunch-blob-w home-relaunch-blob-w--a" aria-hidden>
          <div className="home-relaunch-blob home-relaunch-blob-a" />
        </div>
        <div className="home-relaunch-blob-w home-relaunch-blob-w--b" aria-hidden>
          <div className="home-relaunch-blob home-relaunch-blob-b" />
        </div>
        <div className="home-relaunch-blob-w home-relaunch-blob-w--c" aria-hidden>
          <div className="home-relaunch-blob home-relaunch-blob-c" />
        </div>
        <div className="home-relaunch-blob-w home-relaunch-blob-w--d" aria-hidden>
          <div className="home-relaunch-blob home-relaunch-blob-d" />
        </div>
        <div className="home-relaunch-dot-field" />
        <div className="home-relaunch-vignette-top" />
      </div>

      <div
        className={cn(
          'relative z-10 flex min-h-screen flex-col text-slate-100',
          showMobileDock && useScheduler && 'pb-[5.75rem] md:pb-0'
        )}
      >
        {preHeaderSlot}
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
          desktopContactTrackingSource={headerDesktopContactTs}
          desktopSecondaryTrackingSource={headerDesktopSecondaryTs}
          mobileNavPrimaryTrackingSource={headerMobilePrimaryTs}
          mobileNavSecondaryTrackingSource={headerMobileSecondaryTs}
          desktopHeaderDataHubCta={desktopHeaderDataHubCta}
        />
        {children}
        {showFooter ? <HomeRelaunchFooter locale={locale} /> : null}
        {showMobileDock && useScheduler ? (
          <HomeMobileCtaDock
            locale={locale}
            bookingHref={schedulerHref}
            secondaryHref={dockSecondaryHref}
            secondaryLabel={dockSecondaryLabel}
          />
        ) : null}
      </div>
    </div>
  );
}
