import type { Locale } from '@/content/copy';

export type TrustEvidence = {
  id: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  href: string;
  external: boolean;
  published: boolean;
};

const TRUST_EVIDENCE: TrustEvidence[] = [
  {
    id: 'live-configurator-reference',
    title: {
      de: 'Live-Referenz: 3D-Konfigurator im Kundenbetrieb',
      en: 'Live reference: 3D configurator in client production'
    },
    description: {
      de: 'Produktive Datei-zu-Preis-Strecke mit Checkout-Handoff als öffentlicher Proof.',
      en: 'Production file-to-price flow with checkout handoff as public proof.'
    },
    href: 'https://deinlieblingsdruck.de/3d-konfigurator/#preisrechner',
    external: true,
    published: true
  },
  {
    id: 'github-public-build-log',
    title: {
      de: 'Public Proof: GitHub Build-Historie und Release-Artefakte',
      en: 'Public proof: GitHub build history and release artifacts'
    },
    description: {
      de: 'Transparente Commits, Changelog-Entwicklung und technische Umsetzung öffentlich nachvollziehbar.',
      en: 'Transparent commits, changelog evolution, and implementation details are publicly traceable.'
    },
    href: 'https://github.com/trixr1907',
    external: true,
    published: true
  },
  {
    id: 'authority-relaunch-case',
    title: {
      de: 'Case Study: Authority Relaunch mit KPI-Snapshots',
      en: 'Case study: Authority relaunch with KPI snapshots'
    },
    description: {
      de: 'Dokumentierte Informationsarchitektur, CTA-Funnel und Performance-Guardrails.',
      en: 'Documented information architecture, CTA funnel, and performance guardrails.'
    },
    href: '/case-studies/portfolio-authority-relaunch',
    external: false,
    published: true
  }
];

export function getPublishedTrustEvidence(locale: Locale): Array<{
  id: string;
  title: string;
  description: string;
  href: string;
  external: boolean;
}> {
  return TRUST_EVIDENCE.filter((item) => item.published).map((item) => ({
    id: item.id,
    title: item.title[locale],
    description: item.description[locale],
    href: item.href,
    external: item.external
  }));
}
