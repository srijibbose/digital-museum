import type { Dispatch } from "react";
import type {
  ExperienceAction,
  ExperienceState,
} from "../experience-reducer";
import styles from "../thirteen-minutes.module.css";

export function ExperienceControls({
  activeBeatId,
  dispatch,
  state,
}: {
  activeBeatId: string;
  dispatch: Dispatch<ExperienceAction>;
  state: ExperienceState;
}) {
  const comparisonAvailable = ["course-check", "manual-control"].includes(
    activeBeatId,
  );

  return (
    <nav aria-label="Explore the descent" className={styles.experienceControls}>
      <button
        aria-label={state.inspect ? "Finish inspecting Eagle" : "Inspect Eagle"}
        aria-pressed={state.inspect}
        onClick={() => dispatch({ type: "TOGGLE_INSPECT" })}
        type="button"
      >
        <span aria-hidden="true">Drag</span>
        {state.inspect ? "Done" : "Inspect Eagle"}
      </button>
      {comparisonAvailable && (
        <button
          aria-label="Compare planned and actual landing paths"
          aria-pressed={state.compare}
          onClick={() =>
            dispatch({ type: "SET_COMPARE", value: !state.compare })
          }
          type="button"
        >
          <span aria-hidden="true">Hold</span>
          {state.compare ? "Showing both paths" : "Planned / actual"}
        </button>
      )}
    </nav>
  );
}
