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
  const service = getLocalizedServiceDetail('en', slug);
  if (!service) return {};

  return {
    title: service.seoTitle.en,
    description: service.seoDescription.en,
    alternates: {
      canonical: `/en/services/${slug}`,
      languages: {
        de: `/leistungen/${slug}`,
        en: `/en/services/${slug}`,
        'x-default': `/leistungen/${slug}`
      }
    },
    robots: { index: true, follow: true }
  };
}

export default async function ServiceDetailPageEn({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const service = getLocalizedServiceDetail('en', slug);
  if (!service) notFound();

  return <ServiceDetailPage locale="en" slug={slug} content={service.content} />;
}
