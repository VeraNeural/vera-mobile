'use client';
import React, { useState, useRef, useEffect } from 'react';

export default function LaboratoryPage() {
  const [isEntering, setIsEntering] = useState(false);
  const [time, setTime] = useState(0);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!isEntering) return;

    const animate = () => {
      setTime((t) => t + 0.016);
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isEntering]);

  const handleExit = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    setIsEntering(false);
    setTime(0);
  };

  if (isEntering) {
    return (
      <main className="relative w-screen h-screen bg-gradient-to-br from-black via-purple-950 to-black overflow-hidden flex items-center justify-center">
        {/* Orb visualization with pure CSS */}
        <div className="relative w-64 h-64 mb-16">
          {/* Breathing orb */}
          <div 
            className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-300 via-purple-400 to-purple-600 shadow-2xl"
            style={{
              animation: 'breathe 4s ease-in-out infinite',
              boxShadow: '0 0 60px rgba(167, 139, 250, 0.8), 0 0 120px rgba(124, 58, 237, 0.6)'
            }}
          />
          
          {/* Orbiting particles */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                background: ['rgba(168, 85, 247, 0.6)', 'rgba(96, 165, 250, 0.6)', 'rgba(192, 132, 250, 0.6)'][i],
                animation: `orbit ${4 + i}s linear infinite`,
                animationDelay: `${i * 1.3}s`,
                top: '50%',
                left: '50%',
              }}
            />
          ))}
          
          <style>{`
            @keyframes breathe {
              0%, 100% { transform: scale(1); opacity: 0.85; }
              50% { transform: scale(1.1); opacity: 1; }
            }
            @keyframes orbit {
              0% { transform: rotate(0deg) translateX(120px) rotate(0deg); }
              100% { transform: rotate(360deg) translateX(120px) rotate(-360deg); }
            }
          `}</style>
        </div>

        {/* Info overlay */}
        <div className="absolute bottom-12 left-0 right-0 text-center">
          <div className="text-white space-y-3">
            <p className="text-2xl font-light">Entering Co-Regulation Space</p>
            <div className="flex items-center justify-center gap-2">
              <div className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
              <p className="text-sm text-purple-200">Vagal Coherence: {(50 + Math.sin(time * 1.2) * 50).toFixed(0)}%</p>
            </div>
          </div>
        </div>

        {/* Exit button */}
        <button
          onClick={handleExit}
          className="absolute top-6 left-6 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium text-sm z-10"
        >
          ← Exit Laboratory
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 flex items-center justify-center p-8">
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="text-6xl font-light text-white mb-4">The Laboratory</h1>
        <p className="text-xl text-purple-200 mb-8">
          Your nervous system + VERA's presence. Books of living knowledge. Tulips breathing with your coherence. The orb at the center holds absolute co-regulation.
        </p>
        <button
          onClick={() => setIsEntering(true)}
          className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all duration-300 text-lg shadow-lg hover:shadow-xl"
        >
          Enter the Orb
        </button>
      </div>
    </main>
  );
}
