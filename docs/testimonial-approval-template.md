# Testimonial Approval Template

Stand: 2026-04-10  
Zweck: offene `pending`-Eintraege in `docs/proof-asset-collection.md` schnell in freigegebene Kundenstimmen ueberfuehren.

## 1) Outreach template (DE)

Betreff:
`Kurze Freigabe fuer Kundenstimme auf ivo-tech.com`

Nachricht:

```text
Hi <Name>,

ich aktualisiere gerade die Portfolio-/Hiring-Seite und moechte eine kurze, fachlich praezise Kundenstimme aus unserer Zusammenarbeit veroeffentlichen.

Vorschlag (anpassbar):
"<Zitat mit Problem, Wirkung und Ergebnis in 1-2 Saetzen>."
- <Name>, <Rolle>, <Unternehmen>

Wenn das fuer dich passt, reicht eine kurze Freigabe per Antwort:
"Freigegeben fuer die Veroeffentlichung auf ivo-tech.com."

Falls du Anpassungen willst, schicke mir einfach deine bevorzugte Formulierung.

Danke dir!
Ivo
```

## 2) Outreach template (EN)

Subject:
`Quick approval for a client testimonial on ivo-tech.com`

Message:

```text
Hi <Name>,

I am updating my portfolio/hiring site and would like to publish a short, technically precise testimonial from our collaboration.

Draft (fully editable):
"<Quote with problem, impact, and outcome in 1-2 sentences>."
- <Name>, <Role>, <Company>

If this works for you, a short reply is enough:
"Approved for publication on ivo-tech.com."

If you'd like changes, please send your preferred wording.

Thanks a lot!
Ivo
```

## 3) Acceptance criteria for each testimonial

1. Rolle + Unternehmen eindeutig genannt.
2. Inhalt enthaelt Problem + Wirkung (nicht nur generisches Lob).
3. Freigabe schriftlich vorhanden.
4. Eintrag in `docs/proof-asset-collection.md` aktualisiert:
   - `Freigabe = freigegeben`
   - `Letzte Pruefung = YYYY-MM-DD`

## 4) Operational update sequence

1. Quote im Sheet eintragen.
2. Testimonial in `src/content/testimonials.ts` von `published:false` auf `published:true` und `approved:true` setzen.
3. `npm run proof:readiness` pruefen.
4. Vor Release: `npm run proof:readiness:strict` (muss gruen sein).
