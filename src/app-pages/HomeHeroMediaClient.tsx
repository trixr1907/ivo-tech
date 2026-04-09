'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';

import type { Locale } from '@/content/copy';
import type { Project, ProjectTeaserMedia } from '@/content/projects';
import { trackEvent } from '@/lib/analytics';

type Props = {
  locale: Locale;
  heroMedia?: ProjectTeaserMedia;
  heroProject?: Project | null;
};

function getPath() {
  return `${window.location.pathname}${window.location.search}`;
}

export function HomeHeroMediaClient({ locale, heroMedia, heroProject }: Props) {
  const [isHeroVideoActive, setIsHeroVideoActive] = useState(false);
  const didTrackHeroVideo = useRef(false);
  const hasHeroVideo = Boolean(heroMedia?.videoMp4 || heroMedia?.videoWebm);
  const posterSrc = heroMedia?.poster ?? heroProject?.thumbSrc ?? '/assets/thumb_viewer_neon.avif';

  return (
    <article className="hero-media-card motion-depth-drift" aria-label={locale === 'de' ? 'Hero Case Teaser' : 'Hero case teaser'}>
      {hasHeroVideo ? (
        <div className="hero-teaser-poster">
          {!isHeroVideoActive ? (
            <>
              <Image src={posterSrc} alt="" fill sizes="(max-width: 900px) 92vw, 520px" className="hero-teaser-image" />
              <button
                type="button"
                className="hero-teaser-trigger"
                onClick={() => {
                  setIsHeroVideoActive(true);
                  trackEvent('hero_video_play', { source: 'hero_teaser_trigger', locale, path: getPath() });
                }}
              >
                {locale === 'de' ? 'Teaser laden' : 'Load teaser'}
              </button>
            </>
          ) : (
            <video
              className="hero-teaser-video"
              muted
              loop
              autoPlay
              playsInline
              controls
              preload="metadata"
              poster={posterSrc}
              onPlay={() => {
                if (didTrackHeroVideo.current) return;
                didTrackHeroVideo.current = true;
                trackEvent('hero_video_play', { source: 'hero_teaser', locale, path: getPath() });
              }}
            >
              {heroMedia?.videoWebm ? <source src={heroMedia.videoWebm} type="video/webm" /> : null}
              {heroMedia?.videoMp4 ? <source src={heroMedia.videoMp4} type="video/mp4" /> : null}
            </video>
          )}
        </div>
      ) : (
        <div className="hero-teaser-poster">
          <Image src={posterSrc} alt="" fill sizes="(max-width: 900px) 92vw, 520px" className="hero-teaser-image" />
        </div>
      )}
      <p className="hero-media-caption">
        {heroMedia?.caption[locale] ??
          (locale === 'de'
            ? '36s Brand-Teaser: Authority-first Engineering von Proof bis Live-Handoff.'
            : '36s brand teaser: authority-first engineering from proof to live handoff.')}
      </p>
    </article>
  );
}
