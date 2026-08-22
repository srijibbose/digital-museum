import { describe, expect, it } from "vitest";
import {
  MARS_DEEP_TIME_ANCHORS,
  MARS_DEEP_TIME_ENTRY_MYA,
  MARS_DEEP_TIME_MAX_MYA,
  clampMarsTime,
  formatMarsTime,
  marsTimeToSlider,
  resolveMarsDeepTimeState,
  sliderToMarsTime,
} from "@/lib/space/mars-deep-time";

describe("Mars Deep Time chronology", () => {
  it("authors a complete oldest-to-present sequence with a meaningful entry state", () => {
    expect(MARS_DEEP_TIME_ANCHORS.map((anchor) => anchor.timeMya)).toEqual([
      4100,
      3800,
      3500,
      3000,
      1000,
      0,
    ]);
    expect(MARS_DEEP_TIME_ENTRY_MYA).toBe(3700);
    expect(MARS_DEEP_TIME_MAX_MYA).toBe(4100);
    expect(MARS_DEEP_TIME_ANCHORS.every((anchor) => anchor.sourceIds.length > 0)).toBe(true);
  });

  it("formats scientific dates without implying false precision", () => {
    expect(formatMarsTime(4100)).toBe("4.1 billion years ago");
    expect(formatMarsTime(3700)).toBe("3.7 billion years ago");
    expect(formatMarsTime(750)).toBe("750 million years ago");
    expect(formatMarsTime(0)).toBe("Present day");
  });

  it("clamps dates and reverses the visual slider from ancient to present", () => {
    expect(clampMarsTime(-25)).toBe(0);
    expect(clampMarsTime(5000)).toBe(4100);
    expect(marsTimeToSlider(4100)).toBe(0);
    expect(marsTimeToSlider(0)).toBe(4100);
    expect(sliderToMarsTime(marsTimeToSlider(2730))).toBe(2730);
  });

  it("resolves exact anchors and clearly distinguishes interpolated dates", () => {
    const exact = resolveMarsDeepTimeState(3500);
    const between = resolveMarsDeepTimeState(3650);

    expect(exact).toMatchObject({
      timeMya: 3500,
      title: "Lake worlds",
      authored: true,
    });
    expect(between).toMatchObject({
      timeMya: 3650,
      authored: false,
      olderAnchorTimeMya: 3800,
      youngerAnchorTimeMya: 3500,
    });
    expect(between.interpolationLabel).toMatch(/interpolated between authored states/i);
  });

  it("keeps every interpolated visual parameter bounded and continuous", () => {
    const older = resolveMarsDeepTimeState(3651);
    const younger = resolveMarsDeepTimeState(3649);
    const keys = ["atmosphere", "water", "waterLine", "ice", "haze", "oxidation"] as const;

    for (const key of keys) {
      expect(older[key], key).toBeGreaterThanOrEqual(0);
      expect(older[key], key).toBeLessThanOrEqual(1);
      expect(Math.abs(older[key] - younger[key]), key).toBeLessThan(0.02);
    }
  });
});
