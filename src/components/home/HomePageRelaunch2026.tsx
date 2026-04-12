'use client';

import { domAnimation, LazyMotion, m, useReducedMotion as useFramerReducedMotion } from 'framer-motion';
import { ArrowRight, Handshake, MapPin, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { MouseEvent, ReactNode } from 'react';
import { startTransition, useEffect, useMemo, useState } from 'react';

import { HomeBackgroundFXClient } from '@/app-pages/HomeBackgroundFXClient';
import { ContactLeadForm } from '@/components/home/ContactLeadForm';
import { HomeRelaunchFooter } from '@/components/home/HomeRelaunchFooter';
import { HomeRelaunchHeroSnapshot } from '@/components/home/HomeRelaunchHeroSnapshot';
import { HomeMobileCtaDock } from '@/components/home/HomeMobileCtaDock';
import { HomeScrollProgress } from '@/components/home/HomeScrollProgress';
import { HomeSectionRail } from '@/components/home/HomeSectionRail';
import { ProjectModal } from '@/components/ProjectModal';
import { RelaunchStickyHeader } from '@/components/layout/RelaunchStickyHeader';
import { Button } from '@/components/shadcn/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card';
import { copy, type Locale } from '@/content/copy';
import { getHomeRelaunchCopy } from '@/content/homeRelaunchCopy';
import { getHomeJourneyCopy, getHomeProcessCopy, getHomeTestimonials } from '@/content/homeRelaunchSections';
import { getProjectById, getProjectsByTier, getProjectStatusLabel, type Project, type ProjectId } from '@/content/projects';
import { getPublishedTrustEvidence } from '@/content/trustEvidence';
import { trackEvent } from '@/lib/analytics';
import { resolveHeroVariant, type HeroVariantId } from '@/lib/heroExperiment';
import { localizePath } from '@/lib/localeRouting';
import { getContactPath, getHiringPath, getPrimaryNavLinks, getResumePath } from '@/lib/navigation';

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

  const projectHref = (project: Project) => {
    if (project.id === 'configurator_3d') return localizePath('/case-studies/configurator-live', locale);
    if (project.id === 'voicebot' || project.id === 'sorare') return localizePath('/projects', locale);
    return localizePath('/projects', locale);
  };

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
        <HomeSectionRail locale={locale} heroVariant={heroVariant} />

        <div className="relative z-10 min-h-screen text-slate-100">
          <RelaunchStickyHeader
            locale={locale}
            navLinks={navLinks}
            homeHref={homeHref}
            desktopCtaHref={contactHref}
            desktopCtaLabel={locale === 'de' ? 'Kontakt' : 'Contact'}
            mobileNavCtaLabel={t.primaryCta}
            mobileNavCtaHref="#contact"
            mobileNavCtaIntent="client"
            heroVariant={heroVariant}
            desktopContactTrackingSource="home-header-contact"
          />

          <main id="main-content" className="mx-auto w-full max-w-[1200px] px-4 pb-10 pt-10 sm:px-6 md:pb-12 md:pt-14">
            <section
              id="home-hero"
              className="rounded-3xl border border-slate-800/90 bg-slate-950/55 p-6 shadow-[0_24px_80px_rgba(3,8,18,0.45)] backdrop-blur-sm md:p-10"
              aria-labelledby="home-hero-heading"
            >
              <div className="grid gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:items-start lg:gap-12">
                <div>
                  <span className="inline-flex rounded-full border border-sky-500/40 bg-sky-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-sky-300">
                    {t.badge}
                  </span>
                  <h1
                    id="home-hero-heading"
                    className="mt-4 max-w-3xl text-balance font-display text-4xl font-semibold leading-tight text-slate-50 md:text-5xl lg:text-6xl"
                  >
                    {t.title}
                  </h1>
                  <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-300 md:text-lg">{t.description}</p>

                  <div className="mt-5 flex flex-wrap gap-2" aria-label={locale === 'de' ? 'Schwerpunkte' : 'Focus areas'}>
                    {t.heroPills.map((pill) => (
                      <span
                        key={pill}
                        className="rounded-full border border-slate-700/80 bg-slate-900/60 px-3 py-1 text-xs font-medium text-slate-200"
                      >
                        {pill}
                      </span>
                    ))}
                  </div>

                  <p className="mt-5 inline-flex items-center gap-2 text-sm text-emerald-300">
                    <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {t.trustInline}
                  </p>

                  <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <Button asChild size="lg" className="bg-sky-500 text-slate-950 hover:bg-sky-400">
                      <a href="#contact" onClick={() => trackHeroPrimary('home-hero-contact', 'client')}>
                        {t.primaryCta}
                        <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                      </a>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="border-slate-600 bg-transparent text-slate-100 hover:bg-slate-900"
                    >
                      <a href={hiringHref} onClick={() => trackHeroCaseSecondary('home-hero-hiring', 'hiring')}>
                        {t.secondaryCta}
                      </a>
                    </Button>
                    <Button asChild size="lg" variant="ghost" className="text-slate-200 hover:bg-slate-900">
                      <a href={projectsHref} onClick={() => trackHeroPlaybookTertiary('home-hero-projects', 'client')}>
                        {t.tertiaryCta}
                      </a>
                    </Button>
                  </div>
                  <p className="mt-3 text-sm text-slate-400">
                    <a
                      href={resumeHref}
                      onClick={() => trackHeroSecondary('home-hero-resume', 'hiring')}
                      className="font-medium text-sky-300 underline-offset-4 transition hover:text-sky-200 hover:underline"
                    >
                      {locale === 'de' ? 'CV & Verfügbarkeit' : 'Resume & availability'}
                    </a>
                  </p>
                </div>

                <aside
                  className="relative overflow-hidden rounded-2xl border border-sky-500/25 bg-gradient-to-br from-slate-900/90 via-slate-950/95 to-slate-950 p-5 shadow-[0_16px_48px_rgba(8,47,73,0.35)] lg:sticky lg:top-28"
                  aria-label={t.heroSnapshotLabel}
                >
                  {!heroAmbientMotion ? (
                    <video
                      className="pointer-events-none absolute inset-0 z-0 h-full w-full scale-110 object-cover opacity-[0.22] mix-blend-screen"
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
                    <div className="mb-4 flex items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                      <p className="text-sm font-medium text-slate-200">{t.heroSnapshotLabel}</p>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-emerald-300">
                        <span className="relative flex h-1.5 w-1.5">
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
                    />
                    {heroProject?.media?.caption?.[locale] ? (
                      <p className="mt-2 text-[0.7rem] leading-snug text-slate-500">{heroProject.media.caption[locale]}</p>
                    ) : null}
                    <ul className="mt-4 grid grid-cols-3 gap-3 border-t border-slate-800/80 pt-4" aria-label={locale === 'de' ? 'Metriken' : 'Metrics'}>
                      {t.heroMetrics.map((stat) => (
                        <li key={stat.label} className="text-center">
                          <p className="font-display text-lg font-semibold text-slate-50 md:text-xl">{stat.value}</p>
                          <p className="mt-0.5 text-[0.68rem] leading-snug text-slate-400">{stat.label}</p>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 space-y-1.5 text-xs text-slate-400">
                      <p>{t.heroSnapshotFoot[0]}</p>
                      <p>{t.heroSnapshotFoot[1]}</p>
                    </div>
                  </div>
                </aside>
              </div>

              <div className="mt-10 grid gap-4 border-t border-slate-800/60 pt-10 md:grid-cols-3">
                {audienceCards.map((card) => (
                  <Card key={card.title} className="border-slate-800 bg-slate-900/50 text-slate-100">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{card.title}</CardTitle>
                      <CardDescription className="text-slate-300">{card.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link
                        href={card.href}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-sky-300 transition hover:text-sky-200"
                        onClick={() =>
                          trackHeroSecondary(
                            card.source,
                            card.source.includes('hiring') ? 'hiring' : card.source.includes('collab') ? 'collab' : 'client'
                          )
                        }
                      >
                        {locale === 'de' ? 'Pfad öffnen' : 'Open path'}
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <RelaunchMotionSection id="home-proof" className="mt-14 scroll-mt-28" aria-labelledby="home-proof-heading">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-sky-400/90">{t.sectionProofEyebrow}</p>
              <h2 id="home-proof-heading" className="font-display text-2xl font-semibold text-slate-100">
                {t.proofTitle}
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">{t.proofDescription}</p>
              <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                <Card className="border-slate-800 bg-slate-900/50 text-slate-100">
                  <CardHeader>
                    <CardTitle className="text-base">{locale === 'de' ? 'Arbeitsprinzipien' : 'Operating principles'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {t.proofPoints.map((point) => (
                      <p key={point} className="flex items-start gap-2 text-sm text-slate-200">
                        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" aria-hidden="true" />
                        <span>{point}</span>
                      </p>
                    ))}
                  </CardContent>
                </Card>
                <Card className="border-slate-800 bg-slate-900/50 text-slate-100">
                  <CardHeader>
                    <CardTitle>{locale === 'de' ? 'Öffentliche Belege' : 'Public proofs'}</CardTitle>
                    <CardDescription className="text-slate-300">
                      {locale === 'de'
                        ? 'Nur verifizierte Artefakte in der zentralen Vertrauensebene.'
                        : 'Only verified artifacts in the primary trust layer.'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {trustEvidence.map((item) => (
                      <a
                        key={item.id}
                        href={item.external ? item.href : localizePath(item.href, locale)}
                        target={item.external ? '_blank' : undefined}
                        rel={item.external ? 'noopener noreferrer' : undefined}
                        className="block rounded-lg border border-slate-700 bg-slate-950/50 px-3 py-2 text-sm text-slate-200 transition hover:border-sky-400"
                      >
                        <p className="font-medium">{item.title}</p>
                        <p className="mt-1 text-xs text-slate-400">{item.description}</p>
                      </a>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </RelaunchMotionSection>

            <RelaunchMotionSection id="home-projects" className="mt-14 scroll-mt-28" aria-labelledby="home-projects-heading">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-sky-400/90">{t.sectionProjectsEyebrow}</p>
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <h2 id="home-projects-heading" className="font-display text-2xl font-semibold text-slate-100">
                    {t.featuredProjectsTitle}
                  </h2>
                  <p className="mt-1 text-sm text-slate-300">{t.featuredProjectsDescription}</p>
                </div>
                <Link href={projectsHref} className="text-sm font-semibold text-sky-300 hover:text-sky-200">
                  {locale === 'de' ? 'Alle Projekte' : 'All projects'}
                </Link>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {featuredProjects.map((project) => (
                  <Card key={project.id} className="border-slate-800 bg-slate-900/50 text-slate-100">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{project.title[locale]}</CardTitle>
                      <CardDescription className="text-slate-300">{project.one_liner[locale]}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-3 text-xs uppercase tracking-[0.1em] text-emerald-300">
                        {getProjectStatusLabel(project.status, locale)}
                      </p>
                      <a
                        href={projectHref(project)}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-sky-300 hover:text-sky-200"
                        onClick={(e) => onProjectLinkClick(e, project, 'home_relaunch_project_card')}
                        aria-haspopup="dialog"
                      >
                        {locale === 'de' ? 'Details' : 'Details'}
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </RelaunchMotionSection>

            <RelaunchMotionSection id="home-insights" className="mt-14 scroll-mt-28" aria-labelledby="home-insights-heading">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-sky-400/90">{t.sectionInsightsEyebrow}</p>
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <h2 id="home-insights-heading" className="font-display text-2xl font-semibold text-slate-100">
                    {t.insightsTitle}
                  </h2>
                  <p className="mt-1 text-sm text-slate-300">{t.insightsDescription}</p>
                </div>
                <Link
                  href={insightsHref}
                  className="text-sm font-semibold text-sky-300 hover:text-sky-200"
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
              <div className="grid gap-4 md:grid-cols-3">
                {featuredInsights.map((insight) => (
                  <Card key={insight.slug} className="border-slate-800 bg-slate-900/50 text-slate-100">
                    <CardHeader>
                      <CardDescription className="text-xs uppercase tracking-[0.1em] text-slate-400">
                        {insight.category} · {insight.readMinutes} {locale === 'de' ? 'Min' : 'min'}
                      </CardDescription>
                      <CardTitle className="text-base">{insight.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-300">{insight.summary}</p>
                      <Link
                        href={localizePath(`/insights/${insight.slug}`, locale)}
                        className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-sky-300 hover:text-sky-200"
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
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </RelaunchMotionSection>

            <RelaunchMotionSection id="home-journey" className="mt-14 scroll-mt-28" aria-labelledby="home-journey-heading">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-sky-400/90">{journeyCopy.eyebrow}</p>
              <h2 id="home-journey-heading" className="font-display text-2xl font-semibold text-slate-100">
                {journeyCopy.title}
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-300">{journeyCopy.description}</p>
              <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-12">
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
                  <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-400/90">
                    {locale === 'de' ? 'Stimmen aus Case Studies' : 'Voices from case studies'}
                  </h3>
                  <div className="mt-4 flex flex-col gap-4">
                    {testimonialList.map((tm) => (
                      <figure
                        key={tm.caseSlug}
                        className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-slate-100"
                      >
                        <blockquote className="text-sm leading-relaxed text-slate-200">
                          <span className="text-sky-300/90">&ldquo;</span>
                          {tm.quote}
                          <span className="text-sky-300/90">&rdquo;</span>
                        </blockquote>
                        <figcaption className="mt-3 text-xs text-slate-400">{tm.attribution}</figcaption>
                        <Link
                          href={localizePath(`/case-studies/${tm.caseSlug}`, locale)}
                          className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-sky-300 transition hover:text-sky-200"
                        >
                          {locale === 'de' ? 'Case Study lesen' : 'Read case study'}
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                      </figure>
                    ))}
                  </div>
                </div>
              </div>
            </RelaunchMotionSection>

            <RelaunchMotionSection id="home-process" className="mt-14 scroll-mt-28" aria-labelledby="home-process-heading">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-sky-400/90">{processCopy.eyebrow}</p>
              <h2 id="home-process-heading" className="font-display text-2xl font-semibold text-slate-100">
                {processCopy.title}
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-300">{processCopy.description}</p>
              <ol className="home-relaunch-timeline mt-8" aria-label={locale === 'de' ? 'Projektphasen' : 'Project phases'}>
                {processCopy.steps.map((step, index) => (
                  <li key={step.title}>
                    <span className="home-relaunch-timeline-index">{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </RelaunchMotionSection>

            <RelaunchMotionSection id="faq" className="mt-14 scroll-mt-28" aria-labelledby="faq-heading">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-sky-400/90">FAQ</p>
              <h2 id="faq-heading" className="font-display text-2xl font-semibold text-slate-100">
                {faq.title}
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">{faq.desc}</p>
              <div className="home-relaunch-faq mt-6">
                {faq.items.map((item) => (
                  <details key={item.q} name="home-faq">
                    <summary>{item.q}</summary>
                    <p>{item.a}</p>
                  </details>
                ))}
              </div>
            </RelaunchMotionSection>

            <RelaunchMotionSection
              id="contact"
              className="mt-14 scroll-mt-28 rounded-3xl border border-slate-800/90 bg-slate-950/55 p-6 shadow-[0_20px_64px_rgba(3,8,18,0.4)] backdrop-blur-sm md:p-8"
              aria-labelledby="home-contact-heading"
            >
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-sky-400/90">{t.sectionContactEyebrow}</p>
              <div className="mb-6 flex flex-col gap-2">
                <h2 id="home-contact-heading" className="font-display text-2xl font-semibold text-slate-100">
                  {t.contactTitle}
                </h2>
                <p className="max-w-3xl text-sm text-slate-300">{t.contactDescription}</p>
                <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-slate-400">
                  <Handshake className="h-4 w-4" aria-hidden="true" />
                  {t.locationText}
                </p>
              </div>
              <ContactLeadForm locale={locale} labels={t.form} surface="relaunchDark" />
            </RelaunchMotionSection>
          </main>

          <HomeRelaunchFooter locale={locale} />

          <HomeMobileCtaDock locale={locale} projectsHref={projectsHref} />

          <ProjectModal project={activeProject} locale={locale} onClose={closeModal} />
        </div>
      </div>
    </LazyMotion>
  );
}
