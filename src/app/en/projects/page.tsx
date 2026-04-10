import type { Metadata } from 'next';
import { headers } from 'next/headers';

import { ProjectsBrandPage } from '@/app-pages/PortfolioBrandPages';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Projects | ivo-tech',
  description: 'Professional and maker projects with clear architecture, outcomes, and implementation depth.',
  robots: { index: true, follow: true },
  alternates: {
    canonical: '/en/projects',
    languages: {
      de: '/projects',
      en: '/en/projects',
      'x-default': '/projects'
    }
  }
};

export default async function ProjectsPageEn() {
  const requestHeaders = await headers();
  const nonce = requestHeaders.get('x-nonce') ?? undefined;
  const canonical = `${SITE_URL}/en/projects`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: 'Projects | ivo-tech',
        description: 'Professional and maker projects with clear architecture, outcomes, and implementation depth.',
        inLanguage: 'en'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumbs`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/en` },
          { '@type': 'ListItem', position: 2, name: 'Projects', item: canonical }
        ]
      }
    ]
  };

  return (
    <>
      <script nonce={nonce} suppressHydrationWarning type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProjectsBrandPage locale="en" />
    </>
  );
}
