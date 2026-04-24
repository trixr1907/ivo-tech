import type * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/cn';

const badgeVariants = cva('inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium', {
  variants: {
    variant: {
      neutral: 'border-slate-200 bg-slate-50 text-ink-700',
      accent: 'border-brand-200 bg-brand-50 text-brand-700'
    }
  },
  defaultVariants: {
    variant: 'neutral'
  }
});

type BadgeProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
