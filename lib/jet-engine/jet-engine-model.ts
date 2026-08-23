import { getJetProfile } from "@/content/jet-engine";
import type { JetProfile, JetProfileId, JetStationId } from "./jet-engine-schema";

const GAMMA_COLD = 1.4;
const GAMMA_HOT = 1.33;
const CP_COLD = 1_004.5;
const CP_HOT = 1_180;
const GAS_CONSTANT = 287.05;
const FUEL_HEATING_VALUE = 43_000_000;
const BYPASS_RATIO = 8;

export const JET_MODEL_ASSUMPTIONS = {
  coldGasGamma: GAMMA_COLD,
  hotGasGamma: GAMMA_HOT,
  coldSpecificHeatJkgK: CP_COLD,
  hotSpecificHeatJkgK: CP_HOT,
  gasConstantJkgK: GAS_CONSTANT,
  fuelHeatingValueJkg: FUEL_HEATING_VALUE,
  bypassRatio: BYPASS_RATIO,
  inletPressureRecovery: 0.99,
  fanEfficiency: 0.9,
  compressorEfficiency: 0.88,
  combustorEfficiency: 0.99,
  combustorPressureRatio: 0.95,
  turbineEfficiency: 0.9,
  nozzleEfficiency: 0.95,
} as const;

export interface AtmosphereState {
  temperatureK: number;
  pressurePa: number;
  densityKgM3: number;
  speedOfSoundMs: number;
}

export interface JetStationState {
  temperatureK: number;
  pressureRatio: number;
  velocityMs: number | null;
}

export interface JetCycleResult {
  profile: JetProfile;
  atmosphere: AtmosphereState;
  stations: Record<JetStationId, JetStationState>;
  output: {
    specificThrustNsKg: number;
    fuelAirRatioGKg: number;
    bypassContributionPercent: number;
    fanExitVelocityMs: number;
    coreExitVelocityMs: number;
  };
}

export function standardAtmosphere(altitudeM: number): AtmosphereState {
  const boundedAltitude = Math.min(Math.max(altitudeM, 0), 20_000);
  let temperatureK: number;
  let pressurePa: number;

  if (boundedAltitude <= 11_000) {
    temperatureK = 288.15 - 0.0065 * boundedAltitude;
    pressurePa = 101_325 * Math.pow(temperatureK / 288.15, 5.2558797);
  } else {
    temperatureK = 216.65;
    const pressureAtTropopause = 22_632.06;
    pressurePa = pressureAtTropopause * Math.exp(
      (-9.80665 * (boundedAltitude - 11_000)) / (GAS_CONSTANT * temperatureK),
    );
  }

  return {
    temperatureK,
    pressurePa,
    densityKgM3: pressurePa / (GAS_CONSTANT * temperatureK),
    speedOfSoundMs: Math.sqrt(GAMMA_COLD * GAS_CONSTANT * temperatureK),
  };
}

function compressedTemperature(inletTemperatureK: number, pressureRatio: number, efficiency: number) {
  const idealRatio = Math.pow(pressureRatio, (GAMMA_COLD - 1) / GAMMA_COLD);
  return inletTemperatureK * (1 + (idealRatio - 1) / efficiency);
}

function expandedVelocity(
  totalTemperatureK: number,
  totalPressurePa: number,
  ambientPressurePa: number,
  gamma: number,
  specificHeat: number,
) {
  if (totalPressurePa <= ambientPressurePa) return 0;
  const temperatureRatio = Math.pow(ambientPressurePa / totalPressurePa, (gamma - 1) / gamma);
  return Math.sqrt(
    Math.max(
      0,
      2 * JET_MODEL_ASSUMPTIONS.nozzleEfficiency * specificHeat * totalTemperatureK * (1 - temperatureRatio),
    ),
  );
}

export function calculateJetCycle(profileOrId: JetProfile | JetProfileId): JetCycleResult {
  const profile = typeof profileOrId === "string" ? getJetProfile(profileOrId) : profileOrId;
  const atmosphere = standardAtmosphere(profile.altitudeM);
  const freeStreamVelocity = profile.mach * atmosphere.speedOfSoundMs;
  const ramTemperatureRatio = 1 + ((GAMMA_COLD - 1) / 2) * profile.mach ** 2;
  const totalTemperature0 = atmosphere.temperatureK * ramTemperatureRatio;
  const totalPressure0 = atmosphere.pressurePa
    * Math.pow(ramTemperatureRatio, GAMMA_COLD / (GAMMA_COLD - 1));

  const temperature2 = totalTemperature0;
  const pressure2 = totalPressure0 * JET_MODEL_ASSUMPTIONS.inletPressureRecovery;
  const temperatureFanExit = compressedTemperature(
    temperature2,
    profile.fanPressureRatio,
    JET_MODEL_ASSUMPTIONS.fanEfficiency,
  );
  const pressureFanExit = pressure2 * profile.fanPressureRatio;

  const coreCompressorRatio = profile.overallPressureRatio / profile.fanPressureRatio;
  const temperature3 = compressedTemperature(
    temperatureFanExit,
    coreCompressorRatio,
    JET_MODEL_ASSUMPTIONS.compressorEfficiency,
  );
  const pressure3 = pressure2 * profile.overallPressureRatio;
  const temperature4 = Math.max(profile.turbineInletTemperatureK, temperature3 + 80);
  const pressure4 = pressure3 * JET_MODEL_ASSUMPTIONS.combustorPressureRatio;

  const fanWork = CP_COLD * (temperatureFanExit - temperature2) * (1 + BYPASS_RATIO);
  const compressorWork = CP_COLD * (temperature3 - temperatureFanExit);
  const temperature5 = Math.max(
    temperatureFanExit + 60,
    temperature4 - (fanWork + compressorWork) / CP_HOT,
  );
  const isentropicTemperature5 = temperature4
    - (temperature4 - temperature5) / JET_MODEL_ASSUMPTIONS.turbineEfficiency;
  const pressure5 = pressure4 * Math.pow(
    Math.max(0.05, isentropicTemperature5 / temperature4),
    GAMMA_HOT / (GAMMA_HOT - 1),
  );

  const fanExitVelocity = expandedVelocity(
    temperatureFanExit,
    pressureFanExit,
    atmosphere.pressurePa,
    GAMMA_COLD,
    CP_COLD,
  );
  const coreExitVelocity = expandedVelocity(
    temperature5,
    pressure5,
    atmosphere.pressurePa,
    GAMMA_HOT,
    CP_HOT,
  );
  const fuelAirRatio = (CP_HOT * temperature4 - CP_COLD * temperature3)
    / (JET_MODEL_ASSUMPTIONS.combustorEfficiency * FUEL_HEATING_VALUE - CP_HOT * temperature4);
  const bypassSpecificThrust = BYPASS_RATIO * Math.max(0, fanExitVelocity - freeStreamVelocity);
  const coreSpecificThrust = Math.max(0, (1 + fuelAirRatio) * coreExitVelocity - freeStreamVelocity);
  const totalSpecificThrustPerCoreFlow = bypassSpecificThrust + coreSpecificThrust;
  const totalSpecificThrustPerInletFlow = totalSpecificThrustPerCoreFlow / (1 + BYPASS_RATIO);

  const pressureRatio = (pressurePa: number) => pressurePa / atmosphere.pressurePa;
  return {
    profile,
    atmosphere,
    stations: {
      "0": {
        temperatureK: atmosphere.temperatureK,
        pressureRatio: 1,
        velocityMs: freeStreamVelocity,
      },
      "2": {
        temperatureK: temperature2,
        pressureRatio: pressureRatio(pressure2),
        velocityMs: null,
      },
      f: {
        temperatureK: temperatureFanExit,
        pressureRatio: pressureRatio(pressureFanExit),
        velocityMs: fanExitVelocity,
      },
      "3": {
        temperatureK: temperature3,
        pressureRatio: pressureRatio(pressure3),
        velocityMs: null,
      },
      "4": {
        temperatureK: temperature4,
        pressureRatio: pressureRatio(pressure4),
        velocityMs: null,
      },
      "5": {
        temperatureK: temperature5,
        pressureRatio: pressureRatio(pressure5),
        velocityMs: null,
      },
      "8": {
        temperatureK: temperature5,
        pressureRatio: pressureRatio(pressure5),
        velocityMs: coreExitVelocity,
      },
    },
    output: {
      specificThrustNsKg: totalSpecificThrustPerInletFlow,
      fuelAirRatioGKg: Math.max(0, fuelAirRatio * 1_000),
      bypassContributionPercent: totalSpecificThrustPerCoreFlow > 0
        ? (bypassSpecificThrust / totalSpecificThrustPerCoreFlow) * 100
        : 0,
      fanExitVelocityMs: fanExitVelocity,
      coreExitVelocityMs: coreExitVelocity,
    },
  };
}

export function formatJetStationState(state: JetStationState) {
  return {
    temperature: `${Math.round(state.temperatureK).toLocaleString("en-US")} K`,
    pressure: `${state.pressureRatio.toFixed(state.pressureRatio < 10 ? 2 : 1)} × P₀`,
    velocity: state.velocityMs === null
      ? "Not resolved"
      : `${Math.round(state.velocityMs).toLocaleString("en-US")} m/s`,
  };
}
