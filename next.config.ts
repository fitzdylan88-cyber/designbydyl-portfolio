import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Case study images are served from Sanity.
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  experimental: {
    viewTransition: true,
  },
};

export default nextConfig;
