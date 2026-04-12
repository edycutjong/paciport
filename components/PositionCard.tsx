import { type Position } from '@/lib/types';
import { formatPriceCurrency, formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface Props {
  position: Position;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
  isMigrated?: boolean;
  className?: string;
  hideCheckbox?: boolean;
}

export function PositionCard({ position, isSelected, onToggleSelect, isMigrated, className, hideCheckbox }: Props) {
  const isLong = position.side === 'long';
  
  return (
    <div 
      onClick={() => onToggleSelect && onToggleSelect(position.id)}
      className={cn(
        "bg-[#0a0a18] border border-zinc-800/40 rounded-xl p-5 transition-all duration-300 group relative overflow-hidden",
        onToggleSelect ? "cursor-pointer hover:border-zinc-700/60 hover:bg-[#10102a]" : "",
        isSelected ? "border-[#3b82f6]/50 bg-[#3b82f6]/5 ring-1 ring-[#3b82f6]/30 shadow-[0_0_20px_rgba(59,130,246,0.08)]" : "",
        isMigrated ? "border-[#06b6d4]/30 bg-[#06b6d4]/5 shadow-[0_0_20px_rgba(6,182,212,0.08)]" : "",
        className
      )}
    >
      {/* Subtle top glow on selected */}
      {isSelected && (
        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-linear-to-r from-transparent via-[#3b82f6] to-transparent"></div>
      )}

      {/* Selection indicator */}
      {!hideCheckbox && (
        <div className="absolute top-4 left-4 z-10 text-[#3b82f6]">
          <div className={cn(
            "w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200",
            isSelected ? "bg-[#3b82f6] border-[#3b82f6] shadow-[0_0_8px_rgba(59,130,246,0.3)]" : "border-zinc-700/60 group-hover:border-zinc-600"
          )}>
            {isSelected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
          </div>
        </div>
      )}

      {isMigrated && (
        <div className="absolute top-0 right-0 bg-linear-to-l from-[#06b6d4] to-[#06b6d4]/80 text-[#050510] text-[10px] font-bold px-2.5 py-0.5 rounded-bl-lg tracking-wide">
          ✅ MIGRATED
        </div>
      )}

      <div className={cn("flex flex-col gap-3", !hideCheckbox && "pl-8")}>
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-lg text-zinc-100">{position.displaySymbol}</span>
              <span className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded-md tracking-wide",
                isLong ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
              )}>
                {isLong ? 'LONG' : 'SHORT'}
              </span>
              <span className="text-[10px] font-bold bg-zinc-800/60 text-zinc-400 px-1.5 py-0.5 rounded-md border border-zinc-700/30">
                {position.leverage}x
              </span>
            </div>
            <div className="text-sm font-mono text-zinc-500 mt-1">
              Size: {position.size.toLocaleString()}
            </div>
          </div>
          
          <div className="text-right">
            <div className={cn(
              "font-mono font-bold",
              position.unrealizedPnlUsd >= 0 ? "text-green-400" : "text-red-400"
            )}>
              {position.unrealizedPnlUsd >= 0 ? '+' : ''}{formatCurrency(position.unrealizedPnlUsd)}
            </div>
            <div className="text-xs text-zinc-600 mt-1">
              P&L
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end border-t border-zinc-800/30 pt-3 mt-1">
          <div>
            <div className="text-[10px] uppercase tracking-wide text-zinc-600 mb-0.5">Entry Price</div>
            <div className="font-mono text-sm text-zinc-300">{formatPriceCurrency(position.entryPrice)}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wide text-zinc-600 mb-0.5">Current Price</div>
            <div className="font-mono text-sm text-zinc-300">{formatPriceCurrency(position.currentPrice)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
