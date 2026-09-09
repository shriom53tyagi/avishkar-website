"use client";

import { motion } from "framer-motion";

interface Props {
  className?: string;
}

/**
 * Quiet editorial texture for the hero — soft overlapping forms in the brand
 * palette, not a product diagram. Fades in once; no looping motion.
 */
export function AbstractMark({ className }: Props) {
  return (
    <motion.svg
      viewBox="0 0 640 640"
      fill="none"
      aria-hidden
      className={className}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <circle cx="320" cy="320" r="260" stroke="#0E7490" strokeOpacity="0.14" strokeWidth="1" />
      <circle cx="320" cy="320" r="196" stroke="#0E7490" strokeOpacity="0.16" strokeWidth="1" />
      <circle cx="380" cy="260" r="130" fill="#0E7490" fillOpacity="0.07" />
      <circle cx="250" cy="380" r="150" fill="#059669" fillOpacity="0.06" />
      <path
        d="M120 420 C 220 340, 420 340, 520 220"
        stroke="#0E7490"
        strokeOpacity="0.22"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M150 200 C 260 260, 380 260, 500 380"
        stroke="#059669"
        strokeOpacity="0.18"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </motion.svg>
  );
}
