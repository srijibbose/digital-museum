"use client";

import { Eye, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  MARS_DEEP_TIME_ANCHORS,
  MARS_DEEP_TIME_MAX_MYA,
  formatMarsTime,
  marsTimeToSlider,
  resolveMarsDeepTimeState,
  sliderToMarsTime,
} from "@/lib/space/mars-deep-time";
import styles from "./atlas.module.css";

const ANCHOR_TRAVEL_MS = 760;
const FULL_JOURNEY_MS = 18_000;
const HOLD_THRESHOLD_MS = 220;

type MarsTimeMachineProps = {
  value: number;
  presentPreview: boolean;
  reducedMotion: boolean;
  onChange: (value: number) => void;
  onPresentPreviewChange: (value: boolean) => void;
};

function easeOutCubic(progress: number) {
  return 1 - (1 - progress) ** 3;
}

export function MarsTimeMachine({
  value,
  presentPreview,
  reducedMotion,
  onChange,
  onPresentPreviewChange,
}: MarsTimeMachineProps) {
  const [playing, setPlaying] = useState(false);
  const [announcement, setAnnouncement] = useState(() => `Deep Time ready at ${formatMarsTime(value)}.`);
  const frameRef = useRef<number | null>(null);
  const holdStartedAtRef = useRef(0);
  const ignoreNextClickRef = useRef(false);
  const pointerPreviewActiveRef = useRef(false);
  const visibleTime = presentPreview ? 0 : value;
  const isPresentReference = visibleTime === 0;
  const state = useMemo(() => resolveMarsDeepTimeState(visibleTime), [visibleTime]);

  const stopAnimation = useCallback(() => {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    setPlaying(false);
  }, []);

  useEffect(() => stopAnimation, [stopAnimation]);

  const animateTo = useCallback((target: number, duration: number, autoplay = false) => {
    stopAnimation();
    const from = value === target && autoplay ? MARS_DEEP_TIME_MAX_MYA : value;
    if (from !== value) onChange(from);
    if (reducedMotion) {
      onChange(target);
      setAnnouncement(`${formatMarsTime(target)}. ${resolveMarsDeepTimeState(target).title}.`);
      return;
    }

    const startedAt = performance.now();
    setPlaying(autoplay);
    const tick = (now: number) => {
      const progress = Math.min(1, Math.max(0, (now - startedAt) / duration));
      const eased = autoplay ? progress : easeOutCubic(progress);
      onChange(from + (target - from) * eased);
      if (progress < 1) {
        frameRef.current = window.requestAnimationFrame(tick);
        return;
      }
      frameRef.current = null;
      setPlaying(false);
      setAnnouncement(`${formatMarsTime(target)}. ${resolveMarsDeepTimeState(target).title}.`);
    };
    frameRef.current = window.requestAnimationFrame(tick);
  }, [onChange, reducedMotion, stopAnimation, value]);

  const togglePlayback = () => {
    if (playing) {
      stopAnimation();
      setAnnouncement(`Journey paused at ${formatMarsTime(value)}.`);
      return;
    }
    animateTo(0, FULL_JOURNEY_MS, true);
  };

  const restorePresentPreview = () => {
    onPresentPreviewChange(false);
  };

  return (
    <section
      className={styles.marsTimeMachine}
      data-playing={playing || undefined}
      data-preview={presentPreview || undefined}
      data-testid="mars-time-machine"
      aria-labelledby="mars-time-title"
      style={{ "--mars-progress": `${(marsTimeToSlider(value) / MARS_DEEP_TIME_MAX_MYA) * 100}%` } as React.CSSProperties}
    >
      <div className={styles.marsTimeHeader}>
        <div>
          <span className={styles.marsTimeKicker}>
            {isPresentReference ? "Deep time · observed reference" : "Deep time · constrained reconstruction"}
          </span>
          <strong id="mars-time-title">{state.dateLabel}</strong>
          <small>{state.period} · {state.title}</small>
        </div>
        <div className={styles.marsTimeActions}>
          <button
            type="button"
            aria-label={playing ? "Pause journey" : "Play toward present"}
            aria-pressed={playing}
            disabled={reducedMotion}
            title={reducedMotion ? "Autoplay is disabled by your reduced-motion preference." : undefined}
            onClick={togglePlayback}
          >
            {playing ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}
            <span>{playing ? "Pause" : "Play"}</span>
          </button>
          <button
            type="button"
            aria-label="Present reference"
            aria-pressed={presentPreview}
            onPointerDown={() => {
              stopAnimation();
              holdStartedAtRef.current = performance.now();
              ignoreNextClickRef.current = false;
              pointerPreviewActiveRef.current = true;
              onPresentPreviewChange(true);
            }}
            onPointerUp={() => {
              const wasHold = performance.now() - holdStartedAtRef.current >= HOLD_THRESHOLD_MS;
              ignoreNextClickRef.current = wasHold;
              pointerPreviewActiveRef.current = false;
              restorePresentPreview();
            }}
            onPointerCancel={() => {
              ignoreNextClickRef.current = true;
              pointerPreviewActiveRef.current = false;
              restorePresentPreview();
            }}
            onPointerLeave={() => {
              if (!pointerPreviewActiveRef.current) return;
              ignoreNextClickRef.current = true;
              pointerPreviewActiveRef.current = false;
              restorePresentPreview();
            }}
            onBlur={restorePresentPreview}
            onKeyDown={(event) => {
              if (event.key !== "Enter" && event.key !== " ") return;
              if (event.repeat) return;
              event.preventDefault();
              stopAnimation();
              onPresentPreviewChange(!presentPreview);
            }}
            onClick={() => {
              if (ignoreNextClickRef.current) {
                ignoreNextClickRef.current = false;
                return;
              }
              onPresentPreviewChange(!presentPreview);
            }}
          >
            <Eye size={15} aria-hidden="true" />
            <span>Present</span>
          </button>
        </div>
      </div>

      <div className={styles.marsSliderWrap}>
        <span aria-hidden="true">4.1 Ga</span>
        <input
          type="range"
          min={0}
          max={MARS_DEEP_TIME_MAX_MYA}
          step={10}
          value={marsTimeToSlider(value)}
          aria-label="Mars deep time"
          aria-valuetext={`${state.dateLabel}. ${state.period}. ${state.interpolationLabel}.`}
          disabled={presentPreview}
          onChange={(event) => {
            stopAnimation();
            onChange(sliderToMarsTime(Number(event.currentTarget.value)));
          }}
          onKeyDown={(event) => {
            const sliderValue = marsTimeToSlider(value);
            const travel = event.key === "ArrowRight" || event.key === "ArrowUp"
              ? 10
              : event.key === "ArrowLeft" || event.key === "ArrowDown"
              ? -10
              : event.key === "PageUp"
              ? 100
              : event.key === "PageDown"
              ? -100
              : null;
            if (travel !== null) {
              event.preventDefault();
              stopAnimation();
              onChange(sliderToMarsTime(sliderValue + travel));
            } else if (event.key === "Home") {
              event.preventDefault();
              stopAnimation();
              onChange(MARS_DEEP_TIME_MAX_MYA);
            } else if (event.key === "End") {
              event.preventDefault();
              stopAnimation();
              onChange(0);
            }
          }}
          onPointerUp={() => setAnnouncement(`${state.dateLabel}. ${state.title}. ${state.interpolationLabel}.`)}
          onKeyUp={() => setAnnouncement(`${state.dateLabel}. ${state.title}. ${state.interpolationLabel}.`)}
        />
        <span aria-hidden="true">Today</span>
      </div>

      <ol className={styles.marsAnchorRail} aria-label="Authored Mars time states">
        {MARS_DEEP_TIME_ANCHORS.map((anchor) => (
          <li key={anchor.id}>
            <button
              type="button"
              aria-label={`Go to ${anchor.title}, ${formatMarsTime(anchor.timeMya)}`}
              aria-current={Math.abs(value - anchor.timeMya) < 1 ? "step" : undefined}
              onClick={() => animateTo(anchor.timeMya, ANCHOR_TRAVEL_MS)}
            >
              <i aria-hidden="true" />
              <span>{anchor.title}</span>
              <small>{anchor.timeMya === 0 ? "Today" : `${(anchor.timeMya / 1000).toFixed(1)} Ga`}</small>
            </button>
          </li>
        ))}
      </ol>

      <div className={styles.marsEvidenceLine}>
        <span>Observed terrain</span>
        <i aria-hidden="true" />
        <span>
          {isPresentReference
            ? "Observed present-day surface · no reconstruction overlays"
            : "Constrained reconstruction: water · ice · haze · atmosphere"}
        </span>
        <em>{isPresentReference ? "Observed reference" : state.interpolationLabel}</em>
      </div>
      <p className={styles.liveStatus} role="status" aria-live="polite">{announcement}</p>
    </section>
  );
}
