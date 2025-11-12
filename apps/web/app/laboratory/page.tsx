'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

interface LaboratorySceneProps {
  vagalTone?: number;
  heartCoherence?: number;
  nervousSystemState?: 'ventral' | 'sympathetic' | 'dorsal';
}

// Dynamic import to avoid SSR issues with Three.js
const LaboratoryScene = dynamic<LaboratorySceneProps>(
  () => import('../(components)/LaboratoryScene'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-black via-purple-950 to-black">
        <div className="text-white text-2xl font-light animate-pulse">
          Loading neural environment...
        </div>
      </div>
    ),
  }
);

export default function LaboratoryPage() {
  const [isEntering, setIsEntering] = useState(false);
  const [vagalTone, setVagalTone] = useState(50);
  const [heartCoherence, setHeartCoherence] = useState(60);
  const [nervousSystemState, setNervousSystemState] = useState<'ventral' | 'sympathetic' | 'dorsal'>('ventral');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Simulate biometric updates (replace with real data later)
  useEffect(() => {
    if (!isEntering) return;

    const interval = setInterval(() => {
      // Simulate realistic biometric fluctuations
      setVagalTone(prev => Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 5)));
      setHeartCoherence(prev => Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 4)));
    }, 1000);

    return () => clearInterval(interval);
  }, [isEntering]);

  // Update nervous system state based on vagal tone
  useEffect(() => {
    if (vagalTone > 70) {
      setNervousSystemState('ventral');
    } else if (vagalTone > 40) {
      setNervousSystemState('sympathetic');
    } else {
      setNervousSystemState('dorsal');
    }
  }, [vagalTone]);

  const handleExit = () => {
    setIsEntering(false);
  };

  if (!isMounted) {
    return null;
  }

  if (isEntering) {
    return (
      <main className="relative w-screen h-screen">
        {/* Exit button */}
        <button
          onClick={handleExit}
          className="absolute top-6 left-6 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium text-sm z-50"
        >
          ← Exit Laboratory
        </button>

        {/* 3D Scene */}
        <LaboratoryScene
          vagalTone={vagalTone}
          heartCoherence={heartCoherence}
          nervousSystemState={nervousSystemState}
        />

        {/* Instructions overlay for VR */}
        <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md px-6 py-4 rounded-xl text-white text-sm space-y-2 max-w-xs z-50">
          <p className="font-semibold text-purple-300">VR Ready</p>
          <p className="text-xs leading-relaxed">
            After installing @react-three/xr, press the VR button to enter immersive mode on Quest.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 flex items-center justify-center p-8">
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="text-6xl font-light text-white mb-4">The Laboratory</h1>
        <p className="text-xl text-purple-200 mb-8">
          Your nervous system + VERA's presence. 
          <br />
          <br />
          Immerse yourself in 3D co-regulation. Watch your biometrics transform the environment in real-time.
        </p>
        
        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/30">
            <div className="text-3xl mb-2">🧠</div>
            <div className="text-sm text-purple-200">3D Neural Visualization</div>
          </div>
          <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-500/30">
            <div className="text-3xl mb-2">💓</div>
            <div className="text-sm text-blue-200">Real-time Biometrics</div>
          </div>
          <div className="bg-pink-900/30 p-4 rounded-lg border border-pink-500/30">
            <div className="text-3xl mb-2">🥽</div>
            <div className="text-sm text-pink-200">VR Ready</div>
          </div>
        </div>

        <button
          onClick={() => setIsEntering(true)}
          className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all duration-300 text-lg shadow-lg hover:shadow-xl"
        >
          Enter the Orb
        </button>
        
        <p className="text-xs text-purple-300 mt-4">
          Desktop: Use mouse to orbit • VR: Fully immersive experience
        </p>
      </div>
    </main>
  );
}
