"use client";

import { motion } from "framer-motion";

interface MigrateButtonProps {
  disabled: boolean;
  loading: boolean;
  selectedCount: number;
  onClick: () => void;
}

export default function MigrateButton({
  disabled,
  loading,
  selectedCount,
  onClick,
}: MigrateButtonProps) {
  const active = !disabled && !loading;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Animated directional arrow */}
      <motion.div
        animate={
          loading
            ? { scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }
            : { x: [0, 8, 0] }
        }
        transition={{
          duration: loading ? 0.6 : 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {loading ? (
          <svg className="w-8 h-8 text-[var(--migrate)]" viewBox="0 0 24 24" fill="none">
            <motion.circle
              cx="12" cy="12" r="10"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="60"
              strokeDashoffset="60"
              animate={{ strokeDashoffset: [60, 0], rotate: [0, 360] }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "center" }}
            />
          </svg>
        ) : (
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            className={active ? "text-[var(--migrate)]" : "text-[var(--text-muted)]/40"}
          >
            <path
              d="M5 12H19M19 12L13 6M19 12L13 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </motion.div>

      {/* Main button */}
      <motion.button
        onClick={onClick}
        disabled={disabled || loading}
        whileHover={active ? { scale: 1.06 } : undefined}
        whileTap={active ? { scale: 0.95 } : undefined}
        className={`
          relative px-8 py-3.5 rounded-2xl font-bold text-sm uppercase tracking-[0.2em]
          transition-all duration-300 overflow-hidden
          ${
            disabled || loading
              ? "bg-white/[0.03] text-[var(--text-muted)]/40 cursor-not-allowed border border-white/[0.03]"
              : "bg-gradient-to-r from-[var(--migrate-deep)] to-[var(--migrate)] text-white border border-[var(--migrate)]/30"
          }
        `}
        style={
          active
            ? {
                animation: "button-glow 3s ease-in-out infinite",
              }
            : undefined
        }
      >
        {/* Shimmer sweep */}
        {active && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
          />
        )}

        <span className="relative z-10 flex items-center gap-2">
          {loading ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                ⚡
              </motion.span>
              Executing...
            </>
          ) : (
            <>
              ⚡ Migrate
            </>
          )}
        </span>
      </motion.button>

      {/* Context label */}
      <motion.p
        key={selectedCount}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-[11px] text-[var(--text-muted)] text-center font-medium"
      >
        {loading
          ? "Delta-neutral swap in progress..."
          : selectedCount > 0
            ? `${selectedCount} position${selectedCount > 1 ? "s" : ""} selected`
            : "Select positions to migrate"}
      </motion.p>
    </div>
  );
}
