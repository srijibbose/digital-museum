import type { MotionKind, WorldId } from "@/lib/space/atlas-schema";

export type SolarMotionProfile = {
  flowScale: number;
  flowSpeed: number;
  distortion: number;
  pulseSpeed: number;
  exteriorTreatment: "none";
  tint: string;
};

export type JovianMotionProfile = {
  jetSpeed: number;
  warpStrength: number;
  vortexStrength: number;
  wakeStrength: number;
  auroraStrength: number;
};

const SOLAR_PROFILES = {
  photosphere: {
    flowScale: 8.2,
    flowSpeed: 0.42,
    distortion: 0.008,
    pulseSpeed: 0.42,
    exteriorTreatment: "none",
    tint: "#fff1cf",
  },
  "171": {
    flowScale: 5.4,
    flowSpeed: 0.32,
    distortion: 0.011,
    pulseSpeed: 0.32,
    exteriorTreatment: "none",
    tint: "#e3d86e",
  },
  "193": {
    flowScale: 6.6,
    flowSpeed: 0.5,
    distortion: 0.009,
    pulseSpeed: 0.68,
    exteriorTreatment: "none",
    tint: "#d4df78",
  },
  "304": {
    flowScale: 9.6,
    flowSpeed: 0.56,
    distortion: 0.013,
    pulseSpeed: 0.55,
    exteriorTreatment: "none",
    tint: "#ff7b35",
  },
} satisfies Record<string, SolarMotionProfile>;

const JOVIAN_PROFILES = {
  clouds: {
    jetSpeed: 0.62,
    warpStrength: 0.003,
    vortexStrength: 0.22,
    wakeStrength: 0.08,
    auroraStrength: 0,
  },
  storms: {
    jetSpeed: 0.82,
    warpStrength: 0.006,
    vortexStrength: 0.92,
    wakeStrength: 0.68,
    auroraStrength: 0,
  },
  auroras: {
    jetSpeed: 0.48,
    warpStrength: 0.002,
    vortexStrength: 0.16,
    wakeStrength: 0.04,
    auroraStrength: 0.78,
  },
} satisfies Record<string, JovianMotionProfile>;

export function getSolarMotionProfile(modeId: string): SolarMotionProfile | null {
  return SOLAR_PROFILES[modeId as keyof typeof SOLAR_PROFILES] ?? null;
}

export function getJovianMotionProfile(modeId: string): JovianMotionProfile | null {
  return JOVIAN_PROFILES[modeId as keyof typeof JOVIAN_PROFILES] ?? null;
}

export function jovianJetVelocity(latitudeDeg: number) {
  const radians = latitudeDeg * Math.PI / 180;
  const alternating = Math.sin((radians + 4.5 * Math.PI / 180) * 20);
  const polarEnvelope = 0.28 + 0.72 * Math.cos(radians) ** 2;
  return alternating * polarEnvelope;
}

export function wrapTextureU(value: number) {
  return ((value % 1) + 1) % 1;
}

export function jovianVortexSample(
  uv: { u: number; v: number },
  phase: number,
) {
  const centre = { u: 0.6083, v: 0.4 };
  const x = (uv.u - centre.u) / 0.07;
  const y = (uv.v - centre.v) / 0.045;
  const radiusSquared = x * x + y * y;

  if (radiusSquared >= 1) return { ...uv, influence: 0 };

  const influence = (1 - radiusSquared) ** 2;
  const angle = phase * 0.22 * influence;
  const rotatedX = x * Math.cos(angle) - y * Math.sin(angle);
  const rotatedY = x * Math.sin(angle) + y * Math.cos(angle);

  return {
    u: Number((centre.u + rotatedX * 0.07).toFixed(4)),
    v: Number((centre.v + rotatedY * 0.045).toFixed(4)),
    influence: Number(influence.toFixed(4)),
  };
}

export function advanceMotionPhase(
  phase: number,
  delta: number,
  enabled: boolean,
  speed = 1,
) {
  return enabled ? phase + Math.min(delta, 0.1) * speed : phase;
}

export function resolveMotionChannels({
  globeMotionEnabled,
  compareOpen,
  reducedMotion,
}: {
  globeMotionEnabled: boolean;
  compareOpen: boolean;
  reducedMotion: boolean;
}) {
  const available = !compareOpen && !reducedMotion;

  return {
    globeSpin: available && globeMotionEnabled,
    livingSurface: available,
  };
}

export function resolveLivingMotionRenderer(
  worldId: WorldId,
  modeId: string,
  motion: MotionKind,
) {
  if (worldId === "sun" && motion === "solar" && getSolarMotionProfile(modeId)) {
    return "solar" as const;
  }
  if (worldId === "jupiter" && motion === "atmosphere" && getJovianMotionProfile(modeId)) {
    return "jovian" as const;
  }
  return null;
}
