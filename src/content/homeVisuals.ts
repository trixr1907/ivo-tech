import type { Locale } from '@/content/copy';

export type HomeVisualSectionId =
  | 'hero'
  | 'services'
  | 'proof'
  | 'projects'
  | 'insights'
  | 'delivery'
  | 'contact';

export type LocalizedText = Record<Locale, string>;

export type HomeVisualAsset = {
  id: HomeVisualSectionId;
  sources: {
    avif: string;
    webp: string;
    fallback: string;
  };
  alt: LocalizedText;
  caption: LocalizedText;
  width: number;
  height: number;
  priority?: 'high' | 'low';
};

export type HomeSectionVisualMap = Record<HomeVisualSectionId, HomeVisualAsset>;

const BASE = '/assets/home/visuals';

export const HOME_SECTION_VISUALS: HomeSectionVisualMap = {
  hero: {
    id: 'hero',
    sources: {
      avif: `${BASE}/hero-system-surface.svg`,
      webp: `${BASE}/hero-bold-product.webp`,
      fallback: `${BASE}/hero-bold-product.png`
    },
    alt: {
      de: 'Abstraktes System-Dashboard mit leuchtenden Datenlinien als Hero-Visual für stabile Delivery-Prozesse.',
      en: 'Abstract system dashboard with glowing data lines as a hero visual for stable delivery workflows.'
    },
    caption: {
      de: 'Bold Product System Surface',
      en: 'Bold product system surface'
    },
    width: 1600,
    height: 960,
    priority: 'high'
  },
  services: {
    id: 'services',
    sources: {
      avif: `${BASE}/services-system-grid.avif`,
      webp: `${BASE}/services-system-grid.webp`,
      fallback: `${BASE}/services-system-grid.png`
    },
    alt: {
      de: 'Abstrakte 3D-Systemstruktur mit Layern zur Darstellung technischer Service-Architekturen.',
      en: 'Abstract 3D system structure with layered planes representing technical service architectures.'
    },
    caption: {
      de: 'Service System Grid',
      en: 'Service system grid'
    },
    width: 1200,
    height: 900
  },
  proof: {
    id: 'proof',
    sources: {
      avif: `${BASE}/proof-signal-beams.avif`,
      webp: `${BASE}/proof-signal-beams.webp`,
      fallback: `${BASE}/proof-signal-beams.png`
    },
    alt: {
      de: '3D-Signalstrahlen als visuelle Metapher für verifizierte technische Belege und Transparenz.',
      en: '3D signal beams as a visual metaphor for verified technical proof and transparency.'
    },
    caption: {
      de: 'Proof Signal Beams',
      en: 'Proof signal beams'
    },
    width: 1200,
    height: 900
  },
  projects: {
    id: 'projects',
    sources: {
      avif: `${BASE}/projects-kinetic-cards.avif`,
      webp: `${BASE}/projects-kinetic-cards.webp`,
      fallback: `${BASE}/projects-kinetic-cards.png`
    },
    alt: {
      de: 'Dynamische 3D-Kartenkomposition als Sinnbild für reale Projekt-Deliverables.',
      en: 'Dynamic 3D card composition representing real project deliverables.'
    },
    caption: {
      de: 'Kinetic project layers',
      en: 'Kinetic project layers'
    },
    width: 1200,
    height: 900
  },
  insights: {
    id: 'insights',
    sources: {
      avif: `${BASE}/insights-neural-flow.avif`,
      webp: `${BASE}/insights-neural-flow.webp`,
      fallback: `${BASE}/insights-neural-flow.png`
    },
    alt: {
      de: 'Abstrakter neuraler Datenfluss als Visual für Engineering-Insights und Entscheidungswissen.',
      en: 'Abstract neural data flow visual for engineering insights and decision intelligence.'
    },
    caption: {
      de: 'Insight neural flow',
      en: 'Insight neural flow'
    },
    width: 1200,
    height: 900
  },
  delivery: {
    id: 'delivery',
    sources: {
      avif: `${BASE}/delivery-orbit-lines.avif`,
      webp: `${BASE}/delivery-orbit-lines.webp`,
      fallback: `${BASE}/delivery-orbit-lines.png`
    },
    alt: {
      de: 'Orbitale Linien in einer 3D-Szene, die einen kontrollierten Delivery-Prozess symbolisieren.',
      en: 'Orbital lines in a 3D scene symbolizing a controlled delivery process.'
    },
    caption: {
      de: 'Delivery orbit lines',
      en: 'Delivery orbit lines'
    },
    width: 1200,
    height: 900
  },
  contact: {
    id: 'contact',
    sources: {
      avif: `${BASE}/contact-energy-bridge.avif`,
      webp: `${BASE}/contact-energy-bridge.webp`,
      fallback: `${BASE}/contact-energy-bridge.png`
    },
    alt: {
      de: 'Abstrakte 3D-Brücke mit Energiefluss als visuelle Metapher für Zusammenarbeit und Übergabe.',
      en: 'Abstract 3D bridge with energy flow as visual metaphor for collaboration and handoff.'
    },
    caption: {
      de: 'Collaboration energy bridge',
      en: 'Collaboration energy bridge'
    },
    width: 1200,
    height: 900
  }
};

export function getHomeVisualAsset(id: HomeVisualSectionId): HomeVisualAsset {
  return HOME_SECTION_VISUALS[id];
}
