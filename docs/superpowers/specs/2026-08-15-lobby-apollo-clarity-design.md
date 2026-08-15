# Lobby and Apollo Clarity Design

## Goal

Give Loupe's landing page a more deliberate, award-caliber arrival while making the Apollo 11 descent's interactive controls discoverable, descriptive, and visibly actionable.

## Scope and constraints

- Preserve the registry-driven exhibit directory already introduced in the current workspace.
- Borrow the reference branch's editorial pacing, but do not check it out or import its unrelated changes.
- Keep the homepage a static Server Component and the existing Apollo client boundary intact.
- Preserve the Apollo scene, narrative beats, and existing keyboard/screen-reader behavior.
- Do not touch the uncommitted Full Throttle implementation or its supporting files.

## Homepage

The hero becomes a composed "museum threshold" rather than a single headline on a decorative field. Its large serif line remains the focal point, while a warm lens-like field, fine registration lines, and a compact collection marker add depth. The call to action changes from an ambiguous round “Enter” affordance to a visible text action, “Explore the exhibitions,” with a directional cue. A short supporting statement makes the page's purpose clear before the exhibit directory begins.

The exhibit directory stays registry-driven. Its dark cards, metadata and clear entry action are retained because they are the useful part of the current reference-derived composition.

## Apollo controls

Interactive controls use a consistent command pattern:

1. A clear action label: “Inspect Eagle” or “Show landing paths”.
2. A smaller, concrete result label: “Orbit the model” or “Reveal planned vs. actual”.
3. A contextual guide that says exactly which gesture is now possible and what it changes.

The model can only be orbited when inspection is active, so the guide explicitly states “Drag the scene to orbit Eagle” only in that state. It does not promise zoom, because the scene's `OrbitControls` deliberately disables zoom. Chapter navigation shows the destination chapter in its visible label. The 1202 card's terse “Dropped” and “Kept” choices become explicit explanatory actions.

## Accessibility and responsive behavior

- Every new visual label supplements—not replaces—an accessible name.
- The action guide uses an `aria-live` region so the new capability is announced after toggling inspection or comparison.
- Existing ARIA labels remain stable for automated and assistive-technology users.
- On small screens, the concise action label remains available while secondary visual labels may be hidden only when space is constrained.

## Verification

- Lobby tests assert that the hero action leads to the exhibit directory and has clear visible intent.
- Apollo interaction tests assert that enabling inspection exposes the explicit drag guidance, comparison names its result, chapter controls name their destination, and 1202 actions name the material being explained.
- The focused Vitest suites, TypeScript check/build, and a browser pass at desktop and mobile widths verify the result.
