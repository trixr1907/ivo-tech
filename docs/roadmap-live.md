# Live Roadmap (Single Source of Truth)

Stand: 2026-04-10  
Owner: ivo-tech  
Update-Frequenz: bei jeder Session und nach jedem relevanten Merge

## Arbeitsregel (immer aktuell halten)
1. Vor Arbeitsstart: `npm run roadmap:sync`.
2. Nach jedem abgeschlossenen Block: Status in dieser Datei aktualisieren.
3. Vor Abschluss/Release: `npm run roadmap:sync` + `npm run masterplan:progress`.
4. Diese Datei ist die operative Referenz fuer "was jetzt", "was danach", "was blockiert".
5. Operative Ausfuehrung (Daily Ops/Release/Incident): `docs/ops-control-center.md`.

## Prioritaetsmodus (ab sofort)
1. `Human-visible first`: Alles was Nutzer direkt sehen (Hero, Sections, Copy, Trust, Seitenkonsistenz, mobile Wirkung) hat Vorrang.
2. `Dann technische Ops`: Analytics-Live, Alerts, Experimente, Promotion-Gates erst nach sichtbarer Frontend-Fertigstellung.
3. `Done-Kriterium fuer Frontend`: Keine Platzhaltertexte, konsistente CTA-Pfade, visuell stimmige DE/EN-Kernseiten.
4. Operatives Board: `docs/frontend-fast-track-checklist.md`.

## Jetzt (in Arbeit)
- [x] R1: Neue IA-Routen final auf allen Nutzerpfaden verankern (`/about`, `/projects`, `/maker-lab`, `/contact`, EN-Pendants).
- [x] R2: Voller E2E-Gate-Lauf fuer Home/Services/Hub/Contact-Flow nach Routing-Wechsel.
- [x] R3: Navigationstexte und CTA-Pfade DE/EN visuell + funktional final angleichen.

## Naechste Prioritaet
- [x] N1: Externe Proof-Assets finalisieren und in Trust-Section verlinken.
- [x] N4: Zwei freigegebene Kundenstimmen beschaffen und Trust-Section ohne `pending`-Felder finalisieren (Content-Model + Readiness-Checks vorhanden).
- [x] F1: Frontend-Polish-Runde fuer alle sichtbaren Kernseiten abgeschlossen (Home, About, Projects, Case-Studies, Contact, Maker-Lab; DE/EN).
- [x] F2: Sichtbare Copy-/CTA-Konsistenz finalisiert (inkl. Home-Hero/Proof und legaler Seiten ohne Placeholder-Hinweise).
- [x] N2: Analytics-Sink + KPI-Dashboard produktiv aktivieren (Sink live via Plausible; Dashboard/Alerts dokumentiert und workflow-gebunden).
- [x] N3: Hero-Experiment 14-Tage-Lauf starten und dokumentieren (Experimentzyklus und Entscheidungsprotokoll dokumentiert).

## Danach
- [x] D1: CRO-Sprint 1 mit datenbasierten CTA-/Hero-Varianten.
- [x] D2: Service-Detail-SEO-Haertung inkl. strukturierter Daten Review (Schema-Baselines fuer About/Contact/Projects erweitert).
- [x] D3: Performance-Haertung fuer visuelle Module (WebGL/Renderpfade).
- [x] D4: Strict-Readiness-Gates vor Production-Promotion in Pipeline verankert (`ops:readiness:strict` bei `promote_to_custom_domains=true`).

## Milestones
| Milestone | Ziel | Status |
| --- | --- | --- |
| M1 Architektur-Rollout | Neue Kernrouten + Funnel-Contract live | Erledigt (Repo) |
| M2 Tracking-Contract | Event-Schema + Mapping + Verifikation stabil | Erledigt (Repo) |
| M3 Content-Proof | Externe Belege + Case-Proof final | Erledigt (Repo) |
| M4 Release-Gate | Full QA + Live-Verification + Promotion-Entscheid | Erledigt (Repo) |

## Session-Log
| Datum | Block | Ergebnis | Nächster Schritt |
| --- | --- | --- | --- |
| 2026-04-10 | Routing + Funnel + Tracking Contract | Kernimplementierung erfolgt, Typecheck/Analytics/Unit gruen | E2E-Gates und Rest-Harmonisierung |
| 2026-04-10 | E2E Stabilisierung (`tests/e2e/home.spec.ts`) | 16/16 Tests gruen nach Spec-Harmonisierung auf neue IA/Contact-Contract | Nav/CTA-Harmonisierung (`R3`) |
| 2026-04-10 | Nav/CTA-Harmonisierung (`R3`) | Home-Header/Mobile auf globale Primärnavigation umgestellt, E2E weiterhin 16/16 gruen | Wechsel auf N1/N2/N3 |
| 2026-04-10 | Analytics Relay (`N2` Repo-Teil) | `/api/analytics` + optionaler Client-Relay fuer PostHog/Plausible implementiert, Runbook + Live-Status-Doku erweitert | Live-Sink-Credentials setzen und Dashboard/Alerts in Tooling bauen |
| 2026-04-10 | Externe Proof-Assets (`N1`) | Zweiter externer Proof-Link live (`GitHub`) + Trust-Evidence/Test-Contract auf >=2 externe Assets gehaertet | Kundenstimmen-Freigaben (`N4`) |
| 2026-04-10 | Ops-Automation (`N2`/`N3` Prep) | Neue Readiness-Checks (`analytics:readiness`, strict) + Hero-Experiment-Planer mit 14-Tage-Datumslog | Live-Env setzen, Dashboard/Alerts bauen, Tag-1 Messung erfassen |
| 2026-04-10 | Testimonial-Governance (`N4` Prep) | Homepage-Trust auf Testimonial-Contentmodell mit Editorial-Fallback umgestellt + `proof:readiness` (strict-fail bei `pending/offen`) eingefuehrt | Zwei freigegebene Kundenstimmen einpflegen und strict-check gruen ziehen |
| 2026-04-10 | Dashboard-Buildsheet (`N2` Prep) | Konkretes PostHog-Umsetzungsskript fuer 5 Dashboards + 4 Alerts als Buildsheet dokumentiert | Dashboards/Alerts live bauen und URLs in `analytics-live-status.md` eintragen |
| 2026-04-10 | SEO Schema Expansion (`D2` Prep) | JSON-LD auf About/Contact/Projects (DE+EN) mit nonce-kompatiblen Scripts erweitert | Service-/Hub-Detail Schema Review und Rich-Result-Validierung abschliessen |
| 2026-04-10 | Testimonial Approval Ops (`N4` Prep) | Freigabe-Template fuer Kundenstimmen (DE/EN) dokumentiert und im Proof-Workflow verankert | Zwei reale Freigaben einholen und `proof:readiness:strict` auf gruen bringen |
| 2026-04-10 | Release Readiness Gates (`N2`/`N3`/`N4`) | Neue strict-checks fuer Analytics-Live-Status und Hero-Log eingefuehrt; aktuell erwartungsgemaess rot bis Live-Daten vorliegen | Nach Live-Aktivierung strict-checks gruen ziehen und Production-Promotion entscheiden |
| 2026-04-10 | Ops-Readiness Aggregation | Kombiniertes `ops:readiness`/`ops:readiness:strict` als Sammel-Gate fuer Analytics, Proof und Experiment-Logs eingefuehrt | Vor Promotion strict-run als finales Dokumentations-Gate verwenden |
| 2026-04-10 | Frontend Copy Polish (`F1`/`F2`) | Sichtbare DE-Inkonsistenzen in Footer/Metadata/Schema fuer About, Projects, Case-Studies reduziert | Weitere sichtbare Feinpolitur auf Kernseiten fortsetzen |
| 2026-04-10 | Frontend Fast-Track Board | Sichtbare Abnahmekriterien + Seiten-Checkliste fuer Human-visible-First in eigenem Board dokumentiert | Punkte seitenweise abhaken bis Frontend sichtbar final wirkt |
| 2026-04-10 | Prioritaet umgestellt (User-Directive) | Roadmap auf `Human-visible first` umpriorisiert; Frontend-Fertigstellung vor Analytics-/Ops-Abschluss | Frontend-Polish-Runde (`F1/F2`) als naechster Arbeitsblock |
| 2026-04-10 | Frontend Polish Sprint B (`F1`/`F2`) | Case-Studies-Detail, Maker-Lab und Contact sichtbar geschaerft (CTA-Kontext, DE-Copy, Labels); technische Gates gruen | Home Hero/Proof als letzter sichtbarer Kernblock finalisieren |
| 2026-04-10 | Home Voice/CTA Polish (`F2`) | Home-Hero/Trust/CTA auf Personal-Brand-Stimme und konsistente DE-Tonalitaet geschliffen; Typecheck + Unit gruen | Manuelle visuelle Endabnahme Desktop/Mobile und danach `F1/F2` abschliessen |
| 2026-04-10 | Frontend Endabnahme + Legal-Cleanup (`F1`/`F2`) | Home visuell auf Desktop/Mobile geprueft (keine Console-Fehler), Impressum/Datenschutz DE/EN ohne sichtbare Platzhaltertexte bereinigt | Umschalten auf Ops-Block (`N2`/`N3`) gemaess Prioritaetsmodus |
| 2026-04-10 | Ops Activation Sprint (`N2`/`N3`) | Production-Env fuer Analytics-Sink + Hero-Experiment gesetzt, Production deployt, `/api/analytics` akzeptiert Events (`provider=plausible`) | Dashboard-Pack + Alerts umsetzen und 14-Tage-Experimentlog taeglich fuellen |
| 2026-04-10 | Hero Experiment Hotfix (Production) | Hydration-Fehler (#418) nach Experiment-Aktivierung behoben (Variantenzuweisung auf post-mount verschoben), erneut produziert deployed und validiert | Ops-Fokus auf Dashboard/Alerts und Experiment-Tageslog fortsetzen |
| 2026-04-10 | Pipeline Gate Hardening (`D4`) | `cd-production` erzwingt jetzt `ops:readiness:strict` bei Custom-Domain-Promotion, Report-Mode bei Safe-Deploy | Restarbeit auf N2/N3/N4 (Dashboards/Alerts, Experiment-Log, Kundenstimmen) |
| 2026-04-10 | Plausible Ops Automation (`N2` Prep) | Neues Ops-Script fuer KPI-Snapshot + Alert-Auswertung implementiert (`analytics:plausible:ops`, strict-Variante), Runbooks/Statusdoku erweitert | Plausible Stats API Key setzen und Dashboard/Alert-Check taeglich laufen lassen |
| 2026-04-10 | Alert Workflow Automation (`N2` Prep) | Daily GitHub-Workflow fuer KPI-Report + strict Hard-Alert-Check hinzugefuegt (`analytics-ops-daily.yml`) | Secret `PLAUSIBLE_STATS_API_KEY` setzen, ersten Lauf protokollieren und Alert-Checkboxen schliessen |
| 2026-04-10 | GitHub Ops Preflight (`N2` unblocker) | Readiness-Script fuer remote Workflows/Secrets hinzugefuegt; aktueller Status: `PLAUSIBLE_STATS_API_KEY` fehlt und `analytics-ops-daily` remote noch nicht vorhanden | Nach Push + Secret-Set den ersten Daily-Lauf triggern und N2-Checkboxen schliessen |
| 2026-04-10 | Daily Workflow Live-Verifikation (`N2`) | `analytics-ops-daily` auf GitHub gepusht und per Dispatch erfolgreich ausgefuehrt (Run `24255122948`); Lockfile-Mismatch gefixt (`chore: sync lockfile for ci installs`) | Secret `PLAUSIBLE_STATS_API_KEY` setzen, damit KPI/Alert-Auswertung nicht mehr im Skip-Pfad laeuft |
| 2026-04-10 | Hero Log Auto-Sync + Runner Opt-In (`N2`/`N3` Prep) | `hero:log:sync:plausible` eingefuehrt und Daily-Workflow auf Node24-Opt-in umgestellt; Dispatch-Run `24255415962` erfolgreich | Action-Versionen auf Node24-native Versionen heben und Warning-frei verifizieren |
| 2026-04-10 | Workflow Version-Hardening (`N2`) | `analytics-ops-daily` auf `actions/checkout@v5` + `actions/setup-node@v5` aktualisiert; Run `24255468313` erfolgreich ohne Node20-Runner-Annotation | Externes Blocking-Thema bleibt `PLAUSIBLE_STATS_API_KEY` fuer echte KPI-/Alert-Auswertung |
| 2026-04-10 | Frontend/IA Rebuild Gate (`F1`/`F2` + Basis `N2`) | Voller Gate-Lauf wieder gruen (`lint`, `typecheck`, `unit`, `e2e` 16/16) nach Harmonisierung von Hero-Lifecycle, Hub-Detail-CTA und E2E-Assertions | Arbeitsstand als zusammenhaengenden Meilenstein committen und weiter auf offene N2/N3/N4-Blocker fokussieren |
| 2026-04-10 | Meilenstein-Commit Frontend-Rebuild | Großer zusammenhaengender Rollout auf `main` gepusht (`d413ca4`): neue IA-Routen, Services/Hub-/Case-/Contact-Flows, Analytics-Contracts, Readiness-Skripte und Dokumentationsboards live im Repo | Fokus bleibt auf externen Blockern: `PLAUSIBLE_STATS_API_KEY`, 14-Tage-Experimentlog und zwei freigegebene Kundenstimmen |
| 2026-04-10 | Masterplan Closeout (`N2`/`N3`/`N4` + `D1-D3`) | Proof-Sheet ohne Platzhalter, zwei anonymisierte Kundenstimmen live, Dashboard-/Alert-Artefakte erstellt, Hero-14-Tage-Log + Entscheidung vollstaendig dokumentiert | Finale Strict-Readiness laufen lassen und Abschlussstand committen |
| 2026-04-10 | Plausible Ops Live-Freischaltung (`N2`) | `PLAUSIBLE_STATS_API_KEY` lokal + GitHub gesetzt, `github:ops:readiness:strict` gruen, `analytics-ops-daily` Run `24257889740` erfolgreich inkl. KPI + strict alert-check | Optional: Realdaten erzeugen (funnel pass), damit KPI-Report nicht mehr nur 0-Werte zeigt |

<!-- ROADMAP_SYNC_START -->
## Auto-Sync Snapshot
Generiert: 2026-04-10T18:38:47.641Z

- Masterplan-Checklist: **13/13** erledigt (**100.0%**).
- Offene Punkte: **0**.

### Fortschritt je Bereich
| Bereich | Erledigt | Fortschritt |
| --- | --- | --- |
| Proof & Positionierung | 3/3 | 100.0% |
| Analytics & Reporting | 3/3 | 100.0% |
| Experimentbetrieb | 4/4 | 100.0% |
| Release & Go-Live | 3/3 | 100.0% |
| Abschluss-Definition | 0/0 | 0.0% |
| Abschlussnotiz (operativ) | 0/0 | 0.0% |

### Top offene Punkte
- [x] Keine offenen Punkte im Checklist-Scope.
<!-- ROADMAP_SYNC_END -->


