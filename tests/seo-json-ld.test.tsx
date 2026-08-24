import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getExhibitBySlug } from "@/content/exhibits";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  createBreadcrumbGraph,
  createExhibitGraph,
  createSiteGraph,
  serializeJsonLd,
} from "@/lib/seo/json-ld";

const museumEnvironment = { NEXT_PUBLIC_SITE_URL: "https://museum.example" };

describe("JSON-LD builders", () => {
  it("creates stable site and breadcrumb graph identifiers", () => {
    const siteGraph = createSiteGraph(museumEnvironment);
    const breadcrumbs = createBreadcrumbGraph(
      [
        { name: "Exhibits", pathname: "/exhibits" },
        { name: "Atlas of Worlds", pathname: "/exhibits/atlas-of-worlds" },
      ],
      museumEnvironment,
    );

    expect(siteGraph).toMatchObject({
      "@context": "https://schema.org",
      "@graph": [
        { "@type": "WebSite", "@id": "https://museum.example/#website" },
        {
          "@type": "Organization",
          "@id": "https://museum.example/#organization",
        },
      ],
    });
    expect(breadcrumbs).toMatchObject({
      "@type": "BreadcrumbList",
      "@id": "https://museum.example/exhibits/atlas-of-worlds#breadcrumb",
      itemListElement: [
        { position: 1, name: "Exhibits", item: "https://museum.example/exhibits" },
        {
          position: 2,
          name: "Atlas of Worlds",
          item: "https://museum.example/exhibits/atlas-of-worlds",
        },
      ],
    });
  });

  it("escapes markup and describes a member exhibit gate", () => {
    const exhibit = {
      ...getExhibitBySlug("atlas-of-worlds")!,
      access: {
        mode: "members" as const,
        gateLabel: "Sign in to enter",
        gateDescription: "Membership unlocks the instrument.",
      },
    };
    const graph = createExhibitGraph(exhibit, museumEnvironment);

    expect(graph).toMatchObject({
      "@type": ["CreativeWork", "LearningResource"],
      "@id": "https://museum.example/exhibits/atlas-of-worlds#creative-work",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": "https://museum.example/exhibits/atlas-of-worlds#webpage",
      },
    });
    expect(graph.isAccessibleForFree).toBe(false);
    expect(graph.hasPart).toMatchObject({
      cssSelector: ".member-content",
      isAccessibleForFree: false,
    });
    expect(serializeJsonLd({ value: "</script><script>" })).not.toContain(
      "</script>",
    );
  });

  it("marks public exhibit content accessible for free", () => {
    const graph = createExhibitGraph(
      getExhibitBySlug("atlas-of-worlds")!,
      museumEnvironment,
    );

    expect(graph.isAccessibleForFree).toBe(true);
    expect(graph.hasPart).toBeUndefined();
  });

  it("does not build public structured data for private exhibits", () => {
    const exhibit = {
      ...getExhibitBySlug("atlas-of-worlds")!,
      access: { mode: "private" as const },
    };

    expect(() => createExhibitGraph(exhibit, museumEnvironment)).toThrow(
      "Private exhibits cannot be added to public structured data.",
    );
  });

  it("renders native JSON-LD", () => {
    const { container } = render(
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebSite" }} />,
    );

    expect(
      container.querySelector('script[type="application/ld+json"]'),
    ).toBeTruthy();
  });
});
