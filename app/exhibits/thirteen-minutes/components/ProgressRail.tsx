import type { ExhibitBeat } from "../types";
import styles from "../thirteen-minutes.module.css";

export type ProgressRailProps = {
  beats: Array<Pick<ExhibitBeat, "id" | "label">>;
  activeIndex: number;
  onSelect: (index: number) => void;
};

export function ProgressRail({ beats, activeIndex, onSelect }: ProgressRailProps) {
  return (
    <nav aria-label="Mission progress" className={styles.rail}>
      <p className={styles.railPrompt}>Tap a chapter to jump</p>
      <ol>
        {beats.map((beat, index) => (
          <li key={beat.id}>
            <button
              aria-current={index === activeIndex ? "step" : undefined}
              aria-label={`Go to ${beat.label}`}
              onClick={() => onSelect(index)}
              type="button"
            >
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <i aria-hidden="true" />
              <span>{beat.label}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
