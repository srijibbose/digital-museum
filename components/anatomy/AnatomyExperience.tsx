"use client";

import Link from "next/link";
import { FlaskConical, Info, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "zustand";
import {
  anatomy,
  getAnatomyStructure,
  getAnatomySystem,
  getAnatomyView,
  getAnatomyViewChange,
} from "@/content/anatomy";
import { createAnatomyStore } from "@/lib/anatomy/anatomy-store";
import { AnatomyCommandDeck } from "./AnatomyCommandDeck";
import { AnatomyStage } from "./AnatomyStage";
import { StructureGuide } from "./StructureGuide";
import { StructureRail } from "./StructureRail";
import { SystemIndex } from "./SystemIndex";
import styles from "./anatomy.module.css";

export function AnatomyExperience() {
  const [store] = useState(() => createAnatomyStore());
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const systemId = useStore(store, (state) => state.systemId);
  const viewId = useStore(store, (state) => state.viewId);
  const selectedStructureId = useStore(store, (state) => state.selectedStructureId);
  const expertMode = useStore(store, (state) => state.expertMode);
  const reducedMotion = useStore(store, (state) => state.reducedMotion);
  const layers = useStore(store, (state) => state.layers);
  const cameraCommand = useStore(store, (state) => state.cameraCommand);
  const setSystem = useStore(store, (state) => state.setSystem);
  const setView = useStore(store, (state) => state.setView);
  const selectStructure = useStore(store, (state) => state.selectStructure);
  const toggleExpertMode = useStore(store, (state) => state.toggleExpertMode);
  const setReducedMotion = useStore(store, (state) => state.setReducedMotion);
  const toggleLayer = useStore(store, (state) => state.toggleLayer);
  const issueCameraCommand = useStore(store, (state) => state.issueCameraCommand);

  const system = getAnatomySystem(systemId);
  const view = getAnatomyView(viewId);
  const selectedStructure = getAnatomyStructure(systemId, selectedStructureId)
    ?? system.structures[0];
  const referenceTitle = system.id === "musculoskeletal"
    ? "BodyParts3D whole-body reference"
    : "Healthy adult reference";
  const referenceDetail = system.id === "musculoskeletal"
    ? "201 named bones · CC BY-SA"
    : "HRA v1.2 · Male reference body";

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    query.addEventListener?.("change", onChange);
    return () => query.removeEventListener?.("change", onChange);
  }, [setReducedMotion]);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("loupe-anatomy-theme");
    if (savedTheme === "light" || savedTheme === "dark") setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.anatomyTheme = theme;
    document.documentElement.style.colorScheme = theme;
    const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    themeColor?.setAttribute("content", theme === "light" ? "#f1eee5" : "#090b0d");
    return () => {
      delete document.documentElement.dataset.anatomyTheme;
      document.documentElement.style.removeProperty("color-scheme");
    };
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => {
      const next = current === "light" ? "dark" : "light";
      window.localStorage.setItem("loupe-anatomy-theme", next);
      return next;
    });
  };

  return (
    <section
      className={styles.instrument}
      data-system={system.id}
      data-theme={theme}
      style={{ "--anatomy-accent": system.accent } as React.CSSProperties}
      aria-label="Human Anatomy interactive exhibit"
    >
      <header className={styles.header}>
        <div className={styles.identity}>
          <Link className="museum-mark" href="/" aria-label="Loupe museum home">
            <span className="museum-mark__orb" aria-hidden="true" />
            <span>LOUPE</span>
          </Link>
          <i aria-hidden="true" />
          <span>Human Anatomy</span>
        </div>
        <nav aria-label="Exhibit sections">
          <a href="#anatomy-stage" aria-current="page">Explore</a>
          <a href="#anatomy-transcript">Text atlas</a>
          <a href="#anatomy-sources">Sources</a>
        </nav>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.themeToggle}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            onClick={toggleTheme}
          >
            {theme === "light"
              ? <Sun size={15} aria-hidden="true" />
              : <Moon size={15} aria-hidden="true" />}
            <span>{theme === "light" ? "Light" : "Dark"}</span>
          </button>
          <button
            type="button"
            className={styles.expertToggle}
            data-active={expertMode || undefined}
            aria-pressed={expertMode}
            aria-label="Toggle advanced anatomical evidence"
            onClick={toggleExpertMode}
          >
            <FlaskConical size={15} aria-hidden="true" />
            <span>Advanced evidence</span>
          </button>
        </div>
      </header>

      <div className={styles.instrumentGrid}>
        <SystemIndex systems={anatomy.systems} activeSystemId={systemId} onSelect={setSystem} />

        <section className={styles.stage} id="anatomy-stage" aria-label="Interactive anatomy stage">
          <div className={styles.stageHeading}>
            <div>
              <span>{system.index} · {system.territory}</span>
              <h2>{system.label}</h2>
            </div>
            <p>{system.thesis}</p>
          </div>

          <div className={styles.referenceBadge}>
            <span aria-hidden="true" />
            <div>
              <strong>{referenceTitle}</strong>
              <small>{referenceDetail}</small>
            </div>
          </div>

          <StructureRail
            structures={system.structures}
            selectedId={selectedStructure.id}
            onSelect={selectStructure}
          />

          <div className={styles.modelStage}>
            <div className={styles.measurementField} aria-hidden="true">
              <i /><i /><i />
            </div>
            <AnatomyStage
              store={store}
              system={system}
              view={view}
              selectedStructure={selectedStructure}
              layers={layers}
              reducedMotion={reducedMotion}
              cameraCommand={cameraCommand}
              onSelectStructure={selectStructure}
            />
          </div>

          <div className={styles.selectedReadout} aria-live="polite">
            <span>{selectedStructure.category}</span>
            <strong>{selectedStructure.label}</strong>
            <small>Selection stays active while you rotate and zoom</small>
          </div>

          <AnatomyCommandDeck
            system={system}
            viewId={viewId}
            layers={layers}
            onViewChange={setView}
            onLayerToggle={toggleLayer}
            onCameraCommand={issueCameraCommand}
          />

          <div className={styles.modeQualification}>
            <Info size={14} aria-hidden="true" />
            <p><strong>{system.viewLabels[view.id]}</strong> — {getAnatomyViewChange(system, view)}</p>
            <span>{view.evidence.replaceAll("-", " ")}</span>
          </div>
        </section>

        <StructureGuide
          system={system}
          structure={selectedStructure}
          view={view}
          expertMode={expertMode}
        />
      </div>
    </section>
  );
}
