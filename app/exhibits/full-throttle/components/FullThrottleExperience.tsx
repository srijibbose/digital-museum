"use client";

import { useEffect, useMemo, useReducer, useState } from "react";
import { chooseEngineMode } from "../engine-capability";
import { deriveEngineState } from "../engine-state";
import { experienceReducer, initialExperienceState } from "../experience-reducer";
import type { ExperiencePhase } from "../types";
import { AirflowScrubber } from "./AirflowScrubber";
import { EngineSound } from "./EngineSound";
import { EngineStage } from "./EngineStage";
import { PartInspector } from "./PartInspector";
import { ThrottleControl } from "./ThrottleControl";
import styles from "../full-throttle.module.css";

const acts: Array<{ id: ExperiencePhase; index: string; label: string; action: "ENTER_PARTS" | "ENTER_AIRFLOW" | "ENTER_THROTTLE" }> = [
  { id: "parts", index: "01", label: "Take it apart", action: "ENTER_PARTS" },
  { id: "airflow", index: "02", label: "Make it breathe", action: "ENTER_AIRFLOW" },
  { id: "throttle", index: "03", label: "Take the throttle", action: "ENTER_THROTTLE" },
];

export function FullThrottleExperience() {
  const [state, dispatch] = useReducer(experienceReducer, initialExperienceState);
  const [canEnhance, setCanEnhance] = useState(false);
  const engine = useMemo(() => deriveEngineState({
    phase: state.phase,
    explode: state.explode,
    airflowProgress: state.airflowProgress,
    throttle: state.throttle,
    selectedPart: state.selectedPart,
    reducedMotion: state.reducedMotion,
    elapsedSeconds: 0,
  }), [state]);
  const useFallback = !canEnhance || state.useFallback;

  useEffect(() => {
    const media = typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : null;
    const updateMotion = () => dispatch({ type: "SET_REDUCED_MOTION", enabled: media?.matches ?? false });
    updateMotion();
    media?.addEventListener?.("change", updateMotion);

    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? null;
    const webgl = typeof WebGLRenderingContext !== "undefined";
    const failures = Number(sessionStorage.getItem("full-throttle-webgl-failures") ?? "0");
    if (chooseEngineMode({ webgl, reducedData: Boolean(connection?.saveData), deviceMemory, previousFailures: failures }) === "fallback") {
      dispatch({ type: "USE_FALLBACK" });
    } else {
      setCanEnhance(true);
    }

    return () => media?.removeEventListener?.("change", updateMotion);
  }, []);

  return (
    <section className={styles.experience} id="engine-lab" aria-label="Interactive turbofan laboratory">
      <div className={styles.experienceTopline}>
        <span>Interactive cutaway · Representative model</span>
        <span>{useFallback ? "Diagram mode" : "3D model · drag to orbit"}</span>
      </div>

      <nav className={styles.actNav} aria-label="Exhibit acts">
        {acts.map((act) => (
          <button
            aria-current={state.phase === act.id ? "step" : undefined}
            key={act.id}
            onClick={() => dispatch({ type: act.action })}
            type="button"
          >
            <span>{act.index}</span>
            {act.label}
          </button>
        ))}
      </nav>

      <div className={styles.labGrid}>
        <EngineStage
          engine={engine}
          onFailure={() => dispatch({ type: "USE_FALLBACK" })}
          onSelectPart={(partId) => dispatch({ type: "SELECT_PART", partId })}
          phase={state.phase}
          reducedMotion={state.reducedMotion}
          selectedPart={state.selectedPart}
          useFallback={useFallback}
        />
        <div className={styles.controlDeck}>
          {state.phase === "parts" && <PartInspector dispatch={dispatch} state={state} />}
          {state.phase === "airflow" && <AirflowScrubber dispatch={dispatch} state={state} />}
          {state.phase === "throttle" && <ThrottleControl dispatch={dispatch} engine={engine} state={state} />}
        </div>
      </div>

      <EngineSound enabled={state.soundEnabled} engine={engine} />
    </section>
  );
}
