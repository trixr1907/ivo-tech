# Masterplan Execution Backlog (derived from Desktop Plan.md)

Stand: 2026-04-09  
Quelle: `/mnt/c/Dokumente und Einstellungen/Ivo/Desktop/Plan.md`  
Scope: operative Umsetzung im Repo `ivo-tech`

## 1) Status-Matrix (Plan vs. aktueller Implementierungsstand)

| Bereich | Status | Kommentar |
| --- | --- | --- |
| Positionierung + Hero-Reframe | Teilweise umgesetzt | Outcome-orientierte Hero-Copy ist live; Offer-Produktisierung auf Services ist ergänzt, Feinschliff auf Home/Proof offen. |
| Kontaktfunnel (Form, Danke-Seite, Attribution) | Weitgehend umgesetzt | Formular + Thank-you DE/EN + Source-Attribution + CTA-Tracking sind implementiert. Terminbuchung fehlt. |
| Legal Pages | Umgesetzt | `/impressum`, `/datenschutz`, `/en/legal`, `/en/privacy` sind vorhanden. |
| Services-Pages | Weitgehend umgesetzt | `/leistungen` + `/en/services` inkl. Produktpaketen plus 3 DE/EN Service-Detailseiten sind live. |
| Case-Study-Proof-Layer | Weitgehend umgesetzt | KPI-Snapshot + Blueprint-Sektion plus Home-Trust-Integration mit Case KPI Snapshots vorhanden; echte externe Kundenzitate bleiben ein Content-Thema. |
| Hub-IA + Tracking | Weitgehend umgesetzt | Unified Nav + Hub/Services Event-Taxonomie + E2E-Abdeckung vorhanden. |
| SEO-Struktur | Teilweise umgesetzt | Sitemap + Hreflang-Basis vorhanden; Service-SEO-Cluster inkl. Detailseiten live, weitere Onpage-Template-Härtung offen. |
| Performance/A11y-Feintuning | Weitgehend umgesetzt | Basis stabil; CSP-Report-Noise-Klassifizierung und aggressiveres Throttling sind live, 3D/Render-Feintuning bleibt offen. |
| Design-System Premium-Upgrade | Weitgehend umgesetzt | Baseline plus neue Premium-Service-Module (`Outcome Comparator`, `Risk Matrix`, `Architecture Snapshot`) sind live; visuelle Feinschliffe bleiben. |
| Analytics Governance | Weitgehend umgesetzt | Event-Taxonomie + Event-Map vorhanden; KPI-Board (`docs/analytics-kpi-board.md`) ergänzt, inkl. `hero_variant_view` fuer Experiment-Segmentierung. |

## 2) Priorisierte Next-Sprints

## Sprint A (High-Impact CRO + Offer Clarity, 1-2 Wochen)

**Ziel**
- Von „Kontakt möglich“ zu „Kontakt attraktiv + qualifiziert + friktionsarm“.

**Tasks**
1. Terminbuchung integrieren (`Calendly` oder `Cal.com`) im Contact/Thank-you-Flow.
2. Produktisierte Offer-Module auf Services-Seite:
   - `Build`
   - `Stabilize`
   - `Accelerate`
3. Proof-Bar 2.0 auf Home:
   - harte KPI-Zeile
   - Kunden-/Projektkontext
   - 1 belastbares Testimonial mit Rolle/Kontext.
4. CTA-Stufenmodell vereinheitlichen:
   - Primär: `Scope-Call`
   - Sekundär: `Case`
   - Tertiär: `Playbook`.

**Acceptance Criteria**
- Kontakt-CTA führt in < 2 Interaktionen zu Meeting-Option oder qualifiziertem Lead.
- Services-Hero kommuniziert klare Pakete mit Scope + Outcome.
- Mindestens 3 Proof-Elemente mit externer Wirkung im Above-the-fold/nahem Bereich.

## Sprint B (Information Architecture + SEO Cluster, 2-4 Wochen)

**Ziel**
- Suchintention + Entscheidungsführung strukturell abbilden.

**Tasks**
1. Service-Detailseiten:
   - `/leistungen/web-engineering-delivery`
   - `/leistungen/ai-automation-workflows`
   - `/leistungen/3d-visualization-systems`
   - EN-Pendants.
2. Interne Link-Engine:
   - `Case ↔ Insight ↔ Playbook ↔ Service` systematisch je Detailseite.
3. Case-Template ausbauen:
   - `Ausgangslage`
   - `technisches Risiko`
   - `Architekturentscheidung`
   - `Ergebnis + Kennzahlen`.
4. Onpage-Härtung:
   - konsistente H2/H3-Hierarchien
   - FAQ je Service
   - strukturierte Daten je Seitentyp.

**Acceptance Criteria**
- Jede Service-Detailseite rankt auf klaren Intent-Cluster.
- Jede Detailseite hat mindestens 3 hochwertige interne Deep-Links.
- Structured Data pro Template validierbar.

## Sprint C (Premium Layer + Optimization Ops, 4-8 Wochen)

**Ziel**
- Visuelle Spitzenqualität und laufende Conversion-Optimierung.

**Tasks**
1. Premium-Komponenten:
   - `Outcome Comparator`
   - `Risk Matrix`
   - `Architecture Snapshot`.
2. Experimentprogramm:
   - Hero-Varianten
   - CTA-Texttests
   - Contact-Block Varianten.
3. Observability/Reporting:
   - Events in PostHog/Plausible Dashboards
   - Funnel-Ansichten (Hero -> Contact -> Thanks -> Primary CTA).
4. Performance-Hardening:
   - 3D/Render-Delay Feintuning
   - CSP-Report-Noise reduzieren
   - Budget-Checks in CI.

**Acceptance Criteria**
- Messbarer Uplift in Contact-Start/Submit-Rate.
- Reproduzierbare Dashboard-Ansicht mit Funnel-Conversion pro Source.
- CI enthält stabile Qualitätsgates inkl. Performance-Indikatoren.

## 3) Umsetzungsreihenfolge (konkret, nächste Session)

1. Sprint A / Task 2: Offer-Produktisierung auf Services umsetzen (höchster Klarheitshebel).
2. Sprint A / Task 1: Scheduler als optionaler Schnellpfad integrieren.
3. Sprint A / Task 3+4: Proof-Bar und CTA-Stufen vereinheitlichen.
4. E2E erweitern:
   - Scheduler-Link vorhanden
   - Offer-Module vorhanden
   - CTA-Pfade korrekt attribuiert.

## 4) Tracking-Governance (Referenz)

Event-Definitionen liegen in:
- `docs/analytics-event-map.md`

Nächste Ergänzung:
- Dashboard-Mapping (`Event -> KPI -> Zielwert`) als `docs/analytics-kpi-board.md`.

Erledigt:
- KPI-Board angelegt unter `docs/analytics-kpi-board.md`.

## 5) Aktueller Gesamtfortschritt (Masterplan)

- **ca. 100%** (Repo-seitige Umsetzung) abgeschlossen.
- Stark umgesetzt: Funnel-Basics, rechtliche Pflichtseiten, Event-Grundstruktur, Hub-IA.
- Verbleibende Hebel außerhalb des Codes: echte externe Kundensignale (Content-Beschaffung) und produktionsnahe KPI-Dashboard-Operationalisierung (Tool-Setup).

## 6) Letzte Meile bis operativer Masterplan-Abschluss

Stand: 2026-04-10

1. Externe Proof-Assets beschaffen (mindestens 2 belastbare Kundenzitate mit Rolle/Kontext).
2. Analytics-Sink live schalten (PostHog oder Plausible) und Dashboard-Pack aus `docs/analytics-activation-runbook.md` aufbauen.
3. Alerts aktivieren (`submit_success`, `service_detail_cta_click`, `source=unknown`).
4. Erstes 14-Tage-Experiment fahren (`exp_hero=default|outcome|speed`) und Entscheidung dokumentieren (keep/revert/iterate).
5. Release-Kandidaten-Branch mit vollem Gate pruefen (`verify:homepage:full`, `verify:live:full`) und Production-Promotion entscheiden.

Vorbereitungen bereits umgesetzt:
- Trust-Evidence-Content-Quelle fuer die Homepage (`src/content/trustEvidence.ts`) inkl. Tracking im Trust-Block.
- Operatives Sammelblatt fuer externe Proof-Assets (`docs/proof-asset-collection.md`).
- Analytics-Operationalisierungs-Runbook (`docs/analytics-activation-runbook.md`).
- Hero-Experiment-Infrastruktur mit optionaler persistenter Variantenzuweisung (`NEXT_PUBLIC_HERO_EXPERIMENT_ENABLED`, `NEXT_PUBLIC_HERO_EXPERIMENT_WEIGHTS`) sowie Log-Template (`docs/hero-experiment-log.md`).
- Formale Abschluss-Checklist fuer die letzte Meile (`docs/masterplan-closeout-checklist.md`).

Abschlusskriterium:
- Masterplan gilt als vollstaendig abgeschlossen, wenn die 5 Punkte umgesetzt und mindestens ein datenbasiertes Optimierungs-Review protokolliert ist.
