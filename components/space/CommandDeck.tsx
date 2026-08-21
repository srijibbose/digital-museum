"use client";

import {
  Columns2,
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
  onSelectMode,
  onCameraCommand,
  onToggleCompare,
}: {
  world: PlanetaryWorld;
  activeModeId: string;
  compareOpen: boolean;
  onSelectMode: (modeId: string) => void;
  onCameraCommand: (command: CameraAction) => void;
  onToggleCompare: () => void;
}) {
  const activeMode = world.modes.find((mode) => mode.id === activeModeId) ?? world.modes[0];

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

      <p className={styles.modeDescription} aria-live="polite">
        <strong>{activeMode.label} mode</strong>
        <span>{activeMode.description}</span>
        <em>{activeMode.evidence}</em>
      </p>
    </div>
  );
}
