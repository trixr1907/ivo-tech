'use client';

import Image from 'next/image';
import { useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

import type { Locale } from '@/content/copy';
import type { ProjectTeaserMedia } from '@/content/projects';
import { trackEvent } from '@/lib/analytics';

type Props = {
  locale: Locale;
  heroMedia?: ProjectTeaserMedia;
  thumbSrc?: string;
};

function getPath() {
  if (typeof window === 'undefined') return '/';
  return `${window.location.pathname}${window.location.search}`;
}

export function HomeRelaunchHeroSnapshot({ locale, heroMedia, thumbSrc }: Props) {
  const prefersReducedMotion = useReducedMotion();
  const didTrackPlay = useRef(false);
  const hasVideo = Boolean(heroMedia?.videoMp4 || heroMedia?.videoWebm);
  const posterSrc = heroMedia?.poster ?? thumbSrc ?? '/assets/thumb_viewer_neon.avif';
  const showVideo = hasVideo && !prefersReducedMotion;

  const onVideoPlay = () => {
    if (didTrackPlay.current) return;
    didTrackPlay.current = true;
    trackEvent('hero_video_play', { source: 'home_relaunch_hero_snapshot', locale, path: getPath() });
  };

  return (
    <div
      className="relative flex min-h-[168px] items-center justify-center overflow-hidden rounded-xl border border-slate-800/90 bg-slate-950/50"
      aria-label={locale === 'de' ? 'Case-Teaser' : 'Case teaser'}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(56,189,248,0.12),transparent_55%)]" />
      {showVideo ? (
        <video
          className="relative z-[1] aspect-video w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={posterSrc}
          onPlay={onVideoPlay}
        >
          {heroMedia?.videoWebm ? <source src={heroMedia.videoWebm} type="video/webm" /> : null}
          {heroMedia?.videoMp4 ? <source src={heroMedia.videoMp4} type="video/mp4" /> : null}
        </video>
      ) : (
        <div className="relative z-[1] flex min-h-[160px] w-full items-center justify-center px-6 py-8">
          <Image
            src={posterSrc}
            alt=""
            width={520}
            height={292}
            className="h-auto max-h-[200px] w-full max-w-[280px] object-contain opacity-95 md:max-w-[320px]"
            sizes="(max-width: 1024px) 85vw, 320px"
            priority
          />
        </div>
      )}
    </div>
  );
}
