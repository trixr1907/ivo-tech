import { headers } from 'next/headers';

import { HubIndexPage } from '@/app-pages/HubIndexPage';
import { buildHubIndexMetadata } from '@/app-pages/hubMetadata';
import { getHubEntries } from '@/content/hub';
import { SITE_URL } from '@/lib/site';

export const metadata = buildHubIndexMetadata('case-studies', 'de');

export default async function CaseStudiesIndexPage() {
  const requestHeaders = await headers();
  const nonce = requestHeaders.get('x-nonce') ?? undefined;
  const entries = getHubEntries('case-studies', 'de');
  const canonical = `${SITE_URL}/case-studies`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: 'Fallstudien | ivo-tech',
        inLanguage: 'de'
      },
      {
        '@type': 'ItemList',
        '@id': `${canonical}#items`,
        itemListElement: entries.map((entry, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: entry.title,
          url: `${SITE_URL}/case-studies/${entry.slug}`
        }))
      }
    ]
  };

  return (
    <>
      <script nonce={nonce} suppressHydrationWarning type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HubIndexPage locale="de" kind="case-studies" entries={entries} />
    </>
  );
}
