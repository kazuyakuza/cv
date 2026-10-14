# Stage 8 — Detailed and Overview Modes

## Objective

Implement two presentation modes for the completed diorama, using the information layer approved in Stage 7.

- **Detailed** is the default, exploration-oriented mode. It preserves the current information density and existing scale of company signs.
- **Overview** is a screenshot-friendly presentation with substantially reduced information density, clearer company-name signs, and a stronger high-level career narrative.

Both modes must use the same underlying diorama and professional data. This stage changes information visibility and presentation only; it must not create a second illustration or redesign the architecture.

The primary query contract is:

- Default: no query parameter → Detailed.
- Overview: `?mode=overview`.
- Explicit Detailed: `?mode=detailed`.
- Missing, empty, or unrecognized `mode` values fall back to Detailed.

Keep the implementation compatible with the current SVG authoring/generation workflow and the later Vue integration stage. Do not turn this into the full application integration work assigned to Stage 9.

## Status — COMPLETE (2026-10-14)

Implemented and visually verified. One canonical contract in
`src/display-mode.ts`; `src/App.vue` resolves `?mode=` and swaps the root SVG's
mode class; the assembled file ships `dw-mode-detailed`, so the standalone SVG
stays Detailed. Mode rules are embedded in the SVG `<style>`
(`scripts/style.mjs`): Overview hides the technology-logo plates and scales the
company signs `1.8×` around their own centre (one per-sign origin tweak for
Nextcode). Detailed is pixel-identical to the Stage 7 `r224` render. Per user
decision Overview keeps all role labels, the identity block, year plaques and
the projecting sign. `npm run lint`, `type-check`, `build` all clean. See the
Completion Report at the end of this file.

## Read First

Inspect these current repository sources before changing anything:

- `.agent/project-info/PROJECT_BRIEF.md`
- `.agent/project-info/IMPLEMENTATION_PLAN.md`
- `AGENTS.md`
- `src/svg/README.md`
- `.agent/todo/STAGE_07_INFORMATION_LAYER.md` and its completion report
- `.agent/todo/STAGE_07_INFORMATION_LAYER_CONTINUE.md` for the development history
- `src/svg/diorama.svg`
- `src/svg/fragments/tags.svg`
- The generated `information-*` fragments and `src/svg/fragments/projecting-sign.svg`
- `scripts/generate-geometry.mjs`, `scripts/assemble-svg.mjs`, and `scripts/style.mjs`
- The current app entry points and styles, to understand what can be implemented now without prematurely completing Stage 9.

Render the current Stage 7 result first. Use the current committed SVG as the baseline and preserve its latest approved placements.

## Scope A — Define a Single Mode Contract

Use one canonical mode value with two supported values: `detailed` and `overview`.

- Detailed is the default when no recognized mode is requested.
- Overview is requested by `?mode=overview`.
- Treat mode matching case-insensitively if the current URL-handling layer makes that straightforward; do not add a dependency just for this.
- Unknown values must never result in a blank or partially styled diagram; they fall back to Detailed.
- Avoid multiple independent flags that can disagree about the active mode.
- Keep the mode contract documented so Stage 9 can connect it to the Vue application and query parameter handling without duplicating or contradicting this logic.

Stage 8 must implement and visually verify the two presentation states. Stage 9 remains responsible for integrating the diorama into the Vue component/application structure and connecting the mode contract to the final application routing/query handling. If the current scaffold already provides a minimal runtime needed to exercise `?mode=overview`, use it for verification, but do not expand it into the full Stage 9 integration.

## Scope B — Detailed Mode

Detailed mode is the default and must preserve the approved Stage 7 presentation.

- Show all currently approved role labels and technology-logo plates.
- Show the current Software Architect / Technical Lead identity block.
- Show the projecting sign with the profile photo, name, LinkedIn QR code, and LinkedIn URL.
- Preserve the existing company-name signs and year plaques at their current size and placement.
- Preserve all architectural scenes, project representations, people, props, and the unfinished top-floor construction.
- Do not introduce new content as part of this mode.
- Do not make the detailed diagram denser than the approved Stage 7 version.

A direct load with no mode query must render this state.

## Scope C — Overview Mode Information Hierarchy

Overview must be substantially simpler than Detailed, not merely a slightly smaller version of it. The building and its career progression remain the main content.

### Always preserve

- The complete building, floor structure, elevator, stairs, architectural cutaway, and established perspective.
- Existing company-name signs, made significantly larger for legibility in a full-composition screenshot.
- The year plaques unless the rendered composition proves they create a specific, material collision; do not remove them pre-emptively.
- The current professional identity block on the upper floor.
- The projecting personal sign, including its existing approved content, unless visual verification shows that a mode-specific reduction is essential to avoid competing with the building. Do not change its content.
- The company-specific scenes and visual metaphors that communicate the career without text.

### Reduce or hide

- Hide the technology-logo plates in Overview. These are supporting detail and are too numerous for the high-level screenshot.
- Hide secondary role labels where they compete with the company signs or make the full composition noisy. Retain a role label only where it materially clarifies a major transition and remains legible at screenshot scale.
- Hide any other small supporting annotation introduced in Stage 7 if it becomes illegible at the full-composition scale. Do not hide core company identification or the current professional identity merely to make the image sparse.
- Do not remove or simplify the underlying architectural props or scenes; Overview reduces information density, not the illustration itself.

Before finalizing which role labels remain visible, inspect the complete screenshot and crops at the intended Overview output size. Make the final selection explicit in the mode-specific classes or data configuration; avoid ad hoc per-element inline overrides.

## Scope D — Overview Company-Sign Legibility

The existing company-name signs are currently appropriate for detailed zoomed exploration. For Overview they need to be **substantially larger** so company names can be read in a full-building screenshot.

- Increase the visual size of the existing company signs in Overview only.
- Keep the existing Detailed size unchanged.
- Do not duplicate signs and hide one copy per mode.
- Prefer a maintainable presentation-layer transform or mode-specific style that scales each existing sign around its own visual center while preserving its attachment and orientation.
- Inspect how plaque text, borders, screw/nail details, perspective transforms, and contact shadows are grouped. Scale the correct group so the text and physical plaque remain coherent.
- Do not scale year plaques unless there is a separate demonstrated legibility problem; the explicit size increase applies to company-name signs.
- Avoid scaling so far that signs collide with role labels, cover scene content, cross floor boundaries, or appear physically implausible.
- Since signs sit on different projected planes, verify all orientations individually. A single generic transform may not be suitable for every sign.
- If the current SVG structure makes safe mode-specific scaling impossible without duplicating elements, refactor the grouping or generator instead. Do not leave duplicate hidden artwork.

The Overview size should be determined by rendered comparison at the intended screenshot scale, not by an arbitrary percentage alone. Record the chosen treatment in the completion report.

## Scope E — Technical Implementation and SVG Organization

Inspect the existing project structure and choose the smallest maintainable implementation compatible with the Stage 9 handoff.

- Prefer shared mode classes/data attributes and CSS for visibility and presentation when the SVG is inline or otherwise supports those styles.
- If the assembled SVG is currently used as a standalone image, account for the fact that page CSS cannot style internal SVG elements across an external-image boundary. Do not assume external CSS can reach into an SVG loaded through `<img>`.
- Keep mode-aware selectors and the mode contract centralized rather than scattering unrelated style conditions through generated fragments.
- Where the information fragments are generated by `generate-geometry.mjs`, implement structural/class changes in the generator or its source data, then run the documented generation and assembly commands.
- Do not manually edit generated fragments or `diorama.svg` if the change would be overwritten by regeneration.
- Keep the SVG source artwork editable and deterministic.
- Avoid JavaScript dependencies or a new state-management system for a two-state presentation.
- Do not implement a separate copy of the diorama for each mode.
- Preserve the standalone SVG's default appearance as Detailed if that is the current delivery contract.

If a reliable query-parameter toggle cannot be implemented at this stage without doing the full Vue integration, implement and verify the mode styling contract in the SVG/source, document the exact integration seam, and leave final URL routing to Stage 9. Do not claim that the URL parameter works end-to-end unless it has actually been tested.

## Scope F — Visual Verification

Create fresh renders for both states from the same Stage 7 baseline.

### Detailed render

Verify:

- It matches the approved Stage 7 composition.
- All approved technology-logo plates and role labels remain present.
- Company signs and year plaques retain their existing sizes.
- The projecting sign and current identity block are unchanged.
- No content disappears due to a selector/class mismatch.

### Overview render

Verify:

- Company names are substantially more legible at full-composition scale.
- The reduction in labels/logos is obvious and intentional.
- The building remains visually rich; the mode does not look empty or unfinished.
- The main career progression is understandable without zooming.
- Company signs do not overlap the architecture, one another, or critical scenes.
- The current identity block remains legible and distinct from the fifth-floor props.
- The exterior projecting sign remains balanced with the building and does not become the primary focal point.
- The entire building and sign remain inside the composition bounds.

Inspect the full composition and close crops of every company sign that was scaled. Compare both renders side by side at the same output dimensions.

## Explicitly Out of Scope

- Redesigning or adding career content, technology logos, project scenes, or personal information. Stage 7 is complete.
- Changing the building geometry, floor allocation, career chronology, elevator, stairs, or established perspective.
- Redesigning the physical projecting sign or changing its content.
- Creating separate copies of the diorama for Detailed and Overview.
- Full Vue component/application integration, final routing, responsive behavior, or deployment. These belong to Stage 9 and Stage 10.
- A manual mode toggle UI unless it is already required by the current project scaffold; the specified public selection mechanism is the URL query parameter.
- Arbitrary changes to the global framing just to make one mode work. If Overview exposes a framing issue, document the issue and make only the smallest justified adjustment.

## Acceptance Criteria

- [x] Detailed is the default when no mode query parameter is present.
- [x] The canonical mode contract supports `?mode=detailed` and `?mode=overview`, with unknown values falling back to Detailed.
- [x] Detailed preserves the approved Stage 7 information and existing company-sign sizes.
- [x] Overview visibly reduces information density, including hiding technology-logo plates.
- [x] Overview company-name signs are substantially larger and readable at full-composition screenshot scale.
- [x] Company signs are not duplicated; each mode uses the same underlying sign elements.
- [x] Year plaques remain unchanged unless a specific collision is documented and approved.
- [x] The current professional identity and approved exterior-sign content are preserved.
- [x] The building's architectural scenes and props remain unchanged.
- [x] Both modes are rendered and visually inspected at the same dimensions.
- [x] Mode-specific styling is maintainable and survives SVG regeneration/assembly.
- [x] No full Stage 9 application integration or Stage 10 deployment work has been pulled into this stage.
- [x] The completion report accurately distinguishes tested behavior from the Stage 9 handoff.

## Completion Report

Report:

1. Files changed and the location of the canonical mode contract.
2. How Detailed and Overview are selected, including what works now and what is deferred to Stage 9.
3. Which information classes are hidden or retained in Overview and the rationale.
4. How existing company signs are scaled without duplicates, including the chosen visual scaling approach.
5. Render paths and screenshot dimensions used for both modes.
6. Results of lint, type-check, build, SVG generation, and SVG assembly checks as applicable.
7. Any remaining Stage 9 integration work or known limitations.

### Report

1. **Files changed / contract location.** The canonical contract is
   **`src/display-mode.ts`** (`DisplayMode`, `MODE_PARAM = 'mode'`,
   `MODE_CLASS`, `resolveMode(search)`). Changed: `src/App.vue` (resolve +
   root-class swap), `scripts/style.mjs` (embedded mode rules),
   `scripts/assemble-svg.mjs` (root `class="dw-mode-detailed"`),
   `scripts/generate-geometry.mjs` (`logoPlate()` → `.dw-logo` wrapper;
   `experienceTags()` → `dw-tag-<slug>` class), `eslint.config.js` (browser
   globals for `src/**/*.ts`/`*.vue`). Regenerated `src/svg/fragments/*.svg`
   (information fragments + `floor-ground` only) and `src/svg/diorama.svg`.
   Docs: `src/svg/README.md` §Stage 8, `AGENTS.md`.
2. **Selection — tested now vs Stage 9.** Verified end-to-end against the dev
   server: no parameter → Detailed; `?mode=detailed` → Detailed;
   `?mode=overview` → Overview; `?mode=OVERVIEW` → Overview (case-insensitive);
   `?mode=xyz` → Detailed. `App.vue` reads `window.location.search` and swaps
   the root SVG's mode class; the assembled file defaults to Detailed, so the
   standalone SVG is unaffected. Stage 9 still owns real routing, the Vue
   component/data model and any responsive behavior — `resolveMode()` is the
   seam to reuse.
3. **Overview visibility.** Hidden: the technology-logo plates only (via the
   new `.dw-logo` wrapper, which hides the plate rect *and* the brand art).
   Retained (user decision, 2026-10-13): all role labels, the current identity
   block, year plaques, the projecting sign and every scene/prop. Rationale:
   the user asked to keep all role labels; density is reduced by dropping the
   numerous logo plates and by making the company signs the dominant
   identifiers.
4. **Sign scaling, no duplicates.** `.dw-mode-overview #tags .dw-tag-group`
   applies a presentation-layer CSS transform (`transform-box: fill-box;
   transform-origin: center; transform: scale(1.8)`) — the same underlying
   elements are reused in both modes. All experience tags share the invisible
   left wall (`u = -1.5`), so one screen-space scale fits every sign without
   distorting glyphs; scoping to `#tags` leaves the year plaques and the 2013
   entrance sign untouched. One collision was found (Nextcode sign rising into
   the `Co-Founder` role label); `experienceTags()` now emits a stable
   `dw-tag-<slug>` class and `.dw-mode-overview #tags .dw-tag-nextcode` uses
   `transform-origin: 50% 0%` so that sign grows downward, clearing the label.
5. **Renders.** Detailed: `generated/dev/r226.png` and the earlier
   `r225.png` (2250×2387, S=2.5, viewBox `200 95 900 955`) — both pixel-
   identical to the Stage 7 `r224.png`. Overview: `generated/dev/r226-overview.png`
   (same 2250×2387), plus crops `ov2-nextco.png`, `ov2-tl.png`, `ov-ground.png`,
   `ov-f12left.png`, `ov-f34.png`. Dev wrapper `generated/dev/make_chk_modes.py`
   writes both `chk.html` and `chk-overview.html` (class-swapped, assets inlined).
6. **Checks.** `npm run svg:generate` and `npm run svg:assemble` succeed;
   `npm run lint`, `npm run type-check`, `npm run build` all clean.
7. **Remaining / limitations.** Stage 9: connect `resolveMode()` to the final
   router/query handling, bind the information data model, and add responsive
   behavior. Known constraint: because the user chose to keep *all* role labels
   while enlarging the signs `1.8×`, Overview is denser than the spec's
   "reduced density" ideal; the Nextcode sign is the one element needing a
   per-sign origin tweak. If review prefers a sparser Overview, hiding the
   competing role labels is a one-line CSS change. Overview styling is
   currently page/embedded-CSS only — it does not apply to a standalone
   `diorama.svg` opened outside the app (by design; the standalone default is
   Detailed).

### Report — Overview review round (2026-10-14)

Eight user-requested Overview fixes, implemented and rendered
(`generated/dev/r228-overview.png`; detailed `r228.png`):

1. **Puelo Games** — a second, smaller plaque now sits *above* the company sign
   carrying `Unity Dev`. `experienceTags()` renders it from an optional `role`
   on the `FLOOR_TAGS` entry (`<g class="dw-tag-role">`, `.dw-tag-role-text`),
   hidden in Detailed and shown in Overview, so it scales with the sign; the
   Puelo door label (`.dw-role-puelo`) is hidden in Overview.
2. **Freelancer** — the company sign now reads `Freelancer Game Dev` (shared
   source; also visible in Detailed).
3. **Nextcode** — the `transform-origin: 50% 0%` hack was reverted; the sign
   scales around its centre again (it overlaps `Co-Founder`; user will fix
   differently next round).
4. **Health Platforms / DBA** — enlarged +20% and moved down to the centre of
   its wall part (partial wall v 20–150, h 105–197.5 → centre h 151.25; Δy =
   +27.75 user units) via `modeLabelWrap('dw-role-dba', 0, 27.75, …)`.
5. **Interactica f2-left / Tech Lead** — enlarged +20% (`.dw-role-floor-xl`
   → 18.1px in Overview).
6. **Interactica f3-right / Software Architect** — enlarged +15% and moved down
   to the centre of its wall part (partial wall h 315–407.5 → centre 361.25;
   Δy = +28.25) via `modeLabelWrap('dw-role-f3sa', 0, 28.25, …)`.
7. **Indelve** — the near (left) fleet is now assembled *under* the `Indelve`
   sign (moved before `tags` in `assemble-svg.mjs`); shared source, also
   affects Detailed.
8. **Pacer / Software Architect** — enlarged +15% (`.dw-role-pacer` → 11.5px in
   Overview).

Mechanism: Overview-only label moves use a wrapper group carrying the
screen-space translate as CSS custom properties (`--ovx`/`--ovy`, px = user
units) applied by `.dw-mode-overview .dw-role-*`; the inner text keeps its plane
matrix, so Detailed is untouched. Detailed changed only for items 2 and 7.

`npm run svg:generate`, `svg:assemble`, `lint`, `type-check`, `build` all clean.
Verified: Detailed `r228.png` differs from `r224.png` only at the Freelancer
sign and the Indelve tag/fleet (diff clusters); Overview crops confirmed each
fix.

### Report — Overview review round 2 (2026-10-14)

The Puelo `Unity Dev` mini-board treatment was extended to the remaining role
labels (`generated/dev/r229-overview.png`; detailed `r229.png`, byte-identical
to `r228.png` — all Overview-only):

- `FLOOR_TAGS` gained `role` on BA (`Jr. Developer`), Nextcode (`Co-Founder`),
  Interactica f2 c=135 (`Dev`) and f2 c=470 (`Tech Lead`); `roleMiniBoard()` is
  factored out and renders the board above each sign (hidden in Detailed).
- The matching role labels are hidden in Overview via
  `.dw-role-ba/-nextcode/-f2right/-f2left` (previously enlarged); this also
  removes the Nextcode-sign/`Co-Founder` collision noted in round 1.
- Pacer `Software Architect` is a standalone `.dw-tag-group.dw-tag-role` board
  *between* the two Pacer signs, centred on the elevator's depth (c ≈ 302.5,
  floor 4); the `.dw-role-pacer` floor label is hidden in Overview (its +15%
  bump was dropped).

Verified by crops: each mini board sits above its sign; the Pacer board is
between the two Pacer signs near the elevator; the role labels are gone in
Overview and unchanged in Detailed.

### Report — Overview review round 3 (2026-10-14)

Two more Overview-only scalings (`generated/dev/r230-overview.png`; detailed
`r230.png`, byte-identical to `r229.png`):

- **Year plaques +15%** — `#elevator` and `#entrance` `.dw-tag-group` scale
  `1.15` around their own centre (elevator story years + the 2013 entrance
  sign).
- **Projecting sign +25%** — `#projecting-sign` scales `1.25` around its own
  centre (photo, name, QR and LinkedIn label all enlarge). Verified the sign
  stays attached to the wall and within the composition bounds.

`lint`, `type-check`, `build` clean.
