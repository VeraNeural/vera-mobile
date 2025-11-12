$content = @"
'use client';
import React, { useState, useEffect } from 'react';

export default function EcosystemPage() {
  const [activeSpace, setActiveSpace] = useState('presence');
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTime(t => t + 0.016), 16);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-light text-slate-800 mb-2">Ecosystem</h1>
        <p className="text-slate-600 mb-8">Three spaces for nervous system regulation</p>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveSpace('library')}
            className={activeSpace === 'library' ? 'px-6 py-3 rounded-lg font-medium bg-slate-800 text-white shadow-lg' : 'px-6 py-3 rounded-lg font-medium bg-white text-slate-700 border border-slate-200'}
          >
            Library
          </button>
          <button
            onClick={() => setActiveSpace('garden')}
            className={activeSpace === 'garden' ? 'px-6 py-3 rounded-lg font-medium bg-slate-800 text-white shadow-lg' : 'px-6 py-3 rounded-lg font-medium bg-white text-slate-700 border border-slate-200'}
          >
            Garden
          </button>
          <button
            onClick={() => setActiveSpace('presence')}
            className={activeSpace === 'presence' ? 'px-6 py-3 rounded-lg font-medium bg-slate-800 text-white shadow-lg' : 'px-6 py-3 rounded-lg font-medium bg-white text-slate-700 border border-slate-200'}
          >
            Presence
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 border border-slate-100">
          {activeSpace === 'library' && (
            <div className="w-full h-96 bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg flex items-center justify-center">
              <div className="text-slate-500">Library with floating books</div>
            </div>
          )}
          {activeSpace === 'garden' && (
            <div className="w-full h-96 bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg flex items-center justify-center">
              <div className="text-slate-500">Garden with blooming flowers</div>
            </div>
          )}
          {activeSpace === 'presence' && (
            <div className="w-full h-96 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg flex items-center justify-center">
              <div className="w-48 h-48 rounded-full bg-purple-300 opacity-50"></div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
"@

Set-Content -Path 'c:\vera-mobile\apps\web\app\ecosystem\page.tsx' -Value $content -Encoding UTF8
Write-Host "File written successfully"
