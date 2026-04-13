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
  const headerCta = locale === 'de' ? 'Erstgespräch' : 'Intro call';
  const crossHubLinks = (['case-studies', 'insights', 'playbooks'] as HubKind[])
    .filter((candidate) => candidate !== kind)
    .map((candidate) => ({
      href: localizePath(`/${candidate}`, locale),
      label: HUB_CONFIG[candidate].label[locale]
    }));

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
            <p className="home-eyebrow">{config.label[locale]}</p>
            <h1
              id="hub-title"
              className="mt-1 font-display font-bold tracking-tight text-white"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', lineHeight: 1.15 }}
            >
              {config.indexTitle[locale]}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-400">{config.indexDescription[locale]}</p>

            <div id="hub-list" className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {entries.map((entry) => (
                <article key={entry.slug} className={`${RELAUNCH_CARD_HOVER} flex flex-col`}>
                  <span className="home-eyebrow" style={{ fontSize: '0.62rem' }}>
                    {entry.category} · {entry.readMinutes} min
                  </span>
                  <h2 className="mt-2 font-display text-base font-semibold leading-snug text-slate-100">{entry.title}</h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">{entry.summary}</p>
                  <Link
                    href={getLocalizedHubDetailPath(kind, locale, entry.slug)}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-sky-300 transition hover:text-sky-200"
                    data-hub-cta="list-item-open"
                  >
                    {config.readLabel[locale]}
                    <span aria-hidden="true">→</span>
                  </Link>
                </article>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                {locale === 'de' ? 'Weitere Hub-Bereiche' : 'Related hubs'}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {crossHubLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="inline-flex items-center rounded-full border border-slate-700/70 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-sky-400/40 hover:text-sky-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </main>
      </RelaunchMarketingShell>
    </>
  );
}
