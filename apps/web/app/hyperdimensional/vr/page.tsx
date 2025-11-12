'use client';

import React, { useRef, useEffect, useState } from 'react';

export default function VERASimpleTest() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

    // Setup canvas
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simple 2D canvas for now - will show colored rectangles
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw some UI
    ctx.fillStyle = '#6666ff';
    ctx.fillRect(canvas.width / 2 - 100, canvas.height / 2 - 50, 200, 100);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('🌌 VERA', canvas.width / 2, canvas.height / 2 - 10);
    ctx.font = '14px monospace';
    ctx.fillText('Tap to Enter VR', canvas.width / 2, canvas.height / 2 + 20);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#6666ff';
      ctx.fillRect(canvas.width / 2 - 100, canvas.height / 2 - 50, 200, 100);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 24px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('🌌 VERA', canvas.width / 2, canvas.height / 2 - 10);
      ctx.font = '14px monospace';
      ctx.fillText('Tap to Enter VR', canvas.width / 2, canvas.height / 2 + 20);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
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
        onClick={isVRSupported ? enterVR : undefined}
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
            maxWidth: '500px',
            pointerEvents: isVRSupported ? 'auto' : 'none'
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
            Hyperdimensional Presence
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
                onMouseOver={(e) => {
                  const btn = e.currentTarget;
                  btn.style.background = '#8888ff';
                  btn.style.boxShadow = '0 0 50px rgba(102, 102, 255, 1)';
                }}
                onMouseOut={(e) => {
                  const btn = e.currentTarget;
                  btn.style.background = '#6666ff';
                  btn.style.boxShadow = '0 0 30px rgba(102, 102, 255, 0.8)';
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
