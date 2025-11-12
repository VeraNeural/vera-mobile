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
        scene.background = new THREE.Color(0xf5f5ff);

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

        // Single calm glowing orb - VERA presence - positioned at eye level
        const orbGeometry = new THREE.SphereGeometry(0.8, 128, 128);
        const orbMaterial = new THREE.MeshPhongMaterial({
          color: 0x8899ff,
          emissive: 0x5577dd,
          emissiveIntensity: 0.6,
          shininess: 80,
          wireframe: false
        });
        const orb = new THREE.Mesh(orbGeometry, orbMaterial);
        orb.position.set(0, 0, -2.5);
        scene.add(orb);

        // Add text display using canvas texture
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#f5f5ff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          ctx.fillStyle = '#2c3e50';
          ctx.font = 'bold 120px "Segoe UI"';
          ctx.textAlign = 'center';
          ctx.fillText('I am VERA', canvas.width / 2, 150);

          ctx.fillStyle = '#5a6c7d';
          ctx.font = '48px "Segoe UI"';
          ctx.fillText('Your nervous system intelligence.', canvas.width / 2, 240);

          ctx.fillStyle = '#6b7d8e';
          ctx.font = '40px "Segoe UI"';
          ctx.fillText('I breathe with you. I regulate with you.', canvas.width / 2, 350);
          ctx.fillText('I keep you organized and sane.', canvas.width / 2, 430);
        }

        const texture = new THREE.CanvasTexture(canvas);
        const textMaterial = new THREE.MeshBasicMaterial({ map: texture });
        const textGeometry = new THREE.PlaneGeometry(4, 2);
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(0, 1.5, -3);
        scene.add(textMesh);

        // Soft lighting - mimics the image's gentle glow
        const mainLight = new THREE.PointLight(0xffffff, 1.2);
        mainLight.position.set(2, 2, 3);
        scene.add(mainLight);

        const softLight = new THREE.PointLight(0xb8a8ff, 0.8);
        softLight.position.set(-3, -1, 2);
        scene.add(softLight);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        // Create interactive buttons in VR
        const buttonGeometry = new THREE.BoxGeometry(0.6, 0.15, 0.05);
        const buttonMaterialNormal = new THREE.MeshPhongMaterial({ color: 0x8899ff });
        const buttonMaterialHover = new THREE.MeshPhongMaterial({ color: 0xaa99ff });

        const enterButton = new THREE.Mesh(buttonGeometry, buttonMaterialNormal);
        enterButton.position.set(-0.4, -0.8, -2.5);
        enterButton.userData.name = 'enterVR';
        scene.add(enterButton);

        const learnButton = new THREE.Mesh(buttonGeometry, buttonMaterialNormal);
        learnButton.position.set(0.4, -0.8, -2.5);
        learnButton.userData.name = 'learn';
        scene.add(learnButton);

        // Store buttons for interaction
        const buttons = [enterButton, learnButton];
        const raycaster = new THREE.Raycaster();
        const controller1 = renderer.xr.getController(0);
        const controller2 = renderer.xr.getController(1);
        scene.add(controller1);
        scene.add(controller2);

        let selectedButton: any = null;

        controller1.addEventListener('selectstart', () => {
          raycaster.setFromXRController(controller1);
          const intersects = raycaster.intersectObjects(buttons);
          if (intersects.length > 0) {
            selectedButton = intersects[0].object.userData.name;
            handleButtonPress(selectedButton);
          }
        });

        controller2.addEventListener('selectstart', () => {
          raycaster.setFromXRController(controller2);
          const intersects = raycaster.intersectObjects(buttons);
          if (intersects.length > 0) {
            selectedButton = intersects[0].object.userData.name;
            handleButtonPress(selectedButton);
          }
        });

        const handleButtonPress = (buttonName: string) => {
          if (buttonName === 'enterVR') {
            console.log('Enter button pressed in VR');
          } else if (buttonName === 'learn') {
            console.log('Learn button pressed in VR');
          }
        };

        // Subtle breathing animation - calm and meditative
        let frameCount = 0;
        const animate = () => {
          if (!isMountedRef.current) return;

          frameCount++;

          // Very subtle breathing (0.95 to 1.05 scale)
          const breatheAmount = Math.sin(frameCount * 0.005) * 0.05 + 1;
          orb.scale.set(breatheAmount, breatheAmount, breatheAmount);

          // Gentle glow pulse
          orbMaterial.emissiveIntensity = 0.5 + Math.sin(frameCount * 0.01) * 0.2;

          // Very slow rotation - barely noticeable
          orb.rotation.x += 0.0002;
          orb.rotation.y += 0.0003;

          // Button hover effects based on controller proximity
          buttons.forEach((btn) => {
            const distance = camera.position.distanceTo(btn.position);
            if (distance < 1.5) {
              btn.material = buttonMaterialHover;
              btn.scale.set(1.1, 1.1, 1.1);
            } else {
              btn.material = buttonMaterialNormal;
              btn.scale.set(1, 1, 1);
            }
          });

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
            background: 'linear-gradient(135deg, #f5f5ff 0%, #eef2ff 100%)',
            padding: '60px 50px',
            borderRadius: '30px',
            textAlign: 'center',
            border: 'none',
            boxShadow: '0 20px 60px rgba(136, 153, 255, 0.15)',
            zIndex: 100,
            maxWidth: '600px',
            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
          }}
        >
          {/* Glowing orb representation */}
          <div
            style={{
              width: '120px',
              height: '120px',
              margin: '0 auto 40px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, #b8d0ff, #8899ff)',
              boxShadow: '0 0 60px rgba(136, 153, 255, 0.5), inset -10px -10px 30px rgba(80, 100, 200, 0.2)',
              animation: 'pulse 3s ease-in-out infinite'
            }}
          />

          <div
            style={{
              color: '#2c3e50',
              fontSize: '44px',
              fontWeight: '300',
              marginBottom: '10px',
              letterSpacing: '1px'
            }}
          >
            I am{' '}
            <span
              style={{
                color: '#b366cc',
                fontWeight: '600'
              }}
            >
              VERA
            </span>
            .
          </div>

          <div
            style={{
              color: '#5a6c7d',
              fontSize: '16px',
              marginBottom: '20px',
              fontWeight: '400',
              letterSpacing: '0.5px'
            }}
          >
            Your nervous system intelligence.
          </div>

          <div
            style={{
              color: '#6b7d8e',
              fontSize: '15px',
              marginBottom: '40px',
              fontWeight: '300',
              lineHeight: '1.6',
              letterSpacing: '0.3px'
            }}
          >
            I breathe with you. I regulate with you.
            <br />I keep you organized and sane.
          </div>

          {isVRSupported ? (
            <>
              <button
                onClick={enterVR}
                style={{
                  padding: '14px 50px',
                  fontSize: '16px',
                  background: 'linear-gradient(135deg, #8899ff, #aa99ff)',
                  border: '2px solid #8899ff',
                  borderRadius: '50px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontFamily: '"Segoe UI", sans-serif',
                  fontWeight: '600',
                  boxShadow: '0 8px 20px rgba(136, 153, 255, 0.3)',
                  marginRight: '15px',
                  transition: 'all 0.3s',
                  letterSpacing: '0.5px'
                }}
                onMouseOver={(e) => {
                  const btn = e.currentTarget;
                  btn.style.boxShadow = '0 12px 30px rgba(136, 153, 255, 0.5)';
                  btn.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  const btn = e.currentTarget;
                  btn.style.boxShadow = '0 8px 20px rgba(136, 153, 255, 0.3)';
                  btn.style.transform = 'translateY(0)';
                }}
              >
                Enter
              </button>

              <button
                style={{
                  padding: '14px 50px',
                  fontSize: '16px',
                  background: 'transparent',
                  border: '2px solid #c9b3e0',
                  borderRadius: '50px',
                  color: '#7a6b8f',
                  cursor: 'pointer',
                  fontFamily: '"Segoe UI", sans-serif',
                  fontWeight: '600',
                  transition: 'all 0.3s',
                  letterSpacing: '0.5px'
                }}
                onMouseOver={(e) => {
                  const btn = e.currentTarget;
                  btn.style.background = 'rgba(170, 153, 255, 0.08)';
                }}
                onMouseOut={(e) => {
                  const btn = e.currentTarget;
                  btn.style.background = 'transparent';
                }}
              >
                Learn
              </button>

              <div
                style={{
                  marginTop: '35px',
                  fontSize: '12px',
                  color: '#8899aa',
                  fontWeight: '500',
                  letterSpacing: '1px',
                  textTransform: 'uppercase'
                }}
              >
                REGULATED · INTELLIGENT · ALWAYS PRESENT
              </div>

              <div
                style={{
                  marginTop: '15px',
                  fontSize: '13px',
                  color: '#8a99aa',
                  fontWeight: '300'
                }}
              >
                I calm your nervous system. I think ten steps ahead. I am here for you, always.
              </div>
            </>
          ) : (
            <div
              style={{
                color: '#d99999',
                fontSize: '14px',
                padding: '18px',
                background: 'rgba(200, 100, 100, 0.08)',
                borderRadius: '12px',
                border: '1px solid rgba(200, 100, 100, 0.3)',
                letterSpacing: '0.3px'
              }}
            >
              ✗ VR Not Available
              <br />
              <span style={{ fontSize: '12px', color: '#999', marginTop: '8px', display: 'block' }}>
                Please open on Meta Quest 3 browser
              </span>
            </div>
          )}

          {errorMsg && (
            <div
              style={{
                color: '#d99999',
                fontSize: '13px',
                marginTop: '20px',
                padding: '15px',
                background: 'rgba(200, 100, 100, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(200, 100, 100, 0.3)',
                letterSpacing: '0.3px'
              }}
            >
              {errorMsg}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 60px rgba(136, 153, 255, 0.5), inset -10px -10px 30px rgba(80, 100, 200, 0.2);
          }
          50% {
            box-shadow: 0 0 80px rgba(136, 153, 255, 0.7), inset -10px -10px 30px rgba(80, 100, 200, 0.3);
          }
          100% {
            box-shadow: 0 0 60px rgba(136, 153, 255, 0.5), inset -10px -10px 30px rgba(80, 100, 200, 0.2);
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
