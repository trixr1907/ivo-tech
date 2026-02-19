'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, type MouseEvent } from 'react';

import { ContactForm } from '@/components/ContactForm';
import { BrandLockup } from '@/components/BrandLockup';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ProjectModal } from '@/components/ProjectModal';
import { copy, type Locale } from '@/content/copy';
import { getProjectById, getProjectStatusLabel, getProjectsByTier, type Project, type ProjectId } from '@/content/projects';
import { buildProjectHref } from '@/features/home/projectState';
import { trackEvent } from '@/lib/analytics';
import { localizePath } from '@/lib/localeRouting';
import { CONTACT_EMAIL, CV_PATH, GITHUB_URL } from '@/lib/site';

type FeaturedInsightTeaser = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  readMinutes: number;
};

type Props = {
  locale: Locale;
  featuredInsights: FeaturedInsightTeaser[];
};

type ProofBarItem = {
  id: string;
  label: string;
  value: string;
  href: string;
};

type HomeVariant = 'a' | 'b';

function parseVariant(raw: string | null): HomeVariant | null {
  if (raw === 'a' || raw === 'b') return raw;
  return null;
}

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
        {firstMetric ? (
          <p className="project-metric">
            <span>{firstMetric.label[locale]}:</span> {firstMetric.value[locale]}
          </p>
        ) : null}
      </span>
    </a>
  );
}

export function HomePageClient({ locale, featuredInsights }: Props) {
  const router = useRouter();
  const pathname = usePathname() || (locale === 'en' ? '/en' : '/');
  const searchParams = useSearchParams();
  const search = searchParams?.toString() ?? '';
  const asPath = `${pathname}${search ? `?${search}` : ''}`;
  const t = copy[locale];

  const projectParam = searchParams?.get('project') ?? null;
  const activeProject = getProjectById(projectParam);

  const heroProject = getProjectsByTier('hero')[0] ?? null;
  const featuredProjects = getProjectsByTier('featured').slice(0, 3);
  const heroProofLink = heroProject?.proof_link ?? localizePath('/configurator', locale);
  const heroAttribution = heroProject?.attribution_note?.[locale] ?? null;
  const heroEngineeringHighlights = heroProject?.engineering_highlights?.[locale] ?? [];
  const heroMedia = heroProject?.media;
  const hasHeroVideo = Boolean(heroMedia?.videoMp4 || heroMedia?.videoWebm);
  const didTrackHeroVideo = useRef(false);
  const didTrackVariantExposure = useRef(false);
  const variant = useMemo<HomeVariant>(() => {
    if (typeof window === 'undefined') return 'a';

    const storageKey = 'ivo_home_cta_proof_v1';
    const fromQuery = parseVariant(new URLSearchParams(window.location.search).get('variant'));
    if (fromQuery) {
      try {
        window.localStorage.setItem(storageKey, fromQuery);
      } catch {
        // Best effort: fallback behavior remains deterministic.
      }
      return fromQuery;
    }

    try {
      const fromStorage = parseVariant(window.localStorage.getItem(storageKey));
      if (fromStorage) return fromStorage;
    } catch {
      // Ignore and fallback to random assignment.
    }

    const seed = `${window.location.hostname}|${navigator.userAgent}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }
    const assigned: HomeVariant = Math.abs(hash) % 2 === 0 ? 'a' : 'b';
    try {
      window.localStorage.setItem(storageKey, assigned);
    } catch {
      // Ignore storage failures.
    }
    return assigned;
  }, []);

  useEffect(() => {
    if (didTrackVariantExposure.current) return;
    didTrackVariantExposure.current = true;
    trackEvent('ab_home_variant_exposure', {
      experiment: 'home_cta_proof_v1',
      variant,
      locale,
      path: asPath
    });
  }, [asPath, locale, variant]);

  const primaryCtaLabel =
    variant === 'b'
      ? locale === 'de'
        ? 'Kostenlose Tech-Einschaetzung anfragen'
        : 'Request free tech assessment'
      : t.primaryCta.label;

  const primaryCtaShortLabel =
    variant === 'b' ? (locale === 'de' ? 'Tech-Einschaetzung' : 'Tech assessment') : t.primaryCta.shortLabel;

  const openProject = (id: ProjectId, source = 'unknown') => {
    trackEvent('case_study_open', { projectId: id, source, locale, path: asPath });

    const nextParams = new URLSearchParams(search);
    nextParams.set('project', id);
    const nextQuery = nextParams.toString();
    router.push(`${pathname}${nextQuery ? `?${nextQuery}` : ''}#featured`, { scroll: false });
  };

  const closeModal = () => {
    const nextParams = new URLSearchParams(search);
    nextParams.delete('project');
    const nextQuery = nextParams.toString();
    router.replace(`${pathname}${nextQuery ? `?${nextQuery}` : ''}#featured`, { scroll: false });
  };

  const onProjectLinkClick = (e: MouseEvent<HTMLAnchorElement>, id: ProjectId, source: string) => {
    if (e.defaultPrevented) return;
    if (e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    openProject(id, source);
  };

  const onPrimaryCtaClick = (source: string) => {
    trackEvent('cta_primary_click', {
      source,
      locale,
      path: asPath,
      intent: t.primaryCta.intent,
      experiment: 'home_cta_proof_v1',
      variant
    });
    trackEvent('cta_contact_click', {
      source,
      location: source,
      intent: 'hybrid',
      locale,
      path: asPath,
      experiment: 'home_cta_proof_v1',
      variant
    });
  };

  const onCvClick = (source: string) => {
    trackEvent('authority_asset_view', {
      asset: 'cv',
      source,
      locale,
      path: asPath
    });
    trackEvent('cv_download', {
      source,
      locale,
      path: asPath
    });
  };

  const proofBarItems: ProofBarItem[] =
    locale === 'de'
      ? variant === 'b'
        ? [
            {
              id: 'live_system',
              label: 'Live-Proof',
              value: 'Case mit End-to-End Upload-Flow',
              href: '#hero-case'
            },
            {
              id: 'delivery_quality',
              label: 'Qualitaets-Gates',
              value: 'Stabile Releases ueber klare Guardrails',
              href: '#services'
            },
            {
              id: 'response_window',
              label: 'Kapazitaet',
              value: '2 Deep-Dive Slots pro Monat',
              href: '#contact'
            }
          ]
        : [
            {
              id: 'live_system',
              label: 'Live-System',
              value: 'Upload bis Checkout im Betrieb',
              href: '#hero-case'
            },
            {
              id: 'delivery_quality',
              label: 'Delivery-Qualitaet',
              value: 'Lint, Typing, Unit, E2E, Lighthouse',
              href: '#services'
            },
            {
              id: 'response_window',
              label: 'Antwortzeit',
              value: 'In der Regel innerhalb von 24h',
              href: '#contact'
            }
          ]
      : variant === 'b'
        ? [
            {
              id: 'live_system',
              label: 'Live proof',
              value: 'Case study with end-to-end upload flow',
              href: '#hero-case'
            },
            {
              id: 'delivery_quality',
              label: 'Quality gates',
              value: 'Stable releases through clear guardrails',
              href: '#services'
            },
            {
              id: 'response_window',
              label: 'Capacity',
              value: '2 deep-dive slots per month',
              href: '#contact'
            }
          ]
        : [
            {
              id: 'live_system',
              label: 'Live system',
              value: 'Upload to checkout in production',
              href: '#hero-case'
            },
            {
              id: 'delivery_quality',
              label: 'Delivery quality',
              value: 'Lint, typing, unit, e2e, lighthouse',
              href: '#services'
            },
            {
              id: 'response_window',
              label: 'Response window',
              value: 'Typically within 24h',
              href: '#contact'
            }
          ];

  const cvPath = locale === 'en' ? CV_PATH.en : CV_PATH.de;

  const serviceCards =
    locale === 'de'
      ? [
          {
            title: 'Frontend & Product Delivery',
            desc: 'Next.js/React + TypeScript, klare Informationsarchitektur und robuste UI-Umsetzung.'
          },
          {
            title: 'Backend & API Integrationen',
            desc: 'FastAPI-Services, Datenfluesse und Integrationen fuer stabile End-to-End-Prozesse.'
          },
          {
            title: 'Betrieb & Guardrails',
            desc: 'Deployment, QA-Gates und Monitoring-Basis fuer reproduzierbare Delivery.'
          }
        ]
      : [
          {
            title: 'Frontend & Product Delivery',
            desc: 'Next.js/React + TypeScript, clear information architecture, and robust UI delivery.'
          },
          {
            title: 'Backend & API Integrations',
            desc: 'FastAPI services, data flows, and integrations for stable end-to-end processes.'
          },
          {
            title: 'Operations & Guardrails',
            desc: 'Deployment, QA gates, and monitoring basics for reproducible delivery.'
          }
        ];

  const skipText = locale === 'de' ? 'Zum Inhalt springen' : 'Skip to content';

  return (
    <>
      <a className="skip-link" href="#main">
        {skipText}
      </a>

      <header className="site-header home-v2-header">
        <BrandLockup variant="header" />
        <nav className="nav" aria-label={locale === 'de' ? 'Hauptnavigation' : 'Primary'}>
          <a href="#proof-bar">{locale === 'de' ? 'Proof' : 'Proof'}</a>
          <a href="#hero-case">{t.nav.heroCase}</a>
          <a href="#services">{locale === 'de' ? 'Services' : 'Services'}</a>
          <a href="#featured">{t.nav.featured}</a>
          <a href="#contact">{t.nav.contact}</a>
        </nav>
        <div className="header-right">
          <LanguageToggle />
          <a className="cta" href={t.primaryCta.href} onClick={() => onPrimaryCtaClick('header_primary')}>
            {primaryCtaShortLabel}
          </a>
        </div>
      </header>

      <main id="main" className="home-v2-main">
        <section className="hero home-v2-hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">{t.hero.eyebrow}</p>
            <h1 id="hero-title">{t.hero.title}</h1>
            <p className="lead">{t.hero.lead}</p>
            <p className="hero-sublead">{t.hero.sublead}</p>

            <div className="hero-actions">
              <a className="primary" href={t.primaryCta.href} onClick={() => onPrimaryCtaClick('hero_primary')}>
                {primaryCtaLabel}
              </a>
              <Link
                className="hero-text-link"
                href={localizePath('/configurator', locale)}
                onClick={() =>
                  trackEvent('case_study_open', {
                    projectId: 'configurator_3d',
                    source: 'hero_secondary',
                    locale,
                    path: asPath
                  })
                }
              >
                {t.hero.secondary}
              </Link>
            </div>

            <div className="hero-links" aria-label={t.hero.linksLabel}>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('authority_asset_view', { asset: 'github', source: 'hero_links', locale, path: asPath })}
              >
                {t.hero.github}
              </a>
              <a href={cvPath} target="_blank" rel="noopener noreferrer" onClick={() => onCvClick('hero_links')}>
                {t.hero.cv}
              </a>
            </div>
          </div>

          <article className="hero-media-card" aria-label={locale === 'de' ? 'Hero Case Teaser' : 'Hero case teaser'}>
            {hasHeroVideo ? (
              <video
                className="hero-teaser-video"
                muted
                loop
                autoPlay
                playsInline
                preload="none"
                poster={heroMedia?.poster ?? heroProject?.thumbSrc}
                onPlay={() => {
                  if (didTrackHeroVideo.current) return;
                  didTrackHeroVideo.current = true;
                  trackEvent('hero_video_play', { source: 'hero_teaser', locale, path: asPath });
                }}
              >
                {heroMedia?.videoWebm ? <source src={heroMedia.videoWebm} type="video/webm" /> : null}
                {heroMedia?.videoMp4 ? <source src={heroMedia.videoMp4} type="video/mp4" /> : null}
              </video>
            ) : (
              <div className="hero-teaser-poster">
                <Image
                  src={heroMedia?.poster ?? heroProject?.thumbSrc ?? '/assets/thumb_viewer_neon.avif'}
                  alt=""
                  fill
                  sizes="(max-width: 900px) 92vw, 520px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            )}
            <p className="hero-media-caption">
              {heroMedia?.caption[locale] ??
                (locale === 'de'
                  ? 'Live-Kontext: Datei-Upload, Analyse und Checkout-Handoff.'
                  : 'Live context: file upload, analysis, and checkout handoff.')}
            </p>
          </article>
        </section>

        <section id="proof-bar" className="section proof-bar-section" aria-label={locale === 'de' ? 'Proof Bar' : 'Proof bar'}>
          <div className="proof-bar">
            {proofBarItems.map((item) => (
              <a
                key={item.id}
                className="proof-bar-item"
                href={item.href}
                onClick={() =>
                  trackEvent('proof_asset_open', {
                    source: `proof_bar_${item.id}`,
                    locale,
                    path: asPath,
                    experiment: 'home_cta_proof_v1',
                    variant
                  })
                }
              >
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </a>
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

              <div className="hero-case-layout">
                <div className="hero-case-copy">
                  <p className="hero-case-lead">{heroProject.one_liner[locale]}</p>
                  <p className="hero-case-outcome">{heroProject.business_outcome[locale]}</p>
                  <p className="hero-case-proof">{heroProject.proof_statement[locale]}</p>
                  {heroAttribution ? <p className="hero-case-attribution">{heroAttribution}</p> : null}
                </div>
                {heroEngineeringHighlights.length > 0 ? (
                  <aside className="hero-case-engineering" aria-label={locale === 'de' ? 'Engineering Snapshot' : 'Engineering snapshot'}>
                    <h4>{locale === 'de' ? 'Engineering Snapshot' : 'Engineering snapshot'}</h4>
                    <ul>
                      {heroEngineeringHighlights.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </aside>
                ) : null}
              </div>

              <div className="outcome-grid">
                {heroProject.outcome_metrics.map((metric) => (
                  <div key={metric.label[locale]} className="outcome-item">
                    <span>{metric.label[locale]}</span>
                    <strong>{metric.value[locale]}</strong>
                  </div>
                ))}
              </div>

              <div className="hero-case-actions">
                <a
                  className="primary"
                  href={heroProofLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent('case_study_open', { projectId: heroProject.id, source: 'hero_case_live', locale, path: asPath })
                  }
                >
                  {locale === 'de' ? 'Live beim Kunden' : 'Live on client site'}
                </a>
                <Link
                  className="hero-text-link"
                  href={localizePath('/configurator', locale)}
                  onClick={() =>
                    trackEvent('case_study_open', { projectId: heroProject.id, source: 'hero_case_page', locale, path: asPath })
                  }
                >
                  {locale === 'de' ? 'Case Study' : 'Case study'}
                </Link>
                <a className="ghost" href={buildProjectHref(heroProject.id)} onClick={(e) => onProjectLinkClick(e, heroProject.id, 'hero_case_modal')}>
                  {locale === 'de' ? 'Technische Details' : 'Technical details'}
                </a>
              </div>
            </article>
          </section>
        ) : null}

        <section id="services" className="section" aria-labelledby="services-title">
          <div className="section-head">
            <h2 id="services-title">{t.method.title}</h2>
            <p>{t.method.desc}</p>
          </div>

          <div className="method-grid">
            {t.method.steps.map((step) => (
              <article key={step.title} className="method-card">
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </article>
            ))}
          </div>

          <div className="services-grid">
            {serviceCards.map((item) => (
              <article key={item.title} className="service-card">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </article>
            ))}
          </div>

          <div className="method-actions">
            <a className="primary" href={t.primaryCta.href} onClick={() => onPrimaryCtaClick('services_primary')}>
              {primaryCtaLabel}
            </a>
          </div>
        </section>

        <section id="featured" className="section" aria-labelledby="featured-title">
          <div className="section-head">
            <h2 id="featured-title">{locale === 'de' ? 'Kuratierte Projekte' : 'Curated projects'}</h2>
            <p>
              {locale === 'de'
                ? 'Ausgewaehlte Referenzen mit klarem Tech-Fokus und nachvollziehbarer Wirkung.'
                : 'Selected references with clear technical focus and traceable outcomes.'}
            </p>
          </div>
          <div className="project-grid">{featuredProjects.map((p) => renderProjectCard(p, locale, onProjectLinkClick))}</div>
        </section>

        <section id="insights" className="section" aria-labelledby="insights-title">
          <div className="section-head">
            <h2 id="insights-title">{t.insights.title}</h2>
            <p>{t.insights.desc}</p>
          </div>
          <div className="insights-grid">
            {featuredInsights.map((insight) => (
              <article key={insight.slug} className="insight-card">
                <span className="insight-meta">
                  {insight.category} | {insight.readMinutes} min
                </span>
                <h3>{insight.title}</h3>
                <p>{insight.summary}</p>
                <Link
                  href={localizePath(`/insights/${insight.slug}`, locale)}
                  className="insight-link"
                  onClick={() =>
                    trackEvent('authority_asset_view', {
                      asset: `insight_${insight.slug}`,
                      source: 'home_insights',
                      locale,
                      path: asPath
                    })
                  }
                >
                  {locale === 'de' ? 'Insight lesen' : 'Read insight'}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="section" aria-labelledby="contact-title">
          <div className="section-head">
            <h2 id="contact-title">{t.sections.contact.title}</h2>
            <p>{t.sections.contact.desc}</p>
          </div>
          <div className="contact-layout">
            <ContactForm
              locale={locale}
              text={t.contact_form}
              trackingContext={{
                experiment: 'home_cta_proof_v1',
                variant,
                source: 'contact_form_home'
              }}
            />

            <aside className="contact-card">
              <p>{t.sections.contact.card}</p>
              <a className="primary" href={`mailto:${CONTACT_EMAIL}`} onClick={() => onPrimaryCtaClick('contact_mailto_primary')}>
                {locale === 'de' ? 'Direkt per E-Mail' : 'Email directly'}
              </a>
              <a href={cvPath} className="ghost" target="_blank" rel="noopener noreferrer" onClick={() => onCvClick('contact_card')}>
                {t.hero.cv}
              </a>
              <a
                className="ghost"
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('authority_asset_view', { asset: 'github', source: 'contact_card', locale, path: asPath })}
              >
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

      <a className="global-contact-cta" href={t.primaryCta.href} onClick={() => onPrimaryCtaClick('sticky_primary')}>
        {primaryCtaShortLabel}
      </a>

      <ProjectModal project={activeProject} locale={locale} onClose={closeModal} />
    </>
  );
}
