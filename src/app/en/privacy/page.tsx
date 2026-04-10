import type { Metadata } from 'next';

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
    <main className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-soft sm:p-10">
        <h1 className="font-display text-3xl font-semibold text-ink-900 sm:text-4xl">Privacy policy</h1>
        <div className="mt-8 space-y-8 text-sm leading-relaxed text-ink-700 sm:text-base">
          <section>
            <h2 className="text-lg font-semibold text-ink-900">1. Data controller</h2>
            <p className="mt-2">
              Ivo Tech
              <br />
              Ivo
              <br />
              Mannheim, Germany
              <br />
              Email: <a href="mailto:contact@ivo-tech.com">contact@ivo-tech.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-ink-900">2. Processing purposes</h2>
            <p className="mt-2">
              We process personal data to handle contact requests, provide the website technically, and improve delivery quality and product stability.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-ink-900">3. Contact form</h2>
            <p className="mt-2">When using the form, we process name, email, optional company, message, and technical metadata to respond to your request.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-ink-900">4. Data subject rights</h2>
            <p className="mt-2">You have rights under applicable law to access, rectify, delete, restrict, object, and request portability of your data.</p>
          </section>

        </div>
      </section>
    </main>
  );
}
