'use client';

import { useEffect, useRef } from 'react';

import { Logo } from '@/components/brand/Logo';
import { attachLogoHover, playLogoReveal, type LogoMotionTheme, type LogoMotionTier } from '@/lib/logoMotion';

type BrandLockupVariant = 'header' | 'compact' | 'meta';

type BrandLockupProps = {
  variant: BrandLockupVariant;
  className?: string;
  theme?: LogoMotionTheme;
  motionTier?: LogoMotionTier;
  systemPreset?: 'ref103632';
  visualPreset?: 'default' | 'premium';
  edgeGlow?: 'off' | 'soft' | 'medium';
};

function joinClassNames(...parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export function BrandLockup({
  variant,
  className,
  theme = 'dark',
  motionTier = 'tier1',
  systemPreset = 'ref103632',
  visualPreset = 'premium',
  edgeGlow = 'medium'
}: BrandLockupProps) {
  const rootRef = useRef<HTMLSpanElement | null>(null);
  const rootClassName = joinClassNames(
    'brand-lockup',
    `brand-lockup--${variant}`,
    `brand-lockup--preset-${systemPreset}`,
    `brand-lockup--visual-${visualPreset}`,
    `brand-lockup--edge-${edgeGlow}`,
    className
  );
  const showWordmark = variant !== 'meta';
  const priority = variant === 'header';
  const markKind = variant === 'meta' ? 'micro' : 'core';
  const showSingleLockup = variant !== 'meta';
  const logoStyle = visualPreset === 'premium' ? 'premium' : 'static';
  const markVariant = markKind === 'micro' ? 'mark-micro' : 'mark-core';

  useEffect(() => {
    const host = rootRef.current;
    if (!host) return;
    host.classList.add('is-logo-ready');
    const cleanupHover = attachLogoHover(host, { mobileTapBoost: true });
    void playLogoReveal(host, motionTier, theme);
    return cleanupHover;
  }, [motionTier, systemPreset, theme, variant]);

  return (
    <span
      ref={rootRef}
      className={rootClassName}
      role="img"
      aria-label="ivo-tech"
      data-logo-theme={theme}
      data-logo-preset={systemPreset}
      data-logo-visual={visualPreset}
      data-logo-edge={edgeGlow}
    >
      {showSingleLockup ? (
        <span className="brand-lockup-lockup-wrap">
          <Logo
            className="brand-lockup-lockup"
            variant="lockup-horizontal"
            tone={theme}
            style={logoStyle}
            size={760}
            alt=""
            priority={priority}
          />
        </span>
      ) : (
        <>
          <span className="brand-lockup-mark-wrap">
            <Logo
              className="brand-lockup-mark"
              variant={markVariant}
              tone={theme}
              style={markKind === 'micro' ? 'static' : logoStyle}
              size={1024}
              alt=""
              priority={priority}
            />
            <svg className="brand-lockup-flow" viewBox="0 0 100 100" aria-hidden="true">
              <path className="brand-lockup-flow-path" d="M16 66 L35 45 L55 45 L70 32 L88 32" />
            </svg>
          </span>

          {showWordmark ? (
            <span className="brand-lockup-wordmark-wrap">
              <Logo
                className="brand-lockup-wordmark"
                variant="wordmark"
                tone={theme}
                style={logoStyle}
                size={2080}
                alt=""
                priority={priority}
              />
            </span>
          ) : null}
        </>
      )}
    </span>
  );
}
