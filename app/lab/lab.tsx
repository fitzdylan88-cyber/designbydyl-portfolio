"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { SplitReveal } from "@/components/motion/split-reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { SpringDemos } from "./spring-demos";
import { duration, ease, spring } from "@/lib/motion";

type Pairing = { id: string; name: string; note: string; className: string };
type EntryLink = { href: string; title: string; draft: boolean };

const scale = [
  { token: "mega", className: "type-display text-mega leading-[0.9]", sample: "Dylan" },
  { token: "h1", className: "type-display text-h1 leading-[0.95]", sample: "Design that ships" },
  { token: "h2", className: "type-display text-h2 leading-[1.05]", sample: "Triage that sorts itself" },
  { token: "h3", className: "text-h3 font-medium tracking-tight", sample: "Key decisions and tradeoffs" },
  { token: "lede", className: "text-lede leading-snug text-ink-2", sample: "Product designer building with AI, from rubric-driven agents to shipped side projects." },
  { token: "body", className: "text-body text-ink-2", sample: "Support agents spent the first minutes of every ticket working out what it was actually about. The rules lived in people's heads." },
  { token: "small", className: "text-small text-ink-2", sample: "Lead product designer · 6 weeks · Me, 2 engineers, 1 PM" },
  { token: "micro", className: "label", sample: "Case study · anonymised" },
];

const colours = ["paper", "paper-2", "ink", "ink-2", "ink-3", "rule", "accent"];

const easings = [
  { name: "out", css: "var(--ease-out)", value: ease.out },
  { name: "inOut", css: "var(--ease-in-out)", value: ease.inOut },
  { name: "snap", css: "var(--ease-snap)", value: ease.snap },
  { name: "linear", css: "linear", value: [0, 0, 1, 1] as const },
];

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="container-grid border-t border-rule py-16">
      <h2 className="label col-span-12 mb-10 lg:col-span-2 lg:mb-0">{label}</h2>
      <div className="col-span-12 lg:col-span-10">{children}</div>
    </section>
  );
}

export function Lab({ pairings, entries }: { pairings: Pairing[]; entries: EntryLink[] }) {
  const [pairingId, setPairingId] = useState(pairings[0].id);
  const [run, setRun] = useState(0);
  const pairing = pairings.find((p) => p.id === pairingId) ?? pairings[0];

  return (
    <div className={`${pairing.className} font-sans`}>
      <header className="container-grid sticky top-0 z-10 items-center gap-y-4 border-b border-rule bg-paper/85 py-4 backdrop-blur-md">
        <p className="label col-span-12 md:col-span-4">designbydyl / lab</p>
        <div
          role="radiogroup"
          aria-label="Type pairing"
          className="col-span-12 flex w-fit gap-1 rounded-full border border-rule p-1 md:col-span-8 md:justify-self-end"
        >
          {pairings.map((p) => (
            <button
              key={p.id}
              role="radio"
              aria-checked={p.id === pairingId}
              onClick={() => setPairingId(p.id)}
              className="relative rounded-full px-4 py-1.5 text-small text-ink-2 transition-colors duration-[var(--dur-2)] aria-checked:text-accent-ink"
            >
              {p.id === pairingId && (
                <motion.span
                  layoutId="pairing-pill"
                  transition={spring.snappy}
                  className="absolute inset-0 rounded-full bg-ink"
                />
              )}
              <span className="relative">{p.name}</span>
            </button>
          ))}
        </div>
      </header>

      <div className="container-grid pt-24 pb-20">
        <SplitReveal
          key={`${pairingId}-${run}`}
          as="h1"
          by="chars"
          immediate
          className="col-span-12 type-display text-mega leading-[0.9]"
        >
          Craft, not vibes.
        </SplitReveal>
        <p className="col-span-12 mt-6 max-w-[48ch] text-lede leading-snug text-ink-2 md:col-span-7">
          The working surface for the portfolio&rsquo;s type, colour and motion. Pick what feels right, and
          everything else inherits it. <span className="text-ink-3">({pairing.note})</span>
        </p>
      </div>

      <Section label="Type scale">
        <div className="space-y-10">
          {scale.map((row) => (
            <div key={row.token} className="grid gap-2 md:grid-cols-[6rem_1fr] md:items-baseline">
              <span className="label">{row.token}</span>
              <p className={`${row.className} text-balance`}>{row.sample}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section label="Colour">
        <div className="grid grid-cols-2 gap-[var(--gutter)] sm:grid-cols-4 lg:grid-cols-7">
          {colours.map((name) => (
            <div key={name}>
              <div
                className="aspect-[4/5] rounded-sm border border-rule"
                style={{ background: `var(--${name})` }}
              />
              <p className="label mt-2">--{name}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section label="Motion">
        <div className="space-y-16">
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-h3 font-medium tracking-tight">Easing</h3>
              <button
                onClick={() => setRun((r) => r + 1)}
                className="rounded-full border border-rule px-4 py-1.5 text-small transition-colors duration-[var(--dur-2)] hover:border-ink"
              >
                Replay
              </button>
            </div>
            <div className="space-y-3">
              {easings.map((e) => (
                <div key={e.name} className="grid grid-cols-[5rem_1fr] items-center gap-4">
                  <span className="label">{e.name}</span>
                  <div className="relative h-10 rounded-sm bg-paper-2">
                    <motion.div
                      key={run}
                      initial={{ left: "0%" }}
                      animate={{ left: "calc(100% - 2.5rem)" }}
                      transition={{ duration: duration.slow * 1.4, ease: [...e.value] }}
                      className="absolute top-0 size-10 rounded-sm bg-accent"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h3 className="mb-6 text-h3 font-medium tracking-tight">Magnetic</h3>
              <div className="flex h-48 items-center justify-center rounded-sm bg-paper-2">
                <Magnetic>
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-small text-paper"
                  >
                    Get in touch <span aria-hidden>→</span>
                  </a>
                </Magnetic>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-h3 font-medium tracking-tight">Springs</h3>
            <p className="mb-6 max-w-[56ch] text-small text-ink-2">
              Three springs, each with one job. Try them out. How they feel matters more than how they look
              standing still.
            </p>
            <SpringDemos />
          </div>
        </div>
      </Section>

      <Section label="Content">
        {entries.length === 0 ? (
          <p className="text-ink-3">No entries yet.</p>
        ) : (
          <ul className="divide-y divide-rule border-y border-rule">
            {entries.map((entry) => (
              <li key={entry.href}>
                <Link
                  href={entry.href}
                  className="group flex items-baseline justify-between gap-6 py-5"
                >
                  <span className="type-display text-h3 transition-transform duration-[var(--dur-3)] ease-[var(--ease-out)] group-hover:translate-x-2">
                    {entry.title}
                  </span>
                  <span className="label">{entry.draft ? "draft" : entry.href}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}
