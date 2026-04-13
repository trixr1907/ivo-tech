'use client';

import * as Dialog from '@radix-ui/react-dialog';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

import { Button } from '@/components/shadcn/button';
import { trackEvent } from '@/lib/analytics';
import { cn } from '@/lib/cn';
import { getContactPath } from '@/lib/navigation';

type Locale = 'de' | 'en';

type LinkItem = {
  href: string;
  label: string;
};

type HomeMobileNavProps = {
  locale: Locale;
  links: LinkItem[];
  ctaLabel: string;
  heroVariant: 'default' | 'outcome' | 'speed';
  /** Primär-CTA-Ziel; Standard: Kontaktseite mit Attribution. */
  primaryCtaHref?: string;
  /** Zweiter CTA (z. B. Kontakt), optional. */
  secondaryCtaHref?: string;
  secondaryCtaLabel?: string;
  /** Für Analytics (`cta_primary_click` / `hero_cta_click`). */
  primaryCtaIntent?: 'hiring' | 'client' | 'collab';
  /** `source` in Analytics-Events für den primären Mobile-CTA (Standard: Home). */
  primaryTrackingSource?: string;
  secondaryTrackingSource?: string;
  activeSection?: string;
  onLinkClick?: (href: string) => void;
};

export function HomeMobileNav({
  locale,
  links,
  ctaLabel,
  heroVariant,
  primaryCtaHref,
  secondaryCtaHref,
  secondaryCtaLabel,
  primaryCtaIntent = 'client',
  primaryTrackingSource = 'home_mobile_nav_primary',
  secondaryTrackingSource = 'home_mobile_nav_secondary',
  activeSection,
  onLinkClick
}: HomeMobileNavProps) {
  const defaultContactHref = `${getContactPath(locale, 'home_mobile_nav_primary')}&exp_hero=${encodeURIComponent(heroVariant)}`;
  const primaryHref = primaryCtaHref ?? defaultContactHref;

  function trackPrimary() {
    const path = `${window.location.pathname}${window.location.search}`;
    trackEvent('hero_cta_click', {
      source: primaryTrackingSource,
      locale,
      path,
      intent: primaryCtaIntent,
      variant: heroVariant
    });
    trackEvent('cta_primary_click', {
      source: primaryTrackingSource,
      locale,
      path,
      intent: primaryCtaIntent,
      variant: heroVariant
    });
  }

  function trackSecondary() {
    const path = `${window.location.pathname}${window.location.search}`;
    trackEvent('section_cta_click', {
      source: secondaryTrackingSource,
      locale,
      path,
      intent: primaryCtaIntent,
      variant: heroVariant
    });
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="md:hidden min-h-12 min-w-12 shrink-0 border-slate-600 p-0"
          aria-label={locale === 'de' ? 'Navigation öffnen' : 'Open navigation'}
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-md" />
        <Dialog.Content
          className="fixed inset-y-0 right-0 z-50 flex w-[84vw] max-w-sm flex-col gap-0 p-0 shadow-2xl focus:outline-none"
          style={{
            background:
              'linear-gradient(to bottom right, rgba(9,17,34,0.98), rgba(6,11,22,0.97)) padding-box, linear-gradient(135deg, rgba(56,189,248,0.2) 0%, rgba(56,189,248,0.04) 50%, rgba(99,102,241,0.1) 100%) border-box',
            border: '1px solid transparent',
            borderLeft: '1px solid transparent'
          }}
        >
          <Dialog.Title className="sr-only">{locale === 'de' ? 'Mobile Navigation' : 'Mobile navigation'}</Dialog.Title>
          <Dialog.Description className="sr-only">
            {locale === 'de' ? 'Springe direkt zu den Hauptbereichen der Seite.' : 'Jump directly to the main sections of the page.'}
          </Dialog.Description>

          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800/70 px-6 py-4">
            <p className="font-display text-base font-bold tracking-tight text-slate-100">ivo-tech</p>
            <Dialog.Close asChild>
              <button
                type="button"
                className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-lg border border-slate-700/80 text-slate-400 transition hover:border-slate-500 hover:bg-slate-800/60 hover:text-slate-100"
                aria-label={locale === 'de' ? 'Navigation schließen' : 'Close navigation'}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>

          {/* Nav links */}
          <nav aria-label={locale === 'de' ? 'Mobile Navigation' : 'Mobile navigation'} className="flex flex-col gap-0.5 px-4 py-4">
            {links.map((link) => (
              <Dialog.Close key={link.href} asChild>
                <a
                  className={cn(
                    'flex min-h-12 items-center rounded-lg px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800/60 hover:text-slate-100',
                    activeSection === link.href.replace('#', '')
                      ? 'bg-sky-500/10 text-sky-300 ring-1 ring-sky-500/25'
                      : ''
                  )}
                  href={link.href}
                  onClick={() => onLinkClick?.(link.href)}
                >
                  {link.label}
                </a>
              </Dialog.Close>
            ))}
          </nav>

          {/* CTA area */}
          <div className="mt-auto space-y-2.5 border-t border-slate-800/70 px-4 py-5">
            <Dialog.Close asChild>
              <Button
                asChild
                className="h-auto min-h-12 w-full bg-gradient-to-r from-sky-500 to-blue-500 py-3 text-white hover:from-sky-400 hover:to-blue-400"
              >
                <a
                  href={primaryHref}
                  target={primaryHref.startsWith('http') ? '_blank' : undefined}
                  rel={primaryHref.startsWith('http') ? 'noopener noreferrer' : undefined}
                  onClick={trackPrimary}
                >
                  {ctaLabel}
                </a>
              </Button>
            </Dialog.Close>
            {secondaryCtaHref && secondaryCtaLabel ? (
              <Dialog.Close asChild>
                <Button asChild variant="outline" className="h-auto min-h-12 w-full border-slate-600 py-3 text-slate-100 hover:bg-slate-800/60">
                  <a href={secondaryCtaHref} onClick={trackSecondary}>
                    {secondaryCtaLabel}
                  </a>
                </Button>
              </Dialog.Close>
            ) : null}
            <Dialog.Close asChild>
              <Button
                asChild
                variant="ghost"
                className="h-auto min-h-12 w-full text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
              >
                <Link href={locale === 'de' ? '/en' : '/'}>
                  {locale === 'de' ? 'Switch to English' : 'Auf Deutsch wechseln'}
                </Link>
              </Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
