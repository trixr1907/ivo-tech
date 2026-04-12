import Link from 'next/link';

import { Button } from '@/components/shadcn/button';
import type { Locale } from '@/content/copy';
import { CASE_STUDY_BLUEPRINTS } from '@/content/caseStudies';
import { RELAUNCH_CARD, RELAUNCH_SECTION } from '@/lib/relaunchMarketingStyles';
import { getServicesPath } from '@/lib/navigation';

type Props = {
  locale: Locale;
  slug: string;
  contactPath: string;
};

export function CaseStudyBlueprintSection({ locale, slug, contactPath }: Props) {
  const blueprint = CASE_STUDY_BLUEPRINTS[locale][slug];
  if (!blueprint) return null;

  return (
    <section className={`${RELAUNCH_SECTION} hub-detail-blueprint-section`} aria-labelledby="case-structure-title">
      <div className="space-y-2">
        <h2 id="case-structure-title" className="font-display text-xl font-semibold text-slate-100">
          {blueprint.sectionTitle}
        </h2>
        <p className="text-sm text-slate-300 md:text-base">{blueprint.sectionDescription}</p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <article className={RELAUNCH_CARD}>
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-sky-400/90">01</span>
          <h3 className="mt-2 font-display text-base font-semibold text-slate-100">{blueprint.problemTitle}</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
            {blueprint.problemPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </article>

        <article className={RELAUNCH_CARD}>
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-sky-400/90">02</span>
          <h3 className="mt-2 font-display text-base font-semibold text-slate-100">{blueprint.approachTitle}</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
            {blueprint.approachPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </article>

        <article className={RELAUNCH_CARD}>
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-sky-400/90">03</span>
          <h3 className="mt-2 font-display text-base font-semibold text-slate-100">{blueprint.outcomeTitle}</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
            {blueprint.outcomePoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </article>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild className="bg-sky-500 text-slate-950 hover:bg-sky-400">
          <Link href={contactPath} data-hub-cta="case-structure-primary">
            {blueprint.primaryCta}
          </Link>
        </Button>
        <Button asChild variant="outline" className="border-slate-600 bg-transparent text-slate-100 hover:bg-slate-800/60">
          <Link href={getServicesPath(locale)} data-hub-cta="case-structure-secondary">
            {blueprint.secondaryCta}
          </Link>
        </Button>
      </div>
    </section>
  );
}
