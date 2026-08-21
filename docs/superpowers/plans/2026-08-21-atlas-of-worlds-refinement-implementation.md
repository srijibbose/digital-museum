# Atlas of Worlds Scientific Instrument Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the approved Loupe navigation, orbital feature system, world-aware lighting, distinct scientific modes, richer Field Guide media, corrected Sun/Jupiter/Saturn rendering, and responsive fixes across all ten Atlas worlds.

**Architecture:** Extend the validated atlas collection so every mode declares its visible renderer change and every optional hotspot image carries provenance. Keep one Zustand instrument store for lighting, motion, focus, and orientation commands; keep React Three Fiber responsible for surface markers and world rendering; keep semantic feature-selection equivalents in React DOM. Replace mixed official-GLB/procedural default paths with one calibrated, data-driven render path so switching modes never changes exposure or scale unexpectedly.

**Tech Stack:** Next.js 16.3 App Router, React 19, TypeScript 7, React Three Fiber 9, Drei 10, Three.js 0.185, Zustand 5, Zod 4, Vitest, Testing Library, in-app Browser visual QA.

**Spec:** `docs/superpowers/specs/2026-08-21-atlas-of-worlds-refinement-design.md`

## Global Constraints

- Work on the existing `earth_moon` branch and preserve the current unified `/exhibits/atlas-of-worlds` route.
- Preserve the selected first concept's parchment cartography design and use the Sun, Jupiter, and Saturn concepts as model-quality references.
- Read the relevant Next.js 16.3 guide under `node_modules/next/dist/docs/` before modifying Next application code.
- Write each behavioral test first, run it, and confirm the expected failure before editing production code.
- Use only locally bundled scientific media with source URL, credit, alt text, caption, evidence status, and processing record.
- Do not present illustrative motion as a live observation.
- Keep HTML controls as the keyboard-accessible equivalent for every canvas marker or gesture.
- No static CSS hotspot layer may duplicate 3D surface positions.
- Reduced motion disables solar flow, atmospheric drift, marker pulses, auto-rotation, and camera interpolation.
- No completion claim until focused tests, the full unit/component suite, TypeScript, optimized build, desktop/mobile browser journeys, console inspection, and visual comparisons are current.

---

## File structure

- `lib/space/atlas-schema.ts`: lighting, motion, mode legend, visible-change, and hotspot-media contracts.
- `content/space/atlas.ts`: authored per-mode behavior and hotspot media references for all ten worlds.
- `content/space/atlas-assets.ts`: local hotspot-media paths and provenance.
- `content/space/atlas-asset-licenses.json`: delivered image ledger.
- `lib/space/atlas-store.ts`: Natural/Survey lighting, light angle, motion, focus, and orientation state.
- `lib/space/ring-geometry.ts`: pure radial UV remapping helper for rings.
- `lib/space/world-focus.ts`: pure latitude/longitude focus math.
- `components/space/AtlasExperience.tsx`: Loupe header composition, store wiring, feature rail, lighting, and orientation.
- `components/space/FeatureRail.tsx`: semantic visible-feature list and selected anchored-callout label.
- `components/space/LightingControl.tsx`: conditional Natural/Survey lighting controls.
- `components/space/OrientationReadout.tsx`: throttled camera latitude/longitude presentation.
- `components/space/CommandDeck.tsx`: mode rail, always-visible What changed copy, legends, and motion switch.
- `components/space/FieldGuide.tsx`: hotspot-specific media and credits.
- `components/space/AtlasStage.tsx`: typed render-layer resolution.
- `components/space/AtlasCanvas.tsx`: calibrated worlds, anchored markers/callout, focus camera, motion, and corrected rings.
- `components/space/atlas.module.css`: approved desktop/mobile layout and alignment.
- `tests/atlas-content.test.ts`: authored mode/media validation.
- `tests/atlas-store.test.ts`: lighting, motion, focus, and orientation transitions.
- `tests/atlas-interface.test.tsx`: navigation, rail, controls, explanations, and Field Guide media.
- `tests/atlas-renderer.test.tsx`: render-layer mapping and regression contracts.
- `tests/atlas-ring-geometry.test.ts`: radial UV mapping.
- `tests/atlas-world-focus.test.ts`: focus math.
- `e2e/atlas-of-worlds.spec.ts`: production journeys and responsive regressions.
- `.design-audit/atlas-of-worlds-refinement/`: approved-reference and implementation screenshots.
- `design-qa.md`: final refinement comparison findings.

### Task 1: Typed mode, lighting, motion, and media contracts

**Files:**
- Modify: `lib/space/atlas-schema.ts`
- Modify: `content/space/atlas.ts`
- Modify: `content/space/atlas-assets.ts`
- Modify: `tests/atlas-content.test.ts`

**Interfaces:**
- Produces `LightingPolicy = "hidden" | "natural-survey" | "angle"`.
- Produces `WorldMode.visibleChange`, `WorldMode.lighting`, `WorldMode.motion`, and `WorldMode.legend`.
- Produces `HotspotMedia` and optional `WorldHotspot.media`.

- [ ] **Step 1: Write failing authored-contract tests**

```ts
for (const world of atlas.worlds) {
  for (const mode of world.modes) {
    expect(mode.visibleChange.length).toBeGreaterThan(20);
    expect(["hidden", "natural-survey", "angle"]).toContain(mode.lighting);
    expect(["none", "solar", "atmosphere", "clouds"]).toContain(mode.motion);
  }
}

const sun = getWorld("sun");
expect(getMode(sun, "photosphere").lighting).toBe("hidden");
expect(getMode(sun, "171").legend).toEqual(
  expect.arrayContaining([expect.objectContaining({ label: "171 Å" })]),
);
expect(getMode(getWorld("mercury"), "temperature").renderEffect).toBe("thermal");
expect(getMode(getWorld("mercury"), "missions").renderEffect).toBe("mission");
```

- [ ] **Step 2: Run `npm test -- tests/atlas-content.test.ts`**

Expected: FAIL because `visibleChange`, `lighting`, `motion`, `legend`, and `renderEffect` are absent.

- [ ] **Step 3: Extend the schemas**

```ts
export const lightingPolicySchema = z.enum(["hidden", "natural-survey", "angle"]);
export const motionKindSchema = z.enum(["none", "solar", "atmosphere", "clouds"]);
export const renderEffectSchema = z.enum([
  "surface", "texture", "clouds", "night", "hotspots", "thermal",
  "mission", "atmosphere", "magnetic", "rings", "tilt", "interior",
]);

export const hotspotMediaSchema = z.object({
  path: z.string().startsWith("/media/space/atlas/features/"),
  alt: z.string().min(20),
  caption: z.string().min(20),
  credit: z.string().min(3),
  sourceUrl: z.string().url(),
  evidence: evidenceStatusSchema,
});
```

- [ ] **Step 4: Author every mode's explicit behavior**

Use the exact per-world matrix from the refinement spec. Sun modes use `lighting: "hidden"`; Moon Lighting uses `lighting: "angle"`; Night lights and Interior use `hidden`; other exterior modes use `natural-survey`. Mercury Temperature uses `renderEffect: "thermal"`; mission modes use `mission`; Sun/Jupiter motion-capable modes declare `solar` or `atmosphere`.

- [ ] **Step 5: Re-run the focused test and full content/schema tests**

Run: `npm test -- tests/atlas-content.test.ts tests/atlas-assets.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -- lib/space/atlas-schema.ts content/space/atlas.ts content/space/atlas-assets.ts tests/atlas-content.test.ts
git commit -m "feat(space): author atlas scientific mode behavior"
```

### Task 2: Lighting, motion, focus, and orientation state

**Files:**
- Modify: `lib/space/atlas-store.ts`
- Modify: `tests/atlas-store.test.ts`

**Interfaces:**
- Produces `LightingMode = "natural" | "survey"`.
- Produces `motionEnabled`, `focusCommand`, `orientation`, `setLightingMode`, `toggleMotion`, `focusHotspot`, `clearFocus`, and `setOrientation`.

- [ ] **Step 1: Write failing store tests**

```ts
const store = createAtlasStore("earth");
expect(store.getState().lightingMode).toBe("survey");
store.getState().setLightingMode("natural");
expect(store.getState().lightingMode).toBe("natural");

store.getState().focusHotspot("himalaya");
expect(store.getState().selectedHotspotId).toBe("himalaya");
expect(store.getState().focusCommand).toMatchObject({ hotspotId: "himalaya" });

store.getState().setOrientation(18.4, -72.8);
expect(store.getState().orientation).toEqual({ latitude: 18.4, longitude: -72.8 });
```

- [ ] **Step 2: Run `npm test -- tests/atlas-store.test.ts`**

Expected: FAIL because the new state and actions do not exist.

- [ ] **Step 3: Implement state with monotonic focus commands**

```ts
lightingMode: initialWorld === "earth" ? "survey" : "natural",
motionEnabled: true,
focusCommand: { hotspotId: null, sequence: 0 },
orientation: { latitude: 0, longitude: 0 },
setLightingMode: (lightingMode) => set({ lightingMode }),
toggleMotion: () => set({ motionEnabled: !get().motionEnabled }),
focusHotspot: (hotspotId) => {
  get().selectHotspot(hotspotId);
  set((state) => ({
    focusCommand: { hotspotId, sequence: state.focusCommand.sequence + 1 },
  }));
},
clearFocus: () => set((state) => ({
  selectedHotspotId: null,
  focusCommand: { hotspotId: null, sequence: state.focusCommand.sequence + 1 },
})),
setOrientation: (latitude, longitude) => set({ orientation: { latitude, longitude } }),
```

- [ ] **Step 4: Ensure `setWorld` selects Survey light for Earth and Natural light elsewhere, resets focus, and preserves reduced-motion behavior.**
- [ ] **Step 5: Run focused and full store tests; expect PASS.**
- [ ] **Step 6: Commit**

```bash
git add -- lib/space/atlas-store.ts tests/atlas-store.test.ts
git commit -m "feat(space): add atlas lighting and focus state"
```

### Task 3: Loupe identity, feature rail, lighting control, and mode explanation

**Files:**
- Create: `components/space/FeatureRail.tsx`
- Create: `components/space/LightingControl.tsx`
- Create: `components/space/OrientationReadout.tsx`
- Modify: `components/space/AtlasExperience.tsx`
- Modify: `components/space/CommandDeck.tsx`
- Modify: `components/space/atlas.module.css`
- Modify: `tests/atlas-interface.test.tsx`

**Interfaces:**
- `FeatureRail({ hotspots, selectedHotspotId, onSelect, onClear })` renders the semantic marker equivalent.
- `LightingControl({ policy, mode, azimuth, elevation, onModeChange, onAngleChange })` renders only meaningful controls.
- `OrientationReadout({ latitude, longitude })` renders a live but non-announcing readout.

- [ ] **Step 1: Write failing interface journeys**

```tsx
render(<AtlasExperience initialWorld="sun" />);
expect(screen.getByRole("link", { name: /loupe museum home/i })).toHaveAttribute("href", "/");
expect(screen.getByText("Atlas of Worlds")).not.toHaveAttribute("href");
expect(screen.getByText(/self-luminous/i)).toBeInTheDocument();
expect(screen.queryByRole("slider", { name: /sunlight/i })).not.toBeInTheDocument();

const rail = screen.getByRole("navigation", { name: /visible features/i });
await user.click(within(rail).getByRole("button", { name: /active region/i }));
expect(within(rail).getByRole("button", { name: /active region/i })).toHaveAttribute("aria-pressed", "true");

await user.click(screen.getByRole("button", { name: /^earth/i }));
expect(screen.getByRole("button", { name: /survey light/i })).toHaveAttribute("aria-pressed", "true");
expect(screen.getByText(/what changed/i)).toBeInTheDocument();
```

- [ ] **Step 2: Run `npm test -- tests/atlas-interface.test.tsx`**

Expected: FAIL on missing Loupe link, Feature Rail, conditional lighting, and What changed content.

- [ ] **Step 3: Implement the header lockup using the established `museum-mark` classes**

```tsx
<div className={styles.atlasIdentity}>
  <Link className="museum-mark" href="/" aria-label="Loupe museum home">
    <span className="museum-mark__orb" aria-hidden="true" />
    <span>LOUPE</span>
  </Link>
  <span className={styles.identityDivider} aria-hidden="true" />
  <span className={styles.atlasTitle}>Atlas of Worlds</span>
</div>
```

- [ ] **Step 4: Replace `.markerLayer` and `.featureMarker` DOM labels with `FeatureRail`; keep the selected canvas callout owned by `AtlasCanvas`.**
- [ ] **Step 5: Implement conditional Lighting and the always-visible What changed block. Add the Ångström explanation and wavelength temperature legends to Sun modes.**
- [ ] **Step 6: Run the focused interface test and full component suite; expect PASS.**
- [ ] **Step 7: Commit**

```bash
git add -- components/space/FeatureRail.tsx components/space/LightingControl.tsx components/space/OrientationReadout.tsx components/space/AtlasExperience.tsx components/space/CommandDeck.tsx components/space/atlas.module.css tests/atlas-interface.test.tsx
git commit -m "feat(space): refine atlas instrument controls"
```

### Task 4: Pure ring UV and feature-focus math

**Files:**
- Create: `lib/space/ring-geometry.ts`
- Create: `lib/space/world-focus.ts`
- Create: `tests/atlas-ring-geometry.test.ts`
- Create: `tests/atlas-world-focus.test.ts`

**Interfaces:**
- Produces `applyRadialRingUvs(geometry, innerRadius, outerRadius): THREE.RingGeometry`.
- Produces `focusQuaternion(lat, lon, targetLat, targetLon): THREE.Quaternion`.

- [ ] **Step 1: Write the failing radial-UV test**

```ts
const geometry = new THREE.RingGeometry(1.2, 2.25, 16);
applyRadialRingUvs(geometry, 1.2, 2.25);
const positions = geometry.getAttribute("position");
const uvs = geometry.getAttribute("uv");
for (let index = 0; index < positions.count; index += 1) {
  const radius = Math.hypot(positions.getX(index), positions.getY(index));
  expect(uvs.getX(index)).toBeCloseTo((radius - 1.2) / 1.05, 4);
  expect(uvs.getY(index)).toBeCloseTo(0.5, 4);
}
```

- [ ] **Step 2: Write the failing focus test**

```ts
const quaternion = focusQuaternion(0, 0, 12, -18);
const point = latLonToVector3(12, -18, 1).applyQuaternion(quaternion);
expect(point.x).toBeCloseTo(0, 4);
expect(point.y).toBeCloseTo(0, 4);
expect(point.z).toBeGreaterThan(0.99);
```

- [ ] **Step 3: Run both focused tests and confirm missing-module failures.**
- [ ] **Step 4: Implement radius-normalized UVs and quaternion composition.**

```ts
export function applyRadialRingUvs(
  geometry: THREE.RingGeometry,
  innerRadius: number,
  outerRadius: number,
) {
  const position = geometry.getAttribute("position");
  const uv = geometry.getAttribute("uv");
  for (let index = 0; index < position.count; index += 1) {
    const radius = Math.hypot(position.getX(index), position.getY(index));
    uv.setXY(index, THREE.MathUtils.clamp((radius - innerRadius) / (outerRadius - innerRadius), 0, 1), 0.5);
  }
  uv.needsUpdate = true;
  return geometry;
}
```

- [ ] **Step 5: Run both focused tests; expect PASS.**
- [ ] **Step 6: Commit**

```bash
git add -- lib/space/ring-geometry.ts lib/space/world-focus.ts tests/atlas-ring-geometry.test.ts tests/atlas-world-focus.test.ts
git commit -m "fix(space): add stable ring and focus geometry"
```

### Task 5: Calibrated renderer, anchored callout, orientation, and motion

**Files:**
- Modify: `components/space/AtlasStage.tsx`
- Modify: `components/space/AtlasCanvas.tsx`
- Modify: `tests/atlas-renderer.test.tsx`

**Interfaces:**
- `RenderLayers` gains `renderEffect`, `lightingPolicy`, and `motion`.
- `AtlasCanvasRuntimeProps` gains `lightingMode`, `motionEnabled`, `focusCommand`, `onOrientationChange`, and `onManualOrbit`.
- `AtlasCanvas` owns the only visual marker/callout projection.

- [ ] **Step 1: Write failing renderer contracts**

```ts
expect(resolveRenderLayers(sun, getMode(sun, "photosphere"))).toMatchObject({
  selfLit: true,
  lightingPolicy: "hidden",
  motion: "solar",
});
expect(resolveRenderLayers(mercury, getMode(mercury, "temperature"))).toMatchObject({ renderEffect: "thermal" });
expect(resolveRenderLayers(mercury, getMode(mercury, "missions"))).toMatchObject({ renderEffect: "mission" });
expect(resolveRenderLayers(jupiter, getMode(jupiter, "storms"))).toMatchObject({ motion: "atmosphere" });
expect(resolveRenderLayers(saturn, getMode(saturn, "magnetosphere"))).toMatchObject({
  magnetic: true,
  rings: true,
});
```

- [ ] **Step 2: Run `npm test -- tests/atlas-renderer.test.tsx` and confirm expected failures.**
- [ ] **Step 3: Remove the default-mode `useOfficialModel` branch and use one calibrated procedural surface pipeline across modes. Keep model ledger entries as provenance.**
- [ ] **Step 4: Implement world-aware lights.**

```tsx
{lightingMode === "survey" ? (
  <>
    <hemisphereLight intensity={1.6} color="#fff3df" groundColor="#7a8790" />
    <directionalLight position={[0, 1.5, 5]} intensity={0.85} color="#fff8e8" />
  </>
) : (
  <>
    <ambientLight intensity={0.2} color="#d9e3ea" />
    <directionalLight position={lightPosition} intensity={2.25} color="#fff1d6" />
  </>
)}
```

The Sun material uses `meshBasicMaterial` plus a separate additive limb/corona shell so no directional light can create a terminator.

- [ ] **Step 5: Implement one 3D marker set and one selected Drei `Html` callout with occlusion. Remove all fixed screen-position marker math.**
- [ ] **Step 6: Implement focus interpolation with `focusQuaternion`, cancel interpolation on manual OrbitControls start, and emit throttled orientation values from the camera.**
- [ ] **Step 7: Add render effects:** thermal day/night gradient with legend, mission trajectory lines, atmosphere/cloud shells, differential band drift, solar surface flow/corona, magnetic fields, interiors, and radial-UV rings. Motion obeys `motionEnabled`, reduced motion, and document visibility.
- [ ] **Step 8: Run focused and full renderer tests; expect PASS.**
- [ ] **Step 9: Commit**

```bash
git add -- components/space/AtlasStage.tsx components/space/AtlasCanvas.tsx tests/atlas-renderer.test.tsx
git commit -m "feat(space): rebuild atlas scientific renderer"
```

### Task 6: Primary-source hotspot media and Field Guide

**Files:**
- Create: `public/media/space/atlas/features/*.webp`
- Modify: `content/space/atlas-assets.ts`
- Modify: `content/space/atlas-asset-licenses.json`
- Modify: `content/space/atlas.ts`
- Modify: `components/space/FieldGuide.tsx`
- Modify: `tests/atlas-assets.test.ts`
- Modify: `tests/atlas-interface.test.tsx`

**Interfaces:**
- Each delivered feature image resolves under `public` and has one provenance record.
- Field Guide selects `selectedHotspot.media ?? world observation plate`.

- [ ] **Step 1: Write failing tests that require local media files and full credits for every authored `hotspot.media`. Add a Field Guide test for Himalaya and Great Red Spot media.**
- [ ] **Step 2: Run focused asset/interface tests; confirm failures on absent files and media UI.**
- [ ] **Step 3: Acquire and optimize primary-source images for the ten required first-pass features named in the spec. Record exact source, publisher, processing, dimensions, and evidence.**
- [ ] **Step 4: Render the selected feature image, caption, credit, and source link. Keep the world observation plate as the honest fallback.**

```tsx
const media = selectedHotspot?.media;
<img src={media?.path ?? world.assets.fallback} alt={media?.alt ?? `${world.name} scientific observation map`} />
{media ? <figcaption>{media.caption} · {media.credit}</figcaption> : null}
```

- [ ] **Step 5: Run focused tests, `npm test`, and inspect every delivered image for corruption or wrong crop.**
- [ ] **Step 6: Commit**

```bash
git add -- public/media/space/atlas/features content/space/atlas-assets.ts content/space/atlas-asset-licenses.json content/space/atlas.ts components/space/FieldGuide.tsx tests/atlas-assets.test.ts tests/atlas-interface.test.tsx
git commit -m "assets(space): add sourced atlas feature media"
```

### Task 7: Responsive scroll isolation and mobile alignment

**Files:**
- Modify: `components/space/WorldIndex.tsx`
- Modify: `components/space/atlas.module.css`
- Modify: `tests/atlas-interface.test.tsx`
- Modify: `e2e/atlas-of-worlds.spec.ts`

**Interfaces:**
- Mobile selection scrolls `.worldList` horizontally through `scrollTo`, never `HTMLElement.scrollIntoView`.
- `.worldName` and `.worldOrder` explicitly use `align-self: center` below 840px.

- [ ] **Step 1: Write a failing component test that spies on the picker container's `scrollTo` and proves world selection never calls `scrollIntoView`.**
- [ ] **Step 2: Add failing mobile e2e expectations for centred world names, independent horizontal rails, no document horizontal overflow, and stable document `scrollY` after selecting Neptune.**
- [ ] **Step 3: Replace `scrollIntoView` with container-relative centring.**

```ts
const nextLeft = activeButton.offsetLeft - (list.clientWidth - activeButton.offsetWidth) / 2;
list.scrollTo({ left: Math.max(0, nextLeft), behavior: reducedMotion ? "auto" : "smooth" });
```

- [ ] **Step 4: Apply explicit mobile alignment and feature/mode/lighting responsive rules.**
- [ ] **Step 5: Run focused component tests; defer browser e2e execution to Task 8 because the Product Design workflow uses the in-app Browser.**
- [ ] **Step 6: Commit**

```bash
git add -- components/space/WorldIndex.tsx components/space/atlas.module.css tests/atlas-interface.test.tsx e2e/atlas-of-worlds.spec.ts
git commit -m "fix(space): stabilize atlas mobile navigation"
```

### Task 8: Full browser, visual, and completion verification

**Files:**
- Modify: implementation files required by QA findings.
- Modify: `design-qa.md`
- Create: `.design-audit/atlas-of-worlds-refinement/*`

**Interfaces:**
- Desktop evidence: 1440×900 Sun, Mercury Temperature/Missions, Earth Surface, Moon Lighting, Jupiter Storms, Saturn Rings/Hexagon/Magnetosphere.
- Mobile evidence: 390×844 world picker, feature strip, mode rail, lighting, Field Guide media.

- [ ] **Step 1: Run fresh automated verification.**

```bash
npm test
npx tsc --noEmit
npm run build
```

Expected: all commands exit 0 with zero test failures and zero type/build errors.

- [ ] **Step 2: Use the in-app Browser at 1440×900 to exercise the desktop states. Inspect canvas appearance, control behavior, focus, motion off/on, and console errors.**
- [ ] **Step 3: Use the in-app Browser at 390×844 to verify alignment, horizontal scroll isolation, no clipped controls, and Field Guide media.**
- [ ] **Step 4: Capture the approved reference and implementation at the same viewport, combine them into comparison inputs, and record P0–P3 findings in `design-qa.md`.**
- [ ] **Step 5: Fix every P0/P1/P2 issue, repeat focused tests and same-viewport comparison, and set `final result: passed` only when evidence supports it.**
- [ ] **Step 6: Audit the refinement spec requirement by requirement against code, tests, local assets, browser states, console output, and visual comparisons. Resolve every missing or indirect item.**
- [ ] **Step 7: Run final fresh `npm test`, `npx tsc --noEmit`, and `npm run build`; verify the branch diff and worktree status.**
- [ ] **Step 8: Commit**

```bash
git add -- design-qa.md .design-audit/atlas-of-worlds-refinement components/space content/space lib/space tests e2e public/media/space/atlas/features
git commit -m "chore(space): verify atlas refinement"
```
