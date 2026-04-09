"use client";

import { Position } from "@/lib/types";
import { motion } from "framer-motion";

import { useState, useEffect } from "react";

interface PositionCardProps {
  position: Position;
  selected?: boolean;
  onSelect?: (id: string) => void;
  migrated?: boolean;
  migratedAt?: number;
  showCheckbox?: boolean;
}

export default function PositionCard({
  position,
  selected = false,
  onSelect,
  migrated = false,
  migratedAt,
  showCheckbox = true,
}: PositionCardProps) {
  const isLong = position.side === "long";
  const isProfitable = position.unrealizedPnl >= 0;

  // Track time elapsed since migration dynamically
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    if (migrated && migratedAt) {
      const interval = setInterval(() => {
        setNow(Date.now());
      }, 100);
      return () => clearInterval(interval);
    }
  }, [migrated, migratedAt]);

  const elapsedTime = now && migratedAt ? now - migratedAt : 0;

  return (
    <motion.div
      layout
      layoutId={`position-${position.id}`}
      initial={{ opacity: 0, scale: 0.85, filter: "brightness(2) blur(12px)" }}
      animate={{
        opacity: 1,
        scale: 1,
        filter: "brightness(1) blur(0px)",
        transition: { type: "spring", stiffness: 200, damping: 22 },
      }}
      exit={{
        opacity: 0,
        scale: 1.08,
        filter: "brightness(3) blur(18px)",
        transition: { duration: 0.5 },
      }}
      whileHover={
        !migrated
          ? {
            scale: 1.015,
            y: -2,
          }
          : undefined
      }
      className={[
        "group relative rounded-xl border p-4 transition-all duration-300 cursor-pointer overflow-hidden",
        selected
          ? "border-(--migrate)/60 bg-(--migrate)/6"
          : migrated
            ? "border-(--primary)/30 bg-(--primary)/4"
            : "border-white/4 bg-white/2 hover:border-white/8 hover:bg-white/3"
      ].filter(Boolean).join(" ")}
      onClick={() => !migrated && onSelect?.(position.id)}
    >
      {/* Selected glow ring */}
      {selected && (
        <motion.div
          layoutId={`glow-${position.id}`}
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            boxShadow: "0 0 24px rgba(59,130,246,0.2), inset 0 0 24px rgba(59,130,246,0.05)",
          }}
          animate={{
            boxShadow: [
              "0 0 20px rgba(59,130,246,0.15), inset 0 0 20px rgba(59,130,246,0.03)",
              "0 0 30px rgba(59,130,246,0.25), inset 0 0 30px rgba(59,130,246,0.06)",
              "0 0 20px rgba(59,130,246,0.15), inset 0 0 20px rgba(59,130,246,0.03)",
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      )}

      {/* Teleport scanline effect when newly migrated */}
      {migrated && migratedAt && elapsedTime < 3000 && (
        <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none z-10">
          <motion.div
            initial={{ top: "0%", opacity: 0.9 }}
            animate={{ top: "100%", opacity: 0 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            className="absolute left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-primary to-transparent shadow-[0_0_15px_var(--primary)] pointer-events-none"
          />
          {/* Flash on arrival */}
          <motion.div
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-(--primary)/10 pointer-events-none"
          />
        </div>
      )}

      {/* Migrated badge */}
      {migrated && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", delay: 0.15 }}
          className="absolute -top-2 right-3 bg-linear-to-r from-success to-[#16a34a] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-lg shadow-(--success)/30 z-20"
        >
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          MIGRATED
          {elapsedTime > 0 && (
            <span className="opacity-70 ml-0.5">
              {(elapsedTime / 1000).toFixed(1)}s
            </span>
          )}
        </motion.div>
      )}

      <div className="flex items-center gap-3 relative z-10">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-2 flex-wrap">
            {showCheckbox && !migrated && (
              <div
                className={`w-[18px] h-[18px] rounded border-[1.5px] mr-1 flex items-center justify-center transition-all duration-200 shrink-0
                  ${selected
                    ? "bg-migrate border-migrate shadow-[0_0_12px_var(--migrate-glow)]"
                    : "border-(--text-muted)/50 group-hover:border-(--text-muted)"
                  }`}
              >
                {selected && (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
                )}
              </div>
            )}
            <span className="font-mono font-bold text-sm text-(--text-primary) truncate">
              {position.symbol}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${isLong
                  ? "bg-(--success)/10 text-success border border-(--success)/20"
                  : "bg-(--loss)/10 text-loss border border-(--loss)/20"
                }`}
            >
              {position.side}
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white/4 text-text-muted border border-white/4">
              {position.leverage}×
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/2 text-text-muted border border-white/3 capitalize">
              {position.marginType}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[12px]">
            <div>
              <span className="text-text-muted text-[10px] uppercase tracking-wider font-medium">Size</span>
              <p className="font-mono font-semibold text-(--text-primary)">
                {position.size} <span className="text-text-muted text-[11px]">{position.symbol.split("-")[0]}</span>
              </p>
            </div>
            <div>
              <span className="text-text-muted text-[10px] uppercase tracking-wider font-medium">Notional</span>
              <p className="font-mono font-semibold text-(--text-primary)">
                ${position.notional.toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-text-muted text-[10px] uppercase tracking-wider font-medium">Entry</span>
              <p className="font-mono text-text-secondary">
                ${position.entryPrice.toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-text-muted text-[10px] uppercase tracking-wider font-medium">Mark</span>
              <motion.p
                key={position.currentPrice}
                initial={{ color: isProfitable ? "#4ade80" : "#f87171" }}
                animate={{ color: "#a1a1b5" }}
                transition={{ duration: 1 }}
                className="font-mono"
              >
                ${position.currentPrice.toLocaleString()}
              </motion.p>
            </div>
          </div>
        </div>

        <div className="text-right pl-2" style={{ minWidth: '80px' }}>
          <motion.p
            key={position.unrealizedPnl}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className={`font-mono font-bold text-base tracking-tight ${isProfitable ? "text-success" : "text-loss"
              }`}
          >
            {isProfitable ? "+" : ""}${Math.abs(position.unrealizedPnl).toLocaleString()}
          </motion.p>
          <p
            className={`font-mono text-[11px] ${isProfitable ? "text-success/60" : "text-loss/60"
              }`}
          >
            {isProfitable ? "▲" : "▼"}{" "}
            {Math.abs(position.unrealizedPnlPercent).toFixed(2)}%
          </p>
        </div>
      </div>
    </motion.div>
  );
}
