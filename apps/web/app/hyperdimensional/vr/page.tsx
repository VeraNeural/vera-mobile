'use client';

import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

export default function VERAQuestVR() {
  const containerRef = useRef(null);
  const [isVRSupported, setIsVRSupported] = useState(false);

  useEffect(() => {
    // Check VR support
    if (navigator.xr) {
      navigator.xr.isSessionSupported('immersive-vr').then(setIsVRSupported);
    }

    // Setup Three.js scene
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);
    renderer.xr.enabled = true;
    
    if (container) {
      (container as any).appendChild(renderer.domElement);
    }

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x6666ff, 2);
    pointLight.position.set(0, 2, 5);
    scene.add(pointLight);

    // Create tesseract visualization
    const geometry = new THREE.IcosahedronGeometry(1, 4);
    const material = new THREE.MeshPhongMaterial({
      color: 0x6666ff,
      emissive: 0x3333ff,
      wireframe: false
    });
    const tesseract = new THREE.Mesh(geometry, material);
    scene.add(tesseract);

    // Add particles
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 500;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 10;
      positions[i + 1] = (Math.random() - 0.5) * 10;
      positions[i + 2] = (Math.random() - 0.5) * 10;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x33ffaa,
      size: 0.05,
      sizeAttenuation: true
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    camera.position.z = 3;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      tesseract.rotation.x += 0.005;
      tesseract.rotation.y += 0.007;
      tesseract.rotation.z += 0.003;

      particles.rotation.x += 0.0001;
      particles.rotation.y += 0.0001;

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (container && (container as any).contains(renderer.domElement)) {
        (container as any).removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  const handleVRClick = async () => {
    if (!navigator.xr) return;

    try {
      await navigator.xr.requestSession('immersive-vr', {
        requiredFeatures: ['local-floor'],
        optionalFeatures: ['hand-tracking']
      });
    } catch (error) {
      console.error('VR Error:', error);
    }
  };

  return (
    <div ref={containerRef} style={{ width: '100vw', height: '100vh', background: '#000' }}>
      {isVRSupported ? (
        <button
          onClick={handleVRClick}
          style={{
            position: 'fixed',
            bottom: '50px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '16px 32px',
            fontSize: '16px',
            fontWeight: 'bold',
            background: '#6666ff',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontFamily: 'monospace',
            zIndex: '1000'
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
          textAlign: 'center',
          padding: '40px'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '20px' }}>🌌 VERA VR</div>
          <div>VR not available on this device</div>
          <div style={{ fontSize: '12px', marginTop: '20px', opacity: 0.6 }}>
            Use Meta Quest 3 browser
          </div>
        </div>
      )}
    </div>
  );
}

