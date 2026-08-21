import { describe, expect, it } from "vitest";
import { comparisonRadii } from "@/lib/space/atlas-scale";

describe("Atlas comparison scale", () => {
  it("uses equal visible radii in normalized mode", () => {
    expect(comparisonRadii(6371, 1737.4, "normalized")).toEqual([1, 1]);
  });

  it("preserves relative order without making extreme comparisons unusable", () => {
    const [sun, mercurySmall] = comparisonRadii(695700, 2439.7, "true-scale");
    const [mercurySwapped, sunSwapped] = comparisonRadii(2439.7, 695700, "true-scale");

    expect(sun).toBeGreaterThan(mercurySmall);
    expect(mercurySmall).toBe(1);
    expect(mercurySwapped).toBe(1);
    expect(sun).toBeLessThanOrEqual(2.8);
    expect(sunSwapped).toBe(sun);
  });

  it("returns equal radii for physically equal worlds", () => {
    expect(comparisonRadii(100, 100, "true-scale")).toEqual([1, 1]);
  });
});
