'use client';

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-100">
      {/* Subtle air-like gradient - softer, Quest-like appearance */}
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200" />
      <div className="pointer-events-none fixed -right-32 top-0 h-80 w-80 rounded-full bg-blue-300/10 blur-3xl" />
      <div className="pointer-events-none fixed -left-32 bottom-0 h-80 w-80 rounded-full bg-slate-300/10 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-20 lg:px-8">
        <div className="max-w-4xl space-y-12 text-center">
          {/* VERA Orb - Breathing Neural Intelligence */}
          <style>{`
            @keyframes orbBreathing {
              0%, 100% { 
                transform: scale(1);
                opacity: 0.85;
              }
              50% { 
                transform: scale(1.15);
                opacity: 1;
              }
            }
            .vera-orb {
              animation: orbBreathing 5.5s ease-in-out infinite;
            }
            @keyframes float1 {
              0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.4; }
              50% { transform: translate(40px, -40px) rotate(180deg); opacity: 0.7; }
            }
            @keyframes float2 {
              0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.3; }
              50% { transform: translate(-50px, 30px) rotate(180deg); opacity: 0.6; }
            }
            @keyframes float3 {
              0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.35; }
              50% { transform: translate(30px, 50px) rotate(180deg); opacity: 0.65; }
            }
            @keyframes float4 {
              0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.4; }
              50% { transform: translate(-40px, -30px) rotate(180deg); opacity: 0.7; }
            }
            .neuron { pointer-events: none; }
          `}</style>
          <div className="relative mx-auto mb-8 h-80 w-80 flex items-center justify-center">
            {/* Floating neurons */}
            <div className="neuron absolute h-2 w-2 rounded-full bg-purple-300/60 blur-sm" style={{ top: '10%', left: '15%', animation: 'float1 8s ease-in-out infinite' }} />
            <div className="neuron absolute h-1.5 w-1.5 rounded-full bg-blue-300/50 blur-sm" style={{ top: '20%', right: '20%', animation: 'float2 10s ease-in-out infinite' }} />
            <div className="neuron absolute h-2 w-2 rounded-full bg-purple-300/50 blur-sm" style={{ bottom: '15%', left: '10%', animation: 'float3 12s ease-in-out infinite' }} />
            <div className="neuron absolute h-1.5 w-1.5 rounded-full bg-blue-300/60 blur-sm" style={{ bottom: '20%', right: '15%', animation: 'float4 9s ease-in-out infinite' }} />
            
            {/* Outer glow layers - oxygenated lavender */}
            <div className="absolute inset-0 rounded-full bg-gradient-radial from-purple-400/30 via-purple-300/15 to-transparent blur-3xl opacity-90" />
            <div className="absolute inset-0 rounded-full bg-gradient-radial from-blue-400/20 via-transparent to-transparent blur-2xl opacity-70" />
            <div className="absolute inset-0 rounded-full border border-purple-300/20 rounded-full" />
            
            {/* Main breathing orb - 7D dimensional */}
            <div className="vera-orb relative h-64 w-64 rounded-full bg-gradient-to-br from-purple-300/70 via-blue-400/60 to-purple-500/50 shadow-2xl"
              style={{
                boxShadow: '0 0 40px rgba(177, 156, 217, 0.5), 0 0 80px rgba(102, 126, 234, 0.6), 0 0 160px rgba(118, 75, 162, 0.4), inset -10px -10px 40px rgba(0, 0, 0, 0.2), inset 10px 10px 40px rgba(255, 255, 255, 0.15)'
              }}
            >
              {/* Layer 1 - Deep shadow ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-purple-900/10 to-purple-950/20" />
              
              {/* Layer 2 - Mid core shine */}
              <div className="absolute inset-6 rounded-full bg-gradient-to-br from-purple-200/40 to-blue-400/30 blur-lg" />
              
              {/* Layer 3 - Inner glow */}
              <div className="absolute inset-12 rounded-full bg-gradient-radial from-purple-200/30 to-transparent blur-md" />
              
              {/* Center highlight */}
              <div className="absolute top-8 left-12 h-20 w-20 rounded-full bg-white/20 blur-2xl" />
              
              {/* Deep center core */}
              <div className="absolute inset-16 rounded-full bg-gradient-to-b from-purple-300/40 to-blue-400/20 blur-lg" />
            </div>
          </div>

          {/* Hero - name and tagline */}
          <div className="space-y-8">
            <h1 className="text-7xl font-light tracking-tight text-slate-800">
              I am <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">VERA</span>.
            </h1>
            <p className="text-lg font-light leading-relaxed tracking-wide text-slate-700 max-w-2xl mx-auto">
              Your nervous system intelligence. 
              <br />
              <br />
              I breathe with you. I regulate with you. I keep you organized and sane.
            </p>
          </div>

          {/* CTA */}
          <div className="flex justify-center gap-3">
            <a href="/app" className="rounded-full border border-blue-400 bg-blue-100 px-8 py-3 text-sm font-medium text-blue-900 transition hover:border-blue-500 hover:bg-blue-200 cursor-pointer">
              Enter
            </a>
            <button className="rounded-full border border-slate-400 bg-transparent px-8 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-500 hover:bg-slate-100">
              Learn
            </button>
          </div>

          {/* Tag - Core VERA principles */}
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-widest text-slate-600">
              <span className="text-purple-500 font-semibold">Regulated</span>
              <span className="text-slate-400"> · </span>
              <span className="text-blue-500 font-semibold">Intelligent</span>
              <span className="text-slate-400"> · </span>
              <span className="text-purple-400 font-semibold">Always Present</span>
            </p>
            <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
              I calm your nervous system. I think ten steps ahead. I am here for you, always.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
