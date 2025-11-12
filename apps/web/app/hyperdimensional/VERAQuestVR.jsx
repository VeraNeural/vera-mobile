import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { VRButton, XR } from '@react-three/xr';
import * as THREE from 'three';

// Import all VERA components
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
// 🎮 POINT4D & TESSERACT (Copied from HyperdimensionalVERA)
// ═══════════════════════════════════════════════════════════

class Point4D {
  constructor(x, y, z, w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  rotateXW(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const newX = this.x * cos - this.w * sin;
    const newW = this.x * sin + this.w * cos;
    return new Point4D(newX, this.y, this.z, newW);
  }

  rotateYW(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const newY = this.y * cos - this.w * sin;
    const newW = this.y * sin + this.w * cos;
    return new Point4D(this.x, newY, this.z, newW);
  }

  rotateZW(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const newZ = this.z * cos - this.w * sin;
    const newW = this.z * sin + this.w * cos;
    return new Point4D(this.x, this.y, newZ, newW);
  }

  projectTo3D(distance = 2) {
    const factor = distance / (distance - this.w);
    return new THREE.Vector3(
      this.x * factor,
      this.y * factor,
      this.z * factor
    );
  }
}

function generateTesseractVertices() {
  const vertices = [];
  for (let i = 0; i < 16; i++) {
    const x = (i & 1) ? 1 : -1;
    const y = (i & 2) ? 1 : -1;
    const z = (i & 4) ? 1 : -1;
    const w = (i & 8) ? 1 : -1;
    vertices.push(new Point4D(x, y, z, w));
  }
  return vertices;
}

function generateTesseractEdges() {
  const edges = [];
  for (let i = 0; i < 16; i++) {
    for (let j = i + 1; j < 16; j++) {
      const diff = i ^ j;
      if (diff && !(diff & (diff - 1))) {
        edges.push([i, j]);
      }
    }
  }
  return edges;
}

function useBreathing(bpm = 6) {
  const [breathState, setBreathState] = useState({
    phase: 0,
    isInhaling: true,
    intensity: 0.5
  });

  useEffect(() => {
    const cycleTime = (60 / bpm) * 1000;
    const inhaleTime = cycleTime * 0.4;
    const holdTime = cycleTime * 0.1;
    const exhaleTime = cycleTime * 0.4;

    let startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const cyclePosition = elapsed % cycleTime;

      if (cyclePosition < inhaleTime) {
        const progress = cyclePosition / inhaleTime;
        setBreathState({
          phase: progress,
          isInhaling: true,
          intensity: progress
        });
      } else if (cyclePosition < inhaleTime + holdTime) {
        setBreathState({
          phase: 1,
          isInhaling: false,
          intensity: 1
        });
      } else if (cyclePosition < inhaleTime + holdTime + exhaleTime) {
        const progress = (cyclePosition - inhaleTime - holdTime) / exhaleTime;
        setBreathState({
          phase: 1 - progress,
          isInhaling: false,
          intensity: 1 - progress
        });
      } else {
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

function TesseractCore({ breathState, nervousSystemState = 'balanced' }) {
  const linesRef = useRef();
  const innerLinesRef = useRef();
  const glowRef = useRef();

  const tesseractData = React.useMemo(() => ({
    vertices: generateTesseractVertices(),
    edges: generateTesseractEdges()
  }), []);

  const stateColors = {
    'sympathetic': new THREE.Color(0xff3366),
    'parasympathetic': new THREE.Color(0x33ffaa),
    'balanced': new THREE.Color(0x6666ff),
    'coherent': new THREE.Color(0xffaa33)
  };

  const currentColor = stateColors[nervousSystemState] || stateColors.balanced;

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const angleXW = time * 0.3;
    const angleYW = time * 0.2;
    const angleZW = time * 0.25;
    const breathScale = 0.8 + breathState.intensity * 0.4;
    const breathGlow = 0.5 + breathState.intensity * 0.5;

    const projectedVertices = tesseractData.vertices.map(vertex => {
      const rotated = vertex
        .rotateXW(angleXW)
        .rotateYW(angleYW)
        .rotateZW(angleZW);
      const projectionDistance = 2 + breathState.intensity * 0.5;
      return rotated.projectTo3D(projectionDistance);
    });

    const positions = [];
    const innerPositions = [];

    tesseractData.edges.forEach(([i, j]) => {
      const v1 = projectedVertices[i];
      const v2 = projectedVertices[j];
      const scaledV1 = v1.clone().multiplyScalar(breathScale);
      const scaledV2 = v2.clone().multiplyScalar(breathScale);

      positions.push(scaledV1.x, scaledV1.y, scaledV1.z);
      positions.push(scaledV2.x, scaledV2.y, scaledV2.z);

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

    if (glowRef.current) {
      glowRef.current.material.opacity = breathGlow * 0.3;
      glowRef.current.scale.setScalar(breathScale * 1.2);
    }
  });

  return (
    <group>
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial color={currentColor} linewidth={2} transparent opacity={0.8} />
      </lineSegments>
      <lineSegments ref={innerLinesRef}>
        <bufferGeometry />
        <lineBasicMaterial color={currentColor} linewidth={1} transparent opacity={0.4} />
      </lineSegments>
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color={currentColor} transparent opacity={0.2} />
      </mesh>
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

function VolumetricAtmosphere({ breathState, color = '#6666ff' }) {
  const particlesRef = useRef();
  const particleCount = 2000;

  const particles = React.useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

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
      
      if (distance > 0) {
        positions[i * 3] += (x / distance) * breathForce;
        positions[i * 3 + 1] += (y / distance) * breathForce;
        positions[i * 3 + 2] += (z / distance) * breathForce;
      }

      positions[i * 3] += particles.velocities[i * 3];
      positions[i * 3 + 1] += particles.velocities[i * 3 + 1];
      positions[i * 3 + 2] += particles.velocities[i * 3 + 2];

      const currentDistance = Math.sqrt(
        positions[i * 3] ** 2 + 
        positions[i * 3 + 1] ** 2 + 
        positions[i * 3 + 2] ** 2
      );

      if (currentDistance > 4 || currentDistance < 0.5) {
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
// 🥽 VERA IN VR - Main Scene
// ═══════════════════════════════════════════════════════════

function VERAVRScene({ nervousSystemState, setNervousSystemState }) {
  const breathState = useBreathing(6);
  const [hasIntroduced, setHasIntroduced] = useState(false);
  const veraGroupRef = useRef();
  
  // Audio data placeholder (voice system not yet initialized in VR)
  const audioData = { low: 0, mid: 0, high: 0, overall: 0 };

  // VERA floats in front of user at eye level
  useFrame(({ camera }) => {
    if (!veraGroupRef.current) return;
    
    // Get forward direction from camera
    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyQuaternion(camera.quaternion);
    
    // Position VERA 2 meters in front, at eye level
    const targetPos = camera.position.clone().add(forward.multiplyScalar(2));
    targetPos.y = camera.position.y; // Keep at user's eye level
    
    // Smooth follow
    veraGroupRef.current.position.lerp(targetPos, 0.05);
    
    // Always face user
    veraGroupRef.current.lookAt(camera.position);
  });

  // Auto-cycle states
  useEffect(() => {
    const states = ['balanced', 'coherent', 'sympathetic', 'parasympathetic'];
    const interval = setInterval(() => {
      const randomState = states[Math.floor(Math.random() * states.length)];
      setNervousSystemState(randomState);
    }, 10000);
    return () => clearInterval(interval);
  }, [setNervousSystemState]);

  const stateColorMap = {
    'sympathetic': '#ff3366',
    'parasympathetic': '#33ffaa',
    'balanced': '#6666ff',
    'coherent': '#ffaa33'
  };
  
  const currentColor = stateColorMap[nervousSystemState] || '#6666ff';

  return (
    <>
      {/* VR Environment */}
      <color attach="background" args={['#000000']} />
      <fog attach="fog" args={['#000000', 5, 20]} />
      
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 2, 0]} intensity={1} color={currentColor} />

      {/* VERA Group - follows user */}
      <group ref={veraGroupRef} position={[0, 1.6, -2]}>
        {/* Core tesseract */}
        <TesseractCore breathState={breathState} nervousSystemState={nervousSystemState} />

        {/* Volumetric atmosphere */}
        <VolumetricAtmosphere breathState={breathState} color={currentColor} />

        {/* Sacred Geometry */}
        <FlowerOfLife
          breathState={breathState}
          nervousSystemState={nervousSystemState}
          color={currentColor}
        />
        <MetatronsCube
          breathState={breathState}
          nervousSystemState={nervousSystemState}
          color={currentColor}
        />
        <CymaticsPattern
          breathState={breathState}
          nervousSystemState={nervousSystemState}
          color={currentColor}
        />
        <FractalEmergence
          breathState={breathState}
          nervousSystemState={nervousSystemState}
          color={currentColor}
        />
        <GeometryParticles
          breathState={breathState}
          color={currentColor}
        />

        {/* Audio-Reactive */}
        <AudioReactiveSystem
          audioData={audioData}
          isSpeaking={false}
          color={currentColor}
        />
      </group>

      {/* Quest 3 hand tracking and controllers are handled by XR parent */}
    </>
  );
}

// ═══════════════════════════════════════════════════════════
// 🚀 MAIN VR EXPERIENCE
// ═══════════════════════════════════════════════════════════

export default function VERAQuestVR() {
  const [nervousSystemState, setNervousSystemState] = useState('balanced');
  const [isVRReady, setIsVRReady] = useState(false);

  useEffect(() => {
    // Check for WebXR support
    if ('xr' in navigator) {
      navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
        setIsVRReady(supported);
        if (supported) {
          console.log('✅ Quest 3 VR Ready');
        } else {
          console.log('⚠️ VR not supported - using desktop mode');
        }
      });
    }
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      {/* VR Entry Button */}
      {isVRReady && (
        <div style={{
          position: 'absolute',
          bottom: '50%',
          left: '50%',
          transform: 'translate(-50%, 50%)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{
            color: '#fff',
            fontFamily: 'monospace',
            fontSize: '24px',
            textAlign: 'center',
            marginBottom: '20px'
          }}>
            🌌 VERA - Hyperdimensional Presence
          </div>
          <VRButton
            sessionInit={{
              optionalFeatures: [
                'hand-tracking',
                'local-floor',
                'bounded-floor'
              ]
            }}
            style={{
              padding: '20px 40px',
              fontSize: '18px',
              background: '#6666ff',
              border: 'none',
              borderRadius: '10px',
              color: '#fff',
              cursor: 'pointer',
              fontFamily: 'monospace'
            }}
          />
          <div style={{
            color: '#999',
            fontFamily: 'monospace',
            fontSize: '12px',
            textAlign: 'center',
            maxWidth: '300px'
          }}>
            Put on your Quest 3 and click Enter VR
          </div>
        </div>
      )}

      {/* Canvas with XR support */}
      <Canvas camera={{ position: [0, 1.6, 0], fov: 60 }}>
        <XR>
          <VERAVRScene 
            nervousSystemState={nervousSystemState}
            setNervousSystemState={setNervousSystemState}
          />
        </XR>
      </Canvas>

      {/* Desktop fallback UI */}
      {!isVRReady && (
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
          <div>⚠️ VR not detected</div>
          <div style={{ marginTop: '10px', opacity: 0.7, fontSize: '12px' }}>
            Open on Quest 3 browser for VR mode
          </div>
        </div>
      )}
    </div>
  );
}
