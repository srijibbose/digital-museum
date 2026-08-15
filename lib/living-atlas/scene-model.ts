import type { ChapterId } from "@/lib/living-atlas/schema";

export type SceneState = {
  skin: number;
  nervous: number;
  respiratory: number;
  circulatory: number;
  digestive: number;
  skeletal: number;
  muscular: number;
};

const sceneStates: Record<ChapterId, SceneState> = {
  surface: {
    skin: 0.82,
    nervous: 0.08,
    respiratory: 0.04,
    circulatory: 0.05,
    digestive: 0.03,
    skeletal: 0.04,
    muscular: 0.03,
  },
  signal: {
    skin: 0.12,
    nervous: 1,
    respiratory: 0.05,
    circulatory: 0.08,
    digestive: 0.04,
    skeletal: 0.05,
    muscular: 0.03,
  },
  breath: {
    skin: 0.11,
    nervous: 0.08,
    respiratory: 1,
    circulatory: 0.36,
    digestive: 0.04,
    skeletal: 0.1,
    muscular: 0.06,
  },
  pulse: {
    skin: 0.09,
    nervous: 0.06,
    respiratory: 0.28,
    circulatory: 1,
    digestive: 0.04,
    skeletal: 0.05,
    muscular: 0.04,
  },
  "fuel-motion": {
    skin: 0.08,
    nervous: 0.12,
    respiratory: 0.12,
    circulatory: 0.28,
    digestive: 1,
    skeletal: 0.72,
    muscular: 0.9,
  },
  whole: {
    skin: 0.7,
    nervous: 0.92,
    respiratory: 0.88,
    circulatory: 0.94,
    digestive: 0.82,
    skeletal: 0.68,
    muscular: 0.74,
  },
};

export function getSceneState(chapterId: ChapterId): SceneState {
  return sceneStates[chapterId];
}
