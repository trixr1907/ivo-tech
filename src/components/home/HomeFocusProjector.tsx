'use client';

import { Button } from '@/components/shadcn/button';
import type { Locale } from '@/content/copy';
import { getHomeFocusCalculatorCopy, type HomeFocusModeId } from '@/content/homeRelaunchFocusDetails';
import { trackEvent } from '@/lib/analytics';
import type { HeroVariantId } from '@/lib/heroExperiment';
import { m, useReducedMotion } from 'framer-motion';
import { useCallback, useMemo, useState } from 'react';

type HomeFocusProjectorProps = {
  locale: Locale;
  schedulerHref: string;
  heroVariant: HeroVariantId;
};

const HOURS_MIN = 5;
const HOURS_MAX = 50;
const HOURS_STEP = 5;

function computeFocusIndex(hours: number, mode: HomeFocusModeId) {
  const h = Math.min(HOURS_MAX, Math.max(HOURS_MIN, hours));
  let base = 92 - h * 1.12;
  if (mode === 'focus') base += 12;
  else if (mode === 'balanced') base += 2.5;
  else base -= 9;
  return Math.round(Math.max(22, Math.min(97, base)));
}

function bandForIndex(n: number): 'high' | 'mid' | 'low' {
  if (n >= 65) return 'high';
  if (n >= 45) return 'mid';
  return 'low';
}

export function HomeFocusProjector({ locale, schedulerHref, heroVariant }: HomeFocusProjectorProps) {
  const t = getHomeFocusCalculatorCopy(locale);
  const reduce = useReducedMotion();
  const [hours, setHours] = useState(20);
  const [mode, setMode] = useState<HomeFocusModeId>('balanced');

  const index = useMemo(() => computeFocusIndex(hours, mode), [hours, mode]);
  const band = bandForIndex(index);
  const narrative = t.narrative[band];

  const onMode = useCallback(
    (next: HomeFocusModeId) => {
      setMode(next);
      trackEvent('home_focus_projector_mode', {
        locale,
        mode: next,
        path: typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : '/',
        variant: heroVariant
      });
    },
    [heroVariant, locale]
  );

  const onHours = useCallback(
    (n: number) => {
      setHours(n);
      trackEvent('home_focus_projector_hours', {
        locale,
        hours: n,
        path: typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : '/',
        variant: heroVariant
      });
    },
    [heroVariant, locale]
  );

  return (
    <div className="home-focus-projector">
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-cyan-300/90">{t.eyebrow}</p>
      <h2 id="home-focus-lab-heading" className="home-section-h2-primary mt-2">
        {t.title}
      </h2>
      <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-400">{t.lead}</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-slate-800/90 bg-slate-950/55 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] md:p-7">
          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <label className="text-sm font-semibold text-slate-200" htmlFor="home-focus-hours">
                {t.contextLabel}
              </label>
              <span className="font-mono text-sm text-sky-300/95">
                {hours}
                {t.contextUnit}
              </span>
            </div>
            <input
              id="home-focus-hours"
              className="home-focus-range mt-4 w-full"
              type="range"
              min={HOURS_MIN}
              max={HOURS_MAX}
              step={HOURS_STEP}
              value={hours}
              onChange={(e) => onHours(Number(e.target.value))}
            />
            <div className="mt-1.5 flex justify-between font-mono text-[0.65rem] text-slate-500">
              <span>
                {HOURS_MIN}
                {t.contextUnit}
              </span>
              <span>
                {HOURS_MAX}
                {t.contextUnit}
              </span>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-sm font-semibold text-slate-200">{t.modeLabel}</p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              {t.modes.map((opt) => {
                const active = mode === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={
                      active
                        ? 'home-focus-mode home-focus-mode--active'
                        : 'home-focus-mode'
                    }
                    onClick={() => onMode(opt.id)}
                    aria-pressed={active}
                  >
                    <span className="block font-semibold text-slate-100">{opt.label}</span>
                    <span className="mt-0.5 block text-left text-xs font-normal text-slate-500">{opt.hint}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <m.div
          className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-indigo-500/20 bg-linear-to-br from-indigo-950/50 via-slate-950/60 to-slate-950 p-5 md:p-7"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          key={`${index}-${mode}`}
          transition={{ duration: reduce ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-violet-500/12 blur-3xl" aria-hidden="true" />
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-indigo-200/80">{t.outputLabel}</p>
            <p className="mt-2 font-display text-5xl font-bold tabular-nums tracking-tight text-white md:text-6xl">
              {index}
              <span className="text-2xl font-semibold text-slate-500 md:text-3xl">/100</span>
            </p>
            <p className="mt-2 text-sm text-slate-400">{t.outputSub}</p>
          </div>
          <p className="mt-6 border-t border-indigo-500/15 pt-4 text-sm leading-relaxed text-slate-300">{narrative}</p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Button asChild variant="hero" size="default">
              <a
                href={schedulerHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent('home_focus_projector_cta', {
                    locale,
                    intent: 'client',
                    path: typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : '/',
                    variant: heroVariant
                  })
                }
              >
                {t.cta}
              </a>
            </Button>
            <p className="max-w-xs text-xs text-slate-500">{t.ctaNote}</p>
          </div>
        </m.div>
      </div>

      <p className="mt-6 text-center text-xs leading-relaxed text-slate-500">{t.disclaimer}</p>
    </div>
  );
}
