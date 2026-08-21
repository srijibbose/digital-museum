import * as THREE from "three";
import { describe, expect, it } from "vitest";
import { applyRadialRingUvs, SATURN_RING_TILT_RADIANS } from "@/lib/space/ring-geometry";

describe("Atlas ring geometry", () => {
  it("presents the rings as a readable ellipse instead of an edge-on stripe", () => {
    expect(SATURN_RING_TILT_RADIANS).toBeGreaterThan(1);
    expect(SATURN_RING_TILT_RADIANS).toBeLessThan(1.3);
  });

  it("maps the radial distance to the texture's horizontal axis", () => {
    const geometry = new THREE.RingGeometry(1.2, 2.25, 16);
    applyRadialRingUvs(geometry, 1.2, 2.25);

    const positions = geometry.getAttribute("position");
    const uvs = geometry.getAttribute("uv");
    for (let index = 0; index < positions.count; index += 1) {
      const radius = Math.hypot(positions.getX(index), positions.getY(index));
      expect(uvs.getX(index)).toBeCloseTo((radius - 1.2) / 1.05, 4);
      expect(uvs.getY(index)).toBeCloseTo(0.5, 4);
    }
  });
});
