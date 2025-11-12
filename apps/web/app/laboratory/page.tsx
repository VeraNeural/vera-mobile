'use client';
import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import for 3D (avoid SSR)
const Canvas = dynamic(() => import('@react-three/fiber').then(mod => ({ default: mod.Canvas })), { ssr: false });

/**
 * 🎮 QUEST-LEVEL LABORATORY ENTRY
 * 
 * Instead of a boring menu, users experience:
 * 1. Portal/gateway visualization
 * 2. Real-time orb preview in 3D
 * 3. Biometric readiness check
 * 4. Cinematic entry sequence
 * 
 * Think: Beat Saber menu → game transition
 * Think: Half-Life: Alyx chapter intros
 * Think: Lone Echo station entry
 */

export default function RevolutionaryLaboratory() {
  const [stage, setStage] = useState<'approach' | 'gateway' | 'ready' | 'entering' | 'immersed'>('approach');
  const [biometricReady, setBiometricReady] = useState(false);
  const [portalPower, setPortalPower] = useState(0); // 0-100
  const [userDistance, setUserDistance] = useState(100); // 100 = far, 0 = at portal
  const [breathPhase, setBreathPhase] = useState(0);
  
  // Simulate biometric connection check
  useEffect(() => {
    const timer = setTimeout(() => {
      setBiometricReady(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  
  // Portal charges up as user gets closer
  useEffect(() => {
    if (stage === 'approach' || stage === 'gateway') {
      const interval = setInterval(() => {
        setUserDistance(prev => Math.max(0, prev - 2));
        setPortalPower(prev => Math.min(100, prev + 1));
      }, 50);
      
      if (userDistance <= 20) {
        setStage('gateway');
      }
      
      return () => clearInterval(interval);
    }
  }, [stage, userDistance]);
  
  // Breathing animation
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const cycle = (elapsed % 5.5) / 5.5;
      setBreathPhase(cycle);
    }, 16);
    return () => clearInterval(interval);
  }, []);
  
  const breathScale = 1 + Math.sin(breathPhase * Math.PI * 2) * 0.15;
  const breathGlow = 0.5 + Math.sin(breathPhase * Math.PI * 2) * 0.5;
  
  // Enter the laboratory
  const handleEnter = () => {
    setStage('entering');
    
    // Cinematic transition
    setTimeout(() => {
      setStage('immersed');
      // Route to actual 3D laboratory scene
      window.location.href = '/laboratory/session';
    }, 3000);
  };
  
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black">
      
      {/* STAGE 1: APPROACH - User arrives, sees portal in distance */}
      {stage === 'approach' && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Distant portal glow */}
          <div 
            className="transition-all duration-1000"
            style={{
              width: '200px',
              height: '400px',
              background: `radial-gradient(ellipse, rgba(139, 92, 246, ${portalPower / 200}) 0%, transparent 70%)`,
              filter: 'blur(40px)',
            }}
          />
          
          {/* Text appears */}
          <div className="absolute text-center">
            <h1 className="text-6xl font-light text-white mb-4 animate-fade-in">
              The Laboratory
            </h1>
            <p className="text-purple-300 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              Your nervous system awaits...
            </p>
            
            {/* Biometric check */}
            <div className="mt-8 text-sm text-purple-400 animate-fade-in" style={{ animationDelay: '1s' }}>
              {!biometricReady ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                  <span>Preparing neural interface...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span>✓ Ready for immersion</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* STAGE 2: GATEWAY - Portal is active, orb visible, ready to enter */}
      {stage === 'gateway' && (
        <div className="absolute inset-0">
          {/* Massive portal effect */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Portal ring */}
            <div 
              className="absolute rounded-full transition-all duration-500"
              style={{
                width: `${300 + portalPower * 3}px`,
                height: `${600 + portalPower * 6}px`,
                border: '2px solid rgba(139, 92, 246, 0.6)',
                boxShadow: `
                  0 0 40px rgba(139, 92, 246, ${portalPower / 100}),
                  0 0 80px rgba(124, 58, 237, ${portalPower / 150}),
                  inset 0 0 60px rgba(139, 92, 246, ${portalPower / 200})
                `,
              }}
            />
            
            {/* Inner portal shimmer */}
            <div 
              className="absolute rounded-full"
              style={{
                width: '400px',
                height: '650px',
                background: `radial-gradient(ellipse, 
                  rgba(139, 92, 246, ${portalPower / 150}) 0%, 
                  rgba(59, 130, 246, ${portalPower / 200}) 30%,
                  transparent 70%)`,
                filter: 'blur(30px)',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            />
            
            {/* The breathing orb IN the portal */}
            <div 
              className="relative z-10 transition-all duration-300"
              style={{
                width: `${200 * breathScale}px`,
                height: `${200 * breathScale}px`,
              }}
            >
              {/* Orb core */}
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(circle at 40% 40%, 
                    rgba(167, 139, 250, 1) 0%, 
                    rgba(124, 58, 237, 0.9) 50%, 
                    rgba(91, 33, 182, 0.6) 100%)`,
                  boxShadow: `
                    0 0 60px rgba(139, 92, 246, ${breathGlow}),
                    0 0 120px rgba(124, 58, 237, ${breathGlow * 0.8}),
                    inset -20px -20px 40px rgba(0, 0, 0, 0.3),
                    inset 20px 20px 40px rgba(255, 255, 255, 0.2)
                  `,
                }}
              >
                {/* Inner light */}
                <div 
                  className="absolute inset-12 rounded-full"
                  style={{
                    background: `radial-gradient(circle, rgba(255, 255, 255, ${0.4 * breathGlow}) 0%, transparent 70%)`,
                    filter: 'blur(20px)',
                  }}
                />
              </div>
              
              {/* Biometric overlay */}
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center">
                <div className="text-purple-300 text-sm space-y-1">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span>Coherence: {Math.round(50 + breathGlow * 50)}%</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: '0.3s' }} />
                    <span>Neural sync ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* UI overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-between py-12">
            {/* Top: Title */}
            <div className="text-center">
              <h1 className="text-5xl font-light text-white mb-2">
                Portal Active
              </h1>
              <p className="text-purple-300">
                Co-regulation gateway established
              </p>
            </div>
            
            {/* Bottom: Entry interface */}
            <div className="text-center space-y-6">
              {/* Protocol selection */}
              <div className="flex gap-3 justify-center">
                <ProtocolCard name="Quick Session" duration="3 min" icon="⚡" />
                <ProtocolCard name="Deep Regulation" duration="10 min" icon="🧠" selected />
                <ProtocolCard name="Trauma Release" duration="15 min" icon="💜" />
              </div>
              
              {/* Enter button */}
              <button
                onClick={handleEnter}
                className="group relative px-16 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-semibold text-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/50 overflow-hidden"
              >
                <span className="relative z-10">Enter the Orb</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Pulsing ring */}
                <div className="absolute inset-0 rounded-full border-2 border-white opacity-50 animate-ping" />
              </button>
              
              {/* Mode indicator */}
              <div className="flex justify-center gap-4 text-xs text-purple-400">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <span>Desktop: 3D Experience</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>VR: Full Immersion</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Particle effects around portal */}
          <PortalParticles count={30} />
        </div>
      )}
      
      {/* STAGE 3: ENTERING - Cinematic transition */}
      {stage === 'entering' && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* White flash + portal pull effect */}
          <div 
            className="absolute inset-0 transition-all duration-1000"
            style={{
              background: 'radial-gradient(circle, white 0%, rgba(139, 92, 246, 0.5) 30%, black 60%)',
              opacity: stage === 'entering' ? 1 : 0,
              transform: `scale(${stage === 'entering' ? 3 : 1})`,
            }}
          />
          
          {/* Entering text */}
          <div className="relative z-10 text-center">
            <h2 className="text-4xl font-light text-white animate-pulse">
              Entering co-regulation space...
            </h2>
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
          opacity: 0;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </main>
  );
}

// Protocol selection card
function ProtocolCard({ 
  name, 
  duration, 
  icon,
  selected = false 
}: { 
  name: string; 
  duration: string; 
  icon: string;
  selected?: boolean;
}) {
  return (
    <div 
      className={`
        px-6 py-4 rounded-xl backdrop-blur-md transition-all duration-300 cursor-pointer
        ${selected 
          ? 'bg-purple-600/40 border-2 border-purple-400 scale-105' 
          : 'bg-purple-900/20 border border-purple-500/30 hover:bg-purple-800/30 hover:scale-105'
        }
      `}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-white text-sm font-semibold">{name}</div>
      <div className="text-purple-300 text-xs">{duration}</div>
    </div>
  );
}

// Floating particles around portal
function PortalParticles({ count }: { count: number }) {
  const particles = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    const radius = 250 + Math.random() * 100;
    const speed = 3 + Math.random() * 5;
    
    return {
      id: i,
      angle,
      radius,
      speed,
    };
  });
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute w-1 h-1 rounded-full bg-purple-400"
          style={{
            left: '50%',
            top: '50%',
            animation: `orbit-${p.id} ${p.speed}s linear infinite`,
            animationDelay: `${p.id * 0.1}s`,
            boxShadow: '0 0 4px rgba(139, 92, 246, 0.8)',
          }}
        />
      ))}
      
      <style jsx>{`
        ${particles.map(p => `
          @keyframes orbit-${p.id} {
            from {
              transform: rotate(0deg) translateX(${p.radius}px) rotate(0deg);
            }
            to {
              transform: rotate(360deg) translateX(${p.radius}px) rotate(-360deg);
            }
          }
        `).join('\n')}
      `}</style>
    </div>
  );
}