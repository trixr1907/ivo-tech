import { HubIndexPage } from '@/app-pages/HubIndexPage';
import { buildHubIndexMetadata } from '@/app-pages/hubMetadata';
import { getHubEntries } from '@/content/hub';

export const metadata = buildHubIndexMetadata('case-studies', 'en');

export default function CaseStudiesIndexPageEn() {
  return <HubIndexPage locale="en" kind="case-studies" entries={getHubEntries('case-studies', 'en')} />;
}
