import { create } from "zustand";

export type SpaceExplorerState = {
  experienceStarted: boolean;
  activeModeId: string;
  selectedHotspotId: string | null;
  flyToId: string | null;
  visitedHotspotIds: string[];
  reducedMotion: boolean;
  simplifiedView: boolean;
  startExperience: () => void;
  setMode: (id: string) => void;
  selectHotspot: (id: string | null) => void;
  clearFlyTo: () => void;
  setReducedMotion: (value: boolean) => void;
  setSimplifiedView: (value: boolean) => void;
  resetExperience: () => void;
};

/**
 * Each exhibit (Moon, Earth, ...) gets its own store instance so state
 * never bleeds between bodies, even though the shape is identical.
 */
export function createSpaceStore(defaultModeId: string) {
  const initial = {
    experienceStarted: false,
    activeModeId: defaultModeId,
    selectedHotspotId: null as string | null,
    flyToId: null as string | null,
    visitedHotspotIds: [] as string[],
    reducedMotion: false,
    simplifiedView: false,
  };

  return create<SpaceExplorerState>((set, get) => ({
    ...initial,
    startExperience: () => set({ experienceStarted: true }),
    setMode: (id) => set({ activeModeId: id, selectedHotspotId: null, flyToId: null }),
    selectHotspot: (id) => {
      if (!id) {
        set({ selectedHotspotId: null });
        return;
      }
      set({
        selectedHotspotId: id,
        flyToId: id,
        visitedHotspotIds: get().visitedHotspotIds.includes(id)
          ? get().visitedHotspotIds
          : [...get().visitedHotspotIds, id],
      });
    },
    clearFlyTo: () => set({ flyToId: null }),
    setReducedMotion: (value) => set({ reducedMotion: value }),
    setSimplifiedView: (value) => set({ simplifiedView: value }),
    resetExperience: () => set(initial),
  }));
}
