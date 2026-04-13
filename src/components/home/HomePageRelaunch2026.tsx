'use client';

import { domAnimation, LazyMotion, m, useReducedMotion as useFramerReducedMotion } from 'framer-motion';
import { ArrowRight, Code2, Handshake, Layers, MapPin, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { MouseEvent, ReactNode } from 'react';
import { startTransition, useEffect, useMemo, useState } from 'react';

import { HomeBackgroundFXClient } from '@/app-pages/HomeBackgroundFXClient';
import { ContactLeadForm } from '@/components/home/ContactLeadForm';
import { HomeLeadMagnet } from '@/components/home/HomeLeadMagnet';
import { HomeRelaunchFooter } from '@/components/home/HomeRelaunchFooter';
import { HomeRelaunchHeroSnapshot } from '@/components/home/HomeRelaunchHeroSnapshot';
import { HomeSectionVisualCard } from '@/components/home/HomeSectionVisualCard';
import { HomeMobileCtaDock } from '@/components/home/HomeMobileCtaDock';
import { HomeScrollProgress } from '@/components/home/HomeScrollProgress';
import { HomeClientLogosMarquee } from '@/components/home/HomeClientLogosMarquee';
import { HomeTechStackBar } from '@/components/home/HomeTechStackBar';
import { AnimatedCounter } from '@/components/home/AnimatedCounter';
import { ProjectModal } from '@/components/ProjectModal';
import { RelaunchStickyHeader } from '@/components/layout/RelaunchStickyHeader';
import { Button } from '@/components/shadcn/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card';
import { copy, type Locale } from '@/content/copy';
import { getHomeVisualAsset } from '@/content/homeVisuals';
import { getHomeRelaunchCopy } from '@/content/homeRelaunchCopy';
import { getHomeJourneyCopy, getHomeProcessCopy, getHomeTestimonials } from '@/content/homeRelaunchSections';
import { getProjectById, getProjectsByTier, getProjectStatusLabel, type Project, type ProjectId } from '@/content/projects';
import { getPublishedTrustEvidence } from '@/content/trustEvidence';
import { trackEvent } from '@/lib/analytics';
import { resolveHeroVariant, type HeroVariantId } from '@/lib/heroExperiment';
import { localizePath } from '@/lib/localeRouting';
import { getContactPath, getHiringPath, getPrimaryNavLinks, getResumePath, getServicesPath } from '@/lib/navigation';
import { getSchedulerHref } from '@/lib/scheduler';

type FeaturedInsightTeaser = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  readMinutes: number;
};

type HomePageRelaunch2026Props = {
  locale: Locale;
  featuredInsights: FeaturedInsightTeaser[];
};

type AudienceCard = { title: string; description: string; href: string; source: string };

type RelaunchMotionSectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
};

function RelaunchMotionSection({ children, className, id, 'aria-labelledby': ariaLabelledBy, 'aria-describedby': ariaDescribedBy }: RelaunchMotionSectionProps) {
  const reduce = useFramerReducedMotion();
  return (
    <m.section
      id={id}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      className={className}
      initial={reduce ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12, margin: '-8% 0px -12% 0px' }}
      transition={{ duration: reduce ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.section>
  );
}

export function HomePageRelaunch2026({ locale, featuredInsights }: HomePageRelaunch2026Props) {
  const t = getHomeRelaunchCopy(locale);
  const faq = copy[locale].faq;
  const journeyCopy = getHomeJourneyCopy(locale);
  const processCopy = getHomeProcessCopy(locale);
  const testimonialList = getHomeTestimonials(locale);
  const navLinks = getPrimaryNavLinks(locale);
  const contactHref = getContactPath(locale, 'home-hero-primary');
  const hiringHref = getHiringPath(locale);
  const resumeHref = getResumePath(locale);
  const leistungenHref = getServicesPath(locale);
  const caseStudiesHref = localizePath('/case-studies', locale);
  const insightsHref = localizePath('/insights', locale);
  const projectsHref = localizePath('/projects', locale);
  const homeHref = locale === 'de' ? '/' : '/en';

  const router = useRouter();
  const pathname = usePathname() || (locale === 'en' ? '/en' : '/');
  const searchParams = useSearchParams();
  const search = searchParams?.toString() ?? '';
  const asPath = `${pathname}${search ? `?${search}` : ''}`;
  const projectParam = searchParams?.get('project') ?? null;
  const activeProject = getProjectById(projectParam);

  const featuredProjects = [getProjectsByTier('hero')[0], ...getProjectsByTier('featured').slice(0, 2)].filter(
    (p): p is Project => p != null
  );
  const heroProject = getProjectsByTier('hero')[0] ?? null;
  const heroVisual = getHomeVisualAsset('hero');
  const servicesVisual = getHomeVisualAsset('services');
  const proofVisual = getHomeVisualAsset('proof');
  const projectsVisual = getHomeVisualAsset('projects');
  const insightsVisual = getHomeVisualAsset('insights');
  const deliveryVisual = getHomeVisualAsset('delivery');
  const contactVisual = getHomeVisualAsset('contact');
  const trustEvidence = getPublishedTrustEvidence(locale).slice(0, 3);
  const [heroVariant, setHeroVariant] = useState<HeroVariantId>('default');
  const heroAmbientMotion = useFramerReducedMotion();

  /** Nur `exp_hero` (nicht z.B. `project=`) - verhindert doppelte `hero_variant_view` bei reinen Modal-Query-Aenderungen. */
  const expHeroParam = useMemo(() => {
    const raw = new URLSearchParams(search).get('exp_hero')?.trim();
    return raw && raw.length > 0 ? raw : null;
  }, [search]);

  useEffect(() => {
    const resolution = resolveHeroVariant({
      queryValue: expHeroParam,
      enabledRaw: process.env.NEXT_PUBLIC_HERO_EXPERIMENT_ENABLED,
      weightsRaw: process.env.NEXT_PUBLIC_HERO_EXPERIMENT_WEIGHTS
    });
    const path = `${pathname}${search ? `?${search}` : ''}`;
    trackEvent('hero_variant_view', {
      locale,
      variant: resolution.variant,
      source: resolution.source,
      path
    });
    startTransition(() => {
      setHeroVariant(resolution.variant);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `search` absichtlich ausgelassen: sonst doppeltes Exposure bei ?project= ohne exp_hero-Wechsel (path nutzt aktuelles search aus Closure)
  }, [locale, pathname, expHeroParam]);

  const schedulerHref = useMemo(
    () => getSchedulerHref({ locale, source: 'home-header', placement: 'contact-form', heroVariant }),
    [locale, heroVariant]
  );

  const projectHref = (project: Project) => {
    if (project.id === 'configurator_3d') return localizePath('/case-studies/configurator-live', locale);
    if (project.id === 'voicebot' || project.id === 'sorare') return localizePath('/projects', locale);
    return localizePath('/projects', locale);
  };

  const serviceItems = [
    {
      slug: 'web-engineering-delivery',
      Icon: Code2,
      accent: 'rgba(56,189,248,0.65)',
      iconBg: 'rgba(56,189,248,0.08)',
      href: locale === 'de' ? '/leistungen/web-engineering-delivery' : '/en/services/web-engineering-delivery',
      title: locale === 'de' ? 'Web Engineering Delivery' : 'Web Engineering Delivery',
      desc:
        locale === 'de'
          ? 'Architektur, Komponenten-Systeme und QA-Gates für B2B-Websites, die unter Last stabil bleiben — reproduzierbar, übergabefähig.'
          : 'Architecture, component systems, and QA gates for B2B websites that stay stable under load — repeatable and handover-ready.',
      outcomes:
        locale === 'de'
          ? ['Token-basiertes Komponentenmodell', 'QA-Gates vor jedem Release', 'Dokumentierte Team-Übergabe']
          : ['Token-driven component system', 'QA gates before every release', 'Documented team handover']
    },
    {
      slug: 'ai-automation-workflows',
      Icon: Zap,
      accent: 'rgba(139,92,246,0.65)',
      iconBg: 'rgba(139,92,246,0.08)',
      href: locale === 'de' ? '/leistungen/ai-automation-workflows' : '/en/services/ai-automation-workflows',
      title: locale === 'de' ? 'AI & Automation Workflows' : 'AI & Automation Workflows',
      desc:
        locale === 'de'
          ? 'Reproduzierbare Prozesse mit AI-Assist — PR-Reviews, QA-Loops und Orchestration für schnellere Iteration ohne Qualitätsverlust.'
          : 'Repeatable AI-assisted processes — PR reviews, QA loops and orchestration for faster iteration without regressions.',
      outcomes:
        locale === 'de'
          ? ['AI-gestützte Review-Loops', 'Einwilligungs-Orchestration (DE/EU)', 'Reproduzierbare QA-Automationen']
          : ['AI-assisted review loops', 'Consent orchestration (DE/EU)', 'Repeatable QA automations']
    },
    {
      slug: '3d-visualization-systems',
      Icon: Layers,
      accent: 'rgba(52,211,153,0.65)',
      iconBg: 'rgba(52,211,153,0.08)',
      href: locale === 'de' ? '/leistungen/3d-visualization-systems' : '/en/services/3d-visualization-systems',
      title: locale === 'de' ? '3D-Visualisierungs-Systeme' : '3D Visualization Systems',
      desc:
        locale === 'de'
          ? 'Browser-native WebGL-Konfiguratoren und 3D-Systeme im Kundenbetrieb — Upload-zu-Preis-Flow bis zum WooCommerce-Checkout.'
          : 'Browser-native WebGL configurators and 3D systems in production — upload-to-price flow through WooCommerce checkout.',
      outcomes:
        locale === 'de'
          ? ['WebGL im Produktivbetrieb', 'Upload → Preview → Checkout', 'Three.js + Custom Shader']
          : ['WebGL in production', 'Upload → Preview → Checkout', 'Three.js + custom shader']
    }
  ] as const;

  const audienceCards: AudienceCard[] = [
    {
      title: locale === 'de' ? 'Ich suche Hiring-Fit' : 'I am hiring',
      description:
        locale === 'de'
          ? 'Rolle, Verfügbarkeit, Ownership und Team-Fit in einer klaren Übersicht.'
          : 'Role fit, availability, ownership, and team compatibility in one clear path.',
      href: hiringHref,
      source: 'home-audience-hiring'
    },
    {
      title: locale === 'de' ? 'Ich suche Kollaboration' : 'I want collaboration',
      description:
        locale === 'de'
          ? 'Für gemeinsame Produkt- oder Maker-Initiativen mit technischem Fokus.'
          : 'For shared product or maker initiatives with a strong technical focus.',
      href: contactHref,
      source: 'home-audience-collab'
    },
    {
      title: locale === 'de' ? 'Ich suche Umsetzung' : 'I need implementation',
      description:
        locale === 'de'
          ? 'Case Studies und Delivery-Belege aus realen Produktionskontexten.'
          : 'Case studies and delivery proof from real production contexts.',
      href: caseStudiesHref,
      source: 'home-audience-client'
    }
  ];

  const openProject = (id: ProjectId, source: string) => {
    trackEvent('trust_project_click', { projectId: id, source, locale, path: asPath, variant: heroVariant });
    trackEvent('case_study_open', { projectId: id, source, locale, path: asPath });
    const nextParams = new URLSearchParams(search);
    nextParams.set('project', id);
    const q = nextParams.toString();
    router.push(`${pathname}${q ? `?${q}` : ''}#home-projects`, { scroll: false });
  };

  const closeModal = () => {
    const nextParams = new URLSearchParams(search);
    nextParams.delete('project');
    const q = nextParams.toString();
    router.replace(`${pathname}${q ? `?${q}` : ''}#home-projects`, { scroll: false });
  };

  const onProjectLinkClick = (e: MouseEvent<HTMLAnchorElement>, project: Project, source: string) => {
    if (e.defaultPrevented) return;
    if (e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    openProject(project.id, source);
  };

  const trackHeroPrimary = (source: string, intent: 'hiring' | 'client' | 'collab') => {
    const path = typeof window === 'undefined' ? '/' : `${window.location.pathname}${window.location.search}`;
    trackEvent('hero_cta_click', { source, locale, intent, path, variant: heroVariant });
    trackEvent('cta_primary_click', { source, locale, intent, path, variant: heroVariant });
  };

  const trackHeroSecondary = (source: string, intent: 'hiring' | 'client' | 'collab') => {
    const path = typeof window === 'undefined' ? '/' : `${window.location.pathname}${window.location.search}`;
    trackEvent('section_cta_click', { source, locale, intent, path, variant: heroVariant });
  };

  const trackHeroCaseSecondary = (source: string, intent: 'hiring' | 'client' | 'collab') => {
    const path = typeof window === 'undefined' ? '/' : `${window.location.pathname}${window.location.search}`;
    trackEvent('cta_case_primary_click', { source, locale, intent, path, variant: heroVariant });
  };

  const trackHeroPlaybookTertiary = (source: string, intent: 'hiring' | 'client' | 'collab') => {
    const path = typeof window === 'undefined' ? '/' : `${window.location.pathname}${window.location.search}`;
    trackEvent('cta_playbook_tertiary_click', { source, locale, intent, path, variant: heroVariant });
  };

  const trackVisualCta = (source: string, intent: 'hiring' | 'client' | 'collab' = 'client') => {
    const path = typeof window === 'undefined' ? '/' : `${window.location.pathname}${window.location.search}`;
    trackEvent('section_cta_click', { source, locale, intent, path, variant: heroVariant });
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="home-relaunch-shell relative min-h-screen">
        <div className="home-relaunch-bg" aria-hidden="true">
          <div className="home-relaunch-fx-slot">
            <HomeBackgroundFXClient />
          </div>
          <div className="home-relaunch-noise" />
          <div className="home-relaunch-blob home-relaunch-blob-a" />
          <div className="home-relaunch-blob home-relaunch-blob-b" />
        </div>
        <HomeScrollProgress locale={locale} />

        <div className="relative z-10 min-h-screen text-slate-100">
          <RelaunchStickyHeader
            locale={locale}
            navLinks={navLinks}
            homeHref={homeHref}
            desktopCtaHref={schedulerHref}
            desktopCtaLabel={t.headerBookingLabel}
            desktopSecondaryHref="#contact"
            desktopSecondaryLabel={t.headerContactShortLabel}
            mobileNavCtaLabel={t.headerBookingLabel}
            mobileNavCtaHref={schedulerHref}
            mobileNavSecondaryHref="#contact"
            mobileNavSecondaryLabel={t.headerContactShortLabel}
            mobileNavCtaIntent="client"
            heroVariant={heroVariant}
            desktopContactTrackingSource="home-header-booking"
            desktopSecondaryTrackingSource="home-header-contact-form"
            mobileNavPrimaryTrackingSource="home_mobile_nav_booking"
            mobileNavSecondaryTrackingSource="home_mobile_nav_contact"
          />

          <main
            id="main-content"
            className="home-shell-container mx-auto w-full px-4 pb-24 pt-10 sm:px-6 md:pb-12 md:pt-14"
          >
            <section
              id="home-hero"
              className="home-hero-card relative"
              aria-labelledby="home-hero-heading"
            >
              <div className="home-hero-dot-grid" aria-hidden="true" />

              {/* Stagger container for hero columns */}
              <div className="grid gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:items-start lg:gap-12">
                {/* Left column: staggered entrance */}
                <m.div
                  initial={heroAmbientMotion ? false : 'hidden'}
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.09, delayChildren: 0.04 } }
                  }}
                >
                  {/* Badge row */}
                  <m.div
                    className="flex flex-wrap items-center gap-2"
                    variants={{
                      hidden: { opacity: 0, y: 12 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] } }
                    }}
                  >
                    <span className="inline-flex rounded-full border border-sky-500/35 bg-sky-500/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-sky-300">
                      {t.badge}
                    </span>
                    <span className="home-avail-pill">
                      <span className="home-avail-pill-dot" aria-hidden="true">
                        <span />
                        <span />
                      </span>
                      {t.availabilityPill}
                    </span>
                  </m.div>

                  {/* H1 */}
                  <m.h1
                    id="home-hero-heading"
                    className="mt-5 max-w-[22ch] text-balance font-display text-[2.6rem] font-bold leading-[0.93] tracking-tight text-white md:text-[3.5rem] lg:text-[4.25rem] xl:text-[5rem]"
                    style={{ textShadow: '0 0 80px rgba(56,189,248,0.12)' }}
                    variants={{
                      hidden: { opacity: 0, y: 16 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
                    }}
                  >
                    {t.title}
                  </m.h1>

                  {/* Description */}
                  <m.p
                    className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl"
                    variants={{
                      hidden: { opacity: 0, y: 12 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] } }
                    }}
                  >
                    {t.description}
                  </m.p>

                  {/* Pills */}
                  <m.div
                    className="mt-5 flex flex-wrap gap-2"
                    aria-label={locale === 'de' ? 'Schwerpunkte' : 'Focus areas'}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.44, ease: [0.22, 1, 0.36, 1] } }
                    }}
                  >
                    {t.heroPills.map((pill) => (
                      <span
                        key={pill}
                        className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/20 bg-sky-500/6 px-3 py-1 text-xs font-medium text-sky-200/90"
                      >
                        <span className="h-1 w-1 rounded-full bg-sky-400/60" aria-hidden="true" />
                        {pill}
                      </span>
                    ))}
                  </m.div>

                  <m.div
                    className="mt-6"
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.44, ease: [0.22, 1, 0.36, 1] } }
                    }}
                  >
                    <HomeSectionVisualCard
                      asset={heroVisual}
                      locale={locale}
                      title={locale === 'de' ? 'System Surface' : 'System surface'}
                      className="home-hero-inline-visual"
                      linkHref={caseStudiesHref}
                      linkLabel={locale === 'de' ? 'Live-Cases öffnen' : 'Open live cases'}
                      onLinkClick={() => trackVisualCta('home-hero-visual', 'client')}
                      priority
                    />
                  </m.div>

                  {/* Location */}
                  <m.p
                    className="mt-5 inline-flex items-center gap-2 text-sm text-emerald-300"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } }
                    }}
                  >
                    <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {t.trustInline}
                  </m.p>

                  {/* CTAs */}
                  <m.div
                    className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
                    }}
                  >
                    <Button
                      asChild
                      size="lg"
                      className="min-h-12 border-0 bg-gradient-to-r from-sky-500 to-blue-500 px-6 text-white shadow-[0_0_28px_rgba(14,165,233,0.32)] transition-all duration-300 hover:from-sky-400 hover:to-blue-400 hover:shadow-[0_0_36px_rgba(14,165,233,0.42)]"
                    >
                      <a
                        href={schedulerHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackHeroPrimary('home-hero-booking', 'client')}
                      >
                        {t.primaryCta}
                        <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                      </a>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="min-h-12 border-slate-600 bg-transparent px-6 text-slate-100 hover:bg-slate-800/60 hover:border-slate-500"
                    >
                      <a href="#contact" onClick={() => trackHeroPrimary('home-hero-contact-form', 'client')}>
                        {t.secondaryCta}
                      </a>
                    </Button>
                  </m.div>

                  {/* Inline links */}
                  <m.p
                    className="mt-3.5 text-sm text-slate-500"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } }
                    }}
                  >
                    <a
                      href={resumeHref}
                      onClick={() => trackHeroSecondary('home-hero-resume', 'hiring')}
                      className="inline-flex min-h-12 items-center font-medium text-slate-400 underline-offset-4 transition hover:text-sky-300 hover:underline"
                    >
                      {locale === 'de' ? 'CV & Verfügbarkeit ansehen' : 'View resume & availability'}
                    </a>
                    {' · '}
                    <a
                      href={hiringHref}
                      onClick={() => trackHeroCaseSecondary('home-hero-hiring', 'hiring')}
                      className="inline-flex min-h-12 items-center font-medium text-slate-400 underline-offset-4 transition hover:text-sky-300 hover:underline"
                    >
                      {locale === 'de' ? 'Interview / Hiring' : 'Interview / Hiring'}
                    </a>
                    {' · '}
                    <a
                      href={projectsHref}
                      onClick={() => trackHeroPlaybookTertiary('home-hero-projects', 'client')}
                      className="inline-flex min-h-12 items-center font-medium text-slate-400 underline-offset-4 transition hover:text-sky-300 hover:underline"
                    >
                      {t.tertiaryCta}
                    </a>
                  </m.p>
                </m.div>

                {/* Right panel: slides in from the side */}
                <m.aside
                  className="home-hero-aside"
                  aria-label={t.heroSnapshotLabel}
                  initial={heroAmbientMotion ? false : { opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.65, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
                >
                  {!heroAmbientMotion ? (
                    <video
                      className="pointer-events-none absolute inset-0 z-0 h-full w-full scale-110 object-cover opacity-[0.15] mix-blend-screen"
                      aria-hidden="true"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    >
                      <source src="/assets/motion/energy-trail-loop.webm" type="video/webm" />
                    </video>
                  ) : null}
                  <div className="relative z-[1]">
                    <div className="home-hero-aside-header">
                      <p className="home-hero-aside-title">{t.heroSnapshotLabel}</p>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/8 px-2.5 py-0.5 text-[0.62rem] font-bold uppercase tracking-widest text-emerald-300">
                        <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40 motion-safe:animate-ping" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        </span>
                        {t.heroSnapshotStatus}
                      </span>
                    </div>
                    <HomeRelaunchHeroSnapshot
                      locale={locale}
                      heroMedia={heroProject?.media}
                      thumbSrc={heroProject?.thumbSrc}
                      posterAlt={
                        heroProject
                          ? `${heroProject.title[locale]} — ${locale === 'de' ? 'Live-Case-Vorschau' : 'Live case preview'}`
                          : undefined
                      }
                    />
                    {heroProject?.media?.caption?.[locale] ? (
                      <p className="mt-2 text-[0.68rem] leading-snug text-slate-600">{heroProject.media.caption[locale]}</p>
                    ) : null}
                    <ul className="home-hero-metrics" aria-label={locale === 'de' ? 'Metriken' : 'Metrics'}>
                      {t.heroMetrics.map((stat) => (
                        <li key={stat.label} className="home-hero-metric">
                          <p className="home-hero-metric-value">
                            <AnimatedCounter value={stat.value} duration={1200} />
                          </p>
                          <p className="home-hero-metric-label">{stat.label}</p>
                        </li>
                      ))}
                    </ul>
                    <div className="home-hero-metric-foot">
                      <p>{t.heroSnapshotFoot[0]}</p>
                      <p>{t.heroSnapshotFoot[1]}</p>
                    </div>
                  </div>
                </m.aside>
              </div>

              <div className="mt-10 grid gap-3 border-t border-slate-800/60 pt-10 md:grid-cols-3">
                {audienceCards.map((card) => (
                  <Link
                    key={card.title}
                    href={card.href}
                    className="group flex flex-col gap-2 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 text-slate-100 transition-all duration-250 hover:-translate-y-0.5 hover:border-sky-500/25 hover:bg-slate-900/65"
                    onClick={() =>
                      trackHeroSecondary(
                        card.source,
                        card.source.includes('hiring') ? 'hiring' : card.source.includes('collab') ? 'collab' : 'client'
                      )
                    }
                  >
                    <p className="text-sm font-semibold leading-snug text-slate-100">{card.title}</p>
                    <p className="text-xs leading-relaxed text-slate-400">{card.description}</p>
                    <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold text-sky-300 transition-colors group-hover:text-sky-200">
                      {locale === 'de' ? 'Pfad öffnen' : 'Open path'}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            <HomeTechStackBar locale={locale} />

            <RelaunchMotionSection id="home-offer" className="mt-20 scroll-mt-28 md:mt-24" aria-labelledby="home-offer-heading">
              <h2 id="home-offer-heading" className="home-section-h2-primary">
                {t.sectionGroupOffer}
              </h2>
              <p className="mt-3 max-w-2xl text-base text-slate-400">
                {locale === 'de'
                  ? 'Leistungen und Nachweis gehören zusammen: was ich anbiete — und wie du es prüfen kannst.'
                  : 'Services and proof belong together: what I offer — and how you can verify it.'}
              </p>
              <div className="home-section-visual-grid home-section-visual-grid--offer">
                <HomeSectionVisualCard
                  asset={servicesVisual}
                  locale={locale}
                  title={locale === 'de' ? 'Delivery Architektur' : 'Delivery architecture'}
                  linkHref={leistungenHref}
                  linkLabel={locale === 'de' ? 'Leistungen ansehen' : 'View services'}
                  onLinkClick={() => trackVisualCta('home-offer-visual-services', 'client')}
                />
                <HomeSectionVisualCard
                  asset={proofVisual}
                  locale={locale}
                  title={locale === 'de' ? 'Verifizierte Signalspur' : 'Verified signal trail'}
                  linkHref={caseStudiesHref}
                  linkLabel={locale === 'de' ? 'Proof ansehen' : 'View proof'}
                  onLinkClick={() => trackVisualCta('home-offer-visual-proof', 'client')}
                />
              </div>

              <div id="home-services" className="mt-14 scroll-mt-28" aria-labelledby="home-services-heading">
              <p className="home-eyebrow">{locale === 'de' ? 'Leistungen' : 'Services'}</p>
              <div className="flex items-end justify-between gap-4">
                <h3 id="home-services-heading" className="home-section-h3">
                  {locale === 'de' ? 'Was ich baue' : 'What I build'}
                </h3>
                <Link href={leistungenHref} className="min-h-12 shrink-0 inline-flex items-center text-sm font-semibold text-sky-300 hover:text-sky-200">
                  {locale === 'de' ? 'Alle Leistungen' : 'All services'}
                </Link>
              </div>
              <p className="mt-2 max-w-2xl text-base text-slate-400">
                {locale === 'de'
                  ? 'Drei Schwerpunkte mit verifiziertem Output — klare Spezialisierung statt Fullservice-Versprechen.'
                  : 'Three focus areas with verifiable output — clear specialization, not a full-service promise.'}
              </p>
              <m.ul
                className="home-services-grid"
                role="list"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } }
                }}
              >
                {serviceItems.map((svc) => (
                  <m.li
                    key={svc.slug}
                    role="listitem"
                    className="contents"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] } }
                    }}
                  >
                    <article className="home-service-card">
                      <div
                        className="home-service-card-accent"
                        aria-hidden="true"
                        style={{ background: svc.accent }}
                      />
                      <div
                        className="home-service-icon"
                        style={{ background: svc.iconBg, color: svc.accent, borderColor: `${svc.accent.replace('0.65)', '0.22)')}` }}
                        aria-hidden="true"
                      >
                        <svc.Icon className="h-4 w-4" />
                      </div>
                      <h3 className="home-service-card-title">{svc.title}</h3>
                      <p className="home-service-card-desc">{svc.desc}</p>
                      <ul className="home-service-card-outcomes" aria-label={locale === 'de' ? 'Ergebnisse' : 'Outcomes'}>
                        {svc.outcomes.map((o) => (
                          <li key={o}>{o}</li>
                        ))}
                      </ul>
                      <Link href={svc.href} className="home-service-card-link">
                        {locale === 'de' ? 'Service-Details' : 'Service details'}
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    </article>
                  </m.li>
                ))}
              </m.ul>
              </div>

              <div id="home-proof" className="mt-16 scroll-mt-28 md:mt-20" aria-labelledby="home-proof-heading">
              <p className="home-eyebrow">{t.sectionProofEyebrow}</p>
              <h3 id="home-proof-heading" className="home-section-h3">
                {t.proofTitle}
              </h3>
              <p className="mt-2 max-w-2xl text-base text-slate-400">{t.proofDescription}</p>
              <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                <Card className="border-slate-800/80 bg-slate-900/50 text-slate-100 transition-all duration-300 hover:border-sky-500/20 hover:bg-slate-900/70">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base font-semibold text-slate-100">
                      {locale === 'de' ? 'Arbeitsprinzipien' : 'Operating principles'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {t.proofPoints.map((point) => (
                      <p key={point} className="flex items-start gap-3 text-sm leading-relaxed text-slate-300">
                        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" aria-hidden="true" />
                        <span>{point}</span>
                      </p>
                    ))}
                  </CardContent>
                </Card>
                <Card className="border-slate-800/80 bg-slate-900/50 text-slate-100 transition-all duration-300 hover:border-sky-500/20 hover:bg-slate-900/70">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base font-semibold text-slate-100">
                      {locale === 'de' ? 'Öffentliche Belege' : 'Public proofs'}
                    </CardTitle>
                    <CardDescription className="text-sm text-slate-400">
                      {locale === 'de'
                        ? 'Nur verifizierte Artefakte in der zentralen Vertrauensebene.'
                        : 'Only verified artifacts in the primary trust layer.'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2.5">
                    {trustEvidence.map((item) => (
                      <a
                        key={item.id}
                        href={item.external ? item.href : localizePath(item.href, locale)}
                        target={item.external ? '_blank' : undefined}
                        rel={item.external ? 'noopener noreferrer' : undefined}
                        className="group block rounded-lg border border-slate-700/80 bg-slate-950/50 px-3 py-2.5 text-sm text-slate-200 transition-all duration-200 hover:border-sky-400/50 hover:bg-slate-900/80"
                      >
                        <p className="font-medium leading-snug group-hover:text-white">{item.title}</p>
                        <p className="mt-0.5 text-xs text-slate-400">{item.description}</p>
                      </a>
                    ))}
                  </CardContent>
                </Card>
              </div>
              </div>

              <div className="mt-12 rounded-2xl border border-slate-700/80 bg-slate-950/40 p-5 md:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-300/95">{t.trustComplianceTitle}</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                  {t.trustComplianceLines.map((line) => (
                    <li key={line} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/80" aria-hidden="true" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </RelaunchMotionSection>

            <HomeClientLogosMarquee locale={locale} />

            <RelaunchMotionSection id="home-work" className="mt-20 scroll-mt-28 md:mt-24" aria-labelledby="home-work-heading">
              <h2 id="home-work-heading" className="home-section-h2-primary">
                {t.sectionGroupWork}
              </h2>
              <p className="mt-3 max-w-2xl text-base text-slate-400">
                {locale === 'de'
                  ? 'Live-Cases und Insights — belastbarer Kontext statt Marketing-Claims.'
                  : 'Live cases and insights — durable context instead of marketing claims.'}
              </p>
              <div className="home-section-visual-grid home-section-visual-grid--work">
                <HomeSectionVisualCard
                  asset={projectsVisual}
                  locale={locale}
                  title={locale === 'de' ? 'Projekt-Ebenen' : 'Project layers'}
                  linkHref={projectsHref}
                  linkLabel={locale === 'de' ? 'Projekte öffnen' : 'Open projects'}
                  onLinkClick={() => trackVisualCta('home-work-visual-projects', 'client')}
                />
                <HomeSectionVisualCard
                  asset={insightsVisual}
                  locale={locale}
                  title={locale === 'de' ? 'Insight Datenfluss' : 'Insight data flow'}
                  linkHref={insightsHref}
                  linkLabel={locale === 'de' ? 'Insights öffnen' : 'Open insights'}
                  onLinkClick={() => trackVisualCta('home-work-visual-insights', 'client')}
                />
              </div>

              <div id="home-projects" className="mt-14 scroll-mt-28" aria-labelledby="home-projects-heading">
              <p className="home-eyebrow">{t.sectionProjectsEyebrow}</p>
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <h3 id="home-projects-heading" className="home-section-h3">
                    {t.featuredProjectsTitle}
                  </h3>
                  <p className="mt-2 text-base text-slate-400">{t.featuredProjectsDescription}</p>
                </div>
                <Link href={projectsHref} className="min-h-12 shrink-0 inline-flex items-center text-sm font-semibold text-sky-300 hover:text-sky-200">
                  {locale === 'de' ? 'Alle Projekte' : 'All projects'}
                </Link>
              </div>
              <m.div
                className="home-projects-bento"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
              >
                {featuredProjects.map((project, idx) => (
                  <m.div
                    key={project.id}
                    variants={{
                      hidden: { opacity: 0, y: 18 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.44, ease: [0.22, 1, 0.36, 1] } }
                    }}
                    className={idx === 0 ? 'home-project-featured' : ''}
                  >
                    <Card className="group h-full border-slate-800/80 bg-slate-900/50 text-slate-100 transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-500/30 hover:bg-slate-900/70 hover:shadow-[0_16px_40px_rgba(3,8,18,0.45)]">
                      <CardHeader className={idx === 0 ? 'pb-4' : 'pb-3'}>
                        <CardTitle className={`font-semibold leading-snug ${idx === 0 ? 'text-lg' : 'text-base'}`}>
                          {project.title[locale]}
                        </CardTitle>
                        <CardDescription className="text-slate-400 leading-relaxed">
                          {project.one_liner[locale]}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-3 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-emerald-400">
                          {getProjectStatusLabel(project.status, locale)}
                        </p>
                        {idx === 0 && (
                          <p className="mb-3 text-xs text-slate-400">
                            {locale === 'de' ? '→ Highlight-Projekt' : '→ Featured project'}
                          </p>
                        )}
                        {project.headline_metric ? (
                          <p className="mb-3 rounded-lg border border-fuchsia-500/20 bg-fuchsia-500/5 px-3 py-2 text-xs font-medium leading-snug text-fuchsia-100/95">
                            {project.headline_metric[locale]}
                          </p>
                        ) : null}
                        <a
                          href={projectHref(project)}
                          className="mb-4 inline-flex min-h-12 items-center gap-2 text-sm font-semibold text-sky-300 transition hover:text-sky-200"
                          onClick={(e) => onProjectLinkClick(e, project, 'home_relaunch_project_card')}
                          aria-haspopup="dialog"
                        >
                          {locale === 'de' ? 'Details' : 'Details'}
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                        </a>
                        <a
                          href={schedulerHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-sky-500/35 bg-sky-500/10 px-3 py-2.5 text-center text-xs font-semibold text-sky-100 transition hover:border-sky-400/50 hover:bg-sky-500/15"
                          onClick={() => trackEvent('case_card_booking_click', { projectId: project.id, locale, path: asPath, variant: heroVariant })}
                        >
                          {t.caseFollowUpCta}
                        </a>
                      </CardContent>
                    </Card>
                  </m.div>
                ))}
              </m.div>

              {/* Mid-page availability CTA */}
              <div className="home-midpage-cta">
                <span className="home-midpage-cta-dot" aria-hidden="true">
                  <span />
                  <span />
                </span>
                <p className="home-midpage-cta-text">{t.midPageCtaText}</p>
                <a
                  href="#contact"
                  className="home-midpage-cta-link min-h-12 inline-flex items-center"
                  onClick={() => trackHeroPrimary('home-midpage-cta', 'client')}
                >
                  {t.midPageCtaLink}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
              </div>

              <div id="home-insights" className="mt-16 scroll-mt-28 md:mt-20" aria-labelledby="home-insights-heading">
              <p className="home-eyebrow">{t.sectionInsightsEyebrow}</p>
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <h3 id="home-insights-heading" className="home-section-h3">
                    {t.insightsTitle}
                  </h3>
                  <p className="mt-2 text-base text-slate-400">{t.insightsDescription}</p>
                </div>
                <Link
                  href={insightsHref}
                  className="min-h-12 inline-flex items-center text-sm font-semibold text-sky-300 hover:text-sky-200"
                  onClick={() =>
                    trackEvent('insights_hub_click', {
                      source: 'home_insights_header',
                      locale,
                      variant: heroVariant,
                      path: asPath
                    })
                  }
                >
                  {t.insightsCta}
                </Link>
              </div>
              <m.div
                className="grid gap-4 md:grid-cols-3"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
              >
                {featuredInsights.map((insight) => (
                  <m.div
                    key={insight.slug}
                    variants={{
                      hidden: { opacity: 0, y: 16 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
                    }}
                  >
                  <Card
                    className="group h-full border-slate-800/80 bg-slate-900/50 text-slate-100 transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-500/25 hover:bg-slate-900/70 hover:shadow-[0_16px_40px_rgba(3,8,18,0.4)]"
                  >
                    <CardHeader className="pb-3">
                      <CardDescription className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-slate-400">
                        {insight.category} · {insight.readMinutes} {locale === 'de' ? 'Min' : 'min'}
                      </CardDescription>
                      <CardTitle className="text-base font-semibold leading-snug">{insight.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed text-slate-400">{insight.summary}</p>
                      <Link
                        href={localizePath(`/insights/${insight.slug}`, locale)}
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-sky-300 transition hover:text-sky-200"
                        onClick={() =>
                          trackEvent('insight_card_click', {
                            source: 'home_featured_insight',
                            locale,
                            slug: insight.slug,
                            variant: heroVariant,
                            path: asPath
                          })
                        }
                      >
                        {locale === 'de' ? 'Insight lesen' : 'Read insight'}
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                      </Link>
                    </CardContent>
                  </Card>
                  </m.div>
                ))}
              </m.div>
              </div>
            </RelaunchMotionSection>

            <RelaunchMotionSection id="home-delivery" className="mt-20 scroll-mt-28 md:mt-24" aria-labelledby="home-delivery-heading">
              <h2 id="home-delivery-heading" className="home-section-h2-primary">
                {t.sectionGroupDelivery}
              </h2>
              <p className="mt-3 max-w-3xl text-base text-slate-400">
                {locale === 'de'
                  ? 'Zeitleiste, Kundenstimmen und ein transparenter Projektablauf — damit du weißt, was wann passiert.'
                  : 'Timeline, customer voices, and a transparent delivery flow — so you know what happens when.'}
              </p>
              <div className="home-section-visual-grid home-section-visual-grid--delivery">
                <HomeSectionVisualCard
                  asset={deliveryVisual}
                  locale={locale}
                  title={locale === 'de' ? 'Delivery Orbit' : 'Delivery orbit'}
                  className="home-section-visual-card--wide"
                  linkHref={caseStudiesHref}
                  linkLabel={locale === 'de' ? 'Delivery Cases' : 'Delivery cases'}
                  onLinkClick={() => trackVisualCta('home-delivery-visual', 'client')}
                />
              </div>

              <div id="home-journey" className="mt-14 scroll-mt-28" aria-labelledby="home-journey-heading">
              <p className="home-eyebrow">{journeyCopy.eyebrow}</p>
              <h3 id="home-journey-heading" className="home-section-h3">
                {journeyCopy.title}
              </h3>
              <p className="mt-2 max-w-3xl text-base text-slate-400">{journeyCopy.description}</p>
              <div className="mt-8 grid gap-12 lg:grid-cols-2">
                <ol className="home-relaunch-timeline" aria-label={locale === 'de' ? 'Zeitleiste' : 'Timeline'}>
                  {journeyCopy.timeline.map((item) => (
                    <li key={`${item.year}-${item.title}`}>
                      <span className="home-relaunch-timeline-index">{item.year}</span>
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.detail}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <div>
                  <p className="mb-5 text-xs font-semibold uppercase tracking-[0.14em] text-sky-400/90">
                    {locale === 'de' ? 'Stimmen aus Case Studies' : 'Voices from case studies'}
                  </p>
                  <div>
                    {testimonialList.map((tm, tIdx) => (
                      <figure key={`${tm.caseSlug}-${tIdx}`} className="home-testimonial-block">
                        <span className="home-testimonial-quote-mark" aria-hidden="true">&ldquo;</span>
                        <blockquote className="home-testimonial-text">{tm.quote}</blockquote>
                        <figcaption className="home-testimonial-attr">
                          <span className="font-semibold text-slate-200">{tm.name}</span>
                          <span className="block text-slate-400">
                            {tm.role} · {tm.company}
                          </span>
                        </figcaption>
                        <Link
                          href={localizePath(`/case-studies/${tm.caseSlug}`, locale)}
                          className="mt-2 inline-flex min-h-12 items-center gap-1.5 text-sm font-semibold text-sky-300 transition hover:text-sky-200"
                        >
                          {locale === 'de' ? 'Case Study lesen' : 'Read case study'}
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </Link>
                      </figure>
                    ))}
                  </div>
                </div>
              </div>
              </div>

              <div id="home-process" className="mt-16 scroll-mt-28 md:mt-20" aria-labelledby="home-process-heading">
              <p className="home-eyebrow">{processCopy.eyebrow}</p>
              <h3 id="home-process-heading" className="home-section-h3">
                {processCopy.title}
              </h3>
              <p className="mt-2 max-w-3xl text-base text-slate-400">{processCopy.description}</p>
              <ol className="home-process-grid" aria-label={locale === 'de' ? 'Projektphasen' : 'Project phases'}>
                {processCopy.steps.map((step, index) => (
                  <li key={step.title} className="home-process-step">
                    <div className="home-process-num" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </li>
                ))}
              </ol>
              </div>
            </RelaunchMotionSection>

            <RelaunchMotionSection id="home-local-seo" className="mt-20 scroll-mt-28 md:mt-24" aria-labelledby="home-local-seo-heading">
              <h2 id="home-local-seo-heading" className="home-section-h2">
                {t.seoLocalTitle}
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-400">{t.seoLocalBody}</p>
            </RelaunchMotionSection>

            <RelaunchMotionSection id="faq" className="mt-20 scroll-mt-28 md:mt-24" aria-labelledby="faq-heading">
              <p className="home-eyebrow">FAQ</p>
              <h2 id="faq-heading" className="home-section-h2">
                {faq.title}
              </h2>
              <p className="mt-2 max-w-2xl text-base text-slate-400">{faq.desc}</p>
              <div className="home-relaunch-faq mt-6">
                {faq.items.map((item) => (
                  <details key={item.q} name="home-faq">
                    <summary className="min-h-12 py-2">{item.q}</summary>
                    <p>{item.a}</p>
                  </details>
                ))}
              </div>
            </RelaunchMotionSection>

            <RelaunchMotionSection
              id="contact"
              className="home-contact-card mt-20 scroll-mt-28 md:mt-24"
              aria-labelledby="home-contact-heading"
            >
              <p className="home-eyebrow">{t.sectionContactEyebrow}</p>
              <div className="mb-7 flex flex-col gap-2">
                <h2 id="home-contact-heading" className="home-section-h2">
                  {t.contactTitle}
                </h2>
                <p className="max-w-2xl text-base text-slate-400">{t.contactDescription}</p>
                <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-slate-400">
                  <Handshake className="h-4 w-4" aria-hidden="true" />
                  {t.locationText}
                </p>
              </div>
              <div className="home-contact-layout">
                <div className="space-y-6">
                  <HomeLeadMagnet
                    locale={locale}
                    title={t.leadMagnetTitle}
                    description={t.leadMagnetDescription}
                    submitLabel={t.leadMagnetSubmit}
                    hint={t.leadMagnetDownloadHint}
                    downloadPath="/assets/downloads/web-engineering-checklist-b2b.txt"
                    heroVariantDefault={heroVariant}
                  />
                  <ContactLeadForm locale={locale} labels={t.form} surface="relaunchDark" />
                </div>
                <HomeSectionVisualCard
                  asset={contactVisual}
                  locale={locale}
                  title={locale === 'de' ? 'Collaboration Bridge' : 'Collaboration bridge'}
                  className="home-contact-visual"
                  linkHref={schedulerHref}
                  linkLabel={locale === 'de' ? 'Scope-Call öffnen' : 'Open scope call'}
                  onLinkClick={() => trackVisualCta('home-contact-visual', 'client')}
                />
              </div>
            </RelaunchMotionSection>
          </main>

          <HomeRelaunchFooter locale={locale} />

          <HomeMobileCtaDock
            locale={locale}
            bookingHref={schedulerHref}
            secondaryHref={projectsHref}
            secondaryLabel={locale === 'de' ? 'Projekte' : 'Projects'}
          />

          <ProjectModal project={activeProject} locale={locale} onClose={closeModal} />
        </div>
      </div>
    </LazyMotion>
  );
}
