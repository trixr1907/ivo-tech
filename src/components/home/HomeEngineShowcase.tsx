'use client';

import type { Locale } from '@/content/copy';
import { getHomeEngineShowcaseCopy } from '@/content/homeRelaunchSections';
import { trackEvent } from '@/lib/analytics';
import { localizePath } from '@/lib/localeRouting';
import { m, useReducedMotion } from 'framer-motion';
import { ArrowRight, ChevronRight, Cpu, GitBranch, Radar } from 'lucide-react';
import Link from 'next/link';

type HomeEngineShowcaseProps = {
  locale: Locale;
};

export function HomeEngineShowcase({ locale }: HomeEngineShowcaseProps) {
  const e = getHomeEngineShowcaseCopy(locale);
  const reduce = useReducedMotion();
  const statsHref = `${localizePath('/', locale)}${e.ctaHref}`;

  const onCta = () => {
    trackEvent('section_cta_click', {
      source: 'home_engine_showcase',
      locale,
      intent: 'client',
      path: typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : '/'
    });
  };

  return (
    <m.section
      id="home-engine"
      className="home-engine scroll-mt-28"
      aria-labelledby="home-engine-heading"
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08, margin: '-6% 0px -10% 0px' }}
      transition={{ duration: reduce ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="home-engine-wrap">
        <p className="home-eyebrow">{e.groupEyebrow}</p>
        <h2 id="home-engine-heading" className="home-section-h2-primary">
          {e.groupTitle}
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-400">{e.groupLead}</p>

        <div className="home-engine-problem mt-10 rounded-2xl border border-rose-500/15 bg-linear-to-br from-rose-950/35 via-slate-950/40 to-slate-950/80 p-6 md:p-8">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-rose-300/90">{e.problemLabel}</p>
          <p className="mt-2 font-display text-2xl font-bold tracking-tight text-white md:text-3xl">{e.problemTitle}</p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 md:text-base">{e.problemSub}</p>
        </div>

        <div className="home-engine-compare mt-10 grid gap-6 lg:grid-cols-2">
          <div className="home-engine-col home-engine-col--bad">
            <div className="home-engine-col-head">
              <span className="home-engine-dot home-engine-dot--bad" aria-hidden="true" />
              <h3 className="home-engine-col-title">{e.withoutColumnTitle}</h3>
            </div>
            <div className="home-engine-budget" role="img" aria-label={`${e.loadLabel}: ${e.withoutLoad.percent}%`}>
              <div className="home-engine-budget-meta">
                <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500">{e.loadLabel}</span>
                <span className="font-mono text-xs text-rose-200/90">{e.withoutLoad.display}</span>
              </div>
              <div className="home-engine-budget-track">
                <div className="home-engine-budget-fill home-engine-budget-fill--bad" style={{ width: `${e.withoutLoad.percent}%` }} />
              </div>
              <p className="mt-1 text-right font-mono text-[0.65rem] text-rose-300/80">{e.withoutLoad.percent}%</p>
            </div>
            <pre className="home-engine-pre home-engine-pre--bad" tabIndex={0}>
              <code>
                {e.withoutLines.map((line) => (
                  <span key={line} className="home-engine-pre-line">
                    {line}
                    {'\n'}
                  </span>
                ))}
              </code>
            </pre>
          </div>

          <div className="home-engine-col home-engine-col--good">
            <div className="home-engine-col-head">
              <span className="home-engine-dot home-engine-dot--good" aria-hidden="true" />
              <h3 className="home-engine-col-title">{e.withColumnTitle}</h3>
            </div>
            <div className="home-engine-budget" role="img" aria-label={`${e.loadLabel}: ${e.withLoad.percent}%`}>
              <div className="home-engine-budget-meta">
                <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500">{e.loadLabel}</span>
                <span className="font-mono text-xs text-emerald-200/90">{e.withLoad.display}</span>
              </div>
              <div className="home-engine-budget-track">
                <div className="home-engine-budget-fill home-engine-budget-fill--good" style={{ width: `${e.withLoad.percent}%` }} />
              </div>
              <p className="mt-1 text-right font-mono text-[0.65rem] text-emerald-300/90">{e.withLoad.percent}%</p>
            </div>
            <pre className="home-engine-pre home-engine-pre--good" tabIndex={0}>
              <code>
                {e.withLines.map((line) => (
                  <span
                    key={line.text}
                    className={
                      line.type === 'pivot'
                        ? 'home-engine-line home-engine-line--pivot'
                        : line.type === 'skeleton'
                          ? 'home-engine-line home-engine-line--skel'
                          : 'home-engine-line home-engine-line--mem'
                    }
                  >
                    {line.text}
                    {'\n'}
                  </span>
                ))}
              </code>
            </pre>
            <p className="mt-3 text-center text-[0.7rem] font-medium text-emerald-300/90">
              ≈ 74% {locale === 'de' ? 'weniger Ballast pro Review' : 'less bulk per review round'}
            </p>
          </div>
        </div>

        <div className="mt-16">
          <p className="home-eyebrow">{e.howEyebrow}</p>
          <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-white md:text-3xl">{e.howTitle}</h3>
          <p className="mt-3 max-w-3xl text-base text-slate-400">{e.howSub}</p>
          <ol className="home-engine-steps">
            {e.steps.map((step) => (
              <li key={step.id} className="home-engine-step">
                <div className="home-engine-step-num" aria-hidden="true">
                  {step.id === 'map' ? <Radar className="h-5 w-5" /> : step.id === 'link' ? <GitBranch className="h-5 w-5" /> : <Cpu className="h-5 w-5" />}
                </div>
                <div>
                  <h4 className="text-base font-semibold text-slate-100">{step.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="home-engine-pipeline mt-14">
          <p className="text-center text-[0.65rem] font-bold uppercase tracking-[0.18em] text-sky-400/90">{e.archEyebrow}</p>
          <h3 className="mt-2 text-center font-display text-xl font-bold text-white md:text-2xl">{e.archTitle}</h3>
          <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-slate-500">{e.archSub}</p>
          <div className="home-engine-pipeline-row" aria-hidden="true">
            {e.archNodes.map((node, i) => (
              <div key={node} className="home-engine-pipeline-node">
                <span className="home-engine-pipeline-label">{node}</span>
                {i < e.archNodes.length - 1 ? <ChevronRight className="home-engine-pipeline-chev" /> : null}
              </div>
            ))}
          </div>
        </div>

        <ul className="home-engine-stats mt-12" role="list">
          {e.stats.map((s) => (
            <li key={s.label} className="home-engine-stat">
              <p className="home-engine-stat-value">{s.value}</p>
              <p className="home-engine-stat-label">{s.label}</p>
              <p className="home-engine-stat-sub">{s.sub}</p>
            </li>
          ))}
        </ul>

        <div className="home-engine-tools mt-10 rounded-2xl border border-slate-800/80 bg-slate-950/50 p-5 md:px-8 md:py-6">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-slate-500">{e.toolsEyebrow}</p>
          <p className="mt-2 text-sm text-slate-300">{e.toolsLine}</p>
          <ul className="mt-4 flex flex-wrap justify-center gap-2 md:gap-2.5">
            {['Next.js', 'TypeScript', 'Tailwind', 'Playwright', 'Vitest', 'Vercel'].map((t) => (
              <li
                key={t}
                className="inline-flex items-center rounded-full border border-sky-500/20 bg-sky-500/8 px-3.5 py-1.5 text-[0.7rem] font-medium text-sky-200/95"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href={statsHref}
            onClick={onCta}
            className="inline-flex min-h-12 items-center gap-2 rounded-full border border-sky-500/40 bg-sky-500/10 px-5 py-2.5 text-sm font-semibold text-sky-100 transition hover:border-sky-400/60 hover:bg-sky-500/15"
          >
            {e.ctaLabel}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </m.section>
  );
}
