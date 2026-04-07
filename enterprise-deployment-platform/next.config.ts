import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "media.rawg.io" },
      { protocol: "https", hostname: "cdn.akamai.steamstatic.com" },
    ],
  },
};

export default nextConfig;