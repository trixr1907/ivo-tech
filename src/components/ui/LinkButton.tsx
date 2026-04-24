import type { VariantProps } from 'class-variance-authority';
import Link, { type LinkProps } from 'next/link';
import type { ReactNode } from 'react';

import { Button, buttonVariants } from '@/components/shadcn/button';

export type LinkButtonProps = LinkProps &
  VariantProps<typeof buttonVariants> & {
    className?: string;
    children: ReactNode;
  };

/** Next.js-`Link` mit shadcn-Button-Styles (v0/shadcn-kompatibel, `asChild`-Muster). */
export function LinkButton({ className, variant, size, children, ...linkProps }: LinkButtonProps) {
  return (
    <Button asChild variant={variant ?? 'default'} size={size} className={className}>
      <Link {...linkProps}>{children}</Link>
    </Button>
  );
}
