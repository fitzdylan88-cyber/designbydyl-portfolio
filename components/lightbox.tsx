"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { Arrow, Close } from "@/components/icons";
import type { LightboxItem } from "@/lib/lightbox";

/*
 * Full-screen image viewer. Any `data-lightbox` trigger on the page opens it
 * (see lib/lightbox.ts); arrows step through every visible image on the page,
 * so hidden quick-read figures are skipped. Clicking the image toggles between
 * fit and full resolution, keeping the clicked point under the pointer; when
 * zoomed, drag or scroll to pan. Touch devices also get native pinch-zoom.
 */

type Point = { x: number; y: number };

function visibleItems(trigger: Element) {
  const items: LightboxItem[] = [];
  let start = 0;
  document.querySelectorAll<HTMLElement>("[data-lightbox]").forEach((el) => {
    if (el.getClientRects().length === 0 && el !== trigger) return;
    if (el === trigger) start = items.length;
    try {
      items.push(...(JSON.parse(el.dataset.lightbox ?? "[]") as LightboxItem[]));
    } catch {}
  });
  return { items, start };
}

export function Lightbox() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const anchorRef = useRef<{ client: Point; ratio: Point } | null>(null);
  const dragRef = useRef<{ start: Point; scroll: Point; moved: boolean } | null>(null);

  const [items, setItems] = useState<LightboxItem[]>([]);
  const [index, setIndex] = useState(0);
  const [zoomWidth, setZoomWidth] = useState<number | null>(null);
  const lenis = useLenis();

  const item = items[index];
  const zoomed = zoomWidth !== null;
  // Zoomed images run under the controls; keep them legible.
  const bar = zoomed ? "bg-paper/85 backdrop-blur-sm" : "";

  const go = useCallback(
    (step: number) => {
      if (items.length < 2) return;
      setZoomWidth(null);
      setIndex((i) => (i + step + items.length) % items.length);
    },
    [items.length],
  );

  // Open from any trigger on the page.
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const trigger = event.target.closest<HTMLElement>("[data-lightbox]");
      if (!trigger) return;
      event.preventDefault();
      const { items, start } = visibleItems(trigger);
      if (items.length === 0) return;
      triggerRef.current = trigger;
      setItems(items);
      setIndex(start);
      setZoomWidth(null);
      dialogRef.current?.showModal();
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Freeze the page behind the dialog.
  const open = items.length > 0;
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    return () => lenis?.start();
  }, [open, lenis]);

  // After zooming in, scroll so the clicked point stays under the pointer.
  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    const scroller = scrollerRef.current;
    const image = imageRef.current;
    anchorRef.current = null;
    if (!anchor || !scroller || !image || !zoomed) return;
    const rect = image.getBoundingClientRect();
    scroller.scrollLeft += rect.left + anchor.ratio.x * rect.width - anchor.client.x;
    scroller.scrollTop += rect.top + anchor.ratio.y * rect.height - anchor.client.y;
  }, [zoomed]);

  function toggleZoom(client: Point) {
    const image = imageRef.current;
    if (!image) return;
    if (zoomed) {
      setZoomWidth(null);
      return;
    }
    const rect = image.getBoundingClientRect();
    anchorRef.current = {
      client,
      ratio: { x: (client.x - rect.left) / rect.width, y: (client.y - rect.top) / rect.height },
    };
    // Full resolution, but always at least twice the fitted size.
    setZoomWidth(Math.max(image.naturalWidth, rect.width * 2));
  }

  function onImageClick(event: React.MouseEvent) {
    event.stopPropagation();
    if (dragRef.current?.moved) return;
    // Keyboard activation reports 0,0: zoom around the centre instead.
    const rect = event.currentTarget.getBoundingClientRect();
    const client =
      event.detail === 0
        ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
        : { x: event.clientX, y: event.clientY };
    toggleZoom(client);
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    const scroller = scrollerRef.current;
    dragRef.current = null;
    if (!zoomed || !scroller || event.pointerType !== "mouse" || event.button !== 0) return;
    dragRef.current = {
      start: { x: event.clientX, y: event.clientY },
      scroll: { x: scroller.scrollLeft, y: scroller.scrollTop },
      moved: false,
    };
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    const scroller = scrollerRef.current;
    if (!drag || !scroller || !(event.buttons & 1)) return;
    const dx = event.clientX - drag.start.x;
    const dy = event.clientY - drag.start.y;
    if (!drag.moved && Math.hypot(dx, dy) < 4) return;
    if (!drag.moved) event.currentTarget.setPointerCapture(event.pointerId);
    drag.moved = true;
    scroller.scrollLeft = drag.scroll.x - dx;
    scroller.scrollTop = drag.scroll.y - dy;
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowRight") go(1);
    else if (event.key === "ArrowLeft") go(-1);
    else return;
    event.preventDefault();
  }

  function onClose() {
    setItems([]);
    setZoomWidth(null);
    triggerRef.current?.focus({ preventScroll: true });
    triggerRef.current = null;
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label={item ? `Image: ${item.alt}` : "Image viewer"}
      onClose={onClose}
      onKeyDown={onKeyDown}
      data-lenis-prevent
      className="lightbox fixed inset-0 m-0 h-dvh max-h-none w-dvw max-w-none bg-paper p-0 text-ink"
    >
      {item && (
        <>
          <div
            ref={scrollerRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onClick={() => !zoomed && dialogRef.current?.close()}
            data-zoomed={zoomed || undefined}
            className={`absolute inset-0 ${zoomed ? "overflow-auto overscroll-contain" : "overflow-hidden"}`}
          >
            <div
              className={
                zoomed
                  ? "flex min-h-full w-max min-w-full items-center justify-center"
                  : "flex h-full w-full items-center justify-center px-[var(--margin)] pt-16 pb-24"
              }
            >
              <button
                type="button"
                onClick={onImageClick}
                aria-label={zoomed ? "Zoom out" : "Zoom in"}
                className="lightbox-image block max-h-full max-w-full rounded-sm"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- full-resolution original for zooming */}
                <img
                  ref={imageRef}
                  key={item.src}
                  src={item.src}
                  alt={item.alt}
                  draggable={false}
                  style={zoomed ? { width: zoomWidth } : undefined}
                  className={
                    zoomed
                      ? "block h-auto max-w-none select-none"
                      : "block max-h-[calc(100dvh-10rem)] w-auto max-w-full rounded-sm bg-paper-2 object-contain select-none"
                  }
                />
              </button>
            </div>
          </div>

          <div
            className={`pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-[var(--margin)] py-4 ${bar}`}
          >
            <p className="meta" aria-live="polite">
              {items.length > 1 && `${index + 1} / ${items.length}`}
            </p>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="lightbox-control pointer-events-auto"
              aria-label="Close"
            >
              <Close />
            </button>
          </div>

          <div
            className={`pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 px-[var(--margin)] py-4 ${bar}`}
          >
            <p className="label max-w-[60ch] text-ink-2">
              {item.caption ?? (zoomed ? "Drag to look around" : "Click the image to zoom")}
            </p>
            {items.length > 1 && (
              <div className="pointer-events-auto flex shrink-0 gap-2">
                <button type="button" onClick={() => go(-1)} className="lightbox-control" aria-label="Previous image">
                  <Arrow direction="left" />
                </button>
                <button type="button" onClick={() => go(1)} className="lightbox-control" aria-label="Next image">
                  <Arrow />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </dialog>
  );
}
