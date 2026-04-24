'use client';

import { startTransition, useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

type AnimatedCounterProps = {
  /** The display value, e.g. "3", "95+", "< 24h" */
  value: string;
  /** Animation duration in ms */
  duration?: number;
};

/**
 * Counts up from 0 to the numeric portion of `value` when scrolled into view.
 * Preserves non-numeric characters (prefix/suffix) like "<", "h", "+".
 * Respects prefers-reduced-motion.
 */
export function AnimatedCounter({ value, duration = 1400 }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px -10% 0px' });
  const prefersReduced = useReducedMotion();
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!isInView) return;

    // Decorated KPI values like "< 24h" or "95+" should stay stable.
    if (!/^\d+$/.test(value.trim())) {
      startTransition(() => setDisplay(value));
      return;
    }

    const match = value.match(/\d+/);
    if (!match) {
      startTransition(() => setDisplay(value));
      return;
    }

    if (prefersReduced) {
      startTransition(() => setDisplay(value));
      return;
    }

    const target = parseInt(match[0], 10);
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic for snappy start, smooth landing
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      // Direct setState in rAF — intentional for smooth frame-rate animation
      setDisplay(value.replace(match[0], String(current)));

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isInView, prefersReduced, value, duration]);

  return <span ref={ref}>{display}</span>;
}
