import type { Locale } from '@/content/copy';

export type HomeFocusModeId = 'focus' | 'balanced' | 'velocity';

export type HomeFocusCalculatorCopy = {
  eyebrow: string;
  title: string;
  lead: string;
  contextLabel: string;
  contextUnit: string;
  modeLabel: string;
  modes: { id: HomeFocusModeId; label: string; hint: string }[];
  outputLabel: string;
  outputSub: string;
  narrative: Record<'high' | 'mid' | 'low', string>;
  cta: string;
  ctaNote: string;
  disclaimer: string;
};

const focusCalculator: Record<Locale, HomeFocusCalculatorCopy> = {
  de: {
    eyebrow: 'Interaktiv',
    title: 'Fokus-Projektor',
    lead:
      'Illustratives Modell — kein Garantieversprechen. Wie viel ungebündelter Kontext pro Woche trifft dein Team — und welcher Arbeitsmodus passt dazu? Der Index beschreibt die erwartbare Schärfe pro Review-Runde, nicht Umsatz.',
    contextLabel: 'Kontext-Streuintensität / Woche',
    contextUnit: 'h',
    modeLabel: 'Arbeitsmodus',
    modes: [
      {
        id: 'focus',
        label: 'Fokus',
        hint: 'Wenig Parallelität, harte Priorisierung — wenig Streuverlust.'
      },
      {
        id: 'balanced',
        label: 'Ausbalanciert',
        hint: 'Typisches Produkt-Setup: Scope und WIP im Gleichgewicht.'
      },
      {
        id: 'velocity',
        label: 'Hochtempo',
        hint: 'Viele Fäden / Druck — braucht stärkere Kapselung, sonst fällt der Fokus.'
      }
    ],
    outputLabel: 'Modell-Fokus-Index',
    outputSub: 'je höher, desto schärfer die lieferbaren Chunks pro Iteration (Metapher)',
    narrative: {
      high: 'Erwartbares Bild: schnellere, prüfbare Deltas — vorausgesetzt, die Lieferkette ist gekapselt.',
      mid: 'Erwartbares Bild: stabiler Durchsatz, wenn Review-Gates und Übergabe-Docs sitzen.',
      low: 'Erwartbares Bild: mehr Rückfragen pro Iteration — lohnt sich Invest in klare Pivots & QA.'
    },
    cta: 'Fokus in der Lieferkette besprechen',
    ctaNote: 'Im Intro-Call klären wir, welche Kapselung für dein Setup reicht.',
    disclaimer:
      'Rein illustrativ. Kein Performance-Versprechen, keine Prognose. Entscheidungen im Projekt bleiben stets in Verantwortung deines Teams.'
  },
  en: {
    eyebrow: 'Interactive',
    title: 'Focus projector',
    lead:
      'Illustrative model — not a guarantee. How much unbundled context per week is hitting your team — and which working mode matches? The index describes expected sharpness per review round, not revenue.',
    contextLabel: 'Context scatter intensity / week',
    contextUnit: 'h',
    modeLabel: 'Working mode',
    modes: [
      { id: 'focus', label: 'Focused', hint: 'Low parallelism, strict priority — less scatter loss.' },
      { id: 'balanced', label: 'Balanced', hint: 'Typical product flow: scope and WIP in balance.' },
      { id: 'velocity', label: 'High tempo', hint: 'Many parallel threads — needs tight capsules or focus drops.' }
    ],
    outputLabel: 'Model focus index',
    outputSub: 'higher = sharper, shippable chunks per iteration (metaphor)',
    narrative: {
      high: 'Expected shape: faster, reviewable deltas — when the delivery chain is actually encapsulated.',
      mid: 'Expected shape: steady throughput when review gates and handover docs are in place.',
      low: 'Expected shape: more back-and-forth per iteration — worth investing in clear pivots and QA.'
    },
    cta: 'Discuss focus in your delivery chain',
    ctaNote: 'A short intro call is enough to see which capsule model fits your setup.',
    disclaimer:
      'Illustrative only — not a performance claim or forecast. Project decisions remain with your team.'
  }
};

export type HomeDetailsStripItem = { tag: string; title: string; body: string };

export type HomeDetailsStripCopy = {
  eyebrow: string;
  title: string;
  lead: string;
  items: HomeDetailsStripItem[];
};

const detailsStrip: Record<Locale, HomeDetailsStripCopy> = {
  de: {
    eyebrow: 'Feinschliff',
    title: 'Details, die den Unterschied machen',
    lead:
      'Klein, aber spürbar — dieselbe Sorgfalt, die man auf einer Trading-Oberfläche bei Mikro-Interaktionen sieht, übersetzt in B2B-Delivery: schnelle Einstiegspfade, sichtbare Qualität, klare Leitplanken.',
    items: [
      {
        tag: 'Einstieg',
        title: 'Direkter Intro-Call',
        body: '15 Minuten, klarer Slot, keine Vertriebs-Pipeline. Du bringst Ziel & Engpass mit, ich liefere einen sinnvollen Start.'
      },
      {
        tag: 'Artefakt',
        title: 'B2B-Checkliste per Lead-Magnet',
        body: 'Launch-Readiness in einer Datei: Performance, Tracking, Rechtliches, Übergabe — als greifbares Ergebnis, nicht Floskel.'
      },
      {
        tag: 'Sichtbar',
        title: 'QA, die man sieht',
        body: 'Lint, Unit, E2E: dieselben Gates, die ich erwähne, hängen auch an der Pipeline — Reproduzierbarkeit statt “vertrau mir”.'
      },
      {
        tag: 'Ort',
        title: 'Remote, verwurzelt im Rhein-Neckar-Cluster',
        body: 'Remote-first, EU-freundliche Zeiten, klare Doku- und Review-Kultur — so bleibt Standort vorteil, nicht Hindernis.'
      },
      {
        tag: 'Stack',
        title: 'Aktueller, belegbarer Stack',
        body: 'Next.js-App, TypeScript streng, Design-Tokens, Cache-Strategie mit Absicht — alles, was die Startseite selbst zeigt, ist echter Kontext.'
      }
    ]
  },
  en: {
    eyebrow: 'Finishing',
    title: 'Details that compound',
    lead:
      'Small things that add up — the same micro-craft you notice on a polished product surface, translated to B2B: fast entry, visible quality, clear guardrails.',
    items: [
      {
        tag: 'Entry',
        title: 'Direct intro call',
        body: '15 minutes, a clear window, no sales theater. You share goal and constraint; I return a practical starting path.'
      },
      {
        tag: 'Artefact',
        title: 'B2B checklist as a lead magnet',
        body: 'Launch readiness in one file: performance, tracking, legal basics, handover — tangible, not a slogan.'
      },
      {
        tag: 'Visible',
        title: 'QA you can see',
        body: 'Lint, unit, e2e: the same gates I talk about are wired in CI — repeatability, not “trust me”.'
      },
      {
        tag: 'Place',
        title: 'Remote, rooted in the Rhein–Neckar region',
        body: 'Remote-first, EU-friendly hours, clear docs and review culture — location becomes strength, not friction.'
      },
      {
        tag: 'Stack',
        title: 'Current, demonstrable stack',
        body: 'The Next.js app, strict TS, design tokens, intentional caching — the homepage is itself a proof surface.'
      }
    ]
  }
};

export function getHomeFocusCalculatorCopy(locale: Locale): HomeFocusCalculatorCopy {
  return focusCalculator[locale];
}

export function getHomeDetailsStripCopy(locale: Locale): HomeDetailsStripCopy {
  return detailsStrip[locale];
}
