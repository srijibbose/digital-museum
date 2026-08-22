import type { MarsDeepTimeState } from "@/lib/space/mars-deep-time";

export type MarsDeepTimeRender = {
  atmosphereOpacity: number;
  waterOpacity: number;
  waterRadiusScale: number;
  waterLevel: number;
  iceOpacity: number;
  hazeOpacity: number;
  surfaceOxidation: number;
  surfaceTint: string;
};

function mix(from: number, to: number, progress: number) {
  return from + (to - from) * progress;
}

function channel(value: number) {
  return Math.round(value).toString(16).padStart(2, "0");
}

function mixColor(from: readonly [number, number, number], to: readonly [number, number, number], progress: number) {
  return `#${channel(mix(from[0], to[0], progress))}${channel(mix(from[1], to[1], progress))}${channel(mix(from[2], to[2], progress))}`;
}

export function resolveMarsDeepTimeRender(state: MarsDeepTimeState): MarsDeepTimeRender {
  const reconstructedIce = Math.max(0, state.ice - 0.42) / 0.36;
  const reconstructedHaze = Math.max(0, state.haze - 0.1) / 0.72;

  return {
    atmosphereOpacity: 0.012 + Math.max(0, state.atmosphere - 0.06) * 0.18,
    waterOpacity: state.water === 0 ? 0 : 0.14 + state.water * 0.5,
    waterRadiusScale: 1.003 + state.waterLine * 0.006,
    waterLevel: 0.2 + state.waterLine * 0.17,
    iceOpacity: Math.min(0.45, reconstructedIce * 0.45),
    hazeOpacity: Math.min(0.1, reconstructedHaze * 0.1),
    surfaceOxidation: state.oxidation,
    surfaceTint: mixColor([238, 236, 232], [255, 255, 255], state.oxidation),
  };
}
