"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight, Eye, MoveDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnatomyFallback } from "./AnatomyFallback";
import { AmbientSoundscape } from "./AmbientSoundscape";
import { ChapterPanel } from "./ChapterPanel";
import { Epilogue } from "./Epilogue";
import { ExperienceHUD } from "./ExperienceHUD";
import { ExploreDrawer } from "./ExploreDrawer";
import { livingAtlasChapters } from "@/content/living-atlas";
import { trackAtlasEvent } from "@/lib/living-atlas/analytics";
import { useLivingAtlasStore } from "@/lib/living-atlas/store";

const AnatomyCanvas = dynamic(() => import("./AnatomyCanvas"), {
  ssr: false,
  loading: () => <div className="canvas-loading">Preparing the atlas…</div>,
});

export function LivingAtlasExperience() {
  const experienceStarted = useLivingAtlasStore((state) => state.experienceStarted);
  const currentChapterId = useLivingAtlasStore((state) => state.currentChapterId);
  const simplifiedView = useLivingAtlasStore((state) => state.simplifiedView);
  const completed = useLivingAtlasStore((state) => state.completed);
  const startExperience = useLivingAtlasStore((state) => state.startExperience);
  const setSimplifiedView = useLivingAtlasStore((state) => state.setSimplifiedView);
  const setReducedMotion = useLivingAtlasStore((state) => state.setReducedMotion);
  const reducedMotion = useLivingAtlasStore((state) => state.reducedMotion);
  const selectHotspot = useLivingAtlasStore((state) => state.selectHotspot);
  const advanceChapter = useLivingAtlasStore((state) => state.advanceChapter);
  const previousChapter = useLivingAtlasStore((state) => state.previousChapter);
  const resetExperience = useLivingAtlasStore((state) => state.resetExperience);
  const [webglAvailable, setWebglAvailable] = useState(false);
  const lastWheelAt = useRef(0);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(media.matches);
  }, [setReducedMotion]);

  useEffect(() => {
    if (typeof window.WebGLRenderingContext === "undefined") return;
    try {
      const canvas = document.createElement("canvas");
      setWebglAvailable(Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl")));
    } catch {
      setWebglAvailable(false);
    }
  }, []);

  useEffect(() => {
    if (experienceStarted || completed) window.scrollTo(0, 0);
  }, [completed, experienceStarted]);

  const chapter = useMemo(
    () => livingAtlasChapters.find((item) => item.id === currentChapterId)!,
    [currentChapterId],
  );
  const chapterIndex = livingAtlasChapters.findIndex((item) => item.id === currentChapterId);
  const previous = livingAtlasChapters[chapterIndex - 1];
  const next = livingAtlasChapters[chapterIndex + 1];

  useEffect(() => {
    if (!experienceStarted || completed) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowRight" || event.key === "PageDown") advanceChapter();
      if (event.key === "ArrowLeft" || event.key === "PageUp") previousChapter();
    }
    function onWheel(event: WheelEvent) {
      const now = Date.now();
      if (Math.abs(event.deltaY) < 45 || now - lastWheelAt.current < 900) return;
      lastWheelAt.current = now;
      if (event.deltaY > 0) advanceChapter();
      else previousChapter();
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("wheel", onWheel);
    };
  }, [advanceChapter, completed, experienceStarted, previousChapter]);

  function enterExperience(mode: "full" | "fallback") {
    if (mode === "fallback") setSimplifiedView(true);
    startExperience();
    trackAtlasEvent("exhibit_opened");
    trackAtlasEvent("webgl_mode_selected", {
      mode: mode === "fallback" ? "fallback" : "full",
    });
  }

  if (!experienceStarted) {
    return (
      <section className="atlas-threshold" aria-labelledby="atlas-title">
        <div className="threshold-topline">
          <Link className="museum-mark" href="/" aria-label="Loupe museum home">
            <span className="museum-mark__orb" aria-hidden="true" />
            <span>LOUPE</span>
          </Link>
          <span>Exhibit 001 · The body</span>
        </div>

        <div className="threshold-visual" aria-hidden="true">
          <div className="threshold-silhouette">
            <span />
          </div>
          <div className="threshold-ring threshold-ring--one" />
          <div className="threshold-ring threshold-ring--two" />
          <div className="threshold-ring threshold-ring--three" />
        </div>

        <div className="threshold-copy">
          <p className="kicker">An interactive anatomy</p>
          <h1 id="atlas-title">The Living Atlas</h1>
          <p className="threshold-copy__promise">
            In fifteen minutes, see how a body holds itself together — from a
            skin-level touch to a coordinated whole.
          </p>
          <div className="threshold-actions">
            <button className="primary-button" onClick={() => enterExperience("full")}>
              Begin the journey <ArrowRight size={18} aria-hidden="true" />
            </button>
            <button className="text-button" onClick={() => enterExperience("fallback")}>
              <Eye size={16} aria-hidden="true" /> Use simplified view
            </button>
          </div>
        </div>

        <div className="threshold-meta">
          <span>12–15 minute guided experience</span>
          <span>Sound optional · Keyboard accessible</span>
          <MoveDown size={17} aria-hidden="true" />
        </div>
      </section>
    );
  }

  if (completed) {
    return (
      <Epilogue
        onRestart={() => {
          resetExperience();
          useLivingAtlasStore.getState().startExperience();
        }}
      />
    );
  }

  return (
    <section
      className={`atlas-experience ${simplifiedView ? "is-simplified" : ""}`}
      style={{ "--chapter-accent": chapter.accent } as React.CSSProperties}
      aria-label="The Living Atlas interactive experience"
    >
      <AmbientSoundscape />
      <ExperienceHUD />
      {!simplifiedView && webglAvailable ? (
        <AnatomyCanvas
          chapterId={chapter.id}
          accent={chapter.accent}
          reducedMotion={reducedMotion}
          onSelectHotspot={selectHotspot}
          onFailure={() => setSimplifiedView(true)}
        />
      ) : (
        <AnatomyFallback chapter={chapter} />
      )}
      <div className="atlas-progress" aria-label={`Chapter ${chapter.ordinal} of 06`}>
        <span>{chapter.ordinal} / 06</span>
      </div>
      <ChapterPanel
        chapter={chapter}
        previousTitle={previous?.title}
        nextTitle={next?.title}
        onPrevious={() => {
          previousChapter();
          if (previous) trackAtlasEvent("chapter_seen", { chapterId: previous.id });
        }}
        onNext={() => {
          trackAtlasEvent("chapter_completed", { chapterId: chapter.id });
          advanceChapter();
          if (next) trackAtlasEvent("chapter_seen", { chapterId: next.id });
          else trackAtlasEvent("exhibit_completed");
        }}
        onExplore={() => selectHotspot(chapter.hotspotIds[0] ?? null)}
      />
      <ExploreDrawer chapter={chapter} />
    </section>
  );
}
