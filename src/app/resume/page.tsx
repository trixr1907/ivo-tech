import type { Metadata } from 'next';

import { ResumePage } from '@/app-pages/HiringResumePages';

export const metadata: Metadata = {
  title: 'Resume | ivo-tech',
  description: 'Strukturierter Resume-Überblick zu Profil, Fokus und Arbeitsmodell.',
  alternates: {
    canonical: '/resume',
    languages: {
      de: '/resume',
      en: '/en/resume',
      'x-default': '/resume'
    }
  }
};

export default function ResumeRoutePage() {
  return <ResumePage locale="de" />;
}
