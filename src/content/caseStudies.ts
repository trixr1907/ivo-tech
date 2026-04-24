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
        label: 'Betriebsstatus',
        value: 'Produktiv',
        note: 'Upload → WebGL-Analyse → Preisberechnung → WooCommerce-Checkout läuft im Live-Kundenbetrieb.'
      },
      {
        label: 'Rückfragen-Reduktion',
        value: '≈ 0 Std.',
        note: 'Standardanfragen laufen geführt ohne manuelle Preisrückfragen.'
      },
      {
        label: 'Stack-Abdeckung',
        value: '4 Layer',
        note: 'Three.js/WebGL Viewer, WordPress Plugin, Pricing-Engine und WooCommerce-Handoff als ein System.'
      }
    ],
    'portfolio-authority-relaunch': [
      {
        label: 'Lighthouse-Score',
        value: '95+',
        note: 'Performance, Accessibility, SEO und Best Practices — alle Kategorien im grünen Bereich.'
      },
      {
        label: 'Content-Ebenen',
        value: '3 Hubs',
        note: 'Case Studies, Insights und Playbooks als zusammenhängendes Authority-System.'
      },
      {
        label: 'CI/CD-Gates',
        value: '5 Checks',
        note: 'Lint, Typecheck, Unit-Tests, E2E und Security-Scan vor jedem Production-Deploy.'
      }
    ]
  },
  en: {
    'configurator-live': [
      {
        label: 'Production status',
        value: 'Live',
        note: 'Upload → WebGL analysis → pricing → WooCommerce checkout running in client production.'
      },
      {
        label: 'Manual follow-ups',
        value: '≈ 0 h',
        note: 'Standard requests are handled end-to-end without manual price inquiries.'
      },
      {
        label: 'Stack coverage',
        value: '4 layers',
        note: 'Three.js/WebGL viewer, WordPress plugin, pricing engine, and WooCommerce handoff as one system.'
      }
    ],
    'portfolio-authority-relaunch': [
      {
        label: 'Lighthouse score',
        value: '95+',
        note: 'Performance, accessibility, SEO, and best practices — all categories in the green zone.'
      },
      {
        label: 'Content hubs',
        value: '3 hubs',
        note: 'Case studies, insights, and playbooks as a connected authority system.'
      },
      {
        label: 'CI/CD gates',
        value: '5 checks',
        note: 'Lint, typecheck, unit tests, E2E, and security scan before every production deploy.'
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
        'Jede Anfrage erforderte manuelle E-Mail-Schleifen für Preisermittlung und Materialwahl.',
        'Kunden hatten kein sofortiges Feedback — kein Modell-Preview, kein Preisindikator.',
        'Kein durchgängiger Pfad vom Upload bis zur Bestellung im Shop.'
      ],
      approachTitle: 'Ansatz',
      approachPoints: [
        'Three.js/WebGL-Viewer mit sofortiger STL/3MF-Analyse direkt im Browser — kein Server-Round-Trip.',
        'WordPress-Plugin-Backend mit Pricing-Engine: Material, Dichte, Volumen → Sofortpreis.',
        'Nahtloses WooCommerce-Handoff: Materialwahl, Menge und Preis landen direkt im Warenkorb.'
      ],
      outcomeTitle: 'Ergebnis',
      outcomePoints: [
        'Upload-zu-Checkout-Flow läuft produktiv — keine manuelle Preisanfrage mehr für Standardmodelle.',
        'WebGL-Vorschau und Preisberechnung lokal im Browser — Antwort in Millisekunden statt Stunden.',
        'WooCommerce-Integration ohne Kontextbruch: eine Prozesskette statt drei separate Schritte.'
      ],
      primaryCta: 'Ähnlichen Flow für Ihr Produkt anfragen',
      secondaryCta: 'Leistungsmodell ansehen'
    },
    'portfolio-authority-relaunch': {
      sectionTitle: 'Projektstruktur: Problem, Ansatz, Ergebnis',
      sectionDescription: 'Die Relaunch-Logik hinter Positionierung, Struktur und Conversion-Führung.',
      problemTitle: 'Problem',
      problemPoints: [
        'Portfolio-Messaging zählte Features auf — kein erkennbarer Vorteil für Entscheider.',
        'Hiring- und Projektanfragen liefen über denselben ungeschärften Kanal.',
        'Proof-Signale (Cases, Insights, Playbooks) existierten, aber waren nicht als System verknüpft.'
      ],
      approachTitle: 'Ansatz',
      approachPoints: [
        'Neupositionierung auf nachvollziehbare Engineering-Entscheidungen statt Feature-Listen.',
        'Hub-Architektur: Case Studies, Insights und Playbooks als zusammenhängendes Vertrauenssystem.',
        'Klare Intent-Trennung: separater CTA-Pfad für Hiring, Projektkollaboration und Maker-Exchange.'
      ],
      outcomeTitle: 'Ergebnis',
      outcomePoints: [
        'Lighthouse 95+ über alle Kategorien — Performance, Accessibility, SEO, Best Practices.',
        'Fünf CI/CD-Quality-Gates vor jedem Production-Deploy — kein manueller Merge ohne grüne Checks.',
        'Dokumentierte Trade-offs und reproduzierbare Übergabe: jeder Delivery-Schritt nachvollziehbar.'
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
        'Every inquiry required manual email back-and-forth for pricing and material selection.',
        'Buyers had no immediate feedback — no model preview, no price indicator.',
        'No end-to-end path from model upload to order placement in the shop.'
      ],
      approachTitle: 'Approach',
      approachPoints: [
        'Three.js/WebGL viewer with instant STL/3MF analysis in the browser — no server round-trip.',
        'WordPress plugin backend with pricing engine: material, density, volume → instant price.',
        'Seamless WooCommerce handoff: material selection, quantity, and price land directly in cart.'
      ],
      outcomeTitle: 'Outcome',
      outcomePoints: [
        'Upload-to-checkout flow runs live — no manual pricing inquiry needed for standard models.',
        'WebGL preview and price calculation run client-side — response in milliseconds, not hours.',
        'WooCommerce integration without context break: one flow instead of three separate steps.'
      ],
      primaryCta: 'Request a similar flow for your product',
      secondaryCta: 'View service model'
    },
    'portfolio-authority-relaunch': {
      sectionTitle: 'Case structure: Problem, approach, outcome',
      sectionDescription: 'The relaunch logic behind positioning, structure, and conversion flow.',
      problemTitle: 'Problem',
      problemPoints: [
        'Portfolio messaging listed features — no recognizable advantage for decision-makers.',
        'Hiring and project requests ran through the same unsharpened channel.',
        'Proof assets (cases, insights, playbooks) existed but were not connected as a system.'
      ],
      approachTitle: 'Approach',
      approachPoints: [
        'Repositioning around traceable engineering decisions instead of feature lists.',
        'Hub architecture: case studies, insights, and playbooks as a connected trust system.',
        'Clear intent separation: dedicated CTA path for hiring, project collaboration, and maker exchange.'
      ],
      outcomeTitle: 'Outcome',
      outcomePoints: [
        'Lighthouse 95+ across all categories — performance, accessibility, SEO, best practices.',
        'Five CI/CD quality gates before every production deploy — no merge without green checks.',
        'Documented trade-offs and reproducible handover: every delivery step is traceable.'
      ],
      primaryCta: 'Request an authority relaunch blueprint',
      secondaryCta: 'View service model'
    }
  }
};
