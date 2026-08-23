import { describe, expect, it } from "vitest";
import { jetEngine } from "@/content/jet-engine";
import { calculateJetCycle, standardAtmosphere } from "@/lib/jet-engine/jet-engine-model";

describe("jet-engine educational cycle", () => {
  it("reproduces standard-atmosphere reference conditions", () => {
    const seaLevel = standardAtmosphere(0);
    const cruise = standardAtmosphere(10_668);
    expect(seaLevel.temperatureK).toBeCloseTo(288.15, 2);
    expect(seaLevel.pressurePa).toBeCloseTo(101_325, -1);
    expect(cruise.temperatureK).toBeLessThan(220);
    expect(cruise.pressurePa).toBeGreaterThan(23_000);
    expect(cruise.pressurePa).toBeLessThan(25_000);
  });

  it.each(jetEngine.profiles.map((profile) => [profile.id] as const))(
    "keeps the %s profile thermodynamically coherent",
    (profileId) => {
      const result = calculateJetCycle(profileId);
      expect(result.stations["3"].pressureRatio).toBeGreaterThan(result.stations["2"].pressureRatio);
      expect(result.stations["3"].temperatureK).toBeGreaterThan(result.stations["2"].temperatureK);
      expect(result.stations["4"].temperatureK).toBeGreaterThan(result.stations["3"].temperatureK);
      expect(result.stations["5"].temperatureK).toBeLessThan(result.stations["4"].temperatureK);
      expect(result.output.specificThrustNsKg).toBeGreaterThanOrEqual(0);
      expect(result.output.fuelAirRatioGKg).toBeGreaterThan(0);
      expect(result.output.bypassContributionPercent).toBeGreaterThanOrEqual(0);
      expect(result.output.bypassContributionPercent).toBeLessThanOrEqual(100);
      expect(Number.isFinite(result.output.coreExitVelocityMs)).toBe(true);
      expect(result.stations["3"].velocityMs).toBeNull();
      expect(result.stations["4"].velocityMs).toBeNull();
      expect(result.stations["8"].velocityMs).toBe(result.output.coreExitVelocityMs);
    },
  );

  it("responds coherently when the operating condition changes", () => {
    const idle = calculateJetCycle("ground-idle");
    const takeoff = calculateJetCycle("takeoff");
    const cruise = calculateJetCycle("cruise");
    expect(takeoff.stations["4"].temperatureK).toBeGreaterThan(cruise.stations["4"].temperatureK);
    expect(takeoff.stations["3"].pressureRatio).toBeGreaterThan(idle.stations["3"].pressureRatio);
    expect(takeoff.output.specificThrustNsKg).toBeGreaterThan(idle.output.specificThrustNsKg);
    expect(takeoff.output.coreExitVelocityMs).toBeGreaterThan(0);
    expect(takeoff.output.bypassContributionPercent).toBeGreaterThan(60);
    expect(takeoff.output.bypassContributionPercent).toBeLessThan(95);
    expect(cruise.output.bypassContributionPercent).toBeGreaterThan(55);
    expect(cruise.output.bypassContributionPercent).toBeLessThan(95);
    expect(cruise.atmosphere.densityKgM3).toBeLessThan(idle.atmosphere.densityKgM3);
  });
});
