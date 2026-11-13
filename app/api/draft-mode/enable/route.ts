/**
 * The Studio's preview (Presentation tool) calls this to switch the site into
 * draft mode, after Sanity checks the request came from a signed-in editor.
 */
import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client } from "@/sanity/lib/client";

export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token: process.env.SANITY_API_READ_TOKEN }),
});
