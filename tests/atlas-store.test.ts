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
    store.getState().selectHotspot("apollo-11");
    store.getState().setMode("water-ice");

    expect(store.getState().selectedHotspotId).toBeNull();
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
});
