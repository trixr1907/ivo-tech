import Link from 'next/link';

import { LanguageToggle } from '@/components/LanguageToggle';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { ServicesPageTracker } from '@/components/services/ServicesPageTracker';
import { SectionFrame } from '@/components/ui/SectionFrame';
import type { Locale } from '@/content/copy';
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

  return (
    <div className="theme-ref103632 services-page" data-theme="dark">
      <ServicesPageTracker locale={locale} />
      <SiteHeader
        ariaLabel={locale === 'de' ? 'Hauptnavigation' : 'Primary navigation'}
        className="home-v2-header"
        logoPreset="ref103632"
        logoVisualPreset="premium"
        logoEdgeGlow="medium"
        nav={
          <>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </>
        }
        rightSlot={
          <>
            <LanguageToggle />
            <Link className="cta ui-btn ui-btn--metal btn-md motion-edge-sweep" href={contactPath} data-service-cta="header-primary">
              {t.ctaPrimary}
            </Link>
          </>
        }
      />

      <main id="main-content" className="home-v2-main services-main">
        <SectionFrame id="services-main" className="section services-overview-section" aria-labelledby="services-title" tone="panel">
          <div className="section-head">
            <h1 id="services-title" className="insights-title text-ink-900">
              {t.title}
            </h1>
            <p className="text-ink-700">{t.description}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link className="cta ui-btn ui-btn--metal btn-md motion-edge-sweep" href={contactPath} data-service-cta="hero-primary">
                {t.ctaPrimary}
              </Link>
              <Link className="cta ui-btn ui-btn--ghost btn-md motion-edge-sweep" href={caseStudiesPath} data-service-cta="hero-secondary-case">
                {t.ctaSecondary}
              </Link>
              <Link className="cta ui-btn ui-btn--ghost btn-md motion-edge-sweep" href={playbooksPath} data-service-cta="hero-tertiary-playbook">
                {t.ctaTertiary}
              </Link>
            </div>
          </div>

          <div className="insights-grid insights-grid-page services-pillars-grid">
            {t.sections.map((section) => (
              <article key={section.title} className="insight-card text-ink-700">
                <h2 className="text-ink-900">{section.title}</h2>
                <p className="text-ink-700">{section.intro}</p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-ink-700">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </SectionFrame>

        <SectionFrame className="section services-process-section" aria-labelledby="services-process" tone="metal">
          <div className="section-head">
            <h2 id="services-process" className="text-ink-900">
              {t.processTitle}
            </h2>
          </div>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-ink-700">
            {t.processSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </SectionFrame>

        <SectionFrame className="section services-packages-section" aria-labelledby="services-packages" tone="panel" sectionTheme="secondary">
          <div className="section-head">
            <h2 id="services-packages" className="text-ink-900">
              {t.packagesTitle}
            </h2>
            <p className="text-ink-700">{t.packagesDescription}</p>
          </div>
          <div className="insights-grid insights-grid-page services-packages-grid">
            {t.packages.map((pkg) => (
              <article key={pkg.name} className="insight-card text-ink-700">
                <span className="insight-meta">{pkg.timeline}</span>
                <h3 className="text-ink-900">{pkg.name}</h3>
                <p className="text-ink-700">{pkg.fit}</p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-ink-700">
                  {pkg.outcomes.map((outcome) => (
                    <li key={outcome}>{outcome}</li>
                  ))}
                </ul>
                <Link
                  className="cta ui-btn ui-btn--proof btn-md motion-edge-sweep mt-4"
                  href={getContactPath(locale, pkg.ctaSource)}
                  data-service-cta={`package-${pkg.name.toLowerCase()}`}
                >
                  {pkg.ctaLabel}
                </Link>
                <Link
                  className="cta ui-btn ui-btn--ghost btn-md motion-edge-sweep mt-2"
                  href={locale === 'de' ? `/leistungen/${pkg.detailSlug}?source=services-detail` : `/en/services/${pkg.detailSlug}?source=services-detail`}
                  data-service-cta={`package-detail-${pkg.name.toLowerCase()}`}
                >
                  {pkg.detailLabel}
                </Link>
              </article>
            ))}
          </div>
        </SectionFrame>

        <SectionFrame className="section services-scope-section" aria-labelledby="services-scope" tone="panel">
          <div className="section-head">
            <h2 id="services-scope" className="text-ink-900">
              {t.scopeTitle}
            </h2>
          </div>
          <ul className="list-disc space-y-2 pl-5 text-sm text-ink-700">
            {t.scopeItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <Link className="cta ui-btn ui-btn--proof btn-md motion-edge-sweep" href={contactPath} data-service-cta="scope-primary">
            {t.ctaPrimary}
          </Link>
        </SectionFrame>
      </main>
    </div>
  );
}
