"use client";

import { useEffect, useRef } from "react";

/**
 * Cursor-reactive dot grid for the hero: a Swiss construction grid that
 * swells, repels and turns accent around the pointer, with a slow idle
 * swell when the pointer is away. 2D canvas, paused off-screen, static for
 * reduced motion. (Phase 4 may swap this for a WebGL shader.)
 */
export function DotField({ spacing = 26, radius = 180 }: { spacing?: number; radius?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const dark = window.matchMedia("(prefers-color-scheme: dark)");
    let colours = { ink: "#000", accent: "#f60" };
    const readColours = () => {
      const style = getComputedStyle(document.documentElement);
      colours = { ink: style.getPropertyValue("--ink").trim(), accent: style.getPropertyValue("--accent").trim() };
    };
    readColours();

    let width = 0;
    let height = 0;
    let dpr = 1;
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999, energy: 0, targetEnergy: 0 };
    let frame = 0;
    let running = false;
    let t = 0;

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!running) draw();
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);
      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;
      const offsetX = (width - (cols - 1) * spacing) / 2;
      const offsetY = (height - (rows - 1) * spacing) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let x = offsetX + c * spacing;
          let y = offsetY + r * spacing;

          // Idle: a slow diagonal swell so the field is never dead.
          const idle = (Math.sin(t * 0.0009 + (c + r) * 0.35) + 1) / 2;

          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const dist = Math.hypot(dx, dy);
          const influence = Math.max(0, 1 - dist / radius) ** 2 * pointer.energy;

          if (influence > 0) {
            const push = influence * 14;
            x += (dx / (dist || 1)) * push;
            y += (dy / (dist || 1)) * push;
          }

          const size = 1 + idle * 0.5 + influence * 3.2;
          ctx!.globalAlpha = 0.16 + idle * 0.08 + influence * 0.3;
          ctx!.fillStyle = colours.ink;
          ctx!.beginPath();
          ctx!.arc(x, y, size, 0, Math.PI * 2);
          ctx!.fill();

          if (influence > 0.05) {
            ctx!.globalAlpha = Math.min(1, influence * 1.4);
            ctx!.fillStyle = colours.accent;
            ctx!.beginPath();
            ctx!.arc(x, y, size, 0, Math.PI * 2);
            ctx!.fill();
          }
        }
      }
      ctx!.globalAlpha = 1;
    }

    function loop(time: number) {
      t = time;
      // Ease the pointer and its energy so the field lags behind the cursor.
      pointer.x += (pointer.tx - pointer.x) * 0.14;
      pointer.y += (pointer.ty - pointer.y) * 0.14;
      pointer.energy += (pointer.targetEnergy - pointer.energy) * 0.08;
      draw();
      frame = requestAnimationFrame(loop);
    }

    function start() {
      if (running || reduceMotion.matches) return;
      running = true;
      frame = requestAnimationFrame(loop);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(frame);
    }

    function onMove(event: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      if (inside && pointer.energy < 0.02) {
        pointer.x = x;
        pointer.y = y;
      }
      pointer.tx = x;
      pointer.ty = y;
      pointer.targetEnergy = inside ? 1 : 0;
    }

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    const visibility = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    visibility.observe(canvas);
    const onScheme = () => {
      readColours();
      if (!running) draw();
    };
    const onMotion = () => (reduceMotion.matches ? (stop(), draw()) : start());

    window.addEventListener("pointermove", onMove, { passive: true });
    dark.addEventListener("change", onScheme);
    reduceMotion.addEventListener("change", onMotion);

    return () => {
      stop();
      observer.disconnect();
      visibility.disconnect();
      window.removeEventListener("pointermove", onMove);
      dark.removeEventListener("change", onScheme);
      reduceMotion.removeEventListener("change", onMotion);
    };
  }, [spacing, radius]);

  return <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />;
}
