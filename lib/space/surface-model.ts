import type { WorldId, WorldMode } from "@/lib/space/atlas-schema";

export type SurfaceModelKind = "official-saturn" | "procedural";

const SATURN_AUTHORED_RADIUS = 500;
const SATURN_FRAME_RADIUS = 980;

export const SATURN_MODEL_TILT_RADIANS = Math.PI / 2 - 1.12;

export function officialSaturnScale(stageRadius: number) {
  return stageRadius / SATURN_FRAME_RADIUS;
}

export function officialSaturnGlobeRadius(stageRadius: number) {
  return SATURN_AUTHORED_RADIUS * officialSaturnScale(stageRadius);
}

export function rotationAxisVisible(effect: WorldMode["effect"]) {
  return effect === "tilt";
}

export function surfaceModelKind(
  worldId: WorldId,
  interior: boolean,
): SurfaceModelKind {
  return worldId === "saturn" && !interior ? "official-saturn" : "procedural";
}
