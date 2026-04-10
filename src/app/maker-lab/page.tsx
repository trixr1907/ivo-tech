import type { Metadata } from 'next';

import { MakerLabPage } from '@/app-pages/PortfolioBrandPages';

export const metadata: Metadata = {
  title: 'Maker Lab | ivo-tech',
  description: '3D-Printing, Prototyping und Maker-Workflows mit klarem Transfer in produktionsnahe Systeme.',
  robots: { index: true, follow: true },
  alternates: {
    canonical: '/maker-lab',
    languages: {
      de: '/maker-lab',
      en: '/en/maker-lab',
      'x-default': '/maker-lab'
    }
  }
};

export default function MakerLabRoutePage() {
  return <MakerLabPage locale="de" />;
}
