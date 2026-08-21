# Loupe Premium Exhibit Standard

## Purpose

This document defines the project-wide quality standard for Loupe exhibits. It exists so that a new conversation can produce work with the ambition, research depth, coherence, and finish of **Atlas of Worlds** without requiring the standard to be explained again.

Atlas of Worlds is a quality benchmark, not a reusable design template. Future exhibits should equal or exceed its seriousness of execution while finding a form appropriate to their own subject.

## What “premium” means

Premium is not a particular color palette, layout, animation style, technology, asset type, or number of features. It is the cumulative result of strong judgment across the whole experience:

- the exhibit has a clear reason to exist;
- research materially shapes the experience;
- claims and representations are honest about their evidence;
- content, interaction, visual design, and engineering feel authored as one system;
- important details remain strong beyond the first screen;
- visitors can understand what to do and why it matters;
- the experience remains intentional across devices, abilities, states, and failure conditions; and
- completion is demonstrated through evidence rather than asserted.

A premium exhibit should feel inevitable for its subject: distinctive, legible, trustworthy, and deeply resolved.

## The quality principles

### 1. Begin with a curatorial thesis

Before choosing an interface or technology, define:

- the central idea the exhibit reveals;
- the visitor it serves;
- what the visitor should understand, feel, or be able to investigate afterward; and
- why interaction improves the subject rather than merely decorating it.

Every significant element must support this thesis. If a feature is impressive but does not strengthen the visitor promise, remove or redesign it.

### 2. Research before designing

Research is a design input, not a citation task performed at the end.

- Start with authoritative primary sources wherever they exist: museums, archives, scientific agencies, original records, peer-reviewed research, official collections, and subject-matter institutions.
- Use secondary sources to orient the work, not to conceal the absence of primary evidence.
- Identify uncertainty, disagreement, missing data, and representational limits early.
- Build a source and asset ledger while researching, including provenance, rights or usage notes, processing, and the claim each source supports.
- Let discoveries reshape the exhibit’s structure, interactions, language, and visual treatment.

Do not invent specificity to make the exhibit feel richer. Trustworthiness is part of the craft.

### 3. Make evidence legible

Visitors should be able to distinguish among direct evidence, processed material, reconstruction, inference, interpretation, and illustration whenever the distinction matters.

- Never present an inferred interior, reconstructed scene, illustrative motion, processed image, or representative scale as an unqualified observation.
- Place explanations close to the representation they qualify.
- Preserve useful source trails without turning the primary experience into a bibliography.
- Use confident language only when the evidence supports it.

Scientific, historical, and cultural accuracy includes being explicit about what cannot be known or shown literally.

### 4. Let the subject determine the form

Do not begin from a previous exhibit’s layout. Begin from the subject’s most meaningful relationships, actions, scales, and stories.

An exhibit may be spatial, cinematic, archival, exploratory, comparative, chronological, conversational, or instrument-like. Choose the form that makes the subject most understandable and affecting. Technology is justified only when it serves that choice.

Use references to establish an ambition or solve a specific problem, never as a substitute for an original point of view.

### 5. Design one coherent experience

Navigation, content, imagery, interaction, motion, sound, typography, and system feedback should behave as parts of the same authored world.

- Establish a clear experience spine from entry through exploration to deeper understanding.
- Keep the visitor oriented: where they are, what changed, what is interactive, and how to recover.
- Make repeated behaviors consistent while allowing subject-specific moments to remain distinctive.
- Avoid splitting one idea into redundant exhibits, panels, or modes unless the separation has a clear visitor benefit.
- Prefer a smaller number of deeply connected capabilities over a large collection of shallow effects.

The exhibit should not feel assembled from independent demos.

### 6. Make every promise real

Anything visible to the visitor establishes a contract.

- Every control must work.
- Every mode must create a meaningful and explainable change.
- Every label must correspond to something visitors can locate or understand.
- Every comparison must explain its scale and basis.
- Every animation must communicate, orient, or evoke intentionally.
- Every major asset must hold up at its intended viewing size.

Do not ship decorative controls, duplicated interactions, misleading affordances, placeholder modes, or content that changes only in name.

### 7. Pursue depth where it matters

Premium work is not maximum complexity everywhere. Concentrate effort on the moments that carry the subject and the visitor promise.

- Identify the signature interaction or revelation and make it exceptional.
- Give supporting content enough depth to make that centerpiece trustworthy and understandable.
- Remove low-value breadth before compromising the quality of core moments.
- Spend computation, asset weight, and animation complexity deliberately.

The goal is a memorable, complete experience—not an exhaustive database or a spectacle without meaning.

### 8. Treat assets as authored material

An authoritative source does not automatically become a presentation-ready asset.

- Inspect source quality, projection, scale, crop, color, transparency, compression, geometry, and seams in the actual renderer.
- Process assets only for a defined purpose and record material transformations.
- Calibrate assets so transitions between modes or sources still feel coherent.
- Prefer honest fallbacks over poor-quality approximations.
- Review the final rendered result, not merely the source file.

When bespoke production is necessary, hold it to the same provenance and quality discipline as sourced material.

### 9. Refine the entire interaction system

Interaction quality comes from continuity and feedback, not the number of gestures.

- Make primary actions discoverable without lengthy instructions.
- Provide immediate, proportional feedback.
- Preserve spatial and conceptual context during transitions.
- Pause, reduce, or remove motion when it competes with inspection.
- Design focus, keyboard behavior, touch targets, zoom limits, reset paths, and selection clearing deliberately.
- Prevent interactions from producing unrecoverable, confusing, or visually broken states.

The visitor should feel in control even when the subject is complex.

### 10. Finish beyond the ideal path

The default desktop screenshot is not the exhibit.

Resolve:

- desktop, tablet, and mobile composition;
- keyboard and assistive-technology access;
- reduced-motion behavior;
- loading and progressive enhancement;
- empty, unavailable, and error states;
- unsupported-device or rendering fallbacks;
- long and short content variants;
- theme or contrast variants when offered; and
- direct links, refreshes, and navigation recovery.

Accessibility, responsiveness, resilience, and performance are characteristics of the premium experience, not post-launch tasks.

### 11. Refine through evidence

The first plausible render is the beginning of refinement.

- Inspect the exhibit in a real browser at representative viewport sizes.
- Exercise complete visitor journeys, not isolated components.
- Compare implementation and approved direction at identical dimensions when a visual target exists.
- Capture evidence for important states and difficult interactions.
- Classify findings by severity, fix systemic causes, and repeat the inspection.
- Check content credibility, visual hierarchy, interaction feedback, console output, loading behavior, and performance together.

Polish is achieved through repeated observation and correction, not a final decorative pass.

### 12. Earn the completion claim

An exhibit is not complete because the primary route loads or because tests passed once.

Before declaring completion, provide current evidence appropriate to the work:

- automated tests for the critical behavior and data contracts;
- type checking and a production build;
- browser checks with no unexplained application errors;
- desktop and mobile visual review;
- keyboard and reduced-motion review;
- verification of sources, credits, and representational labels;
- inspection of critical assets and fallbacks; and
- an explicit record of unresolved limitations or deliberate trade-offs.

Do not describe work as premium, polished, production-ready, or finished while known material defects remain undisclosed.

## Required exhibit workflow

### Discovery

1. Audit the existing exhibit, surrounding museum experience, available assets, and technical constraints.
2. Define the curatorial thesis, visitor promise, intended audience, and signature experience.
3. Research authoritative sources and create an initial provenance ledger.
4. Identify representational risks, unknowns, and the hardest technical or content assumptions.

### Design

1. Translate the thesis into an end-to-end visitor journey.
2. Select a subject-specific experience model and articulate why it fits.
3. Define the content hierarchy, interaction grammar, evidence language, and responsive behavior.
4. Specify meaningful behavior for every proposed control, mode, and state.
5. Establish a small set of quality references and describe what each reference contributes without copying it.
6. Set explicit performance, accessibility, fallback, and verification requirements.

### Implementation

1. Prove the highest-risk asset, interaction, or rendering assumption early.
2. Build from validated content and explicit state rather than scattered exceptions.
3. Complete coherent vertical journeys before adding peripheral breadth.
4. Keep provenance and explanatory content synchronized with implementation.
5. Remove or disclose any promise that cannot be delivered to the required standard.

### Refinement

1. Review the real experience repeatedly on desktop and mobile.
2. Test the signature journey plus transitions, edge cases, fallbacks, and recovery.
3. Fix root causes instead of applying screenshot-specific patches.
4. Continue until no known high- or medium-severity visual, interaction, content, or credibility defect remains.

### Release

1. Run the full relevant verification suite from a clean, current state.
2. Record visual and behavioral evidence for the critical experience.
3. Confirm sources, credits, asset delivery, and evidence labels.
4. Document remaining limitations and confirm they do not undermine the visitor promise.
5. Only then describe the exhibit as complete.

## Definition of premium completion

A Loupe exhibit meets this standard when all of the following are true:

- Its central idea can be stated clearly in one or two sentences.
- Its experience could not be swapped onto an unrelated subject without substantial redesign.
- Authoritative research has visibly influenced what visitors see and do.
- Material claims and representations are sourced and appropriately qualified.
- The signature interaction is meaningful, legible, and fully resolved.
- Supporting features form one coherent journey and perform their advertised function.
- Important assets withstand close inspection in their delivered context.
- The experience remains complete and understandable across supported devices and input methods.
- Loading, error, fallback, and reduced-motion states preserve the core meaning.
- Visual, interaction, accessibility, performance, and content QA have been performed on the final implementation.
- Verification evidence is current, and known limitations are disclosed.

If one of these conditions is materially false, the exhibit is not yet premium. Reduce scope, continue refining, or clearly agree on the trade-off rather than lowering the standard silently.

## Final instruction

Do not reproduce Atlas of Worlds. Reproduce the seriousness with which it was researched, designed, questioned, tested, corrected, and completed—then find the expression that only the next subject could have.
