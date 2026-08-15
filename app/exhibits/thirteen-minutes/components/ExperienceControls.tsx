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
      <p aria-live="polite" className={styles.srStatus} role="status">
        {state.inspect
          ? "Drag the scene to orbit Eagle."
          : "Select Inspect Eagle to enable orbit controls."}
      </p>
      <div className={styles.experienceActions}>
        <button
          aria-label={state.inspect ? "Finish inspecting Eagle" : "Inspect Eagle"}
          aria-pressed={state.inspect}
          onClick={() => dispatch({ type: "TOGGLE_INSPECT" })}
          type="button"
        >
          <span aria-hidden="true" className={styles.controlGlyph}>
            {state.inspect ? "×" : "↗"}
          </span>
          <span className={styles.controlCopy}>
            <span className={styles.controlTitle}>
              {state.inspect ? "Finish inspection" : "Inspect Eagle"}
            </span>
            <span className={styles.controlDetail}>
              {state.inspect ? "Drag scene to orbit" : "Enable model orbit"}
            </span>
          </span>
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
            <span aria-hidden="true" className={styles.controlGlyph}>
              {state.compare ? "−" : "±"}
            </span>
            <span className={styles.controlCopy}>
              <span className={styles.controlTitle}>
                {state.compare ? "Hide landing paths" : "Show landing paths"}
              </span>
              <span className={styles.controlDetail}>
                {state.compare ? "Return to actual path" : "Planned vs. actual"}
              </span>
            </span>
          </button>
        )}
      </div>
    </nav>
  );
}
