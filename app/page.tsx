"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Position, MigrationResult, MigrationStep, ExchangeConnection } from "@/lib/types";
import { DEMO_POSITIONS, DEMO_FEE_SAVINGS, simulatePriceUpdate } from "@/lib/demo-data";
import PositionCard from "@/components/PositionCard";
import MigrateButton from "@/components/MigrateButton";
import MigrationProgress from "@/components/MigrationProgress";
import MigrationReceipt from "@/components/MigrationReceipt";
import ExchangePanelHeader from "@/components/ExchangePanelHeader";

export default function DashboardPage() {
  const [positions, setPositions] = useState<Position[]>(DEMO_POSITIONS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [migrating, setMigrating] = useState(false);
  const [migrationSteps, setMigrationSteps] = useState<MigrationStep[]>([]);
  const [migratedIds, setMigratedIds] = useState<string[]>([]);
  const [migrationTimes, setMigrationTimes] = useState<Record<string, number>>({});
  const [lastResult, setLastResult] = useState<MigrationResult | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const sourceConnection: ExchangeConnection = {
    exchange: "binance",
    status: "connected",
    apiKeyPreview: "sk-***...F4x2",
    positionCount: positions.filter((p) => !migratedIds.includes(p.id)).length,
    totalNotional: positions
      .filter((p) => !migratedIds.includes(p.id))
      .reduce((sum, p) => sum + p.notional, 0),
  };

  const destConnection: ExchangeConnection = {
    exchange: "pacifica",
    status: "connected",
    apiKeyPreview: "pk-***...J7b9",
    positionCount: migratedIds.length,
    totalNotional: positions
      .filter((p) => migratedIds.includes(p.id))
      .reduce((sum, p) => sum + p.notional, 0),
  };

  // Live price simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setPositions((prev) => simulatePriceUpdate(prev));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  const selectAll = useCallback(() => {
    const available = positions
      .filter((p) => !migratedIds.includes(p.id))
      .map((p) => p.id);
    setSelectedIds((prev) =>
      prev.length === available.length ? [] : available
    );
  }, [positions, migratedIds]);

  const executeMigration = async () => {
    if (selectedIds.length === 0 || migrating) return;

    setMigrating(true);
    setMigrationSteps([]);

    try {
      const res = await fetch("/api/migrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          positionIds: selectedIds,
          sourceExchange: "binance",
          destinationExchange: "pacifica",
          maxSlippage: 0.1,
          dryRun: false,
        }),
      });

      const data = await res.json();

      const steps: MigrationStep[] = [];
      for (const result of data.results) {
        steps.push({ type: "connecting", exchange: "binance" });
        setMigrationSteps([...steps]);
        await new Promise((r) => setTimeout(r, 200));

        steps.push({ type: "connecting", exchange: "pacifica" });
        setMigrationSteps([...steps]);
        await new Promise((r) => setTimeout(r, 300));

        steps.push({ type: "submitting", exchange: "binance", action: "close" });
        setMigrationSteps([...steps]);
        await new Promise((r) => setTimeout(r, 150));

        steps.push({ type: "submitting", exchange: "pacifica", action: "open" });
        setMigrationSteps([...steps]);
        await new Promise((r) => setTimeout(r, 400));

        if (result.sourceLeg.status === "filled") {
          steps.push({
            type: "filled",
            exchange: "binance",
            price: result.sourceLeg.fillPrice,
            slippage: result.sourceLeg.slippage,
          });
          setMigrationSteps([...steps]);
          await new Promise((r) => setTimeout(r, 200));
        }

        if (result.destinationLeg.status === "filled") {
          steps.push({
            type: "filled",
            exchange: "pacifica",
            price: result.destinationLeg.fillPrice,
            slippage: result.destinationLeg.slippage,
          });
          setMigrationSteps([...steps]);
          await new Promise((r) => setTimeout(r, 200));
        }

        if (result.status === "success") {
          steps.push({
            type: "complete",
            timeMs: result.executionTimeMs,
            netSlippage: result.netSlippage,
          });
          setMigrationSteps([...steps]);

          setMigratedIds((prev) => [...prev, result.position.id]);
          setMigrationTimes((prev) => ({
            ...prev,
            [result.position.id]: Date.now(),
          }));
        }
      }

      if (data.results.length > 0) {
        setLastResult(data.results[0]);
        await new Promise((r) => setTimeout(r, 600));
        setShowReceipt(true);
      }

      setSelectedIds([]);
    } catch (err) {
      setMigrationSteps((prev) => [
        ...prev,
        { type: "error", message: "Network error during migration" },
      ]);
    } finally {
      setMigrating(false);
    }
  };

  const sourcePositions = positions.filter(
    (p) => !migratedIds.includes(p.id)
  );
  const migratedPositions = positions.filter((p) =>
    migratedIds.includes(p.id)
  );

  return (
    <div className="min-h-screen bg-ambient">
      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Fixed ambient orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 10, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] left-[15%] w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)" }}
        />
        <motion.div
          animate={{
            x: [0, -40, 20, 0],
            y: [0, 30, -15, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)" }}
        />
      </div>

      {/* ===== TOP NAV ===== */}
      <nav className="glass sticky top-0 z-50 border-b border-white/4">
        <div className="h-16 flex items-center justify-between layout-container" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-9 h-9 rounded-xl bg-linear-to-br from-primary to-migrate flex items-center justify-center shadow-lg shadow-(--primary)/20"
            >
              <span className="text-white text-lg font-black">⚡</span>
            </motion.div>
            <div>
              <span className="text-lg font-extrabold bg-linear-to-r from-primary-glow via-white to-migrate-glow bg-clip-text text-transparent">
                PaciPort
              </span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] bg-(--primary)/10 text-primary px-2.5 py-1 rounded-full border border-(--primary)/20">
              Demo
            </span>
          </div>

          <div className="flex items-center gap-6 text-[13px] text-text-secondary">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-success"
              />
              <span className="font-mono text-success font-medium">Live</span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="font-mono">
              <span className="text-text-muted">TVL Migrated </span>
              <motion.span
                key={destConnection.totalNotional}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-primary font-bold"
              >
                ${destConnection.totalNotional.toLocaleString()}
              </motion.span>
            </div>
          </div>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative z-10 text-center pt-10 pb-6 layout-container"
      >
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
          <span className="bg-linear-to-r from-primary-glow via-white to-migrate-glow bg-clip-text text-transparent">
            Position Teleporter
          </span>
        </h1>
        <p className="text-text-muted text-base max-w-lg mx-auto leading-relaxed">
          Delta-neutral migration in milliseconds. Close on source, open on destination — simultaneously.
        </p>

        {/* Stats pills */}
        <div className="flex items-center justify-center gap-3 mt-5">
          {[
            { label: "Avg. Migration", value: "<1.5s", color: "var(--speed-gold)" },
            { label: "Net Slippage", value: "<0.03%", color: "var(--success)" },
            { label: "Exposure Gap", value: "<100ms", color: "var(--primary)" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -2, scale: 1.03 }}
              className="glass-elevated rounded-xl px-4 py-2.5 flex flex-col items-center min-w-[120px]"
            >
              <span className="font-mono font-bold text-sm" style={{ color: stat.color }}>
                {stat.value}
              </span>
              <span className="text-[10px] text-text-muted uppercase tracking-wider mt-0.5">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Receipt overlay */}
      <AnimatePresence>
        {showReceipt && lastResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setShowReceipt(false)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <MigrationReceipt
                result={lastResult}
                annualSavings={DEMO_FEE_SAVINGS.annualSavings}
                onClose={() => setShowReceipt(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== MAIN 3-COLUMN LAYOUT ===== */}
      <main className="relative z-10 pb-12 layout-container">
        <div className="three-col-grid">

          {/* LEFT PANEL — Source Exchange */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="glass-elevated rounded-2xl p-5 relative overflow-hidden min-h-[400px]"
          >
            {/* Subtle top accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-(--competitor)/30 to-transparent" />

            <ExchangePanelHeader
              connection={sourceConnection}
              variant="source"
            />

            {/* Summary bar */}
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-3 text-[13px] text-text-secondary">
                <span className="font-mono">
                  {sourcePositions.length} position
                  {sourcePositions.length !== 1 ? "s" : ""}
                </span>
                <span className="text-text-muted">•</span>
                <span className="font-mono">
                  ${sourceConnection.totalNotional.toLocaleString()}
                </span>
              </div>
              <button
                onClick={selectAll}
                className="text-[12px] text-migrate hover:text-migrate-glow font-semibold transition-colors hover:underline underline-offset-2"
              >
                {selectedIds.length === sourcePositions.length &&
                sourcePositions.length > 0
                  ? "Deselect All"
                  : "Select All"}
              </button>
            </div>

            {/* Position cards */}
            <div className="flex flex-col gap-3">
              <AnimatePresence mode="popLayout">
                {sourcePositions.map((p) => (
                  <PositionCard
                    key={p.id}
                    position={p}
                    selected={selectedIds.includes(p.id)}
                    onSelect={toggleSelect}
                  />
                ))}
              </AnimatePresence>

              {sourcePositions.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-5xl mb-4"
                  >
                    🎉
                  </motion.div>
                  <p className="font-bold text-lg text-(--text-primary)">
                    All positions migrated!
                  </p>
                  <p className="text-[13px] mt-2 text-text-muted">
                    Your capital is now earning on Pacifica.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* CENTER COLUMN — Migrate Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, type: "spring" }}
            className="flex flex-col items-center pt-8 gap-4 sticky top-24"
          >
            {/* Connection beam line */}
            <div className="relative w-full flex items-center justify-center mb-2">
              <div className="absolute w-full h-px connection-beam" />
            </div>

            <MigrateButton
              disabled={selectedIds.length === 0}
              loading={migrating}
              selectedCount={selectedIds.length}
              onClick={executeMigration}
            />

            <MigrationProgress steps={migrationSteps} />
          </motion.div>

          {/* RIGHT PANEL — Destination Exchange */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
            className="glass-elevated rounded-2xl p-5 relative overflow-hidden min-h-[400px]"
          >
            {/* Subtle top accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-(--primary)/30 to-transparent" />

            <ExchangePanelHeader
              connection={destConnection}
              variant="destination"
            />

            {/* Summary bar */}
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-3 text-[13px] text-text-secondary">
                <span className="font-mono">
                  {migratedPositions.length} position
                  {migratedPositions.length !== 1 ? "s" : ""}
                </span>
                <span className="text-text-muted">•</span>
                <span className="font-mono">
                  ${destConnection.totalNotional.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Migrated position cards */}
            <div className="flex flex-col gap-3">
              <AnimatePresence mode="popLayout">
                {migratedPositions.map((p) => (
                  <PositionCard
                    key={p.id}
                    position={p}
                    migrated
                    migratedAt={migrationTimes[p.id]}
                    showCheckbox={false}
                  />
                ))}
              </AnimatePresence>

              {migratedPositions.length === 0 && (
                <div className="text-center py-16">
                  <motion.div
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-5xl mb-4"
                  >
                    📥
                  </motion.div>
                  <p className="text-[13px] text-text-muted">
                    Migrated positions appear here
                  </p>
                </div>
              )}
            </div>

            {/* Fee savings */}
            {migratedPositions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-5 glass rounded-xl p-5 text-center relative overflow-hidden"
              >
                {/* Shimmer effect */}
                <motion.div
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
                  className="absolute inset-0 bg-linear-to-r from-transparent via-(--speed-gold)/5 to-transparent pointer-events-none"
                />
                <p className="text-[12px] text-text-secondary relative z-10">
                  Estimated annual savings
                </p>
                <p className="font-mono font-black text-2xl text-speed-gold mt-1 relative z-10">
                  ${DEMO_FEE_SAVINGS.annualSavings.toLocaleString()}/year
                </p>
                <p className="text-[11px] text-text-muted mt-1 relative z-10">
                  based on lower maker/taker fees on Pacifica
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
