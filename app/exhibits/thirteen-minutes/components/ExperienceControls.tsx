"use client";

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
    <>
      {state.inspect && (
        <div
          aria-live="polite"
          className={styles.inspectHint}
          data-testid="inspect-guidance-toast"
          role="status"
        >
          <span className={styles.inspectHintDot} aria-hidden="true" />
          <span className={styles.inspectHintLabel}>3D Orbit</span>
          <span className={styles.inspectHintDivider} aria-hidden="true">·</span>
          <span>Drag to rotate spacecraft</span>
          <span className={styles.inspectHintDivider} aria-hidden="true">·</span>
          <span>Scroll to zoom</span>
          <span className={styles.inspectHintDivider} aria-hidden="true">·</span>
          <button
            className={styles.inspectHintExit}
            onClick={() => dispatch({ type: "TOGGLE_INSPECT" })}
            type="button"
          >
            Exit (Esc)
          </button>
        </div>
      )}

      <nav aria-label="Explore the descent" className={styles.experienceControls}>
        <button
          aria-label={state.inspect ? "Finish inspecting Eagle" : "Inspect Eagle"}
          aria-pressed={state.inspect}
          className={styles.controlPill}
          onClick={() => dispatch({ type: "TOGGLE_INSPECT" })}
          type="button"
        >
          <span className={styles.controlPillIcon} aria-hidden="true">
            {state.inspect ? "✕" : "⟲"}
          </span>
          <span>{state.inspect ? "Done inspecting" : "Inspect Eagle"}</span>
        </button>

        {comparisonAvailable && (
          <button
            aria-label="Compare planned and actual landing paths"
            aria-pressed={state.compare}
            className={styles.controlPill}
            onClick={() =>
              dispatch({ type: "SET_COMPARE", value: !state.compare })
            }
            type="button"
          >
            <span className={styles.controlPillIcon} aria-hidden="true">
              ⇄
            </span>
            <span>{state.compare ? "Showing both paths" : "Planned / actual"}</span>
          </button>
        )}
      </nav>
    </>
  );
}
