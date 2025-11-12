'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

const ORB_VERTEX_SHADER = `
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ORB_FRAGMENT_SHADER = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;

  void main() {
    float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
    float pulse = sin(uTime * 0.6) * 0.5 + 0.5;
    float gradient = clamp(vPosition.y * 0.3 + 0.5, 0.0, 1.0);
    vec3 base = mix(uColorA, uColorB, pulse);
    vec3 tint = mix(base, vec3(0.8, 0.7, 1.0), gradient);
    vec3 color = tint + fresnel * vec3(0.6, 0.5, 1.1);
    gl_FragColor = vec4(color, 1.0);
  }
`;

interface VRSceneRefs {
  scene: any;
  orb: any;
  orbMaterial: any;
  orbUniforms: any;
  glow: any;
  starfield: any;
  neuronGroup: any;
  lightCone: any;
}

export default function VERAVRPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<any>(null);
  const sceneRefsRef = useRef<VRSceneRefs | null>(null);
  const [isVRSupported, setIsVRSupported] = useState(false);
  const [isInVR, setIsInVR] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [vrStatus, setVrStatus] = useState('');
  const [debugEnabled, setDebugEnabled] = useState(false);
  const [voiceLog, setVoiceLog] = useState<string[]>([]);
  const isMountedRef = useRef(true);
  const voiceRef = useRef<SpeechSynthesis | null>(null);
  const hasSpokenRef = useRef(false);
  const clockRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setDebugEnabled(params.get('debug') === '1');
    }
  }, []);

  const pushVoiceLog = useCallback((message: string) => {
    setVoiceLog((prev) => [...prev.slice(-8), message]);
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    hasSpokenRef.current = false;
    voiceRef.current = window.speechSynthesis;

    // Check VR support
    if (typeof navigator !== 'undefined' && 'xr' in navigator) {
      (navigator as any).xr
        .isSessionSupported('immersive-vr')
        .then((supported: boolean) => {
          if (isMountedRef.current) {
            setIsVRSupported(supported);
          }
        })
        .catch(() => {
          setIsVRSupported(false);
        });
    }

    const setupScene = async () => {
      try {
        const THREE = await import('three');

        const container = containerRef.current;
        if (!container || !isMountedRef.current) return;

        // ===== PREMIUM SCENE SETUP =====
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x050713);
        scene.fog = new THREE.FogExp2(0x050713, 0.045);

        const clock = new THREE.Clock();
        clockRef.current = clock;

        const camera = new THREE.PerspectiveCamera(
          90,
          window.innerWidth / window.innerHeight,
          0.1,
          1000
        );
        camera.position.z = 0;

        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          precision: 'highp',
          powerPreference: 'high-performance'
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio * 1.5, 2));
        renderer.xr.enabled = true;
        renderer.xr.setFoveation(0);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;
        rendererRef.current = renderer;
        container.appendChild(renderer.domElement);

        // ===== PREMIUM LIGHTING SETUP =====
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambientLight);

        const mainLight = new THREE.DirectionalLight(0xffffff, 0.9);
        mainLight.position.set(5, 5, 5);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        mainLight.shadow.camera.far = 20;
        scene.add(mainLight);

        const softLight1 = new THREE.PointLight(0xb8a8ff, 0.6);
        softLight1.position.set(-4, 2, 2);
        scene.add(softLight1);

        const softLight2 = new THREE.PointLight(0xa8c8ff, 0.4);
        softLight2.position.set(4, -2, 2);
        scene.add(softLight2);

        // ===== PREMIUM ORB (VERA PRESENCE) =====
        const orbGeometry = new THREE.IcosahedronGeometry(2.5, 6);
        const orbUniforms = {
          uTime: { value: 0 },
          uColorA: { value: new THREE.Color(0x5065ff) },
          uColorB: { value: new THREE.Color(0xaa77ff) }
        };
        const orbMaterial = new THREE.ShaderMaterial({
          uniforms: orbUniforms,
          vertexShader: ORB_VERTEX_SHADER,
          fragmentShader: ORB_FRAGMENT_SHADER,
          transparent: false
        });
        const orb = new THREE.Mesh(orbGeometry, orbMaterial);
        orb.position.set(0, -0.4, -5.8);
        orb.castShadow = true;
        orb.receiveShadow = true;
        scene.add(orb);

        // Add subtle glow effect to orb
        const glowGeometry = new THREE.IcosahedronGeometry(3.2, 4);
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: 0x6688dd,
          transparent: true,
          opacity: 0.18,
          side: THREE.BackSide
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.copy(orb.position);
        scene.add(glow);

        // ===== ATMOSPHERE & PARTICLES =====
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 1200;
        const starPositions = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount; i++) {
          const radius = 28 + Math.random() * 25;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(Math.random() * 2 - 1);
          starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
          starPositions[i * 3 + 1] = (Math.random() - 0.5) * 22;
          starPositions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
        }
        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        const starMaterial = new THREE.PointsMaterial({
          color: 0x8899ff,
          size: 0.08,
          transparent: true,
          opacity: 0.65,
          depthWrite: false,
          blending: THREE.AdditiveBlending
        });
        const starfield = new THREE.Points(starGeometry, starMaterial);
        scene.add(starfield);

        const neuronGroup = new THREE.Group();
        const neuronCount = 34;
        for (let i = 0; i < neuronCount; i++) {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(Math.random() * 2 - 1);
          const radius = 2.9 + Math.random() * 0.5;
          const basePosition = new THREE.Vector3(
            radius * Math.sin(phi) * Math.cos(theta),
            (Math.random() - 0.5) * 1.2,
            radius * Math.sin(phi) * Math.sin(theta)
          );

          const neuron = new THREE.Group();
          neuron.position.copy(basePosition);
          neuron.userData = {
            base: basePosition.clone(),
            waveOffset: Math.random() * Math.PI * 2
          };

          const somaGeometry = new THREE.IcosahedronGeometry(0.14, 2);
          const somaMaterial = new THREE.MeshBasicMaterial({
            color: 0xd8c7ff,
            transparent: true,
            opacity: 0.9
          });
          const soma = new THREE.Mesh(somaGeometry, somaMaterial);
          neuron.add(soma);

          const branchGeometry = new THREE.BufferGeometry();
          const branchTarget = new THREE.Vector3(
            (Math.random() - 0.5) * 0.9,
            0.4 + Math.random() * 0.6,
            (Math.random() - 0.5) * 0.9
          );
          const branchPositions = new Float32Array([
            0, 0, 0,
            branchTarget.x,
            branchTarget.y,
            branchTarget.z
          ]);
          branchGeometry.setAttribute('position', new THREE.BufferAttribute(branchPositions, 3));
          const branchMaterial = new THREE.LineBasicMaterial({
            color: 0xbfa7ff,
            transparent: true,
            opacity: 0.55
          });
          const branch = new THREE.Line(branchGeometry, branchMaterial);
          neuron.add(branch);

          neuronGroup.add(neuron);
        }
        neuronGroup.position.copy(orb.position);
        scene.add(neuronGroup);

        const coneGeometry = new THREE.ConeGeometry(6, 12, 64, 1, true);
        const coneMaterial = new THREE.MeshBasicMaterial({
          color: 0x3c4aff,
          transparent: true,
          opacity: 0.12,
          blending: THREE.AdditiveBlending,
          side: THREE.BackSide,
          depthWrite: false
        });
        const lightCone = new THREE.Mesh(coneGeometry, coneMaterial);
        lightCone.position.set(0, -4, -7);
        lightCone.rotation.x = Math.PI;
        scene.add(lightCone);

        sceneRefsRef.current = {
          scene,
          orb,
          orbMaterial,
          orbUniforms,
          glow,
          starfield,
          neuronGroup,
          lightCone
        };

        const animate = () => {
          if (!isMountedRef.current) return;

          const elapsed = clockRef.current ? clockRef.current.getElapsedTime() : 0;
          const refs = sceneRefsRef.current;

          if (refs?.orb && refs?.orbUniforms) {
            const riseProgress = Math.min(elapsed / 6, 1);
            const eased = 1 - Math.cos(riseProgress * Math.PI * 0.5);
            const targetY = THREE.MathUtils.lerp(-0.4, 1.05, eased);
            refs.orb.position.y = THREE.MathUtils.lerp(refs.orb.position.y, targetY, 0.04);

            const scale = 1 + Math.sin(elapsed * 0.6) * 0.04;
            refs.orb.scale.setScalar(scale);
            refs.orb.rotation.x += 0.00008;
            refs.orb.rotation.y += 0.00012;
            refs.orbUniforms.uTime.value = elapsed;
          }

          if (refs?.glow) {
            const glowScale = 1.15 + Math.sin(elapsed * 0.5) * 0.04;
            refs.glow.scale.setScalar(glowScale);
            if (refs?.orb) {
              refs.glow.position.copy(refs.orb.position);
            }
          }

          if (refs?.starfield) {
            refs.starfield.rotation.y = elapsed * 0.0025;
            refs.starfield.rotation.x = Math.sin(elapsed * 0.002) * 0.01;
          }

          if (refs?.neuronGroup) {
            refs.neuronGroup.rotation.y = elapsed * 0.04;
            refs.neuronGroup.position.copy(refs.orb.position);
            refs.neuronGroup.children.forEach((neuron: any, index: number) => {
              if (!neuron.userData?.base) return;
              const base = neuron.userData.base;
              const offset = neuron.userData.waveOffset || 0;
              const wave = 1 + Math.sin(elapsed * 0.55 + offset) * 0.05;
              neuron.position.set(
                base.x * wave,
                base.y * (0.9 + Math.sin(elapsed * 1.1 + offset) * 0.05),
                base.z * wave
              );

              neuron.children.forEach((child: any) => {
                if (child.isMesh) {
                  child.rotation.y += 0.004 + index * 0.00015;
                  child.rotation.x += 0.003;
                } else if (child.isLine) {
                  const scaleFactor = 1 + Math.sin(elapsed * 0.45 + offset) * 0.09;
                  child.scale.set(scaleFactor, scaleFactor, scaleFactor);
                }
              });
            });
          }

          if (refs?.lightCone) {
            refs.lightCone.rotation.z = elapsed * 0.05;
            const coneMaterialRef = Array.isArray(refs.lightCone.material)
              ? (refs.lightCone.material[0] as any)
              : (refs.lightCone.material as any);
            coneMaterialRef.opacity = 0.12 + Math.sin(elapsed * 0.5) * 0.04;
          }

          renderer.render(scene, camera);
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
          if (container && renderer.domElement.parentNode === container) {
            container.removeChild(renderer.domElement);
          }
        };
      } catch (error) {
        console.error('Scene setup error:', error);
        if (isMountedRef.current) {
          setErrorMsg('Failed to initialize 3D scene');
        }
      }
    };

    setupScene();

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Auto-play VERA voice on component mount (desktop/mobile landing page)
  useEffect(() => {
    if (!isInVR && isMountedRef.current && isVRSupported) {
      // Try to play voice immediately on first interaction
      const playOnInteraction = () => {
        playVeraVoice();
        document.removeEventListener('click', playOnInteraction);
        document.removeEventListener('touchstart', playOnInteraction);
        document.removeEventListener('mousemove', playOnInteraction);
      };

      // Attach to user interaction (click, touch, or mouse move)
      document.addEventListener('click', playOnInteraction);
      document.addEventListener('touchstart', playOnInteraction);
      document.addEventListener('mousemove', playOnInteraction);

      return () => {
        document.removeEventListener('click', playOnInteraction);
        document.removeEventListener('touchstart', playOnInteraction);
        document.removeEventListener('mousemove', playOnInteraction);
      };
    }
  }, [isInVR, isVRSupported]);

  const playVeraVoice = () => {
    try {
      // Always cancel first
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        console.log('✓ VERA voice START');
        pushVoiceLog('✓ VERA voice START');
      }

      // Create utterance with proper settings
      const utterance = new SpeechSynthesisUtterance(
        'I am VERA. Your nervous system intelligence. I breathe with you. I regulate with you. I keep you organized and sane.'
      );

      // Force browser to accept these settings
      utterance.rate = 0.85; // Slightly slower for clarity
      utterance.pitch = 1.0;
      utterance.volume = 1.0; // FULL VOLUME
      utterance.lang = 'en-US';

      // Log settings to console
      console.log('✓ Rate: 0.85');
      console.log('✓ Volume: 1.0 (FULL)');
      console.log('✓ Language: en-US');
      pushVoiceLog('✓ Rate: 0.85');
      pushVoiceLog('✓ Volume: 1.0 (FULL)');
      pushVoiceLog('✓ Language: en-US');

      // Speak
      if (window.speechSynthesis) {
        window.speechSynthesis.speak(utterance);
        
        utterance.onend = () => {
          console.log('✓ VERA voice END');
          pushVoiceLog('✓ VERA voice END');
        };
        
        utterance.onerror = (error) => {
          console.error('✗ Voice error:', error.error);
          pushVoiceLog(`✗ Voice error: ${error.error}`);
        };
      }
    } catch (err) {
      console.error('✗ Voice exception:', err);
      pushVoiceLog('✗ Voice exception');
    }
  };

  const enterVR = async () => {
    try {
      if (!isVRSupported) {
        setErrorMsg('VR is not supported on this device');
        setVrStatus('VR not supported');
        return;
      }

      setVrStatus('Initializing VR session...');
      const session = await (navigator as any).xr.requestSession('immersive-vr', {
        requiredFeatures: ['local-floor'],
        optionalFeatures: ['bounded-floor', 'hand-tracking', 'dom-overlay'],
        domOverlay: { root: document.body }
      });

      if (!isMountedRef.current) return;

      if (rendererRef.current) {
        rendererRef.current.xr.setSession(session);
        setIsInVR(true);
        setVrStatus('VR session active');

        // Play VERA voice introduction only once
        if (!hasSpokenRef.current) {
          playVeraVoice();
          hasSpokenRef.current = true;
        }
      }

      session.addEventListener('end', () => {
        window.speechSynthesis.cancel();
        if (isMountedRef.current) {
          setIsInVR(false);
          setVrStatus('VR session ended');
          hasSpokenRef.current = false; // Reset for next session
        }
      });
    } catch (error: any) {
      console.error('VR session error:', error);
      if (isMountedRef.current) {
        setErrorMsg(`VR Error: ${error.message || 'Unknown error'}`);
        setVrStatus('VR session failed');
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
        <>
          <div
            style={{
              position: 'fixed',
              inset: 0,
              pointerEvents: 'none',
              background:
                'radial-gradient(circle at 50% 18%, rgba(120, 130, 255, 0.32) 0%, rgba(10, 10, 20, 0) 45%), radial-gradient(circle at 80% 80%, rgba(170, 120, 255, 0.28) 0%, rgba(5, 7, 19, 0) 60%)'
            }}
          />

          <div className="vera-overlay-shell">
            <div className="vera-glass">
              <div className="vera-chip">LIVE NERVOUS SYSTEM FEED</div>
              <h1 className="vera-hero">VERA: Nervous System Intelligence</h1>
              <p className="vera-sub">
                Co-regulate with an adaptive orb that mirrors vagal tone, synchronises breath, and anchors cognition in immersive VR.
              </p>

              <div className="vera-metrics">
                <div className="vera-metric">
                  <span>Vagal Coherence</span>
                  <strong>86%</strong>
                </div>
                <div className="vera-metric">
                  <span>Respiratory Sync</span>
                  <strong>12.4 Hz</strong>
                </div>
                <div className="vera-metric">
                  <span>Emotive Stability</span>
                  <strong>+14 pts</strong>
                </div>
              </div>

              {isVRSupported ? (
                <div className="vera-actions">
                  <button onClick={enterVR} className="vera-primary">
                    <span>→ Enter VERA VR</span>
                    <small>Immersive session • Meta Quest 3</small>
                  </button>
                  <button onClick={() => playVeraVoice()} className="vera-secondary">
                    <span>🔊 Hear VERA Speak</span>
                    <small>1:12 guided regulation</small>
                  </button>
                </div>
              ) : (
                <div className="vera-unsupported">✗ View on a Meta Quest 3 headset to enter immersive mode.</div>
              )}

              <div className="vera-footer">
                <div>Ambient co-regulation active • Neuro-resonance in sync</div>
                <div>Hover the orb to feel responsive modulation</div>
              </div>

              {(vrStatus || errorMsg) && (
                <div className="vera-status">
                  {vrStatus && <span>{vrStatus}</span>}
                  {errorMsg && <span>{errorMsg}</span>}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {debugEnabled && voiceLog.length > 0 && !isInVR && (
        <div className="vera-debug">
          <strong>Voice Diagnostics</strong>
          {voiceLog.map((entry, idx) => (
            <span key={`${entry}-${idx}`}>{entry}</span>
          ))}
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(22px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .vera-overlay-shell {
          position: fixed;
          bottom: 42px;
          left: 50%;
          transform: translateX(-50%);
          width: min(92vw, 960px);
          padding: 0 24px;
          z-index: 140;
          pointer-events: none;
        }

        .vera-glass {
          pointer-events: auto;
          backdrop-filter: blur(28px);
          background: rgba(14, 18, 36, 0.68);
          border: 1px solid rgba(120, 140, 255, 0.25);
          border-radius: 28px;
          padding: 38px 44px;
          box-shadow: 0 38px 90px rgba(20, 20, 80, 0.45);
          animation: fadeInUp 0.9s ease 0.1s forwards;
          opacity: 0;
          color: #f6f8ff;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        }

        .vera-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          letter-spacing: 0.4px;
          text-transform: uppercase;
          color: #8ba3ff;
          background: rgba(90, 110, 220, 0.2);
          border: 1px solid rgba(120, 140, 255, 0.3);
          border-radius: 999px;
          padding: 6px 14px;
        }

        .vera-hero {
          font-size: clamp(34px, 4vw, 56px);
          margin: 22px 0 16px;
          line-height: 1.05;
          letter-spacing: 0.6px;
          font-weight: 700;
        }

        .vera-sub {
          font-size: clamp(16px, 1.4vw, 20px);
          color: #a9b9ff;
          line-height: 1.6;
          margin-bottom: 32px;
          max-width: 640px;
        }

        .vera-metrics {
          display: flex;
          gap: 18px;
          justify-content: space-between;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }

        .vera-metric {
          flex: 1 1 160px;
          background: rgba(120, 140, 255, 0.12);
          border: 1px solid rgba(120, 140, 255, 0.24);
          border-radius: 18px;
          padding: 14px 18px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .vera-metric span {
          font-size: 11px;
          letter-spacing: 0.56px;
          text-transform: uppercase;
          color: #9fb0ff;
        }

        .vera-metric strong {
          font-size: 22px;
          letter-spacing: 0.8px;
          color: #ffffff;
        }

        .vera-actions {
          display: flex;
          gap: 18px;
          flex-wrap: wrap;
          margin-bottom: 32px;
        }

        .vera-primary,
        .vera-secondary {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
          border-radius: 20px;
          border: none;
          cursor: pointer;
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease;
          padding: 18px 26px;
          min-width: 220px;
          font-family: inherit;
        }

        .vera-primary {
          background: linear-gradient(135deg, #a66bff 0%, #d179ff 100%);
          color: #ffffff;
          box-shadow: 0 22px 44px rgba(166, 107, 255, 0.38);
        }

        .vera-primary small {
          font-size: 12px;
          letter-spacing: 0.4px;
          opacity: 0.8;
          text-transform: uppercase;
        }

        .vera-primary:hover {
          transform: translateY(-4px) scale(1.01);
          box-shadow: 0 32px 68px rgba(166, 107, 255, 0.55);
        }

        .vera-secondary {
          background: rgba(166, 107, 255, 0.12);
          color: #d89dff;
          border: 1px solid rgba(166, 107, 255, 0.35);
          box-shadow: 0 16px 36px rgba(166, 107, 255, 0.18);
        }

        .vera-secondary small {
          font-size: 12px;
          letter-spacing: 0.4px;
          opacity: 0.75;
          text-transform: uppercase;
        }

        .vera-secondary:hover {
          transform: translateY(-3px) scale(1.01);
          box-shadow: 0 26px 54px rgba(166, 107, 255, 0.28);
        }

        .vera-unsupported {
          background: rgba(255, 120, 120, 0.15);
          border: 1px solid rgba(255, 120, 120, 0.35);
          color: #ffaaaa;
          border-radius: 16px;
          padding: 16px 22px;
          font-size: 13px;
          letter-spacing: 0.4px;
          text-align: left;
        }

        .vera-footer {
          display: flex;
          flex-wrap: wrap;
          gap: 18px;
          font-size: 12px;
          letter-spacing: 0.48px;
          color: #7f91c8;
        }

        .vera-status {
          margin-top: 24px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 12px;
          letter-spacing: 0.4px;
          color: #8fb3ff;
        }

        .vera-debug {
          position: fixed;
          top: 24px;
          right: 24px;
          background: rgba(10, 14, 30, 0.78);
          border: 1px solid rgba(146, 160, 255, 0.35);
          border-radius: 18px;
          padding: 14px 18px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          color: #cbd4ff;
          font-size: 12px;
          max-width: 260px;
          z-index: 160;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        }

        .vera-debug strong {
          font-size: 11px;
          letter-spacing: 0.4px;
          text-transform: uppercase;
          color: #9fb5ff;
        }

        .vera-debug span {
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .vera-glass {
            padding: 28px;
          }

          .vera-metrics {
            flex-direction: column;
          }

          .vera-actions {
            flex-direction: column;
          }

          .vera-footer {
            flex-direction: column;
          }

          .vera-debug {
            top: auto;
            bottom: 24px;
            right: 16px;
          }
        }
      `}</style>

      {isInVR && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(136, 153, 255, 0.95)',
            color: '#fff',
            padding: '12px 25px',
            borderRadius: '25px',
            fontFamily: '"Segoe UI", sans-serif',
            fontSize: '14px',
            fontWeight: '500',
            zIndex: 1000,
            letterSpacing: '0.5px',
            boxShadow: '0 8px 25px rgba(136, 153, 255, 0.4)'
          }}
        >
          I am present with you.
        </div>
      )}
    </div>
  );
}
