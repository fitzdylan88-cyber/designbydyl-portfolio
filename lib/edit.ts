import { createDataAttribute } from "next-sanity";
import { dataset, projectId } from "@/sanity/env";

/**
 * Click-to-edit links for the Studio's preview. Text from Sanity carries
 * hidden markers the preview can find, but pictures don't, and the reveal
 * animations split titles into pieces that hide them. So those elements get
 * an explicit `data-sanity` attribute naming the document and field instead.
 * Only used in draft mode; on the live site `editor` returns undefined.
 */
export type Edit = (path: string) => string;

export function editor(id: string, enabled: boolean): Edit | undefined {
  if (!enabled) return undefined;
  const attr = createDataAttribute({ projectId, dataset, baseUrl: "/studio", id, type: "caseStudy" });
  return (path) => attr(path).toString();
}

