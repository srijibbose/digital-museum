# Thirteen Minutes — Exhibit Design

## Intent

Build a standalone Loupe exhibit at `/exhibits/thirteen-minutes` that turns Apollo 11's powered descent into a calm, tactile systems story. The shared mission HUD is the emotional engine: mission elapsed time, altitude, and estimated firing time remaining change as six full-screen narrative beats pass the viewport. The page must remain a complete article when JavaScript, scroll linking, or motion are unavailable.

The required v1 includes the static story, sticky HUD, bidirectional scroll updates, clickable and keyboard navigation, motion polish, reduced-motion behavior, and mobile/accessibility verification. Optional 3D and audio are intentionally excluded so the interaction, typography, and resilience receive the full quality budget.

## Visual direction: descent record

The experience resembles a flight record being read in a darkened control room, not a replica cockpit.

- Palette: blue-black graphite (`#070A0B`) with a slightly lifted instrument surface (`#0D1212`), warm phosphor amber (`#F2B84B`) for live telemetry, oxidized cream (`#E9E1CF`) for narrative copy, and desaturated sage (`#97A59A`) for secondary state.
- Type: the existing system stack for body copy, with a local CSS-built seven-segment face for telemetry. No external fonts or render-blocking requests.
- Composition: a quiet introductory threshold, then a compact sticky HUD above six near-viewport-height beats. A fine descent line and sparse coordinate marks give the numbers spatial continuity without illustrative spectacle.
- Texture: a deterministic CSS star map and one-pixel instrument rules. No glow, lens flare, heavy grain, card shadows, or ornamental gradients.
- Touchdown: the visual density drops. Altitude resolves to zero, the landing quotation becomes dominant, and the descent trace meets a single horizon rule.

## Interaction

The server-rendered page contains hook, context, all beats with local static telemetry, takeaway, the unresolved NASA transcript placeholder, and two related-exhibit cards. A client `TimelineExperience` enhances that document after hydration.

On standard-motion devices, GSAP ScrollTrigger observes each beat at the viewport center and updates one active index in either scroll direction. The HUD receives the active beat through props and briefly rolls only digits that changed. The progress rail receives the same index, so scroll, rail clicks, previous/next buttons, Home/End, and arrow-key navigation share one state path. Navigation scrolls the selected beat into view and focuses its heading without trapping the visitor.

On reduced-motion devices, the shared HUD is not pinned and digit rolling is disabled. Each beat's server-rendered telemetry remains visible, with no content hidden behind an opacity or transform state. CSS alone makes the article readable before hydration and when JavaScript is disabled.

## Reusable component boundaries

- `MissionHud` consumes `telemetry`, `activeLabel`, `beatNumber`, `beatCount`, and `animate`; it knows nothing about Apollo or `content.json`.
- `BeatSection` consumes a typed beat, ordinal, active state, and a ref callback; it renders semantic copy, optional quotation, and static fallback telemetry.
- `ProgressRail` consumes an array of `{ id, label }`, the active index, and an `onSelect(index)` callback. It owns no scroll logic.
- `TimelineExperience` imports exhibit content, coordinates refs and active state, and is the only component that knows about GSAP/ScrollTrigger.
- `content.json` remains the complete authoring source. `types.ts` and `content.ts` validate and expose it without coupling presentation components to the file.

## Historical accuracy decisions

NASA primary sources establish powered descent at `102:33:05.2` and `49,971 ft`, the first 1202 alarm at approximately `102:38:22–26` and `33,500 ft`, P66/manual control at `102:43:22` and about `410 ft`, and landing at `102:45:39.9`. NASA's postflight analysis gives roughly 45 seconds of hover time at touchdown, not seventeen.

The source brief's fuel countdowns cannot be verified as telemetry and conflict with the 45-second postflight margin. The exhibit will label early firing-time values with `≈` and explain that they are estimates derived from the elapsed descent and postflight margin. The hook, go-call timing, course-check copy, and touchdown copy will receive narrowly scoped factual corrections where the supplied wording conflicts with the NASA timeline. The structure, tone, labels, and systems-design thesis remain unchanged.

The NASA “go deeper” URL stays unresolved exactly as requested: it renders as a clearly disabled placeholder note, not a fabricated link.

## Accessibility and resilience

- A skip link moves directly to the narrative timeline.
- Semantic headings, articles, figures, blockquotes, and navigation landmarks preserve reading order.
- Every rail target is a real button with an accessible label, `aria-current`, visible focus treatment, and a minimum 44-pixel touch target.
- Previous/next controls expose their destination labels and disable correctly at either end.
- A polite status region announces the selected beat for non-scroll navigation without narrating ordinary scrolling excessively.
- At 320 CSS pixels wide, the HUD stacks without clipping and the rail becomes a horizontal bottom control strip. No viewport-width units create overflow.
- The page makes no external requests before meaningful text paints. CSS visuals are decorative and hidden from assistive technology.

## Verification strategy

Vitest and Testing Library cover content integrity, reusable component contracts, fallback telemetry, rail behavior, and non-scroll navigation. Playwright covers the real route at desktop and 390×844 mobile sizes, forward and reverse scroll activation, previous/next parity, keyboard navigation, reduced motion, no horizontal overflow, server-rendered/no-JS readability, and absence of failed or unexpected blocking requests. A production build and browser-console check are required before handoff.

No commits or pushes will be created.
