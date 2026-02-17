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
      de: '3D-Konfigurator fuer 3D-Druck-Angebote in Echtzeit',
      en: '3D configurator for real-time print quotations'
    },
    one_liner: {
      de: 'Live Business System: Upload, Analyse, Preislogik und WooCommerce-Checkout in einem Flow.',
      en: 'Live business system: upload, analysis, pricing logic, and WooCommerce checkout in one flow.'
    },
    business_outcome: {
      de: 'Schneller von Datei zu Preisangebot, weniger manueller Angebotsaufwand, klarer Conversion-Pfad.',
      en: 'Faster file-to-quote journey, lower manual quoting effort, and a clear conversion path.'
    },
    proof_statement: {
      de: 'Die End-to-End Strecke (Upload bis Checkout) ist im realen Shopbetrieb aktiv und stabil.',
      en: 'The end-to-end journey (upload to checkout) runs in a live production shop.'
    },
    seo_title: {
      de: '3D-Konfigurator Case Study | IVO TECH',
      en: '3D Configurator Case Study | IVO TECH'
    },
    seo_description: {
      de: 'Qualitative Case Study: Upload, Analyse, Preislogik und WooCommerce-Handoff in einem produktiven 3D-Flow.',
      en: 'Qualitative case study: upload, analysis, pricing logic, and WooCommerce handoff in one production 3D flow.'
    },
    outcome_metrics: [
      {
        label: { de: 'Live-Einsatz', en: 'Live usage' },
        value: {
          de: 'Der Konfigurator ist produktiv im Shop eingebunden (Upload -> Preis -> Checkout).',
          en: 'The configurator is integrated in production (upload -> pricing -> checkout).'
        }
      },
      {
        label: { de: 'Prozesswirkung', en: 'Process impact' },
        value: {
          de: 'Self-service Flow ersetzt Rueckruf-/Mail-Schleifen bei Standardanfragen.',
          en: 'Self-service flow replaces callback/email loops for standard requests.'
        }
      }
    ],
    stack_tags: ['THREE.JS', 'WORDPRESS', 'WOOCOMMERCE', 'DOCKER'],
    proof_link: 'https://deinlieblingsdruck.de/3d-konfigurator/#preisrechner',
    techLine: {
      de: 'THREE.JS | WORDPRESS | WOOCOMMERCE | PRICING LOGIC',
      en: 'THREE.JS | WORDPRESS | WOOCOMMERCE | PRICING LOGIC'
    },
    modal: {
      title: { de: '3D-KONFIGURATOR (LIVE)', en: '3D CONFIGURATOR (LIVE)' },
      desc: {
        de: 'Produktionstaugliche Konfigurator-Architektur: 3D-Analyse im Browser, Material/Preset/Color-Logik und Uebergabe in WooCommerce.',
        en: 'Production-oriented configurator architecture: browser-based 3D analysis, material/preset/color logic, and WooCommerce handoff.'
      },
      specs: {
        de: [
          { label: 'Problem', value: 'Manuelle Angebote waren langsam und schlecht skalierbar.' },
          { label: 'Loesung', value: 'Self-service Preislogik direkt am 3D-Modell.' },
          { label: 'Frontend', value: 'Three.js Viewer, Orbit Controls, STL/3MF Handling.' },
          { label: 'Backend', value: 'WordPress Plugin + AJAX-Endpunkte fuer Preis-/Analysepfade.' },
          { label: 'Commerce', value: 'WooCommerce Cart/Order Integration.' },
          { label: 'Betrieb', value: 'PrusaSlicer-/Docker-Pipeline fuer reproduzierbare Verarbeitung.' }
        ],
        en: [
          { label: 'Problem', value: 'Manual quoting was slow and hard to scale.' },
          { label: 'Solution', value: 'Self-service pricing logic directly on the 3D model.' },
          { label: 'Frontend', value: 'Three.js viewer, orbit controls, STL/3MF handling.' },
          { label: 'Backend', value: 'WordPress plugin + AJAX endpoints for pricing/analysis.' },
          { label: 'Commerce', value: 'WooCommerce cart/order integration.' },
          { label: 'Operations', value: 'PrusaSlicer/docker pipeline for reproducible processing.' }
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
          label: { de: 'Time-to-Quote (TTR)', en: 'Time-to-quote (TTR)' },
          value: { de: 'Messstrecke live seit Februar 2026', en: 'Measurement pipeline live since February 2026' },
          note: {
            de: 'Erste 30-Tage-Auswertung wird fortlaufend aktualisiert.',
            en: 'First 30-day review is updated continuously.'
          }
        },
        {
          label: { de: 'Checkout-Handoff', en: 'Checkout handoff' },
          value: {
            de: 'Konfiguration wird ohne Medienbruch in WooCommerce uebergeben.',
            en: 'Configuration is handed off into WooCommerce without context switching.'
          },
          note: {
            de: 'Live in der Produktionsumgebung.',
            en: 'Live in the production environment.'
          }
        },
        {
          label: { de: 'Angebotsprozess', en: 'Quoting process' },
          value: {
            de: 'Von manueller Rueckfrage auf gefuehrten Online-Flow umgestellt.',
            en: 'Moved from manual back-and-forth to a guided online flow.'
          },
          note: {
            de: 'Fokus auf reproduzierbare Bearbeitung pro Anfrage.',
            en: 'Focus on reproducible handling per request.'
          }
        }
      ],
      problem: {
        de: [
          'Manuelle Angebotserstellung fuer 3D-Druck war zeitintensiv und inkonsistent.',
          'Kunden brauchten schnelle Preisorientierung statt Rueckruf-/Mail-Schleifen.'
        ],
        en: [
          'Manual 3D-print quotation was time-consuming and inconsistent.',
          'Customers needed instant pricing orientation instead of callback/email loops.'
        ]
      },
      solution: {
        de: [
          'Webbasierter Konfigurator mit Modell-Upload, Analyse und Preisberechnung.',
          'Direkte Uebergabe der Konfiguration in den Kaufprozess.'
        ],
        en: [
          'Web configurator with model upload, analysis, and pricing.',
          'Direct handoff from configuration into checkout.'
        ]
      },
      technology: {
        de: [
          'Frontend: 3D-Interaktion und Visualisierung mit Three.js.',
          'Backend: WordPress Plugin mit AJAX-Endpunkten.',
          'Commerce: WooCommerce Preis-/Cart-Integration.',
          'Verarbeitung: Docker-gestuetzte Slicing-/Analysepipeline.'
        ],
        en: [
          'Frontend: 3D interaction and visualization with Three.js.',
          'Backend: WordPress plugin with AJAX endpoints.',
          'Commerce: WooCommerce pricing/cart integration.',
          'Processing: docker-backed slicing/analysis pipeline.'
        ]
      },
      impact: {
        de: [
          'Live-Integration vom Upload bis zum Checkout ohne Medienbruch.',
          'Klarerer Funnel fuer Kunden und weniger manuelle Rueckfragen im Angebotsprozess.'
        ],
        en: [
          'Live integration from upload to checkout without context switching.',
          'Clearer customer funnel and fewer manual loops in the quoting process.'
        ]
      },
      media_assets: {
        de: [
          'Screen 1: Upload + 3D-Ansicht',
          'Screen 2: Material/Optionen + Echtzeitpreis',
          'Screen 3: Uebergabe in Warenkorb/Kaufprozess',
          'Optional: 30-45s Walkthrough-Video'
        ],
        en: [
          'Screen 1: upload + 3D viewport',
          'Screen 2: material/options + real-time pricing',
          'Screen 3: handoff into cart/checkout',
          'Optional: 30-45s walkthrough video'
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
      de: 'Voicebot Consent Orchestrator | IVO TECH',
      en: 'Voicebot Consent Orchestrator | IVO TECH'
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
      de: 'Sorare NBA Edge Tool | IVO TECH',
      en: 'Sorare NBA Edge Tool | IVO TECH'
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
      de: 'Botsystem Lab | IVO TECH',
      en: 'Botsystem Lab | IVO TECH'
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
      de: 'IoT Edge Automation Lab | IVO TECH',
      en: 'IoT Edge Automation Lab | IVO TECH'
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
