'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, type MouseEvent } from 'react';

import { BackgroundFX } from '@/components/BackgroundFX';
import { LanguageToggle } from '@/components/LanguageToggle';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { Accordion } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';
import { CTACluster } from '@/components/ui/CTACluster';
import { FeatureCard } from '@/components/ui/FeatureCard';
import { HeroShell } from '@/components/ui/HeroShell';
import { Icon, type BrandIconName } from '@/components/ui/Icon';
import { InsightCard } from '@/components/ui/InsightCard';
import { MetricCard } from '@/components/ui/MetricCard';
import { ProofBarItem } from '@/components/ui/ProofBarItem';
import { SectionFrame } from '@/components/ui/SectionFrame';
import { SectionHead } from '@/components/ui/SectionHead';
import { getProjectById, getProjectStatusLabel, getProjectsByTier, type Project, type ProjectId } from '@/content/projects';
import { buildProjectHref } from '@/features/home/projectState';
import { trackEvent } from '@/lib/analytics';
import { localizePath } from '@/lib/localeRouting';
import { CONTACT_EMAIL, CV_PATH, GITHUB_URL } from '@/lib/sitePublic';

const ContactForm = dynamic(() => import('@/components/ContactForm').then((m) => m.ContactForm), {
  ssr: false,
  loading: () => <div className="contact-form-card" aria-busy="true" />
});

const ProjectModal = dynamic(() => import('@/components/ProjectModal').then((m) => m.ProjectModal), {
  ssr: false
});

type FeaturedInsightTeaser = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  readMinutes: number;
};

type Props = {
  locale: Locale;
  copyText: HomeCopy;
  featuredInsights: FeaturedInsightTeaser[];
};

type ProofBarItemData = {
  id: string;
  label: string;
  value: string;
  href: string;
};

type Locale = keyof typeof import('@/content/copy').copy;
type HomeCopy = (typeof import('@/content/copy').copy)[Locale];

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

export function HomePageClient({ locale, copyText, featuredInsights }: Props) {
  const router = useRouter();
  const pathname = usePathname() || (locale === 'en' ? '/en' : '/');
  const searchParams = useSearchParams();
  const search = searchParams?.toString() ?? '';
  const asPath = `${pathname}${search ? `?${search}` : ''}`;
  const t = copyText;
  const home = copyText.home;

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
  const [isHeaderCondensed, setIsHeaderCondensed] = useState(false);
  const [isHeroVideoActive, setIsHeroVideoActive] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero-case');

  useEffect(() => {
    const onScroll = () => setIsHeaderCondensed(window.scrollY > 14);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sectionIds = ['hero-case', 'featured', 'about', 'insights', 'contact'];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section instanceof HTMLElement);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio || a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]?.target.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: '-22% 0px -58% 0px',
        threshold: [0.16, 0.35, 0.6]
      }
    );

    sections.forEach((section) => observer.observe(section));

    const syncFromHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && sectionIds.includes(hash)) {
        setActiveSection(hash);
      }
    };

    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);

    return () => {
      observer.disconnect();
      window.removeEventListener('hashchange', syncFromHash);
    };
  }, []);

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

  const onCasePrimaryClick = (source: string) => {
    trackEvent('cta_case_primary_click', {
      source,
      locale,
      path: asPath,
      intent: 'case_study'
    });
  };

  const onContactSecondaryClick = (source: string) => {
    trackEvent('cta_contact_secondary_click', {
      source,
      location: source,
      intent: 'contact',
      locale,
      path: asPath
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

  const proofBarItems = home.proof as readonly ProofBarItemData[];
  const serviceCards = home.services;
  const navItems = [
    { href: '#hero-case', label: t.nav.heroCase, id: 'hero-case' },
    { href: '#featured', label: t.nav.featured, id: 'featured' },
    { href: '#about', label: locale === 'de' ? 'Ueber mich' : 'About', id: 'about' },
    { href: '#insights', label: locale === 'de' ? 'Insights' : 'Insights', id: 'insights' },
    { href: '#contact', label: t.nav.contact, id: 'contact' }
  ] as const;

  const cvPath = locale === 'en' ? CV_PATH.en : CV_PATH.de;
  const heroPrimaryContactHref = t.sectionCtas.hero.primary.href;
  const heroSecondaryCaseHref = t.sectionCtas.hero.secondary.href;

  return (
    <>
      <div className="theme-ref103632 ui-main-surface home-v3" data-theme="fusion">
        <BackgroundFX />

        <SiteHeader
          className="home-v2-header"
          condensed={isHeaderCondensed}
          ariaLabel={locale === 'de' ? 'Hauptnavigation' : 'Primary navigation'}
          theme="dark"
          logoTheme="dark"
          logoTier="tier2"
          logoPreset="ref103632"
          logoVisualPreset="premium"
          logoEdgeGlow="medium"
          visualMode="portfolio"
          nav={
            <>
              {navItems.map((item) => (
                <a key={item.id} href={item.href} data-active={activeSection === item.id ? 'true' : undefined}>
                  {item.label}
                </a>
              ))}
            </>
          }
          rightSlot={
            <>
              <LanguageToggle />
              <Button
                href={heroPrimaryContactHref}
                className="cta"
                variant="signal"
                glowLevel="medium"
                onClick={() => onContactSecondaryClick('header_secondary_contact')}
              >
                {t.nav.cta}
              </Button>
            </>
          }
        />

        <main id="main-content" className="home-v2-main home-v3-main">
          <HeroShell className="hero home-v2-hero home-v3-hero" aria-labelledby="hero-title">
            <div className="hero-copy">
              <p className="eyebrow">{home.hero.eyebrow}</p>
              <h1 id="hero-title">{home.hero.title}</h1>
              <p className="lead">{home.hero.lead}</p>
              <p className="hero-sublead">{home.hero.sublead}</p>

              {'highlights' in home.hero && Array.isArray(home.hero.highlights) && home.hero.highlights.length ? (
                <div className="hero-highlights" aria-label={locale === 'de' ? 'Kernfokus' : 'Key focus areas'}>
                  {home.hero.highlights.map((item) => (
                    <span key={item} className="hero-highlight">
                      {item}
                    </span>
                  ))}
                </div>
              ) : null}

              <CTACluster className="hero-actions">
                <Button
                  href={heroPrimaryContactHref}
                  variant="signal"
                  glowLevel="medium"
                  onClick={() => {
                    onContactSecondaryClick('hero_primary_contact');
                  }}
                >
                  {t.sectionCtas.hero.primary.label}
                </Button>
                <Button
                  href={heroSecondaryCaseHref}
                  variant="proof"
                  onClick={() => {
                    onCasePrimaryClick('hero_secondary_case');
                    trackEvent('case_study_open', {
                      projectId: 'configurator_3d',
                      source: 'hero_secondary_case',
                      locale,
                      path: asPath
                    });
                  }}
                >
                  {t.sectionCtas.hero.secondary.label}
                </Button>
              </CTACluster>

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
                <a href="#contact" onClick={() => onContactSecondaryClick('hero_links')}>
                  {t.hero.contact}
                </a>
              </div>
            </div>

            <article className="hero-media-card motion-depth-drift" aria-label={locale === 'de' ? 'Hero Case Teaser' : 'Hero case teaser'}>
              {hasHeroVideo ? (
                <div className="hero-teaser-poster">
                  {!isHeroVideoActive ? (
                    <>
                      <Image
                        src={heroMedia?.poster ?? heroProject?.thumbSrc ?? '/assets/thumb_viewer_neon.avif'}
                        alt=""
                        fill
                        sizes="(max-width: 900px) 92vw, 520px"
                        style={{ objectFit: 'cover' }}
                      />
                      <button
                        type="button"
                        className="hero-teaser-trigger"
                        onClick={() => {
                          setIsHeroVideoActive(true);
                          trackEvent('hero_video_play', { source: 'hero_teaser_trigger', locale, path: asPath });
                        }}
                      >
                        {locale === 'de' ? 'Teaser laden' : 'Load teaser'}
                      </button>
                    </>
                  ) : (
                    <video
                      className="hero-teaser-video"
                      muted
                      loop
                      autoPlay
                      playsInline
                      controls
                      preload="metadata"
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
                  )}
                </div>
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
                    ? '36s Brand-Teaser: Authority-first Engineering von Proof bis Live-Handoff.'
                    : '36s brand teaser: authority-first engineering from proof to live handoff.')}
              </p>
            </article>
          </HeroShell>

          <div>
            <section id="proof-bar" className="section proof-bar-section" aria-label={locale === 'de' ? 'Proof Bar' : 'Proof bar'}>
              <div className="proof-bar">
                {proofBarItems.map((item) => (
                  <ProofBarItem
                    key={item.id}
                    label={item.label}
                    value={item.value}
                    href={item.href}
                    onClick={() =>
                      trackEvent('proof_asset_open', {
                        source: `proof_bar_${item.id}`,
                        locale,
                        path: asPath
                      })
                    }
                  />
                ))}
              </div>
            </section>
          </div>

          {heroProject ? (
            <div>
              <SectionFrame
                id="hero-case"
                className="section"
                aria-labelledby="hero-case-title"
                tone="metal"
                surfaceStyle="glass"
                sectionTheme="fusion"
                emphasis="expressive"
                density="spacious"
              >
                <SectionHead titleId="hero-case-title" title={home.case.title} description={home.case.desc} />

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
                      <MetricCard key={metric.label[locale]} label={metric.label[locale]} value={metric.value[locale]} />
                    ))}
                  </div>

                  <CTACluster className="hero-case-actions">
                    <Button
                      href={heroProofLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="proof"
                      onClick={() => {
                        onCasePrimaryClick('hero_case_primary_live');
                        trackEvent('case_study_open', { projectId: heroProject.id, source: 'hero_case_primary_live', locale, path: asPath });
                      }}
                    >
                      {locale === 'de' ? 'Live beim Kunden' : 'Live on client site'}
                    </Button>
                    <Link
                      className="secondary"
                      href={localizePath('/configurator', locale)}
                      onClick={() => {
                        onCasePrimaryClick('hero_case_detail_page');
                        trackEvent('case_study_open', { projectId: heroProject.id, source: 'hero_case_detail_page', locale, path: asPath });
                      }}
                    >
                      {locale === 'de' ? 'Case Study' : 'Case study'}
                    </Link>
                    <a className="ghost" href={buildProjectHref(heroProject.id)} onClick={(e) => onProjectLinkClick(e, heroProject.id, 'hero_case_modal')}>
                      {locale === 'de' ? 'Technische Details' : 'Technical details'}
                    </a>
                  </CTACluster>
                </article>
              </SectionFrame>
            </div>
          ) : null}

          <div>
            <SectionFrame id="about" className="section" aria-labelledby="about-title" tone="panel" density="spacious" sectionTheme="fusion">
              <SectionHead
                titleId="about-title"
                title={home.about.title}
                description={home.about.desc}
                actions={
                  <CTACluster className="section-head-actions">
                    <Button href={cvPath} target="_blank" rel="noopener noreferrer" variant="flat" onClick={() => onCvClick('about_section_head')}>
                      {t.hero.cv}
                    </Button>
                    <Button href="#contact" variant="secondary" onClick={() => onContactSecondaryClick('about_section_head')}>
                      {t.hero.contact}
                    </Button>
                  </CTACluster>
                }
              />

              <div className="about-grid">
                <div className="about-copy">
                  {home.about.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}

                  <div className="about-links" aria-label={locale === 'de' ? 'Profil-Links' : 'Profile links'}>
                    <a href={cvPath} target="_blank" rel="noopener noreferrer" onClick={() => onCvClick('about_links')}>
                      {t.hero.cv}
                    </a>
                    <a
                      href={GITHUB_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackEvent('authority_asset_view', { asset: 'github', source: 'about_links', locale, path: asPath })}
                    >
                      {t.hero.github}
                    </a>
                    <a href="#contact" onClick={() => onContactSecondaryClick('about_links')}>
                      {t.hero.contact}
                    </a>
                  </div>
                </div>

                <div className="about-cards">
                  <article className="about-card">
                    <p className="about-card-title">{home.about.focusTitle}</p>
                    <ul className="hero-case-list">
                      {home.about.bullets.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </article>

                  {home.about.stats.map((stat) => (
                    <article key={stat.label} className="about-card">
                      <p className="about-card-title">{stat.label}</p>
                      <p className="about-card-value">{stat.value}</p>
                    </article>
                  ))}
                </div>
              </div>
            </SectionFrame>
          </div>

          <div>
            <SectionFrame id="services" className="section" aria-labelledby="services-title" tone="panel" density="spacious" sectionTheme="fusion">
              <SectionHead titleId="services-title" title={home.method.title} description={home.method.desc} />

              <div className="method-grid">
                {home.method.steps.map((step) => (
                  <article key={step.title} className="method-card">
                    <h3>{step.title}</h3>
                    <p>{step.desc}</p>
                  </article>
                ))}
              </div>

              <div className="services-grid">
                {serviceCards.map((item) => (
                  <FeatureCard
                    key={item.title}
                    className="service-card"
                    title={item.title}
                    description={item.desc}
                    icon={<Icon name={item.icon as BrandIconName} size={24} styleVariant="metallic" />}
                  />
                ))}
              </div>

              <div className="method-actions">
                <Button href={t.sectionCtas.services.primary.href} variant="secondary" onClick={() => onContactSecondaryClick(t.sectionCtas.services.primary.trackingSource)}>
                  {t.sectionCtas.services.primary.label}
                </Button>
              </div>
            </SectionFrame>
          </div>

          <div>
            <SectionFrame id="featured" className="section" aria-labelledby="featured-title" tone="panel" density="spacious" sectionTheme="fusion">
              <SectionHead
                titleId="featured-title"
                title={home.projects.title}
                description={home.projects.desc}
                actions={
                  <Button href={localizePath('/case-studies', locale)} variant="flat" onClick={() => onCasePrimaryClick('featured_section_index')}>
                    {locale === 'de' ? 'Alle Case Studies' : 'All case studies'}
                  </Button>
                }
              />
              <div className="project-grid">{featuredProjects.map((p) => renderProjectCard(p, locale, onProjectLinkClick))}</div>
            </SectionFrame>
          </div>

          <div>
            <SectionFrame id="insights" className="section" aria-labelledby="insights-title" tone="panel" density="spacious" sectionTheme="fusion">
              <SectionHead
                titleId="insights-title"
                title={home.insights.title}
                description={home.insights.desc}
                actions={
                  <Button href={t.sectionCtas.insights.primary.href} variant="flat" onClick={() => onCasePrimaryClick(t.sectionCtas.insights.primary.trackingSource)}>
                    {t.sectionCtas.insights.primary.label}
                  </Button>
                }
              />
              <div className="insights-grid">
                {featuredInsights.map((insight) => (
                  <InsightCard
                    key={insight.slug}
                    category={insight.category}
                    readMinutes={insight.readMinutes}
                    title={insight.title}
                    summary={insight.summary}
                    href={localizePath(`/insights/${insight.slug}`, locale)}
                    linkLabel={home.insights.linkLabel}
                    onLinkClick={() =>
                      trackEvent('authority_asset_view', {
                        asset: `insight_${insight.slug}`,
                        source: 'home_insights',
                        locale,
                        path: asPath
                      })
                    }
                  />
                ))}
              </div>

            </SectionFrame>
          </div>

          <div>
            <SectionFrame
              id="contact"
              className="section"
              aria-labelledby="contact-title"
              tone="metal"
              sectionTheme="fusion"
              emphasis="expressive"
              density="spacious"
              surfaceStyle="glass"
            >
              <SectionHead titleId="contact-title" title={home.contact.title} description={home.contact.desc} />
              <div className="contact-layout">
                <ContactForm
                  locale={locale}
                  text={t.contact_form}
                  trackingSource="contact_form_home"
                />

                <aside className="contact-card">
                  <p>{home.contact.card}</p>
                  <Button href={`mailto:${CONTACT_EMAIL}`} variant="signal" glowLevel="medium" onClick={() => onContactSecondaryClick('contact_mailto_primary')}>
                    {home.contact.emailCta}
                  </Button>
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
            </SectionFrame>
          </div>

          <div>
            <SectionFrame id="faq" className="section" aria-labelledby="faq-title" tone="panel" density="spacious" sectionTheme="fusion">
              <SectionHead titleId="faq-title" title={home.faq.title} description={home.faq.desc} />
              <Accordion
                className="faq-list"
                items={t.faq.items.map((item, index) => ({
                  id: `faq-${index}`,
                  title: item.q,
                  content: <p>{item.a}</p>
                }))}
              />
            </SectionFrame>
          </div>
        </main>

        <SiteFooter
          theme="dark"
          leftText={t.footer.left}
          navLabel={locale === 'de' ? 'Footer Navigation' : 'Footer navigation'}
          navLinks={[
            { label: 'Proof', href: '#proof-bar' },
            { label: t.nav.heroCase, href: '#hero-case' },
            { label: 'Services', href: '#services' },
            { label: t.nav.featured, href: '#featured' },
            { label: t.nav.contact, href: '#contact' }
          ]}
          contactLinks={[
            { label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
            { label: 'GitHub', href: GITHUB_URL, external: true }
          ]}
          rightText={t.footer.right}
          cta={
            <Button
              href={t.sectionCtas.footer.primary.href}
              className="cta"
              variant="signal"
              glowLevel="soft"
              onClick={() => onContactSecondaryClick(t.sectionCtas.footer.primary.trackingSource)}
            >
              {t.sectionCtas.footer.primary.label}
            </Button>
          }
        />

        <a className="global-contact-cta" href={t.sectionCtas.sticky.primary.href} onClick={() => onContactSecondaryClick(t.sectionCtas.sticky.primary.trackingSource)}>
          {t.sectionCtas.sticky.primary.label}
        </a>

        {activeProject ? <ProjectModal project={activeProject} locale={locale} onClose={closeModal} /> : null}
      </div>
    </>
  );
}
