import type { Dispatch } from "react";
import type {
  ComputerDetail,
  ExperienceAction,
} from "../experience-reducer";
import styles from "../thirteen-minutes.module.css";

const DETAIL_COPY: Record<ComputerDetail, string> = {
  overview:
    "The computer restarted the executive, then resumed the highest-priority work first.",
  dropped:
    "Lower-priority radar input was abandoned for this cycle before it could crowd out the landing solution.",
  kept:
    "Guidance and engine control restarted first. Those essential jobs kept Eagle stable and descending.",
};

export function ComputerLoad({
  detail,
  dispatch,
}: {
  detail: ComputerDetail;
  dispatch: Dispatch<ExperienceAction>;
}) {
  return (
    <section
      aria-label="Guidance computer load"
      className={styles.computerLoad}
      data-detail={detail}
    >
      <div className={styles.computerLoadHeading}>
        <span>Executive overflow</span>
        <strong>1202</strong>
      </div>
      <div className={styles.taskLanes} aria-label="Computer task priority">
        <div data-state="kept">
          <span>Guidance</span>
          <i aria-hidden="true" />
        </div>
        <div data-state="kept">
          <span>Engine control</span>
          <i aria-hidden="true" />
        </div>
        <div data-state="dropped">
          <span>Radar input</span>
          <i aria-hidden="true" />
        </div>
      </div>
      <p className={styles.computerVerdict}>Essential jobs retained</p>
      <p aria-live="polite" className={styles.computerExplanation}>
        {DETAIL_COPY[detail]}
      </p>
      <div className={styles.computerActions}>
        <button
          aria-label="Inspect dropped radar data"
          aria-pressed={detail === "dropped"}
          onClick={() =>
            dispatch({ type: "SET_COMPUTER_DETAIL", value: "dropped" })
          }
          type="button"
        >
          <span>Show dropped radar data</span>
          <small>What the computer abandoned</small>
        </button>
        <button
          aria-label="Inspect retained guidance jobs"
          aria-pressed={detail === "kept"}
          onClick={() =>
            dispatch({ type: "SET_COMPUTER_DETAIL", value: "kept" })
          }
          type="button"
        >
          <span>Show retained guidance</span>
          <small>What kept Eagle descending</small>
        </button>
      </div>
    </section>
  );
}
