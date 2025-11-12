'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const VERAQuestVR = dynamic(
  () => import('../VERAQuestVR' as any),
  { 
    ssr: false,
    loading: () => (
      <div style={{
        width: '100vw',
        height: '100vh',
        background: '#000',
        color: '#fff',
        fontFamily: 'monospace',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>🌌 Initializing VERA VR...</div>
      </div>
    )
  }
);

export default function VRPage() {
  return <VERAQuestVR />;
}
