import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

/**
 * Einheitlicher Content-Rahmen für alle Seiten in `RelaunchMarketingShell`
 * (Breite, Außenabstand, vertikaler Rhythmus).
 */
const variantClass = {
  /** Standard-Marketing (Leistungen, Hub, Portfolio, …) — max 1200px */
  marketing: 'mx-auto w-full max-w-[1200px] flex-1 px-4 pb-10 pt-8 sm:px-6 md:pb-12 md:pt-10',
  /** Rechtstexte / lange Prosa */
  legal: 'mx-auto w-full max-w-4xl flex-1 px-4 pb-12 pt-10 sm:px-6 md:pt-12',
  /** Thank-you, fokussierte Lesespalte */
  reading: 'mx-auto w-full max-w-[960px] flex-1 px-4 pb-12 pt-10 sm:px-6 md:pt-12',
  /** Case-Study / Configurator — etwas luftiger, vertikale Gaps */
  configurator:
    'mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-[var(--space-9)] px-4 pb-12 pt-14 sm:px-6 max-[900px]:gap-[var(--space-7)]',
  /** 404 — zentriert, schmale Spalte */
  notFound:
    'mx-auto flex w-full max-w-[680px] flex-1 flex-col items-center justify-center px-4 pb-20 pt-16 sm:px-6',
  /** Brand-Showcase — gleicher Max-W wie Marketing, modulares Oben */
  brand:
    'brand-showcase-main mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-4 pb-12 pt-8 sm:px-6 md:pt-10',
  /** Startseite — `home-shell-container` aus home-relaunch-shell.css */
  home: 'home-shell-container mx-auto w-full flex-1 px-4 pb-24 pt-10 sm:px-6 md:pb-12 md:pt-14'
} as const;

export type RelaunchPageMainVariant = keyof typeof variantClass;

type RelaunchPageMainProps = {
  children: ReactNode;
  variant?: RelaunchPageMainVariant;
  className?: string;
  id?: string;
};

export function RelaunchPageMain({ children, variant = 'marketing', className, id = 'main-content' }: RelaunchPageMainProps) {
  return (
    <main id={id} className={cn(variantClass[variant], className)}>
      {children}
    </main>
  );
}
