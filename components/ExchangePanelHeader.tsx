"use client";

import { motion } from "framer-motion";
import { ExchangeConnection } from "@/lib/types";

interface ExchangePanelHeaderProps {
  connection: ExchangeConnection;
  variant: "source" | "destination";
}

const EXCHANGE_CONFIG = {
  source: {
    gradient: "from-[#f59e0b] to-[#f97316]",
    bg: "bg-[#f59e0b]",
    color: "var(--competitor)",
    label: "SOURCE",
    icon: "🟠",
  },
  destination: {
    gradient: "from-[#06b6d4] to-[#3b82f6]",
    bg: "bg-[#06b6d4]",
    color: "var(--primary)",
    label: "DESTINATION",
    icon: "🔵",
  },
};

export default function ExchangePanelHeader({
  connection,
  variant,
}: ExchangePanelHeaderProps) {
  const config = EXCHANGE_CONFIG[variant];
  const isConnected = connection.status === "connected";

  return (
    <div className="flex items-center justify-between gap-2 mb-4" style={{ minWidth: 0 }}>
      <div className="flex items-center gap-2.5" style={{ minWidth: 0, flex: '1 1 0' }}>
        {/* Exchange icon */}
        <div
          className={`w-10 h-10 rounded-xl bg-linear-to-br ${config.gradient} flex items-center justify-center font-black text-xs text-white shadow-lg shrink-0`}
          style={{ boxShadow: `0 4px 20px ${config.color}33` }}
        >
          {connection.exchange.slice(0, 2).toUpperCase()}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h2 className="text-sm font-bold capitalize text-(--text-primary) truncate">
              {connection.exchange}
            </h2>
            <span
              className="text-[9px] uppercase tracking-[0.12em] font-bold px-1.5 py-0.5 rounded-md shrink-0"
              style={{
                backgroundColor: `${config.color}15`,
                color: config.color,
                border: `1px solid ${config.color}25`,
              }}
            >
              {config.label}
            </span>
          </div>
          <p className="text-[10px] text-text-muted font-mono mt-0.5 truncate">
            {connection.apiKeyPreview || "Not configured"}
          </p>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 bg-white/2 px-3 py-1.5 rounded-lg border border-white/4" style={{ flexShrink: 0 }}>
        <motion.div
          className="w-2 h-2 rounded-full"
          style={{
            backgroundColor: isConnected ? "var(--success)" : "var(--loss)",
            boxShadow: isConnected
              ? "0 0 8px var(--success)"
              : "0 0 8px var(--loss)",
          }}
          animate={
            isConnected
              ? { scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }
              : undefined
          }
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span
          className="text-[11px] font-semibold capitalize"
          style={{
            color: isConnected ? "var(--success)" : "var(--loss)",
          }}
        >
          {connection.status}
        </span>
      </div>
    </div>
  );
}
