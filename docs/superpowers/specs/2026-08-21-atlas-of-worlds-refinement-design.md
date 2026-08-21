# Atlas of Worlds — Scientific Instrument Refinement Design

**Date:** 2026-08-21

**Status:** Approved visual direction; detailed specification awaiting review

**Branch:** `earth_moon`

**Primary visual target:** `C:\Users\Srijib\.codex\generated_images\01a023a7-0224-7a11-909e-cdfd04631913\exec-665523d3-bc33-46e9-9c6b-1c9101de1986.png`

**Model-quality references:** `C:\Users\Srijib\.codex\generated_images\01a023a7-0224-7a11-909e-cdfd04631913\exec-3ff1eead-c32d-43b6-a347-f62b2a94e616.png`, `C:\Users\Srijib\.codex\generated_images\01a023a7-0224-7a11-909e-cdfd04631913\exec-8b39e18f-5729-401a-b7b0-3681f0bd950b.png`

## Goal

Refine the existing Atlas of Worlds into a coherent scientific instrument in which navigation is unmistakable, the selected world is always legible, every mode visibly changes the scientific view, annotations remain attached to the rotating specimen, and the Sun, Jupiter, and Saturn meet the model quality shown in the approved visual references. The solution applies to all ten worlds rather than special-casing the screenshots.

## Evidence from the review

The current implementation has shared systemic defects:

1. The header uses the exhibit title as the only home link, so Loupe ownership and the route home are not visually explicit.
2. The Sun uses a lit standard material despite being self-luminous, producing an incorrect black terminator.
3. Hotspots are drawn twice: real 3D markers rotate with the world, while a second CSS layer projects labels from fixed latitude/longitude percentages. The CSS labels therefore remain stuck over the stage while the real marker moves.
4. Default NASA GLB materials and procedural mode materials are not calibrated to the same exposure. Earth is too dark and switching modes can feel like changing labels over the same view or replacing the model entirely.
5. Several mode effects only alter hotspot visibility. Mercury Temperature and Missions, for example, do not yet provide a unique scientific visualization.
6. Saturn's one-dimensional radial ring texture uses `RingGeometry`'s planar UVs, which produces large wedges and bands instead of concentric rings.
7. The compass is static and does not report the camera or specimen orientation.
8. The mobile world name inherits the desktop `align-self: end` rule, so the thumbnail and label do not share a centre line.
9. World selection calls `scrollIntoView` on the button, which can move the document vertically instead of only centring the horizontal mobile picker.

## Approved visual and interaction direction

The approved direction is the first visual concept's interaction system with the rendering quality of all three concepts:

- Reuse Loupe's established brand lockup at the far left of the header. The Loupe mark and `LOUPE` link to `/`; a divider separates the non-interactive `Atlas of Worlds` title.
- Preserve the existing parchment cartography visual language, three-column desktop frame, World Index, central stage, persistent Field Guide, and bottom Command Deck.
- Replace persistent centre-screen feature labels with an **Orbital Feature Rail** at the left edge of the stage.
- Keep small real markers physically anchored to the rotating 3D world.
- Show at most one anchored callout: the selected feature. Its label is projected from the real 3D position, occludes correctly, and disappears when the feature rotates behind the world.
- Selecting a rail item or marker focuses the camera on the feature and updates the Field Guide. Escape or a second activation clears the focus.
- Treat the Sun, Jupiter, and Saturn visuals in the three approved concepts as the appearance target for their respective scientific models.

## Header and home navigation

The header identity is a stable two-part lockup:

1. Loupe mark + `LOUPE`: one clearly labelled link, `aria-label="Loupe museum home"`, destination `/`.
2. `Atlas of Worlds`: current exhibit title, plain text rather than a misleading home link.

Desktop retains Collection, Guided tours, Sources, and Theme. Mobile retains the Loupe link, exhibit title, and theme control; the section links may remain hidden because the core instrument is the primary mobile task.

## Annotation and feature-focus system

### Orbital Feature Rail

- The rail lists only features visible in the active mode.
- Each row shows its stable authored number, label, and evidence status.
- The rail does not overlap the specimen and collapses to a compact horizontal feature strip on tablet/mobile.
- When a mode has no surface feature, the rail is replaced by a concise `No mapped surface features in this view` note rather than empty chrome.

### Surface markers

- Markers use the latitude/longitude data already validated in the atlas collection.
- A marker behind the globe is occluded and cannot be clicked through the planet.
- The selected marker receives a restrained pulse/focus ring; reduced-motion mode uses a static double ring.
- Only the selected marker receives a text callout. Unselected markers remain dots.
- Atmosphere, magnetic, mission, and moon-system features may use representative coordinates, but the Field Guide must expose their confidence label.

### Camera focus

- Selecting a surface feature rotates the world or camera to place the feature in a readable three-quarter position rather than dead centre.
- Great Red Spot, north polar hexagon, polar cold traps, and other initially hidden features are brought into view when their mode or rail item is selected.
- Manual drag cancels automatic focus but preserves the selected Field Guide entry.

## Lighting model

The ambiguous Sunlight and Elevation sliders become a world-aware **Lighting** control.

### Natural sunlight

- Uses one physically readable directional source and a low ambient fill.
- The lit hemisphere and terminator remain visible for astronomical context.
- An `Adjust angle` disclosure exposes azimuth and elevation only when the active mode benefits from them.

### Survey light

- Uses hemispheric and camera-aligned fill so the entire visible hemisphere can be inspected without a black side.
- It is an explicit scientific viewing aid, not a claim about natural illumination.

### Conditional behavior

- Sun: no external-light control. Show `Self-luminous · lighting controls not required`.
- Interior: fixed explanatory lighting; external-light controls hidden.
- Night lights: fixed night presentation with a short explanation; external-light controls hidden.
- Moon Lighting: Natural sunlight with angle adjustment is the primary mode.
- Other solid, gas, and ice worlds: Natural sunlight / Survey light is available.

Earth's default surface opens in Survey light so land, ocean, and ice are legible. Natural sunlight remains one click away.

## Mode explanation and legends

Every mode defines:

- a visible `What changed` sentence;
- evidence status;
- optional legend items;
- whether lighting controls are available;
- whether atmospheric motion is available;
- the render-layer effect that makes the mode visually distinct.

The active explanation remains visible under the mode rail on desktop and at the top of the Field Guide on mobile. Tooltips are supplementary, never the only explanation.

For the Sun, an always-visible wavelength note explains that Å means ångström and that SDO/AIA observes extreme-ultraviolet wavelengths that isolate plasma at different temperatures:

- 171 Å: approximately 0.6 million K coronal loops.
- 193 Å: approximately 1.2 million K corona and hotter flare plasma.
- 304 Å: approximately 50,000 K chromosphere and transition region.

## Rendering architecture

One calibrated renderer owns the world surface across modes. Official NASA models remain provenance and geometry references, but a default mode cannot use an unrelated material pipeline that changes exposure or scale when the visitor selects another mode.

### Sun

- Use an unlit/emissive texture material so external light cannot create a black terminator.
- Add a subtle time-varying surface flow derived from the SDO texture, a layered limb glow, and sparse prominence/coronal motion.
- Motion is labelled `Illustrative motion from observed imagery` unless driven by an actual time sequence.
- Reduced motion disables flow and prominence animation without changing scientific content.

### Solid worlds

- Mercury, Venus radar, Earth, Moon, and Mars use calibrated observational textures with displacement or bump maps where elevation data exists.
- Relief exaggeration is consistent, bounded, and labelled Processed.
- Survey light uses environment/fill illumination; Natural sunlight uses the authored directional source.

### Gas and ice giants

- Preserve oblate geometry and observational cloud textures.
- Atmospheric motion uses slow differential band drift rather than rotating the whole texture as one rigid shell.
- Jupiter Storms adds a localized focus treatment around the Great Red Spot and a slow authored vortex motion. It must remain recognizable when motion is off.
- Uranus and Neptune only expose motion in modes with defensible atmospheric behavior.

### Saturn and rings

- Build ring UVs from normalized radius so the 4096×64 radial texture maps concentrically.
- Preserve alpha, correct front/back transparency, depth ordering, and axial tilt.
- Atmosphere, Rings, Hexagon, Magnetosphere, Interior, and Moons are separate layer combinations. Magnetosphere must not corrupt ring geometry.
- Hexagon focuses the north pole and displays a scientific overlay/inset plus an official Cassini observation in the Field Guide.

## Distinct scientific mode behavior

Every visible tab must change the model, overlay, focus, motion, or Field Guide explanation. The minimum differences are:

| World | Mode behavior refinements |
| --- | --- |
| Sun | Emissive photosphere; three SDO wavelength textures with temperature legend; animated/paused magnetic activity; clipped interior. |
| Mercury | Surface relief; basin emphasis and focused Caloris marker; day/night temperature gradient with legend; MESSENGER trajectory plus mission marker; clipped interior. |
| Venus | Cloud shell; Magellan radar surface; volcano focus; Venera/Magellan mission overlay; clipped interior. |
| Earth | Survey-lit surface; independently moving clouds; emissive night lights; plate-boundary/feature overlay; stronger atmospheric limb; clipped interior. |
| Moon | Surface relief; mission-site trail; polar cold-trap overlay; stronger topographic displacement with legend; clipped interior; adjustable natural lighting. |
| Mars | Surface; MOLA relief and legend; water-history sites; mission paths/sites; atmosphere shell; InSight-informed interior. |
| Jupiter | Cloud belts; moving storms and Great Red Spot focus; auroral polar shell; magnetic field without fake rings; clipped interior; Galilean moon system. |
| Saturn | Atmosphere; correctly mapped rings; north-pole hexagon focus; magnetic field with intact rings; clipped interior; Titan/Enceladus system. |
| Uranus | Atmosphere; narrow rings; camera/axis demonstration of 98° tilt; offset magnetic field; clipped interior; principal moons. |
| Neptune | Atmosphere; Great Dark Spot focus; latitude wind bands and legend; faint rings; offset magnetic field; clipped interior; Triton system. |

## Field Guide media

Hotspots may define an optional media record with:

- local image path;
- accurate alt text;
- caption;
- credit;
- source URL;
- evidence status.

The Field Guide shows hotspot media when available and otherwise falls back to the world observation plate. The implementation prioritizes official NASA, JPL, USGS, SDO, LROC, ESA mission, or other primary scientific sources. Every downloaded image is local, credited, and added to the existing provenance ledger. No remote runtime image dependency is introduced.

The first pass must include feature-specific media for at least: Sun active region, Caloris Basin, Maat Mons or Maxwell Montes, Himalaya, Apollo 11, Olympus Mons or Jezero delta, Great Red Spot, Saturn north polar hexagon, Uranus rings/tilt, and Neptune Great Dark Spot. Remaining hotspots use an honest world observation plate until a suitable primary-source image is available.

## Dynamic orientation indicator

The static compass becomes a live orientation readout:

- globe/camera latitude and longitude;
- north-up indicator;
- values update while dragging and after focus commands;
- `aria-live` is not used for continuous drag updates, avoiding speech overload;
- an accessible label explains `Current camera orientation`.

## Responsive behavior

### Desktop

- Keep the three-column instrument in one viewport.
- Feature rail occupies the left edge of the central stage without covering the world.
- Command Deck and Lighting control do not overlap the specimen or Field Guide.

### Tablet and mobile

- World thumbnails and names share the same centre line; the selected name is not right-aligned.
- Horizontal world selection scrolls only its own container and never moves document scroll position.
- The feature rail becomes a horizontal strip beneath the stage metadata.
- Mode rail, feature strip, and world picker each have independent horizontal scrolling with visible selection.
- Lighting collapses to Natural / Survey buttons; angle details open only in Moon Lighting or another relevant mode.
- The Field Guide follows the stage as a full-width sheet and media keeps a stable aspect ratio.
- The core journey works at 390×844 without clipped controls or document-level horizontal overflow.

## Accessibility and performance

- Loupe home, worlds, modes, feature rail, lighting, motion, camera, comparison, and Field Guide remain keyboard operable.
- Surface markers have HTML equivalents in the feature rail; the canvas is not the only way to select a feature.
- Focus styles remain visible in both themes.
- Reduced motion disables auto-rotation, solar/coronal motion, atmospheric band drift, pulsing markers, and interpolated camera focus.
- Motion pauses when the tab is hidden.
- Shader and geometry additions keep device pixel ratio capped and do not add per-frame React state updates. Orientation updates are throttled.
- Fallback and transcript content continue to expose every world, mode, hotspot, source, and media credit when WebGL is unavailable.

## Test-first verification

Completion requires current evidence for all of the following:

1. Component tests prove the Loupe home link and plain exhibit title, conditional lighting controls, Orbital Feature Rail, one selected callout, mode explanations, hotspot media, and mobile alignment classes.
2. Store tests prove Natural/Survey lighting state, conditional angle state, motion state, feature focus commands, and selection clearing.
3. Renderer tests prove the Sun is self-lit, Earth defaults to a legible survey-light pipeline, Mercury Temperature and Missions use distinct layers, Jupiter Storms enables motion, Saturn uses radial ring UVs, and magnetosphere does not corrupt ring selection.
4. Content/schema tests require every mode to define a visible change and every hotspot-media record to have alt text, credit, source, and local file.
5. Browser QA at 1440×900 covers Sun, Mercury, Earth, Moon, Jupiter, and Saturn; 390×844 covers world alignment, picker scroll isolation, feature strip, mode rail, and Field Guide media.
6. Visual comparisons pair the approved reference and implementation at the same viewport. All P0/P1/P2 differences are resolved or documented as deliberate scientific corrections.
7. Fresh unit/component tests, TypeScript validation, optimized Next build, console inspection, and the Atlas end-to-end journey pass before completion is claimed.

## Out of scope

- Real-time telemetry from active spacecraft.
- Claiming that illustrative shader motion is a live solar or planetary feed.
- Adding additional dwarf planets, asteroids, or moons beyond the approved ten-world collection in this refinement.
- Replacing the current museum visual language or rebuilding the exhibit as a separate application.
