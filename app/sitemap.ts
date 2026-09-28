import type { MetadataRoute } from "next";
import { getAllEntries } from "@/lib/content";
import { href } from "@/lib/paths";

const base = "https://www.designbydyl.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/work`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/about`, changeFrequency: "yearly", priority: 0.6 },
    ...getAllEntries().map((entry) => ({ url: `${base}${href(entry)}`, changeFrequency: "yearly" as const, priority: 0.7 })),
  ];
}
