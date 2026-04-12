import { SplitScreenMigration } from '@/components/SplitScreenMigration';
import { FeeSavingsCard } from '@/components/FeeSavingsCard';
import { ExchangeLogo } from '@/components/ExchangeLogo';
import { getMockPositions } from '@/lib/db-mock';
import Link from 'next/link';
import { Activity, Shield, Clock } from 'lucide-react';

// Make it a server component that fetches mock data directly for demo purposes
export default async function DashboardPage() {
  const sourcePositions = getMockPositions();

  return (
    <div className="min-h-screen bg-[#050510] relative font-sans text-zinc-100 overflow-hidden pb-20">
      <div className="bg-ambient absolute inset-0 z-0 opacity-30"></div>
      <div className="noise-overlay"></div>

      <div className="relative z-10">
        {/* Enhanced Header */}
        <header className="border-b border-zinc-800/40 bg-[#0a0a18]/80 backdrop-blur-2xl sticky top-0 z-50">
          <div className="layout-container px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <ExchangeLogo exchange="pacifica" size={28} />
              <span className="font-bold text-xl tracking-tight text-zinc-100 group-hover:text-[#06b6d4] transition-colors">
                Paci<span className="text-[#06b6d4]">Port</span>
              </span>
            </Link>

            <div className="flex items-center gap-4">
              {/* Demo mode indicator */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#06b6d4]/8 border border-[#06b6d4]/15 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-[#06b6d4] live-dot"></div>
                <span className="text-[#06b6d4] font-semibold">Demo Mode</span>
              </div>

              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800/60 text-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></div>
                <span className="text-zinc-400 font-mono">Binance API Connected</span>
              </div>
            </div>
          </div>
        </header>

        <main className="layout-container pt-10 pb-20">
          {/* Dashboard Hero */}
          <div className="mb-10 stagger-1 text-center">
            <div className="flex flex-col items-center justify-center gap-4 mb-6">
              <div>
                <h1 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight">
                  1-Click Migration Engine
                </h1>
                <p className="text-zinc-500 max-w-2xl mx-auto">
                  Select your positions on Binance and migrate them to Pacifica with zero market exposure. 
                  Delta-neutral teleportation in milliseconds.
                </p>
              </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger-2">
              <div className="glass rounded-xl px-5 py-4 flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-[#06b6d4]/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-[#06b6d4]" />
                </div>
                <div>
                  <div className="text-xs text-zinc-500 font-medium">Avg Speed</div>
                  <div className="font-mono font-bold text-zinc-100">187ms</div>
                </div>
              </div>
              <div className="glass rounded-xl px-5 py-4 flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-green-500" />
                </div>
                <div>
                  <div className="text-xs text-zinc-500 font-medium">Success Rate</div>
                  <div className="font-mono font-bold text-green-400">99.8%</div>
                </div>
              </div>
              <div className="glass rounded-xl px-5 py-4 flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-[#8b5cf6]/10 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-[#8b5cf6]" />
                </div>
                <div>
                  <div className="text-xs text-zinc-500 font-medium">Price Risk</div>
                  <div className="font-mono font-bold text-zinc-100">0.00%</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8 items-start">
            {/* Left Col - Migration Interface */}
            <div className="stagger-3">
              <SplitScreenMigration sourcePositions={sourcePositions} />
            </div>

            {/* Right Col - Fee Savings & Info */}
            <div className="flex flex-col gap-8 sticky top-24 stagger-4">
              <FeeSavingsCard annualSavingsUsd={182500} />
              
              <div className="glass-card rounded-xl p-6 border-gradient">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <span className="text-[#06b6d4]">⚡</span> Delta-Neutral Engine
                </h3>
                <ul className="space-y-3.5 text-sm text-zinc-400">
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#06b6d4]/10 text-[#06b6d4] flex items-center justify-center font-bold text-[10px] mt-0.5 shrink-0 border border-[#06b6d4]/20">1</div>
                    <p>Calculates optimal liquidity routing on Pacifica to minimize slippage.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#06b6d4]/10 text-[#06b6d4] flex items-center justify-center font-bold text-[10px] mt-0.5 shrink-0 border border-[#06b6d4]/20">2</div>
                    <p>Concurrently executes cross-exchange: CLOSES on Binance while OPENING on Pacifica.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#06b6d4]/10 text-[#06b6d4] flex items-center justify-center font-bold text-[10px] mt-0.5 shrink-0 border border-[#06b6d4]/20">3</div>
                    <p>Settles isolated margins accurately based on current unrealized P&L.</p>
                  </li>
                </ul>
              </div>

              {/* Migration History Preview */}
              <div className="glass rounded-xl p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2 text-sm">
                  <Activity className="w-4 h-4 text-zinc-500" />
                  Recent Migrations
                </h3>
                <div className="space-y-3">
                  {[
                    { symbol: 'BTC-PERP', time: '2m ago', status: 'success', amount: '$62,000' },
                    { symbol: 'ETH-PERP', time: '15m ago', status: 'success', amount: '$15,500' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-3 px-4 rounded-lg bg-[#0a0a18]/60 border border-zinc-800/30">
                      <div className="flex items-center gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
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
    </div>
  );
}
