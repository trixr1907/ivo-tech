import type { Locale } from '@/content/copy';
import { localizePath } from '@/lib/localeRouting';

export type PrimaryNavLink = {
  href: string;
  label: string;
};

export function getServicesPath(locale: Locale) {
  return locale === 'de' ? '/leistungen' : '/en/services';
}

export function getContactPath(locale: Locale, source = 'nav') {
  const base = locale === 'de' ? '/contact' : '/en/contact';
  return `${base}?source=${encodeURIComponent(source)}`;
}

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
      href: localizePath('/maker-lab', locale),
      label: locale === 'de' ? 'Maker Lab' : 'Maker Lab'
    },
    {
      href: localizePath('/case-studies', locale),
      label: locale === 'de' ? 'Case Studies' : 'Case studies'
    },
    {
      href: localizePath('/playbooks', locale),
      label: locale === 'de' ? 'Playbooks' : 'Playbooks'
    },
    {
      href: getContactPath(locale, 'primary-nav'),
      label: locale === 'de' ? 'Kontakt' : 'Contact'
    }
  ];
}
