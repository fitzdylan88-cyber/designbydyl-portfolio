"use client";

import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { spring } from "@/lib/motion";

/**
 * Pulls its child toward the pointer while hovered. Use on a handful of
 * primary actions, never on body links.
 */
export function Magnetic({
  strength = 0.35,
  children,
}: {
  strength?: number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();
  const x = useSpring(useMotionValue(0), spring.follow);
  const y = useSpring(useMotionValue(0), spring.follow);

  function onPointerMove(event: React.PointerEvent) {
    if (reduceMotion || event.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.span
      ref={ref}
      style={{ x, y, display: "inline-block" }}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.span>
  );
}
