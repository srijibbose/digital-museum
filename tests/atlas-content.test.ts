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

  it("gives every mode an explicit visible change and control policy", () => {
    for (const world of atlas.worlds) {
      for (const mode of world.modes) {
        expect(mode.visibleChange, `${world.id}/${mode.id} visible change`).toEqual(
          expect.any(String),
        );
        expect(mode.visibleChange.length, `${world.id}/${mode.id} visible change`).toBeGreaterThan(
          20,
        );
        expect(["hidden", "natural-survey", "angle"]).toContain(mode.lighting);
        expect(["none", "solar", "atmosphere", "clouds"]).toContain(mode.motion);
      }
    }
  });

  it("authors distinct scientific behavior for the reviewed modes", () => {
    const sun = getWorld("sun");
    const mercury = getWorld("mercury");
    const earth = getWorld("earth");
    const moon = getWorld("moon");
    const jupiter = getWorld("jupiter");

    expect(getMode(sun, "photosphere")).toMatchObject({
      lighting: "hidden",
      motion: "solar",
    });
    expect(getMode(sun, "171").legend).toEqual(
      expect.arrayContaining([expect.objectContaining({ label: "171 Å" })]),
    );
    expect(getMode(mercury, "temperature")).toMatchObject({
      effect: "temperature",
      lighting: "hidden",
    });
    expect(getMode(mercury, "missions").effect).toBe("missions");
    expect(getMode(earth, "surface").lighting).toBe("natural-survey");
    expect(getMode(earth, "night-lights").lighting).toBe("hidden");
    expect(getMode(moon, "lighting").lighting).toBe("angle");
    expect(getMode(jupiter, "storms").motion).toBe("atmosphere");
    expect(getMode(jupiter, "storms").focusHotspotId).toBe("great-red-spot");
    expect(getMode(getWorld("neptune"), "storms").focusHotspotId).toBe("great-dark-spot");
    expect(getMode(moon, "topography").reliefScale).toBeGreaterThan(
      "bumpScale" in moon.renderer ? moon.renderer.bumpScale : 0,
    );
  });

  it("only advertises ring modes when a delivered ring layer can render them", () => {
    for (const world of atlas.worlds) {
      for (const mode of world.modes.filter((candidate) => candidate.effect === "rings")) {
        expect(world.assets.layers?.rings, `${world.id}/${mode.id} ring asset`).toBeTruthy();
      }
    }
  });

  it("calibrates the Great Red Spot marker to the delivered observation map", () => {
    const jupiter = getWorld("jupiter");
    const redSpot = jupiter.hotspots.find((hotspot) => hotspot.id === "great-red-spot");
    expect((redSpot as { renderLat?: number; renderLon?: number } | undefined)).toMatchObject({
      renderLat: -18,
      renderLon: 39,
    });
  });

  it("anchors Saturn's atmospheric and ring features to different physical radii", () => {
    const saturn = getWorld("saturn");
    const hexagon = saturn.hotspots.find((hotspot) => hotspot.id === "north-hexagon");
    const division = saturn.hotspots.find((hotspot) => hotspot.id === "cassini-division");

    expect(hexagon?.renderRadius).toBeUndefined();
    expect(division?.renderRadius).toBeCloseTo(1.02);
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
