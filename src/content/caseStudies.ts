import type { Locale } from '@/content/copy';

export type CaseStudyKpi = {
  label: string;
  value: string;
  note: string;
};

export type CaseStudyBlueprint = {
  sectionTitle: string;
  sectionDescription: string;
  problemTitle: string;
  problemPoints: string[];
  approachTitle: string;
  approachPoints: string[];
  outcomeTitle: string;
  outcomePoints: string[];
  primaryCta: string;
  secondaryCta: string;
};

export const CASE_STUDY_KPIS: Record<Locale, Record<string, CaseStudyKpi[]>> = {
  de: {
    'configurator-live': [
      {
        label: 'Live-Status',
        value: 'Produktiv',
        note: 'Upload -> Analyse -> Preis -> Checkout ist im Kundenbetrieb aktiv.'
      },
      {
        label: 'Prozessqualität',
        value: 'Reproduzierbar',
        note: 'Standardanfragen laufen geführt statt über manuelle Rückfrage-Schleifen.'
      },
      {
        label: 'Delivery-Fit',
        value: 'End-to-End',
        note: 'Viewer, Plugin-Backend, Pricing-Engine und WooCommerce-Handoff als zusammenhängendes System.'
      }
    ],
    'portfolio-authority-relaunch': [
      {
        label: 'Strategische Richtung',
        value: 'Authority-first',
        note: 'Positionierung von Feature-Listing zu nachvollziehbarer Engineering-Kompetenz verschoben.'
      },
      {
        label: 'Informationsarchitektur',
        value: 'Hub-basiert',
        note: 'Case Studies, Insights und Playbooks als zusammenhängendes Vertrauenssystem.'
      },
      {
        label: 'Delivery-Qualität',
        value: 'Stabil',
        note: 'Strukturierte Quality-Gates und reproduzierbare Übergaben im laufenden Betrieb.'
      }
    ]
  },
  en: {
    'configurator-live': [
      {
        label: 'Live status',
        value: 'Production',
        note: 'Upload -> analysis -> pricing -> checkout is active in client operations.'
      },
      {
        label: 'Process quality',
        value: 'Repeatable',
        note: 'Standard requests are guided instead of handled via manual clarification loops.'
      },
      {
        label: 'Delivery fit',
        value: 'End-to-end',
        note: 'Viewer, plugin backend, pricing engine, and WooCommerce handoff delivered as one system.'
      }
    ],
    'portfolio-authority-relaunch': [
      {
        label: 'Strategic direction',
        value: 'Authority-first',
        note: 'Shifted from feature listing to verifiable engineering positioning.'
      },
      {
        label: 'Information architecture',
        value: 'Hub-driven',
        note: 'Case studies, insights, and playbooks connected into one trust layer.'
      },
      {
        label: 'Delivery quality',
        value: 'Stable',
        note: 'Structured quality gates and handover consistency across the operating baseline.'
      }
    ]
  }
};

export const CASE_STUDY_BLUEPRINTS: Record<Locale, Record<string, CaseStudyBlueprint>> = {
  de: {
    'configurator-live': {
      sectionTitle: 'Projektstruktur: Problem, Ansatz, Ergebnis',
      sectionDescription: 'So wird aus technischer Umsetzung ein nachvollziehbarer Business-Impact.',
      problemTitle: 'Problem',
      problemPoints: [
        'Anfragen liefen über manuelle Rückfrage-Schleifen.',
        'Preislogik war für Kunden intransparent und langsam.',
        'Kein durchgängiger Pfad vom Upload bis zur Bestellung.'
      ],
      approachTitle: 'Ansatz',
      approachPoints: [
        'Guided Flow mit Three.js/WebGL für sofortiges Modell-Feedback.',
        'Plugin-Backend + Pricing-Engine als reproduzierbare Entscheidungslogik.',
        'Nahtloses WooCommerce-Handoff ohne Kontextverlust.'
      ],
      outcomeTitle: 'Ergebnis',
      outcomePoints: [
        'Produktiver Upload-zu-Checkout-Prozess im Live-Betrieb.',
        'Weniger manuelle Rückfragen bei Standardanfragen.',
        'Schnellere Preisorientierung und klarerer Entscheidungsweg.'
      ],
      primaryCta: 'Ähnlichen Flow für Ihr Produkt anfragen',
      secondaryCta: 'Leistungsmodell ansehen'
    },
    'portfolio-authority-relaunch': {
      sectionTitle: 'Projektstruktur: Problem, Ansatz, Ergebnis',
      sectionDescription: 'Die Relaunch-Logik hinter Positionierung, Struktur und Conversion-Führung.',
      problemTitle: 'Problem',
      problemPoints: [
        'Portfolio wirkte wie Feature-Sammlung statt als Authority-System.',
        'Nutzerpfade für Hiring- und Projektanfragen waren unscharf.',
        'Proof-Signale waren vorhanden, aber nicht strukturiert verknüpft.'
      ],
      approachTitle: 'Ansatz',
      approachPoints: [
        'Neupositionierung auf nachvollziehbare Engineering-Entscheidungen.',
        'Hub-Architektur aus Case Studies, Insights und Playbooks.',
        'Klare CTA-Hierarchie und quality-gated Delivery.'
      ],
      outcomeTitle: 'Ergebnis',
      outcomePoints: [
        'Stärkeres Vertrauenssignal für Entscheider im B2B-Kontext.',
        'Bessere Navigationsklarheit über alle Primärpfade.',
        'Stabile Grundlage für laufende Conversion-Optimierung.'
      ],
      primaryCta: 'Authority-Relaunch für Ihre Website anfragen',
      secondaryCta: 'Leistungsmodell ansehen'
    }
  },
  en: {
    'configurator-live': {
      sectionTitle: 'Case structure: Problem, approach, outcome',
      sectionDescription: 'How technical implementation translates into verifiable business impact.',
      problemTitle: 'Problem',
      problemPoints: [
        'Requests were handled via manual follow-up loops.',
        'Pricing logic lacked speed and transparency for buyers.',
        'No end-to-end path from model upload to order handoff.'
      ],
      approachTitle: 'Approach',
      approachPoints: [
        'Guided Three.js/WebGL flow with immediate model-state feedback.',
        'Plugin backend + pricing engine for reproducible decision logic.',
        'Seamless WooCommerce handoff without context loss.'
      ],
      outcomeTitle: 'Outcome',
      outcomePoints: [
        'Production upload-to-checkout path running live.',
        'Fewer manual clarifications for standard requests.',
        'Faster pricing orientation and clearer buyer progression.'
      ],
      primaryCta: 'Request a similar flow for your product',
      secondaryCta: 'View service model'
    },
    'portfolio-authority-relaunch': {
      sectionTitle: 'Case structure: Problem, approach, outcome',
      sectionDescription: 'The relaunch logic behind positioning, structure, and conversion flow.',
      problemTitle: 'Problem',
      problemPoints: [
        'Portfolio messaging behaved like a feature list, not an authority layer.',
        'Hiring and project-intent paths were not clearly separated.',
        'Proof assets existed but were not connected in one system.'
      ],
      approachTitle: 'Approach',
      approachPoints: [
        'Repositioning around traceable engineering decisions.',
        'Hub architecture linking case studies, insights, and playbooks.',
        'Clear CTA hierarchy with quality-gated delivery.'
      ],
      outcomeTitle: 'Outcome',
      outcomePoints: [
        'Stronger trust signal for B2B decision-makers.',
        'Clearer navigation across all primary intent paths.',
        'Stable foundation for ongoing conversion optimization.'
      ],
      primaryCta: 'Request an authority relaunch blueprint',
      secondaryCta: 'View service model'
    }
  }
};
