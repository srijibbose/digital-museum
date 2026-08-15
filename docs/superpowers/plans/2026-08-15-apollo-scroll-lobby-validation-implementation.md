# Apollo Scroll, Lobby Visibility, and Validation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Apollo scrolling reliable across pointer types, hide The Living Atlas only from the homepage, and leave trustworthy desktop/mobile regression coverage.

**Architecture:** Native browser scrolling is the sole scroll owner; GSAP ScrollTrigger observes native position but never intercepts wheel or touch input. Exhibit publication (`enabled`) stays separate from lobby promotion (`featured`), and the homepage derives both cards and wing metadata from the featured set.

**Tech Stack:** Next.js 16.3 App Router, React 19, TypeScript 7, GSAP ScrollTrigger, Vitest/Testing Library, Playwright.

## Global Constraints

- Start from `origin/feat/thirteen-minutes-refinements` commit `35626e0`; local-ahead history is preserved on `codex/thirteen-minutes-local-ahead-backup`.
- The Living Atlas route and all anatomy code remain available; only homepage discovery is removed.
- Mouse, trackpad, touch, keyboard, reduced-motion, and no-JavaScript paths remain supported.
- Run validation against the production Next.js build.
- Do not introduce new runtime dependencies.

---

### Task 1: Native Apollo scroll ownership

**Files:**
- Modify: `e2e/thirteen-minutes.spec.ts`
- Modify: `app/exhibits/thirteen-minutes/components/TimelineExperience.tsx`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Test: `tests/thirteen-minutes-timeline.test.tsx`

**Interfaces:**
- Consumes: browser-native `scroll` events, `ScrollTrigger.create`, `centeredBeatIndex`, and `HTMLElement.scrollIntoView`.
- Produces: deterministic `selectBeat(index, focus?)` behavior and native wheel scrolling with no Lenis interception.

- [ ] **Step 1: Add the failing real-wheel regression**

Add this Playwright case after the existing bidirectional scroll test:

```ts
test("keeps mouse-wheel scrolling responsive on touch-capable desktop browsers", async ({ page }) => {
  await page.goto(route);
  const timeline = page.getByTestId("timeline");
  await timeline.evaluate((element) => {
    window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY + 20, behavior: "instant" });
  });
  const before = await page.evaluate(() => window.scrollY);

  await page.mouse.wheel(0, 700);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(before + 500);

  await page.mouse.wheel(0, 700);
  await expect(timeline).not.toHaveAttribute("data-active-beat", "approach");
});
```

- [ ] **Step 2: Run red tests and confirm the expected failures**

Run:

```powershell
pnpm test -- tests/thirteen-minutes-timeline.test.tsx
pnpm test:e2e -- e2e/thirteen-minutes.spec.ts --grep "mouse-wheel"
```

Expected: the unit suite fails because beat jumps still use smooth scrolling; the Playwright test times out because wheel movement remains at 0px in the touch-capable desktop context.

- [ ] **Step 3: Make native scrolling the only scroll owner**

In `TimelineExperience.tsx`, change `selectBeat` to immediate root-scroll behavior:

```ts
const selectBeat = useCallback(
  (index: number, focus = true) => {
    const nextIndex = Math.max(0, Math.min(beats.length - 1, index));
    const section = beatRefs.current[nextIndex];
    setActiveIndex(nextIndex);
    setProgress(progressForBeat(beats[nextIndex].id));
    dispatchExperience({ type: "RESET_TRANSIENT" });
    if (section) {
      const root = document.documentElement;
      const previousScrollBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      try {
        section.scrollIntoView({ block: "start", behavior: "auto" });
      } finally {
        root.style.scrollBehavior = previousScrollBehavior;
      }
    }
    if (focus) section?.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
  },
  [beats],
);
```

Remove the Lenis import, construction, ticker, touch-device branch, events, and cleanup. Keep ScrollTrigger beat/progress triggers and their cleanup. Remove `lenis` with the package manager so both manifest and lockfile update together:

```powershell
pnpm remove lenis --offline
```

- [ ] **Step 4: Run green scroll tests**

Run the same focused unit and Playwright commands. Expected: all focused tests pass, wheel position advances by more than 500px, and the active beat leaves `approach` after the second gesture.

- [ ] **Step 5: Commit the scroll fix**

```bash
git add app/exhibits/thirteen-minutes/components/TimelineExperience.tsx e2e/thirteen-minutes.spec.ts package.json pnpm-lock.yaml
git commit -m "fix: restore native Apollo scrolling"
```

### Task 2: Unplug Living Atlas from the homepage only

**Files:**
- Modify: `content/exhibits.ts`
- Modify: `app/page.tsx`
- Modify: `tests/exhibits-registry.test.ts`
- Modify: `e2e/living-atlas.spec.ts`

**Interfaces:**
- Consumes: `ExhibitDefinition.enabled`, `ExhibitDefinition.featured`, and the existing `isExhibitEnabled(slug)` route guard.
- Produces: `getFeaturedExhibits(): ExhibitDefinition[]` and `getActiveWings(exhibits?: readonly ExhibitDefinition[])`.

- [ ] **Step 1: Write failing registry and browser assertions**

Update registry tests to require a featured-only lobby query while direct publication remains enabled:

```ts
expect(getFeaturedExhibits().map((exhibit) => exhibit.slug)).toEqual(["thirteen-minutes"]);
expect(isExhibitEnabled("living-atlas")).toBe(true);
expect(getActiveWings(getFeaturedExhibits()).map(({ wing }) => wing.title)).toEqual([
  "Systems & Machines",
]);
```

Update the Living Atlas browser flow to assert no lobby link, then navigate directly:

```ts
await page.goto("/");
await expect(page.getByRole("link", { name: "The Living Atlas", exact: true })).toHaveCount(0);
await expect(page.getByRole("link", { name: "Thirteen Minutes", exact: true })).toBeVisible();
await page.goto("/exhibits/living-atlas");
```

- [ ] **Step 2: Run the focused tests and verify red**

Run:

```powershell
pnpm test -- tests/exhibits-registry.test.ts
pnpm test:e2e -- e2e/living-atlas.spec.ts
```

Expected: registry import/query expectations fail and the lobby still exposes Living Atlas.

- [ ] **Step 3: Implement the featured visibility contract**

Set Living Atlas to `featured: false`. Add:

```ts
export function getFeaturedExhibits(): ExhibitDefinition[] {
  return getActiveExhibits().filter((exhibit) => exhibit.featured);
}

export function getActiveWings(
  exhibits: readonly ExhibitDefinition[] = getActiveExhibits(),
): { wing: ExhibitWing; count: number }[] {
  // Preserve the existing aggregation loop, using `exhibits` as its input.
}
```

In `app/page.tsx`, render `getFeaturedExhibits()` and pass that same list to `getActiveWings(featuredExhibits)`. Do not change `isExhibitEnabled` or the Living Atlas route.

- [ ] **Step 4: Run focused tests and verify green**

Expected: the lobby lists one active exhibition and only the Systems & Machines wing; the direct Living Atlas journey still passes.

- [ ] **Step 5: Commit lobby visibility changes**

```bash
git add content/exhibits.ts app/page.tsx tests/exhibits-registry.test.ts e2e/living-atlas.spec.ts
git commit -m "fix: hide Living Atlas from museum lobby"
```

### Task 3: Repair stale Apollo E2E contracts and mobile geometry coverage

**Files:**
- Modify: `e2e/thirteen-minutes.spec.ts`
- Optionally modify only if measured overlap exists: `app/exhibits/thirteen-minutes/thirteen-minutes.module.css`

**Interfaces:**
- Consumes: accessible link names, `MissionHud` visible readout elements, the `Mission progress` navigation, and the active beat heading.
- Produces: browser assertions that measure visible UI rather than transparent layout containers.

- [ ] **Step 1: Replace the obsolete placeholder assertion**

Assert the rendered production source links:

```ts
await expect(page.getByRole("link", { name: /Apollo 11 Air-to-Ground Mission Transcript/i })).toHaveAttribute(
  "href",
  "https://www.hq.nasa.gov/alsj/a11/a11.landing.html",
);
await expect(page.getByRole("link", { name: /Apollo 11 Guidance Computer.*Source Code/i })).toHaveAttribute(
  "href",
  "https://github.com/chrislgarry/Apollo-11",
);
```

- [ ] **Step 2: Measure visible mobile telemetry instead of the HUD shell**

Replace the full-screen HUD comparison with bounding boxes for the visible `Fuel remaining` readout, progress rail, and active heading:

```ts
const fuel = await page.getByText("Fuel remaining", { exact: true }).locator("..").boundingBox();
const rail = await page.getByRole("navigation", { name: "Mission progress" }).boundingBox();
const heading = await page.getByRole("heading", { name: "Course check" }).boundingBox();
expect(rail!.y).toBeGreaterThanOrEqual(fuel!.y + fuel!.height);
expect(heading!.y).toBeGreaterThanOrEqual(rail!.y + rail!.height);
```

If this evidence fails, adjust only the mobile `.rail` top offset and `.beat` top padding until the measured regions no longer intersect. Do not change CSS when the corrected assertion already passes.

- [ ] **Step 3: Add a 360px overflow check**

Create a narrow-viewport test that visits the homepage and Apollo route, asserts meaningful headings, checks `scrollWidth <= clientWidth`, and records browser/page errors as failures.

- [ ] **Step 4: Run the complete E2E suite**

Run:

```powershell
pnpm test:e2e
```

Expected: all homepage, Living Atlas direct-route, Apollo desktop, mobile, keyboard, reduced-motion, wheel, and no-JavaScript tests pass with no browser errors.

- [ ] **Step 5: Commit validation repairs**

```bash
git add e2e/thirteen-minutes.spec.ts app/exhibits/thirteen-minutes/thirteen-minutes.module.css
git commit -m "test: cover Apollo responsive interactions"
```

### Task 4: Full production verification and publication

**Files:**
- Inspect: all changed files and the complete branch diff
- Modify only if verification proves a scoped defect: the directly responsible source/test file

**Interfaces:**
- Consumes: Vitest, Next.js production build, Playwright, Git diff/status, and browser screenshots.
- Produces: a clean, pushed `feat/thirteen-minutes-refinements` branch with fresh verification evidence.

- [ ] **Step 1: Run static and unit verification**

```powershell
pnpm test
pnpm build
git diff --check
```

Expected: 0 failed unit tests, successful Next.js build, and no whitespace errors.

- [ ] **Step 2: Run the production browser suite**

```powershell
pnpm test:e2e
```

Expected: all Playwright tests pass against `next start` with no console/page errors or horizontal overflow.

- [ ] **Step 3: Capture and inspect representative screenshots**

Capture homepage and Apollo states at 1440×900, 390×844, and 360×800. Inspect hierarchy, clipping, telemetry/rail/heading separation, fixed controls, and the absence of Living Atlas from the lobby.

- [ ] **Step 4: Audit the final diff against every requirement**

Confirm:

```text
remote feature baseline used
local-only history preserved separately
mouse wheel advances on touch-capable desktop
keyboard, touch-style, reduced-motion, and no-JavaScript paths pass
Living Atlas absent from homepage but direct route available
desktop/mobile build and E2E pass
no unrelated files staged
```

- [ ] **Step 5: Commit any final scoped corrections and push**

```bash
git push -u origin feat/thirteen-minutes-refinements
```

Verify local `HEAD` equals `origin/feat/thirteen-minutes-refinements` after the push.
