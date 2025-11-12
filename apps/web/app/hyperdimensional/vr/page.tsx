'use client';

import React, { useRef, useEffect, useState } from 'react';

interface VRSceneRefs {
  scene: any;
  orb: any;
  orbMaterial: any;
  buttons: any[];
  raycaster: any;
  controller1: any;
  controller2: any;
}

export default function VERAVRPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<any>(null);
  const sceneRefsRef = useRef<VRSceneRefs | null>(null);
  const [isVRSupported, setIsVRSupported] = useState(false);
  const [isInVR, setIsInVR] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [vrStatus, setVrStatus] = useState('');
  const isMountedRef = useRef(true);
  const voiceRef = useRef<SpeechSynthesis | null>(null);
  const hasSpokenRef = useRef(false);

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
        scene.background = new THREE.Color(0xf5f5ff);
        scene.fog = new THREE.Fog(0xf5f5ff, 15, 30);

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
        renderer.setPixelRatio(Math.min(window.devicePixelRatio * 2, 2)); // Double pixel ratio for clarity
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
        const orbGeometry = new THREE.IcosahedronGeometry(1.0, 6);
        const orbMaterial = new THREE.MeshPhongMaterial({
          color: 0x8899ff,
          emissive: 0x5577dd,
          emissiveIntensity: 0.7,
          shininess: 120,
          wireframe: false,
          side: THREE.FrontSide
        });
        const orb = new THREE.Mesh(orbGeometry, orbMaterial);
        orb.position.set(0, 1.2, -6.5); // Much further away to prevent text cutoff
        orb.castShadow = true;
        orb.receiveShadow = true;
        scene.add(orb);

        // Add subtle glow effect to orb
        const glowGeometry = new THREE.IcosahedronGeometry(1.05, 6);
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: 0x6688dd,
          transparent: true,
          opacity: 0.2,
          side: THREE.BackSide
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.copy(orb.position); // Copy orb's new position
        scene.add(glow);

        // ===== PREMIUM TEXT RENDERING =====
        const createHighQualityText = () => {
          const canvas = document.createElement('canvas');
          canvas.width = 4096;
          canvas.height = 2048;
          const ctx = canvas.getContext('2d');
          if (!ctx) return null;

          // High quality rendering
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Background
          ctx.fillStyle = '#f5f5ff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Title: "I am VERA"
          ctx.fillStyle = '#2c3e50';
          ctx.font = 'bold 360px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('I am VERA', canvas.width / 2, 500);

          // Purple accent on VERA
          ctx.fillStyle = '#b366cc';
          ctx.textAlign = 'center';
          ctx.font = 'bold 360px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          
          // Subtitle
          ctx.fillStyle = '#5a6c7d';
          ctx.font = '140px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('Your nervous system intelligence.', canvas.width / 2, 850);

          // Body text
          ctx.fillStyle = '#6b7d8e';
          ctx.font = '130px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('I breathe with you. I regulate with you.', canvas.width / 2, 1250);
          ctx.fillText('I keep you organized and sane.', canvas.width / 2, 1550);

          return canvas;
        };

        const textCanvas = createHighQualityText();
        let textMesh: any = null;
        if (textCanvas) {
          const texture = new THREE.CanvasTexture(textCanvas);
          texture.magFilter = THREE.LinearFilter;
          texture.minFilter = THREE.LinearMipmapLinearFilter;
          texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

          const textMaterial = new THREE.MeshStandardMaterial({
            map: texture,
            emissive: new THREE.Color(0xffffff),
            emissiveIntensity: 0.1,
            transparent: true,
            opacity: 0 // Start invisible for fade-in
          });

          const textGeometry = new THREE.PlaneGeometry(10, 5);
          textMesh = new THREE.Mesh(textGeometry, textMaterial);
          textMesh.position.set(0, 0, -6.5); // Match orb distance and center vertically
          textMesh.receiveShadow = true;
          scene.add(textMesh);
        }

        // ===== PREMIUM INTERACTIVE BUTTONS =====
        const buttonGroup = new THREE.Group();
        buttonGroup.position.set(0, -2.2, -6.5); // Much lower + match orb distance
        scene.add(buttonGroup);

        const buttonGeometry = new THREE.BoxGeometry(1.2, 0.3, 0.1);
        const buttonMaterialActive = new THREE.MeshPhongMaterial({
          color: 0x8899ff,
          shininess: 60,
          emissive: 0x5577dd,
          emissiveIntensity: 0.3
        });
        const buttonMaterialHover = new THREE.MeshPhongMaterial({
          color: 0xaa99ff,
          shininess: 80,
          emissive: 0x8877ff,
          emissiveIntensity: 0.5
        });

        const enterButton = new THREE.Mesh(buttonGeometry, buttonMaterialActive.clone());
        enterButton.position.set(-0.8, 0, 0); // Positioned in button group
        enterButton.castShadow = true;
        enterButton.receiveShadow = true;
        enterButton.userData = { name: 'enter', hovered: false };
        buttonGroup.add(enterButton);

        const learnButton = new THREE.Mesh(buttonGeometry, buttonMaterialActive.clone());
        learnButton.position.set(0.8, 0, 0); // Positioned in button group
        learnButton.castShadow = true;
        learnButton.receiveShadow = true;
        learnButton.userData = { name: 'learn', hovered: false };
        buttonGroup.add(learnButton);

        const buttons = [enterButton, learnButton];
        const raycaster = new THREE.Raycaster();
        const controller1 = renderer.xr.getController(0);
        const controller2 = renderer.xr.getController(1);
        scene.add(controller1);
        scene.add(controller2);

        // Controller interaction
        const onSelectStart = (controller: any) => {
          raycaster.setFromXRController(controller);
          const intersects = raycaster.intersectObjects(buttons);
          if (intersects.length > 0) {
            const button = intersects[0].object as any;
            if (button.userData.name === 'enter') {
              console.log('Enter VR action triggered');
            }
          }
        };

        controller1.addEventListener('selectstart', () => onSelectStart(controller1));
        controller2.addEventListener('selectstart', () => onSelectStart(controller2));

        sceneRefsRef.current = {
          scene,
          orb,
          orbMaterial,
          buttons,
          raycaster,
          controller1,
          controller2
        };

        // ===== PREMIUM ANIMATION LOOP =====
        let frameCount = 0;

        const animate = () => {
          if (!isMountedRef.current) return;

          frameCount++;

          // Smooth text fade-in (takes about 4 seconds at 60fps)
          if (textMesh && frameCount < 240) {
            const fadeProgress = Math.min(frameCount / 240, 1);
            (textMesh.material as any).opacity = fadeProgress;
          }

          // Smooth breathing animation
          const breathPhase = Math.sin(frameCount * 0.004) * 0.04 + 1;
          orb.scale.lerp(new THREE.Vector3(breathPhase, breathPhase, breathPhase), 0.1);

          // Smooth glow pulse
          orbMaterial.emissiveIntensity = 0.5 + Math.sin(frameCount * 0.008) * 0.3;

          // Very subtle rotation
          orb.rotation.x += 0.00008;
          orb.rotation.y += 0.00012;

          // Button interaction
          buttons.forEach((btn) => {
            const origin = camera.position;
            const direction = btn.position.clone().sub(origin).normalize();
            raycaster.ray.origin.copy(origin);
            raycaster.ray.direction.copy(direction);

            const distance = origin.distanceTo(btn.position);
            const hovering = distance < 2.5;

            if (hovering && !btn.userData.hovered) {
              btn.userData.hovered = true;
              btn.material = buttonMaterialHover;
            } else if (!hovering && btn.userData.hovered) {
              btn.userData.hovered = false;
              btn.material = buttonMaterialActive;
            }
          });

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
      }

      // Create utterance with proper settings
      const utterance = new SpeechSynthesisUtterance(
        'I am VERA. Your nervous system intelligence. I breathe with you. I regulate with you. I keep you organized and sane.'
      );

      // Force browser to accept these settings
      utterance.rate = 0.85; // Slightly slower for clarity
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      utterance.lang = 'en-US';

      // Speak
      if (window.speechSynthesis) {
        window.speechSynthesis.speak(utterance);
        console.log('✓ VERA voice speaking...');
      }
    } catch (err) {
      console.error('Voice error:', err);
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
          {/* Full-screen 3D background (rendered in container) */}
          
          {/* Bottom overlay UI - minimal and clean */}
          <div
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.7) 40%, rgba(0, 0, 0, 0.85) 100%)',
              padding: '40px 30px 50px',
              textAlign: 'center',
              zIndex: 100,
              fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
              pointerEvents: 'auto'
            }}
          >
            <div
              style={{
                maxWidth: '800px',
                margin: '0 auto'
              }}
            >
              {/* Messaging */}
              <div
                style={{
                  fontSize: '16px',
                  color: '#a8c4ff',
                  marginBottom: '8px',
                  fontWeight: '400',
                  letterSpacing: '0.5px'
                }}
              >
                Real-time biometric feedback
              </div>

              <div
                style={{
                  fontSize: '13px',
                  color: '#8899aa',
                  marginBottom: '25px',
                  fontWeight: '400',
                  letterSpacing: '0.5px'
                }}
              >
                Evidence-based regulation • AI-powered insights • VR immersion
              </div>

              {/* Stats line */}
              <div
                style={{
                  fontSize: '12px',
                  color: '#7a9aaa',
                  marginBottom: '30px',
                  letterSpacing: '0.5px'
                }}
              >
                <span style={{ color: '#66cc88', marginRight: '20px' }}>● Vagal Tone: 84%</span>
                <span style={{ color: '#88aaff' }}>● Coherence: 86%</span>
              </div>

              {/* Action Button */}
              {isVRSupported ? (
                <button
                  onClick={enterVR}
                  className="vera-button"
                  style={{
                    padding: '14px 50px',
                    fontSize: '16px',
                    fontWeight: '600',
                    background: 'linear-gradient(135deg, #aa66ff 0%, #dd77ff 100%)',
                    border: 'none',
                    borderRadius: '50px',
                    color: '#fff',
                    cursor: 'pointer',
                    boxShadow: '0 8px 25px rgba(170, 102, 255, 0.4)',
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseOver={(e) => {
                    const btn = e.currentTarget;
                    btn.style.boxShadow = '0 12px 35px rgba(170, 102, 255, 0.6)';
                    btn.style.transform = 'scale(1.05)';
                  }}
                  onMouseOut={(e) => {
                    const btn = e.currentTarget;
                    btn.style.boxShadow = '0 8px 25px rgba(170, 102, 255, 0.4)';
                    btn.style.transform = 'scale(1)';
                  }}
                >
                  Enter VERA
                </button>
              ) : (
                <div
                  style={{
                    color: '#ff9999',
                    fontSize: '13px',
                    padding: '12px 20px',
                    background: 'rgba(200, 100, 100, 0.15)',
                    borderRadius: '8px',
                    border: '1px solid rgba(200, 100, 100, 0.3)',
                    letterSpacing: '0.3px',
                    display: 'inline-block'
                  }}
                >
                  ✗ Open on Meta Quest 3
                </div>
              )}

              {/* Bottom hint */}
              <div
                style={{
                  marginTop: '30px',
                  fontSize: '11px',
                  color: '#6a7a8a',
                  fontWeight: '400',
                  letterSpacing: '0.5px'
                }}
              >
                Hover the orb to feel the connection
              </div>

              {vrStatus && (
                <div
                  style={{
                    marginTop: '12px',
                    fontSize: '11px',
                    color: '#88aacc',
                    fontWeight: '400'
                  }}
                >
                  {vrStatus}
                </div>
              )}

              {errorMsg && (
                <div
                  style={{
                    marginTop: '12px',
                    fontSize: '11px',
                    color: '#ff9999',
                    fontWeight: '400'
                  }}
                >
                  {errorMsg}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 60px rgba(136, 153, 255, 0.5), inset -10px -10px 30px rgba(80, 100, 200, 0.2);
          }
          50% {
            box-shadow: 0 0 100px rgba(136, 153, 255, 0.8), inset -10px -10px 40px rgba(80, 100, 200, 0.4);
            transform: scale(1.02);
          }
          100% {
            box-shadow: 0 0 60px rgba(136, 153, 255, 0.5), inset -10px -10px 30px rgba(80, 100, 200, 0.2);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .vera-button {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .vera-button:active {
          transform: scale(0.97);
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
