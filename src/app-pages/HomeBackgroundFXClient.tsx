'use client';

import { useEffect, useState } from 'react';

import { BackgroundFX } from '@/components/BackgroundFX';

export function HomeBackgroundFXClient() {
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    if (shouldMount) return;

    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number }).requestIdleCallback;
    const cancelRic = (window as unknown as { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;

    const mount = () => setShouldMount(true);
    const id = ric ? ric(mount, { timeout: 1000 }) : window.setTimeout(mount, 450);

    return () => {
      if (ric && cancelRic) {
        cancelRic(id);
      } else if (!ric) {
        window.clearTimeout(id);
      }
    };
  }, [shouldMount]);

  return shouldMount ? <BackgroundFX /> : null;
}
