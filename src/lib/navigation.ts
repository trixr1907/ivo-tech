import type { Locale } from '@/content/copy';
import { localizePath } from '@/lib/localeRouting';

export type PrimaryNavLink = {
  href: string;
  label: string;
};

export function getServicesPath(locale: Locale) {
  return locale === 'de' ? '/leistungen' : '/en/services';
}

export function getHiringPath(locale: Locale) {
  return locale === 'de' ? '/hiring' : '/en/hiring';
}

export function getResumePath(locale: Locale) {
  return locale === 'de' ? '/resume' : '/en/resume';
}

export function getPlaybooksPath(locale: Locale) {
  return locale === 'de' ? '/playbooks' : '/en/playbooks';
}

export function getContactPath(locale: Locale, source = 'nav') {
  const base = locale === 'de' ? '/contact' : '/en/contact';
  return `${base}?source=${encodeURIComponent(source)}`;
}

/**
 * Globale Primärnavigation. Für die Startseite mit Anker zur Delivery-Engine-Sektion
 * {@link getHomePagePrimaryNavLinks} nutzen.
 */
export function getPrimaryNavLinks(locale: Locale): PrimaryNavLink[] {
  return [
    {
      href: localizePath('/', locale),
      label: locale === 'de' ? 'Startseite' : 'Home'
    },
    {
      href: localizePath('/about', locale),
      label: locale === 'de' ? 'About' : 'About'
    },
    {
      href: localizePath('/projects', locale),
      label: locale === 'de' ? 'Projekte' : 'Projects'
    },
    {
      href: getServicesPath(locale),
      label: locale === 'de' ? 'Leistungen' : 'Services'
    },
    {
      href: getPlaybooksPath(locale),
      label: locale === 'de' ? 'Playbooks' : 'Playbooks'
    },
    {
      href: getResumePath(locale),
      label: locale === 'de' ? 'Resume' : 'Resume'
    },
    {
      href: localizePath('/maker-lab', locale),
      label: locale === 'de' ? 'Maker Lab' : 'Maker Lab'
    },
    {
      href: localizePath('/insights', locale),
      label: locale === 'de' ? 'Insights' : 'Insights'
    },
    {
      href: localizePath('/case-studies', locale),
      label: locale === 'de' ? 'Case Studies' : 'Case studies'
    },
    {
      href: getHiringPath(locale),
      label: locale === 'de' ? 'Hiring' : 'Hiring'
    },
    {
      href: getContactPath(locale, 'primary-nav'),
      label: locale === 'de' ? 'Kontakt' : 'Contact'
    }
  ];
}

/** Wie {@link getPrimaryNavLinks}, plus Anker „Engine“ zur Sektion `#home-engine` (nur Startseite). */
export function getHomePagePrimaryNavLinks(locale: Locale): PrimaryNavLink[] {
  const base = getPrimaryNavLinks(locale);
  const engine: PrimaryNavLink = {
    href: `${localizePath('/', locale)}#home-engine`,
    label: 'Engine'
  };
  const [home, ...rest] = base;
  return home ? [home, engine, ...rest] : [engine, ...base];
}
