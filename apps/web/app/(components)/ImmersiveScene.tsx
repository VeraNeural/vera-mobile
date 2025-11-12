'use client';
import React, { useState } from 'react';
import LaboratoryScene from './LaboratoryScene';

export default function ImmersiveScene() {
  const [vagalTone, setVagalTone] = useState(65);
  const [heartCoherence, setHeartCoherence] = useState(72);
  const [nervousSystemState, setNervousSystemState] = useState<'ventral' | 'sympathetic' | 'dorsal'>('ventral');

  const handleStateChange = (state: 'ventral' | 'sympathetic' | 'dorsal') => {
    setNervousSystemState(state);
  };

  return (
    <div className="relative w-full h-screen">
      {/* Main 3D scene */}
      <LaboratoryScene
        vagalTone={vagalTone}
        heartCoherence={heartCoherence}
        nervousSystemState={nervousSystemState}
      />

      {/* Control Panel - Top HUD */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black via-black/50 to-transparent p-8 space-y-4 z-20">
        {/* State Indicators */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          {/* Vagal Tone */}
          <div className="space-y-2">
            <label className="text-sm text-purple-300 font-light">Vagal Tone</label>
            <input
              type="range"
              min="0"
              max="100"
              value={vagalTone}
              onChange={(e) => setVagalTone(Number(e.target.value))}
              className="w-full h-1 bg-purple-900 rounded cursor-pointer"
            />
            <p className="text-xs text-purple-200">{vagalTone}%</p>
          </div>

          {/* Heart Coherence */}
          <div className="space-y-2">
            <label className="text-sm text-blue-300 font-light">Heart Coherence</label>
            <input
              type="range"
              min="0"
              max="100"
              value={heartCoherence}
              onChange={(e) => setHeartCoherence(Number(e.target.value))}
              className="w-full h-1 bg-blue-900 rounded cursor-pointer"
            />
            <p className="text-xs text-blue-200">{heartCoherence}%</p>
          </div>

          {/* Nervous System State */}
          <div className="space-y-2">
            <label className="text-sm text-amber-300 font-light">State</label>
            <div className="flex gap-2">
              {(['ventral', 'sympathetic', 'dorsal'] as const).map((state) => (
                <button
                  key={state}
                  onClick={() => handleStateChange(state)}
                  className={`px-2 py-1 text-xs rounded transition-all ${
                    nervousSystemState === state
                      ? state === 'ventral'
                        ? 'bg-purple-600 text-white'
                        : state === 'sympathetic'
                        ? 'bg-amber-600 text-white'
                        : 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {state.charAt(0).toUpperCase() + state.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Info Footer */}
        <div className="text-center space-y-2 text-xs text-slate-400">
          <p className="font-light">↑ Adjust nervous system metrics | Drag to rotate | Scroll to zoom</p>
          <p className="text-purple-400">The orb breathes with your coherence. Find your regulation.</p>
        </div>
      </div>

      {/* Exit Button */}
      <button
        onClick={() => window.history.back()}
        className="absolute top-6 left-6 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/50 text-purple-200 rounded text-sm transition-all z-30"
      >
        ← Exit Laboratory
      </button>
    </div>
  );
}
