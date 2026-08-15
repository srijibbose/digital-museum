"use client";

import dynamic from "next/dynamic";
import {
  Component,
  type ErrorInfo,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { resolveExperienceCapability, type ExperienceCapability } from "../experience-capability";
import type { ExhibitBeat } from "../types";
import styles from "../thirteen-minutes.module.css";
import { SceneFallback, type SceneFallbackReason } from "./SceneFallback";

const LunarScene = dynamic(
  () => import("./LunarScene").then((module) => module.LunarScene),
  { ssr: false },
);

type DescentExperienceProps = {
  activeBeat: ExhibitBeat;
  activeIndex: number;
  progress: number;
  reducedMotion: boolean;
  inspectMode?: boolean;
  compareMode?: boolean;
};

type SceneBoundaryProps = {
  children: ReactNode;
  onError: () => void;
};

class SceneBoundary extends Component<SceneBoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function canCreateWebGLContext() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) ??
        canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true }),
    );
  } catch {
    return false;
  }
}

function connectionSavesData() {
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;
  return Boolean(connection?.saveData);
}

export function DescentExperience({
  activeBeat,
  activeIndex,
  progress,
  reducedMotion,
  inspectMode = false,
  compareMode = false,
}: DescentExperienceProps) {
  const [capability, setCapability] = useState<ExperienceCapability>(() =>
    reducedMotion
      ? { mode: "static", reason: "reduced-motion" }
      : { mode: "static", reason: "no-webgl" },
  );
  const [ready, setReady] = useState(false);
  const [modelFailed, setModelFailed] = useState(false);
  const [nearViewport, setNearViewport] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const handleModelError = useCallback(() => setModelFailed(true), []);
  const handleReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    if (reducedMotion) return;
    const node = containerRef.current;
    if (!node) return;
    if (typeof IntersectionObserver !== "function") {
      setNearViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setNearViewport(true);
        observer.disconnect();
      },
      { rootMargin: "45% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) {
      setCapability({ mode: "static", reason: "reduced-motion" });
      setReady(false);
      return;
    }

    if (!nearViewport) {
      setReady(false);
      return;
    }

    const saveData = connectionSavesData();
    if (saveData) {
      setCapability({ mode: "static", reason: "reduced-data" });
      setReady(false);
      return;
    }

    const next = resolveExperienceCapability({
      hasWebGL: canCreateWebGLContext(),
      reducedMotion: false,
      saveData: false,
    });
    setCapability(next);
    if (next.mode === "static") setReady(false);
  }, [nearViewport, reducedMotion]);

  const fallbackReason: SceneFallbackReason = !nearViewport && !reducedMotion
    ? "loading"
    : modelFailed
    ? "model-error"
    : capability.mode === "static"
      ? capability.reason
      : "loading";

  return (
    <div
      aria-label="Interactive view of Eagle descending toward the Apollo 11 landing site"
      className={styles.descentExperience}
      data-experience-mode={modelFailed ? "static" : capability.mode}
      data-compare-mode={String(compareMode)}
      data-inspect-mode={String(inspectMode)}
      data-scene-beat={activeBeat.id}
      data-scene-progress={progress.toFixed(3)}
      data-testid="descent-experience"
      ref={containerRef}
      role="img"
    >
      {(!ready || capability.mode === "static" || modelFailed) && (
        <SceneFallback reason={fallbackReason} />
      )}

      {capability.mode === "live" && !modelFailed && (
        <SceneBoundary onError={handleModelError}>
          <LunarScene
            compareMode={compareMode}
            inspectMode={inspectMode}
            onReady={handleReady}
            progress={progress}
          />
        </SceneBoundary>
      )}

      <div className={styles.sceneChapterSignal} aria-hidden="true">
        <span>{String(activeIndex + 1).padStart(2, "0")}</span>
        <span>{activeBeat.label}</span>
      </div>
    </div>
  );
}
