import { render, screen, within } from "@testing-library/react";
import type { Metadata } from "next";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import ExhibitsCatalog, * as catalogPage from "@/app/exhibits/page";
import { EXHIBIT_REGISTRY, getExhibitBySlug } from "@/content/exhibits";

type CatalogParams = Record<string, string | string[] | undefined>;

type CatalogMetadataGenerator = (props: {
  searchParams: Promise<CatalogParams>;
}) => Promise<Metadata>;

const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const generateCatalogMetadata = (
  catalogPage as typeof catalogPage & {
    generateMetadata?: CatalogMetadataGenerator;
  }
).generateMetadata;

beforeAll(() => {
  process.env.NEXT_PUBLIC_SITE_URL = "https://museum.example";
});

afterAll(() => {
  if (originalSiteUrl === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
  else process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl;
});

async function renderCatalog(searchParams: CatalogParams = {}) {
  render(await ExhibitsCatalog({ searchParams: Promise.resolve(searchParams) }));
}

describe("all exhibits catalog", () => {
  it("keeps the unfiltered catalog indexable at its stable canonical", async () => {
    expect(generateCatalogMetadata).toBeTypeOf("function");
    if (!generateCatalogMetadata) return;

    const metadata = await generateCatalogMetadata({
      searchParams: Promise.resolve({}),
    });

    expect(metadata.alternates?.canonical).toBe("https://museum.example/exhibits");
    expect(metadata.robots).toMatchObject({ index: true, follow: true });
  });

  it.each([
    ["search", { q: "Apollo" }],
    ["wing filter", { wing: "space" }],
    ["duration filter", { duration: "short" }],
    ["format filter", { format: "interactive-3d" }],
    ["featured filter", { featured: "true" }],
    ["sort", { sort: "title" }],
    ["pagination", { page: "2" }],
  ])("noindexes a valid %s catalog URL", async (_label, searchParams) => {
    expect(generateCatalogMetadata).toBeTypeOf("function");
    if (!generateCatalogMetadata) return;

    const metadata = await generateCatalogMetadata({
      searchParams: Promise.resolve(searchParams),
    });

    expect(metadata.alternates?.canonical).toBe("https://museum.example/exhibits");
    expect(metadata.robots).toMatchObject({ index: false, follow: true });
  });

  it.each([
    ["unknown key", { mystery: "" }],
    ["empty value", { q: "" }],
    ["whitespace value", { q: "  " }],
    ["malformed facet", { wing: "unknown" }],
    ["word pagination", { page: "zero" }],
    ["trailing-junk pagination", { page: "2abc" }],
    ["fractional pagination", { page: "1.5" }],
  ])("noindexes a catalog URL containing %s", async (_label, searchParams) => {
    expect(generateCatalogMetadata).toBeTypeOf("function");
    if (!generateCatalogMetadata) return;

    const metadata = await generateCatalogMetadata({
      searchParams: Promise.resolve(searchParams),
    });

    expect(metadata.alternates?.canonical).toBe("https://museum.example/exhibits");
    expect(metadata.robots).toMatchObject({ index: false, follow: true });
  });

  it("renders a CollectionPage ItemList matching the filtered visible cards", async () => {
    await renderCatalog({ q: "Apollo" });

    const script = document.querySelector('script[type="application/ld+json"]');
    const graph = JSON.parse(script?.textContent ?? "null");
    const visibleCard = screen
      .getByRole("heading", { level: 3, name: "Thirteen Minutes" })
      .closest("article");
    const visibleLink = within(visibleCard as HTMLElement).getByRole("link");

    expect(graph).toMatchObject({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": "https://museum.example/exhibits#collection-page",
      url: "https://museum.example/exhibits",
      name: "Explore every exhibit",
      mainEntity: {
        "@type": "ItemList",
        "@id": "https://museum.example/exhibits#visible-exhibits",
        numberOfItems: 1,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            item: {
              "@type": "CreativeWork",
              name: "Thirteen Minutes",
              url: "https://museum.example/exhibits/thirteen-minutes",
            },
          },
        ],
      },
    });
    expect(visibleLink).toHaveAttribute("href", "/exhibits/thirteen-minutes");
    expect(graph.mainEntity.itemListElement[0].item.name).toBe(
      visibleCard?.querySelector("h3")?.textContent,
    );
    expect(new URL(graph.mainEntity.itemListElement[0].item.url).pathname).toBe(
      visibleLink.getAttribute("href"),
    );
  });

  it("renders catalog breadcrumb links matching its BreadcrumbList", async () => {
    await renderCatalog();

    const navigation = screen.getByRole("navigation", { name: "Breadcrumb" });
    const links = within(navigation).getAllByRole("link");
    const graphs = Array.from(
      document.querySelectorAll('script[type="application/ld+json"]'),
    ).map((script) => JSON.parse(script.textContent ?? "null"));
    const graph = graphs.find((candidate) => candidate["@type"] === "BreadcrumbList");

    expect(links.map((link) => [link.textContent, link.getAttribute("href")])).toEqual([
      ["Home", "/"],
      ["Exhibits", "/exhibits"],
    ]);
    expect(
      graph.itemListElement.map(
        (item: { name: string; item: string }) => [item.name, new URL(item.item).pathname],
      ),
    ).toEqual([
      ["Home", "/"],
      ["Exhibits", "/exhibits"],
    ]);
  });

  it("shows the complete small catalog without premature pagination", async () => {
    await renderCatalog();

    expect(screen.getByRole("heading", { level: 1, name: "All exhibits" })).toBeVisible();
    expect(screen.getByText("5 exhibits")).toBeVisible();
    expect(screen.getAllByRole("article")).toHaveLength(5);
    expect(screen.queryByRole("link", { name: "Next page" })).not.toBeInTheDocument();
  });

  it("intersects filters and retains the submitted form values", async () => {
    await renderCatalog({
      q: "Apollo",
      wing: "systems-machines",
      duration: "short",
      format: "interactive-3d",
      featured: "true",
    });

    expect(screen.getByRole("searchbox", { name: "Search all exhibits" })).toHaveValue(
      "Apollo",
    );
    expect(screen.getByRole("combobox", { name: "Wing" })).toHaveValue(
      "systems-machines",
    );
    expect(screen.getByRole("combobox", { name: "Duration" })).toHaveValue("short");
    expect(screen.getByRole("combobox", { name: "Format" })).toHaveValue(
      "interactive-3d",
    );
    expect(screen.getByRole("checkbox", { name: "Staff picks only" })).toBeChecked();
    expect(screen.getByText("1 exhibit")).toBeVisible();
    expect(screen.getByRole("heading", { level: 3, name: "Thirteen Minutes" })).toBeVisible();
    expect(screen.queryByRole("heading", { level: 3, name: "The Engine Is a River" })).not.toBeInTheDocument();
  });

  it("sorts matching results and preserves filters in pagination links", async () => {
    await renderCatalog({
      sort: "duration",
    });

    const results = screen.getByRole("region", { name: "Catalog results" });
    expect(within(results).getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent)).toEqual([
      "Thirteen Minutes",
      "The Engine Is a River",
      "Atlas of Worlds",
      "Human Anatomy",
      "Becoming Human",
    ]);
    expect(screen.queryByRole("link", { name: "Next page" })).not.toBeInTheDocument();
  });

  it("bounds out-of-range page requests to the available catalog", async () => {
    await renderCatalog({ page: "2" });

    expect(screen.getAllByRole("article")).toHaveLength(5);
    expect(screen.getByRole("heading", { level: 3, name: "Atlas of Worlds" })).toBeVisible();
    expect(screen.getAllByText("Page 1 of 1")).toHaveLength(2);
    expect(screen.queryByRole("link", { name: "Previous page" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Next page" })).not.toBeInTheDocument();
  });

  it("falls trailing-junk pagination back to the first page", async () => {
    const template = getExhibitBySlug("atlas-of-worlds")!;
    const extras = Array.from({ length: 8 }, (_, index) => ({
      ...template,
      id: `catalog-test-${index}`,
      slug: `catalog-test-${index}`,
      title: `Catalog test ${index}`,
      route: `/exhibits/catalog-test-${index}`,
      order: 100 + index,
    }));
    EXHIBIT_REGISTRY.push(...extras);

    try {
      await renderCatalog({ page: "2abc" });

      expect(screen.getAllByRole("article")).toHaveLength(12);
      expect(screen.getAllByText("Page 1 of 2")).toHaveLength(2);
    } finally {
      EXHIBIT_REGISTRY.splice(EXHIBIT_REGISTRY.length - extras.length, extras.length);
    }
  });

  it("provides a useful empty state without hiding the active query", async () => {
    await renderCatalog({ q: "bioluminescent whale" });

    expect(screen.getByRole("searchbox", { name: "Search all exhibits" })).toHaveValue(
      "bioluminescent whale",
    );
    expect(screen.getByRole("heading", { level: 2, name: "No exhibits found" })).toBeVisible();
    expect(screen.getByText(/Try a broader topic or remove one of the filters/i)).toBeVisible();
    expect(screen.getByRole("link", { name: "Clear all filters" })).toHaveAttribute(
      "href",
      "/exhibits",
    );
  });
});
