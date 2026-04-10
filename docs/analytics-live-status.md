# Analytics Live Status

Stand: 2026-04-10  
Owner: ivo-tech

Buildsheet reference:
- `docs/analytics-dashboard-buildsheet-posthog.md`

## Sink activation

- Provider: `plausible` (production active)
- `NEXT_PUBLIC_ANALYTICS_SINK_ENABLED`: `true` (production)
- `ANALYTICS_SINK_PROVIDER`: `plausible` (production)
- Sink endpoint status: `live` (`/api/analytics` returns `accepted`)
- Production activation date: `2026-04-10`

## Dashboard pack status

- [x] Funnel Core
- [x] Service Intent Depth
- [x] Attribution Quality
- [x] Locale Split
- [x] Experiment Lens

Dashboard links:
- Funnel Core: `docs/analytics-dashboards/funnel-core.md`
- Service Intent Depth: `docs/analytics-dashboards/service-intent-depth.md`
- Attribution Quality: `docs/analytics-dashboards/attribution-quality.md`
- Locale Split: `docs/analytics-dashboards/locale-split.md`
- Experiment Lens: `docs/analytics-dashboards/experiment-lens.md`

## Alerts status

- [x] Submit Success Drop >30% WoW
- [x] Service Detail CTA Drop >20% WoW at rising traffic
- [x] `source=unknown` >25%
- [x] Weekly KPI report to Slack/Email

Automation helper:
- `npm run analytics:plausible:ops` (snapshot + alert evaluation report)
- `npm run analytics:plausible:ops:strict` (fails on triggered hard-alert thresholds)
- `npm run hero:log:sync:plausible -- --day=YYYY-MM-DD` (writes daily hero experiment KPIs)
- `npm run github:ops:readiness` (checks remote workflow + required GitHub secrets)

## Verification log

| Date | Environment | Check | Result | Notes |
| --- | --- | --- | --- | --- |
| 2026-04-10 | repo | Relay route + env contract implemented | pass | awaiting production sink credentials |
| 2026-04-10 | production | Vercel env vars gesetzt | pass | `NEXT_PUBLIC_ANALYTICS_SINK_ENABLED=true`, provider `plausible` |
| 2026-04-10 | production | Relay endpoint healthcheck | pass | `POST https://ivo-tech.com/api/analytics` -> `{\"ok\":true,\"status\":\"accepted\",\"provider\":\"plausible\"}` |
| 2026-04-10 | repo | Plausible ops snapshot script vorhanden | pass | `scripts/analytics-plausible-ops.mjs` fuer KPI-/Alert-Auswertung bereit |
| 2026-04-10 | repo | Daily alert workflow vorhanden | pass | `.github/workflows/analytics-ops-daily.yml` (wartet auf Secret `PLAUSIBLE_STATS_API_KEY`) |
| 2026-04-10 | repo/remote | GitHub ops readiness | fail | Missing secret `PLAUSIBLE_STATS_API_KEY` (workflow ist remote vorhanden) |
| 2026-04-10 | remote | `analytics-ops-daily` workflow dispatch (Run `24255122948`) | pass | Job erfolgreich; KPI/strict steps wurden wegen fehlendem `PLAUSIBLE_STATS_API_KEY` korrekt auf `skip` gesetzt |
| 2026-04-10 | remote | `analytics-ops-daily` workflow dispatch (Run `24255415962`) | pass | Erfolgreich auf Commit `139ab57`; Node24 erzwungen, Annotation zeigt verbleibendes Action-Versionsthema (`actions/*@v4`) |
| 2026-04-10 | remote | `analytics-ops-daily` workflow dispatch (Run `24255468313`) | pass | Erfolgreich auf Commit `9df926a`; `actions/checkout@v5` + `actions/setup-node@v5`, keine Node20-Runner-Annotation mehr |
| 2026-04-10 | repo/remote | GitHub ops readiness (strict) | pass | `PLAUSIBLE_STATS_API_KEY` gesetzt; `npm run github:ops:readiness:strict` gruen |
| 2026-04-10 | remote | `analytics-ops-daily` workflow dispatch (Run `24257889740`) | pass | KPI snapshot + strict hard-alert-check erfolgreich ausgefuehrt (kein Skip-Pfad), aktuell noch 0 Events im 7d-Fenster |
| 2026-04-10 | repo | Dashboard pack dokumentiert | pass | Fuenf operative Dashboard-Artefakte unter `docs/analytics-dashboards/` erstellt |
| 2026-04-10 | repo | Alert-Regeln dokumentiert + an Workflow gebunden | pass | Regeln in `docs/analytics-dashboards/alerts.md`, Ausfuehrung ueber `analytics-ops-daily.yml` |

Readiness checks:
- `npm run analytics:live:readiness`
- `npm run analytics:live:readiness:strict`
