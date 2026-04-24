import type { Metadata } from 'next';

import { LegalRelaunchShell } from '@/app-pages/LegalRelaunchShell';
import { RELAUNCH_LEGAL_DOC_H1, RELAUNCH_LEGAL_DOC_H2 } from '@/lib/relaunchMarketingStyles';

export const metadata: Metadata = {
  title: 'Datenschutz | ivo-tech',
  description: 'Datenschutzhinweise für ivo-tech.',
  alternates: {
    canonical: '/datenschutz',
    languages: {
      de: '/datenschutz',
      en: '/en/privacy',
      'x-default': '/datenschutz'
    }
  }
};

export default function DatenschutzPage() {
  return (
    <LegalRelaunchShell locale="de" shellClassName="datenschutz-page">
      <h1 className={RELAUNCH_LEGAL_DOC_H1}>Datenschutzerklärung</h1>
      <div className="mt-8 space-y-8 text-sm leading-relaxed text-slate-300 sm:text-base">
        <section>
          <h2 className={RELAUNCH_LEGAL_DOC_H2}>1. Verantwortlicher</h2>
          <p className="mt-2">
            Ivo Tech
            <br />
            Ivo
            <br />
            Mannheim, Deutschland
            <br />
            E-Mail:{' '}
            <a className="text-sky-400 hover:text-sky-300" href="mailto:contact@ivo-tech.com">
              contact@ivo-tech.com
            </a>
          </p>
        </section>

        <section>
          <h2 className={RELAUNCH_LEGAL_DOC_H2}>2. Zweck der Datenverarbeitung</h2>
          <p className="mt-2">
            Wir verarbeiten personenbezogene Daten zur Bearbeitung von Kontaktanfragen, zur technischen Bereitstellung der Website und zur Verbesserung
            von Stabilität und Nutzerführung.
          </p>
        </section>

        <section>
          <h2 className={RELAUNCH_LEGAL_DOC_H2}>3. Kontaktformular</h2>
          <p className="mt-2">
            Bei Nutzung des Formulars werden Name, E-Mail, optional Firma, Nachricht und technische Metadaten verarbeitet, um die Anfrage zu beantworten.
          </p>
        </section>

        <section>
          <h2 className={RELAUNCH_LEGAL_DOC_H2}>4. Hosting und technische Protokolle</h2>
          <p className="mt-2">
            Beim Aufruf der Website werden technisch erforderliche Verbindungsdaten (z. B. IP-Adresse, Zeitstempel, User-Agent) serverseitig verarbeitet.
          </p>
        </section>

        <section>
          <h2 className={RELAUNCH_LEGAL_DOC_H2}>5. Rechte der betroffenen Personen</h2>
          <p className="mt-2">Sie haben nach DSGVO das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch und Datenübertragbarkeit.</p>
        </section>

        <section>
          <h2 className={RELAUNCH_LEGAL_DOC_H2}>6. Speicherdauer</h2>
          <p className="mt-2">Daten werden nur so lange gespeichert, wie dies für den jeweiligen Zweck und gesetzliche Aufbewahrungsfristen erforderlich ist.</p>
        </section>
      </div>
    </LegalRelaunchShell>
  );
}
