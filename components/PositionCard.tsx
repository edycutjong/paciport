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
        "bg-[#1a1a1e] border border-[#27272a] rounded-lg p-4 transition-all duration-200 group relative overflow-hidden",
        onToggleSelect ? "cursor-pointer hover:border-[#3f3f46] hover:bg-[#202024]" : "",
        isSelected ? "border-[#3b82f6] bg-[#3b82f6]/5 ring-1 ring-[#3b82f6]/50" : "",
        isMigrated ? "border-[#06b6d4] bg-[#06b6d4]/5" : "",
        className
      )}
    >
      {/* Selection indicator */}
      {!hideCheckbox && (
        <div className="absolute top-4 left-4 z-10 text-[#3b82f6]">
          <div className={cn(
            "w-5 h-5 rounded border flex items-center justify-center transition-colors",
            isSelected ? "bg-[#3b82f6] border-[#3b82f6]" : "border-[#3f3f46] group-hover:border-[#52525b]"
          )}>
            {isSelected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
          </div>
        </div>
      )}

      {isMigrated && (
        <div className="absolute top-0 right-0 bg-[#06b6d4] text-[#111113] text-[10px] font-bold px-2 py-0.5 rounded-bl-lg tracking-wide">
          ✅ MIGRATED
        </div>
      )}

      <div className={cn("flex flex-col gap-3", !hideCheckbox && "pl-8")}>
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-lg text-zinc-100">{position.displaySymbol}</span>
              <span className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide",
                isLong ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
              )}>
                {isLong ? 'LONG' : 'SHORT'}
              </span>
              <span className="text-[10px] font-bold bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded">
                {position.leverage}x
              </span>
            </div>
            <div className="text-sm font-mono text-zinc-400 mt-1">
              Size: {position.size.toLocaleString()}
            </div>
          </div>
          
          <div className="text-right">
            <div className={cn(
              "font-mono font-bold",
              position.unrealizedPnlUsd >= 0 ? "text-green-500" : "text-red-500"
            )}>
              {position.unrealizedPnlUsd >= 0 ? '+' : ''}{formatCurrency(position.unrealizedPnlUsd)}
            </div>
            <div className="text-xs text-zinc-500 mt-1">
              P&L
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end border-t border-[#27272a] pt-3 mt-1">
          <div>
            <div className="text-[10px] uppercase tracking-wide text-zinc-500 mb-0.5">Entry Price</div>
            <div className="font-mono text-sm text-zinc-300">{formatPriceCurrency(position.entryPrice)}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wide text-zinc-500 mb-0.5">Current Price</div>
            <div className="font-mono text-sm text-zinc-300">{formatPriceCurrency(position.currentPrice)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
