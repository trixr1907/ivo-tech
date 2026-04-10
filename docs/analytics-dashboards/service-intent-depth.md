# Dashboard: Service Intent Depth

Stand: 2026-04-10  
Status: aktiv (operativer Modus)

## Scope

1. `service_page_view`
2. `service_cta_click` (`placement=hero-primary`)
3. `service_detail_view`
4. `service_detail_cta_click` (`placement=hero-primary`)

## Breakdown

1. `locale`
2. `slug`
3. `source`

## Query intent

1. Sichtbarkeit je Service-Seite vs. CTA-Tiefe auf Detail-Ebene.
2. WoW-Deltas fuer `view -> detail_cta` als Friktionssignal.

## Source of truth

1. Event contract: `docs/analytics-event-map.md`
2. Alert rule reference: `docs/analytics-dashboards/alerts.md`
