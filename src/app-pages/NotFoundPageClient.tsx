'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { LanguageToggle } from '@/components/LanguageToggle';
import { copy, type Locale } from '@/content/copy';
import { CONTACT_EMAIL } from '@/lib/site';

type Props = {
  locale: Locale;
};

export function NotFoundPageClient({ locale }: Props) {
  const pathname = usePathname() || '/';
  const effectiveLocale: Locale = locale === 'en' || pathname.startsWith('/en') ? 'en' : 'de';
  const t = copy[effectiveLocale];

  const desc =
    effectiveLocale === 'de'
      ? 'Die angeforderte Seite existiert nicht (oder wurde verschoben).'
      : 'The page you requested does not exist (or has been moved).';

  const homeHref = effectiveLocale === 'en' ? '/en' : '/';

  return (
    <>
      <header className="site-header">
        <div className="brand">IVO TECH</div>
        <nav className="nav" aria-label={effectiveLocale === 'de' ? 'Hauptnavigation' : 'Primary'}>
          <Link href={`${homeHref}#featured`}>{t.nav.featured}</Link>
          <Link href={`${homeHref}#contact`}>{t.nav.contact}</Link>
        </nav>
        <div className="header-right">
          <LanguageToggle />
          <Link className="cta" href={homeHref}>
            Home
          </Link>
        </div>
      </header>

      <main id="main">
        <section className="hero" aria-labelledby="nf-title">
          <div className="hero-copy">
            <p className="eyebrow">404</p>
            <h1 id="nf-title">{effectiveLocale === 'de' ? 'Nicht gefunden.' : 'Not found.'}</h1>
            <p className="lead">{desc}</p>
            <div className="hero-actions">
              <Link className="primary" href={homeHref}>
                {effectiveLocale === 'de' ? 'Zurueck zur Startseite' : 'Back to home'}
              </Link>
              <a className="ghost" href={`mailto:${CONTACT_EMAIL}`}>
                {effectiveLocale === 'de' ? 'Kontakt' : 'Contact'}
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
