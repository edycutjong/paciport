import { SplitScreenMigration } from '@/components/SplitScreenMigration';
import { FeeSavingsCard } from '@/components/FeeSavingsCard';
import { ExchangeLogo } from '@/components/ExchangeLogo';
import { getMockPositions } from '@/lib/db-mock';
import Link from 'next/link';
import { Activity, Shield, Clock, ArrowLeft, Code2 } from 'lucide-react';

export default async function DashboardPage() {
  const sourcePositions = getMockPositions();

  return (
    <div className="min-h-screen bg-[#050510] relative font-sans text-zinc-100">
      {/* Ambient background — muted for dashboard readability */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#050510]" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-[#06b6d4]/8 blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-[#3b82f6]/8 blur-[120px]" />
        </div>
      </div>
      <div className="noise-overlay" />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="border-b border-zinc-800/40 bg-[#0a0a18]/80 backdrop-blur-2xl sticky top-0 z-50">
          <div className="layout-container px-6 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <ExchangeLogo exchange="pacifica" size={32} />
              <span className="font-bold text-2xl tracking-tight text-zinc-100 group-hover:text-[#06b6d4] transition-colors">
                Paci<span className="text-[#06b6d4]">Port</span>
              </span>
            </Link>

            <div className="flex items-center gap-3">
              {/* Demo mode indicator */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#06b6d4]/8 border border-[#06b6d4]/15 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-[#06b6d4] live-dot" />
                <span className="text-[#06b6d4] font-semibold">Demo Mode</span>
              </div>

              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800/60 text-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                <span className="text-zinc-400 font-mono">Binance API Connected</span>
              </div>

              <Link href="/" className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 transition-colors text-sm">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="layout-container pt-8 pb-20 flex-1">
          {/* Page Title Row */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">
              1-Click Migration Engine
            </h1>
            <p className="text-zinc-500 text-sm md:text-base max-w-xl">
              Select positions on Binance &rarr; Migrate to Pacifica with zero market exposure.
            </p>
          </div>

          {/* Quick Stats Strip */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="glass rounded-xl px-4 py-3.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#06b6d4]/10 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-[#06b6d4]" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] text-zinc-500 font-medium">Avg Speed</div>
                <div className="font-mono font-bold text-zinc-100 text-sm">187ms</div>
              </div>
            </div>
            <div className="glass rounded-xl px-4 py-3.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4 text-green-500" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] text-zinc-500 font-medium">Success Rate</div>
                <div className="font-mono font-bold text-green-400 text-sm">99.8%</div>
              </div>
            </div>
            <div className="glass rounded-xl px-4 py-3.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#8b5cf6]/10 flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 text-[#8b5cf6]" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] text-zinc-500 font-medium">Price Risk</div>
                <div className="font-mono font-bold text-zinc-100 text-sm">0.00%</div>
              </div>
            </div>
          </div>

          {/* Two-Column: Migration Engine + Sidebar */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 items-start">
            {/* Left: Migration Interface */}
            <div>
              <SplitScreenMigration sourcePositions={sourcePositions} />
            </div>

            {/* Right: Sidebar */}
            <div className="flex flex-col gap-5 xl:sticky xl:top-24">
              <FeeSavingsCard annualSavingsUsd={182500} />
              
              {/* How It Works */}
              <div className="glass-card rounded-xl p-5 border-gradient">
                <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                  <span className="text-[#06b6d4]">⚡</span> Delta-Neutral Engine
                </h3>
                <ol className="space-y-3 text-sm text-zinc-400">
                  {[
                    'Calculates optimal liquidity routing on Pacifica to minimize slippage.',
                    'Concurrently executes: CLOSES on Binance while OPENING on Pacifica.',
                    'Settles isolated margins based on current unrealized P&L.',
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#06b6d4]/10 text-[#06b6d4] flex items-center justify-center font-bold text-[10px] mt-0.5 shrink-0 border border-[#06b6d4]/20">
                        {i + 1}
                      </div>
                      <p className="leading-relaxed">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Recent Migrations */}
              <div className="glass rounded-xl p-5">
                <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-zinc-500" />
                  Recent Migrations
                </h3>
                <div className="space-y-2">
                  {[
                    { symbol: 'BTC-PERP', time: '2m ago', amount: '$62,000' },
                    { symbol: 'ETH-PERP', time: '15m ago', amount: '$15,500' },
                    { symbol: 'SOL-PERP', time: '1h ago', amount: '$4,200' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2.5 px-3.5 rounded-lg bg-[#0a0a18]/60 border border-zinc-800/30">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span className="font-mono text-sm text-zinc-300">{item.symbol}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-zinc-500">{item.amount}</span>
                        <span className="text-[10px] text-zinc-600">{item.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Floating Action Button for Github/Docs */}
      <a 
        href="https://github.com/edycutjong/paciport" 
        target="_blank"
        className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 bg-[#0a0a18]/90 backdrop-blur-md border border-[#3b82f6]/30 rounded-full text-zinc-300 hover:text-white hover:border-[#3b82f6] hover:bg-[#3b82f6]/10 transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.15)] group z-50 animate-in fade-in slide-in-from-bottom-8 delay-1000 fill-mode-both"
      >
        <Code2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
        <span className="text-xs font-semibold tracking-wide flex items-center gap-1.5">
          View Source <span className="text-[#3b82f6] group-hover:translate-x-0.5 transition-transform">→</span>
        </span>
      </a>
    </div>
  );
}
