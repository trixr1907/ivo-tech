export const copy = {
  de: {
    meta: {
      title: 'IVO TECH | AI Automation & Product Engineer',
      description:
        'Portfolio mit Recruiting-Fokus: Live 3D-Konfigurator, Voicebot-Orchestrierung, datengetriebene Produktentwicklung und ausgewahlte Labs.'
    },
    nav: {
      heroCase: 'Hero Case',
      featured: 'Featured',
      stack: 'Tech-Stack',
      labs: 'Labs',
      contact: 'Kontakt',
      cta: 'Case Study ansehen'
    },
    hero: {
      eyebrow: 'AI Automation | Product Engineering | Systems Prototyping',
      title: 'AI Automation & Product Engineering mit messbarem Output.',
      lead:
        'Ich baue produktionsnahe Systeme, die von der Idee bis zur nutzbaren Umsetzung funktionieren: Voice/AI-Orchestrierung, datengetriebene Features und klare Conversion-Pfade.',
      primary: 'Zum Hero Case',
      secondary: 'Kontakt aufnehmen',
      terminal: {
        title: 'positioning.log',
        lines: [
          'focus: AI automation + product delivery',
          'proof: live 3D configurator in production',
          'featured: voicebot orchestration + data product',
          'labs: systems and edge experimentation'
        ]
      }
    },
    sections: {
      positioning: {
        title: 'Positionierung',
        desc: 'T-Shape Profil mit klarem Recruiting-Signal.',
        bullets: [
          'Primaer: AI + Automation Engineer',
          'Sekundaer: Full-Stack Product Engineering',
          'Zusatzsignal: Systems/Embedded Prototyping'
        ]
      },
      heroCase: {
        title: 'Hero-Projekt: 3D-Konfigurator (Live)',
        desc: 'Ein produktionsnahes Business-System von Upload bis Checkout.'
      },
      featured: {
        title: 'Featured Projekte',
        desc: 'Die zwei starksten Beweise fuer AI-Orchestrierung und Data Product Thinking.'
      },
      stack: {
        title: 'Tech-Stack Showcase',
        desc: 'Kompetenzorientiert gruppiert statt Tool-Listing ohne Kontext.'
      },
      labs: {
        title: 'Experimente / Labs',
        desc: 'Bewusst kompakt: sichtbar, aber nicht dominant im Conversion-Funnel.'
      },
      contact: {
        title: 'Kontakt',
        desc: 'Recruiting oder Projektgesprach? Eine kurze Nachricht reicht.',
        card: 'Sende Rolle, Team-Kontext und erwarteten Scope in 2-3 Zeilen.',
        cta: 'Kontakt aufnehmen'
      }
    },
    footer: { left: '(c) 2026 IVO TECH', right: 'AI Automation & Product Engineering' }
  },
  en: {
    meta: {
      title: 'IVO TECH | AI Automation & Product Engineer',
      description:
        'Recruiting-focused portfolio: live 3D configurator, voicebot orchestration, data-driven product development, and selected labs.'
    },
    nav: {
      heroCase: 'Hero case',
      featured: 'Featured',
      stack: 'Tech stack',
      labs: 'Labs',
      contact: 'Contact',
      cta: 'View case study'
    },
    hero: {
      eyebrow: 'AI automation | Product engineering | Systems prototyping',
      title: 'AI automation & product engineering with measurable output.',
      lead:
        'I build production-oriented systems that work end-to-end: voice/AI orchestration, data-driven features, and clear conversion paths.',
      primary: 'Go to hero case',
      secondary: 'Get in touch',
      terminal: {
        title: 'positioning.log',
        lines: [
          'focus: AI automation + product delivery',
          'proof: live 3D configurator in production',
          'featured: voicebot orchestration + data product',
          'labs: systems and edge experimentation'
        ]
      }
    },
    sections: {
      positioning: {
        title: 'Positioning',
        desc: 'T-shaped profile with clear recruiting signals.',
        bullets: [
          'Primary: AI + automation engineer',
          'Secondary: full-stack product engineering',
          'Additional signal: systems/embedded prototyping'
        ]
      },
      heroCase: {
        title: 'Hero project: 3D configurator (live)',
        desc: 'A production-oriented business system from upload to checkout.'
      },
      featured: {
        title: 'Featured projects',
        desc: 'The two strongest proofs for AI orchestration and data product thinking.'
      },
      stack: {
        title: 'Tech stack showcase',
        desc: 'Grouped by capability, not by random tool lists.'
      },
      labs: {
        title: 'Experiments / Labs',
        desc: 'Deliberately compact: visible, but not dominant in the conversion funnel.'
      },
      contact: {
        title: 'Contact',
        desc: 'Recruiting or project conversation? A short message is enough.',
        card: 'Share role, team context, and expected scope in 2-3 lines.',
        cta: 'Get in touch'
      }
    },
    footer: { left: '(c) 2026 IVO TECH', right: 'AI Automation & Product Engineering' }
  }
} as const;

export type Locale = keyof typeof copy;
