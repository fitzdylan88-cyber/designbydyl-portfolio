import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllEntries, showDrafts } from "@/lib/content";
import { pairings } from "./fonts";
import { Lab } from "./lab";

export const metadata: Metadata = { title: "Lab", robots: { index: false } };

/** Dev and preview-only playground for art-directing tokens, type and motion. */
export default async function LabPage() {
  if (!showDrafts) notFound();

  const entries = (await getAllEntries()).map(({ collection, slug, title, draft }) => ({
    href: `/${collection}/${slug}`,
    title,
    draft,
  }));

  return <Lab pairings={[...pairings]} entries={entries} />;
}
