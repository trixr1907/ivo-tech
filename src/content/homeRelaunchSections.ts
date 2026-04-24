import type { Locale } from '@/content/copy';

type TimelineEntry = { year: string; title: string; detail: string };
type ProcessStep = { title: string; description: string };

export type HomeTestimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  caseSlug: string;
};

const journey: Record<Locale, { eyebrow: string; title: string; description: string; timeline: TimelineEntry[] }> = {
  de: {
    eyebrow: 'Journey',
    title: 'Schwerpunkte über die Jahre — mit messbarer Delivery',
    description:
      'Kurze Timeline plus Stimmen aus dokumentierten Case Studies. Alles verlinkt, damit du Tiefe prüfen kannst, ohne Marketing-Floskeln.',
    timeline: [
      {
        year: '2023',
        title: 'Fokus auf produktionsnahe Web-Delivery',
        detail: 'Shift von Einzel-Features zu End-to-End-Systemen mit klaren Betriebskriterien.'
      },
      {
        year: '2024',
        title: '3D- und Maker-Workflows als Differenzierung',
        detail: 'Browserbasierte Konfiguratoren und technische Prototyping-Flows im echten Kundenbetrieb.'
      },
      {
        year: '2025',
        title: 'AI-Assist in Review- und Delivery-Prozessen',
        detail: 'Reproduzierbare Automationsmuster für Reviews, QA und schnellere Iteration ohne Qualitätsverlust.'
      },
      {
        year: '2026',
        title: 'Portfolio als Creator-Engineer Brand',
        detail: 'Hiring-Story, technische Tiefe und Maker-Projekte in einem nachvollziehbaren Narrativ gebündelt.'
      }
    ]
  },
  en: {
    eyebrow: 'Journey',
    title: 'Year-over-year focus — with verifiable delivery',
    description:
      'A compact timeline plus voices from documented case studies. Everything is linked so you can validate depth without marketing filler.',
    timeline: [
      {
        year: '2023',
        title: 'Production-grade web delivery',
        detail: 'Shift from one-off features to end-to-end systems with explicit operational criteria.'
      },
      {
        year: '2024',
        title: '3D and maker workflows as differentiation',
        detail: 'Browser-based configurators and technical prototyping flows running in real client production.'
      },
      {
        year: '2025',
        title: 'AI-assisted review and delivery loops',
        detail: 'Repeatable automation patterns for reviews, QA, and faster iteration without quality regressions.'
      },
      {
        year: '2026',
        title: 'Portfolio as a creator-engineer brand',
        detail: 'Hiring narrative, technical depth, and maker work bundled into one traceable storyline.'
      }
    ]
  }
};

const process: Record<Locale, { eyebrow: string; title: string; description: string; steps: ProcessStep[] }> = {
  de: {
    eyebrow: 'Prozess',
    title: 'Transparenter Ablauf mit klaren Entscheidungspunkten',
    description:
      'So bleibt Scope steuerbar: klare Gates, nachvollziehbare Artefakte und ein Team, das jederzeit den Stand sieht.',
    steps: [
      {
        title: '1. Discovery & Priorisierung',
        description: 'Ziele, Zielgruppen, Kernbotschaft und Business-Constraints auf eine belastbare Basis bringen.'
      },
      {
        title: '2. UX/UI-System & Prototyp',
        description: 'Struktur und visuelle Sprache validieren, bevor breit implementiert wird.'
      },
      {
        title: '3. Implementierung & QA',
        description: 'Komponenten, Content und technische Qualität in einem reproduzierbaren Delivery-Prozess ausliefern.'
      },
      {
        title: '4. Launch & Iteration',
        description: 'Tracking, Optimierung und weitere Hebel nach dem Go-live iterativ ausbauen.'
      }
    ]
  },
  en: {
    eyebrow: 'Process',
    title: 'Transparent flow with explicit decision points',
    description:
      'Keeps scope controllable: clear gates, traceable artifacts, and a team that always sees the current state.',
    steps: [
      {
        title: '1. Discovery and prioritization',
        description: 'Align goals, audiences, core message, and business constraints on a solid baseline.'
      },
      {
        title: '2. UX/UI system and prototype',
        description: 'Validate structure and visual language before scaling implementation work.'
      },
      {
        title: '3. Implementation and QA',
        description: 'Ship components, content, and technical quality through a repeatable delivery process.'
      },
      {
        title: '4. Launch and iteration',
        description: 'Expand tracking, optimization, and further levers iteratively after go-live.'
      }
    ]
  }
};

const testimonials: Record<Locale, HomeTestimonial[]> = {
  de: [
    {
      quote:
        'Der neue Konfigurator hat unser Angebot von manuellen Rückfragen auf einen geführten Upload-zu-Preis-Prozess gebracht. Das Team kann schneller und konsistenter reagieren.',
      name: 'Anonymisiert',
      role: 'Operations Lead',
      company: 'E-Commerce Manufacturing Partner',
      caseSlug: 'configurator-live'
    },
    {
      quote:
        'Der Relaunch hat uns nicht nur ein neues Design gegeben, sondern eine klare Entscheidungsstruktur für Hiring und Projektanfragen. Das macht Gespräche deutlich effizienter.',
      name: 'Anonymisiert',
      role: 'Commercial Director',
      company: 'B2B Services Company',
      caseSlug: 'portfolio-authority-relaunch'
    },
    {
      quote:
        'Was uns überzeugt hat: reproduzierbare QA-Gates und dokumentierte Übergaben — wir sehen den Stand jederzeit, ohne Micro-Management.',
      name: 'Anonymisiert',
      role: 'Head of Engineering',
      company: 'B2B SaaS (NDA)',
      caseSlug: 'configurator-live'
    }
  ],
  en: [
    {
      quote:
        'The new configurator moved us from manual back-and-forth to a guided upload-to-price flow. The team can respond faster and more consistently.',
      name: 'Anonymized',
      role: 'Operations lead',
      company: 'E-commerce manufacturing partner',
      caseSlug: 'configurator-live'
    },
    {
      quote:
        'The relaunch gave us more than a new design — a clearer decision architecture for hiring and project inquiries. Conversations got noticeably more efficient.',
      name: 'Anonymized',
      role: 'Commercial director',
      company: 'B2B services company',
      caseSlug: 'portfolio-authority-relaunch'
    },
    {
      quote:
        'What convinced us: repeatable QA gates and documented handovers — we always see status without micromanagement.',
      name: 'Anonymized',
      role: 'Head of engineering',
      company: 'B2B SaaS (NDA)',
      caseSlug: 'configurator-live'
    }
  ]
};

export function getHomeJourneyCopy(locale: Locale) {
  return journey[locale];
}

export function getHomeProcessCopy(locale: Locale) {
  return process[locale];
}

export function getHomeTestimonials(locale: Locale): HomeTestimonial[] {
  return testimonials[locale];
}
