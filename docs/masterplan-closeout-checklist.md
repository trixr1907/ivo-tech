# Masterplan Closeout Checklist

Stand: 2026-04-10  
Zweck: letzte operative Schritte bis zum formalen Masterplan-Abschluss nachvollziehbar abhaken.

## 1) Proof & Positionierung

- [ ] Zwei freigegebene Kundenstimmen mit Rolle + Unternehmenskontext live.
- [x] Mindestens zwei externe Proof-Links live und in Trust-Section verknuepft.
- [ ] `docs/proof-asset-collection.md` vollstaendig ausgefuellt (keine Platzhalter mehr).

## 2) Analytics & Reporting

- [x] Analytics sink (PostHog oder Plausible) produktiv aktiv.
- [ ] Dashboard-Pack aus `docs/analytics-activation-runbook.md` vollstaendig erstellt.
- [ ] Alerts aktiv:
  - [ ] Submit Success Drop >30% WoW
  - [ ] Service Detail CTA Drop >20% WoW bei steigendem Traffic
  - [ ] `source=unknown` >25%

## 3) Experimentbetrieb

- [x] Hero-Experiment aktiviert (`NEXT_PUBLIC_HERO_EXPERIMENT_ENABLED=true`).
- [x] Gewichtung gesetzt (`NEXT_PUBLIC_HERO_EXPERIMENT_WEIGHTS`, initial z. B. `50,25,25`).
- [ ] 14-Tage-Log in `docs/hero-experiment-log.md` ausgefuellt.
- [ ] Keep/Revert/Iterate-Entscheidung datenbasiert dokumentiert.

## 4) Release & Go-Live

- [x] Voller lokaler Gate-Lauf erfolgreich:
  - [x] `npm run verify:homepage:full`
  - [x] `npm run verify:live:full`
- [x] Release-Kandidat dokumentiert (`docs/release-candidate-2026-04-10.md`).
- [x] Production-Promotion entschieden und protokolliert.

## 5) Abschluss-Definition

Masterplan gilt als abgeschlossen, wenn:

1. alle Checkboxen in Kapitel 1-4 erledigt sind,
2. mindestens ein Experiment-Review dokumentiert wurde,
3. ein Produktions-Release mit gruenen Gates geloggt ist.
