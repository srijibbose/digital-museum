import { describe, expect, it } from "vitest";
import { resolveMarsDeepTimeState } from "@/lib/space/mars-deep-time";
import { resolveMarsDeepTimeRender } from "@/lib/space/mars-deep-time-render";

describe("Mars deep-time rendering model", () => {
  it("turns the wet Noachian record into a restrained, topography-guided water layer", () => {
    const wet = resolveMarsDeepTimeRender(resolveMarsDeepTimeState(3800));
    const present = resolveMarsDeepTimeRender(resolveMarsDeepTimeState(0));

    expect(wet.waterOpacity).toBeGreaterThan(0.55);
    expect(wet.waterRadiusScale).toBeGreaterThan(present.waterRadiusScale);
    expect(wet.waterLevel - present.waterLevel).toBeGreaterThan(0.05);
    expect(present.waterOpacity).toBe(0);
  });

  it("moves continuously toward a thinner, more oxidised present atmosphere", () => {
    const ancient = resolveMarsDeepTimeRender(resolveMarsDeepTimeState(4100));
    const middle = resolveMarsDeepTimeRender(resolveMarsDeepTimeState(2050));
    const present = resolveMarsDeepTimeRender(resolveMarsDeepTimeState(0));

    expect(ancient.atmosphereOpacity).toBeGreaterThan(middle.atmosphereOpacity);
    expect(middle.atmosphereOpacity).toBeGreaterThan(present.atmosphereOpacity);
    expect(ancient.surfaceOxidation).toBeLessThan(middle.surfaceOxidation);
    expect(middle.surfaceOxidation).toBeLessThan(present.surfaceOxidation);
  });

  it("makes the authored atmospheric and ice extremes perceptually distinct", () => {
    const wet = resolveMarsDeepTimeRender(resolveMarsDeepTimeState(3800));
    const iceCycles = resolveMarsDeepTimeRender(resolveMarsDeepTimeState(1000));
    const present = resolveMarsDeepTimeRender(resolveMarsDeepTimeState(0));

    expect(wet.atmosphereOpacity).toBeGreaterThan(0.12);
    expect(wet.hazeOpacity).toBeGreaterThan(0.06);
    expect(iceCycles.iceOpacity).toBeGreaterThan(0.35);
    expect(present.waterOpacity).toBe(0);
    expect(present.iceOpacity).toBe(0);
    expect(present.hazeOpacity).toBe(0);
  });

  it("keeps every material parameter within safe compositing bounds", () => {
    for (let time = 0; time <= 4100; time += 25) {
      const render = resolveMarsDeepTimeRender(resolveMarsDeepTimeState(time));
      expect(render.waterOpacity).toBeGreaterThanOrEqual(0);
      expect(render.waterOpacity).toBeLessThanOrEqual(0.8);
      expect(render.iceOpacity).toBeGreaterThanOrEqual(0);
      expect(render.iceOpacity).toBeLessThanOrEqual(0.5);
      expect(render.hazeOpacity).toBeLessThanOrEqual(0.1);
      expect(render.atmosphereOpacity).toBeLessThanOrEqual(0.18);
    }
  });
});
