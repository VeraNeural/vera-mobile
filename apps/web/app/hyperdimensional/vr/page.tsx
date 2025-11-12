'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const useErrorLogger = () => {
  const [errors, setErrors] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      setErrors(prev => [...prev, `ERROR: ${event.message}`]);
    };

    const consoleError = console.error;
    console.error = (...args: any[]) => {
      setErrors(prev => [...prev, `${args.join(' ')}`]);
      consoleError(...args);
    };

    const consoleLog = console.log;
    console.log = (...args: any[]) => {
      setLogs(prev => [...prev.slice(-5), args.join(' ')]);
      consoleLog(...args);
    };

    window.addEventListener('error', errorHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
      console.error = consoleError;
      console.log = consoleLog;
    };
  }, []);

  return { errors, logs };
};

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
      <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={1} />
    </mesh>
  );
}

function SimpleScene() {
  const { gl } = useThree();
  useEffect(() => {
    if (gl.xr) {
      gl.xr.enabled = true;
      console.log('XR enabled');
    }
  }, [gl]);

  return (
    <>
      <color attach="background" args={['#111111']} />
      <ambientLight intensity={0.8} />
      <pointLight position={[0, 2, 0]} intensity={2} />
      <pointLight position={[2, 1, -2]} intensity={1} color="#6666ff" />
      <TestCube />
      <mesh position={[0.8, 1.6, -2]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={1} />
      </mesh>
      <gridHelper args={[10, 10, '#444444', '#222222']} />
    </>
  );
}

export default function VRWithDebug() {
  const [isInVR, setIsInVR] = useState(false);
  const [status, setStatus] = useState('Checking VR...');
  const [vrSupported, setVRSupported] = useState(false);
  const { errors, logs } = useErrorLogger();
  const glRef = useRef<any>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    const checkVR = async () => {
      try {
        if (!('xr' in navigator)) {
          if (isMountedRef.current) setStatus('WebXR not found');
          return;
        }
        const supported = await (navigator as any).xr.isSessionSupported('immersive-vr');
        if (isMountedRef.current) {
          setVRSupported(supported);
          setStatus(supported ? 'VR Ready!' : 'VR not supported');
        }
      } catch (err: any) {
        if (isMountedRef.current) setStatus('Error: ' + err.message);
      }
    };
    checkVR();
    return () => { isMountedRef.current = false; };
  }, []);

  const enterVR = async () => {
    console.log('Entering VR...');
    try {
      if (!glRef.current) throw new Error('Canvas not ready');
      const session = await (navigator as any).xr.requestSession('immersive-vr', {
        optionalFeatures: ['local-floor', 'bounded-floor']
      });
      await glRef.current.xr.setSession(session);
      if (isMountedRef.current) {
        setIsInVR(true);
        setStatus('VR Active');
      }
      session.addEventListener('end', () => {
        if (isMountedRef.current) {
          setIsInVR(false);
          setStatus('VR ended');
        }
      });
    } catch (err: any) {
      console.log('VR error:', err.message);
      if (isMountedRef.current) setStatus('Error: ' + err.message);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas camera={{ position: [0, 1.6, 3], fov: 75 }} onCreated={({ gl }) => {
        gl.xr.enabled = true;
        glRef.current = gl;
      }}>
        <SimpleScene />
      </Canvas>

      {!isInVR && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: 'rgba(0, 0, 0, 0.95)', padding: '40px', borderRadius: '20px',
            border: '2px solid #6666ff', maxWidth: '90%'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '30px', fontSize: '48px' }}>🌌</div>
            <div style={{
              color: '#fff', fontSize: '32px', fontFamily: 'monospace', 
              fontWeight: 'bold', marginBottom: '20px', textAlign: 'center'
            }}>
              VERA DEBUG
            </div>
            <div style={{
              background: 'rgba(102, 102, 255, 0.1)', padding: '15px', borderRadius: '10px',
              marginBottom: '20px', fontFamily: 'monospace', fontSize: '14px', 
              color: '#fff', textAlign: 'center'
            }}>
              {status}
            </div>
            {vrSupported && (
              <button onClick={enterVR} style={{
                width: '100%', padding: '20px', fontSize: '20px', background: '#6666ff',
                border: '2px solid #8888ff', borderRadius: '10px', color: '#fff',
                cursor: 'pointer', fontFamily: 'monospace', fontWeight: 'bold'
              }}>
                ENTER VR
              </button>
            )}
            {logs.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <div style={{ color: '#6f6', fontSize: '12px', fontFamily: 'monospace', marginBottom: '10px' }}>
                  LOGS:
                </div>
                <div style={{
                  background: '#000', padding: '10px', borderRadius: '5px',
                  fontFamily: 'monospace', fontSize: '11px', color: '#0f0', maxHeight: '150px', overflow: 'auto'
                }}>
                  {logs.map((log, i) => (
                    <div key={i}>{log}</div>
                  ))}
                </div>
              </div>
            )}
            {errors.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <div style={{ color: '#f66', fontSize: '12px', fontFamily: 'monospace', marginBottom: '10px' }}>
                  ERRORS:
                </div>
                <div style={{
                  background: 'rgba(255, 0, 0, 0.1)', border: '1px solid #f66',
                  padding: '10px', borderRadius: '5px', fontFamily: 'monospace',
                  fontSize: '10px', color: '#f66', maxHeight: '200px', overflow: 'auto'
                }}>
                  {errors.map((error, i) => (
                    <div key={i} style={{ marginBottom: '5px' }}>{error}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {isInVR && (
        <div style={{
          position: 'absolute', top: '20px', left: '20px', right: '20px',
          background: 'rgba(0, 0, 0, 0.9)', padding: '20px', borderRadius: '15px',
          border: '2px solid #6f6', fontFamily: 'monospace', fontSize: '14px',
          color: '#fff', zIndex: 1000, maxHeight: '80vh', overflow: 'auto'
        }}>
          <div style={{
            color: '#6f6', fontSize: '18px', marginBottom: '15px',
            fontWeight: 'bold', textAlign: 'center'
          }}>
            VR ACTIVE
          </div>
          <div style={{
            background: 'rgba(0, 255, 0, 0.1)', padding: '10px', borderRadius: '8px',
            marginBottom: '15px', textAlign: 'center', color: '#6f6'
          }}>
            Look for red cube + cyan sphere
          </div>
          {logs.length > 0 && (
            <div style={{ marginBottom: '15px' }}>
              <div style={{ color: '#6f6', marginBottom: '5px', fontSize: '12px' }}>LOGS:</div>
              <div style={{
                background: '#000', padding: '8px', borderRadius: '5px',
                fontSize: '11px', color: '#0f0', maxHeight: '100px', overflow: 'auto'
              }}>
                {logs.slice(-5).map((log, i) => (
                  <div key={i}>{log}</div>
                ))}
              </div>
            </div>
          )}
          {errors.length > 0 && (
            <div>
              <div style={{ color: '#f66', marginBottom: '5px', fontSize: '12px' }}>ERRORS:</div>
              <div style={{
                background: 'rgba(255, 0, 0, 0.2)', border: '1px solid #f66',
                padding: '8px', borderRadius: '5px', fontSize: '10px',
                color: '#f66', maxHeight: '150px', overflow: 'auto'
              }}>
                {errors.map((error, i) => (
                  <div key={i} style={{ marginBottom: '3px' }}>{error}</div>
                ))}
              </div>
            </div>
          )}
          {errors.length === 0 && (
            <div style={{ textAlign: 'center', color: '#6f6', fontSize: '12px', padding: '10px' }}>
              No errors
            </div>
          )}
        </div>
      )}
    </div>
  );
}
