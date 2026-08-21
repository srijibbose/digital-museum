import * as THREE from "three";
import { describe, expect, it } from "vitest";
import { latLonToVector3 } from "@/lib/space/geo";
import {
  FEATURE_CALLOUT_DISTANCE_FACTOR,
  focusQuaternion,
  focusVectorQuaternion,
} from "@/lib/space/world-focus";

describe("Atlas world focus", () => {
  it("keeps anchored labels compact instead of scaling them across the globe", () => {
    expect(FEATURE_CALLOUT_DISTANCE_FACTOR).toBeLessThanOrEqual(1.5);
  });

  it("rotates a selected latitude and longitude to face the camera", () => {
    const quaternion = focusQuaternion(0, 0, 12, -18);
    const point = latLonToVector3(12, -18, 1).applyQuaternion(quaternion);

    expect(point.x).toBeCloseTo(0, 4);
    expect(point.y).toBeCloseTo(0, 4);
    expect(point.z).toBeGreaterThan(0.99);
  });

  it("focuses a point after authored axial and presentation rotations", () => {
    const point = latLonToVector3(78, 0, 1)
      .applyAxisAngle(new THREE.Vector3(1, 0, 0), 0.45)
      .applyAxisAngle(new THREE.Vector3(0, 0, 1), 0.47);
    const quaternion = focusVectorQuaternion(0, 0, point);

    point.applyQuaternion(quaternion);
    expect(point.x).toBeCloseTo(0, 4);
    expect(point.y).toBeCloseTo(0, 4);
    expect(point.z).toBeGreaterThan(0.99);
  });
});
