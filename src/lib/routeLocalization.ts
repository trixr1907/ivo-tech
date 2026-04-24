export const DE_TO_EN_EXACT_PATHS = {
  '/': '/en',
  '/leistungen': '/en/services',
  '/impressum': '/en/legal',
  '/datenschutz': '/en/privacy'
} as const;

export const DE_TO_EN_PREFIX_PATHS = [{ from: '/leistungen/', to: '/en/services/' }] as const;

const EN_TO_DE_EXACT_PATHS = Object.fromEntries(
  Object.entries(DE_TO_EN_EXACT_PATHS).map(([dePath, enPath]) => [enPath, dePath])
) as Record<string, string>;

const EN_TO_DE_PREFIX_PATHS = DE_TO_EN_PREFIX_PATHS.map(({ from, to }) => ({ from: to, to: from }));

function ensureAbsolutePath(pathname: string) {
  if (!pathname.startsWith('/')) {
    throw new Error(`Expected absolute pathname, got: ${pathname}`);
  }
  return pathname;
}

export function toEnglishPath(pathname: string) {
  const normalized = ensureAbsolutePath(pathname);

  if (normalized === '/en' || normalized.startsWith('/en/')) {
    return normalized;
  }

  const exactMatch = DE_TO_EN_EXACT_PATHS[normalized as keyof typeof DE_TO_EN_EXACT_PATHS];
  if (exactMatch) return exactMatch;

  for (const { from, to } of DE_TO_EN_PREFIX_PATHS) {
    if (normalized.startsWith(from)) {
      return `${to}${normalized.slice(from.length)}`;
    }
  }

  return normalized === '/' ? '/en' : `/en${normalized}`;
}

export function toGermanPath(pathname: string) {
  const normalized = ensureAbsolutePath(pathname);

  if (normalized === '/') return '/';
  if (!normalized.startsWith('/en')) return normalized;

  const exactMatch = EN_TO_DE_EXACT_PATHS[normalized];
  if (exactMatch) return exactMatch;

  for (const { from, to } of EN_TO_DE_PREFIX_PATHS) {
    if (normalized.startsWith(from)) {
      return `${to}${normalized.slice(from.length)}`;
    }
  }

  if (normalized === '/en') return '/';
  return normalized.slice(3) || '/';
}
