'use client';

import React, { useRef, useEffect, useState } from 'react';

export default function VERAVRPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVRSupported, setIsVRSupported] = useState(false);
  const [isInVR, setIsInVR] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Check VR support
    if (typeof navigator !== 'undefined' && 'xr' in navigator) {
      (navigator as any).xr.isSessionSupported('immersive-vr')
        .then((supported: boolean) => {
          setIsVRSupported(supported);
          console.log('✅ VR supported:', supported);
        })
        .catch((err: any) => {
          console.error('VR check failed:', err);
        });
    }

    // Dynamic import Three.js to avoid SSR issues
    const setupScene = async () => {
      try {
        const THREE = await import('three');

        const container = containerRef.current;
        if (!container) return;

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

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.xr.enabled = true;
        renderer.xr.setFoveation(0);
        container.appendChild(renderer.domElement);

        // Create a simple cube
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial({ color: 0x6666ff });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.z = -3;
        scene.add(cube);

        // Add a sphere
        const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0x00ffff });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(2, 0, -3);
        scene.add(sphere);

        // Add lighting
        const light = new THREE.PointLight(0xffffff, 1);
        light.position.set(5, 5, 5);
        scene.add(light);

        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);

        // Animation loop
        const animate = () => {
          renderer.render(scene, camera);

          // Rotate cube
          cube.rotation.x += 0.01;
          cube.rotation.y += 0.01;

          // Rotate sphere
          sphere.rotation.y += 0.02;
        };

        renderer.setAnimationLoop(animate);

        // Handle window resize
        const handleResize = () => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
          window.removeEventListener('resize', handleResize);
          container.removeChild(renderer.domElement);
        };
      } catch (error) {
        console.error('Scene setup error:', error);
        setErrorMsg('Failed to setup 3D scene: ' + String(error));
      }
    };

    setupScene();
  }, []);

  const enterVR = async () => {
    try {
      console.log('Requesting VR session...');
      const session = await (navigator as any).xr.requestSession('immersive-vr', {
        requiredFeatures: ['local-floor'],
        optionalFeatures: ['bounded-floor', 'hand-tracking']
      });

      console.log('✅ VR session started');
      setIsInVR(true);

      session.addEventListener('end', () => {
        console.log('VR session ended');
        setIsInVR(false);
      });
    } catch (error: any) {
      console.error('❌ VR error:', error);
      setErrorMsg('VR Error: ' + error.message);
    }
  };

  return (
    <div
      ref={containerRef}
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
            <div
              style={{
                color: '#f66',
                fontSize: '12px',
                fontFamily: 'monospace',
                padding: '15px',
                background: 'rgba(255, 0, 0, 0.1)',
                borderRadius: '8px'
              }}
            >
              ❌ VR Not Supported
              <br />
              Open on Quest 3 Browser
            </div>
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
                borderRadius: '6px'
              }}
            >
              {errorMsg}
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
            zIndex: 1000
          }}
        >
          ✅ IN VR MODE
        </div>
      )}
    </div>
  );
}
