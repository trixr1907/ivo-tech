import type { Metadata } from 'next';

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
    <main className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-soft sm:p-10">
        <h1 className="font-display text-3xl font-semibold text-ink-900 sm:text-4xl">Impressum</h1>
        <div className="mt-8 space-y-8 text-sm leading-relaxed text-ink-700 sm:text-base">
          <section>
            <h2 className="text-lg font-semibold text-ink-900">Angaben gemäß § 5 TMG</h2>
            <p className="mt-2">
              Ivo Tech
              <br />
              Ivo
              <br />
              Mannheim
              <br />
              Deutschland
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-ink-900">Kontakt</h2>
            <p className="mt-2">
              E-Mail: <a href="mailto:contact@ivo-tech.com">contact@ivo-tech.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-ink-900">Umsatzsteuer-ID</h2>
            <p className="mt-2">Umsatzsteuer-ID gemaess §27a UStG: wird bei Vorliegen an dieser Stelle veroeffentlicht.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-ink-900">Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
            <p className="mt-2">
              Ivo
              <br />
              Mannheim, Deutschland
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
