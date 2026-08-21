"use client";

import {
  Columns2,
  Pause,
  Play,
  RotateCcw,
  ScanSearch,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import type { CameraCommandType } from "@/lib/space/atlas-store";
import type { PlanetaryWorld } from "@/lib/space/atlas-schema";
import styles from "./atlas.module.css";

type CameraAction = Exclude<CameraCommandType, "idle">;

export function CommandDeck({
  world,
  activeModeId,
  compareOpen,
  motionEnabled,
  reducedMotion,
  onSelectMode,
  onCameraCommand,
  onToggleCompare,
  onToggleMotion,
}: {
  world: PlanetaryWorld;
  activeModeId: string;
  compareOpen: boolean;
  motionEnabled: boolean;
  reducedMotion: boolean;
  onSelectMode: (modeId: string) => void;
  onCameraCommand: (command: CameraAction) => void;
  onToggleCompare: () => void;
  onToggleMotion: () => void;
}) {
  const activeMode = world.modes.find((mode) => mode.id === activeModeId) ?? world.modes[0];
  const explainsWavelength = world.id === "sun" && ["171", "193", "304"].includes(activeMode.id);

  return (
    <div className={styles.commandWrap}>
      <div className={styles.commandDeck}>
        <div className={styles.toolGroup} role="toolbar" aria-label="Atlas tools">
          <div className={styles.dragHint} aria-label="Drag the world to rotate">
            <ScanSearch size={20} aria-hidden="true" />
            <span>Drag<br />Rotate</span>
          </div>
          <button type="button" onClick={() => onCameraCommand("zoom-in")} aria-label="Zoom in">
            <ZoomIn size={20} aria-hidden="true" />
            <span>Zoom in</span>
          </button>
          <button type="button" onClick={() => onCameraCommand("zoom-out")} aria-label="Zoom out">
            <ZoomOut size={20} aria-hidden="true" />
            <span>Zoom out</span>
          </button>
          <button
            type="button"
            onClick={onToggleCompare}
            aria-label={compareOpen ? "Close world comparison" : "Compare worlds"}
            aria-pressed={compareOpen}
          >
            <Columns2 size={20} aria-hidden="true" />
            <span>Compare</span>
          </button>
          <button type="button" onClick={() => onCameraCommand("reset")} aria-label="Reset view">
            <RotateCcw size={20} aria-hidden="true" />
            <span>Reset</span>
          </button>
          {activeMode.motion !== "none" ? (
            <button
              type="button"
              onClick={onToggleMotion}
              aria-label={motionEnabled ? "Turn motion off" : "Turn motion on"}
              aria-pressed={motionEnabled}
              disabled={reducedMotion}
              title={reducedMotion ? "Motion is disabled by your reduced-motion preference." : undefined}
            >
              {motionEnabled ? <Pause size={20} aria-hidden="true" /> : <Play size={20} aria-hidden="true" />}
              <span>Motion</span>
            </button>
          ) : null}
        </div>

        <div className={styles.modeRail} role="tablist" aria-label={`${world.name} viewing modes`}>
          {world.modes.map((mode) => (
            <button
              key={mode.id}
              type="button"
              role="tab"
              aria-selected={mode.id === activeModeId}
              data-active={mode.id === activeModeId || undefined}
              title={`${mode.description} · ${mode.evidence}`}
              onClick={() => onSelectMode(mode.id)}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.modeExplanation} aria-live="polite">
        <p>
          <strong>What changed</strong>
          <span>{activeMode.visibleChange}</span>
          <em>{activeMode.evidence}</em>
        </p>
        {activeMode.legend.length > 0 ? (
          <ul className={styles.modeLegend} aria-label={`${activeMode.label} legend`}>
            {activeMode.legend.map((item) => (
              <li key={`${item.label}-${item.detail}`}>
                {item.color ? <i style={{ background: item.color }} aria-hidden="true" /> : null}
                <span><strong>{item.label}</strong>{item.detail}</span>
              </li>
            ))}
          </ul>
        ) : null}
        {explainsWavelength ? (
          <small className={styles.wavelengthNote}>
            Å is an ångström, a unit of wavelength equal to one ten-billionth of a metre. These are extreme-ultraviolet observations, not natural-colour views.
          </small>
        ) : null}
      </div>
    </div>
  );
}
