import { useEffect, useRef } from 'react';

import { startPaybackDemo } from '@/lib/paybackDemo';

export function PaybackDemo() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctrl = startPaybackDemo(el);
    return () => ctrl.dispose();
  }, []);

  return <div ref={ref} className="payback-stage" aria-label="AutoCoupon demo" />;
}

