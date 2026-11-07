"use client";

import { useEffect } from "react";

/*
 * Blocks rise 24px and fade in as they come into view, neighbours one after
 * another. Targets are story blocks and anything marked [data-reveal]. The
 * hidden start state is only applied here, so content is visible without JS
 * and for reduced motion. IntersectionObserver (not scroll maths) means blocks
 * that appear later, like the quick read, still reveal when shown.
 */
const TARGETS = "[data-prose] > :not([data-tldr]), [data-tldr] > *, [data-reveal]";
const STAGGER_MS = 90;

export function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const targets = [...document.querySelectorAll<HTMLElement>(TARGETS)];
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entering = entries.filter((e) => e.isIntersecting);
        entering
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
          .forEach((entry, i) => {
            const el = entry.target as HTMLElement;
            el.style.transitionDelay = `${i * STAGGER_MS}ms`;
            el.dataset.revealState = "in";
            observer.unobserve(el);
          });
      },
      { rootMargin: "0px 0px -8% 0px" },
    );

    targets.forEach((el) => {
      el.dataset.revealState = "pending";
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
      targets.forEach((el) => {
        delete el.dataset.revealState;
        el.style.transitionDelay = "";
      });
    };
  }, []);

  return null;
}
