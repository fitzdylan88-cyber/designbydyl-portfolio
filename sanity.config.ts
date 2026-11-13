"use client";

/**
 * Sanity Studio, embedded in the site at /studio.
 * The project and dataset come from the Vercel Sanity integration (.env.local).
 */
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { colorInput } from "@sanity/color-input";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schema } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";

export default defineConfig({
  basePath: "/studio",
  title: "designbydyl",
  projectId,
  dataset,
  schema: {
    ...schema,
    // "New case study" from a Work/Projects/Play list starts in that list.
    templates: (prev) => [
      ...prev,
      {
        id: "caseStudy-in",
        title: "Case study",
        schemaType: "caseStudy",
        parameters: [{ name: "collection", type: "string" }],
        value: ({ collection }: { collection: string }) => ({ collection }),
      },
    ],
  },
  plugins: [structureTool({ structure }), colorInput(), visionTool({ defaultApiVersion: apiVersion })],
});
