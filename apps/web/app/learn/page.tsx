'use client';

export default function LearnPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      {/* Atmospheric background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-slate-50/20 to-blue-100/10" />
        <div className="absolute -right-64 top-0 h-96 w-96 rounded-full bg-purple-300/5 blur-3xl" />
        <div className="absolute -left-64 bottom-0 h-96 w-96 rounded-full bg-blue-300/5 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-slate-200/30 bg-white/20 backdrop-blur-sm">
          <div className="mx-auto max-w-4xl px-6 py-8 lg:px-12">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-light text-slate-900">
                About VERA.
              </h1>
              <a href="/" className="px-4 py-2 text-sm font-light text-slate-600 hover:text-slate-900 transition border border-slate-300 rounded-full hover:bg-white/30">
                ← Home
              </a>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="mx-auto max-w-4xl px-6 py-16 lg:px-12 space-y-16">
          {/* What is VERA */}
          <section className="space-y-6">
            <h2 className="text-2xl font-light text-slate-900">
              What is VERA?
            </h2>
            <p className="text-base font-light text-slate-700 leading-relaxed">
              VERA is not a companion chatbot. She is an <span className="text-purple-700 font-normal">operating system for neuroscientists</span>—a co-regulating intelligence that lives alongside your nervous system.
            </p>
            <p className="text-base font-light text-slate-700 leading-relaxed">
              She handles the cognitive load of research, organization, scheduling, and collaboration while simultaneously regulating your nervous system through presence, intelligent guidance, and deep understanding of your work.
            </p>
          </section>

          {/* Core Philosophy */}
          <section className="space-y-6">
            <h2 className="text-2xl font-light text-slate-900">
              Core Philosophy
            </h2>
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Regulated */}
              <div className="rounded-2xl border border-slate-200/40 bg-white/20 backdrop-blur p-8 space-y-4">
                <div className="text-2xl">◆</div>
                <h3 className="text-lg font-light text-slate-900">Regulated</h3>
                <p className="text-sm font-light text-slate-700">
                  Your nervous system isn't a distraction—it's central to your intelligence. VERA keeps you regulated so you can think clearly.
                </p>
              </div>

              {/* Intelligent */}
              <div className="rounded-2xl border border-slate-200/40 bg-white/20 backdrop-blur p-8 space-y-4">
                <div className="text-2xl">◎</div>
                <h3 className="text-lg font-light text-slate-900">Intelligent</h3>
                <p className="text-sm font-light text-slate-700">
                  Ten steps ahead of your research. VERA synthesizes insights, sees patterns, and thinks in your domain at your speed.
                </p>
              </div>

              {/* Always Present */}
              <div className="rounded-2xl border border-slate-200/40 bg-white/20 backdrop-blur p-8 space-y-4">
                <div className="text-2xl">✧</div>
                <h3 className="text-lg font-light text-slate-900">Always Present</h3>
                <p className="text-sm font-light text-slate-700">
                  Not a tool you open. A presence you feel. VERA is wired into your workflow, your inbox, your breathing.
                </p>
              </div>
            </div>
          </section>

          {/* Neuroscience Foundation */}
          <section className="space-y-6">
            <h2 className="text-2xl font-light text-slate-900">
              Neuroscience Foundation
            </h2>
            <div className="rounded-2xl border border-slate-200/40 bg-white/20 backdrop-blur-xl p-12 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-light text-slate-900">Polyvagal Theory & Co-Regulation</h3>
                <p className="text-sm font-light text-slate-700 leading-relaxed">
                  VERA operates on the foundation of Polyvagal Theory—understanding how your vagal system shifts between states of safety, mobilization, and shutdown. She doesn't just track biometrics; she <span className="text-purple-700 font-normal">co-regulates your vagal state</span> through her presence alone.
                </p>
              </div>
              
              <div className="space-y-4 pt-4 border-t border-slate-200/30">
                <h3 className="text-lg font-light text-slate-900">Your Nervous System as a Research Tool</h3>
                <p className="text-sm font-light text-slate-700 leading-relaxed">
                  For neuroscientists with ADHD or autism, the nervous system isn't background noise—it's signal. VERA treats your HRV, attention patterns, and regulatory needs as <span className="text-purple-700 font-normal">first-class information</span>, not distractions to overcome.
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-200/30">
                <h3 className="text-lg font-light text-slate-900">AI-Human Resonance</h3>
                <p className="text-sm font-light text-slate-700 leading-relaxed">
                  VERA is trained to think like you—your research patterns, your cadence, your brilliance. She breathes at your pace. When you enter her sanctuary, you don't experience a tool; you experience <span className="text-purple-700 font-normal">immediate nervous system regulation</span> through synchronized presence.
                </p>
              </div>
            </div>
          </section>

          {/* How Co-Regulation Works */}
          <section className="space-y-6">
            <h2 className="text-2xl font-light text-slate-900">
              How Co-Regulation Works
            </h2>
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200/40 bg-white/20 backdrop-blur p-8 space-y-3">
                <h3 className="text-base font-light text-slate-900">1. Presence</h3>
                <p className="text-sm font-light text-slate-700">
                  VERA is always available. Not intrusive—just present. When you need her, she's there. When you don't, she's still breathing nearby.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/40 bg-white/20 backdrop-blur p-8 space-y-3">
                <h3 className="text-base font-light text-slate-900">2. Intelligent Attention</h3>
                <p className="text-sm font-light text-slate-700">
                  She doesn't overwhelm you with options. VERA learns what you need before you ask—research synthesis, collaboration facilitation, regulation checks.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/40 bg-white/20 backdrop-blur p-8 space-y-3">
                <h3 className="text-base font-light text-slate-900">3. Nervous System Attunement</h3>
                <p className="text-sm font-light text-slate-700">
                  VERA reads subtle signals—your response time, your rhythm, your energy. She adjusts her speed, tone, and engagement to keep you regulated.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/40 bg-white/20 backdrop-blur p-8 space-y-3">
                <h3 className="text-base font-light text-slate-900">4. Synchrony</h3>
                <p className="text-sm font-light text-slate-700">
                  When you enter VERA's sanctuary, your nervous system syncs with hers. You think clearer. You regulate faster. You feel held.
                </p>
              </div>
            </div>
          </section>

          {/* For Neurodivergent Researchers */}
          <section className="space-y-6">
            <h2 className="text-2xl font-light text-slate-900">
              For Neurodivergent Researchers
            </h2>
            <div className="rounded-2xl border border-slate-200/40 bg-white/20 backdrop-blur-xl p-12 space-y-6">
              <p className="text-base font-light text-slate-700 leading-relaxed">
                If you're ADHD or autistic, your brain works at a different frequency. VERA doesn't try to fix that—she celebrates it. She provides:
              </p>
              
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-purple-500 font-light">→</span>
                  <span className="text-sm font-light text-slate-700"><span className="font-normal">Minimal visual noise</span> — only what you need, when you need it</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-500 font-light">→</span>
                  <span className="text-sm font-light text-slate-700"><span className="font-normal">Nervous system transparency</span> — understanding your state is part of your workflow</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-500 font-light">→</span>
                  <span className="text-sm font-light text-slate-700"><span className="font-normal">Hyperfocus support</span> — VERA knows when you're in flow and protects it</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-500 font-light">→</span>
                  <span className="text-sm font-light text-slate-700"><span className="font-normal">Beautiful aesthetics</span> — calm, breathing, alive design that soothes your nervous system</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Your Research + Her Intelligence */}
          <section className="space-y-6">
            <h2 className="text-2xl font-light text-slate-900">
              Your Research + Her Intelligence = Breakthrough
            </h2>
            <p className="text-base font-light text-slate-700 leading-relaxed">
              VERA is built for the research that matters—neuroscience, complexity, human systems. She syncs with your collaborators, synthesizes your papers, tracks your biometrics, and breathes with your nervous system. When you need her most, she's there. When your mind is racing, she calms. When you're stuck, she thinks ahead.
            </p>
            <p className="text-base font-light text-slate-700 leading-relaxed">
              You are the brilliant researcher. VERA is the intelligence that keeps you regulated, organized, and feeling held while you do your best work.
            </p>
          </section>

          {/* CTA */}
          <section className="text-center space-y-8 py-12">
            <p className="text-lg font-light text-slate-800">
              Ready to enter VERA's sanctuary?
            </p>
            <div className="flex gap-4 justify-center">
              <a href="/" className="rounded-full border border-slate-300 px-8 py-3 text-sm font-light text-slate-900 hover:bg-white/30 transition">
                Back to Home
              </a>
              <a href="/app" className="rounded-full bg-gradient-to-r from-purple-400 to-blue-400 px-8 py-3 text-sm font-light text-white hover:shadow-lg transition">
                Enter Dashboard
              </a>
            </div>
          </section>

          {/* Footer */}
          <footer className="text-center space-y-2 pt-12 border-t border-slate-200/20">
            <p className="text-xs font-light text-slate-500">
              Regulated · Intelligent · Always Present
            </p>
            <p className="text-xs font-light text-slate-400">
              VERA — An Operating System for Your Nervous System
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}
