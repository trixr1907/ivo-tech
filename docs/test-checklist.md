# QA Checklist (Hybrid-Relaunch)

Stand: 2026-02-28

## 1) Responsive Checks
- [x] Desktop (E2E + Build): `tests/e2e/home.spec.ts`
- [x] Mobile (CTA sticky visibility): `tests/e2e/home.spec.ts` (`shows sticky primary CTA on mobile viewport only`)
- [x] Tablet: Komponenten und Layout laufen über responsive Grid/Clamp ohne Build- oder Runtime-Fehler; kein separater visuell dokumentierter Tablet-Snapshot in diesem Lauf.

## 2) Dark/Light
- [x] Dark-Theme aktiv auf Runtime (`data-theme=\"dark\"`) und visuell geprüft.
- [x] Light-Asset-Varianten im Logo-System vorhanden (`public/assets/logo/*__light__*.svg`).
- [ ] Vollständiger Light-Theme-UI-Snapshot-Lauf (nicht Teil der aktuellen Runtime-Konfiguration).

## 3) Formular Success/Error
- [x] Success-Pfad E2E: `submits contact form successfully on homepage`
- [x] Error/Validation-Pfad Unit: `src/components/ContactForm.test.tsx`
- [x] Feedback-ARIA (`role=status`, `aria-live`) über Tests abgedeckt.

## 4) Asset 404 Check
- [x] Manifest + Support-Assets validiert mit `node scripts/verify-logo-assets.mjs`
- [x] Ergebnis: `Verified 24 manifest logo assets + 8 supporting assets.`

## 5) Routing/Branding-Checks
- [x] `/brand` und `/en/brand` erreichbar (E2E).
- [x] Redirect/Locale-Flows und Hash-Erhalt DE/EN in E2E validiert.

## 6) Lighthouse Quick Pass
- [ ] Automatisierter Lauf in dieser Umgebung blockiert.
- Blocker: `Unable to connect to Chrome` (Lighthouse CLI), trotz lokal startbarem Headless-Chrome.
- Reproduzierbar mit:
  - `npx -y lighthouse http://127.0.0.1:3000/ --quiet --output=json --output-path=output/lighthouse/home-de-mobile.json`

## 7) Gesamtstatus der Pipeline
- [x] `npm run lint`
- [x] `node scripts/check-i18n-consistency.mjs`
- [x] `npm run typecheck`
- [x] `npm run test:unit` (57/57)
- [x] `npm run test:e2e` (16/16)
- [x] `npm run build`
