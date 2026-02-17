import type { Metadata } from 'next';

import { ConfiguratorPageClient } from '@/app-pages/ConfiguratorPageClient';
import { getProjectById } from '@/content/projects';
import { SITE_URL } from '@/lib/site';

const locale = 'de';
const heroProject = getProjectById('configurator_3d');
const title = heroProject?.seo_title[locale] ?? '3D-Konfigurator Case Study | IVO TECH';
const description =
  heroProject?.seo_description[locale] ??
  'Premium Case Study: Problem, Loesung, Technologie und Impact des Live 3D-Konfigurators.';

export const metadata: Metadata = {
  title,
  description,
  robots: { index: true, follow: true },
  alternates: {
    canonical: '/configurator',
    languages: {
      de: '/configurator',
      en: '/en/configurator',
      'x-default': '/configurator'
    }
  },
  openGraph: {
    type: 'article',
    siteName: 'IVO TECH',
    title,
    description,
    url: `${SITE_URL}/configurator`,
    images: [`${SITE_URL}/assets/thumb_viewer_neon.png`]
  }
};

export default function ConfiguratorPage() {
  return <ConfiguratorPageClient locale={locale} />;
}
