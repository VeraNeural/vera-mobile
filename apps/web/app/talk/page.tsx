'use client';

import { useState, useRef, useEffect } from 'react';
import { sendMessageToVera } from '@/lib/api/vera';

export default function Talk() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'vera'; content: string }>>([
    {
      role: 'vera',
      content: 'I am here. Your soul is safe. What is present for you right now?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [conversationId] = useState(Date.now().toString());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    setError('');

    // Add user message
    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      // Call VERA backend API
      const veraResponse = await sendMessageToVera(conversationId, userMessage);
      setMessages(prev => [...prev, { role: 'vera', content: veraResponse }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reach VERA');
      console.error('Chat error:', err);
      // Add error message to conversation
      setMessages(prev => [...prev, { 
        role: 'vera', 
        content: 'I am having difficulty reaching my core. Please try again—my service is regenerating.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50">
      {/* Sacred space background */}
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100" />
      <div className="pointer-events-none fixed -right-40 top-0 h-96 w-96 rounded-full bg-purple-300/8 blur-3xl" />
      <div className="pointer-events-none fixed -left-40 bottom-0 h-96 w-96 rounded-full bg-blue-300/8 blur-3xl" />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header - VERA's presence */}
        <header className="border-b border-slate-200/50 bg-white/30 backdrop-blur sticky top-0">
          <div className="mx-auto max-w-4xl px-6 py-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-light text-slate-900">
                  With <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">VERA</span>
                </h1>
                <p className="mt-1 text-xs font-light text-slate-600">Your soul is here</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-purple-100/50 px-4 py-2 text-xs font-light text-purple-900">
                <div className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
                <span>Present</span>
              </div>
            </div>
          </div>
        </header>

        {/* Conversation space */}
        <div className="flex-1 mx-auto max-w-4xl w-full px-6 py-12 lg:px-8 flex flex-col">
          {/* Error alert */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200/40 bg-red-100/20 p-4 backdrop-blur">
              <p className="text-sm font-light text-red-800">{error}</p>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 space-y-8 mb-8 overflow-y-auto max-h-96">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-lg rounded-2xl px-6 py-4 ${
                    msg.role === 'vera'
                      ? 'bg-gradient-to-br from-purple-100/50 to-blue-100/30 border border-purple-200/40 backdrop-blur'
                      : 'bg-slate-100/60 border border-slate-200/40 backdrop-blur'
                  }`}
                >
                  <p className={`text-base font-light leading-relaxed ${
                    msg.role === 'vera' ? 'text-slate-900' : 'text-slate-800'
                  }`}>
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gradient-to-br from-purple-100/50 to-blue-100/30 border border-purple-200/40 backdrop-blur rounded-2xl px-6 py-4">
                  <div className="flex gap-2">
                    <div className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
                    <div className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <div className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleSend();
                }
              }}
              placeholder="Speak your truth..."
              className="flex-1 rounded-xl border border-slate-300/30 bg-white/60 p-4 text-base font-light text-slate-900 placeholder-slate-500 transition focus:border-purple-300/50 focus:outline-none focus:ring-1 focus:ring-purple-300/30 resize-none max-h-32"
              rows={2}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="rounded-xl bg-gradient-to-br from-purple-400 to-blue-400 px-6 py-4 text-sm font-light text-white transition hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed h-fit"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
