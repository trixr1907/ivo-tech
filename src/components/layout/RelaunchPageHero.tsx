import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';
import { RELAUNCH_EYEBROW_INLINE } from '@/lib/relaunchMarketingStyles';

export type RelaunchPageHeroSurface = 'card' | 'stack' | 'minimal';

type RelaunchPageHeroProps = {
  surface?: RelaunchPageHeroSurface;
  /** `accent` = `home-eyebrow` (Linie). `inline` = kompakte Zeile. */
  eyebrowMode?: 'accent' | 'inline';
  eyebrow: ReactNode;
  title: ReactNode;
  titleId: string;
  description?: ReactNode;
  /** Optionale Klassen auf H1 (z. B. größerer Dankes-Screen). */
  titleClassName?: string;
  /** Nur bei `surface="card"`. */
  sectionId?: string;
  className?: string;
  children?: ReactNode;
};

/**
 * Einheitlicher Seiten-Kopf: Eyebrow, H1 (`.relaunch-page-hero-h1`), Lead (`.relaunch-page-hero-lead`).
 * - `card`: `home-hero-card` + Dot-Grid (z. B. Leistungen)
 * - `stack`: Block in `RELAUNCH_SECTION` / freistehend
 * - `minimal`: wie `stack`, typisch mit `eyebrowMode="inline"`
 */
export function RelaunchPageHero({
  surface = 'stack',
  eyebrowMode = 'accent',
  eyebrow,
  title,
  titleId,
  description,
  titleClassName,
  sectionId,
  className,
  children
}: RelaunchPageHeroProps) {
  const eyebrowClass = eyebrowMode === 'inline' ? RELAUNCH_EYEBROW_INLINE : 'home-eyebrow';

  const body = (
    <>
      <p className={eyebrowClass}>{eyebrow}</p>
      <h1 id={titleId} className={cn('relaunch-page-hero-h1 mt-1 max-w-[40ch]', titleClassName)}>
        {title}
      </h1>
      {description != null && description !== '' ? <p className="relaunch-page-hero-lead mt-4">{description}</p> : null}
      {children}
    </>
  );

  if (surface === 'card') {
    return (
      <section
        id={sectionId}
        aria-labelledby={titleId}
        className={cn('home-hero-card relative mb-10', className)}
      >
        <div className="home-hero-dot-grid" aria-hidden="true" />
        <div className="relative z-[1]">{body}</div>
      </section>
    );
  }

  if (surface === 'minimal') {
    return (
      <div className={cn('relaunch-page-hero relaunch-page-hero--minimal', className)}>{body}</div>
    );
  }

  return <div className={cn('relaunch-page-hero relaunch-page-hero--stack', className)}>{body}</div>;
}
