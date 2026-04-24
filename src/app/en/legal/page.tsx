import type { Metadata } from 'next';

import { LegalRelaunchShell } from '@/app-pages/LegalRelaunchShell';
import { RELAUNCH_LEGAL_DOC_H1, RELAUNCH_LEGAL_DOC_H2 } from '@/lib/relaunchMarketingStyles';

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
      <h1 className={RELAUNCH_LEGAL_DOC_H1}>Legal notice</h1>
      <div className="mt-8 space-y-8 text-sm leading-relaxed text-slate-300 sm:text-base">
        <section>
          <h2 className={RELAUNCH_LEGAL_DOC_H2}>Provider information</h2>
          <p className="mt-2">
            ivo-tech
            <br />
            Yves Schenker
            <br />
            Lange Rötterstr. 56
            <br />
            68167 Mannheim
            <br />
            Germany
          </p>
        </section>

        <section>
          <h2 className={RELAUNCH_LEGAL_DOC_H2}>Contact</h2>
          <p className="mt-2">
            Email:{' '}
            <a className="text-sky-400 hover:text-sky-300" href="mailto:contact@ivo-tech.com">
              contact@ivo-tech.com
            </a>
          </p>
        </section>

        <section>
          <h2 className={RELAUNCH_LEGAL_DOC_H2}>VAT ID</h2>
          <p className="mt-2">No VAT ID pursuant to Section 27a German VAT Act is currently available.</p>
        </section>

        <section>
          <h2 className={RELAUNCH_LEGAL_DOC_H2}>Responsible for content (Section 18 para. 2 MStV)</h2>
          <p className="mt-2">
            Yves Schenker
            <br />
            Lange Rötterstr. 56
            <br />
            68167 Mannheim, Germany
          </p>
        </section>
      </div>
    </LegalRelaunchShell>
  );
}
