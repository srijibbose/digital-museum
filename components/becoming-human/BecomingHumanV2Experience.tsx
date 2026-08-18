"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { AmbientSoundscape } from "./AmbientSoundscape";
import { BecomingHumanAtlas, type AtlasView } from "./BecomingHumanAtlas";
import { StoryInstrument } from "./StoryInstrument";
import { StorySceneGraphic } from "./StorySceneGraphic";
import {
  becomingHumanActs,
  becomingHumanClockTransition,
  becomingHumanEpisodes,
  becomingHumanFinale,
  type BecomingHumanAct,
  type BecomingHumanEpisode,
} from "@/content/becoming-human-story";
import {
  becomingHumanActVisuals,
  getEpisodeVisual,
} from "@/content/becoming-human-visuals";
import styles from "./becoming-human-v2.module.css";

type PanelKind = "story" | "evidence" | "instrument" | "atlas" | null;
type Prediction = "bodies" | "culture" | "systems";
type BackgroundFrame = { src: string; focalPoint: string };

const predictionLabels: Record<Prediction, string> = {
  bodies: "OUR BODIES",
  culture: "WHAT WE LEARN TOGETHER",
  systems: "THE SYSTEMS BETWEEN US",
};

function findAct(episode: BecomingHumanEpisode): BecomingHumanAct {
  return becomingHumanActs.find((act) => act.id === episode.actId) ?? becomingHumanActs[0];
}

function FocusTrap({ children, label, onClose }: { children: ReactNode; label: string; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const focusables = () => Array.from(panel.querySelectorAll<HTMLElement>(
      "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])",
    ));
    focusables()[0]?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    panel.addEventListener("keydown", onKeyDown);
    return () => panel.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div aria-label={label} aria-modal="true" className={styles.panelShell} ref={panelRef} role="dialog">
      {children}
    </div>
  );
}

function PanelTopline({ eyebrow, onClose }: { eyebrow: string; onClose: () => void }) {
  return (
    <header className={styles.panelTopline}>
      <span>{eyebrow}</span>
      <button aria-label="Close panel" onClick={onClose} type="button">CLOSE <span aria-hidden="true">×</span></button>
    </header>
  );
}

function EvidenceRecord({ episode }: { episode: BecomingHumanEpisode }) {
  const visual = getEpisodeVisual(episode.id);
  return (
    <div className={styles.evidenceRecord}>
      {visual.objectImage && visual.includeInEvidence !== false ? (
        <figure className={styles.evidenceFigure}>
          <Image alt={visual.objectAlt ?? "Evidence object"} fill quality={92} sizes="(max-width: 760px) 100vw, 48vw" src={visual.objectImage} />
          <figcaption>{visual.objectCredit}</figcaption>
        </figure>
      ) : (
        <div className={styles.evidenceNoImage}>
          <span>SUPPORTING EVIDENCE IS FRAGMENTARY</span>
          <strong>{episode.evidence.object}</strong>
        </div>
      )}
      <div className={styles.evidenceReading}>
        <div><span>01 / WHAT WAS FOUND</span><p>{episode.evidence.object}</p></div>
        <div><span>02 / WHAT IT SHOWS</span><p>{episode.capability}</p></div>
        <div><span>03 / WHAT WE STILL DO NOT KNOW</span><p>{episode.evidence.uncertainty}</p></div>
      </div>
      <div className={styles.sourceList}>
        <span>SOURCES</span>
        {episode.sources.map((source) => (
          <a href={source.url} key={source.url} rel="noreferrer" target="_blank">{source.label} <span aria-hidden="true">↗</span></a>
        ))}
      </div>
    </div>
  );
}

function Finale({ prediction, onDeleteTrace }: { prediction: Prediction | null; onDeleteTrace: () => void }) {
  return (
    <section className={styles.finale}>
      <div className={styles.finaleCopy}>
        <p className={styles.eyebrow}>FINALE · WHAT CHANGED FASTEST?</p>
        <h2>{becomingHumanFinale.title}</h2>
        <p className={styles.finaleHook}>{becomingHumanFinale.hook}</p>
        <p>{becomingHumanFinale.story}</p>
        {prediction ? <p className={styles.predictionReturn}>AT THE THRESHOLD, YOU CHOSE <strong>{predictionLabels[prediction]}</strong>. The answer is layered: bodies still evolve, but shared culture, institutions, energy, and machines can now transform life within a generation.</p> : null}
        <button className={styles.deleteTrace} onClick={onDeleteTrace} type="button">ERASE MY LOCAL VISIT DATA</button>
      </div>
      <div className={styles.clockLayers}>
        {becomingHumanFinale.layers.map((layer, index) => (
          <div className={styles.clockLayer} key={layer.label} style={{ "--layer": index } as CSSProperties}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{layer.label}</strong>
            <p>{layer.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Entry({
  onBegin,
  prediction,
  resumeIndex,
  setPrediction,
}: {
  onBegin: (withSound: boolean, resume?: boolean) => void;
  prediction: Prediction | null;
  resumeIndex: number | null;
  setPrediction: (value: Prediction) => void;
}) {
  return (
    <section className={styles.entry}>
      <Image alt="A real city at dusk, where bodies, energy, infrastructure and computation meet" fill preload quality={92} sizes="100vw" src="/media/becoming-human/chronicle/act-08-models.webp" />
      <div className={styles.entryVeil} />
      <div className={styles.entryInfrastructure} aria-hidden="true">
        <span /><span /><span /><span /><span />
        <div className={styles.entryPhone}><i /><i /></div>
      </div>
      <header className={styles.entryChrome}>
        <a href="/">LOUPE</a>
        <span>PREMIUM EXHIBIT · 35 EPISODES · APPROX. 70 MIN</span>
      </header>
      <div className={styles.entryCopy}>
        <p className={styles.eyebrow}>A FIELD GUIDE TO THE DEEP HISTORY OF US</p>
        <h1>BECOMING<br />HUMAN</h1>
        <p className={styles.entryQuestion}>What changed fastest—our bodies, what we learn together, or the systems between us?</p>
        <div aria-label="Make a prediction" className={styles.predictionChoices} role="group">
          {(Object.keys(predictionLabels) as Prediction[]).map((value) => (
            <button aria-pressed={prediction === value} key={value} onClick={() => setPrediction(value)} type="button">
              <span>{prediction === value ? "●" : "○"}</span>{predictionLabels[value]}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.entryActions}>
        <button className={styles.beginButton} onClick={() => onBegin(false)} type="button"><span>BEGIN QUIET</span><i aria-hidden="true">→</i></button>
        <button onClick={() => onBegin(true)} type="button">BEGIN WITH SOUND</button>
        {resumeIndex !== null && resumeIndex > 0 ? (
          <button onClick={() => onBegin(false, true)} type="button">
            {resumeIndex === becomingHumanEpisodes.length ? "RESUME AT FINALE" : `RESUME AT EPISODE ${String(resumeIndex + 1).padStart(2, "0")}`}
          </button>
        ) : null}
      </div>
      <footer className={styles.entryFooter}>
        <span>REAL OBJECTS · OPEN SOURCES · UNCERTAINTY SHOWN</span>
        <span>ARROWS / WHEEL / SWIPE</span>
      </footer>
    </section>
  );
}

export function BecomingHumanV2Experience() {
  const [started, setStarted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [resumeIndex, setResumeIndex] = useState<number | null>(null);
  const [prediction, setPredictionState] = useState<Prediction | null>(null);
  const [panel, setPanel] = useState<PanelKind>(null);
  const [atlasView, setAtlasView] = useState<AtlasView>("time");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [direction, setDirection] = useState<"next" | "previous">("next");
  const rootRef = useRef<HTMLElement>(null);
  const wheelLockRef = useRef(0);
  const wheelSumRef = useRef(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const isFinale = activeIndex === becomingHumanEpisodes.length;
  const episode = isFinale ? becomingHumanEpisodes[becomingHumanEpisodes.length - 1] : becomingHumanEpisodes[activeIndex];
  const act = findAct(episode);
  const actVisual = becomingHumanActVisuals[act.id];
  const episodeVisual = getEpisodeVisual(episode.id);
  const copySide = episodeVisual.composition === "left" ? "right" : "left";
  const requestedBackground = episodeVisual.backgroundOverride ?? actVisual.background;
  const [backgroundFrames, setBackgroundFrames] = useState<{ current: BackgroundFrame; previous: BackgroundFrame | null }>(() => ({
    current: { src: requestedBackground, focalPoint: episodeVisual.focalPoint },
    previous: null,
  }));
  const sceneStyle = {
    "--accent": actVisual.accent,
    "--accent-soft": actVisual.accentSoft,
    "--scene-ink": actVisual.ink,
    "--scene-veil": actVisual.veil,
    "--focal-point": episodeVisual.focalPoint,
    "--pan-x": `${((activeIndex % 3) - 1) * 1.4}%`,
  } as CSSProperties;

  const setPrediction = useCallback((value: Prediction) => {
    setPredictionState(value);
    window.localStorage.setItem("bh-v2-prediction", value);
  }, []);

  useEffect(() => {
    setBackgroundFrames((frames) => {
      const next = { src: requestedBackground, focalPoint: episodeVisual.focalPoint };
      if (frames.current.src === requestedBackground) {
        return frames.current.focalPoint === next.focalPoint
          ? frames
          : { current: next, previous: frames.previous };
      }
      return { current: next, previous: frames.current };
    });
  }, [episodeVisual.focalPoint, requestedBackground]);

  const closePanel = useCallback(() => {
    setPanel(null);
    window.setTimeout(() => openerRef.current?.focus(), 0);
  }, []);

  const openPanel = useCallback((kind: Exclude<PanelKind, null>, opener?: HTMLElement | null) => {
    openerRef.current = opener ?? document.activeElement as HTMLElement | null;
    setPanel(kind);
  }, []);

  const goTo = useCallback((nextIndex: number) => {
    const clamped = Math.max(0, Math.min(becomingHumanEpisodes.length, nextIndex));
    setDirection(clamped >= activeIndex ? "next" : "previous");
    setActiveIndex(clamped);
    setPanel(null);
  }, [activeIndex]);

  const begin = useCallback((withSound: boolean, resume = false) => {
    setSoundEnabled(withSound);
    setActiveIndex(resume && resumeIndex !== null ? resumeIndex : 0);
    setDirection("next");
    setStarted(true);
  }, [resumeIndex]);

  const deleteTrace = useCallback(() => {
    window.localStorage.removeItem("bh-v2-episode");
    window.localStorage.removeItem("bh-v2-prediction");
    setPredictionState(null);
    setResumeIndex(null);
  }, []);

  useEffect(() => {
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const savedValue = window.localStorage.getItem("bh-v2-episode");
    const saved = savedValue === null ? null : Number(savedValue);
    if (saved !== null && Number.isInteger(saved) && saved >= 0 && saved <= becomingHumanEpisodes.length) setResumeIndex(saved);
    const savedPrediction = window.localStorage.getItem("bh-v2-prediction") as Prediction | null;
    if (savedPrediction && savedPrediction in predictionLabels) setPredictionState(savedPrediction);

    const hash = window.location.hash.replace(/^#(?:episode-)?/, "");
    const hashIndex = becomingHumanEpisodes.findIndex((item) => item.id === hash);
    if (hashIndex >= 0) {
      setActiveIndex(hashIndex);
      setStarted(true);
    } else if (hash === becomingHumanFinale.id) {
      setActiveIndex(becomingHumanEpisodes.length);
      setStarted(true);
    }
    return () => { document.documentElement.style.overflow = previousOverflow; };
  }, []);

  useEffect(() => {
    if (!started) return;
    window.localStorage.setItem("bh-v2-episode", String(activeIndex));
    const id = isFinale ? becomingHumanFinale.id : becomingHumanEpisodes[activeIndex].id;
    window.history.replaceState(null, "", `#episode-${id}`);
  }, [activeIndex, isFinale, started]);

  useEffect(() => {
    if (!started || panel) return;
    const root = rootRef.current;
    if (!root) return;
    function onWheel(event: WheelEvent) {
      event.preventDefault();
      const now = performance.now();
      if (now < wheelLockRef.current) return;
      wheelSumRef.current += event.deltaY;
      if (Math.abs(wheelSumRef.current) < 55) return;
      const step = wheelSumRef.current > 0 ? 1 : -1;
      wheelSumRef.current = 0;
      wheelLockRef.current = now + 760;
      goTo(activeIndex + step);
    }
    root.addEventListener("wheel", onWheel, { passive: false });
    return () => root.removeEventListener("wheel", onWheel);
  }, [activeIndex, goTo, panel, started]);

  useEffect(() => {
    if (!started || panel) return;
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target?.matches("input, textarea, select, [contenteditable='true']")) return;
      if (["ArrowDown", "ArrowRight", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        goTo(activeIndex + 1);
      } else if (["ArrowUp", "ArrowLeft", "PageUp"].includes(event.key)) {
        event.preventDefault();
        goTo(activeIndex - 1);
      } else if (event.key === "Home") {
        event.preventDefault();
        goTo(0);
      } else if (event.key === "End") {
        event.preventDefault();
        goTo(becomingHumanEpisodes.length);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, goTo, panel, started]);

  const actRanges = useMemo(() => becomingHumanActs.map((item) => {
    const start = becomingHumanEpisodes.findIndex((episodeItem) => episodeItem.id === item.episodeIds[0]);
    return { ...item, start, end: start + item.episodeIds.length - 1 };
  }), []);

  if (!started) {
    return <Entry onBegin={begin} prediction={prediction} resumeIndex={resumeIndex} setPrediction={setPrediction} />;
  }

  return (
    <main
      className={styles.root}
      data-copy={copySide}
      data-direction={direction}
      onTouchEnd={(event) => {
        const start = touchStartRef.current;
        const touch = event.changedTouches[0];
        if (!start || !touch || panel) return;
        const dy = touch.clientY - start.y;
        const dx = touch.clientX - start.x;
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 48) return;
        goTo(activeIndex + (Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 1 : -1) : (dy < 0 ? 1 : -1)));
      }}
      onTouchStart={(event) => {
        const touch = event.touches[0];
        if (touch) touchStartRef.current = { x: touch.clientX, y: touch.clientY };
      }}
      ref={rootRef}
      style={sceneStyle}
    >
      <a className={styles.skipLink} href="#journey-controls">Skip to journey controls</a>
      <AmbientSoundscape chapterIndex={activeIndex} enabled={soundEnabled} />

      <div aria-hidden="true" className={styles.backgrounds}>
        {[backgroundFrames.previous, backgroundFrames.current].filter((frame): frame is BackgroundFrame => Boolean(frame)).map((frame) => {
          const active = frame === backgroundFrames.current;
          return (
            <div
              className={styles.backgroundLayer}
              data-active={active}
              key={frame.src}
              style={{ "--focal-point": frame.focalPoint } as CSSProperties}
            >
              <Image alt="" fill loading={active ? "eager" : "lazy"} quality={90} sizes="100vw" src={frame.src} />
            </div>
          );
        })}
      </div>
      <div aria-hidden="true" className={styles.sceneGrade} />
      <div aria-hidden="true" className={styles.sceneTexture} />

      <div aria-hidden={Boolean(panel)} className={styles.journey} inert={panel ? true : undefined}>
        <header className={styles.topChrome}>
          <a href="/" aria-label="Return to Loupe home"><span className={styles.markOrb} />LOUPE</a>
          <div className={styles.actIdentity}>
            <span>ACT {String(act.order).padStart(2, "0")}</span>
            <strong>{act.title}</strong>
          </div>
          <nav aria-label="Exhibit tools">
            <button onClick={(event) => { setAtlasView("time"); openPanel("atlas", event.currentTarget); }} type="button">TIME</button>
            <button onClick={(event) => { setAtlasView("place"); openPanel("atlas", event.currentTarget); }} type="button">MAP</button>
            <button aria-pressed={soundEnabled} onClick={() => setSoundEnabled((value) => !value)} type="button">SOUND {soundEnabled ? "ON" : "OFF"}</button>
          </nav>
        </header>

        {!isFinale ? (
          <section className={styles.scene} id={`episode-${episode.id}`} key={episode.id}>
            <StorySceneGraphic visual={episodeVisual} />
            <div className={styles.sceneNumber} aria-hidden="true">{String(episode.order).padStart(2, "0")}</div>
            <article
              className={styles.sceneCopy}
              data-title-scale={episode.title.length > 38 ? "compact" : episode.title.length > 30 ? "long" : "regular"}
            >
              <div className={styles.sceneMeta}>
                <time className={styles.sceneDate}><span>WHEN</span>{episode.dateLabel}</time>
                <div>
                  <span className={styles.sceneStep}>STEP {String(episode.order).padStart(2, "0")} OF {becomingHumanEpisodes.length}</span>
                  <span className={styles.sceneLocation}>{episode.location}</span>
                </div>
              </div>
              <p className={styles.eyebrow}>PART {String(act.order).padStart(2, "0")} OF 08 · {act.title}</p>
              <h1>{episode.title}</h1>
              <p className={styles.sceneHook}>{episode.hook}</p>
              <p className={styles.sceneCapability}><span>WHY THIS MATTERS</span>{episode.capability}</p>
              <div className={styles.sceneActions}>
                <button aria-label="READ THE FULL STORY" onClick={(event) => openPanel("story", event.currentTarget)} type="button">
                  <span aria-hidden="true" className={styles.actionLong}>READ THE FULL STORY</span>
                  <span aria-hidden="true" className={styles.actionShort}>STORY</span>
                </button>
                <button aria-label="SEE THE EVIDENCE" onClick={(event) => openPanel("evidence", event.currentTarget)} type="button">
                  <span aria-hidden="true" className={styles.actionLong}>SEE THE EVIDENCE</span>
                  <span aria-hidden="true" className={styles.actionShort}>EVIDENCE</span>
                </button>
                <button aria-label="EXPLORE THIS STEP" className={styles.primaryAction} onClick={(event) => openPanel("instrument", event.currentTarget)} type="button">
                  <span aria-hidden="true" className={styles.actionLong}>EXPLORE THIS STEP ↗</span>
                  <span aria-hidden="true" className={styles.actionShort}>INTERACT ↗</span>
                </button>
              </div>
            </article>
            <a className={styles.environmentCredit} href={episodeVisual.backgroundSourceUrl ?? actVisual.sourceUrl} rel="noreferrer" target="_blank">ENVIRONMENT · {episodeVisual.backgroundSourceLabel ?? actVisual.sourceLabel} ↗</a>
          </section>
        ) : <Finale onDeleteTrace={deleteTrace} prediction={prediction} />}

        <div className={styles.strataRail} aria-label="Exhibit progress">
          {actRanges.map((item) => {
            const progress = activeIndex < item.start ? 0 : activeIndex > item.end ? 1 : (activeIndex - item.start + 1) / (item.end - item.start + 1);
            return (
              <button aria-label={`Go to ${item.title}`} data-active={item.id === act.id} key={item.id} onClick={() => goTo(item.start)} style={{ "--act-progress": progress } as CSSProperties} type="button">
                <i /><span>{String(item.order).padStart(2, "0")}</span>
              </button>
            );
          })}
          <button aria-label="Go to finale" data-active={isFinale} onClick={() => goTo(becomingHumanEpisodes.length)} style={{ "--act-progress": isFinale ? 1 : 0 } as CSSProperties} type="button"><i /><span>∞</span></button>
        </div>

        <footer className={styles.journeyControls} id="journey-controls">
          <button aria-label="Previous episode" disabled={activeIndex === 0} onClick={() => goTo(activeIndex - 1)} type="button">← <span>PREVIOUS</span></button>
          <div>
            <span>{isFinale ? "FINALE" : `${String(activeIndex + 1).padStart(2, "0")} / ${String(becomingHumanEpisodes.length).padStart(2, "0")}`}</span>
            <small>{isFinale ? becomingHumanFinale.title : episode.title}</small>
            {!isFinale ? <time>{episode.dateLabel}</time> : null}
          </div>
          <button aria-label="Next episode" disabled={isFinale} onClick={() => goTo(activeIndex + 1)} type="button"><span>NEXT</span> →</button>
        </footer>
      </div>

      <p aria-live="polite" className={styles.srOnly}>{isFinale ? `Finale: ${becomingHumanFinale.title}` : `Episode ${activeIndex + 1}: ${episode.title}. ${episode.dateLabel}, ${episode.location}.`}</p>

      {panel ? (
        <div className={styles.panelBackdrop}>
          <FocusTrap label={panel === "atlas" ? "Research atlas" : `${episode.title} ${panel}`} onClose={closePanel}>
            <PanelTopline eyebrow={panel === "atlas" ? "BECOMING HUMAN / TIME · PLACE · STORY" : `${String(episode.order).padStart(2, "0")} · ${episode.title}`} onClose={closePanel} />
            <div className={styles.panelScroll}>
              {panel === "story" ? (
                <article className={styles.readingPanel}>
                  <p className={styles.eyebrow}>{episode.dateLabel} · {episode.location}</p>
                  <h2>{episode.title}</h2>
                  <p className={styles.readingLead}>{episode.hook}</p>
                  <p className={styles.longStory}>{episode.story}</p>
                  {episode.id === becomingHumanClockTransition.afterEpisodeId ? <blockquote>{becomingHumanClockTransition.label}</blockquote> : null}
                  <div className={styles.readingCoda}>
                    <span>WHY THIS STEP MATTERED</span>
                    <strong>{episode.capability}</strong>
                  </div>
                </article>
              ) : null}
              {panel === "evidence" ? <EvidenceRecord episode={episode} /> : null}
              {panel === "instrument" ? <StoryInstrument episode={episode} /> : null}
              {panel === "atlas" ? <BecomingHumanAtlas activeIndex={activeIndex} goTo={goTo} initialView={atlasView} /> : null}
            </div>
          </FocusTrap>
        </div>
      ) : null}
    </main>
  );
}
