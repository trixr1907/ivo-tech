# Changelog

## 2026-02-18

### Changed
- Hero-Case `configurator_3d` als Tech-first Referenz in DE/EN aktualisiert (Homepage, Modal, `/configurator`).
- 3D-Showcase im Demo-Viewer von Cube auf gebrandetes Hybrid-Objekt mit IVO-Logo umgestellt.
- Subtile Rollenabgrenzung ergaenzt: technische Umsetzung durch IVO TECH, Betrieb und Vermarktung beim Kunden.

### Quality checks
- `npm run typecheck`, `npm run test:unit`, `npm run lint` sowie Playwright-Smoke auf frischem Production-Build erfolgreich.

### Release references
- PR `#18`: authority-first modernisierung + hero-case 3d refresh

## 2026-02-17

### Added
- MDX content pipeline with frontmatter validation for `insights`, `playbooks`, and `case-studies`.
- New DE-first content hubs and detail routes in App Router.
- New dynamic sitemap route with alternates (`de`, `en`, `x-default`) and content-aware `lastmod`.

### Changed
- Full migration from legacy Pages Router routes to App Router for main product surfaces.
- Contact API moved to `app/api/contact/route.ts` while keeping payload contract and endpoint path stable.
- Language routing standardized to path-segment model (`/` for DE, `/en` for EN) without runtime i18n dependency.

### Fixed
- EN routes now return hard `404` when translation content is missing (no implicit DE fallback).
- Pizza demo routing moved to App Router redirect while preserving `noindex` behavior.

### Release references
- PR `#15`: content foundation
- PR `#16`: app router core migration
- PR `#17`: platform cutover and cleanup
