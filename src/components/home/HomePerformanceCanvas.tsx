'use client';

import { useEffect, useRef } from 'react';

type HomePerformanceCanvasProps = {
  reducedMotion: boolean;
};

/** Dekoratives 2D-Grid + pseudo-Kerzen — keine Finanzdaten, nur Stimmung. */
export function HomePerformanceCanvas({ reducedMotion }: HomePerformanceCanvasProps) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const raf = useRef<number | null>(null);
  const t0 = useRef(0);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(320, Math.floor(rect.width * dpr));
      const h = Math.max(320, Math.floor(rect.height * dpr));
      if (canvas.width !== w || h !== canvas.height) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas);
    resize();

    let tAcc = 0;
    const tick = (now: number) => {
      if (t0.current === 0) t0.current = now;
      const t = (now - t0.current) * 0.001;
      tAcc = reducedMotion ? 0.15 : t;

      const w = canvas.width;
      const h = canvas.height;
      const dpr = w / (canvas.getBoundingClientRect().width || 1);

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // base
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, 'rgba(2,6,23,0.2)');
      g.addColorStop(0.5, 'rgba(15,23,42,0.35)');
      g.addColorStop(1, 'rgba(2,6,23,0.5)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // grid
      const stepY = 14 * dpr;
      const stepX = 22 * dpr;
      ctx.lineWidth = 1;
      for (let y = 0; y < h; y += stepY) {
        ctx.strokeStyle = `rgba(56, 189, 248, ${0.04 + (y / h) * 0.04})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      for (let x = 0; x < w; x += stepX) {
        ctx.strokeStyle = 'rgba(100, 116, 139, 0.06)';
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // Mid baseline
      const my = h * 0.56;
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.15)';
      ctx.beginPath();
      ctx.setLineDash([4 * dpr, 6 * dpr]);
      ctx.moveTo(0, my);
      ctx.lineTo(w, my);
      ctx.stroke();
      ctx.setLineDash([]);

      // „Candles“ — smooth motion, no random() per frame
      const n = 48;
      const bw = w / n;
      for (let i = 0; i < n; i++) {
        const ph = tAcc * 0.6 + i * 0.31;
        const mag = 0.18 + 0.45 * (0.5 + 0.5 * Math.sin(ph));
        const hBar = mag * h * 0.32;
        const isUp = Math.sin(ph * 1.1 + 0.7) > 0;
        const x = i * bw + bw * 0.1;
        const bodyW = bw * 0.62;
        if (isUp) {
          ctx.fillStyle = 'rgba(52, 211, 153, 0.42)';
          ctx.fillRect(x, my - hBar, bodyW, hBar);
        } else {
          ctx.fillStyle = 'rgba(248, 113, 113, 0.28)';
          ctx.fillRect(x, my, bodyW, hBar);
        }
        // wick
        const wickX = x + bodyW * 0.5;
        ctx.strokeStyle = isUp ? 'rgba(167, 243, 208, 0.35)' : 'rgba(254, 202, 202, 0.25)';
        ctx.lineWidth = 1.2 * dpr;
        const wickTop = isUp ? my - hBar * 1.12 : my - hBar * 0.25;
        const wickBot = isUp ? my + hBar * 0.08 : my + hBar * 1.05;
        ctx.beginPath();
        ctx.moveTo(wickX, wickTop);
        ctx.lineTo(wickX, wickBot);
        ctx.stroke();
      }

      // Scan shimmer
      const scan = (tAcc * 40) % (h + 120 * dpr) - 60 * dpr;
      const grad = ctx.createLinearGradient(0, scan, 0, scan + 80 * dpr);
      grad.addColorStop(0, 'rgba(56, 189, 248, 0)');
      grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.06)');
      grad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      if (!reducedMotion) {
        raf.current = requestAnimationFrame(tick);
      }
    };

    raf.current = requestAnimationFrame(tick);

    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      ro.disconnect();
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={ref}
      className="home-performance-canvas pointer-events-none absolute top-0 bottom-0 left-1/2 -translate-x-1/2 min-h-[28rem] w-[min(1208px,100%)] max-w-[100vw] touch-none"
      aria-hidden="true"
    />
  );
}
