import type { Metadata } from 'next';
import { headers } from 'next/headers';

import { AboutBrandPage } from '@/app-pages/PortfolioBrandPages';
import { GITHUB_URL, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About | ivo-tech',
  description: 'Builder-engineer profile with production-grade delivery, portfolio depth, and maker mindset.',
  robots: { index: true, follow: true },
  alternates: {
    canonical: '/en/about',
    languages: {
      de: '/about',
      en: '/en/about',
      'x-default': '/about'
    }
  }
};

export default async function AboutPageEn() {
  const requestHeaders = await headers();
  const nonce = requestHeaders.get('x-nonce') ?? undefined;
  const canonical = `${SITE_URL}/en/about`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: 'About | ivo-tech',
        description: 'Builder-engineer profile with production-grade delivery, portfolio depth, and maker mindset.',
        inLanguage: 'en'
      },
      {
        '@type': 'Person',
        '@id': `${SITE_URL}#person`,
        name: 'Ivo',
        url: SITE_URL,
        sameAs: [GITHUB_URL]
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumbs`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/en` },
          { '@type': 'ListItem', position: 2, name: 'About', item: canonical }
        ]
      }
    ]
  };

  return (
    <>
      <script nonce={nonce} suppressHydrationWarning type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AboutBrandPage locale="en" />
    </>
  );
}
