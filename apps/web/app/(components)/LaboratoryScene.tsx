'use client';
import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats, Html } from '@react-three/drei';
import { BreathingOrb } from './BreathingOrb';

// Placeholder for when @react-three/xr is installed
// import { VRButton, XR, Controllers, Hands } from '@react-three/xr';

interface LaboratorySceneProps {
  vagalTone?: number;
  heartCoherence?: number;
  nervousSystemState?: 'ventral' | 'sympathetic' | 'dorsal';
}

function LoadingFallback() {
  return (
    <Html center>
      <div className="text-white text-xl font-light">
        Entering co-regulation space...
      </div>
    </Html>
  );
}

export default function LaboratoryScene({
  vagalTone = 50,
  heartCoherence = 60,
  nervousSystemState = 'ventral'
}: LaboratorySceneProps) {
  const [showStats, setShowStats] = useState(false);

  return (
    <div className="w-full h-screen relative">
      {/* VR Button - Will be enabled once @react-three/xr is installed */}
      {/* <VRButton /> */}
      
      {/* Performance toggle */}
      <button
        onClick={() => setShowStats(!showStats)}
        className="absolute top-4 right-4 z-10 px-4 py-2 bg-purple-600/80 text-white rounded-lg text-sm"
      >
        {showStats ? 'Hide' : 'Show'} Stats
      </button>

      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance', // Critical for Quest
        }}
        dpr={[1, 2]} // Adaptive pixel ratio for performance
      >
        {/* When @react-three/xr is installed, wrap in <XR> */}
        {/* <XR referenceSpace="local-floor"> */}
        
        <color attach="background" args={['#0a0a0a']} />
        <fog attach="fog" args={['#0a0a0a', 5, 15]} />
        
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[0, 5, 0]} intensity={0.8} color="#8b5cf6" />
        <pointLight position={[-5, 0, 0]} intensity={0.4} color="#3b82f6" />
        <pointLight position={[5, 0, 0]} intensity={0.4} color="#ec4899" />
        
        <Suspense fallback={<LoadingFallback />}>
          <BreathingOrb 
            vagalTone={vagalTone}
            heartCoherence={heartCoherence}
            nervousSystemState={nervousSystemState}
          />
        </Suspense>
        
        {/* Controls - Will be replaced with VR controllers when XR is enabled */}
        <OrbitControls 
          enableDamping
          dampingFactor={0.05}
          minDistance={2}
          maxDistance={10}
        />
        
        {/* Performance stats */}
        {showStats && <Stats />}
        
        {/* </XR> */}
      </Canvas>
      
      {/* UI Overlay */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
        <div className="bg-black/60 backdrop-blur-md px-8 py-4 rounded-2xl text-white space-y-2">
          <div className="flex gap-6 justify-center text-sm">
            <div>
              <div className="text-purple-300 font-light">Vagal Tone</div>
              <div className="text-2xl font-medium">{vagalTone}%</div>
            </div>
            <div>
              <div className="text-blue-300 font-light">Heart Coherence</div>
              <div className="text-2xl font-medium">{heartCoherence}%</div>
            </div>
            <div>
              <div className="text-pink-300 font-light">State</div>
              <div className="text-2xl font-medium capitalize">{nervousSystemState}</div>
            </div>
          </div>
          <p className="text-xs text-purple-200 mt-2">
            Breathing with the orb • Co-regulation active
          </p>
        </div>
      </div>
    </div>
  );
}
