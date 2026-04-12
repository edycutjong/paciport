import { ExchangeLogo } from '@/components/ExchangeLogo';
import { ShieldCheck, Zap, Coins, ArrowRight, Clock, TrendingUp, Shield } from 'lucide-react';
import { HeroSection } from '@/components/HeroSection';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050510] relative font-sans text-zinc-100 overflow-hidden">
      <div className="bg-ambient absolute inset-0 z-0 opacity-50"></div>
      <div className="noise-overlay"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="max-w-[1400px] w-full mx-auto px-6 h-20 flex items-center justify-between stagger-1">
          <div className="flex items-center gap-2.5 group">
            <ExchangeLogo exchange="pacifica" size={32} />
            <span className="font-bold text-2xl tracking-tight text-zinc-100 group-hover:text-[#06b6d4] transition-colors">
              Paci<span className="text-[#06b6d4]">Port</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm font-mono text-zinc-500 border border-zinc-800/60 px-3 py-1.5 rounded-full bg-[#0a0a18]/60 backdrop-blur-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 live-dot"></div>
              Pacifica Testnet
            </div>
            <Link 
              href="/dashboard"
              className="hidden md:flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-[#06b6d4] transition-colors"
            >
              Dashboard
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Hero */}
        <HeroSection />

        {/* Live Ticker Bar */}
        <div className="border-y border-zinc-800/40 bg-[#0a0a18]/60 backdrop-blur-sm py-3 overflow-hidden stagger-4">
          <div className="ticker-track">
            {[
              { symbol: 'BTC-PERP', price: '$62,500', change: '+2.4%', positive: true },
              { symbol: 'ETH-PERP', price: '$3,150', change: '-0.8%', positive: false },
              { symbol: 'SOL-PERP', price: '$148.20', change: '+5.1%', positive: true },
              { symbol: 'ARB-PERP', price: '$1.42', change: '+1.2%', positive: true },
              { symbol: 'DOGE-PERP', price: '$0.182', change: '-1.5%', positive: false },
              { symbol: 'AVAX-PERP', price: '$38.90', change: '+3.7%', positive: true },
              { symbol: 'BTC-PERP', price: '$62,500', change: '+2.4%', positive: true },
              { symbol: 'ETH-PERP', price: '$3,150', change: '-0.8%', positive: false },
              { symbol: 'SOL-PERP', price: '$148.20', change: '+5.1%', positive: true },
              { symbol: 'ARB-PERP', price: '$1.42', change: '+1.2%', positive: true },
              { symbol: 'DOGE-PERP', price: '$0.182', change: '-1.5%', positive: false },
              { symbol: 'AVAX-PERP', price: '$38.90', change: '+3.7%', positive: true },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-6 px-8 text-sm whitespace-nowrap">
                <span className="font-mono font-semibold text-zinc-300">{item.symbol}</span>
                <span className="font-mono text-zinc-500">{item.price}</span>
                <span className={`font-mono font-semibold ${item.positive ? 'text-green-500' : 'text-red-500'}`}>
                  {item.change}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <section className="max-w-[1200px] w-full mx-auto px-8 py-20 stagger-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Avg Migration', value: '<200ms', icon: Clock },
              { label: 'Positions Migrated', value: '14,280+', icon: TrendingUp },
              { label: 'Price Risk', value: '0.00%', icon: Shield },
              { label: 'Annual Savings', value: '$182K+', icon: Coins },
            ].map((stat, i) => (
              <div key={i} className="stat-card">
                <stat.icon className="w-5 h-5 text-[#06b6d4] mx-auto mb-3 opacity-70" />
                <div className="text-2xl md:text-3xl font-bold font-mono text-zinc-100 mb-1.5">{stat.value}</div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="max-w-[1200px] w-full mx-auto px-8 pb-32">
          <div className="text-center mb-16 stagger-5">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why traders <span className="gradient-text-cyan">choose PaciPort</span>
            </h2>
            <p className="text-zinc-500 max-w-lg mx-auto">
              Military-grade position migration engine designed for professional perpetual futures traders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-6">
            <div className="glass-card spotlight-card rounded-2xl p-8 border-gradient">
              <div className="w-12 h-12 rounded-xl bg-[#06b6d4]/10 flex items-center justify-center mb-5">
                <Zap className="w-6 h-6 text-[#06b6d4]" style={{ animation: 'icon-breathe 3s ease-in-out infinite' }} />
              </div>
              <h3 className="font-bold text-lg mb-3 text-zinc-100">Sub-Second Execution</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Concurrent atomic API calls close your Binance position and open on Pacifica in under 200 milliseconds. No manual steps.
              </p>
              <div className="mt-5 flex items-center gap-2 text-xs font-mono text-[#06b6d4]/60">
                <div className="w-1 h-1 rounded-full bg-[#06b6d4]"></div>
                Promise.allSettled execution
              </div>
            </div>

            <div className="glass-card spotlight-card rounded-2xl p-8 border-gradient">
              <div className="w-12 h-12 rounded-xl bg-[#8b5cf6]/10 flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6 text-[#8b5cf6]" style={{ animation: 'icon-breathe 3s ease-in-out infinite 0.5s' }} />
              </div>
              <h3 className="font-bold text-lg mb-3 text-zinc-100">Zero Price Risk</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Our delta-neutral orchestrator creates a hedge lock that guarantees zero market exposure during the entire migration window.
              </p>
              <div className="mt-5 flex items-center gap-2 text-xs font-mono text-[#8b5cf6]/60">
                <div className="w-1 h-1 rounded-full bg-[#8b5cf6]"></div>
                Automatic rollback on failure
              </div>
            </div>

            <div className="glass-card spotlight-card rounded-2xl p-8 border-gradient">
              <div className="w-12 h-12 rounded-xl bg-[#fbbf24]/10 flex items-center justify-center mb-5">
                <Coins className="w-6 h-6 text-[#fbbf24]" style={{ animation: 'icon-breathe 3s ease-in-out infinite 1s' }} />
              </div>
              <h3 className="font-bold text-lg mb-3 text-zinc-100">Instantly Save Fees</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Enjoy Pacifica&apos;s superior fee tiers and deep liquidity pools the moment the migration completes. Save up to 60% annually.
              </p>
              <div className="mt-5 flex items-center gap-2 text-xs font-mono text-[#fbbf24]/60">
                <div className="w-1 h-1 rounded-full bg-[#fbbf24]"></div>
                0.02% maker / 0.05% taker
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-zinc-800/40 py-8 px-6 mt-auto">
          <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-zinc-600">
              <ExchangeLogo exchange="pacifica" size={16} />
              <span>PaciPort © 2026 — Built for Pacifica Exchange Hackathon</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-zinc-600">
              <span className="hover:text-zinc-400 transition-colors cursor-pointer">Docs</span>
              <span className="hover:text-zinc-400 transition-colors cursor-pointer">GitHub</span>
              <span className="hover:text-zinc-400 transition-colors cursor-pointer">API</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
