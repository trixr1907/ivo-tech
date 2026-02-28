export type LogoMotionMode = 'full' | 'reduced' | 'off';
export type LogoMotionTheme = 'dark' | 'light' | 'mono';
export type LogoMotionTier = 'tier1' | 'tier2' | 'tier3';

type HoverOptions = {
  mobileTapBoost?: boolean;
};

const DURATION = {
  tier1: { mark: 420, word: 360, flow: 640 },
  tier2: { mark: 650, word: 420, flow: 760 },
  tier3: { mark: 760, word: 520, flow: 920 }
} as const;

const EASING_STANDARD = 'cubic-bezier(0.22, 1, 0.36, 1)';
const EASING_TECH = 'cubic-bezier(0.4, 0, 0.2, 1)';

let motionMode: LogoMotionMode = 'full';

function isReducePreferenceActive() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
}

function resolveMode() {
  if (motionMode === 'off') return 'off';
  if (motionMode === 'reduced' || isReducePreferenceActive()) return 'reduced';
  return 'full';
}

function animateIfSupported(
  node: Element,
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions,
  fallbackClassName: string
) {
  if (typeof (node as HTMLElement).animate === 'function') {
    (node as HTMLElement).animate(keyframes, options);
  } else {
    (node as HTMLElement).classList.add(fallbackClassName);
  }
}

function tryPlayLottie(host: HTMLElement, theme: LogoMotionTheme, mode: LogoMotionMode) {
  const player = host.querySelector('dotlottie-player[data-logo-lottie]') as
    | (HTMLElement & { play?: () => void; stop?: () => void })
    | null;
  if (!player) return false;

  const source =
    player.getAttribute(`data-src-${theme}`) ??
    player.getAttribute('data-src-dark') ??
    player.getAttribute('data-src') ??
    '';
  if (source) {
    player.setAttribute('src', source);
  }

  if (mode === 'off') {
    player.stop?.();
  } else {
    player.play?.();
  }

  return true;
}

export function setLogoMotionMode(mode: LogoMotionMode) {
  motionMode = mode;
}

export async function playLogoReveal(target: Element, tier: LogoMotionTier = 'tier1', theme: LogoMotionTheme = 'dark') {
  const mode = resolveMode();
  const host = target as HTMLElement;
  const mark = host.querySelector('.brand-lockup-mark');
  const wordmark = host.querySelector('.brand-lockup-wordmark');
  const flowPath = host.querySelector('.brand-lockup-flow-path') as SVGPathElement | null;
  const hasLottie = tryPlayLottie(host, theme, mode);

  host.dataset.logoTheme = theme;
  host.dataset.logoTier = tier;
  host.classList.remove('is-logo-ready');
  host.classList.remove('is-logo-reveal-fallback');

  if (mode === 'off') {
    host.classList.add('is-logo-ready');
    return;
  }

  if (mark) {
    const markDuration = mode === 'reduced' ? 220 : DURATION[tier].mark;
    animateIfSupported(
      mark,
      [
        { opacity: 0, transform: 'translateY(4px) scale(0.96)' },
        { opacity: 1, transform: 'translateY(0) scale(1)' }
      ],
      { duration: markDuration, easing: EASING_STANDARD, fill: 'forwards' },
      'is-logo-reveal-fallback'
    );
  }

  if (wordmark) {
    const wordDuration = mode === 'reduced' ? 180 : DURATION[tier].word;
    animateIfSupported(
      wordmark,
      [
        { opacity: 0, transform: 'translateX(-8px)' },
        { opacity: 1, transform: 'translateX(0)' }
      ],
      { duration: wordDuration, easing: EASING_TECH, fill: 'forwards', delay: mode === 'reduced' ? 20 : 80 },
      'is-logo-reveal-fallback'
    );
  }

  if (flowPath && mode === 'full' && !hasLottie) {
    const length = flowPath.getTotalLength();
    flowPath.style.strokeDasharray = `${length}`;
    flowPath.style.strokeDashoffset = `${length}`;
    animateIfSupported(
      flowPath,
      [
        { strokeDashoffset: `${length}`, opacity: 0.12 },
        { strokeDashoffset: `${length * 0.08}`, opacity: 0.75 }
      ],
      { duration: DURATION[tier].flow, easing: EASING_STANDARD, fill: 'forwards', delay: 140 },
      'is-logo-reveal-fallback'
    );
  }

  const settleDelay = mode === 'reduced' ? 260 : DURATION[tier].flow + 220;
  await new Promise((resolve) => setTimeout(resolve, settleDelay));
  host.classList.add('is-logo-ready');
}

export function attachLogoHover(target: Element, options: HoverOptions = {}) {
  const host = target as HTMLElement;
  const onEnter = () => host.classList.add('is-logo-hovered');
  const onLeave = () => host.classList.remove('is-logo-hovered');
  const onTap = () => {
    if (!options.mobileTapBoost) return;
    host.classList.add('is-logo-tapped');
    setTimeout(() => {
      host.classList.remove('is-logo-tapped');
    }, 240);
  };

  host.addEventListener('pointerenter', onEnter);
  host.addEventListener('pointerleave', onLeave);
  host.addEventListener('pointercancel', onLeave);
  host.addEventListener('pointerdown', onTap);

  return () => {
    host.removeEventListener('pointerenter', onEnter);
    host.removeEventListener('pointerleave', onLeave);
    host.removeEventListener('pointercancel', onLeave);
    host.removeEventListener('pointerdown', onTap);
  };
}
