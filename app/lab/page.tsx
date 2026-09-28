import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllEntries } from "@/lib/content";
import { pairings } from "./fonts";
import { Lab } from "./lab";

export const metadata: Metadata = { title: "Lab", robots: { index: false } };

/** Dev-only playground for art-directing tokens, type and motion. */
export default function LabPage() {
  if (process.env.NODE_ENV === "production") notFound();

  const entries = getAllEntries().map(({ collection, slug, title, draft }) => ({
    href: `/${collection}/${slug}`,
    title,
    draft,
  }));

  return <Lab pairings={[...pairings]} entries={entries} />;
}
