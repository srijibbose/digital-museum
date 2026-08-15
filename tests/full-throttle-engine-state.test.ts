import { describe, expect, it } from "vitest";
import {
  AIRFLOW_STAGE_ANCHORS,
  deriveEngineState,
} from "@/app/exhibits/full-throttle/engine-state";

const baseInput = {
  phase: "parts" as const,
  explode: 0,
  airflowProgress: 0,
  throttle: 0,
  selectedPart: null,
  reducedMotion: false,
  elapsedSeconds: 0,
};

describe("Full Throttle engine state", () => {
  it("separates all seven parts along the shaft without losing any part", () => {
    const state = deriveEngineState({ ...baseInput, explode: 1 });

    expect(Object.keys(state.parts)).toHaveLength(7);
    expect(state.parts.fan.offset).toBe(-2.4);
    expect(state.parts.nozzle.offset).toBe(2.4);
    expect(state.parts["hp-compressor"].offset).toBeLessThan(
      state.parts.combustor.offset,
    );
  });

  it("keeps spatial context while isolating a selected part", () => {
    const state = deriveEngineState({
      ...baseInput,
      explode: 1,
      selectedPart: "hp-turbine",
    });

    expect(state.parts["hp-turbine"]).toMatchObject({
      highlighted: true,
      opacity: 1,
    });
    expect(state.parts.fan.opacity).toBe(0.18);
  });

  it.each([
    [0, "intake-fan"],
    [0.25, "compression"],
    [0.5, "combustion"],
    [0.75, "turbine"],
    [1, "exhaust-thrust"],
  ] as const)("maps airflow progress %s to %s", (progress, stage) => {
    const state = deriveEngineState({
      ...baseInput,
      phase: "airflow",
      airflowProgress: progress,
    });

    expect(state.activeStage).toBe(stage);
  });

  it("makes the high-pressure spool respond faster than the low-pressure spool", () => {
    const state = deriveEngineState({ ...baseInput, phase: "throttle", throttle: 0.5 });

    expect(state.highSpool).toBeGreaterThan(state.lowSpool);
    expect(state.thrust).toBeGreaterThan(0);
    expect(state.thrust).toBeLessThan(0.5);
  });

  it("clamps unsafe inputs and returns finite normalized instruments", () => {
    const state = deriveEngineState({
      ...baseInput,
      phase: "throttle",
      explode: 4,
      airflowProgress: -5,
      throttle: 8,
      elapsedSeconds: Number.POSITIVE_INFINITY,
    });

    expect(state.explode).toBe(0);
    expect(state.thrust).toBe(1);
    expect([state.fan, state.heat, state.thrust, state.lowSpool, state.highSpool]).toSatisfy(
      (values: number[]) => values.every((value) => Number.isFinite(value) && value >= 0 && value <= 1),
    );
  });

  it("uses exact stage anchors and discrete states for reduced motion", () => {
    expect(AIRFLOW_STAGE_ANCHORS).toEqual([0, 0.25, 0.5, 0.75, 1]);

    const state = deriveEngineState({
      ...baseInput,
      phase: "airflow",
      airflowProgress: 0.62,
      reducedMotion: true,
    });

    expect(state.cameraProgress).toBe(0.5);
    expect(state.activeStage).toBe("combustion");
  });
});
