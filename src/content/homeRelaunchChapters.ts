import type { Locale } from '@/content/copy';

export const HOME_CHAPTER_TOTAL = 12 as const;

const chapterLabels: Record<
  Locale,
  [string, string, string, string, string, string, string, string, string, string, string, string]
> = {
  de: [
    'Hero',
    'System',
    'Angebot',
    'Partner',
    'Arbeit',
    'Delivery',
    'Mannheim',
    'Performance',
    'Fokus',
    'Details',
    'Fragen',
    'Kontakt'
  ],
  en: [
    'Hero',
    'System',
    'Offer',
    'Partners',
    'Work',
    'Delivery',
    'Arena',
    'Performance',
    'Focus',
    'Details',
    'FAQ',
    'Contact'
  ]
};

export function getHomeChapterLabels(locale: Locale): string[] {
  return [...chapterLabels[locale]];
}
