import { getHubRouteGroups } from '@/content/hub';
import { getServiceDetailSlugs } from '@/content/services';
import { localizePath } from '@/lib/localeRouting';
import { SITE_URL } from '@/lib/site';

type RouteGroup = {
  de?: string;
  en?: string;
  xDefault: string;
  changefreq: 'weekly' | 'monthly';
  priority: '1.0' | '0.8' | '0.7';
};

const STATIC_ROUTE_GROUPS: RouteGroup[] = [
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
  },
  {
    de: '/insights',
    en: '/en/insights',
    xDefault: '/insights',
    changefreq: 'weekly',
    priority: '0.8'
  },
  {
    de: '/about',
    en: '/en/about',
    xDefault: '/about',
    changefreq: 'monthly',
    priority: '0.8'
  },
  {
    de: '/projects',
    en: '/en/projects',
    xDefault: '/projects',
    changefreq: 'weekly',
    priority: '0.8'
  },
  {
    de: '/maker-lab',
    en: '/en/maker-lab',
    xDefault: '/maker-lab',
    changefreq: 'weekly',
    priority: '0.8'
  },
  {
    de: '/contact',
    en: '/en/contact',
    xDefault: '/contact',
    changefreq: 'weekly',
    priority: '0.8'
  },
  {
    de: '/hiring',
    en: '/en/hiring',
    xDefault: '/hiring',
    changefreq: 'weekly',
    priority: '0.8'
  },
  {
    de: '/resume',
    en: '/en/resume',
    xDefault: '/resume',
    changefreq: 'monthly',
    priority: '0.7'
  },
  {
    de: '/playbooks',
    en: '/en/playbooks',
    xDefault: '/playbooks',
    changefreq: 'weekly',
    priority: '0.8'
  },
  {
    de: '/case-studies',
    en: '/en/case-studies',
    xDefault: '/case-studies',
    changefreq: 'weekly',
    priority: '0.8'
  },
  {
    de: '/leistungen',
    en: '/en/services',
    xDefault: '/leistungen',
    changefreq: 'weekly',
    priority: '0.8'
  },
  {
    de: '/brand',
    en: '/en/brand',
    xDefault: '/brand',
    changefreq: 'monthly',
    priority: '0.7'
  },
  {
    de: '/impressum',
    en: '/en/legal',
    xDefault: '/impressum',
    changefreq: 'monthly',
    priority: '0.7'
  },
  {
    de: '/datenschutz',
    en: '/en/privacy',
    xDefault: '/datenschutz',
    changefreq: 'monthly',
    priority: '0.7'
  }
];

function toAbsolutePath(route: string) {
  return route === '/' ? `${SITE_URL}/` : `${SITE_URL}${route}`;
}

function buildDynamicRouteGroups(): RouteGroup[] {
  const grouped = new Map<string, RouteGroup>();

  for (const route of getHubRouteGroups()) {
    const key = `${route.kind}:${route.slug}`;
    const existing: RouteGroup = grouped.get(key) ?? {
      xDefault: localizePath(`/${route.kind}/${route.slug}`, 'de'),
      changefreq: 'monthly' as const,
      priority: '0.7' as const
    };

    if (route.locale === 'de') {
      existing.de = localizePath(`/${route.kind}/${route.slug}`, 'de');
      existing.xDefault = existing.de;
    } else {
      existing.en = localizePath(`/${route.kind}/${route.slug}`, 'en');
    }

    grouped.set(key, existing);
  }

  return [...grouped.values()];
}

function buildServiceDetailRouteGroups(): RouteGroup[] {
  return getServiceDetailSlugs().map((slug) => ({
    de: `/leistungen/${slug}`,
    en: `/en/services/${slug}`,
    xDefault: `/leistungen/${slug}`,
    changefreq: 'monthly' as const,
    priority: '0.7' as const
  }));
}

function buildSitemap(lastModified: string) {
  const allGroups = [...STATIC_ROUTE_GROUPS, ...buildServiceDetailRouteGroups(), ...buildDynamicRouteGroups()];

  const urls = allGroups
    .flatMap((group) => {
      const pathEntries = [group.de, group.en].filter(Boolean) as string[]; // only index existing locale pages
      const alternates = [
        group.de ? { hrefLang: 'de', href: toAbsolutePath(group.de) } : null,
        group.en ? { hrefLang: 'en', href: toAbsolutePath(group.en) } : null,
        { hrefLang: 'x-default', href: toAbsolutePath(group.xDefault) }
      ].filter(Boolean) as { hrefLang: string; href: string }[];

      return pathEntries.map((route) => {
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
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    urls,
    '</urlset>'
  ].join('\n');
}

export async function GET() {
  const lastModified = new Date().toISOString();
  const xml = buildSitemap(lastModified);

  return new Response(xml, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400'
    }
  });
}
