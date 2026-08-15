"use client";

import Link from "next/link";
import { Eye, EyeOff, Volume2, VolumeX, Waves } from "lucide-react";
import { livingAtlasChapters } from "@/content/living-atlas";
import { useLivingAtlasStore } from "@/lib/living-atlas/store";

export function ExperienceHUD() {
  const currentChapterId = useLivingAtlasStore((state) => state.currentChapterId);
  const reducedMotion = useLivingAtlasStore((state) => state.reducedMotion);
  const simplifiedView = useLivingAtlasStore((state) => state.simplifiedView);
  const soundEnabled = useLivingAtlasStore((state) => state.soundEnabled);
  const setChapter = useLivingAtlasStore((state) => state.setChapter);
  const setReducedMotion = useLivingAtlasStore((state) => state.setReducedMotion);
  const setSimplifiedView = useLivingAtlasStore((state) => state.setSimplifiedView);
  const setSoundEnabled = useLivingAtlasStore((state) => state.setSoundEnabled);

  return (
    <div className="experience-hud">
      <Link className="museum-mark experience-hud__mark" href="/" aria-label="Return to Loupe museum">
        <span className="museum-mark__orb" aria-hidden="true" />
        <span>LOUPE</span>
      </Link>

      <nav className="chapter-rail" aria-label="Living Atlas chapters">
        {livingAtlasChapters.map((chapter) => (
          <button
            key={chapter.id}
            aria-label={`Go to ${chapter.title}`}
            aria-current={chapter.id === currentChapterId ? "step" : undefined}
            onClick={() => setChapter(chapter.id)}
          >
            <span>{chapter.ordinal}</span>
            <i aria-hidden="true" />
          </button>
        ))}
      </nav>

      <div className="hud-controls" aria-label="Experience preferences">
        <button
          aria-label={reducedMotion ? "Enable full motion" : "Reduce motion"}
          aria-pressed={reducedMotion}
          onClick={() => setReducedMotion(!reducedMotion)}
          title={reducedMotion ? "Enable full motion" : "Reduce motion"}
        >
          <Waves size={16} aria-hidden="true" />
        </button>
        <button
          aria-label={simplifiedView ? "Switch to 3D atlas" : "Switch to simplified atlas"}
          aria-pressed={simplifiedView}
          onClick={() => setSimplifiedView(!simplifiedView)}
          title={simplifiedView ? "Switch to 3D atlas" : "Switch to simplified atlas"}
        >
          {simplifiedView ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
        </button>
        <button
          aria-label={soundEnabled ? "Mute ambient sound" : "Enable ambient sound"}
          aria-pressed={soundEnabled}
          onClick={() => setSoundEnabled(!soundEnabled)}
          title={soundEnabled ? "Mute ambient sound" : "Enable ambient sound"}
        >
          {soundEnabled ? <Volume2 size={16} aria-hidden="true" /> : <VolumeX size={16} aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
}
