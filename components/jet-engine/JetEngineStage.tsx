"use client";

import dynamic from "next/dynamic";
import { Component, type ErrorInfo, type ReactNode, useCallback, useEffect, useState } from "react";
import { Box, CircleDot, Rotate3D } from "lucide-react";
import type { JetCycleResult } from "@/lib/jet-engine/jet-engine-model";
import type { JetStationId, JetViewId } from "@/lib/jet-engine/jet-engine-schema";
import { JetEngineSection } from "./JetEngineSection";
import styles from "./jet-engine.module.css";

export type JetCameraCommand = {
  type: "reset" | "side" | "front";
  sequence: number;
};

export type JetEngineCanvasProps = {
  stationId: JetStationId;
  viewId: JetViewId;
  cycle: JetCycleResult;
  motionEnabled: boolean;
  cameraCommand: JetCameraCommand;
  onSelectStation: (stationId: JetStationId) => void;
  onReady?: () => void;
};

const InteractiveJetEngineCanvas = dynamic(() => import("./JetEngineCanvas"), {
  ssr: false,
  loading: () => (
    <div className={styles.rendererLoading} role="status">
      <span>Loading 235,778-triangle engine reconstruction…</span>
    </div>
  ),
});

class JetCanvasBoundary extends Component<
  { children: ReactNode; fallback: ReactNode; onError?: (error: Error, info: ErrorInfo) => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
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

export function jetEngineRenderDescription(viewId: JetViewId, stationId: JetStationId) {
  const layer = {
    section: "the sourced mechanical reconstruction",
    airflow: "seeded particles tracing the shared intake, bypass stream, and core stream",
    pressure: "a three-dimensional cycle-linked total-pressure field",
    thermal: "a three-dimensional cycle-linked total-temperature field",
    shafts: "the concentric explanatory shaft-work paths",
  }[viewId];
  return `Interactive three-dimensional high-bypass turbofan showing ${layer}. Station ${stationId} is selected. Drag to rotate, scroll to zoom, or use the camera controls.`;
}

export function JetEngineStage(props: Omit<JetEngineCanvasProps, "cameraCommand">) {
  const [webglAvailable, setWebglAvailable] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);
  const [rendererFailed, setRendererFailed] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [cameraCommand, setCameraCommand] = useState<JetCameraCommand>({ type: "reset", sequence: 0 });
  const issueCameraCommand = useCallback((type: JetCameraCommand["type"]) => {
    setCameraCommand((current) => ({ type, sequence: current.sequence + 1 }));
  }, []);

  useEffect(() => {
    const calibration = window.setTimeout(() => setWebglAvailable(supportsWebgl()), 0);
    return () => window.clearTimeout(calibration);
  }, []);

  useEffect(() => {
    if (!webglAvailable || ready || rendererFailed) return;
    const timeout = window.setTimeout(() => setTimedOut(true), 30_000);
    return () => window.clearTimeout(timeout);
  }, [attempt, ready, rendererFailed, webglAvailable]);

  const retryRenderer = () => {
    setReady(false);
    setRendererFailed(false);
    setTimedOut(false);
    setAttempt((current) => current + 1);
  };

  if (webglAvailable === null) {
    return (
      <div className={styles.engine3dSurface} data-renderer="loading">
        <div className={styles.rendererLoading} role="status">Calibrating the 3D flow laboratory…</div>
      </div>
    );
  }

  if (!webglAvailable || rendererFailed || timedOut) {
    return (
      <div
        className={`${styles.engine3dSurface} ${styles.rendererFallback}`}
        data-renderer="fallback"
        data-testid="jet-engine-3d-stage"
      >
        <JetEngineSection {...props} />
        <div className={styles.rendererFallbackNotice}>
          <p>
            {!webglAvailable
              ? "WebGL is unavailable. Showing the accessible scientific section instead."
              : "The 3D engine could not be resolved in time. Showing the scientific section instead."}
          </p>
          {webglAvailable ? <button type="button" onClick={retryRenderer}>Retry 3D</button> : null}
        </div>
      </div>
    );
  }

  return (
    <div
      className={styles.engine3dSurface}
      data-ready={ready || undefined}
      data-camera={cameraCommand.type}
      data-renderer={ready ? "ready" : "loading"}
      data-testid="jet-engine-3d-stage"
    >
      <span
        className={styles.srOnly}
        role="img"
        aria-label={jetEngineRenderDescription(props.viewId, props.stationId)}
      />
      {!ready ? (
        <div className={styles.rendererLoading} role="status">
          <span>Resolving sourced engine meshes and spatial fields…</span>
        </div>
      ) : null}

      <JetCanvasBoundary
        key={attempt}
        onError={() => setRendererFailed(true)}
        fallback={(
          <div className={styles.rendererFallback}>
            <JetEngineSection {...props} />
            <p>The 3D renderer could not start. The scientific section remains available.</p>
          </div>
        )}
      >
        <InteractiveJetEngineCanvas
          {...props}
          cameraCommand={cameraCommand}
          onReady={() => setReady(true)}
        />
      </JetCanvasBoundary>

      <div className={styles.stageControls} aria-label="3D camera controls">
        <button type="button" onClick={() => issueCameraCommand("side")} aria-label="Set side camera">
          <Box size={14} aria-hidden="true" />
          <span>Side</span>
        </button>
        <button type="button" onClick={() => issueCameraCommand("front")} aria-label="Set intake camera">
          <CircleDot size={14} aria-hidden="true" />
          <span>Intake</span>
        </button>
        <button type="button" onClick={() => issueCameraCommand("reset")} aria-label="Reset 3D camera">
          <Rotate3D size={14} aria-hidden="true" />
          <span>Reset</span>
        </button>
      </div>

      <div className={styles.interactionHint} aria-hidden="true">
        <span>Drag</span> rotate <i /> <span>Scroll</span> zoom
      </div>
      <div className={styles.visualizationDisclosure}>
        {props.viewId === "airflow" ? "Seeded-particle visualization · qualitative motion · not CFD" : null}
        {props.viewId === "pressure" ? "3D scalar field · total pressure from the idealized cycle" : null}
        {props.viewId === "thermal" ? "3D scalar field · total temperature from the idealized cycle" : null}
        {props.viewId === "shafts" ? "Explanatory shaft overlay · functional topology, not manufacturing geometry" : null}
        {props.viewId === "section" ? "CC BY 4.0 artist reconstruction · not a production-engine scan" : null}
      </div>
    </div>
  );
}
