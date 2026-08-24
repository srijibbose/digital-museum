"use client";

import Link from "next/link";
import { ArrowDown, Play, RotateCcw, ScanLine } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { flowerExhibit, type FlowerChapterId } from "@/content/flowers";
import {
  flowerScrollProgress,
  progressForFlowerChapter,
  resolveFlowerTimeline,
} from "@/lib/flowers/flower-timeline";
import { FlowerStage } from "./FlowerStage";
import styles from "./flowers.module.css";

const chapterCount = flowerExhibit.chapters.length;

export function FlowerExperience() {
  const journey = useRef<HTMLElement>(null);
  const replayFrame = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [resetToken, setResetToken] = useState(0);
  const [replayToken, setReplayToken] = useState(0);
  const timeline = useMemo(() => resolveFlowerTimeline(progress), [progress]);
  const chapter = flowerExhibit.chapters[timeline.chapterIndex];

  const scrollToProgress = useCallback((targetProgress: number, behavior?: ScrollBehavior) => {
    const element = journey.current;
    if (!element) return;
    const top = window.scrollY + element.getBoundingClientRect().top;
    const travel = Math.max(1, element.offsetHeight - window.innerHeight);
    window.scrollTo({
      top: top + targetProgress * travel,
      behavior: behavior ?? (reducedMotion ? "auto" : "smooth"),
    });
  }, [reducedMotion]);

  const selectChapter = useCallback((id: FlowerChapterId) => {
    scrollToProgress(progressForFlowerChapter(id));
  }, [scrollToProgress]);

  const replayChapter = useCallback(() => {
    if (replayFrame.current !== null) window.cancelAnimationFrame(replayFrame.current);
    const startProgress = timeline.chapterIndex / chapterCount + 0.006;
    const endProgress = (timeline.chapterIndex + 1) / chapterCount - 0.012;
    setReplayToken((token) => token + 1);

    if (reducedMotion) {
      scrollToProgress(endProgress, "auto");
      return;
    }

    scrollToProgress(startProgress, "auto");
    const startedAt = performance.now();
    const duration = timeline.chapterIndex === 2 ? 3400 : 2600;
    const animate = (now: number) => {
      const raw = Math.min(1, (now - startedAt) / duration);
      const eased = raw < 0.5
        ? 2 * raw * raw
        : 1 - Math.pow(-2 * raw + 2, 2) / 2;
      scrollToProgress(startProgress + (endProgress - startProgress) * eased, "auto");
      if (raw < 1) replayFrame.current = window.requestAnimationFrame(animate);
      else replayFrame.current = null;
    };
    replayFrame.current = window.requestAnimationFrame(animate);
  }, [reducedMotion, scrollToProgress, timeline.chapterIndex]);

  useEffect(() => () => {
    if (replayFrame.current !== null) window.cancelAnimationFrame(replayFrame.current);
  }, []);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    let scheduled = false;
    const update = () => {
      scheduled = false;
      const element = journey.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const top = window.scrollY + rect.top;
      const next = flowerScrollProgress(
        window.scrollY,
        top,
        element.offsetHeight,
        window.innerHeight,
      );
      setProgress((current) => Math.abs(current - next) < 0.0005 ? current : next);
    };
    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  const style = {
    "--flower-progress": progress,
    "--chapter-progress": timeline.localProgress,
  } as CSSProperties;

  return (
    <section
      ref={journey}
      className={styles.journey}
      style={style}
      data-testid="flower-journey"
      data-chapter={chapter.id}
      aria-label="The Work of Flowers interactive exhibit"
    >
      <div className={styles.stickyFrame}>
        <div className={styles.instrument}>
          <header className={styles.header}>
            <div className={styles.identity}>
              <Link className="museum-mark" href="/" aria-label="Loupe museum home">
                <span className="museum-mark__orb" aria-hidden="true" />
                <span>LOUPE</span>
              </Link>
              <i aria-hidden="true" />
              <span>The Work of Flowers</span>
            </div>
            <div className={styles.exhibitCode}>
              <span>EXH. 007</span>
              <em>Reproduction across scale</em>
            </div>
            <nav className={styles.headerNav} aria-label="Exhibit sections">
              <a href="#flower-transcript">Text edition</a>
              <a href="#flower-sources">Sources</a>
            </nav>
          </header>

          <div className={styles.workspace}>
            <aside className={styles.specimenPanel} aria-label="Specimen and evidence">
              <p className={styles.eyebrow}>Living collection</p>
              <div className={styles.specimenIdentity}>
                <span className={styles.specimenGlyph} aria-hidden="true">✣</span>
                <div>
                  <strong>{flowerExhibit.specimen.commonName}</strong>
                  <em>{flowerExhibit.specimen.scientificName}</em>
                </div>
              </div>
              <dl className={styles.specimenFacts}>
                <div>
                  <dt>Accession</dt>
                  <dd>2019-0352A</dd>
                </div>
                <div>
                  <dt>Capture</dt>
                  <dd>Surface scan</dd>
                </div>
                <div>
                  <dt>Visitor</dt>
                  <dd><i>Xylocopa</i> bee</dd>
                </div>
                <div>
                  <dt>Rights</dt>
                  <dd>Smithsonian CC0</dd>
                </div>
              </dl>
              <div className={styles.evidenceKey}>
                <p className={styles.eyebrow}>Evidence language</p>
                <span><i data-kind="observed" />Observed scan</span>
                <span><i data-kind="reconstruction" />Reconstruction</span>
                <span><i data-kind="compressed" />Time compressed</span>
              </div>
            </aside>

            <main className={styles.stageColumn} id="flower-stage">
              <div className={styles.stageShell}>
                <div className={styles.stageHeading}>
                  <div>
                    <span>{chapter.index} · {chapter.subtitle}</span>
                    <h1>{chapter.shortTitle}</h1>
                  </div>
                  <div className={styles.evidenceBadge} data-evidence={chapter.evidence}>
                    <i aria-hidden="true" />
                    <span>{chapter.evidenceLabel}</span>
                  </div>
                </div>

                <FlowerStage
                  progress={progress}
                  reducedMotion={reducedMotion}
                  resetToken={resetToken}
                  replayToken={replayToken}
                />

                <div className={styles.scaleReadout} aria-label={`Scale: ${chapter.scale}`}>
                  <span>{chapter.scale}</span>
                  <i aria-hidden="true" />
                </div>

                <div className={styles.interactionHint}>
                  <ScanLine size={14} aria-hidden="true" />
                  <span>Drag to orbit · Scroll to transform</span>
                </div>

                <div className={styles.stageCaption} aria-live="polite">
                  <strong>{chapter.title}</strong>
                  <span>{chapter.action}</span>
                </div>
              </div>

              <div className={styles.timelinePanel}>
                <nav className={styles.chapterNav} aria-label="Flower reproductive sequence">
                  {flowerExhibit.chapters.map((entry, index) => {
                    const active = index === timeline.chapterIndex;
                    return (
                      <button
                        key={entry.id}
                        type="button"
                        className={styles.chapterButton}
                        data-active={active || undefined}
                        aria-current={active ? "step" : undefined}
                        onClick={() => selectChapter(entry.id)}
                      >
                        <span>{entry.index}</span>
                        <strong>{entry.shortTitle}</strong>
                        <i aria-hidden="true" />
                      </button>
                    );
                  })}
                </nav>

                <div className={styles.transport}>
                  <label htmlFor="flower-timeline">
                    <span>Biological sequence</span>
                    <strong>{Math.round(progress * 100)}%</strong>
                  </label>
                  <input
                    id="flower-timeline"
                    type="range"
                    min="0"
                    max="1000"
                    value={Math.round(progress * 1000)}
                    onChange={(event) => scrollToProgress(Number(event.currentTarget.value) / 1000, "auto")}
                    aria-valuetext={`${chapter.shortTitle}, ${Math.round(timeline.localProgress * 100)} percent through this chapter`}
                  />
                  <div className={styles.transportActions}>
                    <button type="button" onClick={replayChapter}>
                      <Play size={14} aria-hidden="true" />
                      Replay chapter
                    </button>
                    <button type="button" onClick={() => setResetToken((token) => token + 1)}>
                      <RotateCcw size={14} aria-hidden="true" />
                      Reset view
                    </button>
                  </div>
                </div>
              </div>
            </main>

            <aside className={styles.fieldGuide} aria-live="polite">
              <p className={styles.eyebrow}>Field notebook · {chapter.index}</p>
              <h2>{chapter.title}</h2>
              <p className={styles.scientificName}>{flowerExhibit.specimen.scientificName}</p>
              <p className={styles.chapterThesis}>{chapter.thesis}</p>
              <ol className={styles.observations}>
                {chapter.observations.map((observation, index) => (
                  <li key={observation}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <p>{observation}</p>
                  </li>
                ))}
              </ol>
              <div className={styles.evidenceNote}>
                <strong>{chapter.evidenceLabel}</strong>
                <p>{chapter.evidenceDetail}</p>
              </div>
              <dl className={styles.chapterMeta}>
                <div><dt>Scale</dt><dd>{chapter.scale}</dd></div>
                <div><dt>Clock</dt><dd>{chapter.clock}</dd></div>
              </dl>
            </aside>
          </div>
        </div>

        <div className={styles.scrollCue} aria-hidden="true" data-visible={progress < 0.035 || undefined}>
          <ArrowDown size={14} />
          <span>Scroll through the flower</span>
        </div>
      </div>
    </section>
  );
}
