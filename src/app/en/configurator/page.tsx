import type { Metadata } from 'next';

import { ConfiguratorPageClient } from '@/app-pages/ConfiguratorPageClient';
import { getProjectById } from '@/content/projects';
import { SITE_URL } from '@/lib/site';

const locale = 'en';
const heroProject = getProjectById('configurator_3d');
const title = heroProject?.seo_title[locale] ?? '3D configurator case study | ivo-tech';
const description =
  heroProject?.seo_description[locale] ??
  'Premium case study: problem, solution, technology, and impact of the live 3D configurator.';

export const metadata: Metadata = {
  title,
  description,
  robots: { index: true, follow: true },
  alternates: {
    canonical: '/en/configurator',
    languages: {
      de: '/configurator',
      en: '/en/configurator',
      'x-default': '/configurator'
    }
  },
  openGraph: {
    type: 'article',
    siteName: 'ivo-tech',
    title,
    description,
    url: `${SITE_URL}/en/configurator`,
    images: [`${SITE_URL}/assets/thumb_viewer_neon.png`]
  }
};

export default function ConfiguratorPageEn() {
  return <ConfiguratorPageClient locale={locale} />;
}
