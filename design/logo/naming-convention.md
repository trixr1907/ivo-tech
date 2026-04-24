# Naming Convention (Logo System v1.0.0)

## Rules
- Brand spelling in content and metadata: `ivo-tech`
- Deterministic production pattern:
  - `ivo-{domain}__{asset}__{variant}__{theme}__v{semver}.{ext}`
- Domain values:
  - `logo` for static vectors/raster aliases
  - `motion` for lottie/json animation payloads
- Asset role values:
  - `mark-detailed`, `mark-core`, `mark-micro`, `wordmark`, `lockup-horizontal`, `lockup-stacked`
- Variant values:
  - `static` for SVG logo files
- Theme values:
  - `dark`, `light`, `mono`

## Canonical System Paths
- `/assets/logo/manifest.json`
- `/assets/logo/ivo-logo__mark-detailed__static__dark__v1.0.0.svg`
- `/assets/logo/ivo-logo__mark-core__static__dark__v1.0.0.svg`
- `/assets/logo/ivo-logo__mark-micro__static__dark__v1.0.0.svg`
- `/assets/logo/ivo-logo__wordmark__static__dark__v1.0.0.svg`
- `/assets/logo/ivo-logo__lockup-horizontal__static__dark__v1.0.0.svg`
- `/assets/logo/ivo-logo__lockup-stacked__static__dark__v1.0.0.svg`

## Legacy Alias Paths (kept stable)
- `/assets/logo.png`
- `/assets/logo.webp`
- `/assets/logo.avif`
- `/assets/logo-mark.png`
- `/assets/logo-mark.webp`
- `/assets/logo-mark.avif`
- `/favicon.ico`

## Design Working Files
- `design/logo/reference/logo-master-chatgpt-2026-02-20-103632.svg`
- `design/logo/source/ref103632/main-lockup.svg`
- `design/logo/source/ref103632/submark.svg`
- `design/logo/source/ref103632/icon.svg`
- `design/logo/source/ref103632/favicon.svg`
- `design/logo/source/ref103632/wordmark.svg`
- `design/logo/routes/ivo-tech-logo-route-a.svg`
- `design/logo/routes/ivo-tech-logo-route-b.svg`

## Motion Naming Examples
- `ivo-motion__logo-reveal__tier2__dark__v1.0.0.lottie`
- `ivo-motion__logo-reveal__tier2__dark__v1.0.0.json`
