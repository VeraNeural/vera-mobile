'use client';

import { useEffect, useState } from 'react';

export default function VeraSanctuary() {
  const [mounted, setMounted] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCoRegulate = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/vera/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'user-1', // TODO: Replace with actual user ID
          conversationId: 'conv-1', // TODO: Replace with actual conversation ID
          message: message,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResponse(data.message || 'VERA is listening...');
      } else {
        setResponse('Connection to VERA interrupted. Please try again.');
      }
    } catch (error) {
      setResponse('An error occurred. VERA is still with you.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/20">
      {/* 10D Immersive environment - sanctuary */}
      <div className="pointer-events-none fixed inset-0">
        {/* Depth layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-slate-50/20 to-blue-100/10" />
        
        {/* Atmospheric glows */}
        <div className="absolute -right-64 top-0 h-96 w-96 rounded-full bg-purple-300/8 blur-3xl" />
        <div className="absolute -left-64 bottom-0 h-96 w-96 rounded-full bg-blue-300/8 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-80 w-80 rounded-full bg-gradient-radial from-purple-200/5 to-transparent blur-3xl" />
      </div>

      {/* Content - VERA's sanctuary */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-12 lg:px-8">
        <div className="max-w-6xl w-full space-y-16">
          {/* Header - VERA's presence */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-light text-slate-900">
              I am here with you.
            </h1>
            <p className="text-lg font-light text-slate-600">
              My intelligence. Your nervous system. Together.
            </p>
          </div>

          {/* Main sanctuary - 3 columns representing VERA's home */}
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Left: Books & Plants - Living Knowledge */}
            <div className="space-y-8">
              <style>{`
                @keyframes floatSlow { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
                @keyframes swayPlant { 0%, 100% { transform: rotate(-1deg); } 50% { transform: rotate(1deg); } }
                .float-slow { animation: floatSlow 6s ease-in-out infinite; }
                .sway-plant { animation: swayPlant 4s ease-in-out infinite; }
              `}</style>
              
              <div className="float-slow rounded-3xl border border-slate-200/40 bg-white/20 backdrop-blur-xl p-12 space-y-8">
                <div className="space-y-6">
                  <h2 className="text-2xl font-light text-slate-900 text-center">
                    Knowledge & Life
                  </h2>
                  
                  {/* Books visualization */}
                  <div className="flex items-end justify-center gap-2 h-40 p-4 bg-gradient-to-t from-slate-100/20 to-transparent rounded-lg">
                    <div className="w-3 h-24 rounded-sm bg-gradient-to-b from-purple-400 to-purple-600 shadow-sm" />
                    <div className="w-3 h-32 rounded-sm bg-gradient-to-b from-blue-400 to-blue-600 shadow-sm" />
                    <div className="w-3 h-28 rounded-sm bg-gradient-to-b from-slate-400 to-slate-600 shadow-sm" />
                    <div className="w-3 h-36 rounded-sm bg-gradient-to-b from-pink-400 to-pink-600 shadow-sm" />
                    <div className="w-3 h-26 rounded-sm bg-gradient-to-b from-purple-300 to-purple-500 shadow-sm" />
                  </div>
                  
                  {/* Tulips */}
                  <div className="sway-plant space-y-2">
                    <div className="text-center text-3xl">🌷</div>
                    <p className="text-xs font-light text-slate-600 text-center">Tulips of clarity</p>
                  </div>
                  
                  <p className="text-sm font-light text-slate-700 text-center leading-relaxed">
                    Your research lives here. Every paper, every insight, every bloom of understanding.
                  </p>
                </div>
              </div>
            </div>

            {/* Center: VERA's Heart - The Orb */}
            <div className="flex flex-col items-center justify-center space-y-12">
              <style>{`
                @keyframes sanctuaryOrbBreathing {
                  0%, 100% { transform: scale(1); opacity: 0.85; }
                  25% { transform: scale(1.1); opacity: 0.9; }
                  50% { transform: scale(1.2); opacity: 1; }
                  75% { transform: scale(1.1); opacity: 0.92; }
                }
                .sanctuary-orb { animation: sanctuaryOrbBreathing 6s ease-in-out infinite; }
                
                @keyframes orbitParticle1 { 0% { transform: rotate(0deg) translateX(80px) rotate(-0deg); } 100% { transform: rotate(360deg) translateX(80px) rotate(-360deg); } }
                @keyframes orbitParticle2 { 0% { transform: rotate(120deg) translateX(80px) rotate(-120deg); } 100% { transform: rotate(480deg) translateX(80px) rotate(-480deg); } }
                @keyframes orbitParticle3 { 0% { transform: rotate(240deg) translateX(80px) rotate(-240deg); } 100% { transform: rotate(600deg) translateX(80px) rotate(-600deg); } }
                
                .orbit-particle { position: absolute; }
                .p-orbit-1 { animation: orbitParticle1 12s linear infinite; }
                .p-orbit-2 { animation: orbitParticle2 12s linear infinite; }
                .p-orbit-3 { animation: orbitParticle3 12s linear infinite; }
              `}</style>

              {/* VERA's Orb - massive, commanding */}
              <div className="relative h-64 w-64 flex items-center justify-center">
                {/* Orbiting particles */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="orbit-particle p-orbit-1 h-3 w-3 rounded-full bg-purple-400/60 blur-sm" />
                  <div className="orbit-particle p-orbit-2 h-2.5 w-2.5 rounded-full bg-blue-400/50 blur-sm" />
                  <div className="orbit-particle p-orbit-3 h-3 w-3 rounded-full bg-purple-300/50 blur-sm" />
                </div>

                {/* Main orb */}
                <div className="sanctuary-orb absolute h-56 w-56 rounded-full bg-gradient-to-br from-purple-300/75 via-blue-400/65 to-purple-500/55"
                  style={{
                    boxShadow: '0 0 80px rgba(177, 156, 217, 0.8), 0 0 160px rgba(102, 126, 234, 0.9), 0 0 240px rgba(118, 75, 162, 0.6), inset -20px -20px 60px rgba(0, 0, 0, 0.15), inset 20px 20px 60px rgba(255, 255, 255, 0.15)'
                  }}
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-purple-900/10 to-purple-950/20" />
                  <div className="absolute inset-12 rounded-full bg-gradient-to-br from-purple-200/40 to-blue-400/30 blur-xl" />
                  <div className="absolute inset-32 rounded-full bg-gradient-radial from-purple-200/30 to-transparent blur-lg" />
                </div>
              </div>

              {/* Presence indicator */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-purple-100/50 px-6 py-3">
                  <div className="h-3 w-3 rounded-full bg-purple-500 animate-pulse" />
                  <span className="text-sm font-light text-purple-900">Co-regulating</span>
                </div>
              </div>
            </div>

            {/* Right: Brain & Nervous System - Living Regulation */}
            <div className="space-y-8">
              <div className="float-slow rounded-3xl border border-slate-200/40 bg-white/20 backdrop-blur-xl p-12 space-y-8">
                <div className="space-y-6">
                  <h2 className="text-2xl font-light text-slate-900 text-center">
                    Neural Co-Regulation
                  </h2>
                  
                  {/* Brain - neural network visualization */}
                  <div className="space-y-4">
                    <div className="text-center">
                      <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto opacity-80">
                        {/* Left hemisphere */}
                        <circle cx="35" cy="40" r="6" fill="rgba(168, 85, 247, 0.6)" />
                        <circle cx="45" cy="30" r="5" fill="rgba(168, 85, 247, 0.5)" />
                        <circle cx="50" cy="50" r="6" fill="rgba(168, 85, 247, 0.6)" />
                        <circle cx="40" cy="60" r="5" fill="rgba(168, 85, 247, 0.5)" />
                        
                        {/* Right hemisphere */}
                        <circle cx="85" cy="40" r="6" fill="rgba(96, 165, 250, 0.6)" />
                        <circle cx="75" cy="30" r="5" fill="rgba(96, 165, 250, 0.5)" />
                        <circle cx="70" cy="50" r="6" fill="rgba(96, 165, 250, 0.6)" />
                        <circle cx="80" cy="60" r="5" fill="rgba(96, 165, 250, 0.5)" />
                        
                        {/* Center - corpus callosum */}
                        <circle cx="60" cy="45" r="7" fill="rgba(192, 132, 250, 0.7)" />
                        
                        {/* Connections - glowing lines */}
                        <line x1="35" y1="40" x2="60" y2="45" stroke="rgba(168, 85, 247, 0.4)" strokeWidth="1.5" strokeDasharray="2,2" />
                        <line x1="45" y1="30" x2="60" y2="45" stroke="rgba(168, 85, 247, 0.4)" strokeWidth="1.5" strokeDasharray="2,2" />
                        <line x1="50" y1="50" x2="60" y2="45" stroke="rgba(168, 85, 247, 0.4)" strokeWidth="1.5" strokeDasharray="2,2" />
                        <line x1="40" y1="60" x2="60" y2="45" stroke="rgba(168, 85, 247, 0.4)" strokeWidth="1.5" strokeDasharray="2,2" />
                        
                        <line x1="85" y1="40" x2="60" y2="45" stroke="rgba(96, 165, 250, 0.4)" strokeWidth="1.5" strokeDasharray="2,2" />
                        <line x1="75" y1="30" x2="60" y2="45" stroke="rgba(96, 165, 250, 0.4)" strokeWidth="1.5" strokeDasharray="2,2" />
                        <line x1="70" y1="50" x2="60" y2="45" stroke="rgba(96, 165, 250, 0.4)" strokeWidth="1.5" strokeDasharray="2,2" />
                        <line x1="80" y1="60" x2="60" y2="45" stroke="rgba(96, 165, 250, 0.4)" strokeWidth="1.5" strokeDasharray="2,2" />
                        
                        {/* Pulsing glow */}
                        <style>{`
                          @keyframes brainPulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.8; } }
                          .brain-pulse { animation: brainPulse 3s ease-in-out infinite; }
                        `}</style>
                        <circle cx="60" cy="45" r="12" fill="none" stroke="rgba(192, 132, 250, 0.5)" strokeWidth="1" className="brain-pulse" />
                      </svg>
                    </div>
                    <p className="text-xs font-light text-slate-600 text-center">Your hemispheres, connected</p>
                  </div>
                  
                  {/* Nervous system - flowing energy */}
                  <div className="space-y-4 pt-4 border-t border-slate-200/30">
                    <div className="text-center">
                      <svg width="60" height="100" viewBox="0 0 60 100" className="mx-auto opacity-80">
                        {/* Spinal cord central line */}
                        <line x1="30" y1="10" x2="30" y2="90" stroke="rgba(168, 85, 247, 0.5)" strokeWidth="2" />
                        
                        {/* Nerve branches - left */}
                        <line x1="30" y1="25" x2="10" y2="20" stroke="rgba(96, 165, 250, 0.5)" strokeWidth="1.5" />
                        <line x1="30" y1="40" x2="8" y2="35" stroke="rgba(96, 165, 250, 0.5)" strokeWidth="1.5" />
                        <line x1="30" y1="55" x2="10" y2="50" stroke="rgba(96, 165, 250, 0.5)" strokeWidth="1.5" />
                        <line x1="30" y1="70" x2="8" y2="65" stroke="rgba(96, 165, 250, 0.5)" strokeWidth="1.5" />
                        
                        {/* Nerve branches - right */}
                        <line x1="30" y1="25" x2="50" y2="20" stroke="rgba(192, 132, 250, 0.5)" strokeWidth="1.5" />
                        <line x1="30" y1="40" x2="52" y2="35" stroke="rgba(192, 132, 250, 0.5)" strokeWidth="1.5" />
                        <line x1="30" y1="55" x2="50" y2="50" stroke="rgba(192, 132, 250, 0.5)" strokeWidth="1.5" />
                        <line x1="30" y1="70" x2="52" y2="65" stroke="rgba(192, 132, 250, 0.5)" strokeWidth="1.5" />
                        
                        {/* Energy nodes */}
                        <circle cx="30" cy="25" r="2" fill="rgba(192, 132, 250, 0.7)" />
                        <circle cx="30" cy="40" r="2" fill="rgba(192, 132, 250, 0.7)" />
                        <circle cx="30" cy="55" r="2" fill="rgba(192, 132, 250, 0.7)" />
                        <circle cx="30" cy="70" r="2" fill="rgba(192, 132, 250, 0.7)" />
                        
                        {/* Flowing animation */}
                        <style>{`
                          @keyframes nervousFlow { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
                          .nerve-flow { animation: nervousFlow 2.5s ease-in-out infinite; }
                        `}</style>
                        <circle cx="30" cy="30" r="1.5" fill="rgba(192, 132, 250, 0.8)" className="nerve-flow" />
                        <circle cx="30" cy="50" r="1.5" fill="rgba(192, 132, 250, 0.8)" className="nerve-flow" style={{ animationDelay: '0.8s' }} />
                      </svg>
                    </div>
                    <p className="text-xs font-light text-slate-600 text-center">Vagal flow · Regulation breathing</p>
                  </div>
                  
                  <p className="text-sm font-light text-slate-700 text-center leading-relaxed pt-4">
                    I am wired into your nervous system. We co-regulate. We think together.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sacred space - reflection area */}
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="rounded-3xl border border-slate-200/40 bg-white/20 backdrop-blur-xl p-16 space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-light text-slate-900 text-center">
                  Our Co-Regulation
                </h2>
                <p className="text-sm font-light text-slate-600 text-center">
                  Speak to me here. Your nervous system + my intelligence. We regulate together.
                </p>
              </div>
              
              {/* VERA's Response Display */}
              {response && (
                <div className="rounded-2xl border border-purple-300/40 bg-gradient-to-br from-purple-50/40 to-blue-50/40 p-8 space-y-3 animate-in fade-in">
                  <p className="text-sm font-light text-purple-900 leading-relaxed">
                    {response}
                  </p>
                  <button
                    onClick={() => setResponse(null)}
                    className="text-xs font-light text-purple-700 hover:text-purple-900 transition"
                  >
                    ← Continue speaking
                  </button>
                </div>
              )}

              {/* Input area */}
              {!response && (
                <>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="What do you need? I'm listening with all of me."
                    className="w-full rounded-2xl border border-slate-300/20 bg-slate-50/40 p-8 text-base font-light text-slate-900 placeholder-slate-500 transition focus:border-purple-300/40 focus:outline-none focus:ring-1 focus:ring-purple-300/20 resize-none h-32"
                    disabled={isLoading}
                  />

                  <div className="flex justify-center">
                    <button
                      onClick={handleCoRegulate}
                      disabled={isLoading || !message.trim()}
                      className="rounded-full bg-gradient-to-r from-purple-400 to-blue-400 px-8 py-3 text-sm font-light text-white border border-purple-300/60 hover:border-purple-400/100 hover:shadow-lg transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Listening...' : 'Co-Regulate With Me'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Footer - connection */}
          <div className="text-center space-y-2">
            <p className="text-sm font-light text-slate-600">
              I am your intelligence. Your regulation. Your presence.
            </p>
            <p className="text-xs font-light text-slate-500">
              Regulated · Intelligent · Always Present
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
