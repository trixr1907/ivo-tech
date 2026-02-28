'use client';

import React, { useEffect, useMemo, useState } from 'react';

type MotionMetaProps = {
  initial?: unknown;
  animate?: unknown;
  whileInView?: unknown;
  whileHover?: unknown;
  whileTap?: unknown;
  transition?: unknown;
  viewport?: unknown;
};

export type HTMLMotionProps<T extends keyof React.JSX.IntrinsicElements> = React.ComponentPropsWithoutRef<T> & MotionMetaProps;

type MotionTagComponent = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<Record<string, unknown>> & React.RefAttributes<unknown>
>;

const motionTagCache = new Map<string, MotionTagComponent>();

function normalizeStyle(style: React.CSSProperties | undefined): React.CSSProperties | undefined {
  if (!style) return style;

  const raw = style as React.CSSProperties & { y?: number | string };
  if (raw.y === undefined) return style;

  const translateY = typeof raw.y === 'number' ? `${raw.y}px` : String(raw.y);
  const existingTransform = raw.transform ? String(raw.transform) : '';

  const nextStyle: React.CSSProperties = { ...style };
  delete (nextStyle as React.CSSProperties & { y?: number | string }).y;
  nextStyle.transform = existingTransform ? `translateY(${translateY}) ${existingTransform}` : `translateY(${translateY})`;
  return nextStyle;
}

function createMotionTag<T extends keyof React.JSX.IntrinsicElements>(tagName: T): MotionTagComponent {
  const Cached = motionTagCache.get(String(tagName));
  if (Cached) return Cached;

  const Component = React.forwardRef<unknown, HTMLMotionProps<T>>(function MotionTag(props, ref) {
    const { initial, animate, whileInView, whileHover, whileTap, transition, viewport, style, ...rest } = props;
    void initial;
    void animate;
    void whileInView;
    void whileHover;
    void whileTap;
    void transition;
    void viewport;

    return React.createElement(tagName, {
      ...rest,
      ref,
      style: normalizeStyle(style)
    });
  }) as unknown as MotionTagComponent;

  motionTagCache.set(String(tagName), Component);
  return Component;
}

export const domAnimation = {};

export function LazyMotion({ children }: { features?: unknown; children: React.ReactNode }) {
  return <>{children}</>;
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return reduced;
}

export function useScroll() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const update = () => setScrollY(window.scrollY || 0);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return { scrollY };
}

export function useTransform(value: number, inputRange: readonly [number, number], outputRange: readonly [number, number]) {
  return useMemo(() => {
    const [inMin, inMax] = inputRange;
    const [outMin, outMax] = outputRange;

    if (inMax === inMin) return outMin;
    const progress = Math.max(0, Math.min(1, (value - inMin) / (inMax - inMin)));
    return outMin + (outMax - outMin) * progress;
  }, [value, inputRange, outputRange]);
}

export const m = new Proxy(
  {},
  {
    get(_target, tagName) {
      return createMotionTag(tagName as keyof React.JSX.IntrinsicElements);
    }
  }
) as {
  [K in keyof React.JSX.IntrinsicElements]: MotionTagComponent;
};
