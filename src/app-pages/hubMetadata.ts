import type { Metadata } from 'next';

import { HUB_CONFIG, getHubBasePath } from '@/app-pages/hubShared';
import type { Locale } from '@/content/copy';
import type { HubEntry, HubKind } from '@/content/hub';
import { localizePath } from '@/lib/localeRouting';
import { SITE_URL } from '@/lib/site';

export function buildHubIndexMetadata(kind: HubKind, locale: Locale): Metadata {
  const config = HUB_CONFIG[kind];
  const basePath = getHubBasePath(kind);
  const canonicalPath = localizePath(basePath, locale);
  const canonical = `${SITE_URL}${canonicalPath}`;

  return {
    title: `${config.indexTitle[locale]} | IVO TECH`,
    description: config.indexDescription[locale],
    robots: { index: true, follow: true },
    alternates: {
      canonical: canonicalPath,
      languages: {
        de: localizePath(basePath, 'de'),
        en: localizePath(basePath, 'en'),
        'x-default': localizePath(basePath, 'de')
      }
    },
    openGraph: {
      type: 'website',
      title: `${config.indexTitle[locale]} | IVO TECH`,
      description: config.indexDescription[locale],
      url: canonical,
      images: [`${SITE_URL}/assets/logo.png`]
    }
  };
}

export function buildHubDetailMetadata(kind: HubKind, locale: Locale, entry: HubEntry): Metadata {
  const basePath = getHubBasePath(kind);
  const canonicalPath = localizePath(`${basePath}/${entry.slug}`, locale);

  return {
    title: `${entry.title} | IVO TECH`,
    description: entry.description,
    robots: { index: true, follow: true },
    alternates: {
      canonical: canonicalPath,
      languages: {
        de: localizePath(`${basePath}/${entry.slug}`, 'de'),
        en: localizePath(`${basePath}/${entry.slug}`, 'en'),
        'x-default': localizePath(`${basePath}/${entry.slug}`, 'de')
      }
    },
    openGraph: {
      type: entry.schemaType === 'HowTo' ? 'article' : 'article',
      title: entry.title,
      description: entry.description,
      url: `${SITE_URL}${canonicalPath}`,
      images: [`${SITE_URL}/assets/logo.png`]
    }
  };
}
