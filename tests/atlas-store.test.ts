import { describe, expect, it } from "vitest";
import { createAtlasStore } from "@/lib/space/atlas-store";

describe("Atlas instrument store", () => {
  it("starts on the selected world and its authored default mode", () => {
    const store = createAtlasStore("earth");

    expect(store.getState().worldId).toBe("earth");
    expect(store.getState().activeModeId).toBe("surface");
    expect(store.getState().theme).toBe("light");
  });

  it("changes worlds, resets mode and selection, and keeps a visit ledger", () => {
    const store = createAtlasStore("moon");
    store.getState().selectHotspot("apollo-11");
    store.getState().setMode("missions");
    store.getState().setWorld("earth");

    expect(store.getState().worldId).toBe("earth");
    expect(store.getState().activeModeId).toBe("surface");
    expect(store.getState().selectedHotspotId).toBeNull();
    expect(store.getState().visitedByWorld.moon).toEqual(["apollo-11"]);
  });

  it("clears a selected hotspot when a new mode cannot show it", () => {
    const store = createAtlasStore("moon");
    store.getState().setMode("missions");
    const initialFocusSequence = store.getState().focusCommand.sequence;
    store.getState().focusHotspot("apollo-11");
    store.getState().setMode("water-ice");

    expect(store.getState().selectedHotspotId).toBeNull();
    expect(store.getState().focusCommand).toEqual({
      hotspotId: null,
      sequence: initialFocusSequence + 2,
    });
    expect(store.getState().activeModeId).toBe("water-ice");
  });

  it("never compares a world with itself", () => {
    const store = createAtlasStore("earth");
    store.getState().openCompare();
    store.getState().setCompareWorld("earth");

    expect(store.getState().compareOpen).toBe(true);
    expect(store.getState().compareWorldId).not.toBe("earth");
  });

  it("emits monotonic camera commands and updates scientific controls", () => {
    const store = createAtlasStore("moon");
    const initialSequence = store.getState().cameraCommand.sequence;
    store.getState().issueCameraCommand("zoom-in");
    store.getState().setLight(124, 18);
    store.getState().toggleTheme();

    expect(store.getState().cameraCommand).toEqual({
      type: "zoom-in",
      sequence: initialSequence + 1,
    });
    expect(store.getState().lightAzimuth).toBe(124);
    expect(store.getState().lightElevation).toBe(18);
    expect(store.getState().theme).toBe("dark");
  });

  it("uses Survey light for Earth and lets the visitor restore Natural light", () => {
    const store = createAtlasStore("earth");

    expect(store.getState().lightingMode).toBe("survey");
    store.getState().setLightingMode("natural");
    expect(store.getState().lightingMode).toBe("natural");

    store.getState().setWorld("mars");
    expect(store.getState().lightingMode).toBe("natural");
    store.getState().setWorld("earth");
    expect(store.getState().lightingMode).toBe("survey");
  });

  it("issues monotonic feature-focus commands and tracks orientation", () => {
    const store = createAtlasStore("earth");
    const initialSequence = store.getState().focusCommand.sequence;

    store.getState().focusHotspot("himalaya");
    expect(store.getState().selectedHotspotId).toBe("himalaya");
    expect(store.getState().focusCommand).toEqual({
      hotspotId: "himalaya",
      sequence: initialSequence + 1,
    });

    store.getState().setOrientation(18.4, -72.8);
    expect(store.getState().orientation).toEqual({
      latitude: 18.4,
      longitude: -72.8,
    });

    store.getState().clearFocus();
    expect(store.getState().selectedHotspotId).toBeNull();
    expect(store.getState().focusCommand.sequence).toBe(initialSequence + 2);
  });

  it("focuses an authored storm feature as soon as its mode opens", () => {
    const store = createAtlasStore("jupiter");
    const initialSequence = store.getState().focusCommand.sequence;

    store.getState().setMode("storms");

    expect(store.getState().selectedHotspotId).toBe("great-red-spot");
    expect(store.getState().focusCommand).toEqual({
      hotspotId: "great-red-spot",
      sequence: initialSequence + 1,
    });
    expect(store.getState().visitedByWorld.jupiter).toContain("great-red-spot");
  });

  it("disables authored motion when the visitor toggles it or requests reduced motion", () => {
    const store = createAtlasStore("jupiter");

    expect(store.getState().motionEnabled).toBe(true);
    store.getState().toggleMotion();
    expect(store.getState().motionEnabled).toBe(false);

    store.getState().setReducedMotion(true);
    expect(store.getState().reducedMotion).toBe(true);
    expect(store.getState().motionEnabled).toBe(false);
  });
});
