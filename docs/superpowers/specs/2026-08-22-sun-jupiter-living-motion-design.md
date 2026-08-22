# Sun and Jupiter Living Motion — Design Specification

**Date:** 2026-08-22  
**Status:** Approved direction; implementation specification  
**Exhibit:** Atlas of Worlds  
**Quality contract:** [`docs/premium-exhibit-standard.md`](../../premium-exhibit-standard.md)

## Curatorial thesis

The Sun and Jupiter are not solid photographed objects. They are evolving fluid systems: magnetised plasma on and above the Sun, and rapidly rotating cloud-forming gases on Jupiter. Atlas of Worlds should let a visitor feel that continuous activity without confusing an accelerated visual model with a literal live observation.

The visitor promise is: **the delivered NASA imagery remains recognisable and inspectable while motion reveals the kind of physical process that organises it.** Motion is part of the existing viewing modes, not a separate attraction or tab.

## Scope

### Sun

The four observational surface modes receive continuous, wavelength-specific motion:

- **Photosphere:** fine convective shimmer, slow cellular drift, a restrained luminous limb, and occasional low prominence activity.
- **171 Å:** long, soft coronal-loop flow and a quiet-corona breathing pattern.
- **193 Å:** sharper coronal structure, hotter active-region pulses, and lower-density radial streamers.
- **304 Å:** more active chromospheric mottling, short spicule-like limb activity, and brighter prominence flow.

Magnetic Activity and Interior retain their current conceptual roles. They do not receive the same surface treatment merely for consistency; motion is added only where it strengthens the existing scientific meaning.

### Jupiter

The atmospheric modes receive motion appropriate to their subject:

- **Clouds:** smooth latitude-dependent zonal advection, with neighbouring belts and zones travelling at different rates and directions.
- **Storms:** the same global jet system plus counter-clockwise circulation inside the Great Red Spot and a restrained turbulent wake around it.
- **Auroras:** subtle underlying atmospheric motion plus animated polar emission curtains.

Magnetosphere, Interior, and Moons remain distinct explanatory modes. Jupiter wind motion must not bleed into those modes.

### Explicit non-goals

- No new Sun or Jupiter tab.
- No literal birds, terrestrial ambience, or fabricated space audio.
- No raw flat NASA movie wrapped around a sphere.
- No full-globe transparent duplicate texture, ghost planet, global blur, fog veil, or rotating double image.
- No random flare or storm event presented as a real event at a real time.
- No claim that the exhibit is a live feed.

## Source-grounded boundaries

The source imagery is authoritative processed observation; the added motion is an accelerated, evidence-informed visualization.

- NASA SDO publishes still imagery and time-series movies for AIA 171 Å, 193 Å, and 304 Å. The channels isolate different temperature regimes and atmospheric layers, so each mode must have a distinct motion profile rather than the same generic animation tinted differently: [SDO data](https://sdo.gsfc.nasa.gov/data/), [SDO channel descriptions](https://sdo.gsfc.nasa.gov/data/channels.php).
- SDO sequences show plasma tracing coronal magnetic structure in 171 Å and prominence material in 304 Å: [NASA SVS magnetic reconnection sequence](https://svs.gsfc.nasa.gov/4761).
- Jupiter's belts, zones, vortices, and wake systems are organised by rapid rotation and atmospheric circulation. The Great Red Spot is a counter-clockwise southern-hemisphere anticyclone with very fast perimeter winds: [NASA/JPL Great Red Spot](https://www.jpl.nasa.gov/news/nasas-juno-probes-the-depths-of-jupiters-great-red-spot/).

The interface must qualify motion close to the renderer in the existing “What changed” line. Copy must identify the base imagery as observed or processed and the movement as a visualization. The mode's existing evidence status still describes the scientific imagery and feature claim; it must not silently imply that the generated in-between frames were observed.

## Experience design

### Entry and control

Motion is on by default, as it is now. The existing **Motion** control remains the only motion switch and applies immediately to surface flow, prominences, corona, vortices, wakes, and auroras. No second control is introduced.

When motion is disabled, the exhibit freezes on the current coherent frame rather than resetting or fading the overlays. Re-enabling continues from that frame without a jump. `prefers-reduced-motion` starts and keeps all new motion frozen while preserving a complete static composition.

### Inspection behavior

- Manual globe rotation and zoom remain independent of internal fluid motion.
- Selecting a hotspot may pause automatic globe rotation, but solar and atmospheric activity continues unless the visitor turns Motion off.
- The Great Red Spot's centre remains geographically anchored to its marker while cloud material circulates inside the oval.
- Mode transitions preserve globe orientation and cross directly into the new motion profile without a loading flash.
- Compare mode uses a frozen scientific frame to keep scale comparison legible and economical.

## Rendering architecture

### Pure motion model

Create `lib/space/celestial-motion.ts` as the authoritative pure-data and math layer. It owns:

- `SolarMotionProfile` and `JovianMotionProfile` types;
- one solar profile for each of `photosphere`, `171`, `193`, and `304`;
- Jovian profiles for `clouds`, `storms`, and `auroras`;
- smooth zonal-jet velocity as a function of latitude;
- Great Red Spot local vortex influence and counter-clockwise direction;
- deterministic solar activity seeds and loop counts;
- motion-phase accumulation rules that freeze exactly when disabled; and
- capability tiers for full and reduced renderer budgets.

All values are deterministic. Reloading the same mode produces the same authored motion character instead of a different random Sun or Jupiter.

### Solar renderer

Create `components/space/SolarDynamicWorld.tsx` and move the current solar surface projection responsibility into it.

The renderer contains:

1. A seamless triplanar base material that preserves the corrected sphere rotation and avoids the former vertical texture belt.
2. A time-dependent spherical distortion field with small amplitude. It moves sampling coordinates locally without changing the large observed structures or introducing a seam.
3. A wavelength profile controlling drift scale, emissive pulse, contrast, corona density, loop length, and prominence intensity.
4. A limb-only corona shell whose opacity rises toward the silhouette and never veils the centre of the disc.
5. A small deterministic set of three-dimensional coronal arcs outside the surface. Emissive flow travels along each arc; the arcs do not masquerade as observed geometry.

The surface and corona use accumulated local phase, not `clock.elapsedTime`, so turning Motion off truly freezes the frame.

### Jupiter renderer

Create `components/space/JovianDynamicWorld.tsx` for Jupiter's atmospheric modes.

The renderer contains:

1. A single equirectangular surface shader sampling the delivered Cassini map.
2. Smooth latitude-dependent longitudinal offsets that produce differential zonal motion without visible hard band boundaries.
3. Low-amplitude wake deformation limited to authored storm latitudes.
4. An elliptical local transform centred on the authored Great Red Spot coordinates. The transform rotates sampled cloud detail counter-clockwise while its centre remains fixed.
5. A restrained limb-scattering layer.
6. An aurora-only polar shell with moving emission curtains and no full-planet colour wash.

The old `AtmosphericFlow` transparent duplicate must no longer render for Jupiter. It may remain available for unrelated worlds until separately reviewed.

### Atlas integration

`AtlasCanvas.tsx` selects the specialised renderer by world and mode:

- Sun + `motion: "solar"` → `SolarDynamicWorld`.
- Jupiter + `motion: "atmosphere"` → `JovianDynamicWorld`.
- Other worlds continue through the existing renderer.

`resolveRenderLayers` remains the mode-to-render contract. Content changes should use existing mode IDs and the existing Motion control. No new global store state is required.

## Visual direction

### Sun

The surface must stay crisp enough that the NASA texture remains the hero. Motion is read through local evolution, not by wobbling the entire sphere. The corona is brightest at the limb and breaks the perfect circular silhouette in a controlled way. Prominences should feel filamentary and energetic, not like uniform rings, cartoon flames, or orange ribbons pasted around the edge.

The four modes must be visibly different within two seconds:

| Mode | Dominant character | Relative motion | Limb behavior |
| --- | --- | --- | --- |
| Photosphere | granular convection | fine and restrained | warm low corona |
| 171 Å | magnetic loop flow | slow, long paths | broad soft loops |
| 193 Å | hot corona / active regions | sharper pulses | sparse radial streamers |
| 304 Å | chromosphere / prominences | busier short-scale flow | stronger compact eruptions |

### Jupiter

The cloud map stays detailed and opaque. Belts should appear to slip past one another slowly, not detach or smear. The Great Red Spot must visibly turn when the Storms mode is selected, while the surrounding wake bends and reforms. Motion should remain readable during globe rotation and must not look like a second transparent Jupiter spinning over the first.

## Accessibility and resilience

- Motion control retains its accessible pressed state and descriptive label.
- Reduced-motion renders the same scientifically meaningful layers at a deterministic phase.
- Renderer descriptions mention accelerated motion visualization for affected modes.
- WebGL and texture errors continue to use the existing static scientific fallback.
- Static fallback copy explains that motion requires interactive 3D while preserving the underlying source image and mode explanation.
- Keyboard mode selection and hotspot inspection remain unchanged.

## Performance budget

- No video download and no additional high-resolution texture requirement.
- One animated surface material per primary world.
- Solar corona and arc count are capped and use shared geometry/material data where practical.
- Full-quality target: stable interaction at representative desktop viewports.
- Reduced capability/mobile target: fewer solar arcs and lower segment counts, while surface flow and Jovian jets remain visible.
- When the page is hidden, time accumulation stops.

## Verification and acceptance criteria

### Automated

- Pure solar and Jovian profiles are covered by unit tests.
- Jet velocity is smooth across latitude boundaries and contains both eastward and westward flow.
- Great Red Spot vortex influence is local, centre-preserving, and counter-clockwise.
- Motion phase advances only while enabled.
- Every Sun observational mode resolves to solar motion; Jupiter Clouds, Storms, and Auroras resolve to Jovian motion; non-atmospheric modes do not.
- Renderer descriptions and fallback copy qualify the motion visualization.
- Existing renderer, interface, content, store, route, and asset suites remain green.

### Browser and visual

- Rotate the Sun fully in all four observational modes: no vertical belt, black bar, projection seam, texture stretch, or stalled surface.
- Observe each Sun mode for at least ten seconds: continuous local motion, distinct wavelength character, no abrupt loop reset, and no centre haze.
- Rotate Jupiter fully in Clouds and Storms: no equirectangular seam flash, band tear, ghost globe, or marker drift.
- Great Red Spot visibly circulates counter-clockwise in Storms while remaining under its authored hotspot.
- Motion off freezes every affected layer; on resumes without a discontinuity.
- Reduced-motion supplies a resolved static frame and no autoplay.
- Desktop, short desktop, tablet, and mobile retain the existing premium composition with no added controls or overflow.
- No unexplained application or shader compilation errors.

## Premium completion boundary

This extension is complete only when the real browser proves that the motion is visible but does not compromise texture fidelity, scientific qualification, hotspot alignment, rotation, responsive layout, or inspection control. A pulsing opacity shell or slowly rotated texture duplicate does not satisfy this specification.
