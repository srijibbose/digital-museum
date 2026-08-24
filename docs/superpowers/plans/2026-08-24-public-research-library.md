# Public Research Editions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn all five exhibits' existing source-grounded material into substantial server-rendered reading editions and crawlable research records that remain useful when interactive experiences require sign-in.

**Architecture:** A pure content adapter normalizes authored Atlas worlds, Anatomy systems, Becoming Human episodes, Jet Engine stations, and Apollo telemetry beats into one immutable research-record contract. One statically generated research route renders record-specific metadata, JSON-LD, evidence, sources, related records, and links into the parent exhibit. Subject-specific main editions preserve each exhibit's voice instead of forcing every exhibit into one generic page.

**Tech Stack:** Next.js 16.3 App Router, React 19 Server Components, TypeScript, Vitest, Testing Library

**Spec:** `docs/superpowers/specs/2026-08-24-search-discovery-auth-design.md`

## Global Constraints

- Follow `docs/premium-exhibit-standard.md` as the acceptance contract.
- Research records are visitor-facing museum content, not keyword permutations or hidden doorway pages.
- Every record has authored explanatory depth, evidence/limits, sources, parent navigation, and unique metadata.
- No existing evidence label, uncertainty statement, source attribution, or reconstruction notice is weakened.
- Main public editions stay outside `ExhibitAccessBoundary`.
- Omit any record that cannot satisfy the record validator rather than padding it.

---

### Task 1: Normalized research-record content contract

**Files:**
- Create: `content/research-records.ts`
- Create: `lib/seo/research-record-schema.ts`
- Test: `tests/research-records.test.ts`

**Interfaces:**
- Produces: `ResearchRecord`, `ResearchRecordSource`, `ResearchRecordSection`
- Produces: `getResearchRecords()`, `getResearchRecordsForExhibit(exhibitSlug)`, `getResearchRecord(exhibitSlug, recordSlug)`
- Produces: `researchRecordPath(record)`

- [ ] **Step 1: Write failing record-contract tests**

```ts
it("derives substantive records for every current exhibit", () => {
  const groups = new Set(getResearchRecords().map((record) => record.exhibitSlug));
  expect(groups).toEqual(new Set([
    "atlas-of-worlds", "human-anatomy", "becoming-human", "jet-engine", "thirteen-minutes",
  ]));
});

it("gives every record unique canonical content", () => {
  const records = getResearchRecords();
  expect(new Set(records.map((record) => record.id)).size).toBe(records.length);
  expect(new Set(records.map((record) => researchRecordPath(record))).size).toBe(records.length);
  for (const record of records) {
    expect(record.title.length).toBeGreaterThan(5);
    expect(record.summary.length).toBeGreaterThan(80);
    expect(record.sections.length).toBeGreaterThan(0);
    expect(record.sections.some((section) => section.body.length > 120)).toBe(true);
    expect(record.sources.length).toBeGreaterThan(0);
  }
});
```

- [ ] **Step 2: Run record tests and verify RED**

Run: `pnpm test tests/research-records.test.ts`
Expected: FAIL because the record modules do not exist.

- [ ] **Step 3: Implement the immutable record type and validator**

```ts
export type ResearchRecord = {
  id: string;
  exhibitSlug: string;
  slug: string;
  kind: "world" | "anatomy-system" | "human-episode" | "flow-station" | "mission-beat";
  title: string;
  eyebrow: string;
  summary: string;
  evidenceLabel: string;
  evidenceDetail: string;
  sections: readonly { heading: string; body: string }[];
  sources: readonly { title: string; publisher?: string; url: string }[];
  image?: { src: string; alt: string; credit?: string };
  relatedIds: readonly string[];
  lastModified: string;
};
```

`assertResearchRecord` rejects short, source-free, duplicate, or unsafe records at module initialization.

- [ ] **Step 4: Build adapters from existing authored content**

- Atlas: title/overview, physical context, hotspot details, evidence statuses, and deduplicated world sources.
- Anatomy: system overview, territory, named structures, evidence statuses, and applicable anatomy source ledger.
- Becoming Human: hook/story/capability, evidence object/status/uncertainty, interaction disclaimer, and episode sources.
- Jet Engine: summary/transformation/interpretation/evidence plus sources resolved from `sourceIds`.
- Thirteen Minutes: beat body/quote/telemetry plus shared NASA/MIT primary-record sources extracted to an exported content constant instead of duplicated page literals.

- [ ] **Step 5: Run record and original content tests**

Run: `pnpm test tests/research-records.test.ts tests/atlas-content.test.ts tests/anatomy-content.test.ts tests/becoming-human-story.test.ts tests/jet-engine-content.test.ts tests/thirteen-minutes-content.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add content/research-records.ts lib/seo/research-record-schema.ts app/exhibits/thirteen-minutes/content.ts tests/research-records.test.ts
git commit -m "feat: derive source-grounded museum research records"
```

### Task 2: Research library index and record routes

**Files:**
- Create: `app/research/page.tsx`
- Create: `app/research/[exhibit]/[record]/page.tsx`
- Create: `app/research/research.module.css`
- Create: `components/museum/Breadcrumbs.tsx`
- Create: `components/museum/ResearchRecordPage.tsx`
- Test: `tests/research-routes.test.tsx`

**Interfaces:**
- Consumes: record accessors, metadata builders, JSON-LD builders
- Produces: `generateStaticParams`, `generateMetadata`, record page, research index

- [ ] **Step 1: Write failing route tests**

```tsx
it("prebuilds every validated research record", async () => {
  const params = await generateStaticParams();
  expect(params).toHaveLength(getResearchRecords().length);
  expect(params).toContainEqual({ exhibit: "atlas-of-worlds", record: "mars" });
});

it("renders a complete record with evidence, sources, and parent navigation", async () => {
  render(await ResearchRecordRoute({ params: Promise.resolve({ exhibit: "atlas-of-worlds", record: "mars" }) }));
  expect(screen.getByRole("heading", { level: 1, name: /mars/i })).toBeVisible();
  expect(screen.getByRole("link", { name: /enter atlas of worlds/i })).toHaveAttribute("href", "/exhibits/atlas-of-worlds?world=mars");
  expect(screen.getByRole("heading", { name: /sources/i })).toBeVisible();
  expect(document.querySelector('script[type="application/ld+json"]')).toBeTruthy();
});
```

- [ ] **Step 2: Run route tests and verify RED**

Run: `pnpm test tests/research-routes.test.tsx`
Expected: FAIL because the research routes do not exist.

- [ ] **Step 3: Implement accessible breadcrumbs and record page**

Use a visible ordered breadcrumb list, one `h1`, evidence status adjacent to evidence detail, authored sections, source links, parent exhibit call-to-action, and related record links. Use semantic `article`, `header`, `section`, `aside`, and `nav` elements.

- [ ] **Step 4: Implement static params and metadata**

```ts
export function generateStaticParams() {
  return getResearchRecords().map(({ exhibitSlug, slug }) => ({ exhibit: exhibitSlug, record: slug }));
}

export async function generateMetadata({ params }: Props) {
  const { exhibit, record } = await params;
  const item = getResearchRecord(exhibit, record);
  return item ? createResearchRecordMetadata(item) : {};
}
```

Unknown records call `notFound()`. Metadata uses `/research/{exhibit}/{record}` and `/social/research/{exhibit}/{record}`.

- [ ] **Step 5: Implement the library index**

Group records by parent exhibit, provide concise visitor orientation, link every record, and include `CollectionPage`/`ItemList` JSON-LD matching visible links.

- [ ] **Step 6: Run route tests and accessibility assertions**

Run: `pnpm test tests/research-routes.test.tsx`
Expected: PASS with no duplicate headings or missing accessible link names.

- [ ] **Step 7: Commit**

```bash
git add app/research components/museum/Breadcrumbs.tsx components/museum/ResearchRecordPage.tsx tests/research-routes.test.tsx
git commit -m "feat: publish the Loupe research library"
```

### Task 3: Becoming Human public research edition

**Files:**
- Create: `components/becoming-human/BecomingHumanReadingEdition.tsx`
- Create: `components/becoming-human/becoming-human-reading.module.css`
- Modify: `app/exhibits/becoming-human/page.tsx`
- Test: `tests/becoming-human-public-edition.test.tsx`

**Interfaces:**
- Produces: `<BecomingHumanReadingEdition />`
- Consumes: `becomingHumanActs`, `becomingHumanEpisodes`, `becomingHumanFinale`, record links

- [ ] **Step 1: Write the failing public-edition test**

```tsx
it("publishes all authored episodes without starting the client experience", () => {
  render(<BecomingHumanReadingEdition />);
  expect(screen.getByRole("heading", { level: 1, name: /becoming human/i })).toBeVisible();
  expect(screen.getAllByRole("article")).toHaveLength(becomingHumanEpisodes.length);
  expect(screen.getByText("The Human Lineage Begins")).toBeVisible();
  expect(screen.getByText(/what we still do not know/i)).toBeVisible();
  expect(screen.getAllByRole("link", { name: /read research record/i })).toHaveLength(becomingHumanEpisodes.length);
});
```

- [ ] **Step 2: Run the edition test and verify RED**

Run: `pnpm test tests/becoming-human-public-edition.test.tsx`
Expected: FAIL because the reading edition does not exist.

- [ ] **Step 3: Implement the subject-specific edition**

Render a compact thesis introduction, act sections, 35 episode articles with date/location/hook/capability/evidence status/uncertainty, sources, record links, and the finale. Keep the cinematic client experience inside `ExhibitAccessBoundary` and the edition outside it.

- [ ] **Step 4: Run edition and existing experience tests**

Run: `pnpm test tests/becoming-human-public-edition.test.tsx tests/becoming-human-ui.test.tsx tests/becoming-human-story.test.ts tests/becoming-human-content.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/becoming-human/BecomingHumanReadingEdition.tsx components/becoming-human/becoming-human-reading.module.css app/exhibits/becoming-human/page.tsx tests/becoming-human-public-edition.test.tsx
git commit -m "feat: publish Becoming Human research edition"
```

### Task 4: Jet Engine edition and heading alignment

**Files:**
- Create: `components/jet-engine/JetEngineReadingEdition.tsx`
- Modify: `components/jet-engine/jet-engine.module.css`
- Modify: `app/exhibits/jet-engine/page.tsx`
- Modify: `app/exhibits/atlas-of-worlds/page.tsx`
- Modify: `app/exhibits/human-anatomy/page.tsx`
- Modify: the Anatomy component that currently emits `Cardiovascular system` as `h1`
- Test: `tests/jet-engine-public-edition.test.tsx`
- Test: `tests/exhibit-heading-contract.test.tsx`

**Interfaces:**
- Produces: `<JetEngineReadingEdition />`
- Enforces: one exhibit-level `h1` per exhibit route

- [ ] **Step 1: Write failing edition and heading tests**

```tsx
it("publishes every jet flow station and its limits", () => {
  render(<JetEngineReadingEdition />);
  expect(screen.getByText(jetEngine.reconstructionNotice)).toBeVisible();
  expect(screen.getByText(jetEngine.modelNotice)).toBeVisible();
  for (const station of jetEngine.stations) {
    expect(screen.getByRole("heading", { name: station.label })).toBeVisible();
  }
});

it.each(exhibitRoutes)("renders one exhibit-level h1 for %s", async ({ renderPage, title }) => {
  render(await renderPage());
  expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  expect(screen.getByRole("heading", { level: 1, name: title })).toBeVisible();
});
```

- [ ] **Step 2: Run tests and verify RED**

Run: `pnpm test tests/jet-engine-public-edition.test.tsx tests/exhibit-heading-contract.test.tsx`
Expected: FAIL because the Jet edition and heading contract are absent.

- [ ] **Step 3: Implement Jet Engine reading edition**

Render the thesis, visitor promise, reconstruction/model notices, station articles, source links, and record links outside the interactive boundary.

- [ ] **Step 4: Correct Atlas and Anatomy hierarchy**

Use `h1` for `Atlas of Worlds` and `Human Anatomy` in their public introductions. Demote the initial interactive system title from `h1` to `h2` without changing its accessible name or control association.

- [ ] **Step 5: Run edition, heading, and UI tests**

Run: `pnpm test tests/jet-engine-public-edition.test.tsx tests/exhibit-heading-contract.test.tsx tests/jet-engine-ui.test.tsx tests/anatomy-ui.test.tsx tests/atlas-interface.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add components/jet-engine app/exhibits/jet-engine app/exhibits/atlas-of-worlds app/exhibits/human-anatomy components/anatomy tests
git commit -m "feat: complete public exhibit reading editions"
```

### Task 5: Museum-wide related discovery and sitemap integration

**Files:**
- Create: `components/museum/ExhibitDiscoveryFooter.tsx`
- Modify: `components/museum/discovery.module.css`
- Modify: all five exhibit pages
- Modify: `app/exhibits/thirteen-minutes/page.tsx`
- Modify: `app/sitemap.ts`
- Modify: `lib/seo/json-ld.ts`
- Modify: `lib/seo/metadata.ts`
- Test: `tests/exhibit-related-discovery.test.tsx`
- Test: `tests/seo-routes.test.ts`
- Test: `tests/seo-json-ld.test.tsx`

**Interfaces:**
- Produces: `<ExhibitDiscoveryFooter exhibit={definition} records={records} />`
- Extends: research-record metadata and JSON-LD builders

- [ ] **Step 1: Write failing discovery tests**

```tsx
it("links each exhibit to its records and enabled related exhibits", () => {
  render(<ExhibitDiscoveryFooter exhibit={atlas} records={getResearchRecordsForExhibit(atlas.slug)} />);
  expect(screen.getByRole("link", { name: /mars/i })).toHaveAttribute("href", "/research/atlas-of-worlds/mars");
  expect(screen.getByRole("link", { name: /human anatomy/i })).toHaveAttribute("href", "/exhibits/human-anatomy");
});

it("turns Apollo related cards into real links", async () => {
  render(await ThirteenMinutesPage());
  expect(screen.getByRole("link", { name: /atlas of worlds/i })).toBeVisible();
});
```

- [ ] **Step 2: Run discovery tests and verify RED**

Run: `pnpm test tests/exhibit-related-discovery.test.tsx`
Expected: FAIL because the footer and Apollo links do not exist.

- [ ] **Step 3: Implement related discovery**

Select related exhibits by shared wing, formats, and tags with deterministic registry order; never include private/disabled/self entries. Add visible research-record navigation and catalog/wing links.

- [ ] **Step 4: Extend metadata, JSON-LD, social cards, and sitemap**

Add research entries to sitemap with authored last-modified dates. Add `createResearchRecordMetadata` and record `Article`/`LearningResource`/breadcrumb graphs. Extend `resolveSocialCard("research", [exhibit, record])` from the allowlisted record adapter.

- [ ] **Step 5: Run integration tests**

Run: `pnpm test tests/exhibit-related-discovery.test.tsx tests/seo-routes.test.ts tests/seo-json-ld.test.tsx tests/seo-social-card.test.ts tests/research-routes.test.tsx`
Expected: PASS.

- [ ] **Step 6: Run the phase test and build gate**

Run: `pnpm test`
Expected: all tests PASS.

Run: `pnpm build`
Expected: production build exits 0 and statically generates all validated research records.

- [ ] **Step 7: Commit**

```bash
git add components/museum app/exhibits app/sitemap.ts lib/seo tests
git commit -m "feat: connect exhibit and research discovery"
```

