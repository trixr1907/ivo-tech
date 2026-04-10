import type { Locale } from '@/content/copy';

export type PortfolioStatus = 'live' | 'beta' | 'concept';
export type PortfolioTrack = 'professional' | 'maker';

export type ProjectModel = {
  id: string;
  track: PortfolioTrack;
  status: PortfolioStatus;
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
  outcome: Record<Locale, string>;
  stack: string[];
  href: Record<Locale, string>;
  cta: Record<Locale, string>;
  featured?: boolean;
};

export type SocialProofModel = {
  id: string;
  title: Record<Locale, string>;
  evidence: Record<Locale, string>;
  href: Record<Locale, string>;
  external?: boolean;
};

export type TimelineModel = {
  id: string;
  year: string;
  title: Record<Locale, string>;
  detail: Record<Locale, string>;
};

export const PROJECT_MODELS: ProjectModel[] = [
  {
    id: 'configurator-live',
    track: 'maker',
    status: 'live',
    title: {
      de: '3D Konfigurator im Live-Betrieb',
      en: '3D configurator in live operations'
    },
    summary: {
      de: 'Datei Upload, Geometrie Analyse und Preislogik in einem durchgaengigen Browser-Flow.',
      en: 'File upload, geometry analysis, and pricing logic in one continuous browser flow.'
    },
    outcome: {
      de: 'Upload bis Checkout laeuft produktiv und reduziert manuelle Rueckfrage-Schleifen.',
      en: 'Upload-to-checkout runs in production and reduces manual clarification loops.'
    },
    stack: ['Three.js', 'WordPress Plugin', 'WooCommerce', 'Docker'],
    href: {
      de: '/case-studies/configurator-live',
      en: '/en/case-studies/configurator-live'
    },
    cta: {
      de: 'Case Study lesen',
      en: 'Read case study'
    },
    featured: true
  },
  {
    id: 'portfolio-authority',
    track: 'professional',
    status: 'live',
    title: {
      de: 'Authority-first Portfolio Relaunch',
      en: 'Authority-first portfolio relaunch'
    },
    summary: {
      de: 'Von reiner Projektsammlung zu strukturierter Positionierung mit klarer Entscheidungsfuehrung.',
      en: 'From project showcase to structured positioning with clear decision flow.'
    },
    outcome: {
      de: 'Strukturierteres Trust-Signal fuer Hiring- und Collaboration-Entscheider.',
      en: 'Stronger trust signal for hiring and collaboration decision-makers.'
    },
    stack: ['Next.js', 'TypeScript', 'Design Tokens', 'Analytics'],
    href: {
      de: '/case-studies/portfolio-authority-relaunch',
      en: '/en/case-studies/portfolio-authority-relaunch'
    },
    cta: {
      de: 'Case Study lesen',
      en: 'Read case study'
    },
    featured: true
  },
  {
    id: 'voicebot-consent',
    track: 'professional',
    status: 'beta',
    title: {
      de: 'Voicebot Consent Orchestrator',
      en: 'Voicebot consent orchestrator'
    },
    summary: {
      de: 'Mehrstufige Sprach- und Prozessfuehrung fuer nachvollziehbare Einwilligungsablaufe.',
      en: 'Multi-step voice and process flow for auditable consent journeys.'
    },
    outcome: {
      de: 'Klarere Consent-Kette mit besserem Audit-Trail.',
      en: 'Clearer consent chain with stronger audit trail.'
    },
    stack: ['LLM Orchestration', 'FastAPI', 'State Machine'],
    href: {
      de: '/case-studies',
      en: '/en/case-studies'
    },
    cta: {
      de: 'Projektuebersicht',
      en: 'Project overview'
    }
  },
  {
    id: 'sorare-edge',
    track: 'maker',
    status: 'concept',
    title: {
      de: 'Sports Analytics Edge Tool',
      en: 'Sports analytics edge tool'
    },
    summary: {
      de: 'Projektionen, Optimierung und Simulation fuer datengetriebene Lineup-Entscheidungen.',
      en: 'Projection, optimization, and simulation for data-driven lineup decisions.'
    },
    outcome: {
      de: 'Schnelleres Testen von Hypothesen mit klarer Unsicherheitskommunikation.',
      en: 'Faster hypothesis testing with transparent uncertainty communication.'
    },
    stack: ['Python', 'FastAPI', 'Monte Carlo', 'React'],
    href: {
      de: '/projects',
      en: '/en/projects'
    },
    cta: {
      de: 'Roadmap ansehen',
      en: 'View roadmap'
    }
  }
];

export const SOCIAL_PROOF_MODELS: SocialProofModel[] = [
  {
    id: 'proof-live-config',
    title: {
      de: 'Live Referenz im echten Kundenbetrieb',
      en: 'Live reference in real client operations'
    },
    evidence: {
      de: 'Produktiver 3D Datei-zu-Preis-Flow mit Checkout-Handoff.',
      en: 'Production 3D file-to-price flow with checkout handoff.'
    },
    href: {
      de: 'https://deinlieblingsdruck.de/3d-konfigurator/#preisrechner',
      en: 'https://deinlieblingsdruck.de/3d-konfigurator/#preisrechner'
    },
    external: true
  },
  {
    id: 'proof-case-depth',
    title: {
      de: 'Nachvollziehbare Case-Study-Blueprints',
      en: 'Traceable case study blueprints'
    },
    evidence: {
      de: 'Problem, Architektur, Trade-offs und Ergebnis pro Projekt transparent dokumentiert.',
      en: 'Problem, architecture, trade-offs, and outcomes documented transparently per project.'
    },
    href: {
      de: '/case-studies',
      en: '/en/case-studies'
    }
  },
  {
    id: 'proof-delivery-guardrails',
    title: {
      de: 'Delivery mit QA- und Performance-Guardrails',
      en: 'Delivery with QA and performance guardrails'
    },
    evidence: {
      de: 'Playbooks und technische Standards fuer stabile Releases.',
      en: 'Playbooks and technical standards for stable releases.'
    },
    href: {
      de: '/playbooks',
      en: '/en/playbooks'
    }
  }
];

export const JOURNEY_TIMELINE: TimelineModel[] = [
  {
    id: 'timeline-1',
    year: '2023',
    title: {
      de: 'Fokus auf produktionsnahe Web-Delivery',
      en: 'Focus on production-grade web delivery'
    },
    detail: {
      de: 'Shift von Einzel-Features zu End-to-End-Systemen mit klaren Betriebskriterien.',
      en: 'Shift from isolated features to end-to-end systems with explicit operational criteria.'
    }
  },
  {
    id: 'timeline-2',
    year: '2024',
    title: {
      de: '3D und Maker Workflows als Kern-Differenzierung',
      en: '3D and maker workflows as core differentiation'
    },
    detail: {
      de: 'Aufbau von browserbasierten Konfiguratoren und technischen Prototyping-Flows.',
      en: 'Built browser-based configurators and technical prototyping flows.'
    }
  },
  {
    id: 'timeline-3',
    year: '2025',
    title: {
      de: 'AI Assist und Workflow-Automation integriert',
      en: 'Integrated AI assist and workflow automation'
    },
    detail: {
      de: 'Review- und Delivery-Prozesse mit reproduzierbaren Automationsmustern erweitert.',
      en: 'Extended review and delivery processes with reproducible automation patterns.'
    }
  },
  {
    id: 'timeline-4',
    year: '2026',
    title: {
      de: 'Creator-Engineer Brand ausgebaut',
      en: 'Scaled the creator-engineer brand'
    },
    detail: {
      de: 'Portfolio kombiniert Hiring-Story, technische Tiefe und Maker-Projekte mit messbarer Wirkung.',
      en: 'Portfolio combines hiring story, technical depth, and maker projects with measurable impact.'
    }
  }
];

export function getProjectsByTrack(locale: Locale, track: PortfolioTrack) {
  return PROJECT_MODELS.filter((project) => project.track === track).map((project) => ({
    ...project,
    localizedTitle: project.title[locale],
    localizedSummary: project.summary[locale],
    localizedOutcome: project.outcome[locale],
    localizedHref: project.href[locale],
    localizedCta: project.cta[locale]
  }));
}

export function getFeaturedProjects(locale: Locale) {
  return PROJECT_MODELS.filter((project) => project.featured).map((project) => ({
    ...project,
    localizedTitle: project.title[locale],
    localizedSummary: project.summary[locale],
    localizedOutcome: project.outcome[locale],
    localizedHref: project.href[locale],
    localizedCta: project.cta[locale]
  }));
}

export function getSocialProof(locale: Locale) {
  return SOCIAL_PROOF_MODELS.map((proof) => ({
    ...proof,
    localizedTitle: proof.title[locale],
    localizedEvidence: proof.evidence[locale],
    localizedHref: proof.href[locale]
  }));
}

export function getJourneyTimeline(locale: Locale) {
  return JOURNEY_TIMELINE.map((item) => ({
    ...item,
    localizedTitle: item.title[locale],
    localizedDetail: item.detail[locale]
  }));
}
