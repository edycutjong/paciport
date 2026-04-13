import { SplitScreenMigration } from '@/components/SplitScreenMigration';
import { FeeSavingsCard } from '@/components/FeeSavingsCard';
import { ExchangeLogo } from '@/components/ExchangeLogo';
import { getMockPositions } from '@/lib/db-mock';
import Link from 'next/link';
import { Activity, Shield, Clock, ArrowLeft, Code2, Zap, TrendingUp } from 'lucide-react';
import { FadeIn } from '@/components/FadeIn';

export default async function DashboardPage() {
  const sourcePositions = getMockPositions();

  return (
    <div className="min-h-screen relative font-sans text-zinc-100 overflow-x-hidden"
      style={{ background: '#030308' }}
    >
      {/* ═══════════════ AMBIENT BACKGROUND ═══════════════ */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Deep space base */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 100% 60% at 50% 0%, rgba(6,182,212,0.06), transparent 70%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 50% at 15% 40%, rgba(59,130,246,0.05), transparent 60%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 40% at 85% 60%, rgba(139,92,246,0.04), transparent 60%)' }} />

        {/* Micro grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse 90% 70% at 50% 0%, black 20%, transparent 80%)',
        }} />

        {/* Noise */}
        <div className="noise-overlay opacity-30" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">

        {/* ═══════════════ HEADER ═══════════════ */}
        <header className="sticky top-0 z-50" style={{
          background: 'rgba(3,3,8,0.85)',
          backdropFilter: 'blur(24px) saturate(1.5)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}>
          <div className="layout-container px-6 h-[72px] flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <ExchangeLogo exchange="pacifica" size={32} />
              <span className="font-bold text-xl tracking-tight text-zinc-100 group-hover:text-[#06b6d4] transition-colors duration-300">
                Paci<span className="text-[#06b6d4]">Port</span>
              </span>
            </Link>

            <div className="flex items-center gap-3">
              {/* Live indicator */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
                style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.18)' }}>
                <span className="live-dot w-1.5 h-1.5 rounded-full bg-[#06b6d4] inline-block" />
                <span className="text-[#06b6d4] font-semibold tracking-wide">Demo Mode</span>
              </div>

              {/* API status */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-sm"
                style={{ background: 'rgba(10,10,24,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" style={{ boxShadow: '0 0 6px #22c55e' }} />
                <span className="text-zinc-400 font-mono text-xs">Binance Connected</span>
              </div>

              <Link href="/" className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 transition-colors text-sm px-3 py-1.5 rounded-full hover:bg-white/5">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            </div>
          </div>
        </header>

        {/* ═══════════════ MAIN CONTENT ═══════════════ */}
        <main className="layout-container px-6 pt-8 pb-24 flex-1">

          {/* ── Page Title ── */}
          <FadeIn delay={0.1} className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest"
                style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa' }}>
                <Zap className="w-3 h-3" />
                1-CLICK MIGRATION
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 leading-tight">
              Cross-Exchange{' '}
              <span style={{
                background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 60%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Migration Engine
              </span>
            </h1>
            <p className="text-zinc-500 max-w-lg leading-relaxed">
              Select positions from Binance → migrate to Pacifica with atomic execution and zero market exposure.
            </p>
          </FadeIn>

          {/* ── Quick Stats Strip ── */}
          <FadeIn delay={0.2} className="grid grid-cols-3 gap-3 mb-8">
            {[
              {
                icon: <Clock className="w-4 h-4 text-[#06b6d4]" />,
                bg: 'rgba(6,182,212,0.08)',
                border: 'rgba(6,182,212,0.15)',
                label: 'Avg Speed',
                value: '187ms',
                valueClass: 'text-[#06b6d4]',
                sub: 'vs 4,200ms RPC',
              },
              {
                icon: <Activity className="w-4 h-4 text-green-400" />,
                bg: 'rgba(34,197,94,0.08)',
                border: 'rgba(34,197,94,0.15)',
                label: 'Success Rate',
                value: '99.8%',
                valueClass: 'text-green-400',
                sub: 'Last 30 days',
              },
              {
                icon: <Shield className="w-4 h-4 text-[#8b5cf6]" />,
                bg: 'rgba(139,92,246,0.08)',
                border: 'rgba(139,92,246,0.15)',
                label: 'Price Risk',
                value: '0.00%',
                valueClass: 'text-zinc-100',
                sub: 'Delta-neutral execution',
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="rounded-2xl px-4 py-3.5 flex items-center gap-3 group transition-all duration-300"
                style={{
                  background: stat.bg,
                  border: `1px solid ${stat.border}`,
                  backdropFilter: 'blur(12px)',
                }}
              >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(255,255,255,0.04)' }}>
                  {stat.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-zinc-600 font-semibold uppercase tracking-widest">{stat.label}</div>
                  <div className={`font-mono font-bold text-base leading-tight ${stat.valueClass}`}>{stat.value}</div>
                  <div className="text-[10px] text-zinc-700 mt-0.5 hidden lg:block">{stat.sub}</div>
                </div>
              </div>
            ))}
          </FadeIn>

          {/* ── Two-Column Layout ── */}
          <FadeIn delay={0.3} className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6 items-start">

            {/* Left: Migration Interface */}
            <div>
              <SplitScreenMigration sourcePositions={sourcePositions} />
            </div>

            {/* Right: Sidebar */}
            <div className="flex flex-col gap-5 xl:sticky xl:top-24">

              {/* Fee savings chart */}
              <FeeSavingsCard annualSavingsUsd={182500} />

              {/* How it works */}
              <div
                className="rounded-2xl p-5 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(160deg, rgba(10,10,24,0.9), rgba(16,16,42,0.7))',
                  border: '1px solid rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                {/* Top gradient accent */}
                <div className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.4), rgba(139,92,246,0.3), transparent)' }}
                />

                <h3 className="font-bold text-sm mb-4 flex items-center gap-2 text-zinc-200">
                  <span className="text-[#06b6d4]">⚡</span>
                  Delta-Neutral Engine
                </h3>
                <ol className="space-y-3">
                  {[
                    { num: '01', text: 'Calculates optimal liquidity routing on Pacifica to minimize slippage.' },
                    { num: '02', text: 'Concurrently executes: CLOSES on Binance while OPENING on Pacifica.' },
                    { num: '03', text: 'Settles isolated margins based on current unrealized P&L.' },
                  ].map((step) => (
                    <li key={step.num} className="flex items-start gap-3">
                      <span
                        className="text-[10px] font-bold font-mono shrink-0 mt-0.5 w-7 h-5 flex items-center justify-center rounded"
                        style={{ background: 'rgba(6,182,212,0.1)', color: '#06b6d4', border: '1px solid rgba(6,182,212,0.2)' }}
                      >
                        {step.num}
                      </span>
                      <p className="text-sm text-zinc-500 leading-relaxed">{step.text}</p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Recent Migrations */}
              <div
                className="rounded-2xl p-5"
                style={{
                  background: 'rgba(6,6,16,0.8)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <h3 className="font-bold text-sm mb-4 flex items-center gap-2 text-zinc-300">
                  <TrendingUp className="w-4 h-4 text-zinc-600" />
                  Recent Migrations
                </h3>
                <div className="space-y-2">
                  {[
                    { symbol: 'BTC-PERP', time: '2m ago', amount: '$62,000', pnl: '+$840' },
                    { symbol: 'ETH-PERP', time: '15m ago', amount: '$15,500', pnl: '+$210' },
                    { symbol: 'SOL-PERP', time: '1h ago', amount: '$4,200', pnl: '-$32' },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2.5 px-3.5 rounded-xl transition-colors"
                      style={{
                        background: 'rgba(10,10,24,0.6)',
                        border: '1px solid rgba(255,255,255,0.04)',
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" style={{ boxShadow: '0 0 4px #22c55e' }} />
                        <span className="font-mono text-sm text-zinc-300">{item.symbol}</span>
                      </div>
                      <div className="flex items-center gap-3 text-right">
                        <span className="text-xs font-mono text-zinc-500">{item.amount}</span>
                        <span className={`text-[11px] font-mono font-semibold ${item.pnl.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                          {item.pnl}
                        </span>
                        <span className="text-[10px] text-zinc-700">{item.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </main>
      </div>

      {/* ═══════════════ FAB ═══════════════ */}
      <FadeIn delay={0.6} className="fixed bottom-6 right-6 z-50">
        <a
          href="https://github.com/edycutjong/paciport"
          target="_blank"
          className="flex items-center gap-2 px-4 py-3 rounded-full text-zinc-300 hover:text-white transition-all duration-300 group"
        style={{
          background: 'rgba(6,6,16,0.9)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(59,130,246,0.2)',
          boxShadow: '0 0 20px rgba(59,130,246,0.1)',
        }}
      >
        <Code2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
        <span className="text-xs font-semibold tracking-wide">
          View Source <span className="text-[#3b82f6] group-hover:translate-x-0.5 inline-block transition-transform">→</span>
        </span>
      </a>
      </FadeIn>
    </div>
  );
}
