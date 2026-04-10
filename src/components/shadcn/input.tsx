import * as React from 'react';

import { cn } from '@/lib/cn';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-11 w-full rounded-xl border border-sky-200 bg-[linear-gradient(180deg,#ffffff_0%,#eef6ff_100%)] px-3 py-2 text-sm text-ink-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] transition duration-200 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:border-brand-400 focus-visible:shadow-[0_0_0_4px_rgba(56,130,246,0.16)] disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export { Input };
