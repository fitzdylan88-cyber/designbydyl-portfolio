import { IBM_Plex_Mono, Schibsted_Grotesk } from "next/font/google";

/*
 * "Swiss" pairing, chosen in /lab. One grotesk does display and text (the
 * display face is aliased in globals.css), with a mono for labels and data.
 */
export const text = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-text-face",
});

export const mono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono-face",
});

export const fontVariables = [text.variable, mono.variable].join(" ");
