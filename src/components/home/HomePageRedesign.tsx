'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent } from 'react';
import { ArrowRight, Check, CircleCheckBig, Clock3, Handshake, Layers3, ShieldCheck, Sparkles, Workflow } from 'lucide-react';

import { ContactLeadForm } from '@/components/home/ContactLeadForm';
import { HomeMobileNav } from '@/components/home/HomeMobileNav';
import { SectionHeading } from '@/components/home/SectionHeading';
import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card';
import { CASE_STUDY_KPIS } from '@/content/caseStudies';
import { getProjectStatusLabel, getProjectsByTier } from '@/content/projects';
import { getPrimaryHomepageTestimonial } from '@/content/testimonials';
import { getPublishedTrustEvidence } from '@/content/trustEvidence';
import { trackEvent } from '@/lib/analytics';
import { cn } from '@/lib/cn';
import { resolveHeroVariant, type HeroVariantId } from '@/lib/heroExperiment';
import { localizePath } from '@/lib/localeRouting';
import { getContactPath, getPrimaryNavLinks } from '@/lib/navigation';

type FeaturedInsightTeaser = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  readMinutes: number;
};

type Locale = 'de' | 'en';

type HomePageRedesignProps = {
  locale: Locale;
  featuredInsights: FeaturedInsightTeaser[];
};

type CopyBlock = {
  nav: {
    services: string;
    benefits: string;
    trust: string;
    insights: string;
    process: string;
    contact: string;
  };
  hero: {
    badge: string;
    title: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
    ctaTertiary: string;
    highlights: string[];
    trustNote: string;
  };
  services: {
    eyebrow: string;
    title: string;
    description: string;
    items: Array<{ title: string; description: string; bullets: string[] }>;
  };
  benefits: {
    eyebrow: string;
    title: string;
    description: string;
    items: Array<{ title: string; description: string }>;
  };
  trust: {
    eyebrow: string;
    title: string;
    description: string;
    logos: string[];
    quote: string;
    quoteAuthor: string;
    metrics: Array<{ label: string; value: string }>;
  };
  process: {
    eyebrow: string;
    title: string;
    description: string;
    steps: Array<{ title: string; description: string }>;
  };
  insights: {
    eyebrow: string;
    title: string;
    description: string;
    cta: string;
    metaRead: string;
  };
  cta: {
    eyebrow: string;
    title: string;
    description: string;
    formName: string;
    formEmail: string;
    formCompany: string;
    formMessage: string;
    formButton: string;
    helper: string;
    submitting: string;
    success: string;
    error: string;
    rateLimited: string;
    verificationRequired: string;
    privacy: string;
    nextStep: string;
    schedulerCta: string;
    schedulerHint: string;
  };
  footer: {
    description: string;
    legal: string;
  };
};

const homeCopy: Record<Locale, CopyBlock> = {
  de: {
    nav: {
      services: 'Leistungen',
      benefits: 'Warum dieses Setup',
      trust: 'Referenzen',
      insights: 'Insights',
      process: 'Prozess',
      contact: 'Kontakt'
    },
    hero: {
      badge: 'B2B Web Engineering',
      title: 'Technical Delivery ohne Blindflug: Websysteme, die stabil laufen und klar konvertieren.',
      description:
        'Ich kombiniere Architektur, UX-Führung und produktionsnahe Umsetzung. Das Ergebnis sind B2B-Webseiten, die Entscheidungssicherheit schaffen und qualifizierte Anfragen planbar erzeugen.',
      ctaPrimary: 'Erstgespräch starten',
      ctaSecondary: 'Case Studies ansehen',
      ctaTertiary: 'Playbook lesen',
      highlights: ['Enterprise-nahe Frontends', 'Klare Informationsarchitektur', 'Performante Umsetzung mit Next.js'],
      trustNote: 'Authority-first Web Engineering für produktkritische Plattformen'
    },
    services: {
      eyebrow: 'Leistungen',
      title: 'Von Positionierung bis Produktionsbetrieb in einem sauberen Delivery-Flow.',
      description: 'Du bekommst keine lose Design-Datei, sondern ein belastbares Frontend-System mit klaren Uebergaben fuer Marketing und Product.',
      items: [
        {
          title: 'UX & Informationsarchitektur',
          description: 'Struktur, Messaging und Conversion-Führung entlang realer B2B-Entscheidungswege.',
          bullets: ['Nutzerpfade und Funnel-Logik', 'Content-Hierarchie mit klaren CTA-Stufen']
        },
        {
          title: 'UI-System & Frontend Engineering',
          description: 'Modulares UI auf Next.js, Tailwind und shadcn/ui für schnelle Iteration ohne Qualitätsverlust.',
          bullets: ['Komponentenbibliothek mit Tokens', 'Semantisch, barrierearm, responsive']
        },
        {
          title: 'Performance & Qualitätssicherung',
          description: 'Performance-Budgets und technische Guardrails von Beginn an, nicht erst kurz vor Launch.',
          bullets: ['Core-Web-Vitals-orientierte Umsetzung', 'Saubere QA-, Review- und Release-Standards']
        }
      ]
    },
    benefits: {
      eyebrow: 'Warum dieses Setup',
      title: 'Technisch stark, inhaltlich klar, operativ zuverlässig.',
      description: 'Gerade im B2B-Kontext entscheidet nicht nur Designqualität, sondern auch Verständlichkeit und technische Robustheit.',
      items: [
        {
          title: 'Klare Hierarchie statt Informationsrauschen',
          description: 'Jede Section erfüllt eine eindeutige Funktion im Entscheidungsprozess.'
        },
        {
          title: 'Hochwertiger Eindruck ohne visuelle Überladung',
          description: 'Bewusste Typografie, viel Weißraum und präzise Interaktionsmuster.'
        },
        {
          title: 'Conversion-orientierte Architektur',
          description: 'Primäre und sekundäre CTAs sind konsistent, wiederholbar und messbar.'
        },
        {
          title: 'Skalierbares Komponentenmodell',
          description: 'Neue Inhalte und Seiten lassen sich ohne Redesign-Wildwuchs erweitern.'
        }
      ]
    },
    trust: {
      eyebrow: 'Referenzen & Trust',
      title: 'Entscheider:innen vertrauen auf nachvollziehbare Delivery.',
      description: 'Statt reiner Design-Versprechen zeigen reale Build-Artefakte belastbare Signale aus Umsetzung, Zusammenarbeit und Ergebnisqualitaet.',
      logos: ['SaaS Plattform', 'Industrial Tech', 'Digital Product Studio', 'B2B Services'],
      quote:
        'Die neue Website sieht nicht nur hochwertig aus, sie erklärt unser Angebot klar und bringt endlich qualifizierte Erstgespräche.',
      quoteAuthor: 'Head of Marketing, B2B SaaS',
      metrics: [
        { label: 'Typisches Projekt-Setup', value: '< 10 Tage' },
        { label: 'Lighthouse Performance Ziel', value: '95+' },
        { label: 'Antwortzeit im Projekt', value: '< 24h' }
      ]
    },
    process: {
      eyebrow: 'Zusammenarbeit',
      title: 'Ein transparenter Prozess mit klaren Entscheidungspunkten.',
      description: 'So bleibt das Projekt steuerbar und Teams behalten jederzeit Überblick über Scope, Qualität und Timing.',
      steps: [
        {
          title: '1. Discovery & Priorisierung',
          description: 'Ziele, Zielgruppen, Kernbotschaft und Business-Constraints auf eine belastbare Seite bringen.'
        },
        {
          title: '2. UX/UI-System & Prototyp',
          description: 'Struktur und visuelle Sprache validieren, bevor umfangreich entwickelt wird.'
        },
        {
          title: '3. Implementierung & QA',
          description: 'Komponenten, Content und technische Qualität in einem reproduzierbaren Delivery-Prozess liefern.'
        },
        {
          title: '4. Launch & Iteration',
          description: 'Tracking, Optimierung und weitere Conversion-Hebel nach dem Go-live iterativ ausbauen.'
        }
      ]
    },
    insights: {
      eyebrow: 'Insights',
      title: 'Aktuelle Engineering-Pattern fuer Teams mit hohem Delivery-Druck.',
      description: 'Kurze, praxisnahe Insights zu Architektur, CRO und operationaler Web-Qualitaet.',
      cta: 'Alle Insights ansehen',
      metaRead: 'Min Lesezeit'
    },
    cta: {
      eyebrow: 'Call to Action',
      title: 'Lass uns deine Homepage auf Enterprise-Niveau bringen.',
      description: 'Kurzer Kontext reicht: Ziel, aktueller Engpass, gewuenschter Zeitrahmen. Du bekommst einen klaren naechsten Schritt.',
      formName: 'Name',
      formEmail: 'Business-E-Mail',
      formCompany: 'Firma (optional)',
      formMessage: 'Was soll die neue Seite erreichen?',
      formButton: 'Kostenlose Erstberatung anfragen',
      helper: 'Antwort in der Regel innerhalb eines Werktags.',
      submitting: 'Wird gesendet...',
      success: 'Danke, deine Anfrage ist eingegangen. Ich melde mich zeitnah.',
      error: 'Senden fehlgeschlagen. Bitte erneut versuchen.',
      rateLimited: 'Zu viele Anfragen in kurzer Zeit. Bitte in wenigen Minuten erneut versuchen.',
      verificationRequired: 'Bitte bestätigen Sie die Sicherheitsprüfung und senden Sie erneut.',
      privacy: 'Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Anfrage zur Kontaktaufnahme zu.',
      nextStep: 'Naechster Schritt: Du erhaeltst innerhalb eines Werktags eine konkrete Rueckmeldung mit Scope-Empfehlung.',
      schedulerCta: 'Oder direkt Termin buchen',
      schedulerHint: '15 Minuten Intro-Call via Cal.com'
    },
    footer: {
      description: 'Modernes Webdesign und Frontend Engineering für B2B-Tech-Unternehmen.',
      legal: '© 2026 ivo-tech. Alle Rechte vorbehalten.'
    }
  },
  en: {
    nav: {
      services: 'Services',
      benefits: 'Why us',
      trust: 'Proof',
      insights: 'Insights',
      process: 'Process',
      contact: 'Contact'
    },
    hero: {
      badge: 'B2B Web Engineering',
      title: 'Technical delivery without guesswork: web systems that stay stable and convert clearly.',
      description:
        'I combine architecture, conversion-focused UX, and production-grade implementation. You get a B2B website that creates decision confidence and qualified pipeline.',
      ctaPrimary: 'Start discovery call',
      ctaSecondary: 'View case studies',
      ctaTertiary: 'Read playbook',
      highlights: ['Enterprise-grade frontend quality', 'Clear information architecture', 'Fast Next.js delivery'],
      trustNote: 'Authority-first engineering for product-critical web platforms'
    },
    services: {
      eyebrow: 'Services',
      title: 'From positioning to production-ready delivery.',
      description: 'You do not get disconnected mockups. You get a coherent frontend system that marketing and product teams can actually operate.',
      items: [
        {
          title: 'UX & Information Architecture',
          description: 'Messaging, structure, and conversion flow aligned to real B2B buying behavior.',
          bullets: ['Decision-stage user journeys', 'Clear CTA hierarchy']
        },
        {
          title: 'UI System & Frontend Engineering',
          description: 'Modular delivery with Next.js, Tailwind and shadcn/ui to scale without design drift.',
          bullets: ['Token-driven component library', 'Accessible and responsive by default']
        },
        {
          title: 'Performance & Quality',
          description: 'Performance budgets and implementation guardrails from day one.',
          bullets: ['Core Web Vitals focused build', 'Repeatable QA and release standards']
        }
      ]
    },
    benefits: {
      eyebrow: 'Why us',
      title: 'Technically strong, operationally dependable.',
      description: 'For B2B websites, credibility is won by clarity and delivery quality, not visual noise.',
      items: [
        { title: 'Intentional hierarchy', description: 'Every section has a clear job in the decision flow.' },
        { title: 'Premium look without gimmicks', description: 'Strong typography, space, and focused interaction states.' },
        { title: 'Conversion-ready architecture', description: 'Primary and secondary CTAs are consistent and measurable.' },
        { title: 'Scalable components', description: 'Expand pages and content without redesign chaos.' }
      ]
    },
    trust: {
      eyebrow: 'Proof',
      title: 'Teams trust delivery they can verify.',
      description: 'We show concrete quality signals across execution, collaboration, and outcomes.',
      logos: ['SaaS Platform', 'Industrial Tech', 'Digital Product Studio', 'B2B Services'],
      quote: 'The new homepage is cleaner, faster, and finally communicates our offer clearly to decision-makers.',
      quoteAuthor: 'Head of Marketing, B2B SaaS',
      metrics: [
        { label: 'Typical project kickoff', value: '< 10 days' },
        { label: 'Lighthouse performance target', value: '95+' },
        { label: 'Project response window', value: '< 24h' }
      ]
    },
    process: {
      eyebrow: 'Process',
      title: 'Transparent collaboration with clear checkpoints.',
      description: 'The workflow stays measurable, aligned, and predictable across design, engineering, and stakeholders.',
      steps: [
        { title: '1. Discovery & Prioritization', description: 'Align goals, audience, positioning, and constraints.' },
        { title: '2. UX/UI System & Prototype', description: 'Validate structure and visual language before full implementation.' },
        { title: '3. Implementation & QA', description: 'Ship components and content with repeatable quality gates.' },
        { title: '4. Launch & Iteration', description: 'Track, optimize, and continuously improve conversion outcomes.' }
      ]
    },
    insights: {
      eyebrow: 'Insights',
      title: 'Current engineering patterns for teams under delivery pressure.',
      description: 'Practical insights on architecture, CRO, and operational web quality.',
      cta: 'View all insights',
      metaRead: 'min read'
    },
    cta: {
      eyebrow: 'Call to Action',
      title: 'Upgrade your homepage to enterprise-grade quality.',
      description: 'Share your goal, current bottleneck, and timeline. We reply with a concrete next step.',
      formName: 'Name',
      formEmail: 'Business email',
      formCompany: 'Company (optional)',
      formMessage: 'What should the new homepage achieve?',
      formButton: 'Request free consultation',
      helper: 'Typical response time: within one business day.',
      submitting: 'Sending...',
      success: 'Thanks, your request has been received. We will get back shortly.',
      error: 'Submission failed. Please try again.',
      rateLimited: 'Too many requests in a short time. Please try again in a few minutes.',
      verificationRequired: 'Please complete the security check and submit again.',
      privacy: 'By submitting, you agree to processing your request for contact purposes.',
      nextStep: 'Next step: You receive a concrete scope recommendation within one business day.',
      schedulerCta: 'Or book a call now',
      schedulerHint: '15-minute intro call via Cal.com'
    },
    footer: {
      description: 'Modern web design and frontend engineering for B2B tech teams.',
      legal: '© 2026 ivo-tech. All rights reserved.'
    }
  }
};

const heroVariantOverrides: Record<Locale, Record<Exclude<HeroVariantId, 'default'>, Partial<CopyBlock['hero']>>> = {
  de: {
    outcome: {
      title: 'Ihre Website soll messbar liefern: mehr qualifizierte Anfragen, weniger Reibung im Funnel.',
      description:
        'Keine Deko-Seiten: belastbare B2B-Websysteme mit klarer Entscheidungskommunikation und operativer Conversion-Logik.',
      ctaPrimary: 'Scope in 30 Min klaeren'
    },
    speed: {
      title: 'In Wochen statt Quartalen: produktionsnahe Website-Delivery fuer B2B-Teams.',
      description:
        'Kompakte Sprints, klare Deliverables, saubere QA-Gates. Damit Marketing und Product schneller live gehen ohne Qualitätsverlust.',
      ctaPrimary: 'Sprint-Start anfragen'
    }
  },
  en: {
    outcome: {
      title: 'Your website should perform: more qualified pipeline, less funnel friction.',
      description:
        'We do not ship decorative pages. We build durable B2B web systems with clear decision communication and conversion logic.',
      ctaPrimary: 'Clarify scope in 30 min'
    },
    speed: {
      title: 'Weeks, not quarters: production-grade website delivery for B2B teams.',
      description:
        'Compact sprints, explicit deliverables, and QA gates so marketing and product teams can ship faster without quality debt.',
      ctaPrimary: 'Request sprint kickoff'
    }
  }
};

function withHeroVariantParam(url: string, heroVariant: HeroVariantId) {
  if (heroVariant === 'default') return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}exp_hero=${heroVariant}`;
}

export function HomePageRedesign({ locale, featuredInsights }: HomePageRedesignProps) {
  const searchParams = useSearchParams();
  const t = homeCopy[locale];
  const queryHeroVariant = useMemo(() => searchParams.get('exp_hero'), [searchParams]);
  const [heroResolution, setHeroResolution] = useState<ReturnType<typeof resolveHeroVariant>>({
    variant: 'default',
    source: 'default',
    experimentEnabled: false
  });
  const [heroResolutionReady, setHeroResolutionReady] = useState(false);
  const heroVariant = heroResolution.variant;
  const heroVariantSource = heroResolution.source;
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<string>('');
  const hero = heroVariant === 'default' ? t.hero : { ...t.hero, ...heroVariantOverrides[locale][heroVariant] };
  const trackedHeroVariant = useRef<string | null>(null);
  const heroPanelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const next = resolveHeroVariant({
      queryValue: queryHeroVariant,
      enabledRaw: process.env.NEXT_PUBLIC_HERO_EXPERIMENT_ENABLED,
      weightsRaw: process.env.NEXT_PUBLIC_HERO_EXPERIMENT_WEIGHTS
    });
    const raf = window.requestAnimationFrame(() => {
      setHeroResolution(next);
      setHeroResolutionReady(true);
    });
    return () => window.cancelAnimationFrame(raf);
  }, [queryHeroVariant]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (queryHeroVariant) return;
    if (heroVariant === 'default') return;

    const params = new URLSearchParams(window.location.search);
    params.set('exp_hero', heroVariant);
    const nextQuery = params.toString();
    const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ''}${window.location.hash}`;
    window.history.replaceState(window.history.state, '', nextUrl);
  }, [heroVariant, queryHeroVariant]);

  useEffect(() => {
    if (!heroResolutionReady) return;
    if (trackedHeroVariant.current === heroVariant) return;
    trackedHeroVariant.current = heroVariant;
    trackEvent('hero_variant_view', {
      locale,
      variant: heroVariant,
      source: `home_hero_${heroVariantSource}`
    });
  }, [heroResolutionReady, heroVariant, heroVariantSource, locale]);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
        const next = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
        setScrollProgress(next);
        raf = 0;
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    const sectionIds = ['services', 'benefits', 'trust', 'insights', 'process', 'contact'] as const;
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) {
          setActiveSection(visible.target.id);
        }
      },
      {
        root: null,
        rootMargin: '-18% 0px -52% 0px',
        threshold: [0.18, 0.35, 0.55, 0.72]
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const localeRoot = locale === 'de' ? '/' : '/en';
  const caseStudiesPath = localizePath('/case-studies', locale);
  const playbooksPath = localizePath('/playbooks', locale);
  const insightsPath = localizePath('/insights', locale);
  const contactPath = getContactPath(locale, 'home-hero-primary');
  const caseStudiesPathWithSource = withHeroVariantParam(`${caseStudiesPath}?source=home-case`, heroVariant);
  const playbooksPathWithSource = withHeroVariantParam(`${playbooksPath}?source=home-playbook`, heroVariant);
  const insightsPathWithSource = withHeroVariantParam(`${insightsPath}?source=home-insights`, heroVariant);
  const contactPathWithSource = withHeroVariantParam(contactPath, heroVariant);
  const pageShell = 'mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8';
  const pageShellStyle = { marginInline: 'auto' } as const;
  const sectionShell =
    'rounded-[28px] border border-slate-200/90 bg-white/92 p-6 shadow-soft backdrop-blur-sm md:p-9';
  const primaryNavLinks = getPrimaryNavLinks(locale);
  const sectionNavLinks = [
    { href: '#services', label: t.nav.services },
    { href: '#benefits', label: t.nav.benefits },
    { href: '#trust', label: t.nav.trust },
    { href: '#insights', label: t.nav.insights },
    { href: '#process', label: t.nav.process },
    { href: '#contact', label: t.nav.contact }
  ];
  const trustProjects = [getProjectsByTier('hero')[0], ...getProjectsByTier('featured').slice(0, 2)].filter(Boolean);
  const trustEvidence = getPublishedTrustEvidence(locale)
    .map((item) => ({
      ...item,
      href: item.external ? item.href : localizePath(item.href, locale)
    }))
    .slice(0, 3);
  const primaryTestimonial = getPrimaryHomepageTestimonial(locale);
  const proofSnapshots = (['configurator-live', 'portfolio-authority-relaunch'] as const)
    .map((slug) => ({
      slug,
      title:
        slug === 'configurator-live'
          ? locale === 'de'
            ? 'Case Snapshot: Configurator Live'
            : 'Case snapshot: Configurator live'
          : locale === 'de'
            ? 'Case Snapshot: Portfolio Authority Relaunch'
            : 'Case snapshot: Portfolio authority relaunch',
      kpis: CASE_STUDY_KPIS[locale][slug] ?? []
    }))
    .filter((entry) => entry.kpis.length > 0);
  const legalLinks =
    locale === 'de'
      ? [
          { href: '/impressum', label: 'Impressum' },
          { href: '/datenschutz', label: 'Datenschutz' }
        ]
      : [
          { href: '/en/legal', label: 'Legal notice' },
          { href: '/en/privacy', label: 'Privacy' }
        ];
  const trustProjectHref = (projectId: string) => {
    if (projectId === 'configurator_3d') return localizePath('/case-studies/configurator-live', locale);
    return localizePath('/case-studies', locale);
  };
  const handleHeroPrimaryClick = () => {
    trackEvent('hero_cta_click', { source: 'home_hero_primary', locale, intent: 'client', variant: heroVariant });
    trackEvent('cta_primary_click', { source: 'home_hero_primary', locale, intent: 'client', variant: heroVariant });
  };
  const handleHeroSecondaryClick = () => {
    trackEvent('section_cta_click', { source: 'home_hero_secondary_case', locale, intent: 'client', variant: heroVariant });
    trackEvent('cta_case_primary_click', { source: 'home_hero_secondary_case', locale, intent: 'client', variant: heroVariant });
  };
  const handleHeroTertiaryClick = () => {
    trackEvent('playbook_open', { source: 'home_hero_tertiary_playbook', locale, intent: 'client', variant: heroVariant });
    trackEvent('section_cta_click', { source: 'home_hero_tertiary_playbook', locale, intent: 'client', variant: heroVariant });
    trackEvent('cta_playbook_tertiary_click', { source: 'home_hero_tertiary_playbook', locale, intent: 'client', variant: heroVariant });
  };
  const handleInsightCardClick = (slug: string) => {
    trackEvent('insight_card_click', { source: 'home_insights_featured', locale, slug, variant: heroVariant });
  };
  const handleInsightsHubClick = () => {
    trackEvent('insights_hub_click', { source: 'home_insights_hub', locale, variant: heroVariant });
  };
  const handleTrustEvidenceClick = (assetId: string, href: string) => {
    const path = typeof window === 'undefined' ? '/' : `${window.location.pathname}${window.location.search}`;
    trackEvent('authority_asset_view', {
      asset: assetId,
      location: 'home-trust-evidence',
      locale,
      path,
      href
    });
  };
  const handleTrustProjectClick = (projectId: string) => {
    const path = typeof window === 'undefined' ? '/' : `${window.location.pathname}${window.location.search}`;
    trackEvent('trust_project_click', {
      source: 'home-services-preview',
      locale,
      projectId,
      path,
      variant: heroVariant
    });
  };
  const handleNavClick = (href: string) => {
    const sectionId = href.replace('#', '');
    trackEvent('section_cta_click', {
      source: 'home_header_nav',
      locale,
      sectionId,
      variant: heroVariant
    });
    trackEvent('nav_section_click', {
      source: 'home_header_nav',
      locale,
      sectionId,
      variant: heroVariant
    });
  };
  const handleHeroPanelPointerMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    const target = heroPanelRef.current;
    if (!target) return;
    const bounds = target.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    target.style.setProperty('--spotlight-x', `${Math.min(Math.max(x, 0), 100)}%`);
    target.style.setProperty('--spotlight-y', `${Math.min(Math.max(y, 0), 100)}%`);
  };
  const handleHeroPanelPointerLeave = () => {
    const target = heroPanelRef.current;
    if (!target) return;
    target.style.setProperty('--spotlight-x', '50%');
    target.style.setProperty('--spotlight-y', '24%');
  };
  const heroSignals =
    locale === 'de'
      ? [
          { icon: ShieldCheck, label: 'Delivery-Qualität mit klaren QA-Gates' },
          { icon: Workflow, label: 'Nachvollziehbarer Scope statt Feature-Chaos' },
          { icon: Clock3, label: 'Antwortzeit typischerweise unter 24h' }
        ]
      : [
          { icon: ShieldCheck, label: 'Delivery quality with explicit QA gates' },
          { icon: Workflow, label: 'Clear scope instead of feature chaos' },
          { icon: Clock3, label: 'Typical response window under 24h' }
        ];
  const contactSignals =
    locale === 'de'
      ? [
          { title: 'Scope in 30 Min geklärt', detail: 'Ziele, Engpass und realistischer Umsetzungsrahmen.' },
          { title: 'Technische Risiken früh sichtbar', detail: 'Klare Einschätzung zu Architektur-, QA- und Delivery-Fragen.' },
          { title: 'Konkreter nächster Schritt', detail: 'Sie erhalten eine belastbare Empfehlung statt losem Feedback.' }
        ]
      : [
          { title: 'Scope clarified in 30 min', detail: 'Goals, bottleneck, and a realistic delivery frame.' },
          { title: 'Technical risks visible early', detail: 'Clear take on architecture, QA, and delivery risks.' },
          { title: 'Concrete next step', detail: 'You get an actionable recommendation, not vague feedback.' }
        ];
  const trustLogoChips = t.trust.logos.slice(0, 4);
  const trustLogoIcons = [
    { label: trustLogoChips[0], bg: 'from-sky-500/90 via-blue-600/80 to-indigo-700/80', badge: 'S' },
    { label: trustLogoChips[1], bg: 'from-emerald-400/80 via-cyan-500/80 to-blue-600/80', badge: 'I' },
    { label: trustLogoChips[2], bg: 'from-amber-400/85 via-orange-500/85 to-rose-500/75', badge: 'D' },
    { label: trustLogoChips[3], bg: 'from-violet-500/80 via-indigo-500/80 to-sky-500/80', badge: 'B' }
  ].filter((item) => item.label);
  const proofBrandMarks = [
    { src: '/assets/thumb_labs.svg', label: locale === 'de' ? 'Labs Systems' : 'Labs systems' },
    { src: '/assets/thumb_voicebot.svg', label: locale === 'de' ? 'Voicebot Flows' : 'Voicebot flows' },
    { src: '/assets/thumb_sorare.svg', label: locale === 'de' ? 'Realtime Dashboards' : 'Realtime dashboards' }
  ] as const;
  const serviceToneClasses = [
    'border-brand-300 bg-[linear-gradient(155deg,#ffffff_0%,#dcedff_44%,#d3e9ff_100%)]',
    'border-cyan-300 bg-[linear-gradient(155deg,#ffffff_0%,#d8f3ff_46%,#cef0ff_100%)]',
    'border-amber-300 bg-[linear-gradient(155deg,#ffffff_0%,#fff1d7_46%,#ffe8bf_100%)]'
  ];
  const insightToneClasses = [
    'border-indigo-300 bg-[linear-gradient(155deg,#ffffff_0%,#e5eaff_44%,#dce3ff_100%)]',
    'border-cyan-300 bg-[linear-gradient(155deg,#ffffff_0%,#ddf6ff_46%,#d4f1ff_100%)]',
    'border-emerald-300 bg-[linear-gradient(155deg,#ffffff_0%,#ddf8ef_46%,#d0f0e4_100%)]'
  ];
  const benefitToneClasses = [
    'border-sky-200 bg-[linear-gradient(180deg,#ffffff_0%,#eef8ff_100%)]',
    'border-amber-200 bg-[linear-gradient(180deg,#ffffff_0%,#fff2d6_100%)]',
    'border-cyan-200 bg-[linear-gradient(180deg,#ffffff_0%,#e9f7ff_100%)]',
    'border-emerald-200 bg-[linear-gradient(180deg,#ffffff_0%,#e9f8f1_100%)]'
  ];
  const accentStripeStyles = [
    { background: 'linear-gradient(90deg,#2156ff_0%,#39c6ff_100%)' },
    { background: 'linear-gradient(90deg,#18c87a_0%,#7ae9bf_100%)' },
    { background: 'linear-gradient(90deg,#ffb347_0%,#ffd18b_100%)' },
    { background: 'linear-gradient(90deg,#7c55ff_0%,#b58bff_100%)' }
  ] as const;
  const iconToneStyles = [
    { background: 'linear-gradient(145deg,#1f58d4_0%,#3aaeff_100%)', color: '#ffffff', boxShadow: '0 10px 20px rgba(26,95,201,0.28)' },
    { background: 'linear-gradient(145deg,#13b97a_0%,#65e3bb_100%)', color: '#ffffff', boxShadow: '0 10px 20px rgba(19,161,110,0.24)' },
    { background: 'linear-gradient(145deg,#f19e33_0%,#ffca79_100%)', color: '#ffffff', boxShadow: '0 10px 20px rgba(215,139,41,0.22)' },
    { background: 'linear-gradient(145deg,#6a56ff_0%,#a789ff_100%)', color: '#ffffff', boxShadow: '0 10px 20px rgba(99,83,211,0.24)' }
  ] as const;
  const heroPanelStyle = {
    borderColor: '#76abff',
    background:
      'radial-gradient(circle at 10% 10%, rgba(119, 215, 255, 0.38), transparent 38%), radial-gradient(circle at 80% 12%, rgba(151, 120, 255, 0.26), transparent 35%), radial-gradient(circle at 12% 82%, rgba(98, 220, 180, 0.2), transparent 36%), linear-gradient(145deg, #fefeff 0%, #dbe9ff 46%, #d2e6ff 100%)',
    boxShadow: '0 28px 50px rgba(20, 84, 182, 0.2)'
  } as const;
  const heroPanelInteractiveStyle = {
    ...heroPanelStyle,
    '--spotlight-x': '50%',
    '--spotlight-y': '24%'
  } as CSSProperties;
  const heroTrustCardStyle = {
    borderColor: '#79aef9',
    background:
      'radial-gradient(circle at 84% 6%, rgba(129, 215, 255, 0.3), transparent 35%), radial-gradient(circle at 8% 92%, rgba(255, 198, 140, 0.22), transparent 38%), linear-gradient(180deg, #ffffff 0%, #d9eaff 100%)',
    boxShadow: '0 28px 54px rgba(22, 82, 173, 0.24)'
  } as const;
  const heroTrustHeaderStyle = {
    background: 'linear-gradient(140deg, #0f3f90 0%, #1f66d8 52%, #7c55ff 100%)',
    borderBottomColor: '#8eb8ff'
  } as const;
  const proofStripStyle = {
    borderColor: '#7faef4',
    background:
      'radial-gradient(circle at 90% 10%, rgba(120, 211, 255, 0.26), transparent 36%), radial-gradient(circle at 8% 86%, rgba(255, 193, 122, 0.2), transparent 34%), radial-gradient(circle at 45% 0%, rgba(138, 120, 255, 0.18), transparent 38%), linear-gradient(145deg, #ffffff 0%, #d8eaff 56%, #cee4ff 100%)',
    boxShadow: '0 22px 42px rgba(19, 88, 183, 0.2)'
  } as const;
  const proofCardStyles = [
    { borderColor: '#5a97ff', background: 'linear-gradient(180deg, #ffffff 0%, #d2e5ff 100%)' },
    { borderColor: '#4ac4f6', background: 'linear-gradient(180deg, #ffffff 0%, #d4f1ff 100%)' },
    { borderColor: '#f2b463', background: 'linear-gradient(180deg, #ffffff 0%, #ffe8c2 100%)' }
  ] as const;
  const serviceAuraStyles = [
    {
      background:
        'radial-gradient(circle at 88% 12%, rgba(62, 163, 255, 0.24), transparent 40%), radial-gradient(circle at 10% 88%, rgba(108, 225, 255, 0.2), transparent 38%)'
    },
    {
      background:
        'radial-gradient(circle at 84% 16%, rgba(34, 203, 173, 0.22), transparent 42%), radial-gradient(circle at 16% 84%, rgba(119, 228, 255, 0.2), transparent 38%)'
    },
    {
      background:
        'radial-gradient(circle at 86% 12%, rgba(255, 190, 102, 0.24), transparent 42%), radial-gradient(circle at 14% 82%, rgba(255, 145, 111, 0.18), transparent 38%)'
    }
  ] as const;
  const trustProjectToneStyles = [
    { borderColor: '#8ab4ff', background: 'linear-gradient(180deg,#f6fbff 0%,#e7f1ff 100%)' },
    { borderColor: '#7ecfe7', background: 'linear-gradient(180deg,#f5fdff 0%,#e4f8ff 100%)' },
    { borderColor: '#9cb2ff', background: 'linear-gradient(180deg,#f7f8ff 0%,#e9ecff 100%)' }
  ] as const;
  const heroMicroSignals =
    locale === 'de'
      ? ['Scope in 30 Min', 'QA-Gates sichtbar', 'Go-live ohne Blindflug']
      : ['Scope in 30 min', 'QA gates visible', 'Go-live without guesswork'];
  const heroPrismSignals =
    locale === 'de'
      ? [
          { label: 'Pipeline-Fokus', detail: 'Mehr qualifizierte Erstgespräche', tone: 'from-blue-600 via-cyan-500 to-sky-400' },
          { label: 'Delivery-Sicherheit', detail: 'Scope, QA und Launch sauber verzahnt', tone: 'from-emerald-600 via-teal-500 to-cyan-400' },
          { label: 'Technische Autorität', detail: 'Engineering-Proof statt Marketing-Floskeln', tone: 'from-indigo-600 via-violet-500 to-blue-500' }
        ]
      : [
          { label: 'Pipeline focus', detail: 'More qualified first meetings', tone: 'from-blue-600 via-cyan-500 to-sky-400' },
          { label: 'Delivery certainty', detail: 'Scope, QA, and launch stay aligned', tone: 'from-emerald-600 via-teal-500 to-cyan-400' },
          { label: 'Technical authority', detail: 'Engineering proof over marketing fluff', tone: 'from-indigo-600 via-violet-500 to-blue-500' }
        ];
  const heroCapabilityTags =
    locale === 'de'
      ? ['UX Funnel Systems', 'Conversion Telemetry', 'Engineering Delivery']
      : ['UX funnel systems', 'Conversion telemetry', 'Engineering delivery'];
  const mobileDockMeta = {
    label: locale === 'de' ? 'Schneller Erstkontakt' : 'Fast first contact',
    secondary: locale === 'de' ? 'Cases' : 'Cases'
  };
  const footerSignals =
    locale === 'de'
      ? ['Next.js Delivery', 'CRO-Fokus', 'Core Web Vitals']
      : ['Next.js delivery', 'CRO focus', 'Core Web Vitals'];
  const proofMarqueeItems =
    locale === 'de'
      ? [...t.trust.logos, 'QA Gates', 'Telemetry', 'Speed Budget', 'Operational Readiness']
      : [...t.trust.logos, 'QA gates', 'Telemetry', 'Speed budget', 'Operational readiness'];
  const servicePreviewLabel = locale === 'de' ? 'Delivery Preview Rail' : 'Delivery preview rail';
  const servicesSectionStyle = {
    borderColor: '#7daff4',
    background:
      'radial-gradient(circle at 12% 10%, rgba(117, 206, 255, 0.28), transparent 40%), radial-gradient(circle at 88% 14%, rgba(139, 118, 255, 0.18), transparent 40%), linear-gradient(180deg, #ffffff 0%, #deedff 100%)',
    boxShadow: '0 24px 46px rgba(24, 91, 183, 0.17)'
  } as const;
  const benefitsSectionStyle = {
    borderColor: '#6fc5f2',
    background:
      'radial-gradient(circle at 90% 12%, rgba(73, 212, 255, 0.24), transparent 38%), radial-gradient(circle at 10% 84%, rgba(255, 193, 126, 0.22), transparent 34%), linear-gradient(180deg, #ffffff 0%, #d9f3ff 100%)',
    boxShadow: '0 24px 44px rgba(20, 121, 171, 0.16)'
  } as const;
  const trustSectionStyle = {
    borderColor: '#7baff8',
    background:
      'radial-gradient(circle at 22% 16%, rgba(111, 201, 255, 0.22), transparent 42%), radial-gradient(circle at 88% 84%, rgba(118, 227, 186, 0.22), transparent 36%), linear-gradient(180deg, #f7fbff 0%, #dbe9ff 100%)',
    boxShadow: '0 24px 46px rgba(22, 86, 173, 0.17)'
  } as const;
  const insightsSectionStyle = {
    borderColor: '#4f7ed8',
    background:
      'radial-gradient(circle at 86% 14%, rgba(73, 205, 255, 0.34), transparent 42%), radial-gradient(circle at 12% 88%, rgba(104, 226, 187, 0.24), transparent 38%), radial-gradient(circle at 52% 2%, rgba(154, 119, 255, 0.28), transparent 36%), linear-gradient(160deg, #0a1d3f 0%, #102b5f 52%, #153a7b 100%)',
    boxShadow: '0 28px 50px rgba(8, 29, 66, 0.42)'
  } as const;
  const processSectionStyle = {
    borderColor: '#79aff5',
    background:
      'radial-gradient(circle at 12% 10%, rgba(120, 207, 255, 0.2), transparent 36%), linear-gradient(180deg, #ffffff 0%, #dfecff 100%)',
    boxShadow: '0 22px 42px rgba(20, 92, 179, 0.15)'
  } as const;
  const contactSectionStyle = {
    borderColor: '#79b0f8',
    background:
      'radial-gradient(circle at 88% 10%, rgba(90, 201, 255, 0.24), transparent 38%), radial-gradient(circle at 12% 88%, rgba(255, 196, 133, 0.2), transparent 34%), radial-gradient(circle at 55% 12%, rgba(130, 118, 255, 0.18), transparent 34%), linear-gradient(180deg, #ffffff 0%, #dcecff 100%)',
    boxShadow: '0 26px 48px rgba(22, 91, 181, 0.18)'
  } as const;
  const backgroundFloatPrimary = { transform: `translate3d(0, ${scrollProgress * 30}px, 0)` } as CSSProperties;
  const backgroundFloatSecondary = { transform: `translate3d(0, ${scrollProgress * -22}px, 0)` } as CSSProperties;
  const showSectionRail = scrollProgress > 0.08;

  return (
    <div className="home-redesign-shell relative overflow-x-clip bg-[#e8f1ff] text-ink-900">
      <div className="pointer-events-none fixed inset-x-0 top-0 z-40 h-[3px]">
        <div
          className="h-full origin-left bg-[linear-gradient(90deg,#2052bc_0%,#2a79ff_55%,#2bc7ff_100%)] shadow-[0_0_16px_rgba(43,132,255,0.45)] transition-transform duration-150"
          style={{ transform: `scaleX(${scrollProgress})` }}
        />
      </div>
      <div
        className="home-ambient-flow pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_88%_-4%,_rgba(39,113,255,0.42),_transparent_33%),radial-gradient(circle_at_8%_18%,_rgba(37,192,255,0.36),_transparent_34%),radial-gradient(circle_at_65%_5%,_rgba(146,112,255,0.3),_transparent_36%),radial-gradient(circle_at_35%_98%,_rgba(16,132,255,0.34),_transparent_42%),radial-gradient(circle_at_92%_78%,_rgba(255,196,132,0.26),_transparent_32%),radial-gradient(circle_at_12%_72%,_rgba(92,216,179,0.26),_transparent_36%),linear-gradient(180deg,#f7faff_0%,#e6f1ff_46%,#d7e8ff_100%)] transition-transform duration-300"
        style={backgroundFloatPrimary}
      />
      <div
        className="home-ambient-flow home-ambient-flow--secondary pointer-events-none absolute inset-x-0 top-[260px] -z-10 h-[760px] bg-[radial-gradient(ellipse_at_center,_rgba(58,170,255,0.34),_transparent_72%)] transition-transform duration-300"
        style={backgroundFloatSecondary}
      />

      <header className="home-header-glass sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
        <div className={cn(pageShell, 'flex h-16 items-center justify-between gap-4')} style={pageShellStyle}>
          <Link href={localeRoot} className="inline-flex items-center gap-2" aria-label="ivo-tech homepage">
            <Image
              src="/assets/logo/ivo-logo__mark-core__premium__dark__v1.1.0.svg"
              alt=""
              width={24}
              height={24}
              priority
              className="h-6 w-6"
            />
            <span className="font-display text-base font-semibold tracking-tight text-ink-900">ivo-tech</span>
          </Link>
          <nav aria-label="Primary" className="hidden text-[15px] text-ink-700 md:flex md:items-center">
            {primaryNavLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => handleNavClick(link.href)}
                className={cn(
                  'nav-link-premium inline-flex py-1 font-medium transition-colors duration-200 hover:text-brand-800',
                  'text-ink-800'
                )}
                style={index < primaryNavLinks.length - 1 ? { marginRight: '1.25rem' } : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <HomeMobileNav
              locale={locale}
              links={primaryNavLinks}
              ctaLabel={hero.ctaPrimary}
              heroVariant={heroVariant}
              activeSection={activeSection}
              onLinkClick={handleNavClick}
            />
            <div className="hidden md:block">
              <Button asChild variant="ghost" size="sm">
                <Link href={locale === 'de' ? '/en' : '/'}>{locale === 'de' ? 'EN' : 'DE'}</Link>
              </Button>
            </div>
            <div className="hidden md:block">
              <Button
                asChild
                size="sm"
                className="motion-cta-lift bg-[linear-gradient(135deg,#15337d_0%,#1c52d6_58%,#2a7dff_100%)] shadow-[0_8px_20px_rgba(28,82,214,0.28)] hover:bg-[linear-gradient(135deg,#102863_0%,#1848be_58%,#246be2_100%)]"
              >
                  <a href={contactPathWithSource} onClick={handleHeroPrimaryClick}>
                    {hero.ctaPrimary}
                  </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <aside
        aria-label={locale === 'de' ? 'Abschnitts-Navigation' : 'Section navigation'}
        className={cn(
          'home-section-rail fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 transition-opacity duration-300 xl:block',
          showSectionRail ? 'pointer-events-none opacity-100' : 'pointer-events-none opacity-0'
        )}
      >
        <div
          className={cn(
            'rounded-2xl border border-brand-200/80 bg-white/78 p-2.5 shadow-[0_16px_30px_rgba(20,86,178,0.18)] backdrop-blur-md',
            showSectionRail ? 'pointer-events-auto' : 'pointer-events-none'
          )}
        >
          <div className="space-y-2">
            {sectionNavLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => handleNavClick(link.href)}
                  aria-label={link.label}
                  className={cn('home-section-rail-item group', isActive ? 'home-section-rail-item--active' : '')}
                >
                  <span className="home-section-rail-dot" />
                  <span className="home-section-rail-text">{link.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      </aside>

      <main id="main-content" className="pb-24 md:pb-0">
        <section className={cn(pageShell, 'relative py-12 md:py-16 xl:py-20')} style={pageShellStyle} aria-labelledby="hero-title">
          <div className="pointer-events-none absolute -right-6 top-6 hidden h-60 w-60 rounded-full bg-[conic-gradient(from_120deg,rgba(91,196,255,0.55),rgba(109,120,255,0.35),rgba(255,191,123,0.45),rgba(91,196,255,0.55))] blur-3xl opacity-60 md:block" />
          <div className="pointer-events-none absolute -left-8 bottom-0 hidden h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(98,220,180,0.35),transparent_70%)] blur-2xl md:block" />
          <div className="grid items-start gap-8 md:grid-cols-2 xl:gap-12">
            <div
              ref={heroPanelRef}
              className="motion-section-reveal motion-trail motion-edge-sweep relative space-y-7 rounded-[28px] border p-6 transition duration-300 will-change-transform hover:[transform:perspective(1400px)_rotateX(1.2deg)_rotateY(-1.2deg)_translateY(-6px)] motion-safe:animate-fade-up md:p-7"
              style={heroPanelInteractiveStyle}
              onMouseMove={handleHeroPanelPointerMove}
              onMouseLeave={handleHeroPanelPointerLeave}
            >
              <div className="absolute right-4 top-4 hidden rounded-full border border-indigo-200/80 bg-white/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-700 shadow-sm md:inline-flex">
                Delivery cockpit
              </div>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[28px] opacity-45"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(42,108,206,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(42,108,206,0.14) 1px, transparent 1px)',
                  backgroundSize: '28px 28px'
                }}
              />
              <div aria-hidden="true" className="hero-panel-spotlight pointer-events-none absolute inset-0 rounded-[28px]" />
              <div className="motion-depth-drift pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-cyan-300/30 blur-3xl" />
              <div className="motion-depth-drift pointer-events-none absolute right-16 top-28 h-24 w-24 rounded-full bg-violet-300/30 blur-3xl" />
              <div className="motion-depth-drift pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-blue-300/30 blur-3xl" />
              <Badge
                variant="accent"
                className="w-fit border-brand-200 bg-[linear-gradient(90deg,#eef2ff_0%,#dcf3ff_55%,#e7fff5_100%)] text-brand-800"
              >
                {hero.badge}
              </Badge>
              <div className="flex flex-wrap gap-2">
                {heroCapabilityTags.map((tag, index) => (
                  <span
                    key={tag}
                    className="motion-chip-pop inline-flex items-center rounded-full border border-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white shadow-[0_8px_18px_rgba(17,58,130,0.25)]"
                    style={accentStripeStyles[index % accentStripeStyles.length]}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h1
                id="hero-title"
                className="max-w-[18ch] font-display text-balance font-semibold leading-[1.02] tracking-tight text-ink-900"
                style={{ fontSize: 'clamp(2.35rem, 4.8vw, 4.05rem)' }}
              >
                {hero.title}
              </h1>
              <p className="max-w-[62ch] text-pretty text-[1.05rem] leading-relaxed text-ink-700 md:text-[1.2rem]">{hero.description}</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="group motion-cta-lift bg-[linear-gradient(135deg,#15337d_0%,#1c52d6_55%,#2d79ff_100%)] shadow-[0_10px_24px_rgba(28,82,214,0.28)] hover:bg-[linear-gradient(135deg,#102863_0%,#1947bd_55%,#2869e5_100%)]"
                >
                  <a href={contactPathWithSource} onClick={handleHeroPrimaryClick}>
                    {hero.ctaPrimary}
                    <ArrowRight className="motion-arrow-nudge ml-2 h-4 w-4 transition-transform duration-200" aria-hidden="true" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="motion-cta-lift border-brand-300 bg-[linear-gradient(180deg,#ffffff_0%,#edf5ff_100%)] text-ink-900 hover:border-brand-500 hover:bg-[linear-gradient(180deg,#fdfefe_0%,#e0edff_100%)]"
                >
                  <Link href={caseStudiesPathWithSource} onClick={handleHeroSecondaryClick}>
                    {hero.ctaSecondary}
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="motion-cta-lift border border-cyan-200 bg-[linear-gradient(180deg,#ffffff_0%,#e7f7ff_100%)] text-cyan-900 hover:border-cyan-300 hover:bg-[linear-gradient(180deg,#ffffff_0%,#dcf3ff_100%)]"
                >
                  <Link href={playbooksPathWithSource} onClick={handleHeroTertiaryClick}>
                    {hero.ctaTertiary}
                  </Link>
                </Button>
              </div>
              <div className="prism-pill-grid grid gap-2.5">
                {heroPrismSignals.map((signal, index) => (
                  <div
                    key={signal.label}
                    className={cn(
                      'prism-pill group relative overflow-hidden rounded-xl border border-white/75 bg-white/80 px-3.5 py-2.5 shadow-sm',
                      index === 2 ? 'hidden sm:block' : ''
                    )}
                  >
                    <div className={`pointer-events-none absolute inset-0 bg-gradient-to-r ${signal.tone} opacity-[0.12] transition-opacity duration-300 group-hover:opacity-[0.2]`} />
                    <div className="relative">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-900">{signal.label}</p>
                        <span className="h-1.5 w-9 rounded-full" style={accentStripeStyles[index % accentStripeStyles.length]} />
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-ink-700">{signal.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-ink-700">
                {hero.highlights.map((item) => (
                  <span
                    key={item}
                    className="motion-chip-pop inline-flex items-center gap-2 rounded-full bg-[linear-gradient(180deg,#ffffff_0%,#eef5ff_100%)] px-3 py-2 shadow-sm ring-1 ring-brand-100 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgba(34,114,219,0.2)]"
                  >
                    <CircleCheckBig className="h-4 w-4 text-brand-600" aria-hidden="true" />
                    {item}
                  </span>
                ))}
              </div>
              <div className="grid gap-2.5 pt-1 sm:grid-cols-3">
                {heroSignals.map((signal) => (
                  <div
                    key={signal.label}
                    className="motion-chip-pop rounded-xl border border-brand-200 bg-[linear-gradient(180deg,#ffffff_0%,#e8f3ff_100%)] px-3 py-2.5 text-xs leading-relaxed text-ink-700 shadow-[0_8px_18px_rgba(36,112,214,0.08)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_26px_rgba(38,122,226,0.16)]"
                  >
                    <signal.icon className="mb-1 h-3.5 w-3.5 text-brand-700" aria-hidden="true" />
                    {signal.label}
                  </div>
                ))}
              </div>
              <div className="hidden gap-2 pt-1 sm:grid sm:grid-cols-2">
                {trustLogoIcons.map((chip) => (
                  <span
                    key={chip.label}
                    className="motion-chip-pop group inline-flex items-center gap-2 rounded-full border border-cyan-200/70 bg-[linear-gradient(180deg,#ffffff_0%,#e6f8ff_70%,#e6fff5_100%)] px-3 py-1 text-[11px] font-medium text-cyan-900 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-cyan-300"
                  >
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br ${chip.bg} text-[10px] font-semibold uppercase text-white shadow-[0_6px_14px_rgba(15,61,128,0.25)]`}
                    >
                      {chip.badge}
                    </span>
                    {chip.label}
                  </span>
                ))}
              </div>
              <div className="hidden rounded-xl border border-indigo-200/80 bg-[linear-gradient(145deg,#f6f8ff_0%,#e7efff_100%)] px-3 py-2.5 sm:block">
                <div className="mb-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-700">
                  <span>{locale === 'de' ? 'Outcome Pulse' : 'Outcome pulse'}</span>
                  <span>{locale === 'de' ? 'Live' : 'Live'}</span>
                </div>
                <div className="grid gap-2 sm:grid-cols-3">
                  {heroMicroSignals.map((signal, index) => (
                    <div key={signal} className="rounded-lg border border-indigo-100 bg-white/90 px-2.5 py-2 text-[11px] text-ink-700">
                      <span className="mb-1 block h-1.5 w-8 rounded-full" style={accentStripeStyles[index % accentStripeStyles.length]} />
                      {signal}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Card
              className="motion-section-reveal motion-section-reveal--delay-1 motion-edge-sweep relative w-full overflow-hidden border ring-1 ring-brand-100 transition duration-300 will-change-transform hover:[transform:perspective(1400px)_rotateX(1.6deg)_rotateY(-2deg)_translateY(-8px)] hover:shadow-[0_30px_56px_rgba(24,89,183,0.24)] motion-safe:animate-fade-up lg:max-w-[620px] lg:justify-self-end"
              style={heroTrustCardStyle}
            >
                <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#9fb8ff_0%,#4169ff_52%,#233bb7_100%)]" />
                <CardHeader className="relative overflow-hidden border-b pb-4 text-slate-50" style={heroTrustHeaderStyle}>
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,_rgba(120,225,255,0.4),_transparent_40%),radial-gradient(circle_at_84%_85%,_rgba(198,228,255,0.35),_transparent_42%)]" />
                  <CardTitle className="relative text-slate-50">{hero.trustNote}</CardTitle>
                  <CardDescription className="relative text-slate-100/90">
                    {locale === 'de' ? 'Ausgewählte Qualitätssignale auf einen Blick.' : 'Selected quality signals at a glance.'}
                  </CardDescription>
                </CardHeader>
              <CardContent className="space-y-4 text-sm text-ink-700">
                  <div className="grid gap-3 sm:grid-cols-3">
                    {t.trust.metrics.map((metric, index) => (
                      <div
                        key={metric.label}
                        className="motion-chip-pop rounded-xl border p-3"
                        style={proofCardStyles[index % proofCardStyles.length]}
                      >
                        <p className="font-display text-xl font-semibold text-ink-900">{metric.value}</p>
                        <p className="mt-1 text-xs text-ink-500">{metric.label}</p>
                      </div>
                    ))}
                  </div>
                  <p className="rounded-xl border border-dashed border-slate-300 bg-white p-3 text-xs leading-relaxed text-ink-500">
                    {locale === 'de'
                      ? `${featuredInsights.length} aktuelle Insights als technische Vertrauenssignale integriert.`
                      : `${featuredInsights.length} current engineering insights integrated as trust assets.`}
                  </p>
                  <div className="hidden rounded-xl border border-brand-200/70 bg-brand-50/70 p-3 transition duration-300 hover:border-brand-300 hover:bg-brand-50 sm:block">
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
                      {locale === 'de' ? 'Positioning Signal' : 'Positioning signal'}
                    </p>
                    <p className="mt-1.5 text-sm text-ink-700">
                      {locale === 'de'
                        ? 'Build + Stabilize + Accelerate als klares Angebotssystem statt losem Portfolio.'
                        : 'Build + Stabilize + Accelerate as a clear offer system instead of a loose portfolio.'}
                    </p>
                  </div>
                <div className="relative hidden overflow-hidden rounded-xl border border-sky-200 bg-[linear-gradient(145deg,#0f2f63_0%,#1551a9_55%,#1e6ae0_100%)] p-3 text-slate-100 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(19,68,156,0.32)] md:block">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,_rgba(73,218,255,0.4),_transparent_36%),radial-gradient(circle_at_85%_80%,_rgba(190,230,255,0.35),_transparent_40%)]" />
                    <p className="relative text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100">
                      {locale === 'de' ? 'System Blueprint' : 'System blueprint'}
                    </p>
                    <p className="relative mt-1 text-xs leading-relaxed text-slate-100/90">
                      {locale === 'de'
                        ? 'Discovery -> UX-Funnel -> Build -> QA -> Launch als durchgaengige Delivery-Kette.'
                        : 'Discovery -> UX funnel -> Build -> QA -> Launch as one continuous delivery chain.'}
                    </p>
                    <div className="relative mt-2 flex gap-1.5">
                      <span className="h-1.5 w-9 rounded-full bg-cyan-200/90" />
                      <span className="h-1.5 w-7 rounded-full bg-sky-200/80" />
                      <span className="h-1.5 w-6 rounded-full bg-indigo-200/70" />
                      <span className="h-1.5 w-8 rounded-full bg-blue-100/70" />
                    </div>
                </div>
                <div className="space-y-3 rounded-xl border border-brand-200 bg-[linear-gradient(155deg,#ffffff_0%,#d9ecff_55%,#d0e6ff_100%)] p-3.5 shadow-[0_14px_30px_rgba(22,92,182,0.14)]">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-700">
                      {locale === 'de' ? 'Signal Stack' : 'Signal stack'}
                    </p>
                    <p className="text-xs leading-relaxed text-ink-700">
                      {locale === 'de'
                        ? 'Die gleichen Qualitätshebel laufen über Delivery, QA und Betrieb.'
                        : 'The same quality levers run through delivery, QA, and operations.'}
                    </p>
                  </div>
                  {trustProjects[0] ? (
                    <div className="relative h-28 overflow-hidden rounded-xl border border-slate-200 bg-slate-900 shadow-[0_14px_28px_rgba(12,39,83,0.28)]">
                      <video
                        className="hero-case-preview-media h-full w-full object-cover opacity-90 transition duration-500"
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        poster={trustProjects[0].thumbSrc}
                      >
                        <source src="/assets/video/hero-case-teaser.webm" type="video/webm" />
                        <source src="/assets/video/hero-case-teaser.mp4" type="video/mp4" />
                      </video>
                      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(7,25,57,0.74)_0%,rgba(10,45,95,0.42)_52%,rgba(31,102,216,0.26)_100%)]" />
                      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 px-2.5 py-2 text-[11px] text-slate-100">
                        <span className="rounded-full border border-cyan-200/40 bg-cyan-200/18 px-2 py-0.5">{locale === 'de' ? 'Live Preview' : 'Live preview'}</span>
                        <span className="font-medium">{trustProjects[0].title[locale]}</span>
                      </div>
                    </div>
                  ) : null}
                  <div className="grid gap-2 sm:grid-cols-3">
                    <span className="rounded-lg border border-blue-200 bg-white/80 px-2.5 py-1.5 text-xs font-medium text-blue-800">
                      {locale === 'de' ? 'Scope clarity' : 'Scope clarity'}
                    </span>
                    <span className="rounded-lg border border-cyan-200 bg-white/80 px-2.5 py-1.5 text-xs font-medium text-cyan-800">
                      {locale === 'de' ? 'QA gates' : 'QA gates'}
                    </span>
                    <span className="rounded-lg border border-indigo-200 bg-white/80 px-2.5 py-1.5 text-xs font-medium text-indigo-800">
                      {locale === 'de' ? 'Ops readiness' : 'Ops readiness'}
                    </span>
                  </div>
                  <div className="space-y-2 rounded-xl border border-blue-200/80 bg-white/85 px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <Layers3 className="h-4 w-4 text-blue-700" aria-hidden="true" />
                      <p className="text-xs text-ink-700">{locale === 'de' ? 'Modulare Komponenten als Baseline' : 'Modular components as baseline'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Workflow className="h-4 w-4 text-cyan-700" aria-hidden="true" />
                      <p className="text-xs text-ink-700">{locale === 'de' ? 'Eindeutige Prozess- und Handover-Kette' : 'Explicit process and handover chain'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-indigo-700" aria-hidden="true" />
                      <p className="text-xs text-ink-700">{locale === 'de' ? 'Messbare Qualität statt subjektiver Einschätzung' : 'Measured quality over subjective opinion'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className={cn(pageShell, 'pb-8 md:pb-10')} style={pageShellStyle} aria-label={locale === 'de' ? 'Delivery Spectrum' : 'Delivery spectrum'}>
          <div className="spectrum-divider rounded-2xl border border-brand-200/70 px-3 py-3 md:px-4">
            <div className="grid gap-2 sm:grid-cols-3">
              {heroPrismSignals.map((signal, index) => (
                <div key={`divider-${signal.label}`} className="spectrum-divider-card motion-chip-pop rounded-xl border border-white/70 bg-white/75 px-3 py-2.5">
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-800">{signal.label}</p>
                    <span className="h-1.5 w-8 rounded-full" style={accentStripeStyles[index % accentStripeStyles.length]} />
                  </div>
                  <p className="text-xs leading-relaxed text-ink-700">{signal.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={cn(pageShell, 'pb-8 md:pb-12')} style={pageShellStyle} aria-label={locale === 'de' ? 'Proof Highlights' : 'Proof highlights'}>
          <div className="section-aurora-border rounded-3xl border p-4 ring-1 ring-brand-100 md:p-6" style={proofStripStyle}>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-brand-200/70 pb-4 text-xs">
              <span className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-700">
                {locale === 'de' ? 'Trusted Context' : 'Trusted context'}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {trustLogoIcons.map((chip) => (
                  <span
                    key={chip.label}
                    className="inline-flex items-center gap-2 rounded-full border border-brand-200/70 bg-[linear-gradient(180deg,#ffffff_0%,#edf6ff_70%,#eefdf8_100%)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-700 shadow-sm"
                  >
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br ${chip.bg} text-[10px] font-semibold uppercase text-white shadow-[0_6px_14px_rgba(15,61,128,0.25)]`}
                    >
                      {chip.badge}
                    </span>
                    {chip.label}
                  </span>
                ))}
              </div>
            </div>
          <div className="home-marquee mt-4">
            <div className="home-marquee-track">
              {[...proofMarqueeItems, ...proofMarqueeItems].map((item, index) => (
                <span key={`${item}-${index}`} className="home-marquee-chip">
                  {item}
                </span>
              ))}
            </div>
          </div>
            <div className="brand-mark-rail mt-4 grid gap-2 sm:grid-cols-3">
              {proofBrandMarks.map((mark, index) => (
                <div
                  key={mark.label}
                  className="brand-mark-chip motion-chip-pop relative overflow-hidden rounded-xl border border-brand-200/70 bg-white/80 px-3 py-2.5 shadow-sm"
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-[0.16]"
                    style={accentStripeStyles[index % accentStripeStyles.length]}
                  />
                  <div className="relative flex items-center gap-2.5">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-brand-100 bg-white/90">
                      <Image src={mark.src} alt="" width={20} height={20} className="h-5 w-5 object-contain" />
                    </span>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-800">
                        {locale === 'de' ? 'Proof Module' : 'Proof module'}
                      </p>
                      <p className="text-xs text-ink-700">{mark.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
              <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="motion-edge-sweep rounded-xl border p-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_22px_rgba(26,99,196,0.14)]" style={proofCardStyles[0]}>
                  <p className="font-display text-2xl font-semibold text-ink-900">{t.trust.metrics[0]?.value}</p>
                  <p className="mt-1 text-xs text-ink-600">{t.trust.metrics[0]?.label}</p>
                </div>
                <div className="motion-edge-sweep rounded-xl border p-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_22px_rgba(19,150,197,0.14)]" style={proofCardStyles[1]}>
                  <p className="font-display text-2xl font-semibold text-ink-900">{t.trust.metrics[1]?.value}</p>
                  <p className="mt-1 text-xs text-ink-600">{t.trust.metrics[1]?.label}</p>
                </div>
                <div className="motion-edge-sweep rounded-xl border p-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_22px_rgba(42,122,219,0.14)]" style={proofCardStyles[2]}>
                  <p className="font-display text-2xl font-semibold text-ink-900">{locale === 'de' ? '3+ Segmente' : '3+ segments'}</p>
                  <p className="mt-1 text-xs text-ink-600">{locale === 'de' ? 'B2B-Kontexte aus realer Delivery' : 'B2B contexts from real delivery'}</p>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-xl border border-dashed border-brand-200 bg-[linear-gradient(180deg,white_0%,#edf5ff_100%)] p-4">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(114,184,255,0.24),transparent_44%),radial-gradient(circle_at_8%_86%,rgba(126,234,191,0.2),transparent_42%)]" />
                <p className="text-sm leading-relaxed text-ink-700">“{primaryTestimonial.quote}”</p>
                <p className="mt-2 text-xs text-ink-500">{primaryTestimonial.attribution}</p>
                <p className="mt-3 text-xs text-ink-500">
                  {locale === 'de'
                    ? `Branchenkontext: ${t.trust.logos.join(' · ')}`
                    : `Industry context: ${t.trust.logos.join(' · ')}`}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className={cn(pageShell, 'py-10 md:py-14 xl:py-16')} style={pageShellStyle}>
          <div className={cn(sectionShell, 'section-aurora-border')} style={servicesSectionStyle}>
            <SectionHeading
              eyebrow={t.services.eyebrow}
              title={t.services.title}
              description={t.services.description}
              className="motion-safe:animate-fade-up"
            />
            <div className="project-preview-rail mt-6">
              <div className="mb-2 flex items-center justify-between px-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-700">
                <span>{servicePreviewLabel}</span>
                <span>{locale === 'de' ? 'Live Cases' : 'Live cases'}</span>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {trustProjects.slice(0, 3).map((project, index) => (
                  <Link
                    key={project.id}
                    href={trustProjectHref(project.id)}
                    className="motion-edge-sweep motion-tilt-card group relative h-28 overflow-hidden rounded-xl border border-brand-200 bg-slate-900 shadow-[0_12px_24px_rgba(14,51,116,0.2)] md:h-32"
                    onClick={() => handleTrustProjectClick(project.id)}
                  >
                    <Image
                      src={project.thumbSrc}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 32vw, 100vw"
                      className="object-cover opacity-90 transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(6,28,66,0.7)_0%,rgba(12,51,112,0.42)_58%,rgba(26,98,210,0.24)_100%)]" />
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 px-2.5 py-2 text-[10px] text-slate-100">
                      <span className="line-clamp-1 font-medium">{project.title[locale]}</span>
                      <span
                        className="rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em]"
                        style={accentStripeStyles[index % accentStripeStyles.length]}
                      >
                        {getProjectStatusLabel(project.status, locale)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {t.services.items.map((service, index) => (
                <Card
                  key={service.title}
                  className={cn(
                    'motion-edge-sweep relative h-full overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_32px_rgba(31,106,204,0.16)] motion-safe:animate-fade-up',
                    serviceToneClasses[index % serviceToneClasses.length]
                  )}
                  style={{ animationDelay: `${100 + index * 80}ms` }}
                >
                  <div className="service-card-aura pointer-events-none absolute inset-0" style={serviceAuraStyles[index % serviceAuraStyles.length]} />
                  <div className="absolute inset-x-0 top-0 h-1" style={accentStripeStyles[index % accentStripeStyles.length]} />
                  <CardHeader className="min-h-[170px]">
                    <CardTitle>{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-ink-700">
                    <div className="flex flex-wrap gap-2">
                      {service.bullets.map((bullet) => (
                        <span
                          key={bullet}
                          className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white/80 px-3 py-1 text-xs font-medium text-ink-700 shadow-sm"
                        >
                          <Check className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
                          {bullet}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-ink-500">
                      <span className="h-1.5 w-8 rounded-full bg-brand-200" />
                      {locale === 'de' ? 'Delivery-ready Scope' : 'Delivery-ready scope'}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="benefits" className={cn(pageShell, 'py-10 md:py-14 xl:py-16')} style={pageShellStyle}>
          <div className="section-aurora-border rounded-[28px] border p-6 shadow-soft md:p-9" style={benefitsSectionStyle}>
            <SectionHeading eyebrow={t.benefits.eyebrow} title={t.benefits.title} description={t.benefits.description} className="motion-safe:animate-fade-up" />
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {t.benefits.items.map((item, index) => {
                const BenefitIcon = [ShieldCheck, Layers3, Sparkles, Workflow][index] ?? Sparkles;
                return (
                  <Card
                    key={item.title}
                    className={cn(
                      'motion-edge-sweep relative h-full overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_30px_rgba(22,121,185,0.14)] motion-safe:animate-fade-up',
                      benefitToneClasses[index % benefitToneClasses.length]
                    )}
                    style={{ animationDelay: `${100 + index * 80}ms` }}
                  >
                    <div className="absolute inset-x-0 top-0 h-1" style={accentStripeStyles[index % accentStripeStyles.length]} />
                    <CardHeader className="space-y-3">
                      <div
                        className="motion-chip-pop inline-flex h-10 w-10 items-center justify-center rounded-lg"
                        style={iconToneStyles[index % iconToneStyles.length]}
                      >
                        <BenefitIcon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <CardTitle>{item.title}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section id="trust" className={cn(pageShell, 'py-10 md:py-14 xl:py-16')} style={pageShellStyle}>
          <div className="section-aurora-border rounded-[28px] border p-6 shadow-soft md:p-9" style={trustSectionStyle}>
            <SectionHeading eyebrow={t.trust.eyebrow} title={t.trust.title} description={t.trust.description} className="motion-safe:animate-fade-up" />
            <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <Card className="motion-edge-sweep h-full border-brand-100 bg-[linear-gradient(180deg,#ffffff_0%,#edf5ff_100%)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_32px_rgba(27,98,191,0.15)] motion-safe:animate-fade-up">
              <CardHeader>
                <CardTitle>{locale === 'de' ? 'Vertrauenselemente' : 'Trust elements'}</CardTitle>
                <CardDescription>
                  {locale === 'de' ? 'Reale Projekt- und Delivery-Signale aus bestehenden Umsetzungen.' : 'Real project and delivery signals from existing implementations.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {trustProjects.map((project, index) => (
                  <Link
                    key={project.id}
                    href={trustProjectHref(project.id)}
                    className="block rounded-xl border px-3 py-3 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-[0_12px_24px_rgba(31,104,196,0.12)]"
                    style={trustProjectToneStyles[index % trustProjectToneStyles.length]}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-white">
                          <Image src={project.thumbSrc} alt="" fill sizes="40px" className="object-cover" />
                        </span>
                        <p className="line-clamp-1 text-sm font-semibold text-ink-900">{project.title[locale]}</p>
                      </div>
                      <Badge className="shrink-0" variant={project.status === 'live' ? 'accent' : 'neutral'}>
                        {getProjectStatusLabel(project.status, locale)}
                      </Badge>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-ink-600">{project.techLine[locale]}</p>
                  </Link>
                ))}
              </CardContent>
            </Card>

            <Card className="motion-edge-sweep motion-tilt-card h-full bg-[linear-gradient(150deg,#0d1830_0%,#15284f_55%,#1d3d7e_100%)] text-slate-100 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_42px_rgba(14,31,69,0.45)] motion-safe:animate-fade-up">
              <CardHeader>
                <CardTitle className="text-slate-50">{locale === 'de' ? 'Kundenstimme' : 'Client signal'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-base leading-relaxed">“{primaryTestimonial.quote}”</p>
                <p className="text-sm text-slate-300">{primaryTestimonial.attribution}</p>
                {primaryTestimonial.kind !== 'client' ? (
                  <Badge variant="neutral">{locale === 'de' ? 'Kundenfreigaben in Arbeit' : 'Client approvals in progress'}</Badge>
                ) : null}
                <div className="space-y-2 pt-1">
                  {trustEvidence.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noopener noreferrer' : undefined}
                      className="block rounded-xl border border-slate-600 bg-slate-900/35 px-3 py-2 transition duration-300 hover:-translate-y-0.5 hover:border-sky-400/80 hover:bg-slate-900/70"
                      onClick={() => handleTrustEvidenceClick(item.id, item.href)}
                    >
                      <p className="text-sm font-medium text-slate-100">{item.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-300">{item.description}</p>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="lg:col-span-2 grid gap-4 md:grid-cols-2" aria-label={locale === 'de' ? 'Case KPI Snapshots' : 'Case KPI snapshots'}>
              {proofSnapshots.map((snapshot, index) => (
                <Card
                  className="motion-edge-sweep relative h-full border-brand-100 bg-[linear-gradient(180deg,#ffffff_0%,#edf5ff_100%)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_34px_rgba(26,97,190,0.16)] motion-safe:animate-fade-up"
                  key={snapshot.slug}
                >
                  <div className="absolute inset-x-0 top-0 h-1" style={accentStripeStyles[index % accentStripeStyles.length]} />
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{snapshot.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {snapshot.kpis.slice(0, 2).map((kpi) => (
                      <div
                        key={kpi.label}
                        className="rounded-xl border border-brand-100 bg-[linear-gradient(180deg,#ffffff_0%,#e9f4ff_100%)] p-3 transition duration-300 hover:border-brand-200 hover:bg-[linear-gradient(180deg,#ffffff_0%,#e5f1ff_100%)]"
                      >
                        <p className="text-xs uppercase tracking-wide text-ink-500">{kpi.label}</p>
                        <p className="mt-1 font-display text-xl font-semibold text-ink-900">{kpi.value}</p>
                        <p className="mt-1 text-xs text-ink-600">{kpi.note}</p>
                      </div>
                    ))}
                    <Link
                      href={localizePath(`/case-studies/${snapshot.slug}`, locale)}
                      className="inline-flex items-center text-sm font-medium text-brand-700 hover:text-brand-900"
                    >
                      {locale === 'de' ? 'Case im Detail ansehen' : 'View full case'}
                      <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
            </div>
          </div>
        </section>

        <section id="insights" className={cn(pageShell, 'py-10 md:py-14 xl:py-16')} style={pageShellStyle}>
          <div className="section-aurora-border rounded-[28px] border p-6 shadow-soft md:p-9" style={insightsSectionStyle}>
            <SectionHeading
              eyebrow={t.insights.eyebrow}
              title={t.insights.title}
              description={t.insights.description}
              tone="dark"
              className="motion-safe:animate-fade-up"
            />
            <div className="mt-8 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="grid gap-4 md:grid-cols-3">
                {featuredInsights.map((insight, index) => (
                  <Card
                    key={insight.slug}
                    className={cn(
                      'motion-edge-sweep relative h-full transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_34px_rgba(23,120,185,0.14)] motion-safe:animate-fade-up',
                      insightToneClasses[index % insightToneClasses.length]
                    )}
                    style={{ animationDelay: `${100 + index * 80}ms` }}
                  >
                    <div className="absolute inset-x-0 top-0 h-1" style={accentStripeStyles[index % accentStripeStyles.length]} />
                    <CardHeader className="space-y-3 pb-3">
                      <div className="flex items-center justify-between gap-3">
                        <Badge variant="neutral">{insight.category}</Badge>
                        <span className="text-xs text-ink-500">
                          {insight.readMinutes} {t.insights.metaRead}
                        </span>
                      </div>
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                      <CardDescription className="text-sm leading-relaxed">{insight.summary}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Link
                        href={localizePath(`/insights/${insight.slug}`, locale)}
                        className="inline-flex items-center text-sm font-medium text-brand-700 hover:text-brand-900"
                        onClick={() => handleInsightCardClick(insight.slug)}
                      >
                        {locale === 'de' ? 'Insight lesen' : 'Read insight'}
                        <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card className="motion-edge-sweep motion-tilt-card relative h-full overflow-hidden border-brand-200/40 bg-[linear-gradient(145deg,#0c1933_0%,#163063_55%,#1f4a8e_100%)] text-slate-100 transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_50px_rgba(12,31,70,0.45)] motion-safe:animate-fade-up">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(72,205,253,0.35),transparent_42%),radial-gradient(circle_at_82%_84%,rgba(124,85,255,0.32),transparent_40%)]" />
                <div className="absolute inset-x-0 top-0 h-1" style={accentStripeStyles[0]} />
                <CardHeader>
                  <CardTitle className="text-slate-50">{locale === 'de' ? 'Editorial Signal' : 'Editorial signal'}</CardTitle>
                  <CardDescription className="text-slate-300">
                    {locale === 'de'
                      ? 'Engineering-Insights als Vertrauenshebel: klar, konkret, wiederverwendbar im Team.'
                      : 'Engineering insights as a trust lever: clear, concrete, reusable across teams.'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-200">
                  <p className="rounded-xl border border-slate-700 bg-slate-900/40 px-3 py-2">
                    {locale === 'de'
                      ? 'Jeder Insight verlinkt auf Cases oder Services, damit aus Lesen direkt Handlung wird.'
                      : 'Each insight links to cases or services so reading turns into action.'}
                  </p>
                  <p className="rounded-xl border border-slate-700 bg-slate-900/40 px-3 py-2">
                    {locale === 'de'
                      ? 'So wird Thought Leadership zu messbarer Conversion-Unterstuetzung.'
                      : 'This converts thought leadership into measurable conversion support.'}
                  </p>
                  <Button asChild variant="secondary" className="mt-1 w-full border border-cyan-300/40 bg-cyan-100 text-cyan-900 hover:bg-cyan-200 sm:w-auto">
                    <Link href={insightsPathWithSource} onClick={handleInsightsHubClick}>
                      {t.insights.cta}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="process" className={cn(pageShell, 'py-10 md:py-14 xl:py-16')} style={pageShellStyle}>
          <div className={cn(sectionShell, 'section-aurora-border border-brand-100 bg-[linear-gradient(180deg,#ffffff_0%,#edf5ff_100%)]')} style={processSectionStyle}>
            <SectionHeading eyebrow={t.process.eyebrow} title={t.process.title} description={t.process.description} className="motion-safe:animate-fade-up" />
            <div className="process-track mt-7 hidden md:block">
              <div className="process-track-line" />
              <div className="grid gap-3 md:grid-cols-4">
                {t.process.steps.map((step, index) => (
                  <div key={`track-${step.title}`} className="process-track-node rounded-xl border border-brand-200/70 bg-white/80 px-3 py-2 shadow-sm">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold text-white" style={iconToneStyles[index % iconToneStyles.length]}>
                        {index + 1}
                      </span>
                      <span className="h-1.5 w-8 rounded-full" style={accentStripeStyles[index % accentStripeStyles.length]} />
                    </div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-800">
                      {step.title.replace(/^\d+\.\s*/, '')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <ol className="mt-8 grid gap-4 md:grid-cols-2">
              {t.process.steps.map((step, index) => (
                <li key={step.title} className={cn('motion-safe:animate-fade-up')} style={{ animationDelay: `${100 + index * 80}ms` }}>
                  <Card className="motion-edge-sweep relative h-full border-brand-100 bg-[linear-gradient(180deg,#ffffff_0%,#eef5ff_100%)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_32px_rgba(28,104,197,0.14)]">
                    <div className="process-card-glow pointer-events-none absolute inset-0" style={serviceAuraStyles[index % serviceAuraStyles.length]} />
                    <div className="absolute inset-x-0 top-0 h-1" style={accentStripeStyles[index % accentStripeStyles.length]} />
                    <CardHeader className="space-y-2">
                      <div
                        className="motion-chip-pop inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white"
                        style={iconToneStyles[index % iconToneStyles.length]}
                      >
                        {index + 1}
                      </div>
                      <CardTitle>{step.title}</CardTitle>
                      <CardDescription>{step.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="contact" className={cn(pageShell, 'relative py-14 md:py-20 xl:py-24')} style={pageShellStyle}>
          <div className="pointer-events-none absolute -left-10 top-12 hidden h-52 w-52 rounded-full bg-[radial-gradient(circle,rgba(122,220,190,0.34),transparent_70%)] blur-3xl md:block" />
          <div className="pointer-events-none absolute -right-6 bottom-10 hidden h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(121,85,255,0.28),transparent_68%)] blur-3xl md:block" />
          <div className="section-aurora-border rounded-3xl border p-6 shadow-soft md:p-10" style={contactSectionStyle}>
            <SectionHeading eyebrow={t.cta.eyebrow} title={t.cta.title} description={t.cta.description} className="motion-safe:animate-fade-up" />
            <div className="mt-6 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
              <aside className="motion-edge-sweep rounded-2xl border border-brand-200/80 bg-[linear-gradient(165deg,#ffffff_0%,#e9f4ff_58%,#e7fff4_100%)] p-4 shadow-[0_18px_34px_rgba(24,101,190,0.12)] md:p-5">
                <p className="rounded-xl border border-brand-100 bg-white/80 px-4 py-3 text-sm text-ink-700">{t.cta.nextStep}</p>
                <div className="mt-4 space-y-3">
                  {contactSignals.map((signal, index) => (
                    <div key={signal.title} className={cn('motion-chip-pop rounded-xl border border-brand-100 bg-white/85 px-3 py-3', index === 2 ? 'hidden sm:block' : '')}>
                      <span className="mb-2 block h-1.5 w-12 rounded-full" style={accentStripeStyles[index % accentStripeStyles.length]} />
                      <div className="flex items-start gap-2">
                        <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 text-[11px] font-semibold text-brand-700">
                          {index + 1}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-ink-900">{signal.title}</p>
                          <p className="mt-1 text-xs leading-relaxed text-ink-600">{signal.detail}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-lg border border-brand-100/90 bg-[linear-gradient(180deg,#ffffff_0%,#edf5ff_100%)] px-3 py-2.5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-700">
                    {locale === 'de' ? 'Delivery Footprints' : 'Delivery footprints'}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {trustLogoIcons.map((chip) => (
                      <span key={`contact-${chip.label}`} className="motion-chip-pop inline-flex items-center gap-1.5 rounded-full border border-brand-100 bg-white px-2.5 py-1 text-[10px] font-semibold text-ink-700 shadow-sm">
                        <span
                          className={`inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br ${chip.bg} text-[9px] font-semibold uppercase text-white`}
                        >
                          {chip.badge}
                        </span>
                        {chip.label}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                  {t.trust.metrics.map((metric) => (
                    <div key={metric.label} className="rounded-lg border border-brand-100 bg-white/85 px-3 py-2">
                      <p className="font-display text-lg font-semibold text-ink-900">{metric.value}</p>
                      <p className="mt-0.5 text-[11px] text-ink-600">{metric.label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-lg border border-indigo-200/80 bg-[linear-gradient(150deg,#f8faff_0%,#edf3ff_100%)] px-3 py-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-700">
                    {locale === 'de' ? 'Decision Flow' : 'Decision flow'}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-[11px] text-ink-700">
                    <span className="rounded-full bg-white px-2 py-1 ring-1 ring-indigo-100">Brief</span>
                    <span className="h-px flex-1 bg-indigo-200" />
                    <span className="rounded-full bg-white px-2 py-1 ring-1 ring-indigo-100">Scope</span>
                    <span className="h-px flex-1 bg-indigo-200" />
                    <span className="rounded-full bg-white px-2 py-1 ring-1 ring-indigo-100">Kickoff</span>
                  </div>
                </div>
              </aside>

              <div className="contact-form-shell motion-edge-sweep rounded-2xl border border-brand-200/80 bg-[linear-gradient(170deg,#ffffff_0%,#ebf5ff_100%)] p-2 shadow-[0_22px_40px_rgba(21,95,188,0.15)] md:p-3">
                <ContactLeadForm
                  locale={locale}
                  heroVariantDefault={heroVariant}
                  compact
                  labels={{
                    formName: t.cta.formName,
                    formEmail: t.cta.formEmail,
                    formCompany: t.cta.formCompany,
                    formMessage: t.cta.formMessage,
                    formButton: t.cta.formButton,
                    submitting: t.cta.submitting,
                    success: t.cta.success,
                    error: t.cta.error,
                    rateLimited: t.cta.rateLimited,
                    verificationRequired: t.cta.verificationRequired,
                    privacy: t.cta.privacy,
                    schedulerCta: t.cta.schedulerCta,
                    schedulerHint: t.cta.schedulerHint
                  }}
                />
                <p className="mx-3 mb-2 mt-1 flex items-center gap-2 text-sm text-ink-500">
                  <Clock3 className="h-4 w-4" aria-hidden="true" />
                  {t.cta.helper}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="home-mobile-dock fixed inset-x-3 bottom-3 z-40 md:hidden">
        <div className="motion-edge-sweep rounded-2xl border border-brand-300/80 bg-[linear-gradient(145deg,rgba(13,48,116,0.96)_0%,rgba(26,91,205,0.94)_58%,rgba(36,143,255,0.92)_100%)] p-2.5 shadow-[0_22px_38px_rgba(10,41,97,0.42)] backdrop-blur-xl">
          <div className="mb-2 flex items-center justify-between px-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-100/90">
            <span>{mobileDockMeta.label}</span>
            <span className="rounded-full border border-cyan-200/40 bg-cyan-100/20 px-2 py-0.5">{locale === 'de' ? 'Live' : 'Live'}</span>
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <a
              href={contactPathWithSource}
              onClick={handleHeroPrimaryClick}
              className="group inline-flex items-center justify-center rounded-xl bg-[linear-gradient(145deg,#ffffff_0%,#e7f2ff_100%)] px-3 py-2.5 text-sm font-semibold text-brand-900 shadow-[0_10px_20px_rgba(5,39,97,0.18)]"
            >
              {hero.ctaPrimary}
              <ArrowRight className="motion-arrow-nudge ml-1.5 h-4 w-4 transition-transform duration-200" aria-hidden="true" />
            </a>
            <Link
              href={caseStudiesPathWithSource}
              onClick={handleHeroSecondaryClick}
              className="inline-flex items-center justify-center rounded-xl border border-cyan-200/60 bg-cyan-100/20 px-3 py-2.5 text-sm font-semibold text-cyan-50"
            >
              {mobileDockMeta.secondary}
            </Link>
          </div>
        </div>
      </div>

      <footer className="border-t border-brand-100 bg-[linear-gradient(180deg,#ffffff_0%,#edf5ff_100%)]">
        <div className={cn(pageShell, 'py-8')} style={pageShellStyle}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2">
                <Image src="/assets/logo/ivo-logo__mark-core__premium__dark__v1.1.0.svg" alt="" width={22} height={22} className="h-[22px] w-[22px]" />
                <p className="font-display text-lg font-semibold text-ink-900">ivo-tech</p>
              </div>
              <p className="mt-1 text-sm text-ink-700">{t.footer.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {footerSignals.map((signal, index) => (
                  <span
                    key={signal}
                    className="motion-chip-pop inline-flex items-center rounded-full border border-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white shadow-[0_8px_16px_rgba(15,56,124,0.22)]"
                    style={accentStripeStyles[index % accentStripeStyles.length]}
                  >
                    {signal}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-ink-700">
              <a href="mailto:info@ivo-tech.com" className="hover:text-ink-900">
                info@ivo-tech.com
              </a>
              <a href="#hero-title" className="hover:text-ink-900">
                Top
              </a>
              {legalLinks.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-ink-900">
                  {link.label}
                </Link>
              ))}
              <span className="hidden items-center gap-1 md:inline-flex">
                <Handshake className="h-4 w-4 text-brand-600" aria-hidden="true" />
                {locale === 'de' ? 'Remote in Europa' : 'Remote in Europe'}
              </span>
            </div>
          </div>
          <p className="mt-5 text-xs text-ink-500">{t.footer.legal}</p>
        </div>
      </footer>
    </div>
  );
}
