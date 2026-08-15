import { describe, expect, it } from "vitest";
import {
  ACTUAL_TRAJECTORY,
  PLANNED_TRAJECTORY,
  createTerrain,
  sampleTerrainHeight,
} from "@/app/exhibits/thirteen-minutes/terrain";

describe("Thirteen Minutes lunar terrain", () => {
  it("catches terrain that changes shape between renders", () => {
    const first = createTerrain(11, "high");
    const second = createTerrain(11, "high");

    expect(Array.from(first.positions.slice(0, 48))).toEqual(
      Array.from(second.positions.slice(0, 48)),
    );
    expect(Array.from(first.indices.slice(-24))).toEqual(
      Array.from(second.indices.slice(-24)),
    );
    expect(first.anchors.westCrater).toEqual([8, -7]);
    expect(first.anchors.landingSite).toEqual([11.5, -13]);
  });

  it("catches a mobile quality tier that retains desktop geometry density", () => {
    const low = createTerrain(11, "low");
    const high = createTerrain(11, "high");

    expect(low.positions.length).toBeLessThan(high.positions.length);
    expect(low.boulders.length).toBeLessThan(high.boulders.length);
  });

  it("catches West Crater losing its spatial relationship to the surrounding rim", () => {
    const floor = sampleTerrainHeight(8, -7, 11);
    const rim = sampleTerrainHeight(11.8, -7, 11);

    expect(floor).toBeLessThan(rim - 0.5);
  });

  it("catches planned and actual paths that land in the same place", () => {
    expect(PLANNED_TRAJECTORY.at(-1)).toEqual([4.5, -0.9, -7.5]);
    expect(ACTUAL_TRAJECTORY.at(-1)).toEqual([11.5, -0.9, -13]);
  });
});
