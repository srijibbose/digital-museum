import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { permanentRedirect } from "next/navigation";
import AtlasOfWorldsPage from "@/app/exhibits/atlas-of-worlds/page";
import EarthPage from "@/app/exhibits/earth/page";
import MoonPage from "@/app/exhibits/moon/page";

vi.mock("next/navigation", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next/navigation")>();
  return { ...actual, permanentRedirect: vi.fn() };
});

describe("Atlas of Worlds route", () => {
  it("hydrates the instrument from a valid world query", async () => {
    render(
      await AtlasOfWorldsPage({
        searchParams: Promise.resolve({ world: "earth" }),
      }),
    );

    const worldIndex = screen.getByRole("navigation", { name: /world index/i });
    expect(within(worldIndex).getByRole("button", { name: /^earth/i })).toHaveAttribute(
      "aria-current",
      "true",
    );
  });

  it("falls back to the Moon for an invalid world query", async () => {
    render(
      await AtlasOfWorldsPage({
        searchParams: Promise.resolve({ world: "pluto" }),
      }),
    );

    const worldIndex = screen.getByRole("navigation", { name: /world index/i });
    expect(within(worldIndex).getByRole("button", { name: /^moon/i })).toHaveAttribute(
      "aria-current",
      "true",
    );
  });

  it("ships a complete non-WebGL transcript and source ledger", async () => {
    const { container } = render(
      await AtlasOfWorldsPage({ searchParams: Promise.resolve({}) }),
    );
    const transcript = container.querySelector("#atlas-transcript");

    expect(transcript).not.toBeNull();
    expect(transcript).toHaveTextContent("Sun");
    expect(transcript).toHaveTextContent("Neptune");
    expect(transcript).toHaveTextContent("Apollo 11");
    expect(transcript).toHaveTextContent(/NASA|USGS/);
    expect(within(transcript as HTMLElement).getAllByRole("article").length).toBeGreaterThanOrEqual(10);
  });

  it("permanently redirects the obsolete single-world routes", () => {
    EarthPage();
    MoonPage();

    expect(permanentRedirect).toHaveBeenCalledWith("/exhibits/atlas-of-worlds?world=earth");
    expect(permanentRedirect).toHaveBeenCalledWith("/exhibits/atlas-of-worlds?world=moon");
  });
});
