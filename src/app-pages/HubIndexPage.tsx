import Link from 'next/link';

import { LanguageToggle } from '@/components/LanguageToggle';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SectionFrame } from '@/components/ui/SectionFrame';
import type { Locale } from '@/content/copy';
import type { HubEntry, HubKind } from '@/content/hub';
import { HUB_CONFIG, getHubBasePath, getLocalizedHubDetailPath } from '@/app-pages/hubShared';
import { localizePath } from '@/lib/localeRouting';
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
      <div className="theme-ref103632" data-theme="dark">

      <SiteHeader
        ariaLabel={locale === 'de' ? 'Hauptnavigation' : 'Primary'}
        className="home-v2-header"
        logoPreset="ref103632"
        logoVisualPreset="premium"
        logoEdgeGlow="medium"
        nav={
          <>
            <Link href={localizePath('/', locale)}>{locale === 'de' ? 'Startseite' : 'Home'}</Link>
            <a href="#hub-list">{locale === 'de' ? 'Artikel' : 'Articles'}</a>
            <Link href={localizePath('/#contact', locale)}>{locale === 'de' ? 'Kontakt' : 'Contact'}</Link>
          </>
        }
        rightSlot={
          <>
            <LanguageToggle />
            <Link className="cta ui-btn ui-btn--metal btn-md motion-edge-sweep" href={localizePath('/#contact', locale)}>
              {locale === 'de' ? 'Erstgespraech' : 'Intro call'}
            </Link>
          </>
        }
      />

      <main id="main-content" className="home-v2-main">
        <SectionFrame className="section" aria-labelledby="hub-title" tone="panel">
          <div className="section-head">
            <h1 id="hub-title" className="insights-title">
              {config.indexTitle[locale]}
            </h1>
            <p>{config.indexDescription[locale]}</p>
          </div>

          <div id="hub-list" className="insights-grid insights-grid-page">
            {entries.map((entry) => (
              <article key={entry.slug} className="insight-card">
                <span className="insight-meta">
                  {entry.category} | {entry.readMinutes} min
                </span>
                <h2>{entry.title}</h2>
                <p>{entry.summary}</p>
                <Link href={getLocalizedHubDetailPath(kind, locale, entry.slug)} className="insight-link">
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
