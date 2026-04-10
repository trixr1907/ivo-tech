# Analytics KPI Board (Masterplan Sprint C)

Stand: 2026-04-09  
Scope: Home, Services, Service-Detail, Contact, Thank-you

## Assumptions

- Zielwerte sind Start-Hypothesen fuer die ersten 30 Tage und muessen nach Baseline-Messung angepasst werden.
- Primärer Conversion-Outcome ist `qualified lead` (Contact submit oder Scheduler-Klick mit validem Source).
- Dashboarding kann in PostHog oder Plausible aufgebaut werden; Event-Namen bleiben channel-agnostisch.

## KPI-Mapping

| Funnel Stage | KPI | Berechnung (Event-basiert) | Zielwert (Initial) | Owner | Segmentierung |
| --- | --- | --- | --- | --- | --- |
| Entry | Hero CTA CTR | `cta_primary_click / page views` | >= 3.5% | Growth + UX | `locale`, `source` |
| Qualification | Contact Start Rate | `contact_form_start / cta_primary_click` | >= 45% | CRO | `source`, `intent` |
| Lead Conversion | Contact Submit Rate | `contact_form_submit_success / contact_form_start` | >= 22% | CRO + Content | `source`, `locale` |
| High-intent Alt Path | Scheduler Assist Rate | `scheduler_cta_click / contact_form_start` | >= 12% | Sales Ops | `source`, `placement` |
| Services Intent | Services Scope CTR | `service_cta_click(placement=hero-primary) / service_page_view` | >= 4.0% | Service Marketing | `locale` |
| Service Deep Intent | Detail CTA Rate | `service_detail_cta_click(placement=hero-primary) / service_detail_view` | >= 5.0% | Service Marketing | `slug`, `locale` |
| Proof Consumption | Case Deep Click Rate | `*_cta_click` mit `placement` = `hero-secondary-case` oder `related-case` / Seitenaufrufe | >= 8.0% | Brand + Growth | `slug`, `source` |
| Retention of Intent | Thank-you Next Step Rate | `thank_you_cta_click(placement=primary|scheduler) / thank_you_view` | >= 40% | Sales Ops | `source`, `locale` |

## Dashboard Views (Minimum Set)

1. Funnel Core: `Hero -> Contact start -> Submit success -> Thank-you primary CTA` (segmentierbar via `heroVariant`).
2. Service Depth: `Services index -> Service detail -> Hero primary click -> Contact`.
3. Attribution Quality: Conversion Rate je `source` inkl. Unknown-Anteil.
4. Locale Split: DE vs EN fuer CTA-Rate, Submit-Rate, Thank-you-Weiterklick.
5. Experiment Lens: `hero_variant_view` segmentiert nach `variant` fuer CTA- und Submit-Downstream-Vergleich.

## Alerting Thresholds

- Alert 1: `contact_form_submit_success` faellt > 30% WoW.
- Alert 2: `service_detail_view` steigt, aber `service_detail_cta_click(hero-primary)` sinkt > 20% WoW.
- Alert 3: `source=unknown` Anteil > 25% bei `contact_form_start`.

## Experiment Backlog Hooks

- Hero CTA Copy A/B:
  - A: `Scope-Call anfragen`
  - B: `Technical Scope in 30 Min klaeren`
- Contact block order:
  - A: Formular zuerst
  - B: Scheduler zuerst
- Services package order:
  - A: Build > Stabilize > Accelerate
  - B: Stabilize > Build > Accelerate
