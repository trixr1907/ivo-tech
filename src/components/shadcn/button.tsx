import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/cn';

/**
 * Primäre Button-Styles für Relaunch / Marketing (shadcn „new-york“ + Design-Tokens).
 * v0.dev-Output: hier einfügen und Varianten ggf. in `buttonVariants` ergänzen.
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-bg-base)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-ink-900 text-white shadow-sm hover:bg-[color:var(--metal-880)]',
        secondary: 'bg-brand-50 text-brand-700 shadow-sm hover:bg-brand-100',
        outline:
          'border border-slate-300 bg-white text-ink-900 shadow-sm hover:border-brand-500 hover:text-brand-700 dark:border-slate-600 dark:bg-slate-950/40 dark:text-slate-100',
        /** Outline auf dunklen Flächen (Hero, Marketing-Shell) — ersetzt lange Tailwind-Duplikate */
        onDark:
          'border border-slate-600 bg-transparent text-slate-100 shadow-none hover:border-slate-500 hover:bg-slate-800/60',
        ghost: 'text-ink-700 shadow-none hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60',
        link: 'text-brand-600 underline-offset-4 shadow-none hover:underline dark:text-sky-400',
        mono:
          'border border-slate-700/80 bg-slate-950/55 font-mono text-xs uppercase tracking-[0.16em] text-slate-300 shadow-[0_0_0_1px_rgba(148,163,184,0.08)] hover:border-sky-400/35 hover:bg-slate-900/70 hover:text-sky-100',
        destructive: 'bg-red-600 text-white shadow-sm hover:bg-red-500',
        /** Primär-CTA mit Verlauf (Startseite, Thanks) */
        hero: 'min-h-12 border-0 bg-gradient-to-r from-sky-500 to-blue-500 px-6 text-white shadow-[0_0_28px_rgba(14,165,233,0.32)] hover:from-sky-400 hover:to-blue-400 hover:shadow-[0_0_36px_rgba(14,165,233,0.42)]'
      },
      size: {
        default: 'h-11 px-5',
        sm: 'h-9 rounded-lg px-3 text-xs',
        lg: 'h-12 rounded-xl px-6 text-base',
        icon: 'h-11 w-11 p-0'
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
