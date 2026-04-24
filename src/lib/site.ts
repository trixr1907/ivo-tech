import { env } from '@/env';

export const SITE_URL = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
export const CONTACT_EMAIL = 'contact@ivo-tech.com';
export const GITHUB_URL = 'https://github.com/trixr1907';
export const CV_PATH = {
  de: '/cv/ivo-cv-de.pdf',
  en: '/cv/ivo-cv-en.pdf'
} as const;
