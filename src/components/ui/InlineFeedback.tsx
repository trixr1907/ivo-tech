import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

type FeedbackTone = 'info' | 'success' | 'warning' | 'error';

type Props = HTMLAttributes<HTMLParagraphElement> & {
  tone?: FeedbackTone;
};

export function InlineFeedback({ tone = 'info', className, ...rest }: Props) {
  return <p {...rest} className={cn('ui-inline-feedback', `ui-inline-feedback--${tone}`, className)} />;
}
