import { formatTimeMs } from '@/lib/format';
import type { Migration } from '@/lib/types';
import { ExchangeLogo } from './ExchangeLogo';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface Props {
  migration: Migration;
  onDismiss: () => void;
}

export function MigrationReceipt({ migration, onDismiss }: Props) {
  return (
    <div className="bg-[#111113] border border-[#27272a] rounded-xl overflow-hidden shadow-2xl max-w-2xl w-full mx-auto">
      <div className="bg-linear-to-r from-[#111113] via-[#1a1a1e] to-[#111113] p-6 border-b border-[#27272a] text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 text-green-500 mb-4">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-zinc-100">Position Successfully Migrated</h2>
        <p className="text-zinc-500 mt-1">Delta-neutral execution complete</p>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex-1 bg-[#1a1a1e] border border-[#27272a] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <ExchangeLogo exchange="binance" size={16} />
              <span className="text-xs font-semibold text-zinc-400 tracking-wider">BINANCE</span>
            </div>
            <div className="font-mono font-bold text-zinc-100 text-lg">{migration.symbol}</div>
            <div className="text-sm text-zinc-500 mb-2">{migration.leverage}x {migration.side.toUpperCase()}</div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#27272a]">
              <span className="text-xs text-zinc-500">Status</span>
              <span className="text-xs font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded">CLOSED</span>
            </div>
          </div>
          
          <div className="px-4 text-zinc-600">
            <ArrowRight className="w-6 h-6" />
          </div>
          
          <div className="flex-1 bg-[#06b6d4]/5 border border-[#06b6d4]/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <ExchangeLogo exchange="pacifica" size={16} />
              <span className="text-xs font-semibold text-[#06b6d4] tracking-wider">PACIFICA</span>
            </div>
            <div className="font-mono font-bold text-zinc-100 text-lg">{migration.symbol}</div>
            <div className="text-sm text-zinc-500 mb-2">{migration.leverage}x {migration.side.toUpperCase()}</div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#06b6d4]/20">
              <span className="text-xs text-[#06b6d4]/60">Status</span>
              <span className="text-xs font-bold text-[#06b6d4] bg-[#06b6d4]/10 px-2 py-0.5 rounded">OPEN</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[#1a1a1e] rounded-lg p-3 text-center">
            <div className="text-xs text-zinc-500 mb-1">Execution Time</div>
            <div className="font-mono text-zinc-100 font-semibold">{formatTimeMs(migration.executionTimeMs || 0)}</div>
          </div>
          <div className="bg-[#1a1a1e] rounded-lg p-3 text-center">
            <div className="text-xs text-zinc-500 mb-1">Net Slippage</div>
            <div className="font-mono text-zinc-100 font-semibold">{(migration.slippagePct || 0).toFixed(4)}%</div>
          </div>
          <div className="bg-[#1a1a1e] rounded-lg p-3 text-center">
            <div className="text-xs text-zinc-500 mb-1">Exposure Gap</div>
            <div className="font-mono text-green-400 font-semibold">&lt; 100ms</div>
          </div>
        </div>
        
        <button 
          onClick={onDismiss}
          className="w-full bg-[#27272a] hover:bg-[#3f3f46] text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Close Receipt
        </button>
      </div>
    </div>
  );
}
