import type { Metadata } from 'next';

import { LegalRelaunchShell } from '@/app-pages/LegalRelaunchShell';

export const metadata: Metadata = {
  title: 'Legal notice | ivo-tech',
  description: 'Legal notice for ivo-tech.',
  alternates: {
    canonical: '/en/legal',
    languages: {
      de: '/impressum',
      en: '/en/legal',
      'x-default': '/impressum'
    }
  }
};

export default function LegalPageEn() {
  return (
    <LegalRelaunchShell locale="en" shellClassName="legal-en-page">
      <h1 className="font-display text-3xl font-semibold text-slate-100 sm:text-4xl">Legal notice</h1>
      <div className="mt-8 space-y-8 text-sm leading-relaxed text-slate-300 sm:text-base">
        <section>
          <h2 className="text-lg font-semibold text-slate-100">Provider information</h2>
          <p className="mt-2">
            Ivo Tech
            <br />
            Ivo
            <br />
            Mannheim
            <br />
            Germany
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-100">Contact</h2>
          <p className="mt-2">
            Email:{' '}
            <a className="text-sky-400 hover:text-sky-300" href="mailto:contact@ivo-tech.com">
              contact@ivo-tech.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-100">VAT ID</h2>
          <p className="mt-2">VAT ID pursuant to Section 27a German VAT Act: published here when available.</p>
        </section>
      </div>
    </LegalRelaunchShell>
  );
}
