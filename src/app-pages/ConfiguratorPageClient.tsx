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
              'Manuelle Angebotserstellung fuer 3D-Druck war langsam, fehleranfaellig und schwer skalierbar.',
              'Kunden brauchten schnellere Preisorientierung statt Rueckruf- oder Mail-Schleifen.'
            ]
          },
          {
            title: 'Umsetzung',
            points: [
              'Webbasierter 3D-Konfigurator mit Modell-Upload, Analyse und automatischer Preislogik.',
              'Direkte Uebergabe der Konfiguration in den Kaufprozess ohne Medienbruch.'
            ]
          },
          {
            title: 'Betrieb',
            points: [
              'Frontend: Three.js Viewer fuer 3D-Interaktion und Visualisierung.',
              'Backend: WordPress Plugin mit AJAX-Endpunkten fuer Berechnung und Analyse.',
              'Commerce: WooCommerce Integration fuer Warenkorb und Preisuebergabe.',
              'Verarbeitung: Docker-gestuetzte Slicing-/Analysepipeline.'
            ]
          },
          {
            title: 'Ergebnis',
            points: [
              'Qualitative Wirkung: klarerer Funnel von Datei-Upload bis Kaufentscheidung.',
              'Der Self-Service-Flow reduziert manuelle Rueckfragen bei Standardanfragen.'
            ]
          },
          {
            title: 'Screenshots / Demos',
            points: [
              'Screen 1: Upload + 3D-Ansicht',
              'Screen 2: Material-/Optionenaenderung mit Preisreaktion in Echtzeit',
              'Screen 3: Uebergabe in Warenkorb/Kaufprozess',
              'Optional: 30-45 Sekunden Walkthrough-Video'
            ]
          }
        ]
      : [
          {
            title: 'Context',
            points: [
              'Manual 3D print quotation was slow, error-prone, and hard to scale.',
              'Customers needed instant pricing orientation instead of callback/email loops.'
            ]
          },
          {
            title: 'Implementation',
            points: [
              'Web-based 3D configurator with model upload, analysis, and automatic pricing logic.',
              'Direct handoff from configuration into checkout without context switching.'
            ]
          },
          {
            title: 'Operations',
            points: [
              'Frontend: Three.js viewer for 3D interaction and visualization.',
              'Backend: WordPress plugin with AJAX endpoints for calculation and analysis.',
              'Commerce: WooCommerce integration for cart and price handoff.',
              'Processing: docker-backed slicing/analysis pipeline.'
            ]
          },
          {
            title: 'Outcome',
            points: [
              'Qualitative impact: a clearer funnel from file upload to purchase decision.',
              'The self-service flow reduces manual back-and-forth for standard requests.'
            ]
          },
          {
            title: 'Screenshots / Demos',
            points: [
              'Screen 1: upload + 3D viewport',
              'Screen 2: material/options change with real-time price update',
              'Screen 3: handoff into cart/checkout',
              'Optional: 30-45 second walkthrough video'
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
            <h1 id="cfg-title">{locale === 'de' ? '3D-Konfigurator (Live)' : '3D configurator (live)'}</h1>
            <p className="lead">
              {locale === 'de'
                ? 'Live Business System fuer den Weg von der 3D-Datei zum Preisangebot und Checkout.'
                : 'Live business system for moving from 3D file to quotation and checkout.'}
            </p>
            <div className="hero-actions">
              <a className="primary" href={LIVE_LINK} target="_blank" rel="noopener noreferrer">
                {locale === 'de' ? 'Live Konfigurator oeffnen' : 'Open live configurator'}
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
