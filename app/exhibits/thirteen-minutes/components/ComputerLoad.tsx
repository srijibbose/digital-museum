import type { Dispatch } from "react";
import type {
  ComputerDetail,
  ExperienceAction,
} from "../experience-reducer";
import styles from "../thirteen-minutes.module.css";

const DETAIL_COPY: Record<ComputerDetail, string> = {
  overview:
    "The computer restarted the executive, then resumed the highest-priority work first. Essential jobs retained.",
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
      data-testid="computer-load"
    >
      <header className={styles.computerHeader}>
        <div className={styles.computerKicker}>
          <span>Systems Architecture</span>
          <span className={styles.alarmBadge}>Alarm 1202</span>
        </div>
        <h3 className={styles.computerTitle}>
          Priority Executive · Margaret Hamilton
        </h3>
        <p className={styles.computerSubtitle}>
          When rendezvous radar noise flooded CPU cycles at 6,000 ft, the asynchronous executive shed low-priority work to keep Eagle descending safely.
        </p>
      </header>

      <div className={styles.taskLanes} aria-label="Computer task priority">
        <div className={styles.taskRow} data-state="kept">
          <div className={styles.taskLabel}>
            <span className={styles.taskDot} aria-hidden="true" />
            <span>P64 Guidance &amp; Throttle</span>
          </div>
          <span className={styles.taskStatus}>Retained</span>
        </div>
        <div className={styles.taskRow} data-state="kept">
          <div className={styles.taskLabel}>
            <span className={styles.taskDot} aria-hidden="true" />
            <span>RCS Attitude Control</span>
          </div>
          <span className={styles.taskStatus}>Retained</span>
        </div>
        <div className={styles.taskRow} data-state="dropped">
          <div className={styles.taskLabel}>
            <span className={styles.taskDot} aria-hidden="true" />
            <span>Rendezvous Radar Polling</span>
          </div>
          <span className={styles.taskStatusDropped}>Dropped</span>
        </div>
      </div>

      <div className={styles.verdictBlock}>
        <p className={styles.computerVerdict}>Essential jobs retained</p>
        <p aria-live="polite" className={styles.computerExplanation}>
          {DETAIL_COPY[detail]}
        </p>
      </div>

      <nav aria-label="Computer task details" className={styles.computerActions}>
        <button
          aria-label="Inspect alarm overview"
          aria-pressed={detail === "overview"}
          className={styles.detailButton}
          onClick={() =>
            dispatch({ type: "SET_COMPUTER_DETAIL", value: "overview" })
          }
          type="button"
        >
          Overview
        </button>
        <button
          aria-label="Inspect dropped radar data"
          aria-pressed={detail === "dropped"}
          className={styles.detailButton}
          onClick={() =>
            dispatch({ type: "SET_COMPUTER_DETAIL", value: "dropped" })
          }
          type="button"
        >
          Dropped
        </button>
        <button
          aria-label="Inspect retained guidance jobs"
          aria-pressed={detail === "kept"}
          className={styles.detailButton}
          onClick={() =>
            dispatch({ type: "SET_COMPUTER_DETAIL", value: "kept" })
          }
          type="button"
        >
          Retained
        </button>
      </nav>
    </section>
  );
}
