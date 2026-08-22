import { createStore, type StoreApi } from "zustand/vanilla";
import { atlas, getVisibleHotspots, getWorld } from "@/content/space/atlas";
import {
  MARS_DEEP_TIME_ENTRY_MYA,
  clampMarsTime,
} from "@/lib/space/mars-deep-time";
import type { WorldId } from "@/lib/space/atlas-schema";
import type { ComparisonScalePolicy } from "@/lib/space/atlas-scale";

export type AtlasTheme = "light" | "dark";
export type LightingMode = "natural" | "survey";
export type CameraCommandType = "idle" | "zoom-in" | "zoom-out" | "reset";

export type AtlasState = {
  worldId: WorldId;
  activeModeId: string;
  selectedHotspotId: string | null;
  visitedByWorld: Record<WorldId, string[]>;
  theme: AtlasTheme;
  reducedMotion: boolean;
  simplifiedView: boolean;
  lightingMode: LightingMode;
  lightAzimuth: number;
  lightElevation: number;
  motionEnabled: boolean;
  marsTimeMya: number;
  marsPresentPreview: boolean;
  focusCommand: { hotspotId: string | null; sequence: number };
  orientation: { latitude: number; longitude: number };
  compareOpen: boolean;
  compareWorldId: WorldId;
  compareScalePolicy: ComparisonScalePolicy;
  cameraCommand: { type: CameraCommandType; sequence: number };
  setWorld: (worldId: WorldId) => void;
  setMode: (modeId: string) => void;
  selectHotspot: (hotspotId: string | null) => void;
  toggleTheme: () => void;
  setTheme: (theme: AtlasTheme) => void;
  setReducedMotion: (value: boolean) => void;
  setSimplifiedView: (value: boolean) => void;
  setLightingMode: (mode: LightingMode) => void;
  setLight: (azimuth: number, elevation: number) => void;
  toggleMotion: () => void;
  setMarsTimeMya: (value: number) => void;
  setMarsPresentPreview: (value: boolean) => void;
  focusHotspot: (hotspotId: string) => void;
  clearFocus: () => void;
  setOrientation: (latitude: number, longitude: number) => void;
  openCompare: () => void;
  closeCompare: () => void;
  setCompareWorld: (worldId: WorldId) => void;
  setCompareScalePolicy: (policy: ComparisonScalePolicy) => void;
  issueCameraCommand: (type: Exclude<CameraCommandType, "idle">) => void;
};

function createVisitLedger(): Record<WorldId, string[]> {
  return atlas.worlds.reduce<Record<WorldId, string[]>>(
    (ledger, world) => {
      ledger[world.id] = [];
      return ledger;
    },
    {} as Record<WorldId, string[]>,
  );
}

function alternateWorld(primary: WorldId): WorldId {
  return atlas.worlds.find((world) => world.id !== primary)?.id ?? "moon";
}

export function createAtlasStore(
  initialWorld: WorldId = "venus",
): StoreApi<AtlasState> {
  const initialBody = getWorld(initialWorld);

  return createStore<AtlasState>((set, get) => ({
    worldId: initialWorld,
    activeModeId: initialBody.defaultModeId,
    selectedHotspotId: null,
    visitedByWorld: createVisitLedger(),
    theme: "dark",
    reducedMotion: false,
    simplifiedView: false,
    lightingMode: initialWorld === "earth" ? "survey" : "natural",
    lightAzimuth: 34,
    lightElevation: 28,
    motionEnabled: true,
    marsTimeMya: MARS_DEEP_TIME_ENTRY_MYA,
    marsPresentPreview: false,
    focusCommand: { hotspotId: null, sequence: 0 },
    orientation: { latitude: 0, longitude: 0 },
    compareOpen: false,
    compareWorldId: alternateWorld(initialWorld),
    compareScalePolicy: "normalized",
    cameraCommand: { type: "idle", sequence: 0 },

    setWorld: (worldId) => {
      const world = getWorld(worldId);
      const compareWorldId =
        get().compareWorldId === worldId ? alternateWorld(worldId) : get().compareWorldId;
      set((state) => ({
        worldId,
        activeModeId: world.defaultModeId,
        selectedHotspotId: null,
        lightingMode: worldId === "earth" ? "survey" : "natural",
        focusCommand: {
          hotspotId: null,
          sequence: state.focusCommand.sequence + 1,
        },
        orientation: { latitude: 0, longitude: 0 },
        marsPresentPreview: false,
        compareWorldId,
        cameraCommand: { type: "reset", sequence: state.cameraCommand.sequence + 1 },
      }));
    },

    setMode: (modeId) => {
      const world = getWorld(get().worldId);
      const mode = world.modes.find((item) => item.id === modeId);
      if (!mode) return;
      const selectedHotspotId = get().selectedHotspotId;
      const visibleHotspots = getVisibleHotspots(world, modeId);
      const remainsVisible = selectedHotspotId
        ? visibleHotspots.some((hotspot) => hotspot.id === selectedHotspotId)
        : true;
      const entryFocusHotspotId = mode.focusHotspotId && visibleHotspots.some(
        (hotspot) => hotspot.id === mode.focusHotspotId,
      )
        ? mode.focusHotspotId
        : null;
      set((state) => ({
        activeModeId: modeId,
        selectedHotspotId: entryFocusHotspotId ?? (remainsVisible ? selectedHotspotId : null),
        ...(entryFocusHotspotId || !remainsVisible
          ? {
              focusCommand: {
                hotspotId: entryFocusHotspotId,
                sequence: state.focusCommand.sequence + 1,
              },
            }
          : {}),
        ...(entryFocusHotspotId
          ? {
              visitedByWorld: {
                ...state.visitedByWorld,
                [state.worldId]: state.visitedByWorld[state.worldId].includes(entryFocusHotspotId)
                  ? state.visitedByWorld[state.worldId]
                  : [...state.visitedByWorld[state.worldId], entryFocusHotspotId],
              },
            }
          : {}),
      }));
    },

    selectHotspot: (hotspotId) => {
      if (!hotspotId) {
        set({ selectedHotspotId: null });
        return;
      }
      const worldId = get().worldId;
      const world = getWorld(worldId);
      if (!world.hotspots.some((hotspot) => hotspot.id === hotspotId)) return;
      const visited = get().visitedByWorld[worldId];
      set({
        selectedHotspotId: hotspotId,
        visitedByWorld: {
          ...get().visitedByWorld,
          [worldId]: visited.includes(hotspotId) ? visited : [...visited, hotspotId],
        },
      });
    },

    toggleTheme: () => set({ theme: get().theme === "light" ? "dark" : "light" }),
    setTheme: (theme) => set({ theme }),
    setReducedMotion: (reducedMotion) =>
      set({
        reducedMotion,
        ...(reducedMotion ? { motionEnabled: false } : {}),
      }),
    setSimplifiedView: (simplifiedView) => set({ simplifiedView }),
    setLightingMode: (lightingMode) => set({ lightingMode }),
    setLight: (azimuth, elevation) =>
      set({
        lightAzimuth: ((azimuth % 360) + 360) % 360,
        lightElevation: Math.max(-90, Math.min(90, elevation)),
      }),
    toggleMotion: () => {
      if (get().reducedMotion) return;
      set({ motionEnabled: !get().motionEnabled });
    },
    setMarsTimeMya: (marsTimeMya) =>
      set({ marsTimeMya: clampMarsTime(marsTimeMya) }),
    setMarsPresentPreview: (marsPresentPreview) => set({ marsPresentPreview }),
    focusHotspot: (hotspotId) => {
      const worldId = get().worldId;
      const world = getWorld(worldId);
      if (!world.hotspots.some((hotspot) => hotspot.id === hotspotId)) return;
      get().selectHotspot(hotspotId);
      set((state) => ({
        focusCommand: {
          hotspotId,
          sequence: state.focusCommand.sequence + 1,
        },
      }));
    },
    clearFocus: () =>
      set((state) => ({
        selectedHotspotId: null,
        focusCommand: {
          hotspotId: null,
          sequence: state.focusCommand.sequence + 1,
        },
      })),
    setOrientation: (latitude, longitude) =>
      set({
        orientation: {
          latitude: Math.max(-90, Math.min(90, latitude)),
          longitude:
            longitude >= -180 && longitude <= 180
              ? longitude
              : ((longitude + 180) % 360 + 360) % 360 - 180,
        },
      }),
    openCompare: () => set({ compareOpen: true }),
    closeCompare: () => set({ compareOpen: false }),
    setCompareWorld: (worldId) =>
      set({ compareWorldId: worldId === get().worldId ? alternateWorld(worldId) : worldId }),
    setCompareScalePolicy: (compareScalePolicy) => set({ compareScalePolicy }),
    issueCameraCommand: (type) =>
      set((state) => ({
        cameraCommand: { type, sequence: state.cameraCommand.sequence + 1 },
      })),
  }));
}
