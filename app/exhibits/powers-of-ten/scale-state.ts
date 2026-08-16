import type { ScaleStop } from "./types";

export function progressToIndex(progress: number, count: number) {
  return Math.min(count - 1, Math.max(0, Math.round(progress * (count - 1))));
}

export function progressToStop(progress: number, stops: readonly ScaleStop[]) {
  return stops[progressToIndex(progress, stops.length)];
}

export function indexToProgress(index: number, count: number) {
  return count <= 1 ? 0 : Math.min(1, Math.max(0, index / (count - 1)));
}
