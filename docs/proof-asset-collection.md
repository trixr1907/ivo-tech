# Proof Asset Collection Sheet

Stand: 2026-04-10  
Ziel: fehlende externe Trust-Signale schnell und sauber beschaffen.

## 1) Minimum fuer „trust-ready“

1. Mindestens 2 veroeffentlichbare Kundenstimmen mit Rolle/Kontext.
2. Mindestens 2 verifizierbare externe Proof-Links (Live-Flow, Referenzseite, oeffentliche Case-Landingpage).
3. Jede Aussage ist intern rueckverfolgbar (Quelle, Freigabestatus, Datum).

## 2) Asset-Tabelle (Copy/Paste fuer Pflege)

| Asset-ID | Typ | Sprache | Text/Claim | Person + Rolle | Unternehmen | Quelle/URL | Freigabe | Letzte Pruefung |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| quote-01 | Kundenstimme | DE/EN | "Der neue Konfigurator hat unser Angebot von manuellen Rueckfragen auf einen gefuehrten Upload-zu-Preis-Prozess gebracht. Das Team kann schneller und konsistenter reagieren." | Anonymisiert · Operations Lead | E-Commerce Manufacturing Partner | /case-studies/configurator-live | freigegeben (anonymisiert) | 2026-04-10 |
| quote-02 | Kundenstimme | DE/EN | "Der Relaunch hat uns nicht nur ein neues Design gegeben, sondern eine klare Entscheidungsstruktur fuer Hiring und Projektanfragen. Das macht Gespraeche deutlich effizienter." | Anonymisiert · Commercial Director | B2B Services Company | /case-studies/portfolio-authority-relaunch | freigegeben (anonymisiert) | 2026-04-10 |
| proof-link-01 | Externer Proof-Link | DE/EN | Live-3D-Konfigurator im produktiven Einsatz als oeffentlich pruefbarer Build-Proof | n/a | Dein Lieblingsdruck | https://deinlieblingsdruck.de/3d-konfigurator/#preisrechner | freigegeben | 2026-04-10 |
| proof-link-02 | Externer Proof-Link | DE/EN | Oeffentliche Build-/Release-Historie als nachvollziehbarer Engineering-Proof | n/a | GitHub (trixr1907) | https://github.com/trixr1907 | freigegeben | 2026-04-10 |

## 3) Qualitaetskriterien

1. Kein generisches Lob ohne Kontext.
2. Jede Kundenstimme benoetigt:
   - Problem-/Ausgangslage,
   - wahrgenommene Wirkung,
   - Rolle der zitierenden Person.
3. Jeder externe Link muss den Claim pruefbar machen.
4. Sprache bleibt konkret (keine Superlative ohne Nachweis).
5. Kundenstimmen nur mit expliziter schriftlicher Freigabe (siehe `docs/testimonial-approval-template.md`).

## 4) Integration in die Website

1. Homepage Trust-Section:
   - `src/content/trustEvidence.ts`
   - `src/components/home/HomePageRelaunch2026.tsx`
2. Case Study Detail:
   - KPI + Zitat + Referenzlink im oberen Drittel.
3. Nach jeder Aenderung:
   - `npm run typecheck`
   - `npm run analytics:verify:map:strict`
   - `npm run proof:readiness` (und `npm run proof:readiness:strict` vor Release)

## 5) Definition of done

Proof-Asset-Block ist fertig, wenn:

1. mindestens 2 echte, freigegebene Kundenstimmen live sind,
2. mindestens 2 externe Proof-Links live sind,
3. die Trust-Section ohne Platzhalter auskommt,
4. Tracking fuer Asset-Interaktionen im Dashboard sichtbar ist.
