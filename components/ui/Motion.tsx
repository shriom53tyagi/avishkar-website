"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The site's motion vocabulary. Every animated section composes these three
 * pieces so timing and easing stay identical page-wide:
 *
 *   <Stagger>            group that reveals its children in sequence
 *     <StaggerItem />    one step of that sequence
 *   <FadeUp />           a standalone element with no siblings to coordinate
 *
 * All three collapse to static output under `prefers-reduced-motion`, and the
 * `reveal` class keeps content visible if JS never runs (see globals.css).
 */

/** Slight overshoot-free ease. Matches the existing Reveal curve. */
export const EASE = [0.2, 0.9, 0.25, 1] as const;

const DISTANCE = 14;

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: DISTANCE },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE },
  },
};

/*
 * Reduced motion is handled by CSS (`.reveal` in globals.css forces the end
 * state), never by branching the returned tree. `useReducedMotion` resolves
 * to null during SSR, so a branch here would render different markup on the
 * server than on the client and fail hydration.
 */

/** Wraps a group whose children should reveal one after another. */
export function Stagger({
  children,
  className,
  amount = 0.2,
}: {
  children: ReactNode;
  className?: string;
  /** Portion of the element that must be visible before it triggers. */
  amount?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}

/** One step inside a <Stagger>. Inherits the parent's timing. */
export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={cn("reveal", className)} variants={itemVariants}>
      {children}
    </motion.div>
  );
}

/** A single element revealing on its own, outside any stagger group. */
export function FadeUp({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={cn("reveal", className)}
      initial={{ opacity: 0, y: DISTANCE }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
