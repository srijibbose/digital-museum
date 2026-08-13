import { create } from "zustand";
import { livingAtlasChapters } from "@/content/living-atlas";
import type { ChapterId, HotspotId } from "@/lib/living-atlas/schema";

type LivingAtlasState = {
  experienceStarted: boolean;
  currentChapterId: ChapterId;
  selectedHotspotId: HotspotId | null;
  reducedMotion: boolean;
  simplifiedView: boolean;
  soundEnabled: boolean;
  completed: boolean;
  startExperience: () => void;
  advanceChapter: () => void;
  previousChapter: () => void;
  setChapter: (id: ChapterId) => void;
  selectHotspot: (id: HotspotId | null) => void;
  setReducedMotion: (value: boolean) => void;
  setSimplifiedView: (value: boolean) => void;
  setSoundEnabled: (value: boolean) => void;
  resetExperience: () => void;
};

const initialJourneyState = {
  experienceStarted: false,
  currentChapterId: "surface" as ChapterId,
  selectedHotspotId: null,
  reducedMotion: false,
  simplifiedView: false,
  soundEnabled: false,
  completed: false,
};

const orderedIds = livingAtlasChapters.map((chapter) => chapter.id);

export const useLivingAtlasStore = create<LivingAtlasState>((set, get) => ({
  ...initialJourneyState,
  startExperience: () => set({ experienceStarted: true, completed: false }),
  advanceChapter: () => {
    const currentIndex = orderedIds.indexOf(get().currentChapterId);
    if (currentIndex === orderedIds.length - 1) {
      set({ completed: true, selectedHotspotId: null });
      return;
    }

    set({
      currentChapterId: orderedIds[currentIndex + 1],
      selectedHotspotId: null,
      completed: false,
    });
  },
  previousChapter: () => {
    const currentIndex = orderedIds.indexOf(get().currentChapterId);
    if (get().completed) {
      set({ completed: false });
      return;
    }

    if (currentIndex > 0) {
      set({
        currentChapterId: orderedIds[currentIndex - 1],
        selectedHotspotId: null,
      });
    }
  },
  setChapter: (id) =>
    set({ currentChapterId: id, selectedHotspotId: null, completed: false }),
  selectHotspot: (id) => set({ selectedHotspotId: id }),
  setReducedMotion: (value) => set({ reducedMotion: value }),
  setSimplifiedView: (value) => set({ simplifiedView: value }),
  setSoundEnabled: (value) => set({ soundEnabled: value }),
  resetExperience: () => set(initialJourneyState),
}));
