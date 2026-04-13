import Link from 'next/link';
import type { ReactNode } from 'react';

import { ContactLeadForm } from '@/components/home/ContactLeadForm';
import { PortfolioCaseTrackLink } from '@/components/portfolio/PortfolioCaseTrackLink';
import { RelaunchMarketingShell } from '@/components/layout/RelaunchMarketingShell';
import { Button } from '@/components/shadcn/button';
import type { Locale } from '@/content/copy';
import { getFeaturedProjects, getJourneyTimeline, getProjectsByTrack, getSocialProof } from '@/content/portfolioModels';
import { localizePath } from '@/lib/localeRouting';
import { RELAUNCH_CARD, RELAUNCH_CARD_HOVER, RELAUNCH_SECTION } from '@/lib/relaunchMarketingStyles';
import { getContactPath, getPrimaryNavLinks } from '@/lib/navigation';
import { CONTACT_EMAIL } from '@/lib/site';

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
  desktopContactTrackingSource = 'portfolio-scaffold-header'
}: PageScaffoldProps) {
  const navLinks = getPrimaryNavLinks(locale);
  const contactPath = getContactPath(locale, 'header-nav');
  const homeHref = localizePath('/', locale);
  const cta = locale === 'de' ? 'Erstgespräch' : 'Intro call';

  return (
    <RelaunchMarketingShell
      locale={locale}
      homeHref={homeHref}
      navLinks={navLinks}
      desktopCtaHref={contactPath}
      desktopCtaLabel={cta}
      mobileNavCtaLabel={cta}
      desktopContactTrackingSource={desktopContactTrackingSource}
      mobileNavPrimaryTrackingSource={`${desktopContactTrackingSource}-mobile`}
      shellClassName={shellClassName}
    >
      <main id="main-content" className="mx-auto w-full max-w-[1200px] flex-1 px-4 pb-10 pt-8 sm:px-6 md:pb-12 md:pt-10">
        <section className={`${RELAUNCH_SECTION} mb-8`} aria-labelledby="portfolio-page-title">
          <p className="home-eyebrow">
            {locale === 'de' ? 'Builder / Engineer / Maker' : 'Builder / Engineer / Maker'}
          </p>
          <h1
            id="portfolio-page-title"
            className="mt-1 font-display font-bold tracking-tight text-white"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', lineHeight: 1.15 }}
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
            'Klarheit vor Komplexität: Jede technische Entscheidung muss für Stakeholder nachvollziehbar sein.',
            'Delivery mit Guardrails: QA, Performance und Handover werden von Anfang an mitgedacht.',
            'Builder-Mentalität: Ideen werden schnell prototypisiert, aber stabil produktionsfähig gemacht.'
          ],
          timelineTitle: 'Journey',
          proofTitle: 'Trust Layers',
          featuredTitle: 'Ausgewählte Referenzen'
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
    <PageScaffold locale={locale} title={copy.title} description={copy.description} shellClassName="about-brand-page">
      <section className={RELAUNCH_SECTION} aria-labelledby="principles-title">
        <h2 id="principles-title" className="home-section-h2" style={{ fontSize: "1.5rem" }}>
          {copy.principlesTitle}
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {copy.principles.map((item) => (
            <article key={item} className={RELAUNCH_CARD}>
              <p className="text-sm text-slate-300">{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={RELAUNCH_SECTION} aria-labelledby="timeline-title">
        <h2 id="timeline-title" className="home-section-h2" style={{ fontSize: "1.5rem" }}>
          {copy.timelineTitle}
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {timeline.map((item) => (
            <article key={item.id} className={RELAUNCH_CARD}>
              <p className="home-eyebrow">{item.year}</p>
              <h3 className="mt-2 font-display text-base font-semibold text-slate-100">{item.localizedTitle}</h3>
              <p className="mt-2 text-sm text-slate-300">{item.localizedDetail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={RELAUNCH_SECTION} aria-labelledby="proof-title">
        <h2 id="proof-title" className="home-section-h2" style={{ fontSize: "1.5rem" }}>
          {copy.proofTitle}
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {socialProof.map((proof) => (
            <a
              key={proof.id}
              className={`${RELAUNCH_CARD_HOVER} block no-underline`}
              href={proof.localizedHref}
              target={proof.external ? '_blank' : undefined}
              rel={proof.external ? 'noopener noreferrer' : undefined}
            >
              <h3 className="font-display text-base font-semibold text-slate-100">{proof.localizedTitle}</h3>
              <p className="mt-2 text-sm text-slate-300">{proof.localizedEvidence}</p>
            </a>
          ))}
        </div>
      </section>

      <section className={RELAUNCH_SECTION} aria-labelledby="featured-title">
        <h2 id="featured-title" className="home-section-h2" style={{ fontSize: "1.5rem" }}>
          {copy.featuredTitle}
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {featured.map((project) => (
            <article key={project.id} className={RELAUNCH_CARD}>
              <p className="home-eyebrow">{project.status.toUpperCase()}</p>
              <h3 className="mt-2 font-display text-base font-semibold text-slate-100">{project.localizedTitle}</h3>
              <p className="mt-2 text-sm text-slate-300">{project.localizedSummary}</p>
              <p className="mt-3 text-sm text-slate-400">{project.localizedOutcome}</p>
              <PortfolioCaseTrackLink
                href={project.localizedHref}
                className="mt-4 inline-flex text-sm font-medium text-sky-400 hover:text-sky-300"
                projectId={project.id}
                source="portfolio_brand_featured"
                locale={locale}
              >
                {project.localizedCta}
              </PortfolioCaseTrackLink>
            </article>
          ))}
        </div>
      </section>
    </PageScaffold>
  );
}

export function ProjectsBrandPage({ locale }: { locale: Locale }) {
  const professional = getProjectsByTrack(locale, 'professional');
  const maker = getProjectsByTrack(locale, 'maker');

  const copy =
    locale === 'de'
      ? {
          title: 'Projekte: technische Tiefe für Hiring, Produktteams und Collaboration.',
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
    <article key={project.id} className={RELAUNCH_CARD}>
      <p className="home-eyebrow">{project.status.toUpperCase()}</p>
      <h3 className="mt-2 font-display text-base font-semibold text-slate-100">{project.localizedTitle}</h3>
      <p className="mt-2 text-sm text-slate-300">{project.localizedSummary}</p>
      <p className="mt-3 text-sm text-slate-400">{project.localizedOutcome}</p>
      <p className="mt-3 text-xs font-medium uppercase tracking-[0.08em] text-slate-500">{copy.stackLabel}</p>
      <ul className="mt-2 flex flex-wrap gap-2 text-xs text-slate-300">
        {project.stack.map((stack) => (
          <li key={stack} className="rounded-full border border-slate-600 px-2 py-1">
            {stack}
          </li>
        ))}
      </ul>
      <Link href={project.localizedHref} className="mt-4 inline-flex text-sm font-medium text-sky-400 hover:text-sky-300">
        {project.localizedCta}
      </Link>
    </article>
  );

  return (
    <PageScaffold locale={locale} title={copy.title} description={copy.description} shellClassName="projects-brand-page">
      <section className={RELAUNCH_SECTION} aria-labelledby="professional-title">
        <h2 id="professional-title" className="home-section-h2" style={{ fontSize: "1.5rem" }}>
          {copy.professionalTitle}
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">{professional.map(renderProjectCard)}</div>
      </section>

      <section className={RELAUNCH_SECTION} aria-labelledby="maker-title">
        <h2 id="maker-title" className="home-section-h2" style={{ fontSize: "1.5rem" }}>
          {copy.makerTitle}
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">{maker.map(renderProjectCard)}</div>
      </section>
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
            'Hier entsteht der Creator-Track: Build-in-public Artefakte, 3D Workflows und explorative Tools, die in produktionsnahe Systeme überführt werden.',
          focusTitle: 'Lab Fokus',
          focusItems: [
            '3D Datei-zu-Preis Systeme für reale Angebotsprozesse',
            'Visuelle Interaktionsmuster mit WebGL und performantem Rendering',
            'Prototype-to-production Handovers mit klaren technischen Guardrails'
          ],
          roadmapTitle: 'Nächste Builds',
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
    <PageScaffold locale={locale} title={copy.title} description={copy.description} shellClassName="maker-lab-page">
      <section className={RELAUNCH_SECTION} aria-labelledby="maker-focus-title">
        <h2 id="maker-focus-title" className="home-section-h2" style={{ fontSize: "1.5rem" }}>
          {copy.focusTitle}
        </h2>
        <ul className="mt-6 grid gap-3 md:grid-cols-3">
          {copy.focusItems.map((item) => (
            <li key={item} className={RELAUNCH_CARD}>
              <span className="text-sm text-slate-300">{item}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild className="bg-sky-500 text-slate-950 hover:bg-sky-400">
            <Link href={contactPath}>{copy.ctaPrimary}</Link>
          </Button>
          <Button asChild variant="outline" className="border-slate-600 bg-transparent text-slate-100 hover:bg-slate-800/60">
            <Link href={`${playbookPath}?source=maker-lab-playbook`}>{copy.ctaSecondary}</Link>
          </Button>
        </div>
      </section>

      <section className={RELAUNCH_SECTION} aria-labelledby="maker-roadmap-title">
        <h2 id="maker-roadmap-title" className="home-section-h2" style={{ fontSize: "1.5rem" }}>
          {copy.roadmapTitle}
        </h2>
        <ol className="mt-6 grid gap-3 md:grid-cols-3">
          {copy.roadmapItems.map((item, index) => (
            <li key={item} className={RELAUNCH_CARD}>
              <p className="home-eyebrow">{index + 1}</p>
              <p className="mt-2 text-sm text-slate-300">{item}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={RELAUNCH_SECTION} aria-labelledby="maker-projects-title">
        <h2 id="maker-projects-title" className="home-section-h2" style={{ fontSize: "1.5rem" }}>
          {locale === 'de' ? 'Maker Projekte' : 'Maker projects'}
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {maker.map((project) => (
            <article key={project.id} className={RELAUNCH_CARD}>
              <p className="home-eyebrow">{project.status.toUpperCase()}</p>
              <h3 className="mt-2 font-display text-base font-semibold text-slate-100">{project.localizedTitle}</h3>
              <p className="mt-2 text-sm text-slate-300">{project.localizedSummary}</p>
              <p className="mt-3 text-sm text-slate-400">{project.localizedOutcome}</p>
              <Link href={project.localizedHref} className="mt-4 inline-flex text-sm font-medium text-sky-400 hover:text-sky-300">
                {project.localizedCta}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </PageScaffold>
  );
}

export function ContactBrandPage({ locale }: { locale: Locale }) {
  const labels =
    locale === 'de'
      ? {
          title: 'Kontakt: Hiring, Projekt-Kollaboration oder Maker-Exchange.',
          description:
            '2-3 Sätze zu Ziel, Engpass und Zeitrahmen reichen. Du bekommst einen klaren nächsten Schritt statt generischer Rückfragen.',
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
            formButton: 'Erstgespräch anfragen',
            submitting: 'Wird gesendet...',
            success: 'Danke. Deine Anfrage wurde erfasst.',
            error: 'Senden fehlgeschlagen. Bitte erneut versuchen.',
            rateLimited: 'Zu viele Anfragen in kurzer Zeit. Bitte später erneut versuchen.',
            verificationRequired: 'Bitte Sicherheitsprüfung bestätigen und erneut senden.',
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
    <PageScaffold
      locale={locale}
      title={labels.title}
      description={labels.description}
      shellClassName="contact-brand-page"
      desktopContactTrackingSource="contact-page-header"
    >
      <section className={RELAUNCH_SECTION} aria-labelledby="contact-panel-title">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className={RELAUNCH_CARD}>
            <h2 id="contact-panel-title" className="home-section-h2" style={{ fontSize: "1.5rem" }}>
              {labels.panelTitle}
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              {labels.panelItems.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="shrink-0 text-sky-400 text-xs" aria-hidden="true">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-slate-400">
              {locale === 'de' ? 'Oder direkt per Mail:' : 'Or email directly:'}{' '}
              <a className="text-sky-400 hover:text-sky-300" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>
          <ContactLeadForm locale={locale} labels={labels.form} compact surface="relaunchDark" />
        </div>
      </section>
    </PageScaffold>
  );
}
