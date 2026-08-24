import type { ReactElement } from "react";
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AtlasOfWorldsPage from "@/app/exhibits/atlas-of-worlds/page";
import HumanAnatomyPage from "@/app/exhibits/human-anatomy/page";
import JetEnginePage from "@/app/exhibits/jet-engine/page";
import { getExhibitBySlug, type ExhibitDefinition } from "@/content/exhibits";

type ExhibitRouteCase = {
  slug: "atlas-of-worlds" | "human-anatomy" | "jet-engine";
  title: string;
  renderPage: () => ReactElement | Promise<ReactElement>;
};

const exhibitRoutes: ExhibitRouteCase[] = [
  {
    slug: "atlas-of-worlds",
    title: "Atlas of Worlds",
    renderPage: () => AtlasOfWorldsPage({ searchParams: Promise.resolve({}) }),
  },
  {
    slug: "human-anatomy",
    title: "Human Anatomy",
    renderPage: () => HumanAnatomyPage(),
  },
  {
    slug: "jet-engine",
    title: "The Engine Is a River",
    renderPage: () => JetEnginePage(),
  },
];

const originals = new Map<string, ExhibitDefinition["access"]>();

beforeEach(() => {
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
});

afterEach(() => {
  for (const [slug, access] of originals) {
    getExhibitBySlug(slug)!.access = access;
  }
  originals.clear();
  vi.unstubAllGlobals();
});

function setAccess(exhibit: ExhibitDefinition, access: ExhibitDefinition["access"]) {
  originals.set(exhibit.slug, exhibit.access);
  exhibit.access = access;
}

describe.each(exhibitRoutes)("$title route heading contract", ({ slug, title, renderPage }) => {
  it("has one visible exhibit h1 and one route main while public", async () => {
    const exhibit = getExhibitBySlug(slug)!;
    setAccess(exhibit, { mode: "public" });

    const { container } = render(await renderPage());
    const identity = screen.getByRole("heading", { level: 1, name: title });
    const memberContent = container.querySelector(".member-content") as HTMLElement;

    expect(identity).toBeVisible();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(container.querySelectorAll("main")).toHaveLength(1);
    expect(memberContent).not.toContainElement(identity);
  });

  it("preserves one public h1 and one route main when the instrument becomes member-only", async () => {
    const exhibit = getExhibitBySlug(slug)!;
    setAccess(exhibit, {
      mode: "members",
      gateLabel: "Members' interactive laboratory",
      gateDescription: "Sign in to use the complete interactive instrument.",
    });

    const { container } = render(await renderPage());
    const identity = screen.getByRole("heading", { level: 1, name: title });
    const memberContent = container.querySelector(".member-content") as HTMLElement;

    expect(identity).toBeVisible();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(container.querySelectorAll("main")).toHaveLength(1);
    expect(memberContent).not.toContainElement(identity);
    expect(memberContent).toContainElement(
      screen.getByRole("link", { name: "Sign in to enter" }),
    );
  });
});
