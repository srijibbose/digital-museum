import {
  AIRFLOW_STAGE_IDS,
  ENGINE_PART_IDS,
  type AirflowStageId,
  type EnginePartId,
  type EngineState,
  type EngineStateInput,
  type TelemetryData,
} from "./types";

export const AIRFLOW_STAGE_ANCHORS = [0, 0.25, 0.5, 0.75, 1] as const;

const explodedOffsets: Record<EnginePartId, number> = {
  fan: -2.6,
  "lp-compressor": -1.65,
  "hp-compressor": -0.75,
  combustor: 0.12,
  "hp-turbine": 0.82,
  "lp-turbine": 1.65,
  nozzle: 2.65,
};

const stageThrottle = [0.38, 0.52, 0.72, 0.76, 0.92] as const;

function clamp01(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

function nearestStageIndex(progress: number) {
  let nearest = 0;
  let distance = Number.POSITIVE_INFINITY;
  AIRFLOW_STAGE_ANCHORS.forEach((anchor, index) => {
    const nextDistance = Math.abs(progress - anchor);
    if (nextDistance < distance) {
      nearest = index;
      distance = nextDistance;
    }
  });
  return nearest;
}

function interpolate(values: readonly number[], progress: number) {
  const scaled = clamp01(progress) * (values.length - 1);
  const start = Math.floor(scaled);
  const end = Math.min(values.length - 1, start + 1);
  const local = scaled - start;
  return values[start] + (values[end] - values[start]) * local;
}

export function deriveEngineState(input: EngineStateInput): EngineState {
  const rawProgress = clamp01(input.airflowProgress);
  const stageIndex = nearestStageIndex(rawProgress);
  const cameraProgress = input.reducedMotion
    ? AIRFLOW_STAGE_ANCHORS[stageIndex]
    : rawProgress;
  const guidedThrottle = interpolate(stageThrottle, cameraProgress);
  const throttle = input.phase === "airflow" ? guidedThrottle : clamp01(input.throttle);
  const explode = input.phase === "parts" ? clamp01(input.explode) : 0;
  
  // Rotational spools with non-linear aerodynamic response
  const lowSpool = clamp01(0.06 + Math.pow(throttle, 1.25) * 0.94);
  const highSpool = clamp01(0.12 + Math.pow(throttle, 0.86) * 0.88);
  const phaseIsRunning = input.phase !== "parts";
  const heat = phaseIsRunning ? clamp01(0.08 + Math.pow(throttle, 0.92) * 0.92) : 0;
  const thrust = phaseIsRunning ? clamp01(Math.pow(throttle, 1.58)) : 0;
  const bypassFlow = phaseIsRunning ? clamp01(0.10 + throttle * 0.90) : 0;
  const coreFlow = phaseIsRunning ? clamp01(0.06 + highSpool * 0.88) : 0;
  const safeElapsed = Number.isFinite(input.elapsedSeconds) ? input.elapsedSeconds : 0;
  const selected = input.phase === "parts" ? input.selectedPart : null;

  const parts = Object.fromEntries(
    ENGINE_PART_IDS.map((partId) => [
      partId,
      {
        offset: explodedOffsets[partId] * explode,
        opacity: selected && selected !== partId ? 0.22 : 1,
        highlighted: selected === partId,
      },
    ]),
  ) as EngineState["parts"];

  // Real-world representative engineering telemetry
  const n1RpmPercent = Math.round((20 + lowSpool * 85) * 10) / 10;
  const n2RpmPercent = Math.round((58 + highSpool * 46) * 10) / 10;
  const egtCelsius = Math.round(380 + heat * 590);
  const fuelFlowKgH = Math.round(520 + Math.pow(throttle, 1.45) * 4400);
  const thrustKiloNewtons = Math.round((14 + thrust * 326) * 10) / 10;
  const thrustLbf = Math.round(thrustKiloNewtons * 224.8);
  const epr = Math.round((1.08 + Math.pow(throttle, 1.3) * 0.54) * 100) / 100;
  const bypassRatio = "10.4 : 1";

  const telemetry: TelemetryData = {
    n1RpmPercent,
    n2RpmPercent,
    egtCelsius,
    fuelFlowKgH,
    thrustKiloNewtons,
    thrustLbf,
    epr,
    bypassRatio,
  };

  return {
    explode,
    cameraProgress,
    lowSpool,
    highSpool,
    bypassFlow,
    coreFlow,
    heat,
    thrust,
    fan: lowSpool,
    activeStage: AIRFLOW_STAGE_IDS[stageIndex] as AirflowStageId,
    rotation: {
      low: input.reducedMotion ? 0 : safeElapsed * (0.4 + lowSpool * 5.8),
      high: input.reducedMotion ? 0 : safeElapsed * (0.8 + highSpool * 9.2),
    },
    parts,
    telemetry,
  };
}
