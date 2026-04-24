import { HubIndexPage } from '@/app-pages/HubIndexPage';
import { buildHubIndexMetadata } from '@/app-pages/hubMetadata';
import { getHubEntries } from '@/content/hub';

export const metadata = buildHubIndexMetadata('playbooks', 'en');

export default function PlaybooksIndexPageEn() {
  return <HubIndexPage locale="en" kind="playbooks" entries={getHubEntries('playbooks', 'en')} />;
}
