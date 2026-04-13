# Analytics Event Map (Homepage Funnel)

KPI-Mapping und Zielwerte: `docs/analytics-kpi-board.md`
Validierung: `npm run analytics:verify:map`
Strict-Validierung: `npm run analytics:verify:map:strict`
Scope der Prüfung: dokumentierte Events (`analytics-event-map.md`) vs. reale Emitter (`trackEvent(...)`) vs. Type-Contract (`AnalyticsEventName`). Zusätzlich gelten Alias-Ziele aus `eventAliasMap` in `src/lib/analytics.ts` als abgedeckt (z. B. `cta_playbook_tertiary_click` → `playbook_open`, `section_cta_click`). **Literal** `data-track-event="…"` in `src/**` zählt als Emitter-Hinweis (kein Ersatz für dynamische `trackEvent(variable)`-Aufrufe).

Hinweis **`hero_variant_view`:** Payload-Feld `source` bezeichnet die **Varianten-Auflösung** (`query` \| `storage` \| `assigned` \| `default`), nicht die Marketing-`source` anderer Events.

## Contact flow

| Event | Trigger | Core payload keys |
| --- | --- | --- |
| `hero_cta_click` | Primary hero CTA click (new masterplan contract) | `source`, `locale`, `intent`, `variant` |
| `contact_submit` | Contact submit attempt (new masterplan contract) | `source`, `locale`, `sourcePath`, `attributionSource`, `heroVariant`, `intent` |
| `scheduler_click` | Scheduler CTA click (new masterplan contract) | `source`, `locale`, `sourcePath`, `attributionSource`, `heroVariant`, `href`, `placement` |
| `thankyou_view` | Thank-you page view (new masterplan contract) | `locale`, `source`, `heroVariant`, `path` |
| `hero_variant_view` | Hero rendered with experiment variant (Exposure; erneut bei Wechsel von `locale`, `pathname` oder Query `exp_hero`) | `locale`, `variant`, `source` (= Auflösung: `query` / `storage` / `assigned` / `default`), `path` |
| `cta_primary_click` | Hero primary CTA click | `source`, `locale`, `intent`, `variant` |
| `cta_case_primary_click` | Hero secondary CTA (Relaunch: Hiring-Pfad; Legacy: Case-Fokus) | `source`, `locale`, `intent`, `variant` |
| `cta_playbook_tertiary_click` | Hero tertiary CTA (Relaunch: Projekte-Hub; Legacy: Playbook) | `source`, `locale`, `intent`, `variant` |
| `contact_form_start` | First interaction with contact form fields | `source`, `locale`, `sourcePath`, `attributionSource`, `heroVariant`, `intent` |
| `contact_form_submit` | Contact form submit attempt | `source`, `locale`, `sourcePath`, `attributionSource`, `heroVariant`, `intent` |
| `contact_form_submit_success` | Contact form successful response | `source`, `locale`, `sourcePath`, `attributionSource`, `heroVariant`, `intent` |
| `contact_form_error` | Contact form error state | `source`, `locale`, `sourcePath`, `attributionSource`, `heroVariant`, `errorCode`, `intent` |
| `scheduler_cta_click` | Contact form scheduler CTA click | `source`, `locale`, `sourcePath`, `attributionSource`, `heroVariant`, `href`, `placement` |
| `thank_you_view` | Thank-you page view | `locale`, `source`, `heroVariant`, `path` |
| `thank_you_cta_click` | Thank-you CTA click (`primary`/`secondary`/`email`) | `locale`, `source`, `heroVariant`, `placement`, `href`, `path` |

## Services + hubs

| Event | Trigger | Core payload keys |
| --- | --- | --- |
| `section_cta_click` | Generic section CTA click across service/hub/thank-you/home surfaces (new masterplan contract) | `locale`, `source`, `placement`, `href`, `path` |
| `nav_section_click` | Homepage section-nav click | `source`, `locale`, `sectionId`, `variant` |
| `service_page_view` | Services page view | `locale`, `source`, `path` |
| `service_cta_click` | Services CTA click | `locale`, `source`, `placement`, `href`, `path` |
| `service_detail_view` | Service detail page view | `locale`, `slug`, `source`, `path` |
| `service_detail_cta_click` | Service detail CTA click | `locale`, `slug`, `source`, `placement`, `href`, `path` |
| `hub_page_view` | Hub index/detail page view | `locale`, `kind`, `pageType`, `slug`, `source`, `path` |
| `hub_cta_click` | Hub CTA click | `locale`, `kind`, `pageType`, `slug`, `source`, `placement`, `href`, `path` |

## Proof + engagement

| Event | Trigger | Core payload keys |
| --- | --- | --- |
| `case_open` | Case open intent event (new masterplan contract) | `projectId`, `source`, `locale`, `path` |
| `playbook_open` | Playbook CTA/open intent event (new masterplan contract) | `source`, `locale`, `variant`, `intent` |
| `authority_asset_view` | Authority asset interaction (Hub-Asset oder Home Trust Evidence Link) | `asset`, `location`, `locale`, `path`, `href` |
| `insight_card_click` | Featured insight card click on homepage | `source`, `locale`, `slug`, `variant` |
| `insights_hub_click` | Homepage insights hub CTA click | `source`, `locale`, `variant` |
| `insight_read_75` | Insight detail reaches >=75% read depth | `slug`, `locale`, `path` |
| `case_study_open` | Case study open from runtime modal or dedicated case page | `projectId`, `source`, `locale`, `path` |
| `trust_project_click` | Trust/preview project interaction on homepage | `source`, `locale`, `projectId`, `path`, `variant` |
| `hero_video_play` | Hero teaser load/play interaction | `source`, `locale`, `path` |
| `homepage_scroll_depth` | Homepage scroll depth milestones (50/90) | `depth`, `locale`, `path`, `source` |
| `case_card_booking_click` | Case card „für dein System umsetzen“ → Scheduler | `projectId`, `locale`, `path`, `variant` |
| `lead_magnet_direct_download` | Checkliste direkt als Datei laden | `locale`, `path`, `attributionSource`, `heroVariant` |
| `lead_magnet_submit` | Lead-Magnet-Formular abgeschickt | `locale`, `source`, `attributionSource`, `heroVariant`, `sourcePath` |
| `lead_magnet_success` | Lead-Magnet erfolgreich gesendet | `locale`, `attributionSource`, `heroVariant`, `sourcePath` |

## Platform + legacy

| Event | Trigger | Core payload keys |
| --- | --- | --- |
| `web_vital_recorded` | Web Vitals measurement emitted | `metric`, `value`, `delta`, `rating`, `path`, `thresholdExceeded` |
| `cta_contact_click` | Contact CTA click on case/configurator/home flows | `source`, `locale`, `path` (+ `intent`, `location`, `sourcePath`, `attributionSource`, `heroVariant` je Kontext) |
| `contact_quality_submit` | Legacy contact form submits enriched qualification payload | `intent`, `intentDetail`, `timelineBand`, `projectScope`, `source`, `locale`, `sourcePath` |
| `contact_form_success` | Legacy contact form success state | `intent`, `source`, `locale`, `sourcePath` |
