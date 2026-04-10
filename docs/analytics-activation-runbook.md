# Analytics Activation Runbook

Stand: 2026-04-10  
Scope: operationalize existing event instrumentation into usable funnel reporting and alerting.

## 1) Zielbild

This repo already emits the required funnel events (see `docs/analytics-event-map.md`) and KPI model (`docs/analytics-kpi-board.md`).
The open work is operational:

1. route events into your analytics workspace,
2. build the agreed dashboards,
3. activate weekly alerting and decision cadence.

## 2) Preconditions

1. All tracking quality gates are green locally and in CI:
   - `npm run analytics:verify:map:strict`
   - `npm run verify:homepage:full`
   - `npm run analytics:readiness:strict`
2. `NEXT_PUBLIC_SITE_URL` is set per environment.
3. `NEXT_PUBLIC_ANALYTICS_ALLOWED_HOSTS` includes all domains that may emit events (production + preview, if needed).
4. Optional hero experiment toggle is configured if A/B run is planned:
   - `NEXT_PUBLIC_HERO_EXPERIMENT_ENABLED=true`
   - `NEXT_PUBLIC_HERO_EXPERIMENT_WEIGHTS=50,25,25`
5. Analytics relay is configured (new runtime contract):
   - `NEXT_PUBLIC_ANALYTICS_SINK_ENABLED=true`
   - `ANALYTICS_SINK_PROVIDER=posthog` (recommended) or `plausible`
   - Provider credentials/domain envs set (see `.env.example`)
6. For Plausible operations automation:
   - `PLAUSIBLE_STATS_API_KEY` is set locally/CI for read-only Stats API queries
   - run `npm run analytics:plausible:ops` for weekly snapshot + alert evaluation
   - run `npm run analytics:plausible:ops:strict` to fail on triggered hard alerts

## 2a) Repo implementation status (2026-04-10)

- Client event emitter (`trackEvent`) forwards all normalized events and aliases to `/api/analytics` when `NEXT_PUBLIC_ANALYTICS_SINK_ENABLED=true`.
- New backend relay route: `POST /api/analytics`.
- Supported sinks:
  - PostHog via `POST /i/v0/e/` on configured host.
  - Plausible via `POST /api/event` on configured host.
- If sink provider is `none` or misconfigured, API returns explicit status/error and does not break UX flows.

## 3) Recommended sink setup

Choose one primary product analytics sink:

1. `PostHog` (recommended): best for funnel + property segmentation + alerts.
2. `Plausible`: good for lightweight event trend dashboards.

Important:
- Keep event names and payload fields unchanged from `docs/analytics-event-map.md`.
- Do not rename events in the sink; transform only at dashboard/query level.

## 4) Mandatory dashboard pack

Build these dashboards exactly (names can differ, formulas should not):

1. `Funnel Core`
   - `cta_primary_click`
   - `contact_form_start`
   - `contact_form_submit_success`
   - `thank_you_view`
   - `thank_you_cta_click` (`placement` = `primary|scheduler`)

2. `Service Intent Depth`
   - `service_page_view`
   - `service_cta_click` (`placement=hero-primary`)
   - `service_detail_view`
   - `service_detail_cta_click` (`placement=hero-primary`)

3. `Attribution Quality`
   - conversion rate by `source`
   - ratio of `source=unknown`

4. `Locale Split`
   - DE vs EN for:
     - `cta_primary_click`
     - `contact_form_start`
     - `contact_form_submit_success`
     - `thank_you_cta_click`

5. `Experiment Lens`
   - compare `hero_variant_view.variant` for downstream:
     - contact start rate
     - submit success rate
     - scheduler assist rate
   - verify distribution is plausible against configured weights (no severe skew due to low sample volume).

## 5) Alerts (weekly + hard alerts)

Configure these alerts:

1. Hard alert: `contact_form_submit_success` drops >30% WoW.
2. Hard alert: `service_detail_cta_click (hero-primary)` drops >20% WoW while `service_detail_view` rises.
3. Hard alert: `source=unknown` exceeds 25% of `contact_form_start`.
4. Weekly report: KPI table from `docs/analytics-kpi-board.md` to Slack/Email.

Repo automation (Plausible):
- Daily workflow: `.github/workflows/analytics-ops-daily.yml`
- Runs KPI snapshot + strict hard-alert evaluation using `analytics:plausible:ops:strict`.
- Requires GitHub secret: `PLAUSIBLE_STATS_API_KEY`.

## 6) QA after activation

For each production release:

1. perform one real funnel pass:
   - homepage hero click
   - contact form start
   - successful submit
   - thank-you primary CTA click
2. verify each event appears with correct properties:
   - `locale`
   - `source`
   - `heroVariant` (if experiment path)
   - `placement` where relevant
3. verify dashboard cards update within expected ingestion delay.

## 7) Weekly operating cadence

1. Monday:
   - choose max 3 optimization hypotheses (copy, CTA, order, proof).
2. Mid-week:
   - run one controlled change batch.
3. Friday:
   - evaluate KPI deltas and decide keep/revert/iterate.

No release should claim CRO improvement without event-backed KPI movement.

## 8) Completion criteria (for masterplan close)

Analytics operationalization is done when:

1. the 5 mandatory dashboards are live,
2. all 4 alerts are active,
3. first weekly KPI report has been reviewed and documented,
4. at least one experiment decision (`keep/revert/iterate`) is logged from measured data.

## 9) Activation checklist (operational)

1. Set production env vars in hosting platform.
2. Deploy and run one end-to-end funnel pass.
3. Confirm sink receives:
   - `cta_primary_click`
   - `contact_form_start`
   - `contact_form_submit_success`
   - `thank_you_view`
4. Build all five mandatory dashboards.
5. Configure all four alerts.
6. Record links/screenshots and activation date in `docs/analytics-live-status.md`.
