"use client";

import type { Dispatch } from "react";
import { fullThrottleContent } from "../content";
import type { ExperienceAction, ExperienceState } from "../experience-reducer";
import styles from "../full-throttle.module.css";

type PartInspectorProps = {
  dispatch: Dispatch<ExperienceAction>;
  state: ExperienceState;
};

export function PartInspector({ dispatch, state }: PartInspectorProps) {
  const parts = fullThrottleContent.parts;
  const activePart = parts.find((part) => part.id === state.selectedPart) ?? null;

  return (
    <div className={styles.controlContent}>
      <header className={styles.actHeading}>
        <p>Act 01 · Anatomy &amp; Dissection</p>
        <h2>Seven Parts</h2>
        <span>Interactive Cutaway</span>
      </header>

      <div className={styles.rangeField}>
        <span>
          <b>Exploded view separation</b>
          <output>{Math.round(state.explode * 100)}%</output>
        </span>
        <input
          aria-label="Exploded view separation"
          max={1}
          min={0}
          onChange={(event) =>
            dispatch({
              type: "SET_EXPLODE",
              value: Number.parseFloat(event.target.value),
            })
          }
          step={0.01}
          type="range"
          value={state.explode}
        />
        <div className={styles.explodeQuickActions}>
          <button
            className={state.explode === 0 ? styles.activeQuickBtn : ""}
            onClick={() => dispatch({ type: "SET_EXPLODE", value: 0 })}
            type="button"
          >
            Assembled
          </button>
          <button
            className={state.explode === 0.5 ? styles.activeQuickBtn : ""}
            onClick={() => dispatch({ type: "SET_EXPLODE", value: 0.5 })}
            type="button"
          >
            50% Cutaway
          </button>
          <button
            className={state.explode === 1 ? styles.activeQuickBtn : ""}
            onClick={() => dispatch({ type: "SET_EXPLODE", value: 1 })}
            type="button"
          >
            Full Explode
          </button>
        </div>
      </div>

      <nav aria-label="Engine components list" className={styles.partRail}>
        {parts.map((part, index) => {
          const isSelected = state.selectedPart === part.id;
          return (
            <button
              aria-pressed={isSelected}
              className={styles.partButton}
              key={part.id}
              onClick={() => {
                if (isSelected) {
                  dispatch({ type: "CLEAR_PART" });
                } else {
                  dispatch({ type: "SELECT_PART", partId: part.id });
                }
              }}
              type="button"
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div className={styles.partBtnText}>
                <strong>{part.name}</strong>
                <small>{part.spoolAssociation}</small>
              </div>
              <span className={styles.partBtnAccent}>{part.accent}</span>
            </button>
          );
        })}
      </nav>

      {activePart ? (
        <section
          aria-live="polite"
          className={`${styles.factPanel} ${styles[`accent-${activePart.accent}`]}`}
        >
          <div className={styles.factPanelHeader}>
            <p className={styles.partDossierKicker}>Module Technical Dossier · 0{parts.findIndex((p) => p.id === activePart.id) + 1}</p>
            <button
              className={styles.closeFact}
              onClick={() => dispatch({ type: "CLEAR_PART" })}
              type="button"
            >
              Close ✕
            </button>
          </div>

          <h3>{activePart.name}</h3>
          <p className={styles.partEyebrow}>{activePart.eyebrow}</p>
          <p className={styles.partBody}>{activePart.body}</p>

          <div className={styles.partSpecsGrid}>
            <div className={styles.partSpecItem}>
              <span>METALLURGY</span>
              <strong>{activePart.metallurgy}</strong>
            </div>
            <div className={styles.partSpecItem}>
              <span>OPERATING TEMP</span>
              <strong>{activePart.operatingTemp}</strong>
            </div>
            <div className={styles.partSpecItem}>
              <span>PRESSURE / REGIME</span>
              <strong>{activePart.pressureRatio}</strong>
            </div>
            <div className={styles.partSpecItem}>
              <span>SPOOL SYSTEM</span>
              <strong>{activePart.spoolAssociation}</strong>
            </div>
          </div>

          <blockquote className={styles.partCallout}>
            &ldquo;{activePart.callout}&rdquo;
          </blockquote>
        </section>
      ) : (
        <div className={styles.inspectHint}>
          <span className={styles.hintDot} />
          <p>
            Tap any module above or click 3D hotspots in the scene to inspect metallurgy, thermal thresholds, and mechanical spool associations.
          </p>
        </div>
      )}
    </div>
  );
}
