import { attachLogoHover, playLogoReveal, setLogoMotionMode } from '@/lib/logoMotion';
import { afterEach, describe, expect, it } from 'vitest';

function createLogoHost() {
  const host = document.createElement('span');
  host.className = 'brand-lockup';
  host.innerHTML = `
    <img class="brand-lockup-mark" alt="" />
    <img class="brand-lockup-wordmark" alt="" />
    <svg>
      <path class="brand-lockup-flow-path" d="M0 0 L10 10"></path>
    </svg>
  `;
  const flowPath = host.querySelector('.brand-lockup-flow-path') as SVGPathElement;
  flowPath.getTotalLength = () => 200;
  document.body.appendChild(host);
  return host;
}

describe('logoMotion', () => {
  afterEach(() => {
    setLogoMotionMode('full');
    document.body.innerHTML = '';
  });

  it('respects off mode and marks logo ready immediately', async () => {
    const host = createLogoHost();
    setLogoMotionMode('off');
    await playLogoReveal(host, 'tier1', 'dark');
    expect(host.classList.contains('is-logo-ready')).toBe(true);
    expect(host.dataset.logoTheme).toBe('dark');
  });

  it('applies fallback reveal class when animate API is missing', async () => {
    const host = createLogoHost();
    setLogoMotionMode('reduced');
    await playLogoReveal(host, 'tier2', 'light');
    expect(host.classList.contains('is-logo-ready')).toBe(true);
    expect(host.dataset.logoTier).toBe('tier2');
  });

  it('adds hover and tap classes with cleanup', () => {
    const host = createLogoHost();
    const cleanup = attachLogoHover(host, { mobileTapBoost: true });

    host.dispatchEvent(new Event('pointerenter'));
    expect(host.classList.contains('is-logo-hovered')).toBe(true);
    host.dispatchEvent(new Event('pointerleave'));
    expect(host.classList.contains('is-logo-hovered')).toBe(false);

    host.dispatchEvent(new Event('pointerdown'));
    expect(host.classList.contains('is-logo-tapped')).toBe(true);

    cleanup();
  });
});
