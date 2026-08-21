"use client";

import dynamic from "next/dynamic";
import {
  Component,
  type ErrorInfo,
  type ReactNode,
  useEffect,
  useState,
} from "react";
import type { ComparisonScalePolicy } from "@/lib/space/atlas-scale";
import type { PlanetaryWorld, WorldMode } from "@/lib/space/atlas-schema";
import type { AtlasState } from "@/lib/space/atlas-store";
import { AtlasFallback } from "./AtlasFallback";
import styles from "./atlas.module.css";

export type RenderLayers = {
  baseTexture: string;
  bumpTexture?: string;
  cloudTexture?: string;
  ringTexture?: string;
  atmosphere: boolean;
  emissive: boolean;
  interior: boolean;
  magnetic: boolean;
  night: boolean;
  rings: boolean;
  showHotspots: boolean;
  useOfficialModel: boolean;
};

export type AtlasCanvasRuntimeProps = {
  world: PlanetaryWorld;
  mode: WorldMode;
  layers: RenderLayers;
  selectedHotspotId: string | null;
  lightAzimuth: number;
  lightElevation: number;
  reducedMotion: boolean;
  cameraCommand: AtlasState["cameraCommand"];
  compareWorld: PlanetaryWorld | null;
  compareScalePolicy: ComparisonScalePolicy;
  onSelectHotspot: (hotspotId: string) => void;
};

const InteractiveAtlasCanvas = dynamic(() => import("./AtlasCanvas"), {
  ssr: false,
  loading: () => (
    <div className={styles.rendererLoading} role="status">
      Loading high-resolution world…
    </div>
  ),
});

export function resolveRenderLayers(
  world: PlanetaryWorld,
  mode: WorldMode,
): RenderLayers {
  const texture = mode.textureKey
    ? world.assets.layers[mode.textureKey] ?? world.assets.color
    : world.assets.color;
  const ringTexture = world.assets.layers.rings;
  const cloudTexture = world.assets.layers.clouds;

  return {
    baseTexture: texture,
    bumpTexture: world.assets.bump,
    cloudTexture,
    ringTexture,
    atmosphere: mode.effect === "atmosphere" || mode.effect === "clouds",
    emissive: world.renderer.kind === "sun" || mode.effect === "night",
    interior: mode.effect === "interior",
    magnetic: mode.effect === "magnetic",
    night: mode.effect === "night",
    rings: mode.effect === "rings" || world.renderer.kind === "rings",
    showHotspots: mode.effect === "hotspots" || mode.effect === "temperature" || mode.effect === "lighting",
    useOfficialModel:
      mode.id === world.defaultModeId && world.id !== "sun" && world.id !== "moon",
  };
}

export function worldRenderDescription(world: PlanetaryWorld, mode: WorldMode) {
  return `${world.name}, ${mode.label} mode. ${mode.description} Drag to rotate, scroll or use the controls to zoom, and select a numbered feature to inspect it.`;
}

type BoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
};

type BoundaryState = { failed: boolean };

export class AtlasCanvasErrorBoundary extends Component<BoundaryProps, BoundaryState> {
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
  if (typeof navigator !== "undefined" && /jsdom/i.test(navigator.userAgent)) {
    return false;
  }
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function AtlasStage(props: Omit<AtlasCanvasRuntimeProps, "layers">) {
  const [webglAvailable, setWebglAvailable] = useState<boolean | null>(null);
  const layers = resolveRenderLayers(props.world, props.mode);
  const description = worldRenderDescription(props.world, props.mode);

  useEffect(() => {
    const calibration = window.setTimeout(() => {
      setWebglAvailable(supportsWebgl());
    }, 0);
    return () => window.clearTimeout(calibration);
  }, []);

  if (webglAvailable === null) {
    return (
      <div className={styles.rendererLoading} role="status">
        Calibrating planetary renderer…
      </div>
    );
  }

  if (!webglAvailable) {
    return <AtlasFallback world={props.world} mode={props.mode} />;
  }

  return (
    <div className={styles.rendererSurface} role="img" aria-label={description}>
      <AtlasCanvasErrorBoundary
        key={`${props.world.id}-${props.mode.id}`}
        fallback={<AtlasFallback world={props.world} mode={props.mode} reason="texture-error" />}
      >
        <InteractiveAtlasCanvas {...props} layers={layers} />
      </AtlasCanvasErrorBoundary>
    </div>
  );
}
