# Sprint 1 Implementation Board (Homepage + CRO Baseline)

Status: ready for execution in next session  
Scope: DE/EN homepage funnel uplift with minimal architecture churn  
Date: 2026-04-09

## 1. Sprint objective
- Increase qualified contact intent from homepage traffic.
- Tighten value proposition clarity above the fold.
- Add conversion plumbing (form flow + thank-you signal + tracking integrity).
- Close high-risk compliance gap (legal pages).

## 2. Non-goals for this sprint
- No full visual system rewrite.
- No content-hub migration (insights/playbooks/case studies remain structurally intact).
- No CMS migration.
- No experimental animation work beyond micro-level CTA/feedback interactions.

## 3. Current baseline (confirmed)
- Homepage uses `HomePageRelaunch2026` via [`src/app-pages/HomePage.tsx`](/home/ivo/Allgemein/ivo-tech/src/app-pages/HomePage.tsx) and [`src/app/page.tsx`](/home/ivo/Allgemein/ivo-tech/src/app/page.tsx).
- Lead form exists as [`ContactLeadForm.tsx`](/home/ivo/Allgemein/ivo-tech/src/components/home/ContactLeadForm.tsx) and posts to `POST /api/contact`.
- Contact API handler is in [`src/server/contact/handler.ts`](/home/ivo/Allgemein/ivo-tech/src/server/contact/handler.ts).
- Analytics helper exists in [`src/lib/analytics.ts`](/home/ivo/Allgemein/ivo-tech/src/lib/analytics.ts).
- Legal routes are currently missing (`/impressum`, `/datenschutz` return 404).

## 4. Sprint backlog (P1 only)
1. Hero messaging reframe (outcome-first, tighter CTA logic).
2. Contact funnel hardening:
   - form UX cleanup
   - explicit success transition
   - thank-you route
3. Offer snapshot section refinement (service blocks with outcome language).
4. Trust section upgrade with stronger proof format.
5. Legal pages implementation and footer/header linking.
6. Tracking consistency for CTA + form + thank-you.

## 5. File-level implementation map

### 5.1 Homepage copy + conversion hierarchy
- Edit [`src/components/home/HomePageRelaunch2026.tsx`](/home/ivo/Allgemein/ivo-tech/src/components/home/HomePageRelaunch2026.tsx)
  - Replace current hero title/description with outcome-focused variant.
  - Enforce CTA hierarchy:
    - primary: contact intent
    - secondary: service/offer exploration
  - Update services/benefits/trust copy blocks to remove generic language.
  - Add a visible conversion bridge line above form section (what happens next + SLA).

### 5.2 Contact success path
- Edit [`src/components/home/ContactLeadForm.tsx`](/home/ivo/Allgemein/ivo-tech/src/components/home/ContactLeadForm.tsx)
  - On successful submit: route to thank-you page or emit clear success state and CTA.
  - Ensure tracking event includes locale and source path.
  - Keep Turnstile branch intact.
- Add `thank-you` routes:
  - [`src/app/thanks/page.tsx`](/home/ivo/Allgemein/ivo-tech/src/app/thanks/page.tsx)
  - [`src/app/en/thanks/page.tsx`](/home/ivo/Allgemein/ivo-tech/src/app/en/thanks/page.tsx)
  - Include next-step CTA back to relevant proof/service content.

### 5.3 Metadata and schema alignment
- Edit [`src/app/page.tsx`](/home/ivo/Allgemein/ivo-tech/src/app/page.tsx)
  - Keep JSON-LD graph, but align `Service` language with sprint offer framing.
  - Verify canonical and language alternates stay stable.

### 5.4 Legal compliance pages
- Add:
  - [`src/app/impressum/page.tsx`](/home/ivo/Allgemein/ivo-tech/src/app/impressum/page.tsx)
  - [`src/app/datenschutz/page.tsx`](/home/ivo/Allgemein/ivo-tech/src/app/datenschutz/page.tsx)
  - [`src/app/en/legal/page.tsx`](/home/ivo/Allgemein/ivo-tech/src/app/en/legal/page.tsx) (or EN-specific split if needed)
- Update footer links in [`HomeRelaunchFooter.tsx`](/home/ivo/Allgemein/ivo-tech/src/components/home/HomeRelaunchFooter.tsx) / [`HomePageRelaunch2026.tsx`](/home/ivo/Allgemein/ivo-tech/src/components/home/HomePageRelaunch2026.tsx) as appropriate.

### 5.5 Tracking integrity
- Edit [`src/lib/analytics.ts`](/home/ivo/Allgemein/ivo-tech/src/lib/analytics.ts)
  - Add event names if missing:
    - `thank_you_view`
    - `hero_variant_view` (for experiment visibility)
- Add track calls on:
  - hero primary click
  - hero secondary click
  - contact submit success
  - thank-you page view

## 6. Execution order (next implementation session)
1. Update hero/services/trust copy and CTA hierarchy in `HomePageRelaunch2026`.
2. Implement thank-you routes.
3. Wire form success redirect/transition.
4. Add legal routes and footer links.
5. Add/verify analytics events.
6. Run full QA commands.

## 7. QA checklist (must pass before release)

### Functional
- `POST /api/contact` still accepts valid payload and rejects invalid payload.
- Form success path reaches thank-you state/route.
- Legal pages reachable and linked from footer.
- DE/EN locale switching does not break CTA routing.

### UX/CRO
- Above-the-fold message communicates outcome + ICP fit in under 7 seconds.
- Primary CTA is visible without scrolling (desktop + mobile).
- Contact section clarifies response expectation.

### Technical
- No new TypeScript errors.
- No lint regressions.
- No broken links in primary nav/footer.

## 8. Validation commands
Run in repo root:

```bash
npm run lint
npm run typecheck
npm run test:unit
npm run test:e2e
npm run build
```

Optional live confidence checks:

```bash
npm run verify:homepage:full
npm run verify:live
```

## 9. Definition of done
- Sprint P1 backlog items are implemented.
- QA checklist is satisfied.
- No regression in existing hub pages/routes.
- Changelog entry added (date + sprint summary).

## 10. Paste-ready kickoff prompt for next coding session

```text
Implement docs/sprint-1-homepage-cro-implementation-board.md end-to-end.

Constraints:
- Do not rewrite unrelated pages.
- Keep existing architecture and contact API contract intact.
- Apply changes in the execution order from the runbook.

Deliverables:
1) Updated homepage messaging + CTA hierarchy
2) Thank-you pages (DE/EN) and wired success flow
3) Legal pages and footer links
4) Tracking event integrity for CTA/form/thank-you
5) QA output summary + changed file list
```
