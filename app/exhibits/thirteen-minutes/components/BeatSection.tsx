import type { ExhibitBeat } from "../types";
import styles from "../thirteen-minutes.module.css";

export type BeatSectionProps = {
  beat: ExhibitBeat;
  ordinal: number;
  active: boolean;
  setElement?: (node: HTMLElement | null) => void;
};

export function BeatSection({ beat, ordinal, active, setElement }: BeatSectionProps) {
  return (
    <article
      aria-labelledby={`${beat.id}-title`}
      className={styles.beat}
      data-active={String(active)}
      data-testid={`beat-${beat.id}`}
      id={`beat-${beat.id}`}
      ref={setElement}
    >
      <div className={styles.beatCopy}>
        <p className={styles.beatOrdinal}>
          {String(ordinal).padStart(2, "0")} <span aria-hidden="true">/</span> Descent
        </p>
        <h2 id={`${beat.id}-title`} tabIndex={-1}>
          {beat.label}
        </h2>
        <p>{beat.body}</p>
        {beat.quote ? <blockquote>{beat.quote}</blockquote> : null}
      </div>

      <dl
        aria-label={`${beat.label} static telemetry`}
        className={styles.staticTelemetry}
      >
        <div>
          <dt>MET</dt>
          <dd>{beat.met}</dd>
        </div>
        <div>
          <dt>Altitude</dt>
          <dd>{beat.altitude}</dd>
        </div>
        <div>
          <dt>Fuel</dt>
          <dd>{beat.fuel}</dd>
        </div>
      </dl>
    </article>
  );
}
