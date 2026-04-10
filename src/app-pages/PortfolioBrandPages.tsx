import Link from 'next/link';
import type { ReactNode } from 'react';

import { LanguageToggle } from '@/components/LanguageToggle';
import { ContactLeadForm } from '@/components/home/ContactLeadForm';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SectionFrame } from '@/components/ui/SectionFrame';
import type { Locale } from '@/content/copy';
import { getFeaturedProjects, getJourneyTimeline, getProjectsByTrack, getSocialProof } from '@/content/portfolioModels';
import { localizePath } from '@/lib/localeRouting';
import { getContactPath, getPrimaryNavLinks } from '@/lib/navigation';
import { CONTACT_EMAIL, GITHUB_URL } from '@/lib/site';

const pageShell = 'mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8';

type PageScaffoldProps = {
  locale: Locale;
  title: string;
  description: string;
  children: ReactNode;
};

function PageScaffold({ locale, title, description, children }: PageScaffoldProps) {
  const navLinks = getPrimaryNavLinks(locale);
  const contactPath = getContactPath(locale, 'header-nav');

  return (
    <div className="theme-ref103632" data-theme="dark">
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
            <Link className="cta ui-btn ui-btn--metal btn-md motion-edge-sweep" href={contactPath}>
              {locale === 'de' ? 'Erstgespraech' : 'Intro call'}
            </Link>
          </>
        }
      />

      <main id="main-content" className="home-v2-main pb-16">
        <SectionFrame
          className="hero"
          tone="metal"
          sectionTheme="primary"
          aria-labelledby="portfolio-page-title"
        >
          <div className={pageShell}>
            <div className="max-w-4xl space-y-4 py-8 md:py-10">
              <p className="eyebrow">{locale === 'de' ? 'Builder / Engineer / Maker' : 'Builder / Engineer / Maker'}</p>
              <h1 id="portfolio-page-title" className="insights-title text-ink-900">
                {title}
              </h1>
              <p className="text-lg text-ink-700">{description}</p>
            </div>
          </div>
        </SectionFrame>

        {children}
      </main>

      <SiteFooter
        leftText={
          locale === 'de'
            ? 'Creator-Engineer-Portfolio mit produktionsnaher Delivery.'
            : 'Creator-engineer portfolio with production-grade delivery.'
        }
        navLabel={locale === 'de' ? 'Footer-Navigation' : 'Footer navigation'}
        navLinks={[
          ...navLinks,
          { href: locale === 'de' ? '/impressum' : '/en/legal', label: locale === 'de' ? 'Impressum' : 'Legal' },
          { href: locale === 'de' ? '/datenschutz' : '/en/privacy', label: locale === 'de' ? 'Datenschutz' : 'Privacy' }
        ]}
        contactLinks={[
          { href: `mailto:${CONTACT_EMAIL}`, label: CONTACT_EMAIL },
          { href: GITHUB_URL, label: 'GitHub', external: true }
        ]}
        rightText={locale === 'de' ? 'Mannheim | Remote-first' : 'Mannheim | Remote-first'}
        cta={
          <Link className="cta ui-btn ui-btn--signal btn-md motion-edge-sweep" href={contactPath}>
            {locale === 'de' ? 'Kontakt aufnehmen' : 'Contact now'}
          </Link>
        }
      />
    </div>
  );
}

export function AboutBrandPage({ locale }: { locale: Locale }) {
  const timeline = getJourneyTimeline(locale);
  const socialProof = getSocialProof(locale);
  const featured = getFeaturedProjects(locale);

  const copy =
    locale === 'de'
      ? {
          title: 'Ich baue digitale Systeme, die technisch sauber laufen und als Portfolio wirklich wirken.',
          description:
            'Mein Fokus liegt auf der Schnittstelle aus Produktlogik, Frontend-Engineering und Maker-Mindset. Ich arbeite dort, wo technische Entscheidungen sichtbar Auswirkungen auf Vertrauen, Geschwindigkeit und Wartbarkeit haben.',
          principlesTitle: 'Arbeitsprinzipien',
          principles: [
            'Klarheit vor Komplexitaet: Jede technische Entscheidung muss fuer Stakeholder nachvollziehbar sein.',
            'Delivery mit Guardrails: QA, Performance und Handover werden von Anfang an mitgedacht.',
            'Builder-Mentalitaet: Ideen werden schnell prototypisiert, aber stabil produktionsfaehig gemacht.'
          ],
          timelineTitle: 'Journey',
          proofTitle: 'Trust Layers',
          featuredTitle: 'Ausgewaehlte Referenzen'
        }
      : {
          title: 'I build digital systems that run cleanly and communicate technical authority.',
          description:
            'My work sits at the intersection of product logic, frontend engineering, and maker execution. I focus on decisions that measurably affect trust, speed, and maintainability.',
          principlesTitle: 'Working principles',
          principles: [
            'Clarity over complexity: technical decisions must stay explainable to stakeholders.',
            'Delivery with guardrails: QA, performance, and handover are built in from day one.',
            'Builder mindset: ideas move fast into prototypes, then into production-ready systems.'
          ],
          timelineTitle: 'Journey',
          proofTitle: 'Trust layers',
          featuredTitle: 'Selected references'
        };

  return (
    <PageScaffold locale={locale} title={copy.title} description={copy.description}>
      <div className={pageShell}>
        <SectionFrame className="section" tone="panel" sectionTheme="secondary" aria-labelledby="principles-title">
          <h2 id="principles-title" className="text-2xl font-semibold text-ink-900">
            {copy.principlesTitle}
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {copy.principles.map((item) => (
              <article key={item} className="insight-card text-ink-700">
                <p>{item}</p>
              </article>
            ))}
          </div>
        </SectionFrame>

        <SectionFrame className="section" tone="panel" aria-labelledby="timeline-title">
          <h2 id="timeline-title" className="text-2xl font-semibold text-ink-900">
            {copy.timelineTitle}
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {timeline.map((item) => (
              <article key={item.id} className="insight-card text-ink-700">
                <p className="insight-meta">{item.year}</p>
                <h3 className="text-ink-900">{item.localizedTitle}</h3>
                <p>{item.localizedDetail}</p>
              </article>
            ))}
          </div>
        </SectionFrame>

        <SectionFrame className="section" tone="panel" sectionTheme="secondary" aria-labelledby="proof-title">
          <h2 id="proof-title" className="text-2xl font-semibold text-ink-900">
            {copy.proofTitle}
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {socialProof.map((proof) => (
              <a
                key={proof.id}
                className="insight-card text-ink-700"
                href={proof.localizedHref}
                target={proof.external ? '_blank' : undefined}
                rel={proof.external ? 'noopener noreferrer' : undefined}
              >
                <h3 className="text-ink-900">{proof.localizedTitle}</h3>
                <p>{proof.localizedEvidence}</p>
              </a>
            ))}
          </div>
        </SectionFrame>

        <SectionFrame className="section" tone="metal" sectionTheme="primary" aria-labelledby="featured-title">
          <h2 id="featured-title" className="text-2xl font-semibold text-ink-900">
            {copy.featuredTitle}
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {featured.map((project) => (
              <article key={project.id} className="insight-card text-ink-700">
                <p className="insight-meta">{project.status.toUpperCase()}</p>
                <h3 className="text-ink-900">{project.localizedTitle}</h3>
                <p>{project.localizedSummary}</p>
                <p className="mt-3 text-sm text-ink-600">{project.localizedOutcome}</p>
                <Link href={project.localizedHref} className="insight-link mt-4 inline-flex" data-track-event="case_open">
                  {project.localizedCta}
                </Link>
              </article>
            ))}
          </div>
        </SectionFrame>
      </div>
    </PageScaffold>
  );
}

export function ProjectsBrandPage({ locale }: { locale: Locale }) {
  const professional = getProjectsByTrack(locale, 'professional');
  const maker = getProjectsByTrack(locale, 'maker');

  const copy =
    locale === 'de'
      ? {
          title: 'Projekte: technische Tiefe fuer Hiring, Produktteams und Collaboration.',
          description:
            'Ein Mix aus produktiven Kundenprojekten und Maker-Experimenten. Jeder Eintrag zeigt Ziel, Architektur und Ergebnis statt nur Visuals.',
          professionalTitle: 'Professional Track',
          makerTitle: 'Maker Track',
          stackLabel: 'Stack'
        }
      : {
          title: 'Projects: technical depth for hiring, product teams, and collaboration.',
          description:
            'A mix of production client work and maker experiments. Every entry shows goal, architecture, and outcome instead of surface-level visuals.',
          professionalTitle: 'Professional track',
          makerTitle: 'Maker track',
          stackLabel: 'Stack'
        };

  const renderProjectCard = (project: ReturnType<typeof getProjectsByTrack>[number]) => (
    <article key={project.id} className="insight-card text-ink-700">
      <p className="insight-meta">{project.status.toUpperCase()}</p>
      <h3 className="text-ink-900">{project.localizedTitle}</h3>
      <p>{project.localizedSummary}</p>
      <p className="mt-3 text-sm text-ink-600">{project.localizedOutcome}</p>
      <p className="mt-3 text-xs font-medium uppercase tracking-[0.08em] text-ink-500">{copy.stackLabel}</p>
      <ul className="mt-2 flex flex-wrap gap-2 text-xs text-ink-700">
        {project.stack.map((stack) => (
          <li key={stack} className="rounded-full border border-slate-300 px-2 py-1">
            {stack}
          </li>
        ))}
      </ul>
      <Link
        href={project.localizedHref}
        className="insight-link mt-4 inline-flex"
      >
        {project.localizedCta}
      </Link>
    </article>
  );

  return (
    <PageScaffold locale={locale} title={copy.title} description={copy.description}>
      <div className={pageShell}>
        <SectionFrame className="section" tone="panel" sectionTheme="secondary" aria-labelledby="professional-title">
          <h2 id="professional-title" className="text-2xl font-semibold text-ink-900">
            {copy.professionalTitle}
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">{professional.map(renderProjectCard)}</div>
        </SectionFrame>

        <SectionFrame className="section" tone="panel" aria-labelledby="maker-title">
          <h2 id="maker-title" className="text-2xl font-semibold text-ink-900">
            {copy.makerTitle}
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">{maker.map(renderProjectCard)}</div>
        </SectionFrame>
      </div>
    </PageScaffold>
  );
}

export function MakerLabPage({ locale }: { locale: Locale }) {
  const maker = getProjectsByTrack(locale, 'maker');

  const copy =
    locale === 'de'
      ? {
          title: 'Maker Lab: 3D-Printing-Workflows mit klarem Transfer in reale Produktprozesse.',
          description:
            'Hier entsteht der Creator-Track: Build-in-public Artefakte, 3D Workflows und explorative Tools, die in produktionsnahe Systeme ueberfuehrt werden.',
          focusTitle: 'Lab Fokus',
          focusItems: [
            '3D Datei-zu-Preis Systeme fuer reale Angebotsprozesse',
            'Visuelle Interaktionsmuster mit WebGL und performantem Rendering',
            'Prototype-to-production Handovers mit klaren technischen Guardrails'
          ],
          roadmapTitle: 'Naechste Builds',
          roadmapItems: [
            'Q2: Materialbibliothek mit erweiterten Toleranz- und Kostenchecks',
            'Q3: Automatisierte Angebotskonfiguration mit AI-Assists',
            'Q4: Public Maker-Playbook mit wiederverwendbaren Modulen'
          ],
          ctaPrimary: 'Maker-Projekt anfragen',
          ctaSecondary: 'Maker-Playbook lesen'
        }
      : {
          title: 'Maker Lab: 3D printing, prototyping, and technical experiments.',
          description:
            'This is the creator track: build-in-public artifacts, 3D workflows, and exploratory tools that later feed production-grade systems.',
          focusTitle: 'Lab focus',
          focusItems: [
            '3D file-to-price systems for real quote operations',
            'Visual interaction patterns with WebGL and performant rendering',
            'Prototype-to-production handovers with explicit technical guardrails'
          ],
          roadmapTitle: 'Roadmap',
          roadmapItems: [
            'Q2: Material library and extended tolerance checks',
            'Q3: AI-assisted automated quote configuration',
            'Q4: Public maker playbook with reusable modules'
          ],
          ctaPrimary: 'Discuss maker project',
          ctaSecondary: 'Read playbook'
        };

  const contactPath = getContactPath(locale, 'maker-lab-primary');
  const playbookPath = localizePath('/playbooks', locale);

  return (
    <PageScaffold locale={locale} title={copy.title} description={copy.description}>
      <div className={pageShell}>
        <SectionFrame className="section" tone="panel" sectionTheme="secondary" aria-labelledby="maker-focus-title">
          <h2 id="maker-focus-title" className="text-2xl font-semibold text-ink-900">
            {copy.focusTitle}
          </h2>
          <ul className="mt-6 grid gap-3 text-ink-700 md:grid-cols-3">
            {copy.focusItems.map((item) => (
              <li key={item} className="insight-card">
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              className="cta ui-btn ui-btn--metal btn-md motion-edge-sweep"
              href={contactPath}
            >
              {copy.ctaPrimary}
            </Link>
            <Link
              className="cta ui-btn ui-btn--ghost btn-md motion-edge-sweep"
              href={`${playbookPath}?source=maker-lab-playbook`}
            >
              {copy.ctaSecondary}
            </Link>
          </div>
        </SectionFrame>

        <SectionFrame className="section" tone="metal" sectionTheme="primary" aria-labelledby="maker-roadmap-title">
          <h2 id="maker-roadmap-title" className="text-2xl font-semibold text-ink-900">
            {copy.roadmapTitle}
          </h2>
          <ol className="mt-6 grid gap-3 text-ink-700 md:grid-cols-3">
            {copy.roadmapItems.map((item, index) => (
              <li key={item} className="insight-card">
                <p className="insight-meta">{index + 1}</p>
                <p>{item}</p>
              </li>
            ))}
          </ol>
        </SectionFrame>

        <SectionFrame className="section" tone="panel" aria-labelledby="maker-projects-title">
          <h2 id="maker-projects-title" className="text-2xl font-semibold text-ink-900">
            {locale === 'de' ? 'Maker Projekte' : 'Maker projects'}
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {maker.map((project) => (
              <article key={project.id} className="insight-card text-ink-700">
                <p className="insight-meta">{project.status.toUpperCase()}</p>
                <h3 className="text-ink-900">{project.localizedTitle}</h3>
                <p>{project.localizedSummary}</p>
                <p className="mt-3 text-sm text-ink-600">{project.localizedOutcome}</p>
                <Link
                  href={project.localizedHref}
                  className="insight-link mt-4 inline-flex"
                >
                  {project.localizedCta}
                </Link>
              </article>
            ))}
          </div>
        </SectionFrame>
      </div>
    </PageScaffold>
  );
}

export function ContactBrandPage({ locale }: { locale: Locale }) {
  const labels =
    locale === 'de'
      ? {
          title: 'Kontakt: Hiring, Projekt-Kollaboration oder Maker-Exchange.',
          description:
            '2-3 Saetze zu Ziel, Engpass und Zeitrahmen reichen. Du bekommst einen klaren naechsten Schritt statt generischer Rueckfragen.',
          panelTitle: 'Direkter Kontaktpfad',
          panelItems: [
            'Antwort in der Regel innerhalb eines Werktags',
            'Optionaler Intro-Call via Cal.com',
            'Technischer Scope-Check mit klarer Next-Step-Empfehlung'
          ],
          form: {
            formName: 'Name',
            formEmail: 'Business-E-Mail',
            formCompany: 'Firma (optional)',
            formMessage: 'Worum geht es konkret?',
            formButton: 'Erstgespraech anfragen',
            submitting: 'Wird gesendet...',
            success: 'Danke. Deine Anfrage wurde erfasst.',
            error: 'Senden fehlgeschlagen. Bitte erneut versuchen.',
            rateLimited: 'Zu viele Anfragen in kurzer Zeit. Bitte spaeter erneut versuchen.',
            verificationRequired: 'Bitte Sicherheitspruefung bestaetigen und erneut senden.',
            privacy: 'Mit dem Absenden stimmst du der Verarbeitung deiner Anfrage zur Kontaktaufnahme zu.',
            schedulerCta: '15-Min Termin buchen',
            schedulerHint: '15 Minuten Intro-Call'
          }
        }
      : {
          title: 'Contact: hiring, project collaboration, or maker exchange.',
          description:
            '2-3 lines about goal, bottleneck, and timeline are enough. You get a concrete next step, not generic follow-up questions.',
          panelTitle: 'Direct contact path',
          panelItems: [
            'Typical response within one business day',
            'Optional intro call via Cal.com',
            'Technical scope check before kickoff'
          ],
          form: {
            formName: 'Name',
            formEmail: 'Business email',
            formCompany: 'Company (optional)',
            formMessage: 'What are you trying to achieve?',
            formButton: 'Send request',
            submitting: 'Submitting...',
            success: 'Thanks. Your request has been received.',
            error: 'Request failed. Please try again.',
            rateLimited: 'Too many requests in a short time. Please retry later.',
            verificationRequired: 'Please complete verification and submit again.',
            privacy: 'By submitting, you agree that your request data is processed for contact purposes.',
            schedulerCta: 'Book intro call now',
            schedulerHint: '15 minute intro call'
          }
        };

  return (
    <PageScaffold locale={locale} title={labels.title} description={labels.description}>
      <div className={pageShell}>
        <SectionFrame className="section" tone="panel" sectionTheme="secondary" aria-labelledby="contact-panel-title">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            <div className="insight-card text-ink-700">
              <h2 id="contact-panel-title" className="text-2xl font-semibold text-ink-900">
                {labels.panelTitle}
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-ink-700">
                {labels.panelItems.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-ink-600">
                {locale === 'de' ? 'Oder direkt per Mail:' : 'Or email directly:'} <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </p>
            </div>
            <ContactLeadForm locale={locale} labels={labels.form} compact />
          </div>
        </SectionFrame>
      </div>
    </PageScaffold>
  );
}
