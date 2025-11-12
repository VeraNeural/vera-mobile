import '../styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VERA Platform',
  description: 'Adaptive co-regulation companion across web, mobile, community, and biometrics.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-slate-950 text-slate-100 antialiased">
        <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-14 lg:px-12 lg:py-20">
          <div className="pointer-events-none absolute inset-x-0 top-16 -z-10 mx-auto h-[32rem] max-w-5xl rounded-full bg-gradient-to-r from-sky-500/10 via-purple-500/10 to-emerald-500/10 blur-3xl" />
          {children}
        </div>
      </body>
    </html>
  );
}
