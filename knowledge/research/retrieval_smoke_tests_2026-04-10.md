# Retrieval Smoke Tests - 2026-04-10

Source chunk file:
- knowledge/chunks/2026-04-10_combined_plus_benchmarks_semantic_chunks_auto.jsonl

Retriever version notes:
- intent-aware semantic weighting enabled
- diversity cap via --maxPerSemantic (default: 2)

## Query 1: Website Audit

```json
{
  "query": "homepage audit schwächen cta trust klarheit",
  "file": "knowledge/chunks/2026-04-10_combined_plus_benchmarks_semantic_chunks_auto.jsonl",
  "maxPerSemantic": 2,
  "results": [
    {
      "chunk_id": "ch_6984a04c2589",
      "document_id": "doc_src_ivo_live__home",
      "source_id": "src_ivo_live__home",
      "version": "2026-04-10",
      "language": "de",
      "semantic_type": "trust_signal",
      "text": "Trusted Context S SaaS Plattform I Industrial Tech D Digital Product Studio B B2B Services SaaS Plattform Industrial Tech Digital Product Studio B2B Services QA Gates Telemetry Speed Budget Operational Readiness SaaS Plattform Industrial Tech Digital Product Studio B2B Services QA Gates Telemetry Speed Budget Operational Readiness Proof Module Labs Systems Proof Module Voicebot Flows Proof Module Realtime Dashboards < 10 Tage Typisches Projekt-Setup 95+ Lighthouse Performance Ziel 3+ Segmente B2B-Kontexte aus realer Delivery “ Der Proof-Block zeigt nur verifizierbare Referenzen. Kundenstimmen werden erst nach expliziter Freigabe veroeffentlicht. ” ivo-tech · Editorial trust note · Operational policy Branchenkontext: SaaS Plattform · Industrial Tech · Digital Product Studio · B2B Services",
      "source_excerpt": "Trusted Context S SaaS Plattform I Industrial Tech D Digital Product Studio B B2B Services SaaS Plattform Industrial Tech Digital Product Studio B2B Services QA",
      "source_anchor": "section_3",
      "token_estimate": 143,
      "confidence": 0.94,
      "evidence_strength": "strong",
      "tags": [
        "proof_bar",
        "trust_signal"
      ],
      "entities": [],
      "score": 5.28
    },
    {
      "chunk_id": "ch_14e5ca7def5c",
      "document_id": "doc_src_ivo_live__home",
      "source_id": "src_ivo_live__home",
      "version": "2026-04-10",
      "language": "de",
      "semantic_type": "trust_signal",
      "text": "Referenzen & Trust Entscheider:innen vertrauen auf nachvollziehbare Delivery. Statt reiner Design-Versprechen zeigen reale Build-Artefakte belastbare Signale aus Umsetzung, Zusammenarbeit und Ergebnisqualitaet. Vertrauenselemente Reale Projekt- und Delivery-Signale aus bestehenden Umsetzungen. 3D-Konfigurator fuer Datei-zu-Angebot-Workflows im Live-Betrieb Live THREE.JS / WEBGL | WORDPRESS PLUGIN | PRICING ENGINE | WOOCOMMERCE Voicebot Einwilligungs-Orchestrator Private Beta FASTAPI | SPEECH API | TWILIO | ORCHESTRATION Sorare NBA Edge Tool In Entwicklung NEXT.JS | FASTAPI | PYTHON | OR-TOOLS Kundenstimme “ Der Proof-Block zeigt nur verifizierbare Referenzen. Kundenstimmen werden erst nach expliziter Freigabe veroeffentlicht. ” ivo-tech · Editorial trust note · Operational policy Kundenfreigaben in Arbeit Live-Referenz: 3D-Konfigurator im Kundenbetrieb Produktive Datei-zu-Preis-Strecke m",
      "source_excerpt": "Entscheider:innen vertrauen auf nachvollziehbare Delivery.",
      "source_anchor": "trust",
      "token_estimate": 137,
      "confidence": 0.94,
      "evidence_strength": "strong",
      "tags": [
        "trust",
        "trust_signal"
      ],
      "entities": [],
      "score": 5.28
    },
    {
      "chunk_id": "ch_0107761ad206",
      "document_id": "doc_src_ivo_live__home",
      "source_id": "src_ivo_live__home",
      "version": "2026-04-10",
      "language": "de",
      "semantic_type": "cta",
      "text": "Kontakt (/contact?source=primary-nav)",
      "source_excerpt": "Kontakt",
      "source_anchor": "/contact?source=primary-nav",
      "token_estimate": 3,
      "confidence": 0.92,
      "evidence_strength": "strong",
      "tags": [
        "cta"
      ],
      "entities": [],
      "score": 2.82
    },
    {
      "chunk_id": "ch_416cb0dd511a",
      "document_id": "doc_src_ivo_live__home",
      "source_id": "src_ivo_live__home",
      "version": "2026-04-10",
      "language": "de",
      "semantic_type": "cta",
      "text": "Erstgespräch starten (/contact?source=home-hero-primary)",
      "source_excerpt": "Erstgespräch starten",
      "source_anchor": "/contact?source=home-hero-primary",
      "token_estimate": 4,
      "confidence": 0.92,
      "evidence_strength": "strong",
      "tags": [
        "cta"
      ],
      "entities": [],
      "score": 2.82
    },
    {
      "chunk_id": "ch_9eb4a9a3d79b",
      "document_id": "doc_src_ivo_live__projects",
      "source_id": "src_ivo_live__projects",
      "version": "2026-04-10",
      "language": "de",
      "semantic_type": "other",
      "text": "Professional Track LIVE Authority-first Portfolio Relaunch Von reiner Projektsammlung zu strukturierter Positionierung mit klarer Entscheidungsfuehrung. Strukturierteres Trust-Signal fuer Hiring- und Collaboration-Entscheider. Stack Next.js TypeScript Design Tokens Analytics Case Study lesen BETA Voicebot Consent Orchestrator Mehrstufige Sprach- und Prozessfuehrung fuer nachvollziehbare Einwilligungsablaufe. Klarere Consent-Kette mit besserem Audit-Trail. Stack LLM Orchestration FastAPI State Machine Projektuebersicht",
      "source_excerpt": "Professional Track",
      "source_anchor": "section_2",
      "token_estimate": 69,
      "confidence": 0.82,
      "evidence_strength": "medium",
      "tags": [
        "other",
        "other"
      ],
      "entities": [],
      "score": 1.82
    }
  ]
}
```

## Query 2: Hero Redesign

```json
{
  "query": "hero value proposition premium design conversion",
  "file": "knowledge/chunks/2026-04-10_combined_plus_benchmarks_semantic_chunks_auto.jsonl",
  "maxPerSemantic": 2,
  "results": [
    {
      "chunk_id": "ch_3e4c3ad14952",
      "document_id": "doc_src_ivo_preview__home",
      "source_id": "src_ivo_preview__home",
      "version": "2026-04-10-preview",
      "language": "de",
      "semantic_type": "hero_value_prop",
      "text": "Hero-Projekt: 3D-Konfigurator als Tech-Referenz Ein Projektbeispiel mit klarer Ausgangslage, technischer Umsetzung und operativem Ergebnis. Live 3D-Konfigurator fuer Datei-zu-Angebot-Workflows im Live-Betrieb THREE.JS WORDPRESS WOOCOMMERCE DOCKER Ich habe einen produktionsfaehigen 3D-Konfigurator fuer Datei-zu-Angebot-Workflows entwickelt: Upload, Geometrie-Analyse, Preislogik und WooCommerce-Handoff in einem durchgaengigen Web-Flow. Das System reduziert manuelle Rueckfrage-Schleifen bei Standardanfragen und schafft einen klaren Pfad von Modellpruefung zu Kaufentscheidung. Der Live-Flow von Upload bis Checkout laeuft stabil im realen Shopbetrieb. Technische Umsetzung: ivo-tech. Betrieb und Vermarktung erfolgen beim Kunden. Engineering Snapshot WebGL-/Three.js-Viewer mit STL/3MF Upload und interaktiver Modellinspektion. WordPress Plugin-Architektur mit AJAX-Endpunkten fuer Analyse- und Pr",
      "source_excerpt": "Hero-Projekt: 3D-Konfigurator als Tech-Referenz",
      "source_anchor": "hero-case",
      "token_estimate": 123,
      "confidence": 0.97,
      "evidence_strength": "strong",
      "tags": [
        "hero",
        "hero_value_prop"
      ],
      "entities": [],
      "score": 5.706
    },
    {
      "chunk_id": "ch_07f22040cb2d",
      "document_id": "doc_src_ivo_preview__en",
      "source_id": "src_ivo_preview__en",
      "version": "2026-04-10-preview",
      "language": "en",
      "semantic_type": "hero_value_prop",
      "text": "Hero project: 3D configurator as a technical reference A project example with clear context, technical implementation, and operational impact. Live 3D configurator for live file-to-quote workflows THREE.JS WORDPRESS WOOCOMMERCE DOCKER I built a production-ready 3D configurator for file-to-quote workflows: upload, geometry analysis, pricing logic, and WooCommerce handoff in one continuous web flow. The system reduces manual back-and-forth for standard requests and creates a clear path from model review to purchase decision. The live flow from upload to checkout runs stably in production shop operations. Technical implementation by ivo-tech. Platform operations and commercial ownership remain with the client. Engineering snapshot WebGL/Three.js viewer with STL/3MF upload and interactive model inspection. WordPress plugin architecture with AJAX endpoints for analysis and pricing context. Pr",
      "source_excerpt": "Hero project: 3D configurator as a technical reference",
      "source_anchor": "hero-case",
      "token_estimate": 156,
      "confidence": 0.97,
      "evidence_strength": "strong",
      "tags": [
        "hero",
        "hero_value_prop"
      ],
      "entities": [],
      "score": 5.706
    },
    {
      "chunk_id": "ch_c1b78b2b2890",
      "document_id": "doc_src_ivo_live__leistungen",
      "source_id": "src_ivo_live__leistungen",
      "version": "2026-04-10",
      "language": "de",
      "semantic_type": "service_offer",
      "text": "Leistungen: Technical Delivery für conversion-kritische B2B-Webseiten Klare Informationsarchitektur, robustes Frontend-Engineering und verlässliche Delivery-Gates für Teams, die professionell shippen und stabil betreiben müssen. Scope-Call anfragen Case Studies ansehen Playbook lesen 1) Positionierung und IA Wir schärfen Angebotsklarheit und Nutzerführung entlang realer Entscheiderpfade. Value Proposition und Messaging-Stack Above-the-fold Struktur mit klarer CTA-Hierarchie Informationsarchitektur für Home, Services und Cases 2) UI-System und Implementierung Aus Design wird ein belastbares, skalierbares Frontend-System. Komponentenbasiertes UI mit Tokens Responsive und barrierearme Umsetzung Saubere technische Baseline für Iteration ohne Redesign-Drift 3) Qualität, Betrieb und Handover Delivery endet nicht beim Go-live, sondern beim sicheren Team-Weiterbetrieb. QA-Gates für Releases Mess",
      "source_excerpt": "Leistungen: Technical Delivery für conversion-kritische B2B-Webseiten",
      "source_anchor": "services-main",
      "token_estimate": 130,
      "confidence": 0.93,
      "evidence_strength": "strong",
      "tags": [
        "services",
        "service_offer"
      ],
      "entities": [],
      "score": 2.93
    },
    {
      "chunk_id": "ch_b08a0887af24",
      "document_id": "doc_src_ivo_live__en_services",
      "source_id": "src_ivo_live__en_services",
      "version": "2026-04-10",
      "language": "en",
      "semantic_type": "service_offer",
      "text": "Services: Technical delivery for conversion-critical B2B websites Clear information architecture, robust frontend engineering, and reliable delivery gates for teams that need to ship confidently and operate sustainably. Request scope call View case studies Read playbook 1) Positioning and IA We sharpen offer clarity and user flow across real buyer journeys. Value proposition and message hierarchy Above-the-fold structure with clear CTA levels Information architecture for home, services, and case studies 2) UI system and implementation Design direction becomes a durable frontend system. Token-driven component architecture Responsive and accessibility-aware implementation Stable baseline for fast iteration without design drift 3) Quality, operations, and handover Delivery only counts when your team can run and extend it safely. Release QA gates Measurable Core Web Vitals guardrails Documen",
      "source_excerpt": "Services: Technical delivery for conversion-critical B2B websites",
      "source_anchor": "services-main",
      "token_estimate": 159,
      "confidence": 0.93,
      "evidence_strength": "strong",
      "tags": [
        "services",
        "service_offer"
      ],
      "entities": [],
      "score": 2.93
    },
    {
      "chunk_id": "ch_3f7c00bd1715",
      "document_id": "doc_src_ivo_live__leistungen_web_engineering_delivery",
      "source_id": "src_ivo_live__leistungen_web_engineering_delivery",
      "version": "2026-04-10",
      "language": "de",
      "semantic_type": "faq",
      "text": "FAQ Wie schnell ist ein erstes Delivery-Paket umsetzbar? Typisch ist ein erstes, belastbares Paket in 2 bis 3 Wochen, je nach Content-Reife und Freigabegeschwindigkeit. Funktioniert das auch mit bestehendem Design? Ja. Bestehende Assets koennen in ein sauberes Komponenten- und Strukturmodell ueberfuehrt werden. Wie wird Qualitaet abgesichert? Durch feste QA-Gates fuer Struktur, Accessibility, Performance und Conversion-Pfade vor jedem Release.",
      "source_excerpt": "FAQ",
      "source_anchor": "section_8",
      "token_estimate": 76,
      "confidence": 0.9,
      "evidence_strength": "strong",
      "tags": [
        "faq",
        "faq"
      ],
      "entities": [],
      "score": 1.9
    }
  ]
}
```

## Query 3: Trust / Social Proof (trust_signal only)

```json
{
  "query": "trust social proof testimonials credibility",
  "file": "knowledge/chunks/2026-04-10_combined_plus_benchmarks_semantic_chunks_auto.jsonl",
  "maxPerSemantic": 2,
  "results": [
    {
      "chunk_id": "ch_069bdfd01372",
      "document_id": "doc_src_ivo_live__en",
      "source_id": "src_ivo_live__en",
      "version": "2026-04-10",
      "language": "en",
      "semantic_type": "trust_signal",
      "text": "Trusted context S SaaS Platform I Industrial Tech D Digital Product Studio B B2B Services SaaS Platform Industrial Tech Digital Product Studio B2B Services QA gates Telemetry Speed budget Operational readiness SaaS Platform Industrial Tech Digital Product Studio B2B Services QA gates Telemetry Speed budget Operational readiness Proof module Labs systems Proof module Voicebot flows Proof module Realtime dashboards < 10 days Typical project kickoff 95+ Lighthouse performance target 3+ segments B2B contexts from real delivery “ The proof block only shows verifiable references. Client testimonials are published only after explicit approval. ” ivo-tech · Editorial trust note · Operational policy Industry context: SaaS Platform · Industrial Tech · Digital Product Studio · B2B Services",
      "source_excerpt": "Trusted context S SaaS Platform I Industrial Tech D Digital Product Studio B B2B Services SaaS Platform Industrial Tech Digital Product Studio B2B Services QA g",
      "source_anchor": "section_3",
      "token_estimate": 150,
      "confidence": 0.94,
      "evidence_strength": "strong",
      "tags": [
        "proof_bar",
        "trust_signal"
      ],
      "entities": [],
      "score": 7.88
    },
    {
      "chunk_id": "ch_933c607db515",
      "document_id": "doc_src_ivo_live__en",
      "source_id": "src_ivo_live__en",
      "version": "2026-04-10",
      "language": "en",
      "semantic_type": "trust_signal",
      "text": "Proof Teams trust delivery they can verify. We show concrete quality signals across execution, collaboration, and outcomes. Trust elements Real project and delivery signals from existing implementations. 3D configurator for live file-to-quote workflows Live THREE.JS / WEBGL | WORDPRESS PLUGIN | PRICING ENGINE | WOOCOMMERCE Voicebot consent orchestrator Private beta FASTAPI | SPEECH API | TWILIO | ORCHESTRATION Sorare NBA Edge Tool In development NEXT.JS | FASTAPI | PYTHON | OR-TOOLS Client signal “ The proof block only shows verifiable references. Client testimonials are published only after explicit approval. ” ivo-tech · Editorial trust note · Operational policy Client approvals in progress Live reference: 3D configurator in client production Production file-to-price flow with checkout handoff as public proof. Public proof: GitHub build history and release artifacts Transparent commits",
      "source_excerpt": "Teams trust delivery they can verify.",
      "source_anchor": "trust",
      "token_estimate": 167,
      "confidence": 0.94,
      "evidence_strength": "strong",
      "tags": [
        "trust",
        "trust_signal"
      ],
      "entities": [],
      "score": 7.88
    },
    {
      "chunk_id": "ch_6984a04c2589",
      "document_id": "doc_src_ivo_live__home",
      "source_id": "src_ivo_live__home",
      "version": "2026-04-10",
      "language": "de",
      "semantic_type": "trust_signal",
      "text": "Trusted Context S SaaS Plattform I Industrial Tech D Digital Product Studio B B2B Services SaaS Plattform Industrial Tech Digital Product Studio B2B Services QA Gates Telemetry Speed Budget Operational Readiness SaaS Plattform Industrial Tech Digital Product Studio B2B Services QA Gates Telemetry Speed Budget Operational Readiness Proof Module Labs Systems Proof Module Voicebot Flows Proof Module Realtime Dashboards < 10 Tage Typisches Projekt-Setup 95+ Lighthouse Performance Ziel 3+ Segmente B2B-Kontexte aus realer Delivery “ Der Proof-Block zeigt nur verifizierbare Referenzen. Kundenstimmen werden erst nach expliziter Freigabe veroeffentlicht. ” ivo-tech · Editorial trust note · Operational policy Branchenkontext: SaaS Plattform · Industrial Tech · Digital Product Studio · B2B Services",
      "source_excerpt": "Trusted Context S SaaS Plattform I Industrial Tech D Digital Product Studio B B2B Services SaaS Plattform Industrial Tech Digital Product Studio B2B Services QA",
      "source_anchor": "section_3",
      "token_estimate": 143,
      "confidence": 0.94,
      "evidence_strength": "strong",
      "tags": [
        "proof_bar",
        "trust_signal"
      ],
      "entities": [],
      "score": 6.68
    },
    {
      "chunk_id": "ch_14e5ca7def5c",
      "document_id": "doc_src_ivo_live__home",
      "source_id": "src_ivo_live__home",
      "version": "2026-04-10",
      "language": "de",
      "semantic_type": "trust_signal",
      "text": "Referenzen & Trust Entscheider:innen vertrauen auf nachvollziehbare Delivery. Statt reiner Design-Versprechen zeigen reale Build-Artefakte belastbare Signale aus Umsetzung, Zusammenarbeit und Ergebnisqualitaet. Vertrauenselemente Reale Projekt- und Delivery-Signale aus bestehenden Umsetzungen. 3D-Konfigurator fuer Datei-zu-Angebot-Workflows im Live-Betrieb Live THREE.JS / WEBGL | WORDPRESS PLUGIN | PRICING ENGINE | WOOCOMMERCE Voicebot Einwilligungs-Orchestrator Private Beta FASTAPI | SPEECH API | TWILIO | ORCHESTRATION Sorare NBA Edge Tool In Entwicklung NEXT.JS | FASTAPI | PYTHON | OR-TOOLS Kundenstimme “ Der Proof-Block zeigt nur verifizierbare Referenzen. Kundenstimmen werden erst nach expliziter Freigabe veroeffentlicht. ” ivo-tech · Editorial trust note · Operational policy Kundenfreigaben in Arbeit Live-Referenz: 3D-Konfigurator im Kundenbetrieb Produktive Datei-zu-Preis-Strecke m",
      "source_excerpt": "Entscheider:innen vertrauen auf nachvollziehbare Delivery.",
      "source_anchor": "trust",
      "token_estimate": 137,
      "confidence": 0.94,
      "evidence_strength": "strong",
      "tags": [
        "trust",
        "trust_signal"
      ],
      "entities": [],
      "score": 6.68
    },
    {
      "chunk_id": "ch_8af551bc93be",
      "document_id": "doc_src_ivo_live__configurator",
      "source_id": "src_ivo_live__configurator",
      "version": "2026-04-10",
      "language": "de",
      "semantic_type": "trust_signal",
      "text": "Premium Case Study 3D-Konfigurator als Tech-Referenz Ich habe einen produktionsfaehigen 3D-Konfigurator fuer Datei-zu-Angebot-Workflows entwickelt: Upload, Geometrie-Analyse, Preislogik und WooCommerce-Handoff in einem durchgaengigen Web-Flow. Technische Umsetzung: ivo-tech. Betrieb und Vermarktung erfolgen beim Kunden. Live beim Kunden oeffnen Erstgespraech anfragen",
      "source_excerpt": "3D-Konfigurator als Tech-Referenz",
      "source_anchor": "section_1",
      "token_estimate": 50,
      "confidence": 0.94,
      "evidence_strength": "strong",
      "tags": [
        "trust",
        "trust_signal"
      ],
      "entities": [],
      "score": 5.48
    }
  ]
}
```
