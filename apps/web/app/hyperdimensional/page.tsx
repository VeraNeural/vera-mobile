'use client';

import dynamic from 'next/dynamic';

const HyperdimensionalVERA = dynamic(
  () => import('./HyperdimensionalContent' as any),
  { ssr: false }
);

export default function Page() {
  return <HyperdimensionalVERA />;
}
