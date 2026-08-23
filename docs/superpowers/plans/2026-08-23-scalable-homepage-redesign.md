# Loupe Scalable Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the selected search-led Loupe homepage and a scalable All Exhibits catalog without introducing generated exhibit imagery.

**Architecture:** Keep pages as Server Components and isolate only search suggestions and surprise navigation behind small Client Component boundaries. Put catalog matching, filtering, sorting, and URL construction in pure discovery utilities so the homepage, catalog route, and tests share one behavior contract.

**Tech Stack:** Next.js 16.3 App Router, React 19.2, TypeScript 7, CSS Modules, Vitest, Testing Library, Playwright.

**Spec:** `docs/superpowers/specs/2026-08-23-scalable-homepage-redesign.md`

## Global Constraints

- Generated concept imagery is reference-only and must not ship.
- Reuse the five existing `ExhibitPoster` variants and their current motion/reduced-motion behavior.
- The homepage must stay bounded as exhibit count grows; the catalog owns complete discovery.
- All visible primary controls and quick paths must have meaningful behavior.
- `searchParams` must be typed and awaited as a Promise.
- New behavior follows red-green-refactor and ships with current verification evidence.

---

### Task 1: Discovery metadata and pure catalog behavior

**Files:**
- Modify: `content/exhibits.ts`
- Create: `content/exhibit-discovery.ts`
- Modify: `tests/exhibits-registry.test.ts`
- Create: `tests/exhibit-discovery.test.ts`

**Interfaces:**
- Produces: `ExhibitFormat`, `ExhibitFilters`, `CatalogPage`, `filterExhibits()`, `getSearchSuggestions()`, `getCatalogPage()`, `buildCatalogHref()`, and `pickSurpriseExhibit()`.
- Consumes: `ExhibitDefinition[]` and the existing enabled/featured registry helpers.

- [ ] **Step 1: Write failing tests** for explicit duration/format metadata, normalized text search, intersected filters, stable sorting, bounded pagination, query-preserving URLs, and injectable surprise selection.
- [ ] **Step 2: Run** `pnpm test tests/exhibits-registry.test.ts tests/exhibit-discovery.test.ts` and confirm failures are caused by missing metadata/utilities.
- [ ] **Step 3: Implement the minimal metadata and pure utilities** with no React or browser dependency.
- [ ] **Step 4: Run the focused tests** and confirm they pass.
- [ ] **Step 5: Run** `pnpm test tests/exhibits-registry.test.ts tests/exhibit-discovery.test.ts` after refactoring names and duplicated normalization.

### Task 2: Search and compact exhibit components

**Files:**
- Create: `components/museum/MuseumSearch.tsx`
- Create: `components/museum/SurpriseMe.tsx`
- Create: `components/museum/CompactExhibitCard.tsx`
- Create: `components/museum/discovery.module.css`
- Create: `tests/museum-discovery.test.tsx`

**Interfaces:**
- Consumes: serializable exhibit summaries and the Task 1 suggestion/surprise utilities.
- Produces: accessible search form/suggestions, functional surprise button, and reusable compact card.

- [ ] **Step 1: Write failing component tests** that assert GET search submission semantics, query-driven suggestions, keyboard dismissal, surprise navigation selection, card metadata, and reuse of the real poster component output.
- [ ] **Step 2: Run** `pnpm test tests/museum-discovery.test.tsx` and confirm the components are missing.
- [ ] **Step 3: Implement the minimal client boundaries and server-renderable card.**
- [ ] **Step 4: Run the component tests** and confirm they pass without mocking the components under test.
- [ ] **Step 5: Refine focus/open/empty states in CSS and rerun the focused tests.**

### Task 3: Search-led homepage and functional navigation

**Files:**
- Modify: `app/page.tsx`
- Create: `app/home.module.css`
- Modify: `components/museum/MuseumHeader.tsx`
- Modify: `app/globals.css`
- Create: `tests/museum-homepage.test.tsx`

**Interfaces:**
- Consumes: active/featured exhibits, active wings, `MuseumSearch`, `SurpriseMe`, and `CompactExhibitCard`.
- Produces: the complete homepage journey and global/mobile museum navigation.

- [ ] **Step 1: Write failing homepage tests** for exact proposition copy, catalog/search CTAs, four meaningful quick paths, bounded featured cards, wing links/counts, about statement, and mobile-menu semantics.
- [ ] **Step 2: Run** `pnpm test tests/museum-homepage.test.tsx` and confirm it fails against the current lobby.
- [ ] **Step 3: Implement the homepage and header** using the selected reference hierarchy and existing poster components only.
- [ ] **Step 4: Run the homepage and discovery component tests** and confirm they pass.
- [ ] **Step 5: Refactor duplicated labels/links and rerun focused tests.**

### Task 4: Scalable All Exhibits route

**Files:**
- Create: `app/exhibits/page.tsx`
- Create: `app/exhibits/loading.tsx`
- Create: `app/exhibits/catalog.module.css`
- Create: `tests/exhibits-catalog.test.tsx`

**Interfaces:**
- Consumes: async `searchParams`, Task 1 catalog utilities, active wings/formats, and `CompactExhibitCard`.
- Produces: server-rendered filtered/sorted/paginated catalog states and stable URLs.

- [ ] **Step 1: Write failing route tests** for default results, text/wing/duration/format filters, sorting, pagination links, retained form values, and empty state.
- [ ] **Step 2: Run** `pnpm test tests/exhibits-catalog.test.tsx` and confirm the route is missing.
- [ ] **Step 3: Implement the async Server Component page and loading state.**
- [ ] **Step 4: Run catalog and discovery tests** and confirm they pass.
- [ ] **Step 5: Refactor filter rendering and rerun the focused tests.**

### Task 5: Full verification and visual QA

**Files:**
- Create: `design-qa.md`
- Modify only if verification finds defects: homepage/catalog components and styles above.

**Interfaces:**
- Consumes: selected reference mock and the final rendered routes.
- Produces: passing automated evidence, desktop/mobile captures, interaction evidence, and `design-qa.md` with `final result: passed`.

- [ ] **Step 1: Run** `pnpm test` and resolve every failure.
- [ ] **Step 2: Run** `pnpm build` and resolve type, prerender, and accessibility-related build failures.
- [ ] **Step 3: Start the app and inspect `/` and `/exhibits` at 1440 × 1024 and 390 × 844.**
- [ ] **Step 4: Exercise search suggestions/submission, quick filters, filter intersections, empty state, surprise action, mobile navigation, and exhibit links.**
- [ ] **Step 5: Compare the 1440 × 1024 homepage capture to the selected reference, record issues in `design-qa.md`, fix P0–P2 findings, and repeat until `final result: passed`.**
- [ ] **Step 6: Run `git diff --check`, `git status --short`, the full test suite, and production build again before handoff.**
