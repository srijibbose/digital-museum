"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode } from "react";
import type { EnginePartId, EngineState, ExperiencePhase } from "../types";
import { StaticEngineDiagram } from "./StaticEngineDiagram";
import styles from "../full-throttle.module.css";

const EngineScene = dynamic(() => import("./EngineScene"), {
  ssr: false,
  loading: () => (
    <div aria-live="polite" className={styles.modelLoading}>
      <span aria-hidden="true" className={styles.loadingSpinner} />
      <p>INITIALIZING TURBOFAN SIMULATION ENGINE</p>
      <small>Loading PBR materials · Compiling GPU particle shaders...</small>
    </div>
  ),
});

type EngineStageProps = {
  engine: EngineState;
  phase: ExperiencePhase;
  reducedMotion: boolean;
  selectedPart: EnginePartId | null;
  useFallback: boolean;
  onSelectPart: (partId: EnginePartId) => void;
  onFailure: () => void;
};

type BoundaryState = { hasError: boolean };

class SceneErrorBoundary extends Component<{ children: ReactNode; onError: () => void }, BoundaryState> {
  state: BoundaryState = { hasError: false };

  static getDerivedStateFromError(): BoundaryState {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

export function EngineStage(props: EngineStageProps) {
  if (props.useFallback) {
    return (
      <div className={styles.engineStage} role="region" aria-label="Engine schematic fallback">
        <StaticEngineDiagram
          engine={props.engine}
          onSelectPart={props.onSelectPart}
          phase={props.phase}
          selectedPart={props.selectedPart}
        />
      </div>
    );
  }

  return (
    <div
      aria-label="3D Turbofan Laboratory Viewport. Drag to orbit, scroll to zoom."
      className={styles.engineStage}
      role="region"
    >
      <div className={styles.stageRuler} aria-hidden="true">
        {Array.from({ length: 48 }, (_, index) => (
          <span key={index} />
        ))}
      </div>

      <div className={styles.stageOverlayControls}>
        <div className={styles.stageStatusPill}>
          <span className={styles.statusDotGreen} />
          <span>3D SIMULATION · ACTIVE</span>
        </div>
        <div className={styles.stageActionHints}>
          <span>DRAG TO ORBIT</span>
          <span>·</span>
          <span>PINCH/SCROLL TO ZOOM</span>
          <span>·</span>
          <span>CLICK HOTSPOTS TO INSPECT</span>
        </div>
      </div>

      <SceneErrorBoundary onError={props.onFailure}>
        <EngineScene
          engine={props.engine}
          onSelectPart={props.onSelectPart}
          phase={props.phase}
          reducedMotion={props.reducedMotion}
          selectedPart={props.selectedPart}
        />
      </SceneErrorBoundary>

      <div className={styles.stageCaption}>
        <span>Representative High-Bypass Two-Spool Turbofan</span>
        <span>Axial Datum: +X Propulsive Vector</span>
      </div>
    </div>
  );
}
