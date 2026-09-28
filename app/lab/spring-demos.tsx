"use client";

import { useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { spring } from "@/lib/motion";

function Pad({
  name,
  hint,
  config,
  children,
}: {
  name: keyof typeof spring;
  hint: string;
  config: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="relative h-56 overflow-hidden rounded-sm bg-paper-2">{children}</div>
      <div className="mt-3 flex items-baseline justify-between gap-4">
        <span className="eyebrow text-ink">{name}</span>
        <span className="eyebrow normal-case tracking-normal">{hint}</span>
      </div>
      <p className="mt-1 font-mono text-micro text-ink-3">{config}</p>
    </div>
  );
}

const describe = (s: { stiffness: number; damping: number; mass: number }) =>
  `stiffness ${s.stiffness} · damping ${s.damping} · mass ${s.mass}`;

/** snappy: UI feedback. A toggle you can click as fast as you like. */
function Snappy() {
  const [on, setOn] = useState(false);
  return (
    <Pad name="snappy" hint="Click the toggle" config={describe(spring.snappy)}>
      <div className="flex h-full items-center justify-center">
        <motion.button
          role="switch"
          aria-checked={on}
          aria-label="Demo toggle"
          onClick={() => setOn((v) => !v)}
          whileTap={{ scale: 0.94 }}
          transition={spring.snappy}
          className={`flex h-12 w-22 items-center rounded-full p-1.5 transition-colors duration-[var(--dur-2)] ${
            on ? "justify-end bg-accent" : "justify-start bg-ink-3/40"
          }`}
        >
          <motion.span layout transition={spring.snappy} className="size-9 rounded-full bg-white shadow-sm" />
        </motion.button>
      </div>
    </Pad>
  );
}

/** settle: layout changes. Cards reflow into a new order. */
function Settle() {
  const [order, setOrder] = useState([0, 1, 2, 3, 4, 5]);
  function shuffle() {
    setOrder((prev) => {
      const next = [...prev];
      for (let i = next.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [next[i], next[j]] = [next[j], next[i]];
      }
      return next;
    });
  }
  return (
    <Pad name="settle" hint="Click to reshuffle" config={describe(spring.settle)}>
      <button
        onClick={shuffle}
        aria-label="Shuffle cards"
        className="grid h-full w-full grid-cols-3 gap-2 p-6"
      >
        {order.map((id) => (
          <motion.span
            key={id}
            layout
            transition={spring.settle}
            className={`flex items-center justify-center rounded-sm font-mono text-micro ${
              id === 0 ? "bg-accent text-accent-ink" : "bg-ink text-paper"
            }`}
          >
            0{id + 1}
          </motion.span>
        ))}
      </button>
    </Pad>
  );
}

/** follow: things that track the pointer. */
function Follow() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, spring.follow);
  const sy = useSpring(y, spring.follow);

  return (
    <Pad name="follow" hint="Move your cursor over it" config={describe(spring.follow)}>
      <div
        className="h-full w-full cursor-none"
        onPointerMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          x.set(e.clientX - rect.left - rect.width / 2);
          y.set(e.clientY - rect.top - rect.height / 2);
        }}
        onPointerLeave={() => {
          x.set(0);
          y.set(0);
        }}
      >
        <motion.span
          style={{ x: sx, y: sy }}
          className="pointer-events-none absolute top-1/2 left-1/2 -mt-5 -ml-5 size-10 rounded-full bg-accent mix-blend-multiply dark:mix-blend-screen"
        />
        <motion.span
          style={{ x, y }}
          className="pointer-events-none absolute top-1/2 left-1/2 -mt-1 -ml-1 size-2 rounded-full bg-ink"
        />
      </div>
    </Pad>
  );
}

export function SpringDemos() {
  return (
    <div className="grid gap-[var(--gutter)] md:grid-cols-3">
      <Snappy />
      <Settle />
      <Follow />
    </div>
  );
}
