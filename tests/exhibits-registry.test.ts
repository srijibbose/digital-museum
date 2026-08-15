import { describe, expect, it } from "vitest";
import {
  EXHIBITS,
  getActiveExhibits,
  getActiveWings,
  getExhibitById,
} from "@/content/exhibits";

describe("museum exhibit registry", () => {
  it("publishes Apollo and Full Throttle in the intended lobby order", () => {
    expect(getActiveExhibits().map((exhibit) => exhibit.id)).toEqual([
      "thirteen-minutes",
      "full-throttle",
    ]);
  });

  it("keeps Living Atlas directly routable while hiding it from the lobby", () => {
    const anatomy = getExhibitById("living-atlas");

    expect(anatomy).toMatchObject({
      href: "/exhibits/living-atlas",
      status: "hidden",
    });
    expect(getActiveExhibits()).not.toContainEqual(anatomy);
  });

  it("provides complete, unique metadata for every published card", () => {
    const active = getActiveExhibits();

    expect(new Set(active.map((exhibit) => exhibit.number)).size).toBe(active.length);
    expect(new Set(active.map((exhibit) => exhibit.href)).size).toBe(active.length);

    for (const exhibit of active) {
      expect(exhibit.href).toMatch(/^\/exhibits\/[a-z0-9-]+$/);
      expect(exhibit.metrics).toHaveLength(3);
      expect(exhibit.tagline.trim().length).toBeGreaterThan(12);
      expect(exhibit.synopsis.trim().length).toBeGreaterThan(40);
      expect(["thirteen-minutes", "full-throttle"]).toContain(exhibit.poster);
    }
  });

  it("derives the visible wing directory without hidden-only wings", () => {
    expect(getActiveWings()).toEqual([
      {
        count: 2,
        wing: { id: "systems-and-machines", title: "Systems & Machines" },
      },
    ]);
    expect(EXHIBITS).toHaveLength(3);
  });
});
