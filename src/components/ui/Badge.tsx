import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

type BadgeTone = 'default' | 'success' | 'warning' | 'error';

type Props = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
};

export function Badge({ tone = 'default', className, ...rest }: Props) {
  return <span {...rest} className={cn('ui-badge', `ui-badge--${tone}`, className)} />;
}
