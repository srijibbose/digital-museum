import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getExhibitBySlug } from "@/content/exhibits";
import {
  getResearchRecord,
  getResearchRecordsForExhibit,
} from "@/content/research-records";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  createBreadcrumbGraph,
  createExhibitGraph,
  createResearchRecordGraph,
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
    const graph = createExhibitGraph(exhibit, [], museumEnvironment);

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
      [],
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

    expect(() => createExhibitGraph(exhibit, [], museumEnvironment)).toThrow(
      "Private exhibits cannot be added to public structured data.",
    );
  });

  it("describes an exhibit with stable page/work identities and only authored subjects and citations", () => {
    const exhibit = getExhibitBySlug("atlas-of-worlds")!;
    const records = getResearchRecordsForExhibit(exhibit.slug);
    const expectedCitations = Array.from(
      new Set(records.flatMap((record) => record.sources.map((source) => source.url))),
    );
    const graph = createExhibitGraph(exhibit, records, museumEnvironment);

    expect(graph).toMatchObject({
      "@type": ["CreativeWork", "LearningResource"],
      "@id": "https://museum.example/exhibits/atlas-of-worlds#creative-work",
      url: "https://museum.example/exhibits/atlas-of-worlds",
      isPartOf: { "@id": "https://museum.example/#website" },
      publisher: { "@id": "https://museum.example/#organization" },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": "https://museum.example/exhibits/atlas-of-worlds#webpage",
        url: "https://museum.example/exhibits/atlas-of-worlds",
      },
      image: "https://museum.example/social/exhibit/atlas-of-worlds",
      about: exhibit.tags.map((name) => ({ "@type": "Thing", name })),
      citation: expectedCitations,
    });
    expect(new Set(graph.citation).size).toBe(graph.citation.length);
    expect(graph).not.toHaveProperty("educationalLevel");
    expect(graph).not.toHaveProperty("author");
  });

  it("links a research record to its visible page, parent exhibit, site, and publisher", () => {
    const exhibit = getExhibitBySlug("atlas-of-worlds")!;
    const record = getResearchRecord("atlas-of-worlds", "mars")!;
    const graph = createResearchRecordGraph(record, exhibit, museumEnvironment);

    expect(graph).toMatchObject({
      "@type": ["Article", "LearningResource"],
      "@id": "https://museum.example/research/atlas-of-worlds/mars#research-record",
      url: "https://museum.example/research/atlas-of-worlds/mars",
      headline: record.title,
      citation: record.sources.map((source) => source.url),
      publisher: { "@id": "https://museum.example/#organization" },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": "https://museum.example/research/atlas-of-worlds/mars#webpage",
        url: "https://museum.example/research/atlas-of-worlds/mars",
      },
      isPartOf: [
        {
          "@type": "CreativeWork",
          "@id": "https://museum.example/exhibits/atlas-of-worlds#creative-work",
          url: "https://museum.example/exhibits/atlas-of-worlds",
          name: "Atlas of Worlds",
        },
        { "@id": "https://museum.example/#website" },
      ],
    });
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
