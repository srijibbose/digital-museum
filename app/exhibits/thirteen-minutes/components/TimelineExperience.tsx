"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import {
  experienceReducer,
  initialExperienceState,
} from "../experience-reducer";
import { progressForBeat } from "../scene-state";
import { centeredBeatIndex } from "../scroll-state";
import type { ExhibitBeat } from "../types";
import styles from "../thirteen-minutes.module.css";
import { BeatSection } from "./BeatSection";
import { ComputerLoad } from "./ComputerLoad";
import { DescentExperience } from "./DescentExperience";
import { ExperienceControls } from "./ExperienceControls";
import { MissionHud } from "./MissionHud";
import { ProgressRail } from "./ProgressRail";

export type TimelineExperienceProps = {
  beats: ExhibitBeat[];
  exhibitTitle?: string;
};

function isInteractiveTarget(target: EventTarget | null) {
  return target instanceof HTMLElement && Boolean(target.closest("a, button, input, select, textarea"));
}

export function TimelineExperience({ beats, exhibitTitle }: TimelineExperienceProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState<number>(() =>
    beats[0] ? progressForBeat(beats[0].id) : 0,
  );
  const [enhanced, setEnhanced] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [experienceState, dispatchExperience] = useReducer(
    experienceReducer,
    initialExperienceState,
  );
  const beatRefs = useRef<Array<HTMLElement | null>>([]);
  const timelineRef = useRef<HTMLElement | null>(null);
  const activeBeat = beats[activeIndex] ?? beats[0];

  useEffect(() => {
    setEnhanced(true);
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(media.matches);
    updatePreference();
    media.addEventListener?.("change", updatePreference);
    return () => media.removeEventListener?.("change", updatePreference);
  }, []);

  // Universal native scroll listener ensuring real-time progress on touch devices
  useEffect(() => {
    const handleNativeScroll = () => {
      if (!timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total > 0) {
        const current = Math.max(0, Math.min(total, -rect.top));
        const rawProgress = current / total;
        setProgress(rawProgress);
      }
      const centeredIndex = centeredBeatIndex(
        beatRefs.current.map((section) =>
          section?.getBoundingClientRect() ?? {
            top: Number.POSITIVE_INFINITY,
            bottom: Number.POSITIVE_INFINITY,
          },
        ),
        window.innerHeight,
      );
      if (centeredIndex !== null) setActiveIndex(centeredIndex);
    };

    window.addEventListener("scroll", handleNativeScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleNativeScroll);
  }, []);

  const selectBeat = useCallback(
    (index: number, focus = true) => {
      const nextIndex = Math.max(0, Math.min(beats.length - 1, index));
      const section = beatRefs.current[nextIndex];
      setActiveIndex(nextIndex);
      setProgress(progressForBeat(beats[nextIndex].id));
      dispatchExperience({ type: "RESET_TRANSIENT" });
      if (section) {
        const root = document.documentElement;
        const previousScrollBehavior = root.style.scrollBehavior;
        root.style.scrollBehavior = "auto";
        try {
          section.scrollIntoView({ block: "start", behavior: "auto" });
        } finally {
          root.style.scrollBehavior = previousScrollBehavior;
        }
      }
      if (focus) {
        section?.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
      }
    },
    [beats],
  );

  useEffect(() => {
    if (
      reducedMotion ||
      typeof ResizeObserver !== "function" ||
      typeof CSS === "undefined" ||
      typeof CSS.supports !== "function" ||
      !CSS.supports("position", "sticky")
    ) {
      return;
    }

    let disposed = false;
    let cleanup: (() => void) | undefined;

    async function enhanceScroll() {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (disposed) return;

      gsap.registerPlugin(ScrollTrigger);
      const beatTriggers = beatRefs.current.flatMap((section, index) => {
        if (!section) return [];
        return [
          ScrollTrigger.create({
            trigger: section,
            start: "top center",
            end: "bottom center",
            onEnter: () => setActiveIndex(index),
            onEnterBack: () => setActiveIndex(index),
          }),
        ];
      });
      const progressTrigger = timelineRef.current
        ? ScrollTrigger.create({
            trigger: timelineRef.current,
            start: "top top",
            end: "bottom bottom",
            onUpdate: (self) => setProgress(self.progress),
          })
        : null;

      const syncCenteredBeat = () => {
        const centeredIndex = centeredBeatIndex(
          beatRefs.current.map((section) =>
            section?.getBoundingClientRect() ?? {
              top: Number.POSITIVE_INFINITY,
              bottom: Number.POSITIVE_INFINITY,
            },
          ),
          window.innerHeight,
        );
        if (centeredIndex !== null) setActiveIndex(centeredIndex);
      };

      const updateScrollTrigger = () => {
        ScrollTrigger.update();
        syncCenteredBeat();
      };

      window.addEventListener("scroll", updateScrollTrigger, { passive: true });
      ScrollTrigger.refresh();
      syncCenteredBeat();

      cleanup = () => {
        window.removeEventListener("scroll", updateScrollTrigger);
        progressTrigger?.kill();
        beatTriggers.forEach((trigger) => trigger.kill());
      };
    }

    void enhanceScroll().catch(() => undefined);

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [reducedMotion]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && (experienceState.inspect || experienceState.compare)) {
        event.preventDefault();
        dispatchExperience({ type: "RESET_TRANSIENT" });
        return;
      }
      if (isInteractiveTarget(event.target)) return;

      let nextIndex: number | null = null;
      if (["ArrowDown", "ArrowRight", "PageDown"].includes(event.key)) {
        nextIndex = activeIndex + 1;
      } else if (["ArrowUp", "ArrowLeft", "PageUp"].includes(event.key)) {
        nextIndex = activeIndex - 1;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = beats.length - 1;
      }

      if (nextIndex !== null) {
        event.preventDefault();
        selectBeat(nextIndex);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, beats.length, experienceState.compare, experienceState.inspect, selectBeat]);

  if (!activeBeat) return null;

  return (
    <section
      aria-label="Apollo 11 powered descent timeline"
      className={styles.timeline}
      data-active-beat={activeBeat.id}
      data-enhanced={String(enhanced)}
      data-reduced-motion={String(reducedMotion)}
      data-testid="timeline"
      id="mission-timeline"
      ref={timelineRef}
    >
      <div className={styles.sceneStage}>
        <DescentExperience
          activeBeat={activeBeat}
          activeIndex={activeIndex}
          compareMode={experienceState.compare}
          inspectMode={experienceState.inspect}
          progress={progress}
          reducedMotion={reducedMotion}
        />
      </div>
      <div className={styles.hudShell}>
        {exhibitTitle ? (
          <div aria-hidden="true" className={styles.sceneIdentity}>
            <span>Loupe exhibit</span>
            <strong>{exhibitTitle}</strong>
          </div>
        ) : null}
        <MissionHud
          activeLabel={activeBeat.label}
          animate={!reducedMotion}
          beatCount={beats.length}
          beatNumber={activeIndex + 1}
          telemetry={activeBeat}
        />
        <ProgressRail
          beats={beats}
          activeIndex={activeIndex}
          onSelect={(index) => selectBeat(index)}
        />
        {!reducedMotion && (
          <ExperienceControls
            activeBeatId={activeBeat.id}
            dispatch={dispatchExperience}
            state={experienceState}
          />
        )}
        {["program-alarm", "go-call"].includes(activeBeat.id) && (
          <ComputerLoad
            detail={experienceState.computerDetail}
            dispatch={dispatchExperience}
          />
        )}
        <nav aria-label="Previous and next mission beat" className={styles.controls}>
          <button
            aria-label={
              activeIndex > 0 ? `Previous: ${beats[activeIndex - 1].label}` : "Previous beat"
            }
            disabled={activeIndex === 0}
            onClick={() => selectBeat(activeIndex - 1)}
            type="button"
          >
            <span aria-hidden="true" className={styles.controlLong}>Previous</span>
            <span aria-hidden="true" className={styles.controlShort}>↑</span>
          </button>
          <button
            aria-label={
              activeIndex < beats.length - 1
                ? `Next: ${beats[activeIndex + 1].label}`
                : "Descent complete"
            }
            disabled={activeIndex === beats.length - 1}
            onClick={() => selectBeat(activeIndex + 1)}
            type="button"
          >
            <span aria-hidden="true" className={styles.controlLong}>Next</span>
            <span aria-hidden="true" className={styles.controlShort}>↓</span>
          </button>
        </nav>
      </div>

      <div className={styles.beatList}>
        {beats.map((beat, index) => (
          <BeatSection
            active={index === activeIndex}
            beat={beat}
            key={beat.id}
            ordinal={index + 1}
            setElement={(element) => {
              beatRefs.current[index] = element;
            }}
          />
        ))}
      </div>

      <p aria-live="polite" className={styles.srStatus}>
        Beat {activeIndex + 1} of {beats.length}: {activeBeat.label}
      </p>
    </section>
  );
}
