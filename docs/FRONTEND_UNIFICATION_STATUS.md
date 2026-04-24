# Frontend-Vereinheitlichung ivo-tech — Fortschritt

Stand: 2026-04-12 (Hauptplan **abgeschlossen**; danach Qualitäts- und CI-Nachzieher, siehe unten).

## Gesamt

| Bereich | Status | Kurzbeschreibung |
|--------|--------|------------------|
| **Startseite Relaunch** | **100 %** | Copy, Hero-Snapshot, optionales **Ambient-WebM** (`/assets/motion/energy-trail-loop.webm`) im Snapshot-Panel bei `prefers-reduced-motion: no preference`, Modal + `?project=`, Motion, BackgroundFX |
| **Unterseiten (Shell)** | **100 %** | `RelaunchMarketingShell`, `RelaunchStickyHeader`, `RELAUNCH_SECTION` / `RELAUNCH_CARD` (+ leicht stärkerer **Card-Hover**-Schatten) |
| **Brand** | **erweitert** | Handoff-SVGs unter `/assets/logo/handoff/` + Sektion auf `/brand`; Motion-Clip mit Energy-Loop (mit Steuerung) |
| **Legacy** | **entfernt** | **`HomePageRedesign.tsx`** gelöscht; **`.home-redesign-shell`**-CSS (inkl. `main`-Hacks) aus `pages.css` entfernt |
| **Research / Audit** | **angelegt** | [`docs/research-external-refs.md`](research-external-refs.md), [`docs/website-human-audit-checklist.md`](website-human-audit-checklist.md) |
| **E2E Site-Audit** | **neu** | [`tests/e2e/site-audit.spec.ts`](../tests/e2e/site-audit.spec.ts) — `npm run test:e2e:audit`; Gesamt `npm run verify:site` |

## Technische Anker

| Thema | Ort |
|--------|-----|
| Shell | `src/components/layout/RelaunchMarketingShell.tsx`, `RelaunchStickyHeader.tsx` |
| Section/Card | `src/lib/relaunchMarketingStyles.ts` |
| Relaunch-Chrome + Brand-Hero | `src/styles/home-relaunch-shell.css` |
| Startseite | `src/components/home/HomePageRelaunch2026.tsx` |

## Tests

- `npm run build`
- `npm run verify:site` — Build + Unit + Site-Audit + Analytics strict
- `npm run verify:homepage:full` — vollständiger PR/Release-Gate (Lint, i18n, Typecheck, Analytics, Unit, **alle** E2E inkl. `home.spec.ts`)
- `npx playwright test tests/e2e/home.spec.ts` / `npm run test:e2e:audit` — gezielt

## Nach Plan-Abschluss erledigt (gleicher Tag / Folgesession)

| Thema | Kurz |
|--------|------|
| Legacy | **`HomePageRuntime.tsx`** entfernt; **`homepage_scroll_depth`** in **`HomeScrollProgress`** (Relaunch) |
| Analytics | `hero_variant_view`, Hero-CTA-Events, Rail/Insights/Trust-Tracking; Verify-Skript berücksichtigt `eventAliasMap` |
| Lint / React 19 | Ungenutzter `HomeMobileNav`-Import; `setHeroVariant` per `startTransition` im Effect |
| Doku / README | `verify:site` in README + `quality-gates.md`; menschliche Checkliste mit Test-Mapping + `/en` Page-Error im Site-Audit |
| Tooling | ESLint + `tsc` für `playwright.config.ts` und `tests/e2e/**`; Playwright in **CI**: Projekt **site-audit** vor **chromium** (Fail-Fast), lokal unverändert ein Projekt |

## Lokale Previews

- Homepage: `npx playwright screenshot http://localhost:3000/ homepage-preview.png --viewport-size=1440,900 --wait-for-timeout=2000`
- Brand: `npx playwright screenshot http://localhost:3000/brand brand-preview.png --viewport-size=1440,900 --wait-for-timeout=2000`

## Optional später

- Storybook / `SiteHeader` an Relaunch-Tokens
- Weitere Zeilen in `docs/research-external-refs.md` zu externen URL-Gruppen
- ~~E2E: interne Link-Stichprobe von `/en`~~ erledigt (`site-audit.spec.ts`)
- **Mensch:** [`website-human-audit-checklist.md`](website-human-audit-checklist.md) ausfüllen und freigeben

> Hinweis: [`sprint-1-homepage-cro-implementation-board.md`](sprint-1-homepage-cro-implementation-board.md) ist historisch; mehrere Punkte (Legal-Routen, Thank-you, Relaunch) sind inzwischen umgesetzt — für den aktuellen Stand diese Datei hier und `verify:homepage:full` maßgeblich nehmen.
