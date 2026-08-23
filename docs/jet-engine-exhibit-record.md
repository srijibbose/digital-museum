# Jet Engine exhibit — curatorial and verification record

## Curatorial thesis

**Visitor misconception to change:** a jet engine is a fire tube whose exhaust alone pushes an aircraft.

**Thesis:** a high-bypass turbofan manages two coupled streams. The fan accelerates a large bypass mass; the core adds heat and extracts turbine work to sustain the fan and compressors. Net thrust is the momentum change of both streams, not a decorative flame or a single headline temperature.

**Visitor promise:** after moving through the exhibit, a visitor should be able to locate the principal NASA flow stations, describe where pressure and temperature rise or fall, explain the shaft energy loop, and distinguish bypass thrust from core thrust.

The experience is a single three-dimensional flow laboratory rather than a scroll-based marketing page. Its station rail, sourced mechanical reconstruction, cycle-linked spatial fields, operating conditions, and source notebook all address that promise.

## Evidence contract

The interface uses three explicit evidence labels:

| Label | Meaning in this exhibit | Examples |
| --- | --- | --- |
| Published convention | A name, boundary, or relationship taken directly from a cited technical source | NASA stations 0, 2, 3, 4, 5, and 8; NASA's fan exit `f` |
| Modelled cycle | A value calculated by the local zero-dimensional educational model | total pressure ratio, total temperature, specific net thrust, fuel/air ratio |
| Explanatory reconstruction | Authored geometry or motion that preserves functional relationships without claiming observation or production geometry | CC BY engine model, shaft topology, seeded-particle flow field |

No part of the reconstruction is presented as observed imagery, a scan, manufacturing CAD, live telemetry, certified performance data, a CFD solution, or a specific production engine.

## Source trail

Primary and official references, accessed 2026-08-23:

- [NASA Glenn — Gas Turbine Schematic and Station Numbers](https://www.grc.nasa.gov/www/k-12/airplane/turbdraw.html): station boundaries and notation.
- [NASA Glenn — Turbofan Thrust](https://www.grc.nasa.gov/www/k-12/airplane/turbfan.html): bypass ratio, fan/core streams, and the two-stream thrust relationship.
- [NASA Glenn — EngineSim 1.7a](https://www.grc.nasa.gov/WWW/k-12/BGP/ngnsim.html): educational component variables and operating-condition framing.
- [NASA Glenn — Engine Theory](https://www.grc.nasa.gov/www/k-12/airplane/EngineTheory.pdf): idealized thermodynamic relationships across engine components.
- [NASA Glenn — Gas Turbine Parts](https://www.grc.nasa.gov/WWW/K-12/BGP/enex.html): rotor, stator, turbine, compressor, and shaft relationships.
- [FAA — Airplane Flying Handbook, Chapter 16](https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/airplane_handbook/17_afh_ch16.pdf): turbofan sectional arrangement and bypass/core description.
- [NASA Technical Reports Server — Full Engine Three-Dimensional Flow Simulations of the GE90](https://ntrs.nasa.gov/citations/20000034013): establishes the scope and computational meaning of a whole-engine 3D flow solution.
- [NASA Advanced Supercomputing — Time-Accurate Turbofan Simulation](https://www.nas.nasa.gov/SC23/research/project4.html): reference for seeded-particle and blade-wake flow-visualization language.

The machine-readable source records live in `content/jet-engine.ts`. Visual and model processing provenance lives in `content/jet-engine-asset-licenses.json`.

## Model method

`lib/jet-engine/jet-engine-model.ts` implements an intentionally bounded zero-dimensional cycle:

1. U.S. standard-atmosphere lapse-rate relationships establish ambient pressure and temperature.
2. Flight Mach gives total inlet conditions; a 0.99 inlet pressure recovery is applied at station 2.
3. Fan and compressor temperature rise is calculated from pressure ratio and component efficiency.
4. The operating profile specifies representative turbine-inlet temperature at station 4; a 0.95 combustor pressure ratio represents pressure loss.
5. Turbine temperature drop balances modeled fan and compressor work. Cold-air and hot-gas properties are separated (`γ = 1.40 / 1.33`, `cp = 1004.5 / 1180 J·kg⁻¹·K⁻¹`).
6. Fan and core nozzle velocity use ideal expansion toward ambient pressure with 0.95 nozzle efficiency.
7. Specific net thrust combines fan and core momentum terms and is divided by total inlet mass flow. Because capture area and mass flow are undefined, the exhibit never reports absolute thrust in newtons or kilonewtons.

Shared assumptions include an 8:1 bypass ratio, 0.90 fan efficiency, 0.88 compressor efficiency, 0.90 turbine efficiency, 0.99 combustor efficiency, and 43 MJ/kg fuel lower-heating-value proxy. The four profiles are representative teaching points, not schedules from a named engine.

Internal duct velocity is deliberately shown as **Not resolved**. A zero-dimensional cycle without annulus areas and mass flow cannot support a truthful intermediate velocity readout. Only free-stream and ideal nozzle-exit speeds are displayed.

## Three-dimensional reconstruction and rights

The primary runtime object is “Turbine | Turbofan Engine | Jet Engine” by blenderbirb, licensed under CC BY 4.0. It is delivered as a 15.3 MB self-contained GLB with 235,778 triangles, 19 mesh/material groups, and embedded author/source/license metadata. The exhibit retains attribution in `public/assets/jet-engine/LICENSE.md` and in the machine-readable asset ledger. The object is an artist-authored generalized reconstruction, not a scan or production CAD model.

Loupe adds procedural museum lighting, orbit/zoom camera control, NASA station rings, cycle-linked pressure and temperature fields, qualitative seeded-particle flow, and explanatory concentric shafts. Those layers are project-authored and explicitly separated from the source geometry. The SVG section remains only as the accessible fallback when WebGL or the GLB cannot load.

The particle field is not a fluid solver. It depicts the functional split from shared intake to outer bypass and inner core, keeps the bypass stream comparatively cool, and maps core scalar color to the selected cycle. NASA's full-engine simulations require geometry, boundary conditions, turbulence models, and high-performance computation that this real-time exhibit does not claim to reproduce.

NASA and FAA pages are linked as references; their diagrams are not copied into the deliverable. Smithsonian object records considered during research were not used as image assets because their media carry separate usage conditions.

## Deliberate exclusions

- no AI-generated concept imagery, neon HUD, lens flare, decorative fireball, or fictional live telemetry;
- no independently adjustable airflow/fuel/speed sliders that can create impossible combinations;
- no fabricated live status, universal engine dimensions, unsupported stage counts, absolute thrust, or certification claims;
- no ambiguous-license NASA geometry dataset, restricted museum photography, or uncredited marketplace model;
- no control whose only effect is decorative selection styling.

## Acceptance and QA record

Verification completed 2026-08-23:

- 17 focused content, provenance, model, route, and interaction tests passed across four test files;
- strict TypeScript passed and the Next.js 16.3.0 webpack production build completed with the jet-engine route prerendered;
- four production-server Playwright paths passed at a 1440 × 900 desktop viewport, including the sourced GLB cold load, camera presets, station selection, airflow mode, operating-profile changes, the source notebook, absence of remote runtime assets, theme persistence, and reduced-motion behavior;
- the complete instrument passed the automated 390 × 844 mobile overflow and rail-scroll check;
- section, airflow, and thermal modes were visually inspected in the in-app hardware-accelerated browser at 1280 × 720 and 390 × 844, in light and dark themes;
- pointer drag visibly changed engine orientation, wheel scrolling changed camera distance, and station selection changed both the 3D focus and notebook content;
- pausing motion switches the renderer from continuous frames to on-demand rendering, and `prefers-reduced-motion` starts in that paused state;
- loading, WebGL timeout/failure fallback, retry, accessible section fallback, and route-error states are present;
- the final requirement audit found no placeholder assets, dead controls, external runtime dependencies, unsupported production-engine claims, or unlabeled simulated evidence.

Current screenshots are stored under `.design-audit/jet-engine-3d/` and are verification artifacts, not exhibit assets.
