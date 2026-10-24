/*
 * Shared between server components that render images and the client
 * <Lightbox> (components/lightbox.tsx). A trigger is any element carrying
 * `data-lightbox`; the lightbox finds it by event delegation, so image
 * components stay server-rendered.
 */

export type LightboxItem = { src: string; alt: string; caption?: string };

/** Props that make an element open the lightbox at these images. */
export function lightboxTrigger(items: LightboxItem[]) {
  return {
    "data-lightbox": JSON.stringify(items),
    "data-cursor": "Expand",
    "aria-haspopup": "dialog" as const,
  };
}
