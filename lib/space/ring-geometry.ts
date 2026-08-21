import * as THREE from "three";

export const SATURN_RING_TILT_RADIANS = 1.12;

export function applyRadialRingUvs(
  geometry: THREE.RingGeometry,
  innerRadius: number,
  outerRadius: number,
) {
  const position = geometry.getAttribute("position");
  const uv = geometry.getAttribute("uv");
  const radialSpan = Math.max(Number.EPSILON, outerRadius - innerRadius);

  for (let index = 0; index < position.count; index += 1) {
    const radius = Math.hypot(position.getX(index), position.getY(index));
    const normalizedRadius = THREE.MathUtils.clamp(
      (radius - innerRadius) / radialSpan,
      0,
      1,
    );
    uv.setXY(index, normalizedRadius, 0.5);
  }

  uv.needsUpdate = true;
  return geometry;
}
