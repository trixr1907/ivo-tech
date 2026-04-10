import * as React from 'react';

import { cn } from '@/lib/cn';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'min-h-[120px] w-full rounded-xl border border-sky-200 bg-[linear-gradient(180deg,#ffffff_0%,#eef6ff_100%)] px-3 py-2 text-sm text-ink-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] placeholder:text-slate-400 transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:border-brand-400 focus-visible:shadow-[0_0_0_4px_rgba(56,130,246,0.16)] disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

export { Textarea };
