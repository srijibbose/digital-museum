# Loupe — Exhibit Brief: "Thirteen Minutes"
### The last thirteen minutes of Apollo 11's descent, told as a systems story

> **Read this whole file before writing any code.** This is a self-contained implementation brief for a single exhibit inside a larger project called Loupe. You do not need any other document — everything required to build this end-to-end, including full copy, is below. Where something is optional or a stretch goal, it is explicitly labeled `OPTIONAL`. Everything not labeled optional is required for a working v1.

---

## 0. Context — what Loupe is (for background only)

Loupe is a "digital museum" website: a collection of small, self-contained, interactive exhibits, each one taking a single mechanism or event and walking a visitor through it in 5–10 minutes. No accounts required to view an exhibit, no login wall, no course structure, no quizzes. You land on one exhibit's URL, you scroll through it, you leave. Exhibits are grouped into "wings" (topic categories); this exhibit belongs in the **"Systems & Machines"** wing.

This brief covers **one exhibit only**. Build it as a fully standalone, working page first. Structure the code so it can later be dropped into a larger Loupe site as a route (e.g. `/wings/systems-and-machines/thirteen-minutes`) without a rewrite — but don't build the lobby, other wings, or accounts. Just this exhibit.

---

## 1. The exhibit, in one paragraph

On July 20, 1969, the Apollo 11 lunar module *Eagle* began its final twelve-and-a-half-minute descent to the Moon. Partway down, its guidance computer started throwing an alarm nobody in the room had trained for — and a 26-year-old engineer had about fifteen seconds to decide whether the landing was still safe. This exhibit tells that story as a live instrument panel: a mission clock, an altitude readout, and a fuel countdown that update as the visitor scrolls through seven short beats, ending on touchdown with seventeen seconds of fuel to spare. It is not a lecture on the Moon landing. It is one specific, tightly bounded story: a computer degraded gracefully under load, and a human had to trust it in real time.

**Why this story, for this format:** it already has a natural sequence (ignite → drift off-target → alarm → the decision → manual landing → touchdown → the line that sticks), it needs no prerequisite knowledge, it isn't contested or political, and it's genuinely over in under ten minutes without leaving anything misleadingly flattened.

---

## 2. Goals and non-goals

**Goals**
- A visitor with zero context finishes in 5–8 minutes feeling like they understood something specific and true, not just "watched a moon landing recap."
- The HUD (clock, altitude, fuel) is the emotional engine of the piece — it should feel like the visitor is watching real telemetry, not decoration.
- Every beat is skippable and revisitable; nothing is timed or gated.
- Works fully on a mid-range phone on mobile data, not just a desktop dev machine.

**Non-goals (explicitly do not build these for v1)**
- No accounts, no saved progress, no quiz, no score.
- No full lunar-landing documentary — this is one lens (the computer alarm and the human decision), not a comprehensive retelling.
- No multiplayer, no comments, no social feed.
- No monetization/paywall logic of any kind.

---

## 3. Audience and tone

Primary visitor: someone with 5 idle minutes on their phone, curious but not technical. Secondary visitor: developers/engineers who will appreciate the "systems degrading gracefully under load" framing specifically — don't over-explain the technical parts for them, but don't require technical background either.

Tone: calm, confident, slightly cinematic — closer to a well-written museum placard than a Wikipedia article or a corporate training slide. Short sentences. No forced excitement, no exclamation points, no "wow!" copy. Let the real stakes (seventeen seconds of fuel) carry the drama; don't editorialize on top of it.

---

## 4. Interaction pattern

**Primary pattern: Timeline Scroll** (scroll position drives a linear sequence forward — this is a ladder, not a branching story; there is no "choose your path").

### 4.1 How scroll maps to state
- The page is a single continuous scroll, divided into sections: Hook → Context → six walkthrough beats → Takeaway → footer.
- The mission HUD (clock, altitude, fuel — see Section 6.2) is **pinned/sticky** at the top of the viewport while the narrative text for each beat scrolls up underneath it.
- As each beat's text section crosses a trigger point (roughly the vertical center of the viewport), the HUD's three numbers update to that beat's values, and that beat's short label becomes the active one in the progress rail (Section 6.4). Numbers should visibly change (a brief count/tick transition, not an instant snap) — see Section 6.5.
- Scrolling back up re-triggers the previous beat's numbers. This must work in both directions, not just forward.

### 4.2 Non-scroll fallback (required, not optional)
Some visitors will navigate by keyboard, some browsers/devices handle scroll-linked triggers inconsistently, and this is also the accessible path. Provide:
- Small "previous / next" controls (or a clickable progress-rail — see Section 6.4) that jump between beats without requiring scroll gestures, updating the HUD the same way.
- The whole exhibit must be readable and completable with JavaScript-driven animation disabled — i.e., if you strip the scroll-linking, the page should still read top to bottom as a normal article with the HUD values shown as static text per section, not blank.

---

## 5. The seven beats — narrative overview

*(Full copy-ready text is in the JSON block in Section 9 — this is the human-readable walkthrough so the shape is clear before you look at the data.)*

| # | Beat | Runtime budget | What happens |
|---|------|------|--------------|
| — | **Hook** | ~15 sec | A single bold statement establishing the stakes before any scrolling starts. |
| — | **Context** | ~30–45 sec | The bare minimum background: date, what a "lunar module" is, that everything shown is real. No prerequisites assumed. |
| 1 | **Approach** | | Descent engine ignites; the module begins its twelve-minute fall under computer control. |
| 2 | **Course check** | | Armstrong notices the computer is steering toward a boulder field short of the planned site. |
| 3 | **Program alarm** | | The "1202" alarm — the guidance computer is overloaded. Nobody yet knows if it's fatal to the mission. |
| 4 | **The go call** | | A 26-year-old flight controller has about fifteen seconds to decide whether to continue. "We're go on that alarm." |
| 5 | **Manual control** | | Armstrong takes manual control, flying by eye over the boulder field with fuel running low. |
| 6 | **Touchdown** | | "The Eagle has landed." Seventeen seconds of fuel remained at engine cutoff. |
| — | **Takeaway** | ~15–20 sec | One line that survives after the visitor closes the tab: why the computer overloading wasn't the same as the computer failing. |

After the Takeaway: an optional "go deeper" line pointing to NASA's public Apollo 11 mission transcript archive as further reading (do not fabricate a specific URL — link out generically or leave a placeholder for the real link), and a "you might also like" footer (see Section 5.1).

### 5.1 "You might also like" footer
This is the hook for return visits. Populate with:
- **"What happens when you click a button"** — the other Systems & Machines flagship exhibit (build separately; just reference it here by title/slug for now).
- One placeholder card, clearly marked as a *future* exhibit idea, not something to build now: **"Why the Apollo Guidance Computer had less processing power than a calculator"** — a natural companion piece, don't build it in this pass.

---

## 6. Visual design

### 6.1 Overall feel
Minimal chrome, full-bleed content, no persistent navbar or sidebar inside the exhibit — let the HUD and the text fill the screen, museum-exhibit style. Dark background (near-black, not pure black) rather than the light/flat "product UI" look — this one exhibit should feel like a cockpit at night, which is a deliberate, justified departure from a brighter homepage/lobby aesthetic. Keep it flat: no glow, no lens-flare, no drop shadows doing the emotional work — the *content* (real numbers, real stakes) should carry the drama, not decoration.

A very subtle, sparse starfield in the background is a nice touch — a handful of static, low-opacity dots via CSS, not a heavy image or animated particle system. Skip it entirely if it costs any noticeable load time; it's flavor, not function.

### 6.2 The mission HUD (the centerpiece)
Sticky bar pinned to the top of the viewport for the full scroll duration of the walkthrough beats. Three elements:
- **Mission Elapsed Time** — large, monospace, top-left. Format `HHH:MM:SS`.
- **Altitude** — smaller readout, right side.
- **Fuel remaining** — smaller readout, right side, next to altitude.

Design idea worth trying: a seven-segment / LED-style digit face for the numbers specifically (there are free, open-source fonts built for this look, e.g. the DSEG family — confirm licensing before shipping, but this general category of font exists and is commonly used for exactly this effect). Pair it with a warm amber or green monochrome tone against the dark background — a deliberate, gentle nod to a real spacecraft instrument display, without trying to be a literal skeuomorphic recreation. This is the one place in the whole exhibit where leaning into a "real console" feeling is worth the extra design effort — everywhere else, stay restrained.

When a beat changes, the numbers shouldn't just snap — a brief digit-tick/count transition (a few hundred milliseconds) sells the "live telemetry" feeling far better than an instant swap. Keep it subtle; this is not a slot machine.

### 6.3 Beat text
Each beat is its own full-height (or near-full-height) scroll section. Inside it:
- A short label (e.g. "Program alarm") in the accent color used for the HUD.
- One to three short paragraphs of body copy (see Section 9 for exact text).
- Where a beat includes a real quoted line (e.g. "1202, what's that?" or "The Eagle has landed"), style it visibly differently from the narration — a distinct quote treatment (different weight, a subtle left rule, or monospace to imply it's transcript-like) so visitors can tell "this was actually said" apart from "this is us explaining it."

One idea per screen — never compete two beats for attention in the same viewport at once.

### 6.4 Progress rail
A slim vertical row of dots (or short tick labels) along one edge of the screen, one per beat, showing where the visitor is in the story and how much is left — this also doubles as the clickable non-scroll navigation required in Section 4.2. Keep it unobtrusive; it's a wayfinding aid, not a decoration.

### 6.5 Motion and animation
- Scroll-linked reveals and the HUD pin/update behavior should use a scroll-driven animation library (GSAP + ScrollTrigger is the standard tool for this and handles the pinning behavior well; pair with a smooth-scroll library like Lenis so the scroll feel itself is part of the polish, not just the reveals).
- Text sections fade/slide in gently as they enter view — nothing aggressive, nothing that delays reading.
- **Respect `prefers-reduced-motion`.** When set, disable the pin/scrub behavior and digit-tick transitions entirely: render the HUD values as static text per section instead of an animated shared element, and use simple opacity fades (or no transition at all) for section reveals. This is required, not optional — treat it the same as any other accessibility requirement.

---

## 7. Optional 3D layer — `OPTIONAL`, build only after everything above works

Do **not** start here. Ship the full text-and-HUD version first (Section 6), confirm it works well on mobile, and only then consider this enhancement if there's time and appetite for it.

**What it would add:** a small, simple 3D model of the lunar module, visible during beats 4–6 (The go call, Manual control, Touchdown), descending gently in sync with the altitude number as the visitor scrolls. This is a "rotate & inspect" / gentle parallax accent, not a cinematic centerpiece — think a small object in the corner of the frame, not a full 3D scene takeover.

**Two ways to get the model, in order of effort:**
1. **Fastest — a low-poly, flat-shaded custom model, built with Blender.** A simplified geometric lunar module (a few cylinders, a box, four angled legs) fits this project's flat, restrained visual language far better than a photorealistic scan would. If Blender MCP is available in the build environment (it connects an AI agent directly to a running Blender session over natural language — useful for exactly this kind of primitive-heavy, non-organic model), use it to block out the shape, apply simple flat materials, and export as `.glb`. This is a good fit for Blender MCP specifically because the geometry is simple and mechanical, not organic — that's within its comfort zone.
2. **Alternative — a free, real, public-domain model.** NASA's own 3D Resources library and the Smithsonian's Open Access program both publish free, usable 3D models of real spacecraft and artifacts, including lunar-module-family hardware. Worth checking before modeling from scratch — but note the visual style will likely be more realistic/detailed than the rest of the site, so it may need re-texturing or simplification to match the flat aesthetic rather than dropped in as-is.

**Technical approach if built:**
- Use `<model-viewer>` (Google's free web component) if all you need is "here's a small model, gently rotating/descending" — much less engineering effort than a full custom Three.js scene.
- Only reach for React Three Fiber if you need tighter control (e.g., precisely syncing the model's vertical position to the scroll-driven altitude value) that `<model-viewer>` can't give you.
- Compress the exported model (Draco or Meshopt compression on the glTF) and lazy-load it — it should not block or slow down the text-and-HUD experience, which must work perfectly with zero 3D assets loaded.
- Always keep a working fallback: if the 3D asset fails to load, is skipped, or the visitor is on a low-end device, the exhibit must degrade to the Section 6 experience with no visible gap or broken layout.

**If you skip 3D entirely:** nothing is lost. The HUD-and-text version is the complete, intended v1 experience, not a placeholder for something bigger.

---

## 8. Optional audio — `OPTIONAL`, lowest priority

A very light idea worth naming even though it's likely out of scope for v1: real Apollo mission audio (as a work of the U.S. federal government, NASA's own recordings are public domain) could theoretically underlay the Program Alarm and Touchdown beats at low volume, muted by default with an explicit opt-in toggle — never autoplaying audio with sound on. Given the accessibility and complexity cost (captions/transcripts would be required for anyone playing it), treat this as a "maybe in a later pass," not a v1 requirement. Do not build this unless everything else is done and working well.

---

## 9. Content schema and full copy (implementation-ready)

Author beats as structured data, not hand-coded per-section markup — this keeps the component reusable and makes future exhibits cheaper to build against the same shape.

```json
{
  "id": "thirteen-minutes",
  "title": "Thirteen Minutes",
  "subtitle": "The last minutes of Apollo 11's descent, told as a systems story",
  "wing": "systems-and-machines",
  "estimatedMinutes": 7,
  "hook": {
    "text": "Four minutes before Apollo 11 landed, its computer started throwing alarms no one had trained for. This is the thirteen minutes between ignition and touchdown, told through the numbers the room was watching."
  },
  "context": {
    "text": "On July 20, 1969, the Apollo 11 lunar module Eagle began its final descent to the Moon's surface. Everything from here on is real: the mission clock, the altitude, the fuel remaining, and the words said in the room. Scroll to fly it yourself."
  },
  "beats": [
    {
      "id": "approach",
      "label": "Approach",
      "met": "102:33:05",
      "altitude": "40,000 ft",
      "fuel": "8:00",
      "body": "The descent engine ignites. For the next twelve minutes, the lunar module falls toward the surface under computer control.",
      "quote": null
    },
    {
      "id": "course-check",
      "label": "Course check",
      "met": "102:36:10",
      "altitude": "27,000 ft",
      "fuel": "5:40",
      "body": "Armstrong notices the computer is aiming for a boulder field a mile short of the planned landing site. The ground below doesn't match the plan.",
      "quote": null
    },
    {
      "id": "program-alarm",
      "label": "Program alarm",
      "met": "102:38:30",
      "altitude": "6,000 ft",
      "fuel": "2:00",
      "body": "Buzz Aldrin calls out an alarm code. The guidance computer is overloaded — nobody in the room knows yet whether it's fatal to the landing.",
      "quote": "1202. What's that?"
    },
    {
      "id": "go-call",
      "label": "The go call",
      "met": "102:38:45",
      "altitude": "4,000 ft",
      "fuel": "1:45",
      "body": "A 26-year-old engineer in Houston has about fifteen seconds to decide. The computer is shedding low-priority tasks to keep the landing running.",
      "quote": "We're go on that alarm."
    },
    {
      "id": "manual-control",
      "label": "Manual control",
      "met": "102:44:00",
      "altitude": "100 ft",
      "fuel": "0:30",
      "body": "Armstrong takes manual control, flying by eye over the boulder field, hunting for flat ground with less fuel left than a full tank of gas.",
      "quote": null
    },
    {
      "id": "touchdown",
      "label": "Touchdown",
      "met": "102:45:40",
      "altitude": "0 ft",
      "fuel": "0:17",
      "body": "Engine off. Seventeen seconds of fuel remained — closer than anyone in Houston wanted to know.",
      "quote": "The Eagle has landed."
    }
  ],
  "takeaway": {
    "text": "The computer didn't fail because it overloaded. It was built to drop what mattered least and keep what mattered most — which is exactly why it landed on the Moon that day, and why 'graceful degradation' still describes good systems design today."
  },
  "goDeeper": {
    "label": "Read the real mission transcript",
    "note": "Link to NASA's public Apollo 11 transcript archive — insert the real URL before publishing, do not fabricate one."
  },
  "relatedExhibits": [
    { "slug": "what-happens-when-you-click-a-button", "title": "What happens when you click a button", "status": "build separately" },
    { "slug": "apollo-guidance-computer", "title": "Why the Apollo Guidance Computer had less power than a calculator", "status": "future idea, not built" }
  ]
}
```

**Important note on accuracy:** the mission-elapsed-time, altitude, and fuel figures above are close approximations assembled for narrative pacing, not verified to the second. Before publishing, do a fact-check pass against NASA's actual Apollo 11 descent transcript and cross the specific numbers — this is a factual, historical exhibit, and precision matters for the audience it's aimed at (see Section 3, "developers/engineers" as a secondary audience who will notice if numbers look invented).

---

## 10. Tech stack and file structure

**Stack**
- Next.js (React + TypeScript) for the page/routing and SEO-friendly server rendering.
- GSAP + ScrollTrigger for the scroll-linked HUD pin/update behavior.
- Lenis for smooth-scroll feel underneath GSAP.
- Tailwind CSS for styling, or plain CSS modules — either is fine, pick whichever is faster for you to move in.
- `<model-viewer>` only if the `OPTIONAL` 3D layer (Section 7) is built.

**Suggested file structure**
```
/exhibits/thirteen-minutes/
  page.tsx                 → the exhibit route
  content.json              → the Section 9 data, as its own file
  components/
    MissionHud.tsx          → sticky HUD, consumes current beat's met/altitude/fuel
    BeatSection.tsx         → one scroll section: label + body + optional quote
    ProgressRail.tsx        → dots/ticks, also the clickable non-scroll nav
    LunarModuleViewer.tsx   → OPTIONAL, only if Section 7 is built
/public/
  models/lunar-module.glb   → OPTIONAL, only if Section 7 is built
  fonts/                    → only if self-hosting a seven-segment style font
```

Keep `content.json` fully decoupled from the components — the goal is that a future exhibit (different topic, same Timeline Scroll pattern) could reuse `MissionHud`/`BeatSection`/`ProgressRail` against a different JSON file with minimal changes.

---

## 11. Mobile and accessibility requirements (all required, not optional)

- **Touch-first, not touch-adapted.** Design and test the scroll behavior on a real or simulated mid-range phone first, not as a desktop demo with touch bolted on afterward.
- **First meaningful content visible in under ~2 seconds** on a mid-range phone on 4G. If the `OPTIONAL` 3D asset is built, it must lazy-load and never block this.
- **`prefers-reduced-motion` support is required** — see Section 6.5.
- **Keyboard navigable** — the non-scroll previous/next controls and progress rail (Section 4.2) must be reachable and operable via keyboard, with visible focus states.
- **No motion- or flash-based content** that could trigger vestibular issues — the digit-tick and section fades described above are intentionally gentle; don't amplify them.
- **Alt text** for any illustrative image or the 3D viewer's fallback state.
- **Text-only integrity check:** with all JS-driven animation stripped, the page must still read as a complete, correctly ordered article — this is both an accessibility requirement and a resilience requirement for low-end devices/browsers.

---

## 12. Suggested build order

1. **Static skeleton.** All content from Section 9 laid out as plain scrollable sections, no animation, no pinning. Confirm the copy reads well and the layout doesn't break on mobile widths.
2. **HUD pin + scroll-linked updates.** Add GSAP ScrollTrigger to pin the HUD and update its three numbers per beat, in both scroll directions.
3. **Progress rail + non-scroll navigation.** Add the clickable dots/next-previous controls; confirm they stay in sync with scroll-driven state.
4. **Motion polish + reduced-motion fallback.** Digit-tick transitions, section fades, and the `prefers-reduced-motion` branch.
5. **Mobile/accessibility pass.** Real device or emulator testing, keyboard navigation check, text-only integrity check.
6. **`OPTIONAL`: 3D layer**, only if everything above is solid and there's appetite for it.
7. **`OPTIONAL`: audio**, only after everything else, if at all.

---

## 13. Definition of done

- [ ] All copy from Section 9 is present and matches exactly (pending the accuracy pass noted at the end of Section 9).
- [ ] HUD updates correctly for every beat, scrolling both forward and backward.
- [ ] Non-scroll previous/next (or progress-rail click) navigation fully replicates what scrolling does.
- [ ] Whole exhibit is completable and readable with animation disabled (`prefers-reduced-motion`) and with JS-driven scroll-linking stripped.
- [ ] Works cleanly on a narrow mobile viewport — no horizontal scroll, no clipped text, no overlapping HUD.
- [ ] No blocking network requests before first meaningful content paints.
- [ ] If the `OPTIONAL` 3D layer was built: page still works correctly with that asset failing to load or removed entirely.
- [ ] Real NASA transcript figures verified before this goes anywhere public (see Section 9 accuracy note).

---

## 14. Open items to resolve before publishing (not blocking for a working build)

- Verify the exact mission-elapsed-time / altitude / fuel figures against NASA's public Apollo 11 descent transcript.
- Insert the real "go deeper" transcript link (Section 9) — a placeholder note is there instead of a URL on purpose.
- Decide whether the `OPTIONAL` 3D and audio layers are worth the added build time before this ships, or held for a v2 pass.
