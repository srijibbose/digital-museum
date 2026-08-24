import type { ExhibitDefinition } from "@/content/exhibits";
import {
  absoluteUrl,
  SITE_DESCRIPTION,
  SITE_NAME,
  type SiteEnvironment,
} from "@/lib/seo/site";

export interface BreadcrumbItem {
  name: string;
  pathname: string;
}

export function serializeJsonLd(value: unknown): string {
  return (JSON.stringify(value) ?? "null").replace(/</g, "\\u003c");
}

export function createSiteGraph(env?: SiteEnvironment) {
  const siteUrl = absoluteUrl("/", env);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}#website`,
        url: siteUrl,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        publisher: { "@id": `${siteUrl}#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}#organization`,
        url: siteUrl,
        name: SITE_NAME,
      },
    ],
  };
}

export function createCatalogCollectionGraph(
  exhibits: readonly ExhibitDefinition[],
  env?: SiteEnvironment,
) {
  const url = absoluteUrl("/exhibits", env);

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection-page`,
    url,
    name: "Explore every exhibit",
    description: "Search every exhibition by subject, wing, format, or the time you have.",
    mainEntity: {
      "@type": "ItemList",
      "@id": `${url}#visible-exhibits`,
      numberOfItems: exhibits.length,
      itemListElement: exhibits.map((exhibit, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "CreativeWork",
          name: exhibit.title,
          description: exhibit.synopsis,
          url: absoluteUrl(exhibit.route, env),
        },
      })),
    },
  };
}

export function createHomeCollectionGraph(
  exhibits: readonly ExhibitDefinition[],
  env?: SiteEnvironment,
) {
  const url = absoluteUrl("/", env);

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection-page`,
    url,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    mainEntity: {
      "@type": "ItemList",
      "@id": `${url}#featured-exhibits`,
      numberOfItems: exhibits.length,
      itemListElement: exhibits.map((exhibit, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "CreativeWork",
          name: exhibit.title,
          description: exhibit.synopsis,
          url: absoluteUrl(exhibit.route, env),
        },
      })),
    },
  };
}

export function createExhibitGraph(
  exhibit: ExhibitDefinition,
  env?: SiteEnvironment,
) {
  if (exhibit.access.mode === "private") {
    throw new Error("Private exhibits cannot be added to public structured data.");
  }

  const url = absoluteUrl(exhibit.route, env);
  const siteUrl = absoluteUrl("/", env);
  const isAccessibleForFree = exhibit.access.mode === "public";

  return {
    "@context": "https://schema.org",
    "@type": ["CreativeWork", "LearningResource"],
    "@id": `${url}#creative-work`,
    url,
    name: exhibit.title,
    description: exhibit.synopsis,
    dateModified: exhibit.lastModified,
    isAccessibleForFree,
    isPartOf: { "@id": `${siteUrl}#website` },
    publisher: { "@id": `${siteUrl}#organization` },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: exhibit.title,
      description: exhibit.synopsis,
    },
    ...(isAccessibleForFree
      ? {}
      : {
          hasPart: {
            "@type": "WebPageElement",
            cssSelector: ".member-content",
            isAccessibleForFree: false,
          },
        }),
  };
}

export function createBreadcrumbGraph(
  items: readonly BreadcrumbItem[],
  env?: SiteEnvironment,
) {
  const currentPathname = items.at(-1)?.pathname ?? "/";

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${absoluteUrl(currentPathname, env)}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.pathname, env),
    })),
  };
}
