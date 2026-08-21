# Atlas of Worlds Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the separate Earth and Moon experiences with one production-grade, responsive Solar System instrument containing the Sun, eight planets, and Moon.

**Architecture:** A server-rendered Next.js route supplies a validated ten-world content collection to a focused client instrument. Typed renderer configuration drives one React Three Fiber stage; a single Zustand store coordinates world, mode, hotspot, lighting, theme, and comparison state. Official NASA/USGS textures are bundled locally and documented by a provenance manifest.

**Tech Stack:** Next.js 16.3 App Router, React 19, TypeScript 7, React Three Fiber 9, Three.js 0.185, Zustand 5, Zod 4, Vitest/Testing Library, Playwright.

**Spec:** `docs/superpowers/specs/2026-08-21-atlas-of-worlds-design.md`

## Global Constraints

- Route: `/exhibits/atlas-of-worlds`.
- Collection: Sun, Mercury, Venus, Earth, Moon, Mars, Jupiter, Saturn, Uranus, Neptune.
- Old Earth and Moon routes redirect to the unified route with `?world=` selection.
- The default desktop Moon state must faithfully reproduce the approved light cartography-studio mock.
- Every visible core control must have working behavior.
- Every scientific layer must be labelled Observed, Processed, Inferred, or Illustrative.
- No CSS/div/SVG substitute may stand in for a scientific world asset.
- The selected world is the only body whose optional texture bundle loads.
- Desktop is one viewport with no entry scroll jump; mobile retains the complete inspection journey.
- No completion claim until unit, component, end-to-end, build, browser, and design-QA evidence is current.

---

## File structure

- `content/space/atlas.ts`: validated ten-world content and all body-specific scientific modes/hotspots.
- `content/space/atlas-assets.ts`: local file paths and provenance records for every delivered texture.
- `lib/space/atlas-schema.ts`: Zod contracts and exported TypeScript types.
- `lib/space/atlas-query.ts`: world-query parsing and URL helpers.
- `lib/space/atlas-scale.ts`: true/normalized comparison scale calculation.
- `lib/space/atlas-store.ts`: one Zustand instrument store and command state.
- `components/space/AtlasExperience.tsx`: client composition and responsive state wiring.
- `components/space/AtlasCanvas.tsx`: lazy R3F stage and data-driven world materials.
- `components/space/WorldIndex.tsx`: accessible body selector.
- `components/space/FieldGuide.tsx`: persistent world/hotspot/evidence panel.
- `components/space/CommandDeck.tsx`: universal commands and adaptive mode rail.
- `components/space/CompareTray.tsx`: second-world and scale-policy controls.
- `components/space/AtlasFallback.tsx`: simplified real-map fallback.
- `components/space/atlas.module.css`: visual target, themes, and responsive layout.
- `app/exhibits/atlas-of-worlds/page.tsx`: server route, metadata, transcript, and source ledger.
- `app/exhibits/earth/page.tsx`, `app/exhibits/moon/page.tsx`: permanent server redirects.
- `components/museum/posters/AtlasOfWorldsPoster.tsx`: lobby poster using a real bundled texture.
- `content/exhibits.ts`: one Space registry entry.
- `public/media/space/atlas/*`: optimized local source assets.
- `content/space/atlas-asset-licenses.json`: source, credit, transformation, and usage ledger.
- `tests/atlas-*.test.ts(x)`: data, state, scaling, and interface behavior.
- `e2e/atlas-of-worlds.spec.ts`: desktop/mobile production journey.

### Task 1: Typed planetary collection and provenance

**Files:**
- Create: `lib/space/atlas-schema.ts`
- Create: `content/space/atlas-assets.ts`
- Create: `content/space/atlas.ts`
- Create: `content/space/atlas-asset-licenses.json`
- Test: `tests/atlas-content.test.ts`

**Interfaces:**
- Produces: `WorldId`, `WorldMode`, `WorldHotspot`, `PlanetaryWorld`, `AtlasCollection`, `atlas`, `getWorld(id)`, `getMode(world, modeId)`, `getVisibleHotspots(world, modeId)`.
- Produces renderer discriminants: `solid`, `earth`, `venus`, `gas`, `rings`, `sun`.

- [ ] **Step 1: Write the failing content test**

```ts
expect(atlas.worlds.map((world) => world.id)).toEqual([
  "sun", "mercury", "venus", "earth", "moon",
  "mars", "jupiter", "saturn", "uranus", "neptune",
]);
for (const world of atlas.worlds) {
  expect(world.modes.length).toBeGreaterThanOrEqual(5);
  expect(world.hotspots.length).toBeGreaterThanOrEqual(3);
  expect(world.sources.length).toBeGreaterThan(0);
  expect(world.renderer.kind).toMatch(/solid|earth|venus|gas|rings|sun/);
}
expect(getVisibleHotspots(getWorld("moon"), "missions").every(
  (hotspot) => hotspot.modeIds.includes("missions"),
)).toBe(true);
```

- [ ] **Step 2: Run `npm test -- tests/atlas-content.test.ts` and confirm failure because the atlas module does not exist.**
- [ ] **Step 3: Implement the schemas, ten content records, source records, renderer configuration, asset manifest, and filtering helpers.**
- [ ] **Step 4: Run the focused test and then `npm test`; expect zero failures.**
- [ ] **Step 5: Commit with `feat(space): add validated atlas collection`.**

### Task 2: Query, comparison, and instrument state

**Files:**
- Create: `lib/space/atlas-query.ts`
- Create: `lib/space/atlas-scale.ts`
- Create: `lib/space/atlas-store.ts`
- Test: `tests/atlas-query.test.ts`
- Test: `tests/atlas-scale.test.ts`
- Test: `tests/atlas-store.test.ts`

**Interfaces:**
- Produces: `parseWorldQuery(value): WorldId`, `worldQuery(id): string`.
- Produces: `comparisonRadii(primaryKm, secondaryKm, policy): [number, number]`.
- Produces: `createAtlasStore(initialWorld?)`, `AtlasState`, and monotonic `cameraCommand.sequence`.

- [ ] **Step 1: Write failing literal-behavior tests:** invalid query falls back to Moon; selecting Earth resets its mode to `surface`; selecting a hotspot records it as visited; changing mode clears an incompatible hotspot; compare rejects the primary body; true-scale radii preserve order and normalized radii are equal; zoom/reset commands increment the command sequence.
- [ ] **Step 2: Run the three focused files and verify the expected missing-module failures.**
- [ ] **Step 3: Implement pure query/scale helpers and a vanilla Zustand store with a React hook wrapper. Persist theme only after hydration; keep scientific selection URL-driven at the composition boundary.**
- [ ] **Step 4: Run the focused files and full unit suite; expect zero failures.**
- [ ] **Step 5: Commit with `feat(space): add atlas instrument state`.**

### Task 3: Official texture acquisition and derivatives

**Files:**
- Create: `public/media/space/atlas/*`
- Modify: `content/space/atlas-assets.ts`
- Modify: `content/space/atlas-asset-licenses.json`
- Test: `tests/atlas-assets.test.ts`

**Interfaces:**
- Asset records expose `color`, optional `bump`, optional `overlay`, `fallback`, pixel dimensions, `evidence`, `sourceUrl`, and `credit`.

- [ ] **Step 1: Write a failing asset test that resolves every manifest path under `public`, verifies non-zero size, validates image headers, and requires source URL, credit, processing note, and delivered dimensions.**
- [ ] **Step 2: Run the focused test and verify it fails on absent atlas assets.**
- [ ] **Step 3: Download authoritative NASA/USGS source files, then create 4K desktop and 2K fallback derivatives using a deterministic image-processing command. Preserve aspect ratio; inspect every derivative for seams, corruption, and wrong projection.**
- [ ] **Step 4: Update the manifest with exact delivered dimensions and transformations.**
- [ ] **Step 5: Run the focused asset test and full suite; expect zero failures.**
- [ ] **Step 6: Commit with `assets(space): add sourced planetary texture set`.**

### Task 4: Instrument shell and adaptive controls

**Files:**
- Create: `components/space/AtlasExperience.tsx`
- Create: `components/space/WorldIndex.tsx`
- Create: `components/space/FieldGuide.tsx`
- Create: `components/space/CommandDeck.tsx`
- Create: `components/space/CompareTray.tsx`
- Create: `components/space/atlas.module.css`
- Test: `tests/atlas-interface.test.tsx`

**Interfaces:**
- `AtlasExperience({ initialWorld }: { initialWorld: WorldId })` owns the store provider.
- Child controls consume typed selector props and emit IDs/commands; they do not import the global store directly.

- [ ] **Step 1: Write failing Testing Library journeys that select Earth, verify Earth-only `Night lights`; select Moon, verify it disappears and `Water & ice` appears; select a hotspot and verify the Field Guide updates without a dialog; toggle dark theme; open Compare and select Mars; invoke zoom/reset controls; use arrow-key navigation in the World Index.**
- [ ] **Step 2: Run the focused interface test and verify it fails because the shell is absent.**
- [ ] **Step 3: Implement semantic controls, selected/hover/focus states, live announcements, persistent Field Guide, responsive drawers, theme tokens, and the visual hierarchy measured from the approved mock. Use Lucide icons with visible labels for primary tools.**
- [ ] **Step 4: Run the focused component test and full suite; expect zero failures.**
- [ ] **Step 5: Commit with `feat(space): build atlas instrument shell`.**

### Task 5: Data-driven 3D renderer

**Files:**
- Create: `components/space/AtlasCanvas.tsx`
- Create: `components/space/AtlasFallback.tsx`
- Modify: `components/space/AtlasExperience.tsx`
- Modify: `components/space/atlas.module.css`
- Test: `tests/atlas-renderer.test.tsx`

**Interfaces:**
- `AtlasCanvas` consumes selected world, mode, hotspot, light vector, compare state, reduced-motion flag, and camera command.
- `AtlasFallback` consumes the same scientific selection and uses the real delivered fallback map.

- [ ] **Step 1: Write failing integration tests for the loading state, WebGL-unavailable fallback, texture-error fallback, renderer accessibility description, and mode-to-renderer mapping. Mock only the browser WebGL boundary; keep the actual instrument and fallback components real.**
- [ ] **Step 2: Run the focused test and verify the missing renderer failure.**
- [ ] **Step 3: Implement lazy R3F rendering with solid, Earth, Venus, gas/ring, and Sun material paths; small hotspot markers; atmosphere and cloud shells; ring geometry; bump mapping; interior clipped shells; compare layout; authored camera bounds; keyboard camera commands; texture-error recovery; tab-visibility pausing; and capped DPR.**
- [ ] **Step 4: Run focused and full tests; expect zero failures.**
- [ ] **Step 5: Commit with `feat(space): render interactive scientific worlds`.**

### Task 6: Unified route, lobby, redirects, and transcript

**Files:**
- Create: `app/exhibits/atlas-of-worlds/page.tsx`
- Modify: `app/exhibits/earth/page.tsx`
- Modify: `app/exhibits/moon/page.tsx`
- Create: `components/museum/posters/AtlasOfWorldsPoster.tsx`
- Modify: `components/museum/posters/ExhibitPoster.tsx`
- Modify: `content/exhibits.ts`
- Modify: `tests/exhibits-registry.test.ts`
- Test: `tests/atlas-route.test.tsx`

**Interfaces:**
- Server page reads `searchParams: Promise<{ world?: string | string[] }>` and passes a validated `initialWorld` to `AtlasExperience`.

- [ ] **Step 1: Update the registry expectation first so featured slugs contain one `atlas-of-worlds` entry and no `earth` or `moon` entries; add route tests for valid/invalid initial world and source/transcript coverage.**
- [ ] **Step 2: Run the focused tests and verify they fail against the duplicate registry.**
- [ ] **Step 3: Build the route and real-texture lobby poster, update the registry, add permanent redirects, and render a complete semantic transcript/source ledger below the instrument.**
- [ ] **Step 4: Run focused and full tests; expect zero failures.**
- [ ] **Step 5: Commit with `feat(space): publish unified Atlas of Worlds exhibit`.**

### Task 7: Production journey and responsive behavior

**Files:**
- Create: `e2e/atlas-of-worlds.spec.ts`
- Modify: `components/space/atlas.module.css`
- Modify: components exposed by end-to-end failures.

**Interfaces:**
- Stable test hooks: `data-testid="atlas-stage"`, semantic labels for World Index, Field Guide, modes, theme, compare, and camera tools.

- [ ] **Step 1: Write the failing Playwright journey for 1440×900: open Moon, switch Earth, activate Night lights, select a hotspot, compare Mars, change scale policy, toggle dark mode, close compare, and reset. Add 390×844 checks for world picker, mode rail, field-guide sheet, and absence of horizontal overflow.**
- [ ] **Step 2: Build the production app and run only the new end-to-end file; confirm it fails on unfinished behavior or layout.**
- [ ] **Step 3: Fix behavior and responsive P0/P1/P2 issues without weakening assertions.**
- [ ] **Step 4: Rebuild and run the end-to-end file plus the existing e2e suite; expect zero failures.**
- [ ] **Step 5: Commit with `test(space): cover atlas production journey`.**

### Task 8: Browser visual QA and completion audit

**Files:**
- Modify: `design-qa.md`
- Create: `.design-audit/atlas-of-worlds/*` screenshots and comparisons.
- Modify: implementation files required by QA findings.

**Interfaces:**
- Final default comparison state: Moon, Surface mode, light theme, 1440×900.

- [ ] **Step 1: Start the Next.js dev server and open the unified route in the in-app Browser. Exercise the core journey and inspect the console.**
- [ ] **Step 2: Capture the approved mock and implementation at the same viewport/state, place them side-by-side in one comparison image, and record P0–P3 findings in `design-qa.md`.**
- [ ] **Step 3: Fix all P0/P1/P2 findings, then repeat capture and comparison until `design-qa.md` says `final result: passed`.**
- [ ] **Step 4: Run fresh `npm test`, `npx tsc --noEmit`, `npm run build`, and `npm run test:e2e -- e2e/atlas-of-worlds.spec.ts`; record exact results.**
- [ ] **Step 5: Audit every requirement in the design spec against current files, rendered behavior, tests, assets, and browser evidence. Resolve every missing or weak item.**
- [ ] **Step 6: Commit with `chore(space): complete atlas production verification`.**

