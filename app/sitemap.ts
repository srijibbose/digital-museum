import type { MetadataRoute } from "next";
import { getActiveExhibits } from "@/content/exhibits";
import { researchRecordPath } from "@/content/research-records";
import { isPubliclyDiscoverable } from "@/lib/auth/exhibit-access";
import { listPublicResearchRecords } from "@/lib/research/public-records";
import { absoluteUrl } from "@/lib/seo/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const exhibitEntries = getActiveExhibits()
    .filter(isPubliclyDiscoverable)
    .map((exhibit) => ({
      url: absoluteUrl(exhibit.route),
      lastModified: exhibit.lastModified,
    }));
  const researchEntries = listPublicResearchRecords().map(({ record }) => ({
    url: absoluteUrl(researchRecordPath(record)),
    lastModified: record.lastModified,
  }));

  return [
    { url: absoluteUrl("/") },
    { url: absoluteUrl("/exhibits") },
    { url: absoluteUrl("/research") },
    ...exhibitEntries,
    ...researchEntries,
  ];
}
