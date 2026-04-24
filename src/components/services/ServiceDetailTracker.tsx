'use client';

import { useEffect } from 'react';

import type { ServiceDetailSlug } from '@/content/services';
import { trackEvent } from '@/lib/analytics';

type Props = {
  locale: 'de' | 'en';
  slug: ServiceDetailSlug;
};

export function ServiceDetailTracker({ locale, slug }: Props) {
  useEffect(() => {
    const source = new URLSearchParams(window.location.search).get('source') ?? 'direct';
    const path = `${window.location.pathname}${window.location.search}`;

    trackEvent('service_detail_view', { locale, slug, source, path });

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const cta = target.closest<HTMLElement>('[data-service-detail-cta]');
      if (!cta) return;

      const placement = cta.getAttribute('data-service-detail-cta') ?? 'unknown';
      const href = cta.getAttribute('href') ?? '';

      trackEvent('service_detail_cta_click', {
        locale,
        slug,
        source,
        placement,
        href,
        path
      });
      trackEvent('section_cta_click', {
        locale,
        slug,
        source,
        placement,
        href,
        path
      });
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [locale, slug]);

  return null;
}
