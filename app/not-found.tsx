import Link from 'next/link';
import { ExchangeLogo } from '@/components/ExchangeLogo';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050510] relative font-sans text-zinc-100 overflow-hidden">
      {/* Ambient background */}
      <div className="bg-ambient">
        <div className="noise-overlay"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen items-center justify-center px-6">
        
        {/* Floating orbs */}
        <div className="hero-orb hero-orb-1" style={{ opacity: 0.15 }}></div>
        <div className="hero-orb hero-orb-2" style={{ opacity: 0.15 }}></div>

        {/* Content */}
        <div className="text-center max-w-lg mx-auto">
          
          {/* Glitch 404 number */}
          <div className="relative mb-8 stagger-1">
            <div className="text-[10rem] md:text-[14rem] font-black leading-none tracking-tighter select-none">
              <span className="gradient-text-cyan opacity-20">4</span>
              <span className="relative inline-block">
                <span className="gradient-text-gold">0</span>
                {/* Animated ring around the zero */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border border-[#06b6d4]/20 animate-ping" style={{ animationDuration: '3s' }}></div>
                </div>
              </span>
              <span className="gradient-text-cyan opacity-20">4</span>
            </div>
          </div>

          {/* Message */}
          <h1 className="text-2xl md:text-3xl font-bold mb-4 stagger-2">
            Position <span className="gradient-text-cyan">not found</span>
          </h1>
          <p className="text-zinc-500 text-base md:text-lg mb-10 leading-relaxed stagger-3">
            This route doesn&apos;t exist on Pacifica Exchange.<br className="hidden md:block" />
            The position may have already been migrated.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 stagger-4">
            <Link
              href="/"
              className="btn-demo px-8 py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <ExchangeLogo exchange="pacifica" size={16} />
              Back to Home
            </Link>
            <Link
              href="/dashboard"
              className="btn-secondary px-8 py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              Open Dashboard
            </Link>
          </div>

          {/* Execution log style footer */}
          <div className="mt-16 glass rounded-xl p-4 font-mono text-xs text-left max-w-sm mx-auto border-gradient stagger-5">
            <div className="text-zinc-600">$ paciport resolve-route</div>
            <div className="text-red-400 mt-1">❌ ERR_ROUTE_NOT_FOUND</div>
            <div className="text-zinc-600 mt-1">→ No matching handler for this path</div>
            <div className="text-zinc-500 mt-1">→ Status: <span className="text-[#f59e0b]">404</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
