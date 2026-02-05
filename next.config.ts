import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    minimumCacheTTL: 0,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Allow local images with query strings (for cache busting)
    localPatterns: [
      {
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
