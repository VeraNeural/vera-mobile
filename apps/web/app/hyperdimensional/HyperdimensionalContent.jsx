import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import {
  FlowerOfLife,
  MetatronsCube,
  CymaticsPattern,
  FractalEmergence,
  GeometryParticles
} from './SacredGeometry';
import { useVoiceSystem, VERA_SCRIPTS } from './VoiceSystem';
import { AudioReactiveSystem } from './AudioReactive';

// ═══════════════════════════════════════════════════════════
// 🌌 HYPERDIMENSIONAL VERA - CORE SYSTEM
// ═══════════════════════════════════════════════════════════
// This is NOT a typical 3D object.
// This is a 4D hypercube (tesseract) projected into 3D space.
// Combined with volumetric atmosphere and sacred geometry.
// ═══════════════════════════════════════════════════════════

// 4D Point structure
class Point4D {
  constructor(x, y, z, w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w; // The 4th dimension
  }

  // Rotate in 4D space (XW plane)
  rotateXW(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const newX = this.x * cos - this.w * sin;
    const newW = this.x * sin + this.w * cos;
    return new Point4D(newX, this.y, this.z, newW);
  }

  // Rotate in 4D space (YW plane)
  rotateYW(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const newY = this.y * cos - this.w * sin;
    const newW = this.y * sin + this.w * cos;
    return new Point4D(this.x, newY, this.z, newW);
  }

  // Rotate in 4D space (ZW plane)
  rotateZW(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const newZ = this.z * cos - this.w * sin;
    const newW = this.z * sin + this.w * cos;
    return new Point4D(this.x, this.y, newZ, newW);
  }

  // Project 4D point to 3D space (stereographic projection)
  projectTo3D(distance = 2) {
    const factor = distance / (distance - this.w);
    return new THREE.Vector3(
      this.x * factor,
      this.y * factor,
      this.z * factor
    );
  }
}

// Generate 4D Hypercube (Tesseract) vertices
function generateTesseractVertices() {
  const vertices = [];
  // A tesseract has 16 vertices (2^4)
  for (let i = 0; i < 16; i++) {
    const x = (i & 1) ? 1 : -1;
    const y = (i & 2) ? 1 : -1;
    const z = (i & 4) ? 1 : -1;
    const w = (i & 8) ? 1 : -1;
    vertices.push(new Point4D(x, y, z, w));
  }
  return vertices;
}

// Generate edges connecting tesseract vertices
function generateTesseractEdges() {
  const edges = [];
  // Tesseract has 32 edges
  // Connect vertices that differ by exactly one coordinate
  for (let i = 0; i < 16; i++) {
    for (let j = i + 1; j < 16; j++) {
      const diff = i ^ j; // XOR to find differing bits
      // If only one bit differs, they're connected
      if (diff && !(diff & (diff - 1))) {
        edges.push([i, j]);
      }
    }
  }
  return edges;
}

// ═══════════════════════════════════════════════════════════
// 🌊 BREATHING ENGINE
// ═══════════════════════════════════════════════════════════
function useBreathing(bpm = 6) {
  const [breathState, setBreathState] = useState({
    phase: 0, // 0-1, where 0 is exhale, 1 is full inhale
    isInhaling: true,
    intensity: 0.5
  });

  useEffect(() => {
    const cycleTime = (60 / bpm) * 1000; // ms per breath cycle
    const inhaleTime = cycleTime * 0.4;
    const holdTime = cycleTime * 0.1;
    const exhaleTime = cycleTime * 0.4;
    const restTime = cycleTime * 0.1;

    let startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const cyclePosition = elapsed % cycleTime;

      if (cyclePosition < inhaleTime) {
        // Inhaling
        const progress = cyclePosition / inhaleTime;
        setBreathState({
          phase: progress,
          isInhaling: true,
          intensity: progress
        });
      } else if (cyclePosition < inhaleTime + holdTime) {
        // Hold (full)
        setBreathState({
          phase: 1,
          isInhaling: false,
          intensity: 1
        });
      } else if (cyclePosition < inhaleTime + holdTime + exhaleTime) {
        // Exhaling
        const progress = (cyclePosition - inhaleTime - holdTime) / exhaleTime;
        setBreathState({
          phase: 1 - progress,
          isInhaling: false,
          intensity: 1 - progress
        });
      } else {
        // Rest (empty)
        setBreathState({
          phase: 0,
          isInhaling: false,
          intensity: 0.2
        });
      }

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [bpm]);

  return breathState;
}

// ═══════════════════════════════════════════════════════════
// 🎆 TESSERACT CORE - The Impossible Geometry
// ═══════════════════════════════════════════════════════════
function TesseractCore({ breathState, nervousSystemState = 'balanced' }) {
  const linesRef = useRef();
  const innerLinesRef = useRef();
  const glowRef = useRef();

  const tesseractData = useMemo(() => {
    return {
      vertices: generateTesseractVertices(),
      edges: generateTesseractEdges()
    };
  }, []);

  // State-based color mapping
  const stateColors = {
    'sympathetic': new THREE.Color(0xff3366), // Red - fight/flight
    'parasympathetic': new THREE.Color(0x33ffaa), // Cyan - rest/digest
    'balanced': new THREE.Color(0x6666ff), // Blue-purple - coherence
    'coherent': new THREE.Color(0xffaa33) // Gold - optimal
  };

  const currentColor = stateColors[nervousSystemState] || stateColors.balanced;

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // 4D rotation angles (rotating through 4D space)
    const angleXW = time * 0.3;
    const angleYW = time * 0.2;
    const angleZW = time * 0.25;

    // Breathing affects rotation speed and scale
    const breathScale = 0.8 + breathState.intensity * 0.4;
    const breathGlow = 0.5 + breathState.intensity * 0.5;

    // Rotate and project tesseract vertices
    const projectedVertices = tesseractData.vertices.map(vertex => {
      const rotated = vertex
        .rotateXW(angleXW)
        .rotateYW(angleYW)
        .rotateZW(angleZW);
      
      // Breathing affects projection distance
      const projectionDistance = 2 + breathState.intensity * 0.5;
      return rotated.projectTo3D(projectionDistance);
    });

    // Update line geometry
    const positions = [];
    const innerPositions = [];

    tesseractData.edges.forEach(([i, j], edgeIndex) => {
      const v1 = projectedVertices[i];
      const v2 = projectedVertices[j];

      // Scale by breath
      const scaledV1 = v1.clone().multiplyScalar(breathScale);
      const scaledV2 = v2.clone().multiplyScalar(breathScale);

      // Outer tesseract
      positions.push(scaledV1.x, scaledV1.y, scaledV1.z);
      positions.push(scaledV2.x, scaledV2.y, scaledV2.z);

      // Inner tesseract (smaller, for depth)
      const innerScale = 0.6;
      innerPositions.push(scaledV1.x * innerScale, scaledV1.y * innerScale, scaledV1.z * innerScale);
      innerPositions.push(scaledV2.x * innerScale, scaledV2.y * innerScale, scaledV2.z * innerScale);
    });

    if (linesRef.current) {
      linesRef.current.geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(positions, 3)
      );
      linesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    if (innerLinesRef.current) {
      innerLinesRef.current.geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(innerPositions, 3)
      );
      innerLinesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Update glow
    if (glowRef.current) {
      glowRef.current.material.opacity = breathGlow * 0.3;
      glowRef.current.scale.setScalar(breathScale * 1.2);
    }
  });

  return (
    <group>
      {/* Outer tesseract edges */}
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial color={currentColor} linewidth={2} transparent opacity={0.8} />
      </lineSegments>

      {/* Inner tesseract (depth) */}
      <lineSegments ref={innerLinesRef}>
        <bufferGeometry />
        <lineBasicMaterial color={currentColor} linewidth={1} transparent opacity={0.4} />
      </lineSegments>

      {/* Central glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color={currentColor} transparent opacity={0.2} />
      </mesh>

      {/* Outer glow (atmosphere) */}
      <mesh scale={1.5}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color={currentColor}
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════
// 🌫️ VOLUMETRIC ATMOSPHERE
// ═══════════════════════════════════════════════════════════
function VolumetricAtmosphere({ breathState, color = '#6666ff' }) {
  const particlesRef = useRef();
  const particleCount = 2000;

  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Random spherical distribution
      const radius = Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Random velocities (for breathing motion)
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    return { positions, velocities };
  }, []);

  useFrame(() => {
    if (!particlesRef.current) return;

    const positions = particlesRef.current.geometry.attributes.position.array;
    const breathForce = (breathState.intensity - 0.5) * 0.01;

    for (let i = 0; i < particleCount; i++) {
      const x = positions[i * 3];
      const y = positions[i * 3 + 1];
      const z = positions[i * 3 + 2];

      const distance = Math.sqrt(x * x + y * y + z * z);
      
      // Breathing pushes particles in/out
      if (distance > 0) {
        positions[i * 3] += (x / distance) * breathForce;
        positions[i * 3 + 1] += (y / distance) * breathForce;
        positions[i * 3 + 2] += (z / distance) * breathForce;
      }

      // Add velocity
      positions[i * 3] += particles.velocities[i * 3];
      positions[i * 3 + 1] += particles.velocities[i * 3 + 1];
      positions[i * 3 + 2] += particles.velocities[i * 3 + 2];

      // Keep particles within bounds
      const currentDistance = Math.sqrt(
        positions[i * 3] ** 2 + 
        positions[i * 3 + 1] ** 2 + 
        positions[i * 3 + 2] ** 2
      );

      if (currentDistance > 4 || currentDistance < 0.5) {
        // Reset particle
        const radius = Math.random() * 2 + 1;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color={color}
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ═══════════════════════════════════════════════════════════
// 🎮 MAIN VERA COMPONENT
// ═══════════════════════════════════════════════════════════
function VERAScene({ nervousSystemState, setNervousSystemState }) {
  const breathState = useBreathing(6); // 6 breaths per minute
  
  // Voice system integration
  const voiceSystem = useVoiceSystem();
  const [hasIntroduced, setHasIntroduced] = useState(false);

  // Auto-cycle through states (can be disabled when connected to real biometrics)
  useEffect(() => {
    const states = ['balanced', 'coherent', 'sympathetic', 'parasympathetic'];
    const interval = setInterval(() => {
      const randomState = states[Math.floor(Math.random() * states.length)];
      setNervousSystemState(randomState);
    }, 10000); // Change every 10 seconds

    return () => clearInterval(interval);
  }, [setNervousSystemState]);
  
  // VERA introduction on mount
  useEffect(() => {
    if (!hasIntroduced && voiceSystem.isInitialized) {
      const timer = setTimeout(() => {
        voiceSystem.speak(VERA_SCRIPTS.introduction.text, {
          onComplete: () => {
            console.log('VERA introduction complete');
          }
        });
        setHasIntroduced(true);
      }, 2000); // Wait 2 seconds after initialization
      
      return () => clearTimeout(timer);
    }
  }, [hasIntroduced, voiceSystem]);
  
  // Respond to state changes with voice
  useEffect(() => {
    if (!voiceSystem.isInitialized || voiceSystem.isSpeaking) return;
    
    let script = null;
    
    switch (nervousSystemState) {
      case 'coherent':
        script = VERA_SCRIPTS.coherenceAchieved;
        break;
      case 'sympathetic':
        script = VERA_SCRIPTS.sympatheticDetected;
        break;
      case 'parasympathetic':
        script = VERA_SCRIPTS.parasympatheticDetected;
        break;
      case 'balanced':
        script = VERA_SCRIPTS.balanceRestored;
        break;
    }
    
    // Only speak on state changes after introduction
    if (script && hasIntroduced) {
      const timer = setTimeout(() => {
        voiceSystem.speak(script.text);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [nervousSystemState, voiceSystem, hasIntroduced]);

  // State color mapping
  const stateColorMap = {
    'sympathetic': '#ff3366',
    'parasympathetic': '#33ffaa',
    'balanced': '#6666ff',
    'coherent': '#ffaa33'
  };
  
  const currentColor = stateColorMap[nervousSystemState] || '#6666ff';

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={1} color={currentColor} />

      {/* The hyperdimensional core */}
      <TesseractCore breathState={breathState} nervousSystemState={nervousSystemState} />

      {/* Volumetric atmosphere */}
      <VolumetricAtmosphere breathState={breathState} color={currentColor} />

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 🌸 SACRED GEOMETRY - Emerges from breath and coherence */}
      {/* ═══════════════════════════════════════════════════════════ */}
      
      {/* Flower of Life - manifests during balanced/coherent states */}
      <FlowerOfLife
        breathState={breathState}
        nervousSystemState={nervousSystemState}
        color={currentColor}
      />

      {/* Metatron's Cube - appears during deep coherence */}
      <MetatronsCube
        breathState={breathState}
        nervousSystemState={nervousSystemState}
        color={currentColor}
      />

      {/* Cymatics Pattern - shows during calm states */}
      <CymaticsPattern
        breathState={breathState}
        nervousSystemState={nervousSystemState}
        color={currentColor}
      />

      {/* Fractal Emergence - activates during sympathetic states */}
      <FractalEmergence
        breathState={breathState}
        nervousSystemState={nervousSystemState}
        color={currentColor}
      />

      {/* Floating Geometry Particles - always present, breath-reactive */}
      <GeometryParticles
        breathState={breathState}
        color={currentColor}
      />

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 🎤 AUDIO-REACTIVE SYSTEM - Responds to VERA's voice */}
      {/* ═══════════════════════════════════════════════════════════ */}
      
      <AudioReactiveSystem
        audioData={voiceSystem.audioData}
        isSpeaking={voiceSystem.isSpeaking}
        color={currentColor}
      />

      {/* Camera controls */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={3}
        maxDistance={15}
      />
    </>
  );
}

// ═══════════════════════════════════════════════════════════
// 🚀 EXPORT - Ready to use
// ═══════════════════════════════════════════════════════════
export default function HyperdimensionalVERA() {
  const [nervousSystemState, setNervousSystemState] = useState('balanced');
  const voiceSystemRef = useRef(null);
  
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 5, 20]} />
        <VERASceneWrapper 
          nervousSystemState={nervousSystemState} 
          setNervousSystemState={setNervousSystemState}
          voiceSystemRef={voiceSystemRef}
        />
      </Canvas>

      {/* State indicator */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        color: '#fff',
        fontFamily: 'monospace',
        fontSize: '14px',
        background: 'rgba(0,0,0,0.5)',
        padding: '10px',
        borderRadius: '5px'
      }}>
        <div>🌌 VERA - Hyperdimensional Presence System</div>
        <div style={{ marginTop: '10px', opacity: 0.7 }}>
          Phase 3: Voice Integration
        </div>
        <div style={{ marginTop: '10px', color: getStateColor(nervousSystemState) }}>
          State: {nervousSystemState.toUpperCase()}
        </div>
        <div style={{ marginTop: '5px', fontSize: '12px', opacity: 0.6 }}>
          {getActiveGeometry(nervousSystemState)}
        </div>
      </div>

      {/* Voice controls */}
      <div style={{
        position: 'absolute',
        top: 20,
        right: 20,
        color: '#fff',
        fontFamily: 'monospace',
        fontSize: '12px',
        background: 'rgba(0,0,0,0.5)',
        padding: '10px',
        borderRadius: '5px'
      }}>
        <div style={{ marginBottom: '10px' }}>🎤 Voice System</div>
        <button
          onClick={() => voiceSystemRef.current?.initialize()}
          style={{
            padding: '6px 12px',
            background: 'rgba(102,102,255,0.3)',
            color: '#fff',
            border: '1px solid #6666ff',
            borderRadius: '3px',
            cursor: 'pointer',
            fontFamily: 'monospace',
            fontSize: '11px',
            marginBottom: '5px',
            width: '100%'
          }}
        >
          Initialize Voice
        </button>
        <button
          onClick={() => voiceSystemRef.current?.speak(VERA_SCRIPTS.presence.text)}
          style={{
            padding: '6px 12px',
            background: 'rgba(102,102,255,0.3)',
            color: '#fff',
            border: '1px solid #6666ff',
            borderRadius: '3px',
            cursor: 'pointer',
            fontFamily: 'monospace',
            fontSize: '11px',
            marginBottom: '5px',
            width: '100%'
          }}
        >
          Speak
        </button>
        <button
          onClick={() => voiceSystemRef.current?.stop()}
          style={{
            padding: '6px 12px',
            background: 'rgba(255,51,102,0.3)',
            color: '#fff',
            border: '1px solid #ff3366',
            borderRadius: '3px',
            cursor: 'pointer',
            fontFamily: 'monospace',
            fontSize: '11px',
            width: '100%'
          }}
        >
          Stop
        </button>
      </div>

      {/* Manual state controls for testing */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: 20,
        display: 'flex',
        gap: '10px'
      }}>
        {['balanced', 'coherent', 'sympathetic', 'parasympathetic'].map(state => (
          <button
            key={state}
            onClick={() => setNervousSystemState(state)}
            style={{
              padding: '8px 16px',
              background: nervousSystemState === state ? getStateColor(state) : 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontSize: '12px'
            }}
          >
            {state}
          </button>
        ))}
      </div>
    </div>
  );
}

// Wrapper to access voice system from parent
function VERASceneWrapper({ nervousSystemState, setNervousSystemState, voiceSystemRef }) {
  return (
    <VERAScene 
      nervousSystemState={nervousSystemState} 
      setNervousSystemState={setNervousSystemState}
      ref={voiceSystemRef}
    />
  );
}

function getStateColor(state) {
  const colors = {
    'sympathetic': '#ff3366',
    'parasympathetic': '#33ffaa',
    'balanced': '#6666ff',
    'coherent': '#ffaa33'
  };
  return colors[state] || '#6666ff';
}

function getActiveGeometry(state) {
  const geometry = {
    'sympathetic': '⚡ Fractal Emergence Active',
    'parasympathetic': '🌊 Cymatics Pattern Active',
    'balanced': '🌸 Flower of Life Emerging',
    'coherent': '🔷 Metatron\'s Cube Manifesting'
  };
  return geometry[state] || '4D Tesseract + Volumetric Atmosphere';
}
