export type ComputerDetail = "overview" | "dropped" | "kept";

export type ExperienceState = {
  inspect: boolean;
  compare: boolean;
  computerDetail: ComputerDetail;
};

export type ExperienceAction =
  | { type: "TOGGLE_INSPECT" }
  | { type: "SET_COMPARE"; value: boolean }
  | { type: "SET_COMPUTER_DETAIL"; value: ComputerDetail }
  | { type: "RESET_TRANSIENT" };

export const initialExperienceState: ExperienceState = {
  inspect: false,
  compare: false,
  computerDetail: "overview",
};

export function experienceReducer(
  state: ExperienceState,
  action: ExperienceAction,
): ExperienceState {
  switch (action.type) {
    case "TOGGLE_INSPECT":
      return { ...state, inspect: !state.inspect, compare: false };
    case "SET_COMPARE":
      return { ...state, compare: action.value, inspect: false };
    case "SET_COMPUTER_DETAIL":
      return { ...state, computerDetail: action.value };
    case "RESET_TRANSIENT":
      return initialExperienceState;
  }
}
