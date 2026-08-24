# SEO and Access Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Loupe's canonical metadata, crawler, structured-data, social-card, and future-auth access foundation without hiding indexable exhibits behind login redirects.

**Architecture:** Focused helpers own origin resolution, metadata, and JSON-LD. The exhibit registry owns an explicit public/member/private policy, while a small access boundary gates only the interactive region. Next.js metadata routes expose robots, sitemap, manifest, and allowlisted social cards.

**Tech Stack:** Next.js 16.3 App Router, React 19, TypeScript 7, Vitest 4, Testing Library, `next/og`

**Spec:** `docs/superpowers/specs/2026-08-24-search-discovery-auth-design.md`

## Global Constraints

- Follow `docs/premium-exhibit-standard.md` as the acceptance contract.
- Signed-out humans and crawler user agents receive the same public content.
- Current exhibits default to `public`; no auth vendor or fake session is invented.
- Private data is protected by authorization, never by robots alone.
- JSON-LD describes only visible, supported facts and escapes `<` as `\u003c`.
- `NEXT_PUBLIC_SITE_URL` is the production canonical origin; local fallback is `http://localhost:3000`.
- No new runtime dependency is added.

---

### Task 1: Canonical origin and exhibit access contracts

**Files:**
- Create: `lib/seo/site.ts`
- Create: `lib/auth/exhibit-access.ts`
- Modify: `content/exhibits.ts`
- Test: `tests/seo-site.test.ts`
- Test: `tests/exhibit-access.test.ts`

**Interfaces:**
- Produces: `resolveSiteOrigin(env): URL`, `absoluteUrl(path, env?): string`, `SITE_NAME`, `SITE_DESCRIPTION`
- Produces: `ExhibitAccess`, `ExhibitViewer`, `canEnterExhibit(exhibit, viewer): boolean`, `isPubliclyDiscoverable(exhibit): boolean`
- Extends: `ExhibitDefinition.access: ExhibitAccess`, `ExhibitDefinition.lastModified: string`

- [ ] **Step 1: Write failing origin tests**

```ts
it("uses and normalizes the permanent production origin", () => {
  expect(resolveSiteOrigin({ NEXT_PUBLIC_SITE_URL: "https://museum.example/" }).href)
    .toBe("https://museum.example/");
  expect(absoluteUrl("/exhibits", { NEXT_PUBLIC_SITE_URL: "https://museum.example" }))
    .toBe("https://museum.example/exhibits");
});

it("rejects unsafe origins and falls back locally", () => {
  expect(resolveSiteOrigin({ NEXT_PUBLIC_SITE_URL: "javascript:alert(1)" }).href)
    .toBe("http://localhost:3000/");
});
```

- [ ] **Step 2: Run the origin tests and verify RED**

Run: `pnpm test tests/seo-site.test.ts`
Expected: FAIL because `lib/seo/site.ts` does not exist.

- [ ] **Step 3: Implement the origin helper**

```ts
export type SiteEnvironment = Partial<Record<
  "NEXT_PUBLIC_SITE_URL" | "VERCEL_PROJECT_PRODUCTION_URL" | "VERCEL_URL",
  string
>>;

export function resolveSiteOrigin(env: SiteEnvironment = process.env): URL {
  const value = env.NEXT_PUBLIC_SITE_URL
    ?? env.VERCEL_PROJECT_PRODUCTION_URL
    ?? env.VERCEL_URL;
  const candidate = value
    ? (/^https?:\/\//i.test(value) ? value : `https://${value}`)
    : "http://localhost:3000";
  try {
    const url = new URL(candidate);
    return ["http:", "https:"].includes(url.protocol) ? new URL(url.origin) : new URL("http://localhost:3000");
  } catch {
    return new URL("http://localhost:3000");
  }
}
```

- [ ] **Step 4: Run the origin tests and verify GREEN**

Run: `pnpm test tests/seo-site.test.ts`
Expected: PASS.

- [ ] **Step 5: Write failing access-policy tests**

```ts
it("keeps member exhibits publicly discoverable but gates entry", () => {
  const exhibit = { ...getExhibitBySlug("atlas-of-worlds")!, access: {
    mode: "members" as const,
    gateLabel: "Sign in to enter",
    gateDescription: "Membership unlocks the instrument.",
  }};
  expect(isPubliclyDiscoverable(exhibit)).toBe(true);
  expect(canEnterExhibit(exhibit, { signedIn: false })).toBe(false);
  expect(canEnterExhibit(exhibit, { signedIn: true })).toBe(true);
});

it("removes private exhibits from public discovery", () => {
  const exhibit = { ...getExhibitBySlug("atlas-of-worlds")!, access: { mode: "private" as const }};
  expect(isPubliclyDiscoverable(exhibit)).toBe(false);
});
```

- [ ] **Step 6: Run access tests and verify RED**

Run: `pnpm test tests/exhibit-access.test.ts`
Expected: FAIL because the access contract does not exist.

- [ ] **Step 7: Implement access helpers and explicit registry defaults**

```ts
export type ExhibitAccess =
  | { mode: "public" }
  | { mode: "members"; gateLabel: string; gateDescription: string }
  | { mode: "private" };

export type ExhibitViewer = { signedIn: boolean };

export function canEnterExhibit(exhibit: ExhibitDefinition, viewer: ExhibitViewer) {
  return exhibit.access.mode === "public"
    || (exhibit.access.mode === "members" && viewer.signedIn);
}

export function isPubliclyDiscoverable(exhibit: ExhibitDefinition) {
  return exhibit.enabled && exhibit.access.mode !== "private";
}
```

Add `{ mode: "public" }` and a real ISO last-modified date to every current registry entry. Update active, featured, search, and wing helpers to exclude private entries.

- [ ] **Step 8: Run registry and access tests**

Run: `pnpm test tests/exhibit-access.test.ts tests/exhibits-registry.test.ts tests/exhibit-discovery.test.ts`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add lib/seo/site.ts lib/auth/exhibit-access.ts content/exhibits.ts tests/seo-site.test.ts tests/exhibit-access.test.ts
git commit -m "feat: add canonical origin and exhibit access contracts"
```

### Task 2: Metadata and structured-data builders

**Files:**
- Create: `lib/seo/metadata.ts`
- Create: `lib/seo/json-ld.ts`
- Create: `components/seo/JsonLd.tsx`
- Test: `tests/seo-metadata.test.ts`
- Test: `tests/seo-json-ld.test.tsx`

**Interfaces:**
- Produces: `createPageMetadata(input): Metadata`, `createExhibitMetadata(exhibit): Metadata`
- Produces: `serializeJsonLd(value): string`, `createSiteGraph()`, `createExhibitGraph(exhibit)`, `createBreadcrumbGraph(items)`
- Produces: `<JsonLd data={objectOrArray} />`

- [ ] **Step 1: Write failing metadata tests**

```ts
it("creates absolute canonical and social metadata", () => {
  const metadata = createPageMetadata({
    title: "Atlas of Worlds",
    description: "A sourced interactive Solar System atlas.",
    pathname: "/exhibits/atlas-of-worlds",
    imagePath: "/social/exhibit/atlas-of-worlds",
  }, { NEXT_PUBLIC_SITE_URL: "https://museum.example" });
  expect(metadata.alternates?.canonical).toBe("https://museum.example/exhibits/atlas-of-worlds");
  expect(metadata.openGraph?.url).toBe("https://museum.example/exhibits/atlas-of-worlds");
  expect(metadata.twitter?.card).toBe("summary_large_image");
});

it("marks filtered catalog pages noindex follow", () => {
  const metadata = createPageMetadata({ title: "All exhibits", description: "Catalog", pathname: "/exhibits", index: false });
  expect(metadata.robots).toMatchObject({ index: false, follow: true });
});
```

- [ ] **Step 2: Run metadata tests and verify RED**

Run: `pnpm test tests/seo-metadata.test.ts`
Expected: FAIL because the builder does not exist.

- [ ] **Step 3: Implement metadata builders**

```ts
export function createPageMetadata(input: PageSeoInput, env?: SiteEnvironment): Metadata {
  const canonical = absoluteUrl(input.pathname, env);
  const image = absoluteUrl(input.imagePath ?? "/opengraph-image", env);
  return {
    title: input.title,
    description: input.description,
    alternates: { canonical },
    robots: { index: input.index !== false, follow: true },
    openGraph: { type: "website", url: canonical, title: input.title, description: input.description, siteName: SITE_NAME, images: [{ url: image, width: 1200, height: 630, alt: input.imageAlt ?? input.title }] },
    twitter: { card: "summary_large_image", title: input.title, description: input.description, images: [image] },
  };
}
```

`createExhibitMetadata` uses the registry title, synopsis, route, slug card, and `index: exhibit.access.mode !== "private"`.

- [ ] **Step 4: Run metadata tests and verify GREEN**

Run: `pnpm test tests/seo-metadata.test.ts`
Expected: PASS.

- [ ] **Step 5: Write failing JSON-LD tests**

```tsx
it("escapes markup and describes a member exhibit gate", () => {
  const exhibit = memberVersion(getExhibitBySlug("atlas-of-worlds")!);
  const graph = createExhibitGraph(exhibit, { NEXT_PUBLIC_SITE_URL: "https://museum.example" });
  expect(graph.isAccessibleForFree).toBe(false);
  expect(graph.hasPart).toMatchObject({ cssSelector: ".member-content", isAccessibleForFree: false });
  expect(serializeJsonLd({ value: "</script><script>" })).not.toContain("</script>");
});

it("renders native JSON-LD", () => {
  const { container } = render(<JsonLd data={{ "@context": "https://schema.org", "@type": "WebSite" }} />);
  expect(container.querySelector('script[type="application/ld+json"]')).toBeTruthy();
});
```

- [ ] **Step 6: Run JSON-LD tests and verify RED**

Run: `pnpm test tests/seo-json-ld.test.tsx`
Expected: FAIL because the JSON-LD module does not exist.

- [ ] **Step 7: Implement the graph builders and component**

```ts
export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
```

Use `WebSite`, `Organization`, `WebPage`, `CreativeWork`, `LearningResource`, and `BreadcrumbList`. Use stable `@id` URLs. Member graphs include `.member-content`; public graphs set `isAccessibleForFree: true`; private exhibits are never passed to public graph builders.

- [ ] **Step 8: Run JSON-LD tests and verify GREEN**

Run: `pnpm test tests/seo-json-ld.test.tsx`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add lib/seo/metadata.ts lib/seo/json-ld.ts components/seo/JsonLd.tsx tests/seo-metadata.test.ts tests/seo-json-ld.test.tsx
git commit -m "feat: add metadata and structured data builders"
```

### Task 3: Robots, sitemap, manifest, and social cards

**Files:**
- Create: `app/robots.ts`
- Create: `app/sitemap.ts`
- Create: `app/manifest.ts`
- Create: `app/social/[kind]/[...slug]/route.tsx`
- Create: `lib/seo/social-card.ts`
- Test: `tests/seo-routes.test.ts`
- Test: `tests/seo-social-card.test.ts`

**Interfaces:**
- Produces: default metadata-route functions for robots/sitemap/manifest
- Produces: `resolveSocialCard(kind, slugParts): SocialCardContent | null`

- [ ] **Step 1: Write failing metadata-route tests**

```ts
it("advertises the absolute sitemap and excludes private surfaces", () => {
  const output = robots();
  expect(output.sitemap).toBe("https://museum.example/sitemap.xml");
  expect(JSON.stringify(output.rules)).toContain("/api/private/");
});

it("sitemaps only discoverable canonical exhibits", () => {
  const urls = sitemap().map((entry) => entry.url);
  expect(urls).toContain("https://museum.example/exhibits/atlas-of-worlds");
  expect(urls.some((url) => url.includes("?"))).toBe(false);
  expect(urls.some((url) => url.includes("sign-in"))).toBe(false);
});
```

Set and restore `process.env.NEXT_PUBLIC_SITE_URL` in the test lifecycle.

- [ ] **Step 2: Run route tests and verify RED**

Run: `pnpm test tests/seo-routes.test.ts`
Expected: FAIL because the metadata routes do not exist.

- [ ] **Step 3: Implement robots, sitemap, and manifest**

Use `MetadataRoute.Robots`, `MetadataRoute.Sitemap`, and `MetadataRoute.Manifest`. Sitemap exhibit entries come from `getActiveExhibits().filter(isPubliclyDiscoverable)` and use registry `lastModified`.

- [ ] **Step 4: Run route tests and verify GREEN**

Run: `pnpm test tests/seo-routes.test.ts`
Expected: PASS.

- [ ] **Step 5: Write failing social-card allowlist tests**

```ts
it("resolves known exhibits and rejects reflected input", () => {
  expect(resolveSocialCard("exhibit", ["atlas-of-worlds"])?.title).toBe("Atlas of Worlds");
  expect(resolveSocialCard("exhibit", ["<script>"])).toBeNull();
  expect(resolveSocialCard("unknown", ["atlas-of-worlds"])).toBeNull();
});
```

- [ ] **Step 6: Run card tests and verify RED**

Run: `pnpm test tests/seo-social-card.test.ts`
Expected: FAIL because the resolver does not exist.

- [ ] **Step 7: Implement allowlisted `ImageResponse` cards**

The route accepts `params: Promise<{ kind: string; slug: string[] }>` and renders only resolved registry content at 1200×630. Unknown identifiers return the allowlisted museum default card; no request text is reflected.

- [ ] **Step 8: Run card tests and verify GREEN**

Run: `pnpm test tests/seo-social-card.test.ts`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add app/robots.ts app/sitemap.ts app/manifest.ts app/social lib/seo/social-card.ts tests/seo-routes.test.ts tests/seo-social-card.test.ts
git commit -m "feat: expose crawler and social discovery routes"
```

### Task 4: Apply root, home, catalog, and exhibit metadata

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`
- Modify: `app/exhibits/page.tsx`
- Modify: `app/exhibits/*/page.tsx`
- Test: `tests/seo-pages.test.tsx`
- Test: `tests/exhibits-catalog.test.tsx`

**Interfaces:**
- Consumes: metadata and JSON-LD builders from Tasks 1–3
- Produces: page metadata exports and catalog `generateMetadata`

- [ ] **Step 1: Write failing page metadata tests**

```ts
it("gives the home and catalog different canonical identities", async () => {
  expect(homeMetadata.alternates?.canonical).toBe("https://museum.example/");
  const catalog = await generateCatalogMetadata({ searchParams: Promise.resolve({}) });
  expect(catalog.title).toBe("Explore every exhibit");
  expect(catalog.alternates?.canonical).toBe("https://museum.example/exhibits");
});

it("noindexes filtered catalog URLs", async () => {
  const metadata = await generateCatalogMetadata({ searchParams: Promise.resolve({ wing: "space" }) });
  expect(metadata.robots).toMatchObject({ index: false, follow: true });
});
```

- [ ] **Step 2: Run page tests and verify RED**

Run: `pnpm test tests/seo-pages.test.tsx tests/exhibits-catalog.test.tsx`
Expected: FAIL because canonical/social/query metadata is missing.

- [ ] **Step 3: Apply root metadata and site JSON-LD**

Set `metadataBase`, default social fields, manifest, verification environment hooks, and the site graph in `app/layout.tsx`. Do not set a root canonical that descendants would inherit.

- [ ] **Step 4: Apply page-specific metadata**

Export home metadata from `app/page.tsx`; export `generateMetadata` from the catalog using the awaited query object; replace manual exhibit metadata objects with `createExhibitMetadata(getExhibitBySlug(...)!)`; render exhibit/breadcrumb JSON-LD adjacent to visible content.

- [ ] **Step 5: Run page tests and the related existing tests**

Run: `pnpm test tests/seo-pages.test.tsx tests/exhibits-catalog.test.tsx tests/museum-homepage.test.tsx tests/exhibits-registry.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add app/layout.tsx app/page.tsx app/exhibits tests/seo-pages.test.tsx tests/exhibits-catalog.test.tsx
git commit -m "feat: apply canonical metadata across museum pages"
```

### Task 5: Auth-safe interactive boundary and true redirects

**Files:**
- Create: `components/museum/ExhibitAccessBoundary.tsx`
- Create: `components/museum/exhibit-access.module.css`
- Modify: `app/exhibits/human-anatomy/page.tsx`
- Modify: `app/exhibits/atlas-of-worlds/page.tsx`
- Modify: `app/exhibits/becoming-human/page.tsx`
- Modify: `app/exhibits/jet-engine/page.tsx`
- Modify: `app/exhibits/thirteen-minutes/page.tsx`
- Modify: `next.config.ts`
- Delete: `app/exhibits/earth/page.tsx`
- Delete: `app/exhibits/moon/page.tsx`
- Test: `tests/exhibit-access-boundary.test.tsx`
- Test: `tests/atlas-route.test.tsx`
- Test: `tests/jet-engine-route.test.tsx`

**Interfaces:**
- Produces: `ExhibitAccessBoundary({ exhibit, viewer?, signInPath?, children })`
- Consumes: `canEnterExhibit` and registry access policy

- [ ] **Step 1: Write failing boundary tests**

```tsx
it("keeps member exhibit context public and gates only children", () => {
  render(
    <main><h1>Atlas of Worlds</h1><p>Ten sourced worlds.</p>
      <ExhibitAccessBoundary exhibit={memberAtlas} viewer={{ signedIn: false }}>
        <div>Interactive instrument</div>
      </ExhibitAccessBoundary>
    </main>,
  );
  expect(screen.getByRole("heading", { name: "Atlas of Worlds" })).toBeVisible();
  expect(screen.queryByText("Interactive instrument")).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: /sign in to enter/i })).toHaveAttribute(
    "href", "/sign-in?returnTo=%2Fexhibits%2Fatlas-of-worlds",
  );
  expect(document.querySelector(".member-content")).toBeTruthy();
});
```

- [ ] **Step 2: Run boundary tests and verify RED**

Run: `pnpm test tests/exhibit-access-boundary.test.tsx`
Expected: FAIL because the boundary does not exist.

- [ ] **Step 3: Implement the boundary**

Public exhibits render children. Member exhibits render children only for `viewer.signedIn`; otherwise render the configured gate within `.member-content`. Private exhibits render no children. The default viewer is signed out until a future server auth adapter supplies an authenticated viewer.

- [ ] **Step 4: Run boundary tests and verify GREEN**

Run: `pnpm test tests/exhibit-access-boundary.test.tsx`
Expected: PASS.

- [ ] **Step 5: Wrap only interactive regions on all five exhibits**

Keep thesis, reading edition, sources, and navigation outside the boundary. Current `public` policies render unchanged interactive behavior.

- [ ] **Step 6: Add HTTP redirects**

```ts
async redirects() {
  return [
    { source: "/exhibits/earth", destination: "/exhibits/atlas-of-worlds?world=earth", permanent: true },
    { source: "/exhibits/moon", destination: "/exhibits/atlas-of-worlds?world=moon", permanent: true },
  ];
}
```

Delete the static meta-refresh page files after the redirect tests fail without the config and pass with it.

- [ ] **Step 7: Run route and boundary tests**

Run: `pnpm test tests/exhibit-access-boundary.test.tsx tests/atlas-route.test.tsx tests/jet-engine-route.test.tsx tests/thirteen-minutes-experience.test.tsx`
Expected: PASS.

- [ ] **Step 8: Run the complete phase test and build gate**

Run: `pnpm test`
Expected: all tests PASS.

Run: `pnpm build`
Expected: production build exits 0 and lists `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest`, and the social-card route.

- [ ] **Step 9: Commit**

```bash
git add components/museum/ExhibitAccessBoundary.tsx components/museum/exhibit-access.module.css app/exhibits next.config.ts tests
git commit -m "feat: make exhibit access auth-safe and indexable"
```

