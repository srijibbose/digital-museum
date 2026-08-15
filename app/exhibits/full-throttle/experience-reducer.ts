import type { EnginePartId, ExperiencePhase } from "./types";

export type ExperienceState = {
  phase: ExperiencePhase;
  explode: number;
  selectedPart: EnginePartId | null;
  visitedPartIds: EnginePartId[];
  airflowProgress: number;
  throttle: number;
  soundEnabled: boolean;
  reducedMotion: boolean;
  useFallback: boolean;
};

export type ExperienceAction =
  | { type: "ENTER_PARTS" }
  | { type: "SET_EXPLODE"; value: number }
  | { type: "SELECT_PART"; partId: EnginePartId }
  | { type: "CLEAR_PART" }
  | { type: "ENTER_AIRFLOW" }
  | { type: "SET_AIRFLOW"; value: number }
  | { type: "ENTER_THROTTLE" }
  | { type: "SET_THROTTLE"; value: number }
  | { type: "SET_AUDIO"; enabled: boolean }
  | { type: "SET_REDUCED_MOTION"; enabled: boolean }
  | { type: "USE_FALLBACK" };

export const initialExperienceState: ExperienceState = {
  phase: "parts",
  explode: 0,
  selectedPart: null,
  visitedPartIds: [],
  airflowProgress: 0,
  throttle: 0.12,
  soundEnabled: false,
  reducedMotion: false,
  useFallback: false,
};

function clamp01(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

export function experienceReducer(
  state: ExperienceState,
  action: ExperienceAction,
): ExperienceState {
  switch (action.type) {
    case "ENTER_PARTS":
      return { ...state, phase: "parts" };
    case "SET_EXPLODE":
      return { ...state, explode: clamp01(action.value) };
    case "SELECT_PART":
      return {
        ...state,
        selectedPart: action.partId,
        visitedPartIds: state.visitedPartIds.includes(action.partId)
          ? state.visitedPartIds
          : [...state.visitedPartIds, action.partId],
      };
    case "CLEAR_PART":
      return { ...state, selectedPart: null };
    case "ENTER_AIRFLOW":
      return {
        ...state,
        phase: "airflow",
        explode: 0,
        selectedPart: null,
        airflowProgress: 0,
      };
    case "SET_AIRFLOW":
      return { ...state, airflowProgress: clamp01(action.value) };
    case "ENTER_THROTTLE":
      return { ...state, phase: "throttle", explode: 0, selectedPart: null };
    case "SET_THROTTLE":
      return { ...state, throttle: clamp01(action.value) };
    case "SET_AUDIO":
      return { ...state, soundEnabled: action.enabled };
    case "SET_REDUCED_MOTION":
      return { ...state, reducedMotion: action.enabled };
    case "USE_FALLBACK":
      return { ...state, useFallback: true };
    default:
      return state;
  }
}
