import type React from 'react';
import Link from 'next/link';

import { RelaunchMarketingShell } from '@/components/layout/RelaunchMarketingShell';
import { ServicesPageTracker } from '@/components/services/ServicesPageTracker';
import { Button } from '@/components/shadcn/button';
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
  const navLinks = getPrimaryNavLinks(locale);
  const homeHref = locale === 'de' ? '/' : '/en';

  const PACKAGE_ACCENTS = ['rgba(56,189,248,0.65)', 'rgba(139,92,246,0.65)', 'rgba(52,211,153,0.65)'];

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

        {/* ── Hero ───────────────────────────────────────────────────── */}
        <section id="services-main" aria-labelledby="services-title" className="home-hero-card relative mb-10">
          <div className="home-hero-dot-grid" aria-hidden="true" />
          <div className="relative z-[1]">
            <p className="home-eyebrow">{locale === 'de' ? 'Leistungen' : 'Services'}</p>
            <h1
              id="services-title"
              className="home-section-h2 mt-1 max-w-[36ch] text-balance text-white"
              style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)' }}
            >
              {t.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-400 md:text-lg">{t.description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                asChild
                className="bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-[0_0_24px_rgba(14,165,233,0.28)] hover:from-sky-400 hover:to-blue-400"
              >
                <Link href={contactPath} data-service-cta="hero-primary">
                  {t.ctaPrimary}
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-slate-700 bg-transparent text-slate-200 hover:border-slate-500 hover:bg-slate-800/60">
                <Link href={caseStudiesPath} data-service-cta="hero-secondary-case">
                  {t.ctaSecondary}
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ── Sections grid ───────────────────────────────────────────── */}
        <section className="mb-10" aria-labelledby="services-overview">
          <h2 id="services-overview" className="sr-only">{locale === 'de' ? 'Leistungsübersicht' : 'Service overview'}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {t.sections.map((section, idx) => (
              <article
                key={section.title}
                className="home-service-card"
              >
                <div
                  className="home-service-card-accent"
                  aria-hidden="true"
                  style={{ background: PACKAGE_ACCENTS[idx] ?? PACKAGE_ACCENTS[0] }}
                />
                <h3 className="home-service-card-title">{section.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{section.intro}</p>
                <ul className="home-service-card-outcomes mt-3">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* ── Process ─────────────────────────────────────────────────── */}
        <section className="mb-10" aria-labelledby="services-process">
          <p className="home-eyebrow">{locale === 'de' ? 'Ablauf' : 'Process'}</p>
          <h2 id="services-process" className="home-section-h2 mb-6" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>
            {t.processTitle}
          </h2>
          <ol className="home-process-grid" aria-label={locale === 'de' ? 'Projektphasen' : 'Project phases'}>
            {t.processSteps.map((step, idx) => (
              <li key={step} className="home-process-step">
                <div className="home-process-num" aria-hidden="true">
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <p className="home-process-step-text">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Packages ────────────────────────────────────────────────── */}
        <section className="mb-10" aria-labelledby="services-packages">
          <p className="home-eyebrow">{locale === 'de' ? 'Angebote' : 'Formats'}</p>
          <h2 id="services-packages" className="home-section-h2 mb-2" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>
            {t.packagesTitle}
          </h2>
          <p className="mb-6 max-w-2xl text-base text-slate-500">{t.packagesDescription}</p>
          <div className="grid gap-4 md:grid-cols-3">
            {t.packages.map((pkg, idx) => (
              <article
                key={pkg.name}
                className="home-service-card flex flex-col"
                style={{ '--card-accent': PACKAGE_ACCENTS[idx] ?? PACKAGE_ACCENTS[0] } as React.CSSProperties}
              >
                <div
                  className="home-service-card-accent"
                  aria-hidden="true"
                  style={{ background: PACKAGE_ACCENTS[idx] ?? PACKAGE_ACCENTS[0] }}
                />
                <span className="mb-2 font-mono text-[0.65rem] font-bold uppercase tracking-[0.14em] text-slate-600">
                  {pkg.timeline}
                </span>
                <h3 className="home-service-card-title text-xl">{pkg.name}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{pkg.fit}</p>
                <ul className="home-service-card-outcomes mt-3 flex-1">
                  {pkg.outcomes.map((outcome) => (
                    <li key={outcome}>{outcome}</li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-col gap-2">
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-sky-500 to-blue-500 text-white hover:from-sky-400 hover:to-blue-400"
                    size="sm"
                  >
                    <Link href={getContactPath(locale, pkg.ctaSource)} data-service-cta={`package-${pkg.name.toLowerCase()}`}>
                      {pkg.ctaLabel}
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full text-sky-300 hover:bg-slate-800/50 hover:text-sky-200"
                    size="sm"
                  >
                    <Link
                      href={
                        locale === 'de'
                          ? `/leistungen/${pkg.detailSlug}?source=services-detail`
                          : `/en/services/${pkg.detailSlug}?source=services-detail`
                      }
                      data-service-cta={`package-detail-${pkg.name.toLowerCase()}`}
                    >
                      {pkg.detailLabel} →
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── Scope + final CTA ───────────────────────────────────────── */}
        <section className="home-contact-card" aria-labelledby="services-scope">
          <p className="home-eyebrow">{locale === 'de' ? 'Rahmen' : 'Scope'}</p>
          <h2 id="services-scope" className="home-section-h2 mb-4" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>
            {t.scopeTitle}
          </h2>
          <ul className="mb-6 space-y-2">
            {t.scopeItems.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-slate-400">
                <span className="mt-0.5 text-sky-400" aria-hidden="true">→</span>
                {item}
              </li>
            ))}
          </ul>
          <Button
            asChild
            className="bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-[0_0_24px_rgba(14,165,233,0.25)] hover:from-sky-400 hover:to-blue-400"
          >
            <Link href={contactPath} data-service-cta="scope-primary">
              {t.ctaPrimary}
            </Link>
          </Button>
        </section>
      </main>
    </RelaunchMarketingShell>
  );
}
