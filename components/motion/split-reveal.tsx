"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { gsapEase, stagger } from "@/lib/motion";

gsap.registerPlugin(SplitText, ScrollTrigger, useGSAP);

type Props = {
  as?: "h1" | "h2" | "h3" | "p";
  by?: "lines" | "words" | "chars";
  /** Play on mount instead of on scroll into view. */
  immediate?: boolean;
  delay?: number;
  className?: string;
  children: React.ReactNode;
};

/**
 * Masked line/word/char reveal for key headings only — not a blanket
 * fade-up. Text is visible without JS and for reduced motion.
 */
export function SplitReveal({
  as: Tag = "h2",
  by = "lines",
  immediate = false,
  delay = 0,
  className,
  children,
}: Props) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(el, {
          type: by === "lines" ? "lines" : `lines,${by}`,
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          onSplit(self) {
            return gsap.from(self[by], {
              yPercent: 110,
              rotate: by === "chars" ? 4 : 0,
              duration: 1.1,
              ease: gsapEase.out,
              stagger: stagger[by],
              delay,
              scrollTrigger: immediate
                ? undefined
                : { trigger: el, start: "top 85%", once: true },
            });
          },
        });
        return () => split.revert();
      });

      return () => mm.revert();
    },
    { scope: ref, dependencies: [by, immediate, delay] },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
