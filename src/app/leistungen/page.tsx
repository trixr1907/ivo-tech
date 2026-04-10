import type { Metadata } from 'next';

import { ServicesPage } from '@/app-pages/ServicesPage';

export const metadata: Metadata = {
  title: 'Leistungen | ivo-tech',
  description: 'Technical Delivery für conversion-kritische B2B-Webseiten: IA, Frontend-Systeme, QA-Gates und belastbare Handover.',
  robots: { index: true, follow: true },
  alternates: {
    canonical: '/leistungen',
    languages: {
      de: '/leistungen',
      en: '/en/services',
      'x-default': '/leistungen'
    }
  }
};

export default function ServicesPageDe() {
  return <ServicesPage locale="de" />;
}
