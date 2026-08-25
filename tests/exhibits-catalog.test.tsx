import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ExhibitsCatalog from "@/app/exhibits/page";

type CatalogParams = Record<string, string | string[] | undefined>;

async function renderCatalog(searchParams: CatalogParams = {}) {
  render(await ExhibitsCatalog({ searchParams: Promise.resolve(searchParams) }));
}

describe("all exhibits catalog", () => {
  it("shows the complete small catalog without premature pagination", async () => {
    await renderCatalog();

    expect(screen.getByRole("heading", { level: 1, name: "All exhibits" })).toBeVisible();
    expect(screen.getByText("6 exhibits")).toBeVisible();
    expect(screen.getAllByRole("article")).toHaveLength(6);
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
      "Dinosaurs, Reconsidered",
      "Atlas of Worlds",
      "Human Anatomy",
      "Becoming Human",
    ]);
    expect(screen.queryByRole("link", { name: "Next page" })).not.toBeInTheDocument();
  });

  it("bounds out-of-range page requests to the available catalog", async () => {
    await renderCatalog({ page: "2" });

    expect(screen.getAllByRole("article")).toHaveLength(6);
    expect(screen.getByRole("heading", { level: 3, name: "Atlas of Worlds" })).toBeVisible();
    expect(screen.getAllByText("Page 1 of 1")).toHaveLength(2);
    expect(screen.queryByRole("link", { name: "Previous page" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Next page" })).not.toBeInTheDocument();
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
