export const ENGINE_PART_IDS = [
  "fan",
  "lp-compressor",
  "hp-compressor",
  "combustor",
  "hp-turbine",
  "lp-turbine",
  "nozzle",
] as const;

export type EnginePartId = (typeof ENGINE_PART_IDS)[number];

export const AIRFLOW_STAGE_IDS = [
  "intake-fan",
  "compression",
  "combustion",
  "turbine",
  "exhaust-thrust",
] as const;

export type AirflowStageId = (typeof AIRFLOW_STAGE_IDS)[number];
export type ExperiencePhase = "parts" | "airflow" | "throttle";
export type ParticleMode = "streamlines" | "thermal" | "kinetic";
export type CameraViewPreset = "orbit" | "cutaway" | "intake" | "exhaust" | "combustor";

export type EnginePartContent = {
  id: EnginePartId;
  name: string;
  shortName: string;
  eyebrow: string;
  body: string;
  callout: string;
  accent: "cool" | "neutral" | "warm" | "hot";
  metallurgy: string;
  operatingTemp: string;
  pressureRatio: string;
  spoolAssociation: string;
  hotspotPosition: [number, number, number];
};

export type AirflowStageContent = {
  id: AirflowStageId;
  label: string;
  progress: number;
  throttle: number;
  body: string;
  annotation: string;
  cameraShot: "wide" | "core-front" | "combustor" | "turbines" | "exit";
  pressurePsi: number;
  temperatureC: number;
  machSpeed: number;
};

export type FullThrottleContent = {
  id: "full-throttle";
  title: string;
  subtitle: string;
  wing: "systems-and-machines";
  estimatedMinutes: number;
  hook: { kicker: string; text: string };
  context: { title: string; text: string; fact: string };
  parts: EnginePartContent[];
  airflowStages: AirflowStageContent[];
  throttle: { title: string; body: string; payoff: string };
  takeaway: { title: string; text: string };
  hud: Array<{ id: "fan" | "heat" | "thrust"; label: string; unit: "%" }>;
  accuracyNote: string;
  goDeeper: { label: string; url: string };
  sources: Array<{ label: string; url: string; supports: string }>;
};

export type EngineStateInput = {
  phase: ExperiencePhase;
  explode: number;
  airflowProgress: number;
  throttle: number;
  selectedPart: EnginePartId | null;
  reducedMotion: boolean;
  elapsedSeconds: number;
};

export type PartSceneState = {
  offset: number;
  opacity: number;
  highlighted: boolean;
};

export type TelemetryData = {
  n1RpmPercent: number;
  n2RpmPercent: number;
  egtCelsius: number;
  fuelFlowKgH: number;
  thrustKiloNewtons: number;
  thrustLbf: number;
  epr: number;
  bypassRatio: string;
};

export type EngineState = {
  explode: number;
  cameraProgress: number;
  lowSpool: number;
  highSpool: number;
  bypassFlow: number;
  coreFlow: number;
  heat: number;
  thrust: number;
  fan: number;
  activeStage: AirflowStageId;
  rotation: { low: number; high: number };
  parts: Record<EnginePartId, PartSceneState>;
  telemetry: TelemetryData;
};
