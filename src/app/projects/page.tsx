import type { Metadata } from 'next';
import { headers } from 'next/headers';

import { ProjectsBrandPage } from '@/app-pages/PortfolioBrandPages';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Projekte | ivo-tech',
  description: 'Professional- und Maker-Projekte mit klarer Architektur, Ergebnissen und technischer Tiefe.',
  robots: { index: true, follow: true },
  alternates: {
    canonical: '/projects',
    languages: {
      de: '/projects',
      en: '/en/projects',
      'x-default': '/projects'
    }
  }
};

export default async function ProjectsPage() {
  const requestHeaders = await headers();
  const nonce = requestHeaders.get('x-nonce') ?? undefined;
  const canonical = `${SITE_URL}/projects`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: 'Projekte | ivo-tech',
        description: 'Professional- und Maker-Projekte mit klarer Architektur, Ergebnissen und technischer Tiefe.',
        inLanguage: 'de'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumbs`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Startseite', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Projekte', item: canonical }
        ]
      }
    ]
  };

  return (
    <>
      <script nonce={nonce} suppressHydrationWarning type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProjectsBrandPage locale="de" />
    </>
  );
}
