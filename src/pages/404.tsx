import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { LanguageToggle } from '@/components/LanguageToggle';
import { copy } from '@/content/copy';
import { resolveLocale } from '@/lib/locale';
import { CONTACT_EMAIL } from '@/lib/site';

export default function NotFoundPage() {
  const router = useRouter();
  const locale = resolveLocale(router.locale);
  const t = copy[locale];

  const title = locale === 'de' ? '404 | Seite nicht gefunden' : '404 | Page not found';
  const desc =
    locale === 'de'
      ? 'Die angeforderte Seite existiert nicht (oder wurde verschoben).'
      : 'The page you requested does not exist (or has been moved).';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="robots" content="noindex,follow" />
      </Head>

      <header className="site-header">
        <div className="brand">IVO TECH</div>
        <nav className="nav" aria-label={locale === 'de' ? 'Hauptnavigation' : 'Primary'}>
          <Link href="/#featured" locale={locale}>
            {t.nav.featured}
          </Link>
          <Link href="/#contact" locale={locale}>
            {t.nav.contact}
          </Link>
        </nav>
        <div className="header-right">
          <LanguageToggle />
          <Link className="cta" href="/" locale={locale}>
            {locale === 'de' ? 'Home' : 'Home'}
          </Link>
        </div>
      </header>

      <main id="main">
        <section className="hero" aria-labelledby="nf-title">
          <div className="hero-copy">
            <p className="eyebrow">404</p>
            <h1 id="nf-title">{locale === 'de' ? 'Nicht gefunden.' : 'Not found.'}</h1>
            <p className="lead">{desc}</p>
            <div className="hero-actions">
              <Link className="primary" href="/" locale={locale}>
                {locale === 'de' ? 'Zurueck zur Startseite' : 'Back to home'}
              </Link>
              <a className="ghost" href={`mailto:${CONTACT_EMAIL}`}>
                {locale === 'de' ? 'Kontakt' : 'Contact'}
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
