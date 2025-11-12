'use client';

import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

export default function VERAQuestVR() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVRSupported, setIsVRSupported] = useState(false);

  useEffect(() => {
    // Check VR support
    if (navigator.xr) {
      navigator.xr.isSessionSupported('immersive-vr').then(setIsVRSupported).catch(() => setIsVRSupported(false));
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
    
    container.appendChild(renderer.domElement);

    // ═══════════════════════════════════════════════════════════
    // 🌌 VERA HYPERDIMENSIONAL CORE
    // ═══════════════════════════════════════════════════════════

    // 4D Point class for tesseract
    class Point4D {
      x: number; y: number; z: number; w: number;
      constructor(x: number, y: number, z: number, w: number) {
        this.x = x; this.y = y; this.z = z; this.w = w;
      }
      rotateXW(angle: number) {
        const cos = Math.cos(angle), sin = Math.sin(angle);
        return new Point4D(this.x * cos - this.w * sin, this.y, this.z, this.x * sin + this.w * cos);
      }
      rotateYW(angle: number) {
        const cos = Math.cos(angle), sin = Math.sin(angle);
        return new Point4D(this.x, this.y * cos - this.w * sin, this.z, this.y * sin + this.w * cos);
      }
      rotateZW(angle: number) {
        const cos = Math.cos(angle), sin = Math.sin(angle);
        return new Point4D(this.x, this.y, this.z * cos - this.w * sin, this.z * sin + this.w * cos);
      }
      projectTo3D(distance = 2) {
        const factor = distance / (distance - this.w);
        return new THREE.Vector3(this.x * factor, this.y * factor, this.z * factor);
      }
    }

    // Generate tesseract vertices
    function generateTesseractVertices() {
      const vertices = [];
      for (let i = 0; i < 16; i++) {
        vertices.push(new Point4D(
          (i & 1) ? 1 : -1,
          (i & 2) ? 1 : -1,
          (i & 4) ? 1 : -1,
          (i & 8) ? 1 : -1
        ));
      }
      return vertices;
    }

    // Generate tesseract edges
    function generateTesseractEdges() {
      const edges: [number, number][] = [];
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

    const tesseractVertices = generateTesseractVertices();
    const tesseractEdges = generateTesseractEdges();

    // Create tesseract lines
    const linesGeometry = new THREE.BufferGeometry();
    const linesMaterial = new THREE.LineBasicMaterial({ color: 0x6666ff, linewidth: 2 });
    const tesseractLines = new THREE.LineSegments(linesGeometry, linesMaterial);
    scene.add(tesseractLines);

    // Create inner tesseract (dimmer)
    const innerLinesGeometry = new THREE.BufferGeometry();
    const innerLinesMaterial = new THREE.LineBasicMaterial({ color: 0x3333ff, linewidth: 1, transparent: true, opacity: 0.4 });
    const innerLines = new THREE.LineSegments(innerLinesGeometry, innerLinesMaterial);
    scene.add(innerLines);

    // Breathing orb (glow sphere)
    const glowGeometry = new THREE.SphereGeometry(1.2, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({ color: 0x6666ff, transparent: true, opacity: 0.15 });
    const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glowSphere);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x6666ff, 2);
    pointLight.position.set(0, 2, 3);
    scene.add(pointLight);

    // Volumetric particles
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 800;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x33ffaa,
      size: 0.04,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.7
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // VERA group (follows camera)
    const veraGroup = new THREE.Group();
    veraGroup.position.set(0, 0, -2);
    scene.add(veraGroup);

    // Add components to VERA group
    veraGroup.add(tesseractLines);
    veraGroup.add(innerLines);
    veraGroup.add(glowSphere);
    veraGroup.add(particles);

    camera.position.set(0, 1.6, 0);

    // Breathing state
    let breathState = { phase: 0, intensity: 0.5 };

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Breathing animation
      const time = Date.now() * 0.001;
      const cycleTime = 10; // 10 second cycle
      const cyclePosition = (time % cycleTime) / cycleTime;
      
      if (cyclePosition < 0.4) {
        breathState.intensity = cyclePosition / 0.4;
      } else if (cyclePosition < 0.5) {
        breathState.intensity = 1;
      } else if (cyclePosition < 0.9) {
        breathState.intensity = 1 - (cyclePosition - 0.5) / 0.4;
      } else {
        breathState.intensity = 0.2;
      }

      // Update tesseract
      const angleXW = time * 0.3;
      const angleYW = time * 0.2;
      const angleZW = time * 0.25;
      const breathScale = 0.8 + breathState.intensity * 0.4;

      const projectedVertices = tesseractVertices.map(v => 
        v.rotateXW(angleXW).rotateYW(angleYW).rotateZW(angleZW).projectTo3D(2 + breathState.intensity * 0.5)
      );

      const positionsArray: number[] = [];
      const innerPositionsArray: number[] = [];

      tesseractEdges.forEach(([i, j]) => {
        const v1 = projectedVertices[i];
        const v2 = projectedVertices[j];
        const scaledV1 = v1.clone().multiplyScalar(breathScale);
        const scaledV2 = v2.clone().multiplyScalar(breathScale);

        positionsArray.push(scaledV1.x, scaledV1.y, scaledV1.z);
        positionsArray.push(scaledV2.x, scaledV2.y, scaledV2.z);

        const innerScale = 0.6;
        innerPositionsArray.push(scaledV1.x * innerScale, scaledV1.y * innerScale, scaledV1.z * innerScale);
        innerPositionsArray.push(scaledV2.x * innerScale, scaledV2.y * innerScale, scaledV2.z * innerScale);
      });

      linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positionsArray, 3));
      innerLinesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(innerPositionsArray, 3));

      glowSphere.scale.setScalar(breathScale * 1.2);
      glowMaterial.opacity = breathState.intensity * 0.2;

      // VERA follows camera gaze
      const forward = new THREE.Vector3(0, 0, -1);
      forward.applyQuaternion(camera.quaternion);
      const targetPos = camera.position.clone().add(forward.multiplyScalar(2));
      targetPos.y = camera.position.y;
      veraGroup.position.lerp(targetPos, 0.05);
      veraGroup.lookAt(camera.position);

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
      if (container && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      linesGeometry.dispose();
      linesMaterial.dispose();
      innerLinesGeometry.dispose();
      innerLinesMaterial.dispose();
      glowGeometry.dispose();
      glowMaterial.dispose();
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
            background: 'linear-gradient(135deg, #6666ff, #aa33ff)',
            color: '#fff',
            border: '2px solid #fff',
            borderRadius: '50px',
            cursor: 'pointer',
            fontFamily: 'monospace',
            zIndex: 1000,
            boxShadow: '0 0 30px rgba(102, 102, 255, 0.6)'
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
          padding: '40px',
          border: '2px solid #6666ff',
          borderRadius: '10px',
          background: 'rgba(0,0,0,0.8)'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '20px' }}>🌌 VERA - Hyperdimensional Presence</div>
          <div>VR not available on this device</div>
          <div style={{ fontSize: '12px', marginTop: '20px', opacity: 0.6 }}>
            Use Meta Quest 3 browser
          </div>
        </div>
      )}
    </div>
  );
}
