# Mars Deep Time Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a continuous, evidence-qualified Mars time machine inside Atlas of Worlds, from 4.1 billion years ago to the present.

**Architecture:** A pure TypeScript chronology model supplies bounded interpolated visual parameters and authoritative copy. Zustand owns the durable date and present-reference state; a focused React control owns transient playback. React Three Fiber renders surface-age, water, ice, haze, and atmospheric shells around the existing Mars globe without replacing the camera or scene.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Zustand, React Three Fiber, Three.js, CSS Modules, Vitest/Testing Library, Playwright.

**Spec:** `docs/superpowers/specs/2026-08-22-mars-deep-time-design.md`

## Global Constraints

- Work on the existing `earth_moon` branch and preserve unrelated user changes.
- Follow `docs/premium-exhibit-standard.md` as the acceptance contract.
- No new runtime dependency and no runtime network requests.
- Viking/MOLA remain the observed base; water, ice, haze, and atmosphere are labelled constrained reconstructions.
- Camera, orientation, zoom, selected geography, and the globe instance persist while the date changes.
- No life, vegetation, random spectacle, exact ancient pressure, or exact global shoreline claim.
- Reduced-motion mode disables autoplay and animated anchor travel but preserves direct scrubbing.
- Use the Next.js 16 local documentation under `node_modules/next/dist/docs/` rather than historical API assumptions.

---

### Task 1: Chronology and interpolation model

**Files:**
- Create: `lib/space/mars-deep-time.ts`
- Create: `tests/mars-deep-time.test.ts`

**Interfaces:**
- Produces: `MARS_DEEP_TIME_MAX_MYA`, `MARS_DEEP_TIME_ENTRY_MYA`, `MARS_DEEP_TIME_ANCHORS`, `clampMarsTime`, `formatMarsTime`, `marsTimeToSlider`, `sliderToMarsTime`, `resolveMarsDeepTimeState`, and the `MarsDeepTimeState` type.
- Consumers: store, timeline UI, renderer, Field Guide, and accessible transcript.

- [ ] **Step 1: Write failing model tests**

  Test descending authored anchors, exact present/ancient labels, reversible slider conversion, clamping, exact-anchor metadata, and bounded continuous interpolation at 3.65 Ga.

- [ ] **Step 2: Run the model test and verify RED**

  Run:
  `node.exe node_modules/vitest/vitest.mjs run tests/mars-deep-time.test.ts`

  Expected: FAIL because `@/lib/space/mars-deep-time` does not exist.

- [ ] **Step 3: Implement the pure model**

  Define six immutable anchor states at 4100, 3800, 3500, 3000, 1000, and 0 Ma. Each state contains period/title/description/evidence/confidence/sourceId plus numeric `atmosphere`, `water`, `waterLine`, `ice`, `haze`, and `oxidation` values in `[0,1]`. Interpolate numeric fields linearly and use the nearest anchor for prose while reporting whether the value is authored or interpolated.

- [ ] **Step 4: Run the focused test and verify GREEN**

  Expected: all model tests pass with no warnings.

### Task 2: Durable Atlas state

**Files:**
- Modify: `lib/space/atlas-store.ts`
- Modify: `tests/atlas-store.test.ts`

**Interfaces:**
- Consumes: `MARS_DEEP_TIME_ENTRY_MYA` and `clampMarsTime`.
- Produces on `AtlasState`: `marsTimeMya: number`, `marsPresentPreview: boolean`, `setMarsTimeMya(value: number)`, and `setMarsPresentPreview(value: boolean)`.

- [ ] **Step 1: Write failing store tests**

  Assert that Mars begins at the authored entry date, setter input is clamped to `[0,4100]`, preview can be enabled, and switching worlds clears preview without losing the visitor’s chosen date.

- [ ] **Step 2: Run `tests/atlas-store.test.ts` and verify RED**

  Expected: type/test failure because the new state and actions do not exist.

- [ ] **Step 3: Implement the minimal store state and actions**

  Keep playback transient in the UI. Do not add animation frames or renderer data to Zustand.

- [ ] **Step 4: Run the store and model tests and verify GREEN**

### Task 3: Scientific mode, source records, and renderer contract

**Files:**
- Modify: `lib/space/atlas-schema.ts`
- Modify: `content/space/atlas.ts`
- Modify: `components/space/AtlasStage.tsx`
- Modify: `tests/atlas-content.test.ts`
- Modify: `tests/atlas-renderer.test.tsx`

**Interfaces:**
- Adds `deep-time` to the mode-effect schema.
- Adds `deepTime: boolean` to `RenderLayers`.
- Replaces Mars `water-history` with `deep-time` and adds USGS global map, NASA Perseverance, NASA MAVEN, and NASA MOLA/SVS sources to Mars.

- [ ] **Step 1: Write failing content and layer tests**

  Assert that Mars exposes `Deep time`, its evidence is `inferred`, Jezero and Valles Marineris are visible there, the new authoritative sources resolve, and `resolveRenderLayers` sets `deepTime: true` only for that mode.

- [ ] **Step 2: Run the focused tests and verify RED**

- [ ] **Step 3: Extend the schema/content/layer mapping**

  The visible-change copy must state that observed terrain is retained while water and atmosphere are constrained reconstructions. `lighting` remains `natural-survey`; `motion` remains `none` because time playback is owned by the signature control.

- [ ] **Step 4: Run the focused tests and verify GREEN**

### Task 4: Premium time-machine control

**Files:**
- Create: `components/space/MarsTimeMachine.tsx`
- Modify: `components/space/CommandDeck.tsx`
- Modify: `components/space/AtlasExperience.tsx`
- Create: `tests/mars-time-machine.test.tsx`
- Modify: `tests/atlas-interface.test.tsx`

**Interfaces:**
- `MarsTimeMachine` consumes `value`, `presentPreview`, `reducedMotion`, `onChange`, and `onPresentPreviewChange`.
- `CommandDeck` receives and forwards those Mars-specific values only when `world.id === "mars" && activeModeId === "deep-time"`.
- `AtlasExperience` subscribes to the new store fields and exposes `data-mars-time`/`data-mars-preview` on the stage for behavioral verification.

- [ ] **Step 1: Write failing UI tests**

  Assert the Deep Time tab reveals an accessible range named `Mars deep time`, anchor buttons change the value, slider keyboard input updates the stage, the present-reference button previews today and restores the chosen date, autoplay can pause, and reduced motion disables autoplay without disabling the range.

- [ ] **Step 2: Run the two UI tests and verify RED**

- [ ] **Step 3: Implement direct scrub and anchor travel**

  Use native range semantics. Use `requestAnimationFrame` only for click-to-anchor and 18-second autoplay, cancel on unmount/new interaction, and bypass animation when reduced motion is true. Throttle polite announcements to authored-anchor changes rather than every range input.

- [ ] **Step 4: Implement present reference**

  Pointer hold previews present and restores on release/leave/cancel. Keyboard/tap click toggles the preview. `aria-pressed` always reflects the visual state.

- [ ] **Step 5: Run the UI tests and verify GREEN**

### Task 5: Evidence-constrained WebGL layers

**Files:**
- Create: `components/space/MarsDeepTimeWorld.tsx`
- Modify: `components/space/AtlasCanvas.tsx`
- Modify: `components/space/AtlasStage.tsx`
- Modify: `tests/atlas-renderer.test.tsx`

**Interfaces:**
- `MarsDeepTimeWorld` consumes the already loaded colour/height textures, radius, resolved `MarsDeepTimeState`, and reduced-motion/motion flags.
- `AtlasCanvasRuntimeProps` adds `marsTimeMya` and `marsPresentPreview`.

- [ ] **Step 1: Extend the failing renderer contract test**

  Assert that the stage description for Deep Time includes the selected date and identifies the view as a reconstruction; assert that standard Mars modes remain unchanged.

- [ ] **Step 2: Run the renderer test and verify RED**

- [ ] **Step 3: Implement the visual layers**

  Keep the existing Mars surface mesh. Add a subtle time-dependent material tint, topography-guided translucent water shell, polar/mid-latitude ice shell, slow haze shell, and back-face atmospheric limb. Update uniforms rather than replacing meshes. No random large-scale events.

- [ ] **Step 4: Preserve lifecycle and continuity**

  Ensure the same `FocusSpinGroup`, camera, and orbit controls wrap the Deep Time layers. Haze time advances only when allowed; renderer resources are owned by React Three Fiber and no document-level listener is added.

- [ ] **Step 5: Run renderer/model tests and verify GREEN**

### Task 6: Time-aware Field Guide and non-WebGL edition

**Files:**
- Modify: `components/space/FieldGuide.tsx`
- Modify: `components/space/AtlasFallback.tsx`
- Modify: `app/exhibits/atlas-of-worlds/page.tsx`
- Modify: `tests/atlas-interface.test.tsx`
- Modify: `tests/atlas-route.test.tsx`

**Interfaces:**
- `FieldGuide` receives an optional resolved `deepTimeState`.
- The server transcript imports immutable anchor content from the pure model.

- [ ] **Step 1: Write failing accessible-content tests**

  Assert that Deep Time updates the Field Guide with date, evidence basis, reconstruction qualifier, and source; assert the server-rendered text edition includes all six Mars anchors.

- [ ] **Step 2: Run the focused tests and verify RED**

- [ ] **Step 3: Implement Field Guide and fallback content**

  Feature selection remains authoritative over the time summary. Without a selected hotspot, the current anchor/interpolation state replaces the generic physical table. The fallback retains the sourced map and explains that the dynamic reconstruction requires WebGL.

- [ ] **Step 4: Run the focused tests and verify GREEN**

### Task 7: Responsive visual system

**Files:**
- Modify: `components/space/atlas.module.css`
- Modify: `tests/mars-time-machine.test.tsx`

**Interfaces:**
- Adds locally scoped timeline, tick, control, evidence, playing, and deep-time stage-state classes.

- [ ] **Step 1: Add failing structural assertions for labels and touch-target hooks**

  Assert the control exposes anchor list, live date, evidence statement, and state attributes used by CSS. CSS geometry is verified in Playwright rather than by brittle stylesheet-string tests.

- [ ] **Step 2: Implement desktop, tablet, mobile, dark-theme, focus-visible, and reduced-motion styles**

  Desktop preserves globe visibility by easing its size/vertical position only while Deep Time is active. Mobile uses a full-width control with horizontally scrollable anchors and no page-level horizontal overflow.

- [ ] **Step 3: Run UI tests and the complete Vitest suite**

### Task 8: Browser journey, QA, and release evidence

**Files:**
- Modify: `e2e/atlas-of-worlds.spec.ts`
- Create: `.design-audit/atlas-of-worlds-mars-deep-time/` screenshots and findings ledger
- Modify if required by findings: files from Tasks 1–7

**Interfaces:**
- Produces final automated and visual verification evidence.

- [ ] **Step 1: Add the failing Mars e2e journey**

  Desktop journey: open Mars, enter Deep Time, drag/click through two dates, hold Present reference, orbit/zoom, and assert date/orientation continuity with no console errors or external requests. Mobile journey: repeat the core interaction at 390×844 and assert no horizontal overflow.

- [ ] **Step 2: Run the e2e test and verify RED, then implement any missing behavior until GREEN**

- [ ] **Step 3: Run fresh automated verification**

  Run the full Vitest suite, TypeScript check, production build, and complete Playwright Atlas spec. Record exact pass counts and exit codes.

- [ ] **Step 4: Perform representative visual QA**

  Inspect and capture at minimum: 1440×900 light, 1440×900 dark, 1024×768, 390×844 light, 390×844 dark, 3.7 Ga, present, anchor transition, present-reference hold, reduced motion, and WebGL fallback. Check hierarchy, legibility, globe/overlay quality, control overlap, focus, overflow, and console output.

- [ ] **Step 5: Fix root causes and repeat QA**

  Continue until no known high- or medium-severity visual, interaction, accessibility, content, or credibility defect remains.

- [ ] **Step 6: Review React and Next.js quality**

  Apply the Vercel React best-practices checklist: no unnecessary client boundary expansion, no new bundle-heavy dependency, stable effects/listeners, cancelled animation frames, no derived-state effect, and no avoidable global event duplication.

- [ ] **Step 7: Audit the spec requirement by requirement**

  Mark each acceptance criterion as proven, contradicted, or missing using the current tests, build, browser output, screenshots, source ledger, and git diff. Do not call the goal complete while any criterion lacks direct evidence.
