// Kept dependency-free (no three.js/@react-three imports) so callers can
// warm the Sketchfab connection immediately on mount without pulling in
// the heavy 3D bundle that DinosaurCanvas/DinosaurSpecimenViewer carry.

export type SketchfabCamera = {
  position: [number, number, number];
  target: [number, number, number];
};

export type SketchfabApi = {
  start: () => void;
  stop?: () => void;
  addEventListener: (event: string, callback: () => void) => void;
  getCameraLookAt: (callback: (camera: SketchfabCamera) => void) => void;
  setCameraLookAt: (
    position: [number, number, number],
    target: [number, number, number],
    duration: number,
  ) => void;
  recenterCamera: () => void;
  setBackground?: (options: { color: [number, number, number] }) => void;
  setTextureQuality?: (quality: "hd" | "ld") => void;
};

export type SketchfabClient = {
  init: (
    uid: string,
    options: {
      success: (api: SketchfabApi) => void;
      error: () => void;
      autostart: 1;
      preload: 0;
      transparent: 0;
      ui_controls: 0;
      ui_infos: 0;
      ui_stop: 0;
      ui_watermark: 1;
      ui_annotations: 1;
      ui_hint: 0;
      ui_inspector: 0;
      ui_settings: 0;
      ui_help: 0;
      ui_vr: 0;
      ui_fullscreen: 0;
      animation_autoplay: 0 | 1;
      dnt: 1;
    },
  ) => void;
};

declare global {
  interface Window {
    Sketchfab?: new (version: string, iframe: HTMLIFrameElement) => SketchfabClient;
  }
}

let sketchfabScriptPromise: Promise<void> | null = null;

export function preconnectSketchfab() {
  if (typeof document === "undefined") return;
  for (const origin of ["https://static.sketchfab.com", "https://sketchfab.com"]) {
    if (document.querySelector(`link[data-loupe-preconnect="${origin}"]`)) continue;
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = origin;
    link.crossOrigin = "anonymous";
    link.dataset.loupePreconnect = origin;
    document.head.appendChild(link);
  }
}

export function loadSketchfabScript() {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Sketchfab) return Promise.resolve();
  if (sketchfabScriptPromise) return sketchfabScriptPromise;
  preconnectSketchfab();
  sketchfabScriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-loupe-sketchfab="true"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Sketchfab viewer unavailable")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = "https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js";
    script.async = true;
    script.dataset.loupeSketchfab = "true";
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => reject(new Error("Sketchfab viewer unavailable")), { once: true });
    document.head.appendChild(script);
  });
  return sketchfabScriptPromise;
}

export function preloadSketchfabViewer() {
  return loadSketchfabScript().catch(() => undefined);
}
