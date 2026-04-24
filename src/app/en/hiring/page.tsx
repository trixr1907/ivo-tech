import type { Metadata } from 'next';

import { HiringPage } from '@/app-pages/HiringResumePages';

export const metadata: Metadata = {
  title: 'Hiring | ivo-tech',
  description: 'Senior product engineering profile for hiring teams and technical collaboration.',
  alternates: {
    canonical: '/en/hiring',
    languages: {
      de: '/hiring',
      en: '/en/hiring',
      'x-default': '/hiring'
    }
  }
};

export default function HiringRoutePageEn() {
  return <HiringPage locale="en" />;
}
