import type * as React from 'react';

import { cn } from '@/lib/cn';

type CardSurface = 'default' | 'marketing' | 'spotlight';

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  surface?: CardSurface;
  interactive?: boolean;
};

const cardSurfaceClass: Record<CardSurface, string> = {
  default: 'rounded-2xl border border-slate-200 bg-white shadow-card',
  marketing:
    'rounded-2xl bg-slate-900/55 text-slate-100 shadow-[0_0_0_1px_rgba(148,163,184,0.12),0_18px_48px_rgba(2,6,23,0.36)] backdrop-blur-xl',
  spotlight:
    'rounded-2xl bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_34%),linear-gradient(145deg,rgba(15,23,42,0.88),rgba(2,6,23,0.96))] text-slate-100 shadow-[0_0_0_1px_rgba(125,211,252,0.16),0_24px_70px_rgba(2,6,23,0.46)] ring-1 ring-sky-300/20 backdrop-blur-xl'
};

export function Card({ className, surface = 'default', interactive = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        cardSurfaceClass[surface],
        interactive &&
          'transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-900/70 hover:shadow-[0_0_0_1px_rgba(125,211,252,0.34),0_22px_56px_rgba(2,6,23,0.45)]',
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('space-y-1.5 p-6', className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('font-display text-lg font-semibold tracking-tight text-ink-900', className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm leading-relaxed text-ink-500', className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6 pt-0', className)} {...props} />;
}
