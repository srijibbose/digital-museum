import Image from "next/image";
import { fullThrottleContent } from "../content";
import type { EnginePartId, EngineState, ExperiencePhase } from "../types";
import styles from "../full-throttle.module.css";

type StaticEngineDiagramProps = {
  engine: EngineState;
  phase: ExperiencePhase;
  reducedMotion?: boolean;
  selectedPart: EnginePartId | null;
  onSelectPart: (partId: EnginePartId) => void;
};

export function StaticEngineDiagram({ engine, phase, selectedPart, onSelectPart }: StaticEngineDiagramProps) {
  return (
    <div className={styles.staticDiagram}>
      <Image
        alt="Cutaway diagram showing the fan, compressor, combustor, turbines, shafts, and nozzle"
        className={styles.staticEngineImage}
        fill
        sizes="(max-width: 980px) 100vw, 64vw"
        src="/images/full-throttle-poster.webp"
      />
      {phase === "airflow" && (
        <div className={styles.diagramFlow} data-stage={engine.activeStage} aria-hidden="true">
          <span className={styles.bypassFlow} />
          <span className={styles.coreFlow} />
        </div>
      )}
      {phase === "throttle" && (
        <div className={styles.diagramPulse} style={{ opacity: 0.28 + engine.thrust * 0.72 }} aria-hidden="true" />
      )}
      {phase === "parts" ? (
        <div className={styles.diagramLabels}>
          {fullThrottleContent.parts.map((part, index) => (
            <button
              aria-label={`Inspect ${part.name}`}
              aria-pressed={selectedPart === part.id}
              key={part.id}
              onClick={() => onSelectPart(part.id)}
              style={{ "--label-index": index } as React.CSSProperties}
              type="button"
            >
              {index + 1}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
