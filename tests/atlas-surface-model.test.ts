import { describe, expect, it } from "vitest";
import {
  officialSaturnScale,
  rotationAxisVisible,
  SATURN_MODEL_TILT_RADIANS,
  surfaceModelKind,
} from "@/lib/space/surface-model";

describe("Atlas surface model selection", () => {
  it("uses NASA's complete Saturn model unless the interior cutaway is active", () => {
    expect(surfaceModelKind("saturn", false)).toBe("official-saturn");
    expect(surfaceModelKind("saturn", true)).toBe("procedural");
    expect(surfaceModelKind("jupiter", false)).toBe("procedural");
  });

  it("frames the complete ring system as a readable tilted ellipse", () => {
    expect(officialSaturnScale(1)).toBe(1 / 980);
    expect(SATURN_MODEL_TILT_RADIANS).toBeGreaterThan(0.4);
    expect(SATURN_MODEL_TILT_RADIANS).toBeLessThan(0.5);
  });

  it("shows a calibrated rotation-axis guide only for axial-tilt mode", () => {
    expect(rotationAxisVisible("tilt")).toBe(true);
    expect(rotationAxisVisible("surface")).toBe(false);
    expect(rotationAxisVisible("interior")).toBe(false);
  });
});
