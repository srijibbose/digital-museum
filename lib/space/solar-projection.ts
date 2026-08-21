export const SOLAR_DISC_U_SCALE = 0.142;
export const SOLAR_DISC_V_SCALE = 0.276;

export function solarDiscUv(normalX: number, normalY: number) {
  return {
    u: Number((0.5 + normalX * SOLAR_DISC_U_SCALE).toFixed(3)),
    v: Number((0.5 - normalY * SOLAR_DISC_V_SCALE).toFixed(3)),
  };
}

export function solarFlowPulse(elapsedSeconds: number) {
  const pulse = Math.sin(elapsedSeconds * 0.8);

  return {
    scale: Number((1.004 + pulse * 0.0015).toFixed(4)),
    opacity: Number((0.12 + pulse * 0.02).toFixed(3)),
  };
}

export function solarSurfaceProjection(normalX: number, normalY: number, normalZ: number) {
  const sign = (value: number) => value < 0 ? -1 : 1;
  const rawWeights = {
    x: Math.abs(normalX) ** 4,
    y: Math.abs(normalY) ** 4,
    z: Math.abs(normalZ) ** 4,
  };
  const weightTotal = rawWeights.x + rawWeights.y + rawWeights.z || 1;
  const weights = {
    x: Number((rawWeights.x / weightTotal).toFixed(2)),
    y: Number((rawWeights.y / weightTotal).toFixed(2)),
    z: Number((rawWeights.z / weightTotal).toFixed(2)),
  };
  const samples = {
    x: solarDiscUv(normalZ * sign(normalX), normalY),
    y: solarDiscUv(normalX, normalZ * sign(normalY)),
    z: solarDiscUv(normalX * sign(normalZ), normalY),
  };
  const dominantAxis = (Object.keys(rawWeights) as Array<keyof typeof rawWeights>)
    .reduce((dominant, axis) => rawWeights[axis] > rawWeights[dominant] ? axis : dominant);

  return {
    dominantAxis,
    dominantUv: samples[dominantAxis],
    weights,
  };
}
