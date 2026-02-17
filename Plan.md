IVO TECH Homepage Refresh (Projects, DLD Demo, Recruiter-Profil, Fonts, SEO)
Summary
Pizza-Homepage wird sauber als Projekt integriert (Copy/Actions/Preview konsistent).
DLD Viewer im Projekt-Modal: kein Logo, kein "Datei auswaehlen", kein Upload-Text; stattdessen ein direkt geladenes Demo-Modell, inkl. weiterhin funktionierender Berechnungen (Dimensionen/Volumen/Pricing).
"Full-Viewer / Viewer oeffnen" wird entfernt; stattdessen Link auf /configurator (jetzt Placeholder, spaeter Redirect auf externe Live-URL).
DLD-Projekttexte werden von allen V2-Referenzen bereinigt.
AutoCoupon EXT: Open Source/GitHub; AutoCoupon App: Beta nur auf Anfrage.
Fonts werden neu aufgesetzt: Monument spaeter drop-in, jetzt hochwertige Alternative + klare Rollen (Display/Body/Mono).
status-strip wird ersetzt durch eine recruiter-taugliche "Profil" Section (faktisch, nicht needy).
SEO/SOTA: Copy, semantische Struktur, JSON-LD, Sitemap, Links als echte URLs (nicht nur Buttons).
1) Projekte: Inhalte, Labels, Links
Datei: projects.ts

DLD 3D Viewer

Entfernen: V2/Versions-Info in modal.title, modal.status, modal.desc, specs.
Update summary so, dass es nicht mehr "Upload" als primären Einstieg verkauft (weil Demo ohne Upload startet).
Actions:
Primary: href: '/configurator', external: false, Label:
DE: 3D Configurator
EN: 3D configurator
Secondary: mailto:contact@ivo-tech.com (optional, aber empfehlenswert als klare Route)
Entfernen: Action auf viewer.ivo-tech.com.
AutoCoupon EXT

Tag/Status:
DE: Open Source
EN: Open source
Modal-Status:
DE/EN: OPEN SOURCE // GITHUB
GitHub Action bleibt auf https://github.com/trixr1907/AutoCoupon (als Code-URL formatieren).
Entfernen: "Auf Anfrage" Messaging.
AutoCoupon App (Android)

Tag/Status:
DE: Beta (auf Anfrage)
EN: Beta (on request)
Description: klarer Beta-Hinweis, keine Store-Verlinkung.
Action: mailto:contact@ivo-tech.com (Primary).
Pizza

Action href: '/pizza/' bleibt, aber kein external: true (ist internal).
Optional: Modal-Copy/Spezifikation kurz an aktuellen Stand anpassen (wenn im Template Features geaendert wurden).
Public Interface Changes

ProjectId und ProjectMedia bleiben gleich (keine neuen Projekte notwendig).
Nur Content-Updates + Action-Targets.
2) DLD Viewer Demo im Modal: Default-Modell, Upload aus, Logo weg
Ziel: Beim Oeffnen sofort Modell sichtbar, Berechnungen laufen, aber keinerlei Upload/UI-Teaser.

2.1 Demo-Modell als Asset
Neue Datei: demo-cube.stl

ASCII STL eines kleinen Wuerfels (12 Triangles).
Dateiname/Ext muss .stl bleiben, damit handleFile() greift.
2.2 dld3d-core: neue Demo-Flags + Autoload
Datei: dld3d-core.js
Optional Doc: README.md

Additive, rueckwaertskompatible Erweiterungen via vars:

vars.demo_model_url: string
Wenn gesetzt (und mode === 'demo'): nach resetModel() per fetchFileAsBlob() laden, in File wrappen, dann handleFile(file) aufrufen.
Derive filename:
vars.demo_model_filename wenn vorhanden, sonst letzter URL-Segment.
vars.demo_disable_upload: boolean | 0/1 | 'true'/'false'
Wenn true (und mode === 'demo'):
Upload-Zone initial nicht anzeigen (resetModel() -> setUploadOverlayVisible(false)).
Upload-Bindings in bindUI() ueberspringen (browseBtn/fileInput/dragdrop/click/keydown).
Remove-File Button nicht binden (und per CSS verstecken), damit Demo nicht "leer" geschossen wird.
Main Action Button #dld-upload-btn ausblenden (da kein Full Viewer mehr).
vars.brand_logo_enabled: boolean | 0/1 | 'true'/'false'
Wenn false: state.brand.enabled = false (auch in Demo Mode), damit keine 3D-Logo/Procedural Fallback erscheint.
Zusatz: in mount() eine CSS-Klasse setzen:

mountEl.classList.toggle('dld3d--demo-upload-disabled', demoDisableUpload);
2.3 dld3d-core CSS: Demo-State sauber verstecken
Datei: dld3d-core.css

Wenn .dld3d--demo-upload-disabled:
.dld-upload-zone { display: none !important; }
#dld-upload-btn { display: none !important; }
#dld-remove-file-btn { display: none !important; }
Watermark entfernen (falls leer):
.dld-watermark:empty { display: none; }
2.4 Host-Integration (Next Modal)
Dateien:

Dld3dDemo.tsx
ProjectModal.tsx
ProjectModal:

Dld3dDemo bekommt locale als Prop: <Dld3dDemo locale={locale} />.
Dld3dDemo:

Config Vars setzen:
demo-cube.stl'
demo_disable_upload: true
brand_logo_enabled: false
full_viewer_url: '' (damit Header-Link weg ist)
Strings lokalisieren (DE/EN) fuer sichtbare Labels:
title, subtitle_demo
dimensions_label, volume_label, material_label, quality_label, color_label, quantity_label, price_label
watermark: ''
Strings, die Full Viewer referenzieren, leer lassen oder gar nicht setzen:
header_link_demo, action_demo (optional leer, aber Button ist sowieso hidden durch Core/CSS).
Wichtiges Verhalten

Berechnungen funktionieren weiterhin, weil handleFile() denselben Pfad nutzt wie Upload: loadModelFromData() -> computeAndUpdateStats() -> maybeEstimateAndRenderPrice().
3) /configurator: Placeholder jetzt, spaeter Redirect auf externe Live-URL
User-Entscheid: jetzt Placeholder, spaeter Redirect.

Neue Datei: configurator.tsx

Lokalisierter Placeholder (DE/EN, via copy).
Inhalte:
H1: 3D Configurator
Kurztext: "Public link coming soon" + was er kann (3 Bullet-Highlights)
CTA: mailto:contact@ivo-tech.com mit Betreff 3D Configurator Demo
Link zurueck zur Startseite.
SEO:
<title> + <meta name="description">
canonical (https://ivo-tech.com/configurator bzw. /en/configurator)
OpenGraph (og:title, og:description, og:url)
Spaeter Redirect

Wenn externe URL bereit ist: in next.config.mjs ein Redirect:
source: '/configurator' und source: '/en/configurator' -> externe URL (permanent/temporary nach Bedarf).
Bis dahin bleibt /configurator intern.
Sitemap

Update sitemap.xml um:
https://ivo-tech.com/configurator
https://ivo-tech.com/en/configurator
4) status-strip ersetzen durch recruiter-taugliche Profil-Sektion
Dateien:

index.tsx
copy.ts
globals.css
index.tsx
Entfernen: <section className="status-strip"> ...
Neu: <section id="about" className="section about"> ...
Header nav: neuen Anchor-Link #about einfuegen (Copy: t.nav.about).
Optional SOTA/SEO: Project Cards und HeroCommands als echte Links ausgeben:
?project=3d#projects" onClick={...}> statt <button>
Vorteil: sharebar ohne JS, middle-click, crawler-friendly.
copy.ts (konkret, ASCII-only wie bestehend)
Entfernen: status: [...]
Neu:
nav.about: DE Profil, EN Profile
sections.about:
DE title Profil, desc Kurz zu mir, meinem Fokus und was ich suche.
EN title Profile, desc A quick snapshot of what I build and what I am looking for.
about Content:
DE paragraphs:
Ich bin Ivo. Ich baue Web-UIs, Motion Systems und interaktive Demos. Noch ohne Berufserfahrung in der IT, aber seit kleinauf computerverrueckt: ich shippe eigene Projekte und optimiere konsequent fuer Performance, A11y und stabile Architektur.
Aktuell suche ich einen Einstieg als Junior (Web/Frontend, offen fuer Fullstack-Anteile).
EN paragraphs:
I am Ivo. I build web UIs, motion systems, and interactive demos. No professional IT experience yet, but I have been shipping personal projects for years and I optimize for performance, accessibility, and clean architecture.
Currently open to junior roles (web/frontend, with fullstack parts).
Update hero.lead (letzter Satz):
DE anhaengen: Aktuell offen fuer Junior-Rollen im Web Development.
EN anhaengen: Currently open to junior web roles.
Update contact Copy weg von Freelancer-"Briefing":
DE desc: Recruiting oder Projekt? Schreib mir kurz.
DE card: Rolle/Scope + Tech-Stack in 3 Zeilen reichen.
DE cta: Kontakt aufnehmen
EN analog: Recruiting or a project? Send a short message. / Role/scope + tech stack in a few lines is enough. / Get in touch
Meta description anpassen (SEO + recruiter):
DE: Portfolio: Web/Frontend Engineering, Motion Systems und interaktive Demos (3D, Automation, Templates). Offen fuer Junior-Rollen.
EN: Portfolio: web/frontend engineering, motion systems, and interactive demos (3D, automation, templates). Open to junior roles.
globals.css
Entfernen: .status-strip Styles.
Neu: .about Layout:
Grid: links Text, rechts Cards (oder umgekehrt), responsiv auf 1 Spalte.
Kleine Link-Leiste (GitHub + Mail) als Buttons im gleichen Stil wie .ghost/.primary.
5) Fonts: Monument spaeter drop-in, jetzt hochwertige Alternative
User-Entscheid: Monument Extended Assets unsicher.

Dateien:

_app.tsx
globals.css
dld3d-core.css (nur falls Variablen angepasst werden)
_app.tsx
Ersetzen: Orbitron, Fira_Code
Neu (Google Fonts, SOTA/lesbar):
Display/Headings (Monument-Ersatz): Space_Grotesk -> Variable --font-heading
Body: Inter -> Variable --font-body
Mono: JetBrains_Mono -> Variable --font-mono
Kommentar im Code: Monument spaeter via next/font/local als Replacement fuer --font-heading, gleicher CSS-Var Name, damit CSS unveraendert bleibt.
globals.css
body { font-family: var(--font-body), system-ui, sans-serif; }
Terminal/Code-Flair explizit mono:
.terminal-mini, .terminal-body { font-family: var(--font-mono), ui-monospace, monospace; }
Headings/Brand nutzen --font-heading wie bisher.
6) Vendor Sync fuer DLD Core (SOTA DX)
Damit dld3d-core.js bei lokalen Aenderungen nicht stale ist.

Datei: package.json

Scripts:
predev: copy-vendor.mjs
prebuild: copy-vendor.mjs
7) Hygiene: Logs nicht ausliefern
User hat firebase-debug.log in public/pizza/ offen.

Loeschen aus firebase-debug.log (und ggf. Root firebase-debug.log) damit sie lokal nicht aus Versehen deployed/served werden.
Optional: kleiner Clean-Step vor Deploy (z.B. Script, das *.log entfernt).
Tests / QA
Automated

npm run lint
npm run typecheck
npm run build
Manual (DE + EN)

Startseite: Sections, Nav Anchors, Language Toggle behaelt Hash.
Projekte: Cards oeffnen Modal; Links funktionieren.
DLD Modal Demo:
sofort sichtbares Demo-Modell
kein Logo/Watermark
kein Upload-Overlay, kein "Datei auswaehlen"
Dimensionen + Volumen sichtbar
Material/Qualitaet/Stueckzahl aendern aktualisiert Preis
keine "Full viewer" Links/Buttons
/configurator: Placeholder sichtbar, CTA mailto, Meta/CANONICAL korrekt.
sitemap.xml enthaelt /configurator + /en/configurator.
Assumptions / Defaults
Default 3D Modell ist ein intern generierter STL-Wuerfel (demo-cube.stl) als Platzhalter, bis ein finales Modell bereitsteht.
Externe Configurator-URL ist noch nicht live; daher jetzt internal Placeholder + spaeter Redirect via next.config.mjs.
Monument Extended ist noch nicht als Webfont vorhanden; Space Grotesk ist der temporaere Display-Font und kann spaeter 1:1 durch Monument ersetzt werden, ohne CSS-Refactor.