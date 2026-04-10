import type { Metadata } from 'next';

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
    <main className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-soft sm:p-10">
        <h1 className="font-display text-3xl font-semibold text-ink-900 sm:text-4xl">Legal notice</h1>
        <div className="mt-8 space-y-8 text-sm leading-relaxed text-ink-700 sm:text-base">
          <section>
            <h2 className="text-lg font-semibold text-ink-900">Provider information</h2>
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
            <h2 className="text-lg font-semibold text-ink-900">Contact</h2>
            <p className="mt-2">
              Email: <a href="mailto:contact@ivo-tech.com">contact@ivo-tech.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-ink-900">VAT ID</h2>
            <p className="mt-2">VAT ID pursuant to Section 27a German VAT Act: published here when available.</p>
          </section>
        </div>
      </section>
    </main>
  );
}
