import type { Metadata } from 'next';
import { Suspense } from 'react';

import { HomePageClient } from '@/app-pages/HomePageClient';
import { copy } from '@/content/copy';
import { getFeaturedInsights } from '@/content/hub';
import { CONTACT_EMAIL, GITHUB_URL, SITE_URL } from '@/lib/site';

const locale = 'en';
const t = copy[locale];
const canonical = `${SITE_URL}/en`;
const ogLogo = `${SITE_URL}/assets/logo.png`;

const featuredInsights = getFeaturedInsights(locale, 3).map((entry) => ({
  slug: entry.slug,
  title: entry.title,
  summary: entry.summary,
  category: entry.category,
  readMinutes: entry.readMinutes
}));

export const metadata: Metadata = {
  title: t.meta.title,
  description: t.meta.description,
  robots: { index: true, follow: true },
  alternates: {
    canonical: '/en',
    languages: {
      de: '/',
      en: '/en',
      'x-default': '/'
    }
  },
  openGraph: {
    type: 'website',
    siteName: 'ivo-tech',
    title: t.meta.title,
    description: t.meta.description,
    url: canonical,
    images: [ogLogo],
    locale: 'en_US'
  },
  twitter: {
    card: 'summary_large_image',
    title: t.meta.title,
    description: t.meta.description,
    images: [ogLogo]
  }
};

export default async function HomePageEn() {
  const faqSchema = {
    '@type': 'FAQPage',
    '@id': `${canonical}#faq`,
    inLanguage: locale,
    mainEntity: t.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a
      }
    }))
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': `${SITE_URL}#website`, url: SITE_URL, name: 'ivo-tech' },
      {
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: t.meta.title,
        description: t.meta.description,
        inLanguage: locale,
        isPartOf: { '@id': `${SITE_URL}#website` }
      },
      {
        '@type': 'Person',
        '@id': `${SITE_URL}#person`,
        name: 'Ivo',
        jobTitle: 'Web engineering consultant',
        url: SITE_URL,
        email: `mailto:${CONTACT_EMAIL}`,
        sameAs: [GITHUB_URL]
      },
      {
        '@type': 'Service',
        '@id': `${SITE_URL}#service`,
        name: 'Authority-first web engineering',
        serviceType: 'Web engineering and delivery support',
        provider: { '@id': `${SITE_URL}#person` },
        areaServed: 'Remote',
        availableChannel: {
          '@type': 'ServiceChannel',
          serviceUrl: canonical
        }
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumbs`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: canonical
          }
        ]
      },
      {
        '@type': 'ItemList',
        '@id': `${canonical}#insights-list`,
        itemListElement: featuredInsights.map((insight, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: insight.title,
          url: `${SITE_URL}/en/insights/${insight.slug}`
        }))
      },
      faqSchema
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Suspense fallback={null}>
        <HomePageClient locale={locale} featuredInsights={featuredInsights} />
      </Suspense>
    </>
  );
}
