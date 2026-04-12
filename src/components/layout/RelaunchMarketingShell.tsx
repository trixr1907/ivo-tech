'use client';

import type { ReactNode } from 'react';

import { HomeBackgroundFXClient } from '@/app-pages/HomeBackgroundFXClient';
import { HomeRelaunchFooter } from '@/components/home/HomeRelaunchFooter';
import { RelaunchStickyHeader, type RelaunchNavLink } from '@/components/layout/RelaunchStickyHeader';
import type { Locale } from '@/content/copy';

type RelaunchMarketingShellProps = {
  locale: Locale;
  homeHref: string;
  navLinks: RelaunchNavLink[];
  desktopCtaHref: string;
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
  desktopHeaderDataHubCta
}: RelaunchMarketingShellProps) {
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

      <div className="relative z-10 flex min-h-screen flex-col text-slate-100">
        <RelaunchStickyHeader
          locale={locale}
          navLinks={navLinks}
          homeHref={homeHref}
          desktopCtaHref={desktopCtaHref}
          desktopCtaLabel={desktopCtaLabel}
          mobileNavCtaLabel={mobileNavCtaLabel}
          mobileNavCtaHref={mobileNavCtaHref}
          mobileNavCtaIntent={mobileNavCtaIntent}
          heroVariant={heroVariant}
          desktopContactTrackingSource={desktopContactTrackingSource}
          mobileNavPrimaryTrackingSource={mobileNavPrimaryTrackingSource}
          desktopHeaderDataHubCta={desktopHeaderDataHubCta}
        />
        {children}
        {showFooter ? <HomeRelaunchFooter locale={locale} /> : null}
      </div>
    </div>
  );
}
