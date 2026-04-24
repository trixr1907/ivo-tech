import type { Metadata } from 'next';

import { LegalRelaunchShell } from '@/app-pages/LegalRelaunchShell';
import { RELAUNCH_LEGAL_DOC_H1, RELAUNCH_LEGAL_DOC_H2 } from '@/lib/relaunchMarketingStyles';

export const metadata: Metadata = {
  title: 'Impressum | ivo-tech',
  description: 'Rechtliche Anbieterkennzeichnung von ivo-tech.',
  alternates: {
    canonical: '/impressum',
    languages: {
      de: '/impressum',
      en: '/en/legal',
      'x-default': '/impressum'
    }
  }
};

export default function ImpressumPage() {
  return (
    <LegalRelaunchShell locale="de" shellClassName="impressum-page">
      <h1 className={RELAUNCH_LEGAL_DOC_H1}>Impressum</h1>
      <div className="mt-8 space-y-8 text-sm leading-relaxed text-slate-300 sm:text-base">
        <section>
          <h2 className={RELAUNCH_LEGAL_DOC_H2}>Angaben gemäß § 5 TMG</h2>
          <p className="mt-2">
            ivo-tech
            <br />
            Yves Schenker
            <br />
            Lange Rötterstr. 56
            <br />
            68167 Mannheim
            <br />
            Deutschland
          </p>
        </section>

        <section>
          <h2 className={RELAUNCH_LEGAL_DOC_H2}>Kontakt</h2>
          <p className="mt-2">
            E-Mail:{' '}
            <a className="text-sky-400 hover:text-sky-300" href="mailto:contact@ivo-tech.com">
              contact@ivo-tech.com
            </a>
          </p>
        </section>

        <section>
          <h2 className={RELAUNCH_LEGAL_DOC_H2}>Umsatzsteuer-ID</h2>
          <p className="mt-2">Es liegt derzeit keine Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG vor.</p>
        </section>

        <section>
          <h2 className={RELAUNCH_LEGAL_DOC_H2}>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
          <p className="mt-2">
            Yves Schenker
            <br />
            Lange Rötterstr. 56
            <br />
            68167 Mannheim, Deutschland
          </p>
        </section>
      </div>
    </LegalRelaunchShell>
  );
}
