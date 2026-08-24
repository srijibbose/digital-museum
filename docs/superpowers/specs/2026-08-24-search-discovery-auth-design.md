# Search, Discovery, and Auth-Safe Publishing Design

**Date:** 2026-08-24  
**Status:** Approved for planning  
**Scope:** Loupe-wide SEO, AI discovery, public exhibit publishing, and future authenticated exhibit access

## 1. Purpose

Loupe must remain discoverable when some exhibit experiences require an account. A visitor who finds a member exhibit through Google, ChatGPT, Claude, Perplexity, Bing, or a shared link must arrive at a useful, honest, public museum page rather than a generic sign-in redirect. Authentication may gate the interactive instrument, saved progress, personalization, or selected deeper material; it must not erase the exhibit's public identity and educational value.

This design establishes one publishing contract for every current and future exhibit. It covers canonical URLs, metadata, structured data, crawler policy, sitemaps, public reading editions, topic records, internal discovery, social previews, performance safeguards, and deployment verification.

It does not promise a search position. Rankings remain dependent on relevance, competition, authority, links, user response, and search-engine systems outside Loupe's control.

## 2. Product promise

Loupe should be understandable before it is entered. Search visitors and AI retrieval systems receive enough public, source-grounded material to identify each exhibit's subject, curatorial thesis, learning value, evidence, limits, and relationship to the rest of the museum. Members receive the additional value of the full interactive experience and account-bound capabilities.

The resulting visitor transformation is: a person can discover a precise scientific or historical topic through search, understand why Loupe's treatment is distinctive and trustworthy, and then choose whether to enter or sign in without encountering a misleading or empty landing page.

## 3. Non-negotiable principles

1. **No cloaking.** Public HTML must not branch on crawler user agent. Signed-out humans and crawlers receive the same public edition.
2. **Useful public pages.** An indexable page must be a complete visitor-facing reading experience, not a hidden or thin SEO page.
3. **Honest access labels.** Member-only regions are visibly identified and represented in structured data with `isAccessibleForFree` and `hasPart` when applicable.
4. **No fabricated signals.** Loupe will not emit reviews, ratings, awards, authors, dates, institutional affiliations, or claims that are not supported by the repository and visible page content.
5. **One canonical identity.** Every indexable document has one absolute canonical URL on the configured production origin.
6. **Evidence remains legible.** Observation, reconstruction, inference, processing, and illustration retain their existing distinctions in public editions.
7. **Performance is part of discovery.** Reading content must not require WebGL or the download of large 3D assets.
8. **Private means private.** Account data, dashboards, drafts, and genuinely confidential content are authenticated and `noindex`; SEO metadata is not used to leak their contents.

These principles apply the Loupe Premium Exhibit Standard to discovery and access control: public fallbacks, direct links, source trails, responsive behavior, accessibility, and verification are part of the exhibit rather than promotional decoration.

## 4. Access model

Each exhibit registry entry gains an explicit access policy:

```ts
type ExhibitAccess =
  | { mode: "public" }
  | {
      mode: "members";
      gateLabel: string;
      gateDescription: string;
    }
  | { mode: "private" };
```

### Public exhibits

- The public edition and interactive experience are available without authentication.
- Metadata declares `isAccessibleForFree: true`.
- The canonical exhibit and substantive topic records are included in the sitemap.

### Member exhibits

- The canonical exhibit URL remains public and indexable.
- The public page includes the exhibit title, thesis, synopsis, learning outline, representative evidence, source trail, limits, related topics, and an accessible text edition or substantial sample.
- The interactive experience is rendered inside one `.member-content` access region.
- A signed-out visitor sees an honest sign-in invitation in that region; a member sees the instrument.
- Structured data declares `isAccessibleForFree: false` for the gated creative work and points `hasPart.cssSelector` to `.member-content`.
- The server must not serialize confidential or paid-only content into the signed-out browser response merely to make it crawlable.

### Private exhibits

- Private exhibits are excluded from the public catalog, internal search index, sitemap, and related-content recommendations.
- Their routes require authorization and send `noindex, nofollow, noarchive` when a response can be rendered.
- Private drafts are not described in public JSON-LD or metadata.

### Authentication integration contract

The SEO platform will not select an authentication vendor. It exposes a small access-boundary interface so a future Clerk, Auth0, Descope, or custom session implementation can provide member state without changing exhibit metadata or URLs. The default implementation leaves current exhibits public and supplies a deterministic signed-out preview state for tests.

Sign-in, sign-up, account, history, and dashboard pages are never canonical content destinations. After authentication, the visitor returns to the original exhibit URL rather than a separate member-only duplicate URL.

## 5. Canonical origin and environments

`lib/seo/site.ts` becomes the sole source of the public origin and museum identity.

Origin resolution order:

1. `NEXT_PUBLIC_SITE_URL`, normalized to an absolute `http` or `https` origin.
2. `VERCEL_PROJECT_PRODUCTION_URL` with `https://` added when necessary.
3. `VERCEL_URL` for preview-only rendering.
4. `http://localhost:3000` for local development and tests.

Production deployment documentation requires `NEXT_PUBLIC_SITE_URL` to be the permanent custom domain. Preview deployments emit `noindex` through the deployment platform or environment policy and must not be submitted to search engines. Canonicals, sitemap entries, JSON-LD identifiers, and social images all use the same origin helper.

## 6. Metadata system

The root layout defines:

- `metadataBase`;
- the Loupe title template and default description;
- application name, category, creator/publisher identity, and referrer policy;
- default `robots` directives;
- default Open Graph and Twitter card fields;
- icons and web manifest;
- optional Google and Bing verification tokens from environment variables.

Every canonical page defines or derives:

- a unique visitor-readable title;
- a unique description grounded in visible copy;
- an absolute canonical;
- Open Graph and Twitter title, description, URL, type, and generated image;
- appropriate robots directives;
- keywords only as an internal content-classification field, not as a ranking claim or legacy `meta keywords` tactic.

Catalog query results use dynamic metadata. The unfiltered first catalog page is indexable and canonical to `/exhibits`. Search, facet, sort, featured, and pagination variants are `noindex, follow` and canonical to the unfiltered catalog unless a future curated landing route supplies genuinely unique editorial content.

World or episode state must not depend on query parameters or fragments when it deserves an independent search identity. Substantive topic records receive stable path URLs.

## 7. Crawl and index control

### `robots.txt`

The production robots route:

- allows general crawling of public content;
- advertises the absolute sitemap and preferred host;
- allows Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot, and Perplexity-User through the public rules;
- disallows private API, account, dashboard, and framework-internal paths that have no search value;
- does not block sign-in pages solely as an indexing mechanism; those pages carry `noindex` so crawlers can read the directive;
- does not treat GPTBot or ClaudeBot training access as equivalent to search access. The initial policy allows them, but the rules remain isolated so the owner can later opt out of training without disabling AI search retrieval.

`robots.txt` is a crawl preference, not an authorization boundary. Private data remains protected by server authorization.

### Sitemap

The sitemap includes only:

- the museum home;
- the canonical catalog;
- enabled public and member exhibit pages;
- substantive public topic records;
- public institutional pages such as About and editorial methodology when present.

It excludes query variants, fragments, redirects, sign-in/sign-up, account pages, private exhibits, API routes, and error states. Entries use absolute URLs, honest modification dates when known, and restrained priorities/change frequencies. No generated `lastModified` value pretends that every page changed at build time.

## 8. Structured data

All JSON-LD is rendered as a native `<script type="application/ld+json">` from a focused server component. Serialization replaces `<` with `\u003c`.

### Site graph

The root graph contains:

- `WebSite` with the canonical home URL and name `Loupe Digital Museum`;
- `Organization` with only supported identity fields;
- a stable `@id` relationship between publisher and website.

### Page graph

- Home: `CollectionPage` describing the digital museum and its enabled exhibits.
- Catalog: `CollectionPage` with an `ItemList` of visible exhibits.
- Exhibit: `WebPage` plus `CreativeWork` and `LearningResource`, publisher relationship, subjects, educational level only when known, source citations, images, canonical URL, and access status.
- Topic record: `Article` plus `LearningResource` only when the visible page contains the corresponding authored narrative and sources.
- All non-home content: `BreadcrumbList` matching visible navigation.

For member exhibits, the `CreativeWork` uses `isAccessibleForFree: false` and a `WebPageElement` `hasPart` pointing to `.member-content`. The public editorial shell remains separately described as visible page content. Structured data never describes locked material that is absent from both the public page and the authenticated experience.

## 9. Public reading editions and topic records

Every interactive exhibit must have a server-rendered public edition outside the client-only instrument. Current strengths in Anatomy and Atlas become the standard.

### Main exhibit editions

- Atlas receives an exhibit-level `h1`, concise orientation, the existing ten-world transcript, source ledger, and links to world records.
- Becoming Human receives a complete linear public research edition generated from its 35 authored episodes, evidence status, uncertainty, and source lists. This remains available even if the cinematic instrument later requires membership.
- Anatomy retains its complete systems transcript, receives exhibit-level heading alignment, and links to system records.
- Jet Engine receives a server reading edition covering the thesis, reconstruction/model limits, stations, transformations, interpretations, and sources.
- Thirteen Minutes retains the continuous story and converts related exhibits into real links; its six beats become navigable reading records only when the page contains enough context to stand alone.

### Topic records

One generic, visible research-record route presents substantive source-backed records derived from existing authored content. The initial record set covers:

- Atlas worlds;
- Human Anatomy systems;
- Becoming Human episodes;
- Jet Engine flow stations; and
- Thirteen Minutes telemetry beats.

Each record must contain a distinct title, explanatory lead, at least one developed authored section, evidence or representational status, source links or a clearly inherited source ledger, a route back into the parent exhibit, related record links, breadcrumbs, and unique metadata. Records that cannot meet this contract are omitted rather than padded.

The research records are part of the visitor experience and are linked from exhibit reading editions. They are not doorway pages and are never generated from keyword permutations.

## 10. Internal discovery

- Every exhibit page links to the catalog, its wing, related exhibits, and its public records.
- Every record links to its parent exhibit plus adjacent or related records.
- Related-exhibit cards are actual links.
- Breadcrumbs use visible HTML and matching JSON-LD.
- Member gates preserve the originating URL in their sign-in link.
- The homepage and catalog avoid creating crawlable combinations of arbitrary facets beyond their existing user-facing forms.
- Decorative poster media remains decorative; share and research imagery receives descriptive context, captions, and rights/source information where available.

## 11. Social and image discovery

A deterministic `ImageResponse` endpoint produces 1200×630 social cards for the museum, catalog, exhibits, and research records from allowlisted content. It accepts stable identifiers, never arbitrary text, remote URLs, or user input. Each card includes Loupe identity, the exhibit or record title, wing/record context, and restrained evidence language.

Metadata references the absolute card URL. Cards include meaningful alternative text. Existing scientific and archival images retain their credits and are not falsely represented as Loupe-owned assets.

## 12. Performance strategy

Public reading content is delivered before interactive assets and remains useful with JavaScript disabled.

- Large GLB and WebGL dependencies load only when the interactive boundary is public/member-authorized and requested or near the viewport.
- Module-level `useGLTF.preload` calls that force multi-megabyte first-visit downloads are removed or moved behind an explicit warm-up action.
- Homepage/catalog poster images use `next/image` or equivalent responsive lazy-loading behavior with accurate `sizes`.
- Visible links to the home/catalog disable route prefetch where it would pull multi-megabyte poster resources into an exhibit visit.
- Versioned museum models and media receive long-lived immutable caching; mutable non-versioned URLs retain revalidation-safe caching until filenames are content-versioned.
- Canvas rendering retains capped DPR, reduced-motion behavior, loading fallbacks, and the accessible text alternative.

Performance acceptance uses both document-level resource assertions and browser evidence. Local timing is not presented as field Core Web Vitals. Production Vercel Speed Insights and Search Console remain the authoritative field sources after launch.

## 13. AI retrieval and agent compatibility

Search-oriented crawler access is kept separate from model-training preferences. Public editions use semantic headings, lists, citations, real links, labels, and stable URLs so retrieval systems do not need to operate the canvas to understand the subject.

Browser-agent compatibility follows the same accessibility tree used by people: descriptive button names, real links, form labels, native landmarks, and deterministic signed-out states. `llms.txt` may be added as a human-maintained navigation aid for systems that choose to use it, but it is not treated as a Google ranking mechanism or a substitute for HTML, sitemap, or crawler access.

## 14. Measurement and operational documentation

Vercel Analytics and Speed Insights remain installed. Deployment documentation adds:

- permanent-domain and environment-variable setup;
- Google Search Console and Bing Webmaster Tools verification;
- sitemap submission and URL Inspection steps;
- Rich Results Test and Schema Markup Validator checks;
- crawler/WAF validation for search and AI user agents;
- tracking of indexed canonical URLs, non-branded impressions, CTR, Core Web Vitals, referring domains, exhibit starts, member conversion, and AI referrals;
- an explicit note that referral attribution may be incomplete and that rankings are not guaranteed.

## 15. Error, fallback, and edge-state behavior

- Missing records use a real 404 response through `notFound()`.
- Disabled or private exhibits never masquerade as empty `200` pages.
- Invalid social-card identifiers return a deterministic museum card rather than reflecting input.
- Invalid site-origin environment values fail safely to the documented local origin during development and are surfaced by tests/build verification.
- Auth-provider failure leaves the public edition readable and shows a non-destructive sign-in-unavailable state inside the member boundary.
- JavaScript, WebGL, reduced-motion, and asset-load failure preserve the public thesis, evidence, and source access.

## 16. Test strategy

Implementation follows red-green-refactor. Tests prove behavior rather than source-string presence where a real function or rendered component can be exercised.

### Unit and contract tests

- origin normalization and absolute URL generation;
- access-policy defaults and private/member filtering;
- metadata uniqueness, canonical URLs, social cards, and robots directives;
- sitemap inclusion/exclusion;
- structured-data graphs, sanitization, access markup, and visible-content agreement;
- research-record uniqueness, minimum content contract, sources, and route resolution;
- social-card allowlisting;
- cache-header policy.

### Render tests

- signed-out member exhibits retain their public title, thesis, sources, reading edition, and gate;
- private exhibits remain absent from public discovery;
- the Becoming Human edition exposes episodes without clicking Begin;
- Atlas and Anatomy have one exhibit-level `h1`;
- related content and breadcrumbs are crawlable links;
- catalog query metadata is `noindex, follow` with the base canonical.

### Production verification

- full Vitest suite;
- Next.js production build;
- direct requests for canonical pages, records, redirects, robots, sitemap, manifest, and social images;
- HTML inspection with normal, Googlebot, OAI-SearchBot, Claude-SearchBot, and PerplexityBot user agents confirming identical public content;
- desktop and mobile browser review;
- keyboard and reduced-motion checks for access gates and reading navigation;
- resource-transfer comparison proving that public reading pages do not eagerly download every exhibit model.

## 17. Delivery phases

The work is one platform program delivered in three independently verifiable phases:

1. **SEO and access foundation:** origin, registry access policy, metadata, robots, sitemap, manifest, social images, JSON-LD, catalog query policy, redirects, and auth boundary contract.
2. **Public editions and research library:** Becoming Human edition, heading fixes, Jet Engine edition, related navigation, and substantive record routes for all five current exhibits.
3. **Performance and release verification:** gated/lazy interactive loading, poster and route-prefetch corrections, asset caching, browser/crawler QA, and deployment runbook.

No phase is described as the complete holistic system until all acceptance criteria below are verified.

## 18. Acceptance criteria

The design is implemented when current evidence proves all of the following:

1. Every enabled public/member exhibit has a unique canonical, title, description, social image, index policy, structured-data graph, public reading content, source trail, and internal links.
2. Changing an exhibit from `public` to `members` preserves its canonical route and substantive signed-out content while gating the configured interactive region.
3. Private exhibits and account surfaces are absent from public discovery and protected independently of robots rules.
4. Robots, sitemap, manifest, redirects, and social images return correct production responses.
5. Catalog query variants do not compete with the canonical catalog.
6. Becoming Human's authored episode content is retrievable without client interaction.
7. Topic records satisfy the content contract and are linked as genuine museum reading experiences.
8. JSON-LD matches visible content and correctly represents member access without fabricated fields.
9. Normal and named search/AI user agents receive the same public HTML.
10. Public reading routes do not eagerly fetch the complete multi-megabyte interactive asset set.
11. Automated tests, type checking, the production build, desktop/mobile review, keyboard review, reduced-motion review, crawler checks, structured-data checks, and resource evidence are current.
12. The deployment runbook explains the remaining external actions that code cannot perform: domain configuration, webmaster verification, sitemap submission, WAF allowlisting, and ongoing measurement.

## 19. Authoritative implementation references

- Google Search Central: subscription and paywalled content structured data
- Google Search Central: flexible sampling and cloaking distinction
- Google Search Central: JavaScript SEO and server-rendered content
- Google Search Central: canonical URLs, sitemaps, and robots directives
- Google Search Central: generative AI search guidance, including the non-requirement for `llms.txt`
- OpenAI publisher guidance for OAI-SearchBot and browser-agent accessibility
- Anthropic and Perplexity crawler documentation
- Installed Next.js 16.3 metadata, robots, sitemap, JSON-LD, redirect, and route-convention documentation
- `docs/premium-exhibit-standard.md`

