"use client";

/**
 * Sanity Studio, embedded in the site at /studio.
 * The project and dataset come from the Vercel Sanity integration (.env.local).
 */
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { visionTool } from "@sanity/vision";
import { colorInput } from "@sanity/color-input";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schema } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";
import { resolve } from "./sanity/presentation";

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
  plugins: [
    // "Presentation": the site beside the editor. Click any text or picture to edit it.
    presentationTool({ resolve, previewUrl: { previewMode: { enable: "/api/draft-mode/enable" } } }),
    structureTool({ structure }),
    colorInput(),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
