import { describe, expect, it } from "vitest";
import {
  atlas,
  getMode,
  getVisibleHotspots,
  getWorld,
} from "@/content/space/atlas";

describe("Atlas of Worlds content collection", () => {
  it("contains the complete ordered Solar System collection", () => {
    expect(atlas.worlds.map((world) => world.id)).toEqual([
      "sun",
      "mercury",
      "venus",
      "earth",
      "moon",
      "mars",
      "jupiter",
      "saturn",
      "uranus",
      "neptune",
    ]);
  });

  it("gives every world a useful scientific instrument", () => {
    for (const world of atlas.worlds) {
      expect(world.modes.length, `${world.id} modes`).toBeGreaterThanOrEqual(5);
      expect(world.hotspots.length, `${world.id} hotspots`).toBeGreaterThanOrEqual(3);
      expect(world.sources.length, `${world.id} sources`).toBeGreaterThan(0);
      expect(world.renderer.kind).toMatch(/^(solid|earth|venus|gas|rings|sun)$/);
      expect(world.modes.some((mode) => mode.id === world.defaultModeId)).toBe(true);
      expect(world.assets.color).toMatch(/^\/media\/space\/atlas\//);
      expect(world.assets.fallback).toMatch(/^\/media\/space\/atlas\//);
    }
  });

  it("filters hotspots by the active world-specific mode", () => {
    const moon = getWorld("moon");
    const missionSites = getVisibleHotspots(moon, "missions");

    expect(missionSites.map((hotspot) => hotspot.id)).toEqual([
      "apollo-11",
      "chandrayaan-3",
    ]);
    expect(
      missionSites.every((hotspot) => hotspot.modeIds.includes("missions")),
    ).toBe(true);
  });

  it("resolves modes and falls back to each world's authored default", () => {
    const earth = getWorld("earth");

    expect(getMode(earth, "night-lights").label).toBe("Night lights");
    expect(getMode(earth, "not-a-mode").id).toBe("surface");
  });

  it("links every hotspot to evidence and source records on its world", () => {
    for (const world of atlas.worlds) {
      const sourceIds = new Set(world.sources.map((source) => source.id));
      const modeIds = new Set(world.modes.map((mode) => mode.id));

      for (const hotspot of world.hotspots) {
        expect(["observed", "processed", "inferred", "illustrative"]).toContain(
          hotspot.evidence,
        );
        expect(hotspot.sourceIds.every((id) => sourceIds.has(id))).toBe(true);
        expect(hotspot.modeIds.every((id) => modeIds.has(id))).toBe(true);
      }
    }
  });
});
