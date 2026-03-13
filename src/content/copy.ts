export const copy = {
  de: {
    meta: {
      title: 'ivo-tech | Web Engineering, Delivery-Exzellenz und klare Architektur',
      description:
        'Portfolio fuer Web Engineering: klare Architekturentscheidungen, messbare Qualitaet und reproduzierbare Delivery fuer Teams, die sauber bauen und stabil betreiben wollen.'
    },
    nav: {
      heroCase: 'Case Study',
      featured: 'Projekte',
      contact: 'Kontakt',
      cta: 'Erstgespraech'
    },
    primaryCta: {
      label: 'Case Study ansehen',
      shortLabel: 'Case Study',
      href: '/configurator',
      intent: 'case_study'
    },
    sectionCtas: {
      hero: {
        primary: { label: 'Kostenloses Erstgespraech anfragen', href: '#contact', trackingSource: 'hero_primary_contact', intent: 'contact' },
        secondary: { label: 'Case Study ansehen', href: '/configurator', trackingSource: 'hero_secondary_case', intent: 'case_study' }
      },
      services: {
        primary: { label: 'Kostenloses Erstgespraech anfragen', href: '#contact', trackingSource: 'services_primary_contact', intent: 'contact' }
      },
      insights: {
        primary: { label: 'Alle Insights', href: '/insights', trackingSource: 'insights_primary_index', intent: 'authority' }
      },
      footer: {
        primary: { label: 'Erstgespraech', href: '#contact', trackingSource: 'footer_primary_contact', intent: 'contact' }
      },
      sticky: {
        primary: { label: 'Erstgespraech', href: '#contact', trackingSource: 'sticky_primary_contact', intent: 'contact' }
      }
    },
    home: {
      hero: {
        eyebrow: 'Web Engineering | Mannheim | Remote-first',
        title: 'Web-Projekte, die in Produktion stabil laufen und messbar Wirkung zeigen.',
        lead: 'Ich unterstuetze Teams bei Architektur, Umsetzung und sauberem Handover - mit klarem Fokus auf Projektresultate.',
        sublead: 'Klare Entscheidungen, robuste Umsetzung und reproduzierbare Delivery ohne unnoetige Komplexitaet.'
      },
      proof: [
        {
          id: 'live_system',
          label: 'Live-System',
          value: 'End-to-End Upload-Flow im produktiven Betrieb',
          href: '#hero-case'
        },
        {
          id: 'delivery_quality',
          label: 'Delivery-Qualitaet',
          value: 'Feste QA-Gates vor jedem Release',
          href: '#services'
        },
        {
          id: 'response_window',
          label: 'Antwortzeit',
          value: 'Rueckmeldung werktags meist innerhalb von 24h',
          href: '#contact'
        }
      ],
      case: {
        title: 'Hero-Projekt: 3D-Konfigurator als Tech-Referenz',
        desc: 'Ein Projektbeispiel mit klarer Ausgangslage, technischer Umsetzung und operativem Ergebnis.'
      },
      method: {
        title: 'Wie ich entscheide und liefere',
        desc: 'Ein klarer Delivery-Rahmen, damit Teams Entscheidungen und Fortschritt jederzeit nachvollziehen koennen.',
        steps: [
          {
            title: '1) Problem praezisieren',
            desc: 'Zielbild, Scope und Risiko vor dem Build klarziehen, um teure Richtungswechsel zu vermeiden.'
          },
          {
            title: '2) Loesung mit Guardrails bauen',
            desc: 'Komponenten, Datenfluesse und Betrieb so umsetzen, dass Wartung und Skalierung realistisch bleiben.'
          },
          {
            title: '3) Wirkung messen und uebergeben',
            desc: 'Performance, UX und Betriebsmetriken sichtbar machen und sauber ins Team uebergeben.'
          }
        ]
      },
      services: [
        {
          icon: 'frontend',
          title: 'Frontend & Product Delivery',
          desc: 'Next.js/React + TypeScript, klare Informationsarchitektur und robuste UI-Umsetzung.'
        },
        {
          icon: 'backend',
          title: 'Backend & API Integrationen',
          desc: 'FastAPI-Services, Datenfluesse und Integrationen fuer stabile End-to-End-Prozesse.'
        },
        {
          icon: 'ops',
          title: 'Betrieb & Guardrails',
          desc: 'Deployment, QA-Gates und Monitoring-Basis fuer reproduzierbare Delivery.'
        }
      ],
      projects: {
        title: 'Kuratierte Projekte',
        desc: 'Ausgewaehlte Referenzen mit klarem Tech-Fokus und nachvollziehbarer Wirkung.'
      },
      insights: {
        title: 'Engineering Insights',
        desc: 'Kurze, praxisnahe Deep Dives zu Architektur, Performance und Delivery-Entscheidungen.',
        linkLabel: 'Insight lesen'
      },
      contact: {
        title: 'Kontakt',
        desc: '2-3 Saetze zu Ziel, aktuellem Engpass und Zeitrahmen reichen fuer einen konkreten Start.',
        card: 'Typisches Antwortfenster: Rueckmeldung werktags innerhalb von 24 Stunden.',
        emailCta: 'Direkt per E-Mail',
        advanced: {
          toggle: 'Optionale Projektdetails',
          hint: 'Nur ausfuellen, wenn es fuer den Erstkontakt hilfreich ist.'
        }
      },
      faq: {
        title: 'FAQ',
        desc: 'Die wichtigsten Fragen vor einem Erstgespraech.'
      }
    },
    hero: {
      eyebrow: 'Web Engineering | Mannheim | Remote-first',
      title: 'Ich entwickle digitale Produkte und Websysteme, die im Alltag wirklich funktionieren.',
      lead: 'Ich arbeite an Full-Stack-Webentwicklung, 3D- und Frontend-Erlebnissen, API-Integrationen und AI-gestuetzten Automatisierungs-Workflows.',
      sublead:
        'Die Seite ist mein technisches Portfolio fuer Teams, Arbeitgeber und Partner, die nachvollziehbare Engineering-Kompetenz, Produktdenken und saubere Umsetzung suchen.',
      highlights: ['Produktionsnahe Websysteme', '3D & Visualisierung', 'AI & Automatisierung', 'Offen fuer Hiring'],
      secondary: 'Kostenloses Erstgespraech anfragen',
      linksLabel: 'Direktlinks',
      github: 'GitHub',
      cv: 'CV (PDF)',
      contact: 'Kontakt'
    },
    method: {
      title: 'Wie ich entscheide und liefere',
      desc: 'Ein einfacher Rahmen: Problem klar machen, robust umsetzen, Wirkung messbar machen.',
      steps: [
        {
          title: '1) Problem klarziehen',
          desc: 'Ziel, Scope und Risiko vor dem Build konkret machen, damit keine Zeit in Richtungswechsel fliesst.'
        },
        {
          title: '2) Robust umsetzen',
          desc: 'Komponenten, APIs und Betriebslogik so bauen, dass Wartung und Skalierung realistisch bleiben.'
        },
        {
          title: '3) Wirkung belegen',
          desc: 'Performance, UX und Betriebskennzahlen sichtbar machen und sauber ins Team uebergeben.'
        }
      ]
    },
    insights: {
      title: 'Engineering Insights',
      desc: 'Praxisnahe Deep Dives zu Architektur, Performance und Delivery-Entscheidungen.'
    },
    sections: {
      heroCase: {
        title: 'Hero-Projekt: 3D-Konfigurator als Tech-Referenz',
        desc: 'Konkreter Live-Case mit technischem Aufbau, klarer Prozesskette und nachvollziehbarem Betriebsergebnis.'
      },
      services: {
        title: 'Leistungsfokus',
        desc: 'Drei Schwerpunkte, die Projekte vom ersten Konzept bis zum stabilen Live-Betrieb tragen.'
      },
      featured: {
        title: 'Kuratierte Projekte',
        desc: 'Ausgewaehlte Referenzen mit technischer Tiefe und klarer Wirkung.'
      },
      contact: {
        title: 'Kontakt',
        desc: '2-3 Saetze zu Ziel, Engpass und Zeitrahmen reichen fuer einen konkreten Start.',
        card: 'Typisches Antwortfenster: Rueckmeldung werktags innerhalb von 24 Stunden.'
      }
    },
    contact_form: {
      intentLegend: 'Anliegen',
      intentOptions: {
        hiring: 'Hiring-Team',
        client: 'Projektanfrage'
      },
      advancedToggleLabel: 'Optionale Projektdetails',
      advancedHint: 'Ergaenze Details nur wenn sie fuer den Start relevant sind.',
      intentDetailLabel: 'Anliegen-Detail',
      intentDetailOptions: {
        hiring: 'Hiring / Teamaufbau',
        project: 'Projektumsetzung',
        collab: 'Kooperation / Sparring'
      },
      timelineLabel: 'Zeitrahmen',
      timelineOptions: {
        asap: 'ASAP',
        '30d': 'In 30 Tagen',
        '90d+': 'In 90+ Tagen'
      },
      projectScopeLabel: 'Projektfokus',
      projectScopeOptions: {
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
        'Live-System mit End-to-End-Flow im Betrieb',
        'Klare Delivery-Gates vor jedem Release',
        'Dokumentierte Uebergaben fuer stabile Team-Weiterarbeit'
      ]
    },
    faq: {
      title: 'FAQ',
      desc: 'Die wichtigsten Fragen vor einem Erstgespraech.',
      items: [
        {
          q: 'Wie startet eine Zusammenarbeit?',
          a: 'Du gibst kurz Kontext zu Ziel, Engpass und Zeitrahmen. Danach klaeren wir den naechsten belastbaren Schritt ohne Sales-Druck.'
        },
        {
          q: 'Welche Deliverables lieferst du typischerweise?',
          a: 'Je nach Scope: Architektur-Entscheidungen, robuste Implementierung, QA-Gates und eine dokumentierte Uebergabe fuer das Team.'
        },
        {
          q: 'Arbeitest du mit bestehenden Teams und Codebases?',
          a: 'Ja. Fokus ist schneller Ramp-up, klare Kommunikation und nachvollziehbare Ergebnisse ohne Reibungsverluste.'
        }
      ]
    },
    footer: { left: '(c) 2026 ivo-tech', right: 'Web Engineering mit klarer Delivery | Mannheim | Remote-first' }
  },
  en: {
    meta: {
      title: 'ivo-tech | Web Engineering, Delivery Excellence and Clear Architecture',
      description:
        'Web engineering portfolio with clear architecture decisions, measurable quality, and reproducible delivery.'
    },
    nav: {
      heroCase: 'Case study',
      featured: 'Projects',
      contact: 'Contact',
      cta: 'Intro call'
    },
    primaryCta: {
      label: 'View case study',
      shortLabel: 'Case study',
      href: '/en/configurator',
      intent: 'case_study'
    },
    sectionCtas: {
      hero: {
        primary: { label: 'Request free intro call', href: '#contact', trackingSource: 'hero_primary_contact', intent: 'contact' },
        secondary: { label: 'View case study', href: '/en/configurator', trackingSource: 'hero_secondary_case', intent: 'case_study' }
      },
      services: {
        primary: { label: 'Request free intro call', href: '#contact', trackingSource: 'services_primary_contact', intent: 'contact' }
      },
      insights: {
        primary: { label: 'Browse all insights', href: '/en/insights', trackingSource: 'insights_primary_index', intent: 'authority' }
      },
      footer: {
        primary: { label: 'Intro call', href: '#contact', trackingSource: 'footer_primary_contact', intent: 'contact' }
      },
      sticky: {
        primary: { label: 'Intro call', href: '#contact', trackingSource: 'sticky_primary_contact', intent: 'contact' }
      }
    },
    home: {
      hero: {
        eyebrow: 'Web engineering | Mannheim | Remote-first',
        title: 'Web projects that stay stable in production and create measurable impact.',
        lead: 'I support teams with architecture, implementation, and clean handover with a clear focus on project outcomes.',
        sublead: 'Clear decisions, robust execution, and reproducible delivery without unnecessary complexity.'
      },
      proof: [
        {
          id: 'live_system',
          label: 'Live system',
          value: 'End-to-end upload flow in production',
          href: '#hero-case'
        },
        {
          id: 'delivery_quality',
          label: 'Delivery quality',
          value: 'Fixed QA gates before every release',
          href: '#services'
        },
        {
          id: 'response_window',
          label: 'Response window',
          value: 'Weekday response usually within 24h',
          href: '#contact'
        }
      ],
      case: {
        title: 'Hero project: 3D configurator as a technical reference',
        desc: 'A project example with clear context, technical implementation, and operational impact.'
      },
      method: {
        title: 'How I decide and deliver',
        desc: 'A clear delivery framework so teams can follow decisions and progress at every step.',
        steps: [
          {
            title: '1) Clarify the problem',
            desc: 'Define target state, scope, and risk before implementation to avoid costly course corrections.'
          },
          {
            title: '2) Build with guardrails',
            desc: 'Implement components, data flows, and operational aspects so maintenance and scaling remain realistic.'
          },
          {
            title: '3) Measure and hand over',
            desc: 'Make performance, UX, and operational signals visible and hand over cleanly to the team.'
          }
        ]
      },
      services: [
        {
          icon: 'frontend',
          title: 'Frontend & Product Delivery',
          desc: 'Next.js/React + TypeScript, clear information architecture, and robust UI delivery.'
        },
        {
          icon: 'backend',
          title: 'Backend & API Integrations',
          desc: 'FastAPI services, data flows, and integrations for stable end-to-end processes.'
        },
        {
          icon: 'ops',
          title: 'Operations & Guardrails',
          desc: 'Deployment, QA gates, and monitoring basics for reproducible delivery.'
        }
      ],
      projects: {
        title: 'Curated projects',
        desc: 'Selected references with technical focus and traceable impact.'
      },
      insights: {
        title: 'Engineering insights',
        desc: 'Short, practical deep dives on architecture, performance, and delivery decisions.',
        linkLabel: 'Read insight'
      },
      contact: {
        title: 'Contact',
        desc: '2-3 sentences about your goal, current bottleneck, and timeline are enough for a concrete starting point.',
        card: 'Typical response window: weekday response within 24 hours.',
        emailCta: 'Email directly',
        advanced: {
          toggle: 'Optional project details',
          hint: 'Add only if useful for first contact.'
        }
      },
      faq: {
        title: 'FAQ',
        desc: 'The key questions before an intro call.'
      }
    },
    hero: {
      eyebrow: 'Web engineering | Mannheim | Remote-first',
      title: 'I build digital products and web systems that genuinely work in day-to-day use.',
      lead: 'My focus spans full-stack web development, 3D and frontend experiences, API integrations, and AI-assisted automation workflows.',
      sublead:
        'This site is my technical portfolio for teams, employers, and partners looking for visible engineering judgment, product thinking, and clean execution.',
      highlights: ['Production-ready web systems', '3D and visualization', 'AI and automation', 'Open to hiring'],
      secondary: 'Request free intro call',
      linksLabel: 'Quick links',
      github: 'GitHub',
      cv: 'CV (PDF)',
      contact: 'Contact'
    },
    method: {
      title: 'How I decide and deliver',
      desc: 'A simple framework: clarify the problem, implement robustly, and verify impact.',
      steps: [
        {
          title: '1) Clarify the problem',
          desc: 'Define target state, scope, and risk before implementation so time is not lost on reversals.'
        },
        {
          title: '2) Implement robustly',
          desc: 'Build components, APIs, and operational logic so maintenance and scaling remain realistic.'
        },
        {
          title: '3) Prove impact',
          desc: 'Make performance, UX, and operational metrics visible and hand over cleanly to the team.'
        }
      ]
    },
    insights: {
      title: 'Engineering insights',
      desc: 'Practical deep dives on architecture, performance, and delivery decisions.'
    },
    sections: {
      heroCase: {
        title: 'Hero project: 3D configurator as a technical reference',
        desc: 'A concrete live case with technical structure, clear process chain, and traceable operational impact.'
      },
      services: {
        title: 'Delivery focus',
        desc: 'Three focus areas that carry projects from concept to stable live operation.'
      },
      featured: {
        title: 'Curated projects',
        desc: 'Selected references with technical depth and clear outcomes.'
      },
      contact: {
        title: 'Contact',
        desc: '2-3 sentences about your goal, bottleneck, and timeline are enough for a concrete starting point.',
        card: 'Typical response window: weekday response within 24 hours.'
      }
    },
    contact_form: {
      intentLegend: 'Request type',
      intentOptions: {
        hiring: 'Hiring team',
        client: 'Project request'
      },
      advancedToggleLabel: 'Optional project details',
      advancedHint: 'Add details only when useful for kickoff.',
      intentDetailLabel: 'Request detail',
      intentDetailOptions: {
        hiring: 'Hiring / team setup',
        project: 'Project delivery',
        collab: 'Collaboration / sparring'
      },
      timelineLabel: 'Timeline',
      timelineOptions: {
        asap: 'ASAP',
        '30d': 'Within 30 days',
        '90d+': 'In 90+ days'
      },
      projectScopeLabel: 'Project scope',
      projectScopeOptions: {
        audit: 'Audit / review',
        build: 'Build / implementation',
        optimize: 'Optimization / refactor',
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
        'Live system with an end-to-end production flow',
        'Clear QA gates before every release',
        'Documented handovers for stable team continuity'
      ]
    },
    faq: {
      title: 'FAQ',
      desc: 'The most relevant questions before an intro call.',
      items: [
        {
          q: 'How does collaboration typically start?',
          a: 'You share short context on goal, bottleneck, and timeline. Then we define the next practical step without a sales pitch.'
        },
        {
          q: 'Which deliverables do you usually provide?',
          a: 'Depending on scope: architecture decisions, robust implementation, QA gates, and a clean handover package for the team.'
        },
        {
          q: 'Do you work with existing teams and codebases?',
          a: 'Yes. The focus is fast ramp-up, clear communication, and traceable outcomes without unnecessary disruption.'
        }
      ]
    },
    footer: { left: '(c) 2026 ivo-tech', right: 'Web engineering with clear delivery | Mannheim | Remote-first' }
  }
} as const;

export type Locale = keyof typeof copy;
