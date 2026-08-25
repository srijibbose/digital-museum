import { describe, expect, it } from "vitest";
import { createAnatomyStore } from "@/lib/anatomy/anatomy-store";

describe("human anatomy interaction state", () => {
  it("opens on cardiovascular reference anatomy", () => {
    const state = createAnatomyStore().getState();
    expect(state.systemId).toBe("cardiovascular");
    expect(state.viewId).toBe("context");
    expect(state.selectedStructureId).toBe("heart");
    expect(Object.values(state.layers)).toHaveLength(21);
    expect(Object.values(state.layers).every(Boolean)).toBe(true);
  });

  it("changes systems as one coherent state transition", () => {
    const store = createAnatomyStore();
    store.getState().setView("pathway");
    store.getState().selectStructure("left-ventricle");
    store.getState().setSystem("respiratory");

    const state = store.getState();
    expect(state.systemId).toBe("respiratory");
    expect(state.viewId).toBe("context");
    expect(state.selectedStructureId).toBe("lungs");
    expect(state.cameraCommand.type).toBe("reset");
  });

  it("moves into an abdominal territory without carrying a thoracic selection", () => {
    const store = createAnatomyStore();
    store.getState().selectStructure("left-ventricle");
    store.getState().setSystem("digestive");

    expect(store.getState().selectedStructureId).toBe("digestive-territory");
    store.getState().selectStructure("porta-hepatis");
    expect(store.getState().selectedStructureId).toBe("porta-hepatis");
  });

  it("rejects structure ids outside the active system", () => {
    const store = createAnatomyStore();
    store.getState().selectStructure("trachea");
    expect(store.getState().selectedStructureId).toBe("heart");
  });

  it("makes every exposed control change explicit state", () => {
    const store = createAnatomyStore();
    store.getState().setView("isolate");
    store.getState().toggleLayer("lung");
    store.getState().toggleExpertMode();
    store.getState().issueCameraCommand("zoom-in");

    const state = store.getState();
    expect(state.viewId).toBe("isolate");
    expect(state.layers.lung).toBe(false);
    expect(state.expertMode).toBe(true);
    expect(state.cameraCommand.type).toBe("zoom-in");
    expect(state.cameraCommand.sequence).toBe(1);
  });

  it("rejects modes that the active scientific view does not offer", () => {
    const store = createAnatomyStore();
    store.getState().setSystem("immune");
    store.getState().setView("pathway");
    expect(store.getState().viewId).toBe("context");
  });
});
