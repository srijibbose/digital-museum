import { createStore, type StoreApi } from "zustand/vanilla";
import { atlas, getVisibleHotspots, getWorld } from "@/content/space/atlas";
import type { WorldId } from "@/lib/space/atlas-schema";
import type { ComparisonScalePolicy } from "@/lib/space/atlas-scale";

export type AtlasTheme = "light" | "dark";
export type CameraCommandType = "idle" | "zoom-in" | "zoom-out" | "reset";

export type AtlasState = {
  worldId: WorldId;
  activeModeId: string;
  selectedHotspotId: string | null;
  visitedByWorld: Record<WorldId, string[]>;
  theme: AtlasTheme;
  reducedMotion: boolean;
  simplifiedView: boolean;
  lightAzimuth: number;
  lightElevation: number;
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
  setLight: (azimuth: number, elevation: number) => void;
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
  initialWorld: WorldId = "moon",
): StoreApi<AtlasState> {
  const initialBody = getWorld(initialWorld);

  return createStore<AtlasState>((set, get) => ({
    worldId: initialWorld,
    activeModeId: initialBody.defaultModeId,
    selectedHotspotId: null,
    visitedByWorld: createVisitLedger(),
    theme: "light",
    reducedMotion: false,
    simplifiedView: false,
    lightAzimuth: 34,
    lightElevation: 28,
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
        compareWorldId,
        cameraCommand: { type: "reset", sequence: state.cameraCommand.sequence + 1 },
      }));
    },

    setMode: (modeId) => {
      const world = getWorld(get().worldId);
      const mode = world.modes.find((item) => item.id === modeId);
      if (!mode) return;
      const selectedHotspotId = get().selectedHotspotId;
      const remainsVisible = selectedHotspotId
        ? getVisibleHotspots(world, modeId).some((hotspot) => hotspot.id === selectedHotspotId)
        : true;
      set({
        activeModeId: modeId,
        selectedHotspotId: remainsVisible ? selectedHotspotId : null,
      });
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
    setReducedMotion: (reducedMotion) => set({ reducedMotion }),
    setSimplifiedView: (simplifiedView) => set({ simplifiedView }),
    setLight: (azimuth, elevation) =>
      set({
        lightAzimuth: ((azimuth % 360) + 360) % 360,
        lightElevation: Math.max(-90, Math.min(90, elevation)),
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
