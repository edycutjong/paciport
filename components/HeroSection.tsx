"use client";

import { useRouter } from 'next/navigation';
import { ArrowRight, Play } from 'lucide-react';

export function HeroSection() {
  const router = useRouter();

  const handleDemoLogin = () => {
    router.push('/dashboard');
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 text-center layout-container pt-28 pb-24 md:pt-36 md:pb-32 relative mx-auto">
      {/* Floating orbs */}
      <div className="hero-orb hero-orb-1"></div>
      <div className="hero-orb hero-orb-2"></div>
      <div className="hero-orb hero-orb-3"></div>

      {/* Badge */}
      <div className="stagger-1 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#06b6d4]/8 border border-[#06b6d4]/15 text-[#06b6d4] text-xs font-bold uppercase tracking-[0.15em] mb-8 backdrop-blur-sm">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#06b6d4] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#06b6d4]"></span>
        </span>
        Live on Pacifica Testnet
      </div>

      {/* Headline */}
      <h1 className="stagger-2 text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight mb-8 leading-[1.05]">
        Stop giving your <br className="hidden md:block" />
        <span className="gradient-text-gold">fees</span>{' '}to competitor
        <br className="hidden md:block" /> exchanges.
      </h1>

      {/* Sub-headline */}
      <div className="flex flex-col items-center justify-center w-full stagger-3 mb-8">
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed text-center text-balance">
          The 1-click delta-neutral migration engine for pro traders. Move open perpetual positions to Pacifica in <span className="text-[#06b6d4] font-semibold">{'<'} 200ms</span> with zero market exposure.
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="stagger-3 flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 w-full">
        <button
          onClick={handleDemoLogin}
          className="btn-demo px-8 py-4 rounded-2xl text-base flex items-center justify-center gap-3 w-full sm:w-[260px] group"
        >
          <Play className="w-4 h-4 fill-current" />
          Try Demo Account
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
        <button
          onClick={handleDemoLogin}
          className="btn-secondary px-8 py-4 rounded-2xl text-base flex items-center justify-center gap-3 w-full sm:w-[260px]"
        >
          Connect Exchange
        </button>
      </div>

      {/* Trust badges */}
      <div className="stagger-4 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-600">
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          No API keys stored
        </div>
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Read-only access
        </div>
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Sandbox mode
        </div>
      </div>
    </main>
  );
}
