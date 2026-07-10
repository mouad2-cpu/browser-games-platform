import type { MetadataRoute } from "next";
import { getSitemapIndexUrl } from "@/lib/sitemap";
import { getSiteOrigin } from "@/lib/structured-data/urls";

/**
 * robots.txt — Allow public content, block private surfaces,
 * and advertise the sitemap index at /sitemap.xml.
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
          "/api/",
          "/login",
          "/register",
          "/dashboard",
          "/continue-playing",
          "/top-picks",
        ],
      },
    ],
    sitemap: getSitemapIndexUrl(),
    host: getSiteOrigin(),
  };
}
