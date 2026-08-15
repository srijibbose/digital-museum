"use client";

import { Volume2, VolumeX, Zap } from "lucide-react";
import type { Dispatch } from "react";
import { fullThrottleContent } from "../content";
import type { EngineState } from "../types";
import type { ExperienceAction, ExperienceState } from "../experience-reducer";
import { EngineHud } from "./EngineHud";
import styles from "../full-throttle.module.css";

type ThrottleControlProps = {
  dispatch: Dispatch<ExperienceAction>;
  engine: EngineState;
  state: ExperienceState;
};

const presets = [
  { label: "Ground Idle", value: 0.18, code: "IDLE" },
  { label: "Climb Thrust", value: 0.70, code: "CLB" },
  { label: "Economy Cruise", value: 0.85, code: "CRZ" },
  { label: "Max Takeoff", value: 1.0, code: "TOGA" },
] as const;

export function ThrottleControl({
  dispatch,
  engine,
  state,
}: ThrottleControlProps) {
  const content = fullThrottleContent.throttle;

  return (
    <div className={styles.controlContent}>
      <header className={styles.actHeading}>
        <p>Act 03 · Flight Deck Sandbox</p>
        <h2>Full Throttle</h2>
        <span>FADEC Engine Control</span>
      </header>

      <div className={styles.throttleDesk}>
        {/* Aerospace Vertical Throttle Lever */}
        <div className={styles.throttleLeverWrap}>
          <div className={styles.throttleLeverTrack}>
            <span className={styles.leverHeader}>100% MAX</span>
            <div className={styles.leverSliderContainer}>
              <input
                aria-label="Throttle lever position"
                aria-valuemax={100}
                aria-valuemin={0}
                aria-valuenow={Math.round(state.throttle * 100)}
                aria-valuetext={`${Math.round(state.throttle * 100)} percent`}
                max={1}
                min={0}
                onChange={(event) =>
                  dispatch({
                    type: "SET_THROTTLE",
                    value: Number.parseFloat(event.target.value),
                  })
                }
                step={0.01}
                type="range"
                value={state.throttle}
              />
            </div>
            <span className={styles.leverFooter}>0% IDLE</span>
          </div>

          <output className={styles.throttlePercentageReadout}>
            {Math.round(state.throttle * 100)}%
          </output>
        </div>

        {/* Readouts & Presets */}
        <div className={styles.throttleReadouts}>
          <p className={styles.throttleIntroText}>{content.body}</p>

          <div className={styles.presetButtonsGroup} aria-label="Throttle detent presets">
            {presets.map((preset) => {
              const isSelected = Math.abs(state.throttle - preset.value) < 0.05;
              return (
                <button
                  aria-pressed={isSelected}
                  className={`${styles.presetBtn} ${isSelected ? styles.presetBtnActive : ""}`}
                  key={preset.label}
                  onClick={() =>
                    dispatch({ type: "SET_THROTTLE", value: preset.value })
                  }
                  type="button"
                >
                  <span className={styles.presetCode}>{preset.code}</span>
                  <span className={styles.presetLabel}>{preset.label}</span>
                </button>
              );
            })}
          </div>

          <button
            aria-pressed={state.soundEnabled}
            className={`${styles.soundButton} ${state.soundEnabled ? styles.soundButtonActive : ""}`}
            onClick={() => dispatch({ type: "SET_AUDIO", enabled: !state.soundEnabled })}
            type="button"
          >
            {state.soundEnabled ? (
              <>
                <Volume2 aria-hidden="true" size={16} />
                <span>ACOUSTIC SYNTHESIZER ACTIVE (MUTE)</span>
              </>
            ) : (
              <>
                <VolumeX aria-hidden="true" size={16} />
                <span>ENABLE DUAL-SPOOL JET ACOUSTICS</span>
              </>
            )}
          </button>

          {/* Glass Cockpit HUD */}
          <EngineHud engine={engine} />

          <p className={styles.payoffNote}>
            <Zap size={14} className={styles.payoffIcon} />
            <span>{content.payoff}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
