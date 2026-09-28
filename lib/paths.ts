import type { Entry } from "@/lib/content";

/** URL for an entry. Shared by server and client components. */
export const href = (entry: Pick<Entry, "collection" | "slug">) => `/${entry.collection}/${entry.slug}`;
