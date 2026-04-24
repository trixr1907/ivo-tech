import type { Metadata } from 'next';
import { headers } from 'next/headers';

import { AboutBrandPage } from '@/app-pages/PortfolioBrandPages';
import { GITHUB_URL, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Über mich | ivo-tech',
  description: 'Builder-Engineer-Profil mit produktionsnaher Delivery, Portfolio-Tiefe und Maker-Mindset.',
  robots: { index: true, follow: true },
  alternates: {
    canonical: '/about',
    languages: {
      de: '/about',
      en: '/en/about',
      'x-default': '/about'
    }
  }
};

export default async function AboutPage() {
  const requestHeaders = await headers();
  const nonce = requestHeaders.get('x-nonce') ?? undefined;
  const canonical = `${SITE_URL}/about`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: 'Über mich | ivo-tech',
        description: 'Builder-Engineer-Profil mit produktionsnaher Delivery, Portfolio-Tiefe und Maker-Mindset.',
        inLanguage: 'de'
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
          { '@type': 'ListItem', position: 1, name: 'Startseite', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Über mich', item: canonical }
        ]
      }
    ]
  };

  return (
    <>
      <script nonce={nonce} suppressHydrationWarning type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AboutBrandPage locale="de" />
    </>
  );
}
