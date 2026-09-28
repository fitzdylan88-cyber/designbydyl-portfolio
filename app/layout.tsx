import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { site } from "@/lib/site";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { Cursor } from "@/components/motion/cursor";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.designbydyl.com"),
  title: {
    default: `${site.name} · ${site.role}`,
    template: `%s · ${site.name}`,
  },
  description: site.intro,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="min-h-dvh">
        <SmoothScroll>{children}</SmoothScroll>
        <Cursor />
      </body>
    </html>
  );
}
