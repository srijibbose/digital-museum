"use client";

import { Layers3, Rotate3D, Undo2, ZoomIn, ZoomOut } from "lucide-react";
import { memo } from "react";
import { anatomy } from "@/content/anatomy";
import type {
  AnatomyModelKey,
  AnatomySystem,
  AnatomyViewId,
} from "@/lib/anatomy/anatomy-schema";
import type { AnatomyCameraCommand } from "@/lib/anatomy/anatomy-store";
import styles from "./anatomy.module.css";

const LAYER_LABELS: Record<AnatomyModelKey, string> = {
  heart: "Heart",
  lung: "Lungs & airways",
  vasculature: "Vessels",
  liver: "Liver",
  pancreas: "Pancreas",
  "small-intestine": "Small intestine",
  "large-intestine": "Large intestine",
  "kidney-left": "Left kidney",
  "kidney-right": "Right kidney",
  "ureter-left": "Left collecting system",
  "ureter-right": "Right collecting system",
  "urinary-bladder": "Urinary bladder",
  urethra: "Male urethra",
  brain: "Brain atlas",
  "spinal-cord": "Spinal cord",
  "eye-left": "Left eye",
  "eye-right": "Right eye",
  spleen: "Spleen",
  thymus: "Thymus",
  "lymph-node": "Lymph-node reference",
  "skeleton-full": "201 named bones",
};

export const AnatomyCommandDeck = memo(function AnatomyCommandDeck({
  system,
  viewId,
  layers,
  onViewChange,
  onLayerToggle,
  onCameraCommand,
}: {
  system: AnatomySystem;
  viewId: AnatomyViewId;
  layers: Record<AnatomyModelKey, boolean>;
  onViewChange: (view: AnatomyViewId) => void;
  onLayerToggle: (layer: AnatomyModelKey) => void;
  onCameraCommand: (command: Exclude<AnatomyCameraCommand, "idle">) => void;
}) {
  return (
    <div className={styles.commandDeck}>
      <div className={styles.cameraTools} aria-label="Model controls">
        <span className={styles.dragHint}><Rotate3D size={18} aria-hidden="true" />Drag<br />rotate</span>
        <button type="button" onClick={() => onCameraCommand("zoom-in")} aria-label="Zoom in">
          <ZoomIn size={20} aria-hidden="true" /><span>Zoom in</span>
        </button>
        <button type="button" onClick={() => onCameraCommand("zoom-out")} aria-label="Zoom out">
          <ZoomOut size={20} aria-hidden="true" /><span>Zoom out</span>
        </button>
        <button type="button" onClick={() => onCameraCommand("reset")} aria-label="Reset view">
          <Undo2 size={20} aria-hidden="true" /><span>Reset</span>
        </button>
      </div>

      <div className={styles.viewModes} aria-label={`${system.label} views`}>
        {anatomy.views.filter((view) => system.availableViews.includes(view.id)).map((view) => (
          <button
            type="button"
            key={view.id}
            data-active={view.id === viewId || undefined}
            aria-pressed={view.id === viewId}
            onClick={() => onViewChange(view.id)}
          >
            {system.viewLabels[view.id]}
          </button>
        ))}
      </div>

      <details className={styles.layerMenu}>
        <summary><Layers3 size={17} aria-hidden="true" />Layers</summary>
        <div>
          {system.modelKeys.map((layer) => (
            <label key={layer}>
              <input
                type="checkbox"
                checked={layers[layer]}
                onChange={() => onLayerToggle(layer)}
              />
              <span>{LAYER_LABELS[layer]}</span>
            </label>
          ))}
        </div>
      </details>
    </div>
  );
});
