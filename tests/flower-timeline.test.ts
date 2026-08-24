import { describe, expect, it } from "vitest";
import {
  clampFlowerProgress,
  flowerScrollProgress,
  progressForFlowerChapter,
  resolveFlowerTimeline,
  smoothstep,
} from "@/lib/flowers/flower-timeline";

describe("flower exhibit timeline", () => {
  it("clamps invalid and out-of-range values", () => {
    expect(clampFlowerProgress(Number.NaN)).toBe(0);
    expect(clampFlowerProgress(-0.4)).toBe(0);
    expect(clampFlowerProgress(1.4)).toBe(1);
  });

  it("resolves every chapter at a stable scroll boundary", () => {
    expect(resolveFlowerTimeline(0).chapterId).toBe("form");
    expect(resolveFlowerTimeline(0.2).chapterId).toBe("inside");
    expect(resolveFlowerTimeline(0.4).chapterId).toBe("transfer");
    expect(resolveFlowerTimeline(0.6).chapterId).toBe("fertilisation");
    expect(resolveFlowerTimeline(0.8).chapterId).toBe("outcome");
    expect(resolveFlowerTimeline(1)).toMatchObject({
      chapterId: "outcome",
      localProgress: 1,
      progress: 1,
    });
  });

  it("provides usable chapter targets just inside each range", () => {
    expect(progressForFlowerChapter("form")).toBeCloseTo(0.008);
    expect(progressForFlowerChapter("transfer")).toBeGreaterThan(0.4);
    expect(resolveFlowerTimeline(progressForFlowerChapter("outcome")).chapterId).toBe(
      "outcome",
    );
  });

  it("maps document travel to a safe normalized progress", () => {
    expect(flowerScrollProgress(100, 100, 6200, 1000)).toBe(0);
    expect(flowerScrollProgress(2700, 100, 6200, 1000)).toBeCloseTo(0.5);
    expect(flowerScrollProgress(9000, 100, 6200, 1000)).toBe(1);
  });

  it("eases transitions monotonically", () => {
    expect(smoothstep(0.2, 0.8, 0)).toBe(0);
    expect(smoothstep(0.2, 0.8, 0.5)).toBeCloseTo(0.5);
    expect(smoothstep(0.2, 0.8, 1)).toBe(1);
  });
});
