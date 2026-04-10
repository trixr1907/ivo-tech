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
  activeSection?: string;
  onLinkClick?: (href: string) => void;
};

export function HomeMobileNav({ locale, links, ctaLabel, heroVariant, activeSection, onLinkClick }: HomeMobileNavProps) {
  const contactHref = `${getContactPath(locale, 'home_mobile_nav_primary')}&exp_hero=${encodeURIComponent(heroVariant)}`;

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="md:hidden"
          aria-label={locale === 'de' ? 'Navigation öffnen' : 'Open navigation'}
        >
          <Menu className="h-4 w-4" aria-hidden="true" />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-[84vw] max-w-sm flex-col gap-6 border-l border-slate-200 bg-white p-6 shadow-2xl focus:outline-none">
          <Dialog.Title className="sr-only">{locale === 'de' ? 'Mobile Navigation' : 'Mobile navigation'}</Dialog.Title>
          <Dialog.Description className="sr-only">
            {locale === 'de' ? 'Springe direkt zu den Hauptbereichen der Seite.' : 'Jump directly to the main sections of the page.'}
          </Dialog.Description>
          <div className="flex items-center justify-between">
            <p className="font-display text-base font-semibold text-ink-900">ivo-tech</p>
            <Dialog.Close asChild>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-ink-700 transition hover:bg-slate-100"
                aria-label={locale === 'de' ? 'Navigation schließen' : 'Close navigation'}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>

          <nav aria-label={locale === 'de' ? 'Mobile Navigation' : 'Mobile navigation'} className="flex flex-col gap-2">
            {links.map((link) => (
              <Dialog.Close key={link.href} asChild>
                <a
                  className={cn(
                    'rounded-lg px-3 py-2 text-base font-medium text-ink-800 transition hover:bg-slate-100',
                    activeSection === link.href.replace('#', '') ? 'bg-brand-50 text-brand-800 ring-1 ring-brand-200' : ''
                  )}
                  href={link.href}
                  onClick={() => onLinkClick?.(link.href)}
                >
                  {link.label}
                </a>
              </Dialog.Close>
            ))}
          </nav>

          <div className="mt-auto space-y-3">
            <Dialog.Close asChild>
              <Button asChild variant="default" className="w-full">
                <a
                  href={contactHref}
                  onClick={() => {
                    const path = `${window.location.pathname}${window.location.search}`;
                    trackEvent('hero_cta_click', { source: 'home_mobile_nav_primary', locale, path, intent: 'client', variant: heroVariant });
                    trackEvent('cta_primary_click', { source: 'home_mobile_nav_primary', locale, path, intent: 'client', variant: heroVariant });
                  }}
                >
                  {ctaLabel}
                </a>
              </Button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <Button asChild variant="ghost" className="w-full">
                <Link href={locale === 'de' ? '/en' : '/'}>{locale === 'de' ? 'Switch to English' : 'Auf Deutsch wechseln'}</Link>
              </Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
