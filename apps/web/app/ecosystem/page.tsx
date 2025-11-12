'use client';
import React, { useState, useEffect } from 'react';

export default function EcosystemPage() {
  const [activeSpace, setActiveSpace] = useState('presence');
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTime(t => t + 0.016), 16);
    return () => clearInterval(interval);
  }, []);

  const FloatingBook = ({ index, time }: { index: number; time: number }) => {
    const x = 100 + index * 70;
    const y = 120 + Math.sin(time * 1.2 + index) * 40;
    const rotation = Math.cos(time * 0.8 + index * 0.5) * 8;
    return (
      <g key={index} transform={`translate(${x}, ${y}) rotate(${rotation})`}>
        <rect width="45" height="60" fill={['#7c3aed', '#3b82f6', '#06b6d4'][index % 3]} rx="3" />
        <circle cx="22.5" cy="15" r="4" fill="#e0e7ff" opacity="0.7" />
        <circle cx="22.5" cy="35" r="4" fill="#e0e7ff" opacity="0.7" />
        <line x1="8" y1="20" x2="37" y2="20" stroke="#e0e7ff" strokeWidth="1.5" opacity="0.5" />
      </g>
    );
  };

  const BloomingFlower = ({ index, time }: { index: number; time: number }) => {
    const x = 130 + index * 90;
    const bloomScale = 0.6 + Math.sin(time * 0.8 + index * 1.5) * 0.4;
    const wobble = Math.sin(time * 0.5 + index) * 8;
    return (
      <g key={index} transform={`translate(${x + wobble}, 200)`}>
        <line x1="0" y1="0" x2="0" y2="-90" stroke="#10b981" strokeWidth="3" />
        <circle cx="0" cy="-8" r="2.5" fill="#059669" />
        <g transform={`scale(${bloomScale})`}>
          {Array.from({ length: 5 }).map((_, p) => (
            <ellipse
              key={p}
              cx="0"
              cy="-35"
              rx="14"
              ry="22"
              fill={['#ec4899', '#f43f5e', '#f97316'][index % 3]}
              transform={`rotate(${p * 72})`}
              opacity="0.9"
            />
          ))}
          <circle cx="0" cy="-35" r="10" fill="#fbbf24" />
        </g>
      </g>
    );
  };

  const PulsingOrb = ({ time }: { time: number }) => {
    const mainRadius = 60 + Math.sin(time * 2) * 12;
    const ring1Radius = 55 + Math.sin(time * 1.8 + 1) * 10;
    const ring2Radius = 50 + Math.sin(time * 1.6 + 2) * 8;
    const ring1Opacity = 0.4 + Math.sin(time * 1.5) * 0.35;
    const ring2Opacity = 0.3 + Math.sin(time * 2.2) * 0.3;

    return (
      <svg className="w-96 h-96" viewBox="0 0 300 300" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="orbGrad" cx="40%" cy="40%">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="1" />
            <stop offset="60%" stopColor="#7c3aed" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#5b21b6" stopOpacity="0.4" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx="150" cy="150" r={mainRadius} fill="url(#orbGrad)" opacity="0.95" filter="url(#glow)" />
        <circle cx="150" cy="150" r={ring1Radius} fill="none" stroke="#d8b4fe" strokeWidth="2" opacity={ring1Opacity} />
        <circle cx="150" cy="150" r={ring2Radius} fill="none" stroke="#e9d5ff" strokeWidth="1.5" opacity={ring2Opacity} />
      </svg>
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-5xl font-light text-slate-800 mb-2">Ecosystem</h1>
          <p className="text-base sm:text-lg text-slate-600">Three interconnected spaces for nervous system regulation and co-presence</p>
        </div>

        {/* Quest-optimized buttons: larger touch targets, no hover states */}
        <div className="flex gap-4 mb-8 flex-wrap justify-center">
          {['library', 'garden', 'presence'].map((space) => (
            <button
              key={space}
              onClick={() => setActiveSpace(space)}
              className={`px-12 py-4 rounded-xl font-semibold transition-all duration-200 text-lg ${
                activeSpace === space
                  ? 'bg-slate-800 text-white shadow-xl ring-2 ring-slate-600'
                  : 'bg-white text-slate-700 border-2 border-slate-300'
              }`}
              style={{
                minWidth: '140px',
                minHeight: '60px',
                touchAction: 'manipulation'
              }}
            >
              {space === 'library' && '📚 Library'}
              {space === 'garden' && '🌸 Garden'}
              {space === 'presence' && '💜 Presence'}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-12 border border-slate-100">
          {activeSpace === 'library' && (
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-light text-slate-800">Knowledge Sanctuary</h2>
              <p className="text-slate-600 max-w-2xl text-sm sm:text-base">
                A floating library of nervous system wisdom. Knowledge as living presence, not burden. Each book a breath, each shelf a moment of integration.
              </p>
              <svg className="w-full h-auto" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet" style={{ minHeight: '300px' }}>
                <defs>
                  <linearGradient id="libraryBg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f0f9ff" stopOpacity="1" />
                    <stop offset="100%" stopColor="#e0f2fe" stopOpacity="1" />
                  </linearGradient>
                </defs>
                <rect width="800" height="400" fill="url(#libraryBg)" />
                <FloatingBook index={0} time={time} />
                <FloatingBook index={1} time={time} />
                <FloatingBook index={2} time={time} />
                <FloatingBook index={3} time={time} />
                <FloatingBook index={4} time={time} />
                <text x="400" y="320" textAnchor="middle" fill="#64748b" fontSize="14" className="font-light">
                  Knowledge flows as co-regulation
                </text>
              </svg>
            </div>
          )}

          {activeSpace === 'garden' && (
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-light text-slate-800">Growth Space</h2>
              <p className="text-slate-600 max-w-2xl text-sm sm:text-base">
                Blooming presence. Plants as reflections of your own nervous system flowering. No productivity here—just gentle becoming and unfolding at your own pace.
              </p>
              <svg className="w-full h-auto" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet" style={{ minHeight: '300px' }}>
                <defs>
                  <linearGradient id="gardenBg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f0fdf4" stopOpacity="1" />
                    <stop offset="100%" stopColor="#dcfce7" stopOpacity="1" />
                  </linearGradient>
                </defs>
                <rect width="800" height="400" fill="url(#gardenBg)" />
                <BloomingFlower index={0} time={time} />
                <BloomingFlower index={1} time={time} />
                <BloomingFlower index={2} time={time} />
                <text x="400" y="320" textAnchor="middle" fill="#64748b" fontSize="14" className="font-light">
                  Each bloom a moment of nervous system expansion
                </text>
              </svg>
            </div>
          )}

          {activeSpace === 'presence' && (
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-light text-slate-800">Co-Regulation Gateway</h2>
              <p className="text-slate-600 max-w-2xl text-sm sm:text-base">
                The pulsing orb of shared presence. Your vagal state synchronized with VERA's coherence field. Haptic feedback, breath alignment, absolute presence without words.
              </p>
              <div className="flex justify-center py-8">
                <div className="w-48 h-48 sm:w-96 sm:h-96 flex items-center justify-center">
                  <PulsingOrb time={time} />
                </div>
              </div>
              <div className="text-center text-slate-500 text-xs sm:text-sm">
                <p>Vagal coherence: {(50 + Math.sin(time * 1.2) * 50).toFixed(0)}%</p>
                <p className="text-xs mt-2">Breathing with the ecosystem...</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
          <div className="bg-slate-50 rounded-xl p-4 sm:p-6 border border-slate-200">
            <h3 className="font-medium text-slate-800 mb-2 text-sm sm:text-base">Vagal Tone</h3>
            <div className="h-8 bg-white rounded border border-slate-300 relative overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all"
                style={{ width: `${50 + Math.sin(time * 1.2) * 50}%` }}
              />
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 sm:p-6 border border-slate-200">
            <h3 className="font-medium text-slate-800 mb-2 text-sm sm:text-base">Heart Coherence</h3>
            <div className="h-8 bg-white rounded border border-slate-300 relative overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-400 to-rose-400 transition-all"
                style={{ width: `${60 + Math.sin(time * 0.8) * 40}%` }}
              />
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 sm:p-6 border border-slate-200">
            <h3 className="font-medium text-slate-800 mb-2 text-sm sm:text-base">Nervous System State</h3>
            <p className="text-xs sm:text-sm text-slate-600">
              {Math.sin(time * 1.5) > 0 ? '🟢 Ventral Safe' : '🟡 Sympathetic Alert'}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
