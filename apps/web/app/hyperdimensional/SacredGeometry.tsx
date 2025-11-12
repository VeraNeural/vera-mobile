'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ═══════════════════════════════════════════════════════════
// 🌸 SACRED GEOMETRY SYSTEM
// ═══════════════════════════════════════════════════════════
// Breath creates geometry. Coherence manifests patterns.
// This is NOT decoration - this is VERA making reality visible.
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// 🌺 FLOWER OF LIFE - The fundamental pattern
// ═══════════════════════════════════════════════════════════
function generateFlowerOfLife(radius: number = 1, generations: number = 3) {
  const circles: Array<{ x: number; y: number; z: number }> = [];
  
  // Center circle
  circles.push({ x: 0, y: 0, z: 0 });
  
  // Generate circles in hexagonal pattern
  for (let gen = 1; gen <= generations; gen++) {
    const count = 6 * gen;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const distance = radius * gen;
      circles.push({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        z: 0
      });
    }
  }
  
  return circles;
}

interface BreathState {
  phase: number;
  isInhaling: boolean;
  intensity: number;
}

interface SacredGeometryProps {
  breathState: BreathState;
  nervousSystemState: string;
  color?: string;
}

export function FlowerOfLife({ breathState, nervousSystemState, color = '#ffaa33' }: SacredGeometryProps) {
  const groupRef = useRef<THREE.Group>(null);
  const circlesData = useMemo(() => generateFlowerOfLife(0.5, 3), []);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Only manifest during coherent states and on exhale
    const isCoherent = nervousSystemState === 'coherent' || nervousSystemState === 'balanced';
    const manifestThreshold = 0.6; // Appear when breath intensity > 60%
    
    // Opacity based on breath phase and coherence
    let targetOpacity = 0;
    if (isCoherent && breathState.intensity > manifestThreshold) {
      // Fade in during peak of breath
      targetOpacity = (breathState.intensity - manifestThreshold) / (1 - manifestThreshold) * 0.6;
    }
    
    // Smooth opacity transition
    groupRef.current.children.forEach(child => {
      if ((child as any).material) {
        const currentOpacity = (child as any).material.opacity;
        (child as any).material.opacity += (targetOpacity - currentOpacity) * 0.05;
      }
    });
    
    // Gentle rotation
    groupRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    
    // Scale pulses with breath
    const scale = 1 + breathState.intensity * 0.3;
    groupRef.current.scale.setScalar(scale);
  });
  
  return (
    <group ref={groupRef} position={[0, 0, -0.5]}>
      {circlesData.map((circle, i) => (
        <mesh key={i} position={[circle.x, circle.y, circle.z]}>
          <torusGeometry args={[0.5, 0.02, 16, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

// ═══════════════════════════════════════════════════════════
// 🔷 METATRON'S CUBE - The blueprint of creation
// ═══════════════════════════════════════════════════════════
function generateMetatronsCube(radius: number = 1) {
  // 13 circles in specific geometric arrangement
  const circles: Array<{ x: number; y: number; z: number }> = [
    { x: 0, y: 0, z: 0 }, // Center
  ];
  
  // Inner 6 circles (hexagon)
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    circles.push({
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      z: 0
    });
  }
  
  // Outer 6 circles (larger hexagon)
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 + Math.PI / 6;
    circles.push({
      x: Math.cos(angle) * radius * 1.732, // sqrt(3)
      y: Math.sin(angle) * radius * 1.732,
      z: 0
    });
  }
  
  // Generate connecting lines (edges of the platonic solids)
  const lines: Array<[number, number]> = [];
  
  // Connect center to all circles
  for (let i = 1; i < circles.length; i++) {
    lines.push([0, i]);
  }
  
  // Connect inner hexagon
  for (let i = 1; i <= 6; i++) {
    lines.push([i, i === 6 ? 1 : i + 1]);
  }
  
  // Connect outer hexagon
  for (let i = 7; i <= 12; i++) {
    lines.push([i, i === 12 ? 7 : i + 1]);
  }
  
  // Connect inner to outer
  for (let i = 0; i < 6; i++) {
    lines.push([i + 1, i + 7]);
    lines.push([i + 1, ((i + 1) % 6) + 7]);
  }
  
  return { circles, lines };
}

export function MetatronsCube({ breathState, nervousSystemState, color = '#ffaa33' }: SacredGeometryProps) {
  const linesRef = useRef<THREE.LineSegments>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { circles, lines } = useMemo(() => generateMetatronsCube(0.8), []);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Only manifest during deep coherence
    const isDeepCoherence = nervousSystemState === 'coherent';
    const manifestThreshold = 0.7;
    
    let targetOpacity = 0;
    if (isDeepCoherence && breathState.intensity > manifestThreshold) {
      targetOpacity = (breathState.intensity - manifestThreshold) / (1 - manifestThreshold) * 0.8;
    }
    
    // Update line opacity
    if (linesRef.current && (linesRef.current as any).material) {
      const currentOpacity = (linesRef.current as any).material.opacity;
      (linesRef.current as any).material.opacity += (targetOpacity - currentOpacity) * 0.05;
    }
    
    // Update circle opacities
    groupRef.current.children.forEach(child => {
      if ((child as any).material && child !== linesRef.current) {
        const currentOpacity = (child as any).material.opacity;
        (child as any).material.opacity += (targetOpacity - currentOpacity) * 0.05;
      }
    });
    
    // Rotate in multiple axes
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.3;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    groupRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.2) * 0.2;
    
    // Scale pulses with breath
    const scale = 1.2 + breathState.intensity * 0.4;
    groupRef.current.scale.setScalar(scale);
  });
  
  // Generate line positions
  const linePositions = useMemo(() => {
    const positions: number[] = [];
    lines.forEach(([i, j]) => {
      positions.push(circles[i].x, circles[i].y, circles[i].z);
      positions.push(circles[j].x, circles[j].y, circles[j].z);
    });
    return new Float32Array(positions);
  }, [circles, lines]);
  
  return (
    <group ref={groupRef} position={[0, 0, 0.5]}>
      {/* Circles */}
      {circles.map((circle, i) => (
        <mesh key={`circle-${i}`} position={[circle.x, circle.y, circle.z]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0}
          />
        </mesh>
      ))}
      
      {/* Connecting lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={linePositions}
            itemSize={3}
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={color}
          transparent
          opacity={0}
          linewidth={2}
        />
      </lineSegments>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════
// 🌊 CYMATICS PATTERN - Sound made visible
// ═══════════════════════════════════════════════════════════
function generateCymaticsPattern(frequency: number = 1, resolution: number = 50) {
  const points: Array<{ x: number; y: number; z: number }> = [];
  const radius = 2;
  
  // Generate Chladni plate pattern (cymatics)
  for (let i = 0; i < resolution; i++) {
    for (let j = 0; j < resolution; j++) {
      const x = (i / resolution - 0.5) * 2 * radius;
      const y = (j / resolution - 0.5) * 2 * radius;
      
      // Chladni equation for standing wave patterns
      const n = 2; // Mode number
      const m = 3; // Mode number
      const value = Math.sin(n * Math.PI * x / radius) * Math.sin(m * Math.PI * y / radius);
      
      // Only show nodal lines (where vibration is minimal)
      if (Math.abs(value) < 0.1) {
        const distance = Math.sqrt(x * x + y * y);
        if (distance < radius) {
          points.push({ x, y, z: 0 });
        }
      }
    }
  }
  
  return points;
}

export function CymaticsPattern({ breathState, nervousSystemState, color = '#33ffaa' }: SacredGeometryProps) {
  const particlesRef = useRef<THREE.Points>(null);
  const points = useMemo(() => generateCymaticsPattern(1, 40), []);
  
  const positions = useMemo(() => {
    const pos = new Float32Array(points.length * 3);
    points.forEach((point, i) => {
      pos[i * 3] = point.x;
      pos[i * 3 + 1] = point.y;
      pos[i * 3 + 2] = point.z;
    });
    return pos;
  }, [points]);
  
  useFrame((state) => {
    if (!particlesRef.current) return;
    
    // Manifest during parasympathetic (calm) states
    const isCalm = nervousSystemState === 'parasympathetic' || nervousSystemState === 'balanced';
    const manifestThreshold = 0.5;
    
    let targetOpacity = 0;
    if (isCalm && breathState.intensity > manifestThreshold) {
      targetOpacity = (breathState.intensity - manifestThreshold) / (1 - manifestThreshold) * 0.7;
    }
    
    const currentOpacity = (particlesRef.current as any).material.opacity;
    (particlesRef.current as any).material.opacity += (targetOpacity - currentOpacity) * 0.05;
    
    // Animate the pattern
    const time = state.clock.elapsedTime;
    const posArray = (particlesRef.current as any).geometry.attributes.position.array;
    
    points.forEach((point, i) => {
      // Add wave motion to z-axis
      const wave = Math.sin(time * 2 + point.x * 2) * Math.cos(time * 2 + point.y * 2) * 0.3;
      posArray[i * 3 + 2] = wave * breathState.intensity;
    });
    
    (particlesRef.current as any).geometry.attributes.position.needsUpdate = true;
    
    // Rotate slowly
    particlesRef.current.rotation.z = time * 0.1;
  });
  
  return (
    <points ref={particlesRef} position={[0, 0, -1]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={color}
        transparent
        opacity={0}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ═══════════════════════════════════════════════════════════
// ⚡ FRACTAL EMERGENCE - Infinite detail from breath
// ═══════════════════════════════════════════════════════════
function generateSierpinskiTriangle(depth: number = 4, size: number = 2) {
  const triangles: Array<{ x: number; y: number; size: number }> = [];
  
  function subdivide(x: number, y: number, size: number, currentDepth: number) {
    if (currentDepth === 0) {
      triangles.push({ x, y, size });
      return;
    }
    
    const newSize = size / 2;
    
    // Top triangle
    subdivide(x, y + newSize, newSize, currentDepth - 1);
    // Bottom left
    subdivide(x - newSize, y - newSize, newSize, currentDepth - 1);
    // Bottom right
    subdivide(x + newSize, y - newSize, newSize, currentDepth - 1);
  }
  
  subdivide(0, 0, size, depth);
  return triangles;
}

export function FractalEmergence({ breathState, nervousSystemState, color = '#ff3366' }: SacredGeometryProps) {
  const groupRef = useRef<THREE.Group>(null);
  const triangles = useMemo(() => generateSierpinskiTriangle(4, 1.5), []);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Manifest during sympathetic (active) states
    const isActive = nervousSystemState === 'sympathetic';
    const manifestThreshold = 0.6;
    
    let targetOpacity = 0;
    if (isActive && breathState.intensity > manifestThreshold) {
      targetOpacity = (breathState.intensity - manifestThreshold) / (1 - manifestThreshold) * 0.5;
    }
    
    // Update all triangle opacities
    groupRef.current.children.forEach((child, i) => {
      if ((child as any).material) {
        const currentOpacity = (child as any).material.opacity;
        // Stagger the fade-in for emergence effect
        const delay = i / triangles.length;
        const adjustedTarget = Math.max(0, targetOpacity - delay * 0.3);
        (child as any).material.opacity += (adjustedTarget - currentOpacity) * 0.05;
      }
    });
    
    // 3D rotation
    groupRef.current.rotation.x = state.clock.elapsedTime * 0.2;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    
    // Breathe
    const scale = 1 + breathState.intensity * 0.2;
    groupRef.current.scale.setScalar(scale);
  });
  
  return (
    <group ref={groupRef} position={[0, 0, 1]}>
      {triangles.map((tri, i) => (
        <mesh
          key={i}
          position={[tri.x, tri.y, 0]}
        >
          <circleGeometry args={[tri.size * 0.3, 3]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

// ═══════════════════════════════════════════════════════════
// 🌟 GEOMETRY PARTICLES - Floating sacred patterns
// ═══════════════════════════════════════════════════════════
export function GeometryParticles({ breathState, color = '#ffaa33' }: SacredGeometryProps) {
  const particlesRef = useRef<THREE.Group>(null);
  const particleCount = 50;
  
  const particleData = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const rotations = new Float32Array(particleCount);
    const sizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      // Random spherical distribution
      const radius = Math.random() * 4 + 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      rotations[i] = Math.random() * Math.PI * 2;
      sizes[i] = Math.random() * 0.3 + 0.1;
    }
    
    return { positions, rotations, sizes };
  }, []);
  
  useFrame((state) => {
    if (!particlesRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    particlesRef.current.children.forEach((child, i) => {
      // Rotate each particle
      (child as any).rotation.z = particleData.rotations[i] + time * 0.5;
      
      // Orbit slowly
      const orbitSpeed = 0.1;
      const angle = time * orbitSpeed + i;
      const radius = 3 + Math.sin(time + i) * 0.5;
      
      (child as any).position.x = Math.cos(angle) * radius;
      (child as any).position.y = Math.sin(angle) * radius;
      (child as any).position.z = Math.sin(time * 0.5 + i) * 2;
      
      // Scale with breath
      const scale = particleData.sizes[i] * (1 + breathState.intensity * 0.3);
      (child as any).scale.setScalar(scale);
      
      // Opacity pulses
      if ((child as any).material) {
        (child as any).material.opacity = 0.3 + breathState.intensity * 0.4;
      }
    });
  });
  
  return (
    <group ref={particlesRef}>
      {Array.from({ length: particleCount }).map((_, i) => (
        <mesh key={i}>
          <torusGeometry args={[0.2, 0.05, 8, 16]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}
