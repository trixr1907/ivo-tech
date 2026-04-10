import type { Metadata } from 'next';

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
    <main className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-soft sm:p-10">
        <h1 className="font-display text-3xl font-semibold text-ink-900 sm:text-4xl">Datenschutzerklärung</h1>
        <div className="mt-8 space-y-8 text-sm leading-relaxed text-ink-700 sm:text-base">
          <section>
            <h2 className="text-lg font-semibold text-ink-900">1. Verantwortlicher</h2>
            <p className="mt-2">
              Ivo Tech
              <br />
              Ivo
              <br />
              Mannheim, Deutschland
              <br />
              E-Mail: <a href="mailto:contact@ivo-tech.com">contact@ivo-tech.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-ink-900">2. Zweck der Datenverarbeitung</h2>
            <p className="mt-2">
              Wir verarbeiten personenbezogene Daten zur Bearbeitung von Kontaktanfragen, zur technischen Bereitstellung der Website und zur Verbesserung
              von Stabilität und Nutzerführung.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-ink-900">3. Kontaktformular</h2>
            <p className="mt-2">
              Bei Nutzung des Formulars werden Name, E-Mail, optional Firma, Nachricht und technische Metadaten verarbeitet, um die Anfrage zu beantworten.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-ink-900">4. Hosting und technische Protokolle</h2>
            <p className="mt-2">
              Beim Aufruf der Website werden technisch erforderliche Verbindungsdaten (z. B. IP-Adresse, Zeitstempel, User-Agent) serverseitig verarbeitet.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-ink-900">5. Rechte der betroffenen Personen</h2>
            <p className="mt-2">Sie haben nach DSGVO das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch und Datenübertragbarkeit.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-ink-900">6. Speicherdauer</h2>
            <p className="mt-2">Daten werden nur so lange gespeichert, wie dies für den jeweiligen Zweck und gesetzliche Aufbewahrungsfristen erforderlich ist.</p>
          </section>

        </div>
      </section>
    </main>
  );
}
