# ivo-tech — Agent-Kontext (Cursor + Hermes)

Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, Vitest, Playwright. Deploy: Vercel (`npm run deploy` / `deploy:preview`).

## Befehle (Repo-Root)

| Zweck | Befehl |
|--------|--------|
| Dev-Server | `npm run dev` |
| Production-Build | `npm run build` |
| Lint | `npm run lint` |
| Typecheck | `npm run typecheck` |
| Unit-Tests | `npm run test:unit` |
| E2E | `npm run test:e2e` |
| Volle Checks | `npm run verify:homepage:full` |

Node: `>=20.19.0` (siehe `package.json` engines).

## Konventionen

- Fokussierte Diffs; keine Refactors „nebenbei“.
- Styling: `@layer`-Reihenfolge in `globals.css` — Utilities dürfen nicht von `pages`-Layer-Regeln wie globalem `* { margin: 0 }` überschrieben werden (siehe `pages.css` / `home-relaunch-shell.css`).
- Öffentliche Site: `RelaunchMarketingShell` + `RelaunchPageMain` (Varianten `marketing` | `home` | …).
- **UI (v0.dev / shadcn):** Neue Komponenten über `@/components/shadcn/*` und `components.json` (Style „new-york“). v0-Code: an Projekt-Tokens anpassen, Varianten in `buttonVariants` (`hero`, `onDark`, …) wiederverwenden statt langer Duplikat-Klassen. Legacy: `@/components/ui/Button` ist deprecated (`.ui-btn` nur noch für Altbestand).

## Hermes ↔ Cursor

- **Gemeinsames Repo:** Hermes nutzt MCP `ivo_tech_fs` → Filesystem nur dieses Repo (`npm run hermes:sync-mcp` aktualisiert `~/.hermes/config.yaml` nach `git rev-parse --show-toplevel`).
- **Validierung:** `npm run hermes:validate`
- **Ab Schritt 2 gebündelt (auto + Anleitung):** `npm run hermes:from-step2`

### Hermes Einrichtung (Reihenfolge)

1. **Installation** — offizielles Script (siehe [Installation](https://hermes-agent.nousresearch.com/docs/getting-started/installation)); bei fehlendem TTY am Ende normal.
2. **Modell / Provider** — in einem **normalen Terminal mit TTY:** `hermes setup` oder nur `hermes setup model`. Ohne Wizard: in `~/.hermes/.env` z. B. `OPENROUTER_API_KEY=…` setzen.
3. **Gateway (optional)** — Telegram/Discord/Slack: `hermes gateway setup`, dann z. B. `hermes gateway run` (unter WSL oft im Vordergrund). *Derzeit bewusst aus — nur CLI/MCP-Repo.*
4. **Repo-Pfad für MCP** — `npm run hermes:sync-mcp` (oder läuft als Teil von `hermes:from-step2`).
5. **Cursor → Hermes (Messaging-Bridge)** — im Repo: `.cursor/mcp.json` mit `hermes mcp serve`. Falls Cursor `hermes` nicht findet, vollen Pfad eintragen (z. B. `…/.local/bin/hermes`). Zusätzliche Snippet-Referenz: `config/cursor-mcp.hermes.snippet.json`.

### API / `.env`

In `~/.hermes/.env` mindestens einen Inference-Provider setzen (z. B. `OPENROUTER_API_KEY`), sonst schlägt `hermes chat` ohne Kontext fehl. Keys **nie** ins Git-Repo committen.

### Tagesbetrieb (Hermes aktiv + Cursor MCP)

- **Hermes-CLI:** Im **Repo-Root** starten (`cd …/ivo-tech` → `hermes`). Die Meldung *„Secure MCP Filesystem Server running on stdio“* beim Start ist **normal** — damit hängt der MCP-Server `ivo_tech_fs` am Repo.
- **Cursor:** Projekt-MCP (`.cursor/mcp.json`) kann **parallel** die Hermes-Bridge (`hermes mcp serve`) nutzen — getrennt von der CLI-Session im Terminal.
- **MCP nach Config-Änderung:** In der Hermes-Session `/reload-mcp` (siehe [MCP-Doku](https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp)).
- **Zusammenarbeit:** Grobe Aufteilung sinnvoll — Hermes: Recherche, Skripte, viele Tool-Schritte; Cursor: gezielte Edits, Review, Tests. Übergabe über **Git** (Branch/Commit), nicht nur Chat-Kontext.
- **Branch für Agent-Arbeit:** `collab/hermes-cursor` — hier committen/pushen, was Hermes oder du vorbereitet; in Cursor denselben Branch checken für Review/Merge.

### Hermes Slash-Befehle (Kurz)

In der laufenden `hermes`-Session `/` tippen für Autocomplete. Vollständige Liste: [Slash Commands](https://hermes-agent.nousresearch.com/docs/reference/slash-commands).

| Befehl | Nutzen |
|--------|--------|
| `/help` | Hilfe |
| `/reload-mcp` | MCP-Server aus `config.yaml` neu laden |
| `/reload` | `.env`-Änderungen ohne Neustart übernehmen |
| `/new` | Neue Session (frische ID) |
| `/model …` | Modell anzeigen/wechseln |
| `/status` | Session-Infos |

Einmalige Diagnose im Shell-Terminal (nicht in Hermes): `hermes doctor`, `hermes dump`.

## Webseite gemeinsam weiterentwickeln (Hermes + Cursor)

Beide arbeiten im **gleichen Repo** auf Branch **`collab/hermes-cursor`**. Vor jeder Session: `git fetch` und Branch aktualisieren bzw. gemeinsame Basis abstimmen.

| Schritt | Wer / wo | Was |
|--------|-----------|-----|
| 1 | Du | `git checkout collab/hermes-cursor` (in Cursor und im Terminal für Hermes). |
| 2 | Optional | `npm run dev` — Seite lokal prüfen (`/` und `/en`). |
| 3 | **Hermes** | Im Repo-Root `hermes` starten. Aufgaben formulieren wie: *„Passe den Text in `homeRelaunchCopy` für Locale `de` an“*, *„Neue Sektion in `homeRelaunchSections` vorschlagen und in `HomePageRelaunch2026` einbinden“*, *„Kontakt-/CTA-Texte prüfen“*. Hermes nutzt MCP `ivo_tech_fs` für Dateien nur in diesem Projekt. |
| 4 | **Cursor** | Gleichen Branch öffnen; Hermes-Diffs reviewen; gezielt TSX/CSS/Tests anpassen; `npm run lint`, `npm run typecheck`, bei Bedarf `npm run test:unit`. |
| 5 | Beide | Kleine, fokussierte Commits mit klaren Messages; pushen, damit die andere Seite `git pull` machen kann. |

**Zentrale Einstiegspunkte (öffentliche Relaunch-Site):**

- Layout & Shell: `src/components/layout/RelaunchMarketingShell.tsx`, `RelaunchPageMain.tsx`, `RelaunchStickyHeader.tsx`
- Startseite: `src/app-pages/HomePage.tsx` → `src/components/home/HomePageRelaunch2026.tsx`
- Inhalte: `src/content/homeRelaunchCopy.ts`, `src/content/homeRelaunchSections.ts`, `src/content/homeVisuals.ts`
- Styles: `src/styles/home-relaunch-shell.css`, `src/styles/pages.css` (Reihenfolge `@layer` beachten)

Nach Änderungen an **MCP- oder Hermes-Konfiguration** in Hermes: `/reload-mcp`. Cursor nach Änderung an `.cursor/mcp.json`: MCP in den Cursor-Einstellungen neu laden bzw. Projekt neu öffnen.

## Sicherheit

- Keine Secrets committen; `.env*` nur lokal.
- Hermes: MCP-Tool-Filter in `~/.hermes/config.yaml` bei Bedarf erweitern; sensible Server nur mit `tools.include`.
