import { SCENE_KEYFRAMES } from "./scene-config";
import type { SceneKeyframe, SceneState, Vec3 } from "./types";

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const lerp = (from: number, to: number, amount: number) =>
  from + (to - from) * amount;

const lerpVec3 = (from: Vec3, to: Vec3, amount: number): Vec3 => [
  lerp(from[0], to[0], amount),
  lerp(from[1], to[1], amount),
  lerp(from[2], to[2], amount),
];

const findFramePair = (progress: number) => {
  const nextIndex = SCENE_KEYFRAMES.findIndex(
    (keyframe) => keyframe.progress > progress,
  );

  if (nextIndex === -1) {
    const last = SCENE_KEYFRAMES.at(-1)!;
    return { from: last, to: last };
  }

  if (nextIndex === 0) {
    const first = SCENE_KEYFRAMES[0];
    return { from: first, to: first };
  }

  return {
    from: SCENE_KEYFRAMES[nextIndex - 1],
    to: SCENE_KEYFRAMES[nextIndex],
  };
};

export const progressForBeat = (beatId: string) => {
  const keyframe = SCENE_KEYFRAMES.find((frame) => frame.beatId === beatId);

  if (!keyframe) {
    throw new Error(`Unknown Thirteen Minutes beat: ${beatId}`);
  }

  return keyframe.progress;
};

export const interpolateSceneState = (rawProgress: number): SceneState => {
  const progress = clamp01(rawProgress);
  const { from, to } = findFramePair(progress);
  const span = to.progress - from.progress;
  const amount = span === 0 ? 0 : (progress - from.progress) / span;

  const interpolated: SceneKeyframe = {
    beatId: from.beatId,
    progress,
    altitudeFeet: lerp(from.altitudeFeet, to.altitudeFeet, amount),
    landerPosition: lerpVec3(from.landerPosition, to.landerPosition, amount),
    landerRotation: lerpVec3(from.landerRotation, to.landerRotation, amount),
    camera: {
      position: lerpVec3(from.camera.position, to.camera.position, amount),
      target: lerpVec3(from.camera.target, to.camera.target, amount),
      fov: lerp(from.camera.fov, to.camera.fov, amount),
    },
    terrainReveal: lerp(from.terrainReveal, to.terrainReveal, amount),
    trajectoryReveal: lerp(
      from.trajectoryReveal,
      to.trajectoryReveal,
      amount,
    ),
    computerLoad: lerp(from.computerLoad, to.computerLoad, amount),
    dust: lerp(from.dust, to.dust, amount),
  };

  return {
    ...interpolated,
    nextBeatId: to.beatId,
  };
};
