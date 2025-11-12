'use client';

import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50">
      {/* Subtle breathing background */}
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100" />
      <div className="pointer-events-none fixed -right-40 top-0 h-96 w-96 rounded-full bg-purple-300/5 blur-3xl" />
      <div className="pointer-events-none fixed -left-40 bottom-0 h-96 w-96 rounded-full bg-blue-300/5 blur-3xl" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header with VERA greeting */}
        <header className="border-b border-slate-200/50 bg-white/30 backdrop-blur">
          <div className="mx-auto max-w-7xl px-6 py-8 lg:px-12">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-light text-slate-900">
                  I am here.
                </h1>
                <p className="mt-2 text-sm font-light text-slate-600">
                  Let's breathe together. What do you need to regulate right now?
                </p>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center gap-2 rounded-full bg-purple-100/50 px-4 py-2 text-sm font-light text-purple-900">
                  <div className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
                  <span>VERA present</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main dashboard - Quest-like discovery with VERA commanding */}
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
          {/* VERA - FULL SIZE, commanding presence - clickable to sanctuary */}
          <div className="mb-24">
            <a href="/vera" className="flex justify-center cursor-pointer group">
              <style>{`
                @keyframes veraCommandingPresence {
                  0%, 100% { transform: scale(1); opacity: 0.8; }
                  25% { transform: scale(1.08); opacity: 0.85; }
                  50% { transform: scale(1.15); opacity: 1; }
                  75% { transform: scale(1.08); opacity: 0.9; }
                }
                .vera-commanding { animation: veraCommandingPresence 6s ease-in-out infinite; }
                .vera-commanding:hover { filter: drop-shadow(0 0 40px rgba(177, 156, 217, 0.8)); }
                
                @keyframes particle1 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(60px, -50px); } }
                @keyframes particle2 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-70px, 40px); } }
                @keyframes particle3 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(50px, 60px); } }
                @keyframes particle4 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-50px, -60px); } }
                
                .particle { position: absolute; pointer-events: none; }
                .p1 { animation: particle1 8s ease-in-out infinite; }
                .p2 { animation: particle2 10s ease-in-out infinite; }
                .p3 { animation: particle3 12s ease-in-out infinite; }
                .p4 { animation: particle4 9s ease-in-out infinite; }
              `}</style>
              
              <div className="relative h-80 w-80 flex items-center justify-center">
                {/* Particles */}
                <div className="particle p1 h-3 w-3 rounded-full bg-purple-300/70 blur-sm" style={{top: '20%', left: '50%'}} />
                <div className="particle p2 h-2 w-2 rounded-full bg-blue-300/60 blur-sm" style={{top: '60%', left: '10%'}} />
                <div className="particle p3 h-3 w-3 rounded-full bg-purple-300/50 blur-sm" style={{top: '70%', left: '85%'}} />
                <div className="particle p4 h-2 w-2 rounded-full bg-blue-300/70 blur-sm" style={{top: '15%', left: '75%'}} />
                
                {/* Main orb - LARGE - clickable */}
                <div className="vera-commanding absolute h-72 w-72 rounded-full bg-gradient-to-br from-purple-300/70 via-blue-400/60 to-purple-500/50 shadow-2xl transition-all duration-500 group-hover:scale-110"
                  style={{
                    boxShadow: '0 0 80px rgba(177, 156, 217, 0.7), 0 0 160px rgba(102, 126, 234, 0.8), 0 0 250px rgba(118, 75, 162, 0.5), inset -20px -20px 60px rgba(0, 0, 0, 0.15), inset 20px 20px 60px rgba(255, 255, 255, 0.12)'
                  }}
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-purple-900/8 to-purple-950/15" />
                  <div className="absolute inset-12 rounded-full bg-gradient-to-br from-purple-200/35 to-blue-400/25 blur-xl" />
                  <div className="absolute inset-32 rounded-full bg-gradient-radial from-purple-200/25 to-transparent blur-lg" />
                </div>
              </div>
            </a>

            {/* VERA speaks - neuroscience framed */}
            <div className="mt-12 text-center max-w-2xl mx-auto">
              <p className="text-lg font-light text-slate-800">
                Your research calls. Your collaborators wait. What do you need?
              </p>
            </div>
          </div>

          {/* Options - what VERA offers you */}
          <div className="grid gap-12 lg:grid-cols-3 mb-20">
            {/* Connection - neuroscience focus */}
            <button className="group rounded-2xl border border-slate-200/40 bg-white/10 hover:bg-white/20 backdrop-blur p-12 transition-all duration-500 cursor-pointer hover:scale-105 hover:shadow-xl">
              <div className="space-y-6 text-center">
                <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-blue-300/40 to-blue-400/30 group-hover:from-blue-300/60 group-hover:to-blue-400/50 transition">
                  <div className="text-3xl">✧</div>
                </div>
                <div>
                  <h3 className="text-lg font-light text-slate-900">Collaborators</h3>
                  <p className="mt-2 text-sm font-light text-slate-600">Team sync · Lab insights · Network</p>
                </div>
                <p className="text-xs font-light text-slate-500 group-hover:text-slate-700 transition">30 mins • 11:30am</p>
              </div>
            </button>

            {/* Research inbox - neuroscience papers, data */}
            <button className="group rounded-2xl border border-slate-200/40 bg-white/10 hover:bg-white/20 backdrop-blur p-12 transition-all duration-500 cursor-pointer hover:scale-105 hover:shadow-xl">
              <div className="space-y-6 text-center">
                <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-purple-300/40 to-purple-400/30 group-hover:from-purple-300/60 group-hover:to-purple-400/50 transition">
                  <div className="text-3xl">◆</div>
                </div>
                <div>
                  <h3 className="text-lg font-light text-slate-900">Research</h3>
                  <p className="mt-2 text-sm font-light text-slate-600">Papers · Data · Experiments</p>
                </div>
                <p className="text-xs font-light text-slate-500 group-hover:text-slate-700 transition">Deep focus • Now</p>
              </div>
            </button>

            {/* Biometric insights - nervous system data */}
            <button className="group rounded-2xl border border-slate-200/40 bg-white/10 hover:bg-white/20 backdrop-blur p-12 transition-all duration-500 cursor-pointer hover:scale-105 hover:shadow-xl">
              <div className="space-y-6 text-center">
                <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-slate-300/40 to-slate-400/30 group-hover:from-slate-300/60 group-hover:to-slate-400/50 transition">
                  <div className="text-3xl">◎</div>
                </div>
                <div>
                  <h3 className="text-lg font-light text-slate-900">Biometrics</h3>
                  <p className="mt-2 text-sm font-light text-slate-600">HRV · State · Insights</p>
                </div>
                <p className="text-xs font-light text-slate-500 group-hover:text-slate-700 transition">Your nervous system • Real-time</p>
              </div>
            </button>
          </div>

          {/* Additional options */}
          <div className="grid gap-8 lg:grid-cols-2 max-w-3xl mx-auto">
            {/* Talk to VERA */}
            <a href="/vera" className="group rounded-2xl border border-slate-200/30 bg-white/5 hover:bg-white/15 backdrop-blur p-8 transition-all duration-500 text-center hover:scale-105 cursor-pointer">
              <h3 className="text-base font-light text-slate-900">Ask VERA</h3>
              <p className="mt-2 text-xs font-light text-slate-600">Strategy · Insights · Guidance</p>
            </a>

            {/* Integrations */}
            <a href="/ecosystem" className="group rounded-2xl border border-slate-200/30 bg-white/5 hover:bg-white/15 backdrop-blur p-8 transition-all duration-500 text-center hover:scale-105 cursor-pointer">
              <h3 className="text-base font-light text-slate-900">Your Ecosystem</h3>
              <p className="mt-2 text-xs font-light text-slate-600">Email · Calendar · Devices</p>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
