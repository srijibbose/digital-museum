"use client";

import dynamic from "next/dynamic";
import type { StoreApi } from "zustand/vanilla";
import {
  Component,
  type ErrorInfo,
  type ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import type {
  AnatomyModelKey,
  AnatomyStructure,
  AnatomySystem,
  AnatomyView,
} from "@/lib/anatomy/anatomy-schema";
import type { AnatomyState } from "@/lib/anatomy/anatomy-store";
import { getAnatomyViewChange } from "@/content/anatomy";
import { AnatomyFallback } from "./AnatomyFallback";
import styles from "./anatomy.module.css";

export type AnatomyCanvasProps = {
  store: StoreApi<AnatomyState>;
  system: AnatomySystem;
  view: AnatomyView;
  selectedStructure: AnatomyStructure;
  layers: Record<AnatomyModelKey, boolean>;
  reducedMotion: boolean;
  cameraCommand: AnatomyState["cameraCommand"];
  onSelectStructure: (structureId: string) => void;
  onReady?: () => void;
};

const InteractiveAnatomyCanvas = dynamic(() => import("./AnatomyCanvas"), {
  ssr: false,
  loading: () => (
    <div className={styles.rendererLoading} role="status">
      Resolving anatomical structures…
    </div>
  ),
});

type BoundaryState = { failed: boolean };

class AnatomyCanvasBoundary extends Component<
  { children: ReactNode; fallback: ReactNode; onError?: (error: Error, info: ErrorInfo) => void },
  BoundaryState
> {
  state: BoundaryState = { failed: false };

  static getDerivedStateFromError(): BoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info);
  }

  override render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function supportsWebgl() {
  if (typeof navigator !== "undefined" && /jsdom/i.test(navigator.userAgent)) return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function anatomyRenderDescription(
  system: AnatomySystem,
  view: AnatomyView,
  selectedStructure: AnatomyStructure,
) {
  return `${system.label}, ${system.viewLabels[view.id].toLowerCase()} view. ${selectedStructure.label} selected. ${getAnatomyViewChange(system, view)} Drag to rotate, scroll to zoom, or select a visible anatomical structure.`;
}

export function AnatomyStage(props: AnatomyCanvasProps) {
  const [webglAvailable, setWebglAvailable] = useState<boolean | null>(null);
  const [readySystemId, setReadySystemId] = useState<string | null>(null);
  const modelReady = readySystemId === props.system.id;
  const handleModelReady = useCallback(
    () => setReadySystemId(props.system.id),
    [props.system.id],
  );

  useEffect(() => {
    const calibration = window.setTimeout(() => setWebglAvailable(supportsWebgl()), 0);
    return () => window.clearTimeout(calibration);
  }, []);

  if (webglAvailable === null) {
    return (
      <div className={styles.rendererLoading} role="status">
        Calibrating anatomical renderer…
      </div>
    );
  }

  if (!webglAvailable) return <AnatomyFallback system={props.system} />;

  return (
    <div
      className={styles.rendererSurface}
      data-ready={modelReady || undefined}
      role="img"
      aria-label={anatomyRenderDescription(props.system, props.view, props.selectedStructure)}
    >
      {!modelReady ? (
        <div className={styles.rendererLoading} role="status">
          <span>Resolving {props.system.shortLabel.toLowerCase()} source meshes…</span>
        </div>
      ) : null}
      <AnatomyCanvasBoundary
        key={props.system.id}
        fallback={<AnatomyFallback system={props.system} reason="model" />}
      >
        <InteractiveAnatomyCanvas {...props} onReady={handleModelReady} />
      </AnatomyCanvasBoundary>
      {props.system.id === "immune"
      && props.selectedStructure.selectors.some((selector) => selector.model === "lymph-node")
      && props.selectedStructure.id !== "immune-organs" ? (
        <div className={styles.scaleDisclosure}>
          Magnified generalized node · not body-positioned
        </div>
      ) : null}
    </div>
  );
}
