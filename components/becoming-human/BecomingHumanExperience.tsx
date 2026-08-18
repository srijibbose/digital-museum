"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  BookOpen,
  Check,
  Eye,
  Menu,
  MousePointer2,
  RotateCcw,
  Settings,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  becomingHumanChapters,
  becomingHumanMotifs,
  becomingHumanStack,
  type BecomingHumanChapter,
} from "@/content/becoming-human";
import {
  becomingHumanWorlds,
  sceneForChapter,
  type ChapterScene,
  type WorldPack,
} from "@/content/becoming-human-scenes";
import { AmbientSoundscape } from "./AmbientSoundscape";
import { EnvironmentalStage } from "./EnvironmentalStage";
import { LearningInstrument } from "./LearningInstrument";
import styles from "./becoming-human.module.css";

interface SavedProgress {
  schemaVersion: 1;
  chapterId: string;
  completedChapterIds: string[];
  evidenceLensUsed: boolean;
  completed: boolean;
}

const STORAGE_KEY = "loupe:becoming-human:progress:v1";
const ENTRY_WORLDS = [becomingHumanWorlds[2], becomingHumanWorlds[6], becomingHumanWorlds[9]];

function track(name: string, detail: Record<string, unknown> = {}) {
  window.dispatchEvent(new CustomEvent(`loupe:${name}`, { detail }));
}

function formatProgress(index: number, chapterProgress: number) {
  return Math.min(100, Math.max(0, ((index + chapterProgress) / becomingHumanChapters.length) * 100));
}

function ExhibitMark() {
  return (
    <Link className={styles.mark} href="/" aria-label="Back to Loupe museum">
      <span className={styles.markGlyph} aria-hidden="true"><i /><i /></span>
      <span>LOUPE</span>
    </Link>
  );
}

function EntryThreshold({
  resumeChapter,
  mode,
  setMode,
  onBegin,
}: {
  resumeChapter?: BecomingHumanChapter;
  mode: "guided" | "explore";
  setMode: (mode: "guided" | "explore") => void;
  onBegin: (chapterId: string, sound: boolean) => void;
}) {
  return (
    <header className={styles.threshold} aria-labelledby="becoming-human-title">
      <div className={styles.thresholdWorlds} aria-hidden="true">
        {ENTRY_WORLDS.map((worldPack, index) => (
          <div className={styles.thresholdWorld} key={worldPack.id} style={{ "--entry-index": index } as React.CSSProperties}>
            <Image alt="" fill priority={index === 0} sizes="100vw" src={worldPack.plate} />
          </div>
        ))}
      </div>
      <div className={styles.thresholdVignette} aria-hidden="true" />

      <div className={styles.thresholdTopline}>
        <ExhibitMark />
        <span>A LIVING JOURNEY THROUGH 66 MILLION YEARS</span>
        <span>EXHIBIT 004 · PREVIEW</span>
      </div>

      <div className={styles.thresholdCopy}>
        <p className={styles.microLabel}>THE BODY · CULTURE · SYSTEMS</p>
        <h1 id="becoming-human-title"><span>BECOMING</span><span>HUMAN</span></h1>
        <p className={styles.thresholdPromise}>
          Walk from a world before us into forests, footprints, fire, cities and the physical networks that now carry human culture.
        </p>

        <div className={styles.modeChoice} aria-label="Journey mode" role="group">
          <button aria-pressed={mode === "guided"} onClick={() => setMode("guided")} type="button">
            <span>GUIDED</span><small>18–25 min</small>
          </button>
          <button aria-pressed={mode === "explore"} onClick={() => setMode("explore")} type="button">
            <span>FREE EXPLORE</span><small>open navigation</small>
          </button>
        </div>

        <div className={styles.entryActions}>
          <button onClick={() => onBegin(mode === "explore" && resumeChapter ? resumeChapter.id : "you-are-here", true)} type="button">
            <Volume2 size={15} aria-hidden="true" /> BEGIN WITH SOUND <ArrowDown size={15} aria-hidden="true" />
          </button>
          <button onClick={() => onBegin(mode === "explore" && resumeChapter ? resumeChapter.id : "you-are-here", false)} type="button">
            <VolumeX size={15} aria-hidden="true" /> BEGIN QUIET
          </button>
        </div>
        {resumeChapter && (
          <button className={styles.resumeButton} onClick={() => onBegin(resumeChapter.id, false)} type="button">
            RESUME · {resumeChapter.navTitle.toUpperCase()} <span aria-hidden="true">↘</span>
          </button>
        )}
      </div>

      <div className={styles.thresholdFooter}>
        <span>10 ENVIRONMENTAL WORLDS</span><span>24 CHAPTERS</span><span>REAL EVIDENCE</span><span>BEGIN TO MOVE THROUGH TIME ↓</span>
      </div>
    </header>
  );
}

function EvidenceLens({ chapter, scene, onClose }: { chapter: BecomingHumanChapter; scene: ChapterScene; onClose: () => void }) {
  return (
    <aside className={styles.evidencePanel} aria-labelledby="evidence-title" aria-modal="true" role="dialog" tabIndex={-1}>
      <div className={styles.panelTopline}>
        <span>EVIDENCE LENS · {String(chapter.index).padStart(2, "0")}</span>
        <button autoFocus aria-label="Close Evidence Lens" onClick={onClose} type="button"><X size={18} /></button>
      </div>
      <div className={styles.evidenceBody}>
        {scene.evidenceMedia && (
          <div className={styles.evidenceMediaBlock}>
            <a className={styles.evidencePanelMedia} href={scene.evidenceMedia.sourceUrl} rel="noreferrer" target="_blank">
              <span><Image alt={scene.evidenceMedia.alt} fill sizes="(max-width: 700px) 92vw, 44vw" src={scene.evidenceMedia.src} /></span>
              <small>{scene.evidenceMedia.label} · {scene.evidenceMedia.credit} ↗</small>
            </a>
            <a className={styles.licenseLink} href={scene.evidenceMedia.licenseUrl} rel="noreferrer" target="_blank">{scene.evidenceMedia.license} · LICENSE TERMS ↗</a>
          </div>
        )}
        <p className={styles.confidence}>{chapter.evidence.confidence}</p>
        <h2 id="evidence-title">{chapter.evidence.claim}</h2>
        <dl>
          <div><dt>OBSERVED</dt><dd>{chapter.evidence.observed}</dd></div>
          <div><dt>INFERRED</dt><dd>{chapter.evidence.inferred}</dd></div>
          <div><dt>STILL UNKNOWN</dt><dd>{chapter.evidence.unknown}</dd></div>
        </dl>
        <p className={styles.reconstructionNote}>The environmental world is an original interpretive reconstruction. Evidence is identified separately.</p>
        <a className={styles.primaryReading} href={chapter.evidence.sourceUrl} rel="noreferrer" target="_blank">
          <span>PRIMARY READING</span>{chapter.evidence.sourceLabel}<span aria-hidden="true">↗</span>
        </a>
      </div>
    </aside>
  );
}

function InteractionDrawer({ chapter, onClose }: { chapter: BecomingHumanChapter; onClose: () => void }) {
  return (
    <aside className={styles.interactionPanel} aria-labelledby="interaction-title" aria-modal="true" role="dialog" tabIndex={-1}>
      <div className={styles.panelTopline}>
        <div><span>FIELD INTERACTION · {String(chapter.index).padStart(2, "0")}</span><h2 id="interaction-title">{chapter.interactionLabel ?? "Explore the evidence"}</h2></div>
        <button autoFocus aria-label="Close interaction" onClick={onClose} type="button"><X size={18} /></button>
      </div>
      <div className={styles.interactionBody}><LearningInstrument chapter={chapter} /></div>
    </aside>
  );
}

function ChapterNavigator({
  activeIndex,
  completedIds,
  onClose,
  onSelect,
}: {
  activeIndex: number;
  completedIds: Set<string>;
  onClose: () => void;
  onSelect: (chapter: BecomingHumanChapter) => void;
}) {
  return (
    <aside className={styles.chapterNavigator} aria-labelledby="chapter-nav-title" aria-modal="true" role="dialog">
      <div className={styles.panelTopline}>
        <div><span>THE COMPLETE JOURNEY</span><h2 id="chapter-nav-title">24 cinematic chapters</h2></div>
        <button autoFocus aria-label="Close chapter navigator" onClick={onClose} type="button"><X size={20} /></button>
      </div>
      <ol>
        {becomingHumanChapters.map((chapter) => {
          const scene = sceneForChapter(chapter.id);
          return (
            <li data-active={chapter.index === activeIndex} key={chapter.id}>
              <button onClick={() => onSelect(chapter)} type="button">
                <span>{String(chapter.index).padStart(2, "0")}</span>
                <span>{chapter.navTitle}<small>{becomingHumanWorlds[scene.world].title}</small></span>
                <span>{completedIds.has(chapter.id) ? <Check size={14} aria-label="Completed" /> : chapter.index === activeIndex ? "NOW" : "—"}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}

function ExhibitSettings({
  reducedMotion,
  mode,
  onClose,
  onMode,
  onReducedMotion,
}: {
  reducedMotion: boolean;
  mode: "guided" | "explore";
  onClose: () => void;
  onMode: (mode: "guided" | "explore") => void;
  onReducedMotion: (enabled: boolean) => void;
}) {
  return (
    <aside className={styles.settingsPanel} aria-labelledby="settings-title" aria-modal="true" role="dialog">
      <div className={styles.panelTopline}><h2 id="settings-title">Experience settings</h2><button autoFocus aria-label="Close settings" onClick={onClose} type="button"><X size={18} /></button></div>
      <fieldset><legend>PACE</legend><label><input checked={mode === "guided"} name="pace" onChange={() => onMode("guided")} type="radio" /> Guided journey</label><label><input checked={mode === "explore"} name="pace" onChange={() => onMode("explore")} type="radio" /> Explore freely</label></fieldset>
      <fieldset><legend>MOTION</legend><label><input checked={reducedMotion} onChange={(event) => onReducedMotion(event.target.checked)} type="checkbox" /> Use static authored views and restrained fades</label></fieldset>
      <p>Every chapter, source and learning outcome remains available without motion or WebGL.</p>
    </aside>
  );
}

function GlobalChrome({
  activeChapter,
  activeIndex,
  activeWorld,
  completedIds,
  progress,
  sound,
  onEvidence,
  onNavigator,
  onSettings,
  onSound,
}: {
  activeChapter: BecomingHumanChapter;
  activeIndex: number;
  activeWorld: WorldPack;
  completedIds: Set<string>;
  progress: number;
  sound: boolean;
  onEvidence: () => void;
  onNavigator: () => void;
  onSettings: () => void;
  onSound: () => void;
}) {
  return (
    <header className={styles.chrome} id="exhibit-controls">
      <ExhibitMark />
      <div className={styles.chromeLocation}><span>{activeWorld.title}</span><strong>{activeChapter.eyebrow}</strong></div>
      <div className={styles.chromeTimeline} style={{ "--journey-progress": `${progress}%` } as React.CSSProperties}><i /><span>{String(activeIndex).padStart(2, "0")} / 23</span></div>
      <nav aria-label="Exhibit controls">
        <button aria-label="Open Evidence Lens" onClick={onEvidence} type="button"><Eye size={14} /> <span className={styles.controlWord}>EVIDENCE</span></button>
        <button aria-label="Open chapter navigator" onClick={onNavigator} type="button"><Menu size={14} /> <span className={styles.controlWord}>CHAPTERS</span> <small>{completedIds.size}</small></button>
        <button aria-label={sound ? "Mute ambient sound" : "Enable ambient sound"} onClick={onSound} type="button">{sound ? <Volume2 size={14} /> : <VolumeX size={14} />}</button>
        <button aria-label="Open exhibit settings" onClick={onSettings} type="button"><Settings size={14} /></button>
      </nav>
    </header>
  );
}

function ChapterSection({
  chapter,
  scene,
  active,
  lateBeat,
  onEvidence,
  onInteract,
}: {
  chapter: BecomingHumanChapter;
  scene: ChapterScene;
  active: boolean;
  lateBeat: boolean;
  onEvidence: () => void;
  onInteract: () => void;
}) {
  const nextChapter = becomingHumanChapters[chapter.index + 1];
  return (
    <section
      aria-labelledby={`chapter-${chapter.id}-title`}
      className={styles.chapter}
      data-active={active}
      data-beat={lateBeat ? "late" : "early"}
      data-composition={scene.composition}
      data-era={chapter.era}
      data-index={chapter.index}
      id={`chapter-${chapter.id}`}
      inert={active ? undefined : true}
      style={{ "--scene-accent": scene.accent } as React.CSSProperties}
    >
      <a className={styles.skipChapter} href={nextChapter ? `#chapter-anchor-${nextChapter.id}` : "#finale"}>Skip to next chapter</a>
      <div className={styles.chapterFrame}>
        <div className={styles.chapterCopy}>
          <div className={styles.chapterMeta}><span>{String(chapter.index).padStart(2, "0")}</span><p>{chapter.eyebrow}</p></div>
          <h2 id={`chapter-${chapter.id}-title`} tabIndex={-1}>{chapter.hero}</h2>
          <div className={styles.storyStack}>
            <p className={styles.storyBeatEarly}>{chapter.narrative[0]}</p>
            <p className={styles.storyBeatLate}>{chapter.narrative[1]}</p>
          </div>
          <div className={styles.chapterActions}>
            <button onClick={onEvidence} type="button"><Eye size={14} /> EVIDENCE <small>{chapter.evidence.confidence}</small></button>
            {chapter.interaction && <button onClick={onInteract} type="button"><MousePointer2 size={14} /> {chapter.interactionLabel ?? "INTERACT"}</button>}
          </div>
        </div>
        <p className={styles.scenePrompt}><span aria-hidden="true">＋</span>{scene.prompt}</p>
        <p className={styles.sceneDescription}>{chapter.sceneDescription}</p>
      </div>
    </section>
  );
}

const MemoizedChapterSection = memo(ChapterSection, (previous, next) => (
  previous.active === next.active && previous.lateBeat === next.lateBeat
));

function Finale({ onRestart }: { onRestart: () => void }) {
  return (
    <section className={styles.finale} id="finale" aria-labelledby="finale-title">
      <div className={styles.finaleHeading}>
        <p className={styles.chapterEyebrow}>THE SYNTHESIS · NOW</p>
        <h2 id="finale-title">WHAT, EXACTLY, EVOLVED?</h2>
        <p>Not one ladder. Six interacting layers—each moving at a different speed.</p>
      </div>
      <div className={styles.stack}>
        {becomingHumanStack.map(([title, body], index) => <div key={title} style={{ "--layer": index } as React.CSSProperties}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{body}</p></div>)}
      </div>
      <p className={styles.finalStatement}>We are still biological organisms. Most of what transforms our world now can change faster than genes can follow.</p>
      <div className={styles.motifChain} aria-label="Journey motifs">{becomingHumanMotifs.map((motif) => <span key={motif}>{motif}</span>)}</div>
      <p className={styles.lastLine}>THE NEXT CHAPTER IS NOT PREDETERMINED.</p>
      <div className={styles.finalActions}>
        <a href="#chapter-anchor-family-branches"><BookOpen size={15} /> EXPLORE A CHAPTER</a>
        <a href="#evidence-index"><Eye size={15} /> EVIDENCE INDEX</a>
        <button onClick={onRestart} type="button"><RotateCcw size={15} /> RESTART</button>
        <Link href="/"><ArrowLeft size={15} /> BACK TO LOUPE</Link>
      </div>
    </section>
  );
}

function EvidenceIndex() {
  return (
    <section className={styles.evidenceIndex} id="evidence-index" aria-labelledby="evidence-index-title">
      <div className={styles.evidenceIndexHeader}>
        <div><p className={styles.chapterEyebrow}>MUSEUM ENDNOTES</p><h2 id="evidence-index-title">The Evidence Index</h2></div>
        <p>Claims are separated into observations, interpretations and open questions. Photographs and scientific figures retain source and license credits; the diorama worlds are authored reconstructions.</p>
      </div>
      <div className={styles.evidenceIndexList}>
        {becomingHumanChapters.map((chapter) => (
          <details key={chapter.id}>
            <summary><span>{String(chapter.index).padStart(2, "0")}</span><strong>{chapter.navTitle}</strong><small>{chapter.evidence.confidence}</small></summary>
            <div><p>{chapter.evidence.claim}</p><dl><div><dt>OBSERVED</dt><dd>{chapter.evidence.observed}</dd></div><div><dt>INFERRED</dt><dd>{chapter.evidence.inferred}</dd></div><div><dt>UNKNOWN</dt><dd>{chapter.evidence.unknown}</dd></div></dl><a href={chapter.evidence.sourceUrl} rel="noreferrer" target="_blank">{chapter.evidence.sourceLabel} ↗</a></div>
          </details>
        ))}
      </div>
      <footer><span>SCIENTIFIC SOURCES · REVIEW EDITION 18 AUG 2026</span><span>END OF EXHIBIT</span></footer>
    </section>
  );
}

export function BecomingHumanExperience() {
  const [started, setStarted] = useState(false);
  const [mode, setMode] = useState<"guided" | "explore">("guided");
  const [activeIndex, setActiveIndex] = useState(0);
  const [chapterProgress, setChapterProgress] = useState(0);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [interactionOpen, setInteractionOpen] = useState(false);
  const [navigatorOpen, setNavigatorOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sound, setSound] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [resumeChapter, setResumeChapter] = useState<BecomingHumanChapter>();
  const [webglAvailable, setWebglAvailable] = useState(false);
  const sectionsRef = useRef<Array<HTMLElement | null>>([]);
  const startedRef = useRef(false);
  const scrollTrackingPausedRef = useRef(false);
  const pendingDeepLinkRef = useRef<BecomingHumanChapter | null>(null);
  const panelOpenerRef = useRef<HTMLElement | null>(null);
  const panelWasOpenRef = useRef(false);
  const activeChapter = becomingHumanChapters[activeIndex];
  const activeScene = useMemo(() => sceneForChapter(activeChapter.id), [activeChapter.id]);
  const activeWorld = becomingHumanWorlds[activeScene.world];
  const progress = formatProgress(activeIndex, chapterProgress);
  const panelOpen = evidenceOpen || interactionOpen || navigatorOpen || settingsOpen;

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as SavedProgress;
        const chapter = becomingHumanChapters.find((item) => item.id === parsed.chapterId);
        if (chapter) setResumeChapter(chapter);
        setCompletedIds(new Set(parsed.completedChapterIds));
      } catch {
        // A corrupt progress record should never block the exhibit.
      }
    }
    if (typeof window.matchMedia === "function") setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    try {
      const canvas = document.createElement("canvas");
      setWebglAvailable(Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl")));
    } catch {
      setWebglAvailable(false);
    }
    const hashId = decodeURIComponent(window.location.hash).replace(/^#chapter-/, "");
    const hashChapter = becomingHumanChapters.find((chapter) => chapter.id === hashId);
    if (hashChapter) {
      startedRef.current = true;
      scrollTrackingPausedRef.current = true;
      pendingDeepLinkRef.current = hashChapter;
      setStarted(true);
      setActiveIndex(hashChapter.index);
    }
  }, []);

  useEffect(() => {
    if (started) startedRef.current = true;
  }, [started]);

  useEffect(() => {
    const chapter = pendingDeepLinkRef.current;
    if (!started || !chapter) return;
    const placeChapter = () => document.getElementById(`chapter-anchor-${chapter.id}`)?.scrollIntoView({ behavior: "auto", block: "start" });
    window.requestAnimationFrame(() => {
      placeChapter();
      window.requestAnimationFrame(() => {
        placeChapter();
        pendingDeepLinkRef.current = null;
        window.setTimeout(() => { scrollTrackingPausedRef.current = false; }, 120);
      });
    });
  }, [started]);

  useEffect(() => {
    let scheduled = false;
    function update() {
      scheduled = false;
      if (!startedRef.current || scrollTrackingPausedRef.current) return;
      const viewportMiddle = window.innerHeight * 0.5;
      let nearestIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;
      for (let index = 0; index < sectionsRef.current.length; index += 1) {
        const section = sectionsRef.current[index];
        if (!section) continue;
        const rect = section.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height * 0.46 - viewportMiddle);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      }
      const section = sectionsRef.current[nearestIndex];
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const nextProgress = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height - window.innerHeight)));
      setActiveIndex((current) => current === nearestIndex ? current : nearestIndex);
      setChapterProgress((current) => Math.abs(current - nextProgress) > 0.008 ? nextProgress : current);
    }
    function onScroll() {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!started) return;
    const completed = new Set(completedIds);
    becomingHumanChapters.slice(0, activeIndex).forEach((chapter) => completed.add(chapter.id));
    if (completed.size !== completedIds.size) setCompletedIds(completed);
    const record: SavedProgress = {
      schemaVersion: 1,
      chapterId: activeChapter.id,
      completedChapterIds: Array.from(completed),
      evidenceLensUsed: evidenceOpen,
      completed: activeIndex === becomingHumanChapters.length - 1,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    window.history.replaceState(null, "", `#chapter-${activeChapter.id}`);
  }, [activeChapter, activeIndex, completedIds, evidenceOpen, started]);

  useEffect(() => {
    if (!panelOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const close = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setEvidenceOpen(false);
      setInteractionOpen(false);
      setNavigatorOpen(false);
      setSettingsOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", close);
    };
  }, [panelOpen]);

  useEffect(() => {
    if (panelWasOpenRef.current && !panelOpen) {
      window.requestAnimationFrame(() => panelOpenerRef.current?.focus());
    }
    panelWasOpenRef.current = panelOpen;
  }, [panelOpen]);

  useEffect(() => { setInteractionOpen(false); }, [activeIndex]);

  useEffect(() => {
    if (!started || activeIndex !== becomingHumanChapters.length - 1 || chapterProgress < 0.8) return;
    const timer = window.setTimeout(() => track("bh_exhibit_complete", { chapter: activeChapter.id }), 1500);
    return () => window.clearTimeout(timer);
  }, [activeChapter.id, activeIndex, chapterProgress, started]);

  const gotoChapter = useCallback((chapter: BecomingHumanChapter) => {
    startedRef.current = true;
    scrollTrackingPausedRef.current = true;
    setStarted(true);
    setActiveIndex(chapter.index);
    setChapterProgress(0);
    setNavigatorOpen(false);
    const element = document.getElementById(`chapter-anchor-${chapter.id}`);
    element?.scrollIntoView({ behavior: "auto", block: "start" });
    window.setTimeout(() => document.getElementById(`chapter-${chapter.id}-title`)?.focus(), 30);
    window.setTimeout(() => { scrollTrackingPausedRef.current = false; }, 100);
    track("bh_chapter_jump", { chapter: chapter.id });
  }, []);

  function begin(chapterId: string, withSound: boolean) {
    const chapter = becomingHumanChapters.find((item) => item.id === chapterId) ?? becomingHumanChapters[0];
    startedRef.current = true;
    setStarted(true);
    setSound(withSound);
    track("bh_exhibit_started", { mode, sound: withSound, webgl: webglAvailable });
    window.requestAnimationFrame(() => gotoChapter(chapter));
  }

  const closePanels = () => {
    setEvidenceOpen(false);
    setInteractionOpen(false);
    setNavigatorOpen(false);
    setSettingsOpen(false);
  };

  const rememberPanelOpener = () => {
    panelOpenerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  };

  return (
    <main className={styles.page} data-reduced-motion={reducedMotion} data-started={started} style={{ "--scene-accent": activeScene.accent } as React.CSSProperties}>
      <div className={styles.experienceContent} inert={panelOpen ? true : undefined}>
        <a className={styles.skipLink} href="#exhibit-controls">Skip to exhibit controls</a>
        <a className={styles.skipLinkSecond} href="#evidence-index">Skip the visual journey and open the Evidence Index</a>

        <EntryThreshold mode={mode} onBegin={begin} resumeChapter={resumeChapter} setMode={setMode} />

        {started && <EnvironmentalStage evidenceMode={evidenceOpen} progress={chapterProgress} reducedMotion={reducedMotion} scene={activeScene} webglAvailable={webglAvailable} world={activeWorld} />}

        {started && (
          <GlobalChrome
            activeChapter={activeChapter}
            activeIndex={activeIndex}
            activeWorld={activeWorld}
            completedIds={completedIds}
            onEvidence={() => { rememberPanelOpener(); setEvidenceOpen(true); track("bh_evidence_opened", { chapter: activeChapter.id }); }}
            onNavigator={() => { rememberPanelOpener(); setNavigatorOpen(true); }}
            onSettings={() => { rememberPanelOpener(); setSettingsOpen(true); }}
            onSound={() => setSound((current) => !current)}
            progress={progress}
            sound={sound}
          />
        )}

        <AmbientSoundscape chapterIndex={activeIndex} enabled={started && sound} />
        <p className={styles.liveRegion} aria-live="polite">Chapter {activeIndex + 1}: {activeChapter.navTitle}</p>

        <div className={styles.chapterSequence} data-visible={started}>
          {becomingHumanChapters.map((chapter) => {
            const scene = sceneForChapter(chapter.id);
            return (
              <div className={styles.chapterAnchor} id={`chapter-anchor-${chapter.id}`} key={chapter.id} ref={(node) => { sectionsRef.current[chapter.index] = node; }}>
                <MemoizedChapterSection
                  active={chapter.index === activeIndex}
                  chapter={chapter}
                  lateBeat={chapter.index === activeIndex && chapterProgress > 0.52}
                  onEvidence={() => { rememberPanelOpener(); setEvidenceOpen(true); track("bh_evidence_opened", { chapter: chapter.id }); }}
                  onInteract={() => { rememberPanelOpener(); setInteractionOpen(true); track("bh_interaction_opened", { chapter: chapter.id, interaction: chapter.interaction }); }}
                  scene={scene}
                />
              </div>
            );
          })}
        </div>

        <Finale onRestart={() => {
          setCompletedIds(new Set());
          window.localStorage.removeItem(STORAGE_KEY);
          begin("you-are-here", sound);
        }} />
        <EvidenceIndex />
      </div>

      {panelOpen && <button aria-label="Close open panel" className={styles.panelScrim} data-kind={evidenceOpen ? "evidence" : "panel"} onClick={closePanels} type="button" />}
      {evidenceOpen && <EvidenceLens chapter={activeChapter} onClose={() => setEvidenceOpen(false)} scene={activeScene} />}
      {interactionOpen && activeChapter.interaction && <InteractionDrawer chapter={activeChapter} onClose={() => setInteractionOpen(false)} />}
      {navigatorOpen && <ChapterNavigator activeIndex={activeIndex} completedIds={completedIds} onClose={() => setNavigatorOpen(false)} onSelect={gotoChapter} />}
      {settingsOpen && <ExhibitSettings mode={mode} onClose={() => setSettingsOpen(false)} onMode={setMode} onReducedMotion={setReducedMotion} reducedMotion={reducedMotion} />}
    </main>
  );
}
