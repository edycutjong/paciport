"use client";

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export function FadeIn({ children, delay = 0, className, direction = 'up' }: FadeInProps) {
  const directionOffset = 24;
  let y = 0;
  let x = 0;

  switch (direction) {
    case 'up': y = directionOffset; break;
    case 'down': y = -directionOffset; break;
    case 'left': x = directionOffset; break; // from left means starts offset right? Actually let's assume standard 'slide-in' directions relative to hidden state
    case 'right': x = -directionOffset; break;
    case 'none': break;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y, x, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.25, 1, 0.4, 1], // Smooth custom cubic bezier
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
