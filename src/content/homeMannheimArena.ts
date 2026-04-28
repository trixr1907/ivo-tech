import type { Locale } from '@/content/copy';

export type HomeMannheimArenaCopy = {
  eyebrow: string;
  title: string;
  lead: string;
  foot: string;
  reducedNote: string;
};

const copy: Record<Locale, HomeMannheimArenaCopy> = {
  de: {
    eyebrow: 'Mannheim · Hommage',
    title: 'Carl-Benz-Stadion — als lebendes Mesh',
    lead:
      'Prozedurales 3D-Drahtgitter & Partikel, inspiriert von der Trichter-Geometrie eines Fußballstadions — farblich nachempfunden (Waldhof-Blau, kein offizielles Asset). Kein 1:1-Modell, sondern technische Stimmung: Leinwand, Lichter, Publikumslärm in Shadern übersetzt.',
    foot: 'WebGL, nur wenn dein Gerät mitspielt. Sonst: reduzierte Darstellung. Kein Sponsoring, keine offizielle Verbindung zum Verein — nur Fankultur & Regionalstolz.',
    reducedNote: '3D-Animation abgeschaltet (reduzierte Bewegung).'
  },
  en: {
    eyebrow: 'Mannheim · Homage',
    title: 'Carl-Benz-Stadium — as a live mesh',
    lead:
      'Procedural 3D wireframe and particles inspired by a football bowl geometry — color nods to SV Waldhof Mannheim fandom (not an official model). Not a 1:1 scan: a technical mood — floodlights, crowd energy, translated to GPU-friendly motion.',
    foot: 'WebGL only when your device can handle it; otherwise a lighter fallback. No sponsorship or official club link — just regional pride and craft.',
    reducedNote: '3D animation off (reduced motion preference).'
  }
};

export function getHomeMannheimArenaCopy(locale: Locale): HomeMannheimArenaCopy {
  return copy[locale];
}
