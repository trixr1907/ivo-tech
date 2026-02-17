# Branching and Governance

## Branching
- Model: trunk-based.
- Branch names:
  - `feat/<topic>`
  - `fix/<topic>`
  - `chore/<topic>`

## Pull request rules
- At least 1 approval.
- Required checks:
  - `ci`
  - `unit-integration`
  - `e2e`
  - `security`
- No force push to `main`.
- No direct push to `main`.

## Private-repo enforcement (no paid plan)
- Local hard-stop for direct pushes via `.githooks/pre-push`.
- Enable once per machine:
  - `npm run setup:githooks`
- Staging/production deployments validate required checks before deploy.
- If GitHub branch protection is unavailable, this setup is the no-cost fallback.

## Code ownership
- Ownership via `CODEOWNERS`.
- Cross-cutting changes (routing, deploy, security headers) require owner review.
