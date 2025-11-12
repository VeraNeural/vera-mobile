'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ═══════════════════════════════════════════════════════════
// 🥽 VERA QUEST 3 TEST - NEXT.JS VERSION
// ═══════════════════════════════════════════════════════════

function TestCube() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });
  
  return (
    <mesh ref={meshRef} position={[0, 1.6, -2]}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
    </mesh>
  );
}

function GridFloor() {
  return (
    <gridHelper args={[10, 10, '#444444', '#222222']} position={[0, 0, 0]} />
  );
}

function SimpleVRScene() {
  const { gl } = useThree();
  
  useEffect(() => {
    if (gl.xr) {
      gl.xr.enabled = true;
    }
  }, [gl]);

  return (
    <>
      <color attach="background" args={['#111111']} />
      
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 2, 0]} intensity={2} color="#ffffff" />
      <pointLight position={[2, 1, -2]} intensity={1} color="#6666ff" />
      <pointLight position={[-2, 1, -2]} intensity={1} color="#ff6666" />
      
      <GridFloor />
      <TestCube />
      
      <mesh position={[0.8, 1.6, -2]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={1} />
      </mesh>
      
      <mesh position={[0, 2, -2]}>
        <boxGeometry args={[1, 0.1, 0.1]} />
        <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={1} />
      </mesh>
    </>
  );
}

export default function VERASimpleTest() {
  const [isVRSupported, setIsVRSupported] = useState(false);
  const [isInVR, setIsInVR] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [canvasReady, setCanvasReady] = useState(false);
  const glRef = useRef<any>(null);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'xr' in navigator) {
      (navigator as any).xr.isSessionSupported('immersive-vr')
        .then((supported: boolean) => {
          setIsVRSupported(supported);
          console.log(supported ? '✅ VR supported' : '❌ VR not supported');
        })
        .catch((err: any) => {
          console.error('VR check failed:', err);
          setIsVRSupported(false);
        });
    }
    setCanvasReady(true);
  }, []);

  const enterVR = async () => {
    if (!glRef.current) {
      setErrorMsg('GL not ready');
      return;
    }

    try {
      console.log('Requesting VR session...');
      
      const session = await (navigator as any).xr.requestSession('immersive-vr', {
        optionalFeatures: ['local-floor', 'bounded-floor']
      });
      
      console.log('✅ VR session created');
      
      await glRef.current.xr.setSession(session);
      console.log('✅ Session set');
      
      setIsInVR(true);

      session.addEventListener('end', () => {
        console.log('VR session ended');
        setIsInVR(false);
      });
      
    } catch (error: any) {
      console.error('❌ VR failed:', error);
      setErrorMsg('Failed: ' + error.message);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000', position: 'relative' }}>
      {!canvasReady && (
        <div style={{ color: '#fff', textAlign: 'center', paddingTop: '50px' }}>
          Loading Canvas...
        </div>
      )}
      
      {canvasReady && (
        <Canvas 
          camera={{ position: [0, 1.6, 3], fov: 75 }}
          onCreated={({ gl }) => {
            try {
              gl.xr.enabled = true;
              glRef.current = gl;
              console.log('✅ Canvas ready, XR enabled');
            } catch (e) {
              console.error('Canvas creation error:', e);
              setErrorMsg('Canvas error: ' + String(e));
            }
          }}
        >
          <SimpleVRScene />
        </Canvas>
      )}

      {!isInVR && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          pointerEvents: 'none'
        }}>
          <div style={{
            background: 'rgba(0, 0, 0, 0.9)',
            padding: '40px',
            borderRadius: '20px',
            textAlign: 'center',
            border: '2px solid #6666ff',
            pointerEvents: 'auto'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>
              🌌
            </div>
            
            <div style={{
              color: '#fff',
              fontSize: '32px',
              fontFamily: 'monospace',
              marginBottom: '20px',
              fontWeight: 'bold'
            }}>
              VERA TEST
            </div>
            
            <div style={{
              color: '#999',
              fontSize: '16px',
              fontFamily: 'monospace',
              marginBottom: '30px'
            }}>
              Simple visibility test for Quest 3
            </div>

            {isVRSupported ? (
              <>
                <button
                  onClick={enterVR}
                  style={{
                    padding: '25px 60px',
                    fontSize: '24px',
                    background: '#6666ff',
                    border: '3px solid #8888ff',
                    borderRadius: '15px',
                    color: '#fff',
                    cursor: 'pointer',
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                    boxShadow: '0 0 30px rgba(102, 102, 255, 0.8)',
                    marginBottom: '20px'
                  }}
                >
                  ENTER VR
                </button>
                
                <div style={{
                  color: '#6f6',
                  fontSize: '14px',
                  fontFamily: 'monospace'
                }}>
                  ✅ VR Ready
                </div>
              </>
            ) : (
              <div style={{
                color: '#f66',
                fontSize: '14px',
                fontFamily: 'monospace',
                padding: '20px',
                background: 'rgba(255, 0, 0, 0.1)',
                borderRadius: '10px'
              }}>
                ❌ VR Not Detected<br/>
                Open on Quest 3 Browser
              </div>
            )}

            {errorMsg && (
              <div style={{
                color: '#f66',
                fontSize: '12px',
                fontFamily: 'monospace',
                marginTop: '20px',
                padding: '10px',
                background: 'rgba(255, 0, 0, 0.1)',
                borderRadius: '5px'
              }}>
                Error: {errorMsg}
              </div>
            )}

            <div style={{
              color: '#666',
              fontSize: '12px',
              fontFamily: 'monospace',
              marginTop: '30px',
              lineHeight: '1.6'
            }}>
              You should see:<br/>
              • Red rotating cube<br/>
              • Blue glowing sphere<br/>
              • Yellow line above<br/>
              • Grid floor below
            </div>
          </div>
        </div>
      )}

      {isInVR && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0, 255, 0, 0.8)',
          color: '#000',
          padding: '10px 20px',
          borderRadius: '20px',
          fontFamily: 'monospace',
          fontSize: '14px',
          fontWeight: 'bold',
          zIndex: 1000
        }}>
          ✅ IN VR MODE
        </div>
      )}
    </div>
  );
}
