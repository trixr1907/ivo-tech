# Masterplan 2026 (Lebender Plan)

Stand: 2026-04-10  
Owner: ivo-tech  
Track: Hard Relaunch (`Precision Dark 2.0`, Portfolio/Hiring-first)

## Zweck
Diese Datei ist die zentrale Arbeitsgrundlage fuer den Relaunch-Track 2026.  
Sie beschreibt Zielbild, aktive Arbeitsbloecke, Prioritaeten, Nachweise und den naechsten Umsetzungsschritt.

## Strategische Leitentscheidung
1. Hard Relaunch statt inkrementeller Mikrofixes.
2. Positionierung: `Portfolio/Hobby/Ueber mich + Hiring` vor klassischem Sales-Funnel.
3. Funnel-Prioritaet:
   1. Hiring Manager/Recruiter
   2. Projektkollaboration
   3. B2B-Client-Work (sekundaer)

## Zielbild
`ivo-tech.com` wirkt als klare Personal Product Engineering Brand:
- evidenzbasiert statt claim-heavy
- reduzierte Premium-Aesthetik statt Effekt-Overload
- nachvollziehbare Delivery-Artefakte statt generischer Marketing-Sprache

## Statusboard (Masterplan 2026)
| Block | Ziel | Status | Nachweis |
| --- | --- | --- | --- |
| B1 | Home-Reframe auf Hiring/Portfolio-first | Erledigt | `src/components/home/HomePageRelaunch2026.tsx` |
| B2 | `Hiring` + `Resume` Seiten DE/EN | Erledigt | `src/app/hiring`, `src/app/resume`, `src/app/en/*` |
| B3 | Locale-Routing-Bug fix | Erledigt | `src/lib/routeLocalization.ts`, `src/components/LanguageToggle.tsx` |
| B4 | Kontaktformular intent-adaptiv | Erledigt | `src/components/home/ContactLeadForm.tsx` |
| B5 | Sitemap auf neue Kernseiten erweitert | Erledigt | `src/app/sitemap.xml/route.ts` |
| B6 | Tests auf Relaunch-Verhalten synchronisiert | Erledigt | `tests/e2e/home.spec.ts` |
| B7 | Welle 2: About/Case/Trust-Ledger Vertiefung | Offen | siehe Abschnitt "Naechster Umsetzungsblock" |

## Prioritaetsmodus (aktiv)
1. Human-visible first: Hero, Seitenstruktur, Copy, Trust, mobile Klarheit.
2. Dann technische Ops: Analytics/Alerts/Experimentbetrieb.
3. Done fuer Frontend: keine Platzhalter, klare CTA-Hierarchie, konsistente DE/EN Nutzerpfade.

## Naechster Umsetzungsblock (Welle 2)
1. About-Reframe auf Senior-Positionierung (klarer Rollenfit fuer Hiring).
2. Case-Study-Template vertiefen: Kontext -> Entscheidung -> Ergebnis -> Belege.
3. Trust-Ledger als eigenstaendige Komponente (nur verifizierbare Artefakte prominent).
4. CTA-Feinschliff je Intent (`Hiring`, `Kollaboration`, `Client`).

## Governance (lebender Betrieb)
1. Woechentlich: KPI/Conversion/Qualitaets-Review + naechste Hypothese.
2. Zweiwoechentlich: Design/Copy-Iteration auf den wichtigsten Seiten.
3. Monatlich: Tech-Debt-, Performance- und A11y-Review.
4. Quartalsweise: IA-Review auf Basis realer Zielgruppen-Signale.

## Referenzen
- Operative Roadmap: `docs/roadmap-live.md`
- Daily Ops / Release / Incident: `docs/ops-control-center.md`
- Frontend Fast Track: `docs/frontend-fast-track-checklist.md`
- Hero-Experiment-Log: `docs/hero-experiment-log.md`
