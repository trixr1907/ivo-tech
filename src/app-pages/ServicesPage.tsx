import Link from 'next/link';

import { RelaunchMarketingShell } from '@/components/layout/RelaunchMarketingShell';
import { ServicesPageTracker } from '@/components/services/ServicesPageTracker';
import { Button } from '@/components/shadcn/button';
import type { Locale } from '@/content/copy';
import { RELAUNCH_CARD, RELAUNCH_SECTION } from '@/lib/relaunchMarketingStyles';
import { getContactPath, getPrimaryNavLinks } from '@/lib/navigation';

type ServicesPageProps = {
  locale: Locale;
};

type ServiceCopy = {
  title: string;
  description: string;
  navHome: string;
  navContact: string;
  navServices: string;
  ctaPrimary: string;
  ctaSecondary: string;
  ctaTertiary: string;
  sections: Array<{
    title: string;
    intro: string;
    bullets: string[];
  }>;
  processTitle: string;
  processSteps: string[];
  packagesTitle: string;
  packagesDescription: string;
  packages: Array<{
    name: string;
    fit: string;
    timeline: string;
    outcomes: string[];
    ctaLabel: string;
    ctaSource: string;
    detailSlug: 'web-engineering-delivery' | 'ai-automation-workflows' | '3d-visualization-systems';
    detailLabel: string;
  }>;
  scopeTitle: string;
  scopeItems: string[];
};

const servicesCopy: Record<Locale, ServiceCopy> = {
  de: {
    title: 'Leistungen: Technical Delivery für conversion-kritische B2B-Webseiten',
    description:
      'Klare Informationsarchitektur, robustes Frontend-Engineering und verlässliche Delivery-Gates für Teams, die professionell shippen und stabil betreiben müssen.',
    navHome: 'Startseite',
    navContact: 'Kontakt',
    navServices: 'Leistungen',
    ctaPrimary: 'Scope-Call anfragen',
    ctaSecondary: 'Case Studies ansehen',
    ctaTertiary: 'Playbook lesen',
    sections: [
      {
        title: '1) Positionierung und IA',
        intro: 'Wir schärfen Angebotsklarheit und Nutzerführung entlang realer Entscheiderpfade.',
        bullets: ['Value Proposition und Messaging-Stack', 'Above-the-fold Struktur mit klarer CTA-Hierarchie', 'Informationsarchitektur für Home, Services und Cases']
      },
      {
        title: '2) UI-System und Implementierung',
        intro: 'Aus Design wird ein belastbares, skalierbares Frontend-System.',
        bullets: ['Komponentenbasiertes UI mit Tokens', 'Responsive und barrierearme Umsetzung', 'Saubere technische Baseline für Iteration ohne Redesign-Drift']
      },
      {
        title: '3) Qualität, Betrieb und Handover',
        intro: 'Delivery endet nicht beim Go-live, sondern beim sicheren Team-Weiterbetrieb.',
        bullets: ['QA-Gates für Releases', 'Messbare Core-Web-Vitals-Guardrails', 'Dokumentierte Übergabe mit klaren Ownership-Pfaden']
      }
    ],
    processTitle: 'Zusammenarbeitsmodell',
    processSteps: [
      'Discovery: Ziele, Engpässe, Prioritäten',
      'Blueprint: IA, Komponenten, Content-Führung',
      'Build: Umsetzung mit QA-Checks',
      'Launch: Tracking, Feinschliff, Enablement'
    ],
    packagesTitle: 'Produktisierte Angebotsformate',
    packagesDescription: 'Drei klar abgrenzbare Einstiegspfade mit konkretem Ergebnisfokus.',
    packages: [
      {
        name: 'Build',
        fit: 'Für Teams, die neue Web-Strecken oder Relaunch-Segmente sauber von 0 aufbauen müssen.',
        timeline: 'Typischer Rahmen: 4-8 Wochen',
        outcomes: [
          'Klares Angebots-Narrativ mit Conversion-Struktur',
          'Skalierbares UI-/Komponentenfundament',
          'Produktionsnaher Go-live mit QA-Gates'
        ],
        ctaLabel: 'Build Scope klären',
        ctaSource: 'services-build',
        detailSlug: 'web-engineering-delivery',
        detailLabel: 'Delivery-Details'
      },
      {
        name: 'Stabilize',
        fit: 'Für bestehende Setups mit Qualitäts-, Performance- oder Hand-over-Reibung.',
        timeline: 'Typischer Rahmen: 2-6 Wochen',
        outcomes: [
          'Messbare technische Stabilisierung',
          'Reduzierte Release-Risiken',
          'Klare Ownership- und Handover-Pfade'
        ],
        ctaLabel: 'Stabilize Scope klären',
        ctaSource: 'services-stabilize',
        detailSlug: 'ai-automation-workflows',
        detailLabel: 'Automation-Details'
      },
      {
        name: 'Accelerate',
        fit: 'Für Teams, die Delivery mit AI-gestützten Workflows und Automationen beschleunigen wollen.',
        timeline: 'Typischer Rahmen: 2-5 Wochen',
        outcomes: [
          'Schnellere Iterationszyklen',
          'Weniger manuelle Übergabe-Schritte',
          'Reproduzierbare Workflow-Standards'
        ],
        ctaLabel: 'Accelerate Scope klären',
        ctaSource: 'services-accelerate',
        detailSlug: '3d-visualization-systems',
        detailLabel: '3D-System-Details'
      }
    ],
    scopeTitle: 'Typischer Scope',
    scopeItems: ['4-8 Wochen, abhängig von Umfang und Content-Reife', 'Enge Abstimmung mit Product/Marketing/Engineering', 'Klare Deliverables pro Phase statt losem Design-Output']
  },
  en: {
    title: 'Services: Technical delivery for conversion-critical B2B websites',
    description:
      'Clear information architecture, robust frontend engineering, and reliable delivery gates for teams that need to ship confidently and operate sustainably.',
    navHome: 'Home',
    navContact: 'Contact',
    navServices: 'Services',
    ctaPrimary: 'Request scope call',
    ctaSecondary: 'View case studies',
    ctaTertiary: 'Read playbook',
    sections: [
      {
        title: '1) Positioning and IA',
        intro: 'We sharpen offer clarity and user flow across real buyer journeys.',
        bullets: ['Value proposition and message hierarchy', 'Above-the-fold structure with clear CTA levels', 'Information architecture for home, services, and case studies']
      },
      {
        title: '2) UI system and implementation',
        intro: 'Design direction becomes a durable frontend system.',
        bullets: ['Token-driven component architecture', 'Responsive and accessibility-aware implementation', 'Stable baseline for fast iteration without design drift']
      },
      {
        title: '3) Quality, operations, and handover',
        intro: 'Delivery only counts when your team can run and extend it safely.',
        bullets: ['Release QA gates', 'Measurable Core Web Vitals guardrails', 'Documented handover with clear ownership paths']
      }
    ],
    processTitle: 'Collaboration model',
    processSteps: [
      'Discovery: goals, bottlenecks, priorities',
      'Blueprint: IA, components, content flow',
      'Build: implementation with QA checkpoints',
      'Launch: tracking, refinement, enablement'
    ],
    packagesTitle: 'Productized offer formats',
    packagesDescription: 'Three clearly defined entry paths with concrete delivery outcomes.',
    packages: [
      {
        name: 'Build',
        fit: 'For teams that need to launch new web journeys or relaunch segments from scratch.',
        timeline: 'Typical scope: 4-8 weeks',
        outcomes: [
          'Clear offer narrative with conversion structure',
          'Scalable UI/component baseline',
          'Production-ready launch with QA gates'
        ],
        ctaLabel: 'Clarify Build scope',
        ctaSource: 'services-build',
        detailSlug: 'web-engineering-delivery',
        detailLabel: 'Delivery details'
      },
      {
        name: 'Stabilize',
        fit: 'For existing setups with quality, performance, or handover friction.',
        timeline: 'Typical scope: 2-6 weeks',
        outcomes: [
          'Measurable technical stabilization',
          'Lower release risk',
          'Clear ownership and handover paths'
        ],
        ctaLabel: 'Clarify Stabilize scope',
        ctaSource: 'services-stabilize',
        detailSlug: 'ai-automation-workflows',
        detailLabel: 'Automation details'
      },
      {
        name: 'Accelerate',
        fit: 'For teams that want to speed up delivery with AI-assisted workflows and automation.',
        timeline: 'Typical scope: 2-5 weeks',
        outcomes: [
          'Faster iteration cycles',
          'Less manual handover overhead',
          'Repeatable workflow standards'
        ],
        ctaLabel: 'Clarify Accelerate scope',
        ctaSource: 'services-accelerate',
        detailSlug: '3d-visualization-systems',
        detailLabel: '3D system details'
      }
    ],
    scopeTitle: 'Typical scope',
    scopeItems: ['4-8 weeks depending on scope and content readiness', 'Close sync with product, marketing, and engineering', 'Phase-based deliverables instead of disconnected design output']
  }
};

export function ServicesPage({ locale }: ServicesPageProps) {
  const t = servicesCopy[locale];
  const contactPath = getContactPath(locale, 'services-scope-call');
  const caseStudiesPath = locale === 'de' ? '/case-studies?source=services-case' : '/en/case-studies?source=services-case';
  const playbooksPath = locale === 'de' ? '/playbooks?source=services-playbook' : '/en/playbooks?source=services-playbook';
  const navLinks = getPrimaryNavLinks(locale);
  const homeHref = locale === 'de' ? '/' : '/en';

  return (
    <RelaunchMarketingShell
      locale={locale}
      shellClassName="services-page"
      homeHref={homeHref}
      navLinks={navLinks}
      desktopCtaHref={contactPath}
      desktopCtaLabel={t.ctaPrimary}
      mobileNavCtaLabel={t.ctaPrimary}
      desktopContactTrackingSource="services-header-contact"
      mobileNavPrimaryTrackingSource="services-mobile-nav-primary"
    >
      <ServicesPageTracker locale={locale} />
      <main id="main-content" className="mx-auto w-full max-w-[1200px] flex-1 px-4 pb-10 pt-8 sm:px-6 md:pb-12 md:pt-10">
        <section id="services-main" className={`${RELAUNCH_SECTION} services-overview-section`} aria-labelledby="services-title">
          <div className="space-y-4">
            <h1 id="services-title" className="font-display text-3xl font-semibold tracking-tight text-slate-100 md:text-4xl">
              {t.title}
            </h1>
            <p className="max-w-3xl text-base leading-relaxed text-slate-300 md:text-lg">{t.description}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild className="bg-sky-500 text-slate-950 hover:bg-sky-400">
                <Link href={contactPath} data-service-cta="hero-primary">
                  {t.ctaPrimary}
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-slate-600 bg-transparent text-slate-100 hover:bg-slate-800/60">
                <Link href={caseStudiesPath} data-service-cta="hero-secondary-case">
                  {t.ctaSecondary}
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-slate-600 bg-transparent text-slate-100 hover:bg-slate-800/60">
                <Link href={playbooksPath} data-service-cta="hero-tertiary-playbook">
                  {t.ctaTertiary}
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {t.sections.map((section) => (
              <article key={section.title} className={RELAUNCH_CARD}>
                <h2 className="font-display text-lg font-semibold text-slate-100">{section.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{section.intro}</p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-400">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className={`${RELAUNCH_SECTION} mt-8 services-process-section`} aria-labelledby="services-process">
          <h2 id="services-process" className="font-display text-xl font-semibold text-slate-100">
            {t.processTitle}
          </h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-300">
            {t.processSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <section className={`${RELAUNCH_SECTION} mt-8 services-packages-section`} aria-labelledby="services-packages">
          <div className="space-y-2">
            <h2 id="services-packages" className="font-display text-xl font-semibold text-slate-100">
              {t.packagesTitle}
            </h2>
            <p className="text-sm text-slate-300 md:text-base">{t.packagesDescription}</p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {t.packages.map((pkg) => (
              <article key={pkg.name} className={RELAUNCH_CARD}>
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-sky-400/90">{pkg.timeline}</span>
                <h3 className="mt-2 font-display text-lg font-semibold text-slate-100">{pkg.name}</h3>
                <p className="mt-2 text-sm text-slate-300">{pkg.fit}</p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-400">
                  {pkg.outcomes.map((outcome) => (
                    <li key={outcome}>{outcome}</li>
                  ))}
                </ul>
                <Button asChild className="mt-4 w-full bg-sky-500 text-slate-950 hover:bg-sky-400 sm:w-auto">
                  <Link href={getContactPath(locale, pkg.ctaSource)} data-service-cta={`package-${pkg.name.toLowerCase()}`}>
                    {pkg.ctaLabel}
                  </Link>
                </Button>
                <Button asChild variant="ghost" className="mt-2 w-full text-slate-200 hover:bg-slate-800/50 sm:w-auto">
                  <Link
                    href={
                      locale === 'de'
                        ? `/leistungen/${pkg.detailSlug}?source=services-detail`
                        : `/en/services/${pkg.detailSlug}?source=services-detail`
                    }
                    data-service-cta={`package-detail-${pkg.name.toLowerCase()}`}
                  >
                    {pkg.detailLabel}
                  </Link>
                </Button>
              </article>
            ))}
          </div>
        </section>

        <section className={`${RELAUNCH_SECTION} mt-8 services-scope-section`} aria-labelledby="services-scope">
          <h2 id="services-scope" className="font-display text-xl font-semibold text-slate-100">
            {t.scopeTitle}
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-300">
            {t.scopeItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <Button asChild className="mt-6 bg-sky-500 text-slate-950 hover:bg-sky-400">
            <Link href={contactPath} data-service-cta="scope-primary">
              {t.ctaPrimary}
            </Link>
          </Button>
        </section>
      </main>
    </RelaunchMarketingShell>
  );
}
