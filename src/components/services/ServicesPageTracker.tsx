'use client';

import { useEffect } from 'react';

import { trackEvent } from '@/lib/analytics';

type Props = {
  locale: 'de' | 'en';
};

export function ServicesPageTracker({ locale }: Props) {
  useEffect(() => {
    const source = new URLSearchParams(window.location.search).get('source') ?? 'direct';
    const path = `${window.location.pathname}${window.location.search}`;

    trackEvent('service_page_view', { locale, source, path });

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const cta = target.closest<HTMLElement>('[data-service-cta]');
      if (!cta) return;

      const placement = cta.getAttribute('data-service-cta') ?? 'unknown';
      const href = cta.getAttribute('href') ?? '';

      trackEvent('service_cta_click', {
        locale,
        source,
        placement,
        href,
        path
      });
      trackEvent('section_cta_click', {
        locale,
        source,
        placement,
        href,
        path
      });
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [locale]);

  return null;
}
