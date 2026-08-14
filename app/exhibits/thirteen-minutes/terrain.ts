import type { Vec3 } from "./types";

export type TerrainQuality = "low" | "high";

export type TerrainBoulder = {
  position: Vec3;
  rotation: Vec3;
  scale: Vec3;
};

export type TerrainData = {
  positions: Float32Array;
  indices: Uint32Array;
  boulders: TerrainBoulder[];
  anchors: {
    westCrater: readonly [number, number];
    landingSite: readonly [number, number];
    plannedSite: readonly [number, number];
  };
  segments: number;
};

const WEST_CRATER = { x: 8, z: -7, radius: 3.8, depth: 2.25 } as const;

const seededWave = (x: number, z: number, seed: number) =>
  0.18 * Math.sin(x * 0.34 + seed * 0.13) * Math.cos(z * 0.27 - seed * 0.07) +
  0.07 * Math.sin(x * 1.1 + z * 0.63 + seed);

function crater(
  x: number,
  z: number,
  cx: number,
  cz: number,
  radius: number,
  depth: number,
) {
  const distance = Math.hypot(x - cx, z - cz);
  const bowl = -depth * Math.exp(-((distance / (radius * 0.62)) ** 2));
  const rim =
    depth *
    0.29 *
    Math.exp(-(((distance - radius) / (radius * 0.14)) ** 2));
  return bowl + rim;
}

export function sampleTerrainHeight(x: number, z: number, seed = 11) {
  return (
    -1.48 +
    seededWave(x, z, seed) +
    crater(x, z, WEST_CRATER.x, WEST_CRATER.z, WEST_CRATER.radius, WEST_CRATER.depth) +
    crater(x, z, -10, -18, 5.1, 1.4) +
    crater(x, z, 15, 3, 2.1, 0.55)
  );
}

function createRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1_664_525 + 1_013_904_223) >>> 0;
    return state / 4_294_967_296;
  };
}

export const PLANNED_TRAJECTORY: readonly Vec3[] = [
  [-12, 12, 16],
  [-7, 8, 8],
  [-1, 3.6, -1],
  [4.5, -0.9, -7.5],
];

export const ACTUAL_TRAJECTORY: readonly Vec3[] = [
  [-12, 12, 16],
  [-5, 8.5, 9],
  [3.8, 3, -1],
  [8.2, 1.3, -7],
  [11.5, -0.9, -13],
];

export function createTerrain(
  seed = 11,
  quality: TerrainQuality = "high",
): TerrainData {
  const segments = quality === "high" ? 72 : 34;
  const stride = segments + 1;
  const positions = new Float32Array(stride * stride * 3);
  const indices = new Uint32Array(segments * segments * 6);
  const width = 48;
  const depth = 50;
  let positionOffset = 0;
  let indexOffset = 0;

  for (let row = 0; row <= segments; row += 1) {
    const z = -30 + (depth * row) / segments;
    for (let column = 0; column <= segments; column += 1) {
      const x = -24 + (width * column) / segments;
      positions[positionOffset] = x;
      positions[positionOffset + 1] = sampleTerrainHeight(x, z, seed);
      positions[positionOffset + 2] = z;
      positionOffset += 3;
    }
  }

  for (let row = 0; row < segments; row += 1) {
    for (let column = 0; column < segments; column += 1) {
      const topLeft = row * stride + column;
      const topRight = topLeft + 1;
      const bottomLeft = topLeft + stride;
      const bottomRight = bottomLeft + 1;
      indices.set(
        [topLeft, bottomLeft, topRight, topRight, bottomLeft, bottomRight],
        indexOffset,
      );
      indexOffset += 6;
    }
  }

  const random = createRandom(seed);
  const boulderCount = quality === "high" ? 74 : 24;
  const boulders: TerrainBoulder[] = [];

  while (boulders.length < boulderCount) {
    const x = -21 + random() * 42;
    const z = -27 + random() * 44;
    const distanceFromLanding = Math.hypot(x - 11.5, z + 13);
    if (distanceFromLanding < 2.3) continue;
    const scale = 0.11 + random() * 0.46;
    boulders.push({
      position: [x, sampleTerrainHeight(x, z, seed) + scale * 0.32, z],
      rotation: [random() * Math.PI, random() * Math.PI, random() * Math.PI],
      scale: [scale, scale * (0.55 + random() * 0.4), scale * (0.7 + random() * 0.5)],
    });
  }

  return {
    positions,
    indices,
    boulders,
    anchors: {
      westCrater: [WEST_CRATER.x, WEST_CRATER.z],
      landingSite: [11.5, -13],
      plannedSite: [4.5, -7.5],
    },
    segments,
  };
}
