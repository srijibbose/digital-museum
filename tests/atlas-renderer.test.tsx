import { Component, type ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { getMode, getWorld } from "@/content/space/atlas";
import {
  AtlasCanvasErrorBoundary,
  AtlasStage,
  resolveRenderLayers,
  worldRenderDescription,
} from "@/components/space/AtlasStage";
import { AtlasFallback } from "@/components/space/AtlasFallback";

class ThrowingTexture extends Component {
  override render(): ReactNode {
    throw new Error("texture decode failed");
  }
}

describe("Atlas renderer contract", () => {
  afterEach(() => vi.restoreAllMocks());

  it("shows an honest loading state while WebGL capability is being calibrated", () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
    const world = getWorld("moon");

    render(
      <AtlasStage
        world={world}
        mode={getMode(world, "surface")}
        selectedHotspotId={null}
        lightingMode="natural"
        lightAzimuth={34}
        lightElevation={28}
        reducedMotion={false}
        motionEnabled
        focusCommand={{ hotspotId: null, sequence: 0 }}
        cameraCommand={{ type: "idle", sequence: 0 }}
        compareWorld={null}
        compareScalePolicy="normalized"
        onSelectHotspot={() => undefined}
        onOrientationChange={() => undefined}
        onManualOrbit={() => undefined}
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent(/calibrating planetary renderer/i);
  });

  it("uses the delivered scientific map when WebGL is unavailable", async () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
    const world = getWorld("moon");

    render(
      <AtlasStage
        world={world}
        mode={getMode(world, "surface")}
        selectedHotspotId={null}
        lightingMode="natural"
        lightAzimuth={34}
        lightElevation={28}
        reducedMotion={false}
        motionEnabled
        focusCommand={{ hotspotId: null, sequence: 0 }}
        cameraCommand={{ type: "idle", sequence: 0 }}
        compareWorld={null}
        compareScalePolicy="normalized"
        onSelectHotspot={() => undefined}
        onOrientationChange={() => undefined}
        onManualOrbit={() => undefined}
      />,
    );

    await waitFor(() =>
      expect(screen.getByRole("img", { name: /moon surface scientific map/i })).toBeInTheDocument(),
    );
    expect(screen.getByText(/interactive 3d is unavailable/i)).toBeInTheDocument();
  });

  it("turns renderer or texture exceptions into the same usable fallback", () => {
    const world = getWorld("earth");
    render(
      <AtlasCanvasErrorBoundary
        fallback={<AtlasFallback world={world} mode={getMode(world, "surface")} reason="texture-error" />}
      >
        <ThrowingTexture />
      </AtlasCanvasErrorBoundary>,
    );

    expect(screen.getByRole("img", { name: /earth surface scientific map/i })).toBeInTheDocument();
    expect(screen.getByText(/could not be decoded/i)).toBeInTheDocument();
  });

  it("maps authored modes to concrete texture and geometry layers", () => {
    const earth = getWorld("earth");
    const moon = getWorld("moon");
    const saturn = getWorld("saturn");
    const venus = getWorld("venus");
    const sun = getWorld("sun");

    expect(resolveRenderLayers(earth, getMode(earth, "night-lights"))).toMatchObject({
      baseTexture: earth.assets.layers.night,
      night: true,
    });
    expect(resolveRenderLayers(moon, getMode(moon, "interior"))).toMatchObject({ interior: true });
    expect(resolveRenderLayers(saturn, getMode(saturn, "rings"))).toMatchObject({
      baseTexture: saturn.assets.color,
      ringTexture: saturn.assets.layers.rings,
      rings: true,
    });
    expect(resolveRenderLayers(venus, getMode(venus, "radar"))).toMatchObject({
      baseTexture: venus.assets.layers.radar,
    });
    expect(resolveRenderLayers(sun, getMode(sun, "171"))).toMatchObject({
      baseTexture: sun.assets.layers["171"],
      emissive: true,
    });
  });

  it("maps reviewed modes to distinct lighting, motion, and scientific effects", () => {
    const sun = getWorld("sun");
    const mercury = getWorld("mercury");
    const jupiter = getWorld("jupiter");
    const saturn = getWorld("saturn");

    expect(resolveRenderLayers(sun, getMode(sun, "photosphere"))).toMatchObject({
      selfLit: true,
      lightingPolicy: "hidden",
      motion: "solar",
    });
    expect(resolveRenderLayers(mercury, getMode(mercury, "temperature"))).toMatchObject({
      effect: "temperature",
    });
    expect(resolveRenderLayers(mercury, getMode(mercury, "missions"))).toMatchObject({
      effect: "missions",
    });
    expect(resolveRenderLayers(jupiter, getMode(jupiter, "storms"))).toMatchObject({
      motion: "atmosphere",
    });
    expect(resolveRenderLayers(saturn, getMode(saturn, "magnetosphere"))).toMatchObject({
      magnetic: true,
      rings: true,
    });
  });

  it("turns authored relief modes into materially stronger terrain", () => {
    const moon = getWorld("moon");
    const mars = getWorld("mars");

    const moonSurface = resolveRenderLayers(moon, getMode(moon, "surface"));
    const moonTopography = resolveRenderLayers(moon, getMode(moon, "topography"));
    const marsSurface = resolveRenderLayers(mars, getMode(mars, "surface"));
    const marsTerrain = resolveRenderLayers(mars, getMode(mars, "terrain"));

    expect(moonTopography.bumpScale).toBeGreaterThan(moonSurface.bumpScale);
    expect(moonTopography.reliefEnhanced).toBe(true);
    expect(moonTopography.displacementScale).toBeGreaterThan(0);
    expect(moonSurface.displacementScale).toBe(0);
    expect(marsTerrain.bumpScale).toBeGreaterThan(marsSurface.bumpScale);
    expect(marsTerrain.reliefEnhanced).toBe(true);
    expect(marsTerrain.displacementScale).toBeGreaterThan(0);
  });

  it("shows feature markers only when the active mode authors visible features", () => {
    const jupiter = getWorld("jupiter");

    expect(resolveRenderLayers(jupiter, getMode(jupiter, "storms")).showHotspots).toBe(true);
    expect(resolveRenderLayers(jupiter, getMode(jupiter, "interior")).showHotspots).toBe(false);
  });

  it("publishes a useful non-visual renderer description", () => {
    const world = getWorld("jupiter");
    const description = worldRenderDescription(world, getMode(world, "storms"));

    expect(description).toMatch(/jupiter/i);
    expect(description).toMatch(/storms/i);
    expect(description).toMatch(/drag to rotate/i);
  });
});
