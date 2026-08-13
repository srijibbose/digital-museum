# Living Atlas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and locally run a polished, responsive digital-museum shell with a complete six-chapter immersive human-anatomy exhibit at `/exhibits/living-atlas`.

**Architecture:** A static-first Next.js App Router application serves the museum lobby and exhibit metadata. The exhibit is a client-side state machine whose UI, content, WebGL scene, and semantic fallback share one typed chapter model. The anatomical figure is assembled procedurally from Three.js geometry so the prototype ships with no paid or ambiguously licensed external assets.

**Tech Stack:** Next.js 15+, React 19, TypeScript, CSS modules/global CSS, Three.js, React Three Fiber, Drei, GSAP, Zustand, Zod, Lucide React, Vitest, Testing Library, Playwright.

## Global Constraints

- General-curiosity experience for teens and adults; no diagnosis, treatment, symptom guidance, or personalised health advice.
- Six chapters: Surface, Signal, Breath, Pulse, Fuel & Motion, Together.
- The route must work with pointer, touch, keyboard, reduced motion, simplified 2D mode, and a text transcript.
- No paid services, stock assets, fonts, models, APIs, or accounts are required.
- Initial page content must be server-rendered; WebGL loads only after the visitor enters the exhibit.
- Use semantic HTML equivalents for every canvas hotspot and action.
- Keep the museum UI minimal: charcoal gallery, warm ivory text, restrained system colours, editorial serif + legible sans.
- Tests and build verification must succeed before the local server is handed off.

---

## File Structure

```text
app/
  globals.css                     global tokens, layout, responsive and reduced-motion rules
  layout.tsx                      metadata, local font stacks, global shell
  page.tsx                        museum lobby and exhibit entry card
  exhibits/living-atlas/page.tsx server-rendered exhibit entry and metadata
components/
  museum/MuseumHeader.tsx         minimal brand/navigation chrome
  living-atlas/
    LivingAtlasExperience.tsx     entry gate and experience composition
    ExperienceHUD.tsx             progress, sound/motion/view controls
    ChapterPanel.tsx              chapter narration and actions
    ExploreDrawer.tsx             semantic hotspot explorer
    AnatomyCanvas.tsx             R3F canvas, scene, camera and procedural body
    AnatomyFigure.tsx             procedural body, organs, systems and animations
    AnatomyFallback.tsx           CSS/SVG-style simplified visual
    Epilogue.tsx                  completion state and return actions
content/living-atlas.ts           typed chapter/hotspot copy
lib/living-atlas/schema.ts        Zod schemas and exported types
lib/living-atlas/store.ts         Zustand state machine
lib/living-atlas/analytics.ts     privacy-safe local event adapter
tests/living-atlas-content.test.ts schema/content completeness
tests/living-atlas-store.test.ts  navigation and preference state
tests/living-atlas-ui.test.tsx    accessible UI interactions
e2e/living-atlas.spec.ts          complete browser flow
```

### Task 1: Project scaffold and content contract

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `vitest.config.ts`, `vitest.setup.ts`
- Create: `app/layout.tsx`, `app/globals.css`
- Create: `lib/living-atlas/schema.ts`, `content/living-atlas.ts`
- Test: `tests/living-atlas-content.test.ts`

**Interfaces:**
- Produces: `ChapterId`, `AnatomyChapter`, `OrganHotspot`, `livingAtlasChapters`, `livingAtlasHotspots`.
- Consumers: all UI, scene, store, and transcript components.

- [ ] **Step 1: Add the Next.js and test scaffold** with scripts `dev`, `build`, `start`, `test`, `test:watch`, and `test:e2e`; configure strict TypeScript and jsdom Vitest.
- [ ] **Step 2: Write the failing content test** asserting six unique chapter IDs, each chapter having a hook, takeaway, interaction label, fallback description, at least one system ID, and valid hotspot references.
- [ ] **Step 3: Run `pnpm test tests/living-atlas-content.test.ts`** and verify the missing schema/content failure.
- [ ] **Step 4: Implement the Zod schemas and all six chapters** with concise medically conservative copy and detailed hotspot descriptions for skin, brain, lungs, heart, stomach/liver, skeleton, and muscles.
- [ ] **Step 5: Run the content test** and verify it passes.

### Task 2: State machine and privacy-safe telemetry

**Files:**
- Create: `lib/living-atlas/store.ts`
- Create: `lib/living-atlas/analytics.ts`
- Test: `tests/living-atlas-store.test.ts`

**Interfaces:**
- Consumes: `ChapterId`, ordered chapter data.
- Produces: `useLivingAtlasStore`, `advanceChapter()`, `previousChapter()`, `setChapter(id)`, `selectHotspot(id|null)`, `setReducedMotion(boolean)`, `setSimplifiedView(boolean)`, and `trackAtlasEvent()`.

- [ ] **Step 1: Write failing store tests** for first/last chapter bounds, direct navigation, hotspot selection, preference toggles, reset, and completion state.
- [ ] **Step 2: Run the store test** and verify imports fail.
- [ ] **Step 3: Implement the Zustand store** with deterministic ordered navigation and no persisted health-interest data.
- [ ] **Step 4: Implement an analytics adapter** that emits only aggregate event names to `window.dispatchEvent` and contains no identifiers or payload fields for selected organs.
- [ ] **Step 5: Run store/content tests** and verify both pass.

### Task 3: Museum lobby and exhibit threshold

**Files:**
- Create: `components/museum/MuseumHeader.tsx`
- Create: `app/page.tsx`
- Create: `app/exhibits/living-atlas/page.tsx`
- Create: `components/living-atlas/LivingAtlasExperience.tsx`
- Create: `components/living-atlas/AnatomyFallback.tsx`
- Test: `tests/living-atlas-ui.test.tsx`

**Interfaces:**
- Consumes: `livingAtlasChapters`, `useLivingAtlasStore`.
- Produces: lobby CTA, exhibit `Begin` gate, static poster, simplified-view shell.

- [ ] **Step 1: Write failing UI tests** for accessible exhibit title, `Begin the journey`, simplified-view activation, and the first chapter heading after entry.
- [ ] **Step 2: Run the UI test** and verify missing components fail.
- [ ] **Step 3: Build the museum lobby** with a hero manifesto, single flagship exhibit card, curatorial copy, and footer; link directly to `/exhibits/living-atlas`.
- [ ] **Step 4: Build the threshold state** with a full-viewport atmospheric poster, runtime WebGL capability check, enter button, time estimate, non-medical context, and simplified-view option.
- [ ] **Step 5: Implement the fallback visual** as a responsive layered human silhouette with system-specific CSS glows and semantic text.
- [ ] **Step 6: Run the UI test** and verify entry/fallback behavior passes.

### Task 4: Procedural anatomy scene

**Files:**
- Create: `components/living-atlas/AnatomyCanvas.tsx`
- Create: `components/living-atlas/AnatomyFigure.tsx`

**Interfaces:**
- Consumes: current chapter ID, selected hotspot ID, reduced-motion preference.
- Produces: a rotatable gender-neutral figure, animated system layers, labelled visual focus, and pointer-selectable organ hit areas.

- [ ] **Step 1: Build the R3F scene foundation** with a transparent antialiased canvas, adaptive DPR, fog, cinematic key/rim lighting, constrained orbit controls, contact shadow, and graceful WebGL error callback.
- [ ] **Step 2: Assemble the porcelain exterior** from capsule/sphere/cylinder geometry with correct overall proportions, mirrored limbs, a calm breathing animation, and an orientation-preserving translucent state.
- [ ] **Step 3: Add internal system groups**: brain/spinal signal path, paired lungs and diaphragm, heart/vessel curves, digestive forms, skeleton lines/joints, and muscle bands.
- [ ] **Step 4: Map chapter state to materials and visibility** so each reveal isolates one teaching relationship while retaining a ghosted body silhouette.
- [ ] **Step 5: Add meaningful motion**: travelling nerve signal, lung expansion, heart pulse, flow particles, and coordinated whole-body finale; freeze or simplify all loops in reduced-motion mode.
- [ ] **Step 6: Add large invisible hit areas** that call `selectHotspot()` for the same IDs exposed by the semantic explorer.

### Task 5: Guided interaction, HUD, and exploration drawer

**Files:**
- Create: `components/living-atlas/ExperienceHUD.tsx`
- Create: `components/living-atlas/ChapterPanel.tsx`
- Create: `components/living-atlas/ExploreDrawer.tsx`
- Create: `components/living-atlas/Epilogue.tsx`
- Modify: `components/living-atlas/LivingAtlasExperience.tsx`
- Modify: `tests/living-atlas-ui.test.tsx`

**Interfaces:**
- Consumes: store actions/state and chapter/hotspot content.
- Produces: chapter navigation, progress, keyboard shortcuts, breathing/pulse controls, motion/view toggles, semantic hotspot selection, and completion epilogue.

- [ ] **Step 1: Extend failing UI tests** for next/previous navigation, progress label, hotspot drawer open/close, reduced-motion toggle, simplified-view toggle, and epilogue completion.
- [ ] **Step 2: Run the UI test** and verify the new assertions fail.
- [ ] **Step 3: Build the HUD** with brand return, `01 / 06` progress, motion/view controls, and discreet chapter rail.
- [ ] **Step 4: Build the chapter panel** with question, concise explanation, takeaway, previous/next buttons, and a chapter-specific interaction affordance.
- [ ] **Step 5: Build the explore drawer** as a focus-managed dialog and permanent semantic hotspot list; use large touch targets and return focus to the invoking control.
- [ ] **Step 6: Add wheel/scroll, arrow-key, PageUp/PageDown, and button navigation** with input debouncing and no scroll trapping outside the experience.
- [ ] **Step 7: Add the epilogue** with all systems lit, memorable closing line, restart action, and return-to-museum link.
- [ ] **Step 8: Run the UI test** and verify all interactions pass.

### Task 6: Visual polish, responsive behavior, and accessibility

**Files:**
- Modify: `app/globals.css`
- Modify: all `components/living-atlas/*.tsx`

**Interfaces:**
- Consumes: stable component markup and store preferences.
- Produces: desktop/mobile layouts, theme tokens, transitions, focus states, and motion fallbacks.

- [ ] **Step 1: Implement the gallery design system**: warm-black backgrounds, ivory copy, editorial display typography, fine borders, glass panels, grain/noise through CSS gradients, and system accent tokens.
- [ ] **Step 2: Create responsive compositions**: side narration on desktop, bottom editorial sheet on mobile, thumb-reachable controls, safe-area padding, and canvas framing for 360-1440 px widths.
- [ ] **Step 3: Add restrained choreography** with CSS and GSAP for threshold exit, chapter copy swaps, HUD entrance, and system colour transitions.
- [ ] **Step 4: Complete accessibility** with skip link, live chapter announcements, dialog labels, visible focus, 44 px targets, colour-independent labels, and full `prefers-reduced-motion` overrides.
- [ ] **Step 5: Add transcript and sources sections** to the exhibit route, including a concise general-information disclaimer and public source links.

### Task 7: Build, browser verification, and localhost handoff

**Files:**
- Create: `e2e/living-atlas.spec.ts`, `playwright.config.ts`
- Modify: implementation files only for defects found during verification.

**Interfaces:**
- Consumes: complete application.
- Produces: passing test/build evidence, verified screenshots, and a running local URL.

- [ ] **Step 1: Write the Playwright flow** covering lobby -> exhibit -> begin -> all six chapters -> hotspot -> simplified view -> epilogue -> restart at desktop and mobile widths.
- [ ] **Step 2: Run `pnpm test`** and fix every unit/component failure.
- [ ] **Step 3: Run `pnpm build`** and fix all TypeScript, server/client boundary, and static-generation failures.
- [ ] **Step 4: Start the production server** on an available localhost port.
- [ ] **Step 5: Run Playwright and visual browser review** at 1440x900 and 390x844; inspect hierarchy, clipping, canvas framing, chapter navigation, fallback, keyboard flow, and reduced motion.
- [ ] **Step 6: Re-run `pnpm test` and `pnpm build`** after visual fixes.
- [ ] **Step 7: Report the verified localhost URL** and leave the server running.
