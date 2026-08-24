"use client";

import { BookOpen, Moon, Pause, Play, Sun } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { jetEngine, getJetProfile, getJetStation, getJetView } from "@/content/jet-engine";
import { calculateJetCycle } from "@/lib/jet-engine/jet-engine-model";
import type { JetProfileId, JetStationId, JetViewId } from "@/lib/jet-engine/jet-engine-schema";
import { FlowStationRail } from "./FlowStationRail";
import { JetCommandDeck } from "./JetCommandDeck";
import { JetEngineStage } from "./JetEngineStage";
import { StationGuide } from "./StationGuide";
import styles from "./jet-engine.module.css";

type JetTheme = "light" | "dark";

const THEME_STORAGE_KEY = "loupe-jet-engine-theme";

export function JetEngineExperience() {
  const [stationId, setStationId] = useState<JetStationId>("2");
  const [profileId, setProfileId] = useState<JetProfileId>("cruise");
  const [viewId, setViewId] = useState<JetViewId>("section");
  const [theme, setTheme] = useState<JetTheme>("dark");
  const [motionEnabled, setMotionEnabled] = useState(true);
  const [sourceOpen, setSourceOpen] = useState(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === "light" || storedTheme === "dark") setTheme(storedTheme);

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) setMotionEnabled(false);
  }, []);

  const profile = getJetProfile(profileId);
  const station = getJetStation(stationId);
  const view = getJetView(viewId);
  const cycle = useMemo(() => calculateJetCycle(profile), [profile]);

  const changeTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  };

  return (
    <section
      className={styles.exhibit}
      data-theme={theme}
      data-motion={motionEnabled ? "running" : "paused"}
      role="region"
      aria-label="Jet Engine interactive exhibit"
    >
      <a className={styles.skipLink} href="#jet-engine-instrument">Skip to the engine instrument</a>

      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="Loupe museum home">
          <span className={styles.brandMark} aria-hidden="true" />
          <strong>LOUPE</strong>
          <span>/ EXH. 003</span>
        </Link>
        <div className={styles.headerThesis} aria-hidden="true">
          <i />
          <span>Two streams</span>
          <i />
          <span>One energy loop</span>
        </div>
        <div className={styles.headerActions}>
          <button
            type="button"
            onClick={() => setSourceOpen((open) => !open)}
            aria-pressed={sourceOpen}
            aria-label="Toggle source notebook"
          >
            <BookOpen size={16} aria-hidden="true" />
            <span>Sources</span>
          </button>
          <button
            type="button"
            onClick={() => setMotionEnabled((enabled) => !enabled)}
            aria-label={motionEnabled ? "Pause airflow animation" : "Play airflow animation"}
          >
            {motionEnabled ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
          </button>
          <button
            type="button"
            onClick={changeTheme}
            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          >
            {theme === "light" ? <Moon size={16} aria-hidden="true" /> : <Sun size={16} aria-hidden="true" />}
          </button>
        </div>
      </header>

      <div className={styles.instrument} id="jet-engine-instrument">
        <FlowStationRail selectedId={stationId} cycle={cycle} onSelect={setStationId} />

        <section className={styles.workbench} aria-label="Jet engine workbench">
          <div className={styles.exhibitHeading}>
            <div>
              <p>Systems &amp; machines / three-dimensional flow laboratory</p>
              <h2>{jetEngine.title}</h2>
            </div>
            <p className={styles.headingThesis}>{jetEngine.thesis}</p>
          </div>

          <div className={styles.stageFrame}>
            <div className={styles.stageTopline}>
              <span>{view.label} view</span>
              <span className={styles.evidenceTag} data-evidence={view.evidence}>
                {view.evidence.replaceAll("-", " ")}
              </span>
              <span>{profile.context}</span>
            </div>
            <JetEngineStage
              stationId={stationId}
              viewId={viewId}
              cycle={cycle}
              motionEnabled={motionEnabled}
              onSelectStation={setStationId}
            />
            <div className={styles.stageCaption}>
              <span>High-bypass turbofan · interactive 3D reconstruction</span>
              <span>{view.description}</span>
            </div>
          </div>

          <div className={styles.selectionReadout} aria-live="polite">
            <span>Station {station.number}</span>
            <strong>{station.label}</strong>
            <small>{station.transformation}</small>
          </div>

          <JetCommandDeck
            profileId={profileId}
            viewId={viewId}
            cycle={cycle}
            onProfileChange={setProfileId}
            onViewChange={setViewId}
          />
        </section>

        <StationGuide
          station={station}
          cycle={cycle}
          sourceOpen={sourceOpen}
          onSourceOpenChange={setSourceOpen}
        />
      </div>
    </section>
  );
}

export default JetEngineExperience;
