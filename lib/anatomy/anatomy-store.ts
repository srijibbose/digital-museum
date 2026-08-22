import { createStore, type StoreApi } from "zustand/vanilla";
import { anatomy, getAnatomySystem } from "@/content/anatomy";
import type {
  AnatomyModelKey,
  AnatomySystemId,
  AnatomyViewId,
} from "@/lib/anatomy/anatomy-schema";

export type AnatomyCameraCommand = "idle" | "zoom-in" | "zoom-out" | "reset";

export type AnatomyState = {
  systemId: AnatomySystemId;
  viewId: AnatomyViewId;
  selectedStructureId: string;
  expertMode: boolean;
  reducedMotion: boolean;
  layers: Record<AnatomyModelKey, boolean>;
  cameraCommand: { type: AnatomyCameraCommand; sequence: number };
  setSystem: (systemId: AnatomySystemId) => void;
  setView: (viewId: AnatomyViewId) => void;
  selectStructure: (structureId: string) => void;
  toggleExpertMode: () => void;
  setReducedMotion: (reducedMotion: boolean) => void;
  toggleLayer: (layer: AnatomyModelKey) => void;
  issueCameraCommand: (command: Exclude<AnatomyCameraCommand, "idle">) => void;
};

function createLayerLedger(): Record<AnatomyModelKey, boolean> {
  return Object.fromEntries(anatomy.models.map((model) => [model.key, true])) as Record<
    AnatomyModelKey,
    boolean
  >;
}

export function createAnatomyStore(): StoreApi<AnatomyState> {
  return createStore<AnatomyState>((set, get) => ({
    systemId: "cardiovascular",
    viewId: "context",
    selectedStructureId: "heart",
    expertMode: false,
    reducedMotion: false,
    layers: createLayerLedger(),
    cameraCommand: { type: "idle", sequence: 0 },

    setSystem: (systemId) => {
      const system = getAnatomySystem(systemId);
      set((state) => ({
        systemId,
        viewId: "context",
        selectedStructureId: system.defaultStructureId,
        layers: createLayerLedger(),
        cameraCommand: { type: "reset", sequence: state.cameraCommand.sequence + 1 },
      }));
    },
    setView: (viewId) => {
      const system = getAnatomySystem(get().systemId);
      if (system.availableViews.includes(viewId)) set({ viewId });
    },
    selectStructure: (structureId) => {
      const system = getAnatomySystem(get().systemId);
      if (system.structures.some((structure) => structure.id === structureId)) {
        set({ selectedStructureId: structureId });
      }
    },
    toggleExpertMode: () => set({ expertMode: !get().expertMode }),
    setReducedMotion: (reducedMotion) => set({ reducedMotion }),
    toggleLayer: (layer) =>
      set((state) => ({
        layers: { ...state.layers, [layer]: !state.layers[layer] },
      })),
    issueCameraCommand: (type) =>
      set((state) => ({
        cameraCommand: { type, sequence: state.cameraCommand.sequence + 1 },
      })),
  }));
}
