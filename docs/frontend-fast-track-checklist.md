# Frontend Fast-Track Checklist (Human-visible first)

Stand: 2026-04-10  
Ziel: sichtbare Website-Wirkung priorisiert fertigstellen, bevor Ops-Restarbeiten abgeschlossen werden.

## 1) Sichtbare Abnahme-Kriterien

1. Keine Platzhaltertexte auf oeffentlichen Seiten.
2. CTA-Labels + CTA-Ziele sind pro Seite eindeutig und konsistent.
3. DE/EN-Navigation und Seitentitel wirken sprachlich konsistent.
4. Trust-Bloecke enthalten reale, verifizierbare Aussagen oder klaren Editorial-Hinweis.
5. Mobile First-View wirkt ohne visuelle Brueche (Spacing, Hierarchie, Lesbarkeit).

## 2) Seiten-Check (DE/EN Kernseiten)

- [x] Home: Hero/Proof/Trust final (Copy/CTA + visuelle Endabnahme Desktop/Mobile)
- [x] About: sichtbare Copy/Meta-Baseline bereinigt
- [x] Projects: sichtbare Copy/Meta-Baseline bereinigt
- [x] Case Studies Index: sichtbare Schema-/Label-Baseline bereinigt
- [x] Case Studies Detail: visueller Feinschliff + CTA-Kontext
- [x] Maker Lab: sichtbare Copy/CTA-Polish
- [x] Contact: Kontaktpanel + Form-Hinweise final polish

## 3) Frontend-Only Gate

Vor Wechsel auf Ops-Fokus:

1. `npm run typecheck`
2. `npm run test:unit -- src/content/testimonials.test.ts src/content/trustEvidence.test.ts`
3. Manuelle Sichtpruefung Desktop + Mobile fuer Kernseiten.

## 4) Uebergabe an Ops-Block

Wenn alle Punkte in Abschnitt 2 abgehakt sind:

1. Start `N2` Live-Analytics-Aktivierung.
2. Start `N3` Experimentlauf mit Tageslog.
3. Abschluss `N4` mit zwei freigegebenen Kundenstimmen.
