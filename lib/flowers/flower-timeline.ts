import { flowerExhibit, type FlowerChapterId } from "@/content/flowers";

export interface FlowerTimelineState {
  progress: number;
  chapterIndex: number;
  chapterId: FlowerChapterId;
  localProgress: number;
  transitionProgress: number;
}
export function clampFlowerProgress(progress: number) {
  if (!Number.isFinite(progress)) return 0;
  return Math.min(1, Math.max(0, progress));
}

export function resolveFlowerTimeline(progress: number): FlowerTimelineState {
  const safeProgress = clampFlowerProgress(progress);
  const count = flowerExhibit.chapters.length;
  const scaled = safeProgress * count;
  const chapterIndex = Math.min(count - 1, Math.floor(scaled));
  const localProgress = safeProgress === 1 ? 1 : scaled - chapterIndex;

  return {
    progress: safeProgress,
    chapterIndex,
    chapterId: flowerExhibit.chapters[chapterIndex].id,
    localProgress,
    transitionProgress: smoothstep(0.04, 0.34, localProgress),
  };
}

export function progressForFlowerChapter(id: FlowerChapterId) {
  const index = flowerExhibit.chapters.findIndex((chapter) => chapter.id === id);
  if (index < 0) return 0;
  return index / flowerExhibit.chapters.length + 0.008;
}

export function flowerScrollProgress(
  scrollY: number,
  exhibitTop: number,
  exhibitHeight: number,
  viewportHeight: number,
) {
  const travel = Math.max(1, exhibitHeight - viewportHeight);
  return clampFlowerProgress((scrollY - exhibitTop) / travel);
}

export function smoothstep(edge0: number, edge1: number, value: number) {
  if (edge0 === edge1) return value < edge0 ? 0 : 1;
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}
