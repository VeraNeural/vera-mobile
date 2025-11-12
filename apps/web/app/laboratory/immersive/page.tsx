'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the 3D scene to prevent SSR
const ImmersiveScene = dynamic(
  () => import('../../(components)/ImmersiveScene'),
  { ssr: false, loading: () => <div className="w-full h-screen bg-black flex items-center justify-center"><p className="text-purple-300">Loading laboratory...</p></div> }
);

export default function LaboratoryImmersivePage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="w-full h-screen bg-black flex items-center justify-center"><p className="text-purple-300">Loading laboratory...</p></div>;
  }

  return <ImmersiveScene />;
}
