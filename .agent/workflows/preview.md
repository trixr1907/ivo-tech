---
description: Erstellt eine temporäre Online-Vorschau, ohne die Live-Seite zu ändern.
---

Dieser Workflow lädt deine Seite auf eine geheime, temporäre URL hoch.
Perfekt, um Änderungen "live" zu testen (z.B. auf dem Handy), OHNE die echte Seite (ivo-tech.com) zu gefährden.

1. Erstelle Preview-Channel (Gültig für 24h).

// turbo-all
firebase hosting:channel:deploy preview --expires 24h
