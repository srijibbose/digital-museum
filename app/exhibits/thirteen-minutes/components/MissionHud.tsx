import type { Telemetry } from "../types";
import styles from "../thirteen-minutes.module.css";
import { SevenSegmentValue } from "./SevenSegmentValue";

export type MissionHudProps = {
  telemetry: Telemetry;
  activeLabel: string;
  beatNumber: number;
  beatCount: number;
  animate?: boolean;
};

export function MissionHud({
  telemetry,
  activeLabel,
  beatNumber,
  beatCount,
  animate = false,
}: MissionHudProps) {
  return (
    <section
      aria-label="Mission telemetry"
      className={styles.hud}
      data-animate={String(animate)}
      data-testid="mission-hud"
    >
      <div className={styles.hudStatus}>
        <span aria-hidden="true">P63</span>
        <p aria-live="polite">{activeLabel}</p>
        <span>
          {String(beatNumber).padStart(2, "0")} / {String(beatCount).padStart(2, "0")}
        </span>
      </div>
      <dl className={styles.hudReadouts}>
        <div className={styles.hudMet}>
          <dt>Mission elapsed time</dt>
          <dd><SevenSegmentValue value={telemetry.met} /></dd>
        </div>
        <div>
          <dt>Altitude</dt>
          <dd><SevenSegmentValue value={telemetry.altitude} /></dd>
        </div>
        <div>
          <dt>Fuel remaining</dt>
          <dd><SevenSegmentValue value={telemetry.fuel} /></dd>
        </div>
      </dl>
    </section>
  );
}
