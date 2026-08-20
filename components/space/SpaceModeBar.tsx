"use client";

import type { CelestialBody } from "@/lib/space/schema";
import styles from "./space.module.css";

export function SpaceModeBar({
  body,
  activeModeId,
  onSelectMode,
}: {
  body: CelestialBody;
  activeModeId: string;
  onSelectMode: (id: string) => void;
}) {
  return (
    <div className={styles.modeBar} role="tablist" aria-label={`${body.name} viewing modes`}>
      {body.modes.map((mode) => (
        <button
          key={mode.id}
          role="tab"
          aria-selected={mode.id === activeModeId}
          className={styles.modeChip}
          data-active={mode.id === activeModeId || undefined}
          onClick={() => onSelectMode(mode.id)}
          title={mode.description}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}
