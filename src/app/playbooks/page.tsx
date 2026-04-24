import { HubIndexPage } from '@/app-pages/HubIndexPage';
import { buildHubIndexMetadata } from '@/app-pages/hubMetadata';
import { getHubEntries } from '@/content/hub';

export const metadata = buildHubIndexMetadata('playbooks', 'de');

export default function PlaybooksIndexPage() {
  return <HubIndexPage locale="de" kind="playbooks" entries={getHubEntries('playbooks', 'de')} />;
}
