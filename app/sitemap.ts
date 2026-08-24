import type { MetadataRoute } from "next";
import { getActiveExhibits } from "@/content/exhibits";
import { isPubliclyDiscoverable } from "@/lib/auth/exhibit-access";
import { absoluteUrl } from "@/lib/seo/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return getActiveExhibits()
    .filter(isPubliclyDiscoverable)
    .map((exhibit) => ({
      url: absoluteUrl(exhibit.route),
      lastModified: exhibit.lastModified,
    }));
}
