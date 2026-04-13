import type { Locale } from '@/content/copy';

export type ServiceDetailSlug =
  | 'web-engineering-delivery'
  | 'ai-automation-workflows'
  | '3d-visualization-systems';

type ServiceDetailLocalized = {
  navLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  outcomesTitle: string;
  outcomes: string[];
  deliverablesTitle: string;
  deliverables: string[];
  fitTitle: string;
  fit: string[];
  faqTitle: string;
  faq: Array<{ question: string; answer: string }>;
  linksTitle: string;
  links: Array<{ label: string; href: string; kind: 'case' | 'insight' | 'playbook' }>;
  ctaPrimary: string;
  ctaSecondary: string;
  ctaTertiary: string;
};

type ServiceDetailDefinition = {
  slug: ServiceDetailSlug;
  seoTitle: Record<Locale, string>;
  seoDescription: Record<Locale, string>;
  content: Record<Locale, ServiceDetailLocalized>;
};

const SERVICE_DETAILS: ServiceDetailDefinition[] = [
  {
    slug: 'web-engineering-delivery',
    seoTitle: {
      de: 'Web Engineering Delivery | ivo-tech',
      en: 'Web Engineering Delivery | ivo-tech'
    },
    seoDescription: {
      de: 'Architektur, Frontend-System und QA-Gates für conversion-kritische B2B-Websites.',
      en: 'Architecture, frontend system, and QA gates for conversion-critical B2B websites.'
    },
    content: {
      de: {
        navLabel: 'Web Engineering Delivery',
        eyebrow: 'Service Detail',
        title: 'Web Engineering Delivery',
        description:
          'Für Teams, die Website-Delivery nicht als Designprojekt, sondern als produktionskritisches System betreiben. Fokus: klare IA, robuste Komponenten, verlässlicher Release-Prozess.',
        outcomesTitle: 'Ergebnisfokus',
        outcomes: [
          'Klarere Angebotskommunikation entlang realer Entscheidungswege',
          'Schnellere Iteration durch tokenbasiertes Komponentenmodell',
          'Weniger Risiko im Rollout durch QA- und Handover-Gates'
        ],
        deliverablesTitle: 'Typische Deliverables',
        deliverables: [
          'Informationsarchitektur für Home, Services und Cases',
          'Komponentenbibliothek mit wiederverwendbaren Mustern',
          'Release-Checkliste mit technischen und inhaltlichen Quality Gates'
        ],
        fitTitle: 'Wann dieses Format passt',
        fit: [
          'Relaunch oder Segment-Neuaufbau mit hohem Stakeholder-Druck',
          'Bestehende Seite wirkt uneinheitlich und konvertiert inkonsistent',
          'Team braucht belastbare Basis für laufende Erweiterung'
        ],
        faqTitle: 'FAQ',
        faq: [
          {
            question: 'Wie schnell ist ein erstes Delivery-Paket umsetzbar?',
            answer: 'Typisch ist ein erstes, belastbares Paket in 2 bis 3 Wochen, je nach Content-Reife und Freigabegeschwindigkeit.'
          },
          {
            question: 'Funktioniert das auch mit bestehendem Design?',
            answer: 'Ja. Bestehende Assets können in ein sauberes Komponenten- und Strukturmodell überführt werden.'
          },
          {
            question: 'Wie wird Qualität abgesichert?',
            answer: 'Durch feste QA-Gates für Struktur, Accessibility, Performance und Conversion-Pfade vor jedem Release.'
          }
        ],
        linksTitle: 'Passende Vertiefungen',
        links: [
          {
            label: 'Case: Portfolio Authority Relaunch',
            href: '/case-studies/portfolio-authority-relaunch',
            kind: 'case'
          },
          {
            label: 'Insight: Architecture decisions under pressure',
            href: '/insights/architecture-decisions-under-pressure',
            kind: 'insight'
          },
          {
            label: 'Playbook: Performance budget guardrails',
            href: '/playbooks/performance-budget-guardrails',
            kind: 'playbook'
          }
        ],
        ctaPrimary: 'Scope-Call für Delivery anfragen',
        ctaSecondary: 'Case ansehen',
        ctaTertiary: 'Playbook lesen'
      },
      en: {
        navLabel: 'Web Engineering Delivery',
        eyebrow: 'Service detail',
        title: 'Web Engineering Delivery',
        description:
          'For teams that treat web delivery as a production-critical system, not a visual-only project. Focus: clear IA, robust components, and reliable release execution.',
        outcomesTitle: 'Outcome focus',
        outcomes: [
          'Clearer offer communication across real buyer journeys',
          'Faster iteration via a token-driven component model',
          'Lower rollout risk through QA and handover gates'
        ],
        deliverablesTitle: 'Typical deliverables',
        deliverables: [
          'Information architecture for home, services, and case studies',
          'Component library with reusable conversion patterns',
          'Release checklist across technical and content quality gates'
        ],
        fitTitle: 'When this format fits',
        fit: [
          'Relaunch or segment rebuild with stakeholder pressure',
          'Current website is inconsistent and conversion paths are noisy',
          'Team needs a stable baseline for ongoing extension'
        ],
        faqTitle: 'FAQ',
        faq: [
          {
            question: 'How quickly can the first delivery package ship?',
            answer: 'A first reliable package is typically delivered in 2-3 weeks, depending on content readiness and approvals.'
          },
          {
            question: 'Can this work with our current design assets?',
            answer: 'Yes. Existing assets can be migrated into a cleaner component and structure model.'
          },
          {
            question: 'How is quality controlled?',
            answer: 'With explicit quality gates for structure, accessibility, performance, and conversion paths before every release.'
          }
        ],
        linksTitle: 'Related deep dives',
        links: [
          {
            label: 'Case: Portfolio authority relaunch',
            href: '/case-studies/portfolio-authority-relaunch',
            kind: 'case'
          },
          {
            label: 'Insight: Architecture decisions under pressure',
            href: '/insights/architecture-decisions-under-pressure',
            kind: 'insight'
          },
          {
            label: 'Playbook: Performance budget guardrails',
            href: '/playbooks/performance-budget-guardrails',
            kind: 'playbook'
          }
        ],
        ctaPrimary: 'Request delivery scope call',
        ctaSecondary: 'View case',
        ctaTertiary: 'Read playbook'
      }
    }
  },
  {
    slug: 'ai-automation-workflows',
    seoTitle: {
      de: 'AI Automation Workflows | ivo-tech',
      en: 'AI Automation Workflows | ivo-tech'
    },
    seoDescription: {
      de: 'AI-gestützte Workflow-Automation für schnellere Delivery und weniger manuelle Reibung.',
      en: 'AI-assisted workflow automation for faster delivery and lower manual overhead.'
    },
    content: {
      de: {
        navLabel: 'AI Automation Workflows',
        eyebrow: 'Service Detail',
        title: 'AI Automation Workflows',
        description:
          'Für Teams, die repetitive Delivery-Schritte reduzieren und Entscheidungsprozesse beschleunigen wollen. Fokus auf sichere Integrationspfade und reproduzierbare Prozesse.',
        outcomesTitle: 'Ergebnisfokus',
        outcomes: [
          'Schnellere Iterationszyklen in Review- und Handover-Schritten',
          'Weniger manuelle Übergaben bei Standardabläufen',
          'Mehr Transparenz über Workflow-Zustand und Prioritäten'
        ],
        deliverablesTitle: 'Typische Deliverables',
        deliverables: [
          'Workflow-Mapping inkl. Engpass- und Risikoanalyse',
          'AI-Assist-Ketten für Review, Routing und Dokumentation',
          'Monitoring-Konzept für Outcome- und Qualitätsmetriken'
        ],
        fitTitle: 'Wann dieses Format passt',
        fit: [
          'Team verliert Zeit durch manuelle Abstimmungsrunden',
          'Wiederkehrende Aufgaben sind nicht standardisiert',
          'Skalierung scheitert an fehlender Prozessautomatisierung'
        ],
        faqTitle: 'FAQ',
        faq: [
          {
            question: 'Ersetzt das bestehende Tools komplett?',
            answer: 'Nein. Ziel ist Integration in bestehende Prozesse mit klaren Übergaben statt kompletter Tool-Neubau.'
          },
          {
            question: 'Wie wird Sicherheit im Workflow behandelt?',
            answer: 'Mit definierten Zugriffspfaden, Review-Stufen und klarer Trennung zwischen Assistenz und finaler Freigabe.'
          },
          {
            question: 'Wann sind erste Effekte sichtbar?',
            answer: 'Bei klar eingegrenztem Scope oft bereits in den ersten 2 Wochen durch reduzierte manuelle Schritte.'
          }
        ],
        linksTitle: 'Passende Vertiefungen',
        links: [
          {
            label: 'Case: Configurator live',
            href: '/case-studies/configurator-live',
            kind: 'case'
          },
          {
            label: 'Insight: AI-assisted PR review loop',
            href: '/insights/ai-assisted-pr-review-loop',
            kind: 'insight'
          },
          {
            label: 'Playbook: API integration readiness',
            href: '/playbooks/api-integration-readiness-playbook',
            kind: 'playbook'
          }
        ],
        ctaPrimary: 'Scope-Call für Automation anfragen',
        ctaSecondary: 'Case ansehen',
        ctaTertiary: 'Playbook lesen'
      },
      en: {
        navLabel: 'AI Automation Workflows',
        eyebrow: 'Service detail',
        title: 'AI Automation Workflows',
        description:
          'For teams that need to reduce repetitive delivery overhead and accelerate decision loops, with safe integration patterns and reproducible execution.',
        outcomesTitle: 'Outcome focus',
        outcomes: [
          'Faster iteration cycles across review and handover tasks',
          'Less manual handoff work in recurring operations',
          'Higher workflow transparency across priorities and status'
        ],
        deliverablesTitle: 'Typical deliverables',
        deliverables: [
          'Workflow map with bottleneck and risk analysis',
          'AI-assist chains for review, routing, and documentation',
          'Monitoring model for outcome and quality metrics'
        ],
        fitTitle: 'When this format fits',
        fit: [
          'Team velocity is slowed by manual coordination loops',
          'Recurring tasks are not standardized',
          'Scaling is blocked by weak process automation'
        ],
        faqTitle: 'FAQ',
        faq: [
          {
            question: 'Does this replace our current tools?',
            answer: 'No. The focus is integration into your current stack with clear handover logic.'
          },
          {
            question: 'How is workflow safety handled?',
            answer: 'With explicit access paths, review stages, and strict separation between assistance and final approval.'
          },
          {
            question: 'When do we see first effects?',
            answer: 'With a focused scope, measurable impact is often visible within the first 2 weeks.'
          }
        ],
        linksTitle: 'Related deep dives',
        links: [
          {
            label: 'Case: Configurator live',
            href: '/case-studies/configurator-live',
            kind: 'case'
          },
          {
            label: 'Insight: AI-assisted PR review loop',
            href: '/insights/ai-assisted-pr-review-loop',
            kind: 'insight'
          },
          {
            label: 'Playbook: API integration readiness',
            href: '/playbooks/api-integration-readiness-playbook',
            kind: 'playbook'
          }
        ],
        ctaPrimary: 'Request automation scope call',
        ctaSecondary: 'View case',
        ctaTertiary: 'Read playbook'
      }
    }
  },
  {
    slug: '3d-visualization-systems',
    seoTitle: {
      de: '3D Visualization Systems | ivo-tech',
      en: '3D Visualization Systems | ivo-tech'
    },
    seoDescription: {
      de: 'Interaktive 3D- und Visualisierungsstrecken für komplexe Produkte und konfigurative Angebotsprozesse.',
      en: 'Interactive 3D and visualization flows for complex products and configurative offer journeys.'
    },
    content: {
      de: {
        navLabel: '3D Visualization Systems',
        eyebrow: 'Service Detail',
        title: '3D Visualization Systems',
        description:
          'Für produktnahe Teams, die komplexe Angebote visuell erfassbar machen müssen. Fokus auf Viewer-Performance, klare Interaktion und saubere Integration in Business-Workflows.',
        outcomesTitle: 'Ergebnisfokus',
        outcomes: [
          'Bessere Produktverständlichkeit in frühen Entscheidungsphasen',
          'Kürzere Rückfrage-Schleifen durch visuelle Konfiguration',
          'Robuste Strecke von Visualisierung zu Preis/Checkout'
        ],
        deliverablesTitle: 'Typische Deliverables',
        deliverables: [
          '3D-Viewer-Konzept mit Performance- und UX-Guidelines',
          'Interaktionsmodell für Konfiguration und Variantenlogik',
          'Technische Integration in Pricing- oder Commerce-Flow'
        ],
        fitTitle: 'Wann dieses Format passt',
        fit: [
          'Produkte sind ohne Visualisierung schwer vermittelbar',
          'Angebotsprozess hat hohe technische Erklärungslast',
          'Konfiguration soll in einen kaufnahen Flow übergehen'
        ],
        faqTitle: 'FAQ',
        faq: [
          {
            question: 'Ist 3D nur für Showcases sinnvoll?',
            answer: 'Nein. Der größte Hebel entsteht, wenn 3D direkt mit Konfiguration, Preislogik und Angebotsprozess verbunden wird.'
          },
          {
            question: 'Wie wird Performance stabil gehalten?',
            answer: 'Durch modellseitige Optimierung, Lazy-Loading-Strategien und klar definierte Rendering-Budgets.'
          },
          {
            question: 'Kann das mit bestehendem Shop/Backend verbunden werden?',
            answer: 'Ja. Typischerweise über API- und Plugin-Schichten mit nachvollziehbarer Handover-Logik.'
          }
        ],
        linksTitle: 'Passende Vertiefungen',
        links: [
          {
            label: 'Case: Configurator live',
            href: '/case-studies/configurator-live',
            kind: 'case'
          },
          {
            label: 'Insight: API integration failure modes',
            href: '/insights/api-integration-failure-modes',
            kind: 'insight'
          },
          {
            label: 'Playbook: Handover production readiness',
            href: '/playbooks/handover-production-readiness-playbook',
            kind: 'playbook'
          }
        ],
        ctaPrimary: 'Scope-Call für 3D-System anfragen',
        ctaSecondary: 'Case ansehen',
        ctaTertiary: 'Playbook lesen'
      },
      en: {
        navLabel: '3D Visualization Systems',
        eyebrow: 'Service detail',
        title: '3D Visualization Systems',
        description:
          'For product-heavy teams that need to make complex offers understandable. Focus on viewer performance, intentional interaction, and clean integration into business workflows.',
        outcomesTitle: 'Outcome focus',
        outcomes: [
          'Higher product clarity in early buyer decisions',
          'Shorter clarification loops through visual configuration',
          'Stable path from visualization to pricing/checkout'
        ],
        deliverablesTitle: 'Typical deliverables',
        deliverables: [
          '3D viewer concept with performance and UX guidelines',
          'Interaction model for configuration and variant logic',
          'Technical integration with pricing or commerce flows'
        ],
        fitTitle: 'When this format fits',
        fit: [
          'Products are hard to communicate without visualization',
          'Offer process has high technical explanation overhead',
          'Configuration should connect to a purchase-ready journey'
        ],
        faqTitle: 'FAQ',
        faq: [
          {
            question: 'Is 3D only useful for visual showcase?',
            answer: 'No. The biggest impact comes when 3D is connected to configuration, pricing logic, and offer execution.'
          },
          {
            question: 'How do you keep performance stable?',
            answer: 'Through model optimization, lazy-loading strategy, and explicit rendering budgets.'
          },
          {
            question: 'Can this integrate with existing shop/backends?',
            answer: 'Yes. Usually via API and plugin layers with traceable handover logic.'
          }
        ],
        linksTitle: 'Related deep dives',
        links: [
          {
            label: 'Case: Configurator live',
            href: '/case-studies/configurator-live',
            kind: 'case'
          },
          {
            label: 'Insight: API integration failure modes',
            href: '/insights/api-integration-failure-modes',
            kind: 'insight'
          },
          {
            label: 'Playbook: Handover production readiness',
            href: '/playbooks/handover-production-readiness-playbook',
            kind: 'playbook'
          }
        ],
        ctaPrimary: 'Request 3D scope call',
        ctaSecondary: 'View case',
        ctaTertiary: 'Read playbook'
      }
    }
  }
];

export function getServiceDetailSlugs() {
  return SERVICE_DETAILS.map((entry) => entry.slug);
}

export function getServiceDetail(slug: string) {
  return SERVICE_DETAILS.find((entry) => entry.slug === slug) ?? null;
}

export function getLocalizedServiceDetail(locale: Locale, slug: string) {
  const service = getServiceDetail(slug);
  if (!service) return null;
  return {
    ...service,
    content: service.content[locale]
  };
}
