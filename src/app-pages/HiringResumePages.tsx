import Link from 'next/link';
import type { ReactNode } from 'react';

import { RelaunchMarketingShell } from '@/components/layout/RelaunchMarketingShell';
import { Button } from '@/components/shadcn/button';
import type { Locale } from '@/content/copy';
import { localizePath } from '@/lib/localeRouting';
import { RELAUNCH_CARD, RELAUNCH_SECTION } from '@/lib/relaunchMarketingStyles';
import { getContactPath, getPrimaryNavLinks, getResumePath } from '@/lib/navigation';
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
      <main id="main-content" className="mx-auto w-full max-w-[1200px] flex-1 px-4 pb-10 pt-8 sm:px-6 md:pb-12 md:pt-10">
        <section className={`${RELAUNCH_SECTION} mb-8`} aria-labelledby="hiring-resume-title">
          <p className="home-eyebrow">{locale === 'de' ? 'Senior Web Engineer' : 'Senior Web Engineer'}</p>
          <h1
            id="hiring-resume-title"
            className="mt-1 font-display text-[1.75rem] font-bold tracking-tight text-white md:text-[2.5rem]"
            style={{ lineHeight: 1.15 }}
          >
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-400 md:text-lg">{description}</p>
        </section>
        <div className="space-y-6">{children}</div>
      </main>
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

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            asChild
            className="bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-[0_0_24px_rgba(14,165,233,0.28)] hover:from-sky-400 hover:to-blue-400"
          >
            <Link href={contactPath}>{copy.ctaPrimary}</Link>
          </Button>
          <Button asChild variant="outline" className="border-slate-700 bg-transparent text-slate-200 hover:border-slate-500 hover:bg-slate-800/60">
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
              title: 'Schwerpunkte',
              items: ['Next.js / TypeScript', 'UX-nahe Informationsarchitektur', 'Performance-, QA- und Handover-Standards']
            },
            {
              title: 'Arbeitsmodell',
              items: ['Remote-first, optional vor Ort im Raum Mannheim', 'Verfügbarkeit nach Absprache', 'Deutsch und Englisch im Arbeitskontext']
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
              title: 'Focus areas',
              items: ['Next.js / TypeScript', 'UX-oriented information architecture', 'Performance, QA, and handover standards']
            },
            {
              title: 'Working model',
              items: ['Remote-first, optional onsite in Mannheim area', 'Availability by agreement', 'German and English for team collaboration']
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
        <div className="grid gap-4 md:grid-cols-3">
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
          <Button asChild variant="outline" className="border-slate-600 bg-transparent text-slate-100 hover:bg-slate-800/60">
            <Link href={contactPath}>{copy.contactCta}</Link>
          </Button>
        </div>
      </section>
    </PageScaffold>
  );
}
