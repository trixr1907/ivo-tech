import type { Metadata } from 'next';

import { getAbReport, type AbVariantSummary } from '@/server/ab-report/store';

type PageProps = {
  searchParams?: Record<string, string | string[] | undefined> | Promise<Record<string, string | string[] | undefined>>;
};

function formatCount(value: number) {
  return new Intl.NumberFormat('de-DE').format(value);
}

function formatRate(value: number) {
  return `${value.toFixed(2)}%`;
}

function formatSigned(value: number) {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}`;
}

function readSingleParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
}

function renderVariantCard(summary: AbVariantSummary, title: string) {
  return (
    <article className="insight-section">
      <h2>{title}</h2>
      <div className="facts-grid">
        <div className="fact-item">
          <span>Exposure</span>
          <strong>{formatCount(summary.totals.ab_home_variant_exposure)}</strong>
        </div>
        <div className="fact-item">
          <span>CTA Clicks</span>
          <strong>{formatCount(summary.totals.cta_primary_click)}</strong>
        </div>
        <div className="fact-item">
          <span>Form Starts</span>
          <strong>{formatCount(summary.totals.contact_form_start)}</strong>
        </div>
        <div className="fact-item">
          <span>Submits</span>
          <strong>{formatCount(summary.totals.contact_form_submit_success)}</strong>
        </div>
      </div>

      <div className="facts-grid">
        <div className="fact-item">
          <span>CTA/Exposure</span>
          <strong>{formatRate(summary.rates.ctaRateFromExposure)}</strong>
        </div>
        <div className="fact-item">
          <span>FormStart/Exposure</span>
          <strong>{formatRate(summary.rates.formStartRateFromExposure)}</strong>
        </div>
        <div className="fact-item">
          <span>Submit/Exposure</span>
          <strong>{formatRate(summary.rates.submitRateFromExposure)}</strong>
        </div>
        <div className="fact-item">
          <span>Submit/FormStart</span>
          <strong>{formatRate(summary.rates.submitRateFromFormStart)}</strong>
        </div>
      </div>
    </article>
  );
}

export const metadata: Metadata = {
  title: 'A/B Report | ivo-tech',
  robots: { index: false, follow: false }
};
export const dynamic = 'force-dynamic';

export default async function InternalAbReportPage({ searchParams }: PageProps) {
  const params = (searchParams ? await searchParams : {}) ?? {};
  const providedKey = readSingleParam(params.key);
  const configuredKey = process.env.INTERNAL_REPORT_TOKEN?.trim() ?? '';

  if (configuredKey && providedKey !== configuredKey) {
    return (
      <main>
        <section className="section">
          <div className="section-head">
            <h1>A/B Report gesperrt</h1>
            <p>
              Zugriff verweigert. Rufe die Seite mit <code>?key=...</code> auf oder setze <code>INTERNAL_REPORT_TOKEN</code>{' '}
              lokal nicht.
            </p>
          </div>
        </section>
      </main>
    );
  }

  const daysRaw = Number(readSingleParam(params.days));
  const days = Number.isFinite(daysRaw) ? daysRaw : 14;
  const report = await getAbReport(days);
  const csvBaseQuery = configuredKey
    ? `days=${report.windowDays}&key=${encodeURIComponent(providedKey)}`
    : `days=${report.windowDays}`;
  const csvDailyHref = `/api/internal/ab-report?${csvBaseQuery}&format=csv`;
  const csvSourceHref = `/api/internal/ab-report?${csvBaseQuery}&format=csv&breakdown=source`;
  const csvActionsHref = `/api/internal/ab-report?${csvBaseQuery}&format=csv&breakdown=actions`;
  const decisionLabelByStatus = {
    collecting_data: 'Daten sammeln',
    no_significant_winner: 'Kein belastbarer Gewinner',
    promote_a: 'Variante A promoten',
    promote_b: 'Variante B promoten'
  } as const;
  const decisionLabel = decisionLabelByStatus[report.decision.status];
  const decisionToneClass =
    report.decision.status === 'promote_a' || report.decision.status === 'promote_b' ? 'is-positive' : 'is-neutral';

  return (
    <main>
      <section className="section">
        <div className="section-head">
          <h1>A/B Report: Home CTA + Proof</h1>
          <p>
            Experiment: <code>{report.experiment}</code> | Zeitraum: letzte {report.windowDays} Tage | Stand:{' '}
            {new Date(report.generatedAt).toLocaleString('de-DE')}
          </p>
          <p>
            <a className="ghost" href={csvDailyHref}>
              CSV (Tagesdaten)
            </a>{' '}
            <a className="ghost" href={csvSourceHref}>
              CSV (Source)
            </a>{' '}
            <a className="ghost" href={csvActionsHref}>
              CSV (Actions)
            </a>
          </p>
        </div>

        <div className="insight-body">
          <article className="insight-section">
            <h2>Entscheidung</h2>
            <p>
              <strong className={decisionToneClass}>{decisionLabel}</strong>
            </p>
            <p>
              Delta Submit/Exposure (B-A): {formatSigned(report.decision.deltaSubmitRateBvsA)} pp | 95%-CI:{' '}
              {formatSigned(report.decision.confidenceIntervalLow)} bis {formatSigned(report.decision.confidenceIntervalHigh)} pp
            </p>
            <p>
              Exposure A/B: {formatCount(report.decision.exposureA)} / {formatCount(report.decision.exposureB)} | Submits A/B:{' '}
              {formatCount(report.decision.submitA)} / {formatCount(report.decision.submitB)}
            </p>
            <p>
              Gate: mind. {formatCount(report.decision.minExposurePerVariant)} Exposures je Variante, mind.{' '}
              {formatCount(report.decision.minSubmitEventsTotal)} Submits gesamt, mind.{' '}
              {report.decision.minDeltaPercentagePoints.toFixed(2)} pp Business-Delta.
            </p>
            <p>{report.decision.reason}</p>
            <p>
              {report.decision.confidence95
                ? 'Statistisch: Effekt ist auf 95%-Niveau abgesichert.'
                : 'Statistisch: Effekt ist auf 95%-Niveau noch nicht abgesichert.'}
            </p>
          </article>
          {renderVariantCard(report.variants.a, 'Variante A')}
          {renderVariantCard(report.variants.b, 'Variante B')}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Tagesverlauf</h2>
          <p>Exposure, CTA, Form-Start und Submit pro Tag und Variante.</p>
        </div>

        <div className="insight-section">
          <div className="ab-report-table-wrap">
            <table className="ab-report-table">
              <thead>
                <tr>
                  <th>Datum</th>
                  <th>A Exposure</th>
                  <th>A CTA</th>
                  <th>A Starts</th>
                  <th>A Submits</th>
                  <th>B Exposure</th>
                  <th>B CTA</th>
                  <th>B Starts</th>
                  <th>B Submits</th>
                </tr>
              </thead>
              <tbody>
                {report.byDay.map((row) => (
                  <tr key={row.date}>
                    <td>{row.date}</td>
                    <td>{formatCount(row.a.ab_home_variant_exposure)}</td>
                    <td>{formatCount(row.a.cta_primary_click)}</td>
                    <td>{formatCount(row.a.contact_form_start)}</td>
                    <td>{formatCount(row.a.contact_form_submit_success)}</td>
                    <td>{formatCount(row.b.ab_home_variant_exposure)}</td>
                    <td>{formatCount(row.b.cta_primary_click)}</td>
                    <td>{formatCount(row.b.contact_form_start)}</td>
                    <td>{formatCount(row.b.contact_form_submit_success)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Source Attribution</h2>
          <p>Leistung pro CTA-Quelle ueber den gewaehlten Zeitraum (Sortierung nach Exposure).</p>
        </div>

        <div className="insight-section">
          {report.sources.length === 0 ? (
            <p>Noch keine source-basierten Events im gewaehlten Zeitraum vorhanden.</p>
          ) : (
            <div className="ab-report-table-wrap">
              <table className="ab-report-table">
                <thead>
                  <tr>
                    <th>Source</th>
                    <th>Exposure gesamt</th>
                    <th>A Submit/Exposure</th>
                    <th>B Submit/Exposure</th>
                    <th>Delta B-A (pp)</th>
                    <th>Winner</th>
                    <th>Status</th>
                    <th>Empfehlung</th>
                  </tr>
                </thead>
                <tbody>
                  {report.sources.map((source) => {
                    const delta = source.deltaSubmitRateBvsA;
                    const winnerLabel = delta === 0 ? 'Tie' : delta > 0 ? 'B' : 'A';
                    return (
                      <tr key={source.source}>
                        <td>{source.source}</td>
                        <td>{formatCount(source.totalExposure)}</td>
                        <td>{formatRate(source.a.rates.submitRateFromExposure)}</td>
                        <td>{formatRate(source.b.rates.submitRateFromExposure)}</td>
                        <td>{delta.toFixed(2)}</td>
                        <td>{winnerLabel}</td>
                        <td>{source.decision.status}</td>
                        <td>{source.recommendedAction}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Top 3 naechste Massnahmen</h2>
          <p>Priorisiert nach erwartetem Submit-Uplift (30-Tage-Projektion) je Source.</p>
        </div>

        <div className="insight-section">
          {report.nextActions.length === 0 ? (
            <p>Aktuell keine priorisierbaren Massnahmen vorhanden.</p>
          ) : (
            <div className="ab-report-table-wrap">
              <table className="ab-report-table">
                <thead>
                  <tr>
                    <th>Rang</th>
                    <th>Source</th>
                    <th>Status</th>
                    <th>+Submits/30d</th>
                    <th>Lift/1000 Exposures</th>
                    <th>Massnahme</th>
                  </tr>
                </thead>
                <tbody>
                  {report.nextActions.map((action) => (
                    <tr key={`${action.rank}-${action.source}`}>
                      <td>{action.rank}</td>
                      <td>{action.source}</td>
                      <td>{action.decisionStatus}</td>
                      <td>{action.expectedAdditionalSubmits30d.toFixed(2)}</td>
                      <td>{action.expectedLiftPer1000Exposure.toFixed(2)}</td>
                      <td>{action.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
