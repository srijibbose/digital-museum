"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import {
  Box,
  ExternalLink,
  Focus,
  Info,
  Minus,
  Moon,
  Plus,
  RotateCcw,
  RotateCw,
  ScanLine,
  Sun,
  X,
} from "lucide-react";
import {
  type CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  dinosaurModes,
  dinosaurSpecies,
  getDinosaurLifeModel,
  getDinosaurMode,
  getDinosaurSources,
  getDinosaurSpecies,
  isDinosaurModeId,
  isDinosaurSpeciesId,
  type DinosaurModeId,
  type DinosaurSpeciesId,
} from "@/content/dinosaurs";
import { DinosaurEvidenceOverlay } from "./DinosaurEvidenceOverlay";
import type { DinosaurCameraCommand, ExhibitTheme } from "./dinosaur-viewer-types";
import { preconnectSketchfab } from "./sketchfab-loader";
import styles from "./dinosaur-experience.module.css";

const DinosaurSpecimenViewer = dynamic(() => import("./DinosaurSpecimenViewer"), {
  ssr: false,
  loading: () => null,
});

const statusLabels = {
  observed: "Observed object",
  measured: "Measured",
  inferred: "Inference",
  comparative: "Comparative model",
  historical: "Historical reconstruction",
} as const;

function readInitialState() {
  if (typeof window === "undefined") {
    return { species: "tyrannosaurus" as DinosaurSpeciesId, mode: "skeleton" as DinosaurModeId };
  }
  const params = new URLSearchParams(window.location.search);
  const speciesParam = params.get("species");
  const modeParam = params.get("mode");
  return {
    species: isDinosaurSpeciesId(speciesParam) ? speciesParam : "tyrannosaurus",
    mode: isDinosaurModeId(modeParam) ? modeParam : "skeleton",
  };
}

export function DinosaurExperience() {
  const [speciesId, setSpeciesId] = useState<DinosaurSpeciesId>("tyrannosaurus");
  const [modeId, setModeId] = useState<DinosaurModeId>("skeleton");
  const [boneIndex, setBoneIndex] = useState(0);
  const [anatomyIndex, setAnatomyIndex] = useState(0);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [staticView, setStaticView] = useState(false);
  const [webglAvailable, setWebglAvailable] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [viewerReady, setViewerReady] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [theme, setTheme] = useState<ExhibitTheme>("light");
  const [cameraCommand, setCameraCommand] = useState<DinosaurCameraCommand>({
    id: 0,
    type: "reset",
  });

  const species = useMemo(() => getDinosaurSpecies(speciesId), [speciesId]);
  const lifeModel = useMemo(() => getDinosaurLifeModel(speciesId), [speciesId]);
  const mode = useMemo(() => getDinosaurMode(modeId), [modeId]);
  const activeBone = species.boneRegions[boneIndex] ?? species.boneRegions[0];
  const activeAnatomy = species.anatomy[anatomyIndex] ?? species.anatomy[0];
  const sources = useMemo(
    () => getDinosaurSources([...species.sourceIds, lifeModel.sourceId]),
    [lifeModel.sourceId, species.sourceIds],
  );

  useEffect(() => {
    // Six of eight species (plus every "life" reconstruction) load through
    // Sketchfab, so warm the DNS/TLS handshake immediately instead of
    // waiting for the first hover/mode-switch to pay that cost.
    preconnectSketchfab();
    const initial = readInitialState();
    setSpeciesId(initial.species);
    setModeId(initial.mode);
    try {
      const savedTheme = window.localStorage.getItem("loupe-dinosaur-theme");
      const systemTheme = window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      setTheme(savedTheme === "dark" || savedTheme === "light" ? savedTheme : systemTheme);
    } catch {
      // Theme preference is optional.
    }
    setInitialized(true);
    try {
      const canvas = document.createElement("canvas");
      const available = Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
      setWebglAvailable(available);
      if (!available) setStaticView(true);
    } catch {
      setWebglAvailable(false);
      setStaticView(true);
    }
    if (typeof window.matchMedia === "function") {
      const query = window.matchMedia("(prefers-reduced-motion: reduce)");
      const apply = () => setReducedMotion(query.matches);
      apply();
      query.addEventListener("change", apply);
      return () => query.removeEventListener("change", apply);
    }
  }, []);

  useEffect(() => {
    if (!initialized) return;
    try {
      window.localStorage.setItem("loupe-dinosaur-theme", theme);
    } catch {
      // Theme preference is optional.
    }
  }, [initialized, theme]);

  useEffect(() => {
    if (!initialized) return;
    const params = new URLSearchParams(window.location.search);
    params.set("species", speciesId);
    params.set("mode", modeId);
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
    try {
      window.localStorage.setItem("loupe-dinosaur-species", speciesId);
    } catch {
      // Local progress is optional.
    }
  }, [initialized, modeId, speciesId]);

  const selectSpecies = useCallback((nextId: DinosaurSpeciesId) => {
    setSpeciesId(nextId);
    setBoneIndex(0);
    setAnatomyIndex(0);
    setViewerReady(false);
    setCameraCommand((current) => ({ id: current.id + 1, type: "reset" }));
  }, []);

  const commandCamera = useCallback((type: DinosaurCameraCommand["type"]) => {
    setCameraCommand((current) => ({ id: current.id + 1, type }));
  }, []);

  const selectMode = useCallback((nextMode: DinosaurModeId) => {
    if (nextMode !== modeId && (nextMode === "life" || modeId === "life")) {
      setViewerReady(false);
    }
    setModeId(nextMode);
  }, [modeId]);

  const handleViewerReady = useCallback(() => setViewerReady(true), []);

  const warmSpecies = useCallback((nextId: DinosaurSpeciesId) => {
    const connection = (
      navigator as Navigator & { connection?: { effectiveType?: string; saveData?: boolean } }
    ).connection;
    if (connection?.saveData || connection?.effectiveType === "slow-2g" || connection?.effectiveType === "2g") {
      return;
    }
    const target = getDinosaurSpecies(nextId);
    void import("./DinosaurSpecimenViewer").then((viewer) => {
      if (target.specimen.provider === "local" && target.specimen.modelPath) {
        return viewer.preloadLocalDinosaurViewer(target.specimen.modelPath);
      }
      return viewer.preloadSketchfabViewer();
    });
  }, []);

  const warmMode = useCallback((nextMode: DinosaurModeId) => {
    if (nextMode !== "life") {
      warmSpecies(speciesId);
      return;
    }
    const connection = (
      navigator as Navigator & { connection?: { effectiveType?: string; saveData?: boolean } }
    ).connection;
    if (connection?.saveData || connection?.effectiveType === "slow-2g" || connection?.effectiveType === "2g") {
      return;
    }
    void import("./DinosaurSpecimenViewer").then((viewer) => viewer.preloadSketchfabViewer());
  }, [speciesId, warmSpecies]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (sourcesOpen && event.key === "Escape") {
        setSourcesOpen(false);
        return;
      }
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      const index = dinosaurSpecies.findIndex((item) => item.id === speciesId);
      if (event.key === "ArrowDown") {
        event.preventDefault();
        selectSpecies(dinosaurSpecies[(index + 1) % dinosaurSpecies.length].id);
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        selectSpecies(dinosaurSpecies[(index - 1 + dinosaurSpecies.length) % dinosaurSpecies.length].id);
      }
      if (event.key.toLowerCase() === "r") commandCamera("rotate-right");
      if (event.key === "+" || event.key === "=") commandCamera("zoom-in");
      if (event.key === "-") commandCamera("zoom-out");
      if (event.key === "0") commandCamera("reset");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [commandCamera, selectSpecies, sourcesOpen, speciesId]);

  const rootStyle = { "--species-accent": species.accent } as CSSProperties;

  return (
    <main className={styles.experience} style={rootStyle} data-theme={theme}>
      <header className={styles.header}>
        <Link className={styles.mark} href="/" aria-label="Loupe museum home">
          <i className={styles.markGlyph} aria-hidden="true" />
          LOUPE
        </Link>
        <div className={styles.exhibitIdentity}>
          <span>EXH. 006</span>
          <i aria-hidden="true" />
          <strong>DINOSAURS · EVIDENCE ATLAS</strong>
        </div>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.themeSwitch}
            role="switch"
            aria-label="Dark mode"
            aria-checked={theme === "dark"}
            title={`Turn ${theme === "light" ? "on" : "off"} dark mode`}
            onClick={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
          >
            <Sun className={styles.themeIcon} size={13} aria-hidden="true" />
            <span className={styles.themeTrack} aria-hidden="true"><i /></span>
            <Moon className={styles.themeIcon} size={13} aria-hidden="true" />
          </button>
          <button type="button" onClick={() => setSourcesOpen(true)}>
            Sources <ExternalLink size={12} aria-hidden="true" />
          </button>
          <Link href="/">Exit</Link>
        </div>
      </header>

      <div className={styles.instrumentGrid}>
        <aside className={styles.catalogue} aria-label="Dinosaur specimen catalogue">
          <div className={styles.catalogueHeader}>
            <span className={styles.sectionLabel}>Specimen index</span>
            <small>{dinosaurSpecies.length} records</small>
          </div>
          <ol className={styles.speciesList}>
            {dinosaurSpecies.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={styles.speciesButton}
                  data-active={item.id === species.id}
                  aria-current={item.id === species.id ? "true" : undefined}
                  onClick={() => selectSpecies(item.id)}
                  onPointerEnter={() => warmSpecies(item.id)}
                  onFocus={() => warmSpecies(item.id)}
                >
                  <span className={styles.speciesThumb}>
                    <Image
                      src={item.specimen.preview}
                      alt=""
                      width={98}
                      height={90}
                      sizes="49px"
                      quality={75}
                      loading={item.id === "tyrannosaurus" ? "eager" : "lazy"}
                    />
                  </span>
                  <span>
                    <strong>{item.shortName}</strong>
                    <small>{item.interval.replace(" · Maastrichtian", "")}</small>
                  </span>
                  <em>{item.order}</em>
                </button>
              </li>
            ))}
          </ol>

          <div className={styles.speciesFacts} aria-live="polite">
            <p className={styles.taxonomy}>{species.clade}</p>
            <h2>{species.scientificName}</h2>
            <p className={styles.time}>{species.lived}</p>
            <dl className={styles.factGrid}>
              <div><dt>Diet</dt><dd>{species.diet}</dd></div>
              <div><dt>Age record</dt><dd>{species.ageRecord}</dd></div>
              <div><dt>Scale</dt><dd>{species.length}</dd></div>
              <div><dt>Movement</dt><dd>{species.locomotion}</dd></div>
              <div className={styles.wideFact}><dt>Locality</dt><dd>{species.locality} · {species.formation}</dd></div>
            </dl>
            <details className={styles.traitDetails}>
              <summary>Traits &amp; evidence limits</summary>
              <ul>
                {species.traits.map((trait) => <li key={trait}>{trait}</li>)}
              </ul>
              <p><strong>Diet evidence.</strong> {species.dietEvidence}</p>
              <p><strong>Age caution.</strong> {species.ageNote}</p>
            </details>
          </div>
        </aside>

        <section className={styles.stage} aria-labelledby="specimen-title">
          <div className={styles.stageHeading}>
            <div>
              <span>{species.interval}</span>
              <h1 id="specimen-title">{species.title}</h1>
            </div>
            <p>{species.hook}</p>
          </div>

          <div
            className={styles.viewerShell}
            data-mode={modeId}
            data-loading={!staticView && !viewerReady ? "true" : undefined}
          >
            <div className={styles.viewerMeta}>
              <span>{modeId === "life" ? `${lifeModel.title} · ${lifeModel.creator}` : species.specimen.catalogue}</span>
              <span>
                {modeId === "life"
                  ? staticView ? "STATIC RECONSTRUCTION" : "CREDITED 3D RECONSTRUCTION"
                  : staticView ? "STATIC RECORD" : species.specimen.provider === "local" ? "LOCAL MUSEUM GLB" : "INSTITUTIONAL VIEWER"}
              </span>
            </div>
            {!staticView ? (
              <div className={styles.viewerPhoto} data-visible={!viewerReady || undefined} aria-hidden="true">
                <Image
                  key={modeId === "life" ? lifeModel.preview : species.specimen.preview}
                  src={modeId === "life" ? lifeModel.preview : species.specimen.preview}
                  alt=""
                  fill
                  sizes="(max-width: 900px) 100vw, 60vw"
                  quality={70}
                  priority={species.id === "tyrannosaurus" && modeId !== "life"}
                />
              </div>
            ) : null}
            <div className={styles.viewer}>
              {initialized ? (
                <DinosaurSpecimenViewer
                  species={species}
                  reducedMotion={reducedMotion}
                  staticView={staticView}
                  command={cameraCommand}
                  lifeModel={modeId === "life" ? lifeModel : undefined}
                  theme={theme}
                  showHotspots={modeId === "skeleton"}
                  selectedBoneIndex={boneIndex}
                  onBoneSelect={setBoneIndex}
                  onReady={handleViewerReady}
                />
              ) : null}
            </div>
            <DinosaurEvidenceOverlay
              mode={modeId}
              species={species}
              anatomy={activeAnatomy}
              lifeModel={lifeModel}
            />
            <div className={styles.modelTransition} aria-hidden="true" />
            {!staticView && !viewerReady ? (
              <div className={styles.scanProgress} role="status">
                <ScanLine size={15} aria-hidden="true" />
                Resolving institutional scan
              </div>
            ) : null}
            <div className={styles.dragHint}>
              {modeId === "life" ? "Interpretive model · drag to rotate · pinch to zoom" : "Drag to rotate · wheel or pinch to zoom"}
            </div>
          </div>

          <div className={styles.commandDeck}>
            <div className={styles.modeRail} role="group" aria-label="Scientific evidence views">
              {dinosaurModes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={item.id === modeId}
                  onClick={() => selectMode(item.id)}
                  onPointerEnter={() => warmMode(item.id)}
                  onFocus={() => warmMode(item.id)}
                >
                  <span>{item.label}</span>
                  <small>{item.eyebrow}</small>
                </button>
              ))}
            </div>
            <div className={styles.cameraTools} role="group" aria-label="3D specimen camera controls">
              <button type="button" title="Rotate left" aria-label="Rotate specimen left" onClick={() => commandCamera("rotate-left")}>
                <RotateCcw size={16} aria-hidden="true" />
              </button>
              <button type="button" title="Rotate right" aria-label="Rotate specimen right" onClick={() => commandCamera("rotate-right")}>
                <RotateCw size={16} aria-hidden="true" />
              </button>
              <button type="button" title="Zoom in" aria-label="Zoom in" onClick={() => commandCamera("zoom-in")}>
                <Plus size={16} aria-hidden="true" />
              </button>
              <button type="button" title="Zoom out" aria-label="Zoom out" onClick={() => commandCamera("zoom-out")}>
                <Minus size={16} aria-hidden="true" />
              </button>
              <button type="button" title="Reset camera" aria-label="Reset specimen view" onClick={() => commandCamera("reset")}>
                <Focus size={16} aria-hidden="true" />
              </button>
              <button
                type="button"
                className={styles.staticToggle}
                aria-pressed={staticView}
                onClick={() => {
                  if (webglAvailable) {
                    setStaticView((value) => !value);
                    setViewerReady(false);
                  }
                }}
                disabled={!webglAvailable}
              >
                <Box size={15} aria-hidden="true" />
                {staticView ? "Enable 3D" : "Static"}
              </button>
            </div>
          </div>
        </section>

        <aside className={styles.evidencePanel} aria-label="Scientific evidence panel">
          <div className={styles.evidenceScroll}>
            <div className={styles.evidenceHeader}>
              <span className={styles.sectionLabel}>{mode.eyebrow}</span>
              <span className={styles.status} data-status={mode.status}>
                {statusLabels[mode.status]}
              </span>
            </div>
            <h2>{mode.label}</h2>
            <p className={styles.modeDescription}>{mode.description}</p>

            {modeId === "skeleton" ? (
              <>
                <div className={styles.recordCard}>
                  <span>Digital object</span>
                  <h3>{species.specimen.institution}</h3>
                  <dl>
                    <div><dt>Catalogue</dt><dd>{species.specimen.catalogue}</dd></div>
                    <div><dt>Object type</dt><dd>{species.specimen.recordType}</dd></div>
                    <div><dt>Licence</dt><dd><a href={species.specimen.licenseUrl} target="_blank" rel="noreferrer">{species.specimen.license}</a></dd></div>
                  </dl>
                  <p>{species.specimen.recordNote}</p>
                </div>
                <div className={styles.evidenceOptions} role="group" aria-label="Bone regions">
                  {species.boneRegions.map((region, index) => (
                    <button
                      key={region.id}
                      type="button"
                      data-active={index === boneIndex}
                      onClick={() => setBoneIndex(index)}
                    >
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <strong>{region.label}</strong>
                      <small>{statusLabels[region.status]}</small>
                    </button>
                  ))}
                  <p className={styles.selectedEvidence} aria-live="polite">{activeBone.note}</p>
                </div>
              </>
            ) : null}

            {modeId === "life" ? (
              <div className={styles.lifeRecord}>
                <span>Interpretive 3D comparison</span>
                <h3>{lifeModel.title}</h3>
                <dl>
                  <div><dt>Creator</dt><dd>{lifeModel.creator}</dd></div>
                  <div><dt>Access</dt><dd><a href={lifeModel.licenseUrl} target="_blank" rel="noreferrer">{lifeModel.license}</a></dd></div>
                </dl>
                <p>{lifeModel.note}</p>
                <a href={lifeModel.sourceUrl} target="_blank" rel="noreferrer">
                  Open original 3D record <ExternalLink size={12} aria-hidden="true" />
                </a>
              </div>
            ) : null}

            {modeId === "trace" ? (
              <div className={styles.traceRecord}>
                <h3>{species.trace.title}</h3>
                <p>{species.trace.note}</p>
                <div><Info size={14} aria-hidden="true" /><span>{species.trace.caution}</span></div>
                <dl>
                  <div><dt>Can constrain</dt><dd>direction · pace · hip-height range</dd></div>
                  <div><dt>Cannot recover</dt><dd>colour · organs · a secure individual identity</dd></div>
                </dl>
              </div>
            ) : null}

            {modeId === "anatomy" ? (
              <div className={styles.evidenceOptions} role="group" aria-label="Comparative organ systems">
                {species.anatomy.map((system, index) => (
                  <button
                    key={system.id}
                    type="button"
                    data-active={index === anatomyIndex}
                    onClick={() => setAnatomyIndex(index)}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{system.label}</strong>
                    <small>{statusLabels[system.status]}</small>
                  </button>
                ))}
                <p className={styles.selectedEvidence}>{activeAnatomy.note}</p>
              </div>
            ) : null}

            {modeId === "lineage" ? (
              <div className={styles.lineageRecord}>
                <ol>
                  {species.lineage.path.map((node, index) => (
                    <li key={node}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <strong>{node}</strong>
                    </li>
                  ))}
                </ol>
                <p>{species.lineage.note}</p>
                <div>{species.lineage.livingReference}</div>
              </div>
            ) : null}

            <div className={styles.methodNote}>
              <ScanLine size={15} aria-hidden="true" />
              <p><strong>Reading rule.</strong> Bone is an object. A mount is an interpretation. An organ is a comparison unless soft tissue is preserved.</p>
            </div>
            <button className={styles.sourceButton} type="button" onClick={() => setSourcesOpen(true)}>
              Open provenance record <ExternalLink size={13} aria-hidden="true" />
            </button>
          </div>
        </aside>
      </div>

      <footer className={styles.footer}>
        <span>Institutional scans · visible licences · labelled inference</span>
        <span>Keyboard: ↑ ↓ species · R rotate · + − zoom · 0 reset</span>
      </footer>

      {sourcesOpen ? (
        <div className={styles.dialogBackdrop} onMouseDown={() => setSourcesOpen(false)}>
          <aside
            className={styles.sourceDialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="source-dialog-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className={styles.dialogHeader}>
              <div>
                <span className={styles.sectionLabel}>Provenance · {species.order}</span>
                <h2 id="source-dialog-title">{species.scientificName}</h2>
              </div>
              <button type="button" aria-label="Close provenance record" onClick={() => setSourcesOpen(false)}>
                <X size={17} aria-hidden="true" />
              </button>
            </div>
            <div className={styles.dialogBody}>
              <section>
                <h3>Digital specimen</h3>
                <p>{species.specimen.recordNote}</p>
                <a href={species.specimen.sourceUrl} target="_blank" rel="noreferrer">
                  Open institution record <ExternalLink size={12} aria-hidden="true" />
                </a>
              </section>
              <section>
                <h3>Sources used for this record</h3>
                <ul>
                  {sources.map((source) => (
                    <li key={source.id}>
                      <a href={source.url} target="_blank" rel="noreferrer">
                        <span>{source.kind}</span>
                        <strong>{source.title}</strong>
                        <small>{source.publisher}</small>
                      </a>
                      <p>{source.note}</p>
                    </li>
                  ))}
                </ul>
              </section>
              <p className={styles.licenceNote}>
                The 3D object remains credited under <a href={species.specimen.licenseUrl} target="_blank" rel="noreferrer">{species.specimen.license}</a>.
                The life model retains its separate creator and access terms. Local museum files are delivered without geometry changes. Interface diagrams are labelled explanatory schematics.
              </p>
            </div>
          </aside>
        </div>
      ) : null}
    </main>
  );
}
