import type { Metadata } from 'next';

import { MakerLabPage } from '@/app-pages/PortfolioBrandPages';

export const metadata: Metadata = {
  title: 'Maker Lab | ivo-tech',
  description: '3D printing, prototyping, and maker workflows with production-ready transfer paths.',
  robots: { index: true, follow: true },
  alternates: {
    canonical: '/en/maker-lab',
    languages: {
      de: '/maker-lab',
      en: '/en/maker-lab',
      'x-default': '/maker-lab'
    }
  }
};

export default function MakerLabRoutePageEn() {
  return <MakerLabPage locale="en" />;
}
