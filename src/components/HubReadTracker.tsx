'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import type { Locale } from '@/content/copy';
import type { HubKind } from '@/content/hub';
import { trackEvent } from '@/lib/analytics';

type Props = {
  locale: Locale;
  kind: HubKind;
  slug: string;
};

export function HubReadTracker({ locale, kind, slug }: Props) {
  const pathname = usePathname() ?? '/';
  const [trackedReadDepth, setTrackedReadDepth] = useState(false);

  useEffect(() => {
    trackEvent('authority_asset_view', {
      asset: `${kind}_${slug}`,
      location: `${kind}_detail`,
      locale,
      path: pathname
    });
  }, [kind, locale, pathname, slug]);

  useEffect(() => {
    if (kind !== 'insights' || trackedReadDepth) return;

    const onScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;
      const progress = window.scrollY / totalHeight;
      if (progress >= 0.75) {
        trackEvent('insight_read_75', {
          slug,
          locale,
          path: pathname
        });
        setTrackedReadDepth(true);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [kind, locale, pathname, slug, trackedReadDepth]);

  return null;
}
