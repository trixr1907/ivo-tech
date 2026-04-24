# Migration Report: Hybrid-Relaunch (ivo-tech)

## 1) Uebernommene Sections und Textquellen
- Home-Struktur bleibt Onepager mit: Hero, Proof, Hero-Case, Delivery-Rahmen/Services, Projekte, Insights, Kontakt, FAQ, Footer.
- Text-Truth wurde auf Vercel-Variante ausgerichtet in [copy.ts](/mnt/c/Users/Ivo/Desktop/ivo-tech/src/content/copy.ts):
  - CTA-Wording vereinheitlicht auf `Erstgespraech` (DE) und `Intro call` (EN).
  - Hero/Proof/Method/Services/Contact/Trust/FAQ in DE/EN auf die Vercel-Formulierungen aktualisiert.
- FAQ-Rendering wurde von nativen `details` auf eine zugaenglichere Accordion-Komponente migriert.

## 2) Uebernommene Logo-Assets + Pfade
- Manifest-Quelle: `public/assets/logo/manifest.json` (24 Logo-SVG-Varianten).
- Kernvarianten (u.a.):
  - `/assets/logo/ivo-logo__lockup-horizontal__premium__dark__v1.1.0.svg`
  - `/assets/logo/ivo-logo__lockup-horizontal__premium__light__v1.1.0.svg`
  - `/assets/logo/ivo-logo__mark-core__premium__dark__v1.1.0.svg`
  - `/assets/logo/ivo-logo__mark-core__premium__light__v1.1.0.svg`
  - `/assets/logo/ivo-logo__wordmark__premium__dark__v1.1.0.svg`
  - `/assets/logo/ivo-logo__wordmark__premium__light__v1.1.0.svg`
  - plus static/light/dark/mono Varianten fuer lockup/mark/wordmark/micro/detailed.
- Supporting assets:
  - `/assets/logo.png`, `/assets/logo.avif`, `/assets/logo-mark.png`, `/assets/logo-mark.avif`
  - `/assets/video/logo-sting.mp4`, `/assets/video/logo-sting.webm`, `/assets/video/logo-sting-poster.avif`
  - `/favicon.ico`
- Validierung:
  - Script: `npm run verify:logos` (neu), Datei: `scripts/verify-logo-assets.mjs`

## 3) Neue/aktualisierte Ordnerstruktur
- Brand:
  - `src/components/brand/Logo.tsx`
  - `src/components/brand/logoAssets.ts`
- Motion:
  - `src/components/motion/Reveal.tsx`
  - `src/components/motion/HoverLift.tsx`
  - `src/components/motion/Pressable.tsx`
- UI-Primitives:
  - `src/components/ui/Accordion.tsx`
  - `src/components/ui/FieldControls.tsx` (`Input`, `Textarea`, `Select`, `RadioGroup`)
  - `src/components/ui/InlineFeedback.tsx`
  - `src/components/ui/Toast.tsx`
  - `src/components/ui/Skeleton.tsx`
  - `src/components/ui/Badge.tsx`
  - `src/components/ui/LinkButton.tsx`
- Routing:
  - Brand routes reaktiviert: `/brand`, `/en/brand`
- Utility:
  - `src/lib/cn.ts`

## 4) Annahmen (max. 5)
- Vercel-Seite ist die verbindliche Copy-Quelle fuer Home- und CTA-Texte.
- Bestehende visuelle Sprache des aktuellen Codes bildet das gewuenschte UI-Polish bereits gut ab und wird daher inkrementell erweitert.
- Premium-Logo-Dateien koennen unvollstaendig sein; daher faellt die neue Logo-API deterministisch auf statische Varianten zurueck.
- Onepager-Navigation bleibt Primärmodell; Zusatzrouten (`/services`, `/projects`, `/contact`) werden per Redirect auf Anchors gefuehrt.
- Es werden keine zusaetzlichen schweren UI-Libraries eingefuehrt; neue Primitives bleiben im bestehenden React/CSS/Framer-Motion Stack.
