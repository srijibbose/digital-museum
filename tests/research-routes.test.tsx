import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ResearchLibraryPage, {
  metadata as researchLibraryMetadata,
} from "@/app/research/page";
import ResearchRecordRoute, {
  generateMetadata,
  generateStaticParams,
} from "@/app/research/[exhibit]/[record]/page";
import {
  getResearchRecord,
  getResearchRecords,
} from "@/content/research-records";
import { createResearchRecordMetadata } from "@/lib/seo/metadata";

const museumEnvironment = { NEXT_PUBLIC_SITE_URL: "https://museum.example" };

function jsonLdGraphs(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]'),
    (script) => JSON.parse(script.textContent ?? "null") as Record<string, unknown>,
  );
}

function schemaTypeIncludes(graph: Record<string, unknown>, type: string) {
  const value = graph["@type"];
  return Array.isArray(value) ? value.includes(type) : value === type;
}

describe("public research record route", () => {
  it("prebuilds exactly every validated research record", async () => {
    const params = await generateStaticParams();

    expect(params).toHaveLength(66);
    expect(new Set(params.map(({ exhibit, record }) => `${exhibit}/${record}`)).size).toBe(66);
    expect(params).toContainEqual({ exhibit: "atlas-of-worlds", record: "mars" });
  });

  it("creates a unique canonical and social card URL for every record", async () => {
    const records = getResearchRecords();
    const metadata = records.map((record) =>
      createResearchRecordMetadata(record, museumEnvironment),
    );
    const canonicals = metadata.map((item) => item.alternates?.canonical);
    const socialImages = metadata.map((item) => {
      const images = item.openGraph?.images;
      const firstImage = Array.isArray(images) ? images[0] : undefined;
      return typeof firstImage === "object" && firstImage && "url" in firstImage
        ? String(firstImage.url)
        : undefined;
    });

    expect(new Set(canonicals).size).toBe(66);
    expect(new Set(socialImages).size).toBe(66);

    const marsMetadata = await generateMetadata({
      params: Promise.resolve({ exhibit: "atlas-of-worlds", record: "mars" }),
    });
    expect(marsMetadata).toMatchObject({
      title: "Mars — Cold desert world",
      alternates: { canonical: "http://localhost:3000/research/atlas-of-worlds/mars" },
      openGraph: {
        url: "http://localhost:3000/research/atlas-of-worlds/mars",
        images: [
          { url: "http://localhost:3000/social/research/atlas-of-worlds/mars" },
        ],
      },
      twitter: {
        images: ["http://localhost:3000/social/research/atlas-of-worlds/mars"],
      },
    });
  });

  it("renders one semantic article heading with adjacent evidence detail and real sources", async () => {
    const mars = getResearchRecord("atlas-of-worlds", "mars")!;
    const { container } = render(await ResearchRecordRoute({
      params: Promise.resolve({ exhibit: "atlas-of-worlds", record: "mars" }),
    }));

    expect(container.querySelector("article")).toBeTruthy();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1, name: "Mars — Cold desert world" })).toBeVisible();

    const evidence = screen.getByRole("complementary", { name: "Evidence status" });
    expect(within(evidence).getByText(mars.evidenceLabel)).toBeVisible();
    expect(within(evidence).getByText(mars.evidenceDetail)).toBeVisible();

    const sources = screen.getByRole("region", { name: "Sources" });
    expect(within(sources).getAllByRole("link")).toHaveLength(mars.sources.length);
    for (const source of mars.sources) {
      expect(within(sources).getByRole("link", { name: new RegExp(source.title, "i") }))
        .toHaveAttribute("href", source.url);
    }
  });

  it("keeps visible and schema breadcrumbs in exact agreement", async () => {
    const { container } = render(await ResearchRecordRoute({
      params: Promise.resolve({ exhibit: "atlas-of-worlds", record: "mars" }),
    }));
    const breadcrumb = screen.getByRole("navigation", { name: "Breadcrumb" });
    const visible = within(breadcrumb).getAllByRole("link").map((link) => ({
      name: link.textContent,
      pathname: link.getAttribute("href"),
    }));
    const graph = jsonLdGraphs(container).find((item) => item["@type"] === "BreadcrumbList")!;
    const schema = (graph.itemListElement as Array<Record<string, unknown>>).map((item) => ({
      name: item.name,
      pathname: new URL(String(item.item)).pathname,
    }));

    expect(visible).toEqual([
      { name: "Home", pathname: "/" },
      { name: "Research", pathname: "/research" },
      { name: "Atlas of Worlds", pathname: "/exhibits/atlas-of-worlds" },
      { name: "Mars — Cold desert world", pathname: "/research/atlas-of-worlds/mars" },
    ]);
    expect(schema).toEqual(visible);
  });

  it("renders an Article/LearningResource graph using only visible record fields", async () => {
    const mars = getResearchRecord("atlas-of-worlds", "mars")!;
    const { container } = render(await ResearchRecordRoute({
      params: Promise.resolve({ exhibit: "atlas-of-worlds", record: "mars" }),
    }));
    const graph = jsonLdGraphs(container).find((item) => schemaTypeIncludes(item, "Article"))!;
    const sourceHrefs = within(screen.getByRole("region", { name: "Sources" }))
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));

    expect(graph).toMatchObject({
      "@type": ["Article", "LearningResource"],
      url: "http://localhost:3000/research/atlas-of-worlds/mars",
      headline: mars.title,
      description: mars.summary,
      dateModified: mars.lastModified,
      citation: sourceHrefs,
    });
    expect(screen.getByText(mars.summary)).toBeVisible();
    expect(container.querySelector(`time[datetime="${mars.lastModified}"]`)).toBeTruthy();
  });

  it("links to sources, adjacent research, and only Atlas's implemented world deep link", async () => {
    const { unmount } = render(await ResearchRecordRoute({
      params: Promise.resolve({ exhibit: "atlas-of-worlds", record: "mars" }),
    }));

    expect(screen.getByRole("link", { name: "Enter Atlas of Worlds" }))
      .toHaveAttribute("href", "/exhibits/atlas-of-worlds?world=mars");
    const related = screen.getByRole("navigation", { name: "Related research records" });
    expect(within(related).getByRole("link", { name: /Moon/i }))
      .toHaveAttribute("href", "/research/atlas-of-worlds/moon");
    expect(within(related).getByRole("link", { name: /Jupiter/i }))
      .toHaveAttribute("href", "/research/atlas-of-worlds/jupiter");

    unmount();
    render(await ResearchRecordRoute({
      params: Promise.resolve({ exhibit: "human-anatomy", record: "cardiovascular" }),
    }));
    expect(screen.getByRole("link", { name: "Enter Human Anatomy" }))
      .toHaveAttribute("href", "/exhibits/human-anatomy");
  });

  it("throws Next's real not-found interrupt for an unknown exhibit-record pair", async () => {
    await expect(ResearchRecordRoute({
      params: Promise.resolve({ exhibit: "atlas-of-worlds", record: "not-authored" }),
    })).rejects.toMatchObject({ digest: "NEXT_HTTP_ERROR_FALLBACK;404" });
  });
});

describe("public research library index", () => {
  it("ships unique index metadata", () => {
    expect(researchLibraryMetadata).toMatchObject({
      title: "Research library",
      alternates: { canonical: "http://localhost:3000/research" },
      openGraph: { url: "http://localhost:3000/research" },
    });
  });

  it("groups and visibly links all 66 records", () => {
    const { container } = render(<ResearchLibraryPage />);
    const recordLinks = Array.from(
      container.querySelectorAll<HTMLAnchorElement>('a[href^="/research/"]'),
    );

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1, name: "Research library" })).toBeVisible();
    expect(recordLinks).toHaveLength(66);
    expect(new Set(recordLinks.map((link) => link.getAttribute("href"))).size).toBe(66);
    for (const exhibitName of [
      "Human Anatomy",
      "Becoming Human",
      "The Engine Is a River",
      "Thirteen Minutes",
      "Atlas of Worlds",
    ]) {
      expect(screen.getByRole("heading", { level: 2, name: exhibitName })).toBeVisible();
    }
  });

  it("keeps the index ItemList in exact agreement with its visible record links", () => {
    const { container } = render(<ResearchLibraryPage />);
    const visible = Array.from(
      container.querySelectorAll<HTMLAnchorElement>('a[href^="/research/"]'),
      (link) => ({
        name: link.querySelector("strong")?.textContent,
        pathname: link.getAttribute("href"),
      }),
    );
    const graph = jsonLdGraphs(container).find((item) => item["@type"] === "CollectionPage")!;
    const mainEntity = graph.mainEntity as Record<string, unknown>;
    const schema = (mainEntity.itemListElement as Array<Record<string, unknown>>).map((entry) => {
      const item = entry.item as Record<string, unknown>;
      return { name: item.name, pathname: new URL(String(item.url)).pathname };
    });

    expect(mainEntity).toMatchObject({ "@type": "ItemList", numberOfItems: 66 });
    expect(schema).toEqual(visible);
  });
});
