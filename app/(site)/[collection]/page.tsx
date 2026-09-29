import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { collections, getAllEntries, type Collection } from "@/lib/content";
import { SplitReveal } from "@/components/motion/split-reveal";
import { WorkIndex } from "@/components/work-index";

export const dynamicParams = false;

export function generateStaticParams() {
  return collections.map((collection) => ({ collection }));
}

export const metadata: Metadata = {
  title: "Work",
  description: "Case studies, shipped side projects and experiments.",
};

export default async function IndexPage({ params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  if (!collections.includes(collection as Collection)) notFound();

  const entries = getAllEntries()
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(({ slug, collection, title, summary, date, role, tools, cover, accent, draft }) => ({
      slug, collection, title, summary, date, role, tools, cover, accent, draft,
    }));

  return (
    <div className="container-grid pt-[20vh]">
      <div className="col-span-12 mb-16 flex items-start gap-3">
        <SplitReveal as="h1" by="chars" immediate className="type-display text-mega leading-[0.85]">
          Work
        </SplitReveal>
        <span className="meta mt-2" aria-label={`${entries.length} pieces`}>
          {entries.length}
        </span>
      </div>
      <WorkIndex entries={entries} initial={collection === "work" ? "all" : (collection as "projects" | "play")} />
    </div>
  );
}
