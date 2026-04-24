import type { Metadata } from 'next';
import { headers } from 'next/headers';

import { ContactBrandPage } from '@/app-pages/PortfolioBrandPages';
import { CONTACT_EMAIL, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Kontakt | ivo-tech',
  description: 'Direkter Kontaktpfad für Hiring, Projektkollaboration und Maker-Exchange.',
  robots: { index: true, follow: true },
  alternates: {
    canonical: '/contact',
    languages: {
      de: '/contact',
      en: '/en/contact',
      'x-default': '/contact'
    }
  }
};

export default async function ContactRoutePage() {
  const requestHeaders = await headers();
  const nonce = requestHeaders.get('x-nonce') ?? undefined;
  const canonical = `${SITE_URL}/contact`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ContactPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: 'Kontakt | ivo-tech',
        description: 'Direkter Kontaktpfad für Hiring, Projektkollaboration und Maker-Exchange.',
        inLanguage: 'de'
      },
      {
        '@type': 'Person',
        '@id': `${SITE_URL}#person`,
        name: 'Ivo',
        email: `mailto:${CONTACT_EMAIL}`,
        url: SITE_URL
      },
      {
        '@type': 'ContactPoint',
        '@id': `${canonical}#contact`,
        contactType: 'business inquiry',
        email: CONTACT_EMAIL,
        availableLanguage: ['de', 'en']
      }
    ]
  };

  return (
    <>
      <script nonce={nonce} suppressHydrationWarning type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ContactBrandPage locale="de" />
    </>
  );
}
