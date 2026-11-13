"use client";

import { usePathname } from "next/navigation";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { Cursor } from "@/components/motion/cursor";
import { Lightbox } from "@/components/lightbox";
import { MotionProvider } from "@/components/motion/motion-provider";

/**
 * The site's smooth scroll, custom cursor and lightbox. The Sanity Studio at
 * /studio gets none of them: it scrolls its own panes and needs the native cursor.
 */
export function SiteShell({ children }: { children: React.ReactNode }) {
  if (usePathname().startsWith("/studio")) return <>{children}</>;

  return (
    <MotionProvider>
      <SmoothScroll>
        {children}
        <Lightbox />
      </SmoothScroll>
      <Cursor />
    </MotionProvider>
  );
}
