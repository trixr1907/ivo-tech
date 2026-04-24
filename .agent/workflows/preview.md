---
description: Erstellt eine Vorschau, ohne die Live-Seite zu verändern.
---

Standardweg: Pull Request öffnen.
- Vercel erzeugt automatisch eine Preview URL.
- Optional E2E gegen Preview:
  - GitHub Workflow `e2e` per `workflow_dispatch` mit `base_url` starten.

CLI Alternative:

```bash
npx vercel pull --yes --environment=preview --token="$VERCEL_TOKEN"
npx vercel build --token="$VERCEL_TOKEN"
npx vercel deploy --prebuilt --token="$VERCEL_TOKEN"
```
