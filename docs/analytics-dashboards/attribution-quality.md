# Dashboard: Attribution Quality

Stand: 2026-04-10  
Status: aktiv (operativer Modus)

## Scope

1. `contact_form_start` nach `source`.
2. `contact_form_submit_success` nach `source`.
3. Ratio `source=unknown / all contact_form_start`.

## Breakdown

1. `source`
2. `locale`
3. `heroVariant`

## Query intent

1. Verlustfreie Source-Zuordnung in allen Kernpfaden.
2. Frühes Signal bei Tracking-Friktion oder URL-Attribution-Fehlern.

## Source of truth

1. Event contract: `docs/analytics-event-map.md`
2. Hard-alert thresholds: `scripts/analytics-plausible-ops.mjs`
