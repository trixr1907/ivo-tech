import type { Metadata } from 'next';

import { ServicesPage } from '@/app-pages/ServicesPage';

export const metadata: Metadata = {
  title: 'Services | ivo-tech',
  description: 'Technical delivery for conversion-critical B2B websites: IA, frontend systems, QA gates, and reliable handover.',
  robots: { index: true, follow: true },
  alternates: {
    canonical: '/en/services',
    languages: {
      de: '/leistungen',
      en: '/en/services',
      'x-default': '/leistungen'
    }
  }
};

export default function ServicesPageEn() {
  return <ServicesPage locale="en" />;
}
