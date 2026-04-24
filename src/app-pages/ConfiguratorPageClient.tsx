'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { RelaunchMarketingShell } from '@/components/layout/RelaunchMarketingShell';
import { RelaunchPageHero } from '@/components/layout/RelaunchPageHero';
import { RelaunchPageMain } from '@/components/layout/RelaunchPageMain';
import { Button } from '@/components/shadcn/button';
import type { Locale } from '@/content/copy';
import { getProjectById } from '@/content/projects';
import { trackEvent } from '@/lib/analytics';
import { localizePath } from '@/lib/localeRouting';
import { RELAUNCH_SECTION } from '@/lib/relaunchMarketingStyles';

const LIVE_LINK = 'https://deinlieblingsdruck.de/3d-konfigurator/#preisrechner';

type CaseStudyBlock = {
  title: string;
  points: string[];
};

type Props = {
  locale: Locale;
};

export function ConfiguratorPageClient({ locale }: Props) {
  const pathname = usePathname() || localizePath('/configurator', locale);
  const heroProject = getProjectById('configurator_3d');
  const contactHref = localizePath('/#contact', locale);
  const homeHref = localizePath('/', locale);
  const attribution = heroProject?.attribution_note?.[locale];

  useEffect(() => {
    trackEvent('case_study_open', {
      projectId: 'configurator_3d',
      source: 'configurator_page',
      locale,
      path: pathname
    });
  }, [locale, pathname]);

  const blocks: CaseStudyBlock[] =
    locale === 'de'
      ? [
          {
            title: 'Ausgangslage',
            points: [
              'Angebotsrunden für 3D-Druck liefen manuell und erzeugten wiederkehrende Rückfrage-Schleifen.',
              'Ziel war ein klarer Datei-zu-Preis-Prozess mit direktem Übergang in den Kaufpfad.'
            ]
          },
          {
            title: 'Delivery Scope',
            points: [
              'Frontend: Three.js/WebGL Viewer mit STL-/3MF-Upload, Modellkontrolle und Echtzeit-Feedback.',
              'Backend: WordPress Plugin mit AJAX-Endpunkten für Analyse- und Pricing-Kontext.',
              'Commerce: WooCommerce-Handoff für Cart/Order ohne Medienbruch.'
            ]
          },
          {
            title: 'Architektur',
            points: [
              'Regelbasierte Preis-Engine (Material, Qualität, Farbe, Menge, Mindestpreis) für reproduzierbare Ausgaben.',
              'Clientseitige Interaktionslogik und serverseitiger Kontext bleiben sauber getrennt.',
              'Die technische Strecke ist als durchgängiger Systemflow implementiert, nicht als isolierter Viewer.'
            ]
          },
          {
            title: 'Betrieb',
            points: [
              'Der End-to-End Flow läuft im Live-Kundenbetrieb stabil von Upload bis Checkout.',
              'Standardanfragen werden geführt statt über manuelle Rückfrage-Prozesse abgewickelt.'
            ]
          },
          {
            title: 'Rollenklarheit',
            points: [
              'Technische Umsetzung: ivo-tech.',
              'Betrieb und Vermarktung erfolgen beim Kundenprojekt.',
              'Live-Link dient als qualitativer Proof für die implementierte Strecke.'
            ]
          }
        ]
      : [
          {
            title: 'Context',
            points: [
              '3D print quote loops were manual and created repeated back-and-forth.',
              'The target was a clear file-to-price process with direct handoff into purchase.'
            ]
          },
          {
            title: 'Delivery scope',
            points: [
              'Frontend: Three.js/WebGL viewer with STL/3MF upload, model control, and real-time feedback.',
              'Backend: WordPress plugin with AJAX endpoints for analysis and pricing context.',
              'Commerce: WooCommerce handoff into cart/order without context switching.'
            ]
          },
          {
            title: 'Architecture',
            points: [
              'Rule-based pricing engine (material, quality, color, quantity, minimum price) for reproducible outputs.',
              'Client interaction logic and server-side context are kept clearly separated.',
              'The technical delivery is built as one continuous system flow, not an isolated viewer.'
            ]
          },
          {
            title: 'Outcome',
            points: [
              'The end-to-end flow runs stably in live client operations from upload to checkout.',
              'Standard requests are handled in a guided self-service flow instead of manual loops.'
            ]
          },
          {
            title: 'Role clarity',
            points: [
              'Technical implementation by ivo-tech.',
              'Platform operations and commercial ownership remain with the client project.',
              'The live link is provided as qualitative proof of the implemented flow.'
            ]
          }
        ];

  const kpis = heroProject?.case_study?.kpis ?? [];

  const navLinks = [
    { href: homeHref, label: locale === 'de' ? 'Startseite' : 'Home' },
    { href: LIVE_LINK, label: locale === 'de' ? 'Live Demo' : 'Live demo' },
    { href: contactHref, label: locale === 'de' ? 'Kontakt' : 'Contact' }
  ];

  return (
    <RelaunchMarketingShell
      locale={locale}
      shellClassName="configurator-page"
      homeHref={homeHref}
      navLinks={navLinks}
      desktopCtaHref={homeHref}
      desktopCtaLabel={locale === 'de' ? 'Zurück' : 'Back'}
      mobileNavCtaLabel={locale === 'de' ? 'Zurück' : 'Back'}
      mobileNavCtaHref={homeHref}
      desktopContactTrackingSource="configurator-header-back"
      mobileNavPrimaryTrackingSource="configurator-mobile-back"
    >
      <RelaunchPageMain variant="configurator">
        <section className={`${RELAUNCH_SECTION} mb-8`} aria-labelledby="cfg-title">
          <RelaunchPageHero
            className="!mb-0"
            surface="stack"
            eyebrowMode="inline"
            eyebrow={locale === 'de' ? 'Premium Case Study' : 'Premium case study'}
            title={locale === 'de' ? '3D-Konfigurator als Tech-Referenz' : '3D configurator as a tech reference'}
            titleId="cfg-title"
            description={
              heroProject?.one_liner[locale] ??
              (locale === 'de'
                ? 'Produktionsfaehige Datei-zu-Angebot-Architektur mit WebGL-Viewer, Preislogik und Checkout-Handoff.'
                : 'Production-ready file-to-quote architecture with a WebGL viewer, pricing logic, and checkout handoff.')
            }
          >
            {attribution ? <p className="mt-3 text-sm text-slate-400">{attribution}</p> : null}
            <div className="mt-8 flex flex-col flex-wrap gap-3 sm:flex-row">
              <Button asChild className="bg-sky-500 text-slate-950 hover:bg-sky-400">
                <a href={LIVE_LINK} target="_blank" rel="noopener noreferrer">
                  {locale === 'de' ? 'Live beim Kunden öffnen' : 'Open live client flow'}
                </a>
              </Button>
              <Button asChild variant="onDark">
                <Link
                  href={contactHref}
                  onClick={() =>
                    trackEvent('cta_contact_click', {
                      source: 'configurator_hero',
                      location: 'configurator_hero',
                      intent: 'hybrid',
                      locale,
                      path: pathname
                    })
                  }
                >
                  {locale === 'de' ? 'Erstgespräch anfragen' : 'Request free intro call'}
                </Link>
              </Button>
            </div>
          </RelaunchPageHero>
        </section>

        <section className={RELAUNCH_SECTION} aria-label={locale === 'de' ? 'Case Study Details' : 'Case study details'}>
          {kpis.length > 0 ? (
            <div className="kpi-grid" aria-label={locale === 'de' ? 'KPI Snapshot' : 'KPI snapshot'}>
              {kpis.map((kpi) => (
                <div key={kpi.label[locale]} className="kpi-card">
                  <div className="kpi-label">{kpi.label[locale]}</div>
                  <div className="kpi-value">{kpi.value[locale]}</div>
                  {kpi.note ? <div className="kpi-note">{kpi.note[locale]}</div> : null}
                </div>
              ))}
            </div>
          ) : null}

          <div className="case-study-grid mt-8">
            {blocks.map((block) => (
              <div key={block.title}>
                <h4 className="font-display text-base font-semibold text-slate-100">{block.title}</h4>
                <ul className="mt-2 text-sm text-slate-300">
                  {block.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </RelaunchPageMain>
    </RelaunchMarketingShell>
  );
}
