import * as THREE from "three";

export const FEATURE_CALLOUT_DISTANCE_FACTOR = 1.35;
import { latLonToVector3 } from "@/lib/space/geo";

/**
 * Returns the shortest rotation that brings a target surface coordinate to
 * the requested camera-facing coordinate. A camera target of 0°, 0° points
 * along +Z, which is the Atlas renderer's front-facing direction.
 */
export function focusQuaternion(
  cameraLatitude: number,
  cameraLongitude: number,
  targetLatitude: number,
  targetLongitude: number,
) {
  const target = latLonToVector3(targetLatitude, targetLongitude, 1).normalize();
  return focusVectorQuaternion(cameraLatitude, cameraLongitude, target);
}

export function focusVectorQuaternion(
  cameraLatitude: number,
  cameraLongitude: number,
  targetVector: THREE.Vector3,
) {
  const target = targetVector.clone().normalize();
  const cameraFacing = latLonToVector3(cameraLatitude, cameraLongitude, 1).normalize();
  return new THREE.Quaternion().setFromUnitVectors(target, cameraFacing).normalize();
}
