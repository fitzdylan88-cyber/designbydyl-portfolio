import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  // Click-to-edit: in the Studio's preview, text carries a hidden link back to its field.
  stega: { studioUrl: "/studio" },
});
