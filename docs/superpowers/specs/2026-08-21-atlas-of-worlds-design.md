# Atlas of Worlds — Unified Planetary Exhibit Design

**Date:** 2026-08-21  
**Status:** Approved for implementation  
**Branch:** `earth_moon`  
**Visual target:** `C:\Users\Srijib\.codex\generated_images\01a023a7-0224-7a11-909e-cdfd04631913\exec-eac32548-30e4-44bb-8af3-73c6e6195749.png`

## Purpose

Replace the separate Earth and Moon exhibits with one premium, instrument-like Solar System exhibit. Visitors select a world, manipulate a detailed 3D specimen, activate body-specific scientific layers, inspect geolocated discoveries, compare worlds, and read the evidence behind every claim without leaving the main workspace.

The experience borrows the interaction clarity of the supplied Anatomy Atelier reference—persistent selection, a central specimen, nearby tools, and a contextual facts panel—but uses an original planetary-cartography visual language rather than copying the anatomy product.

## Product outcome

The museum lobby contains one featured Space exhibit named **Atlas of Worlds**. The exhibit route is `/exhibits/atlas-of-worlds`. The former `/exhibits/earth` and `/exhibits/moon` routes redirect to the unified route with the matching world selected.

The first production collection contains:

1. Sun
2. Mercury
3. Venus
4. Earth
5. Moon
6. Mars
7. Jupiter
8. Saturn
9. Uranus
10. Neptune

## Experience architecture

### Persistent frame

- A compact museum header identifies Loupe and the exhibit.
- A **World Index** on the left lists the ten bodies with class, ordering, and a small real-texture thumbnail.
- The **Observation Stage** in the center holds the selected 3D body, a compass, scale bar, active-layer badge, lighting readout, and direct manipulation affordances.
- The **Field Guide** on the right changes with the selected world, mode, and hotspot. It never blocks the specimen with a modal.
- A **Command Deck** spans the bottom. Universal tools remain stable; scientific modes change by body.

### Responsive behavior

- Desktop (`>= 1180px`): three-column instrument with the command deck across the central and right regions.
- Tablet (`760px–1179px`): compact left index, full stage, and a collapsible right drawer.
- Mobile (`< 760px`): a top world picker, full-width stage, horizontally scrollable mode rail, and a bottom-sheet field guide. The core journey remains usable; no desktop-only control is required to inspect a world.
- The exhibit owns exactly one viewport on desktop. It does not jump the document scroll when entering or changing worlds.

## Visual system

The selected target is a pale scientific cartography studio with warm mineral accents, fine rules, restrained shadows, and a large specimen. The dark theme becomes a night observatory using the same layout and information density, so theme changes never move controls.

- Light background: bone and limestone neutrals.
- Dark background: blue-black observatory neutrals.
- Accent: copper/mineral orange with body-specific secondary accents.
- Display type: the museum’s existing editorial serif.
- Instrument type: the museum’s existing sans and a tabular system stack for measurements.
- Icons: the existing Lucide set is retained deliberately because its thin optical weight matches the scientific instrument target and is already established across Loupe. Icons never replace labels for primary tools.
- Decorative CSS drawings are not used as substitutes for world assets. The specimen and thumbnails come from source imagery.

## Interaction model

### World selection

Selecting a body:

1. Updates the URL query parameter (`?world=moon`) without a full navigation.
2. Loads only that world’s texture bundle.
3. Resets the active scientific mode to that body’s default.
4. Clears any selected hotspot and comparison target.
5. Announces the new world and available modes to assistive technology.

### Direct manipulation

- Drag rotates the specimen.
- Wheel or pinch zooms within safe bounds that keep the body recoverable.
- Double-click or the Reset tool restores the authored camera.
- Auto-rotation pauses while the visitor interacts or inspects a hotspot.
- Keyboard controls rotate with arrow keys and zoom with `+`/`-` while the stage is focused.
- Reduced-motion mode disables auto-rotation and camera interpolation.

### Hotspots and Field Guide

Hotspots are anchored by latitude and longitude for solid bodies. Atmospheric bodies use stable representative coordinates for persistent phenomena and clearly identify changing or approximate observations.

Selecting a hotspot smoothly brings it into view and updates the Field Guide with:

- title, category, and coordinates;
- concise interpretation and deeper explanation;
- measurements or comparative scale;
- evidence status: **Observed**, **Processed**, **Inferred**, or **Illustrative**;
- coordinate confidence;
- source links.

No blocking modal is used. Escape clears the selection and returns the Field Guide to the world overview.

### Universal tools

- Rotate / interaction hint
- Zoom in
- Zoom out
- Reset
- Measure diameter
- Compare
- Light direction
- Light/dark theme

Compare mode offers a second-world selector and two scale policies:

- **True scale:** radii are proportional, with a bounded logarithmic presentation for extreme Sun/planet differences and an explicit disclosure.
- **Normalized:** both bodies use the same visible diameter for surface comparison.

### Body-specific modes

- Sun: Photosphere, 171 Å, 193 Å, 304 Å, Magnetic activity, Interior.
- Mercury: Surface, Basins, Temperature, Missions, Interior.
- Venus: Atmosphere, Radar surface, Volcanoes, Missions, Interior.
- Earth: Surface, Atmosphere, Clouds, Night lights, Tectonics, Interior.
- Moon: Surface, Missions, Water & ice, Topography, Interior, Lighting.
- Mars: Surface, Terrain, Water history, Missions, Atmosphere, Interior.
- Jupiter: Clouds, Storms, Auroras, Magnetosphere, Interior, Moons.
- Saturn: Atmosphere, Rings, Hexagon, Magnetosphere, Interior, Moons.
- Uranus: Atmosphere, Rings, Axial tilt, Magnetosphere, Interior, Moons.
- Neptune: Atmosphere, Storms, Winds, Rings, Magnetosphere, Interior, Moons.

Every listed mode is functional. A mode may alter material, lighting, overlays, visible hotspots, interior geometry, or the Field Guide; it cannot be static chrome.

## Scientific rendering strategy

### Solid worlds

Mercury, Moon, and Mars use high-segment spheres with observational color maps and elevation-derived bump maps. Relief is intentionally exaggerated at global scale for legibility and labelled **Processed**. Earth uses separate surface, night-light, cloud, and atmospheric shells. Venus defaults to its cloud deck; Magellan radar data is exposed as a distinct **Radar surface** layer and never presented as ordinary visible-light photography.

### Gas and ice giants

Jupiter, Saturn, Uranus, and Neptune use slightly oblate ellipsoids. Saturn and the ice giants use real ring geometry. Gas giants do not use terrain displacement. Scientific modes modify atmosphere, band contrast, feature overlays, axial orientation, and evidence content.

### Sun

The Sun uses an emissive photosphere and subtle animated surface shader. SDO wavelength modes swap to observational textures and update the evidence/readout treatment. The corona is a transparent billboard or shell derived from a real source asset, not a CSS glow pretending to be imagery.

### Interior mode

Interior mode replaces the normal surface with a clipped 3D set of concentric shells whose proportional radii are data-driven. The Field Guide states that interiors are scientific models inferred from density, gravity, magnetic, seismic, or solar-oscillation evidence rather than direct photographs.

## Asset policy and provenance

Primary sources:

- NASA Scientific Visualization Studio CGI Moon Kit (LROC + LOLA)
- NASA Visible Earth Blue Marble and Black Marble
- NASA Solar Dynamics Observatory imagery
- USGS Astrogeology MESSENGER, Magellan, Viking, and MOLA-derived planetary products
- NASA planetary 3D resources and mission resource packages

The repository includes an asset manifest with source URL, credit line, processing description, evidence class, native dimensions, delivered dimensions, and license/usage notes. All downloaded assets are locally bundled so the exhibit does not depend on third-party runtime availability.

Texture delivery targets:

- Desktop standard: 4K equirectangular color textures where source resolution permits.
- Mobile and fallback: 2K derivatives.
- Height/bump maps: 2K–4K grayscale.
- Large files are WebP/JPEG compressed with visually inspected quality; alpha imagery uses WebP/PNG.
- Only the selected world’s non-shared textures are loaded.

## State and data architecture

`content/space/atlas.ts` is the single validated content collection. Zod validates every world, mode, hotspot, source, physical measurement, renderer configuration, and asset reference at module load.

One Zustand store owns:

- selected world;
- selected hotspot;
- active mode by world;
- theme;
- reduced motion;
- light azimuth/elevation;
- compare state and scale policy;
- zoom/reset commands;
- simplified/WebGL fallback preference.

Renderer decisions are driven by typed data rather than body-name conditionals scattered through components.

## Accessibility

- The 3D stage is a progressively enhanced visualization; all scientific content remains reachable in semantic HTML.
- Every world and mode is keyboard selectable.
- Focus is never moved into a modal because the Field Guide is persistent.
- A live region announces world, mode, and hotspot changes.
- The stage has a concise interaction description and keyboard bindings.
- Color is never the only indicator of selection or evidence status.
- Reduced motion follows the operating-system preference and has an explicit control.
- The route includes a complete accessible transcript and source ledger after the instrument for no-WebGL and linear reading.

## Performance and failure behavior

- The WebGL renderer is client-only and dynamically loaded.
- The server-rendered frame and Field Guide overview remain useful before WebGL hydration.
- Texture bundles are lazy and cached by URL.
- Device pixel ratio is capped.
- The canvas pauses when the tab is hidden and avoids unnecessary continuous work when reduced motion is enabled.
- Failed textures show a real poster-map fallback and a concise status message; the rest of the instrument remains interactive.
- A simplified 2D map view is available explicitly and is used automatically when WebGL is unavailable.

## Lobby and legacy routes

The two old registry entries are removed and replaced with one `atlas-of-worlds` entry and a dedicated poster variant. Existing Earth and Moon URLs redirect to `/exhibits/atlas-of-worlds?world=earth` and `/exhibits/atlas-of-worlds?world=moon` so saved links do not break.

## Verification gates

Completion requires:

1. Unit tests for schema validation, world/mode behavior, URL parsing, filtering, comparison scaling, and store transitions.
2. Component tests for world selection, adaptive modes, hotspot-driven Field Guide updates, compare mode, theme, and keyboard-accessible controls.
3. Exhibit registry tests proving one unified Space exhibit and removal of the two featured duplicates.
4. End-to-end checks at desktop and mobile widths covering the primary journey.
5. An optimized Next.js build and TypeScript validation.
6. Browser inspection with no uncaught errors.
7. Same-viewport visual comparison between the approved mock and the rendered default Moon state.
8. `design-qa.md` updated with `final result: passed` after all P0/P1/P2 findings are fixed.

