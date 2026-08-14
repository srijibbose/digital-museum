# Thirteen Minutes — Immersive Descent Redesign

**Status:** Visual direction approved by the user on 2026-08-14  
**Selected direction:** Option 1, “Descent Window”  
**Route:** `/exhibits/thirteen-minutes`  
**Experience length:** 10–15 minutes for a curious first-time visitor

## 1. Purpose

The current exhibit is visually restrained and readable, but it behaves primarily as a sequence of text panels with a telemetry header. The redesign must turn the Apollo 11 descent into a spatial systems story: visitors should see Eagle descend, inspect the craft, understand where it is going, feel the computer alarm interrupt the sequence, compare planned and actual landing paths, and watch the landing site resolve from a distant ellipse into dangerous terrain.

The experience is still a documentary, not a piloting game. Interaction reveals evidence and relationships; it does not ask visitors to “win,” invent alternate history, or make choices the crew did not make.

## 2. Visual target

The selected mock is the first generated direction from the 2026-08-14 ideation set. Its defining composition is:

- a full-viewport lunar environment rather than a page background;
- a large, inspectable, low-poly Lunar Module as the central visual object;
- mission telemetry anchored to the viewport perimeter;
- a trajectory line and landing ellipse drawn in the world;
- a minimal phase rail along one edge;
- transcript lines appearing as short timed captions rather than paragraphs;
- the established Loupe palette: blue-black, warm amber, aged ivory, muted sage, and lunar gray;
- no cards, dashboard grid, glossy science-fiction styling, lens flare, or ornamental glow.

The page should feel like a museum installation built around one moving object. Every visual element must explain the descent, the guidance system, the landing-site problem, or the dwindling margin.

## 3. Story structure

The route remains a single continuous exhibit, but the six telemetry beats become six authored scene states inside one persistent 3D world.

### Prologue — “The machine above the Moon”

- Begin with the selected title treatment over a quiet orbital view of Eagle.
- The visitor can drag gently to inspect the spacecraft before entering the descent.
- A 20–30 second visual primer identifies the ascent stage, descent stage, engine, landing radar, and computer without showing a paragraph.
- One public-domain NASA archival image may appear as a restrained full-bleed transition, clearly labeled with its mission image identifier and source.

### 1. Approach — engine ignition

- The camera pulls from inspection view into a three-quarter descent view.
- The descent engine ignites with a restrained emissive plume; the surface begins far below.
- Mission time, altitude, and the inferred time margin enter as perimeter instruments.
- The visitor can hold an “inspect Eagle” control to pause the automatic camera and orbit the model.

### 2. Course check — landing long

- The planned landing ellipse and actual predicted trajectory appear on the terrain.
- A hold-to-compare interaction alternates between the planned site and the running-long trajectory.
- West Crater and the boulder field are introduced spatially, with labels pinned to terrain rather than floating UI cards.
- The visitor should understand the navigation error before reading its explanation.

### 3. Program alarm — 1202

- Motion briefly tightens and the world loses non-essential annotations.
- The 1202 code occupies one decisive area of the frame.
- A compact computer-load visualization shows radar data overwhelming available processing time while guidance and engine-control jobs remain scheduled.
- Hover/focus reveals only three concepts: overloaded input, priority restart, essential work retained.
- The animation must avoid flashing; urgency comes from timing, hierarchy, and soundless visual interruption.

### 4. The go call — twenty-seven seconds

- The normal descent continues while a 27-second decision interval is compressed into a visible timeline.
- Short transcript captions move between Eagle and Houston, labeled by speaker.
- Visitors may scrub the interval to see when the alarm appears, when guidance evaluates it, and when the “Go” call returns.
- The interaction explains that the call was based on computer behavior, not guesswork.

### 5. Manual control — terrain becomes the problem

- The camera lowers close to the lunar surface; rocks and crater relief grow materially larger.
- The predicted path bends as Armstrong selects P66.
- Dragging the landing reticle reveals safe and unsafe terrain without changing the historical trajectory.
- A planned-versus-actual path comparison makes the overflight of West Crater legible.
- Touch and keyboard equivalents provide the same comparison.

### 6. Touchdown — contact light

- The lander descends into its own shadow, surface dust moves outward, and the landing legs settle.
- Telemetry resolves to zero altitude and the corrected postflight margin of approximately 45 seconds.
- “The Eagle has landed” is held on screen long enough to breathe; the scene becomes nearly still.
- The visitor may orbit the landed model and toggle the full descent trajectory once the quote clears.

### Epilogue — graceful degradation

- The lander remains in the world while the computer-load visualization returns in calm form.
- One direct manipulation lets visitors overload the non-essential job lane and watch the scheduler preserve guidance and engine control.
- The takeaway text is reduced to the existing final statement, supported by the visualization rather than replacing it.
- A second archival NASA image may close the exhibit, followed by the transcript placeholder and related exhibits.

## 4. Interaction model

Scrolling remains the primary pacing mechanism, but it controls a persistent scene rather than advancing isolated text screens.

- Each beat occupies enough scroll distance for a 60–120 second dwell, including optional inspection.
- Scroll progress drives camera position, lander altitude, terrain scale, trajectory reveal, and instrument interpolation.
- The phase rail, previous/next controls, keyboard shortcuts, and direct beat links all seek the same timeline state.
- Pointer drag or one-finger drag orbits only while the inspect control is active, preventing accidental scroll capture.
- Hold interactions have click/tap toggle equivalents and keyboard-operable buttons.
- Every interactive reveal is optional: continuing to scroll always preserves the correct historical story.

## 5. 3D asset direction

### Blender asset

Build Eagle with Blender MCP from simple mechanical primitives and export a project-local GLB.

- recognizable ascent cabin, descent-stage octagon, engine bell, four landing legs and footpads, ladder, radar dish, antennae, and restrained gold-foil surfaces;
- flat-shaded, deliberately faceted geometry matching the selected mock;
- separate named objects/material groups for ascent stage, descent stage, legs, dish, engine, and foil so Three.js can animate or highlight them;
- origin centered on the vehicle’s vertical axis at the landing-gear plane;
- compressed GLB, with a target transfer size below 1.5 MB;
- one static poster render generated from the same Blender scene for loading, reduced-data, and failed-WebGL states.

### Lunar environment

- A deterministic low-poly terrain mesh in Three.js provides the continuous descent surface.
- Authored crater depressions, West Crater, boulder clusters, and landing ellipse are stable across sessions.
- A baked low-frequency noise texture or vertex colors may add surface variation; no photoreal scan is required.
- The surface uses level-of-detail bands so mobile hardware renders less geometry without changing the composition.

## 6. Archival imagery

Use at most two public-domain NASA Apollo 11 images, downloaded locally and credited in visible captions. They serve as chapter transitions, not backgrounds behind every scene. Images must be sourced from NASA pages or NASA image archives, optimized locally, and never block first meaningful paint.

## 7. Audio

Audio remains optional and off by default. If included after the complete visual experience is stable:

- use a single explicit “mission audio” toggle;
- never autoplay audible sound;
- provide synchronized transcript captions;
- stop audio immediately when disabled or when the route loses visibility;
- do not make any understanding depend on sound.

## 8. Component architecture

The existing content data remains authoritative. New components consume generic scene-state props rather than importing `content.json` directly.

- `DescentExperience` — owns enhanced-mode capability checks and timeline state.
- `LunarScene` — Three.js canvas boundary and graceful-error handling.
- `EagleModel` — loads and animates the Blender GLB.
- `LunarTerrain` — terrain, craters, boulders, dust, and landing ellipse.
- `DescentCamera` — maps normalized story progress to authored camera poses.
- `Trajectory` — planned and actual path geometry and comparison state.
- `ComputerLoad` — accessible DOM/WebGL hybrid visualization for the 1202 explanation.
- `MissionHud`, `ProgressRail`, and `BeatSection` — retained as reusable content/UI components, restyled and extended through props.
- `ArchiveFrame` — responsive image, caption, and credit treatment.
- `ExperienceControls` — inspect, compare, audio, previous/next, and reduced-data controls.

The server-rendered article remains the base document. Enhanced mode layers the 3D experience over it without removing headings, transcript text, or telemetry from the DOM.

## 9. State and data flow

- `content.json` supplies historical copy and verified telemetry.
- A separate `scene-config.ts` maps beat IDs to camera poses, lander transforms, terrain annotations, and optional interactions.
- One normalized `progress` value is the source of truth for scroll, rail, keyboard, and previous/next navigation.
- Derived scene state is deterministic and contains no historical data not present in the content/config files.
- Interaction state (`inspect`, `compare`, `computer detail`) never changes timeline state unless the visitor explicitly navigates.

## 10. Accessibility and fallback

- The full ordered article and static telemetry remain available without JavaScript.
- `prefers-reduced-motion` replaces scroll-driven camera travel, dust, and interpolation with six static scene posters or the Blender poster plus per-section telemetry.
- If WebGL, the GLB, or terrain initialization fails, the page displays the poster and continues as the complete article with no empty canvas gap.
- Canvas has a concise accessible label; all factual information exists in DOM text.
- Keyboard controls: arrow/Page keys move beats, Enter/Space activate inspect/compare, Escape exits inspection.
- Focus never enters invisible WebGL objects; matching DOM controls expose every inspectable fact.
- Touch targets are at least 44 px and the canvas never traps vertical scrolling.
- Contrast, captions, and transcript speaker labels meet the same standard as the current route.

## 11. Mobile behavior

- Mobile uses a composed three-quarter exterior view, not a desktop scene squeezed into portrait.
- Eagle occupies the upper half; telemetry becomes a compact bottom instrument strip; the phase rail becomes horizontal.
- Terrain geometry, shadows, pixel ratio, dust count, and post-processing are reduced automatically.
- Inspect mode opens only from an explicit button and uses one-finger orbit plus a persistent “Done” control.
- Static poster mode is offered when capability checks indicate low memory, no WebGL, reduced data, or repeated asset failure.
- There must be no horizontal scrolling, clipped controls, or HUD overlap at 375×667 and 390×844.

## 12. Performance and resilience

- Server-render title, hook, entry control, and poster before any 3D request.
- Dynamically import Three.js/React Three Fiber only after the entry section becomes visible or the visitor activates “Enter the descent.”
- Lazy-load the GLB and archival images; show the Blender poster immediately.
- Target under 250 KB of critical route JavaScript before the 3D chunk, a GLB below 1.5 MB, and no blocking external requests.
- Cap desktop pixel ratio at 1.5 and mobile at 1.25; adapt quality when frame time remains above 24 ms.
- Dispose geometries, materials, render targets, observers, and animation frames on unmount.
- Respect background-tab visibility and pause the render loop when the scene is not visible.

## 13. Verification

- Unit tests cover scene-state interpolation, beat navigation, capability fallbacks, and interaction state.
- Browser tests cover bidirectional scroll, rail/keyboard parity, inspect/compare behavior, WebGL failure, GLB failure, reduced motion, no JavaScript, and mobile overflow/touch behavior.
- Visual comparison uses the selected mock beside same-viewport desktop and mobile captures; major composition differences are corrected before handoff.
- Performance inspection confirms the 3D bundle and assets do not block the server-rendered opening.
- The production build, full existing test suite, and final local route must all pass before completion.

## 14. Explicit non-goals

- No alternate-history landing game, score, failure screen, or user-authored flight path.
- No photoreal cockpit recreation or scientifically precise flight simulator.
- No autoplay audio, cinematic video background, heavy post-processing, or particle spectacle.
- No lobby, accounts, other exhibits, or changes outside the standalone route.

## 15. Completion definition

The redesign is complete only when the primary experience is visibly dominated by the live 3D descent, every beat changes the physical world and not only the copy, at least three interactions reveal historical or systems understanding, the 10–15 minute story remains coherent without using those interactions, the original accessibility requirements still pass, the visual implementation materially matches the selected mock, and the route remains usable when every 3D asset is removed.
