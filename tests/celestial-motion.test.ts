import { describe, expect, it } from "vitest";
import {
  advanceMotionPhase,
  getJovianMotionProfile,
  getSolarMotionProfile,
  jovianJetVelocity,
  jovianVortexSample,
  resolveMotionChannels,
  resolveLivingMotionRenderer,
  wrapTextureU,
} from "@/lib/space/celestial-motion";

describe("celestial motion model", () => {
  it("gives each observational solar wavelength a distinct authored character", () => {
    const photosphere = getSolarMotionProfile("photosphere")!;
    const quietCorona = getSolarMotionProfile("171")!;
    const hotCorona = getSolarMotionProfile("193")!;
    const chromosphere = getSolarMotionProfile("304")!;

    expect(hotCorona.pulseSpeed).toBeGreaterThan(quietCorona.pulseSpeed);
    expect(chromosphere.distortion).toBeGreaterThan(photosphere.distortion);
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

  it("wraps moving cloud samples without exposing the map seam", () => {
    expect(wrapTextureU(1.03)).toBeCloseTo(0.03, 6);
    expect(wrapTextureU(-0.04)).toBeCloseTo(0.96, 6);
    expect(jovianVortexSample({ u: 0.69, v: 0.4 }, 1).influence).toBe(0);
  });

  it("freezes accumulated phase exactly when motion is disabled", () => {
    expect(advanceMotionPhase(2.5, 0.5, false, 3)).toBe(2.5);
    expect(advanceMotionPhase(2.5, 0.5, true, 3)).toBe(2.8);
  });

  it("keeps living weather active when automatic globe spin is paused", () => {
    expect(resolveMotionChannels({
      globeMotionEnabled: false,
      compareOpen: false,
      reducedMotion: false,
    })).toEqual({ globeSpin: false, livingSurface: true });

    expect(resolveMotionChannels({
      globeMotionEnabled: true,
      compareOpen: true,
      reducedMotion: false,
    })).toEqual({ globeSpin: false, livingSurface: false });

    expect(resolveMotionChannels({
      globeMotionEnabled: true,
      compareOpen: false,
      reducedMotion: true,
    })).toEqual({ globeSpin: false, livingSurface: false });
  });

  it("selects living renderers only for scientifically relevant existing modes", () => {
    expect(resolveLivingMotionRenderer("sun", "171", "solar")).toBe("solar");
    expect(resolveLivingMotionRenderer("sun", "interior", "none")).toBeNull();
    expect(resolveLivingMotionRenderer("jupiter", "storms", "atmosphere")).toBe("jovian");
    expect(resolveLivingMotionRenderer("jupiter", "interior", "none")).toBeNull();
    expect(resolveLivingMotionRenderer("neptune", "storms", "atmosphere")).toBeNull();
  });

  it("distinguishes Jupiter storm and aurora layers without animating explanatory modes", () => {
    expect(getJovianMotionProfile("clouds")!.jetSpeed).toBeGreaterThan(0.5);
    expect(getJovianMotionProfile("storms")!.jetSpeed)
      .toBeGreaterThan(getJovianMotionProfile("clouds")!.jetSpeed);
    expect(getJovianMotionProfile("storms")).toMatchObject({
      vortexStrength: expect.any(Number),
      auroraStrength: 0,
    });
    expect(getJovianMotionProfile("auroras")).toMatchObject({
      auroraStrength: expect.any(Number),
    });
    expect(getJovianMotionProfile("moons")).toBeNull();
  });

  it("keeps accelerated solar motion on the observed surface without exterior geometry", () => {
    const photosphere = getSolarMotionProfile("photosphere")!;
    const quietCorona = getSolarMotionProfile("171")!;
    const hotCorona = getSolarMotionProfile("193")!;
    const chromosphere = getSolarMotionProfile("304")!;

    for (const profile of [photosphere, quietCorona, hotCorona, chromosphere]) {
      expect(profile.exteriorTreatment).toBe("none");
      expect(profile.flowSpeed).toBeGreaterThan(0);
    }
  });
});
