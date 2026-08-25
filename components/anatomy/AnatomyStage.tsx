"use client";

import dynamic from "next/dynamic";
import type { StoreApi } from "zustand/vanilla";
import {
  Component,
  type ErrorInfo,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
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
  renderingActive?: boolean;
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
  {
    children: ReactNode;
    fallback: ReactNode;
    resetKey: string;
    onError?: (error: Error, info: ErrorInfo) => void;
  },
  BoundaryState
> {
  state: BoundaryState = { failed: false };

  static getDerivedStateFromError(): BoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info);
  }

  componentDidUpdate(previousProps: Readonly<typeof this.props>) {
    if (this.state.failed && previousProps.resetKey !== this.props.resetKey) {
      this.setState({ failed: false });
    }
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
  const [renderingActive, setRenderingActive] = useState(true);
  const rendererSurface = useRef<HTMLDivElement>(null);
  const modelReady = readySystemId === props.system.id;
  const handleModelReady = useCallback(
    () => setReadySystemId(props.system.id),
    [props.system.id],
  );

  useEffect(() => {
    const calibration = window.setTimeout(() => setWebglAvailable(supportsWebgl()), 0);
    return () => window.clearTimeout(calibration);
  }, []);

  useEffect(() => {
    if (!webglAvailable) return;
    const visibility = { page: !document.hidden, viewport: true };
    const update = () => setRenderingActive(visibility.page && visibility.viewport);
    const onVisibilityChange = () => {
      visibility.page = !document.hidden;
      update();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const observer = typeof IntersectionObserver === "function"
      ? new IntersectionObserver(([entry]) => {
          visibility.viewport = entry?.isIntersecting ?? true;
          update();
        }, { threshold: 0.01 })
      : null;
    if (rendererSurface.current) observer?.observe(rendererSurface.current);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      observer?.disconnect();
    };
  }, [webglAvailable]);

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
      ref={rendererSurface}
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
        resetKey={props.system.id}
        fallback={<AnatomyFallback system={props.system} reason="model" />}
      >
        <InteractiveAnatomyCanvas
          {...props}
          renderingActive={renderingActive}
          onReady={handleModelReady}
        />
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
