import { headers } from 'next/headers';

import { HubIndexPage } from '@/app-pages/HubIndexPage';
import { buildHubIndexMetadata } from '@/app-pages/hubMetadata';
import { getHubEntries } from '@/content/hub';
import { SITE_URL } from '@/lib/site';

export const metadata = buildHubIndexMetadata('case-studies', 'en');

export default async function CaseStudiesIndexPageEn() {
  const requestHeaders = await headers();
  const nonce = requestHeaders.get('x-nonce') ?? undefined;
  const entries = getHubEntries('case-studies', 'en');
  const canonical = `${SITE_URL}/en/case-studies`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: 'Case Studies | ivo-tech',
        inLanguage: 'en'
      },
      {
        '@type': 'ItemList',
        '@id': `${canonical}#items`,
        itemListElement: entries.map((entry, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: entry.title,
          url: `${SITE_URL}/en/case-studies/${entry.slug}`
        }))
      }
    ]
  };

  return (
    <>
      <script nonce={nonce} suppressHydrationWarning type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HubIndexPage locale="en" kind="case-studies" entries={entries} />
    </>
  );
}
