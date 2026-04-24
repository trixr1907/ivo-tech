import type { Metadata } from 'next';

import { ResumePage } from '@/app-pages/HiringResumePages';

export const metadata: Metadata = {
  title: 'Resume | ivo-tech',
  description: 'Structured resume overview for hiring and technical collaboration.',
  alternates: {
    canonical: '/en/resume',
    languages: {
      de: '/resume',
      en: '/en/resume',
      'x-default': '/resume'
    }
  }
};

export default function ResumeRoutePageEn() {
  return <ResumePage locale="en" />;
}
