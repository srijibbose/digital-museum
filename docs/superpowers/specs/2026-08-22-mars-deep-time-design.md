# Mars Deep Time — Experience and Scientific Design

**Status:** Approved for implementation on `earth_moon`
**Exhibit:** Atlas of Worlds
**Signature interaction:** A continuously scrubbable reconstruction of Mars from 4.1 billion years ago to the present

## Curatorial thesis

Mars is not simply a red, dead planet. Its present surface is an archive in which rivers, lakes, volcanoes, ice, impacts, and atmospheric loss remain legible across more than four billion years.

The visitor should leave able to connect visible present-day terrain to a changing planetary system while understanding that terrain observations are more certain than reconstructions of ancient water and atmosphere.

## Visitor promise

The visitor can hold the camera on any part of Mars and drag through time. The same planet transforms in place: no scene swap, canned movie, camera cut, or replacement globe. The instrument always states which parts are observed, processed, reconstructed, or hypothetical.

## Experience laws

1. **Nothing teleports.** Camera, orientation, zoom, and selected geography persist while time changes.
2. **Nothing pops.** Surface tint, water, ice, haze, and atmosphere interpolate continuously.
3. **Nothing decorative pretends to be science.** Motion represents time or atmospheric behavior; reconstruction is labelled.
4. **The terrain is the evidence anchor.** The delivered NASA/USGS Viking and MOLA products remain the base truth at every date.
5. **Habitability is not life.** No vegetation, animals, settlements, or unsupported biosignatures appear.

## Interaction model

### Entry

Mars retains its existing Surface, Terrain, Missions, Atmosphere, and Interior modes. `Water history` becomes the deeper `Deep time` mode so the exhibit does not split one idea across redundant tools.

Entering Deep Time opens at **3.7 billion years ago**, a legible evidence-rich point near the late Noachian / early Hesperian transition. The visitor immediately sees a meaningful change without an automatic camera move.

### Time machine

The time machine is integrated above the existing command deck and includes:

- one horizontal range control from **4.1 billion years ago** to **Present day**;
- a live date, era, authored-state title, and evidence qualifier;
- six selectable anchor states;
- a play-toward-present control;
- a momentary/toggle `Present reference` control for then/now inspection; and
- a short statement that the terrain is observed while water and atmosphere are constrained reconstructions.

Dragging is direct and continuous. Selecting an anchor glides to it over 650–900 ms. Reduced-motion mode changes anchors immediately and disables autoplay while leaving the slider fully usable.

### Authored anchor states

Dates are communication anchors, not claims of exact global climate boundaries. Period boundaries on Mars are crater-count model estimates and carry published ranges.

| Date | Visitor label | Evidence-led transformation | Confidence treatment |
|---|---|---|---|
| 4.1 Ga | Early record | Darker, less oxidised surface; substantial modelled atmosphere; limited and explicitly uncertain lowland water | Hypothesis is translucent and restrained |
| 3.8 Ga | Valley networks | Strongest hydrology signal; denser haze/atmosphere; topography-guided lowland water | Surface evidence strong; global appearance inferred |
| 3.5 Ga | Lake worlds | Lakes, deltas, and episodic flooding remain prominent while the atmosphere declines | Mixed observed landforms and modelled extent |
| 3.0 Ga | Drying world | Surface water rapidly retreats; dust and oxidation become dominant | Transition timing presented as approximate |
| 1.0 Ga | Ice cycles | Present-like desert with stronger polar and mid-latitude ice signal | Modelled climate cycle, no liquid ocean claim |
| Today | Present day | Existing Viking/MOLA Mars, thin atmosphere, modern polar ice | Observed/processed base products |

Intermediate dates interpolate the authored parameters. The live label states `Interpolated between authored states` unless the handle is on an anchor.

## Visual and rendering system

### Observed base

- Viking global colour mosaic remains the surface colour source.
- MOLA-derived height material remains the terrain and topography guide.
- Existing axial tilt, physical rotation, markers, zoom, and orbit controls remain continuous.

### Reconstructed layers

1. **Surface age treatment** — subtle shift from darker basaltic/less oxidised early colour to modern iron-oxide red. It never hides observed terrain.
2. **Topography-guided water** — a separate translucent sphere samples the MOLA-derived material and favours low terrain. Its shoreline is visibly soft and identified as reconstructed, not mapped fact.
3. **Ice signal** — restrained polar/mid-latitude whitening that changes with the authored climate state.
4. **Atmospheric limb** — a separate back-face shell grows optically thicker in ancient states without implying a precisely known pressure.
5. **High haze** — very slow procedural drift when motion is allowed; frozen cleanly for reduced motion.

No layer may use random large floods, storms, lightning, vegetation, or an Earth-blue atmosphere.

## Motion grammar

- Direct scrub: parameter updates follow the pointer with no staged delay.
- Anchor selection: cubic ease-out, 650–900 ms depending on distance.
- Autoplay: ancient-to-present journey in 18 seconds; pausing preserves the exact date.
- Present reference: 180–240 ms visual settle, but no camera change.
- World rotation remains independent and continuous unless the existing inspection rules pause it.
- Atmospheric procedural time advances only when motion is enabled, the document is visible, and reduced motion is not requested.

## Field Guide behavior

With no hotspot selected, the Field Guide becomes a time-aware scientific card showing:

- current date and era;
- what the visitor is seeing;
- observed basis;
- reconstructed layers;
- confidence note; and
- the most relevant authoritative source.

Selecting Jezero or Valles Marineris retains the existing feature detail and media while the time machine remains active.

## Evidence language

- **Observed terrain:** Viking/MOLA and mapped landforms.
- **Processed:** colour, projection, relief normalisation, and browser delivery transformations.
- **Constrained reconstruction:** water, ice, haze, and atmosphere driven by authored anchor parameters.
- **Hypothetical:** any global/lowland shoreline; it must be translucent and explicitly qualified.

The interface must never say the reconstruction is a literal photograph of ancient Mars.

## Responsive, accessible, and fallback behavior

- Desktop: the timeline sits above the command deck and the globe eases slightly upward/smaller to preserve inspection space.
- Mobile: the timeline is full width; anchor labels are horizontally scrollable; the slider thumb is at least 28 CSS px with a 44 px interaction area.
- Keyboard: the range control supports arrows, Page Up/Down, Home, and End through native range semantics; anchor buttons and present reference are keyboard operable.
- Screen reader: `aria-valuetext` includes date, era, and anchor/interpolation status; a polite live region announces meaningful changes without speaking every pointer frame.
- Reduced motion: no autoplay or animated anchor travel; visual states still update immediately.
- WebGL unavailable: the sourced Mars map remains visible, while the time control and Field Guide continue to explain the selected reconstruction state.

## Performance requirements

- No new runtime dependency.
- No network request from the exhibit; all assets remain local.
- Shader work uses the already loaded Mars colour and height materials.
- Timeline input remains responsive at representative desktop and mobile viewports.
- Three.js resources created by the Deep Time layer are disposed by React Three Fiber lifecycle.

## Authoritative source ledger

| Source | Supports | Representation consequence |
|---|---|---|
| USGS, *Digital global geologic map of Mars* (2014) | Noachian/Hesperian/Amazonian units and global resurfacing history | Era labels and explicit uncertainty around crater-count chronologies |
| NASA SVS / Mars Global Surveyor MOLA | Global topography and topography-guided ocean visualisation precedent | Observed terrain remains fixed; water follows low terrain and stays labelled as reconstruction |
| NASA Perseverance science highlights | Jezero lake, delta, later flooding, and water-altered rocks | `Lake worlds` anchor and Jezero evidence copy |
| NASA MAVEN | Atmospheric escape and the relation between early atmosphere and surface liquid water | Ancient atmosphere thickens only as an inferred layer; loss is gradual and qualified |
| NASA water-loss research | Wet Noachian ending around 3.7 Ga and large ancient water inventory estimates | 3.7 Ga entry point and no exact global shoreline claim |

## Acceptance criteria

The implementation is complete only when:

- Deep Time is one coherent Mars mode, not a separate exhibit;
- the slider, anchors, autoplay, pause, and present reference all work;
- the same globe, camera, orientation, and zoom persist through time changes;
- surface, water, ice, haze, and atmosphere change continuously;
- every reconstructed layer is qualified near the control and in the Field Guide;
- WebGL fallback, keyboard, reduced motion, desktop, and mobile remain usable;
- automated model/store/interface/renderer/e2e tests pass;
- type checking and production build pass;
- final browser review shows no unexplained console errors or horizontal overflow; and
- no known high- or medium-severity visual, interaction, content, or credibility defect remains.
