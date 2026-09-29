"use client";

import { MotionConfig } from "motion/react";

/** Motion animations follow the OS reduced-motion setting site-wide. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
