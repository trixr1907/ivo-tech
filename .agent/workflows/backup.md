---
description: Sichert den aktuellen Arbeitsstand lokal mit Git (Checkpoint).
---

Dieser Workflow erstellt einen "Sicherheits-Snapshot" deines Codes. Nutze ihn immer, bevor du größere Änderungen machst.

1. Prüfe den Status.
2. Füge alle Dateien hinzu.
3. Erstelle den Snapshot (Commit).

// turbo-all
git status
git add .
git commit -m "Auto-Backup: Safety Checkpoint"
