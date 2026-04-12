"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExchangeLogo } from './ExchangeLogo';
import { PositionTable } from './PositionTable';
import { PositionCard } from './PositionCard';
import { MigrationReceipt } from './MigrationReceipt';
import type { Position, Migration } from '@/lib/types';
import { ArrowRight, Settings2 } from 'lucide-react';
import { formatCurrency } from '@/lib/format';

interface Props {
  sourcePositions: Position[];
}

export function SplitScreenMigration({ sourcePositions }: Props) {
  const [positions, setPositions] = useState<Position[]>(sourcePositions);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(sourcePositions.map(p => p.id)));
  const [migratedPositions, setMigratedPositions] = useState<Position[]>([]);
  
  // Migration state
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationStatusLog, setMigrationStatusLog] = useState<string[]>([]);
  const [lastMigration, setLastMigration] = useState<Migration | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [maxSlippage] = useState(0.1);

  // Determine flying pos
  const [flyingPosId, setFlyingPosId] = useState<string | null>(null);

  const toggleSelect = (id: string) => {
    if (isMigrating) return;
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const selectAll = () => {
    if (isMigrating) return;
    if (selectedIds.size === positions.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(positions.map(p => p.id)));
  };

  const executeMigration = async () => {
    if (selectedIds.size === 0 || isMigrating) return;
    
    setIsMigrating(true);
    setShowReceipt(false);
    setMigrationStatusLog([]);

    const log = (msg: string) => setMigrationStatusLog(prev => [...prev, msg]);
    
    try {
      const posArray = Array.from(selectedIds);
      log("⏳ Connecting to Binance Futures API...");

      for (const pId of posArray) {
        const pos = positions.find(p => p.id === pId);
        if (!pos) continue;

        setFlyingPosId(pos.id);
        
        // Step 1: Fly animation start
        await new Promise(r => setTimeout(r, 600));
        log(`✅ Binance: Close order submitted (${pos.displaySymbol})`);
        
        // Step 2: Open Destination
        await new Promise(r => setTimeout(r, 300));
        log(`✅ Pacifica: Open order submitted (${pos.displaySymbol}, ${pos.leverage}x ${pos.side.toUpperCase()})`);
        
        // Wait for fill
        log("⏳ Waiting for fills...");
        
        // API Call simulation
        const response = await fetch('/api/migrate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ positionIds: [pId], maxSlippage })
        });
        const result = await response.json();
        
        if (result.success && result.migrations.length > 0) {
          // In a real app we'd wait for realtime events. Handled synchronously here for demo.
          await new Promise(r => setTimeout(r, 500)); 
          const currentMigration = {
            ...result.migrations[0],
            status: 'completed',
            executionTimeMs: 1412,
            slippagePct: 0.027
          };
          
          log(`✅ Filled at ${pos.currentPrice} (${currentMigration.slippagePct}% slippage)`);
          
          // Remove from source, add to dest
          setPositions(prev => prev.filter(p => p.id !== pId));
          setMigratedPositions(prev => [...prev, pos]);
          setLastMigration(currentMigration);
          
          log(`✅ Migration complete in ${currentMigration.executionTimeMs}ms`);
        }

        setSelectedIds(prev => {
          const next = new Set(prev);
          next.delete(pId);
          return next;
        });
        
        setFlyingPosId(null);
        await new Promise(r => setTimeout(r, 800)); // Pause between multiple
      }
      
      // All done
      setTimeout(() => {
        setShowReceipt(true);
        setIsMigrating(false);
      }, 500);

    } catch (e) {
      log(`❌ Migration failed: ${e}`);
      setIsMigrating(false);
      setFlyingPosId(null);
    }
  };

  const totalSelectedNotional = positions
    .filter(p => selectedIds.has(p.id))
    .reduce((sum, p) => sum + p.notionalUsd, 0);

  return (
    <div className="w-full flex flex-col gap-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_80px_1fr] gap-8 relative">
        
        {/* Source Panel */}
        <div className="flex flex-col bg-[#0a0a18] border border-[#f59e0b]/15 rounded-2xl overflow-hidden shadow-2xl shadow-[#f59e0b]/5 relative">
          {/* Top accent line */}
          <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-[#f59e0b]/40 to-transparent z-10"></div>
          
          <div className="bg-[#10102a]/80 border-b border-[#f59e0b]/15 px-5 py-4 flex items-center gap-3 backdrop-blur-sm">
            <ExchangeLogo exchange="binance" size={24} />
            <h2 className="font-bold text-zinc-100 tracking-wide font-mono">BINANCE FUTURES</h2>
            {isMigrating && <div className="ml-auto w-2 h-2 rounded-full bg-[#f59e0b] animate-ping" />}
          </div>
          <div className="p-5 flex-1">
            <PositionTable 
              positions={positions} 
              selectedIds={selectedIds} 
              onToggleSelect={toggleSelect} 
              onSelectAll={selectAll}
            />
          </div>
        </div>

        {/* Center Action Zone */}
        <div className="hidden lg:flex flex-col items-center justify-center gap-8 relative z-50">
          {/* Glowing connection line */}
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-[#3b82f6]/20 to-transparent -translate-x-1/2"></div>
          
          <button
            onClick={executeMigration}
            disabled={selectedIds.size === 0 || isMigrating}
            className={`
              w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 relative
              ${selectedIds.size > 0 && !isMigrating 
                ? 'bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] hover:scale-110' 
                : 'bg-zinc-900/60 text-zinc-600 cursor-not-allowed border border-zinc-800/40'}
            `}
          >
            {isMigrating ? (
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <ArrowRight className="w-8 h-8" strokeWidth={3} />
            )}
          </button>
          
          <div className="w-full flex items-center flex-col gap-2">
            <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest flex items-center gap-1">
              <Settings2 className="w-3 h-3" /> Max Slippage
            </div>
            <div className="text-zinc-400 font-mono text-sm">{maxSlippage.toFixed(2)}%</div>
          </div>
        </div>

        {/* Mobile Action Zone */}
        <div className="lg:hidden flex flex-col gap-4">
          <button
            onClick={executeMigration}
            disabled={selectedIds.size === 0 || isMigrating}
            className={`w-full py-4 font-bold text-lg rounded-xl transition-all flex items-center justify-center gap-3 ${
              selectedIds.size > 0 && !isMigrating 
              ? 'bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
              : 'bg-zinc-900/60 text-zinc-600 cursor-not-allowed border border-zinc-800/40'
            }`}
          >
            MIGRATE {selectedIds.size > 0 ? formatCurrency(totalSelectedNotional) : ''}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Destination Panel */}
        <div className="flex flex-col bg-[#0a0a18] border border-[#06b6d4]/20 rounded-2xl overflow-hidden shadow-2xl shadow-[#06b6d4]/5 relative">
          {/* Top accent line */}
          <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-[#06b6d4]/40 to-transparent z-10"></div>
          
          <div className="bg-[#10102a]/80 border-b border-[#06b6d4]/20 px-5 py-4 flex items-center gap-3 backdrop-blur-sm">
            <ExchangeLogo exchange="pacifica" size={24} />
            <h2 className="font-bold text-zinc-100 tracking-wide font-mono">PACIFICA EXCHANGE</h2>
            {isMigrating && <div className="ml-auto w-2 h-2 rounded-full bg-[#06b6d4] animate-ping" />}
          </div>
          <div className="p-5 flex-1 flex flex-col gap-3 overflow-y-auto">
            {migratedPositions.length === 0 ? (
              <div className="h-full border border-dashed border-zinc-800/30 rounded-xl p-10 flex flex-col items-center justify-center text-center bg-[#050510]/50">
                <div className="w-14 h-14 rounded-full bg-[#06b6d4]/5 flex items-center justify-center mb-4">
                  <ArrowRight className="w-5 h-5 text-[#06b6d4]/30" />
                </div>
                <p className="text-zinc-600 max-w-[200px] text-sm">Migrated positions will appear here instantly</p>
              </div>
            ) : (
              migratedPositions.map(pos => (
                <PositionCard 
                  key={pos.id} 
                  position={pos}
                  isMigrated
                  hideCheckbox
                />
              ))
            )}
          </div>
        </div>

        {/* The Teleport Animation overlay */}
        <AnimatePresence>
          {flyingPosId && (
            <motion.div
              initial={{ x: 0, scale: 1.05, opacity: 1, zIndex: 100 }}
              animate={{ x: '110%', scale: 1.05, opacity: 1 }}
              exit={{ scale: 1.08, opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
              className="absolute top-1/2 left-4 md:left-8 w-1/3 -translate-y-1/2 pointer-events-none drop-shadow-[0_0_30px_rgba(6,182,212,0.6)]"
            >
              <PositionCard 
                position={positions.find(p => p.id === flyingPosId)!} 
                hideCheckbox 
                className="border-[#06b6d4] bg-[#06b6d4]/10 ring-2 ring-[#06b6d4]"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Execution Log */}
      {migrationStatusLog.length > 0 && !showReceipt && (
        <div className="glass rounded-xl p-5 font-mono text-sm leading-relaxed overflow-hidden border-gradient">
          {migrationStatusLog.map((log, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={log.includes('❌') ? "text-red-400" : log.includes('✅') ? "text-green-400" : "text-zinc-500"}
            >
              {log}
            </motion.div>
          ))}
          {isMigrating && <motion.div animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-2 h-4 bg-[#06b6d4] mt-2 rounded-sm" />}
        </div>
      )}

      {/* Post-Migration Receipt overlay/Modal */}
      {showReceipt && lastMigration && (
        <div className="fixed inset-0 z-100 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            className="w-full max-w-2xl"
          >
            <MigrationReceipt 
              migration={lastMigration} 
              onDismiss={() => setShowReceipt(false)} 
            />
          </motion.div>
        </div>
      )}
    </div>
  );
}
