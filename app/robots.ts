import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/api/private/", "/auth/", "/internal/", "/private/"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
