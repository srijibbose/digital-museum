import { describe, expect, it } from "vitest";
import {
  interpolateSceneState,
  progressForBeat,
} from "@/app/exhibits/thirteen-minutes/scene-state";

describe("Thirteen Minutes scene state", () => {
  it("catches a scene timeline whose named beats drift away from navigation progress", () => {
    expect(progressForBeat("approach")).toBe(0);
    expect(progressForBeat("program-alarm")).toBeCloseTo(0.4);
    expect(progressForBeat("manual-control")).toBeCloseTo(0.8);
    expect(progressForBeat("touchdown")).toBe(1);
  });

  it("catches altitude, camera, and reveal values that do not interpolate together", () => {
    const start = interpolateSceneState(0);
    const midway = interpolateSceneState(0.5);
    const end = interpolateSceneState(1);

    expect(start.altitudeFeet).toBe(49_971);
    expect(start.camera.position).toHaveLength(3);
    expect(start.terrainReveal).toBe(0.18);

    expect(midway.altitudeFeet).toBeCloseTo(31_125);
    expect(midway.beatId).toBe("program-alarm");
    expect(midway.nextBeatId).toBe("go-call");
    expect(midway.trajectoryReveal).toBeGreaterThan(start.trajectoryReveal);

    expect(end.altitudeFeet).toBe(0);
    expect(end.dust).toBe(1);
    expect(end.beatId).toBe("touchdown");
  });

  it("catches scroll overshoot that leaks invalid progress into the WebGL scene", () => {
    expect(interpolateSceneState(-1).progress).toBe(0);
    expect(interpolateSceneState(2).progress).toBe(1);
  });

  it("rejects an unknown beat instead of silently seeking to the wrong scene", () => {
    expect(() => progressForBeat("not-a-mission-beat")).toThrow(
      /Unknown Thirteen Minutes beat/i,
    );
  });
});
