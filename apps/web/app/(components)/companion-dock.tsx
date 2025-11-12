'use client';

import { useMemo, useState } from 'react';
import { Button } from '@vera-mobile/ui';

import { CompanionMessages } from './companion-messages';

const guidanceScripts = [
  {
    title: 'Resonant breath',
    prompt: 'Inhale for a steady count of four, exhale for six. Notice the softening behind your eyes.',
    tone: 'Somatic anchor'
  },
  {
    title: 'Co-regulation cue',
    prompt: 'Text your accountability buddy a single-word check-in. Receipts keep the nervous system honest.',
    tone: 'Community tether'
  }
];

const communityHighlights = [
  {
    label: 'Upcoming circle',
    detail: 'Sensorium sound bath · Friday 6p PT'
  },
  {
    label: 'Mighty Network pulse',
    detail: '“Resting is not lazy” thread has 12 new reflections.'
  }
];

export function CompanionDock() {
  const script = useMemo(() => guidanceScripts[0], []);
  const [mode, setMode] = useState<'calm' | 'chat'>('calm');
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className="pointer-events-auto fixed right-6 top-28 z-20 w-80 max-w-full transition-transform duration-300 md:right-10 lg:right-16"
      style={{ transform: isCollapsed ? 'translateX(60%)' : 'translateX(0)' }}
    >
      <div className="rounded-4xl border border-slate-800/80 bg-slate-950/85 p-5 shadow-[0_30px_100px_-60px_rgba(16,185,129,0.7)] backdrop-blur">
        <header className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200/70">Vera companion</p>
            <h2 className="mt-2 text-lg font-semibold text-slate-100">I am right here.</h2>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button
              type="button"
              onClick={() => setMode((prev) => (prev === 'calm' ? 'chat' : 'calm'))}
              className="rounded-full border border-emerald-300/20 bg-slate-900/70 px-3 py-1 text-xs font-medium text-emerald-200 transition hover:text-emerald-100"
            >
              {mode === 'calm' ? 'Open chat' : 'Calm view'}
            </button>
            <button
              type="button"
              onClick={() => setIsCollapsed((prev) => !prev)}
              aria-label={isCollapsed ? 'Expand Vera companion' : 'Collapse Vera companion'}
              className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-500 transition hover:text-emerald-100"
            >
              {isCollapsed ? 'Expand' : 'Hide'}
            </button>
          </div>
        </header>
        {mode === 'calm' ? (
          <>
            <section className="space-y-3">
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-200/70">{script.tone}</p>
              <p className="text-base leading-relaxed text-slate-200">{script.prompt}</p>
              <div className="flex items-center gap-3">
                <Button variant="primary">Speak to me</Button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md border border-emerald-300/30 bg-transparent px-4 py-2 text-sm font-semibold text-emerald-200 transition hover:border-emerald-200/50"
                >
                  Log feeling
                </button>
              </div>
            </section>
            <footer className="mt-6 space-y-3 text-xs text-slate-400">
              {communityHighlights.map(({ label, detail }) => (
                <div key={label} className="rounded-2xl border border-slate-800/70 bg-slate-900/60 px-3 py-2">
                  <p className="font-semibold uppercase tracking-[0.25em] text-emerald-200/60">{label}</p>
                  <p className="mt-1 leading-snug text-slate-300">{detail}</p>
                </div>
              ))}
            </footer>
          </>
        ) : (
          <CompanionMessages />
        )}
      </div>
    </aside>
  );
}
