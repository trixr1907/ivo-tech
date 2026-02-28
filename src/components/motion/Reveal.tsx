'use client';

import { domAnimation, LazyMotion, m, useReducedMotion, type HTMLMotionProps } from '@/lib/motion-lite';

type Props = HTMLMotionProps<'div'> & {
  delayMs?: number;
};

export function Reveal({ children, delayMs = 0, ...rest }: Props) {
  const prefersReducedMotion = useReducedMotion();

  const initial = prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 };
  const whileInView = { opacity: 1, y: 0 };
  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.42, delay: delayMs / 1000, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <LazyMotion features={domAnimation}>
      <m.div initial={initial} whileInView={whileInView} viewport={{ once: true, amount: 0.2 }} transition={transition} {...rest}>
        {children}
      </m.div>
    </LazyMotion>
  );
}
