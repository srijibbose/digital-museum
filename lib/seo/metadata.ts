import type { Metadata } from "next";
import type { ExhibitDefinition } from "@/content/exhibits";
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
    robots: { index: input.index !== false, follow: true },
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
  return createPageMetadata(
    {
      title: exhibit.title,
      description: exhibit.synopsis,
      pathname: exhibit.route,
      imagePath: `/social/exhibit/${exhibit.slug}`,
      index: exhibit.access.mode !== "private",
    },
    env,
  );
}
