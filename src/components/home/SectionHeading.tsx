import { cn } from '@/lib/cn';

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  align?: 'left' | 'center';
  tone?: 'light' | 'dark';
  className?: string;
};

export function SectionHeading({ eyebrow, title, description, align = 'left', tone = 'light', className }: SectionHeadingProps) {
  const isDark = tone === 'dark';
  return (
    <header className={cn('relative max-w-[840px] space-y-4', align === 'center' ? 'mx-auto text-center' : '', className)}>
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute -top-5 h-8 w-28 rounded-full blur-2xl',
          align === 'center' ? 'left-1/2 -translate-x-1/2' : 'left-0'
        )}
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(110,190,255,0.5) 0%, rgba(110,190,255,0) 72%)'
            : 'radial-gradient(circle, rgba(61,143,255,0.36) 0%, rgba(61,143,255,0) 72%)'
        }}
      />
      <div
        aria-hidden="true"
        className={cn('h-1.5 w-14 rounded-full', align === 'center' ? 'mx-auto' : '')}
        style={{ background: isDark ? 'linear-gradient(90deg, #38d4ff 0%, #76a0ff 100%)' : 'linear-gradient(90deg, #2d6ef5 0%, #34b8ff 100%)' }}
      />
      <p
        className={cn(
          'inline-flex rounded-full px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]',
          isDark
            ? 'border border-cyan-300/45 bg-[linear-gradient(90deg,rgba(71,190,255,0.24)_0%,rgba(112,141,255,0.24)_100%)] text-cyan-100'
            : 'border border-brand-200 bg-[linear-gradient(90deg,#edf5ff_0%,#e2f6ff_100%)] text-brand-800'
        )}
      >
        {eyebrow}
      </p>
      <h2
        className={cn('font-display text-balance font-semibold leading-[1.04]', isDark ? 'text-slate-50' : 'text-ink-900')}
        style={{ fontSize: 'clamp(2.2rem, 4.6vw, 3.75rem)' }}
      >
        {title}
      </h2>
      <p className={cn('max-w-[64ch] text-pretty text-[1.05rem] leading-relaxed md:text-[1.2rem]', isDark ? 'text-slate-200' : 'text-ink-700')}>
        {description}
      </p>
    </header>
  );
}
