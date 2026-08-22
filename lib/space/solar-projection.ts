export const SOLAR_DISC_U_SCALE = 0.142;
export const SOLAR_DISC_V_SCALE = 0.276;

export type SolarActivitySeed = {
  latitude: number;
  longitude: number;
  height: number;
  phase: number;
};

const SOLAR_ACTIVITY_SEEDS: SolarActivitySeed[] = [
  { latitude: -24, longitude: -128, height: 0.19, phase: 0.13 },
  { latitude: 12, longitude: -76, height: 0.24, phase: 0.37 },
  { latitude: 31, longitude: -34, height: 0.16, phase: 0.62 },
  { latitude: -8, longitude: 8, height: 0.28, phase: 0.84 },
  { latitude: -36, longitude: 42, height: 0.18, phase: 0.21 },
  { latitude: 22, longitude: 79, height: 0.23, phase: 0.48 },
  { latitude: -17, longitude: 116, height: 0.2, phase: 0.73 },
  { latitude: 38, longitude: 149, height: 0.15, phase: 0.94 },
  { latitude: 5, longitude: 177, height: 0.26, phase: 0.31 },
  { latitude: -29, longitude: -163, height: 0.17, phase: 0.56 },
  { latitude: 18, longitude: 136, height: 0.21, phase: 0.79 },
  { latitude: -42, longitude: 96, height: 0.14, phase: 0.07 },
];

const SOLAR_ACTIVITY_COUNTS: Record<string, number> = {
  photosphere: 8,
  "171": 11,
  "193": 10,
  "304": 9,
};

export function solarActivitySeeds(modeId: string, compact: boolean) {
  const authoredCount = SOLAR_ACTIVITY_COUNTS[modeId] ?? 8;
  const count = compact ? Math.min(7, authoredCount) : authoredCount;

  return SOLAR_ACTIVITY_SEEDS.slice(0, count);
}

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
