import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import AtlasOfWorldsPage from "@/app/exhibits/atlas-of-worlds/page";
import { getExhibitBySlug } from "@/content/exhibits";
import nextConfig from "@/next.config";

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

  it("falls back to Venus for an invalid world query", async () => {
    render(
      await AtlasOfWorldsPage({
        searchParams: Promise.resolve({ world: "pluto" }),
      }),
    );

    const worldIndex = screen.getByRole("navigation", { name: /world index/i });
    expect(within(worldIndex).getByRole("button", { name: /^venus/i })).toHaveAttribute(
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
    expect(transcript).toHaveTextContent("Mars deep-time states");
    expect(transcript).toHaveTextContent("Valley networks");
    expect(transcript).toHaveTextContent("Constrained reconstruction");
    expect(transcript).toHaveTextContent(/NASA|USGS/);
    expect(within(transcript as HTMLElement).getAllByRole("article").length).toBeGreaterThanOrEqual(10);

    const memberContent = container.querySelector(".member-content");
    expect(memberContent).toContainElement(
      screen.getByRole("navigation", { name: /world index/i }),
    );
    expect(memberContent).not.toContainElement(transcript as HTMLElement);
  });

  it("keeps the Atlas identity, reading edition, and sources public for member access", async () => {
    const exhibit = getExhibitBySlug("atlas-of-worlds")!;
    const originalAccess = exhibit.access;
    exhibit.access = {
      mode: "members",
      gateLabel: "Members' observatory",
      gateDescription: "Sign in to use the interactive planetary instrument.",
    };

    try {
      const { container } = render(
        await AtlasOfWorldsPage({ searchParams: Promise.resolve({}) }),
      );
      const memberContent = container.querySelector(".member-content");
      const transcript = container.querySelector("#atlas-transcript") as HTMLElement;
      const sources = container.querySelector("#atlas-sources") as HTMLElement;

      expect(screen.getByRole("heading", { level: 1, name: exhibit.title })).toBeVisible();
      expect(screen.getByText(exhibit.tagline)).toBeVisible();
      expect(screen.getByText(exhibit.synopsis)).toBeVisible();
      expect(screen.queryByTestId("atlas-instrument")).not.toBeInTheDocument();
      expect(screen.getByRole("link", { name: /sign in to enter/i })).toHaveAttribute(
        "href",
        "/sign-in?returnTo=%2Fexhibits%2Fatlas-of-worlds",
      );
      expect(transcript).toBeVisible();
      expect(sources).toBeVisible();
      expect(memberContent).not.toContainElement(transcript);
      expect(memberContent).not.toContainElement(sources);
    } finally {
      exhibit.access = originalAccess;
    }
  });

  it("configures permanent HTTP redirects for obsolete single-world routes", async () => {
    const redirects = await nextConfig.redirects?.();

    expect(redirects).toEqual(
      expect.arrayContaining([
        {
          source: "/exhibits/earth",
          destination: "/exhibits/atlas-of-worlds?world=earth",
          permanent: true,
        },
        {
          source: "/exhibits/moon",
          destination: "/exhibits/atlas-of-worlds?world=moon",
          permanent: true,
        },
      ]),
    );
  });
});
