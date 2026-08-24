# SEO Performance and Release Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove avoidable discovery-time asset cost, verify crawler/auth parity in a production server, and document every external launch action required to turn the code into measurable search visibility.

**Architecture:** Responsive poster media and controlled navigation prefetch reduce cross-route work. Interactive assets stop using unconditional module-level warmups, and public assets receive revalidation-safe caching. A production Playwright audit verifies metadata routes, crawler parity, mobile/desktop semantics, and pre-interaction network behavior; a deployment runbook covers domain, webmaster, WAF, and monitoring work that code cannot perform.

**Tech Stack:** Next.js 16.3, React 19, `next/image`, React Three Fiber, Playwright 1.62, Vitest 4, Vercel Analytics and Speed Insights

**Spec:** `docs/superpowers/specs/2026-08-24-search-discovery-auth-design.md`

## Global Constraints

- Follow `docs/premium-exhibit-standard.md` as the acceptance contract.
- Do not remove or degrade evidence, fallback, accessibility, or meaningful exhibit interaction for a synthetic score.
- Local timings are diagnostic only; production field Core Web Vitals remain authoritative.
- Non-fingerprinted public assets use revalidation-safe caching, not unsafe immutable caching.
- Browser tests may assert request classes and budgets, not machine-specific millisecond timings.
- Vercel Analytics 404s on `next start` are recognized local-environment behavior, not hidden as production application errors.

---

### Task 1: Responsive poster media and controlled navigation prefetch

**Files:**
- Modify: `components/museum/posters/AtlasOfWorldsPoster.tsx`
- Modify: `components/museum/posters/HumanAnatomyPoster.tsx`
- Modify: `components/museum/posters/ThirteenMinutesPoster.tsx`
- Modify: other poster components containing raster `<img>` elements
- Modify: `components/museum/MuseumHeader.tsx`
- Modify: exhibit logo/home links in `components/anatomy/AnatomyExperience.tsx`, `components/space/AtlasExperience.tsx`, `components/jet-engine/JetEngineExperience.tsx`, `components/becoming-human/BecomingHumanV2Experience.tsx`, and `app/exhibits/thirteen-minutes/page.tsx`
- Test: `tests/poster-performance.test.tsx`
- Test: `tests/museum-discovery.test.tsx`

**Interfaces:**
- Uses: `next/image` responsive images with explicit `sizes`, lazy loading by default
- Enforces: home/logo links use `prefetch={false}` where prefetch would pull the full catalog poster tree

- [ ] **Step 1: Write failing poster tests**

```tsx
it("uses optimized, lazy poster imagery with realistic sizes", () => {
  render(<AtlasOfWorldsPoster />);
  for (const image of screen.getAllByRole("img", { hidden: true })) {
    expect(image).toHaveAttribute("loading", "lazy");
    expect(image.getAttribute("sizes")).toMatch(/vw|px/);
  }
});

it("does not prefetch the image-heavy home route from an exhibit mark", () => {
  render(<MuseumHeader quiet />);
  expect(screen.getByRole("link", { name: /loupe museum home/i })).toHaveAttribute("data-prefetch-disabled", "true");
});
```

Mock `next/image` to preserve `loading`/`sizes`, and mock `next/link` to expose `prefetch={false}` as `data-prefetch-disabled` in tests.

- [ ] **Step 2: Run poster tests and verify RED**

Run: `pnpm test tests/poster-performance.test.tsx tests/museum-discovery.test.tsx`
Expected: FAIL because raw images and default link prefetch remain.

- [ ] **Step 3: Convert raster posters to optimized images**

Use `Image` with `fill` where CSS already establishes a positioned frame, meaningful internal `sizes` such as `(max-width: 760px) 88vw, 30vw`, `loading="lazy"`, and empty alt only when the entire poster remains intentionally `aria-hidden` with adjacent textual identity.

- [ ] **Step 4: Disable expensive home prefetch**

Set `prefetch={false}` on persistent exhibit-to-home brand links. Do not disable prefetch on lightweight record or catalog links without network evidence.

- [ ] **Step 5: Run poster and discovery tests**

Run: `pnpm test tests/poster-performance.test.tsx tests/museum-discovery.test.tsx tests/museum-homepage.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add components/museum components/anatomy/AnatomyExperience.tsx components/space/AtlasExperience.tsx components/jet-engine/JetEngineExperience.tsx components/becoming-human/BecomingHumanV2Experience.tsx app/exhibits/thirteen-minutes/page.tsx tests
git commit -m "perf: reduce poster and navigation discovery cost"
```

### Task 2: Remove unconditional model warmups and define cache policy

**Files:**
- Modify: `components/anatomy/AnatomyCanvas.tsx`
- Modify: `components/space/AtlasCanvas.tsx`
- Modify: `components/jet-engine/JetEngineCanvas.tsx`
- Modify: `next.config.ts`
- Create: `lib/seo/asset-cache.ts`
- Test: `tests/exhibit-asset-loading.test.ts`
- Test: `tests/asset-cache.test.ts`

**Interfaces:**
- Produces: `MUTABLE_MUSEUM_ASSET_CACHE`, `VERSIONED_MUSEUM_ASSET_CACHE`
- Removes: module-level `useGLTF.preload(...)` side effects

- [ ] **Step 1: Write failing loading-contract tests**

```ts
it("does not warm large exhibit models at module import", async () => {
  const preload = vi.fn();
  vi.doMock("@react-three/drei", () => ({ useGLTF: Object.assign(vi.fn(), { preload }) }));
  await import("@/components/jet-engine/JetEngineCanvas");
  await import("@/components/space/AtlasCanvas");
  await import("@/components/anatomy/AnatomyCanvas");
  expect(preload).not.toHaveBeenCalled();
});
```

- [ ] **Step 2: Run loading tests and verify RED**

Run: `pnpm test tests/exhibit-asset-loading.test.ts`
Expected: FAIL because module imports call `useGLTF.preload`.

- [ ] **Step 3: Remove module-level preload side effects**

Allow mounted canvases to request only the model(s) required by the active authored view. Do not introduce a new hidden warmup. Preserve Suspense/fallback behavior.

- [ ] **Step 4: Run loading and renderer tests**

Run: `pnpm test tests/exhibit-asset-loading.test.ts tests/atlas-renderer.test.tsx tests/anatomy-ui.test.tsx tests/jet-engine-ui.test.tsx`
Expected: PASS.

- [ ] **Step 5: Write failing cache tests**

```ts
it("uses revalidation-safe browser caching for mutable public assets", () => {
  expect(MUTABLE_MUSEUM_ASSET_CACHE).toBe("public, max-age=86400, stale-while-revalidate=604800");
});

it("applies museum cache headers across current model and media roots", async () => {
  const rules = await nextConfig.headers!();
  expect(rules.map((rule) => rule.source)).toEqual(expect.arrayContaining([
    "/models/:path*", "/media/:path*", "/assets/jet-engine/:path*", "/images/:path*",
  ]));
});
```

- [ ] **Step 6: Run cache tests and verify RED**

Run: `pnpm test tests/asset-cache.test.ts`
Expected: FAIL because only anatomy has an immutable rule.

- [ ] **Step 7: Implement cache constants and rules**

Apply the mutable policy to current non-hashed public paths. Reserve one-year immutable caching for future content-versioned filenames; do not falsely classify current mutable URLs as immutable.

- [ ] **Step 8: Run cache and configuration tests**

Run: `pnpm test tests/asset-cache.test.ts tests/exhibit-asset-loading.test.ts`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add components/anatomy/AnatomyCanvas.tsx components/space/AtlasCanvas.tsx components/jet-engine/JetEngineCanvas.tsx next.config.ts lib/seo/asset-cache.ts tests
git commit -m "perf: control exhibit asset loading and caching"
```

### Task 3: Authentication/search operations and deployment runbook

**Files:**
- Create: `docs/search-release-runbook.md`
- Create: `.env.example`
- Modify: `README.md`
- Test: `tests/search-runbook.test.ts`

**Interfaces:**
- Documents: required environment names and external release gates
- Does not include: real secrets, verification tokens, or vendor credentials

- [ ] **Step 1: Write the failing documentation contract test**

```ts
it("documents every external search and auth-safe release gate", () => {
  const runbook = readFileSync("docs/search-release-runbook.md", "utf8");
  for (const requirement of [
    "NEXT_PUBLIC_SITE_URL",
    "GOOGLE_SITE_VERIFICATION",
    "BING_SITE_VERIFICATION",
    "Google Search Console",
    "Bing Webmaster Tools",
    "OAI-SearchBot",
    "Claude-SearchBot",
    "PerplexityBot",
    "Rich Results Test",
    "returnTo",
    "isAccessibleForFree",
  ]) expect(runbook).toContain(requirement);
});
```

- [ ] **Step 2: Run the runbook test and verify RED**

Run: `pnpm test tests/search-runbook.test.ts`
Expected: FAIL because the runbook does not exist.

- [ ] **Step 3: Write the complete runbook**

Include permanent-domain configuration, preview `noindex`, environment variables, Google/Bing verification, sitemap submission, URL Inspection, schema validators, robots/WAF checks, auth-provider integration at the viewer adapter, private-page protection, redirect-return behavior, launch-day crawl checks, Core Web Vitals, query/CTR monitoring, AI-referral tracking, and rollback/removal steps. State that code cannot submit or verify external accounts automatically.

- [ ] **Step 4: Add safe environment examples and README routing**

```dotenv
NEXT_PUBLIC_SITE_URL=https://museum.example
GOOGLE_SITE_VERIFICATION=
BING_SITE_VERIFICATION=
```

The example domain is clearly marked for replacement. README links to the design, plans, and runbook.

- [ ] **Step 5: Run documentation test and secret scan**

Run: `pnpm test tests/search-runbook.test.ts`
Expected: PASS.

Run: `rg -n "AIza|sk-|BEGIN PRIVATE KEY|GOOGLE_SITE_VERIFICATION=.+" .env.example docs/search-release-runbook.md`
Expected: no output.

- [ ] **Step 6: Commit**

```bash
git add docs/search-release-runbook.md .env.example README.md tests/search-runbook.test.ts
git commit -m "docs: add search and auth release runbook"
```

### Task 4: Production crawler, semantic, and resource verification

**Files:**
- Create: `e2e/seo-discovery.spec.ts`
- Modify: `playwright.config.ts` only if the existing web-server command cannot exercise production build/start
- Test: `e2e/seo-discovery.spec.ts`

**Interfaces:**
- Verifies: production server responses, metadata, crawler parity, signed-out member shell, mobile semantics, and resource classes

- [ ] **Step 1: Write failing production SEO E2E tests**

```ts
test("serves crawler infrastructure", async ({ request }) => {
  for (const path of ["/robots.txt", "/sitemap.xml", "/manifest.webmanifest", "/social/exhibit/atlas-of-worlds"]) {
    expect((await request.get(path)).ok()).toBe(true);
  }
});

test("keeps public content identical across search agents", async ({ request }) => {
  const agents = ["Mozilla/5.0", "Googlebot", "OAI-SearchBot", "Claude-SearchBot", "PerplexityBot"];
  const bodies = await Promise.all(agents.map(async (userAgent) =>
    (await request.get("/exhibits/atlas-of-worlds", { headers: { "user-agent": userAgent } })).text()
  ));
  const publicText = bodies.map(extractPublicEditionText);
  expect(new Set(publicText).size).toBe(1);
});

test("does not fetch unrelated GLBs before entering an exhibit", async ({ page }) => {
  const glbs: string[] = [];
  page.on("request", (request) => { if (request.url().endsWith(".glb")) glbs.push(request.url()); });
  await page.goto("/research/atlas-of-worlds/mars");
  await page.waitForLoadState("networkidle");
  expect(glbs).toEqual([]);
});
```

`extractPublicEditionText` normalizes only the public reading region rather than dynamic build scripts.

- [ ] **Step 2: Run the E2E spec and verify RED**

Run: `pnpm exec playwright test e2e/seo-discovery.spec.ts`
Expected: FAIL on missing or incorrect production behavior before final integration.

- [ ] **Step 3: Complete only fixes demonstrated by failing E2E evidence**

Fix HTTP content types/statuses, metadata placement, user-agent parity, responsive heading/navigation defects, or unexpected public-reading asset requests. Do not loosen assertions merely to accept regressions.

- [ ] **Step 4: Run desktop and mobile projects**

Run: `pnpm exec playwright test e2e/seo-discovery.spec.ts --project=chromium`
Expected: PASS.

Run the configured mobile viewport/project for the same spec.
Expected: PASS with one visible `h1`, crawlable breadcrumbs, and no horizontal overflow on research pages.

- [ ] **Step 5: Run keyboard and reduced-motion checks**

Use Playwright to tab through the signed-out member gate fixture/route, verify visible focus and return URL, and emulate `reducedMotion: "reduce"` while confirming the public edition remains readable.

- [ ] **Step 6: Commit**

```bash
git add e2e/seo-discovery.spec.ts playwright.config.ts
git commit -m "test: verify production search and agent discovery"
```

### Task 5: Completion audit and release evidence

**Files:**
- Create: `docs/search-release-evidence.md`
- Modify: no production files unless verification exposes a defect with a failing regression test

**Interfaces:**
- Records: exact commands, result counts, route inventory, crawler parity, screenshots, known external gates, and limitations

- [ ] **Step 1: Run the complete automated suite**

Run: `pnpm test`
Expected: all Vitest files and tests PASS with 0 failures.

- [ ] **Step 2: Run the production build**

Run: `pnpm build`
Expected: exit 0; route table includes canonical pages, all research records, metadata routes, and social cards.

- [ ] **Step 3: Run the complete Playwright SEO and exhibit suite**

Run: `pnpm exec playwright test`
Expected: all configured E2E tests PASS with 0 failures.

- [ ] **Step 4: Inspect generated responses**

Start `pnpm start`, request canonical pages and metadata routes, and record status, title, canonical, robots, JSON-LD count, heading count, and visible word count. Repeat the Atlas member-policy fixture with normal and named crawler agents.

- [ ] **Step 5: Capture desktop and mobile evidence**

Capture the home, catalog, one public exhibit edition, one signed-out member exhibit state, research index, and one research record at representative desktop and mobile dimensions. Inspect visual hierarchy, overflow, focus, loading, and source-link readability.

- [ ] **Step 6: Compare resource evidence**

Record initial JS and five-second transfer classes for home, one 3D exhibit, and one research record. Report improvement or unresolved budgets honestly; do not claim field Core Web Vitals from localhost.

- [ ] **Step 7: Write the evidence record**

Document command timestamps, counts, route/output checks, screenshots, crawler parity hashes, resource observations, and unresolved external steps. Any high/medium defect returns to a failing-test fix cycle before completion.

- [ ] **Step 8: Run specification coverage audit**

Read `docs/superpowers/specs/2026-08-24-search-discovery-auth-design.md` acceptance criteria 1–12 and map each to current file/runtime evidence in `docs/search-release-evidence.md`. Missing or indirect evidence is incomplete.

- [ ] **Step 9: Commit**

```bash
git add docs/search-release-evidence.md
git commit -m "docs: record search discovery release evidence"
```

