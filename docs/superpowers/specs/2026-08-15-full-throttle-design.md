# Full Throttle — Immersive Exhibit Design

**Status:** Approved for implementation on 2026-08-15  
**Route:** `/exhibits/full-throttle`  
**Lobby state:** Show `Thirteen Minutes` and `Full Throttle`; keep `Living Atlas` routable but hidden from the lobby  
**Experience length:** Approximately 8 minutes

## Purpose

Full Throttle is a tactile, three-dimensional museum exhibit about how a representative two-spool, high-bypass turbofan works. It must teach the physical identity and placement of seven engine components before explaining the airflow cycle, then turn that understanding into a satisfying free-play throttle interaction.

Apollo is the quality benchmark, not the interaction or visual template. This exhibit should feel like handling a beautiful machine on a museum conservation table: bright, precise, physical, and quietly playful.

## Experience concept — a living machine on a museum workbench

The opening starts from a familiar view through an airplane window. The nacelle sits below a bright wing in daylight. As the visitor enters, the aircraft context falls away and the same engine settles onto an open, warm-white inspection stage. The transition connects an everyday object to the hidden machine inside it.

From that point onward, the engine is the interface. Text never becomes a vertical article pasted over a decorative canvas. Every chapter changes what the visitor can do with the physical object.

The visual language combines:

- warm mineral white and pale grey exhibition surfaces;
- brushed titanium, charcoal cavities, ceramic off-white, and small aviation-orange safety marks;
- cool blue, compressed white, amber, and hot vermilion only for airflow and heat;
- editorial serif display type paired with a restrained industrial grotesk and tabular numerals;
- maintenance-manual annotations, fine rules, and object labels instead of science-fiction HUD chrome;
- soft, directional studio light and grounded contact shadows instead of glow-heavy spectacle.

Motion has mass. Engine modules ease apart with weight, rotors coast, the throttle has a damped detent, and camera moves resemble a museum videographer on a slow dolly. Airflow is fluid and legible rather than neon decoration.

## Story and interaction

### Prologue — The engine beside you

- Full-viewport airplane-window composition with bright sky, wing, and nacelle.
- The hook is limited to one short statement and one entry action.
- Entering performs one continuous transformation from exterior nacelle to cutaway inspection object.
- The meaningful HTML content renders before the 3D bundle; the opening poster covers loading and fallback states.

### Act I — Take it apart

- The visitor drags an `EXPLODE` handle from assembled to separated, or activates a button/keyboard equivalent.
- The seven components move along the shared shaft axis as independent named groups.
- Selecting a part moves the camera to it, preserves the full engine as a translucent spatial silhouette, and opens one short fact beside the object.
- A compact `n / 7 seen` marker encourages exploration without gating progression.
- The high-pressure turbine receives a special macro reveal: a blade section opens to show internal cooling passages. This is the exhibit's strongest “wait, really?” moment.
- A `REASSEMBLE & RUN` action is always available after the first part has been inspected; all facts remain accessible from a DOM list and keyboard controls.

### Act II — Make it breathe

- The engine reassembles into a cutaway.
- A horizontal airflow scrubber, shaped like a clean pressure/temperature ribbon, is the primary control. Dragging it moves an air parcel through five stages: intake and fan, compression, combustion, turbine, and exhaust.
- The camera travels through and around the machine according to the scrubber position. This is direct manipulation, not an Apollo-style passive scroll timeline.
- Cool bypass air visibly splits from core air at the fan. The much larger bypass stream remains spatially separate and rejoins visually at the exit.
- Compressor spacing tightens, the core stream brightens under compression, combustion becomes a controlled annular flame, and two animated shaft paths connect turbines to their corresponding front stages.
- Each stage reveals a concise caption and a single relevant relative readout. Previous/next controls reproduce every scrubber state.

### Act III — Take the throttle

- The camera returns to a complete three-quarter cutaway.
- A large vertical throttle lever becomes the primary object on the interface, with idle, cruise, and takeoff detents.
- One normalized throttle value drives fan and spool speed, airflow density and speed, thermal intensity, relative fan/core/thrust instruments, subtle camera vibration, and opt-in procedural sound.
- Rotor speeds do not jump linearly. They accelerate and coast with different response curves for the low- and high-pressure spools.
- A short “hold at takeoff” payoff exposes the full loop with two shaft traces and the line: `Seven parts. Two shafts. One continuous exhale.` No score or gamification is added.

### Epilogue

- The engine quiets to a near-static museum-object pose.
- The takeaway is short and supported by the now-familiar engine rather than a new block of exposition.
- The go-deeper link uses a verified primary or authoritative aviation source.
- Related exhibits link to Apollo; unavailable future exhibits remain visibly non-interactive.

## Lobby and plug-and-play architecture

The homepage must render from a typed exhibit registry instead of hard-coded card markup. Each exhibit entry owns its route, status, wing, duration, descriptive copy, palette, poster kind, and highlight facts.

`status: "active"` entries appear in the lobby. `status: "hidden"` entries remain directly routable but do not appear. `status: "coming-soon"` may appear only when explicitly enabled in a future design. For this release:

- `thirteen-minutes`: active;
- `full-throttle`: active;
- `living-atlas`: hidden, with its route and all existing code unchanged.

Adding an exhibit later should require a registry entry, a poster renderer, and the exhibit route—not edits to the homepage layout.

## 3D asset

The turbofan is a project-owned GLB created from procedural Blender geometry and retained as an editable `.blend` source. It is a representative explanatory model, not a replica of a specific commercial engine.

Required named top-level groups:

- `fan`
- `lp_compressor`
- `hp_compressor`
- `combustor`
- `hp_turbine`
- `lp_turbine`
- `nozzle`

Supporting groups include `lp_shaft`, `hp_shaft`, `core_case`, `bypass_duct`, and invisible/simple hit targets. All seven primary parts remain independently transformable after GLB export. Rotating subgroups have centered origins and predictable local shaft axes. The cutaway removes a consistent sector so internal stages remain readable in both assembled and exploded states.

The web scene owns state and animation. Blender owns geometry, naming, materials, origins, poster camera, and export. A static poster produced from the same asset serves loading, reduced-data, and WebGL-failure states.

## Architecture and data flow

- `content.json` is the factual and narrative source.
- `types.ts` defines exhibit, part, and stage contracts.
- `engine-state.ts` maps phase, scrub progress, selected part, and throttle to deterministic scene state.
- `FullThrottleExperience` owns mode transitions, input parity, visited-part state, reduced-motion state, capability state, and audio opt-in.
- `EngineScene` renders the persistent React Three Fiber world.
- `TurbofanModel` maps named GLB nodes to part transforms, opacity, hit targets, and rotations.
- `AirflowSystem` visualizes bypass/core flow from deterministic curves and one normalized engine state.
- DOM components own every fact, control, status announcement, and fallback interaction.

The GLB and Three.js chunk are dynamically loaded only after the hero enters the viewport or the visitor chooses to begin. Server-rendered copy, poster imagery, and entry controls remain usable without the enhanced scene.

## Responsive and accessible behavior

- Desktop uses a wide side cutaway with peripheral annotations.
- Mobile uses a three-quarter portrait composition, a bottom-sheet fact panel, a horizontal part selector, and a touch-safe vertical throttle that never captures page scroll outside its handle.
- All part interactions have real buttons with visible focus states and at least 44px targets.
- The airflow scrubber and throttle use native range semantics and keyboard arrow control.
- `prefers-reduced-motion` removes continuous rotation, particle travel, camera interpolation, and drag inertia. It uses static part positions, discrete airflow stages, and idle/cruise/takeoff buttons.
- WebGL failure or low capability shows an interactive SVG cutaway with the same seven parts, facts, airflow stages, and throttle states.
- With JavaScript disabled, the page remains a complete ordered article.
- Sound is muted by default, opt-in only, synthesized locally, and never required for understanding.

## Performance targets

- Server-render hero, title, poster, and entry action before any 3D request.
- GLB transfer target: below 1.8 MB; poster target: below 250 KB.
- Desktop pixel ratio capped at 1.5; mobile at 1.25.
- No post-processing pipeline in v1.
- Pause rendering, audio, and animation when the scene is off-screen or the page is hidden.
- Reduce particles, shadows, and geometry when sustained frame time exceeds 24 ms.
- Dispose geometries, cloned materials, observers, animation frames, and audio nodes on unmount.

## Accuracy policy

- Describe a generic representative two-spool high-bypass turbofan and say so explicitly.
- Verify shaft relationships, compressor geometry, bypass contribution, combustor dilution/cooling air, turbine-blade cooling, and the go-deeper link against authoritative sources before final copy is shipped.
- Do not present illustrative throttle states as precise engine data.
- HUD values are relative percentages or clearly labeled explanatory indices.
- Do not imply every turbofan has identical stage counts, bypass ratio, temperatures, or thrust split.

## Verification

- Unit tests cover registry filtering, content integrity, state interpolation, spool response, part selection, and capability fallbacks.
- Component tests cover phase transitions, part fact controls, airflow controls, keyboard-accessible throttle behavior, audio opt-in, and reduced-motion controls.
- Asset tests inspect the GLB for the required named groups and an acceptable transfer size.
- Browser tests cover the lobby, hidden Living Atlas card, both active routes, all three Full Throttle acts, keyboard/touch parity, WebGL fallback, reduced motion, mobile overflow, and no-JavaScript reading order.
- Visual verification captures the hero, exploded view, airflow combustion stage, and throttle payoff at desktop and 390×844 mobile sizes.
- Production build and the full existing test suite must pass before handoff.

## Explicit non-goals

- No flight simulator, pilot controls, scoring, failure modes, or engine-model branding.
- No long history of jet propulsion.
- No invented absolute engineering telemetry.
- No autoplay audio.
- No deletion or disabling of the Living Atlas route.
- No reuse of Apollo's dark palette or timeline/HUD composition.

## Completion definition

The exhibit is complete only when all seven parts are visibly distinct and independently inspectable, the bypass/core split is understandable without relying on copy, both shaft relationships are visually legible, the throttle changes the whole live system through one state model, the lobby is registry-driven and shows only Apollo plus Full Throttle, all fallback modes preserve the full story, the real GLB passes its node/size checks, desktop and mobile visual captures are polished, and the full build and tests pass.
