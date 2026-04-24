# Dashboard: Funnel Core

Stand: 2026-04-10  
Status: aktiv (operativer Modus)

## Scope

1. `cta_primary_click`
2. `contact_form_start`
3. `contact_form_submit_success`
4. `thank_you_view`
5. `thank_you_cta_click` (`placement=primary|scheduler`)

## Breakdown

1. `locale`
2. `source`
3. `heroVariant`

## Source of truth

1. Event contract: `docs/analytics-event-map.md`
2. KPI targets: `docs/analytics-kpi-board.md`
3. Runtime relay health: `POST /api/analytics` acceptance checks in `docs/analytics-live-status.md`

## Operational note

Daily execution is automated via `.github/workflows/analytics-ops-daily.yml` and `scripts/analytics-plausible-ops.mjs`.
