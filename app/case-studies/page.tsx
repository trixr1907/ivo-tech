import { HubIndexPage } from '@/app-pages/HubIndexPage';
import { buildHubIndexMetadata } from '@/app-pages/hubMetadata';
import { getHubEntries } from '@/content/hub';

export const metadata = buildHubIndexMetadata('case-studies', 'de');

export default function CaseStudiesIndexPage() {
  return <HubIndexPage locale="de" kind="case-studies" entries={getHubEntries('case-studies', 'de')} />;
}
