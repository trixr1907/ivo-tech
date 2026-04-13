import type { Metadata } from 'next';

import { LegalRelaunchShell } from '@/app-pages/LegalRelaunchShell';

export const metadata: Metadata = {
  title: 'Privacy policy | ivo-tech',
  description: 'Privacy policy for ivo-tech.',
  alternates: {
    canonical: '/en/privacy',
    languages: {
      de: '/datenschutz',
      en: '/en/privacy',
      'x-default': '/datenschutz'
    }
  }
};

export default function PrivacyPageEn() {
  return (
    <LegalRelaunchShell locale="en" shellClassName="privacy-en-page">
      <h1 className="font-display text-3xl font-semibold text-slate-100 sm:text-4xl">Privacy policy</h1>
      <div className="mt-8 space-y-8 text-sm leading-relaxed text-slate-300 sm:text-base">
        <section>
          <h2 className="text-lg font-semibold text-slate-100">1. Data controller</h2>
          <p className="mt-2">
            ivo-tech
            <br />
            Yves Schenker
            <br />
            Lange Rötterstr. 56
            <br />
            68167 Mannheim, Germany
            <br />
            Email:{' '}
            <a className="text-sky-400 hover:text-sky-300" href="mailto:contact@ivo-tech.com">
              contact@ivo-tech.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-100">2. Processing purposes</h2>
          <p className="mt-2">
            We process personal data to handle contact requests, provide the website technically, and improve delivery quality and product stability.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-100">3. Contact form</h2>
          <p className="mt-2">When using the form, we process name, email, optional company, message, and technical metadata to respond to your request.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-100">4. Data subject rights</h2>
          <p className="mt-2">You have rights under applicable law to access, rectify, delete, restrict, object, and request portability of your data.</p>
        </section>
      </div>
    </LegalRelaunchShell>
  );
}
