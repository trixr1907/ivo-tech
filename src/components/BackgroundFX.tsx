import { useEffect } from 'react';

import { loadScript } from '@/lib/loadScript';

export function BackgroundFX() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
    if (prefersReducedMotion) return;

    const connection = (navigator as unknown as { connection?: { saveData?: boolean } }).connection;
    const saveData = connection?.saveData === true;
    const deviceMemory = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
    const lowMemory = typeof deviceMemory === 'number' && deviceMemory > 0 && deviceMemory < 4;
    if (saveData || lowMemory) return;

    // Prevent double-starting when navigating between locales.
    if (window.__IVO_VISUALS_STARTED__) return;
    window.__IVO_VISUALS_STARTED__ = true;

    let cancelled = false;
    let didStart = false;

    const start = () => {
      if (cancelled || didStart) return;
      didStart = true;

      (async () => {
        await loadScript('/vendor/three/three.min.js');
        await loadScript('/js/visuals.js');
      })().catch((err) => {
        // Best-effort: background visuals are progressive enhancement.
        console.error('[BackgroundFX] Failed to start visuals:', err);
      });
    };

    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number })
      .requestIdleCallback;
    const cancelRic = (window as unknown as { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;

    const id = ric ? ric(start, { timeout: 1500 }) : window.setTimeout(start, 250);

    return () => {
      cancelled = true;
      if (!didStart) window.__IVO_VISUALS_STARTED__ = false;

      if (ric && cancelRic) {
        cancelRic(id);
      } else if (!ric) {
        clearTimeout(id);
      }
    };
  }, []);

  return (
    <>
      <canvas id="bg-canvas" aria-hidden="true" />
      <div className="scanlines" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
    </>
  );
}
