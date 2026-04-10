# Changelog

## 2026-04-10

### Added
- Analytics activation runbook at `docs/analytics-activation-runbook.md` with:
  - mandatory dashboard pack,
  - alert definitions,
  - weekly operating cadence,
  - completion criteria for masterplan close.
- Proof asset collection sheet at `docs/proof-asset-collection.md` as operational template for external testimonials and verification links.
- Structured trust evidence source file `src/content/trustEvidence.ts` for homepage proof modules.
- Hero experiment utilities and tests:
  - `src/lib/heroExperiment.ts`
  - `src/lib/heroExperiment.test.ts`
- Hero experiment decision log template at `docs/hero-experiment-log.md`.
- Masterplan closeout checklist at `docs/masterplan-closeout-checklist.md`.
- Release candidate verification note at `docs/release-candidate-2026-04-10.md`.
- Masterplan progress script at `scripts/masterplan-progress.mjs` with npm command `masterplan:progress`.

### Changed
- Next.js config now sets `allowedDevOrigins` (including `localhost`/`127.0.0.1` defaults plus `NEXT_ALLOWED_DEV_ORIGINS`) to suppress cross-origin dev warnings on local preview checks.
- Environment docs now include `NEXT_PUBLIC_SCHEDULER_URL` and `NEXT_ALLOWED_DEV_ORIGINS`:
  - `.env.example`
  - `README.md`
  - `docs/deploy.md`
- Homepage trust block now renders curated trust evidence links (external and internal) and tracks interactions via `authority_asset_view`.
- Analytics event map now documents `authority_asset_view` for both hub assets and homepage trust evidence interactions.
- Homepage hero variant handling now supports optional persistent assignment (when `NEXT_PUBLIC_HERO_EXPERIMENT_ENABLED=true`) with weighted distribution via `NEXT_PUBLIC_HERO_EXPERIMENT_WEIGHTS`.
- Contact lead form now accepts homepage-resolved hero variant as default fallback (for consistent funnel attribution even without explicit query param).
- Environment and deploy docs now include hero experiment toggles.
- Release runbook now includes a 2026-04-10 candidate verification entry with passed full-gate evidence.

## 2026-04-09

### Added
- Sprint 1 implementation board at `docs/sprint-1-homepage-cro-implementation-board.md`.
- Masterplan execution backlog at `docs/masterplan-execution-backlog-2026-04-09.md`.
- Dedicated thank-you routes for contact flow:
  - `src/app/thanks/page.tsx`
  - `src/app/en/thanks/page.tsx`
- Services landing pages:
  - `src/app/leistungen/page.tsx`
  - `src/app/en/services/page.tsx`
- Legal/compliance pages:
  - `src/app/impressum/page.tsx`
  - `src/app/datenschutz/page.tsx`
  - `src/app/en/legal/page.tsx`
  - `src/app/en/privacy/page.tsx`
- Thank-you analytics tracker component at `src/components/thank-you/ThankYouTracker.tsx`.

### Changed
- Homepage CTA copy/intent framing updated in `src/components/home/HomePageRedesign.tsx`.
- Hero and mobile-nav CTA clicks now tracked for funnel analytics.
- Contact lead form now redirects to locale-specific thank-you page on successful submission.
- Contact lead attribution source is now propagated from URL params into analytics payloads and thank-you routing.
- Services page contact CTAs now route with explicit source tagging (`?source=services`).
- Case-study detail pages now include an outcome snapshot KPI block for strategic flagship entries.
- Sitemap static route groups now include legal/privacy URLs.
- Sitemap static route groups now include DE/EN services URLs.
- Homepage DE/EN JSON-LD service descriptors aligned to outcome-focused positioning.
- E2E coverage expanded for services routes, case-study KPI snapshot rendering, and legal route reachability.
- E2E coverage now also asserts hub CTA tracking markers on index/detail pages.
- Global top navigation on services and hub pages now uses one unified IA (Home, Services, Case studies, Insights, Playbooks, Contact).
- Services pages now track `service_page_view` and `service_cta_click` events for funnel visibility.
- Services pages now include productized offer packages (`Build`, `Stabilize`, `Accelerate`) with dedicated source-tagged CTA paths.
- Contact form now includes a scheduler secondary CTA with source-aware tracking (`scheduler_cta_click`) and UTM-tagged external booking links.
- Homepage hero CTA model is now standardized to 3 tiers (`Scope-Call` primary, `Case` secondary, `Playbook` tertiary) with dedicated source tags.
- Homepage now includes a new early proof strip (KPI + testimonial + segment context) directly below the hero.
- Hub index and detail pages now track `hub_page_view` and `hub_cta_click` events with placement metadata.
- Case-study blueprint content and KPI snapshots are now managed via centralized content maps (`src/content/caseStudies.ts`).
- Legacy redirect conflict was removed so `/en/services` resolves to the dedicated services page instead of the homepage anchor.
- Thank-you pages now personalize the primary next-step CTA based on the original `source` attribution.
- Thank-you views now track CTA clicks via `thank_you_cta_click` (`primary`, `secondary`, `email` placements).
- Thank-you pages now include a scheduler CTA (`data-thanks-cta=\"scheduler\"`) with source-aware booking links.
- Services hero CTA model now mirrors homepage tiers with source-attributed links to contact, case studies, and playbooks.
- New DE/EN service detail cluster is live:
  - `/leistungen/web-engineering-delivery`
  - `/leistungen/ai-automation-workflows`
  - `/leistungen/3d-visualization-systems`
  - `/en/services/web-engineering-delivery`
  - `/en/services/ai-automation-workflows`
  - `/en/services/3d-visualization-systems`
- Service detail pages now ship with FAQ sections, internal deep-link paths (case/insight/playbook), and structured `Service` + `FAQPage` schema.
- Sitemap now includes all service detail routes with hreflang alternates.
- Analytics now tracks `service_detail_view` and `service_detail_cta_click`.
- Attribution normalization and thank-you CTA routing now use shared helper logic in `src/lib/attribution.ts`.
- Added analytics event reference at `docs/analytics-event-map.md`.
- Added KPI dashboard mapping at `docs/analytics-kpi-board.md` (`Event -> KPI -> Zielwert`).
- CSP report ingestion now classifies low-signal noise (`next_runtime_inline`, `browser_extension`) with stronger throttling to reduce log noise.
- CSP report ingestion now also suppresses local QA noise via `local_development` classification (`localhost` / `127.0.0.1`).
- Added premium service-detail modules:
  - `Outcome Comparator`
  - `Risk Matrix`
  - `Architecture Snapshot`
  via `src/components/services/ServicePremiumBlocks.tsx` and integrated into all DE/EN service detail pages.
- Homepage now supports hero experiment variants via `?exp_hero=outcome|speed`, with analytics exposure event `hero_variant_view`.
- Homepage trust section now includes case KPI snapshots sourced from `CASE_STUDY_KPIS` with direct links to full case studies.
- Contact funnel tracking now captures `contact_form_start` on first field interaction and propagates `heroVariant` across contact/scheduler events.
- Thank-you flow now preserves `exp_hero` in redirect + scheduler links and includes `heroVariant` in thank-you analytics events.
- Added analytics map verifier script `scripts/verify-analytics-event-map.mjs` + npm command `analytics:verify:map` to detect documented events without emitters.
- Analytics event map cleaned up by removing stale `cta_service_secondary_click` entry (no active emitter).
- Analytics event map expanded to include proof/engagement and platform/legacy events (`authority_asset_view`, `insight_read_75`, `case_study_open`, `hero_video_play`, `homepage_scroll_depth`, `web_vital_recorded`, etc.).
- Added strict analytics verification command `analytics:verify:map:strict` (fails when emitted events are undocumented).
- `verify:homepage:full` now includes `analytics:verify:map:strict` to enforce tracking-doc consistency in the default release gate.
- Analytics verifier now cross-checks three sources: docs map, emitted `trackEvent(...)` calls, and `AnalyticsEventName` type literals.
- Removed stale legacy-only analytics type literals (`proof_expand`, `proof_asset_open`, `audit_cta_click`, `cta_contact_secondary_click`, `cta_service_secondary_click`, `cv_download`) from `AnalyticsEventName`.
- CI and production deployment workflows now run `analytics:verify:map:strict` as part of quality gate enforcement.
- Hero secondary CTA links (`case`/`playbook`) now preserve `exp_hero` when a non-default variant is active, keeping variant attribution across exploratory paths.
- Legacy `ContactForm` now tracks `contact_form_start` on first focus interaction (not only on value change) and includes `intent` in start payloads.
- Playwright config now normalizes color env flags (`NO_COLOR`/`FORCE_COLOR`) to remove noisy Node warnings in E2E runs.

## 2026-02-24

### Added
- Machine-readable brand contract at `docs/brand-board-contract.json`.
- CDD operating playbook for homepage workflow at `docs/cdd-homepage-playbook.md`.
- Contract validation script `scripts/brand-board-contract-check.mjs` with token, selector, segment, and asset checks.
- Visual Playwright regression suite `tests/e2e/brand-visual.spec.ts` for homepage, brand showcase, and internal brand review.
- User-provided master reference images under `public/assets/brand-reference/` as local review inputs for the logo refresh workflow.

### Changed
- `package.json` scripts:
  - `verify:homepage:full` remains the functional release gate.
- CI validates functional quality gates (lint, typecheck, build, tests) without automated visual baseline enforcement.
- Quality and release runbooks aligned to manual visual QA plus functional/security automation.

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
