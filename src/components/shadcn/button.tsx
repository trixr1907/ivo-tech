import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-ink-900 text-white hover:bg-[#1a2a42]',
        outline: 'border border-slate-300 bg-white text-ink-900 hover:border-brand-500 hover:text-brand-700',
        secondary: 'bg-brand-50 text-brand-700 hover:bg-brand-100',
        ghost: 'text-ink-700 hover:bg-slate-100'
      },
      size: {
        default: 'h-11 px-5',
        sm: 'h-9 rounded-lg px-3',
        lg: 'h-12 rounded-xl px-6'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, style, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';
  const resolvedVariant = variant ?? 'default';
  const resolvedStyle: React.CSSProperties | undefined =
    resolvedVariant === 'default'
      ? {
          color: style?.color ?? '#ffffff',
          ...style
        }
      : style;

  return <Comp className={cn(buttonVariants({ variant: resolvedVariant, size, className }))} ref={ref} style={resolvedStyle} {...props} />;
});

Button.displayName = 'Button';

export { Button, buttonVariants };
