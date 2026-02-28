'use client';

import { domAnimation, LazyMotion, m, useReducedMotion, type HTMLMotionProps } from '@/lib/motion-lite';

export function Pressable(props: HTMLMotionProps<'button'>) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <LazyMotion features={domAnimation}>
      <m.button
        whileTap={prefersReducedMotion ? undefined : { scale: 0.985 }}
        transition={{ duration: 0.12, ease: [0.4, 0, 0.2, 1] }}
        {...props}
      />
    </LazyMotion>
  );
}
