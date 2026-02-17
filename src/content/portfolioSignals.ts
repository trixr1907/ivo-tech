import type { Locale } from '@/content/copy';

export type SignalType = 'ai_automation_core' | 'product_engineering_reference' | 'internal_only';

export type StackProof = {
  label: Record<Locale, string>;
  one_liner: Record<Locale, string>;
  href: string;
  signal_type: SignalType;
  external?: boolean;
};

// Public proof used inside the Tech-Stack section (not a project card).
export const stackProofs: StackProof[] = [
  {
    label: {
      de: 'UI Template Reference (Luna Rossa)',
      en: 'UI template reference (Luna Rossa)'
    },
    one_liner: {
      de: 'Frontend-Template mit responsivem UX-Flow, Modal-Interaktionen und a11y-orientierter Navigation.',
      en: 'Frontend template with responsive UX flow, modal interactions, and accessibility-oriented navigation.'
    },
    href: '/pizza/',
    signal_type: 'product_engineering_reference'
  }
];

export type InternalSignal = {
  id: string;
  title: string;
  signal_type: 'internal_only';
  source_path: string;
  reason: Record<Locale, string>;
  interview_note: Record<Locale, string>;
};

// Internal-only content register. Not used in public project feeds.
export const internalSignals: InternalSignal[] = [
  {
    id: 'technik',
    title: 'Homelab / Technik Doku',
    signal_type: 'internal_only',
    source_path: 'C:/Users/Ivo/Documents/technik',
    reason: {
      de: 'Infrastruktur- und host-spezifische Betriebsdoku mit hohem Detailgrad; oeffentlich als Projekt zu noisy.',
      en: 'Infrastructure and host-specific operations documentation with high detail; too noisy as a public project.'
    },
    interview_note: {
      de: 'Nur auf Anfrage als kompakter Reliability-Snapshot im Interview zeigen.',
      en: 'Show only on request as a compact reliability snapshot during interviews.'
    }
  }
];

export function getStackProofBySignal(signal: Exclude<SignalType, 'internal_only'>): StackProof | null {
  return stackProofs.find((proof) => proof.signal_type === signal) ?? null;
}
