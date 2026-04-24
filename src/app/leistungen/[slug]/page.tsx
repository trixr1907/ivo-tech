import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ServiceDetailPage } from '@/app-pages/ServiceDetailPage';
import { getLocalizedServiceDetail, getServiceDetailSlugs, type ServiceDetailSlug } from '@/content/services';

type Params = {
  slug: ServiceDetailSlug;
};

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getServiceDetailSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const service = getLocalizedServiceDetail('de', slug);
  if (!service) return {};

  return {
    title: service.seoTitle.de,
    description: service.seoDescription.de,
    alternates: {
      canonical: `/leistungen/${slug}`,
      languages: {
        de: `/leistungen/${slug}`,
        en: `/en/services/${slug}`,
        'x-default': `/leistungen/${slug}`
      }
    },
    robots: { index: true, follow: true }
  };
}

export default async function ServiceDetailPageDe({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const service = getLocalizedServiceDetail('de', slug);
  if (!service) notFound();

  return <ServiceDetailPage locale="de" slug={slug} content={service.content} />;
}
