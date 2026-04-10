import Link from 'next/link';

import { LanguageToggle } from '@/components/LanguageToggle';
import { HubPageTracker } from '@/components/hub/HubPageTracker';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SectionFrame } from '@/components/ui/SectionFrame';
import type { Locale } from '@/content/copy';
import type { HubEntry, HubKind } from '@/content/hub';
import { HUB_CONFIG, getHubBasePath, getLocalizedHubDetailPath } from '@/app-pages/hubShared';
import { localizePath } from '@/lib/localeRouting';
import { getContactPath, getPrimaryNavLinks } from '@/lib/navigation';
import { SITE_URL } from '@/lib/site';

type Props = {
  locale: Locale;
  kind: HubKind;
  entries: HubEntry[];
};

export function HubIndexPage({ locale, kind, entries }: Props) {
  const config = HUB_CONFIG[kind];
  const basePath = getHubBasePath(kind);
  const canonical = `${SITE_URL}${localizePath(basePath, locale)}`;
  const navLinks = getPrimaryNavLinks(locale);
  const contactPath = getContactPath(locale, `hub-${kind}`);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${canonical}#collection`,
        url: canonical,
        name: config.indexTitle[locale],
        description: config.indexDescription[locale],
        inLanguage: locale
      },
      {
        '@type': 'ItemList',
        '@id': `${canonical}#items`,
        itemListElement: entries.map((entry, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: entry.title,
          url: `${SITE_URL}${getLocalizedHubDetailPath(kind, locale, entry.slug)}`
        }))
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: locale === 'de' ? 'Startseite' : 'Home',
            item: `${SITE_URL}${localizePath('/', locale)}`
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: config.label[locale],
            item: canonical
          }
        ]
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HubPageTracker locale={locale} kind={kind} pageType="index" />
      <div className="theme-ref103632 hub-index-page" data-theme="dark">

      <SiteHeader
        ariaLabel={locale === 'de' ? 'Hauptnavigation' : 'Primary'}
        className="home-v2-header"
        logoPreset="ref103632"
        logoVisualPreset="premium"
        logoEdgeGlow="medium"
        nav={
          <>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </>
        }
        rightSlot={
          <>
            <LanguageToggle />
            <Link className="cta ui-btn ui-btn--metal btn-md motion-edge-sweep" href={contactPath} data-hub-cta="header-primary">
              {locale === 'de' ? 'Erstgespraech' : 'Intro call'}
            </Link>
          </>
        }
      />

      <main id="main-content" className="home-v2-main hub-index-main">
        <SectionFrame className="section hub-index-hero-section" aria-labelledby="hub-title" tone="panel">
          <div className="section-head">
            <h1 id="hub-title" className="insights-title text-ink-900">
              {config.indexTitle[locale]}
            </h1>
            <p className="text-ink-700">{config.indexDescription[locale]}</p>
          </div>

          <div id="hub-list" className="insights-grid insights-grid-page hub-index-grid">
            {entries.map((entry) => (
              <article key={entry.slug} className="insight-card text-ink-700">
                <span className="insight-meta">
                  {entry.category} | {entry.readMinutes} min
                </span>
                <h2 className="text-ink-900">{entry.title}</h2>
                <p className="text-ink-700">{entry.summary}</p>
                <Link href={getLocalizedHubDetailPath(kind, locale, entry.slug)} className="insight-link" data-hub-cta="list-item-open">
                  {config.readLabel[locale]}
                </Link>
              </article>
            ))}
          </div>
        </SectionFrame>
      </main>
      </div>
    </>
  );
}
