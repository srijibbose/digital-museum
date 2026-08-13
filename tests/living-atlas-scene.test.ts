import { describe, expect, it } from "vitest";
import { getSceneState } from "@/lib/living-atlas/scene-model";

describe("Living Atlas scene direction", () => {
  it("catches a signal chapter that does not isolate the nervous system", () => {
    expect(getSceneState("signal")).toEqual({
      skin: 0.12,
      nervous: 1,
      respiratory: 0.05,
      circulatory: 0.08,
      digestive: 0.04,
      skeletal: 0.05,
      muscular: 0.03,
    });
  });

  it("catches a breath chapter that hides the respiratory-circulatory relationship", () => {
    const state = getSceneState("breath");
    expect(state.respiratory).toBe(1);
    expect(state.circulatory).toBeGreaterThanOrEqual(0.34);
    expect(state.nervous).toBeLessThan(0.12);
  });

  it("catches a finale that fails to bring every system back", () => {
    const state = getSceneState("whole");
    expect(Object.values(state).every((opacity) => opacity >= 0.68)).toBe(true);
  });
});
