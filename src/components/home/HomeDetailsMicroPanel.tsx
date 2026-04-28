'use client';

import type { Locale } from '@/content/copy';
import { getHomeDetailsMicroCopy } from '@/content/homeRelaunchPerformance';
import { cn } from '@/lib/cn';
import { useState } from 'react';

type Level = 'focus' | 'error' | 'warning';
type Act = 'click' | 'hover';

type HomeDetailsMicroPanelProps = {
  locale: Locale;
};

const levelClass: Record<Level, string> = {
  focus: 'home-micro-panel--focus',
  error: 'home-micro-panel--error',
  warning: 'home-micro-panel--warning'
};

export function HomeDetailsMicroPanel({ locale }: HomeDetailsMicroPanelProps) {
  const t = getHomeDetailsMicroCopy(locale);
  const [level, setLevel] = useState<Level>('focus');
  const [act, setAct] = useState<Act>('hover');
  const [pulsed, setPulsed] = useState(false);

  return (
    <div className="home-micro-outer">
      <p className="text-center text-sm font-bold text-slate-200 md:text-left">{t.title}</p>
      <p className="mt-2 text-center text-xs leading-relaxed text-slate-500 md:text-left">{t.hint}</p>

      <div
        className="mt-4 flex flex-wrap justify-center gap-1.5 md:justify-start"
        role="group"
        aria-label={t.title}
      >
        {t.levels.map((lv) => {
          const active = level === lv.id;
          return (
            <button
              key={lv.id}
              type="button"
              className={cn(
                'home-micro-pill',
                active && (lv.id === 'focus' ? 'home-micro-pill--focus' : lv.id === 'error' ? 'home-micro-pill--error' : 'home-micro-pill--warning')
              )}
              aria-pressed={active}
              onClick={() => setLevel(lv.id)}
            >
              {lv.label}
            </button>
          );
        })}
      </div>

      <p className="mt-5 text-center text-[0.6rem] font-bold uppercase tracking-[0.12em] text-slate-500 md:text-left">
        {t.actionTitle} · {t.actions.map((a) => a.label).join(' · ')}
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-1.5 md:justify-start" role="group" aria-label={t.actionTitle}>
        {t.actions.map((a) => {
          const active = act === a.id;
          return (
            <button
              key={a.id}
              type="button"
              className={cn('home-micro-pill home-micro-pill--ghost', active && 'home-micro-pill--ghost-active')}
              aria-pressed={active}
              onClick={() => {
                setAct(a.id);
                if (a.id === 'click') {
                  setPulsed(true);
                  window.setTimeout(() => setPulsed(false), 420);
                }
              }}
              onMouseEnter={() => {
                if (a.id === 'hover' && act === 'hover') setPulsed(true);
              }}
              onMouseLeave={() => {
                if (a.id === 'hover' && act === 'hover') setPulsed(false);
              }}
            >
              {a.label}
            </button>
          );
        })}
      </div>

      <div
        className={cn(
          'home-micro-panel',
          levelClass[level],
          pulsed && 'home-micro-panel--pulse',
          act === 'click' && 'home-micro-panel--click cursor-pointer'
        )}
        onMouseEnter={() => {
          if (act === 'hover') setPulsed(true);
        }}
        onMouseLeave={() => {
          if (act === 'hover') setPulsed(false);
        }}
        onClick={() => {
          if (act !== 'click') return;
          setPulsed(true);
          window.setTimeout(() => setPulsed(false), 420);
        }}
        onKeyDown={(e) => {
          if (act !== 'click' || (e.key !== 'Enter' && e.key !== ' ')) return;
          e.preventDefault();
          setPulsed(true);
          window.setTimeout(() => setPulsed(false), 420);
        }}
        tabIndex={act === 'click' ? 0 : -1}
      >
        <p className="text-[0.6rem] font-bold uppercase tracking-[0.1em] text-slate-500">{t.panelLabel}</p>
        <p className="mt-2 text-sm font-medium leading-relaxed text-slate-200">{t.microCopy[level]}</p>
        <p className="mt-2 font-mono text-[0.6rem] text-slate-500" aria-hidden="true">
          state={level} · {act}
        </p>
      </div>
    </div>
  );
}
