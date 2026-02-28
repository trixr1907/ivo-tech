# Audit: Source vs Target Mapping

## Zielbild
- Visuelle Basis: `ivo-tech.com` (Spacing, Depth, Motion-Stil, Typo-Polish)
- Content-/Branding-Truth: Vercel-Referenz (`ivo-tech-trixr-4882-ivos-projects-77f7d33c.vercel.app`)

## Verifizierte Source-Sections
- Hero
- Proof bar
- Hero-Case
- Delivery-Rahmen / Services
- Projekte
- Insights
- Kontakt
- FAQ
- Footer
- DE/EN Switch
- Primäre CTA: `Erstgespraech` / `Intro call`

## Branding-Asset-Inventar
- Manifest: `/assets/logo/manifest.json`
- 24 Logo-SVG-Varianten (lockup/wordmark/mark, static + premium)
- Supporting Assets: `logo.png`, `logo.avif`, `logo-mark.png`, `logo-mark.avif`, `favicon.ico`, `logo-sting.{mp4,webm}`, `logo-sting-poster.avif`

## Target-Code Mapping
- Home composition: `src/app-pages/HomePageClient.tsx`
- Copy source: `src/content/copy.ts`
- Tokens: `src/styles/tokens.css`, `design-tokens.json`, `tokens/brand.tokens.json`
- Header/Footer/Brand: `src/components/layout/*`, `src/components/BrandLockup.tsx`

## Gap-Analyse (vor Umsetzung)
- CTA-Wording und Microcopy nicht vollstaendig auf Vercel-Truth ausgerichtet.
- Fehlende generische UI-Primitives fuer konsistente Wiederverwendung.
- Kein zentraler `Logo`-Resolver mit dokumentiertem Fallback-Verhalten.
- FAQ mit nativen `details` statt konsistenter Accordion-Interaktion.
