"use client";

import { useEffect, useRef } from "react";
import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

function ScrollTriggerSync() {
  useLenis(ScrollTrigger.update);
  return null;
}

/**
 * Lenis smooth scroll, driven by GSAP's ticker so ScrollTrigger and Lenis
 * share one frame loop. Falls back to native scroll for reduced motion.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    // Read the instance every frame: Lenis creates it after this effect runs.
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(update);
  }, [reduceMotion]);

  if (reduceMotion) return <>{children}</>;

  return (
    <ReactLenis root ref={lenisRef} options={{ autoRaf: false, lerp: 0.1 }}>
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}
