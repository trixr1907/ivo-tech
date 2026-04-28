'use client';

import type { RefObject } from 'react';
import { useEffect } from 'react';

/**
 * Setzt `--bgmx` / `--bgmy` (-1…1) auf `home-relaunch-bg` für schichtversetztes Maus-Parallax.
 * Deaktiviert bei `prefers-reduced-motion: reduce`.
 */
export function HomeBackgroundParallax({ elRef }: { elRef: RefObject<HTMLDivElement | null> }) {
  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.setProperty('--bgmx', '0');
      el.style.setProperty('--bgmy', '0');
      return;
    }

    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    let raf = 0;

    const tick = () => {
      const k = 0.1;
      curX += (targetX - curX) * k;
      curY += (targetY - curY) * k;
      el.style.setProperty('--bgmx', String(curX));
      el.style.setProperty('--bgmy', String(curY));
      if (Math.abs(targetX - curX) > 0.001 || Math.abs(targetY - curY) > 0.001) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    const onMove = (e: PointerEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (w < 1 || h < 1) return;
      targetX = (e.clientX / w) * 2 - 1;
      targetY = (e.clientY / h) * 2 - 1;
      if (raf === 0) raf = requestAnimationFrame(tick);
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      if (raf === 0) raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
      el.style.setProperty('--bgmx', '0');
      el.style.setProperty('--bgmy', '0');
    };
  }, [elRef]);

  return null;
}
