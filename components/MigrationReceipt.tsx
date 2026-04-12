import { formatTimeMs } from '@/lib/format';
import type { Migration } from '@/lib/types';
import { ExchangeLogo } from './ExchangeLogo';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

interface Props {
  migration: Migration;
  onDismiss: () => void;
}

export function MigrationReceipt({ migration, onDismiss }: Props) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden shadow-2xl max-w-2xl w-full mx-auto border-gradient relative">
      {/* Top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-green-500/60 to-transparent"></div>
      
      <div className="bg-linear-to-b from-green-500/5 to-transparent p-10 border-b border-zinc-800/30 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-500/10 text-green-400 mb-4 ring-1 ring-green-500/20">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-zinc-100">Position Successfully Migrated</h2>
        <p className="text-zinc-500 mt-1 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-green-400" />
          Delta-neutral execution complete
        </p>
      </div>
      
      <div className="p-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex-1 bg-[#050510] border border-zinc-800/30 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <ExchangeLogo exchange="binance" size={16} />
              <span className="text-xs font-semibold text-zinc-500 tracking-wider">BINANCE</span>
            </div>
            <div className="font-mono font-bold text-zinc-100 text-lg">{migration.symbol}</div>
            <div className="text-sm text-zinc-500 mb-2">{migration.leverage}x {migration.side.toUpperCase()}</div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-zinc-800/30">
              <span className="text-xs text-zinc-600">Status</span>
              <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/20">CLOSED</span>
            </div>
          </div>
          
          <div className="px-4 text-zinc-700">
            <div className="w-8 h-8 rounded-full bg-[#06b6d4]/10 flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-[#06b6d4]" />
            </div>
          </div>
          
          <div className="flex-1 bg-[#06b6d4]/5 border border-[#06b6d4]/15 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <ExchangeLogo exchange="pacifica" size={16} />
              <span className="text-xs font-semibold text-[#06b6d4] tracking-wider">PACIFICA</span>
            </div>
            <div className="font-mono font-bold text-zinc-100 text-lg">{migration.symbol}</div>
            <div className="text-sm text-zinc-500 mb-2">{migration.leverage}x {migration.side.toUpperCase()}</div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#06b6d4]/15">
              <span className="text-xs text-[#06b6d4]/50">Status</span>
              <span className="text-xs font-bold text-[#06b6d4] bg-[#06b6d4]/10 px-2 py-0.5 rounded-md border border-[#06b6d4]/20">OPEN</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5 mb-10">
          <div className="bg-[#050510] rounded-xl p-5 text-center border border-zinc-800/20">
            <div className="text-xs text-zinc-600 mb-1.5">Execution Time</div>
            <div className="font-mono text-zinc-100 font-semibold text-lg">{formatTimeMs(migration.executionTimeMs || 0)}</div>
          </div>
          <div className="bg-[#050510] rounded-xl p-4 text-center border border-zinc-800/20">
            <div className="text-xs text-zinc-600 mb-1.5">Net Slippage</div>
            <div className="font-mono text-zinc-100 font-semibold text-lg">{(migration.slippagePct || 0).toFixed(4)}%</div>
          </div>
          <div className="bg-[#050510] rounded-xl p-4 text-center border border-zinc-800/20">
            <div className="text-xs text-zinc-600 mb-1.5">Exposure Gap</div>
            <div className="font-mono text-green-400 font-semibold text-lg">&lt; 100ms</div>
          </div>
        </div>
        
        <button 
          onClick={onDismiss}
          className="w-full bg-zinc-800/40 hover:bg-zinc-700/40 text-white font-semibold py-3.5 rounded-xl transition-all border border-zinc-700/30 hover:border-zinc-600/40"
        >
          Close Receipt
        </button>
      </div>
    </div>
  );
}
