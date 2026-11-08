/**
 * Motion tokens for JS (Motion / GSAP). Keep in sync with the CSS custom
 * properties in app/globals.css — one vocabulary across the whole site.
 */

export const ease = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
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

/*
 * Everyday UI is tweened, never sprung: ease-out for things arriving,
 * ease-in-out for things moving on screen, and exits about 20% shorter
 * than entrances so the new state takes over quickly.
 */
export const tween = {
  /** Something arriving: popovers, rows, labels. */
  enter: { duration: 0.24, ease: ease.out },
  /** Something leaving. */
  exit: { duration: 0.19, ease: ease.out },
  /** Something already on screen moving to a new place: pills, the header. */
  move: { duration: 0.24, ease: ease.inOut },
} as const;

/** Rows in a list come in one after another. */
export const rowStagger = 0.03;

export const spring = {
  /** Hand-driven motion only: cursor-following, magnetic pulls. */
  follow: { type: "spring", stiffness: 180, damping: 18, mass: 0.4 },
} as const;

export const stagger = {
  chars: 0.018,
  words: 0.045,
  lines: 0.09,
} as const;
