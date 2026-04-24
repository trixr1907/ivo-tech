import type { Metadata } from 'next';

import { HiringPage } from '@/app-pages/HiringResumePages';

export const metadata: Metadata = {
  title: 'Hiring | ivo-tech',
  description: 'Senior Product Engineering Profil für Hiring-Teams und technische Zusammenarbeit.',
  alternates: {
    canonical: '/hiring',
    languages: {
      de: '/hiring',
      en: '/en/hiring',
      'x-default': '/hiring'
    }
  }
};

export default function HiringRoutePage() {
  return <HiringPage locale="de" />;
}
