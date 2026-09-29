"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { nav, site } from "@/lib/site";
import { spring } from "@/lib/motion";
import { Clock } from "./clock";

export function Header() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Hide on the way down, return on the way up.
  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(current > 24);
    setHidden(!reduceMotion && current > 240 && current > previous + 2);
    if (current < previous - 2) setHidden(false);
  });

  const active = nav.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))?.href
    ?? (/^\/(projects|play)(\/|$)/.test(pathname) ? "/work" : undefined);

  return (
    <motion.header
      style={{ viewTransitionName: "site-header" }}
      animate={{ y: hidden ? "-110%" : "0%" }}
      transition={spring.settle}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={`container-grid items-center py-4 transition-[background-color,box-shadow] duration-[var(--dur-3)] ${
          scrolled ? "bg-paper/80 shadow-[0_1px_0_var(--rule)] backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <Link
          href="/"
          transitionTypes={["nav-back"]}
          className="col-span-6 flex items-baseline gap-2 text-small font-medium md:col-span-4"
        >
          {site.name}
          <span className="hidden text-ink-3 sm:inline">/ {site.role}</span>
        </Link>

        <p className="meta hidden md:col-span-4 md:block">
          <Clock timeZone={site.timeZone} label="Dublin" />
        </p>

        <nav aria-label="Main" className="col-span-6 justify-self-end md:col-span-4">
          <ul className="flex gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active === item.href ? "page" : undefined}
                  className="relative block rounded-full px-3.5 py-1.5 text-small pointer-coarse:py-3 text-ink-2 transition-colors duration-[var(--dur-2)] hover:text-ink aria-[current=page]:text-paper"
                >
                  {active === item.href && (
                    <motion.span
                      layoutId="nav-pill"
                      transition={spring.snappy}
                      className="absolute inset-0 rounded-full bg-ink"
                    />
                  )}
                  <span className="relative">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </motion.header>
  );
}
