import Link from 'next/link';
import type { ReactNode } from 'react';

import { RelaunchMarketingShell } from '@/components/layout/RelaunchMarketingShell';
import { RelaunchPageHero } from '@/components/layout/RelaunchPageHero';
import { RelaunchPageMain } from '@/components/layout/RelaunchPageMain';
import { Button } from '@/components/shadcn/button';
import type { Locale } from '@/content/copy';
import { localizePath } from '@/lib/localeRouting';
import { getContactPath, getPrimaryNavLinks, getResumePath } from '@/lib/navigation';
import { RELAUNCH_CARD, RELAUNCH_SECTION } from '@/lib/relaunchMarketingStyles';
import { CV_PATH } from '@/lib/sitePublic';

type PageScaffoldProps = {
  locale: Locale;
  title: string;
  description: string;
  children: ReactNode;
  shellClassName?: string;
  desktopContactTrackingSource?: string;
};

function PageScaffold({
  locale,
  title,
  description,
  children,
  shellClassName,
  desktopContactTrackingSource = 'hiring-resume-scaffold'
}: PageScaffoldProps) {
  const navLinks = getPrimaryNavLinks(locale);
  const contactPath = getContactPath(locale, 'header-nav');
  const homeHref = localizePath('/', locale);
  const headerCta = locale === 'de' ? 'Kontakt' : 'Contact';

  return (
    <RelaunchMarketingShell
      locale={locale}
      homeHref={homeHref}
      navLinks={navLinks}
      desktopCtaHref={contactPath}
      desktopCtaLabel={headerCta}
      mobileNavCtaLabel={headerCta}
      desktopContactTrackingSource={desktopContactTrackingSource}
      mobileNavPrimaryTrackingSource={`${desktopContactTrackingSource}-mobile`}
      shellClassName={shellClassName}
    >
      <RelaunchPageMain>
        <section className={`${RELAUNCH_SECTION} mb-8`} aria-labelledby="hiring-resume-title">
          <RelaunchPageHero
            className="!mb-0"
            eyebrow={locale === 'de' ? 'Senior Web Engineer' : 'Senior Web Engineer'}
            title={title}
            titleId="hiring-resume-title"
            description={description}
          />
        </section>
        <div className="space-y-6">{children}</div>
      </RelaunchPageMain>
    </RelaunchMarketingShell>
  );
}

export function HiringPage({ locale }: { locale: Locale }) {
  const copy =
    locale === 'de'
      ? {
          title: 'Hiring: Senior Product Engineering mit klarer Ownership',
          description:
            'Ich unterstütze Teams beim Bau und Stabilisieren produktionsnaher Websysteme. Fokus: nachvollziehbare Architekturentscheidungen, belastbare Delivery und saubere Team-Übergaben.',
          fitTitle: 'Wofür ich besonders geeignet bin',
          fitItems: [
            'Product Engineering Rollen mit End-to-End Verantwortung',
            'Frontend-lastige Teams mit hohen Qualitätsanforderungen',
            'Migrations- und Relaunch-Phasen mit klaren Delivery-Gates'
          ],
          workTitle: 'Arbeitsweise',
          workItems: [
            'Klarer Scope pro Sprint statt diffusem Feature-Backlog',
            'Entscheidungen mit Trade-off Dokumentation',
            'Technische Qualität messbar machen (QA, Performance, Handover)'
          ],
          evidenceTitle: 'Nachweisbare Ergebnisse',
          evidenceItems: [
            '3 Live-Systeme im produktionsnahen Betrieb (inkl. Datei-zu-Checkout-Flow)',
            '5 CI/CD-Gates vor Releases: Lint, Typecheck, Unit, E2E, Security',
            '95+ Lighthouse-Zielwerte als Delivery-Constraint statt Nice-to-have'
          ],
          collaborationTitle: 'Was Teams in den ersten 30 Tagen erwarten können',
          collaborationItems: [
            'Woche 1: Scope-Klärung, Risiko-Mapping, Definition of Ready',
            'Woche 2-3: Umsetzung mit klaren Tech-Entscheidungen und QA-Guardrails',
            'Woche 4: Stabilisierung, Team-Handover und dokumentierte Trade-offs'
          ],
          ctaPrimary: 'Interview anfragen',
          ctaSecondary: 'CV ansehen'
        }
      : {
          title: 'Hiring: Senior product engineering with clear ownership',
          description:
            'I help teams build and stabilize production-grade web systems with explicit architecture decisions, delivery reliability, and clean handover standards.',
          fitTitle: 'Best fit',
          fitItems: [
            'Product engineering roles with end-to-end ownership',
            'Frontend-heavy teams with high quality standards',
            'Migration and relaunch phases with explicit delivery gates'
          ],
          workTitle: 'Working style',
          workItems: [
            'Clear sprint scope instead of diffuse feature backlogs',
            'Decision making with trade-off documentation',
            'Measured technical quality (QA, performance, handover)'
          ],
          evidenceTitle: 'Verifiable outcomes',
          evidenceItems: [
            '3 live systems in production-like operation (including file-to-checkout flow)',
            '5 CI/CD gates before release: lint, typecheck, unit, E2E, security',
            '95+ Lighthouse targets treated as a delivery constraint'
          ],
          collaborationTitle: 'What teams can expect in the first 30 days',
          collaborationItems: [
            'Week 1: scope framing, risk mapping, definition of ready',
            'Week 2-3: implementation with explicit technical decisions and QA guardrails',
            'Week 4: stabilization, team handover, and documented trade-offs'
          ],
          ctaPrimary: 'Request interview',
          ctaSecondary: 'View resume'
        };

  const contactPath = getContactPath(locale, 'hiring-primary');
  const resumePath = getResumePath(locale);

  return (
    <PageScaffold
      locale={locale}
      title={copy.title}
      description={copy.description}
      shellClassName="hiring-page"
      desktopContactTrackingSource="hiring-page-header"
    >
      <section className={RELAUNCH_SECTION} aria-labelledby="hiring-fit-heading">
        <div className="grid gap-4 md:grid-cols-2">
          <article className={RELAUNCH_CARD}>
            <h2 id="hiring-fit-heading" className="font-display text-xl font-semibold text-slate-100">
              {copy.fitTitle}
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              {copy.fitItems.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="shrink-0 text-sky-400 text-xs" aria-hidden="true">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
          <article className={RELAUNCH_CARD}>
            <h2 className="font-display text-xl font-semibold text-slate-100">{copy.workTitle}</h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              {copy.workItems.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="shrink-0 text-emerald-400 text-xs" aria-hidden="true">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <article className={RELAUNCH_CARD}>
            <h2 className="font-display text-xl font-semibold text-slate-100">{copy.evidenceTitle}</h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              {copy.evidenceItems.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="shrink-0 text-cyan-400 text-xs" aria-hidden="true">●</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
          <article className={RELAUNCH_CARD}>
            <h2 className="font-display text-xl font-semibold text-slate-100">{copy.collaborationTitle}</h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              {copy.collaborationItems.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="shrink-0 text-violet-400 text-xs" aria-hidden="true">●</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            asChild
            className="bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-[0_0_24px_rgba(14,165,233,0.28)] hover:from-sky-400 hover:to-blue-400"
          >
            <Link href={contactPath}>{copy.ctaPrimary}</Link>
          </Button>
          <Button asChild variant="onDark">
            <Link href={resumePath}>{copy.ctaSecondary}</Link>
          </Button>
        </div>
      </section>
    </PageScaffold>
  );
}

export function ResumePage({ locale }: { locale: Locale }) {
  const copy =
    locale === 'de'
      ? {
          title: 'Resume: Product Engineering, Delivery und technische Verantwortung',
          description:
            'Strukturierter Überblick über Profil, Fokus und Arbeitsmodell. Für Interviews und schnelle Team-Einordnung.',
          sections: [
            {
              title: 'Profil',
              items: [
                'Senior-orientiertes Product Engineering mit Delivery-Fokus',
                'Starker Frontend-Schwerpunkt plus produktionsnahe Systemintegration',
                'Klare Kommunikation mit Product, Design und Stakeholdern'
              ]
            },
            {
              title: 'Erfahrungsschwerpunkte',
              items: [
                'Technische Lead-Rolle in Relaunch- und Migrationsphasen',
                'Aufbau von Hub-Architekturen (Case Studies, Insights, Playbooks)',
                'Verbindung von UX, Engineering und Delivery-Governance'
              ]
            },
            {
              title: 'Schwerpunkte',
              items: ['Next.js / TypeScript', 'UX-nahe Informationsarchitektur', 'Performance-, QA- und Handover-Standards']
            },
            {
              title: 'Arbeitsmodell',
              items: ['Remote-first, optional vor Ort im Raum Mannheim', 'Verfügbarkeit nach Absprache', 'Deutsch und Englisch im Arbeitskontext']
            },
            {
              title: 'Relevante Outcomes',
              items: [
                'Produktionsreife Datei-zu-Checkout-Strecke für 3D-Konfiguration',
                'CI/CD-Qualitätsgates in Delivery-Prozesse integriert',
                'Dokumentierte Team-Übergaben mit klaren Verantwortlichkeiten'
              ]
            }
          ],
          pdfCta: 'CV als PDF laden',
          contactCta: 'Kontakt aufnehmen'
        }
      : {
          title: 'Resume: product engineering, delivery, and technical ownership',
          description:
            'Structured overview of profile, focus, and working setup for interviews and fast team alignment.',
          sections: [
            {
              title: 'Profile',
              items: [
                'Senior-oriented product engineering with delivery focus',
                'Strong frontend depth plus production-grade system integration',
                'Clear communication with product, design, and stakeholders'
              ]
            },
            {
              title: 'Experience focus',
              items: [
                'Technical lead role in relaunch and migration phases',
                'Hub architecture build-outs (case studies, insights, playbooks)',
                'Alignment of UX, engineering, and delivery governance'
              ]
            },
            {
              title: 'Focus areas',
              items: ['Next.js / TypeScript', 'UX-oriented information architecture', 'Performance, QA, and handover standards']
            },
            {
              title: 'Working model',
              items: ['Remote-first, optional onsite in Mannheim area', 'Availability by agreement', 'German and English for team collaboration']
            },
            {
              title: 'Relevant outcomes',
              items: [
                'Production-grade file-to-checkout flow for 3D configuration',
                'CI/CD quality gates integrated into delivery lifecycle',
                'Documented team handovers with explicit ownership boundaries'
              ]
            }
          ],
          pdfCta: 'Download CV (PDF)',
          contactCta: 'Contact'
        };

  const contactPath = getContactPath(locale, 'resume-contact');

  return (
    <PageScaffold
      locale={locale}
      title={copy.title}
      description={copy.description}
      shellClassName="resume-page"
      desktopContactTrackingSource="resume-page-header"
    >
      <section className={RELAUNCH_SECTION}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {copy.sections.map((section) => (
            <article key={section.title} className={RELAUNCH_CARD}>
              <h2 className="font-display text-lg font-semibold text-slate-100">{section.title}</h2>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                {section.items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="shrink-0 text-sky-400 text-xs" aria-hidden="true">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild className="bg-sky-500 text-slate-950 hover:bg-sky-400">
            <a href={CV_PATH[locale]} target="_blank" rel="noopener noreferrer">
              {copy.pdfCta}
            </a>
          </Button>
          <Button asChild variant="onDark">
            <Link href={contactPath}>{copy.contactCta}</Link>
          </Button>
        </div>
      </section>
    </PageScaffold>
  );
}
