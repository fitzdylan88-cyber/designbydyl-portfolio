import "server-only";
import { defineLive } from "next-sanity/live";
import { client } from "./client";

/**
 * `sanityFetch` caches published content and `<SanityLive />` refreshes it the
 * moment something is published. In draft mode (the Studio's preview) both
 * switch to drafts, using the read token on the server only.
 */
export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: process.env.SANITY_API_READ_TOKEN,
});
