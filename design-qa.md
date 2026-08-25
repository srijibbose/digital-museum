# Loupe Homepage Redesign — Design QA

## Comparison target

- Source visual truth: `C:\Users\Srijib\.codex\generated_images\01a02eef-b08b-70c2-a121-0049e3fecdcb\exec-e0acf00d-6f13-4d84-b401-5677d1736893.png`
- Final implementation: `C:\Users\Srijib\.codex\visualizations\2026\08\23\01a02eef-b08b-70c2-a121-0049e3fecdcb\implementation-home-desktop-final.png`
- Full comparison input, source left / implementation right: `C:\Users\Srijib\.codex\visualizations\2026\08\23\01a02eef-b08b-70c2-a121-0049e3fecdcb\design-comparison-home-full.png`
- Focused hero comparison input, source left / implementation right: `C:\Users\Srijib\.codex\visualizations\2026\08\23\01a02eef-b08b-70c2-a121-0049e3fecdcb\design-comparison-home-hero.png`
- Mobile implementation: `C:\Users\Srijib\.codex\visualizations\2026\08\23\01a02eef-b08b-70c2-a121-0049e3fecdcb\implementation-home-mobile-final.png`
- Catalog evidence: `C:\Users\Srijib\.codex\visualizations\2026\08\23\01a02eef-b08b-70c2-a121-0049e3fecdcb\implementation-catalog-desktop-final.png` and `C:\Users\Srijib\.codex\visualizations\2026\08\23\01a02eef-b08b-70c2-a121-0049e3fecdcb\implementation-catalog-mobile-final.png`
- Lower-page evidence: `C:\Users\Srijib\.codex\visualizations\2026\08\23\01a02eef-b08b-70c2-a121-0049e3fecdcb\implementation-home-desktop-lower-2.png` and `C:\Users\Srijib\.codex\visualizations\2026\08\23\01a02eef-b08b-70c2-a121-0049e3fecdcb\implementation-home-desktop-lower-3.png`

## Normalization

- Intended CSS viewport: 1440 × 1024, desktop, light homepage state, empty search, device scale factor 1.
- Source pixels: 1487 × 1058.
- Browser implementation capture pixels: 1425 × 994. The in-app browser capture excludes its scrollbar/chrome gutters from the 1440 × 1024 CSS override.
- Source normalized with high-quality bicubic resampling to 1425 × 994 before comparison.
- Full comparison pixels: 2850 × 994. Focused hero comparison pixels: 2850 × 720.
- Mobile CSS viewport: 390 × 844; browser content width is 375px after the scrollbar gutter.

## State and evidence

- Final capture is from `next start` after a successful production build, not the development server.
- Homepage and catalog were checked at 1440 × 1024 and 390 × 844.
- Full-view comparison evaluates the complete above-the-fold composition and the featured-card entry point.
- Focused comparison was required because headline wrap, search proportions, CTA hierarchy, and quick-path density are the key fidelity surfaces in the selected reference.
- Lower-page viewport captures were used instead of a stitched full-page image because the browser's full-page stitch repeated animated regions even though DOM counts were correct (5 featured articles, 4 wing links, 1 about heading).

## Comparison history

### Iteration 1 — blocked

- [P2] Hero proportions pushed featured content below the desktop fold.
  - Evidence: `C:\Users\Srijib\.codex\visualizations\2026\08\23\01a02eef-b08b-70c2-a121-0049e3fecdcb\implementation-home-desktop-v1.png` used a three-line headline, narrow search field, and an 838px combined hero/quick-path block; the selected reference used a two-line headline and exposed featured cards within the first viewport.
  - Fix: widened the content/search track, reduced the display scale, centered the CTAs, reduced hero height, added the source-like header divider, and compacted the featured header.
  - Post-fix evidence: the final implementation and full comparison paths recorded above.

- [P2] Mobile proposition density hid the discovery paths.
  - Evidence: `C:\Users\Srijib\.codex\visualizations\2026\08\23\01a02eef-b08b-70c2-a121-0049e3fecdcb\implementation-home-mobile-v1.png` wrapped the headline across five large lines and stacked both hero actions, so the quick paths were not visible in the 390 × 844 viewport.
  - Fix: reduced the mobile display scale, preserved readable line height, and placed the two hero actions in a balanced two-column grid.
  - Post-fix evidence: the mobile implementation path recorded above, where the proposition, search, both CTAs, and the first quick paths are visible without horizontal overflow.

- [P2] The first catalog implementation paginated five exhibits into 4 + 1.
  - Evidence: the catalog route initially used a four-item page size and exposed a second page for one exhibit.
  - Fix: changed the catalog page size to 12 and added a regression expectation that the current five remain together while the pure catalog utility continues to test bounded pagination for large registries.
  - Post-fix evidence: the desktop catalog path recorded above, five result articles, no premature next-page control.

### Iteration 2 — passed

The final combined comparison has no actionable P0/P1/P2 findings.

## Required fidelity surfaces

- Fonts and typography: Passed. The existing Loupe Baskerville/Iowan-style display stack and Avenir/Segoe UI sans stack retain the source's editorial hierarchy. The desktop title holds two lines; the mobile title remains readable without dominating the full viewport. Small labels use consistent weight, case, and tracking.
- Spacing and layout rhythm: Passed. Header, hero copy, search, CTA pair, quick paths, featured gateway, wing grid, and about section follow a coherent vertical system. Desktop and mobile show no horizontal overflow.
- Colors and visual tokens: Passed. Warm paper, near-black ink, restrained rust accent, hairline borders, and the dark featured field map closely to the reference. Contrast remains legible in both themes.
- Image quality and asset fidelity: Passed with an intentional product constraint. The generated reference thumbnails were not shipped. Final cards reuse Loupe's current local/source-grounded exhibit posters and animations, including the Human Reference Atlas and NASA/USGS planetary media. No new generated, stock, placeholder, or approximate exhibit imagery was introduced.
- Copy and content: Passed. The hero explicitly defines Loupe as a digital museum and names its subjects. Vague labels were replaced with functional catalog, wing, duration, format, and trust language. `Featured exhibits` replaces the earlier ambiguous section title.
- Icons: Passed. Search, clock, sparkle, and external-link indicators use the existing Lucide icon family; the Loupe mark remains the existing product mark.
- Responsive behavior: Passed at 1440 × 1024 and 390 × 844. Mobile navigation is available through a native details/summary menu, filters collapse to a practical two-column grid, and featured cards remain horizontally discoverable.
- Accessibility: Passed for the implemented scope. Search, filter, pagination, menu, and result regions have names; form controls have labels; focus-visible and reduced-motion styles are present; mobile tap targets are practical.

## Intentional differences from the visual reference

- Search suggestions are query-driven instead of permanently occupying an empty suggestion row, keeping the blank state quieter while still exposing real result suggestions after two characters.
- `Collections` and `Saved` were not copied because those destinations do not exist. Navigation links only to working catalog, wing, and about destinations.
- `Explore Space` replaces the mock's unsupported `New this month` shortcut.
- Real current exhibit posters replace all generated mock thumbnails by explicit user requirement.

## Primary interactions tested

- Homepage autocomplete: `planet` reveals the real Atlas of Worlds suggestion; Escape closes it.
- Homepage GET search: `Apollo` opens `/exhibits?q=Apollo` with Thirteen Minutes as the result.
- Intersected filters: wing + short duration + Interactive 3D + staff picks returns one matching exhibit and retains control state in the URL.
- Empty state: a no-match query displays `No exhibits found` and a working `Clear all filters` link.
- Quick path: `Under 15 minutes` opens the catalog with two matching exhibits.
- Surprise Me: production navigation opened a real enabled exhibit route.
- Pagination behavior is covered by the pure catalog tests; the five-item live catalog correctly has no unnecessary pagination.
- Mobile menu opens and exposes Browse all, Wings, and About.
- Homepage/catalog production console: zero errors and zero warnings in a clean tab.

## Residual gaps

- No P0/P1/P2 visual or interaction gaps remain for the homepage/catalog scope.
- Individual exhibit routes retain their own independent QA and may emit legacy library warnings outside this redesign; those were not introduced by the homepage/catalog work.

final result: passed
