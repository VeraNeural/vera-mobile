import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Import sacred geometry
import {
  FlowerOfLife,
  MetatronsCube,
  CymaticsPattern,
  FractalEmergence,
  GeometryParticles
} from './SacredGeometry';

// ═══════════════════════════════════════════════════════════
// 🥽 VERA QUEST 3 - NATIVE WebXR (No @react-three/xr)
// ═══════════════════════════════════════════════════════════

// 4D Point class
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

// Breathing hook
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

// Tesseract Core
function TesseractCore({ breathState, nervousSystemState = 'balanced' }) {
  const linesRef = useRef();
  const innerLinesRef = useRef();
  const glowRef = useRef();

  const tesseractData = useMemo(() => ({
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

// Volumetric Atmosphere
function VolumetricAtmosphere({ breathState, color = '#6666ff' }) {
  const particlesRef = useRef();
  const particleCount = 1000;

  const particles = useMemo(() => {
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
        size={0.03}
        color={color}
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// VR Scene with native WebXR
function VERAVRScene({ nervousSystemState, setNervousSystemState }) {
  const breathState = useBreathing(6);
  const veraGroupRef = useRef();
  const { gl, camera } = useThree();

  // Enable VR on the renderer
  useEffect(() => {
    gl.xr.enabled = true;
  }, [gl]);

  // VERA follows user gaze in VR
  useFrame(() => {
    if (!veraGroupRef.current) return;
    
    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyQuaternion(camera.quaternion);
    
    const targetPos = camera.position.clone().add(forward.multiplyScalar(2));
    targetPos.y = camera.position.y;
    
    veraGroupRef.current.position.lerp(targetPos, 0.05);
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
      <color attach="background" args={['#000000']} />
      <fog attach="fog" args={['#000000', 5, 20]} />
      
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 2, 0]} intensity={1} color={currentColor} />

      <group ref={veraGroupRef} position={[0, 1.6, -2]}>
        <TesseractCore breathState={breathState} nervousSystemState={nervousSystemState} />
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
      </group>
    </>
  );
}

// Main component
export default function VERAQuestVRNative() {
  const [nervousSystemState, setNervousSystemState] = useState('balanced');
  const [isVRSupported, setIsVRSupported] = useState(false);
  const canvasRef = useRef();

  useEffect(() => {
    // Check VR support
    if ('xr' in navigator) {
      navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
        setIsVRSupported(supported);
      }).catch(() => setIsVRSupported(false));
    }
  }, []);

  const handleEnterVR = async () => {
    try {
      const canvas = canvasRef.current?.querySelector('canvas');
      if (!canvas) return;

      const gl = canvas.getContext('webgl2');
      if (!gl) return;

      const session = await navigator.xr.requestSession('immersive-vr', {
        optionalFeatures: ['hand-tracking', 'dom-overlay'],
        domOverlay: { root: document.body }
      });

      if (session) {
        await gl.makeXRCompatible?.();
      }
    } catch (error) {
      console.error('VR session error:', error);
    }
  };

  return (
    <div ref={canvasRef} style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas 
        camera={{ position: [0, 1.6, 0], fov: 60 }}
        gl={{ 
          antialias: true,
          alpha: true,
          xrCompatible: true 
        }}
        onCreated={({ gl }) => {
          gl.xr.enabled = true;
          gl.setClearColor(0x000000);
        }}
      >
        <VERAVRScene 
          nervousSystemState={nervousSystemState}
          setNervousSystemState={setNervousSystemState}
        />
      </Canvas>

      {isVRSupported ? (
        <button
          onClick={handleEnterVR}
          style={{
            position: 'fixed',
            bottom: 'calc(50% - 30px)',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '20px 40px',
            fontSize: '18px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #6666ff, #aa33ff)',
            border: '2px solid #fff',
            borderRadius: '50px',
            color: '#fff',
            cursor: 'pointer',
            fontFamily: 'monospace',
            zIndex: '1000',
            boxShadow: '0 0 30px rgba(102, 102, 255, 0.6)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.boxShadow = '0 0 50px rgba(170, 51, 255, 0.8)';
            e.target.style.transform = 'translateX(-50%) scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = '0 0 30px rgba(102, 102, 255, 0.6)';
            e.target.style.transform = 'translateX(-50%) scale(1)';
          }}
        >
          🥽 Enter VR
        </button>
      ) : (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#fff',
          fontFamily: 'monospace',
          fontSize: '16px',
          textAlign: 'center',
          background: 'rgba(0,0,0,0.8)',
          padding: '40px',
          borderRadius: '10px',
          maxWidth: '500px',
          border: '2px solid #6666ff'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '20px' }}>
            🌌 VERA - Hyperdimensional Presence
          </div>
          <div style={{ opacity: 0.7, marginBottom: '20px' }}>
            VR not detected on this device
          </div>
          <div style={{ fontSize: '14px', opacity: 0.6 }}>
            Open this page on Meta Quest 3 browser for the full immersive experience
          </div>
        </div>
      )}
    </div>
  );
}
