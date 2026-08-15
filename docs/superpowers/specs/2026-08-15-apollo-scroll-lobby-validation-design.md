# Apollo Scroll, Lobby Visibility, and Validation Design

**Status:** Approved for implementation on 2026-08-15
**Target branch:** `feat/thirteen-minutes-refinements`
**Target baseline:** `origin/feat/thirteen-minutes-refinements` at `35626e0`

## Goal

Restore reliable Apollo exhibit scrolling for mouse, trackpad, touch, keyboard, and reduced-motion users; remove The Living Atlas from the museum homepage without removing or disabling its route; and leave the current application with trustworthy desktop and mobile validation.

## Confirmed Root Cause

`TimelineExperience` creates Lenis with wheel smoothing enabled, then suppresses Lenis's GSAP ticker whenever the browser appears touch-capable. Desktop Chromium can report a nonzero `navigator.maxTouchPoints`, including on hybrid Windows devices and the existing Playwright environment. Lenis still cancels the wheel event, but without the ticker its scroll position never advances. A measured 600px wheel gesture therefore produced 0px of movement indefinitely; native reduced-motion scrolling moved 600px, and a forced non-touch Lenis run moved about 527px.

Programmatic beat navigation has a second scroll ownership conflict. The application applies `html { scroll-behavior: smooth }`, while `selectBeat` requests smooth scrolling. Existing regression tests correctly require deterministic immediate beat jumps so the HUD, rail, and focused heading cannot overshoot or drift.

## Scroll Architecture

The browser will own scrolling. Lenis will be removed from `TimelineExperience` and from the project dependencies. GSAP ScrollTrigger may continue observing native scroll position for beat entry and overall progress, while the existing passive native scroll listener remains the resilient source for centered-beat state and touch behavior.

Beat navigation from the rail, previous/next controls, and keyboard will use an immediate scroll. `selectBeat` will temporarily set the root element's inline `scroll-behavior` to `auto`, call `scrollIntoView({ block: "start", behavior: "auto" })`, then restore the previous inline value. Focus will continue moving to the destination heading without initiating another scroll.

## Homepage Visibility

The Living Atlas remains registered, enabled, directly routable at `/exhibits/living-atlas`, and fully tested. Its existing `featured` metadata becomes the homepage visibility contract:

- `enabled` controls whether a route is published.
- `featured` controls whether an enabled exhibit appears in the museum lobby.
- The homepage consumes a dedicated featured-exhibits query and derives its displayed wing count from that same list.

The Living Atlas will be marked `featured: false`; Thirteen Minutes remains featured. No anatomy implementation or content is deleted.

## Test and Validation Repairs

The test suite will cover real product behavior rather than stale implementation assumptions:

- Add a desktop mouse-wheel regression that proves scroll position advances in a touch-capable Chromium context and that the active beat progresses.
- Keep the existing unit expectations for immediate beat jumps and the temporary root scroll override.
- Assert that the homepage lists Thirteen Minutes but not The Living Atlas, while the Living Atlas direct route still renders.
- Replace the obsolete Apollo placeholder assertion with checks for the real NASA and source-code archival links already rendered by the page.
- Replace the invalid mobile geometry comparison against the full-screen transparent HUD container with comparisons against visible telemetry readouts, the progress rail, and the active heading.
- Preserve keyboard, reduced-motion, no-JavaScript, console-error, unexpected-resource, and horizontal-overflow coverage.

## Responsive and Accessibility Constraints

- Desktop validation at 1440×900 must cover mouse wheel, keyboard beat navigation, controls, and source links.
- Mobile validation at 390×844 and a narrower 360px viewport must cover native touch-style scrolling, HUD/rail/content separation, fixed controls, and horizontal overflow.
- Reduced-motion mode must avoid smooth-scroll enhancement and keep every beat's local telemetry readable.
- The no-JavaScript page must expose all beats and telemetry.
- Direct Living Atlas access must remain functional even though no homepage link is present.
- Builds and tests must run against Next.js 16.3.0 using the repository's production build and Playwright setup.

## Scope Boundaries

This repair does not redesign either exhibit, remove Living Atlas files, change Apollo historical content, or add new product features. Other problems discovered by the complete test/build/browser pass will be fixed only when evidence shows they affect the requested routes or validation reliability.
