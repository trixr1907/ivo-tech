---
description: Zeigt die Historie der letzten Backups (Commits) an.
---

Gibt eine übersichtliche Liste deiner letzten Änderungen aus.
Jede Zeile beginnt mit einer "ID" (z.B. `a1b2c3d`), die du brauchst, um zu diesem Punkt zurückzukehren.

// turbo-all
git log --oneline --graph --decorate --all -n 10
