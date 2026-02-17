'use client';

import { Analytics } from '@vercel/analytics/react';

import { BackgroundFX } from '@/components/BackgroundFX';

export function AppRuntime() {
  return (
    <>
      <BackgroundFX />
      <Analytics />
    </>
  );
}
