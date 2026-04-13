import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';

import { HUB_CONFIG, getHubBasePath } from '@/app-pages/hubShared';
import { CaseStudyBlueprintSection } from '@/components/case-studies/CaseStudyBlueprintSection';
import { HubReadTracker } from '@/components/HubReadTracker';
import { HubPageTracker } from '@/components/hub/HubPageTracker';
import { RelaunchMarketingShell } from '@/components/layout/RelaunchMarketingShell';
import { Button } from '@/components/shadcn/button';
import { CASE_STUDY_KPIS } from '@/content/caseStudies';
import type { Locale } from '@/content/copy';
import type { HubEntry, HubKind } from '@/content/hub';
import { localizePath } from '@/lib/localeRouting';
import { RELAUNCH_CARD, RELAUNCH_SECTION } from '@/lib/relaunchMarketingStyles';
import { getContactPath, getPrimaryNavLinks } from '@/lib/navigation';
import { SITE_URL } from '@/lib/site';

type Props = {
  locale: Locale;
  kind: HubKind;
  entry: HubEntry;
};

function getRelatedLinkCopy(locale: Locale, href: string, isExternal: boolean) {
  if (isExternal) {
    try {
      const url = new URL(href);
      return {
        title: locale === 'de' ? `Externer Nachweis: ${url.hostname}` : `External proof: ${url.hostname}`,
        detail: locale === 'de' ? 'Oeffnet in neuem Tab' : 'Opens in new tab'
      };
    } catch {
      return {
        title: locale === 'de' ? 'Externer Nachweis' : 'External proof',
        detail: locale === 'de' ? 'Oeffnet in neuem Tab' : 'Opens in new tab'
      };
    }
  }

  if (href.includes('/case-studies')) {
    return {
      title: locale === 'de' ? 'Passende Fallstudien' : 'Related case studies',
      detail: locale === 'de' ? 'Kontext und Outcome vertiefen' : 'Deepen context and outcomes'
    };
  }
  if (href.includes('/playbooks')) {
    return {
      title: locale === 'de' ? 'Playbooks' : 'Playbooks',
      detail: locale === 'de' ? 'Umsetzungsmuster und Standards' : 'Implementation patterns and standards'
    };
  }
  if (href.includes('/insights')) {
    return {
      title: locale === 'de' ? 'Insights' : 'Insights',
      detail: locale === 'de' ? 'Technische Hintergruende und Entscheidungen' : 'Technical rationale and decisions'
    };
  }
  if (href.includes('/contact') || href.includes('#contact')) {
    return {
      title: locale === 'de' ? 'Kontakt' : 'Contact',
      detail: locale === 'de' ? 'Direkten naechsten Schritt klaeren' : 'Clarify the direct next step'
    };
  }

  return {
    title: locale === 'de' ? 'Weiterfuehrender Link' : 'Related link',
    detail: locale === 'de' ? 'Inhalt mit weiterem Kontext oeffnen' : 'Open supporting context'
  };
}

export function HubDetailPage({ locale, kind, entry }: Props) {
  const config = HUB_CONFIG[kind];
  const basePath = getHubBasePath(kind);
  const canonical = `${SITE_URL}${localizePath(`${basePath}/${entry.slug}`, locale)}`;
  const caseKpis = kind === 'case-studies' ? CASE_STUDY_KPIS[locale][entry.slug] ?? [] : [];
  const navLinks = getPrimaryNavLinks(locale);
  const contactPath = getContactPath(locale, `hub-${kind}-detail`);
  const homeHref = localizePath('/', locale);
  const headerCta = locale === 'de' ? 'Erstgespraech' : 'Intro call';

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
      <RelaunchMarketingShell
        locale={locale}
        shellClassName="hub-detail-page"
        homeHref={homeHref}
        navLinks={navLinks}
        desktopCtaHref={contactPath}
        desktopCtaLabel={headerCta}
        mobileNavCtaLabel={headerCta}
        desktopContactTrackingSource={`hub-${kind}-detail-header`}
        mobileNavPrimaryTrackingSource={`hub-${kind}-detail-mobile-nav`}
        desktopHeaderDataHubCta="header-primary"
      >
        <HubReadTracker locale={locale} kind={kind} slug={entry.slug} />
        <HubPageTracker locale={locale} kind={kind} pageType="detail" slug={entry.slug} />
        <main id="main-content" className="mx-auto w-full max-w-[1200px] flex-1 px-4 pb-10 pt-8 sm:px-6 md:pb-12 md:pt-10">
          <article className="insight-article hub-detail-article space-y-8" aria-labelledby="hub-detail-title">
            <header className={`${RELAUNCH_SECTION} insight-hero hub-detail-hero`}>
              <p className="home-eyebrow">
                {entry.category} · {entry.readMinutes} min
              </p>
              <h1
                id="hub-detail-title"
                className="mt-1 font-display font-bold tracking-tight text-white"
                style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', lineHeight: 1.18 }}
              >
                {entry.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-400">{entry.description}</p>
            </header>

            {caseKpis.length > 0 ? (
              <section className={`${RELAUNCH_SECTION} hub-detail-kpi-section`} aria-labelledby="case-study-kpi-title">
                <div className="space-y-2">
                  <h2 id="case-study-kpi-title" className="home-section-h2" style={{ fontSize: "1.5rem" }}>
                    {locale === 'de' ? 'Ergebnis-Snapshot' : 'Outcome snapshot'}
                  </h2>
                  <p className="text-sm text-slate-300 md:text-base">
                    {locale === 'de'
                      ? 'Drei Kernsignale zur Wirkung im realen Delivery-Kontext.'
                      : 'Three core signals of delivery impact in a real operating context.'}
                  </p>
                </div>
                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  {caseKpis.map((kpi) => (
                    <article key={kpi.label} className={RELAUNCH_CARD}>
                      <span className="home-eyebrow">{kpi.label}</span>
                      <h3 className="mt-2 font-display text-lg font-semibold text-slate-100">{kpi.value}</h3>
                      <p className="mt-2 text-sm text-slate-300">{kpi.note}</p>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {kind === 'case-studies' ? (
              <CaseStudyBlueprintSection locale={locale} slug={entry.slug} contactPath={contactPath} />
            ) : null}

            <section className={RELAUNCH_SECTION}>
              <div className="insight-body max-w-none">
                <MDXRemote source={entry.body} />
              </div>
            </section>

            <aside
              className={`${RELAUNCH_SECTION} hub-detail-related`}
              aria-label={locale === 'de' ? 'Weiterfuehrende Links' : 'Related links'}
            >
              <h2 className="home-section-h2" style={{ fontSize: "1.5rem" }}>
                {locale === 'de' ? 'Weiterfuehrende Links' : 'Related links'}
              </h2>
              <ul className="mt-4 space-y-3">
                {entry.internalLinks.map((href) => {
                  const isExternal = href.startsWith('http://') || href.startsWith('https://');
                  const localized = isExternal ? href : localizePath(href, locale);
                  const linkCopy = getRelatedLinkCopy(locale, href, isExternal);
                  return (
                    <li key={href}>
                      {isExternal ? (
                        <a
                          href={localized}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-hub-cta="related-link-external"
                          className="block rounded-xl border border-slate-700/90 bg-slate-950/50 px-3 py-3 transition hover:-translate-y-0.5 hover:border-sky-500/40 hover:shadow-[0_10px_24px_rgba(3,8,18,0.45)]"
                        >
                          <span className="block text-sm font-semibold text-slate-100">{linkCopy.title}</span>
                          <span className="mt-1 block text-xs text-slate-400">{linkCopy.detail}</span>
                        </a>
                      ) : (
                        <Link
                          href={localized}
                          data-hub-cta="related-link-internal"
                          className="block rounded-xl border border-slate-700/90 bg-slate-950/50 px-3 py-3 transition hover:-translate-y-0.5 hover:border-sky-500/40 hover:shadow-[0_10px_24px_rgba(3,8,18,0.45)]"
                        >
                          <span className="block text-sm font-semibold text-slate-100">{linkCopy.title}</span>
                          <span className="mt-1 block text-xs text-slate-400">{linkCopy.detail}</span>
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
              <Button asChild className="mt-6 bg-sky-500 text-slate-950 hover:bg-sky-400">
                <Link href={contactPath} data-hub-cta="related-primary">
                  {locale === 'de' ? 'Erstgespraech starten' : 'Request free intro call'}
                </Link>
              </Button>
            </aside>
          </article>
        </main>
      </RelaunchMarketingShell>
    </>
  );
}
