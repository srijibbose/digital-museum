"use client";

import type { Dispatch } from "react";
import { fullThrottleContent } from "../content";
import type { ExperienceAction, ExperienceState } from "../experience-reducer";
import styles from "../full-throttle.module.css";

type AirflowScrubberProps = {
  dispatch: Dispatch<ExperienceAction>;
  state: ExperienceState;
};

export function AirflowScrubber({ dispatch, state }: AirflowScrubberProps) {
  const stages = fullThrottleContent.airflowStages;
  const activeIndex = Math.min(
    stages.length - 1,
    Math.max(
      0,
      stages.reduce(
        (best, stage, idx) =>
          Math.abs(stage.progress - state.airflowProgress) <
          Math.abs(stages[best].progress - state.airflowProgress)
            ? idx
            : best,
        0,
      ),
    ),
  );
  const activeStage = stages[activeIndex];

  return (
    <div className={styles.controlContent}>
      <header className={styles.actHeading}>
        <p>Act 02 · The Breath of Fire</p>
        <h2>Brayton Cycle</h2>
        <span>Thermodynamic Tour</span>
      </header>

      <nav aria-label="Airflow stage progression" className={styles.airflowRail}>
        {stages.map((stage, index) => {
          const isCurrent = activeIndex === index;
          return (
            <button
              aria-current={isCurrent ? "step" : undefined}
              className={`${styles.airflowStageBtn} ${isCurrent ? styles.airflowStageBtnActive : ""}`}
              key={stage.id}
              onClick={() =>
                dispatch({
                  type: "SET_AIRFLOW",
                  value: stage.progress,
                })
              }
              type="button"
            >
              <span className={styles.stageNumber}>{String(index + 1).padStart(2, "0")}</span>
              <div className={styles.stageBtnBody}>
                <strong>{stage.label}</strong>
                <small>
                  {stage.temperatureC}°C · {stage.pressurePsi} PSI · Mach {stage.machSpeed}
                </small>
              </div>
            </button>
          );
        })}
      </nav>

      <section aria-live="polite" className={styles.factPanel}>
        <div className={styles.stageThermodynamicPill}>
          <span>STAGE 0{activeIndex + 1} OF 05</span>
          <span>{activeStage.cameraShot.toUpperCase()} VIEW</span>
        </div>

        <h3>{activeStage.label}</h3>
        <p className={styles.stageBodyText}>{activeStage.body}</p>

        {/* Live Stage Physical Metrics */}
        <div className={styles.stagePhysicsGrid}>
          <div className={styles.physicsMetric}>
            <span>PRESSURE</span>
            <strong>{activeStage.pressurePsi} <small>PSI</small></strong>
          </div>
          <div className={styles.physicsMetric}>
            <span>TEMPERATURE</span>
            <strong>{activeStage.temperatureC} <small>°C</small></strong>
          </div>
          <div className={styles.physicsMetric}>
            <span>FLOW VELOCITY</span>
            <strong>Mach {activeStage.machSpeed}</strong>
          </div>
        </div>

        <blockquote className={styles.partCallout}>
          &ldquo;{activeStage.annotation}&rdquo;
        </blockquote>
      </section>

      <div className={`${styles.rangeField} ${styles.airflowRange}`}>
        <span>
          <b>Thermodynamic Cycle Progress</b>
          <output>{Math.round(state.airflowProgress * 100)}%</output>
        </span>
        <input
          aria-label="Airflow cycle scrub progress"
          max={1}
          min={0}
          onChange={(event) =>
            dispatch({
              type: "SET_AIRFLOW",
              value: Number.parseFloat(event.target.value),
            })
          }
          step={0.005}
          type="range"
          value={state.airflowProgress}
        />
        <div className={styles.stageNavBtns}>
          <button
            disabled={activeIndex === 0}
            onClick={() =>
              dispatch({
                type: "SET_AIRFLOW",
                value: stages[Math.max(0, activeIndex - 1)].progress,
              })
            }
            type="button"
          >
            ← Previous Stage
          </button>
          <button
            disabled={activeIndex === stages.length - 1}
            onClick={() =>
              dispatch({
                type: "SET_AIRFLOW",
                value: stages[Math.min(stages.length - 1, activeIndex + 1)].progress,
              })
            }
            type="button"
          >
            Next Stage →
          </button>
        </div>
      </div>
    </div>
  );
}
