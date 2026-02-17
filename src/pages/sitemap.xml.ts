import type { GetServerSideProps } from 'next';

import { SITE_URL } from '@/lib/site';

type RouteGroup = {
  de: `/${string}` | '/';
  en: `/${string}` | '/';
  xDefault: `/${string}` | '/';
  changefreq: 'weekly' | 'monthly';
  priority: '1.0' | '0.8';
};

const INDEXABLE_ROUTE_GROUPS: RouteGroup[] = [
  {
    de: '/',
    en: '/en',
    xDefault: '/',
    changefreq: 'weekly',
    priority: '1.0'
  },
  {
    de: '/configurator',
    en: '/en/configurator',
    xDefault: '/configurator',
    changefreq: 'monthly',
    priority: '0.8'
  }
];

function toAbsolutePath(route: `/${string}` | '/') {
  return route === '/' ? `${SITE_URL}/` : `${SITE_URL}${route}`;
}

function buildSitemap(lastModified: string) {
  const urls = INDEXABLE_ROUTE_GROUPS.flatMap((group) => {
    const alternates = [
      { hrefLang: 'de', href: toAbsolutePath(group.de) },
      { hrefLang: 'en', href: toAbsolutePath(group.en) },
      { hrefLang: 'x-default', href: toAbsolutePath(group.xDefault) }
    ];

    return [group.de, group.en].map((route) => {
      const loc = toAbsolutePath(route);
      return [
        '  <url>',
        `    <loc>${loc}</loc>`,
        `    <lastmod>${lastModified}</lastmod>`,
        `    <changefreq>${group.changefreq}</changefreq>`,
        `    <priority>${group.priority}</priority>`,
        ...alternates.map(
          (alternate) =>
            `    <xhtml:link rel="alternate" hreflang="${alternate.hrefLang}" href="${alternate.href}" />`
        ),
        '  </url>'
      ].join('\n');
    });
  }).join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    urls,
    '</urlset>'
  ].join('\n');
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const lastModified = new Date().toISOString();
  const xml = buildSitemap(lastModified);

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.write(xml);
  res.end();

  return { props: {} };
};

export default function SitemapXml() {
  return null;
}
