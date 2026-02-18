export const copy = {
  de: {
    meta: {
      title: 'IVO TECH | Web Engineering, Delivery-Exzellenz und klare Architektur',
      description:
        'Portfolio fuer Web Engineering: klare Architekturentscheidungen, messbare Qualitaet und reproduzierbare Delivery fuer Teams, die sauber bauen und stabil betreiben wollen.'
    },
    nav: {
      heroCase: 'Case Study',
      featured: 'Projekte',
      paths: 'Pfade',
      insights: 'Insights',
      contact: 'Kontakt',
      cta: 'Architekturgespraech'
    },
    hero: {
      eyebrow: 'Authority-first Web Engineering | Mannheim | Remote-first',
      title: 'Ich baue Websysteme, die technisch sauber starten und im Betrieb stabil bleiben.',
      lead:
        'Der Fokus liegt auf nachvollziehbaren Entscheidungen, klarer Informationsarchitektur und messbarer Qualitaet statt auf Buzzwords.',
      sublead:
        'So entstehen Gespraeche aus Vertrauen in die Denkweise - nicht aus Sales-Druck.',
      primary: 'Architekturgespraech anfragen',
      secondary: 'Case Study mit Messwerten ansehen',
      audit: 'Kostenlose 10-Punkte Tech-Review',
      linksLabel: 'Direktlinks',
      github: 'GitHub',
      cv: 'CV (PDF)',
      terminal: {
        title: 'decision.log',
        lines: [
          'principle: clarity before complexity',
          'proof: live 3D configurator in production',
          'method: plan -> build -> measure -> handover',
          'availability: 2 deep-dive slots / month'
        ]
      }
    },
    proof: {
      title: 'Proof statt Behauptung',
      desc: 'Drei Signale, die fuer Arbeitsweise und Ergebnisqualitaet stehen.',
      items: [
        {
          id: 'live-system',
          metric: 'Live-System im Betrieb',
          detail: '3D-Konfigurator ist produktiv integriert - von Upload ueber Pricing bis Checkout.',
          cta: 'Case Study oeffnen',
          href: '/configurator'
        },
        {
          id: 'delivery-discipline',
          metric: 'Delivery mit Struktur',
          detail: 'Klare Scope-Abgrenzung, transparente Updates und reproduzierbare Uebergaben.',
          cta: 'Arbeitsweise ansehen',
          href: '#method'
        },
        {
          id: 'quality-guardrails',
          metric: 'Messbare Qualitaets-Gates',
          detail: 'Lint, Typing, Unit, E2E und Lighthouse laufen als feste Qualitaetsstufe.',
          cta: 'Qualitaets-Gates ansehen',
          href: '#quick-facts'
        }
      ]
    },
    method: {
      title: 'Wie ich entscheide und liefere',
      desc: 'Die Methodik ist bewusst simpel, damit Entscheidungen fuer Teams nachvollziehbar bleiben.',
      steps: [
        {
          title: '1) Problem praezisieren',
          desc: 'Ziel, Scope und Risikobild vor dem Build klarziehen, damit keine Schein-Komplexitaet entsteht.'
        },
        {
          title: '2) Loesung mit Guardrails bauen',
          desc: 'Komponenten, Datenfluesse und Betriebsaspekte so umsetzen, dass Wartung und Skalierung realistisch bleiben.'
        },
        {
          title: '3) Wirkung messen und uebergeben',
          desc: 'Performance-, UX- und Betriebsmetriken sichtbar machen und sauber in bestehende Teamprozesse uebergeben.'
        }
      ],
      cta: 'Kostenlose Tech-Review anfragen'
    },
    quick_facts: {
      title: 'Quick Facts',
      desc: 'Die wichtigsten Signale fuer Positionierung und Zusammenarbeit auf einen Blick.',
      items: [
        { label: 'Fokus', value: 'Web Engineering mit sichtbarer Denkqualitaet' },
        { label: 'Arbeitsmodell', value: 'Remote-first, optional im Raum Mannheim' },
        { label: 'Qualitaetsstandard', value: 'Lint + Typing + Unit + E2E + Lighthouse' },
        { label: 'Verfuegbarkeit', value: 'Ab sofort (2 Deep-Dive Slots pro Monat)' }
      ]
    },
    audience_paths: {
      title: 'Zwei klare Pfade',
      desc: 'Schnelles Routing fuer Recruiting oder Projektkontext - ohne unnoetige Reibung.',
      cards: [
        {
          id: 'hiring',
          title: 'Fuer Hiring-Teams',
          bullets: [
            'Junior-Entry mit produktionsnahen Referenzen und klarer Delivery-Haltung.',
            'Schnelles Onboarding in bestehende Produkt- und Teamprozesse.',
            'Hohe Transparenz ueber Fortschritt, Risiken und naechste Schritte.'
          ],
          cta: 'Hiring-Gespraech starten'
        },
        {
          id: 'client',
          title: 'Fuer Projektanfragen',
          bullets: [
            'Klare Umsetzungsphasen fuer Frontend, API-Integration und Deployment.',
            'Technische Entscheidungen werden dokumentiert und begruendet.',
            'Saubere Uebergabe fuer stabilen Betrieb nach dem Build.'
          ],
          cta: 'Projektgespraech starten'
        }
      ]
    },
    insights: {
      title: 'Engineering Insights',
      desc: 'Kurze, praxisnahe Deep Dives zu Architektur, Performance und Delivery-Entscheidungen.',
      cta: 'Alle Insights ansehen'
    },
    career_switch: {
      title: 'Arbeitsweise',
      desc: 'Praxisorientierter IT-Einstieg mit belastbarer Berufserfahrung.',
      intro:
        'Ich kombiniere 15 Jahre Berufserfahrung aus kundennahem Umfeld mit sauber aufgebauten Webprojekten.',
      prior_experience:
        'Ownership, klare Kommunikation und reproduzierbare Delivery sind die Konstanten in meiner Arbeit.',
      bullets: [
        'Puenktliche Lieferung mit klaren Zwischenstaenden.',
        'Nachvollziehbare Entscheidungen statt Black-Box-Implementierung.',
        'Schnelle Einarbeitung in neue Anforderungen und Systeme.',
        'Iteratives Arbeiten: planen, bauen, testen, verbessern.'
      ]
    },
    sections: {
      heroCase: {
        title: 'Hero-Projekt: 3D-Konfigurator als Tech-Referenz',
        desc: 'Tech-first Case Study aus einem Live-Kundenprojekt: WebGL/Three.js, Plugin-Architektur, Preis-Engine und Checkout-Handoff.'
      },
      featured: {
        title: 'Featured Projekte',
        desc: 'Referenzen mit Fokus auf Produktdenken, technische Praezision und klare Uebergabe.'
      },
      stack: {
        title: 'Tech-Stack Showcase',
        desc: 'Kompetenzorientiert gruppiert mit Fokus auf reale Delivery.'
      },
      labs: {
        title: 'Experimente / Labs',
        desc: 'Labs bleiben sichtbar, sind aber klar als explorative Flaeche markiert.'
      },
      contact: {
        title: 'Kontakt',
        desc: 'Ob Hiring oder Projekt: ein kurzer Kontext reicht fuer einen klaren Start.',
        card: 'Typisches Antwortfenster: innerhalb von 24 Stunden an Werktagen.',
        cta: 'Architekturgespraech anfragen'
      }
    },
    contact_form: {
      intentLegend: 'Anliegen',
      intentOptions: {
        hiring: 'Hiring-Team',
        client: 'Projektanfrage'
      },
      intentDetailLabel: 'Kontext-Detail',
      intentDetailOptions: {
        hiring: 'Hiring / Teamaufbau',
        project: 'Projektumsetzung',
        collab: 'Kooperation / Sparring'
      },
      timelineLabel: 'Zeithorizont',
      timelineOptions: {
        asap: 'ASAP',
        '30d': 'In 30 Tagen',
        '90d+': 'In 90+ Tagen'
      },
      scopeLabel: 'Scope-Fokus',
      scopeOptions: {
        audit: 'Audit / Review',
        build: 'Build / Implementierung',
        optimize: 'Optimierung / Refactoring',
        unknown: 'Noch offen'
      },
      nameLabel: 'Name',
      emailLabel: 'E-Mail',
      companyLabel: 'Firma / Team (optional)',
      messageLabel: 'Kontext in 2-5 Saetzen',
      submit: 'Anfrage senden',
      submitting: 'Wird gesendet...',
      success: 'Danke. Die Anfrage ist eingegangen und wird zeitnah beantwortet.',
      reset: 'Neue Anfrage',
      error: 'Senden fehlgeschlagen. Bitte erneut versuchen oder direkt per Mail kontaktieren.',
      rateLimited: 'Zu viele Anfragen in kurzer Zeit. Bitte warte kurz und versuche es erneut.',
      verificationRequired: 'Bitte bestaetige kurz die Sicherheitspruefung und versuche es erneut.',
      privacy: 'Mit dem Absenden stimmst du der Verarbeitung deiner Anfrage zum Kontaktzweck zu.',
      honeypotLabel: 'Website'
    },
    trust: {
      title: 'Trust Signals',
      items: [
        'Authority-first: Technik + Denken + Wirkung',
        'Remote-first, Mannheim optional',
        'Saubere Uebergaben und dokumentierte Delivery'
      ]
    },
    faq: {
      title: 'FAQ',
      desc: 'Die haeufigsten Fragen vor einem Erstgespraech.',
      items: [
        {
          q: 'Wie laeuft ein erstes Architekturgespraech ab?',
          a: 'Du teilst kurz den Kontext. Danach klären wir Zielbild, Risiken und den realistischen naechsten Schritt - ohne Sales-Pitch.'
        },
        {
          q: 'Wie triffst du technische Entscheidungen unter Zeitdruck?',
          a: 'Ich priorisiere zuerst Verstaendlichkeit und Betriebsstabilitaet. Komplexitaet wird nur eingefuehrt, wenn sie einen messbaren Vorteil bringt.'
        },
        {
          q: 'Wie misst du, ob eine Loesung wirklich gut ist?',
          a: 'Ich kombiniere technische Metriken (Performance, Fehlerquote, Testabdeckung) mit Nutzerfluss-Signalen und klaren Uebergabekriterien.'
        },
        {
          q: 'Arbeitest du mit bestehenden Teams und Codebases?',
          a: 'Ja. Der Fokus liegt auf schnellem Ramp-up, klarer Kommunikation und nachvollziehbaren Deliverables.'
        },
        {
          q: 'Welche Aufgaben uebernimmst du typischerweise?',
          a: 'Frontend mit Next.js/React, API-Integrationen, Performance-Optimierung und strukturierte Deployment-/Handover-Vorbereitung.'
        }
      ]
    },
    footer: { left: '(c) 2026 IVO TECH', right: 'Authority-first Web Delivery | Mannheim | Remote-first' }
  },
  en: {
    meta: {
      title: 'IVO TECH | Web engineering, delivery excellence, and clear architecture',
      description:
        'Portfolio for web engineering: clear architecture decisions, measurable quality, and reproducible delivery for teams that need robust execution.'
    },
    nav: {
      heroCase: 'Case study',
      featured: 'Projects',
      paths: 'Paths',
      insights: 'Insights',
      contact: 'Contact',
      cta: 'Architecture call'
    },
    hero: {
      eyebrow: 'Authority-first web engineering | Mannheim | Remote-first',
      title: 'I build web systems that start clean and remain stable in real operations.',
      lead:
        'The focus is on traceable decisions, clear information architecture, and measurable quality rather than buzzwords.',
      sublead:
        'This creates conversations from trust in the thinking process - not from sales pressure.',
      primary: 'Request architecture call',
      secondary: 'View case study with metrics',
      audit: 'Free 10-point tech review',
      linksLabel: 'Quick links',
      github: 'GitHub',
      cv: 'CV (PDF)',
      terminal: {
        title: 'decision.log',
        lines: [
          'principle: clarity before complexity',
          'proof: live 3D configurator in production',
          'method: plan -> build -> measure -> handover',
          'availability: 2 deep-dive slots / month'
        ]
      }
    },
    proof: {
      title: 'Proof over claims',
      desc: 'Three signals that represent execution quality and delivery discipline.',
      items: [
        {
          id: 'live-system',
          metric: 'Live system in production',
          detail: '3D configurator is integrated end-to-end: upload, pricing logic, and checkout handoff.',
          cta: 'Open case study',
          href: '/configurator'
        },
        {
          id: 'delivery-discipline',
          metric: 'Structured delivery',
          detail: 'Clear scope boundaries, transparent updates, and reproducible handovers.',
          cta: 'View delivery method',
          href: '#method'
        },
        {
          id: 'quality-guardrails',
          metric: 'Measurable quality gates',
          detail: 'Lint, typing, unit, e2e, and lighthouse are enforced as non-negotiable checks.',
          cta: 'View quality gates',
          href: '#quick-facts'
        }
      ]
    },
    method: {
      title: 'How I decide and deliver',
      desc: 'The method stays intentionally simple so teams can follow technical decisions easily.',
      steps: [
        {
          title: '1) Clarify the problem',
          desc: 'Define target, scope, and risk profile first to avoid fake complexity.'
        },
        {
          title: '2) Build with guardrails',
          desc: 'Implement components, data flow, and operations with long-term maintainability in mind.'
        },
        {
          title: '3) Measure and hand over',
          desc: 'Make performance, UX, and reliability visible, then hand over in a way teams can run confidently.'
        }
      ],
      cta: 'Request free tech review'
    },
    quick_facts: {
      title: 'Quick facts',
      desc: 'Key signals for positioning and collaboration at a glance.',
      items: [
        { label: 'Focus', value: 'Web engineering with visible thinking quality' },
        { label: 'Work model', value: 'Remote-first, optional around Mannheim' },
        { label: 'Quality standard', value: 'Lint + typing + unit + e2e + lighthouse' },
        { label: 'Availability', value: 'Available now (2 deep-dive slots per month)' }
      ]
    },
    audience_paths: {
      title: 'Two clear paths',
      desc: 'Fast routing for recruiting or project context with minimal friction.',
      cards: [
        {
          id: 'hiring',
          title: 'For hiring teams',
          bullets: [
            'Junior entry with production-oriented references and delivery discipline.',
            'Fast onboarding into existing product and team processes.',
            'High transparency on progress, risks, and next steps.'
          ],
          cta: 'Start hiring conversation'
        },
        {
          id: 'client',
          title: 'For project requests',
          bullets: [
            'Clear implementation phases for frontend, API integration, and deployment.',
            'Technical decisions are documented and explainable.',
            'Clean handover for stable operations after shipping.'
          ],
          cta: 'Start project conversation'
        }
      ]
    },
    insights: {
      title: 'Engineering insights',
      desc: 'Short, practical deep dives on architecture, performance, and delivery decisions.',
      cta: 'View all insights'
    },
    career_switch: {
      title: 'Way of working',
      desc: 'Practical IT entry backed by consistent professional experience.',
      intro:
        'I combine 15 years of customer-facing professional experience with carefully built web projects.',
      prior_experience:
        'Ownership, clear communication, and reproducible delivery are constants in how I work.',
      bullets: [
        'Reliable delivery with clear status updates.',
        'Traceable decisions instead of black-box implementation.',
        'Fast ramp-up on new requirements and systems.',
        'Iterative execution: plan, build, test, improve.'
      ]
    },
    sections: {
      heroCase: {
        title: 'Hero project: 3D configurator as a tech reference',
        desc: 'Tech-first case study from a live client project: WebGL/Three.js, plugin architecture, pricing engine, and checkout handoff.'
      },
      featured: {
        title: 'Featured projects',
        desc: 'References focused on product thinking, technical precision, and clean handover.'
      },
      stack: {
        title: 'Tech stack showcase',
        desc: 'Grouped by capability with a strong delivery focus.'
      },
      labs: {
        title: 'Experiments / Labs',
        desc: 'Labs stay visible but clearly marked as exploratory work.'
      },
      contact: {
        title: 'Contact',
        desc: 'Hiring or project context is enough to start with clarity.',
        card: 'Typical response window: within 24 hours on business days.',
        cta: 'Request architecture call'
      }
    },
    contact_form: {
      intentLegend: 'Request type',
      intentOptions: {
        hiring: 'Hiring team',
        client: 'Project request'
      },
      intentDetailLabel: 'Context detail',
      intentDetailOptions: {
        hiring: 'Hiring / team setup',
        project: 'Project implementation',
        collab: 'Collaboration / sparring'
      },
      timelineLabel: 'Timeline',
      timelineOptions: {
        asap: 'ASAP',
        '30d': 'Within 30 days',
        '90d+': 'Within 90+ days'
      },
      scopeLabel: 'Scope focus',
      scopeOptions: {
        audit: 'Audit / review',
        build: 'Build / implementation',
        optimize: 'Optimization / refactoring',
        unknown: 'Still open'
      },
      nameLabel: 'Name',
      emailLabel: 'Email',
      companyLabel: 'Company / Team (optional)',
      messageLabel: 'Context in 2-5 sentences',
      submit: 'Send request',
      submitting: 'Sending...',
      success: 'Thanks. Your request was received and will be answered shortly.',
      reset: 'New request',
      error: 'Submission failed. Please retry or contact directly by email.',
      rateLimited: 'Too many requests in a short time. Please wait a moment and try again.',
      verificationRequired: 'Please complete the security check and try again.',
      privacy: 'By submitting, you agree to processing your request for contact purposes.',
      honeypotLabel: 'Website'
    },
    trust: {
      title: 'Trust signals',
      items: [
        'Authority-first: technology + thinking + outcome',
        'Remote-first, Mannheim optional',
        'Clean handovers and documented delivery'
      ]
    },
    faq: {
      title: 'FAQ',
      desc: 'Common questions before a first conversation.',
      items: [
        {
          q: 'How does an architecture call usually work?',
          a: 'You share brief context first. Then we align on target state, risks, and the next realistic step without a sales script.'
        },
        {
          q: 'How do you make technical decisions under time pressure?',
          a: 'I prioritize clarity and operational stability first. Complexity is added only when there is measurable upside.'
        },
        {
          q: 'How do you evaluate whether a solution is actually good?',
          a: 'I combine technical metrics (performance, error rate, tests) with user-flow signals and explicit handover criteria.'
        },
        {
          q: 'Do you work with existing teams and codebases?',
          a: 'Yes. The focus is fast ramp-up, clear communication, and traceable deliverables.'
        },
        {
          q: 'Which tasks do you typically take on?',
          a: 'Frontend in Next.js/React, API integrations, performance optimization, and structured deployment/handover preparation.'
        }
      ]
    },
    footer: { left: '(c) 2026 IVO TECH', right: 'Authority-first web delivery | Mannheim | Remote-first' }
  }
} as const;

export type Locale = keyof typeof copy;
