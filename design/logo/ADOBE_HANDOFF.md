# ivo-tech Adobe CC Handoff (Deep-Tech Blue System)

## 1) Zielbild
- Brand: `ivo-tech`
- Positioning: High-end tech / AI, minimal, praezise, skalierbar
- Master source (approved): `design/logo/reference/logo-master-chatgpt-2026-02-20-103632.svg`
- Rollenmodell:
  - `mark-detailed`: Hero / Campaign Visual
  - `mark-core`: Header, Cards, Primary Brand Touchpoints
  - `mark-micro`: 16-32 px, favicon, dichte UI-Flaechen
  - `wordmark`, `lockup-horizontal`, `lockup-stacked`

## 2) Source of Truth
- Runtime logo manifest: `public/assets/logo/manifest.json`
- Design manifest: `design/logo/asset-manifest.json`
- Design token source: `design-tokens.json`
- Token mirror: `tokens/brand.tokens.json`
- Naming rules: `design/logo/naming-convention.md`
- Usage rules: `design/logo/usage-rules.md`

## 3) Illustrator Dokumentstruktur (verbindlich)
1. `00_GUIDES`
2. `01_LOGO_MASTER`
3. `02_LOGO_RESPONSIVE`
4. `03_ICON_SYSTEM_24`
5. `04_3D_BASE_SHAPES`
6. `05_3D_LIGHT_PASS`
7. `06_MOTION_KEYFRAMES`
8. `07_EXPORT_SLICES`

## 4) Logo Produktionsregeln
1. Master als saubere Vektorpfade, keine unnötigen Ankerpunkte.
2. Varianten:
   - `logo-horizontal`
   - `logo-stacked`
   - `logo-mark-only`
   - `logo-mono-light`
   - `logo-mono-dark`
3. Clearspace: `0.5x` Symbolhoehe.
4. Mindestgroessen:
   - horizontal: `120px`
   - mark-only: `24px`
   - favicon master: `32 / 48 / 64`

## 5) Icon-System Produktionsregeln
1. Grid: `24x24`, aktive Flaeche `20x20`.
2. Stroke: `1.75px`, cap/join `round`.
3. Interner Corner Radius: `2px`.
4. Varianten:
   - `outline` (Default fuer UI)
   - `duotone` (nur Hero/Marketing)
5. Naming: `ic_[name]_[size]_[style]`

## 6) 3D- und Motion-Guidelines
1. 3D Forms: weich-geometrisch, kein organischer Noise.
2. Material:
   - roughness `0.22-0.35`
   - metallic `0.08-0.15`
3. Licht:
   - key light: kalt oben links
   - fill light: neutral rechts
4. Motion:
   - easing: `cubic-bezier(0.22, 1, 0.36, 1)`
   - UI hover: `160-200ms`
   - section reveal: `500-700ms`
   - hero entry: `800-1000ms`
   - keine Endlosschleifen in Core-UI

## 7) Naming + Export Workflow
1. Naming:
   - Logos: `logo_[variant]_[theme]_[size]`
   - 3D: `3d_[module]_[angle]_[light]`
   - Motion: `motion_[section]_[trigger]_[duration]`
2. Export:
   - SVG 1.1: minified, responsive, IDs bereinigt
   - PNG: `@1x @2x @3x`, transparent
   - WebP: quality `82-88` (3D Raster Assets)
   - Lottie: `<90KB` pro UI-Animation
3. Web pipeline:
   - `node scripts/build-logo-system.mjs`
   - `node scripts/optimize-images.mjs`
   - `node scripts/verify-logo-assets.mjs`

## 8) Motion Contract (frontend)
- API in `src/lib/logoMotion.ts`:
  - `playLogoReveal(target, tier, theme)`
  - `attachLogoHover(target, options)`
  - `setLogoMotionMode('full' | 'reduced' | 'off')`
- Durations:
  - 180ms micro
  - 220ms base
  - 560ms expressive
  - 680ms reveal
- Easing:
  - `cubic-bezier(0.22, 1, 0.36, 1)`
  - `cubic-bezier(0.4, 0, 0.2, 1)`

## 9) Quality Gates
- Visual:
  - readability on 16/24/32 and 48/64/96/128 px
  - dark/light contrast checks
  - no noisy bloom on header-scale marks
- Performance:
  - LCP <= 2.5s
  - CLS < 0.03
  - hero/logo budget <= 180KB gzip
  - lottie budget <= 60KB header, <= 120KB hero
- Automated guardrails:
  - `scripts/verify-logo-assets.mjs`
  - `tests/e2e/home.spec.ts`

## 10) QA Surfaces
- Public DE: `/brand`
- Public EN: `/en/brand`
