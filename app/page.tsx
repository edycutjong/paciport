import { ExchangeLogo } from '@/components/ExchangeLogo';
import { ShieldCheck, Zap, Coins } from 'lucide-react';
import { ExchangeConnector } from '@/components/ExchangeConnector';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#030308] relative font-sans text-zinc-100 overflow-hidden">
      <div className="bg-ambient absolute inset-0 z-0 opacity-50"></div>
      <div className="noise-overlay"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="max-w-[1400px] w-full mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 group">
            <ExchangeLogo exchange="pacifica" size={32} />
            <span className="font-bold text-2xl tracking-tight text-zinc-100 group-hover:text-[#06b6d4] transition-colors">
              Paci<span className="text-[#06b6d4]">Port</span>
            </span>
          </div>
          <div className="text-sm font-mono text-zinc-500 border border-zinc-800 px-3 py-1 rounded-full bg-[#111113]/50">
            Hackathon MVP v1.0
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto py-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#06b6d4]/10 border border-[#06b6d4]/20 text-[#06b6d4] text-xs font-bold uppercase tracking-widest mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#06b6d4] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#06b6d4]"></span>
            </span>
            Live on Pacifica testnet
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Stop giving your <span className="text-transparent bg-clip-text bg-linear-to-r from-[#f59e0b] to-yellow-300">fees</span> <br/>
            to competitor exchanges.
          </h1>

          <p className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-2xl leading-relaxed">
            The 1-click delta-neutral migration engine for pro traders. Move open positions to Pacifica in {'<'} 200ms with zero market exposure.
          </p>

          <div className="w-full max-w-md mx-auto mb-20 text-left">
            <ExchangeConnector />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl text-left">
            <div className="glass rounded-xl p-6 border border-zinc-800/50 hover:border-[#06b6d4]/30 transition-colors">
              <Zap className="w-8 h-8 text-[#06b6d4] mb-4" />
              <h3 className="font-bold text-lg mb-2">Sub-Second Execution</h3>
              <p className="text-zinc-400 text-sm">Concurrent atomic API calls close your Binance position and open on Pacifica near-instantly.</p>
            </div>
            <div className="glass rounded-xl p-6 border border-zinc-800/50 hover:border-[#06b6d4]/30 transition-colors">
              <ShieldCheck className="w-8 h-8 text-[#06b6d4] mb-4" />
              <h3 className="font-bold text-lg mb-2">Zero Price Risk</h3>
              <p className="text-zinc-400 text-sm">Our delta-neutral orchestrator guarantees you won&apos;t get slippage dumped while migrating.</p>
            </div>
            <div className="glass rounded-xl p-6 border border-zinc-800/50 hover:border-[#06b6d4]/30 transition-colors">
              <Coins className="w-8 h-8 text-[#06b6d4] mb-4" />
              <h3 className="font-bold text-lg mb-2">Instantly Save Fees</h3>
              <p className="text-zinc-400 text-sm">Enjoy Pacifica&apos;s superior fee tiers and deep liquidity pools the moment the migration completes.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
