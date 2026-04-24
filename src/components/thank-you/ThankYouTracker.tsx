'use client';

import { useEffect } from 'react';

import { trackEvent } from '@/lib/analytics';

type Locale = 'de' | 'en';

type ThankYouTrackerProps = {
  locale: Locale;
  source: string;
  heroVariant: string;
};

export function ThankYouTracker({ locale, source, heroVariant }: ThankYouTrackerProps) {
  useEffect(() => {
    const path = `${window.location.pathname}${window.location.search}`;
    trackEvent('thankyou_view', { locale, source, heroVariant, path });
    trackEvent('thank_you_view', { locale, source, heroVariant, path });

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const cta = target.closest<HTMLElement>('[data-thanks-cta]');
      if (!cta) return;

      const placement = cta.getAttribute('data-thanks-cta') ?? 'unknown';
      const href = cta.getAttribute('href') ?? '';
      if (placement === 'scheduler') {
        trackEvent('scheduler_click', { locale, source, heroVariant, placement, href, path });
      }
      trackEvent('section_cta_click', { locale, source, heroVariant, placement, href, path });
      trackEvent('thank_you_cta_click', { locale, source, heroVariant, placement, href, path });
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [heroVariant, locale, source]);

  return null;
}
