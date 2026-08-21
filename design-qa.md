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

---

# Atlas of Worlds — Design QA

## Scope

- Visual target: `.design-audit/atlas-of-worlds/target.png`
- Route: `/exhibits/atlas-of-worlds?world=moon`
- Reference state: Moon, Surface, light theme
- Matched comparison viewport: 1490×1058
- Production responsive checkpoints: 1440×900 and 390×844

## Evidence

- Approved target: `.design-audit/atlas-of-worlds/target.png`
- Same-viewport implementation: `.design-audit/atlas-of-worlds/implementation-matched.png`
- Production desktop frame: `.design-audit/atlas-of-worlds/implementation.png`
- Comparison layout: `.design-audit/atlas-of-worlds/comparison.html`

The approved target and final implementation were inspected together at the same Moon/light/surface state. The final pass aligns the major geometry: 76 px museum header, compact World Index, approximately 620 px central specimen, persistent right Field Guide, lighting controls, and the bottom scientific command deck.

## Findings and iterations

1. P1 — the desktop grid's implicit row expanded past the instrument height, hiding most of the command deck below the first viewport. Added a bounded grid row and explicit minimum-height/overflow ownership; the stage and guide now end exactly at the viewport edge.
2. P1 — the initial mobile World Index began at the Sun even when the Moon was selected, leaving the active world partially cut off. The selected world now scrolls to the horizontal center on load and keyboard/button selection.
3. P2 — the first desktop specimen was oversized at tall viewport ratios and pushed lighting and commands below the visual target. The authored stage is now capped at 620 px and the command/light baselines match the target comparison.
4. P2 — compact breakpoints hid primary tool labels. Labels now remain visible under their Lucide icons at 390 px.
5. P2 — early compass and observation-reticle marks used CSS geometry. Replaced both with the product's installed Lucide icon system.

There are no open P0, P1, or P2 findings. Two intentional P3 differences remain: the default Field Guide starts with a truthful world overview instead of preselecting a feature from an inactive mode, and the Moon retains the warmer natural LROC colour product rather than forcing the grayscale treatment in the concept image.

## Functional and responsive checks

- World selection, world-specific mode switching, hotspot-to-Field-Guide detail, URL synchronization, dark theme, comparison-world selection, normalized/relative scale, light azimuth/elevation, zoom, reset, and arrow-key navigation were exercised.
- 1440×900 desktop: stage, World Index, command deck, and Field Guide are simultaneously visible; no first-viewport clipping.
- 390×844 mobile: selected world centered, horizontal world and mode rails usable, all primary tool labels visible, complete Field Guide follows the stage, and horizontal overflow is zero.
- Browser console: zero errors. The only warning is the upstream React Three Fiber/Three.js `THREE.Clock` deprecation notice.
- Automated result before final build: 28 test files, 113 tests passed; TypeScript validation passed.
- Optimized Next.js production build passed with the unified dynamic route and permanent Earth/Moon redirects.

final result: passed
