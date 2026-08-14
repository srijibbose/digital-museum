# Thirteen Minutes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. The user explicitly prohibited commits and pushes, so verification replaces commit steps.

**Goal:** Build the complete, resilient `/exhibits/thirteen-minutes` Loupe exhibit with a reusable scroll-timeline system and historically checked telemetry.

**Architecture:** The route server-renders the complete exhibit from validated JSON. A single client coordinator progressively enhances the beat list with GSAP ScrollTrigger, Lenis, shared telemetry state, and non-scroll navigation; reusable presentational components remain content-agnostic.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, JSON, GSAP/ScrollTrigger, Lenis, CSS Modules, Vitest/Testing Library, Playwright.

## Global Constraints

- Route is exactly `/exhibits/thirteen-minutes` and remains standalone.
- Build in this order: static skeleton; HUD; progress/non-scroll navigation; motion/reduced motion; mobile/accessibility.
- `MissionHud`, `BeatSection`, and `ProgressRail` must not import `content.json`.
- All narrative content must remain readable in server HTML with JavaScript disabled.
- Reduced motion disables HUD pinning, digit transitions, and smooth scrolling.
- No optional 3D or audio in v1.
- No fabricated transcript URL, external fonts, images, or first-paint network dependencies.
- Preserve unrelated worktree changes and create no commits or pushes.

---

### Task 1: Validated content and static article

**Files:**
- Create: `app/exhibits/thirteen-minutes/types.ts`
- Create: `app/exhibits/thirteen-minutes/content.json`
- Create: `app/exhibits/thirteen-minutes/content.ts`
- Create: `app/exhibits/thirteen-minutes/page.tsx`
- Test: `tests/thirteen-minutes-content.test.ts`

**Interfaces:**
- Produces: `Telemetry`, `ExhibitBeat`, `ExhibitContent`, and `thirteenMinutesContent: ExhibitContent`.
- `Telemetry` is `{ met: string; altitude: string; fuel: string }`.
- `ExhibitBeat` extends telemetry with `{ id: string; label: string; body: string; quote: string | null }`.

- [ ] **Step 1: Write a failing content contract test**

```ts
import { describe, expect, it } from "vitest";
import { thirteenMinutesContent } from "@/app/exhibits/thirteen-minutes/content";

describe("Thirteen Minutes content", () => {
  it("contains the complete ordered exhibit and historically checked landing margin", () => {
    expect(thirteenMinutesContent.beats.map((beat) => beat.id)).toEqual([
      "approach", "course-check", "program-alarm", "go-call", "manual-control", "touchdown",
    ]);
    expect(thirteenMinutesContent.beats.at(-1)).toMatchObject({
      met: "102:45:40", altitude: "0 ft", fuel: "≈0:45",
    });
    expect(thirteenMinutesContent.goDeeper).not.toHaveProperty("url");
  });
});
```

- [ ] **Step 2: Run the focused test and confirm it fails because the module is absent**

Run: `pnpm vitest run tests/thirteen-minutes-content.test.ts`

- [ ] **Step 3: Implement strict types, JSON data, and a server page**

```ts
export type Telemetry = { met: string; altitude: string; fuel: string };
export type ExhibitBeat = Telemetry & {
  id: string;
  label: string;
  body: string;
  quote: string | null;
};
```

The page must export route metadata and render a `<main>` containing hook, context, timeline, takeaway, placeholder NASA note, and both related cards in source order. Use the fact-checked values described in the design spec and retain `≈` on inferred fuel values.

- [ ] **Step 4: Run the focused test and the existing content tests**

Run: `pnpm vitest run tests/thirteen-minutes-content.test.ts tests/living-atlas-content.test.ts`

- [ ] **Step 5: Inspect the diff for accidental changes outside the new route/tests/docs**

Run: `git -c safe.directory='C:/Users/Srijib/Downloads/projects/digital-museum' diff --stat`

---

### Task 2: Reusable HUD, beat, and rail components

**Files:**
- Create: `app/exhibits/thirteen-minutes/components/MissionHud.tsx`
- Create: `app/exhibits/thirteen-minutes/components/BeatSection.tsx`
- Create: `app/exhibits/thirteen-minutes/components/ProgressRail.tsx`
- Test: `tests/thirteen-minutes-components.test.tsx`

**Interfaces:**
- `MissionHudProps = { telemetry: Telemetry; activeLabel: string; beatNumber: number; beatCount: number; animate?: boolean }`.
- `BeatSectionProps = { beat: ExhibitBeat; ordinal: number; active: boolean; setElement?: (node: HTMLElement | null) => void }`.
- `ProgressRailProps = { beats: Array<Pick<ExhibitBeat, "id" | "label">>; activeIndex: number; onSelect: (index: number) => void }`.

- [ ] **Step 1: Write failing semantic and interaction tests**

```tsx
it("renders telemetry without knowing its content source", () => {
  render(<MissionHud telemetry={{ met: "001:02:03", altitude: "42 ft", fuel: "≈1:00" }} activeLabel="Test" beatNumber={1} beatCount={2} />);
  expect(screen.getByText("001:02:03")).toBeInTheDocument();
  expect(screen.getByLabelText(/mission telemetry/i)).toBeInTheDocument();
});

it("exposes every rail stop as a labelled 44px-class button", async () => {
  const onSelect = vi.fn();
  render(<ProgressRail beats={[{ id: "a", label: "Approach" }]} activeIndex={0} onSelect={onSelect} />);
  await userEvent.click(screen.getByRole("button", { name: /go to approach/i }));
  expect(onSelect).toHaveBeenCalledWith(0);
});
```

- [ ] **Step 2: Run and observe the missing-component failure**

Run: `pnpm vitest run tests/thirteen-minutes-components.test.tsx`

- [ ] **Step 3: Implement the three components using props only**

`MissionHud` uses `<dl>` for the three values and `aria-live="polite"` only on the active beat label. `BeatSection` uses `<article>`, a heading, optional `<blockquote>`, and an always-present `.staticTelemetry` fallback. `ProgressRail` uses `<nav aria-label="Mission progress"><ol>` with buttons and `aria-current="step"`.

- [ ] **Step 4: Run component tests and refactor only after green**

Run: `pnpm vitest run tests/thirteen-minutes-components.test.tsx`

- [ ] **Step 5: Run all unit tests to detect shared-style or setup regressions**

Run: `pnpm test`

---

### Task 3: Timeline coordinator and non-scroll navigation

**Files:**
- Create: `app/exhibits/thirteen-minutes/components/TimelineExperience.tsx`
- Modify: `app/exhibits/thirteen-minutes/page.tsx`
- Test: `tests/thirteen-minutes-timeline.test.tsx`

**Interfaces:**
- `TimelineExperienceProps = { beats: ExhibitBeat[] }`.
- Internal `selectBeat(index: number, behavior: ScrollBehavior, focus: boolean): void` is the only state-changing path used by rail, previous/next, and keyboard actions.

- [ ] **Step 1: Write failing navigation tests**

```tsx
it("keeps HUD, rail, and previous/next navigation on one active index", async () => {
  const user = userEvent.setup();
  render(<TimelineExperience beats={beats} />);
  await user.click(screen.getByRole("button", { name: /next: course check/i }));
  expect(screen.getByText(beats[1].met)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /go to course check/i })).toHaveAttribute("aria-current", "step");
  await user.click(screen.getByRole("button", { name: /previous: approach/i }));
  expect(screen.getByText(beats[0].met)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run and confirm failure because the coordinator is absent**

Run: `pnpm vitest run tests/thirteen-minutes-timeline.test.tsx`

- [ ] **Step 3: Implement state, refs, buttons, and keyboard behavior before scroll linking**

```ts
function clampIndex(index: number) {
  return Math.max(0, Math.min(beats.length - 1, index));
}
function selectBeat(index: number, behavior: ScrollBehavior, focus: boolean) {
  const next = clampIndex(index);
  setActiveIndex(next);
  beatRefs.current[next]?.scrollIntoView({ block: "center", behavior });
  if (focus) beatRefs.current[next]?.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
}
```

ArrowDown/PageDown/ArrowRight select the next beat; ArrowUp/PageUp/ArrowLeft select the previous beat; Home and End select the first and last beat. Ignore shortcuts originating in buttons or links so native activation remains intact.

- [ ] **Step 4: Run focused and full unit tests**

Run: `pnpm vitest run tests/thirteen-minutes-timeline.test.tsx && pnpm test`

---

### Task 4: Bidirectional scroll enhancement, Lenis, and reduced motion

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Modify: `app/exhibits/thirteen-minutes/components/TimelineExperience.tsx`
- Test: `tests/thirteen-minutes-timeline.test.tsx`

**Interfaces:**
- ScrollTrigger callbacks call `setActiveIndex(index)` on both `onEnter` and `onEnterBack`.
- A `useReducedMotion(): boolean` helper mirrors `(prefers-reduced-motion: reduce)` and responds to changes.

- [ ] **Step 1: Add a failing reduced-motion test with a controllable `matchMedia` stub**

```tsx
it("keeps local telemetry visible and marks the experience reduced when motion is reduced", () => {
  installMatchMedia(true);
  const { container } = render(<TimelineExperience beats={beats} />);
  expect(container.firstChild).toHaveAttribute("data-reduced-motion", "true");
  expect(screen.getAllByText(beats[0].altitude).length).toBeGreaterThan(0);
});
```

- [ ] **Step 2: Run the test and confirm the missing reduced-motion state**

Run: `pnpm vitest run tests/thirteen-minutes-timeline.test.tsx`

- [ ] **Step 3: Add `lenis` and implement progressive enhancement**

Run: `pnpm add lenis`

Register ScrollTrigger only in the client effect. When motion is allowed, create one trigger per beat with `start: "top center"`, `end: "bottom center"`, `onEnter`, and `onEnterBack`; create Lenis with `lerp: 0.085`, `wheelMultiplier: 0.88`, and `touchMultiplier: 1`. Drive Lenis from `gsap.ticker` and call `ScrollTrigger.update` on Lenis scroll. Kill all route-owned triggers, remove the ticker callback, and destroy Lenis in cleanup. When reduced motion is active, skip both libraries and use instant navigation.

- [ ] **Step 4: Run focused tests, typecheck through build, and confirm no effect leaks**

Run: `pnpm vitest run tests/thirteen-minutes-timeline.test.tsx`

---

### Task 5: Award-level responsive styling and motion

**Files:**
- Create: `app/exhibits/thirteen-minutes/thirteen-minutes.module.css`
- Modify: all four route components to attach module classes
- Test: `tests/thirteen-minutes-components.test.tsx`

**Interfaces:**
- CSS exposes `page`, `hook`, `timeline`, `hud`, `staticTelemetry`, `beat`, `activeBeat`, `rail`, `controls`, `takeaway`, and `related` module keys.

- [ ] **Step 1: Add failing class/state assertions for active and reduced modes**

```tsx
expect(screen.getByTestId("mission-hud")).toHaveAttribute("data-animate", "true");
expect(screen.getByTestId("beat-approach")).toHaveAttribute("data-active", "true");
```

- [ ] **Step 2: Run the focused test and observe missing attributes**

Run: `pnpm vitest run tests/thirteen-minutes-components.test.tsx`

- [ ] **Step 3: Implement the approved design tokens and responsive states**

```css
.page {
  --space: #070a0b;
  --panel: #0d1212;
  --phosphor: #f2b84b;
  --paper: #e9e1cf;
  --muted: #97a59a;
  --instrument-ease: cubic-bezier(.22, .72, .18, 1);
  background: var(--space);
  color: var(--paper);
  overflow: clip;
}
.beat { min-height: 92svh; padding: clamp(7rem, 18svh, 12rem) clamp(1.25rem, 8vw, 8rem); }
@media (prefers-reduced-motion: reduce) {
  .hud { position: relative; }
  .staticTelemetry { display: grid; }
  .digit { transition: none; transform: none; }
}
```

Build the seven-segment digits from seven absolutely positioned spans per numeral, activated through a segment map. Tick duration is 320ms; copy entrance is 520ms; active rail movement is 380ms. At widths below 720px the HUD becomes a two-row grid and the progress rail becomes a horizontally scrollable bottom strip with safe-area padding.

- [ ] **Step 4: Run unit tests and build**

Run: `pnpm test && pnpm build`

---

### Task 6: Browser-level definition-of-done coverage

**Files:**
- Create: `e2e/thirteen-minutes.spec.ts`
- Modify: `playwright.config.ts` to add a 390×844 mobile Chromium project if it can run the existing suite without changing current desktop behavior

**Interfaces:**
- The route exposes `data-active-beat`, `data-reduced-motion`, stable section IDs, and semantic labels used by Playwright rather than visual CSS selectors.

- [ ] **Step 1: Write end-to-end tests for every brief requirement**

```ts
test("updates in both directions and mirrors non-scroll navigation", async ({ page }) => {
  await page.goto("/exhibits/thirteen-minutes");
  await page.getByTestId("beat-touchdown").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("timeline")).toHaveAttribute("data-active-beat", "touchdown");
  await page.getByTestId("beat-program-alarm").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("timeline")).toHaveAttribute("data-active-beat", "program-alarm");
  await page.getByRole("button", { name: /go to manual control/i }).click();
  await expect(page.getByTestId("timeline")).toHaveAttribute("data-active-beat", "manual-control");
});

test("has no narrow-screen horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/exhibits/thirteen-minutes");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});
```

Also test reduced motion via `page.emulateMedia`, keyboard Home/End and arrows, all six static telemetry groups, the placeholder transcript note as non-link text, no browser errors, and the page with JavaScript disabled using a dedicated browser context.

- [ ] **Step 2: Run the new tests and confirm failures before final fixes**

Run: `pnpm playwright test e2e/thirteen-minutes.spec.ts --project=desktop-chromium`

- [ ] **Step 3: Make only evidence-driven fixes and add regression assertions first**

For each failure, add or tighten the assertion that reproduces it, observe the failure, then change route code or CSS.

- [ ] **Step 4: Run the full verification matrix**

Run: `pnpm test`

Run: `pnpm build`

Run: `pnpm playwright test`

- [ ] **Step 5: Audit the Section 13 checklist against rendered evidence**

Record evidence for exact/fact-corrected copy, bidirectional HUD, navigation parity, reduced/no-JS reading order, 390×844 overflow, request timing, and the deliberate absence of 3D. Re-check `git status --short` to prove no commit/push action and no unrelated file modification.

---

### Task 7: Local runtime handoff

**Files:** None.

- [ ] **Step 1: Start the verified production server**

Run: `pnpm start`

- [ ] **Step 2: Confirm the route returns HTTP 200 and renders its heading**

Open `http://localhost:3000/exhibits/thirteen-minutes` and check the browser console and network panel once more.

- [ ] **Step 3: Report the local URL, factual corrections, skipped optional work, and deviations**

The handoff must state that 3D/audio were skipped, the NASA URL remains a placeholder, fuel estimates are visibly flagged, and the supplied seventeen-second landing claim was corrected to NASA's postflight estimate of about 45 seconds.
