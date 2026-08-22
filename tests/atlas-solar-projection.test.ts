import { describe, expect, it } from "vitest";
import {
  solarActivitySeeds,
  solarDiscUv,
  solarFlowPulse,
  solarSurfaceProjection,
} from "@/lib/space/solar-projection";

describe("Atlas solar-disc projection", () => {
  it("keeps the full visible hemisphere inside the observed central solar disc", () => {
    expect(solarDiscUv(0, 0)).toEqual({ u: 0.5, v: 0.5 });
    expect(solarDiscUv(-1, -1)).toEqual({ u: 0.358, v: 0.776 });
    expect(solarDiscUv(1, 1)).toEqual({ u: 0.642, v: 0.224 });
  });

  it("animates brightness without rotating the observational map", () => {
    expect(solarFlowPulse(0)).toEqual({ scale: 1.004, opacity: 0.12 });
    expect(solarFlowPulse(Math.PI / 1.6)).toEqual({ scale: 1.0055, opacity: 0.14 });
  });

  it("changes projection planes as the rotating surface approaches a photographed limb", () => {
    expect(solarSurfaceProjection(0.6, 0, 0.8)).toEqual({
      dominantAxis: "z",
      dominantUv: { u: 0.585, v: 0.5 },
      weights: { x: 0.24, y: 0, z: 0.76 },
    });
    expect(solarSurfaceProjection(0.8, 0, -0.6)).toEqual({
      dominantAxis: "x",
      dominantUv: { u: 0.415, v: 0.5 },
      weights: { x: 0.76, y: 0, z: 0.24 },
    });
  });

  it("authors deterministic solar activity without changing the corrected disc projection", () => {
    expect(solarActivitySeeds("171", false).slice(0, 2)).toEqual([
      { latitude: -24, longitude: -128, height: 0.19, phase: 0.13 },
      { latitude: 12, longitude: -76, height: 0.24, phase: 0.37 },
    ]);
    expect(solarActivitySeeds("171", true)).toHaveLength(7);
    expect(solarActivitySeeds("171", false)).toHaveLength(11);
    expect(solarDiscUv(1, 1)).toEqual({ u: 0.642, v: 0.224 });
  });
});
