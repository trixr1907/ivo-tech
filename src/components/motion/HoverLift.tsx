'use client';

import { domAnimation, LazyMotion, m, useReducedMotion, type HTMLMotionProps } from 'framer-motion';

export function HoverLift(props: HTMLMotionProps<'div'>) {
  const prefersReducedMotion = useReducedMotion();
  const whileHover = prefersReducedMotion ? undefined : { y: -3, scale: 1.005 };
  const whileTap = prefersReducedMotion ? undefined : { y: 0, scale: 0.996 };

  return (
    <LazyMotion features={domAnimation}>
      <m.div transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }} whileHover={whileHover} whileTap={whileTap} {...props} />
    </LazyMotion>
  );
}
