"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MigrationStep } from "@/lib/types";

interface MigrationProgressProps {
  steps: MigrationStep[];
}

const STEP_CONFIG: Record<MigrationStep["type"], { icon: string; color: string }> = {
  connecting: { icon: "◌", color: "var(--text-muted)" },
  submitting: { icon: "↗", color: "var(--migrate)" },
  waiting_fill: { icon: "◌", color: "var(--text-muted)" },
  filled: { icon: "●", color: "var(--success)" },
  complete: { icon: "◆", color: "var(--speed-gold)" },
  error: { icon: "✕", color: "var(--loss)" },
  rollback: { icon: "↺", color: "var(--loss)" },
};

function formatStep(step: MigrationStep): string {
  switch (step.type) {
    case "connecting":
      return `Connecting ${step.exchange} Futures API`;
    case "submitting":
      return `${step.exchange} → ${step.action === "close" ? "CLOSE" : "OPEN"} submitted`;
    case "waiting_fill":
      return `Awaiting ${step.exchange} fill`;
    case "filled":
      return `${step.exchange} filled $${step.price.toLocaleString()} (${step.slippage.toFixed(3)}%)`;
    case "complete":
      return `Complete — ${step.timeMs.toLocaleString()}ms`;
    case "error":
      return `Error: ${step.message}`;
    case "rollback":
      return `Rollback ${step.exchange}`;
    default:
      return "";
  }
}

export default function MigrationProgress({ steps }: MigrationProgressProps) {
  const [visibleSteps, setVisibleSteps] = useState<number>(0);

  useEffect(() => {
    if (steps.length > visibleSteps) {
      const timer = setTimeout(() => {
        setVisibleSteps((v) => v + 1);
      }, 180);
      return () => clearTimeout(timer);
    }
  }, [steps.length, visibleSteps]);

  if (steps.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-4 mt-2 w-full"
    >
      <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--text-muted)] mb-3 font-semibold flex items-center gap-2">
        <motion.span
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-1.5 h-1.5 rounded-full bg-[var(--migrate)]"
        />
        Execution Log
      </p>
      <div className="space-y-1 font-mono text-[11px]">
        <AnimatePresence>
          {steps.slice(0, visibleSteps).map((step, i) => {
            const config = STEP_CONFIG[step.type];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8, height: 0 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                transition={{ duration: 0.2 }}
                className="flex items-start gap-2 overflow-hidden"
              >
                <span
                  className="shrink-0 text-[10px] mt-0.5 font-bold"
                  style={{ color: config.color }}
                >
                  {config.icon}
                </span>
                <TypewriterText
                  text={formatStep(step)}
                  speed={20}
                  color={
                    step.type === "error" || step.type === "rollback"
                      ? "var(--loss)"
                      : step.type === "complete"
                        ? "var(--speed-gold)"
                        : step.type === "filled"
                          ? "var(--success)"
                          : "var(--text-secondary)"
                  }
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
        {visibleSteps < steps.length && (
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="inline-block w-1.5 h-3 bg-[var(--text-primary)] rounded-sm ml-4"
          />
        )}
      </div>
    </motion.div>
  );
}

function TypewriterText({
  text,
  speed,
  color,
}: {
  text: string;
  speed: number;
  color: string;
}) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    setDisplayed("");
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span style={{ color }} className="leading-relaxed">
      {displayed}
      {displayed.length < text.length && (
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-1 h-2.5 ml-0.5 rounded-sm"
          style={{ backgroundColor: color }}
        />
      )}
    </span>
  );
}
