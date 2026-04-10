# Analytics Dashboard Buildsheet (PostHog)

Stand: 2026-04-10  
Scope: operative Umsetzung von `docs/analytics-activation-runbook.md` in PostHog.

## 1) Event integrity pre-check

Vor Dashboard-Bau:

1. `npm run analytics:verify:map:strict`
2. `npm run analytics:readiness:strict` (mit produktionsnahen Env-Werten)
3. In PostHog Live Events pruefen, ob folgende Events eintreffen:
   - `cta_primary_click`
   - `contact_form_start`
   - `contact_form_submit_success`
   - `thank_you_view`
   - `thank_you_cta_click`

## 2) Dashboard pack (exact setup)

## Dashboard A: Funnel Core

- Name: `Funnel Core`
- Type: `Funnels`
- Steps:
  1. `cta_primary_click`
  2. `contact_form_start`
  3. `contact_form_submit_success`
  4. `thank_you_view`
  5. `thank_you_cta_click`
- Filter:
  - optional `placement in [primary,scheduler]` on step 5
- Breakdown:
  - `locale`
  - `source`

## Dashboard B: Service Intent Depth

- Name: `Service Intent Depth`
- Tile 1 (Funnel):
  1. `service_page_view`
  2. `service_cta_click` with filter `placement=hero-primary`
  3. `service_detail_view`
  4. `service_detail_cta_click` with filter `placement=hero-primary`
- Tile 2 (Trend):
  - event trend for `service_detail_view` vs `service_detail_cta_click`
- Breakdown:
  - `locale`
  - `slug` (for detail events)

## Dashboard C: Attribution Quality

- Name: `Attribution Quality`
- Tile 1:
  - trend: `contact_form_start` by `source`
- Tile 2:
  - formula: `source=unknown / all contact_form_start`
- Tile 3:
  - conversion trend: `contact_form_submit_success` by `source`

## Dashboard D: Locale Split

- Name: `Locale Split`
- Events:
  - `cta_primary_click`
  - `contact_form_start`
  - `contact_form_submit_success`
  - `thank_you_cta_click`
- Breakdown:
  - `locale`
- View:
  - line/bar trend + week-over-week compare

## Dashboard E: Experiment Lens

- Name: `Experiment Lens`
- Base metric:
  - `hero_variant_view`
- Required variant breakdown:
  - `variant` (`default|outcome|speed`)
- Derived ratios:
  1. `contact_form_start / cta_primary_click`
  2. `contact_form_submit_success / contact_form_start`
  3. `scheduler_cta_click / contact_form_start`
- Guardrail:
  - verify sample distribution against configured weights (default `50/25/25`)

## 3) Alert setup (PostHog)

## Alert 1: Submit Success WoW Drop

- Query:
  - weekly `contact_form_submit_success`
- Trigger:
  - current week < previous week * 0.7
- Channel:
  - Slack + Email

## Alert 2: Detail CTA Efficiency Drop

- Query:
  - weekly `service_detail_cta_click` (filter `placement=hero-primary`)
  - weekly `service_detail_view`
- Trigger:
  - CTA metric < previous week * 0.8 AND view metric >= previous week

## Alert 3: Unknown Source Spike

- Query:
  - `contact_form_start` where `source=unknown`
  - `contact_form_start` total
- Trigger:
  - unknown_ratio > 0.25

## Alert 4: Weekly KPI digest

- Format:
  - table snapshot from `docs/analytics-kpi-board.md`
- Delivery:
  - Friday 12:00 Europe/Berlin
  - Slack channel + fallback email

## 4) Evidence requirements (for closeout)

In `docs/analytics-live-status.md` dokumentieren:

1. Dashboard URLs (alle 5).
2. Alert IDs/links (alle 4).
3. Erster Weekly Digest (timestamp + channel).
4. Kurze Validierungsnotiz aus realem Funnel-Testlauf.
