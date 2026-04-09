"use client";

import { useState, useEffect } from "react";
import { MigrationResult } from "@/lib/types";
import { motion } from "framer-motion";

interface MigrationReceiptProps {
  result: MigrationResult;
  annualSavings: number;
  onClose: () => void;
}

export default function MigrationReceipt({
  result,
  annualSavings,
  onClose,
}: MigrationReceiptProps) {
  const isSuccess = result.status === "success";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="glass-elevated rounded-2xl p-7 max-w-lg mx-auto relative overflow-hidden"
      style={{
        boxShadow: isSuccess
          ? "0 0 80px rgba(6,182,212,0.1), 0 25px 50px rgba(0,0,0,0.5)"
          : "0 0 80px rgba(239,68,68,0.1), 0 25px 50px rgba(0,0,0,0.5)",
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: isSuccess
            ? "linear-gradient(90deg, transparent, var(--primary), var(--migrate), transparent)"
            : "linear-gradient(90deg, transparent, var(--loss), transparent)",
        }}
      />

      {/* Header */}
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
          className="text-5xl mb-3"
        >
          {isSuccess ? "✅" : "❌"}
        </motion.div>
        <h3 className="text-xl font-bold text-[var(--text-primary)]">
          {isSuccess ? "Position Migrated" : "Migration Failed"}
        </h3>
        <p className="text-[13px] text-[var(--text-muted)] mt-1">
          {isSuccess ? "Delta-neutral swap completed successfully" : "One or more execution legs failed"}
        </p>
      </div>

      {/* Before / After */}
      {isSuccess && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-xl p-4 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-[var(--competitor)]/40 to-transparent" />
            <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--competitor)] font-bold mb-2">
              Binance · Closed
            </p>
            <p className="font-mono font-bold text-[var(--text-primary)] text-base">{result.position.symbol}</p>
            <p className="font-mono text-sm text-[var(--text-secondary)]">
              {result.position.leverage}× {result.position.side.toUpperCase()}
            </p>
            <p className="font-mono text-[12px] text-[var(--text-muted)] mt-2">
              Fill: <span className="text-[var(--text-secondary)]">${result.sourceLeg.fillPrice?.toLocaleString()}</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-xl p-4 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-[var(--primary)]/40 to-transparent" />
            <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--primary)] font-bold mb-2">
              Pacifica · Open
            </p>
            <p className="font-mono font-bold text-[var(--text-primary)] text-base">{result.position.symbol}</p>
            <p className="font-mono text-sm text-[var(--text-secondary)]">
              {result.position.leverage}× {result.position.side.toUpperCase()}
            </p>
            <p className="font-mono text-[12px] text-[var(--text-muted)] mt-2">
              Fill: <span className="text-[var(--text-secondary)]">${result.destinationLeg.fillPrice?.toLocaleString()}</span>
            </p>
          </motion.div>
        </div>
      )}

      {/* Execution Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-xl p-5 mb-6"
      >
        <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--text-muted)] font-semibold mb-4">
          Execution Metrics
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.6 }}
              className="font-mono font-black text-xl text-[var(--speed-gold)]"
            >
              {result.executionTimeMs?.toLocaleString()}ms
            </motion.p>
            <p className="text-[10px] text-[var(--text-muted)] mt-1 uppercase tracking-wider">Time</p>
          </div>
          <div className="text-center">
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.7 }}
              className="font-mono font-black text-xl text-[var(--success)]"
            >
              {result.netSlippage?.toFixed(3)}%
            </motion.p>
            <p className="text-[10px] text-[var(--text-muted)] mt-1 uppercase tracking-wider">Slippage</p>
          </div>
          <div className="text-center">
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.8 }}
              className="font-mono font-black text-xl text-[var(--primary)]"
            >
              &lt;100ms
            </motion.p>
            <p className="text-[10px] text-[var(--text-muted)] mt-1 uppercase tracking-wider">Exposure</p>
          </div>
        </div>
      </motion.div>

      {/* Fee Savings */}
      {isSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="glass rounded-xl p-5 mb-6 text-center relative overflow-hidden"
        >
          <motion.div
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--speed-gold)]/5 to-transparent pointer-events-none"
          />
          <p className="text-sm text-[var(--text-secondary)] mb-2 relative z-10">
            Annual fee savings on Pacifica
          </p>
          <AnimatedCounter target={annualSavings} />
        </motion.div>
      )}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClose}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-[var(--migrate-deep)] to-[var(--migrate)] text-white font-bold text-sm uppercase tracking-widest
          hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all duration-300"
      >
        Continue Trading
      </motion.button>
    </motion.div>
  );
}

function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4); // quartic easing
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [target]);

  return (
    <motion.p
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      className="font-mono font-black text-3xl text-[var(--speed-gold)] relative z-10"
    >
      ${count.toLocaleString()}/year
    </motion.p>
  );
}
