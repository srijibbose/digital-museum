import { describe, expect, it } from "vitest";
import { SOLAR_DISC_VERTEX_SHADER, solarDiscUv, solarFlowPulse } from "@/lib/space/solar-projection";

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

  it("projects the observed disc in view space so rotation cannot expose its planar limb", () => {
    expect(SOLAR_DISC_VERTEX_SHADER).toContain("normalMatrix * normal");
    expect(SOLAR_DISC_VERTEX_SHADER).not.toContain("normalize(normal);");
  });
});
