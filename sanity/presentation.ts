import { defineDocuments, defineLocations, type PresentationPluginOptions } from "sanity/presentation";

/**
 * Ties Studio documents to site pages, so the preview opens the right page
 * and a page knows which document to edit.
 */
export const resolve: PresentationPluginOptions["resolve"] = {
  mainDocuments: defineDocuments([
    {
      route: "/:collection/:slug",
      filter: `_type == "caseStudy" && collection == $collection && slug.current == $slug`,
    },
  ]),
  locations: {
    caseStudy: defineLocations({
      select: { title: "title", slug: "slug.current", collection: "collection" },
      resolve: (doc) => ({
        locations: doc?.slug
          ? [
              { title: doc.title?.split(":")[0] ?? "Case study", href: `/${doc.collection}/${doc.slug}` },
              { title: "Home", href: "/" },
            ]
          : [],
      }),
    }),
  },
};
