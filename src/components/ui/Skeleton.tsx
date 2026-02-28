import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

type Props = HTMLAttributes<HTMLDivElement> & {
  rounded?: 'sm' | 'md' | 'lg' | 'pill';
};

export function Skeleton({ rounded = 'md', className, ...rest }: Props) {
  return <div {...rest} aria-hidden="true" className={cn('ui-skeleton', `ui-skeleton--${rounded}`, className)} />;
}
