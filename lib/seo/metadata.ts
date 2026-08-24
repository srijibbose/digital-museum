import type { Metadata } from "next";
import type { ExhibitDefinition } from "@/content/exhibits";
import {
  researchRecordPath,
  type ResearchRecord,
} from "@/content/research-records";
import { isPubliclyDiscoverable } from "@/lib/auth/exhibit-access";
import { absoluteUrl, SITE_NAME, type SiteEnvironment } from "@/lib/seo/site";

export interface PageSeoInput {
  title: string;
  description: string;
  pathname: string;
  imagePath?: string;
  imageAlt?: string;
  index?: boolean;
}

export function createPageMetadata(
  input: PageSeoInput,
  env?: SiteEnvironment,
): Metadata {
  const canonical = absoluteUrl(input.pathname, env);
  const image = absoluteUrl(input.imagePath ?? "/opengraph-image", env);

  return {
    title: input.title,
    description: input.description,
    alternates: { canonical },
    robots: {
      index: input.index !== false,
      follow: true,
      googleBot: {
        index: input.index !== false,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      url: canonical,
      title: input.title,
      description: input.description,
      siteName: SITE_NAME,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: input.imageAlt ?? input.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [image],
    },
  };
}

export function createExhibitMetadata(
  exhibit: ExhibitDefinition,
  env?: SiteEnvironment,
): Metadata {
  if (!isPubliclyDiscoverable(exhibit)) {
    const homeUrl = absoluteUrl("/", env);
    const image = absoluteUrl("/social/museum/default", env);
    const title = "Exhibit unavailable";
    const description = "This exhibit is not available in the public museum.";

    return {
      title,
      description,
      robots: {
        index: false,
        follow: false,
        noarchive: true,
        googleBot: { index: false, follow: false, noarchive: true },
      },
      openGraph: {
        type: "website",
        url: homeUrl,
        title,
        description,
        siteName: SITE_NAME,
        images: [{ url: image, width: 1200, height: 630, alt: SITE_NAME }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
    };
  }

  return createPageMetadata(
    {
      title: exhibit.title,
      description: exhibit.synopsis,
      pathname: exhibit.route,
      imagePath: `/social/exhibit/${exhibit.slug}`,
    },
    env,
  );
}

export function createResearchRecordMetadata(
  record: ResearchRecord,
  env?: SiteEnvironment,
): Metadata {
  return createPageMetadata(
    {
      title: record.title,
      description: record.summary,
      pathname: researchRecordPath(record),
      imagePath: `/social/research/${record.exhibitSlug}/${record.slug}`,
      imageAlt: `${record.title} research record`,
    },
    env,
  );
}
