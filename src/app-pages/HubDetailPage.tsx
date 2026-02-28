import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';

import { HUB_CONFIG, getHubBasePath } from '@/app-pages/hubShared';
import { LanguageToggle } from '@/components/LanguageToggle';
import { HubReadTracker } from '@/components/HubReadTracker';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SectionFrame } from '@/components/ui/SectionFrame';
import type { Locale } from '@/content/copy';
import type { HubEntry, HubKind } from '@/content/hub';
import { localizePath } from '@/lib/localeRouting';
import { SITE_URL } from '@/lib/site';

type Props = {
  locale: Locale;
  kind: HubKind;
  entry: HubEntry;
};

export function HubDetailPage({ locale, kind, entry }: Props) {
  const config = HUB_CONFIG[kind];
  const basePath = getHubBasePath(kind);
  const canonical = `${SITE_URL}${localizePath(`${basePath}/${entry.slug}`, locale)}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': entry.schemaType,
        '@id': `${canonical}#${entry.schemaType.toLowerCase()}`,
        headline: entry.title,
        description: entry.description,
        inLanguage: locale,
        datePublished: entry.publishedAt,
        dateModified: entry.updatedAt,
        author: {
          '@type': 'Person',
          name: 'Ivo'
        },
        publisher: {
          '@type': 'Organization',
          name: 'ivo-tech'
        },
        mainEntityOfPage: canonical
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
            item: `${SITE_URL}${localizePath(basePath, locale)}`
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: entry.title,
            item: canonical
          }
        ]
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HubReadTracker locale={locale} kind={kind} slug={entry.slug} />
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
            <Link href={localizePath(basePath, locale)}>{config.label[locale]}</Link>
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
        <article className="insight-article" aria-labelledby="hub-detail-title">
          <SectionFrame as="header" className="insight-hero" aria-labelledby="hub-detail-title" tone="metal" sectionTheme="primary">
            <p className="eyebrow">
              {entry.category} | {entry.readMinutes} min
            </p>
            <h1 id="hub-detail-title">{entry.title}</h1>
            <p className="lead">{entry.description}</p>
          </SectionFrame>

          <div className="insight-body">
            <MDXRemote source={entry.body} />
          </div>

          <aside className="insight-related" aria-label={locale === 'de' ? 'Weiterfuehrende Links' : 'Related links'}>
            <h2>{locale === 'de' ? 'Weiterfuehrende Links' : 'Related links'}</h2>
            <ul>
              {entry.internalLinks.map((href) => {
                const isExternal = href.startsWith('http://') || href.startsWith('https://');
                const localized = isExternal ? href : localizePath(href, locale);
                return (
                  <li key={href}>
                    {isExternal ? (
                      <a href={localized} target="_blank" rel="noopener noreferrer">
                        {localized}
                      </a>
                    ) : (
                      <Link href={localized}>{localized}</Link>
                    )}
                  </li>
                );
              })}
            </ul>
            <Link className="primary" href={localizePath('/#contact', locale)}>
              {locale === 'de' ? 'Erstgespraech anfragen' : 'Request free intro call'}
            </Link>
          </aside>
        </article>
      </main>
      </div>
    </>
  );
}
