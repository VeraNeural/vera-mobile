'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

const ORB_VERTEX_SHADER = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float uTime;

  void main() {
    vec3 displaced = position + normal * (sin((position.y + uTime * 0.6) * 4.2) * 0.08);
    vNormal = normalize(normalMatrix * normal);
    vPosition = displaced;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const ORB_FRAGMENT_SHADER = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float uTime;
  uniform vec3 uGlowColor;
  uniform vec3 uCoreColor;

  void main() {
    float fresnel = pow(1.0 - dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 3.0);
    float pulse = sin(uTime * 0.8) * 0.5 + 0.5;
    float latitude = smoothstep(-1.5, 1.5, vPosition.y);
    float filament = sin(vPosition.y * 6.0 + uTime * 1.6) * 0.5 + 0.5;
    vec3 energy = mix(uGlowColor, vec3(0.46, 0.74, 1.0), latitude);
    vec3 color = mix(uCoreColor, energy, 0.62 + fresnel * 0.38);
    color += filament * 0.25;
    color += fresnel * vec3(0.25, 0.32, 0.65) * (0.8 + pulse * 0.4);
    gl_FragColor = vec4(color, 1.0);
  }
`;

const SKY_VERTEX_SHADER = `
  varying vec3 vWorldPosition;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const SKY_FRAGMENT_SHADER = `
  varying vec3 vWorldPosition;
  uniform vec3 uTopColor;
  uniform vec3 uBottomColor;
  uniform float uTime;

  void main() {
    vec3 dir = normalize(vWorldPosition);
    float h = clamp(dir.y * 0.5 + 0.5, 0.0, 1.0);
    vec3 gradient = mix(uBottomColor, uTopColor, h);
    float aurora = sin(dir.x * 6.0 + uTime * 0.08) * 0.5 + 0.5;
    aurora *= pow(1.0 - h, 2.2);
    vec3 color = gradient + aurora * vec3(0.2, 0.45, 0.85);
    gl_FragColor = vec4(color, 1.0);
  }
`;

const AURORA_VERTEX_SHADER = `
  varying vec2 vUv;
  uniform float uTime;

  void main() {
    vUv = uv;
    vec3 displaced = position;
    displaced.y += sin((uv.x * 10.0) + uTime * 0.7) * 0.45;
    displaced.z += sin((uv.y * 8.0) + uTime * 0.9) * 0.3;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const AURORA_FRAGMENT_SHADER = `
  varying vec2 vUv;
  uniform float uTime;

  void main() {
    float center = pow(1.0 - abs(vUv.x - 0.5) * 2.0, 3.0);
    float shimmer = sin((vUv.y * 6.0) + uTime * 1.2) * 0.5 + 0.5;
    float glow = center * shimmer;
    vec3 color = mix(vec3(0.2, 0.36, 0.8), vec3(0.6, 0.8, 1.0), glow);
    gl_FragColor = vec4(color, glow * 0.85);
  }
`;

interface SceneRefs {
  orb: any;
  orbUniforms: any;
  halo: any;
  haloOuter: any;
  skyMaterial: any;
  auroraMaterial: any;
  monoliths: any[];
  ribbon: any;
  ribbonData: {
    angles: Float32Array;
    radii: Float32Array;
    heights: Float32Array;
    speeds: Float32Array;
  } | null;
  cameraRig: any;
}

export default function VERAVRPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<any>(null);
  const sceneRefsRef = useRef<SceneRefs | null>(null);
  const clockRef = useRef<any>(null);
  const pointerRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const voiceRef = useRef<SpeechSynthesis | null>(null);
  const isMountedRef = useRef(false);
  const hasSpokenRef = useRef(false);
  const [isVRSupported, setIsVRSupported] = useState(false);
  const [isInVR, setIsInVR] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [vrStatus, setVrStatus] = useState('');
  const [voiceLog, setVoiceLog] = useState<string[]>([]);
  const [debugEnabled, setDebugEnabled] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      voiceRef.current = window.speechSynthesis ?? null;
      const params = new URLSearchParams(window.location.search);
      setDebugEnabled(params.get('debug') === '1');
    }
  }, []);

  const pushVoiceLog = useCallback((message: string) => {
    setVoiceLog((prev) => [...prev.slice(-8), message]);
  }, []);

  const playVeraVoice = useCallback(() => {
    if (!voiceRef.current) return;
    try {
      voiceRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(
        'I am VERA. Your nervous system intelligence. I breathe with you. I regulate with you. I keep you organized and sane.'
      );
      utterance.rate = 0.82;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      utterance.lang = 'en-US';

      pushVoiceLog('✓ VERA voice START');
      pushVoiceLog('✓ Rate 0.82 • Volume 1.00');

      voiceRef.current.speak(utterance);

      utterance.onend = () => pushVoiceLog('✓ VERA voice END');
      utterance.onerror = (err) => pushVoiceLog(`✗ Voice error: ${err.error || 'unknown'}`);
    } catch (err) {
      pushVoiceLog('✗ Voice exception');
    }
  }, [pushVoiceLog]);

  useEffect(() => {
    isMountedRef.current = true;
    hasSpokenRef.current = false;

    if (typeof navigator !== 'undefined' && 'xr' in navigator) {
      (navigator as any).xr
        .isSessionSupported('immersive-vr')
        .then((supported: boolean) => {
          if (isMountedRef.current) {
            setIsVRSupported(supported);
          }
        })
        .catch(() => setIsVRSupported(false));
    }

    const setupScene = async () => {
      try {
        const THREE = await import('three');

        const container = containerRef.current;
        if (!container || !isMountedRef.current) {
          return;
        }

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x050714);
        scene.fog = new THREE.Fog(0x050714, 18, 42);

        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.xr.enabled = true;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        rendererRef.current = renderer;
        container.appendChild(renderer.domElement);

        const clock = new THREE.Clock();
        clockRef.current = clock;

        const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 240);
        const cameraRig = new THREE.Group();
        cameraRig.position.set(0, 1.8, 10.5);
        camera.position.set(0, 0, 0);
        cameraRig.add(camera);
        scene.add(cameraRig);

        const ambientLight = new THREE.AmbientLight(0xbad0ff, 0.45);
        scene.add(ambientLight);

        const keyLight = new THREE.SpotLight(0xe3ecff, 2.4, 120, Math.PI / 4, 0.6, 1.2);
        keyLight.position.set(-6, 12, 12);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 2048;
        keyLight.shadow.mapSize.height = 2048;
        scene.add(keyLight);

        const rimLight = new THREE.PointLight(0x4aa8ff, 1.6, 80, 1.2);
        rimLight.position.set(6, 4, -6);
        scene.add(rimLight);

        const baseLight = new THREE.PointLight(0xffb0f8, 0.8, 60, 2.4);
        baseLight.position.set(0, 1.2, -8);
        scene.add(baseLight);

        const skyGeometry = new THREE.SphereGeometry(140, 64, 64);
        const skyMaterial = new THREE.ShaderMaterial({
          vertexShader: SKY_VERTEX_SHADER,
          fragmentShader: SKY_FRAGMENT_SHADER,
          side: THREE.BackSide,
          uniforms: {
            uTopColor: { value: new THREE.Color(0x111d3a) },
            uBottomColor: { value: new THREE.Color(0x04070f) },
            uTime: { value: 0 }
          }
        });
        const sky = new THREE.Mesh(skyGeometry, skyMaterial);
        scene.add(sky);

        const groundGeometry = new THREE.CircleGeometry(120, 160);
        const groundMaterial = new THREE.MeshPhysicalMaterial({
          color: 0x0b1022,
          metalness: 0.9,
          roughness: 0.08,
          transmission: 0.72,
          thickness: 1.3,
          sheen: 1,
          clearcoat: 1,
          clearcoatRoughness: 0.12
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -1.4;
        ground.receiveShadow = true;
        scene.add(ground);

        const orbGeometry = new THREE.SphereGeometry(2.6, 128, 128);
        const orbUniforms = {
          uTime: { value: 0 },
          uGlowColor: { value: new THREE.Color(0x90c3ff) },
          uCoreColor: { value: new THREE.Color(0xfcfbff) }
        };
        const orbMaterial = new THREE.ShaderMaterial({
          vertexShader: ORB_VERTEX_SHADER,
          fragmentShader: ORB_FRAGMENT_SHADER,
          uniforms: orbUniforms
        });
        const orb = new THREE.Mesh(orbGeometry, orbMaterial);
        orb.position.set(0, 2.6, -7.2);
        orb.castShadow = true;
        scene.add(orb);

        const haloGeometry = new THREE.TorusGeometry(4.8, 0.18, 48, 320);
        const haloMaterial = new THREE.MeshBasicMaterial({
          color: 0xaad5ff,
          transparent: true,
          opacity: 0.5,
          blending: THREE.AdditiveBlending
        });
        const halo = new THREE.Mesh(haloGeometry, haloMaterial);
        halo.position.copy(orb.position);
        halo.rotation.x = Math.PI / 2 - 0.18;
        scene.add(halo);

        const haloOuterGeometry = new THREE.TorusGeometry(6.4, 0.08, 32, 420);
        const haloOuterMaterial = new THREE.MeshBasicMaterial({
          color: 0x6ec9ff,
          transparent: true,
          opacity: 0.22,
          blending: THREE.AdditiveBlending
        });
        const haloOuter = new THREE.Mesh(haloOuterGeometry, haloOuterMaterial);
        haloOuter.position.copy(orb.position);
        haloOuter.rotation.x = Math.PI / 2;
        scene.add(haloOuter);

        const auroraGeometry = new THREE.PlaneGeometry(28, 18, 64, 64);
        const auroraMaterial = new THREE.ShaderMaterial({
          vertexShader: AURORA_VERTEX_SHADER,
          fragmentShader: AURORA_FRAGMENT_SHADER,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          uniforms: {
            uTime: { value: 0 }
          }
        });
        const aurora = new THREE.Mesh(auroraGeometry, auroraMaterial);
        aurora.position.set(0, 5.2, -20);
        aurora.rotation.y = Math.PI;
        scene.add(aurora);

        const monoliths: any[] = [];
        for (let i = 0; i < 7; i++) {
          const height = 3.4 + Math.random() * 3.6;
          const geometry = new THREE.CylinderGeometry(0.4, 0.9, height, 6, 1);
          const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0x1b2340).offsetHSL(Math.random() * 0.02, 0.1, Math.random() * 0.04),
            metalness: 0.6,
            roughness: 0.2,
            emissive: new THREE.Color(0x1c2f6b),
            emissiveIntensity: 0.18
          });
          const monolith = new THREE.Mesh(geometry, material);
          const radius = 10 + Math.random() * 6;
          const angle = (Math.PI * 2 * i) / 7 + Math.random() * 0.4;
          monolith.position.set(Math.cos(angle) * radius, height / 2 - 1.4, Math.sin(angle) * radius - 12);
          monolith.rotation.y = angle + Math.PI / 2;
          monolith.castShadow = true;
          monolith.userData = {
            baseY: monolith.position.y,
            offset: Math.random() * Math.PI * 2,
            rotationSpeed: 0.001 + Math.random() * 0.0025
          };
          monoliths.push(monolith);
          scene.add(monolith);
        }

        const ribbonCount = 900;
        const ribbonGeometry = new THREE.BufferGeometry();
        const ribbonPositions = new Float32Array(ribbonCount * 3);
        const angles = new Float32Array(ribbonCount);
        const radii = new Float32Array(ribbonCount);
        const heights = new Float32Array(ribbonCount);
        const speeds = new Float32Array(ribbonCount);
        for (let i = 0; i < ribbonCount; i++) {
          angles[i] = Math.random() * Math.PI * 2;
          radii[i] = 3.6 + Math.random() * 2.8;
          heights[i] = -0.8 + Math.random() * 3.2;
          speeds[i] = 0.12 + Math.random() * 0.22;
          ribbonPositions[i * 3] = Math.cos(angles[i]) * radii[i];
          ribbonPositions[i * 3 + 1] = heights[i];
          ribbonPositions[i * 3 + 2] = Math.sin(angles[i]) * radii[i];
        }
        ribbonGeometry.setAttribute('position', new THREE.BufferAttribute(ribbonPositions, 3));
        const ribbonMaterial = new THREE.PointsMaterial({
          color: 0x9acfff,
          size: 0.05,
          transparent: true,
          opacity: 0.6,
          depthWrite: false,
          blending: THREE.AdditiveBlending
        });
        const ribbon = new THREE.Points(ribbonGeometry, ribbonMaterial);
        ribbon.position.copy(orb.position);
        ribbon.position.y -= 0.4;
        scene.add(ribbon);

        const animate = () => {
          if (!isMountedRef.current) {
            return;
          }

          const elapsed = clock.getElapsedTime();
          const refs = sceneRefsRef.current;

          if (refs?.orbUniforms) {
            refs.orbUniforms.uTime.value = elapsed;
          }

          if (refs?.orb) {
            const breath = Math.sin(elapsed * 0.35) * 0.18;
            refs.orb.position.y = 2.6 + breath;
            refs.orb.rotation.y += 0.0025;
            refs.orb.rotation.x += 0.0012;
            refs.orb.scale.setScalar(1.0 + Math.sin(elapsed * 0.6) * 0.04);
          }

          if (refs?.halo) {
            refs.halo.rotation.z += 0.0045;
            refs.haloOuter.rotation.z -= 0.002;
          }

          if (refs?.auroraMaterial) {
            refs.auroraMaterial.uniforms.uTime.value = elapsed;
          }

          if (refs?.skyMaterial) {
            refs.skyMaterial.uniforms.uTime.value = elapsed;
          }

          if (refs?.monoliths) {
            refs.monoliths.forEach((monolith: any) => {
              monolith.rotation.y += monolith.userData.rotationSpeed;
              monolith.position.y = monolith.userData.baseY + Math.sin(elapsed * 0.4 + monolith.userData.offset) * 0.35;
            });
          }

          if (refs?.ribbon && refs?.ribbonData) {
            const positions = refs.ribbon.geometry.attributes.position.array as Float32Array;
            for (let i = 0; i < refs.ribbonData.angles.length; i++) {
              refs.ribbonData.angles[i] += refs.ribbonData.speeds[i] * 0.016;
              const radius = refs.ribbonData.radii[i];
              const angle = refs.ribbonData.angles[i];
              positions[i * 3] = Math.cos(angle) * radius;
              positions[i * 3 + 1] = refs.ribbonData.heights[i] + Math.sin(elapsed * 0.6 + i * 0.002) * 0.25;
              positions[i * 3 + 2] = Math.sin(angle) * radius;
            }
            refs.ribbon.geometry.attributes.position.needsUpdate = true;
            refs.ribbon.rotation.y = elapsed * 0.12;
          }

          if (refs?.cameraRig) {
            const pointer = pointerRef.current;
            pointer.x += (pointer.targetX - pointer.x) * 0.04;
            pointer.y += (pointer.targetY - pointer.y) * 0.04;
            refs.cameraRig.rotation.y = pointer.x * 0.18;
            refs.cameraRig.rotation.x = pointer.y * 0.08;
            refs.cameraRig.position.y = 1.8 + Math.sin(elapsed * 0.3) * 0.22;
          }

          renderer.render(scene, camera);
        };

        renderer.setAnimationLoop(animate);

        const handleResize = () => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        };

        const handlePointer = (event: MouseEvent | TouchEvent) => {
          let clientX: number;
          let clientY: number;
          if (event instanceof TouchEvent && event.touches[0]) {
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
          } else if (event instanceof MouseEvent) {
            clientX = event.clientX;
            clientY = event.clientY;
          } else {
            return;
          }
          pointerRef.current.targetX = (clientX / window.innerWidth - 0.5) * 2;
          pointerRef.current.targetY = (clientY / window.innerHeight - 0.5) * 2;
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handlePointer);
        window.addEventListener('touchmove', handlePointer);

        sceneRefsRef.current = {
          orb,
          orbUniforms,
          halo,
          haloOuter,
          skyMaterial,
          auroraMaterial,
          monoliths,
          ribbon,
          ribbonData: { angles, radii, heights, speeds },
          cameraRig
        };

        return () => {
          window.removeEventListener('resize', handleResize);
          window.removeEventListener('mousemove', handlePointer);
          window.removeEventListener('touchmove', handlePointer);
          renderer.setAnimationLoop(null);
          renderer.dispose();
          if (container.contains(renderer.domElement)) {
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

    let cleanup: (() => void) | undefined;

    setupScene().then((maybeCleanup) => {
      if (typeof maybeCleanup === 'function') {
        if (!isMountedRef.current) {
          maybeCleanup();
        } else {
          cleanup = maybeCleanup;
        }
      }
    });

    return () => {
      isMountedRef.current = false;
      const session = rendererRef.current?.xr?.getSession?.();
      if (session) {
        session.end().catch(() => undefined);
      }
      cleanup?.();
    };
  }, [playVeraVoice]);

  useEffect(() => {
    if (!isInVR && isMountedRef.current && isVRSupported) {
      const playOnInteraction = () => {
        playVeraVoice();
        document.removeEventListener('click', playOnInteraction);
        document.removeEventListener('touchstart', playOnInteraction);
        document.removeEventListener('mousemove', playOnInteraction);
      };

      document.addEventListener('click', playOnInteraction, { once: true });
      document.addEventListener('touchstart', playOnInteraction, { once: true });
      document.addEventListener('mousemove', playOnInteraction, { once: true });

      return () => {
        document.removeEventListener('click', playOnInteraction);
        document.removeEventListener('touchstart', playOnInteraction);
        document.removeEventListener('mousemove', playOnInteraction);
      };
    }
  }, [isInVR, isVRSupported, playVeraVoice]);

  const enterVR = useCallback(async () => {
    try {
      if (!isVRSupported) {
        setErrorMsg('VR is not supported on this device');
        setVrStatus('VR not supported');
        return;
      }

      setVrStatus('Initializing VR session...');
      const session = await (navigator as any).xr.requestSession('immersive-vr', {
        requiredFeatures: ['local-floor'],
        optionalFeatures: ['hand-tracking', 'dom-overlay'],
        domOverlay: { root: document.body }
      });

      if (!isMountedRef.current) {
        return;
      }

      if (rendererRef.current) {
        rendererRef.current.xr.setSession(session);
        setIsInVR(true);
        setVrStatus('VR session active');
        if (!hasSpokenRef.current) {
          playVeraVoice();
          hasSpokenRef.current = true;
        }
      }

      session.addEventListener('end', () => {
        voiceRef.current?.cancel();
        if (isMountedRef.current) {
          setIsInVR(false);
          setVrStatus('VR session ended');
          hasSpokenRef.current = false;
        }
      });
    } catch (error: any) {
      console.error('VR session error:', error);
      if (isMountedRef.current) {
        setErrorMsg(`VR Error: ${error.message || 'Unknown error'}`);
        setVrStatus('VR session failed');
      }
    }
  }, [isVRSupported, playVeraVoice]);

  return (
    <div ref={containerRef} className="vera-vr-shell">
      {!isInVR && (
        <>
          <div className="vera-hud">
            <div className="vera-hud__meta">
              <span>VERA // NEURAL SANCTUARY</span>
              <h1>Immersive Nervous System Atmosphere</h1>
              <p>
                Atmospheric aurora, biometric resonance fields, and sentient guidance composed to calm dorsal threat systems while amplifying cortical clarity.
              </p>
            </div>

            <div className="vera-hud__modules">
              <div className="vera-module">
                <header>COHERENCE ARRAY</header>
                <main>
                  <strong>92%</strong>
                  <span>Sympathetic resonance aligned</span>
                </main>
                <footer>Breath cadence synced at 6.1 s • Micro-variability stable</footer>
              </div>

              <div className="vera-module">
                <header>LIMBIC TEMPO</header>
                <main>
                  <strong>10.8 Hz</strong>
                  <span>Neurosonic pulse carrier</span>
                </main>
                <footer>Entrained with cognitive theta • Orbiting filaments responsive</footer>
              </div>

              <div className="vera-module">
                <header>STABILITY GAIN</header>
                <main>
                  <strong>+18 pts</strong>
                  <span>Executive focus uplift</span>
                </main>
                <footer>Executive systems buffered • Mirror field harmonised</footer>
              </div>
            </div>
          </div>

          <div className="vera-holo-strip">
            {isVRSupported ? (
              <div className="vera-holo-actions">
                <button onClick={enterVR} className="vera-holo-actions__primary">
                  <span>→</span>
                  <div>
                    <strong>Enter Immersion</strong>
                    <small>Meta Quest 3 • Adaptive floor scale</small>
                  </div>
                </button>
                <button onClick={playVeraVoice} className="vera-holo-actions__secondary">
                  <span>🔊</span>
                  <div>
                    <strong>Hear VERA Align</strong>
                    <small>72s neurosomatic induction</small>
                  </div>
                </button>
              </div>
            ) : (
              <div className="vera-holo-warning">VR immersion requires Meta Quest 3 • This device renders observatory mode only.</div>
            )}

            {(vrStatus || errorMsg) && (
              <div className="vera-holo-status">
                {vrStatus && <span>{vrStatus}</span>}
                {errorMsg && <span>{errorMsg}</span>}
              </div>
            )}
          </div>

          <div className="vera-latents">
            <div>
              <strong>Ambient signal</strong>
              <span>Orbital aurora sweeping 132° / 18°</span>
            </div>
            <div>
              <strong>Audio field</strong>
              <span>Spatialised whisper • 3D guided resonance</span>
            </div>
            <div>
              <strong>Somatic cue</strong>
              <span>Follow the breathing halo; mirror in through the diaphragm</span>
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

      {isInVR && (
        <div className="vera-vr-banner">I am present with you.</div>
      )}

      <style jsx global>{`
        .vera-vr-shell {
          width: 100vw;
          height: 100vh;
          position: relative;
          overflow: hidden;
          background: radial-gradient(circle at 50% 20%, #0f1c35 0%, #050712 60%, #010109 100%);
        }

        .vera-hud {
          position: absolute;
          top: 10vh;
          right: min(7vw, 110px);
          width: min(32vw, 520px);
          display: flex;
          flex-direction: column;
          gap: 24px;
          padding: 28px 32px 32px;
          backdrop-filter: blur(48px);
          background: rgba(12, 18, 34, 0.58);
          border: 1px solid rgba(124, 171, 255, 0.32);
          border-radius: 30px;
          box-shadow: 0 40px 110px rgba(12, 19, 41, 0.46);
          color: #dfe9ff;
          pointer-events: auto;
        }

        .vera-hud__meta span {
          display: inline-block;
          font-size: 11px;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          color: rgba(164, 195, 255, 0.76);
          padding-bottom: 6px;
        }

        .vera-hud__meta h1 {
          font-size: clamp(28px, 2.4vw, 38px);
          margin: 0 0 18px;
          line-height: 1.08;
          letter-spacing: 0.6px;
        }

        .vera-hud__meta p {
          margin: 0;
          font-size: clamp(15px, 1.1vw, 18px);
          line-height: 1.8;
          color: rgba(209, 224, 255, 0.82);
        }

        .vera-hud__modules {
          display: grid;
          gap: 18px;
        }

        .vera-module {
          padding: 18px 20px 22px;
          border-radius: 22px;
          background: linear-gradient(130deg, rgba(23, 34, 61, 0.86), rgba(30, 42, 73, 0.62));
          border: 1px solid rgba(106, 159, 255, 0.28);
          box-shadow: inset 0 18px 38px rgba(140, 183, 255, 0.08);
        }

        .vera-module header {
          font-size: 11px;
          letter-spacing: 0.64px;
          text-transform: uppercase;
          color: rgba(164, 194, 255, 0.76);
          margin-bottom: 12px;
        }

        .vera-module main {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 12px;
        }

        .vera-module main strong {
          font-size: clamp(26px, 2.2vw, 34px);
          letter-spacing: 0.4px;
          color: #ffffff;
        }

        .vera-module main span {
          font-size: 13px;
          letter-spacing: 0.4px;
          color: rgba(192, 215, 255, 0.72);
        }

        .vera-module footer {
          font-size: 11px;
          letter-spacing: 0.52px;
          color: rgba(174, 203, 255, 0.6);
        }

        .vera-holo-strip {
          position: absolute;
          bottom: 7vh;
          right: min(8vw, 120px);
          padding: 18px 22px;
          border-radius: 26px;
          background: rgba(16, 29, 52, 0.7);
          border: 1px solid rgba(120, 170, 255, 0.28);
          backdrop-filter: blur(38px);
          color: #d7e5ff;
          display: flex;
          flex-direction: column;
          gap: 14px;
          min-width: min(34vw, 520px);
          pointer-events: auto;
        }

        .vera-holo-actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
        }

        .vera-holo-actions__primary,
        .vera-holo-actions__secondary {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 18px;
          border-radius: 20px;
          border: 1px solid rgba(122, 180, 255, 0.38);
          background: rgba(28, 46, 78, 0.66);
          color: #e6f0ff;
          cursor: pointer;
          transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1),
            box-shadow 0.45s ease;
        }

        .vera-holo-actions__primary:hover,
        .vera-holo-actions__secondary:hover {
          transform: translateY(-4px);
          box-shadow: 0 22px 60px rgba(90, 150, 255, 0.34);
        }

        .vera-holo-actions__primary span,
        .vera-holo-actions__secondary span {
          font-size: 18px;
        }

        .vera-holo-actions__primary strong,
        .vera-holo-actions__secondary strong {
          font-size: 15px;
          letter-spacing: 0.4px;
        }

        .vera-holo-actions__primary small,
        .vera-holo-actions__secondary small {
          font-size: 10px;
          letter-spacing: 0.52px;
          text-transform: uppercase;
          color: rgba(198, 219, 255, 0.68);
        }

        .vera-holo-warning {
          font-size: 12px;
          letter-spacing: 0.52px;
          color: rgba(240, 183, 204, 0.78);
        }

        .vera-holo-status {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 11px;
          letter-spacing: 0.5px;
          color: rgba(176, 208, 255, 0.7);
        }

        .vera-latents {
          position: absolute;
          bottom: 6vh;
          left: min(6vw, 100px);
          display: grid;
          gap: 14px;
          background: rgba(11, 19, 32, 0.54);
          border: 1px solid rgba(102, 152, 255, 0.22);
          border-radius: 24px;
          padding: 20px 24px;
          color: #d4e6ff;
          backdrop-filter: blur(32px);
          max-width: min(28vw, 420px);
          pointer-events: auto;
        }

        .vera-latents strong {
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 0.56px;
          color: rgba(164, 197, 255, 0.76);
        }

        .vera-latents span {
          display: block;
          margin-top: 4px;
          font-size: 13px;
          letter-spacing: 0.32px;
          color: rgba(214, 229, 255, 0.76);
        }

        .vera-debug {
          position: absolute;
          top: 24px;
          right: 24px;
          background: rgba(6, 10, 20, 0.78);
          border: 1px solid rgba(96, 138, 224, 0.34);
          border-radius: 18px;
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 12px;
          color: rgba(203, 220, 255, 0.84);
          max-width: 240px;
          pointer-events: auto;
        }

        .vera-debug strong {
          font-size: 10px;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          color: rgba(146, 182, 255, 0.8);
        }

        .vera-vr-banner {
          position: absolute;
          top: 22px;
          left: 50%;
          transform: translateX(-50%);
          padding: 12px 26px;
          border-radius: 32px;
          background: rgba(98, 146, 255, 0.82);
          color: #fff;
          letter-spacing: 0.5px;
          font-size: 14px;
          box-shadow: 0 18px 46px rgba(82, 134, 255, 0.42);
        }

        @media (max-width: 1200px) {
          .vera-hud {
            width: min(38vw, 460px);
            right: 6vw;
          }

          .vera-holo-strip {
            min-width: min(48vw, 460px);
            right: 6vw;
          }
        }

        @media (max-width: 960px) {
          .vera-hud {
            position: static;
            margin: 16vh auto 0;
            width: min(86vw, 520px);
          }

          .vera-holo-strip {
            position: static;
            margin: 18px auto 0;
            width: min(86vw, 520px);
          }

          .vera-latents {
            position: static;
            margin: 18px auto;
            width: min(86vw, 520px);
          }

          .vera-vr-shell {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 24px 0 80px;
            overflow-y: auto;
          }
        }

        @media (max-width: 640px) {
          .vera-hud {
            padding: 24px;
          }

          .vera-holo-strip {
            padding: 16px;
          }

          .vera-holo-actions {
            grid-template-columns: 1fr;
          }

          .vera-latents {
            padding: 16px 20px;
          }
        }
      `}</style>
    </div>
  );
}
