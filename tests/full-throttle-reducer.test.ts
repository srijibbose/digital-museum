import { describe, expect, it } from "vitest";
import {
  experienceReducer,
  initialExperienceState,
} from "@/app/exhibits/full-throttle/experience-reducer";

describe("Full Throttle experience reducer", () => {
  it("records explored parts once while allowing free-order inspection", () => {
    const selected = experienceReducer(initialExperienceState, {
      type: "SELECT_PART",
      partId: "fan",
    });
    const selectedAgain = experienceReducer(selected, {
      type: "SELECT_PART",
      partId: "fan",
    });

    expect(selectedAgain.selectedPart).toBe("fan");
    expect(selectedAgain.visitedPartIds).toEqual(["fan"]);
  });

  it("reassembles the engine when the airflow act begins", () => {
    const state = experienceReducer(
      { ...initialExperienceState, explode: 1, selectedPart: "combustor" },
      { type: "ENTER_AIRFLOW" },
    );

    expect(state).toMatchObject({
      phase: "airflow",
      explode: 0,
      selectedPart: null,
      airflowProgress: 0,
    });
  });

  it("clamps direct controls and preserves explicit sound consent", () => {
    const throttle = experienceReducer(initialExperienceState, {
      type: "SET_THROTTLE",
      value: 2,
    });
    const sound = experienceReducer(throttle, { type: "SET_AUDIO", enabled: true });

    expect(sound.throttle).toBe(1);
    expect(sound.soundEnabled).toBe(true);
    expect(initialExperienceState.soundEnabled).toBe(false);
  });

  it("can switch to an accessible fallback without changing the story phase", () => {
    const state = experienceReducer(
      { ...initialExperienceState, phase: "throttle" },
      { type: "USE_FALLBACK" },
    );

    expect(state.phase).toBe("throttle");
    expect(state.useFallback).toBe(true);
  });
});
