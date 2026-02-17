import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { HubDetailPage } from '@/app-pages/HubDetailPage';
import { buildHubDetailMetadata } from '@/app-pages/hubMetadata';
import { getHubEntry, getHubSlugs } from '@/content/hub';

type Params = {
  slug: string;
};

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getHubSlugs('case-studies', 'en').map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = getHubEntry('case-studies', 'en', slug);
  if (!entry) return {};
  return buildHubDetailMetadata('case-studies', 'en', entry);
}

export default async function CaseStudyDetailPageEn({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const entry = getHubEntry('case-studies', 'en', slug);
  if (!entry) notFound();

  return <HubDetailPage locale="en" kind="case-studies" entry={entry} />;
}
