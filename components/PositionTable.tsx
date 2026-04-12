import { PositionCard } from './PositionCard';
import type { Position } from '@/lib/types';

interface Props {
  positions: Position[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
}

export function PositionTable({ positions, selectedIds, onToggleSelect, onSelectAll }: Props) {
  const allSelected = positions.length > 0 && selectedIds.size === positions.length;
  const isPartiallySelected = selectedIds.size > 0 && selectedIds.size < positions.length;

  if (positions.length === 0) {
    return (
      <div className="border border-dashed border-[#27272a] rounded-xl p-8 text-center bg-[#111113]/50">
        <p className="text-zinc-500">No open positions found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#111113]/50">
      <div className="flex items-center justify-between mb-4 px-1">
        <label className="flex items-center gap-2 cursor-pointer text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
          <input 
            type="checkbox" 
            className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-[#3b82f6] focus:ring-[#3b82f6] focus:ring-offset-zinc-900"
            checked={allSelected}
            ref={(input) => {
              if (input) input.indeterminate = isPartiallySelected;
            }}
            onChange={onSelectAll}
          />
          <span className="font-medium">Select All ({positions.length})</span>
        </label>
        <div className="text-sm text-zinc-500">
          <span className="font-mono text-[#3b82f6] font-medium">{selectedIds.size}</span> selected
        </div>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto pr-2 pb-4">
        {positions.map(pos => (
          <PositionCard 
            key={pos.id} 
            position={pos} 
            isSelected={selectedIds.has(pos.id)} 
            onToggleSelect={onToggleSelect} 
          />
        ))}
      </div>
    </div>
  );
}
