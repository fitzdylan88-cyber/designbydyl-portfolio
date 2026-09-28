import {
  Bricolage_Grotesque,
  Geist_Mono,
  Hanken_Grotesk,
  Instrument_Serif,
  Inter_Tight,
  JetBrains_Mono,
} from "next/font/google";

/*
 * Pairings for the type pass. Swiss is the site default (lib/fonts.ts), so it
 * needs no classes. The others redeclare the same CSS variables, so applying
 * their classes on a wrapper swaps the whole scale in place.
 */
const editorialFace = Instrument_Serif({ weight: "400", subsets: ["latin"], variable: "--font-display-face" });
const editorialText = Inter_Tight({ subsets: ["latin"], variable: "--font-text-face" });
const editorialMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono-face" });

const expressiveFace = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display-face" });
const expressiveText = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-text-face" });
const expressiveMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono-face" });

export const pairings = [
  {
    id: "swiss",
    name: "Swiss",
    note: "Schibsted Grotesk / IBM Plex Mono · current",
    className: "",
  },
  {
    id: "editorial",
    name: "Editorial",
    note: "Instrument Serif / Inter Tight / JetBrains Mono",
    className: [editorialFace.variable, editorialText.variable, editorialMono.variable, "[--display-weight:400] [--display-tracking:-0.01em]"].join(" "),
  },
  {
    id: "expressive",
    name: "Expressive",
    note: "Bricolage Grotesque / Hanken Grotesk / Geist Mono",
    className: [expressiveFace.variable, expressiveText.variable, expressiveMono.variable, "[--display-weight:600] [--display-tracking:-0.03em]"].join(" "),
  },
] as const;
