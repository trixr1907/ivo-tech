import { HubIndexPage } from '@/app-pages/HubIndexPage';
import { buildHubIndexMetadata } from '@/app-pages/hubMetadata';
import { getHubEntries } from '@/content/hub';

export const metadata = buildHubIndexMetadata('insights', 'de');

export default function InsightsIndexPage() {
  return <HubIndexPage locale="de" kind="insights" entries={getHubEntries('insights', 'de')} />;
}
