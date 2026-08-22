# Sun and Jupiter Living Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Sun's pulsing duplicate shell and Jupiter's rotating transparent duplicate with seamless, mode-specific plasma and atmospheric motion inside the existing Atlas of Worlds modes.

**Architecture:** Pure deterministic motion profiles and math live in `lib/space/celestial-motion.ts`. Two focused React Three Fiber renderers consume those profiles: `SolarDynamicWorld` preserves the corrected triplanar solar projection while adding local plasma distortion, a limb-only corona, and deterministic flowing arcs; `JovianDynamicWorld` applies smooth latitude-dependent jet advection, an anchored local Great Red Spot vortex, a wake, and aurora-only polar emission. `AtlasCanvas` selects these renderers without adding store state or tabs.

**Tech Stack:** Next.js 16.3 App Router, React 19, TypeScript, React Three Fiber, Three.js GLSL shaders, Vitest, Testing Library.

**Spec:** `docs/superpowers/specs/2026-08-22-sun-jupiter-living-motion-design.md`

## Global Constraints

- Preserve all existing Sun and Jupiter mode IDs, tabs, hotspot IDs, route behavior, and the single Motion control.
- Keep NASA/SDO and Cassini imagery as the visible source layer; qualify generated movement as an accelerated, evidence-informed visualization.
- Do not add video, new textures, sound, a transparent duplicate globe, centre haze, or a new tab.
- Motion off and `prefers-reduced-motion` must freeze a coherent frame; compare mode must be static.
- The Great Red Spot centre remains fixed under its authored hotspot while local cloud sampling circulates counter-clockwise.
- Affected modes must remain visually complete on desktop, short desktop, tablet, and mobile.
- Preserve the static WebGL/texture fallback and accessible renderer description.

---

### Task 1: Deterministic celestial motion model

**Files:**
- Create: `lib/space/celestial-motion.ts`
- Create: `tests/celestial-motion.test.ts`

**Interfaces:**
- Produces: `getSolarMotionProfile(modeId)`, `getJovianMotionProfile(modeId)`, `jovianJetVelocity(latitudeDeg)`, `jovianVortexSample(uv, phase)`, `advanceMotionPhase(phase, delta, enabled, speed)`, and `resolveLivingMotionRenderer(worldId, modeId, motion)`.
- Consumed by: both specialised world renderers and `AtlasCanvas`.

- [ ] **Step 1: Write the failing behavior tests**

Create `tests/celestial-motion.test.ts` with hand-derived expectations:

```ts
import { describe, expect, it } from "vitest";
import {
  advanceMotionPhase,
  getJovianMotionProfile,
  getSolarMotionProfile,
  jovianJetVelocity,
  jovianVortexSample,
  resolveLivingMotionRenderer,
} from "@/lib/space/celestial-motion";

describe("celestial motion model", () => {
  it("gives each observational solar wavelength a distinct authored character", () => {
    const photosphere = getSolarMotionProfile("photosphere")!;
    const quietCorona = getSolarMotionProfile("171")!;
    const hotCorona = getSolarMotionProfile("193")!;
    const chromosphere = getSolarMotionProfile("304")!;

    expect(photosphere.arcCount).toBeLessThan(quietCorona.arcCount);
    expect(hotCorona.pulseSpeed).toBeGreaterThan(quietCorona.pulseSpeed);
    expect(chromosphere.prominenceStrength).toBeGreaterThan(photosphere.prominenceStrength);
    expect(new Set([photosphere.flowScale, quietCorona.flowScale, hotCorona.flowScale, chromosphere.flowScale]).size).toBe(4);
    expect(getSolarMotionProfile("interior")).toBeNull();
  });

  it("produces smooth alternating Jovian zonal flow", () => {
    expect(jovianJetVelocity(0)).toBeGreaterThan(0.5);
    expect(jovianJetVelocity(9)).toBeLessThan(-0.5);
    expect(Math.abs(jovianJetVelocity(8.99) - jovianJetVelocity(9.01))).toBeLessThan(0.02);
    expect(jovianJetVelocity(85)).toBeLessThan(0.35);
  });

  it("keeps the Great Red Spot centre fixed while rotating nearby samples counter-clockwise", () => {
    const centre = jovianVortexSample({ u: 0.6083, v: 0.4 }, 1);
    const easternEdge = jovianVortexSample({ u: 0.64, v: 0.4 }, 1);
    const distant = jovianVortexSample({ u: 0.2, v: 0.8 }, 1);

    expect(centre).toMatchObject({ u: 0.6083, v: 0.4, influence: 1 });
    expect(easternEdge.v).toBeGreaterThan(0.4);
    expect(easternEdge.influence).toBeGreaterThan(0);
    expect(distant).toEqual({ u: 0.2, v: 0.8, influence: 0 });
  });

  it("freezes accumulated phase exactly when motion is disabled", () => {
    expect(advanceMotionPhase(2.5, 0.5, false, 3)).toBe(2.5);
    expect(advanceMotionPhase(2.5, 0.5, true, 3)).toBe(4);
  });

  it("selects living renderers only for scientifically relevant existing modes", () => {
    expect(resolveLivingMotionRenderer("sun", "171", "solar")).toBe("solar");
    expect(resolveLivingMotionRenderer("sun", "interior", "none")).toBeNull();
    expect(resolveLivingMotionRenderer("jupiter", "storms", "atmosphere")).toBe("jovian");
    expect(resolveLivingMotionRenderer("jupiter", "interior", "none")).toBeNull();
    expect(resolveLivingMotionRenderer("neptune", "storms", "atmosphere")).toBeNull();
  });

  it("distinguishes Jupiter storm and aurora layers without animating explanatory modes", () => {
    expect(getJovianMotionProfile("storms")).toMatchObject({ vortexStrength: expect.any(Number), auroraStrength: 0 });
    expect(getJovianMotionProfile("auroras")).toMatchObject({ auroraStrength: expect.any(Number) });
    expect(getJovianMotionProfile("moons")).toBeNull();
  });
});
```

- [ ] **Step 2: Run the focused test and verify the missing-module failure**

Run:

```powershell
& 'C:\Users\Srijib\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' 'node_modules\vitest\vitest.mjs' run tests/celestial-motion.test.ts
```

Expected: FAIL because `@/lib/space/celestial-motion` does not exist.

- [ ] **Step 3: Implement the minimal deterministic model**

Create `lib/space/celestial-motion.ts` with these public types and values:

```ts
import type { WorldId, WorldMode } from "@/lib/space/atlas-schema";

export type SolarMotionProfile = {
  flowScale: number;
  flowSpeed: number;
  distortion: number;
  pulseSpeed: number;
  coronaOpacity: number;
  coronaExtent: number;
  arcCount: number;
  arcSpeed: number;
  prominenceStrength: number;
  tint: string;
};

export type JovianMotionProfile = {
  jetSpeed: number;
  warpStrength: number;
  vortexStrength: number;
  wakeStrength: number;
  auroraStrength: number;
};

const SOLAR_PROFILES = {
  photosphere: { flowScale: 8.2, flowSpeed: 0.11, distortion: 0.008, pulseSpeed: 0.42, coronaOpacity: 0.1, coronaExtent: 1.045, arcCount: 5, arcSpeed: 0.18, prominenceStrength: 0.26, tint: "#fff1cf" },
  "171": { flowScale: 5.4, flowSpeed: 0.075, distortion: 0.011, pulseSpeed: 0.32, coronaOpacity: 0.16, coronaExtent: 1.075, arcCount: 11, arcSpeed: 0.14, prominenceStrength: 0.34, tint: "#e3d86e" },
  "193": { flowScale: 6.6, flowSpeed: 0.13, distortion: 0.009, pulseSpeed: 0.68, coronaOpacity: 0.14, coronaExtent: 1.065, arcCount: 8, arcSpeed: 0.22, prominenceStrength: 0.3, tint: "#d4df78" },
  "304": { flowScale: 9.6, flowSpeed: 0.16, distortion: 0.013, pulseSpeed: 0.55, coronaOpacity: 0.18, coronaExtent: 1.085, arcCount: 9, arcSpeed: 0.25, prominenceStrength: 0.62, tint: "#ff7b35" },
} satisfies Record<string, SolarMotionProfile>;

const JOVIAN_PROFILES = {
  clouds: { jetSpeed: 0.36, warpStrength: 0.003, vortexStrength: 0.22, wakeStrength: 0.08, auroraStrength: 0 },
  storms: { jetSpeed: 0.48, warpStrength: 0.006, vortexStrength: 0.92, wakeStrength: 0.68, auroraStrength: 0 },
  auroras: { jetSpeed: 0.24, warpStrength: 0.002, vortexStrength: 0.16, wakeStrength: 0.04, auroraStrength: 0.78 },
} satisfies Record<string, JovianMotionProfile>;

export function getSolarMotionProfile(modeId: string) {
  return SOLAR_PROFILES[modeId as keyof typeof SOLAR_PROFILES] ?? null;
}

export function getJovianMotionProfile(modeId: string) {
  return JOVIAN_PROFILES[modeId as keyof typeof JOVIAN_PROFILES] ?? null;
}

export function jovianJetVelocity(latitudeDeg: number) {
  const radians = latitudeDeg * Math.PI / 180;
  const alternating = Math.sin((radians + 4.5 * Math.PI / 180) * 20);
  const polarEnvelope = 0.28 + 0.72 * Math.cos(radians) ** 2;
  return alternating * polarEnvelope;
}

export function jovianVortexSample(uv: { u: number; v: number }, phase: number) {
  const centre = { u: 0.6083, v: 0.4 };
  const x = (uv.u - centre.u) / 0.07;
  const y = (uv.v - centre.v) / 0.045;
  const radiusSquared = x * x + y * y;
  if (radiusSquared >= 1) return { ...uv, influence: 0 };
  const influence = (1 - radiusSquared) ** 2;
  const angle = phase * 0.22 * influence;
  const rotatedX = x * Math.cos(angle) - y * Math.sin(angle);
  const rotatedY = x * Math.sin(angle) + y * Math.cos(angle);
  return {
    u: Number((centre.u + rotatedX * 0.07).toFixed(4)),
    v: Number((centre.v + rotatedY * 0.045).toFixed(4)),
    influence: Number(influence.toFixed(4)),
  };
}

export function advanceMotionPhase(phase: number, delta: number, enabled: boolean, speed = 1) {
  return enabled ? phase + Math.min(delta, 0.1) * speed : phase;
}

export function resolveLivingMotionRenderer(worldId: WorldId, modeId: string, motion: WorldMode["motion"]) {
  if (worldId === "sun" && motion === "solar" && getSolarMotionProfile(modeId)) return "solar" as const;
  if (worldId === "jupiter" && motion === "atmosphere" && getJovianMotionProfile(modeId)) return "jovian" as const;
  return null;
}
```

If a hand-checked literal in the test exposes a sign or coordinate mismatch, correct the implementation while preserving the specified counter-clockwise and centre-preserving behavior; do not weaken the assertion.

- [ ] **Step 4: Run the focused test and verify green**

Run the Task 1 command again. Expected: 6 tests pass.

---

### Task 2: Scientific content and accessibility contract

**Files:**
- Modify: `content/space/atlas.ts`
- Modify: `components/space/AtlasStage.tsx`
- Modify: `components/space/AtlasFallback.tsx`
- Modify: `tests/atlas-content.test.ts`
- Modify: `tests/atlas-renderer.test.tsx`

**Interfaces:**
- Consumes: existing mode IDs and `WorldMode.motion`.
- Produces: evidence-qualified visitor copy, non-visual descriptions, and static fallbacks for the new motion behavior.

- [ ] **Step 1: Add failing content and renderer-description tests**

Add assertions that catch silent overclaiming or accidental new modes:

```ts
const sun = getWorld("sun");
const jupiter = getWorld("jupiter");

expect(sun.modes.map((mode) => mode.id)).toEqual([
  "photosphere", "171", "193", "304", "magnetic", "interior",
]);
for (const id of ["photosphere", "171", "193", "304"]) {
  expect(getMode(sun, id).visibleChange).toMatch(/motion visualization/i);
}
for (const id of ["clouds", "storms", "auroras"]) {
  expect(getMode(jupiter, id).visibleChange).toMatch(/motion visualization/i);
}
expect(getMode(jupiter, "interior").motion).toBe("none");
```

Extend `worldRenderDescription` tests:

```ts
expect(worldRenderDescription(sun, getMode(sun, "171"))).toMatch(/accelerated motion visualization/i);
expect(worldRenderDescription(jupiter, getMode(jupiter, "storms"))).toMatch(/accelerated motion visualization/i);
expect(worldRenderDescription(jupiter, getMode(jupiter, "interior"))).not.toMatch(/accelerated motion visualization/i);
```

Add a fallback assertion:

```ts
render(<AtlasFallback world={jupiter} mode={getMode(jupiter, "storms")} />);
expect(screen.getByText(/atmospheric motion requires interactive 3d/i)).toBeInTheDocument();
expect(screen.getByRole("img", { name: /jupiter storms scientific map/i })).toBeInTheDocument();
```

- [ ] **Step 2: Run the two focused suites and verify expected copy failures**

Run:

```powershell
& 'C:\Users\Srijib\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' 'node_modules\vitest\vitest.mjs' run tests/atlas-content.test.ts tests/atlas-renderer.test.tsx
```

Expected: FAIL because the current copy describes generic subtle motion and the fallback has no motion qualification.

- [ ] **Step 3: Update mode copy and descriptions without changing the mode list**

Use concise close-to-renderer wording. Required phrases:

```ts
// Sun example
visibleChange: "Uses processed SDO 171 Å imagery with a wavelength-specific accelerated motion visualization of quiet-corona flow and magnetic loops."

// Jupiter example
visibleChange: "Uses the processed Cassini cloud map with an accelerated motion visualization of differential zonal jets."
```

Append to `worldRenderDescription` only when `resolveLivingMotionRenderer(...)` returns a renderer:

```ts
const motionQualification = resolveLivingMotionRenderer(world.id, mode.id, mode.motion)
  ? " Movement is an accelerated, evidence-informed motion visualization over the delivered scientific imagery."
  : "";
```

Add fallback copy for affected modes:

```tsx
{resolveLivingMotionRenderer(world.id, mode.id, mode.motion) ? (
  <p>Atmospheric motion requires interactive 3D. The delivered scientific source map remains available here.</p>
) : null}
```

- [ ] **Step 4: Run the focused suites and verify green**

Run the Task 2 command again. Expected: both files pass.

---

### Task 3: Seamless wavelength-specific solar renderer

**Files:**
- Create: `components/space/SolarDynamicWorld.tsx`
- Modify: `lib/space/solar-projection.ts`
- Modify: `tests/atlas-solar-projection.test.ts`

**Interfaces:**
- Consumes: `THREE.Texture`, stage radius, existing Sun mode ID, `motionEnabled`, and `reducedMotion`.
- Produces: `<SolarDynamicWorld />`, containing the source-texture surface, limb-only corona, and deterministic flowing arcs.

- [ ] **Step 1: Add failing deterministic arc and projection tests**

Extend `solar-projection.ts`'s public pure contract with `solarActivitySeeds(modeId, compact)` and add:

```ts
it("authors deterministic solar activity without changing the corrected disc projection", () => {
  expect(solarActivitySeeds("171", false).slice(0, 2)).toEqual([
    { latitude: -24, longitude: -128, height: 0.19, phase: 0.13 },
    { latitude: 12, longitude: -76, height: 0.24, phase: 0.37 },
  ]);
  expect(solarActivitySeeds("171", true)).toHaveLength(7);
  expect(solarActivitySeeds("171", false)).toHaveLength(11);
  expect(solarDiscUv(1, 1)).toEqual({ u: 0.642, v: 0.224 });
});
```

- [ ] **Step 2: Run the solar projection suite and verify the missing-function failure**

Run:

```powershell
& 'C:\Users\Srijib\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' 'node_modules\vitest\vitest.mjs' run tests/atlas-solar-projection.test.ts
```

Expected: FAIL because `solarActivitySeeds` is not exported.

- [ ] **Step 3: Add deterministic activity seeds**

Add a fixed 12-item source array to `solar-projection.ts`, return the profile's requested count, and reduce that count by four for compact rendering. The first two items and 171 Å counts must match Step 1 exactly. Derive the remaining entries from fixed literals covering both hemispheres and multiple longitudes; never call `Math.random()`.

- [ ] **Step 4: Implement `SolarDynamicWorld`**

The component contract is:

```ts
type SolarDynamicWorldProps = {
  texture: THREE.Texture;
  radius: number;
  modeId: string;
  enabled: boolean;
  reducedMotion: boolean;
  compact: boolean;
};
```

Implementation requirements:

```tsx
const profile = getSolarMotionProfile(modeId);
const phase = useRef(0);
const surface = useRef<THREE.ShaderMaterial>(null);
const corona = useRef<THREE.ShaderMaterial>(null);

useFrame((_, delta) => {
  if (!profile) return;
  phase.current = advanceMotionPhase(phase.current, delta, enabled && !reducedMotion, profile.flowSpeed);
  if (surface.current) surface.current.uniforms.motionPhase.value = phase.current;
  if (corona.current) corona.current.uniforms.motionPhase.value = phase.current;
});
```

The surface fragment shader must retain the existing triplanar UV construction using `SOLAR_DISC_U_SCALE` and `SOLAR_DISC_V_SCALE`. Before building the three UV pairs, perturb the normal with three continuous object-space noise samples whose maximum magnitude is `profile.distortion`. Sample the source texture once per projection plane, blend with the existing fourth-power normal weights, and modulate brightness locally by at most 8%. Do not rotate a texture layer or alter the sphere scale.

The corona shader must derive alpha from view-space Fresnel:

```glsl
float limb = pow(1.0 - abs(dot(normalize(vNormalView), normalize(vViewDirection))), 2.6);
float activity = 0.82 + 0.18 * sin(vObjectPosition.y * 17.0 + motionPhase * 1.7);
gl_FragColor = vec4(coronaColor, coronaOpacity * limb * activity);
```

Generate each arc from a deterministic seed using `latLonToVector3`, a raised midpoint, and `THREE.QuadraticBezierCurve3`. Render a capped `tubeGeometry` with an additive shader whose bright packet moves along `vUv.x` using `fract(vUv.x * 1.8 - motionPhase * profile.arcSpeed - seed.phase)`. Use depth testing, disable depth writes, and keep the arc count equal to `solarActivitySeeds(modeId, compact).length`.

- [ ] **Step 5: Run the solar projection and type-check gates**

Run the Task 3 test command, then:

```powershell
& 'C:\Users\Srijib\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' 'node_modules\typescript\bin\tsc' --noEmit
```

Expected: tests pass and TypeScript exits 0.

---

### Task 4: Differential Jovian jets, vortex, wake, and auroras

**Files:**
- Create: `components/space/JovianDynamicWorld.tsx`
- Modify: `tests/celestial-motion.test.ts`

**Interfaces:**
- Consumes: Jupiter texture, stage radius, current Jupiter mode ID, `motionEnabled`, and `reducedMotion`.
- Produces: `<JovianDynamicWorld />`, with one opaque atmosphere surface and an aurora-only polar shell.

- [ ] **Step 1: Add a failing seam-wrapping and localisation test**

Add pure helper `wrapTextureU` to the wished-for API and test:

```ts
expect(wrapTextureU(1.03)).toBeCloseTo(0.03, 6);
expect(wrapTextureU(-0.04)).toBeCloseTo(0.96, 6);
expect(jovianVortexSample({ u: 0.69, v: 0.4 }, 1).influence).toBe(0);
```

Run `tests/celestial-motion.test.ts`. Expected: FAIL because `wrapTextureU` is missing.

- [ ] **Step 2: Implement wrapping and verify green**

Implement:

```ts
export function wrapTextureU(value: number) {
  return ((value % 1) + 1) % 1;
}
```

Run the focused suite. Expected: pass.

- [ ] **Step 3: Implement `JovianDynamicWorld`**

The component contract is:

```ts
type JovianDynamicWorldProps = {
  texture: THREE.Texture;
  radius: number;
  modeId: string;
  enabled: boolean;
  reducedMotion: boolean;
};
```

Use one opaque shader surface. Its fragment shader must:

1. Convert `vUv.y` to latitude.
2. Compute `jet = sin((latitude + radians(4.5)) * 20.0) * (0.28 + 0.72 * pow(cos(latitude), 2.0))`.
3. Offset `u` by `motionPhase * profile.jetSpeed * 0.012 * jet` and wrap with `fract`.
4. Add a wake-only `u`/`v` perturbation centred near `v = 0.4`, scaled by `profile.wakeStrength` and faded outside the South Tropical Zone.
5. Compute an elliptical Great Red Spot mask around `vec2(0.6083, 0.4)`. Inside it, rotate the unadvected local sample counter-clockwise and mix it over the jet sample using a twice-smoothed radial influence. The centre sample remains unchanged.
6. Sample the delivered texture once from the final UV and apply no global opacity.

Use the same accumulated-phase rule as the solar component. Do not use `state.clock.elapsedTime`.

For `auroras`, add one sphere at `scale={1.022}` with a shader whose opacity is zero below `abs(normal.y) = 0.7`, rises into two polar ovals, and contains longitudinal curtain bands that advance with phase. The shell is additive, `depthWrite={false}`, and capped below 0.34 alpha so the Cassini map stays visible.

- [ ] **Step 4: Run the celestial model suite and type-check**

Run the Task 1 test command and the TypeScript command. Expected: both pass.

---

### Task 5: Atlas renderer integration without new tabs or state

**Files:**
- Modify: `components/space/AtlasCanvas.tsx`
- Modify: `components/space/AtlasStage.tsx`
- Modify: `tests/atlas-renderer.test.tsx`
- Modify: `tests/atlas-interface.test.tsx`

**Interfaces:**
- Consumes: both specialised renderers and `resolveLivingMotionRenderer`.
- Produces: correct renderer selection, compare freezing, unchanged controls, and no Jupiter duplicate atmosphere.

- [ ] **Step 1: Add failing integration assertions**

Add renderer-contract assertions:

```ts
expect(resolveLivingMotionRenderer("sun", "304", getMode(sun, "304").motion)).toBe("solar");
expect(resolveLivingMotionRenderer("jupiter", "auroras", getMode(jupiter, "auroras").motion)).toBe("jovian");
expect(resolveLivingMotionRenderer("jupiter", "magnetosphere", getMode(jupiter, "magnetosphere").motion)).toBeNull();
```

Extend the interface suite to prove the existing mode count and the single Motion switch:

```ts
render(<AtlasExperience initialWorld="sun" />);
expect(screen.getAllByRole("tab")).toHaveLength(6);
expect(screen.getAllByRole("button", { name: /turn motion off/i })).toHaveLength(1);
```

Switch to Jupiter and assert its existing six tabs remain and the same control changes to `Turn motion on` after one click.

- [ ] **Step 2: Run renderer and interface suites and verify any integration gap fails**

Run:

```powershell
& 'C:\Users\Srijib\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' 'node_modules\vitest\vitest.mjs' run tests/atlas-renderer.test.tsx tests/atlas-interface.test.tsx
```

- [ ] **Step 3: Integrate specialised renderers**

In `ProceduralWorld`, compute:

```ts
const livingRenderer = resolveLivingMotionRenderer(world.id, modeId, layers.motion);
```

Select the main surface in this order: Mars Deep Time, official Saturn, temperature, solar, Jovian, generic. Pass `activeMotion` into both specialisations and pass `compact={stageRadius < 0.9}` into the Sun.

Remove the old `SolarFlow` render. Change the generic `AtmosphericFlow` condition to:

```tsx
{layers.motion === "atmosphere" && !isSaturn && world.id !== "jupiter" ? (
  <AtmosphericFlow texture={colorTexture} radius={stageRadius} enabled={activeMotion} />
) : null}
```

In `Scene`, pass `motionEnabled={props.motionEnabled && !compareOpen}` to the primary `ProceduralWorld` so compare mode freezes specialised motion. Keep the comparison world static as it is now.

Delete `SolarSurfaceMaterial`, `SolarFlow`, and their unused imports from `AtlasCanvas.tsx` after `SolarDynamicWorld` owns the complete solar path.

- [ ] **Step 4: Run focused suites and type-check**

Run the Task 5 test command and TypeScript. Expected: all pass.

---

### Task 6: Focused regression, fallback, and motion-control verification

**Files:**
- Modify: `tests/atlas-solar-projection.test.ts`
- Modify: `tests/atlas-content.test.ts`
- Modify: `tests/atlas-interface.test.tsx`
- Modify: `tests/atlas-renderer.test.tsx`
- Modify only if failures expose a real defect: affected production files from Tasks 1–5.

**Interfaces:**
- Validates the completed source/content/renderer/control contract before browser QA.

- [ ] **Step 1: Run all directly affected suites**

```powershell
& 'C:\Users\Srijib\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' 'node_modules\vitest\vitest.mjs' run tests/celestial-motion.test.ts tests/atlas-solar-projection.test.ts tests/atlas-content.test.ts tests/atlas-renderer.test.tsx tests/atlas-interface.test.tsx tests/atlas-store.test.ts
```

Expected: all affected suites pass with no new warnings.

- [ ] **Step 2: Run the full automated and production gates**

```powershell
& 'C:\Users\Srijib\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' 'node_modules\vitest\vitest.mjs' run --reporter=dot
& 'C:\Users\Srijib\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' 'node_modules\typescript\bin\tsc' --noEmit
& 'C:\Users\Srijib\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' 'node_modules\next\dist\bin\next' build
git diff --check
```

Run each command separately. Expected: all tests pass, TypeScript exits 0, production build succeeds, and diff check reports no whitespace errors.

---

### Task 7: Browser refinement and premium completion audit

**Files:**
- Modify only when final-state browser evidence exposes a root-cause defect.

**Interfaces:**
- Produces: visual and interaction evidence required by the design specification and premium standard.

- [ ] **Step 1: Inspect all four Sun observational modes at desktop size**

Use the in-app browser at a representative desktop viewport. For Photosphere, 171 Å, 193 Å, and 304 Å:

- observe at least ten seconds;
- capture two frames several seconds apart to prove local evolution;
- rotate through the former projection-problem longitude;
- verify the source texture remains crisp;
- verify the surface rotates with the globe;
- verify no vertical belt, black bar, seam, centre haze, or detached ribbon;
- confirm each wavelength has a visibly different activity character; and
- toggle Motion off/on and compare frames to prove exact freeze/resume.

- [ ] **Step 2: Inspect Jupiter Clouds, Storms, and Auroras at desktop size**

- confirm adjacent belts visibly move at different rates/directions;
- rotate across the texture seam without a flash or tear;
- open Storms and focus the Great Red Spot;
- confirm the spot centre remains under its marker while internal detail circulates counter-clockwise;
- confirm wake activity is local and the rest of the map does not smear;
- confirm Auroras adds polar curtains without washing the whole globe; and
- confirm Motion off/on and compare mode freeze every specialised layer.

- [ ] **Step 3: Inspect short desktop and mobile compositions**

At approximately 1280×720 and 390×844, verify the existing command deck, six tabs, feature list, and field guide retain their composition. Confirm no new overflow, clipped globe, obscured hotspot, or oversized corona.

- [ ] **Step 4: Inspect reduced motion, fallback, and logs**

Emulate reduced motion in the in-app browser and confirm both worlds render complete static compositions with no phase advancement. Confirm the renderer's static fallback still contains the source image and motion explanation when WebGL is unavailable through the existing automated fallback test. Review browser logs and resolve every new application or shader error.

- [ ] **Step 5: Repeat automated gates after the final visual correction**

If browser QA required any source edit, rerun the full Task 6 gates from the final state. Record the final test count, TypeScript result, production-build result, viewport evidence, and any deliberate limitation before declaring completion.
