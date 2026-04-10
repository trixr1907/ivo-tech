import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';

import { HUB_CONFIG, getHubBasePath } from '@/app-pages/hubShared';
import { CaseStudyBlueprintSection } from '@/components/case-studies/CaseStudyBlueprintSection';
import { LanguageToggle } from '@/components/LanguageToggle';
import { HubReadTracker } from '@/components/HubReadTracker';
import { HubPageTracker } from '@/components/hub/HubPageTracker';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SectionFrame } from '@/components/ui/SectionFrame';
import { CASE_STUDY_KPIS } from '@/content/caseStudies';
import type { Locale } from '@/content/copy';
import type { HubEntry, HubKind } from '@/content/hub';
import { localizePath } from '@/lib/localeRouting';
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
      <HubPageTracker locale={locale} kind={kind} pageType="detail" slug={entry.slug} />
      <div className="theme-ref103632 hub-detail-page" data-theme="dark">

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

      <main id="main-content" className="home-v2-main hub-detail-main">
        <article className="insight-article hub-detail-article" aria-labelledby="hub-detail-title">
          <SectionFrame
            as="header"
            className="insight-hero hub-detail-hero"
            aria-labelledby="hub-detail-title"
            tone="metal"
            sectionTheme="primary"
          >
            <p className="eyebrow">
              {entry.category} | {entry.readMinutes} min
            </p>
            <h1 id="hub-detail-title" className="text-ink-900">
              {entry.title}
            </h1>
            <p className="lead text-ink-700">{entry.description}</p>
          </SectionFrame>

          {caseKpis.length > 0 ? (
            <SectionFrame
              className="section hub-detail-kpi-section"
              aria-labelledby="case-study-kpi-title"
              tone="panel"
              sectionTheme="secondary"
            >
              <div className="section-head">
                <h2 id="case-study-kpi-title" className="text-ink-900">
                  {locale === 'de' ? 'Ergebnis-Snapshot' : 'Outcome snapshot'}
                </h2>
                <p className="text-ink-700">
                  {locale === 'de'
                    ? 'Drei Kernsignale zur Wirkung im realen Delivery-Kontext.'
                    : 'Three core signals of delivery impact in a real operating context.'}
                </p>
              </div>
              <div className="insights-grid insights-grid-page hub-detail-kpi-grid">
                {caseKpis.map((kpi) => (
                  <article key={kpi.label} className="insight-card text-ink-700">
                    <span className="insight-meta">{kpi.label}</span>
                    <h3 className="text-ink-900">{kpi.value}</h3>
                    <p className="text-ink-700">{kpi.note}</p>
                  </article>
                ))}
              </div>
            </SectionFrame>
          ) : null}

          {kind === 'case-studies' ? <CaseStudyBlueprintSection locale={locale} slug={entry.slug} contactPath={contactPath} /> : null}

          <div className="insight-body">
            <MDXRemote source={entry.body} />
          </div>

          <aside className="insight-related hub-detail-related" aria-label={locale === 'de' ? 'Weiterfuehrende Links' : 'Related links'}>
            <h2>{locale === 'de' ? 'Weiterfuehrende Links' : 'Related links'}</h2>
            <ul>
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
                        className="block rounded-xl border border-slate-200 bg-white/95 px-3 py-3 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-[0_10px_18px_rgba(31,104,196,0.12)]"
                      >
                        <span className="block text-sm font-semibold text-ink-900">{linkCopy.title}</span>
                        <span className="mt-1 block text-xs text-ink-600">{linkCopy.detail}</span>
                      </a>
                    ) : (
                      <Link
                        href={localized}
                        data-hub-cta="related-link-internal"
                        className="block rounded-xl border border-slate-200 bg-white/95 px-3 py-3 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-[0_10px_18px_rgba(31,104,196,0.12)]"
                      >
                        <span className="block text-sm font-semibold text-ink-900">{linkCopy.title}</span>
                        <span className="mt-1 block text-xs text-ink-600">{linkCopy.detail}</span>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
            <Link className="primary" href={contactPath} data-hub-cta="related-primary">
              {locale === 'de' ? 'Erstgespraech starten' : 'Request free intro call'}
            </Link>
          </aside>
        </article>
      </main>
      </div>
    </>
  );
}
