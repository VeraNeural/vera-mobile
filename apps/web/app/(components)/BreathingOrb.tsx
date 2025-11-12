'use client';
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';
import type { BufferAttribute } from 'three';

interface BreathingOrbProps {
  vagalTone?: number; // 0-100
  heartCoherence?: number; // 0-100
  nervousSystemState?: 'ventral' | 'sympathetic' | 'dorsal';
}

export function BreathingOrb({ 
  vagalTone = 50, 
  heartCoherence = 60,
  nervousSystemState = 'ventral' 
}: BreathingOrbProps) {
  const orbRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  
  // Particle system for neural network effect
  const particles = useMemo(() => {
    const count = 500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 2 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      
      // Color based on nervous system state
      const color = nervousSystemState === 'ventral' 
        ? new THREE.Color(0x8b5cf6) // Purple
        : nervousSystemState === 'sympathetic'
        ? new THREE.Color(0xf59e0b) // Amber
        : new THREE.Color(0x3b82f6); // Blue
        
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }
    
    return { positions, colors, count };
  }, [nervousSystemState]);

  // Breathing animation synced to vagal tone
  useFrame((state) => {
    if (!orbRef.current || !particlesRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Breathing cycle: 4s inhale, 6s exhale (coherent breathing)
    const breathCycle = 10; // seconds
    const breathPhase = (time % breathCycle) / breathCycle;
    
    // Inhale (0-0.4), Hold (0.4-0.5), Exhale (0.5-1.0)
    let scale = 1;
    if (breathPhase < 0.4) {
      // Inhale
      scale = 1 + (breathPhase / 0.4) * 0.3;
    } else if (breathPhase < 0.5) {
      // Hold
      scale = 1.3;
    } else {
      // Exhale
      scale = 1.3 - ((breathPhase - 0.5) / 0.5) * 0.3;
    }
    
    // Apply vagal tone influence (higher tone = more stable breathing)
    const stability = vagalTone / 100;
    scale = scale + (Math.sin(time * 2) * 0.05 * (1 - stability));
    
    orbRef.current.scale.setScalar(scale);
    
    // Rotate particles based on heart coherence
    const rotationSpeed = (heartCoherence / 100) * 0.5;
    particlesRef.current.rotation.y += rotationSpeed * 0.01;
    particlesRef.current.rotation.x = Math.sin(time * 0.3) * 0.2;
    
    // Subtle color pulsing
    const material = orbRef.current.material as THREE.MeshStandardMaterial;
    if (material.emissiveIntensity !== undefined) {
      material.emissiveIntensity = 0.3 + Math.sin(time * 2) * 0.2;
    }
  });

  // Dynamic color based on nervous system state
  const orbColor = nervousSystemState === 'ventral' 
    ? '#8b5cf6' // Ventral (safe) - Purple
    : nervousSystemState === 'sympathetic'
    ? '#f59e0b' // Sympathetic (activated) - Amber
    : '#3b82f6'; // Dorsal (shutdown) - Blue

  return (
    <group>
      {/* Main breathing orb */}
      <Sphere ref={orbRef} args={[1, 64, 64]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color={orbColor}
          emissive={orbColor}
          emissiveIntensity={0.4}
          metalness={0.3}
          roughness={0.2}
          distort={0.3}
          speed={2}
          transparent
          opacity={0.9}
        />
      </Sphere>
      
      {/* Neural particle cloud */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particles.positions, 3]}
            count={particles.count}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[particles.colors, 3]}
            count={particles.count}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          vertexColors
          transparent
          opacity={0.6}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {/* Ambient environment */}
      <Environment preset="sunset" />
    </group>
  );
}
