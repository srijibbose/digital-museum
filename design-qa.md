# Thirteen Minutes — Design QA

## Scope

- Source of visual truth: `docs/superpowers/specs/assets/thirteen-minutes-descent-window-reference.png`
- Product requirements: `loupe-exhibit-thirteen-minutes.md`
- Route: `/exhibits/thirteen-minutes`
- Final implementation state: Program Alarm, live WebGL, dark cockpit theme

## Evidence

- Source/implementation full comparison: `.design-audit/thirteen-minutes/15-final-full-comparison.png`
- Focused model + HUD comparison: `.design-audit/thirteen-minutes/16-final-model-hud-comparison.png`
- Focused transcript comparison: `.design-audit/thirteen-minutes/17-final-transcript-comparison.png`
- Final production desktop frame: `.design-audit/thirteen-minutes/22-program-alarm-production-final.png`
- Final production mobile frame: `.design-audit/thirteen-minutes/20-mobile-timeline-production.png`
- Blender model preview: `.design-audit/thirteen-minutes/09-blender-model-preview.webp`

The source was generated at 1487×1058. The app browser's normal desktop surface is 1280×720; the earlier same-state comparisons used the 1472×850 preview surface. To make the full comparison like-for-like, the source was normalized with a symmetric 15 px horizontal crop and a 208 px bottom crop. The focused transcript comparison uses equal bottom-aligned 280 px crops; the model/HUD comparison uses equal 1000×700 crops.

## Findings and iterations

1. P1 — the first 3D pass read as a primitive stack instead of Eagle. Rebuilt the ascent shell in Blender as an irregular faceted cabin, added foil facets, strengthened the dish/ladder silhouette, and re-exported the GLB and poster.
2. P2 — persistent exhibit identity was missing inside the immersive timeline. Added the Loupe/Thirteen Minutes identity block and tuned its compact desktop breakpoint.
3. P2 — transcript copy could collide with persistent HUD elements on short desktop and mobile viewports. Added short-height transcript separation, a compact computer-load panel, and a mobile HUD occlusion mask.
4. P2 — the 3D bundle could initialize before the visitor reached the timeline. Added intersection-gated loading; first paint now contains the complete hero and zero canvases.
5. P2 — a rail jump inherited the global smooth-scroll rule and could drift into the next beat. Forced a deterministic jump and added regression coverage.
6. P2 — restoring a mid-timeline scroll position could initialize a stale beat. The active beat now synchronizes from the section containing the viewport center on every smooth-scroll update.

After the final iteration there are no open P0, P1, or P2 visual findings. The custom model remains intentionally flatter and more mechanical than the reference image, matching the brief's low-poly Blender direction and the performance budget rather than imitating a photoreal scan.

## Functional and responsive checks

- Progress rail, previous/next, Home/End/arrow navigation, inspect/escape, planned-vs-actual comparison, and both 1202 computer-detail controls exercised in the production browser.
- Forward scroll changed Approach → Program Alarm; backward scroll returned Program Alarm → Approach.
- 390×844 mobile viewport: no horizontal overflow; HUD, rail, transcript, model, computer load, and bottom controls remain readable and separated.
- Server-rendered/no-JS HTML contains the hook, all six walkthrough beats, every quote, and static per-beat telemetry; it contains no canvas.
- Reduced-motion and missing-model paths are covered by executable tests and show static content/poster fallbacks.
- Final production console: zero errors. The only warnings are an upstream React Three Fiber/Three.js `THREE.Clock` deprecation notice.
- Final automated result: 14 test files, 55 tests passed; optimized Next.js build and TypeScript validation passed.

final result: passed
