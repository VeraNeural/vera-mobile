'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, Sphere, Box } from '@react-three/drei';

const FloatingBook = ({ position, rotation }: any) => (
  <Box position={position} rotation={rotation} args={[0.4, 0.6, 0.1]}>
    <meshStandardMaterial color="#7c3aed" metalness={0.3} roughness={0.4} />
  </Box>
);

const GrowingTulip = ({ position, scale }: any) => (
  <group position={position} scale={scale}>
    <Box position={[0, 0.3, 0]} args={[0.08, 0.6, 0.08]}>
      <meshStandardMaterial color="#10b981" />
    </Box>
    <Sphere position={[0, 0.7, 0]} args={[0.15, 16, 16]}>
      <meshStandardMaterial color="#ec4899" metalness={0.1} roughness={0.5} />
    </Sphere>
  </group>
);

const BreathingOrb = ({ time }: any) => {
  const scale = 1 + Math.sin(time * 2) * 0.15;
  return (
    <Sphere position={[0, 1.5, 0]} args={[scale, 64, 64]}>
      <meshStandardMaterial
        color="#a78bfa"
        metalness={0.4}
        roughness={0.3}
        emissive="#7c3aed"
        emissiveIntensity={0.3}
      />
    </Sphere>
  );
};

function SceneContent({ time }: any) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[0, 2, 0]} intensity={0.5} color="#a78bfa" />

      <BreathingOrb time={time} />

      {Array.from({ length: 5 }).map((_, i) => {
        const angle = (i / 5) * Math.PI * 2;
        const x = Math.cos(angle) * 2;
        const z = Math.sin(angle) * 2;
        const y = 1.5 + Math.sin(time * 1.2 + i) * 0.3;
        const rotX = Math.sin(time * 0.8 + i) * 0.2;
        const rotY = angle + time * 0.5;
        return <FloatingBook key={i} position={[x, y, z]} rotation={[rotX, rotY, 0]} />;
      })}

      {Array.from({ length: 3 }).map((_, i) => {
        const angle = (i / 3) * Math.PI * 2 + Math.PI / 3;
        const x = Math.cos(angle) * 2.5;
        const z = Math.sin(angle) * 2.5;
        const scale = 0.6 + Math.sin(time * 0.8 + i * 1.5) * 0.4;
        return <GrowingTulip key={i} position={[x, 0, z]} scale={scale} />;
      })}

      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[4, 4, 0.1, 64]} />
        <meshStandardMaterial color="#1e293b" metalness={0.2} roughness={0.8} />
      </mesh>
    </>
  );
}

function AnimatedScene({ time }: any) {
  return (
    <Canvas camera={{ position: [0, 1.6, 3], fov: 75 }}>
      <PerspectiveCamera makeDefault />
      <OrbitControls enableZoom enablePan enableRotate />
      <SceneContent time={time} />
    </Canvas>
  );
}

export default function LaboratoryContent() {
  const [isEntering, setIsEntering] = useState(false);
  const [time, setTime] = useState(0);
  const animationFrameRef = useRef<number>();

  const handleEnter = () => {
    setIsEntering(true);
  };

  useEffect(() => {
    if (!isEntering) return;

    const animate = () => {
      setTime((t) => t + 0.016);
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isEntering]);

  const handleExit = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsEntering(false);
    setTime(0);
  };

  if (isEntering) {
    return (
      <main className="relative w-screen h-screen bg-black overflow-hidden">
        <AnimatedScene time={time} />

        {/* Exit button */}
        <button
          onClick={handleExit}
          className="absolute top-6 left-6 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium text-sm z-10"
        >
          ← Exit Laboratory
        </button>

        {/* Vagal coherence display */}
        <div className="absolute bottom-6 left-6 bg-slate-900/80 text-white px-6 py-4 rounded-lg backdrop-blur z-10">
          <p className="text-sm">Vagal Coherence: {(50 + Math.sin(time * 1.2) * 50).toFixed(0)}%</p>
          <p className="text-xs text-slate-400 mt-1">You are co-regulated with VERA</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 flex items-center justify-center p-8">
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="text-6xl font-light text-white mb-4">The Laboratory</h1>
        <p className="text-xl text-purple-200 mb-8">
          Your nervous system + VERA's presence. Books of living knowledge. Tulips breathing with your coherence. The orb at the center holds absolute co-regulation.
        </p>
        <button
          onClick={handleEnter}
          className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all duration-300 text-lg shadow-lg hover:shadow-xl"
        >
          Enter the Orb
        </button>
      </div>
    </main>
  );
}
