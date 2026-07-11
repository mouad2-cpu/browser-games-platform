import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "prisma"],
  async redirects() {
    return [
      { source: "/pages/contact", destination: "/contact", permanent: true },
      { source: "/pages/terms", destination: "/terms-of-service", permanent: true },
      { source: "/pages/privacy", destination: "/privacy-policy", permanent: true },
      { source: "/terms", destination: "/terms-of-service", permanent: true },
      { source: "/privacy", destination: "/privacy-policy", permanent: true },
      {
        source: "/:path*",
        has: [{ type: "host", value: "zenfungames.com" }],
        destination: "https://www.zenfungames.com/:path*",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      // Extra game sitemap chunks: /sitemap-games-1.xml, /sitemap-games-2.xml, …
      {
        source: "/sitemap-games-:chunk(\\d+).xml",
        destination: "/api/sitemap/games/:chunk",
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "200mb",
    },
    proxyClientMaxBodySize: "200mb",
  },
};

export default nextConfig;
