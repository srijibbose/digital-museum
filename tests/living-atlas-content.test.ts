import { describe, expect, it } from "vitest";
import {
  livingAtlasChapters,
  livingAtlasHotspots,
} from "@/content/living-atlas";

describe("Living Atlas content contract", () => {
  it("catches a missing or duplicated chapter in the six-part journey", () => {
    expect(livingAtlasChapters).toHaveLength(6);
    expect(new Set(livingAtlasChapters.map((chapter) => chapter.id)).size).toBe(6);
    expect(livingAtlasChapters.map((chapter) => chapter.id)).toEqual([
      "surface",
      "signal",
      "breath",
      "pulse",
      "fuel-motion",
      "whole",
    ]);
  });

  it("catches a chapter that cannot teach or render without hidden context", () => {
    for (const chapter of livingAtlasChapters) {
      expect(chapter.hook.length).toBeGreaterThan(10);
      expect(chapter.takeaway.length).toBeGreaterThan(10);
      expect(chapter.narration.length).toBeGreaterThan(20);
      expect(chapter.interactionLabel.length).toBeGreaterThan(2);
      expect(chapter.fallbackDescription.length).toBeGreaterThan(20);
      expect(chapter.systemIds.length).toBeGreaterThan(0);
      expect(chapter.sourceIds.length).toBeGreaterThan(0);
    }
  });

  it("catches chapter hotspot references that do not resolve", () => {
    const hotspotIds = new Set(livingAtlasHotspots.map((hotspot) => hotspot.id));
    const referencedIds = livingAtlasChapters.flatMap(
      (chapter) => chapter.hotspotIds,
    );

    for (const id of referencedIds) {
      expect(hotspotIds.has(id)).toBe(true);
    }
  });

  it("catches inaccessible or unsourced organ descriptions", () => {
    expect(livingAtlasHotspots.length).toBeGreaterThanOrEqual(7);
    for (const hotspot of livingAtlasHotspots) {
      expect(hotspot.label.length).toBeGreaterThan(2);
      expect(hotspot.accessibleDescription.length).toBeGreaterThan(30);
      expect(hotspot.function.length).toBeGreaterThan(20);
      expect(hotspot.sourceIds.length).toBeGreaterThan(0);
    }
  });
});
