import type { Metadata } from 'next';

import { BrandShowcasePage } from '@/app-pages/BrandShowcasePage';
import { SITE_URL } from '@/lib/site';

const locale = 'de';
const canonicalPath = '/brand';
const canonical = `${SITE_URL}${canonicalPath}`;
const title = 'Brand Showcase | ivo-tech';
const description = 'Oeffentliche Showcase-Seite fuer das ivo-tech Logo-System, Motion-Sting und Download-Assets.';

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
    locale: 'de_DE'
  }
};

export default function BrandPage() {
  return <BrandShowcasePage locale={locale} />;
}
