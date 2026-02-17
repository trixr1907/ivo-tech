import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { MouseEvent } from 'react';

import { HeroCommands } from '@/components/HeroCommands';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ProjectModal } from '@/components/ProjectModal';
import { copy, type Locale } from '@/content/copy';
import { getStackProofBySignal } from '@/content/portfolioSignals';
import {
  buildProjectHref,
  createCloseProjectRoute,
  createOpenProjectRoute,
  parseProjectParam
} from '@/features/home/projectState';
import { resolveLocale } from '@/lib/locale';
import { CONTACT_EMAIL, SITE_URL } from '@/lib/site';
import {
  getProjectById,
  getProjectStatusLabel,
  getProjectsByTier,
  type Project,
  type ProjectId
} from '@/content/projects';

const GITHUB_URL = 'https://github.com/trixr1907';
const productEngineeringProof = getStackProofBySignal('product_engineering_reference');

function renderProjectCard(
  project: Project,
  locale: Locale,
  onProjectLinkClick: (e: MouseEvent<HTMLAnchorElement>, id: ProjectId) => void
) {
  return (
    <a
      key={project.id}
      className="project-card"
      href={buildProjectHref(project.id)}
      onClick={(e) => onProjectLinkClick(e, project.id)}
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

  const openProject = (id: ProjectId) => {
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

  const onProjectLinkClick = (e: MouseEvent<HTMLAnchorElement>, id: ProjectId) => {
    if (e.defaultPrevented) return;
    if (e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    openProject(id);
  };

  const pageTitle = t.meta.title;
  const pageDescription = t.meta.description;
  const canonical = locale === 'en' ? `${SITE_URL}/en` : `${SITE_URL}/`;

  const stackItems =
    locale === 'de'
      ? [
          {
            title: 'AI & Automation',
            desc: 'FastAPI-Services, OpenAI STT/TTS und mehrstufige Prozess-Orchestrierung fuer robuste Flows.'
          },
          {
            title: 'Product Engineering',
            desc: 'React/Next.js + TypeScript, UX-fokussierte Informationsarchitektur und klare Delivery-Schnittstellen.',
            proof: productEngineeringProof
          },
          {
            title: 'Data & Optimization',
            desc: 'Python Modeling, Szenario-Simulation, Optimierungslogik und entscheidungsfaehige Scores.'
          },
          {
            title: 'Systems & Edge',
            desc: 'Docker, Caddy, ESP32, Home Assistant und serviceorientierte Integrationen fuer lokale Umgebungen.'
          }
        ]
      : [
          {
            title: 'AI & Automation',
            desc: 'FastAPI services, OpenAI STT/TTS, and multi-step process orchestration for robust workflows.'
          },
          {
            title: 'Product Engineering',
            desc: 'React/Next.js + TypeScript, UX-focused information architecture, and clear delivery interfaces.',
            proof: productEngineeringProof
          },
          {
            title: 'Data & Optimization',
            desc: 'Python modeling, scenario simulation, optimization logic, and decision-ready scoring.'
          },
          {
            title: 'Systems & Edge',
            desc: 'Docker, Caddy, ESP32, Home Assistant, and service-oriented local integrations.'
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
        url: SITE_URL,
        email: `mailto:${CONTACT_EMAIL}`,
        sameAs: [GITHUB_URL]
      }
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
          <a href="#stack">{t.nav.stack}</a>
          <a href="#labs">{t.nav.labs}</a>
          <a href="#contact">{t.nav.contact}</a>
        </nav>
        <div className="header-right">
          <LanguageToggle />
          <a className="cta" href="#hero-case">
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
              <a className="primary" href="#hero-case">
                {t.hero.primary}
              </a>
              <a className="ghost" href="#contact">
                {t.hero.secondary}
              </a>
            </div>

            <HeroCommands locale={locale} onOpenProject={openProject} />
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

        <section id="positioning" className="section" aria-labelledby="positioning-title">
          <div className="section-head">
            <h2 id="positioning-title">{t.sections.positioning.title}</h2>
            <p>{t.sections.positioning.desc}</p>
          </div>
          <div className="positioning-list">
            {t.sections.positioning.bullets.map((item) => (
              <div key={item} className="positioning-item">
                {item}
              </div>
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

              {heroProject.case_study ? (
                <>
                  <div className="kpi-grid" aria-label={locale === 'de' ? 'KPI Platzhalter' : 'KPI placeholders'}>
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
                      <h4>{locale === 'de' ? 'Problem' : 'Problem'}</h4>
                      <ul>
                        {heroProject.case_study.problem[locale].map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4>{locale === 'de' ? 'Loesung' : 'Solution'}</h4>
                      <ul>
                        {heroProject.case_study.solution[locale].map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4>{locale === 'de' ? 'Technologie' : 'Technology'}</h4>
                      <ul>
                        {heroProject.case_study.technology[locale].map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4>Impact</h4>
                      <ul>
                        {heroProject.case_study.impact[locale].map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4>{locale === 'de' ? 'Screenshots / Demos' : 'Screenshots / demos'}</h4>
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
                >
                  {locale === 'de' ? 'Live Konfigurator' : 'Live configurator'}
                </a>
                <Link className="ghost" href="/configurator">
                  {locale === 'de' ? 'Premium Case Study' : 'Premium case study'}
                </Link>
                <a className="ghost" href={buildProjectHref(heroProject.id)} onClick={(e) => onProjectLinkClick(e, heroProject.id)}>
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
                {item.proof ? (
                  <a className="stack-proof" href={item.proof.href}>
                    <span className="stack-proof-label">{item.proof.label[locale]}</span>
                    <span className="stack-proof-line">{item.proof.one_liner[locale]}</span>
                  </a>
                ) : null}
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
          <div className="contact-card">
            <p>{t.sections.contact.card}</p>
            <a className="primary" href={`mailto:${CONTACT_EMAIL}`}>
              {t.sections.contact.cta}
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <span>{t.footer.left}</span>
        <span>{t.footer.right}</span>
      </footer>

      <ProjectModal project={activeProject} locale={locale} onClose={closeModal} />
    </>
  );
}
