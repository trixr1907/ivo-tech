# Hybrid-Relaunch: UI von ivo-tech.com + Copy/Branding von Vercel

## Ziel
- UI-Polish und visuelle Sprache entlang der bestehenden `ivo-tech.com`-Basis.
- Copy-/CTA-Truth und Branding-Assets aus der Vercel-Referenz.
- Wartbares, tokenbasiertes Design-System mit fehlenden Primitives und klaren QA-Gates.

## Was umgesetzt wurde

### 1) Audit + Migrations-Map
- Source-vs-Target-Diff und deterministische Migrationsbasis dokumentiert.
- Home-Section-Mapping, DE/EN-Mechanik und Brand-Asset-Inventar erfasst.

### 2) Design-Tokens harmonisiert
- Semantische Tokens und Motion-/Focus-Grundlagen vereinheitlicht.
- Token-First-Basis für konsistente Oberflächen, Fokus und Timing.

### 3) UI-Library erweitert
- Neue Design-System-Primitives ergänzt (u. a. Accordion, Form-Controls, InlineFeedback, Toast, Skeleton).
- Motion-Primitives ergänzt (`Reveal`, `HoverLift`, `Pressable`).
- Neue `Logo`-API plus deterministische Fallback-Strategie für fehlende Premium-Varianten.

### 4) Content/Pages Migration
- Home-Copy auf Vercel-Truth (DE/EN) angehoben.
- CTA-Wording konsolidiert: `Erstgespräch` / `Intro call`.
- Brand-Routen (`/brand`, `/en/brand`) reaktiviert.
- Redirect-Polish für Section-Einstiege.

### 5) Refactor/Cleanup
- Globale Styles auf Layer-/Modulsystem konsolidiert.
- Locale-/A11y-Pfade stabilisiert (`html lang`, Skip-Link, verbesserte Toggle-ARIA).
- EN-Hub-Content ergänzt und Routing-Pfade bereinigt.
- Logo-Manifest + produktive Logo-Asset-Familie (`public/assets/logo/*`) integriert.

### 6) QA + Reporting
- Migration Report ergänzt: `docs/migration-report.md`.
- Ausführbare QA-Checklist ergänzt: `docs/test-checklist.md`.
- Logo-Asset-Verifikation via Script ergänzt: `scripts/verify-logo-assets.mjs`.

## Commits (in Reihenfolge)
1. `fca39b7` chore(audit): capture source-vs-target diff and migration map
2. `217cc59` feat(tokens): harmonize semantic tokens and motion/focus foundations
3. `7ec4924` feat(ui): add missing design-system primitives and logo api
4. `b868e86` feat(content-pages): migrate vercel copy + branding and route polish
5. `e379fa9` refactor(structure): consolidate folders, remove dead code, normalize naming
6. `1d61620` test(qa): add/adjust tests, run full checks, add migration report
7. `2e3bd69` docs(qa): add executable test checklist and lighthouse status

## Verifikation
- `npm run lint` ✅
- `node scripts/check-i18n-consistency.mjs` ✅
- `npm run typecheck` ✅
- `npm run test:unit` (57/57) ✅
- `npm run test:e2e` (16/16) ✅
- `npm run build` ✅
- `node scripts/verify-logo-assets.mjs` ✅

## Bekannter Punkt
- Lighthouse Quick Pass ist in der aktuellen CLI-Umgebung blockiert (`Unable to connect to Chrome`), dokumentiert in `docs/test-checklist.md`.
