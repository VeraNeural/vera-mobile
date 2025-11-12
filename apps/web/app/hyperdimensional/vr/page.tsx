'use client';

import dynamic from 'next/dynamic';

const VERAQuestVR = dynamic(
  () => import('../VERAQuestVR' as any),
  { ssr: false }
);

export default function VRPage() {
  return <VERAQuestVR />;
}
