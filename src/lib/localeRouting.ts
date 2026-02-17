import type { Locale } from '@/content/copy';

export function getLocalePrefix(locale: Locale) {
  return locale === 'en' ? '/en' : '';
}

export function localizePath(path: string, locale: Locale) {
  if (!path.startsWith('/')) {
    throw new Error(`Expected absolute path, got: ${path}`);
  }

  const prefix = getLocalePrefix(locale);
  if (!prefix) return path;
  if (path === '/') return prefix;
  return `${prefix}${path}`;
}

export function stripLocalePrefix(pathname: string) {
  if (pathname === '/en') return { locale: 'en' as const, barePath: '/' as const };
  if (pathname.startsWith('/en/')) return { locale: 'en' as const, barePath: pathname.slice(3) || '/' };
  return { locale: 'de' as const, barePath: pathname || '/' };
}
