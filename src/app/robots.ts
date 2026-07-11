import type { MetadataRoute } from "next";
import { getSitemapIndexUrl } from "@/lib/sitemap";
import { getSitemapBaseUrl } from "@/lib/sitemap/base-url";

/**
 * robots.txt — allow public content, block private surfaces,
 * advertise the sitemap index.
 *
 * @see https://developers.google.com/search/docs/crawling-indexing/robots/intro
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api",
          "/api/",
          "/dashboard",
          "/dashboard/",
          "/login",
          "/register",
          "/continue-playing",
          "/top-picks",
          "/search",
        ],
      },
    ],
    sitemap: getSitemapIndexUrl(),
    host: getSitemapBaseUrl().replace(/^https?:\/\//, ""),
  };
}
