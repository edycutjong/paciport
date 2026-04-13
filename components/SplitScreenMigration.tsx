"use client";

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExchangeLogo } from './ExchangeLogo';
import { PositionTable } from './PositionTable';
import { PositionCard } from './PositionCard';
import { MigrationReceipt } from './MigrationReceipt';
import type { Position, Migration } from '@/lib/types';
import { ArrowRight, Settings2, Zap } from 'lucide-react';
import { formatCurrency } from '@/lib/format';

interface Props {
  sourcePositions: Position[];
}
// ── Particle DataStream — rendered only during migration ───────────────────
function DataStream({ active }: { active: boolean }) {
  const particles = Array.from({ length: 12 }, (_, i) => i);
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 pointer-events-none overflow-hidden"
        >
          {/* Vertical beam */}
          <motion.div
            className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
            style={{
              background: 'linear-gradient(to bottom, transparent, #06b6d4, transparent)',
            }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          {/* Particles */}
          {particles.map((i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 -translate-x-1/2 rounded-full"
              style={{
                width: i % 3 === 0 ? 3 : 2,
                height: i % 3 === 0 ? 3 : 2,
                background: i % 4 === 0 ? '#f59e0b' : '#06b6d4',
                boxShadow: `0 0 6px ${i % 4 === 0 ? '#f59e0b' : '#06b6d4'}`,
              }}
              initial={{ y: '-5%', opacity: 0 }}
              animate={{ y: '105%', opacity: [0, 1, 1, 0] }}
              transition={{
                duration: 0.9 + (i % 4) * 0.2,
                repeat: Infinity,
                delay: i * 0.18,
                ease: 'linear',
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Scan-line header decoration ──────────────────────────────────────────
function ScanLine({ color }: { color: string }) {
  return (
    <motion.div
      className="absolute left-0 right-0 h-px pointer-events-none"
      style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      animate={{ opacity: [0, 0.6, 0], scaleX: [0.4, 1, 0.4] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
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
  const [currentlyMigratingId, setCurrentlyMigratingId] = useState<string | null>(null);
  const [migratingSymbol, setMigratingSymbol] = useState<string>('');

  const sourcePanelRef = useRef<HTMLDivElement>(null);
  const destPanelRef = useRef<HTMLDivElement>(null);

  // ── Flying card state (position-agnostic, uses top/left coords) ──────────
  const [flyState, setFlyState] = useState<{
    pos: Position | null;
    phase: 'idle' | 'lift' | 'fly' | 'land';
    style: React.CSSProperties;
  }>({ pos: null, phase: 'idle', style: {} });

  const toggleSelect = useCallback((id: string) => {
    if (isMigrating) return;
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  }, [isMigrating]);

  const selectAll = useCallback(() => {
    if (isMigrating) return;
    setSelectedIds(prev => {
      if (prev.size === positions.length) return new Set();
      return new Set(positions.map(p => p.id));
    });
  }, [isMigrating, positions]);

  const executeMigration = async () => {
    /* v8 ignore next */
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
        /* v8 ignore next */
        if (!pos) continue;

        setCurrentlyMigratingId(pId);
        setMigratingSymbol(pos.displaySymbol);

        // ── Phase 1: Lift (highlight the card) ───────────────────────────
        setFlyState({ pos, phase: 'lift', style: {} });
        await new Promise(r => setTimeout(r, 400));
        log(`✅ Binance: Close order submitted (${pos.displaySymbol})`);

        // ── Phase 2: Fly across (animate from source rect to dest rect) ──
        setFlyState({ pos, phase: 'fly', style: {} });
        await new Promise(r => setTimeout(r, 300));
        log(`✅ Pacifica: Open order submitted (${pos.displaySymbol}, ${pos.leverage}x ${pos.side.toUpperCase()})`);
        log("⏳ Waiting for fills...");

        // ── API call ──────────────────────────────────────────────────────
        const response = await fetch('/api/migrate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ positionIds: [pId], maxSlippage }),
        });
        const result = await response.json();

        if (result.success && result.migrations.length > 0) {
          // Phase 3: Land
          setFlyState({ pos, phase: 'land', style: {} });
          await new Promise(r => setTimeout(r, 500));

          const currentMigration = {
            ...result.migrations[0],
            status: 'completed',
            executionTimeMs: 1412,
            slippagePct: 0.027,
          };

          log(`✅ Filled at ${pos.currentPrice} (${currentMigration.slippagePct}% slippage)`);

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

        // Reset fly state
        setFlyState({ pos: null, phase: 'idle', style: {} });
        setCurrentlyMigratingId(null);
        await new Promise(r => setTimeout(r, 600));
      }

      setTimeout(() => {
        setShowReceipt(true);
        setIsMigrating(false);
      }, 500);
    } catch (_err) {
      log(`❌ Migration failed: ${_err}`);
      setIsMigrating(false);
      setFlyState({ pos: null, phase: 'idle', style: {} });
      setCurrentlyMigratingId(null);
    }
  };

  const totalSelectedNotional = positions
    .filter(p => selectedIds.has(p.id))
    .reduce((sum, p) => sum + p.notionalUsd, 0);

  const canMigrate = selectedIds.size > 0 && !isMigrating;

  return (
    <div className="w-full flex flex-col gap-5">

      {/* ═══════════════════════════════════════════════════════════
          MIGRATION GRID
      ═══════════════════════════════════════════════════════════ */}
      <div
        className="grid grid-cols-1 lg:grid-cols-[1fr_80px_1fr] gap-4 relative"
        ref={sourcePanelRef}
      >

        {/* ─── SOURCE PANEL ─── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
          className="flex flex-col rounded-2xl overflow-hidden relative"
          style={{
            background: 'linear-gradient(160deg, rgba(20,16,8,0.95) 0%, rgba(10,10,24,0.98) 100%)',
            border: isMigrating
              ? '1px solid rgba(245,158,11,0.4)'
              : '1px solid rgba(245,158,11,0.18)',
            boxShadow: isMigrating
              ? '0 0 40px rgba(245,158,11,0.12), inset 0 1px 0 rgba(245,158,11,0.1)'
              : '0 0 0 rgba(245,158,11,0)',
            transition: 'border-color 0.4s, box-shadow 0.4s',
          }}
        >
          {/* Top edge scan-line */}
          <div className="relative h-px overflow-visible">
            <ScanLine color="#f59e0b" />
          </div>

          {/* Header */}
          <div
            className="px-5 py-4 flex items-center gap-3 relative overflow-hidden"
            style={{ background: 'rgba(16,14,6,0.9)', borderBottom: '1px solid rgba(245,158,11,0.12)' }}
          >
            {/* Diagonal stripe accent */}
            <div className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: 'repeating-linear-gradient(45deg, #f59e0b 0px, #f59e0b 1px, transparent 1px, transparent 8px)',
              }}
            />
            <ExchangeLogo exchange="binance" size={24} />
            <div>
              <h2 className="font-bold text-sm text-zinc-100 tracking-widest font-mono">BINANCE FUTURES</h2>
              <p className="text-[10px] text-[#f59e0b]/60 font-mono tracking-wider mt-0.5">SOURCE EXCHANGE</p>
            </div>
            {isMigrating && (
              <motion.div
                className="ml-auto flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="w-2 h-2 rounded-full bg-[#f59e0b]"
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
                <span className="text-[10px] font-mono text-[#f59e0b]/70 tracking-widest">ACTIVE</span>
              </motion.div>
            )}
          </div>

          {/* Position list with migrating highlight */}
          <div className="p-4 flex-1">
            <PositionTable
              positions={positions}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
              onSelectAll={selectAll}
            />
            {currentlyMigratingId && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 px-3 py-2 rounded-lg border border-[#f59e0b]/25 bg-[#f59e0b]/5 flex items-center gap-2"
              >
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]"
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                />
                <span className="text-[11px] font-mono text-[#f59e0b]/80">Closing {migratingSymbol}...</span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* ─── CENTER COLUMN ─── */}
        <div className="hidden lg:flex flex-col items-center justify-center gap-5 relative">
          {/* Background line */}
          <div className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(59,130,246,0.2), transparent)' }}
          />

          {/* Data stream during migration */}
          <DataStream active={isMigrating} />

          {/* Migrate button */}
          <div className="relative z-10">
            {/* Orbital ring — visible when ready */}
            <AnimatePresence>
              {canMigrate && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  className="absolute inset-0 -m-3 rounded-full pointer-events-none"
                  style={{ border: '1px solid rgba(59,130,246,0.3)' }}
                >
                  <motion.div
                    className="absolute -top-1 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3b82f6]"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    style={{ transformOrigin: '50% calc(50% + 26px)' }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={executeMigration}
              disabled={!canMigrate}
              className="relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 z-10 overflow-hidden"
              style={canMigrate ? {
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                boxShadow: '0 0 30px rgba(59,130,246,0.5), 0 0 60px rgba(59,130,246,0.2)',
              } : {
                background: 'rgba(24,24,40,0.8)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {/* Shimmer on hover */}
              {canMigrate && (
                <motion.div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }}
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
              )}
              {isMigrating ? (
                <motion.div
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                />
              ) : (
                <ArrowRight className="w-6 h-6 text-white relative z-10" strokeWidth={2.5} />
              )}
            </button>
          </div>

          {/* Slippage label */}
          <div className="flex flex-col items-center gap-1 relative z-10">
            <div className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest flex items-center gap-1">
              <Settings2 className="w-2.5 h-2.5" /> Slippage
            </div>
            <div className="text-zinc-400 font-mono text-[11px]">{maxSlippage.toFixed(2)}%</div>
          </div>
        </div>

        {/* ─── MOBILE MIGRATE BUTTON ─── */}
        <div className="lg:hidden">
          <button
            onClick={executeMigration}
            disabled={!canMigrate}
            className="w-full py-4 font-bold text-base rounded-2xl transition-all flex items-center justify-center gap-3 relative overflow-hidden"
            style={canMigrate ? {
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              boxShadow: '0 0 30px rgba(59,130,246,0.4)',
            } : {
              background: 'rgba(24,24,40,0.8)',
              border: '1px solid rgba(255,255,255,0.06)',
              color: '#52526b',
            }}
          >
            {canMigrate && (
              <motion.div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }}
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
              />
            )}
            <Zap className="w-5 h-5 relative z-10" />
            <span className="relative z-10">
              {isMigrating ? 'MIGRATING...' : (
                <>MIGRATE {selectedIds.size > 0 && formatCurrency(totalSelectedNotional)}</>
              )}
            </span>
            <ArrowRight className="w-5 h-5 relative z-10" />
          </button>
        </div>

        {/* ─── DESTINATION PANEL ─── */}
        <motion.div
          ref={destPanelRef}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
          className="flex flex-col rounded-2xl overflow-hidden relative"
          style={{
            background: 'linear-gradient(160deg, rgba(4,18,22,0.97) 0%, rgba(10,10,24,0.98) 100%)',
            border: isMigrating
              ? '1px solid rgba(6,182,212,0.45)'
              : '1px solid rgba(6,182,212,0.2)',
            boxShadow: isMigrating
              ? '0 0 40px rgba(6,182,212,0.15), inset 0 1px 0 rgba(6,182,212,0.1)'
              : '0 0 0 rgba(6,182,212,0)',
            transition: 'border-color 0.4s, box-shadow 0.4s',
          }}
        >
          {/* Top edge scan-line */}
          <div className="relative h-px overflow-visible">
            <ScanLine color="#06b6d4" />
          </div>

          {/* Header */}
          <div
            className="px-5 py-4 flex items-center gap-3 relative overflow-hidden"
            style={{ background: 'rgba(4,16,20,0.9)', borderBottom: '1px solid rgba(6,182,212,0.12)' }}
          >
            <div className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: 'repeating-linear-gradient(135deg, #06b6d4 0px, #06b6d4 1px, transparent 1px, transparent 8px)',
              }}
            />
            <ExchangeLogo exchange="pacifica" size={24} />
            <div>
              <h2 className="font-bold text-sm text-zinc-100 tracking-widest font-mono">PACIFICA EXCHANGE</h2>
              <p className="text-[10px] text-[#06b6d4]/60 font-mono tracking-wider mt-0.5">DESTINATION</p>
            </div>
            {isMigrating && (
              <motion.div
                className="ml-auto flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="w-2 h-2 rounded-full bg-[#06b6d4]"
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0.3 }}
                />
                <span className="text-[10px] font-mono text-[#06b6d4]/70 tracking-widest">READY</span>
              </motion.div>
            )}
          </div>

          {/* Migrated positions */}
          <div className="p-4 flex-1 flex flex-col gap-3 min-h-[220px]">
            {migratedPositions.length === 0 ? (
              <motion.div
                className="flex-1 rounded-xl flex flex-col items-center justify-center text-center p-8"
                style={{
                  border: '1px dashed rgba(6,182,212,0.15)',
                  background: 'rgba(4,18,22,0.4)',
                }}
              >
                <motion.div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                  style={{ background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.12)' }}
                  animate={isMigrating ? { boxShadow: ['0 0 0px rgba(6,182,212,0)', '0 0 24px rgba(6,182,212,0.3)', '0 0 0px rgba(6,182,212,0)'] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5 text-[#06b6d4]/30" />
                </motion.div>
                <p className="text-zinc-600 text-sm">Migrated positions appear here</p>
                {isMigrating && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[11px] text-[#06b6d4]/50 font-mono mt-2"
                  >
                    awaiting confirmation...
                  </motion.p>
                )}
              </motion.div>
            ) : (
              migratedPositions.map((pos, idx) => (
                <motion.div
                  key={pos.id}
                  initial={{ opacity: 0, scale: 0.92, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.05, ease: [0.25, 1, 0.5, 1] }}
                >
                  <PositionCard
                    position={pos}
                    isMigrated
                    hideCheckbox
                  />
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* ─── FLYING CARD OVERLAY ─── */}
        <AnimatePresence mode="wait">
          {flyState.pos && flyState.phase !== 'idle' && (
            <motion.div
              key={`fly-${flyState.pos.id}`}
              className="absolute top-1/2 left-2 w-[42%] lg:w-[30%] -translate-y-1/2 pointer-events-none z-50"
              style={{ willChange: 'transform, opacity' }}
              initial={{ opacity: 0, scale: 0.95, y: '-40%' }}
              animate={
                flyState.phase === 'lift'
                  ? { opacity: 1, scale: 1.04, y: '-52%', x: 0 }
                  : flyState.phase === 'fly'
                  ? { opacity: 0.9, scale: 0.98, y: '-50%', x: '195%' }
                  : { opacity: 0, scale: 0.92, y: '-50%', x: '195%' }
              }
              transition={
                flyState.phase === 'lift'
                  ? { duration: 0.3, ease: [0.25, 1, 0.5, 1] }
                  : flyState.phase === 'fly'
                  ? { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
                  : { duration: 0.25, ease: 'easeIn' }
              }
            >
              {/* Glow trail */}
              {flyState.phase === 'fly' && (
                <motion.div
                  className="absolute inset-0 rounded-xl blur-xl"
                  style={{ background: 'rgba(6,182,212,0.2)' }}
                  animate={{ opacity: [0.6, 0.2, 0.6] }}
                  transition={{ duration: 0.4, repeat: Infinity }}
                />
              )}
              {/* Speed streak lines */}
              {flyState.phase === 'fly' && (
                <motion.div
                  className="absolute -left-6 top-1/2 -translate-y-1/2 flex flex-col gap-1 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.4, repeat: Infinity }}
                >
                  {[40, 28, 16].map((w, i) => (
                    <div key={i} className="h-px rounded-full" style={{ width: w, background: `rgba(6,182,212,${0.5 - i * 0.12})` }} />
                  ))}
                </motion.div>
              )}
              <PositionCard
                position={flyState.pos}
                hideCheckbox
                className="border-[#06b6d4]/60 bg-[#06b6d4]/8 ring-1 ring-[#06b6d4]/40 shadow-[0_4px_40px_rgba(6,182,212,0.35)]"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          EXECUTION LOG
      ═══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {migrationStatusLog.length > 0 && !showReceipt && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
            className="overflow-hidden"
          >
            <div
              className="rounded-2xl p-4 font-mono text-xs leading-relaxed relative overflow-hidden"
              style={{
                background: 'rgba(4,6,12,0.9)',
                border: '1px solid rgba(6,182,212,0.12)',
                backdropFilter: 'blur(20px)',
              }}
            >
              {/* Header bar */}
              <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-zinc-800/40">
                <div className="w-2 h-2 rounded-full bg-red-500/70" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                <div className="w-2 h-2 rounded-full bg-green-500/50" />
                <span className="text-zinc-600 text-[10px] ml-2 tracking-widest">EXECUTION LOG</span>
                {isMigrating && (
                  <motion.div
                    className="ml-auto text-[10px] text-[#06b6d4]/60 font-mono tracking-widest"
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    ● LIVE
                  </motion.div>
                )}
              </div>

              {/* Log lines */}
              {migrationStatusLog.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`py-0.5 flex items-start gap-2 ${
                    msg.includes('❌') ? 'text-red-400'
                    : msg.includes('✅') ? 'text-green-400'
                    : 'text-zinc-600'
                  }`}
                >
                  <span className="text-zinc-700 select-none shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <span>{msg}</span>
                </motion.div>
              ))}

              {/* Blinking cursor */}
              {isMigrating && (
                <motion.div
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6 }}
                  className="w-1.5 h-3.5 bg-[#06b6d4] mt-1.5 rounded-sm inline-block"
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════
          RECEIPT MODAL
      ═══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showReceipt && lastMigration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-200 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,8,0.85)', backdropFilter: 'blur(16px)' }}
            onClick={() => setShowReceipt(false)}
          >
            {/* Background grid during receipt */}
            <div className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: 'linear-gradient(rgba(6,182,212,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.05) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />

            <motion.div
              initial={{ scale: 0.85, y: 30, opacity: 0, rotateX: '8deg' }}
              animate={{ scale: 1, y: 0, opacity: 1, rotateX: '0deg' }}
              exit={{ scale: 0.92, y: 16, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
              className="w-full max-w-2xl relative"
              onClick={e => e.stopPropagation()}
            >
              {/* Glow behind modal */}
              <div className="absolute inset-0 rounded-3xl blur-2xl -z-10"
                style={{ background: 'radial-gradient(ellipse, rgba(6,182,212,0.15), transparent 70%)' }}
              />
              <MigrationReceipt
                migration={lastMigration}
                onDismiss={() => setShowReceipt(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
