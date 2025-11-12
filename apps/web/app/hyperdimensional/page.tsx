'use client';

import dynamic from 'next/dynamic';

const HyperdimensionalVERAContent = dynamic(
  () => import('./HyperdimensionalContent').then(mod => ({ default: mod.HyperdimensionalVERAContent })),
  { ssr: false }
);

export default function HyperdimensionalVERA() {
  return <HyperdimensionalVERAContent />;
}
