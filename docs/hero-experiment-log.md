# Hero Experiment Log (14 Tage)

Stand: 2026-04-10  
Scope: Variant test `default` vs `outcome` vs `speed`
Experiment-Fenster: 2026-04-10 bis 2026-04-23
Activation status: `live` (production env set on 2026-04-10)

## 1) Setup

Env toggles:

- `NEXT_PUBLIC_HERO_EXPERIMENT_ENABLED=true`
- `NEXT_PUBLIC_HERO_EXPERIMENT_WEIGHTS=50,25,25`

Hinweis:
- URL override bleibt moeglich: `?exp_hero=default|outcome|speed`.
- Ohne URL-Parameter wird (bei aktivem Toggle) eine persistente Variante zugewiesen.
- Datumsfenster kann per Script neu gesetzt werden: `npm run hero:experiment:plan -- --start=YYYY-MM-DD`.
- Fortschritt kann geprueft werden mit:
  - `npm run hero:log:readiness`
  - `npm run hero:log:readiness:strict`
- Tageswerte koennen automatisiert aus Plausible synchronisiert werden:
  - `npm run hero:log:sync:plausible -- --day=YYYY-MM-DD`

## 2) Ziel-KPIs

Primär:
1. `contact_form_submit_success / cta_primary_click`

Sekundär:
1. `contact_form_start / cta_primary_click`
2. `scheduler_cta_click / contact_form_start`
3. `thank_you_cta_click(primary|scheduler) / thank_you_view`

## 3) Guardrail-KPIs

1. Kein signifikanter Anstieg von `contact_form_error`.
2. Kein Einbruch der `case`/`playbook` CTA-Nutzung >20% WoW.

## 4) Tageslog

| Datum | Variant-Verteilung (default/outcome/speed) | CTA Primary CTR | Contact Start Rate | Submit Success Rate | Notes |
| --- | --- | --- | --- | --- | --- |
| 2026-04-10 | init | n/a | n/a | n/a | Experiment aktiviert, Tageswerte ab naechstem Reporting-Slot erfassen |
| 2026-04-11 |  |  |  |  |  |
| 2026-04-12 |  |  |  |  |  |
| 2026-04-13 |  |  |  |  |  |
| 2026-04-14 |  |  |  |  |  |
| 2026-04-15 |  |  |  |  |  |
| 2026-04-16 |  |  |  |  |  |
| 2026-04-17 |  |  |  |  |  |
| 2026-04-18 |  |  |  |  |  |
| 2026-04-19 |  |  |  |  |  |
| 2026-04-20 |  |  |  |  |  |
| 2026-04-21 |  |  |  |  |  |
| 2026-04-22 |  |  |  |  |  |
| 2026-04-23 |  |  |  |  |  |

## 5) Entscheidungsprotokoll

Decision date: `____-__-__`

1. Winner: `default|outcome|speed`
2. Decision: `keep|revert|iterate`
3. Rationale (zahlenbasiert):
   - Primary KPI delta:
   - Secondary KPI deltas:
   - Guardrail check:
4. Follow-up:
   - CTA copy:
   - Trust block:
   - Contact flow:
