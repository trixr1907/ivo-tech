# Ops Control Center

Stand: 2026-04-10  
Owner: ivo-tech

Diese Datei ist die zentrale Steuerung fuer Betrieb, Release und Incident-Handling.

## 1) Single Source of Truth
- Strategischer Live-Status: `docs/roadmap-live.md`
- Masterplan-Abschlussstatus: `docs/masterplan-closeout-checklist.md`
- Release-Entscheidungen: `docs/release.md`
- Deployment-Prozess: `docs/deploy.md`

## 2) Daily Operations (Morning + Evening)
Morning check:
```bash
npm run roadmap:sync
npm run masterplan:progress
npm run ops:readiness:strict
npm run verify:live
```

Evening check:
```bash
npm run analytics:plausible:ops
npm run hero:log:sync:plausible -- --day=YYYY-MM-DD
npm run hero:log:readiness:strict
```

Expected result:
- Keine offenen Punkte in `masterplan:progress`.
- `ops:readiness:strict` gruener Lauf.
- Live-Domain-Check ohne TLS/Redirect/CSP-Fehler.

## 3) Release Operations
Pre-release local gate:
```bash
npm run verify:homepage:full
npm run verify:live:full
npm run ops:readiness:strict
```

Pre-release GitHub preflight:
```bash
npm run github:ops:readiness:strict
```

Promotion rule:
- `cd-production` mit `promote_to_custom_domains=false` fuer Safe-Deploys.
- Erst bei vollem Gruenstand `promote_to_custom_domains=true`.

## 4) Analytics + Experiment Operations
Core checks:
```bash
npm run analytics:readiness:strict
npm run analytics:live:readiness:strict
npm run analytics:plausible:ops:strict
npm run hero:log:readiness:strict
```

Operational artifacts:
- `docs/analytics-live-status.md`
- `docs/analytics-kpi-board.md`
- `docs/analytics-dashboards/`
- `docs/hero-experiment-log.md`
- `.github/workflows/analytics-ops-daily.yml`

## 5) Incident Quick Paths
### A) Live site issue
```bash
npm run verify:live
npm run budget:live
```
Dann CSP/headers/domain setup in `docs/deploy.md` und `docs/security-hardening.md` pruefen.

### B) Quality gate regression
```bash
npm run lint
npm run lint:i18n
npm run typecheck
npm run test:unit
npm run test:e2e
```
Dann `docs/quality-gates.md` und betroffene Workflows pruefen.

### C) Ops/analytics regression
```bash
npm run ops:readiness
npm run analytics:plausible:ops
npm run github:ops:readiness
```
Dann `docs/analytics-live-status.md` aktualisieren und Daily-Workflow-Run neu starten.

## 6) Governance + Hygiene
- Branching/Rollen: `docs/branching.md`
- Aenderungshistorie: `docs/changelog.md`
- Release-Freigaben: `docs/release-candidate-2026-04-10.md`
- Rollback: `docs/rollback.md`

## 7) Definition of Clean State
Ein Stand ist "clean", wenn:
1. `git status` leer ist.
2. `roadmap-live.md` synchronisiert ist.
3. `masterplan:progress` keine offenen Punkte meldet.
4. `ops:readiness:strict` gruen ist.
5. Letzter Release-/Ops-Run in den Doku-Artefakten protokolliert ist.
