# Thirteen Minutes Immersive Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform `/exhibits/thirteen-minutes` from a text-led scroll article into a 10–15 minute, full-scene Apollo 11 descent experience driven by a Blender-built Eagle model, Three.js terrain, spatial telemetry, and optional hands-on explanations.

**Architecture:** Keep the current server-rendered article and verified `content.json` as the resilient base. Add a dynamically loaded React Three Fiber scene whose normalized progress derives from the same beat state used by scrolling, rail clicks, and keyboard navigation. Store authored camera, lander, trajectory, and interaction data in a separate scene configuration so reusable UI components remain content-agnostic.

**Tech Stack:** Next.js 16, React 19, TypeScript, React Three Fiber, Drei, Three.js, GSAP/ScrollTrigger, Lenis, Blender MCP, Vitest, Testing Library, Playwright.

## Global Constraints

- The selected visual target is `docs/superpowers/specs/assets/thirteen-minutes-descent-window-reference.png`.
- The historical copy and checked telemetry in `content.json` remain authoritative.
- The primary experience must be visibly dominated by a live 3D descent; every beat changes the physical scene.
- The complete article must remain readable without JavaScript, WebGL, the GLB, or animation.
- `prefers-reduced-motion` must avoid continuous camera motion, dust animation, and digit interpolation.
- Pointer interaction must never trap vertical page scrolling.
- The GLB target is below 1.5 MB and is lazy-loaded after meaningful HTML content.
- No blocking external requests, autoplay audio, card dashboard, alternate-history game, score, or failure screen.
- Do not commit or push any changes.

---

### Task 1: Scene State Contract and Interpolation

**Files:**
- Create: `app/exhibits/thirteen-minutes/scene-config.ts`
- Create: `app/exhibits/thirteen-minutes/scene-state.ts`
- Modify: `app/exhibits/thirteen-minutes/types.ts`
- Test: `tests/thirteen-minutes-scene-state.test.ts`

**Interfaces:**
- Consumes: beat IDs from `ExhibitContent["beats"]`.
- Produces: `SceneKeyframe`, `SceneState`, `SCENE_KEYFRAMES`, `interpolateSceneState(progress)`, and `progressForBeat(id)`.

- [ ] **Step 1: Write the failing scene-state tests**

```ts
expect(progressForBeat("program-alarm")).toBeCloseTo(0.4);
expect(interpolateSceneState(0).altitudeFeet).toBe(49971);
expect(interpolateSceneState(1).altitudeFeet).toBe(0);
expect(interpolateSceneState(0.5).camera.position).toHaveLength(3);
expect(interpolateSceneState(-1).progress).toBe(0);
expect(interpolateSceneState(2).progress).toBe(1);
```

- [ ] **Step 2: Run the focused test and confirm it fails**

Run: `pnpm vitest run tests/thirteen-minutes-scene-state.test.ts`

- [ ] **Step 3: Define the data contract**

```ts
export type Vec3 = readonly [number, number, number];

export interface SceneKeyframe {
  beatId: string;
  progress: number;
  altitudeFeet: number;
  landerPosition: Vec3;
  landerRotation: Vec3;
  camera: { position: Vec3; target: Vec3; fov: number };
  terrainReveal: number;
  trajectoryReveal: number;
  computerLoad: number;
  dust: number;
}

export interface SceneState extends SceneKeyframe {
  nextBeatId: string;
}
```

- [ ] **Step 4: Author six deterministic keyframes and interpolation helpers**

Use the verified beat order and clamp all normalized values. Interpolate vectors component-by-component and choose discrete labels from the nearest prior keyframe.

- [ ] **Step 5: Run focused and full unit tests**

Run: `pnpm vitest run tests/thirteen-minutes-scene-state.test.ts && pnpm test`

---

### Task 2: Blender Eagle, Poster, and Export Verification

**Files:**
- Create via Blender export: `public/models/eagle-low-poly.glb`
- Create via Blender render: `public/images/eagle-descent-poster.webp`
- Create: `app/exhibits/thirteen-minutes/model-manifest.ts`
- Test: `tests/thirteen-minutes-assets.test.ts`

**Interfaces:**
- Produces named GLB nodes `AscentStage`, `DescentStage`, `LandingLegs`, `EngineBell`, `RadarDish`, `Ladder`, and material groups `Cabin`, `Foil`, `Metal`, `DarkMetal`.

- [ ] **Step 1: Write failing asset-manifest tests**

```ts
expect(EAGLE_MODEL.src).toBe("/models/eagle-low-poly.glb");
expect(EAGLE_MODEL.poster).toBe("/images/eagle-descent-poster.webp");
expect(EAGLE_MODEL.requiredNodes).toContain("LandingLegs");
```

- [ ] **Step 2: Build Eagle with Blender MCP**

Create an octagonal descent stage, faceted ascent cabin, engine bell, four angled landing-leg assemblies with footpads, ladder, dish, antennae, and restrained foil panels. Use flat shading and join repeated mechanical parts into named collections without collapsing the required animation groups.

- [ ] **Step 3: Set materials, camera, and lighting**

Use near-black cabin apertures, matte ivory/gray cabin facets, dark structural metal, and restrained metallic amber foil. Light with a hard low-angle sun plus a weak neutral fill matching the selected reference.

- [ ] **Step 4: Render and inspect the poster**

Render at 1600×1000 with transparent or near-black background, inspect the result, and correct proportions, silhouette, landing-leg contact, clipping, and framing before export.

- [ ] **Step 5: Export the GLB and verify it**

Export selected scene objects with applied transforms, embedded materials, and Draco-compatible geometry. Confirm the file exists, parses through Three.js `GLTFLoader`, contains required nodes, and is below 1.5 MB; simplify geometry if needed.

- [ ] **Step 6: Add the model manifest and pass tests**

```ts
export const EAGLE_MODEL = {
  src: "/models/eagle-low-poly.glb",
  poster: "/images/eagle-descent-poster.webp",
  requiredNodes: ["AscentStage", "DescentStage", "LandingLegs", "EngineBell", "RadarDish", "Ladder"],
} as const;
```

Run: `pnpm vitest run tests/thirteen-minutes-assets.test.ts`

---

### Task 3: Lazy 3D Runtime and Failure Boundary

**Files:**
- Create: `app/exhibits/thirteen-minutes/components/DescentExperience.tsx`
- Create: `app/exhibits/thirteen-minutes/components/LunarScene.tsx`
- Create: `app/exhibits/thirteen-minutes/components/SceneFallback.tsx`
- Create: `app/exhibits/thirteen-minutes/components/EagleModel.tsx`
- Modify: `app/exhibits/thirteen-minutes/page.tsx`
- Test: `tests/thirteen-minutes-experience.test.tsx`

**Interfaces:**
- `DescentExperience({ content })` owns enhancement mode and normalized progress.
- `LunarScene({ state, inspectMode, quality })` renders the canvas.
- `SceneFallback({ reason })` renders the local poster and keeps the article visible.

- [ ] **Step 1: Write failing enhancement/fallback tests**

```tsx
render(<DescentExperience content={content} />);
expect(screen.getByRole("img", { name: /Eagle descending/i })).toBeInTheDocument();
expect(screen.queryByTestId("lunar-scene")).not.toBeInTheDocument();
```

Mock capability activation, dynamic import success, and GLB failure; assert that the poster remains and error text is not exposed as broken UI.

- [ ] **Step 2: Implement capability checks**

Activate 3D only when JavaScript is running, WebGL is available, reduced data is not requested, and the visitor reaches or activates the entry. Keep the poster rendered until the first canvas frame reports ready.

- [ ] **Step 3: Implement the lazy Canvas boundary**

```tsx
const LunarScene = dynamic(() => import("./LunarScene"), {
  ssr: false,
  loading: () => <SceneFallback reason="loading" />,
});
```

Configure `frameloop="demand"` outside active motion, cap DPR, pause when hidden, and dispose resources on unmount.

- [ ] **Step 4: Load and validate the Eagle GLB**

Use Drei `useGLTF`, verify required nodes, and throw into the local error boundary on invalid/missing assets. Animate only the top-level group from `SceneState`.

- [ ] **Step 5: Pass focused tests and build**

Run: `pnpm vitest run tests/thirteen-minutes-experience.test.tsx && pnpm build`

---

### Task 4: Lunar Terrain, Trajectory, and Camera Choreography

**Files:**
- Create: `app/exhibits/thirteen-minutes/components/LunarTerrain.tsx`
- Create: `app/exhibits/thirteen-minutes/components/Trajectory.tsx`
- Create: `app/exhibits/thirteen-minutes/components/DescentCamera.tsx`
- Create: `app/exhibits/thirteen-minutes/components/SceneLighting.tsx`
- Create: `app/exhibits/thirteen-minutes/terrain.ts`
- Test: `tests/thirteen-minutes-terrain.test.ts`

**Interfaces:**
- `createTerrain(seed, quality)` returns deterministic positions, indices, normals, crater anchors, boulder transforms, and landing-site anchors.
- `Trajectory({ reveal, compare })` renders planned and actual paths.
- `DescentCamera({ state, inspectMode })` applies authored camera poses without fighting orbit inspection.

- [ ] **Step 1: Write deterministic terrain tests**

```ts
expect(createTerrain(11, "high")).toEqual(createTerrain(11, "high"));
expect(createTerrain(11, "low").positions.length)
  .toBeLessThan(createTerrain(11, "high").positions.length);
expect(createTerrain(11, "high").anchors.westCrater).toBeDefined();
```

- [ ] **Step 2: Implement cratered terrain geometry**

Use a seeded height function with authored radial depressions for West Crater and smaller craters, low-frequency ridges, and deterministic rock transforms. Compute vertex normals once and use vertex colors for tonal variation.

- [ ] **Step 3: Implement planned/actual trajectories and landing ellipse**

Use Three.js curves and line geometry. The compare state must change line opacity and labels, never historical transforms.

- [ ] **Step 4: Implement the six camera poses**

Match the selected reference at the Program Alarm keyframe: Eagle large left-of-center, horizon low, terrain and landing ellipse visible, telemetry perimeter left clear. Use damped interpolation only in normal motion mode.

- [ ] **Step 5: Add lighting, shadow budget, and dust hooks**

Use one directional light and minimal fill. Enable contact/cast shadows only at capable quality levels. Dust remains zero until manual control and is disabled for reduced motion.

- [ ] **Step 6: Run focused and full tests**

Run: `pnpm vitest run tests/thirteen-minutes-terrain.test.ts && pnpm test`

---

### Task 5: Persistent Scroll Story and Spatial HUD

**Files:**
- Modify: `app/exhibits/thirteen-minutes/components/TimelineExperience.tsx`
- Modify: `app/exhibits/thirteen-minutes/components/MissionHud.tsx`
- Modify: `app/exhibits/thirteen-minutes/components/BeatSection.tsx`
- Modify: `app/exhibits/thirteen-minutes/components/ProgressRail.tsx`
- Create: `app/exhibits/thirteen-minutes/components/TranscriptCaption.tsx`
- Modify: `app/exhibits/thirteen-minutes/thirteen-minutes.module.css`
- Test: `tests/thirteen-minutes-timeline.test.tsx`

**Interfaces:**
- `TimelineExperience` publishes normalized `progress`, current beat, and direction to `DescentExperience`.
- `MissionHud` accepts layout variant `"perimeter" | "static"`.
- `BeatSection` accepts `presentation="caption" | "article"` without importing scene data.

- [ ] **Step 1: Extend failing timeline tests**

Assert that scroll entry, scroll-back, rail click, next/previous, Home/End, and Page keys produce the same beat and matching normalized progress.

- [ ] **Step 2: Connect GSAP progress to scene state**

Use one timeline/ScrollTrigger for continuous progress plus beat triggers for semantic active state. Keep `onEnter` and `onEnterBack` behavior.

- [ ] **Step 3: Recompose the viewport**

Pin the scene over the story range. Position title, MET, altitude, computer load, and active quote at the perimeter to match the reference. Reduce narrative paragraphs to short captions inside enhanced mode while leaving the complete article in the DOM.

- [ ] **Step 4: Integrate the phase rail with the trajectory composition**

Keep buttons semantic and keyboard reachable. Visual ticks must remain secondary to the 3D world.

- [ ] **Step 5: Verify both directions and reduced motion**

Run: `pnpm vitest run tests/thirteen-minutes-timeline.test.tsx`

---

### Task 6: Three Understanding-First Interactions

**Files:**
- Create: `app/exhibits/thirteen-minutes/components/ExperienceControls.tsx`
- Create: `app/exhibits/thirteen-minutes/components/ComputerLoad.tsx`
- Create: `app/exhibits/thirteen-minutes/experience-reducer.ts`
- Modify: `app/exhibits/thirteen-minutes/components/DescentExperience.tsx`
- Modify: `app/exhibits/thirteen-minutes/components/LunarScene.tsx`
- Test: `tests/thirteen-minutes-interactions.test.tsx`

**Interfaces:**
- State: `{ inspect: boolean; compare: boolean; computerDetail: "overview" | "dropped" | "kept" }`.
- Actions: `TOGGLE_INSPECT`, `SET_COMPARE`, `SET_COMPUTER_DETAIL`, `RESET_TRANSIENT`.

- [ ] **Step 1: Write reducer and control tests**

```ts
expect(reducer(initial, { type: "TOGGLE_INSPECT" }).inspect).toBe(true);
expect(reducer(initial, { type: "SET_COMPARE", value: true }).compare).toBe(true);
```

Assert mouse, touch/click toggle, Enter/Space, and Escape equivalents.

- [ ] **Step 2: Implement inspect mode**

Enable constrained orbit controls only after explicit activation. Pause scroll-driven camera interpolation, preserve page scroll, show a persistent exit control, and reset on beat navigation.

- [ ] **Step 3: Implement planned/actual comparison**

At Course Check and Manual Control, a press-and-hold or toggle reveals both path geometries and terrain annotations. The control must not alter Eagle’s historical path.

- [ ] **Step 4: Implement the 1202 computer-load explanation**

Render a DOM-accessible task-lane visualization synchronized with subtle 3D line/object states. Show radar input dropped while guidance and engine control remain. No flashing or dependence on color alone.

- [ ] **Step 5: Add the epilogue scheduler manipulation**

Provide a bounded slider/button sequence that increases non-essential load and visibly preserves the essential lanes. Announce the result through an `aria-live="polite"` region.

- [ ] **Step 6: Pass interaction tests**

Run: `pnpm vitest run tests/thirteen-minutes-interactions.test.tsx`

---

### Task 7: Archival Images and Chapter Transitions

**Files:**
- Create: `public/images/apollo-11-eagle-orbit.webp`
- Create: `public/images/apollo-11-lunar-surface.webp`
- Create: `app/exhibits/thirteen-minutes/archive.ts`
- Create: `app/exhibits/thirteen-minutes/components/ArchiveFrame.tsx`
- Modify: `app/exhibits/thirteen-minutes/page.tsx`
- Test: `tests/thirteen-minutes-archive.test.tsx`

**Interfaces:**
- `ArchiveAsset` includes `src`, `alt`, `caption`, `credit`, `sourceUrl`, `width`, and `height`.

- [ ] **Step 1: Select two primary-source NASA images**

Choose one Eagle/orbit image for the prologue and one lunar-surface/mission image for the epilogue. Record exact NASA source pages and mission identifiers; do not use search-result URLs.

- [ ] **Step 2: Download and optimize local derivatives**

Convert to WebP at a maximum 2000 px long edge, preserve aspect ratio, and target each under 350 KB without visible banding.

- [ ] **Step 3: Write archive metadata tests**

```ts
expect(ARCHIVE_ASSETS).toHaveLength(2);
expect(ARCHIVE_ASSETS.every((asset) => asset.sourceUrl.startsWith("https://www.nasa.gov/"))).toBe(true);
expect(ARCHIVE_ASSETS.every((asset) => asset.alt.length > 20)).toBe(true);
```

- [ ] **Step 4: Implement labeled transitions**

Use `next/image`, visible mission identifiers, concise captions, and credit links. Lazy-load the epilogue image and never layer long text over complex image areas.

- [ ] **Step 5: Pass focused tests**

Run: `pnpm vitest run tests/thirteen-minutes-archive.test.tsx`

---

### Task 8: Mobile, Reduced Motion, Failure, and Performance Pass

**Files:**
- Modify: `app/exhibits/thirteen-minutes/components/DescentExperience.tsx`
- Modify: `app/exhibits/thirteen-minutes/components/LunarScene.tsx`
- Modify: `app/exhibits/thirteen-minutes/thirteen-minutes.module.css`
- Modify: `e2e/thirteen-minutes.spec.ts`

**Interfaces:**
- Quality tiers: `"high" | "balanced" | "static"`.
- Capability result: `{ tier; reason; dpr; shadows; terrainQuality; dustCount }`.

- [ ] **Step 1: Add failing browser coverage**

Cover desktop scene presence, all six physical scene changes, inspect, compare, computer load, reverse scrolling, rail/keyboard parity, reduced motion, WebGL failure, GLB 404, no JavaScript, and 375×667 / 390×844 overflow and control collisions.

- [ ] **Step 2: Implement adaptive quality**

Cap desktop DPR at 1.5 and mobile at 1.25. Reduce terrain subdivisions, boulders, dust, and shadows in balanced mode. Switch to poster/article mode after WebGL failure or repeated long frames.

- [ ] **Step 3: Implement reduced-motion scene posters**

Do not create a continuously animating Canvas in reduced-motion mode. Keep one static poster plus per-beat telemetry and full text.

- [ ] **Step 4: Verify resource timing and cleanup**

Assert the opening HTML and poster appear before the Three.js chunk/GLB request. Inspect console logs, detached canvases, duplicated ScrollTriggers, and active animation frames after route teardown.

- [ ] **Step 5: Run the browser matrix**

Run: `pnpm playwright test e2e/thirteen-minutes.spec.ts --reporter=list`

---

### Task 9: Design QA and Final Verification

**Files:**
- Create: `design-qa.md`
- Create/update: `.design-qa/thirteen-minutes/reference-plus-prototype.png`
- Modify any route files required by P0/P1/P2 findings.

**Interfaces:**
- The QA gate is complete only when `design-qa.md` contains `final result: passed`.

- [ ] **Step 1: Build and run production locally**

Run: `pnpm test`, `pnpm build`, then `pnpm start -- -H 127.0.0.1 -p 3000`.

- [ ] **Step 2: Capture the reference and matching prototype state**

At 1440×1024, navigate to Program Alarm, wait for the GLB and terrain, capture the prototype, and place it beside the selected reference at the same scale.

- [ ] **Step 3: Run the blocking visual comparison**

Score composition, object prominence, terrain depth, HUD placement, typography, palette, clutter, spacing, and interaction visibility. Fix all P0/P1/P2 differences and repeat capture/comparison.

- [ ] **Step 4: Verify complete experience behavior**

Manually traverse all beats forward and backward; operate inspect, planned/actual compare, computer-load reveal, phase rail, previous/next, keyboard controls, mobile touch controls, reduced motion, GLB failure, and no-JavaScript article.

- [ ] **Step 5: Run the complete repository checks**

Run: `pnpm test`, `pnpm playwright test --reporter=list`, and `pnpm build`. Confirm HTTP 200 at `/exhibits/thirteen-minutes`, no browser errors, and no external blocking requests.

- [ ] **Step 6: Leave the final production route running**

Restart only the exact local process created for this task and verify the route title and opening content before handoff. Preserve the working tree without commits or pushes.
