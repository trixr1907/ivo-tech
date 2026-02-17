# Cloudflare CLI Runbook

## Goal
Manage `ivo-tech.com` DNS directly from this repo for checks and controlled updates.

## Included tooling
- `wrangler` (official Cloudflare CLI) via local dependency
- `scripts/cloudflare-cli.mjs` (repo helper with explicit DNS commands)

## 1) Create Cloudflare API token
In Cloudflare dashboard, create an API token with:
- Permissions:
  - `Zone -> DNS -> Edit`
  - `Zone -> Zone -> Read`
- Zone Resources:
  - `Include -> Specific zone -> ivo-tech.com`

Use this token locally only. Do not commit it.

## 2) Export local environment variables
```bash
export CLOUDFLARE_API_TOKEN="<your_token>"
export CLOUDFLARE_ZONE_NAME="ivo-tech.com"
# optional for faster calls:
# export CLOUDFLARE_ZONE_ID="<zone_id>"
```

## 3) Verify setup
```bash
npm run cf:verify
npm run cf:zones
npm run cf:dns -- ivo-tech.com
```

## 4) Apply Vercel-required DNS records
This ensures:
- `A ivo-tech.com -> 76.76.21.21`
- `A www.ivo-tech.com -> 76.76.21.21`
- `A staging.ivo-tech.com -> 76.76.21.21`
- both `proxied=false` (DNS only)

```bash
npm run cf:ensure:vercel -- ivo-tech.com
```

## 5) Useful direct commands
```bash
# list records
npm run cf -- dns:list ivo-tech.com

# upsert one record
npm run cf -- dns:upsert ivo-tech.com A staging.ivo-tech.com 76.76.21.21 false

# delete by record id
npm run cf -- dns:delete ivo-tech.com <record_id>

# raw wrangler access
npm run cf:wrangler -- whoami
```

## 6) Validate in Vercel
```bash
npx vercel domains inspect ivo-tech.com --scope "$VERCEL_ORG_ID"
npx vercel domains inspect staging.ivo-tech.com --scope "$VERCEL_ORG_ID"
```

Expected: no DNS misconfiguration warning for those domains.

## Safety notes
- Keep Cloudflare as DNS owner (nameservers stay on Cloudflare).
- Keep records as `DNS only` for Vercel apex/staging target.
- Never put `CLOUDFLARE_API_TOKEN` in repo files or GitHub Actions unless intentionally needed for automation.
