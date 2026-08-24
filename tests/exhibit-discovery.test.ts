import { describe, expect, it } from "vitest";
import {
  buildCatalogHref,
  createExhibitSearchIndex,
  filterExhibits,
  getCatalogPage,
  getSearchSuggestions,
  pickSurpriseExhibit,
} from "@/content/exhibit-discovery";
import { getActiveExhibits } from "@/content/exhibits";

describe("exhibit discovery", () => {
  const exhibits = getActiveExhibits();

  it("matches normalized search terms across exhibit metadata", () => {
    expect(
      filterExhibits(exhibits, { q: "  APOLLO   radar " }).map(
        (exhibit) => exhibit.slug,
      ),
    ).toEqual(["thirteen-minutes"]);
  });

  it("intersects wing, duration, format, and featured filters", () => {
    expect(
      filterExhibits(exhibits, {
        wing: "systems-machines",
        duration: "short",
        format: "simulation",
        featured: true,
      }).map((exhibit) => exhibit.slug),
    ).toEqual(["jet-engine"]);
  });

  it("sorts by title and duration without mutating curator order", () => {
    const curatorOrder = exhibits.map((exhibit) => exhibit.slug);

    expect(
      filterExhibits(exhibits, { sort: "title" }).map(
        (exhibit) => exhibit.title,
      ),
    ).toEqual([
      "Atlas of Worlds",
      "Becoming Human",
      "Human Anatomy",
      "The Engine Is a River",
      "Thirteen Minutes",
    ]);
    expect(
      filterExhibits(exhibits, { sort: "duration" }).map(
        (exhibit) => exhibit.durationMinutes,
      ),
    ).toEqual([10, 15, 25, 35, 70]);
    expect(exhibits.map((exhibit) => exhibit.slug)).toEqual(curatorOrder);
  });

  it("returns bounded catalog pages", () => {
    const page = getCatalogPage(exhibits, { sort: "title", page: 2 }, 2);

    expect(page.items.map((exhibit) => exhibit.title)).toEqual([
      "Human Anatomy",
      "The Engine Is a River",
    ]);
    expect(page.total).toBe(5);
    expect(page.page).toBe(2);
    expect(page.pageSize).toBe(2);
    expect(page.totalPages).toBe(3);
  });

  it("builds shareable catalog URLs without empty defaults", () => {
    expect(
      buildCatalogHref({
        q: "moon landing",
        wing: "space",
        duration: "all",
        format: "all",
        sort: "title",
        page: 2,
      }),
    ).toBe(
      "/exhibits?q=moon+landing&wing=space&sort=title&page=2",
    );
  });

  it("suggests the strongest matching exhibits with a stable limit", () => {
    const searchIndex = createExhibitSearchIndex(exhibits);

    expect(
      getSearchSuggestions(searchIndex, "planet", 2).map(
        (exhibit) => exhibit.slug,
      ),
    ).toEqual(["atlas-of-worlds"]);
    expect(getSearchSuggestions(searchIndex, "", 4)).toEqual([]);
    expect(searchIndex[0]).not.toHaveProperty("synopsis");
    expect(searchIndex[0]).not.toHaveProperty("curatorNote");
  });

  it("selects a surprise exhibit through an injectable random source", () => {
    expect(pickSurpriseExhibit(exhibits, () => 0)?.slug).toBe(
      "human-anatomy",
    );
    expect(pickSurpriseExhibit(exhibits, () => 0.999)?.slug).toBe(
      "atlas-of-worlds",
    );
    expect(pickSurpriseExhibit([], () => 0)).toBeUndefined();
  });
});
