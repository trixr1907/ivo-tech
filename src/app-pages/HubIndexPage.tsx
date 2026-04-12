import Link from 'next/link';

import { HubPageTracker } from '@/components/hub/HubPageTracker';
import { RelaunchMarketingShell } from '@/components/layout/RelaunchMarketingShell';
import type { Locale } from '@/content/copy';
import type { HubEntry, HubKind } from '@/content/hub';
import { HUB_CONFIG, getHubBasePath, getLocalizedHubDetailPath } from '@/app-pages/hubShared';
import { localizePath } from '@/lib/localeRouting';
import { RELAUNCH_CARD_HOVER, RELAUNCH_SECTION } from '@/lib/relaunchMarketingStyles';
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
  const homeHref = localizePath('/', locale);
  const headerCta = locale === 'de' ? 'Erstgespraech' : 'Intro call';

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
      <RelaunchMarketingShell
        locale={locale}
        shellClassName="hub-index-page"
        homeHref={homeHref}
        navLinks={navLinks}
        desktopCtaHref={contactPath}
        desktopCtaLabel={headerCta}
        mobileNavCtaLabel={headerCta}
        desktopContactTrackingSource={`hub-${kind}-header`}
        mobileNavPrimaryTrackingSource={`hub-${kind}-mobile-nav`}
        desktopHeaderDataHubCta="header-primary"
      >
        <HubPageTracker locale={locale} kind={kind} pageType="index" />
        <main id="main-content" className="mx-auto w-full max-w-[1200px] flex-1 px-4 pb-10 pt-8 sm:px-6 md:pb-12 md:pt-10">
          <section className={`${RELAUNCH_SECTION} hub-index-hero-section`} aria-labelledby="hub-title">
            <div className="space-y-3">
              <h1 id="hub-title" className="font-display text-3xl font-semibold tracking-tight text-slate-100 md:text-4xl">
                {config.indexTitle[locale]}
              </h1>
              <p className="max-w-3xl text-base leading-relaxed text-slate-300 md:text-lg">{config.indexDescription[locale]}</p>
            </div>

            <div id="hub-list" className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {entries.map((entry) => (
                <article key={entry.slug} className={`${RELAUNCH_CARD_HOVER} flex flex-col`}>
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-sky-400/90">
                    {entry.category} | {entry.readMinutes} min
                  </span>
                  <h2 className="mt-2 font-display text-lg font-semibold text-slate-100">{entry.title}</h2>
                  <p className="mt-2 flex-1 text-sm text-slate-300">{entry.summary}</p>
                  <Link
                    href={getLocalizedHubDetailPath(kind, locale, entry.slug)}
                    className="mt-4 text-sm font-medium text-sky-400 transition hover:text-sky-300"
                    data-hub-cta="list-item-open"
                  >
                    {config.readLabel[locale]}
                  </Link>
                </article>
              ))}
            </div>
          </section>
        </main>
      </RelaunchMarketingShell>
    </>
  );
}
