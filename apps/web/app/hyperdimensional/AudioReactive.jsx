import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ═══════════════════════════════════════════════════════════
// 🔊 AUDIO-REACTIVE GEOMETRY
// ═══════════════════════════════════════════════════════════
// Geometry that responds to VERA's voice frequencies
// Different frequency bands affect different visual elements
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// 🌊 VOICE WAVES - Ripples from VERA's voice
// ═══════════════════════════════════════════════════════════
export function VoiceWaves({ audioData, color = '#6666ff' }) {
  const ringsRef = useRef([]);
  const groupRef = useRef();
  
  const ringCount = 5;
  
  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    const voiceIntensity = audioData.overall || 0;
    
    ringsRef.current.forEach((ring, i) => {
      if (!ring) return;
      
      // Scale based on voice intensity and ring index
      const baseScale = 1 + (i * 0.3);
      const pulseScale = 1 + (voiceIntensity * 0.5);
      ring.scale.setScalar(baseScale * pulseScale);
      
      // Opacity pulses with voice
      if (ring.material) {
        const baseOpacity = 0.3 - (i * 0.05);
        ring.material.opacity = baseOpacity * (1 + voiceIntensity * 0.5);
      }
      
      // Rotate slowly
      ring.rotation.z = time * 0.1 + (i * 0.2);
    });
    
    // Group pulses with mid frequencies
    const midPulse = audioData.mid || 0;
    groupRef.current.scale.setScalar(1 + midPulse * 0.2);
  });
  
  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {Array.from({ length: ringCount }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => (ringsRef.current[i] = el)}
          position={[0, 0, 0]}
        >
          <torusGeometry args={[1 + i * 0.3, 0.05, 16, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

// ═══════════════════════════════════════════════════════════
// ⚡ FREQUENCY BARS - Visual equalizer
// ═══════════════════════════════════════════════════════════
export function FrequencyBars({ audioData, color = '#6666ff' }) {
  const barsRef = useRef([]);
  const barCount = 12;
  
  useFrame(() => {
    const { low, mid, high } = audioData;
    
    barsRef.current.forEach((bar, i) => {
      if (!bar) return;
      
      // Distribute bars around circle
      const angle = (i / barCount) * Math.PI * 2;
      const radius = 2.5;
      
      // Each bar responds to different frequency based on position
      let intensity = 0;
      if (i < barCount / 3) {
        intensity = low || 0;
      } else if (i < (barCount * 2) / 3) {
        intensity = mid || 0;
      } else {
        intensity = high || 0;
      }
      
      // Position in circle
      bar.position.x = Math.cos(angle) * radius;
      bar.position.y = Math.sin(angle) * radius;
      
      // Scale height based on frequency intensity
      const heightScale = 0.5 + intensity * 2;
      bar.scale.set(0.1, heightScale, 0.1);
      
      // Opacity based on intensity
      if (bar.material) {
        bar.material.opacity = 0.3 + intensity * 0.7;
      }
      
      // Point towards center
      bar.rotation.z = angle + Math.PI / 2;
    });
  });
  
  return (
    <group>
      {Array.from({ length: barCount }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => (barsRef.current[i] = el)}
        >
          <boxGeometry args={[0.1, 1, 0.1]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

// ═══════════════════════════════════════════════════════════
// 🌟 VOICE PARTICLES - Emanate from VERA during speech
// ═══════════════════════════════════════════════════════════
export function VoiceParticles({ audioData, isSpeaking, color = '#6666ff' }) {
  const particlesRef = useRef();
  const particleCount = 100;
  
  const particleData = React.useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const lifetimes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      // Start at center
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
      
      // Random outward velocities
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = Math.random() * 0.02 + 0.01;
      
      velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
      velocities[i * 3 + 2] = Math.cos(phi) * speed;
      
      lifetimes[i] = Math.random();
    }
    
    return { positions, velocities, lifetimes };
  }, []);
  
  useFrame(() => {
    if (!particlesRef.current || !isSpeaking) return;
    
    const positions = particlesRef.current.geometry.attributes.position.array;
    const voiceIntensity = audioData.overall || 0;
    
    for (let i = 0; i < particleCount; i++) {
      // Update lifetime
      particleData.lifetimes[i] += 0.01 * (1 + voiceIntensity);
      
      if (particleData.lifetimes[i] > 1) {
        // Reset particle
        positions[i * 3] = 0;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = 0;
        particleData.lifetimes[i] = 0;
        
        // New random direction
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const speed = Math.random() * 0.02 + 0.01;
        
        particleData.velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
        particleData.velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
        particleData.velocities[i * 3 + 2] = Math.cos(phi) * speed;
      } else {
        // Move particle
        positions[i * 3] += particleData.velocities[i * 3] * (1 + voiceIntensity);
        positions[i * 3 + 1] += particleData.velocities[i * 3 + 1] * (1 + voiceIntensity);
        positions[i * 3 + 2] += particleData.velocities[i * 3 + 2] * (1 + voiceIntensity);
      }
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Overall opacity based on voice
    if (particlesRef.current.material) {
      particlesRef.current.material.opacity = isSpeaking ? 0.6 + voiceIntensity * 0.4 : 0;
    }
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particleData.positions}
          itemSize={3}
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
// 🔮 VOICE GLOW - Emanates from center during speech
// ═══════════════════════════════════════════════════════════
export function VoiceGlow({ audioData, isSpeaking, color = '#6666ff' }) {
  const glowRef = useRef();
  
  useFrame((state) => {
    if (!glowRef.current) return;
    
    const time = state.clock.elapsedTime;
    const voiceIntensity = audioData.overall || 0;
    
    if (isSpeaking) {
      // Scale with voice intensity
      const scale = 1.5 + voiceIntensity * 1.5;
      glowRef.current.scale.setScalar(scale);
      
      // Opacity pulses
      if (glowRef.current.material) {
        glowRef.current.material.opacity = 0.2 + voiceIntensity * 0.4;
      }
      
      // Gentle rotation
      glowRef.current.rotation.z = time * 0.5;
    } else {
      // Fade out when not speaking
      if (glowRef.current.material) {
        glowRef.current.material.opacity *= 0.95;
      }
    }
  });
  
  return (
    <mesh ref={glowRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// ═══════════════════════════════════════════════════════════
// 🎵 COMPLETE AUDIO-REACTIVE SYSTEM
// ═══════════════════════════════════════════════════════════
export function AudioReactiveSystem({ audioData, isSpeaking, color = '#6666ff' }) {
  return (
    <group>
      {/* Voice waves rippling outward */}
      <VoiceWaves audioData={audioData} color={color} />
      
      {/* Frequency visualization bars */}
      <FrequencyBars audioData={audioData} color={color} />
      
      {/* Particles emanating during speech */}
      <VoiceParticles audioData={audioData} isSpeaking={isSpeaking} color={color} />
      
      {/* Central glow pulsing with voice */}
      <VoiceGlow audioData={audioData} isSpeaking={isSpeaking} color={color} />
    </group>
  );
}
