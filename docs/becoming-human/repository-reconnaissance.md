# Becoming Human — repository reconnaissance

Date: 2026-08-18  
Baseline: `origin/main` at `87e5eb4`  
Feature branch: `codex/becoming-human`

## Platform fit

- Framework: Next.js 16.3 App Router, React 19, strict TypeScript.
- Route convention: one server `page.tsx` per exhibit under `app/exhibits/<slug>` with client islands for interaction.
- Chosen route: `/exhibits/becoming-human`.
- Exhibit registration: `content/exhibits.ts`; lobby cards use `components/museum/ExhibitCard.tsx` and the poster switch in `components/museum/posters/ExhibitPoster.tsx`.
- Styling: global Loupe shell tokens live in `app/globals.css`; route-specific work should use a CSS Module to prevent exhibit styles leaking across routes.
- Renderer stack: React Three Fiber + Drei + Three.js already ship. Existing exhibits use client-only dynamic canvas loading and HTML fallbacks. Becoming Human will reuse R3F with one persistent canvas, capped DPR, demand rendering, and a semantic DOM path.
- Motion stack: GSAP is installed, but native scroll/IntersectionObserver and CSS transitions are sufficient for the first complete pass and reduce lifecycle risk.
- State: Zustand is available, but the exhibit can keep session UI state local and persist only minimal progress in `localStorage`.
- Analytics: Vercel Analytics and Speed Insights are mounted globally. There is no central product analytics event abstraction; a small exhibit-local adapter will emit DOM custom events now and can be connected later without coupling narrative code.
- Entitlement/paywall: no authentication, entitlement, or paywall implementation exists in the repository. Per product direction, this build exposes the premium threshold/entry experience but does not invent payment infrastructure.
- Error boundaries / localization / feature flags: no exhibit-specific abstractions found. Current content is English and registry `enabled` flags gate exhibits.
- Assets: runtime models live in `public/models`; editable Blender sources live in `assets/blender`; archival images live in `public/images`.
- Tests: Vitest + Testing Library for unit/component coverage; Playwright for end-to-end paths; `next build` is the production integration gate.
- Deployment: ordinary Next/Vercel project; no `.openai/hosting.json` and no alternate deployment adapter.

## Implementation decisions

- Keep the entry page server-rendered and dynamically load the interactive 3D canvas only after the visitor begins.
- Ship all 24 chapters as meaningful semantic sections in the first pass, with five substantial learning interactions, an exhibit-wide Evidence Lens, chapter navigation, resume state, and a complete text/evidence index.
- Use one Blender-authored, commercially safe original “evidence monolith” as the first 3D hero asset. It is an abstract authored artifact—not a scientific fossil or facial reconstruction—and therefore never presented as direct anatomical evidence.
- Treat the initial render asset as `prototypeOnly` in the license ledger. Production validation must continue to reject a paid launch until scientific reconstruction, artifact, audio, and environment assets receive explicit review and approved rights records.
- No remote runtime APIs, personal data, or AI model calls. All interactions are deterministic and local.

## Spec conflicts / gaps

- The master spec describes a production program with expert-reviewed reconstructions, licensed evidence objects, final audio, and real-device scientific/accessibility review. Those prerequisites are not present in the repository and cannot be truthfully fabricated in code.
- This implementation therefore prioritizes a coherent, reviewable product foundation and an authored vertical slice while preserving explicit `prototypeOnly` gating. It is a complete interactive exhibit prototype, not a claim that scientific, rights, audio, mobile-Safari, and reconstruction review gates have already passed.
