"use client";

import dynamic from "next/dynamic";
import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ErrorInfo,
  type ReactNode,
} from "react";
import { getFlowerChapter } from "@/content/flowers";
import { resolveFlowerTimeline } from "@/lib/flowers/flower-timeline";
import type { FlowerCanvasProps } from "./FlowerCanvas";
import { FlowerFallback } from "./FlowerFallback";
import styles from "./flowers.module.css";

const InteractiveFlowerCanvas = dynamic(() => import("./FlowerCanvas"), {
  ssr: false,
  loading: () => (
    <div className={styles.rendererLoading} role="status">
      Resolving the Smithsonian specimen…
    </div>
  ),
});

type BoundaryState = { failed: boolean };

class FlowerCanvasBoundary extends Component<
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

export function flowerRenderDescription(progress: number) {
  const timeline = resolveFlowerTimeline(progress);
  const chapter = getFlowerChapter(timeline.chapterId);
  return `${chapter.shortTitle}, ${chapter.evidenceLabel.toLowerCase()}. ${chapter.thesis} Drag to orbit the real-time scene. Continue scrolling to advance the biological sequence.`;
}

export function FlowerStage(props: Omit<FlowerCanvasProps, "renderingActive">) {
  const [webglAvailable, setWebglAvailable] = useState<boolean | null>(null);
  const [modelReady, setModelReady] = useState(false);
  const [renderingActive, setRenderingActive] = useState(true);
  const surface = useRef<HTMLDivElement>(null);
  const timeline = resolveFlowerTimeline(props.progress);
  const chapter = getFlowerChapter(timeline.chapterId);
  const handleReady = useCallback(() => {
    setModelReady(true);
    props.onReady?.();
  }, [props.onReady]);

  useEffect(() => {
    const calibration = window.setTimeout(() => setWebglAvailable(supportsWebgl()), 0);
    return () => window.clearTimeout(calibration);
  }, []);

  useEffect(() => {
    if (!webglAvailable) return;
    const visibility = { page: !document.hidden, viewport: true };
    const update = () => setRenderingActive(visibility.page && visibility.viewport);
    const onVisibility = () => {
      visibility.page = !document.hidden;
      update();
    };
    document.addEventListener("visibilitychange", onVisibility);
    const observer = typeof IntersectionObserver === "undefined"
      ? null
      : new IntersectionObserver(([entry]) => {
          visibility.viewport = entry?.isIntersecting ?? true;
          update();
        }, { rootMargin: "240px" });
    if (surface.current) observer?.observe(surface.current);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      observer?.disconnect();
    };
  }, [webglAvailable]);

  return (
    <div
      ref={surface}
      className={styles.rendererSurface}
      data-renderer-state={webglAvailable === false ? "fallback" : modelReady ? "ready" : "loading"}
      aria-label={flowerRenderDescription(props.progress)}
      aria-busy={webglAvailable !== false && !modelReady}
    >
      {webglAvailable === false ? (
        <FlowerFallback chapter={chapter} />
      ) : webglAvailable === null ? (
        <div className={styles.rendererLoading} role="status">
          Checking interactive 3D support…
        </div>
      ) : (
        <FlowerCanvasBoundary
          resetKey={`${props.resetToken}:${props.replayToken}`}
          fallback={<FlowerFallback chapter={chapter} reason="model" />}
        >
          <InteractiveFlowerCanvas
            {...props}
            renderingActive={renderingActive}
            onReady={handleReady}
          />
          {!modelReady ? (
            <div className={styles.modelLoading} role="status">
              <span aria-hidden="true" />
              Loading observed surface geometry
            </div>
          ) : null}
        </FlowerCanvasBoundary>
      )}
    </div>
  );
}
