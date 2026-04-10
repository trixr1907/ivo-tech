import type { Locale } from '@/content/copy';
import type { HubKind } from '@/content/hub';
import { localizePath } from '@/lib/localeRouting';

type HubConfig = {
  label: Record<Locale, string>;
  indexTitle: Record<Locale, string>;
  indexDescription: Record<Locale, string>;
  readLabel: Record<Locale, string>;
};

export const HUB_CONFIG: Record<HubKind, HubConfig> = {
  insights: {
    label: { de: 'Insights', en: 'Insights' },
    indexTitle: { de: 'Engineering-Insights', en: 'Engineering insights' },
    indexDescription: {
      de: 'Praxisnahe Deep Dives zu Architektur, Performance und Delivery-Entscheidungen.',
      en: 'Practical deep dives on architecture, performance, and delivery decisions.'
    },
    readLabel: { de: 'Artikel lesen', en: 'Read article' }
  },
  playbooks: {
    label: { de: 'Playbooks', en: 'Playbooks' },
    indexTitle: { de: 'Engineering Playbooks', en: 'Engineering playbooks' },
    indexDescription: {
      de: 'Wiederverwendbare Umsetzungs- und Betriebsmuster fuer stabile Delivery.',
      en: 'Reusable implementation and operations patterns for stable delivery.'
    },
    readLabel: { de: 'Playbook lesen', en: 'Read playbook' }
  },
  'case-studies': {
    label: { de: 'Fallstudien', en: 'Case studies' },
    indexTitle: { de: 'Fallstudien', en: 'Case studies' },
    indexDescription: {
      de: 'Projektbelege mit Ausgangslage, Umsetzung, Betrieb und Wirkung.',
      en: 'Project proof with context, implementation, operations, and impact.'
    },
    readLabel: { de: 'Case Study lesen', en: 'Read case study' }
  }
};

export function getHubBasePath(kind: HubKind) {
  return `/${kind}` as const;
}

export function getLocalizedHubPath(kind: HubKind, locale: Locale) {
  return localizePath(getHubBasePath(kind), locale);
}

export function getLocalizedHubDetailPath(kind: HubKind, locale: Locale, slug: string) {
  return localizePath(`/${kind}/${slug}`, locale);
}
