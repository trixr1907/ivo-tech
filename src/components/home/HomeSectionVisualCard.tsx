'use client';

import { ArrowRight } from 'lucide-react';
import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import type { Locale } from '@/content/copy';
import type { HomeVisualAsset } from '@/content/homeVisuals';

type HomeSectionVisualCardProps = {
  asset: HomeVisualAsset;
  locale: Locale;
  title: string;
  className?: string;
  linkHref?: string;
  linkLabel?: string;
  onLinkClick?: () => void;
  priority?: boolean;
};

function toClassName(parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(' ');
}

export function HomeSectionVisualCard({
  asset,
  locale,
  title,
  className,
  linkHref,
  linkLabel,
  onLinkClick,
  priority
}: HomeSectionVisualCardProps) {
  const reduceMotion = useReducedMotion();
  const sources = useMemo(
    () => [asset.sources.avif, asset.sources.webp, asset.sources.fallback],
    [asset.sources.avif, asset.sources.webp, asset.sources.fallback]
  );
  const [sourceIndex, setSourceIndex] = useState(0);
  const isExternalLink = Boolean(linkHref && /^https?:\/\//.test(linkHref));

  return (
    <LazyMotion features={domAnimation}>
      <m.figure
        className={toClassName(['home-section-visual-card', className])}
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.22 }}
        transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="home-section-visual-media">
          <Image
            src={sources[sourceIndex] ?? asset.sources.fallback}
            alt={asset.alt[locale]}
            width={asset.width}
            height={asset.height}
            sizes="(max-width: 767px) 92vw, (max-width: 1279px) 46vw, 520px"
            priority={priority ?? asset.priority === 'high'}
            className="home-section-visual-image"
            onError={() => setSourceIndex((current) => Math.min(current + 1, sources.length - 1))}
          />
        </div>
        <figcaption className="home-section-visual-caption-wrap">
          <p className="home-section-visual-title">{title}</p>
          <p className="home-section-visual-caption">{asset.caption[locale]}</p>
          {linkHref && linkLabel ? (
            isExternalLink ? (
              <a
                href={linkHref}
                target="_blank"
                rel="noopener noreferrer"
                className="home-section-visual-link min-h-12"
                onClick={onLinkClick}
              >
                {linkLabel}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            ) : (
              <Link
                href={linkHref}
                className="home-section-visual-link min-h-12"
                onClick={onLinkClick}
              >
                {linkLabel}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            )
          ) : null}
        </figcaption>
      </m.figure>
    </LazyMotion>
  );
}
