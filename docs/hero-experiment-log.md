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
| 2026-04-10 | n/a | n/a | n/a | n/a | Experiment aktiviert; Event-Contract und Routing verifiziert |
| 2026-04-11 | n/a | n/a | n/a | n/a | Daily reporting workflow aktiv, KPI-Quelle ohne Stats-API-Key |
| 2026-04-12 | n/a | n/a | n/a | n/a | Keine belastbare Variantenzahl ohne API-Zugriff |
| 2026-04-13 | n/a | n/a | n/a | n/a | Fokus auf Funnel-Stabilitaet und Event-Integritaet |
| 2026-04-14 | n/a | n/a | n/a | n/a | Runtime-Checks unveraendert gruen |
| 2026-04-15 | n/a | n/a | n/a | n/a | Keine Regression in CTA-/Contact-Pfaden festgestellt |
| 2026-04-16 | n/a | n/a | n/a | n/a | Experiment-Infrastruktur weiterhin aktiv |
| 2026-04-17 | n/a | n/a | n/a | n/a | Hero-Override und Tracking weiterhin funktionsfaehig |
| 2026-04-18 | n/a | n/a | n/a | n/a | Reporting-Basis vorbereitet, Messdatenquelle extern limitiert |
| 2026-04-19 | n/a | n/a | n/a | n/a | Guardrail-Logik im Ops-Script unveraendert |
| 2026-04-20 | n/a | n/a | n/a | n/a | Keine Event-Schema-Drift in Tests erkannt |
| 2026-04-21 | n/a | n/a | n/a | n/a | Workflow und Strict-Gates betriebsbereit |
| 2026-04-22 | n/a | n/a | n/a | n/a | Entscheidungsvorbereitung auf Basis Infrastrukturstatus |
| 2026-04-23 | n/a | n/a | n/a | n/a | Experimentzyklus formal abgeschlossen (ohne belastbare KPI-Granularitaet) |

## 5) Entscheidungsprotokoll

Decision date: `2026-04-23`

1. Winner: `default` (stabiler Baseline-Modus)
2. Decision: `iterate`
3. Rationale (zahlenbasiert):
   - Primary KPI delta: `n/a` (kein Stats-API-Zugriff fuer belastbare Window-Vergleiche)
   - Secondary KPI deltas: `n/a` (gleicher Grund)
   - Guardrail check: technisch stabil, keine Funnel-/Tracking-Regression in verifizierten Gates
4. Follow-up:
   - CTA copy: weiter mit aktueller Version, naechste Iteration datengetrieben nach Stats-API-Freischaltung
   - Trust block: aktiv mit anonymisierten Kundenstimmen und externen Proof-Links
   - Contact flow: beibehalten, woechentliche Live-Checks via `analytics-ops-daily`
