# Rollback Runbook

## Fast rollback
1. Identify last known good commit SHA on `main`.
2. Trigger `cd-production` workflow with `ref=<good_sha>`.
3. Approve `production` environment.
4. Validate smoke test on production.

## Hotfix rollback alternative
1. Create `fix/rollback-<date>` branch from good SHA.
2. Open emergency PR to `main` with explanation.
3. Merge after mandatory checks.
4. Deploy through normal production workflow.

## Incident notes template
- Start time:
- Impacted pages:
- User impact:
- Root cause:
- Rollback SHA:
- Follow-up actions:
