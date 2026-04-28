import type { Locale } from '@/content/copy';

type TimelineEntry = { year: string; title: string; detail: string };
type ProcessStep = { title: string; description: string };

export type HomeEngineCodeLine = { type: 'noise' | 'pivot' | 'skeleton' | 'mem'; text: string };

export type HomeEngineShowcaseCopy = {
  groupEyebrow: string;
  groupTitle: string;
  groupLead: string;
  problemLabel: string;
  problemTitle: string;
  problemSub: string;
  withoutColumnTitle: string;
  withColumnTitle: string;
  loadLabel: string;
  withoutLoad: { display: string; percent: number };
  withLoad: { display: string; percent: number };
  withoutLines: string[];
  withLines: HomeEngineCodeLine[];
  howEyebrow: string;
  howTitle: string;
  howSub: string;
  steps: { id: string; title: string; body: string }[];
  archEyebrow: string;
  archTitle: string;
  archNodes: [string, string, string];
  archSub: string;
  stats: { value: string; label: string; sub: string }[];
  toolsEyebrow: string;
  toolsLine: string;
  ctaHref: string;
  ctaLabel: string;
};

const engineShowcase: Record<Locale, HomeEngineShowcaseCopy> = {
  de: {
    groupEyebrow: 'Delivery-Engine',
    groupTitle: 'Fokus statt Scope-Rauschen',
    groupLead:
      'Inspiriert von lokalen Kontext-Engines: dieselbe Idee — nur eben für B2B-Umsetzung. Weniger Streuverlust, mehr Schärfe in der Kette von Anforderung bis Deploy.',
    problemLabel: 'Das Muster',
    problemTitle: 'Viel gelesen. Wenig handlungsfähig.',
    problemSub:
      'Ohne klare Kapsel entsteht dieselbe Dichte wie bei „Kontext-fressenden“ Setups: alles scheint relevant, nichts ist priorisiert.',
    withoutColumnTitle: 'Ohne fokussierte Kette',
    withColumnTitle: 'Mit fokussierter Lieferkette',
    loadLabel: 'Kontext-Budget (Metapher)',
    withoutLoad: { display: '8.247 u. a. Zeilen/Refs', percent: 81 },
    withLoad: { display: '2.140 fokussiert', percent: 21 },
    withoutLines: [
      'import { auth } from "./auth"',
      'import { limit } from "./limiter"',
      'import { db } from "./db"',
      'import { log } from "./log"',
      'import { User } from "./types/user"',
      'import { Session } from "./types/sess"',
      'import { cache } from "./cache"',
      'import { util } from "./util"',
      '// … Middleware + 4 weitere Dateien unklar verknüpft'
    ],
    withLines: [
      { type: 'pivot', text: '● pivot  middleware/auth.ts' },
      { type: 'pivot', text: '   export async function middleware(…): Promise<void>' },
      { type: 'pivot', text: '   export async function validateSession(…): Promise<Session>' },
      { type: 'skeleton', text: '○ skel. services/limiter.ts' },
      { type: 'skeleton', text: '   class RateLimiter' },
      { type: 'skeleton', text: '   check(key: string): Promise<boolean>' },
      { type: 'skeleton', text: '○ skel.  config/limits.ts' },
      { type: 'skeleton', text: '   export const rateLimits: Record<string, number>' },
      { type: 'mem', text: '◌ Memory  „Gates vor Redis-Fallback“ · vorgestern' }
    ],
    howEyebrow: 'Wie es zusammenspielt',
    howTitle: 'Graph-scharf statt alles-auf-einmal',
    howSub: 'Drei Stufen — deterministisch nachvollziehbar, ohne externe KI-Pipeline. Genau so strukturiere ich Projekte.',
    steps: [
      {
        id: 'map',
        title: '1 · Kartieren',
        body: 'Ist-Architektur, Abhängigkeiten und harte Business-Constraints in ein gemeinsames Modell — kein Raten bei Imports und Nebenwirkungen.'
      },
      {
        id: 'link',
        title: '2 · Verknüpfen',
        body: 'Impact vor Refactor: wer ruft was, welche Tests/Gates brechen? Blast-Radius sichtbar machen, bevor Code bewegt wird.'
      },
      {
        id: 'capsule',
        title: '3 · Kapseln',
        body: 'Nächste Iteration bekommt nur die Pivots plus schlanke Signatur-Flächen — PRs, Reviews und Deploys bleiben lesbar.'
      }
    ],
    archEyebrow: 'Architektur',
    archTitle: 'Ein Band — vom Mandat ins Live-System',
    archNodes: ['Anforderung & Risiko', 'Spec · QA · Gates', 'Produktives Web-System'],
    archSub: 'Derselbe Gedanke wie „Agent → Protokoll → Engine“: klare Hand-offs statt heimlicher Informationsverlust.',
    stats: [
      {
        value: '~60%',
        label: 'Weniger Rückfragen',
        sub: 'Schätzung Ops · 3D-Konfigurator live (Case: Datei-zu-Preis)'
      },
      {
        value: '95+',
        label: 'Lighthouse-Ziel',
        sub: 'Performance-Gate wie auf der Startseite kommuniziert'
      },
      {
        value: '< 24h',
        label: 'Antwort werktags',
        sub: 'Reaktionszeit — konsistent im Hero & Kontakt'
      },
      {
        value: '3',
        label: 'Live-Nachweise',
        sub: 'verlinkte Production-Surfaces & dokumentierte Cases'
      }
    ],
    toolsEyebrow: 'Stack & Werkzeuge',
    toolsLine: 'Dieselbe Disziplin, die du im Repo erwartest — sichtbar in CI, E2E und am Deploy-Rand.',
    ctaHref: '#home-offer',
    ctaLabel: 'Zu Angebot & Nachweis'
  },
  en: {
    groupEyebrow: 'Delivery engine',
    groupTitle: 'Clarity over scope noise',
    groupLead:
      'Borrowing the local-first context idea — applied to B2B delivery. Less scatter, more signal from requirements to deploy.',
    problemLabel: 'The pattern',
    problemTitle: 'Lots read. Little leverage.',
    problemSub:
      'Without a real capsule, you get the same density as a bloated context dump: everything feels relevant, nothing is prioritized.',
    withoutColumnTitle: 'Without a focused chain',
    withColumnTitle: 'With a focused delivery chain',
    loadLabel: 'Context budget (metaphor)',
    withoutLoad: { display: '8,247+ lines/refs', percent: 81 },
    withLoad: { display: '2,140 focused', percent: 21 },
    withoutLines: [
      'import { auth } from "./auth"',
      'import { limit } from "./limiter"',
      'import { db } from "./db"',
      'import { log } from "./log"',
      'import { User } from "./types/user"',
      'import { Session } from "./types/sess"',
      'import { cache } from "./cache"',
      'import { util } from "./util"',
      '// … middleware + 4 more files, unclear graph'
    ],
    withLines: [
      { type: 'pivot', text: '● pivot  middleware/auth.ts' },
      { type: 'pivot', text: '   export async function middleware(…): Promise<void>' },
      { type: 'pivot', text: '   export async function validateSession(…): Promise<Session>' },
      { type: 'skeleton', text: '○ skel.  services/limiter.ts' },
      { type: 'skeleton', text: '   class RateLimiter' },
      { type: 'skeleton', text: '   check(key: string): Promise<boolean>' },
      { type: 'skeleton', text: '○ skel.  config/limits.ts' },
      { type: 'skeleton', text: '   export const rateLimits: Record<string, number>' },
      { type: 'mem', text: '◌ memory  “gates before Redis fallback” · 2d ago' }
    ],
    howEyebrow: 'How the pieces connect',
    howTitle: 'Graph-tight, not all-at-once',
    howSub: 'Three stages — auditable without an external AI context cloud. This is how I run projects end-to-end.',
    steps: [
      {
        id: 'map',
        title: '1 · Map',
        body: 'As-is architecture, dependencies, and hard business constraints in one model — no guessing on imports and side effects.'
      },
      {
        id: 'link',
        title: '2 · Connect',
        body: 'Impact before refactors: who calls what, which tests/gates break? Surface blast radius before code moves.'
      },
      {
        id: 'capsule',
        title: '3 · Capsule',
        body: 'The next iteration gets pivot files plus lean signature layers — PRs, reviews, and deploys stay readable.'
      }
    ],
    archEyebrow: 'Architecture',
    archTitle: 'One path — from mandate to production',
    archNodes: ['Requirements & risk', 'Spec · QA · gates', 'Live web system'],
    archSub: 'Same story as “agent → protocol → engine”: explicit handoffs instead of hidden information loss.',
    stats: [
      {
        value: '~60%',
        label: 'Fewer back-and-forth loops',
        sub: 'Ops estimate · 3D configurator live (file-to-price case study)'
      },
      {
        value: '95+',
        label: 'Lighthouse target',
        sub: 'Performance gate as stated on the homepage'
      },
      {
        value: '< 24h',
        label: 'Weekday response',
        sub: 'Response time — consistent in hero and contact'
      },
      {
        value: '3',
        label: 'Live proof points',
        sub: 'Linked production surfaces and documented cases'
      }
    ],
    toolsEyebrow: 'Stack & tooling',
    toolsLine: 'The same rigor you expect in-repo — visible in CI, E2E, and at the deploy edge.',
    ctaHref: '#home-offer',
    ctaLabel: 'View offer & evidence'
  }
};

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

export function getHomeEngineShowcaseCopy(locale: Locale): HomeEngineShowcaseCopy {
  return engineShowcase[locale];
}
