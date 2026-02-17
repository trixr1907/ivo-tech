import { HubIndexPage } from '@/app-pages/HubIndexPage';
import { buildHubIndexMetadata } from '@/app-pages/hubMetadata';
import { getHubEntries } from '@/content/hub';

export const metadata = buildHubIndexMetadata('insights', 'en');

export default function InsightsIndexPageEn() {
  return <HubIndexPage locale="en" kind="insights" entries={getHubEntries('insights', 'en')} />;
}
