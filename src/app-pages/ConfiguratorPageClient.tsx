'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { LanguageToggle } from '@/components/LanguageToggle';
import type { Locale } from '@/content/copy';
import { getProjectById } from '@/content/projects';
import { trackEvent } from '@/lib/analytics';
import { localizePath } from '@/lib/localeRouting';

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
              'Angebotsrunden fuer 3D-Druck liefen manuell und erzeugten wiederkehrende Rueckfrage-Schleifen.',
              'Ziel war ein klarer Datei-zu-Preis-Prozess mit direktem Uebergang in den Kaufpfad.'
            ]
          },
          {
            title: 'Delivery Scope',
            points: [
              'Frontend: Three.js/WebGL Viewer mit STL-/3MF-Upload, Modellkontrolle und Echtzeit-Feedback.',
              'Backend: WordPress Plugin mit AJAX-Endpunkten fuer Analyse- und Pricing-Kontext.',
              'Commerce: WooCommerce-Handoff fuer Cart/Order ohne Medienbruch.'
            ]
          },
          {
            title: 'Architektur',
            points: [
              'Regelbasierte Preis-Engine (Material, Qualitaet, Farbe, Menge, Mindestpreis) fuer reproduzierbare Ausgaben.',
              'Clientseitige Interaktionslogik und serverseitiger Kontext bleiben sauber getrennt.',
              'Die technische Strecke ist als durchgaengiger Systemflow implementiert, nicht als isolierter Viewer.'
            ]
          },
          {
            title: 'Betrieb',
            points: [
              'Der End-to-End Flow laeuft im Live-Kundenbetrieb stabil von Upload bis Checkout.',
              'Standardanfragen werden gefuehrt statt ueber manuelle Rueckfrage-Prozesse abgewickelt.'
            ]
          },
          {
            title: 'Rollenklarheit',
            points: [
              'Technische Umsetzung: IVO TECH.',
              'Betrieb und Vermarktung erfolgen beim Kundenprojekt.',
              'Live-Link dient als qualitativer Proof fuer die implementierte Strecke.'
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
              'Technical implementation by IVO TECH.',
              'Platform operations and commercial ownership remain with the client project.',
              'The live link is provided as qualitative proof of the implemented flow.'
            ]
          }
        ];

  const kpis = heroProject?.case_study?.kpis ?? [];

  return (
    <>
      <header className="site-header">
        <div className="brand">IVO TECH</div>
        <nav className="nav" aria-label={locale === 'de' ? 'Hauptnavigation' : 'Primary'}>
          <Link href={localizePath('/', locale)}>{locale === 'de' ? 'Startseite' : 'Home'}</Link>
          <a href={LIVE_LINK} target="_blank" rel="noopener noreferrer">
            {locale === 'de' ? 'Live Demo' : 'Live demo'}
          </a>
          <Link
            href={contactHref}
            onClick={() => trackEvent('cta_contact_click', { location: 'configurator_nav', intent: 'hybrid', locale, path: pathname })}
          >
            {locale === 'de' ? 'Kontakt' : 'Contact'}
          </Link>
        </nav>
        <div className="header-right">
          <LanguageToggle />
          <Link className="cta" href={localizePath('/', locale)}>
            {locale === 'de' ? 'Zurueck' : 'Back'}
          </Link>
        </div>
      </header>

      <main id="main">
        <section className="hero" aria-labelledby="cfg-title">
          <div className="hero-copy">
            <p className="eyebrow">{locale === 'de' ? 'Premium Case Study' : 'Premium case study'}</p>
            <h1 id="cfg-title">{locale === 'de' ? '3D-Konfigurator als Tech-Referenz' : '3D configurator as a tech reference'}</h1>
            <p className="lead">
              {heroProject?.one_liner[locale] ??
                (locale === 'de'
                  ? 'Produktionsfaehige Datei-zu-Angebot-Architektur mit WebGL-Viewer, Preislogik und Checkout-Handoff.'
                  : 'Production-ready file-to-quote architecture with a WebGL viewer, pricing logic, and checkout handoff.')}
            </p>
            {attribution ? <p className="hero-sublead">{attribution}</p> : null}
            <div className="hero-actions">
              <a className="primary" href={LIVE_LINK} target="_blank" rel="noopener noreferrer">
                {locale === 'de' ? 'Live beim Kunden oeffnen' : 'Open live client flow'}
              </a>
              <Link
                className="ghost"
                href={contactHref}
                onClick={() => trackEvent('cta_contact_click', { location: 'configurator_hero', intent: 'hybrid', locale, path: pathname })}
              >
                {locale === 'de' ? 'Kontaktgespraech anfragen' : 'Request contact call'}
              </Link>
            </div>
          </div>
        </section>

        <section className="section" aria-label="Case study details">
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

          <div className="case-study-grid">
            {blocks.map((block) => (
              <div key={block.title}>
                <h4>{block.title}</h4>
                <ul>
                  {block.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
