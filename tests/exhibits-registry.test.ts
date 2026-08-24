import { describe, it, expect } from "vitest";
import {
  EXHIBIT_REGISTRY,
  getActiveExhibits,
  getExhibitBySlug,
  getFeaturedExhibits,
  isExhibitEnabled,
  getActiveWings,
} from "@/content/exhibits";

describe("Exhibit Registry & Plug-and-Play System", () => {
  it("contains the active flagship exhibit entries", () => {
    const ids = EXHIBIT_REGISTRY.map((e) => e.id);
    expect(ids).toContain("thirteen-minutes");
    expect(ids).toContain("becoming-human");
    expect(ids).toContain("atlas-of-worlds");
    expect(ids).toContain("human-anatomy");
  });

  it("returns active exhibits when enabled is true", () => {
    const active = getActiveExhibits();
    expect(active.length).toBeGreaterThanOrEqual(2);
    expect(active.every((e) => e.enabled)).toBe(true);
    expect(active.every((e) => e.durationMinutes > 0)).toBe(true);
    expect(active.every((e) => e.formats.length > 0)).toBe(true);
  });

  it("returns the featured lobby exhibits", () => {
    const featured = getFeaturedExhibits();

    expect(featured.map((exhibit) => exhibit.slug)).toEqual([
      "human-anatomy",
      "becoming-human",
      "jet-engine",
      "thirteen-minutes",
      "atlas-of-worlds",
    ]);
    expect(featured.map((exhibit) => exhibit.slug)).not.toContain("moon");
    expect(featured.map((exhibit) => exhibit.slug)).not.toContain("earth");
    expect(getActiveWings(featured).map(({ wing }) => wing.title)).toEqual([
      "The Body",
      "Origins & Futures",
      "Systems & Machines",
      "Space",
    ]);
  });

  it("can lookup exhibits by slug", () => {
    const apollo = getExhibitBySlug("thirteen-minutes");
    expect(apollo).toBeDefined();
    expect(apollo?.title).toBe("Thirteen Minutes");
    expect(apollo?.wing.code).toBe("Wing 02");
    expect(apollo?.visualTheme.variant).toBe("thirteen-minutes");

    expect(getExhibitBySlug("living-atlas")).toBeUndefined();
    expect(getExhibitBySlug("human-anatomy")?.visualTheme.variant).toBe("human-anatomy");
  });

  it("verifies exhibit enabled status", () => {
    expect(isExhibitEnabled("thirteen-minutes")).toBe(true);
    expect(isExhibitEnabled("living-atlas")).toBe(false);
    expect(isExhibitEnabled("human-anatomy")).toBe(true);
    expect(isExhibitEnabled("non-existent-exhibit")).toBe(false);
  });

  it("aggregates active wings properly", () => {
    const wings = getActiveWings();
    expect(wings.length).toBe(4);
    const titles = wings.map((w) => w.wing.title);
    expect(titles).toContain("The Body");
    expect(titles).toContain("Systems & Machines");
    expect(titles).toContain("Origins & Futures");
    expect(titles).toContain("Space");
    expect(wings.map(({ wing }) => wing.slug)).toEqual([
      "body",
      "origins-futures",
      "systems-machines",
      "space",
    ]);
  });
});
