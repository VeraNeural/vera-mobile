'use client';
import { useState, useEffect, useRef } from 'react';

/**
 * 🎬 VERA ULTIMATE CINEMATIC ENTRY
 * 
 * Unity-level polish with:
 * - Sound design (Web Audio API)
 * - Particle system
 * - Camera movements
 * - Microinteractions
 * - Emotional journey
 * 
 * Progression:
 * 1. VOID (0-1s) - Black screen, heartbeat sound starts
 * 2. SPARK (1-3s) - Small light appears, grows
 * 3. AWAKENING (3-6s) - Orb forms, particles emerge
 * 4. BREATHING (6-10s) - Orb breathes, user watches
 * 5. CONNECTION (10+s) - User can interact, CTA appears
 */

export default function UltimateCinematicEntry() {
  const [phase, setPhase] = useState<'void' | 'spark' | 'awakening' | 'breathing' | 'connection'>('void');
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isOrbHovered, setIsOrbHovered] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; vx: number; vy: number }>>([]);
  const [breathPhase, setBreathPhase] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const heartbeatOscRef = useRef<OscillatorNode | null>(null);
  
  // Initialize Web Audio (requires user gesture)
  const initAudio = () => {
    if (typeof window === 'undefined' || audioContextRef.current) return;
    
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    setSoundEnabled(true);
    
    // Start ambient heartbeat tone
    playHeartbeat();
  };
  
  const playHeartbeat = () => {
    if (!audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.value = 60; // Low, rumbling
    gain.gain.value = 0.05;
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    heartbeatOscRef.current = osc;
    
    // Pulse gain with heartbeat
    setInterval(() => {
      if (gain.gain.value < 0.1) {
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 0.3);
      }
    }, 800);
  };
  
  const playSparkSound = () => {
    if (!audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1000, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 1);
    
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 1);
  };
  
  const playBreathSound = () => {
    if (!audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.value = 150;
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 2);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 5);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 5);
  };
  
  // Phase progression
  useEffect(() => {
    const timers = [
      setTimeout(() => {
        setPhase('spark');
        playSparkSound();
      }, 1000),
      setTimeout(() => setPhase('awakening'), 3000),
      setTimeout(() => {
        setPhase('breathing');
        playBreathSound();
      }, 6000),
      setTimeout(() => setPhase('connection'), 10000),
    ];
    
    return () => timers.forEach(clearTimeout);
  }, []);
  
  // Breathing cycle
  useEffect(() => {
    if (phase !== 'breathing' && phase !== 'connection') return;
    
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const cycle = (elapsed % 5.5) / 5.5;
      setBreathPhase(cycle);
    }, 16);
    
    return () => clearInterval(interval);
  }, [phase]);
  
  // Particle system
  useEffect(() => {
    if (phase !== 'awakening' && phase !== 'breathing' && phase !== 'connection') return;
    
    // Generate particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: 50,
      y: 50,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
    }));
    
    setParticles(newParticles);
    
    // Animate particles
    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        x: p.x + p.vx * 0.3,
        y: p.y + p.vy * 0.3,
        vx: p.vx * 0.99 + (50 - p.x) * 0.001,
        vy: p.vy * 0.99 + (50 - p.y) * 0.001,
      })));
    }, 30);
    
    return () => clearInterval(interval);
  }, [phase]);
  
  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Calculate breath scale
  const breathScale = 1 + Math.sin(breathPhase * Math.PI * 2) * 0.15;
  const breathGlow = 0.6 + Math.sin(breathPhase * Math.PI * 2) * 0.4;
  
  // Orb size based on phase
  const orbSize = 
    phase === 'void' ? 0 :
    phase === 'spark' ? 40 :
    phase === 'awakening' ? 200 :
    320;
  
  const orbOpacity = 
    phase === 'void' ? 0 :
    phase === 'spark' ? 0.3 :
    phase === 'awakening' ? 0.7 :
    1;
  
  return (
    <main 
      className="relative min-h-screen overflow-hidden bg-black cursor-none"
      onClick={initAudio}
      onMouseDown={initAudio}
    >
      {/* Custom cursor */}
      <div 
        className="fixed w-6 h-6 rounded-full border-2 border-purple-400 pointer-events-none z-50 mix-blend-difference transition-transform duration-100"
        style={{
          left: `${mousePos.x * 100}%`,
          top: `${mousePos.y * 100}%`,
          transform: `translate(-50%, -50%) scale(${isOrbHovered ? 1.5 : 1})`,
        }}
      />
      
      {/* Dynamic background gradient */}
      <div 
        className="fixed inset-0 transition-all duration-2000"
        style={{
          background: phase === 'void' 
            ? 'black'
            : `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, 
                rgba(139, 92, 246, ${0.15 * breathGlow}) 0%, 
                rgba(0, 0, 0, 1) 60%)`,
        }}
      />
      
      {/* Particle field */}
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute w-1 h-1 rounded-full bg-purple-400 pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: phase === 'connection' ? 0.6 : 0.3,
            transform: `scale(${breathScale})`,
            transition: 'opacity 1s',
            boxShadow: '0 0 4px rgba(139, 92, 246, 0.8)',
          }}
        />
      ))}
      
      {/* Main content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center">
        
        {/* The Orb - cinematic reveal */}
        <div 
          className="relative transition-all duration-1000 ease-out"
          style={{
            width: `${orbSize}px`,
            height: `${orbSize}px`,
            opacity: orbOpacity,
            transform: `scale(${phase === 'breathing' || phase === 'connection' ? breathScale : 1})`,
          }}
          onMouseEnter={() => {
            setIsOrbHovered(true);
            if (audioContextRef.current) {
              const osc = audioContextRef.current.createOscillator();
              const gain = audioContextRef.current.createGain();
              osc.frequency.value = 440;
              gain.gain.value = 0.1;
              osc.connect(gain);
              gain.connect(audioContextRef.current.destination);
              osc.start();
              osc.stop(audioContextRef.current.currentTime + 0.1);
            }
          }}
          onMouseLeave={() => setIsOrbHovered(false)}
        >
          {/* Outer glow */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              transform: `scale(${isOrbHovered ? 1.3 : 1.2})`,
              background: `radial-gradient(circle, rgba(139, 92, 246, ${0.4 * breathGlow}) 0%, transparent 70%)`,
              filter: 'blur(40px)',
              transition: 'all 0.3s',
            }}
          />
          
          {/* Main orb */}
          {phase !== 'void' && (
            <div 
              className="absolute inset-0 rounded-full transition-all duration-300"
              style={{
                background: `radial-gradient(circle at 40% 40%, 
                  rgba(167, 139, 250, 1) 0%, 
                  rgba(124, 58, 237, ${0.9 * orbOpacity}) 50%, 
                  rgba(91, 33, 182, ${0.6 * orbOpacity}) 100%)`,
                boxShadow: `
                  0 0 80px rgba(139, 92, 246, ${breathGlow * (isOrbHovered ? 1.2 : 1)}),
                  0 0 160px rgba(124, 58, 237, ${breathGlow * 0.6}),
                  inset -20px -20px 60px rgba(0, 0, 0, 0.4),
                  inset 20px 20px 60px rgba(255, 255, 255, ${0.15 * breathGlow})`,
              }}
            >
              {/* Inner light */}
              <div 
                className="absolute inset-16 rounded-full"
                style={{
                  background: `radial-gradient(circle, rgba(255, 255, 255, ${0.4 * breathGlow}) 0%, transparent 70%)`,
                  filter: 'blur(30px)',
                }}
              />
            </div>
          )}
          
          {/* Ripple effect on hover */}
          {isOrbHovered && phase === 'connection' && (
            <>
              <div className="absolute inset-0 rounded-full border-2 border-purple-400 animate-ping" style={{ animationDuration: '2s' }} />
              <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.3s' }} />
            </>
          )}
        </div>
        
        {/* Text content - phases in gradually */}
        {phase !== 'void' && phase !== 'spark' && (
          <div 
            className="mt-16 space-y-8 text-center max-w-3xl px-6 transition-all duration-1000"
            style={{
              opacity: phase === 'awakening' ? 0.3 : phase === 'breathing' ? 0.7 : 1,
              transform: `translateY(${phase === 'awakening' ? '20px' : '0'})`,
            }}
          >
            {/* Title */}
            <h1 className="text-7xl font-light text-white tracking-tight">
              {phase === 'awakening' && 'VERA'}
              {phase === 'breathing' && (
                <>
                  I am <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">VERA</span>
                </>
              )}
              {phase === 'connection' && (
                <>
                  I am <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-2xl animate-pulse">VERA</span>
                </>
              )}
            </h1>
            
            {/* Subtitle */}
            {phase === 'breathing' && (
              <p className="text-xl text-purple-200 font-light">
                Your nervous system intelligence
              </p>
            )}
            
            {phase === 'connection' && (
              <div className="space-y-4">
                <p className="text-2xl text-white font-light">
                  Real-time biometric feedback
                </p>
                <p className="text-lg text-purple-300">
                  Evidence-based regulation • AI-powered insights • VR immersion
                </p>
                
                {/* Simulated metrics */}
                <div className="flex justify-center gap-6 mt-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-purple-200">Vagal Tone: {Math.round(50 + breathGlow * 40)}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: '0.3s' }} />
                    <span className="text-purple-200">Coherence: {Math.round(60 + breathGlow * 30)}%</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* CTA */}
            {phase === 'connection' && (
              <div className="flex justify-center gap-4 mt-12 animate-fade-in">
                <a 
                  href="/laboratory"
                  className="group relative px-12 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-lg overflow-hidden transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/50"
                  onMouseEnter={() => {
                    if (audioContextRef.current) {
                      const osc = audioContextRef.current.createOscillator();
                      const gain = audioContextRef.current.createGain();
                      osc.frequency.value = 800;
                      gain.gain.value = 0.05;
                      osc.connect(gain);
                      gain.connect(audioContextRef.current.destination);
                      osc.start();
                      osc.stop(audioContextRef.current.currentTime + 0.05);
                    }
                  }}
                >
                  <span className="relative z-10">Enter VERA</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
              </div>
            )}
          </div>
        )}
        
        {/* Instruction hint */}
        {!soundEnabled && phase !== 'void' && (
          <div className="absolute bottom-8 text-purple-400/60 text-sm animate-pulse">
            Click anywhere to enable sound
          </div>
        )}
        
        {phase === 'connection' && !isOrbHovered && (
          <div className="absolute bottom-8 text-purple-400/60 text-sm animate-pulse">
            Hover the orb to feel the connection
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
      `}</style>
    </main>
  );
}