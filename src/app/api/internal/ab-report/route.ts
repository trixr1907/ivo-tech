import { getAbReport } from '@/server/ab-report/store';

function isAuthorized(request: Request, url: URL) {
  const expected = process.env.INTERNAL_REPORT_TOKEN?.trim() ?? '';
  if (!expected) return true;

  const queryToken = url.searchParams.get('key')?.trim() ?? '';
  const headerToken = request.headers.get('x-internal-report-token')?.trim() ?? '';
  return queryToken === expected || headerToken === expected;
}

function toCsvCell(value: string | number) {
  const raw = String(value);
  if (!/[",\n]/.test(raw)) return raw;
  return `"${raw.replaceAll('"', '""')}"`;
}

function buildDailyCsv(report: Awaited<ReturnType<typeof getAbReport>>) {
  const lines: string[] = [];
  lines.push('date,variant,exposure,cta_clicks,proof_opens,form_starts,submit_success,cta_rate_pct,submit_rate_pct');

  for (const row of report.byDay) {
    const rows = [
      { variant: 'a' as const, counts: row.a },
      { variant: 'b' as const, counts: row.b }
    ];

    for (const item of rows) {
      const exposure = item.counts.ab_home_variant_exposure;
      const ctaRate = exposure > 0 ? (item.counts.cta_primary_click / exposure) * 100 : 0;
      const submitRate = exposure > 0 ? (item.counts.contact_form_submit_success / exposure) * 100 : 0;
      lines.push(
        [
          row.date,
          item.variant,
          item.counts.ab_home_variant_exposure,
          item.counts.cta_primary_click,
          item.counts.proof_asset_open,
          item.counts.contact_form_start,
          item.counts.contact_form_submit_success,
          ctaRate.toFixed(2),
          submitRate.toFixed(2)
        ]
          .map(toCsvCell)
          .join(',')
      );
    }
  }

  return lines.join('\n');
}

function buildSourceCsv(report: Awaited<ReturnType<typeof getAbReport>>) {
  const lines: string[] = [];
  lines.push(
    [
      'source',
      'total_exposure',
      'total_submit_success',
      'a_exposure',
      'a_cta_clicks',
      'a_form_starts',
      'a_submit_success',
      'a_submit_rate_pct',
      'b_exposure',
      'b_cta_clicks',
      'b_form_starts',
      'b_submit_success',
      'b_submit_rate_pct',
      'delta_submit_rate_b_vs_a_pp',
      'decision_status',
      'decision_confidence95',
      'recommended_action'
    ].join(',')
  );

  for (const source of report.sources) {
    lines.push(
      [
        source.source,
        source.totalExposure,
        source.totalSubmitSuccess,
        source.a.totals.ab_home_variant_exposure,
        source.a.totals.cta_primary_click,
        source.a.totals.contact_form_start,
        source.a.totals.contact_form_submit_success,
        source.a.rates.submitRateFromExposure.toFixed(2),
        source.b.totals.ab_home_variant_exposure,
        source.b.totals.cta_primary_click,
        source.b.totals.contact_form_start,
        source.b.totals.contact_form_submit_success,
        source.b.rates.submitRateFromExposure.toFixed(2),
        source.deltaSubmitRateBvsA.toFixed(2),
        source.decision.status,
        source.decision.confidence95 ? 'true' : 'false',
        source.recommendedAction
      ]
        .map(toCsvCell)
        .join(',')
    );
  }

  return lines.join('\n');
}

function buildActionsCsv(report: Awaited<ReturnType<typeof getAbReport>>) {
  const lines: string[] = [];
  lines.push(
    [
      'rank',
      'source',
      'decision_status',
      'expected_additional_submits_30d',
      'projected_exposure_30d',
      'expected_lift_per_1000_exposure',
      'action',
      'rationale'
    ].join(',')
  );

  for (const action of report.nextActions) {
    lines.push(
      [
        action.rank,
        action.source,
        action.decisionStatus,
        action.expectedAdditionalSubmits30d.toFixed(2),
        action.projectedExposure30d.toFixed(2),
        action.expectedLiftPer1000Exposure.toFixed(2),
        action.action,
        action.rationale
      ]
        .map(toCsvCell)
        .join(',')
    );
  }

  return lines.join('\n');
}

export async function GET(request: Request) {
  const url = new URL(request.url);

  if (!isAuthorized(request, url)) {
    return Response.json({ ok: false, errorCode: 'unauthorized' as const }, { status: 401 });
  }

  const daysRaw = Number(url.searchParams.get('days') ?? '14');
  const report = await getAbReport(daysRaw);
  const format = (url.searchParams.get('format') ?? 'json').trim().toLowerCase();
  const breakdown = (url.searchParams.get('breakdown') ?? 'daily').trim().toLowerCase();

  if (format === 'csv') {
    const csv =
      breakdown === 'source' ? buildSourceCsv(report) : breakdown === 'actions' ? buildActionsCsv(report) : buildDailyCsv(report);
    const fileDate = new Date().toISOString().slice(0, 10);
    const suffix = breakdown === 'source' ? 'source' : breakdown === 'actions' ? 'actions' : 'daily';
    return new Response(csv, {
      status: 200,
      headers: {
        'content-type': 'text/csv; charset=utf-8',
        'content-disposition': `attachment; filename="ab-home-cta-proof-${suffix}-${fileDate}.csv"`
      }
    });
  }

  return Response.json({ ok: true, report }, { status: 200 });
}
