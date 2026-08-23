import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CompactExhibitCard } from "@/components/museum/CompactExhibitCard";
import { MuseumSearch } from "@/components/museum/MuseumSearch";
import { SurpriseMe } from "@/components/museum/SurpriseMe";
import { createExhibitSearchIndex } from "@/content/exhibit-discovery";
import { getActiveExhibits } from "@/content/exhibits";

const navigation = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: navigation.push }),
}));

describe("museum discovery components", () => {
  const exhibits = getActiveExhibits();
  const searchIndex = createExhibitSearchIndex(exhibits);

  beforeEach(() => {
    navigation.push.mockReset();
  });

  it("submits a shareable catalog search and reveals metadata suggestions", async () => {
    const user = userEvent.setup();
    render(<MuseumSearch exhibits={searchIndex} />);

    const search = screen.getByRole("search", { name: "Search the museum" });
    const input = screen.getByRole("combobox", { name: "Search exhibits" });

    expect(search).toHaveAttribute("action", "/exhibits");
    expect(search).toHaveAttribute("method", "get");
    expect(input).toHaveAttribute("name", "q");
    expect(input).toHaveAttribute(
      "placeholder",
      "Search exhibits, topics, missions, systems…",
    );

    await user.type(input, "planet");

    expect(screen.getByRole("listbox", { name: "Exhibit suggestions" })).toBeVisible();
    expect(screen.getByRole("option", { name: /Atlas of Worlds/i })).toHaveAttribute(
      "href",
      "/exhibits/atlas-of-worlds",
    );

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox", { name: "Exhibit suggestions" })).not.toBeInTheDocument();
  });

  it("routes surprise navigation to an enabled exhibit", async () => {
    const user = userEvent.setup();
    render(<SurpriseMe exhibits={exhibits} random={() => 0.999} />);

    await user.click(screen.getByRole("button", { name: "Surprise me" }));

    expect(navigation.push).toHaveBeenCalledWith("/exhibits/atlas-of-worlds");
  });

  it("renders compact exhibit metadata with the real local poster asset", () => {
    const anatomy = exhibits.find((exhibit) => exhibit.slug === "human-anatomy");
    expect(anatomy).toBeDefined();

    render(<CompactExhibitCard exhibit={anatomy!} />);

    expect(screen.getByRole("heading", { name: "Human Anatomy" })).toBeVisible();
    expect(screen.getByText("25–40 min")).toBeVisible();
    expect(screen.getByText("Interactive 3D")).toBeVisible();
    expect(screen.getByRole("link", { name: "Explore Human Anatomy" })).toHaveAttribute(
      "href",
      "/exhibits/human-anatomy",
    );
    expect(document.querySelector('img[src="/media/anatomy/thorax-reference-render.png"]')).toBeTruthy();
  });
});
