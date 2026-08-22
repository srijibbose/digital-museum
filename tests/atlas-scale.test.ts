import { describe, expect, it } from "vitest";
import { comparisonRadii } from "@/lib/space/atlas-scale";

describe("Atlas comparison scale", () => {
  it("uses equal visible radii in normalized mode", () => {
    expect(comparisonRadii(6371, 1737.4, "normalized")).toEqual([1, 1]);
  });

  it("preserves the exact physical radius ratio in relative-size mode", () => {
    const [sun, earthSmall] = comparisonRadii(695700, 6371, "true-scale");
    const [earthSwapped, sunSwapped] = comparisonRadii(6371, 695700, "true-scale");

    expect(sun).toBe(1);
    expect(earthSmall).toBeCloseTo(6371 / 695700, 10);
    expect(earthSwapped).toBeCloseTo(6371 / 695700, 10);
    expect(sunSwapped).toBe(1);
    expect(sun / earthSmall).toBeCloseTo(695700 / 6371, 8);
  });

  it("keeps ordinary planet comparisons in physical proportion too", () => {
    const [jupiter, earth] = comparisonRadii(69911, 6371, "true-scale");

    expect(jupiter).toBe(1);
    expect(earth).toBeCloseTo(6371 / 69911, 10);
    expect(jupiter / earth).toBeCloseTo(69911 / 6371, 8);
  });

  it("returns equal radii for physically equal worlds", () => {
    expect(comparisonRadii(100, 100, "true-scale")).toEqual([1, 1]);
  });
});
