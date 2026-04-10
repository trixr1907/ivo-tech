import Link from 'next/link';

import { SectionFrame } from '@/components/ui/SectionFrame';
import type { Locale } from '@/content/copy';
import { CASE_STUDY_BLUEPRINTS } from '@/content/caseStudies';
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
    <SectionFrame className="section" aria-labelledby="case-structure-title" tone="metal" sectionTheme="secondary">
      <div className="section-head">
        <h2 id="case-structure-title">{blueprint.sectionTitle}</h2>
        <p>{blueprint.sectionDescription}</p>
      </div>

      <div className="insights-grid insights-grid-page">
        <article className="insight-card">
          <span className="insight-meta">01</span>
          <h3>{blueprint.problemTitle}</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            {blueprint.problemPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </article>

        <article className="insight-card">
          <span className="insight-meta">02</span>
          <h3>{blueprint.approachTitle}</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            {blueprint.approachPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </article>

        <article className="insight-card">
          <span className="insight-meta">03</span>
          <h3>{blueprint.outcomeTitle}</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            {blueprint.outcomePoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </article>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link className="cta ui-btn ui-btn--proof btn-md motion-edge-sweep" href={contactPath} data-hub-cta="case-structure-primary">
          {blueprint.primaryCta}
        </Link>
        <Link className="cta ui-btn ui-btn--metal btn-md motion-edge-sweep" href={getServicesPath(locale)} data-hub-cta="case-structure-secondary">
          {blueprint.secondaryCta}
        </Link>
      </div>
    </SectionFrame>
  );
}
