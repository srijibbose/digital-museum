# Loupe Scalable Homepage Redesign

## Decision

Implement the selected search-led homepage direction (the second generated concept) as a responsive Loupe experience. The generated concept is a layout and hierarchy reference only. None of its generated exhibit imagery may ship.

## Visitor promise

Loupe is a digital museum for exploring how the world works through interactive, source-grounded exhibits. A first-time visitor should understand that proposition, search the museum, or enter an exhibit without scrolling through explanatory marketing copy.

## Production asset contract

- Reuse the current `ExhibitPoster` variants for Human Anatomy, Becoming Human, The Engine Is a River, Thirteen Minutes, and Atlas of Worlds.
- Preserve the current poster motion and each poster's reduced-motion behavior.
- Reuse local sourced anatomy and planetary imagery already referenced by those posters.
- Do not add generated concept imagery, replacement thumbnails, stock stand-ins, gradients pretending to be exhibit art, or newly drawn poster approximations.
- The mockup file `C:/Users/Srijib/.codex/generated_images/01a02eef-b08b-70c2-a121-0049e3fecdcb/exec-e0acf00d-6f13-4d84-b401-5677d1736893.png` is a non-production visual reference.

## Homepage

The homepage uses the current ink, warm-paper, editorial-serif, and restrained-sans identity in a lighter, search-led composition.

### Header

- Keep the Loupe mark.
- Provide working links to Browse All, Wings, and About.
- Provide an accessible mobile navigation rather than hiding navigation.
- Do not advertise Collections or Saved until those destinations have meaningful behavior.

### Hero

- Eyebrow: `LOUPE / DIGITAL MUSEUM`
- Heading: `A digital museum for exploring how the world works.`
- Body: `Enter interactive, source-grounded exhibits on the human body, machines, space, and human history.`
- The primary action opens the complete exhibits catalog.
- `Surprise me` opens one enabled exhibit and is keyboard accessible.
- Search submits a shareable `q` parameter to `/exhibits`.
- Search suggestions are derived from active exhibit metadata and use an accessible combobox/listbox interaction.

### Quick paths and featured exhibits

- Quick paths lead to real catalog filters: under 15 minutes, interactive 3D, Space, and staff picks.
- The featured strip uses compact cards capped to the curated featured set.
- Each compact card reuses the existing poster component and exposes wing, title, duration, format, and exhibit link.
- The homepage never grows linearly with the complete catalog.

### Wings and about

- Stable wing gateways show current active counts and link to filtered catalog states.
- The institutional statement explains Loupe's source-grounded, bounded exhibit model without repeating the hero.

## All Exhibits catalog

- Route: `/exhibits`.
- Read `searchParams` asynchronously per Next.js 16 conventions.
- Search and filter on the server against the exhibit registry.
- Supported filters: text query, wing, duration, format, and featured status.
- Supported sorts: curator order, title, and duration.
- Use a bounded page size and preserve filters in pagination URLs.
- Show a result count, active filters, clear-filter action, meaningful empty state, and loading state.
- Cards remain compact and reuse current posters.

## Data contract

Each exhibit has explicit discovery metadata:

- `durationMinutes`: representative visit duration used for sorting and duration filters.
- `formats`: stable machine-readable format identifiers such as `interactive-3d`, `simulation`, `archival-audio`, `evidence-led`, and `comparison`.

Search indexes title, tagline, synopsis, curator note, wing title, interaction type, and tags. Query matching is case-insensitive and whitespace-normalized.

## Responsive and accessibility requirements

- Desktop target: 1440 × 1024, matching the selected concept's hierarchy.
- Mobile target: 390 × 844 with the complete core journey intact.
- Search has a visible label or accessible name, keyboard-operable suggestions, and an announced result context.
- Touch targets are at least 44 CSS pixels where controls are compact.
- Focus states remain visible on paper and ink surfaces.
- Poster animation respects `prefers-reduced-motion`.
- Empty and loading states preserve navigation and explain what happened.

## Verification contract

- Registry/discovery utility tests cover search, filter intersection, sort, pagination URLs, and surprise selection.
- Component tests cover the hero proposition, functional search form, suggestion behavior, compact cards, mobile navigation semantics, and empty catalog state.
- Run the complete Vitest suite and a production Next.js build.
- Capture and inspect homepage and catalog at 1440 × 1024 and 390 × 844.
- Exercise search, quick filters, catalog filtering, empty state, surprise action, and exhibit navigation in the browser.
- Compare the rendered homepage to the selected reference at the same desktop viewport; preserve hierarchy while documenting the deliberate use of current poster art instead of generated imagery.
