'use client';

import { useEffect, useRef, useState } from 'react';

import type { Locale } from '@/content/copy';
import { trackEvent } from '@/lib/analytics';

type HomeScrollProgressProps = {
  locale: Locale;
  /** Analytics `source` (default: relaunch home). */
  trackingSource?: string;
};

function scrollRatio(): number {
  const el = document.documentElement;
  const scrollable = el.scrollHeight - el.clientHeight;
  if (scrollable <= 0) return 0;
  return Math.min(1, Math.max(0, el.scrollTop / scrollable));
}

export function HomeScrollProgress({ locale, trackingSource = 'home_relaunch' }: HomeScrollProgressProps) {
  const [ratio, setRatio] = useState(0);
  const didTrack50 = useRef(false);
  const didTrack90 = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      const next = scrollRatio();
      setRatio(next);
      const path = `${window.location.pathname}${window.location.search}`;
      if (!didTrack50.current && next >= 0.5) {
        didTrack50.current = true;
        trackEvent('homepage_scroll_depth', { depth: 50, locale, path, source: trackingSource });
      }
      if (!didTrack90.current && next >= 0.9) {
        didTrack90.current = true;
        trackEvent('homepage_scroll_depth', { depth: 90, locale, path, source: trackingSource });
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [locale, trackingSource]);

  return (
    <div className="home-relaunch-scroll-progress" aria-hidden="true">
      <div className="home-relaunch-scroll-progress-bar" style={{ transform: `scaleX(${ratio})` }} />
    </div>
  );
}
