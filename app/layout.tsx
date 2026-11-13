import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { site } from "@/lib/site";
import { SiteShell } from "@/components/site-shell";
import { readingModeScript } from "@/lib/reading-mode";
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
    // suppressHydrationWarning: the reading-mode script sets data-reading before hydration.
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <body className="min-h-dvh">
        <script dangerouslySetInnerHTML={{ __html: readingModeScript }} />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
