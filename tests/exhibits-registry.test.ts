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
  it("contains registry entries for both Living Atlas and Thirteen Minutes", () => {
    const ids = EXHIBIT_REGISTRY.map((e) => e.id);
    expect(ids).toContain("living-atlas");
    expect(ids).toContain("thirteen-minutes");
  });

  it("returns active exhibits when enabled is true", () => {
    const active = getActiveExhibits();
    expect(active.length).toBeGreaterThanOrEqual(2);
    expect(active.every((e) => e.enabled)).toBe(true);
  });

  it("keeps Living Atlas published but out of the featured lobby", () => {
    const featured = getFeaturedExhibits();

    expect(featured.map((exhibit) => exhibit.slug)).toEqual(["thirteen-minutes"]);
    expect(isExhibitEnabled("living-atlas")).toBe(true);
    expect(getActiveWings(featured).map(({ wing }) => wing.title)).toEqual([
      "Systems & Machines",
    ]);
  });

  it("can lookup exhibits by slug", () => {
    const apollo = getExhibitBySlug("thirteen-minutes");
    expect(apollo).toBeDefined();
    expect(apollo?.title).toBe("Thirteen Minutes");
    expect(apollo?.wing.code).toBe("Wing 02");
    expect(apollo?.visualTheme.variant).toBe("thirteen-minutes");

    const anatomy = getExhibitBySlug("living-atlas");
    expect(anatomy).toBeDefined();
    expect(anatomy?.title).toBe("The Living Atlas");
    expect(anatomy?.wing.code).toBe("Wing 01");
  });

  it("verifies exhibit enabled status", () => {
    expect(isExhibitEnabled("thirteen-minutes")).toBe(true);
    expect(isExhibitEnabled("living-atlas")).toBe(true);
    expect(isExhibitEnabled("non-existent-exhibit")).toBe(false);
  });

  it("aggregates active wings properly", () => {
    const wings = getActiveWings();
    expect(wings.length).toBe(2);
    const titles = wings.map((w) => w.wing.title);
    expect(titles).toContain("The Body");
    expect(titles).toContain("Systems & Machines");
  });
});
