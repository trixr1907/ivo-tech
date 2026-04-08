'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { LanguageToggle } from '@/components/LanguageToggle';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { Button } from '@/components/ui/Button';
import { SectionFrame } from '@/components/ui/SectionFrame';
import { copy, type Locale } from '@/content/copy';
import { CONTACT_EMAIL } from '@/lib/sitePublic';

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
    <div className="theme-ref103632" data-theme="dark">
      <SiteHeader
        ariaLabel={effectiveLocale === 'de' ? 'Hauptnavigation' : 'Primary'}
        className="home-v2-header"
        logoPreset="ref103632"
        logoVisualPreset="premium"
        logoEdgeGlow="medium"
        nav={
          <>
            <Link href={`${homeHref}#featured`}>{t.nav.featured}</Link>
            <Link href={`${homeHref}#contact`}>{t.nav.contact}</Link>
          </>
        }
        rightSlot={
          <>
            <LanguageToggle />
            <Link className="cta ui-btn ui-btn--metal btn-md motion-edge-sweep" href={homeHref}>
              Home
            </Link>
          </>
        }
      />

      <main id="main-content" className="home-v2-main">
        <SectionFrame className="hero home-v2-hero" aria-labelledby="nf-title" tone="metal" sectionTheme="primary">
          <div className="hero-copy">
            <p className="eyebrow">404</p>
            <h1 id="nf-title">{effectiveLocale === 'de' ? 'Nicht gefunden.' : 'Not found.'}</h1>
            <p className="lead">{desc}</p>
            <div className="hero-actions">
              <Button href={homeHref} className="primary">
                {effectiveLocale === 'de' ? 'Zurueck zur Startseite' : 'Back to home'}
              </Button>
              <Button className="ghost" variant="ghost" href={`mailto:${CONTACT_EMAIL}`}>
                {effectiveLocale === 'de' ? 'Kontakt' : 'Contact'}
              </Button>
            </div>
          </div>
        </SectionFrame>
      </main>
    </div>
  );
}
