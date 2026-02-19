import type { Metadata } from 'next';

import { BrandShowcasePage } from '@/app-pages/BrandShowcasePage';
import { SITE_URL } from '@/lib/site';

const locale = 'en';
const canonicalPath = '/en/brand';
const canonical = `${SITE_URL}${canonicalPath}`;
const title = 'Brand Showcase | ivo-tech';
const description = 'Public showcase page for the ivo-tech logo system, motion sting, and downloadable assets.';

export const metadata: Metadata = {
  title,
  description,
  robots: { index: false, follow: false },
  alternates: {
    canonical: canonicalPath,
    languages: {
      de: '/brand',
      en: '/en/brand',
      'x-default': '/brand'
    }
  },
  openGraph: {
    type: 'website',
    siteName: 'ivo-tech',
    title,
    description,
    url: canonical,
    images: [`${SITE_URL}/assets/logo.png`],
    locale: 'en_US'
  }
};

export default function BrandPageEn() {
  return <BrandShowcasePage locale={locale} />;
}
