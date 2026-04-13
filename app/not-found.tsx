import Link from 'next/link';
import { ExchangeLogo } from '@/components/ExchangeLogo';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050510] relative font-sans text-zinc-100 overflow-hidden flex flex-col">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] select-none left-[-10%] w-[40%] h-[40%] rounded-full bg-[#06b6d4]/10 blur-[120px]" />
        <div className="absolute top-[20%] select-none right-[-10%] w-[30%] h-[50%] rounded-full bg-[#3b82f6]/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] select-none left-[20%] w-[40%] h-[40%] rounded-full bg-[#0a0a18]/80 blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col flex-1 items-center justify-center px-6">
        {/* Content */}
        <div className="text-center max-w-lg mx-auto">
          {/* Glitch 404 number */}
          <div className="relative mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-[10rem] md:text-[14rem] font-black leading-none tracking-tighter select-none flex items-center justify-center">
              <span className="text-[#06b6d4]/20">4</span>
              <span className="relative inline-block mx-2">
                <span className="bg-clip-text text-transparent bg-linear-to-b from-[#f59e0b] to-[#b45309]">0</span>
                {/* Animated ring around the zero */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border border-[#06b6d4]/30 animate-pulse duration-1000"></div>
                  <div className="absolute w-36 h-36 md:w-48 md:h-48 rounded-full border border-[#f59e0b]/10 animate-[spin_4s_linear_infinite] border-t-[#f59e0b]/40"></div>
                </div>
              </span>
              <span className="text-[#06b6d4]/20">4</span>
            </div>
          </div>

          {/* Message */}
          <h1 className="text-2xl md:text-3xl font-bold mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both">
            Position <span className="bg-clip-text text-transparent bg-linear-to-r from-[#06b6d4] to-[#3b82f6]">not found</span>
          </h1>
          <p className="text-zinc-500 text-base md:text-lg mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both">
            This route doesn&apos;t exist on Pacifica Exchange.<br className="hidden md:block" />
            The position may have already been migrated.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
            <Link
              href="/"
              className="px-8 py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 w-full sm:w-auto bg-linear-to-r from-[#06b6d4] to-[#3b82f6] text-white hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              <ExchangeLogo exchange="pacifica" size={16} />
              Back to Home
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 w-full sm:w-auto bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
            >
              Open Dashboard
            </Link>
          </div>

          {/* Execution log style footer */}
          <div className="mt-16 bg-[#0a0a18]/80 backdrop-blur-sm rounded-xl p-5 font-mono text-xs text-left max-w-sm mx-auto border border-zinc-800/60 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-both">
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-zinc-800/50">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
            </div>
            <div className="text-zinc-500 mb-1">$ paciport resolve-route</div>
            <div className="text-red-400 font-semibold mt-1">❌ ERR_ROUTE_NOT_FOUND</div>
            <div className="text-zinc-500 mt-2 flex items-start gap-2">
              <span className="text-zinc-600">→</span>
              <span>No matching handler for this path</span>
            </div>
            <div className="text-zinc-500 mt-1 flex items-start gap-2">
              <span className="text-zinc-600">→</span>
              <span>Status: <span className="text-[#f59e0b] font-bold">404</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
