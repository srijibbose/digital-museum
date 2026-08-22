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
import { resolveLivingMotionRenderer } from "@/lib/space/celestial-motion";
import { resolveMarsDeepTimeState } from "@/lib/space/mars-deep-time";
import { AtlasFallback } from "./AtlasFallback";
import styles from "./atlas.module.css";

export type RenderLayers = {
  effect: WorldMode["effect"];
  lightingPolicy: WorldMode["lighting"];
  motion: WorldMode["motion"];
  baseTexture: string;
  bumpTexture?: string;
  topographyTexture?: string;
  bumpScale: number;
  displacementScale: number;
  reliefEnhanced: boolean;
  cloudTexture?: string;
  ringTexture?: string;
  atmosphere: boolean;
  emissive: boolean;
  selfLit: boolean;
  interior: boolean;
  magnetic: boolean;
  night: boolean;
  rings: boolean;
  showHotspots: boolean;
  deepTime: boolean;
};

export type AtlasCanvasRuntimeProps = {
  world: PlanetaryWorld;
  mode: WorldMode;
  layers: RenderLayers;
  selectedHotspotId: string | null;
  lightingMode: AtlasState["lightingMode"];
  lightAzimuth: number;
  lightElevation: number;
  reducedMotion: boolean;
  motionEnabled: boolean;
  marsTimeMya: number;
  marsPresentPreview: boolean;
  focusCommand: AtlasState["focusCommand"];
  cameraCommand: AtlasState["cameraCommand"];
  compareWorld: PlanetaryWorld | null;
  compareScalePolicy: ComparisonScalePolicy;
  onSelectHotspot: (hotspotId: string) => void;
  onOrientationChange: (latitude: number, longitude: number) => void;
  onManualOrbit: () => void;
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
  const texture = mode.effect === "rings"
    ? world.assets.color
    : mode.textureKey
    ? world.assets.layers[mode.textureKey] ?? world.assets.color
    : world.assets.color;
  const ringTexture = world.assets.layers.rings;
  const cloudTexture = world.assets.layers.clouds;
  const authoredBumpScale = "bumpScale" in world.renderer ? world.renderer.bumpScale : 0;

  return {
    effect: mode.effect,
    lightingPolicy: mode.lighting,
    motion: mode.motion,
    baseTexture: texture,
    bumpTexture: world.assets.bump,
    topographyTexture: mode.effect === "deep-time" ? world.assets.layers.elevation : undefined,
    bumpScale: mode.reliefScale ?? authoredBumpScale,
    displacementScale: mode.reliefScale ? mode.reliefScale * 0.55 : 0,
    reliefEnhanced: mode.reliefScale !== undefined,
    cloudTexture,
    ringTexture,
    atmosphere: mode.effect === "atmosphere" || mode.effect === "clouds",
    emissive: world.renderer.kind === "sun" || mode.effect === "night",
    selfLit: world.renderer.kind === "sun" || mode.effect === "night",
    interior: mode.effect === "interior",
    magnetic: mode.effect === "magnetic",
    night: mode.effect === "night",
    rings: mode.effect === "rings" || world.renderer.kind === "rings",
    showHotspots: world.hotspots.some((hotspot) => hotspot.modeIds.includes(mode.id)),
    deepTime: mode.effect === "deep-time",
  };
}

export function worldRenderDescription(world: PlanetaryWorld, mode: WorldMode, marsTimeMya?: number) {
  const deepTimeDescription = mode.effect === "deep-time" && marsTimeMya !== undefined
    ? (() => {
        const state = resolveMarsDeepTimeState(marsTimeMya);
        return `${state.dateLabel}: ${state.title}. Constrained reconstruction over observed terrain. ${state.interpolationLabel}.`;
      })()
    : "";
  const motionQualification = resolveLivingMotionRenderer(world.id, mode.id, mode.motion)
    ? " Movement is an accelerated motion visualization informed by scientific evidence and layered over the delivered scientific imagery."
    : "";
  return `${world.name}, ${mode.label} mode. ${mode.description} ${deepTimeDescription}${motionQualification} Drag to rotate, scroll or use the controls to zoom, and select a numbered feature to inspect it.`;
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
  const marsRenderTime = props.marsPresentPreview ? 0 : props.marsTimeMya;
  const description = worldRenderDescription(props.world, props.mode, marsRenderTime);

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
