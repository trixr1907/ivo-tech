import type { Locale } from '@/content/copy';

export function resolveLocale(locale: string | undefined): Locale {
  return locale === 'en' ? 'en' : 'de';
}
