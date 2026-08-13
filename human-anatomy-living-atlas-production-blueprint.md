# The Living Atlas

## Production blueprint for a 12-15 minute interactive human-anatomy exhibit

**Project:** Digital Museum / The Curiosity Museum  
**Exhibit URL:** `/exhibits/living-atlas`  
**Audience:** Curious teens and adults (approximately 14+), including first-time visitors arriving from a shared link.  
**Purpose:** A general-curiosity, non-diagnostic exploration of how major human body systems are arranged and cooperate. It is not medical advice, a diagnostic tool, or a replacement for a clinician.

---

## 1. The creative decision

Build **The Living Atlas**, not a menu of labelled organs.

The exhibit begins with a quiet, almost sculptural human figure. A visitor is invited to look closer, peel through layers, and discover that a human is not a stack of independent organs but a set of systems that continuously exchange signals, oxygen, energy, and motion. The visitor controls the pace, while the story provides a clear route.

The experience should feel like entering a dark contemporary science gallery: sparse typography, a single illuminated body, purposeful sound, and no persistent page chrome competing with the lesson. It should never feel like a medical textbook, school quiz, hospital website, or videogame.

### The central promise

> In fifteen minutes, you will see how a body holds itself together - from a skin-level touch to a coordinated whole.

### The memorable closing line

> Every thought, breath, and step is a conversation between systems that never stop listening to one another.

### Why this is the right first anatomy exhibit

- It uses 3D where spatial relationships are genuinely the lesson: layers, orientation, scale, and organ placement.
- It turns the reusable **Anatomy Cutaway** pattern from the product requirements into a flagship quality bar.
- It has an honest 12-15 minute guided path but still rewards exploration and screenshots.
- It can launch with six carefully selected systems rather than attempting an encyclopaedia of anatomy.

---

## 2. Visitor journey and narrative flow

The primary journey is linear enough to finish, but each chapter contains a small optional exploration moment. The global progress rail is discreet: `01 Skin / 06 Together`, a slim vertical line, and an estimated remaining time. It must not resemble course progress, XP, or a quiz.

| Beat | Visitor action | What appears | Learning outcome | Approx. time |
| --- | --- | --- | --- | --- |
| 0. Threshold | Scroll or tap `Begin` | A full-body figure resolves from a soft field of particles. A subtle breath begins. | You are about to see one coordinated organism. | 0:30 |
| 1. Surface | Tap or scroll toward the chest/hand | The skin becomes semi-translucent; a touch ripple travels inward. | Skin protects, senses, and is the boundary between body and world. | 1:30 |
| 2. Signal | Follow the ripple | The nervous system lights from fingertip to spinal cord to brain. | Sensation is converted into signals and interpreted, not simply "felt by skin." | 2:15 |
| 3. Breath | Drag a breathing control once | Lungs expand, diaphragm lowers, and oxygen particles enter blood. | Breathing moves air; circulation distributes oxygen. | 2:15 |
| 4. Pulse | Tap the heart or choose `follow the blood` | Heart chambers, a single beat, then a camera journey through a stylised vessel network. | The heart is a pump in a closed transport network, not an isolated icon. | 2:15 |
| 5. Fuel and motion | Select a meal-to-muscle path, then scrub a stride | Simplified digestive path, liver energy handoff, muscle fibres and skeleton animate a step. | Energy and structure make movement possible. | 2:30 |
| 6. The whole | Release the controls / scroll onward | All systems return, exchange animated signals, and settle into a living pose. | Systems are interdependent. | 1:30 |
| Epilogue | Optional `Look again` or related exhibit cards | A personal "constellation" summary of the systems visited. | A satisfying endpoint and a natural next action. | 0:45 |

### Story grammar

Each chapter follows the same four-beat rhythm:

1. **Question:** one plain-language provocation, such as "Where does a touch go?"
2. **Reveal:** one unmistakable visual transformation.
3. **Play:** one meaningful, short interaction that proves the idea.
4. **Keep:** one sentence the visitor can carry away.

Use only one new idea per scroll-stop. If a detail requires a paragraph, move it to the optional "look closer" sheet rather than interrupting the main story.

### Guided mode and free-explore mode

The default is **Guided Atlas**. It locks camera transitions only while a reveal is playing, then returns full orbit and hotspot control. After Chapter 2, a small `Explore freely` control may unlock a system tray. Free exploration never blocks the main route and never resets a visitor's place.

### Scope boundaries for v1

Include: skin/sensation, nervous system, brain overview, respiratory system, circulatory system, digestive-energy overview, musculoskeletal system, and their relationships.

Exclude: reproductive anatomy, pathology, surgery, injury imagery, pharmacology, diagnosis, symptoms, treatment claims, body measurements, and complete microscopic/cellular anatomy. These are separate exhibits or deliberately optional future modules, not omissions to fix by cramming.

---

## 3. Visual, interaction, sound, and motion direction

### Visual language

- **Mood:** charcoal-black gallery space; warm ivory interface text; living systems use restrained, meaningful colour rather than a rainbow medical diagram.
- **System palette:** nervous = electric violet; respiratory = desaturated cyan; circulatory = vermilion/red; digestive/metabolic = amber; musculoskeletal = limestone and muted rose; skin = porcelain/bronze variants. Verify every system through labels and patterns, never colour alone.
- **Body treatment:** a gender-neutral, non-sexualised adult mannequin with anatomically careful proportions. Start in a softly lit, opaque material. Internal organs are more graphic and editorial than photorealistic.
- **Typography:** one expressive display face for the exhibition title and one exceptionally legible sans serif for narration. Free candidates: Instrument Serif + Inter, or Fraunces + Manrope, subject to final licence verification.
- **Layout:** the 3D scene occupies the viewport. Narration appears as an anchored, responsive panel with a maximum 45-60 word payload. On phone, the panel becomes a bottom sheet above the thumb zone.
- **Share frame:** every chapter has a composed static state that can be captured cleanly: body + isolated system + one strong line of copy. Do not add an intrusive share prompt.

### Essential interactions

| Interaction | Use | Implementation rule |
| --- | --- | --- |
| Scroll-scrub | Drives chapter progress, camera moves, opacity, and text transitions. | Scroll is the story transport; never require precision scrolling to complete a task. |
| Tap/click hotspot | Isolates an organ/system and opens a short detail sheet. | Large invisible hit areas; keyboard-focusable equivalent list is mandatory. |
| Drag orbit | Lets visitors inspect the body after a guided reveal. | Constrain polar angle and distance so the model remains understandable. |
| Layer peel | Fades/cuts skin, muscles, skeleton, and organ groups in a legible order. | Use cross-fade + silhouette outline; never make organs vanish without orientation context. |
| One-control simulation | Breathing slider or press-and-hold pulse. | One input changes one visible cause-and-effect relationship; do not fake a scientific simulator. |
| Focus/return | A hotspot zooms into one system and returns to the body. | Preserve previous camera state so visitors do not feel lost. |

### Motion rules

- Motion must explain a relationship: signal travels, diaphragm moves, heart contracts, vessel flow branches. Decorative movement is secondary.
- Use a 300-500 ms UI rhythm; save slower 1.2-2.0 second choreography for chapter reveals.
- Maintain one camera move at a time. Camera plus model rotation plus panel motion is visually noisy.
- Respect `prefers-reduced-motion`: replace scroll-scrubbing with discrete chapter transitions, turn moving particles into static flow lines, and use no automatic camera travel.
- No parallax-induced dizziness, forced perspective drops, flashing, or strobing.

### Audio and video strategy

The exhibit is interactive first. Do **not** make a long background video the experience.

- **Audio:** optional, off by default on mobile. Use a short 15-30 second ambient loop per chapter, plus 3-5 very soft interaction cues. Provide captions/transcript descriptions for any informational audio.
- **Narration:** no required voiceover in v1. The text is the canonical lesson. A later accessible narrated edition can use human-recorded audio.
- **Video:** make only two small, optional deliverables: a 20-30 second muted social teaser and a 45-60 second exhibit trailer. Render source shots in Blender; edit/export with Blender's Video Sequence Editor or FFmpeg. Use the actual WebGL scene for the site, not a pre-rendered replacement.
- **Loading scene:** a stylised static anatomical silhouette, not a looping video, keeps initial data and battery use low.

---

## 4. Page and system architecture

### Page structure

```text
/exhibits/living-atlas
  Server-rendered title, metadata, transcript, sources, and fallback illustrations
  └─ client-only LivingAtlasExperience
       ├─ ExperienceShell (progress, accessibility controls, sound, exit)
       ├─ ChapterDirector (state machine and scroll/click choreography)
       ├─ AnatomyCanvas (React Three Fiber WebGL scene)
       │    ├─ BodyModel
       │    ├─ SystemLayers
       │    ├─ HotspotMesh / raycast targets
       │    ├─ CameraRig
       │    ├─ LightingAndPostprocessing
       │    └─ SimulationVisuals (signals, breath, flow)
       ├─ NarrationPanel
       ├─ ExploreSheet / organ detail cards
       ├─ AccessibleHotspotList
       └─ HTMLFallbackAtlas
```

### Recommended application stack - all free/open-source software

| Area | Recommendation | Why |
| --- | --- | --- |
| Framework | **Next.js + React + TypeScript**, static-first | SEO-friendly exhibit page, mature React ecosystem, dynamic import boundaries for WebGL. |
| Styling | **Tailwind CSS** plus CSS custom properties | Fast, consistent museum-wide tokens without hiding important layout behaviour. |
| 3D | **Three.js**, **@react-three/fiber**, **@react-three/drei** | Declarative scene components, raycast events, controls, GLTF loading, and reusable helpers. React Three Fiber is a React renderer for Three.js. |
| 3D animation | R3F `useFrame`, Three.js `AnimationMixer`, and GSAP only for narrative orchestration | Keep continuous 3D work inside the render loop; use GSAP for chapters/camera/text, not every per-frame transform. |
| Scroll choreography | **GSAP + ScrollTrigger** | Reliable pin, scrub, and lifecycle control for the hero story sequence. |
| Smooth scroll | **Lenis**, evaluated after baseline works | Use only if it improves perceived quality without breaking keyboard/native scrolling. It is optional, not a dependency of the design. |
| Micro-interactions | CSS first; **Motion** (formerly Framer Motion) only for complex DOM transitions | Avoid paying a JS bundle cost for opacity and transform transitions CSS already handles. |
| State | **Zustand** | Small explicit experience state: chapter, selected system, motion preference, sound, and camera return point. |
| Content | Typed JSON/MDX content files validated with **Zod** | Keeps medical copy, citations, hotspots, and narration separate from rendering code. |
| Icons | **Lucide** | Consistent open-source icon set for utility controls only. |
| Analytics | **Plausible Community Edition** self-hosted later, or a privacy-respecting lightweight event endpoint | Track learning-flow completion without session replay or medical-profile inference. |
| Tests | **Vitest**, React Testing Library, Playwright | Unit-test content/schema and state; visually and interactively test core routes on desktop and mobile. |
| Hosting | Static export / CDN on **Cloudflare Pages** when deployment is ready | Keep the exhibit cacheable at the edge. Confirm plan terms before commercial launch. |

### Installation set (after the project scaffold exists)

```text
next react react-dom typescript
three @types/three @react-three/fiber @react-three/drei
gsap @gsap/react
zustand zod
lenis                       # optional
motion                      # optional
lucide-react
vitest @testing-library/react @testing-library/user-event playwright
```

Do not install every interesting 3D package. Begin with this narrow set. Add post-processing only after an actual visual review identifies the need; most anatomy clarity should come from lighting, material, silhouette, and camera, not bloom.

### Scene data model

Each chapter is content, not a bespoke page. Use a schema shaped like this:

```ts
type AnatomyChapter = {
  id: 'surface' | 'signal' | 'breath' | 'pulse' | 'fuel-motion' | 'whole';
  title: string;
  hook: string;
  takeaway: string;
  narration: Array<{ id: string; text: string; start: number; end: number }>;
  systemIds: string[];
  camera: { position: [number, number, number]; target: [number, number, number] };
  layerState: Record<string, 'visible' | 'ghosted' | 'hidden' | 'highlighted'>;
  interaction: 'tap-hotspot' | 'breath-control' | 'pulse' | 'stride-scrub';
  sourceIds: string[];
  fallbackFigure: string;
};

type OrganHotspot = {
  id: string;
  label: string;
  systemId: string;
  meshNames: string[];
  hitAreaScale: number;
  accessibleDescription: string;
  detail: { summary: string; function: string; limits?: string };
  sourceIds: string[];
};
```

The schema must require source IDs. That makes a final source list and medical review traceable rather than a last-minute footer.

---

## 5. 3D asset plan

### Asset philosophy

The critical creative risk is an inaccurate or uncanny "AI anatomy" model. Do not depend on a generated human body or individual organs for the production asset. Use an appropriately licensed anatomical source as the factual base, then retopologise, simplify, style, label, and animate it in Blender. AI can help make non-medical atmosphere assets, but not establish anatomical truth.

### Deliverables

| Asset | Format | Target budget | Notes |
| --- | --- | --- | --- |
| Full neutral body shell | GLB | 20-35k triangles, 1K texture | Separate skin/shader shell, not a naked photorealistic person. |
| Skeleton layer | GLB group | 15-25k triangles | Simplified but recognisable, with major bone hierarchy. |
| Muscular layer | GLB group | 25-45k triangles | Major muscle groups only; no exhaustive muscle atlas in v1. |
| Brain | GLB group | 10-20k triangles | Cerebrum, cerebellum, brain stem; avoid false precision. |
| Lungs/diaphragm | GLB group + 1 shape-key animation | 10-20k triangles | The diaphragm animation is a key teaching moment. |
| Heart and major vessels | GLB group + 1 beat animation | 15-25k triangles | Use a stylised blood-flow shader/particles, not thousands of individual particles. |
| Digestive-energy group | GLB group | 15-25k triangles | Esophagus, stomach, intestines, liver, pancreas only if narration supports it. |
| Signal and flow effects | Procedural in Three.js | No baked texture dependency | Instanced dots/lines, curves, and shaders; pause in reduced motion. |
| 2D fallback anatomy plates | SVG/AVIF | under 300 KB each | One plate per chapter, labelled and readable without WebGL. |
| System icons and chapter thumbnails | SVG/AVIF | under 100 KB each | Generated from the design system, not downloaded icon miscellany. |

### Anatomy source and licence checklist

1. Identify the exact model source and retain its licence text, author credit, download URL, version, and any modification note in `content/sources/anatomy-assets.yml`.
2. Confirm commercial use, derivatives, and web redistribution rights **before** any modelling work begins. "Free to download" is not a licence.
3. Prefer genuinely open sources such as BodyParts3D only after confirming the specific asset's terms and attribution requirements. Use the actual source licence, not a search-result summary.
4. Never scrape models from medical textbooks, commercial anatomy apps, Sketchfab entries with unclear licensing, or image-search results.
5. Obtain a named medical/anatomy reviewer for anatomical accuracy, terminology, and scope. This is an essential human dependency; an LLM or asset licence cannot replace it.

### Blender production workflow

1. **Reference and audit:** set up front, side, and three-quarter orthographic reference boards. Create a system inventory and a mesh-naming convention: `sys_nervous_brain`, `org_heart`, `bone_ribcage`, etc.
2. **Clean the source:** import the licensed anatomy asset; inspect scale, normals, topology, UVs, materials, origin placement, and coordinate orientation.
3. **Separate semantic layers:** place each organ/system in dedicated collections. Merge only when it supports a teaching visual; preserve original source mesh privately for traceability.
4. **Retopologise and simplify:** preserve silhouette and landmarks at intended viewing distance. Remove microscopic and hidden topology. Create LOD 0 (desktop), LOD 1 (mobile), and static 2D fallback exports.
5. **Style materials:** build a limited PBR material set. Use subsurface scattering sparingly; exterior skin should remain calm, internal systems should be visually distinct but not neon.
6. **Animate learning moments:** author short looping actions only: inhale/exhale, heart beat, signal glow travelling a curve, muscle contraction, and a walking stride. Each action should be triggered and scrubbable, not a long autonomous timeline.
7. **Create anchors:** add empties for camera focus, annotation positions, and interaction zones. Name them predictably so GLTF import can map them to content IDs.
8. **Bake/export:** apply transforms; bake only necessary animation; export clean GLB with separate named nodes. Save the `.blend` source and an export manifest.
9. **Compress:** use `gltf-transform` to inspect, prune unused nodes, meshopt-compress geometry, and create KTX2/Basis textures where support is verified. Three.js's GLTFLoader supports Draco, KTX2, and Meshopt loader configuration.
10. **Verify in browser:** test the export in the actual R3F scene on a mid-range Android device and a low-power laptop before styling the next chapter.

### 3D quality bar

- A visitor must still understand what they are seeing if every animated effect is paused.
- No organ may be materially displaced, mirrored, or incorrectly connected for visual convenience.
- Every isolated system must retain a pale body silhouette or orientation marker.
- Hotspots should map to purposeful anatomical regions, not a tiny exact mesh triangle.
- A model can be stylised; it cannot be anatomically careless.

---

## 6. 2D, copy, research, and content production pipeline

### Required 2D assets

- Exhibit wordmark, landing poster, system glyphs, progress rail, sound/reduced-motion controls.
- Six responsive fallback anatomy plates, drawn from the same asset silhouette and with accessible labels.
- Two editorial diagrams: `touch -> nerve -> brain` and `air -> lung -> blood -> muscle`.
- A reduced-motion chapter sequence made of static diagrams plus semantic text.
- Open Graph image (1200 x 630) and vertical/social crops (9:16, 1:1) from the composed share frames.
- An end-card system constellation and 2-3 related-exhibit cards.

### Script and factual-review pipeline

1. Write a plain-language chapter script, maximum 60 core words per chapter screen.
2. Build a claim ledger: each scientific claim, source, date checked, and reviewer status.
3. Have the medical reviewer flag simplifications that could create a misconception. Rewrite the visual or text rather than hiding a caveat in tiny type.
4. Translate approved scripts into the typed exhibit schema, including hotspot descriptions and fallback text.
5. Conduct a "cold read" with 3-5 non-expert users. Ask what they think happened, not whether they "liked" it.
6. Conduct a final source/medical review before launch and preserve a public, readable sources page.

### Content voice

- Prefer: "Your lungs bring oxygen into the body. Your blood carries it onward."
- Avoid: dense nominalisations, unexplained Latin terms, dramatic medical claims, and humanising metaphors that imply organs make decisions.
- Define technical language once, only when it unlocks the next idea.
- Use varied body representations in 2D editorial material, while keeping the 3D mannequin neutral and non-sexualised.

---

## 7. Performance, resilience, accessibility, and privacy requirements

### Performance budget

| Metric | Budget / decision |
| --- | --- |
| First meaningful content | HTML title, hook, and static poster visible in under 2 seconds on a mid-range phone over 4G. |
| Initial JavaScript | Do not load Three.js/R3F until the exhibit viewport is near or the visitor taps `Begin`. |
| Initial visual payload | Poster and critical CSS under 500 KB compressed where practical; no 3D model in the initial route payload. |
| WebGL scene | First usable body within 5 seconds after explicit entry on the target test device. Provide progress stage labels while loading. |
| Model size | Aim for one initial GLB <= 5 MB compressed; lazy-load deeper system meshes/texture variants as chapters begin. Measure, do not assume. |
| Frame rate | Target 45+ FPS on reference mobile hardware and 60 FPS desktop. Reduce effects before reducing anatomical clarity. |
| Memory | Dispose unused scene materials/textures after a chapter exits; profile long sessions for mobile GPU memory growth. |

### Progressive enhancement ladder

1. **Full:** WebGL2 device, normal motion - interactive 3D atlas.
2. **Lite 3D:** reduce post-processing, shadows, texture resolution, and particle density; retain controls and core model.
3. **2D Atlas:** no WebGL or poor capability - SVG/AVIF chapter plates with the same narration, clickable label list, and discrete step navigation.
4. **Text transcript:** all visuals unavailable - ordered chapter text, labelled descriptions, sources, and related exhibits.

Capability selection must be automatic but reversible through a visible `Use simplified view` control. Do not punish users by showing an unsupported-browser dead end.

### Accessibility acceptance criteria

- All core learning content is available without drag, hover, sound, colour perception, or WebGL.
- All 3D hotspot actions have semantic HTML buttons in an `Explore parts` list, with matching names and descriptions.
- Keyboard users can tab through controls in a logical order, open a hotspot, return to the body, and advance chapters.
- Focus is visible against the dark scene and not trapped in the canvas.
- Screen-reader announcements describe a scene change only when it contains new information; do not narrate every animated frame.
- Captions/transcript accompany informational audio. Sound is opt-in and has a clear mute control.
- `prefers-reduced-motion` and a manual `Reduce motion` control are honoured before any animation begins.
- All prose, labels, and colour contrast meet WCAG 2.2 AA as a launch baseline. Verify with automated tests and manual keyboard/screen-reader testing.
- Include a simple health disclaimer in the sources/about panel: general information only, not medical advice. Do not imply medical diagnosis anywhere in interactions or analytics.

`@react-three/a11y` can improve focus, keyboard, screen-reader, and role support inside an R3F scene, but it supplements rather than replaces the HTML fallback and hotspot list.

### Privacy and analytics

Track only product-learning events, with no name, health data, or inferred condition:

```text
exhibit_opened
webgl_mode_selected (full | lite | fallback)
chapter_seen
hotspot_opened
chapter_completed
exhibit_completed
related_exhibit_selected
```

Do not track individual anatomy hotspot history as a medical-interest profile. Collect aggregate completion/drop-off only, document the retention period, and present a small privacy note.

---

## 8. Recommended MCP servers, skills, plugins, and human roles

MCP is a production accelerator, not a replacement for asset licensing, medical judgement, or user testing. None are required to make a first code prototype; add them only where they remove a real bottleneck.

| Capability | Recommendation | Required? | How it will be used |
| --- | --- | --- | --- |
| 3D authoring | **Blender** (free/open source) plus the open-source **ahujasid/blender-mcp** server | Recommended | Scene setup, mesh inspection, materials, render previews, simple animation, and GLB export assistance. Run only on a local, user-controlled Blender instance. |
| Source control | Existing Git/GitHub integration | Required | Track scripts, source ledger, Blender export manifest, code, and review checkpoints. Do not store unlicensed source meshes in public repos. |
| Design collaboration | Figma MCP with a free Figma workspace, if the team uses Figma | Optional | Maintain storyboards, scene states, UI tokens, and review comments. Blender remains the 3D source of truth. |
| Browser verification | Existing browser automation / in-app browser | Required during QA | Test live build performance, keyboard flow, touch interactions, fallback mode, and social metadata. |
| Analytics/back end | No MCP for MVP | Not needed initially | The first exhibit can be static. Add Supabase only when saved collections or user accounts are actually approved. |
| Research support | Web/browser tools plus a human medical reviewer | Required | Research public sources, maintain citations, then have medical claims checked by a qualified reviewer. |

### Important Blender MCP note

The recommended open-source Blender MCP projects use a local Blender add-on and a local MCP/stdio or HTTP bridge. They can speed up basic scene edits but should be treated as supervised tooling: inspect every resulting mesh, material, animation, and exported GLB in Blender and in the browser. Do not grant a local MCP server wider filesystem/network access than it needs.

### Optional Codex capabilities already useful here

- **PDF/document review:** extract and retain the project requirements as design constraints.
- **Browser control:** check the finished exhibit in actual browser states.
- **GitHub tooling:** manage repository changes, issues, and reviews once the repository is safe to use.
- **Image generation:** create only non-anatomical mood boards, teaser backgrounds, or abstract system textures; never use it as the anatomical source of truth.

### External help needed from you

1. **Medical/anatomy reviewer:** a qualified person who can approve the factual scope and final copy. Ideally an anatomist, medical illustrator, clinician with anatomy teaching experience, or a university anatomy educator.
2. **Asset rights decision:** confirm whether the project can use attribution-required assets (for example, a compatible Creative Commons source) or whether you want an asset with a more permissive commercial licence. This decides sourcing early.
3. **Brand decision:** approve the museum's name, visual identity, and whether the display body should use a neutral light/dark/abstract material treatment. The anatomy should not be tied to a single real-world demographic.
4. **Deployment account:** when ready to publish, provide a Cloudflare or equivalent hosting account and domain access. Do not share passwords; use collaborator/project access.
5. **Test participants:** recruit 5-8 people across desktop/mobile confidence levels for short usability sessions.

---

## 9. Build sequence, milestones, and definition of done

### Phase A - Preproduction (1-2 weeks)

- Approve this blueprint and choose exact anatomical source/licence path.
- Commission or identify the medical reviewer.
- Write the six-chapter script and claim ledger.
- Make a 16:9 storyboard plus phone layouts for every reveal.
- Create the art direction sheet: palette, materials, type, panel states, and motion rules.
- Produce a single low-fidelity body proof showing layer isolation and hotspot selection.

**Gate:** the reviewer agrees that the narrative and selected systems are accurate enough to visualise; the art direction is approved before high-detail asset work begins.

### Phase B - Technical vertical slice (2 weeks)

Build only Chapter 1 (`Surface`) and one short `Signal` transition:

- Next.js page shell, typed content schema, progress rail, poster/loading state.
- R3F canvas with one clean body model, orbit controls, one hotspot, and an accessible matching HTML control.
- GSAP chapter transition, reduced-motion mode, 2D fallback plate, and basic analytics events.
- Test on real phone, mouse/keyboard desktop, and no-WebGL fallback.

**Gate:** a new visitor can understand the interaction without instruction; the scene is fast enough on the reference phone; a keyboard/screen-reader user can learn the same point.

### Phase C - Asset and chapter production (3-5 weeks)

- Finalise the six system layers and the five teaching animations.
- Implement the chapter director, system tray, detail sheets, and camera return state.
- Add every fallback plate, transcript segment, sources, and reviewer-approved copy.
- Compose the 20-30 second teaser only after the real scene looks strong.

**Gate:** medical reviewer signs off on every factual claim and the 3D composition; no chapter needs a paragraph to explain its visual.

### Phase D - Polish and launch QA (1-2 weeks)

- Conduct usability sessions; revise the two biggest comprehension/drop-off issues.
- Profile loading, GPU memory, and frame rate; compress assets and remove low-value effects.
- Run accessibility, touch, keyboard, visual regression, SEO, and social-sharing checks.
- Publish sources, licence/attribution page, privacy note, transcript, and 2D fallback.

**Gate:** all launch acceptance criteria below are met.

### Definition of done

- A visitor can complete the guided experience in 12-15 minutes without an account.
- The six systems are visually and factually correct at the exhibit's declared level of simplification.
- The core experience works with mouse, touch, keyboard, reduced motion, 2D fallback, and text transcript.
- Every asset has a recorded, compatible licence and required attribution.
- Every scientific claim has a source and human reviewer status.
- The experience meets the defined mobile loading and performance budgets on actual target devices.
- Completion/drop-off analytics are privacy-preserving and functioning.
- The final scene has been reviewed on a real phone and desktop by both the medical reviewer and external test participants.

---

## 10. Test plan

| Test type | What to verify |
| --- | --- |
| Unit/schema | Every chapter has a takeaway, fallback, sources, valid hotspot IDs, and reduced-motion alternative. |
| Component | Progress, chapter routing, hotspot selection, focus return, sound preference, and fallback selector. |
| E2E (Playwright) | Start -> all six chapters -> epilogue; keyboard-only route; WebGL disabled route; reduced-motion route; small viewport route. |
| Visual regression | Body orientation, layer states, text panel contrast, share frames, 360/390 px mobile, tablet, and desktop. |
| Performance | Lighthouse and real-device Web Vitals; GPU profiling; asset byte audit; load while using mobile data simulation. |
| Accessibility | Automated scan plus manual VoiceOver/NVDA + browser, keyboard-only, zoom 200%, contrast, and motion testing. |
| Content | Medical reviewer checks script, labels, relationships, simplifications, and model orientation against the source ledger. |
| Usability | Ask participants to explain the chapter takeaway after each interaction and identify where they felt confused or passive. |

The key success metric is not time-on-page. It is **completion with comprehension**: target at least 60% of visitors reaching the epilogue, then use drop-off and short post-exhibit prompts to improve pacing rather than adding gamification.

---

## 11. Risks and explicit countermeasures

| Risk | Countermeasure |
| --- | --- |
| The anatomy looks generic, uncanny, or wrong | Use licensed anatomical source data, stylise carefully, and secure human medical review. |
| WebGL makes the page slow or inaccessible | Progressive enhancement, aggressive lazy loading, 2D plates, transcript, real-device budgets. |
| The exhibit turns into a long catalogue of organs | Keep six chapters and one idea per chapter; optional details go in sheets. |
| Animation feels impressive but teaches nothing | Every animation must answer a chapter question and survive a paused-frame review. |
| A solo production timeline balloons | Prove one vertical slice first; use the shared Anatomy Cutaway template and avoid bespoke physics/simulations. |
| "Free" asset terms block launch | Maintain the licence ledger from day one; treat source verification as a production gate. |
| Medical content implies advice | Keep the scope explanatory, never collect health data, use review and clear context in sources/about. |

---

## 12. Decisions to make before implementation

1. Approve the 12-15 minute scope and six-chapter story above.
2. Select the body presentation: abstract porcelain, tinted glass, or warm editorial anatomical illustration. Recommendation: **abstract porcelain exterior + restrained editorial interior**.
3. Confirm whether attribution-required open assets are acceptable. Recommendation: **yes, if the attribution is elegant and prominently documented**; otherwise source a permissively licensed commissioned/base model before work begins.
4. Nominate a medical/anatomy reviewer before the final asset source is chosen.
5. Confirm the visual brand/name for the museum shell, or approve temporary neutral branding for the vertical slice.
6. Confirm a deployment owner when the experience is ready to be tested publicly.

---

## 13. Source and implementation references

These are technical starting points, not asset licences. Reconfirm current versions, plan terms, and individual asset rights at implementation time.

- [React Three Fiber introduction](https://r3f.docs.pmnd.rs/getting-started/introduction) - R3F as a React renderer for Three.js; React version compatibility and ecosystem.
- [Drei documentation](https://drei.docs.pmnd.rs/getting-started/introduction) - production helpers for R3F scenes.
- [Three.js GLTFLoader documentation](https://threejs.org/docs/pages/GLTFLoader.html) - GLB loading and Draco/KTX2/Meshopt decoder hooks.
- [GSAP ScrollTrigger documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) - scroll-linked animation orchestration.
- [React Three A11y documentation](https://a11y.docs.pmnd.rs/introduction) - accessible WebGL support to supplement semantic HTML.
- [Blender](https://www.blender.org/) - free and open-source modelling, animation, rendering, and video editing software.
- [ahujasid/blender-mcp](https://github.com/ahujasid/blender-mcp) - optional open-source local Blender MCP bridge; inspect its current setup and security model before installation.

---

## Appendix: What we deliberately will not do in v1

- Build every organ, body system, or microscopic detail.
- Use an unverified AI-generated anatomy model as the learning asset.
- Require a login, run quizzes, award badges, or create streak mechanics.
- Lock essential learning content behind audio, WebGL, hover, drag, or high-end hardware.
- Add VR/AR, multiplayer, user-generated content, a CMS, or account/profile data before the core experience proves completion and comprehension.
- Make clinical claims or personalise the exhibit based on health information.

The first release earns its ambition through a clear story, beautiful spatial explanation, and uncompromising accessibility - not through maximum feature count.
