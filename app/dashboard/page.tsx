import { SplitScreenMigration } from '@/components/SplitScreenMigration';
import { FeeSavingsCard } from '@/components/FeeSavingsCard';
import { ExchangeLogo } from '@/components/ExchangeLogo';
import { getMockPositions } from '@/lib/db-mock';
import Link from 'next/link';

// Make it a server component that fetches mock data directly for demo purposes
export default async function DashboardPage() {
  const sourcePositions = getMockPositions();

  return (
    <div className="min-h-screen bg-[#030308] relative font-sans text-zinc-100 overflow-hidden pb-20">
      <div className="bg-ambient absolute inset-0 z-0 opacity-40"></div>
      <div className="noise-overlay"></div>

      <div className="relative z-10">
        <header className="border-b border-zinc-800 bg-[#0d0d14]/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <ExchangeLogo exchange="pacifica" size={28} />
              <span className="font-bold text-xl tracking-tight text-zinc-100 group-hover:text-[#06b6d4] transition-colors">
                Paci<span className="text-[#06b6d4]">Port</span>
              </span>
            </Link>

            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></div>
                <span className="text-zinc-400 font-mono">Binance API Connected</span>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-[1400px] mx-auto px-6 pt-10 pb-20">
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-2">1-Click Migration Engine</h1>
            <p className="text-zinc-400 max-w-2xl">
              Select your positions on Binance and migrate them to Pacifica with zero market exposure. 
              Our engine will execute Delta-Neutral teleportation in milliseconds.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-8 items-start">
            {/* Left Col - Migration Interface */}
            <div>
              <SplitScreenMigration sourcePositions={sourcePositions} />
            </div>

            {/* Right Col - Fee Savings & Info */}
            <div className="flex flex-col gap-6 sticky top-24">
              <FeeSavingsCard annualSavingsUsd={182500} />
              
              <div className="glass rounded-xl p-5">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <span className="text-[#06b6d4]">⚡</span> Delta-Neutral Engine
                </h3>
                <ul className="space-y-3 text-sm text-zinc-400">
                  <li className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#06b6d4]/10 text-[#06b6d4] flex items-center justify-center font-bold text-[10px] mt-0.5 shrink-0">1</div>
                    <p>Calculates optimal liquidity routing on Pacifica to minimize slippage.</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#06b6d4]/10 text-[#06b6d4] flex items-center justify-center font-bold text-[10px] mt-0.5 shrink-0">2</div>
                    <p>Concurrently executes cross-exchange: CLOSES on Binance while OPENING on Pacifica.</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#06b6d4]/10 text-[#06b6d4] flex items-center justify-center font-bold text-[10px] mt-0.5 shrink-0">3</div>
                    <p>Settles isolated margins accurately based on current unrealized P&L.</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
