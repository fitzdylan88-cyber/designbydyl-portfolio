/**
 * Motion tokens for JS (Motion / GSAP). Keep in sync with the CSS custom
 * properties in app/globals.css — one vocabulary across the whole site.
 */

export const ease = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
  snap: [0.3, 1.4, 0.5, 1],
} as const;

export const gsapEase = {
  out: "expo.out",
  inOut: "power3.inOut",
} as const;

export const duration = {
  instant: 0.12,
  quick: 0.24,
  base: 0.48,
  slow: 0.9,
} as const;

export const spring = {
  /** UI feedback: buttons, toggles. */
  snappy: { type: "spring", stiffness: 520, damping: 34, mass: 0.6 },
  /** Layout shifts, cards moving into place. */
  settle: { type: "spring", stiffness: 220, damping: 28, mass: 1 },
  /** Cursor-following, magnetic pulls. */
  follow: { type: "spring", stiffness: 180, damping: 18, mass: 0.4 },
} as const;

export const stagger = {
  chars: 0.018,
  words: 0.045,
  lines: 0.09,
} as const;
