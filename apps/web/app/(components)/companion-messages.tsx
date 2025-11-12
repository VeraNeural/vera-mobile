'use client';

import { useMemo, useState } from 'react';
import { Button } from '@vera-mobile/ui';

interface Message {
  id: string;
  role: 'vera' | 'you';
  content: string;
  timestamp: string;
}

const mockThread: Message[] = [
  {
    id: '1',
    role: 'vera',
    content: 'I am staying with you through this sprint. Want me to read your focus plan out loud?',
    timestamp: '09:02'
  },
  {
    id: '2',
    role: 'you',
    content: 'Yes, but keep it brief. My energy is low.',
    timestamp: '09:03'
  },
  {
    id: '3',
    role: 'vera',
    content:
      'Understood. Two priority threads, ten-minute decompression buffer between them. I will ping you when it is time to close the loop.',
    timestamp: '09:03'
  }
];

export function CompanionMessages() {
  const [messages] = useState(mockThread);
  const latest = useMemo(() => messages[messages.length - 1], [messages]);

  return (
    <section className="flex h-72 flex-col justify-between rounded-3xl border border-slate-800/70 bg-slate-950/70 p-4">
      <div className="space-y-3 overflow-y-auto pr-2">
        {messages.map((message) => (
          <article
            key={message.id}
            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              message.role === 'vera'
                ? 'bg-emerald-500/10 text-emerald-100'
                : 'ml-auto bg-slate-800/70 text-slate-100'
            }`}
          >
            <p>{message.content}</p>
            <span className="mt-2 block text-[0.65rem] uppercase tracking-[0.25em] text-slate-400">
              {message.role === 'vera' ? 'Vera' : 'You'} · {message.timestamp}
            </span>
          </article>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <Button variant="primary">Speak reply</Button>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-emerald-300/30 bg-transparent px-4 py-2 text-sm font-semibold text-emerald-200 transition hover:border-emerald-200/50"
        >
          Type note
        </button>
        <button
          type="button"
          className="ml-auto text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 transition hover:text-emerald-100"
        >
          View full log
        </button>
      </div>
      <p className="mt-3 text-[0.7rem] uppercase tracking-[0.3em] text-emerald-200/70">
        Last prompt · "{latest.content.slice(0, 64)}"
      </p>
    </section>
  );
}
