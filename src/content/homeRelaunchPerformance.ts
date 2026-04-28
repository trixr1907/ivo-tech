import type { Locale } from '@/content/copy';

export type HomePerformanceCopy = {
  eyebrow: string;
  title: string;
  lead: string;
  webBlockTitle: string;
  webBlockSub: string;
  stats: { label: string; value: string; hint: string }[];
  footnote: string;
};

const performance: Record<Locale, HomePerformanceCopy> = {
  de: {
    eyebrow: 'Live-Surface',
    title: 'Performance als sichtbares Signal',
    lead:
      'Canvas-Raster: Stimmung & Rhythmus — ohne Kursimplikation. Darunter: echte Spot-Referenzpreise für Bitcoin und Ethereum (öffentliche API, umgerechnet: DE in EUR, EN in USD), grob alle ~90s aktualisiert. Anschließend: die Web-Metriken, an denen ich Delivery messe.',
    webBlockTitle: 'Web-Metriken (Portfolio-Ziele)',
    webBlockSub: 'Nicht Börse — sondern belastbare Website-Lieferung. Dieselben Leitwerte, die im Repo und in CI sichtbar bleiben sollen.',
    stats: [
      { label: 'LCP-Ziel', value: '< 2,5s', hint: 'Richtwert — je nach Content' },
      { label: 'CLS', value: '≈ 0', hint: 'Layout-Stabilität bewusst im Design' },
      { label: 'Lighthouse', value: '95+', hint: 'wie auf der Seite kommuniziert' }
    ],
    footnote:
      'Krypto: Echtzeit-Spot grob, nur zur Orientierung; keine Orderbuch-Tiefe, kein Anlage- oder Trading-Rat, keine Gewähr. Web-Ziele: wie kommuniziert, projektabhängig. Chart: dekoratives Browser-Motiv.'
  },
  en: {
    eyebrow: 'Live surface',
    title: 'Performance as a visible signal',
    lead:
      'The canvas: mood and motion — not a market claim. Below: real live spot reference prices for Bitcoin and Ethereum (public API; DE in EUR, EN in USD), refreshed about every 90s. After that: the web metrics I optimize for in delivery work.',
    webBlockTitle: 'Web metrics (portfolio targets)',
    webBlockSub: 'Not an exchange target — a durable site bar. The same numbers you can align with in CI and releases.',
    stats: [
      { label: 'LCP target', value: '< 2.5s', hint: 'guideline — depends on content' },
      { label: 'CLS', value: '≈ 0', hint: 'layout stability by design' },
      { label: 'Lighthouse', value: '95+', hint: 'as stated on the site' }
    ],
    footnote:
      'Crypto: indicative spot only for orientation; not order-book depth, not financial advice, no warranty. Web targets: as communicated, project-dependent. Chart: decorative browser background.'
  }
};

export type HomeCryptoStripCopy = {
  cryptoBlockTitle: string;
  cryptoBlockSub: string;
  change24h: string;
  updated: string;
  source: string;
  loading: string;
  error: string;
};

const cryptoStrip: Record<Locale, HomeCryptoStripCopy> = {
  de: {
    cryptoBlockTitle: 'Echtzeit-Spot (Referenz)',
    cryptoBlockSub: 'Kurse von CoinGecko, nur Anzeige — deine Orders laufen woanders ;)',
    change24h: '24h',
    updated: 'Stand',
    source: 'Quelle: CoinGecko public API — Preise ungebunden, zzgl. Netz/API-Verzögerung.',
    loading: 'Kurse werden geladen',
    error: 'Kursdaten sind gerade nicht erreichbar. Seite neu laden oder später erneut versuchen.'
  },
  en: {
    cryptoBlockTitle: 'Live spot (reference)',
    cryptoBlockSub: 'Feed via CoinGecko, display only — your orders live elsewhere.',
    change24h: '24h',
    updated: 'As of',
    source: 'Source: CoinGecko public API — indicative prices, subject to network/API delay.',
    loading: 'Loading quotes',
    error: 'Quotes are temporarily unavailable. Reload or try again in a moment.'
  }
};

export function getHomeCryptoStripCopy(locale: Locale): HomeCryptoStripCopy {
  return cryptoStrip[locale];
}

export type HomeDetailsMicroCopy = {
  title: string;
  hint: string;
  levels: { id: 'focus' | 'error' | 'warning'; label: string }[];
  actionTitle: string;
  actions: { id: 'click' | 'hover'; label: string }[];
  panelLabel: string;
  microCopy: Record<'focus' | 'error' | 'warning', string>;
};

const micro: Record<Locale, HomeDetailsMicroCopy> = {
  de: {
    title: 'Mikro-Zustände',
    hint: 'Wie fühlt sich die Oberfläche an, wenn etwas danebengeht? — dieselbe Rücksicht, die man von Trading-UIs kennt: Focus-Ringe, Fehler- und Warnzustände, die testbar bleiben.',
    levels: [
      { id: 'focus', label: 'Focus' },
      { id: 'error', label: 'Error' },
      { id: 'warning', label: 'Warning' }
    ],
    actionTitle: 'Interaktion',
    actions: [
      { id: 'click', label: 'Click' },
      { id: 'hover', label: 'Hover' }
    ],
    panelLabel: 'Vorschau',
    microCopy: {
      focus: 'Fokus: sichtbarer Ring, Tastatur-Pfad klar. Kein „pretty but invisible“.',
      error: 'Fehler: kontraststark, ohne Panik-Overlay — reproduzierbar in E2E.',
      warning: 'Warning: auffällig, aber kein Blocker — Team kann priorisieren.'
    }
  },
  en: {
    title: 'Micro states',
    hint: "How the surface feels when something breaks — the same care you get from pro trading UIs: focus rings, error and warning patterns that stay testable.",
    levels: [
      { id: 'focus', label: 'Focus' },
      { id: 'error', label: 'Error' },
      { id: 'warning', label: 'Warning' }
    ],
    actionTitle: 'Interaction',
    actions: [
      { id: 'click', label: 'Click' },
      { id: 'hover', label: 'Hover' }
    ],
    panelLabel: 'Preview',
    microCopy: {
      focus: 'Focus: clear ring, keyboard path obvious — not just pretty.',
      error: 'Error: high contrast, no panic screen — still reproducible in e2e.',
      warning: 'Warning: visible but not a hard blocker — the team can prioritize.'
    }
  }
};

export type HomeReferralCardCopy = {
  tag: string;
  title: string;
  body: string;
};

const referral: Record<Locale, HomeReferralCardCopy> = {
  de: {
    tag: 'Netzwerk',
    title: 'Empfehlung mit klarem Setup',
    body:
      'Kennst du ein Team, dem dieser Stack und diese Arbeitsweise wirklich helfen? Dann lass uns sprechen: Einführung statt kaltem Lead — und klare Erwartung auf beiden Seiten. (Kein Affiliate-Layer, sondern ehrliches Matchmaking.)'
  },
  en: {
    tag: 'Network',
    title: 'Referrals with a clear brief',
    body:
      'Know a team where this stack and working style are a real fit? Let us talk: an intro, not a cold handoff — and clear expectations on both sides. (No affiliate gimmicks — just honest matchmaking.)'
  }
};

export function getHomePerformanceCopy(locale: Locale): HomePerformanceCopy {
  return performance[locale];
}

export function getHomeDetailsMicroCopy(locale: Locale): HomeDetailsMicroCopy {
  return micro[locale];
}

export function getHomeReferralCardCopy(locale: Locale): HomeReferralCardCopy {
  return referral[locale];
}
