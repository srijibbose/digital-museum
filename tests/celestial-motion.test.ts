import { describe, expect, it } from "vitest";
import {
  advanceMotionPhase,
  getJovianMotionProfile,
  getSolarMotionProfile,
  jovianJetVelocity,
  jovianVortexSample,
  resolveLivingMotionRenderer,
} from "@/lib/space/celestial-motion";

describe("celestial motion model", () => {
  it("gives each observational solar wavelength a distinct authored character", () => {
    const photosphere = getSolarMotionProfile("photosphere")!;
    const quietCorona = getSolarMotionProfile("171")!;
    const hotCorona = getSolarMotionProfile("193")!;
    const chromosphere = getSolarMotionProfile("304")!;

    expect(photosphere.arcCount).toBeLessThan(quietCorona.arcCount);
    expect(hotCorona.pulseSpeed).toBeGreaterThan(quietCorona.pulseSpeed);
    expect(chromosphere.prominenceStrength).toBeGreaterThan(photosphere.prominenceStrength);
    expect(new Set([
      photosphere.flowScale,
      quietCorona.flowScale,
      hotCorona.flowScale,
      chromosphere.flowScale,
    ]).size).toBe(4);
    expect(getSolarMotionProfile("interior")).toBeNull();
  });

  it("produces smooth alternating Jovian zonal flow", () => {
    expect(jovianJetVelocity(0)).toBeGreaterThan(0.5);
    expect(jovianJetVelocity(9)).toBeLessThan(-0.5);
    expect(Math.abs(jovianJetVelocity(8.99) - jovianJetVelocity(9.01))).toBeLessThan(0.02);
    expect(Math.abs(jovianJetVelocity(85))).toBeLessThan(0.35);
  });

  it("keeps the Great Red Spot centre fixed while rotating nearby samples counter-clockwise", () => {
    const centre = jovianVortexSample({ u: 0.6083, v: 0.4 }, 1);
    const easternEdge = jovianVortexSample({ u: 0.64, v: 0.4 }, 1);
    const distant = jovianVortexSample({ u: 0.2, v: 0.8 }, 1);

    expect(centre).toMatchObject({ u: 0.6083, v: 0.4, influence: 1 });
    expect(easternEdge.v).toBeGreaterThan(0.4);
    expect(easternEdge.influence).toBeGreaterThan(0);
    expect(distant).toEqual({ u: 0.2, v: 0.8, influence: 0 });
  });

  it("freezes accumulated phase exactly when motion is disabled", () => {
    expect(advanceMotionPhase(2.5, 0.5, false, 3)).toBe(2.5);
    expect(advanceMotionPhase(2.5, 0.5, true, 3)).toBe(2.8);
  });

  it("selects living renderers only for scientifically relevant existing modes", () => {
    expect(resolveLivingMotionRenderer("sun", "171", "solar")).toBe("solar");
    expect(resolveLivingMotionRenderer("sun", "interior", "none")).toBeNull();
    expect(resolveLivingMotionRenderer("jupiter", "storms", "atmosphere")).toBe("jovian");
    expect(resolveLivingMotionRenderer("jupiter", "interior", "none")).toBeNull();
    expect(resolveLivingMotionRenderer("neptune", "storms", "atmosphere")).toBeNull();
  });

  it("distinguishes Jupiter storm and aurora layers without animating explanatory modes", () => {
    expect(getJovianMotionProfile("storms")).toMatchObject({
      vortexStrength: expect.any(Number),
      auroraStrength: 0,
    });
    expect(getJovianMotionProfile("auroras")).toMatchObject({
      auroraStrength: expect.any(Number),
    });
    expect(getJovianMotionProfile("moons")).toBeNull();
  });
});
