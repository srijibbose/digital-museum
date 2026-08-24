import { getActiveExhibits } from "@/content/exhibits";
import { isPubliclyDiscoverable } from "@/lib/auth/exhibit-access";
import { resolvePublicResearchRecord } from "@/lib/research/public-records";
import { SITE_NAME } from "@/lib/seo/site";

export interface SocialCardContent {
  eyebrow: string;
  title: string;
  description: string;
  accentColor: string;
}

export const museumSocialCard: SocialCardContent = {
  eyebrow: "INTERACTIVE DIGITAL MUSEUM",
  title: SITE_NAME,
  description: "An interactive digital museum for the quietly curious.",
  accentColor: "#bd552b",
};

export function resolveSocialCard(
  kind: string,
  slugParts: readonly string[],
): SocialCardContent | null {
  if (kind === "research" && slugParts.length === 2) {
    const resolved = resolvePublicResearchRecord(slugParts[0]!, slugParts[1]!);
    if (!resolved) return null;

    return {
      eyebrow: `RESEARCH RECORD · ${resolved.exhibit.title.toUpperCase()}`,
      title: resolved.record.title,
      description: resolved.record.summary,
      accentColor: resolved.exhibit.visualTheme.accentColor,
    };
  }

  if (kind !== "exhibit" || slugParts.length !== 1) return null;

  const exhibit = getActiveExhibits()
    .filter(isPubliclyDiscoverable)
    .find((entry) => entry.slug === slugParts[0]);

  if (!exhibit) {
    return null;
  }

  return {
    eyebrow: exhibit.visualTheme.badgeText,
    title: exhibit.title,
    description: exhibit.synopsis,
    accentColor: exhibit.visualTheme.accentColor,
  };
}

export function resolveSocialCardOrFallback(
  kind: string,
  slugParts: readonly string[],
): SocialCardContent {
  return resolveSocialCard(kind, slugParts) ?? museumSocialCard;
}
