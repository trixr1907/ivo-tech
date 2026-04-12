# Externe Referenzen — Research-Log (ivo-tech)

Zweck: **konkrete Erkenntnisse** aus etablierten Sites und Tools festhalten (nicht nur Stimmung).  
Felder pro Eintrag: **URL**, **Kategorie**, **Takeaway**, **Übernahme** (ja/nein/teils), **Umsetzung** (Datei/Komponente).

## Status

| Datum      | Bearbeiter | Notiz |
|-----------|------------|--------|
| 2026-04-12 | Agent/Initial | Start-Template; bei Bedarf Zeilen ergänzen. |

## Einträge

| URL | Kategorie | Takeaway | Übernahme | Umsetzung |
|-----|-----------|----------|-----------|-----------|
| [ui.shadcn.com](https://ui.shadcn.com/) | Komponenten-Docs | Fokus-States, semantische Patterns für Buttons/Forms | ja (bereits) | `src/components/shadcn/*` |
| [Firecrawl](https://www.firecrawl.dev/) | SaaS-Landing | Klare Primär-CTA, kompakte Proof-Zeilen | teils | Hero-/Trust-Rhythmus prüfen |
| [Framer](https://www.framer.com/) | Motion/Layout | Sanfte Section-Reveals; reduced-motion beachten | teils | `framer-motion` + `useReducedMotion` |
| [Land-book / Lapa / Godly / SaaSFrame](https://land-book.com/) | Galerien | Whitespace, Typo-Skalierung | teils | `HomePageRelaunch2026`, `RELAUNCH_*` |
| [WCAG (über Axe)](https://www.w3.org/WAI/WCAG22/quickref/) | A11y | Kritische Violations = Blocker | ja | `tests/e2e/*.spec.ts` + manuelle Checkliste |

*(Weitere URLs aus dem Plan: Mobbin, Awwwards, SiteInspire, Relume, 21st.dev, Aceternity, Magic UI, Figma/Make, v0, Builder.io, … — hier bei Bedarf als Tabelle erweitern.)*

## Lokale Brand-Assets (Umsetzung)

| Asset | Quelle | Ziel | Verwendung |
|-------|--------|------|------------|
| `energy-trail-loop.webm` | `logos/Codeivo-tech_web-handoff/motion/webm/` | `public/assets/motion/` | Hero-Snapshot-Ambient (Home), Brand-Motion-Sektion |
| SVG Lockup/Wordmark/Mark | `logos/Codeivo-tech_web-handoff/logo/` | `public/assets/logo/handoff/` | Brand-Showcase „Export-Paket“ |
