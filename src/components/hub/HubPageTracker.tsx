'use client';

import { useEffect } from 'react';

import { trackEvent } from '@/lib/analytics';

type Props = {
  locale: 'de' | 'en';
  kind: 'insights' | 'playbooks' | 'case-studies';
  pageType: 'index' | 'detail';
  slug?: string;
};

export function HubPageTracker({ locale, kind, pageType, slug }: Props) {
  useEffect(() => {
    const source = new URLSearchParams(window.location.search).get('source') ?? 'direct';
    const path = `${window.location.pathname}${window.location.search}`;

    trackEvent('hub_page_view', { locale, kind, pageType, slug, source, path });

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const cta = target.closest<HTMLElement>('[data-hub-cta]');
      if (!cta) return;

      const placement = cta.getAttribute('data-hub-cta') ?? 'unknown';
      const href = cta.getAttribute('href') ?? '';

      trackEvent('hub_cta_click', {
        locale,
        kind,
        pageType,
        slug,
        source,
        placement,
        href,
        path
      });
      trackEvent('section_cta_click', {
        locale,
        kind,
        pageType,
        slug,
        source,
        placement,
        href,
        path
      });
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [kind, locale, pageType, slug]);

  return null;
}
