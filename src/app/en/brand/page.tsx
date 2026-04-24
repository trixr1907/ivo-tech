import type { Metadata } from 'next';

import { BrandShowcasePage } from '@/app-pages/BrandShowcasePage';

export const metadata: Metadata = {
  title: 'Brand Showcase | ivo-tech',
  description: 'Logo system, motion guidance, and downloadable brand assets for ivo-tech.',
  robots: { index: false, follow: true }
};

export default function BrandPageEn() {
  return <BrandShowcasePage locale="en" />;
}
