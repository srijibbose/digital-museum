# Lobby and Apollo Clarity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the lobby hero feel like a decisive museum threshold and make Apollo's interactive controls clear before they are clicked.

**Architecture:** Keep the homepage server-rendered and add only semantic hero structure plus CSS. Keep Apollo behavior in its existing client components; add explanatory content around the existing reducer actions rather than changing the 3D scene or narrative model.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, CSS Modules, Vitest, Testing Library.

## Global Constraints

- Do not check out `feat/thirteen-minutes-refinements`; inspect it only with Git.
- Preserve all uncommitted Full Throttle files and registry behavior.
- Keep `app/page.tsx` a Server Component.
- Do not claim the Eagle can zoom; current `OrbitControls` disable zoom.
- Preserve existing accessible names used by Apollo interaction tests.

---

### Task 1: Specify the lobby hero's destination

**Files:**
- Modify: `tests/museum-lobby.test.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: the existing `#exhibits` directory section.
- Produces: a descriptive link named “Explore the exhibitions” pointing to `#exhibits` and a collection marker for the active exhibit count.

- [ ] **Step 1: Write the failing test**

```tsx
expect(screen.getByRole("link", { name: /explore the exhibitions/i })).toHaveAttribute(
  "href",
  "#exhibits",
);
expect(screen.getByText(/2 active exhibits/i)).toBeInTheDocument();
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/museum-lobby.test.tsx`

Expected: FAIL because the hero only exposes an “Explore the exhibits” link and has no active-exhibit marker.

- [ ] **Step 3: Implement the semantic hero and visual treatment**

```tsx
<a className="lobby-hero__action" href="#exhibits">
  <span>Explore the exhibitions</span>
  <span aria-hidden="true">↓</span>
</a>
```

Add the companion collection marker, then style its lens field, rule, hierarchy, interaction states, and responsive layout in `app/globals.css`.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test tests/museum-lobby.test.tsx`

Expected: PASS.

### Task 2: Make Apollo actions explain their outcome

**Files:**
- Modify: `tests/thirteen-minutes-interactions.test.tsx`
- Modify: `app/exhibits/thirteen-minutes/components/ExperienceControls.tsx`
- Modify: `app/exhibits/thirteen-minutes/components/TimelineExperience.tsx`
- Modify: `app/exhibits/thirteen-minutes/components/ComputerLoad.tsx`
- Modify: `app/exhibits/thirteen-minutes/thirteen-minutes.module.css`

**Interfaces:**
- Consumes: `ExperienceState.inspect`, `ExperienceState.compare`, `activeBeat`, and the existing reducer actions.
- Produces: an `aria-live` interaction guide, visible action/result labels, destination-aware chapter navigation, and explicit 1202 explainer choices.

- [ ] **Step 1: Write the failing tests**

```tsx
await user.click(screen.getByRole("button", { name: /inspect Eagle/i }));
expect(screen.getByRole("status")).toHaveTextContent(/drag the scene to orbit Eagle/i);
expect(screen.getByRole("button", { name: /compare planned and actual landing paths/i }))
  .toHaveTextContent(/show landing paths/i);
expect(screen.getByRole("button", { name: /next: course check/i }))
  .toHaveTextContent(/course check/i);
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test tests/thirteen-minutes-interactions.test.tsx`

Expected: FAIL because inspection has no contextual gesture guide, comparison has no named visible result, and chapter navigation only says “Next”.

- [ ] **Step 3: Implement the smallest behavior and presentation changes**

```tsx
<p aria-live="polite" className={styles.interactionGuide} role="status">
  {state.inspect ? "Drag the scene to orbit Eagle." : "Open inspection to orbit Eagle."}
</p>
```

Use the existing actions unchanged, add visible result labels, and apply high-contrast button styling that is visibly distinct from static HUD readouts.

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test tests/thirteen-minutes-interactions.test.tsx tests/thirteen-minutes-components.test.tsx`

Expected: PASS.

### Task 3: Verify the integrated journey

**Files:**
- Test: `tests/museum-lobby.test.tsx`
- Test: `tests/thirteen-minutes-interactions.test.tsx`
- Test: `tests/thirteen-minutes-components.test.tsx`

**Interfaces:**
- Consumes: the new lobby destination and Apollo interaction guidance.
- Produces: verified desktop and small-screen behavior without regressions.

- [ ] **Step 1: Run focused automated verification**

Run: `pnpm test tests/museum-lobby.test.tsx tests/thirteen-minutes-interactions.test.tsx tests/thirteen-minutes-components.test.tsx`

Expected: PASS with no skipped tests.

- [ ] **Step 2: Run production validation**

Run: `pnpm build`

Expected: the Next.js production build completes successfully.

- [ ] **Step 3: Visually inspect the home and Apollo routes**

Run: `pnpm dev`

Expected: the home hero's call-to-action is visible at desktop and mobile widths; Apollo has explicit controls, guidance, and no layout collision with telemetry.
