import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { MouseEvent } from 'react';

import { ContactForm } from '@/components/ContactForm';
import { HeroCommands } from '@/components/HeroCommands';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ProjectModal } from '@/components/ProjectModal';
import { copy, type Locale } from '@/content/copy';
import {
  getProjectById,
  getProjectStatusLabel,
  getProjectsByTier,
  type Project,
  type ProjectId
} from '@/content/projects';
import {
  buildProjectHref,
  createCloseProjectRoute,
  createOpenProjectRoute,
  parseProjectParam
} from '@/features/home/projectState';
import { trackEvent } from '@/lib/analytics';
import { resolveLocale } from '@/lib/locale';
import { CONTACT_EMAIL, CV_PATH, GITHUB_URL, SITE_URL } from '@/lib/site';

function renderProjectCard(
  project: Project,
  locale: Locale,
  onProjectLinkClick: (e: MouseEvent<HTMLAnchorElement>, id: ProjectId, source: string) => void
) {
  const firstMetric = project.outcome_metrics[0] ?? null;

  return (
    <a
      key={project.id}
      className="project-card"
      href={buildProjectHref(project.id)}
      onClick={(e) => onProjectLinkClick(e, project.id, 'project_card')}
      aria-haspopup="dialog"
      aria-label={`${project.title[locale]} - ${project.one_liner[locale]}`}
    >
      <span className="project-bg" aria-hidden="true">
        <Image
          src={project.thumbSrc}
          alt=""
          fill
          sizes="(max-width: 900px) 92vw, 420px"
          quality={85}
          style={{ objectFit: 'cover' }}
        />
      </span>
      <span className="project-overlay" aria-hidden="true" />
      <span className="project-content">
        <span className="tag">{getProjectStatusLabel(project.status, locale)}</span>
        <h3>{project.title[locale]}</h3>
        <p>{project.one_liner[locale]}</p>
        <p className="project-outcome">{project.business_outcome[locale]}</p>
        <p className="project-proof">{project.proof_statement[locale]}</p>
        {firstMetric ? (
          <p className="project-metric">
            <span>{firstMetric.label[locale]}:</span> {firstMetric.value[locale]}
          </p>
        ) : null}
        <span className="meta">{project.stack_tags.join(' | ')}</span>
      </span>
    </a>
  );
}

export default function HomePage() {
  const router = useRouter();
  const locale = resolveLocale(router.locale);
  const t = copy[locale];

  const projectParam = parseProjectParam(router.query.project);
  const activeProject = getProjectById(projectParam);

  const heroProject = getProjectsByTier('hero')[0] ?? null;
  const featuredProjects = getProjectsByTier('featured');
  const labsProjects = getProjectsByTier('labs');
  const heroProofLink = heroProject?.proof_link ?? '/configurator';

  const openProject = (id: ProjectId, source = 'unknown') => {
    trackEvent('case_study_open', { projectId: id, source, locale, path: router.asPath });

    void router.push(createOpenProjectRoute(router.pathname, router.query, id), undefined, {
      shallow: true,
      scroll: false
    });
  };

  const closeModal = () => {
    void router.replace(createCloseProjectRoute(router.pathname, router.query), undefined, {
      shallow: true,
      scroll: false
    });
  };

  const onProjectLinkClick = (e: MouseEvent<HTMLAnchorElement>, id: ProjectId, source: string) => {
    if (e.defaultPrevented) return;
    if (e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    openProject(id, source);
  };

  const onContactCtaClick = (location: string, intent: 'hiring' | 'client' | 'hybrid' = 'hybrid') => {
    trackEvent('cta_contact_click', {
      location,
      intent,
      locale,
      path: router.asPath
    });
  };

  const onCvClick = (location: string) => {
    trackEvent('cv_download', {
      location,
      locale,
      path: router.asPath
    });
  };

  const pageTitle = t.meta.title;
  const pageDescription = t.meta.description;
  const canonical = locale === 'en' ? `${SITE_URL}/en` : `${SITE_URL}/`;
  const cvPath = locale === 'en' ? CV_PATH.en : CV_PATH.de;
  const faqSchema = {
    '@type': 'FAQPage',
    '@id': `${canonical}#faq`,
    inLanguage: locale,
    mainEntity: t.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a
      }
    }))
  };

  const stackItems =
    locale === 'de'
      ? [
          {
            title: 'Frontend & Product Delivery',
            desc: 'React/Next.js + TypeScript, responsive UI-Umsetzung und klare Informationsarchitektur.'
          },
          {
            title: 'Backend & API Integrationen',
            desc: 'FastAPI-Services, Prozess-Orchestrierung und API-Integrationen fuer stabile Web-Workflows.'
          },
          {
            title: 'Datenlogik & Optimierung',
            desc: 'Python-Modelling, Szenario-Simulation und regelbasierte Optimierungslogik fuer Entscheidungen.'
          },
          {
            title: 'Deployment & Betrieb',
            desc: 'Docker, Caddy, Monitoring-Basis und serviceorientierte Integrationen fuer reproduzierbaren Betrieb.'
          }
        ]
      : [
          {
            title: 'Frontend & Product Delivery',
            desc: 'React/Next.js + TypeScript, responsive UI implementation, and clear information architecture.'
          },
          {
            title: 'Backend & API Integrations',
            desc: 'FastAPI services, process orchestration, and API integrations for reliable web workflows.'
          },
          {
            title: 'Data Logic & Optimization',
            desc: 'Python modeling, scenario simulation, and rule-based optimization logic for decision support.'
          },
          {
            title: 'Deployment & Operations',
            desc: 'Docker, Caddy, basic monitoring, and service-oriented integrations for reproducible delivery.'
          }
        ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': `${SITE_URL}#website`, url: SITE_URL, name: 'IVO TECH' },
      {
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: pageTitle,
        description: pageDescription,
        inLanguage: locale,
        isPartOf: { '@id': `${SITE_URL}#website` }
      },
      {
        '@type': 'Person',
        '@id': `${SITE_URL}#person`,
        name: 'Ivo',
        jobTitle: 'Junior Full-Stack Engineer',
        url: SITE_URL,
        email: `mailto:${CONTACT_EMAIL}`,
        sameAs: [GITHUB_URL]
      },
      faqSchema
    ]
  };

  const skipText = locale === 'de' ? 'Zum Inhalt springen' : 'Skip to content';

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="robots" content="index,follow" />

        <link rel="canonical" href={canonical} />
        <link rel="alternate" hrefLang="de" href={`${SITE_URL}/`} />
        <link rel="alternate" hrefLang="en" href={`${SITE_URL}/en`} />
        <link rel="alternate" hrefLang="x-default" href={`${SITE_URL}/`} />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="IVO TECH" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={`${SITE_URL}/assets/logo.png`} />
        <meta property="og:locale" content={locale === 'en' ? 'en_US' : 'de_DE'} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={`${SITE_URL}/assets/logo.png`} />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>

      <a className="skip-link" href="#main">
        {skipText}
      </a>

      <header className="site-header">
        <div className="brand">IVO TECH</div>
        <nav className="nav" aria-label={locale === 'de' ? 'Hauptnavigation' : 'Primary'}>
          <a href="#hero-case">{t.nav.heroCase}</a>
          <a href="#featured">{t.nav.featured}</a>
          <a href="#paths">{t.nav.paths}</a>
          <a href="#contact">{t.nav.contact}</a>
        </nav>
        <div className="header-right">
          <LanguageToggle />
          <a
            className="cta"
            href="#contact"
            onClick={() => onContactCtaClick('header')}
          >
            {t.nav.cta}
          </a>
        </div>
      </header>

      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">{t.hero.eyebrow}</p>
            <h1 id="hero-title">{t.hero.title}</h1>
            <p className="lead">{t.hero.lead}</p>
            <div className="hero-actions">
              <a className="primary" href="#contact" onClick={() => onContactCtaClick('hero_primary')}>
                {t.hero.primary}
              </a>
              <Link
                className="ghost"
                href="/configurator"
                locale={locale}
                onClick={() => trackEvent('case_study_open', { projectId: 'configurator_3d', source: 'hero_secondary', locale })}
              >
                {t.hero.secondary}
              </Link>
            </div>
            <div className="hero-links" aria-label={t.hero.linksLabel}>
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                {t.hero.github}
              </a>
              <a
                href={cvPath}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onCvClick('hero_links')}
              >
                {t.hero.cv}
              </a>
            </div>

            <HeroCommands locale={locale} onOpenProject={(id) => openProject(id, 'hero_command')} />
          </div>

          <div className="terminal-mini" role="presentation">
            <div className="terminal-bar">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
              <span className="title">{t.hero.terminal.title}</span>
            </div>
            <div className="terminal-body terminal-simple">
              {t.hero.terminal.lines.map((line) => (
                <p key={line} className="line">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section id="quick-facts" className="section" aria-labelledby="quick-facts-title">
          <div className="section-head">
            <h2 id="quick-facts-title">{t.quick_facts.title}</h2>
            <p>{t.quick_facts.desc}</p>
          </div>
          <div className="facts-grid">
            {t.quick_facts.items.map((item) => (
              <div key={item.label} className="fact-item">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </section>

        <section id="paths" className="section" aria-labelledby="paths-title">
          <div className="section-head">
            <h2 id="paths-title">{t.audience_paths.title}</h2>
            <p>{t.audience_paths.desc}</p>
          </div>
          <div className="paths-grid">
            {t.audience_paths.cards.map((card) => (
              <article key={card.id} className="path-card">
                <h3>{card.title}</h3>
                <ul>
                  {card.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
                <a
                  className="ghost"
                  href="#contact"
                  onClick={() => onContactCtaClick(`path_${card.id}`, card.id as 'hiring' | 'client')}
                >
                  {card.cta}
                </a>
              </article>
            ))}
          </div>
        </section>

        {heroProject ? (
          <section id="hero-case" className="section" aria-labelledby="hero-case-title">
            <div className="section-head">
              <h2 id="hero-case-title">{t.sections.heroCase.title}</h2>
              <p>{t.sections.heroCase.desc}</p>
            </div>

            <article className="hero-case-card">
              <div className="hero-case-top">
                <div>
                  <span className="tag">{getProjectStatusLabel(heroProject.status, locale)}</span>
                  <h3>{heroProject.title[locale]}</h3>
                </div>
                <div className="hero-case-tags" aria-label={locale === 'de' ? 'Stack tags' : 'Stack tags'}>
                  {heroProject.stack_tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>

              <p className="hero-case-lead">{heroProject.one_liner[locale]}</p>
              <p className="hero-case-outcome">{heroProject.business_outcome[locale]}</p>
              <p className="hero-case-proof">{heroProject.proof_statement[locale]}</p>
              <div className="outcome-grid">
                {heroProject.outcome_metrics.map((metric) => (
                  <div key={metric.label[locale]} className="outcome-item">
                    <span>{metric.label[locale]}</span>
                    <strong>{metric.value[locale]}</strong>
                  </div>
                ))}
              </div>

              {heroProject.case_study ? (
                <>
                  <div className="kpi-grid" aria-label={locale === 'de' ? 'KPI Snapshot' : 'KPI snapshot'}>
                    {heroProject.case_study.kpis.map((kpi) => (
                      <div key={kpi.label[locale]} className="kpi-card">
                        <div className="kpi-label">{kpi.label[locale]}</div>
                        <div className="kpi-value">{kpi.value[locale]}</div>
                        {kpi.note ? <div className="kpi-note">{kpi.note[locale]}</div> : null}
                      </div>
                    ))}
                  </div>

                  <div className="case-study-grid">
                    <div>
                      <h4>{locale === 'de' ? 'Ausgangslage' : 'Context'}</h4>
                      <ul>
                        {heroProject.case_study.problem[locale].map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4>{locale === 'de' ? 'Umsetzung' : 'Implementation'}</h4>
                      <ul>
                        {heroProject.case_study.solution[locale].map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4>{locale === 'de' ? 'Betrieb' : 'Operations'}</h4>
                      <ul>
                        {heroProject.case_study.technology[locale].map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4>{locale === 'de' ? 'Ergebnis' : 'Outcome'}</h4>
                      <ul>
                        {heroProject.case_study.impact[locale].map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4>{locale === 'de' ? 'Assets' : 'Assets'}</h4>
                      <ul>
                        {heroProject.case_study.media_assets[locale].map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </>
              ) : null}

              <div className="hero-case-actions">
                <a
                  className="primary"
                  href={heroProofLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('case_study_open', { projectId: heroProject.id, source: 'hero_case_live', locale })}
                >
                  {locale === 'de' ? 'Live Konfigurator' : 'Live configurator'}
                </a>
                <Link
                  className="ghost"
                  href="/configurator"
                  locale={locale}
                  onClick={() => trackEvent('case_study_open', { projectId: heroProject.id, source: 'hero_case_page', locale })}
                >
                  {locale === 'de' ? 'Premium Case Study' : 'Premium case study'}
                </Link>
                <a
                  className="ghost"
                  href={buildProjectHref(heroProject.id)}
                  onClick={(e) => onProjectLinkClick(e, heroProject.id, 'hero_case_modal')}
                >
                  {locale === 'de' ? 'Technische Details' : 'Technical details'}
                </a>
              </div>
            </article>
          </section>
        ) : null}

        <section id="featured" className="section" aria-labelledby="featured-title">
          <div className="section-head">
            <h2 id="featured-title">{t.sections.featured.title}</h2>
            <p>{t.sections.featured.desc}</p>
          </div>
          <div className="project-grid">{featuredProjects.map((p) => renderProjectCard(p, locale, onProjectLinkClick))}</div>
        </section>

        <section id="career-switch" className="section" aria-labelledby="career-switch-title">
          <div className="section-head">
            <h2 id="career-switch-title">{t.career_switch.title}</h2>
            <p>{t.career_switch.desc}</p>
          </div>
          <div className="career-grid">
            <p>{t.career_switch.intro}</p>
            <p>{t.career_switch.prior_experience}</p>
            <ul>
              {t.career_switch.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>
        </section>

        <section id="stack" className="section" aria-labelledby="stack-title">
          <div className="section-head">
            <h2 id="stack-title">{t.sections.stack.title}</h2>
            <p>{t.sections.stack.desc}</p>
          </div>
          <div className="stack-grid">
            {stackItems.map((item) => (
              <div key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="labs" className="section" aria-labelledby="labs-title">
          <div className="section-head">
            <h2 id="labs-title">{t.sections.labs.title}</h2>
            <p>{t.sections.labs.desc}</p>
          </div>
          <div className="project-grid labs-grid">{labsProjects.map((p) => renderProjectCard(p, locale, onProjectLinkClick))}</div>
        </section>

        <section id="contact" className="section" aria-labelledby="contact-title">
          <div className="section-head">
            <h2 id="contact-title">{t.sections.contact.title}</h2>
            <p>{t.sections.contact.desc}</p>
          </div>
          <div className="contact-layout">
            <ContactForm locale={locale} text={t.contact_form} />

            <aside className="contact-card">
              <p>{t.sections.contact.card}</p>
              <a className="primary" href={`mailto:${CONTACT_EMAIL}`} onClick={() => onContactCtaClick('contact_mailto')}>
                {locale === 'de' ? 'Direkt per E-Mail' : 'Email directly'}
              </a>
              <a
                className="ghost"
                href={cvPath}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onCvClick('contact_card')}
              >
                {t.hero.cv}
              </a>
              <a className="ghost" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                {t.hero.github}
              </a>

              <div className="trust-block">
                <h3>{t.trust.title}</h3>
                <ul>
                  {t.trust.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </section>

        <section id="faq" className="section" aria-labelledby="faq-title">
          <div className="section-head">
            <h2 id="faq-title">{t.faq.title}</h2>
            <p>{t.faq.desc}</p>
          </div>
          <div className="faq-list">
            {t.faq.items.map((item) => (
              <details key={item.q} className="faq-item">
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <span>{t.footer.left}</span>
        <span>{t.footer.right}</span>
      </footer>

      <a className="mobile-contact-cta" href="#contact" onClick={() => onContactCtaClick('mobile_sticky')}>
        {t.sections.contact.cta}
      </a>

      <ProjectModal project={activeProject} locale={locale} onClose={closeModal} />
    </>
  );
}
