import type { Locale } from '@/content/copy';

export type ProjectId = 'configurator_3d' | 'voicebot' | 'sorare' | 'botsystem_lab' | 'iot_lab';
export type ProjectTier = 'hero' | 'featured' | 'labs';
export type ProjectMedia = 'dld3d' | 'voicebot' | 'sorare' | 'labs';
export type ProjectStatus = 'live' | 'beta' | 'in_dev' | 'private';

export type ProjectSpec = { label: string; value: string };
export type ProjectAction = {
  label: string;
  href: string;
  variant: 'primary' | 'secondary';
  external?: boolean;
};

export type CaseStudyKpi = {
  label: Record<Locale, string>;
  value: Record<Locale, string>;
  note?: Record<Locale, string>;
};

export type ProjectOutcomeMetric = {
  label: Record<Locale, string>;
  value: Record<Locale, string>;
};

export type ProjectTeaserMedia = {
  poster: string;
  videoWebm?: string;
  videoMp4?: string;
  duration: number;
  caption: Record<Locale, string>;
};

// Public card interface used by homepage sections.
export type ProjectCard = {
  title: Record<Locale, string>;
  one_liner: Record<Locale, string>;
  business_outcome: Record<Locale, string>;
  proof_statement: Record<Locale, string>;
  seo_title: Record<Locale, string>;
  seo_description: Record<Locale, string>;
  outcome_metrics: ProjectOutcomeMetric[];
  status: ProjectStatus;
  stack_tags: string[];
  proof_link?: string;
  indexable?: boolean;
  media?: ProjectTeaserMedia;
};

// Structured case-study interface for premium writeups.
export type CaseStudySection = {
  kpis: CaseStudyKpi[];
  problem: Record<Locale, string[]>;
  solution: Record<Locale, string[]>;
  technology: Record<Locale, string[]>;
  impact: Record<Locale, string[]>;
  media_assets: Record<Locale, string[]>;
};

export type BadgeTaxonomy = Record<ProjectStatus, Record<Locale, string>>;

export const badgeTaxonomy: BadgeTaxonomy = {
  live: { de: 'Live', en: 'Live' },
  beta: { de: 'Private Beta', en: 'Private beta' },
  in_dev: { de: 'In Entwicklung', en: 'In development' },
  private: { de: 'Internal', en: 'Internal' }
};

export type Project = ProjectCard & {
  id: ProjectId;
  tier: ProjectTier;
  thumbSrc: string;
  techLine: Record<Locale, string>;
  attribution_note?: Record<Locale, string>;
  engineering_highlights?: Record<Locale, string[]>;
  modal: {
    title: Record<Locale, string>;
    desc: Record<Locale, string>;
    specs: Record<Locale, ProjectSpec[]>;
    actions: Record<Locale, ProjectAction[]>;
    media: ProjectMedia;
  };
  case_study?: CaseStudySection;
};

export const projects: Project[] = [
  {
    id: 'configurator_3d',
    tier: 'hero',
    status: 'live',
    thumbSrc: '/assets/thumb_viewer_neon.png',
    title: {
      de: '3D-Konfigurator fuer Datei-zu-Angebot-Workflows im Live-Betrieb',
      en: '3D configurator for live file-to-quote workflows'
    },
    one_liner: {
      de: 'Ich habe einen produktionsfaehigen 3D-Konfigurator fuer Datei-zu-Angebot-Workflows entwickelt: Upload, Geometrie-Analyse, Preislogik und WooCommerce-Handoff in einem durchgaengigen Web-Flow.',
      en: 'I built a production-ready 3D configurator for file-to-quote workflows: upload, geometry analysis, pricing logic, and WooCommerce handoff in one continuous web flow.'
    },
    business_outcome: {
      de: 'Das System reduziert manuelle Rueckfrage-Schleifen bei Standardanfragen und schafft einen klaren Pfad von Modellpruefung zu Kaufentscheidung.',
      en: 'The system reduces manual back-and-forth for standard requests and creates a clear path from model review to purchase decision.'
    },
    proof_statement: {
      de: 'Der Live-Flow von Upload bis Checkout laeuft stabil im realen Shopbetrieb.',
      en: 'The live flow from upload to checkout runs stably in production shop operations.'
    },
    seo_title: {
      de: '3D-Konfigurator Case Study | ivo-tech',
      en: '3D Configurator Case Study | ivo-tech'
    },
    seo_description: {
      de: 'Tech-first Case Study: WebGL/Three.js Viewer, Plugin-Architektur, Preis-Engine und WooCommerce-Handoff im produktiven Flow.',
      en: 'Tech-first case study: WebGL/Three.js viewer, plugin architecture, pricing engine, and WooCommerce handoff in a production flow.'
    },
    outcome_metrics: [
      {
        label: { de: 'Live-Prozess', en: 'Live process' },
        value: {
          de: 'Upload -> Analyse -> Preis -> Checkout ist produktiv im Kundenprojekt integriert.',
          en: 'Upload -> analysis -> pricing -> checkout is integrated in live client operations.'
        }
      },
      {
        label: { de: 'Prozessqualitaet', en: 'Process quality' },
        value: {
          de: 'Self-service ersetzt standardisierte Rueckfrage-Schleifen und macht Anfragen reproduzierbar.',
          en: 'Self-service replaces standard back-and-forth loops and keeps requests reproducible.'
        }
      }
    ],
    stack_tags: ['THREE.JS', 'WORDPRESS', 'WOOCOMMERCE', 'DOCKER'],
    proof_link: 'https://deinlieblingsdruck.de/3d-konfigurator/#preisrechner',
    media: {
      poster: '/assets/thumb_viewer_neon.avif',
      videoWebm: '/assets/video/hero-case-teaser.webm',
      videoMp4: '/assets/video/hero-case-teaser.mp4',
      duration: 36,
      caption: {
        de: '36s Brand-Teaser: Authority-first Engineering von Proof bis Live-Handoff.',
        en: '36s brand teaser: authority-first engineering from proof to live handoff.'
      }
    },
    techLine: {
      de: 'THREE.JS / WEBGL | WORDPRESS PLUGIN | PRICING ENGINE | WOOCOMMERCE',
      en: 'THREE.JS / WEBGL | WORDPRESS PLUGIN | PRICING ENGINE | WOOCOMMERCE'
    },
    attribution_note: {
      de: 'Technische Umsetzung: ivo-tech. Betrieb und Vermarktung erfolgen beim Kunden.',
      en: 'Technical implementation by ivo-tech. Platform operations and commercial ownership remain with the client.'
    },
    engineering_highlights: {
      de: [
        'WebGL-/Three.js-Viewer mit STL/3MF Upload und interaktiver Modellinspektion.',
        'WordPress Plugin-Architektur mit AJAX-Endpunkten fuer Analyse- und Preis-Kontext.',
        'Preis-Engine mit Material-, Qualitaets- und Mengenlogik fuer reproduzierbare Angebotsstrecken.',
        'WooCommerce-Handoff fuer den medienbruchfreien Uebergang in den Checkout.'
      ],
      en: [
        'WebGL/Three.js viewer with STL/3MF upload and interactive model inspection.',
        'WordPress plugin architecture with AJAX endpoints for analysis and pricing context.',
        'Pricing engine with material, quality, and quantity logic for reproducible quote flows.',
        'WooCommerce handoff for context-preserving transition into checkout.'
      ]
    },
    modal: {
      title: { de: '3D-KONFIGURATOR (LIVE)', en: '3D CONFIGURATOR (LIVE)' },
      desc: {
        de: 'Tech-first Delivery fuer ein Kundenprojekt: browserbasierte 3D-Analyse, Plugin-Backbone fuer Preislogik und stabiler Checkout-Handoff.',
        en: 'Tech-first delivery for a client project: browser-based 3D analysis, plugin backbone for pricing logic, and stable checkout handoff.'
      },
      specs: {
        de: [
          { label: 'Problem', value: 'Manuelle Angebotsrunden waren langsam und schwer skalierbar.' },
          { label: 'Loesung', value: 'Datei-zu-Preis als gefuehrter Self-service Flow im Browser.' },
          { label: '3D Frontend', value: 'Three.js/WebGL Viewer, Orbit Controls, STL/3MF Verarbeitung.' },
          { label: 'Plugin-Backend', value: 'WordPress Plugin mit AJAX-Endpunkten fuer Analyse und Pricing-Kontext.' },
          { label: 'Pricing Engine', value: 'Material-, Qualitaets-, Mengen- und Mindestpreislogik fuer reproduzierbare Ergebnisse.' },
          { label: 'Commerce', value: 'WooCommerce Cart/Order-Handoff ohne Medienbruch.' }
        ],
        en: [
          { label: 'Problem', value: 'Manual quote loops were slow and hard to scale.' },
          { label: 'Solution', value: 'File-to-price as a guided self-service browser flow.' },
          { label: '3D Frontend', value: 'Three.js/WebGL viewer, orbit controls, STL/3MF processing.' },
          { label: 'Plugin Backend', value: 'WordPress plugin with AJAX endpoints for analysis and pricing context.' },
          { label: 'Pricing Engine', value: 'Material, quality, quantity, and minimum-price logic for reproducible outputs.' },
          { label: 'Commerce', value: 'WooCommerce cart/order handoff without context switching.' }
        ]
      },
      actions: {
        de: [
          {
            label: 'Live Konfigurator',
            href: 'https://deinlieblingsdruck.de/3d-konfigurator/#preisrechner',
            variant: 'primary',
            external: true
          },
          { label: 'Case Study', href: '/configurator', variant: 'secondary' }
        ],
        en: [
          {
            label: 'Live configurator',
            href: 'https://deinlieblingsdruck.de/3d-konfigurator/#preisrechner',
            variant: 'primary',
            external: true
          },
          { label: 'Case study', href: '/configurator', variant: 'secondary' }
        ]
      },
      media: 'dld3d'
    },
    case_study: {
      kpis: [
        {
          label: { de: 'Live Flow', en: 'Live flow' },
          value: {
            de: 'Upload -> Analyse -> Preis -> Checkout laeuft produktiv im Kundenprojekt.',
            en: 'Upload -> analysis -> pricing -> checkout runs in production client operations.'
          },
          note: {
            de: 'Qualitativer Proof aus laufendem Shopbetrieb.',
            en: 'Qualitative proof from ongoing production operations.'
          }
        },
        {
          label: { de: 'Engineering Scope', en: 'Engineering scope' },
          value: {
            de: 'Viewer, Plugin-Backend, Pricing-Engine und WooCommerce-Handoff wurden als ein System umgesetzt.',
            en: 'Viewer, plugin backend, pricing engine, and WooCommerce handoff were delivered as one system.'
          },
          note: {
            de: 'Technische Umsetzung durch ivo-tech.',
            en: 'Technical implementation by ivo-tech.'
          }
        },
        {
          label: { de: 'Operational Fit', en: 'Operational fit' },
          value: {
            de: 'Standardanfragen laufen gefuehrt statt ueber manuelle Rueckfrage-Schleifen.',
            en: 'Standard requests run in a guided flow instead of manual back-and-forth loops.'
          },
          note: {
            de: 'Fokus auf reproduzierbare Bearbeitung pro Anfrage.',
            en: 'Focus on reproducible handling per request.'
          }
        }
      ],
      problem: {
        de: [
          'Angebote fuer 3D-Druck liefen manuell und verursachten wiederkehrende Rueckfrage-Schleifen.',
          'Kunden brauchten eine schnelle, nachvollziehbare Preisorientierung direkt nach dem Upload.'
        ],
        en: [
          '3D-print quotes were handled manually and created repeated back-and-forth loops.',
          'Customers needed fast, traceable pricing orientation immediately after upload.'
        ]
      },
      solution: {
        de: [
          'Webbasierter Konfigurator mit Modell-Upload, Geometrieanalyse und regelbasierter Preislogik.',
          'Direkte Uebergabe der Konfiguration in den WooCommerce-Kaufprozess.'
        ],
        en: [
          'Web configurator with model upload, geometry analysis, and rule-based pricing logic.',
          'Direct handoff from configuration into the WooCommerce checkout flow.'
        ]
      },
      technology: {
        de: [
          'Frontend: Three.js/WebGL Viewer mit STL-/3MF-Verarbeitung und interaktiver Modellsteuerung.',
          'Backend: WordPress Plugin mit AJAX-Endpunkten fuer Analyse, Preis-Context und Repricing.',
          'Pricing: Material-, Qualitaets-, Farb- und Mengenlogik fuer reproduzierbare Angebotsausgabe.',
          'Commerce: WooCommerce Cart/Order-Handoff mit sauberer Konfigurationsuebergabe.'
        ],
        en: [
          'Frontend: Three.js/WebGL viewer with STL/3MF processing and interactive model controls.',
          'Backend: WordPress plugin with AJAX endpoints for analysis, pricing context, and repricing.',
          'Pricing: material, quality, color, and quantity logic for reproducible quote outputs.',
          'Commerce: WooCommerce cart/order handoff with clean configuration transfer.'
        ]
      },
      impact: {
        de: [
          'Durchgaengiger Live-Flow vom Upload bis zum Checkout ohne Medienbruch.',
          'Weniger manuelle Rueckfragen bei Standardanfragen und klarere Entscheidungswege fuer Kunden.',
          'Rollenklarheit: Technische Umsetzung durch ivo-tech, Betrieb beim Kunden.'
        ],
        en: [
          'End-to-end live flow from upload to checkout without context switching.',
          'Fewer manual loops for standard requests and clearer decision paths for customers.',
          'Clear role split: technical implementation by ivo-tech, operations by the client.'
        ]
      },
      media_assets: {
        de: [
          'Screen 1: Modell-Upload + 3D-Inspektion im Viewer',
          'Screen 2: Material/Qualitaet/Farbe + Preisreaktion',
          'Screen 3: Konfigurationsuebergabe in Cart/Checkout',
          'Optional: 30-45s Walkthrough mit Engineering-Kommentar'
        ],
        en: [
          'Screen 1: model upload + 3D inspection in the viewer',
          'Screen 2: material/quality/color + pricing response',
          'Screen 3: configuration handoff into cart/checkout',
          'Optional: 30-45s walkthrough with engineering commentary'
        ]
      }
    }
  },
  {
    id: 'voicebot',
    tier: 'featured',
    status: 'beta',
    thumbSrc: '/assets/thumb_voicebot.svg',
    title: {
      de: 'Voicebot Einwilligungs-Orchestrator',
      en: 'Voicebot consent orchestrator'
    },
    one_liner: {
      de: 'Mehrstufige Sprach- und Prozessorchestrierung fuer DE/EU-Einwilligungsflows.',
      en: 'Multi-step voice and process orchestration for DE/EU consent workflows.'
    },
    business_outcome: {
      de: 'Nachvollziehbare Consent-Ablaufkette mit sauberer Agent-Unterstuetzung.',
      en: 'Auditable consent flow chain with clear agent support.'
    },
    proof_statement: {
      de: 'Der Consent-Prozess ist als mehrstufige, versionierte Kette mit Audit-Log strukturiert.',
      en: 'The consent process is structured as a multi-step, versioned flow with audit logging.'
    },
    seo_title: {
      de: 'Voicebot Consent Orchestrator | ivo-tech',
      en: 'Voicebot Consent Orchestrator | ivo-tech'
    },
    seo_description: {
      de: 'Private-Beta Referenz fuer Einwilligungs-Orchestrierung mit API-, Voice- und Audit-Fokus.',
      en: 'Private-beta reference for consent orchestration with API, voice, and audit focus.'
    },
    outcome_metrics: [
      {
        label: { de: 'Beta-Status', en: 'Beta status' },
        value: {
          de: 'Private Beta mit mehrstufigem Consent-Flow und Audit-Log aktiv.',
          en: 'Private beta with multi-step consent flow and active audit logging.'
        }
      },
      {
        label: { de: 'Systemwirkung', en: 'System impact' },
        value: {
          de: 'Einwilligungsschritte sind strukturiert, versioniert und im Prozess nachvollziehbar.',
          en: 'Consent steps are structured, versioned, and traceable in the process.'
        }
      }
    ],
    stack_tags: ['FASTAPI', 'SPEECH API', 'TWILIO', 'CISCO FINESSE'],
    techLine: { de: 'FASTAPI | SPEECH API | TWILIO | ORCHESTRATION', en: 'FASTAPI | SPEECH API | TWILIO | ORCHESTRATION' },
    modal: {
      title: { de: 'VOICEBOT ORCHESTRATOR', en: 'VOICEBOT ORCHESTRATOR' },
      desc: {
        de: 'Private-Beta-Plattform fuer Einwilligungsdialoge: Orchestrator-API, Agent-Companion und versionierte Speech-Pipeline.',
        en: 'Private-beta platform for consent dialogs: orchestrator API, agent companion, and versioned audio pipeline.'
      },
      specs: {
        de: [
          { label: 'Scope', value: 'AGB/Consent Orchestrierung fuer Legacy-Callcenter-Kontext.' },
          { label: 'API', value: 'FastAPI, Datenmodelle, Auditierbarkeit pro Flow-Schritt.' },
          { label: 'Voice', value: 'Speech-to-Text/Text-to-Speech + Twilio Call-Pipeline.' },
          { label: 'Ops', value: 'Tests: Unit/Integration/E2E + Non-Functional.' }
        ],
        en: [
          { label: 'Scope', value: 'Consent orchestration for a legacy call-center context.' },
          { label: 'API', value: 'FastAPI, data models, auditable step-based flows.' },
          { label: 'Voice', value: 'Speech-to-text/text-to-speech + Twilio call pipeline.' },
          { label: 'Ops', value: 'Test coverage: unit/integration/e2e + non-functional.' }
        ]
      },
      actions: {
        de: [{ label: 'Private Beta anfragen', href: 'mailto:contact@ivo-tech.com', variant: 'primary' }],
        en: [{ label: 'Request private beta', href: 'mailto:contact@ivo-tech.com', variant: 'primary' }]
      },
      media: 'voicebot'
    }
  },
  {
    id: 'sorare',
    tier: 'featured',
    status: 'in_dev',
    thumbSrc: '/assets/thumb_sorare.svg',
    title: { de: 'Sorare NBA Edge Tool', en: 'Sorare NBA Edge Tool' },
    one_liner: {
      de: 'Datenprodukt mit Projektionen, Optimierung und Monte-Carlo-Simulation.',
      en: 'Data product with projections, optimization, and Monte Carlo simulation.'
    },
    business_outcome: {
      de: 'Bessere Entscheidungen durch transparente Scores, Unsicherheit und Szenarien.',
      en: 'Better decisions through transparent scores, uncertainty, and scenarios.'
    },
    proof_statement: {
      de: 'Das MVP kombiniert Projektionen, Scoring und Optimierung in einem durchgaengigen Entscheidungsfluss.',
      en: 'The MVP combines projections, scoring, and optimization in one decision workflow.'
    },
    seo_title: {
      de: 'Sorare NBA Edge Tool | ivo-tech',
      en: 'Sorare NBA Edge Tool | ivo-tech'
    },
    seo_description: {
      de: 'Datenprodukt in Entwicklung mit Projektionen, OR-Tools-Optimierung und Monte-Carlo-Szenarien.',
      en: 'In-development data product with projections, OR-Tools optimization, and Monte Carlo scenarios.'
    },
    outcome_metrics: [
      {
        label: { de: 'MVP-Umfang', en: 'MVP scope' },
        value: {
          de: 'Projektionen, Value-Scoring und Lineup-Optimierung in einem Web-Flow kombiniert.',
          en: 'Projections, value scoring, and lineup optimization combined in one web flow.'
        }
      },
      {
        label: { de: 'Entscheidungsnutzen', en: 'Decision value' },
        value: {
          de: 'Szenarien zeigen Risiko/Upside transparent fuer die Auswahlentscheidung.',
          en: 'Scenarios expose risk/upside transparently for lineup decisions.'
        }
      }
    ],
    stack_tags: ['NEXT.JS', 'PYTHON', 'FASTAPI', 'OR-TOOLS'],
    techLine: { de: 'NEXT.JS | FASTAPI | PYTHON | OR-TOOLS', en: 'NEXT.JS | FASTAPI | PYTHON | OR-TOOLS' },
    modal: {
      title: { de: 'SORARE EDGE (IN ENTWICKLUNG)', en: 'SORARE EDGE (IN DEVELOPMENT)' },
      desc: {
        de: 'MVP fuer datengetriebene Lineup-Entscheidungen: Baseline-Projektionen, Value-Scoring und Optimierung.',
        en: 'MVP for data-driven lineup decisions: baseline projections, value scoring, and optimization.'
      },
      specs: {
        de: [
          { label: 'Data', value: 'Historische/aktuelle Inputs zu Performance und Matchups.' },
          { label: 'Modeling', value: 'Baseline + Unsicherheit + Value Score.' },
          { label: 'Optimization', value: 'Lineup-Optimierung via OR-Tools.' },
          { label: 'Simulation', value: 'Monte-Carlo fuer Risiko-/Upside-Sicht.' }
        ],
        en: [
          { label: 'Data', value: 'Historical/current inputs for player performance and matchups.' },
          { label: 'Modeling', value: 'Baseline + uncertainty + value score.' },
          { label: 'Optimization', value: 'Lineup optimization via OR-Tools.' },
          { label: 'Simulation', value: 'Monte Carlo for risk/upside perspective.' }
        ]
      },
      actions: {
        de: [{ label: 'Projektstatus anfragen', href: 'mailto:contact@ivo-tech.com', variant: 'primary' }],
        en: [{ label: 'Request project status', href: 'mailto:contact@ivo-tech.com', variant: 'primary' }]
      },
      media: 'sorare'
    }
  },
  {
    id: 'botsystem_lab',
    tier: 'labs',
    status: 'in_dev',
    thumbSrc: '/assets/thumb_labs.svg',
    title: { de: 'Botsystem Lab', en: 'Botsystem lab' },
    one_liner: {
      de: 'Experimentelle Messaging-Orchestrierung mit Rollen, Tiers und Admin-UI.',
      en: 'Experimental messaging orchestration with roles, tiers, and admin UI.'
    },
    business_outcome: {
      de: 'Lab fuer Subscription-Logik, Berechtigungen und Operator-Workflows.',
      en: 'Lab for subscription logic, permissions, and operator workflows.'
    },
    proof_statement: {
      de: 'Das Lab bildet reale Rollen- und Admin-Flows in einer kontrollierten Umgebung nach.',
      en: 'The lab reproduces role and admin workflows in a controlled environment.'
    },
    seo_title: {
      de: 'Botsystem Lab | ivo-tech',
      en: 'Botsystem Lab | ivo-tech'
    },
    seo_description: {
      de: 'Experimentelles Messaging-Lab fuer Rollen, Tiering und Admin-Prozesse.',
      en: 'Experimental messaging lab for roles, tiering, and admin workflows.'
    },
    indexable: false,
    outcome_metrics: [
      {
        label: { de: 'Lab-Fokus', en: 'Lab focus' },
        value: {
          de: 'Rollen, Tiering und Admin-Prozesse als kontrollierte Experimente.',
          en: 'Roles, tiering, and admin processes explored as controlled experiments.'
        }
      }
    ],
    stack_tags: ['PYTHON', 'POSTGRES', 'TELEGRAM', 'DOCKER'],
    techLine: { de: 'PYTHON | POSTGRES | TELEGRAM | ADMIN UI', en: 'PYTHON | POSTGRES | TELEGRAM | ADMIN UI' },
    modal: {
      title: { de: 'BOTSYSTEM LAB', en: 'BOTSYSTEM LAB' },
      desc: {
        de: 'Nicht als Kernangebot positioniert: bewusst als Experimentierflaeche fuer Messaging-Automation und Admin-Prozesse.',
        en: 'Not positioned as core offering: intentionally framed as a lab for messaging automation and admin workflows.'
      },
      specs: {
        de: [
          { label: 'Status', value: 'Lab / nicht als primaeres Portfolio-Angebot.' },
          { label: 'Fokus', value: 'Tiering, User-Lifecycle, Operator-Workflows.' },
          { label: 'Architektur', value: 'Bot-Core + Web Admin + PostgreSQL.' }
        ],
        en: [
          { label: 'Status', value: 'Lab / not positioned as a primary portfolio offer.' },
          { label: 'Focus', value: 'Tiering, user lifecycle, operator workflows.' },
          { label: 'Architecture', value: 'Bot core + web admin + PostgreSQL.' }
        ]
      },
      actions: {
        de: [{ label: 'Kontakt', href: 'mailto:contact@ivo-tech.com', variant: 'secondary' }],
        en: [{ label: 'Contact', href: 'mailto:contact@ivo-tech.com', variant: 'secondary' }]
      },
      media: 'labs'
    }
  },
  {
    id: 'iot_lab',
    tier: 'labs',
    status: 'in_dev',
    thumbSrc: '/assets/thumb_labs.svg',
    title: { de: 'IoT / Edge Automation Lab', en: 'IoT / edge automation lab' },
    one_liner: {
      de: 'ESP32- und Home-Assistant-Experimente fuer Edge-Automation und lokale Integrationen.',
      en: 'ESP32 and Home Assistant experiments for edge automation and local integrations.'
    },
    business_outcome: {
      de: 'Rapid-Prototyping fuer sensorbasierte Flows und lokale Service-Orchestrierung.',
      en: 'Rapid prototyping for sensor-driven flows and local service orchestration.'
    },
    proof_statement: {
      de: 'Das Lab prueft Edge-Integrationen iterativ und dokumentiert betriebliche Runbooks.',
      en: 'The lab validates edge integrations iteratively and documents operational runbooks.'
    },
    seo_title: {
      de: 'IoT Edge Automation Lab | ivo-tech',
      en: 'IoT Edge Automation Lab | ivo-tech'
    },
    seo_description: {
      de: 'ESP32- und Home-Assistant-Lab fuer Edge-Automation und lokale Integrationen.',
      en: 'ESP32 and Home Assistant lab for edge automation and local integrations.'
    },
    indexable: false,
    outcome_metrics: [
      {
        label: { de: 'Lab-Fokus', en: 'Lab focus' },
        value: {
          de: 'Schnelle Edge-Prototypen fuer Sensorik und lokale Integrationen.',
          en: 'Rapid edge prototypes for sensing and local integrations.'
        }
      }
    ],
    stack_tags: ['ESP32', 'HOME ASSISTANT', 'DOCKER', 'CADDY'],
    techLine: { de: 'ESP32 | HOME ASSISTANT | EDGE INTEGRATIONS', en: 'ESP32 | HOME ASSISTANT | EDGE INTEGRATIONS' },
    modal: {
      title: { de: 'IOT/EDGE LAB', en: 'IOT/EDGE LAB' },
      desc: {
        de: 'Zusammengefasster Labs-Block: Hardware-nahe Prototypen, Serviceverkettung und Betriebs-Runbooks.',
        en: 'Consolidated labs block: hardware-adjacent prototypes, service chaining, and operational runbooks.'
      },
      specs: {
        de: [
          { label: 'Scope', value: 'ESP32 Sensorik + Home Assistant Automationen.' },
          { label: 'Methode', value: 'Schnelles Testen, kurze Iterationsschleifen, dokumentierte Runbooks.' },
          { label: 'Rolle', value: 'Sekundaersignal fuer Systems/Embedded-Prototyping.' }
        ],
        en: [
          { label: 'Scope', value: 'ESP32 sensing + Home Assistant automations.' },
          { label: 'Method', value: 'Fast testing loops with documented runbooks.' },
          { label: 'Role', value: 'Secondary signal for systems/embedded prototyping.' }
        ]
      },
      actions: {
        de: [{ label: 'Kontakt', href: 'mailto:contact@ivo-tech.com', variant: 'secondary' }],
        en: [{ label: 'Contact', href: 'mailto:contact@ivo-tech.com', variant: 'secondary' }]
      },
      media: 'labs'
    }
  }
];

export function getProjectById(id: string | null | undefined): Project | null {
  if (!id) return null;
  return projects.find((p) => p.id === id) ?? null;
}

export function getProjectStatusLabel(status: ProjectStatus, locale: Locale): string {
  return badgeTaxonomy[status][locale];
}

export function getProjectsByTier(tier: ProjectTier): Project[] {
  return projects.filter((p) => p.tier === tier);
}

export function getIndexableProjects(): Project[] {
  return projects.filter((p) => p.indexable !== false);
}
