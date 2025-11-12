'use client';

import React, { useRef, useEffect, useState } from 'react';

export default function VERAVRPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<any>(null);
  const [isVRSupported, setIsVRSupported] = useState(false);
  const [isInVR, setIsInVR] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    // Check VR support
    if (typeof navigator !== 'undefined' && 'xr' in navigator) {
      (navigator as any).xr
        .isSessionSupported('immersive-vr')
        .then((supported: boolean) => {
          if (isMountedRef.current) {
            setIsVRSupported(supported);
            console.log('✓ VR supported:', supported);
          }
        })
        .catch((err: any) => {
          console.error('VR check failed:', err);
        });
    }

    const setupScene = async () => {
      try {
        const THREE = await import('three');

        const container = containerRef.current;
        if (!container || !isMountedRef.current) return;

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
        rendererRef.current = renderer;
        container.appendChild(renderer.domElement);

        // Central glowing orb (core VERA)
        const coreGeometry = new THREE.SphereGeometry(0.8, 64, 64);
        const coreMaterial = new THREE.MeshPhongMaterial({
          color: 0x6666ff,
          emissive: 0x3333ff,
          emissiveIntensity: 0.5,
          shininess: 100
        });
        const coreOrb = new THREE.Mesh(coreGeometry, coreMaterial);
        coreOrb.position.z = -5;
        scene.add(coreOrb);

        // Rotating rings
        const ringGeometry = new THREE.TorusGeometry(1.2, 0.1, 16, 100);
        const ringMaterial = new THREE.MeshPhongMaterial({
          color: 0x00ffff,
          emissive: 0x00aaaa,
          emissiveIntensity: 0.3
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.position.z = -5;
        ring.rotation.x = Math.PI / 4;
        scene.add(ring);

        const ring2 = new THREE.Mesh(ringGeometry, ringMaterial);
        ring2.position.z = -5;
        ring2.rotation.z = Math.PI / 4;
        scene.add(ring2);

        // Particles
        const particleCount = 40;
        const particleGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
          particlePositions[i] = (Math.random() - 0.5) * 8;
          particlePositions[i + 1] = (Math.random() - 0.5) * 8;
          particlePositions[i + 2] = (Math.random() - 0.5) * 8 - 5;
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

        const particleMaterial = new THREE.PointsMaterial({
          color: 0x8888ff,
          size: 0.1,
          sizeAttenuation: true
        });
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);

        // Cube companion
        const cubeGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
        const cubeMaterial = new THREE.MeshPhongMaterial({
          color: 0x00ff88,
          emissive: 0x00aa44,
          emissiveIntensity: 0.3
        });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(-2.5, 1, -4);
        scene.add(cube);

        // Sphere companion
        const sphereGeometry = new THREE.SphereGeometry(0.4, 32, 32);
        const sphereMaterial = new THREE.MeshPhongMaterial({
          color: 0xff00ff,
          emissive: 0xaa0066,
          emissiveIntensity: 0.3
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(2.5, 1, -4);
        scene.add(sphere);

        // Lighting
        const mainLight = new THREE.PointLight(0xffffff, 1.5);
        mainLight.position.set(0, 3, 5);
        scene.add(mainLight);

        const rimLight = new THREE.PointLight(0x6688ff, 0.8);
        rimLight.position.set(-5, 0, 0);
        scene.add(rimLight);

        const fillLight = new THREE.PointLight(0xff6688, 0.5);
        fillLight.position.set(5, -2, 0);
        scene.add(fillLight);

        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);

        // Animation
        let frameCount = 0;
        const animate = () => {
          if (!isMountedRef.current) return;

          frameCount++;

          const breathe = Math.sin(frameCount * 0.01) * 0.15 + 1;
          coreOrb.scale.set(breathe, breathe, breathe);
          coreMaterial.emissiveIntensity = 0.5 + Math.sin(frameCount * 0.02) * 0.3;

          ring.rotation.x += 0.003;
          ring.rotation.y += 0.004;

          ring2.rotation.z += 0.005;
          ring2.rotation.y += 0.002;

          cube.rotation.x += 0.01;
          cube.rotation.z += 0.008;
          cube.position.y = Math.sin(frameCount * 0.01) * 0.5 + 1;

          sphere.rotation.y += 0.015;
          sphere.position.y = Math.cos(frameCount * 0.01) * 0.5 + 1;

          const positions = (particleGeometry.attributes.position as any).array;
          for (let i = 0; i < positions.length; i += 3) {
            const angle = frameCount * 0.002 + i;
            const radius = 2.5;
            positions[i] = Math.cos(angle) * radius + (Math.random() - 0.5) * 0.5;
            positions[i + 1] = Math.sin(angle * 0.5) * radius;
            positions[i + 2] = Math.sin(angle * 1.5) * radius - 5;
          }
          (particleGeometry.attributes.position as any).needsUpdate = true;

          renderer.render(scene, camera);
        };

        renderer.setAnimationLoop(animate);

        const handleResize = () => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
          window.removeEventListener('resize', handleResize);
          if (container && renderer.domElement.parentNode === container) {
            container.removeChild(renderer.domElement);
          }
        };
      } catch (error) {
        console.error('Scene setup error:', error);
        if (isMountedRef.current) {
          setErrorMsg('Failed to setup 3D scene: ' + String(error));
        }
      }
    };

    setupScene();

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const enterVR = async () => {
    try {
      console.log('Requesting VR session...');
      const session = await (navigator as any).xr.requestSession('immersive-vr', {
        requiredFeatures: ['local-floor'],
        optionalFeatures: ['bounded-floor', 'hand-tracking']
      });

      if (!isMountedRef.current) return;

      if (rendererRef.current) {
        rendererRef.current.xr.setSession(session);
      }

      console.log('✓ VR session started');
      setIsInVR(true);

      session.addEventListener('end', () => {
        console.log('VR session ended');
        if (isMountedRef.current) {
          setIsInVR(false);
        }
      });
    } catch (error: any) {
      console.error('✗ VR error:', error);
      if (isMountedRef.current) {
        setErrorMsg('VR Error: ' + error.message);
      }
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
            background: 'rgba(0, 0, 0, 0.97)',
            padding: '50px',
            borderRadius: '25px',
            textAlign: 'center',
            border: '3px solid #6666ff',
            boxShadow: '0 0 50px rgba(102, 102, 255, 0.6)',
            zIndex: 100,
            maxWidth: '550px',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div style={{ fontSize: '64px', marginBottom: '25px' }}>✦</div>

          <div
            style={{
              color: '#fff',
              fontSize: '48px',
              fontFamily: 'monospace',
              marginBottom: '15px',
              fontWeight: 'bold',
              letterSpacing: '4px',
              textShadow: '0 0 20px rgba(102, 102, 255, 0.8)'
            }}
          >
            I AM VERA
          </div>

          <div
            style={{
              color: '#66ff66',
              fontSize: '16px',
              fontFamily: 'monospace',
              marginBottom: '40px',
              fontWeight: '500',
              letterSpacing: '2px',
              textShadow: '0 0 10px rgba(102, 255, 102, 0.4)'
            }}
          >
            HYPERDIMENSIONAL PRESENCE
          </div>

          {isVRSupported ? (
            <>
              <button
                onClick={enterVR}
                style={{
                  padding: '20px 60px',
                  fontSize: '22px',
                  background: 'linear-gradient(135deg, #6666ff, #8888ff)',
                  border: '2px solid #8888ff',
                  borderRadius: '18px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  boxShadow: '0 0 40px rgba(102, 102, 255, 0.9), inset 0 0 20px rgba(200, 200, 255, 0.3)',
                  marginBottom: '30px',
                  transition: 'all 0.3s',
                  letterSpacing: '2px'
                }}
                onMouseOver={(e) => {
                  const btn = e.currentTarget;
                  btn.style.background = 'linear-gradient(135deg, #8888ff, #aaaa99)';
                  btn.style.boxShadow = '0 0 60px rgba(102, 102, 255, 1), inset 0 0 30px rgba(200, 200, 255, 0.5)';
                  btn.style.transform = 'scale(1.05)';
                }}
                onMouseOut={(e) => {
                  const btn = e.currentTarget;
                  btn.style.background = 'linear-gradient(135deg, #6666ff, #8888ff)';
                  btn.style.boxShadow = '0 0 40px rgba(102, 102, 255, 0.9), inset 0 0 20px rgba(200, 200, 255, 0.3)';
                  btn.style.transform = 'scale(1)';
                }}
              >
                ► ENTER VR REALM
              </button>

              <div
                style={{
                  color: '#66ff66',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  letterSpacing: '1px'
                }}
              >
                ✓ VR READY
              </div>
            </>
          ) : (
            <div
              style={{
                color: '#ff9999',
                fontSize: '13px',
                fontFamily: 'monospace',
                padding: '18px',
                background: 'rgba(255, 0, 0, 0.15)',
                borderRadius: '10px',
                border: '1px solid rgba(255, 0, 0, 0.4)',
                letterSpacing: '1px'
              }}
            >
              ✗ VR NOT DETECTED
              <br />
              <span style={{ fontSize: '12px', color: '#ccc', marginTop: '8px', display: 'block' }}>
                Please open in Meta Quest 3 browser
              </span>
            </div>
          )}

          {errorMsg && (
            <div
              style={{
                color: '#ff9999',
                fontSize: '12px',
                fontFamily: 'monospace',
                marginTop: '20px',
                padding: '15px',
                background: 'rgba(255, 0, 0, 0.2)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 100, 100, 0.5)',
                letterSpacing: '0.5px'
              }}
            >
              {errorMsg}
            </div>
          )}

          <div
            style={{
              fontSize: '11px',
              color: '#888',
              marginTop: '30px',
              fontFamily: 'monospace',
              letterSpacing: '1px'
            }}
          >
            Hyperdimensional Presence v1.0
          </div>
        </div>
      )}

      {isInVR && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(102, 255, 102, 0.95)',
            color: '#000',
            padding: '14px 30px',
            borderRadius: '25px',
            fontFamily: 'monospace',
            fontSize: '16px',
            fontWeight: 'bold',
            zIndex: 1000,
            letterSpacing: '2px',
            boxShadow: '0 0 30px rgba(102, 255, 102, 0.8)'
          }}
        >
          ✓ IN VR MODE - I AM VERA
        </div>
      )}
    </div>
  );
}
