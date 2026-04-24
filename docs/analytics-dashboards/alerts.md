# Alerts: Operational Rules

Stand: 2026-04-10  
Status: aktiv (operativer Modus)

## Alert rules

1. `submit_success_wow_drop`
   - Trigger: `contact_form_submit_success` < 70% von Vorwoche.
2. `detail_cta_efficiency_drop`
   - Trigger: `service_detail_cta_click` < 80% von Vorwoche bei gleichzeitig stabil/steigendem `service_detail_view`.
3. `unknown_source_spike`
   - Trigger: `source=unknown` > 25% von `contact_form_start`.
4. `weekly_kpi_digest`
   - Trigger: täglicher Workflow liefert Weekly-Window Snapshot (7d vs prev 7d).

## Runtime wiring

1. Query logic: `scripts/analytics-plausible-ops.mjs`
2. Strict mode: `npm run analytics:plausible:ops:strict`
3. Scheduler: `.github/workflows/analytics-ops-daily.yml`

## Verification

1. Workflow runs documented in `docs/analytics-live-status.md`.
2. GitHub readiness check: `npm run github:ops:readiness`.
