import type { EnginePartId } from "./types";

export const TURBOFAN_MODEL_URL = "models/turbofan-parts.glb";
export const TURBOFAN_POSTER_URL = "images/full-throttle-poster.webp";

export const TURBOFAN_REQUIRED_NODES = [
  "fan",
  "lp_compressor",
  "hp_compressor",
  "combustor",
  "hp_turbine",
  "lp_turbine",
  "nozzle",
] as const;

export const TURBOFAN_PART_NODES: Record<EnginePartId, string> = {
  fan: "fan",
  "lp-compressor": "lp_compressor",
  "hp-compressor": "hp_compressor",
  combustor: "combustor",
  "hp-turbine": "hp_turbine",
  "lp-turbine": "lp_turbine",
  nozzle: "nozzle",
};

export const TURBOFAN_SUPPORT_NODES = {
  lowPressureShaft: "lp_shaft",
  highPressureShaft: "hp_shaft",
  coreCase: "core_case",
  bypassDuct: "bypass_duct",
} as const;
