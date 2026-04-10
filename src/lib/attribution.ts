export type AttributionLocale = 'de' | 'en';

type ThankYouPrimaryCta = {
  href: string;
  label: string;
};

export function normalizeAttributionSource(value: string | null | undefined, fallback = 'unknown') {
  if (!value) return fallback;
  const cleaned = value.trim().toLowerCase();
  if (/^[a-z0-9_-]{1,40}$/.test(cleaned)) return cleaned;
  return fallback;
}

export function getThankYouPrimaryCta(locale: AttributionLocale, source: string): ThankYouPrimaryCta {
  if (source.includes('services')) {
    return locale === 'de'
      ? { href: '/leistungen', label: 'Leistungsmodell vertiefen' }
      : { href: '/en/services', label: 'Review service scope' };
  }

  if (source.includes('playbook')) {
    return locale === 'de'
      ? { href: '/playbooks', label: 'Playbooks ansehen' }
      : { href: '/en/playbooks', label: 'Browse playbooks' };
  }

  if (source.includes('case')) {
    return locale === 'de'
      ? { href: '/case-studies', label: 'Weitere Case Studies ansehen' }
      : { href: '/en/case-studies', label: 'View more case studies' };
  }

  if (source.includes('insights')) {
    return locale === 'de'
      ? { href: '/insights', label: 'Mehr technische Insights lesen' }
      : { href: '/en/insights', label: 'Read more insights' };
  }

  return locale === 'de'
    ? { href: '/case-studies/configurator-live', label: 'Case Study ansehen' }
    : { href: '/en/case-studies/configurator-live', label: 'View case study' };
}
