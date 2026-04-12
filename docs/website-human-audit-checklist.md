# Menschlicher Website-Audit — Checkliste (ivo-tech)

**Datum:** _______________  
**Tester:** _______________  
**Umgebung:** lokal `npm run dev` / Staging / Produktion  

**Automatisierter Vorab-Check:** `npm run verify:site` (Build, Unit, Playwright Site-Audit, Analytics-Map strict).  
**Vor Release / PR:** `npm run verify:homepage:full` (zusätzlich Lint, i18n, Typecheck, volle Playwright-Suite inkl. `home.spec.ts`).

| Checklisten-Bereich | Automatisiert (Stichprobe / Gate) | Manuell nötig |
|---------------------|-----------------------------------|---------------|
| Tastatur & Fokus | Axe kritisch auf mehreren URLs ([`site-audit.spec.ts`](../tests/e2e/site-audit.spec.ts)); Mobile-Nav in [`home.spec.ts`](../tests/e2e/home.spec.ts) | Tab-Reihenfolge, Fokus-Ring, Esc/Trap, Modal-Rückgabe |
| Formulare | Kontakt-Submit-Flow in `home.spec.ts` | Fehlertexte, Loading-UX, Randfälle |
| Thank-you | Routen in Site-Audit HTTP-Matrix | Text/CTA zur Quelle |
| i18n | `npm run lint:i18n`; DE/EN in Audit-Routen | subjektive Konsistenz |
| Links | Interne Links von `/` ([`site-audit.spec.ts`](../tests/e2e/site-audit.spec.ts)) | Externe `rel`, manuelle Stichprobe |
| Medien / Motion | nicht vollständig automatisiert | `prefers-reduced-motion`, Brand-Video-Controls |
| Responsiv / Kontrast | nicht in E2E | Breakpoints, subjektiver Kontrast |

## Tastatur & Fokus

- [ ] Tab-Reihenfolge logisch (Header → Hauptinhalt → Footer)
- [ ] Sichtbarer Fokus-Ring auf Links, Buttons, Formularfeldern
- [ ] Mobile Navigation per Tastatur schließbar (Esc / Fokus-Trap sinnvoll)
- [ ] Modale Dialoge (z. B. Projekt-Modal): Fokus-Return nach Schließen

## Formulare

- [ ] Kontaktformular: Pflichtfelder, Fehlermeldungen verständlich
- [ ] Submit-Feedback (Loading / Erfolg / Fehler)
- [ ] Thank-you-Seite (`/thanks`, `/en/thanks`) passt zur Quelle

## Sprache & i18n

- [ ] DE-Startseite vs. `/en` — Navigation und Footer konsistent
- [ ] Rechtstexte DE/EN erreichbar und verlinkt

## Vertrauen & Links

- [ ] Externe Links: `rel` wo sinnvoll (`noopener noreferrer`)
- [ ] Keine toten internen Links (Stichprobe + `npm run test:e2e:audit` oder `npm run verify:site`)

## Medien & Motion

- [ ] `prefers-reduced-motion`: keine störenden Autoplays (Hero-Video/Ambient)
- [ ] Videos: Steuerung wo erwartet (Brand-Seite)

## Responsiv

- [ ] 375px, 768px, 1280px, 1440px — kein horizontaler Overflow
- [ ] Lesbarkeit Kontrast (besonders Slate auf Dunkel)

## Ergebnis

| Bereich        | Pass / Fail | Anmerkung |
|----------------|-------------|-----------|
| Tastatur       |             |           |
| Formulare      |             |           |
| i18n           |             |           |
| Links          |             |           |
| Medien         |             |           |
| Responsiv      |             |           |

**Freigabe:** [ ] Ja  [ ] Nachbesserung nötig
