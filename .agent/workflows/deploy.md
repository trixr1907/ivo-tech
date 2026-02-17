---
description: Veröffentlicht die freigegebene Version auf der Live-Domain (Production).
---

Produktiver Deploy wird über GitHub Workflow `cd-production` mit Environment-Approval ausgeführt.

1. Prüfe, dass `main` grün ist (ci, unit-integration, e2e, security).
2. Trigger `cd-production` (ref: `main` oder freigegebene SHA).
3. Approve `production` Environment in GitHub.

CLI Alternative (nur im Notfall):

```bash
npx vercel pull --yes --environment=production --token="$VERCEL_TOKEN"
npx vercel build --prod --token="$VERCEL_TOKEN"
npx vercel deploy --prebuilt --prod --token="$VERCEL_TOKEN"
```
