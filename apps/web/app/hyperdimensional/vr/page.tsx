'use client';

import React, { useRef, useEffect, useState } from 'react';

export default function VERAVRPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVRSupported, setIsVRSupported] = useState(false);
  const [isInVR, setIsInVR] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const sessionRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);

  useEffect(() => {
    // Check VR support
    console.log('Navigator XR available:', typeof navigator !== 'undefined' && 'xr' in navigator);
    
    if (typeof navigator !== 'undefined' && 'xr' in navigator) {
      // Try immersive-vr
      (navigator as any).xr.isSessionSupported('immersive-vr')
        .then((supported: boolean) => {
          console.log('✅ immersive-vr supported:', supported);
          setIsVRSupported(supported);
        })
        .catch((err: any) => {
          console.error('❌ VR check error:', err);
        });

      // Also check inline
      (navigator as any).xr.isSessionSupported('inline')
        .then((supported: boolean) => {
          console.log('✅ Inline mode supported:', supported);
        });
    } else {
      console.log('❌ WebXR not available');
      setErrorMsg('WebXR not available');
    }

    // Setup Three.js scene
    setupScene();
  }, []);

  const setupScene = async () => {
    try {
      const THREE = await import('three');
      const canvas = canvasRef.current;
      
      if (!canvas) {
        console.error('Canvas ref not found');
        return;
      }

      // Scene setup
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000000);

      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 5;

      const renderer = new THREE.WebGLRenderer({ 
        canvas,
        antialias: true, 
        alpha: true 
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.xr.enabled = true;
      renderer.xr.setFoveation(0);
      rendererRef.current = renderer;

      // Create a simple cube
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshPhongMaterial({ color: 0x6666ff });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.z = -3;
      scene.add(cube);

      // Add a sphere
      const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
      const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0x00ffff, emissive: 0x00ffff });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.set(2, 0, -3);
      scene.add(sphere);

      // Add lighting
      const light = new THREE.PointLight(0xffffff, 1.5);
      light.position.set(5, 5, 5);
      scene.add(light);

      const ambientLight = new THREE.AmbientLight(0x606060);
      scene.add(ambientLight);

      // Animation loop
      const animate = () => {
        renderer.render(scene, camera);

        // Rotate cube
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        // Rotate sphere - MORE VISIBLE
        sphere.rotation.x += 0.02;
        sphere.rotation.y += 0.02;
        sphere.rotation.z += 0.015;
      };

      renderer.setAnimationLoop(animate);

      // Handle window resize
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };

      window.addEventListener('resize', handleResize);

      console.log('✅ Three.js scene initialized');

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    } catch (error) {
      console.error('Scene setup error:', error);
      setErrorMsg('Scene setup failed: ' + String(error));
    }
  };

  const enterVR = async () => {
    try {
      console.log('Requesting immersive-vr session...');
      
      if (!('xr' in navigator)) {
        throw new Error('WebXR not available');
      }

      const session = await (navigator as any).xr.requestSession('immersive-vr', {
        requiredFeatures: ['local-floor'],
        optionalFeatures: ['bounded-floor', 'hand-tracking']
      });

      sessionRef.current = session;
      
      if (rendererRef.current) {
        await rendererRef.current.xr.setSession(session);
      }

      console.log('✅ VR session started');
      setIsInVR(true);

      session.addEventListener('end', () => {
        console.log('VR session ended');
        sessionRef.current = null;
        setIsInVR(false);
      });
    } catch (error: any) {
      console.error('❌ VR error:', error);
      setErrorMsg('VR Error: ' + error.message);
    }
  };

  const exitVR = async () => {
    try {
      if (sessionRef.current) {
        console.log('Ending VR session...');
        await sessionRef.current.end();
        sessionRef.current = null;
        setIsInVR(false);
      }
    } catch (error: any) {
      console.error('Exit error:', error);
      setErrorMsg('Exit Error: ' + error.message);
    }
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: '#000',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
        position: 'relative'
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0
        }}
      />

      {!isInVR && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0, 0, 0, 0.95)',
            padding: '40px',
            borderRadius: '20px',
            textAlign: 'center',
            border: '2px solid #6666ff',
            zIndex: 100,
            maxWidth: '500px'
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🌌</div>

          <div
            style={{
              color: '#fff',
              fontSize: '32px',
              fontFamily: 'monospace',
              marginBottom: '20px',
              fontWeight: 'bold'
            }}
          >
            VERA
          </div>

          <div
            style={{
              color: '#999',
              fontSize: '14px',
              fontFamily: 'monospace',
              marginBottom: '30px'
            }}
          >
            Hyperdimensional VR Experience
          </div>

          <div
            style={{
              color: '#666',
              fontSize: '11px',
              fontFamily: 'monospace',
              marginBottom: '20px',
              padding: '10px',
              background: 'rgba(100, 100, 100, 0.1)',
              borderRadius: '6px'
            }}
          >
            Browser: {typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 50) : 'Unknown'}
            <br />
            WebXR: {'xr' in (navigator as any) ? 'Available' : 'Not Available'}
            <br />
            VR Support: {isVRSupported ? '✅ Yes' : '❌ No'}
          </div>

          {isVRSupported ? (
            <>
              <button
                onClick={enterVR}
                style={{
                  padding: '20px 50px',
                  fontSize: '20px',
                  background: '#6666ff',
                  border: '2px solid #8888ff',
                  borderRadius: '15px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  boxShadow: '0 0 30px rgba(102, 102, 255, 0.8)',
                  marginBottom: '20px',
                  transition: 'all 0.2s'
                }}
              >
                🥽 ENTER VR
              </button>

              <div
                style={{
                  color: '#6f6',
                  fontSize: '12px',
                  fontFamily: 'monospace'
                }}
              >
                ✅ VR Ready
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  color: '#f66',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  padding: '15px',
                  background: 'rgba(255, 0, 0, 0.1)',
                  borderRadius: '8px',
                  marginBottom: '15px'
                }}
              >
                ⚠️ immersive-vr Not Detected
                <br />
                (But we can still try!)
              </div>
              
              <button
                onClick={enterVR}
                style={{
                  padding: '20px 50px',
                  fontSize: '20px',
                  background: '#6666ff',
                  border: '2px solid #8888ff',
                  borderRadius: '15px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  boxShadow: '0 0 30px rgba(102, 102, 255, 0.8)',
                  marginBottom: '20px',
                  transition: 'all 0.2s'
                }}
              >
                🥽 TRY VR ANYWAY
              </button>
            </>
          )}

          {errorMsg && (
            <div
              style={{
                color: '#f99',
                fontSize: '11px',
                fontFamily: 'monospace',
                marginTop: '15px',
                padding: '10px',
                background: 'rgba(255, 0, 0, 0.15)',
                borderRadius: '6px',
                maxHeight: '80px',
                overflow: 'auto'
              }}
            >
              Error: {errorMsg}
            </div>
          )}
        </div>
      )}

      {isInVR && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 255, 0, 0.9)',
            color: '#000',
            padding: '12px 24px',
            borderRadius: '20px',
            fontFamily: 'monospace',
            fontSize: '14px',
            fontWeight: 'bold',
            zIndex: 1000,
            display: 'flex',
            gap: '15px',
            alignItems: 'center'
          }}
        >
          <span>✅ IN VR MODE</span>
          <button
            onClick={exitVR}
            style={{
              padding: '8px 16px',
              fontSize: '12px',
              background: '#ff6666',
              border: '1px solid #ff8888',
              borderRadius: '8px',
              color: '#fff',
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontWeight: 'bold'
            }}
          >
            EXIT
          </button>
        </div>
      )}
    </div>
  );
}
