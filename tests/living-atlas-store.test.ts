import { beforeEach, describe, expect, it } from "vitest";
import { useLivingAtlasStore } from "@/lib/living-atlas/store";
import { trackAtlasEvent } from "@/lib/living-atlas/analytics";

describe("Living Atlas journey state", () => {
  beforeEach(() => {
    useLivingAtlasStore.getState().resetExperience();
  });

  it("catches navigation that moves before the first or beyond the last chapter", () => {
    const store = useLivingAtlasStore.getState();

    store.previousChapter();
    expect(useLivingAtlasStore.getState().currentChapterId).toBe("surface");

    for (let index = 0; index < 5; index += 1) {
      useLivingAtlasStore.getState().advanceChapter();
    }
    expect(useLivingAtlasStore.getState().currentChapterId).toBe("whole");
    expect(useLivingAtlasStore.getState().completed).toBe(false);

    useLivingAtlasStore.getState().advanceChapter();
    expect(useLivingAtlasStore.getState().currentChapterId).toBe("whole");
    expect(useLivingAtlasStore.getState().completed).toBe(true);
  });

  it("catches direct chapter navigation that leaves a stale completion state", () => {
    useLivingAtlasStore.getState().setChapter("pulse");
    expect(useLivingAtlasStore.getState().currentChapterId).toBe("pulse");

    useLivingAtlasStore.setState({ completed: true });
    useLivingAtlasStore.getState().setChapter("signal");
    expect(useLivingAtlasStore.getState().completed).toBe(false);
  });

  it("catches an explorer that cannot select and dismiss a hotspot", () => {
    useLivingAtlasStore.getState().selectHotspot("heart");
    expect(useLivingAtlasStore.getState().selectedHotspotId).toBe("heart");

    useLivingAtlasStore.getState().selectHotspot(null);
    expect(useLivingAtlasStore.getState().selectedHotspotId).toBeNull();
  });

  it("catches preferences that do not update independently", () => {
    useLivingAtlasStore.getState().setReducedMotion(true);
    expect(useLivingAtlasStore.getState().reducedMotion).toBe(true);
    expect(useLivingAtlasStore.getState().simplifiedView).toBe(false);

    useLivingAtlasStore.getState().setSimplifiedView(true);
    expect(useLivingAtlasStore.getState().simplifiedView).toBe(true);
    expect(useLivingAtlasStore.getState().reducedMotion).toBe(true);
  });

  it("catches a restart that retains progress or an open organ drawer", () => {
    useLivingAtlasStore.getState().startExperience();
    useLivingAtlasStore.getState().setChapter("fuel-motion");
    useLivingAtlasStore.getState().selectHotspot("liver");
    useLivingAtlasStore.setState({ completed: true });

    useLivingAtlasStore.getState().resetExperience();

    const reset = useLivingAtlasStore.getState();
    expect(reset.experienceStarted).toBe(false);
    expect(reset.currentChapterId).toBe("surface");
    expect(reset.selectedHotspotId).toBeNull();
    expect(reset.completed).toBe(false);
  });
});

describe("Living Atlas privacy-safe telemetry", () => {
  it("catches telemetry that fails to expose a useful aggregate event", () => {
    const captured: CustomEvent[] = [];
    const listener = (event: Event) => {
      captured.push(event as CustomEvent);
    };
    window.addEventListener("living-atlas:analytics", listener);

    trackAtlasEvent("chapter_seen", { chapterId: "breath" });

    expect(captured).toHaveLength(1);
    expect(captured[0].detail).toEqual({
      name: "chapter_seen",
      chapterId: "breath",
    });
    window.removeEventListener("living-atlas:analytics", listener);
  });
});
