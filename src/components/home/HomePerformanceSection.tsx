'use client';

import { HomeCryptoLiveStrip } from '@/components/home/HomeCryptoLiveStrip';
import { HomePerformanceCanvas } from '@/components/home/HomePerformanceCanvas';
import type { Locale } from '@/content/copy';
import { getHomePerformanceCopy } from '@/content/homeRelaunchPerformance';
import { useReducedMotion } from 'framer-motion';

type HomePerformanceSectionProps = {
  locale: Locale;
};

export function HomePerformanceSection({ locale }: HomePerformanceSectionProps) {
  const t = getHomePerformanceCopy(locale);
  const reduce = useReducedMotion();

  return (
    <div className="relative -mt-1 min-h-[min(85vh,56rem)] overflow-x-clip">
      <HomePerformanceCanvas reducedMotion={!!reduce} />
      <div className="relative z-[1] mx-auto flex w-full max-w-4xl flex-col px-4 pb-20 pt-14 text-center sm:pt-20 md:px-6">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-cyan-300/90">{t.eyebrow}</p>
        <h2 id="home-performance-heading" className="home-section-h2-primary mt-3 text-balance">
          {t.title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">{t.lead}</p>

        <div className="mt-10 w-full max-w-3xl self-center">
          <HomeCryptoLiveStrip locale={locale} />
        </div>

        <p className="mt-14 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-emerald-200/85">{t.webBlockTitle}</p>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-500">{t.webBlockSub}</p>

        <ul className="mt-6 grid w-full max-w-3xl grid-cols-1 gap-3 self-center sm:grid-cols-3" role="list">
          {t.stats.map((s) => (
            <li
              key={s.label}
              className="rounded-2xl border border-slate-800/80 bg-slate-950/55 px-4 py-3 text-left shadow-[0_0_0_1px_rgba(56,189,248,0.04)] sm:text-center"
            >
              <p className="font-mono text-xl font-bold tabular-nums text-emerald-200/95 md:text-2xl">{s.value}</p>
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.1em] text-slate-400">{s.label}</p>
              <p className="mt-1.5 text-xs text-slate-500">{s.hint}</p>
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-8 max-w-2xl text-xs leading-relaxed text-slate-500">{t.footnote}</p>
      </div>
    </div>
  );
}
