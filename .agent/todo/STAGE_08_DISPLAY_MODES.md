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

- [ ] Detailed is the default when no mode query parameter is present.
- [ ] The canonical mode contract supports `?mode=detailed` and `?mode=overview`, with unknown values falling back to Detailed.
- [ ] Detailed preserves the approved Stage 7 information and existing company-sign sizes.
- [ ] Overview visibly reduces information density, including hiding technology-logo plates.
- [ ] Overview company-name signs are substantially larger and readable at full-composition screenshot scale.
- [ ] Company signs are not duplicated; each mode uses the same underlying sign elements.
- [ ] Year plaques remain unchanged unless a specific collision is documented and approved.
- [ ] The current professional identity and approved exterior-sign content are preserved.
- [ ] The building's architectural scenes and props remain unchanged.
- [ ] Both modes are rendered and visually inspected at the same dimensions.
- [ ] Mode-specific styling is maintainable and survives SVG regeneration/assembly.
- [ ] No full Stage 9 application integration or Stage 10 deployment work has been pulled into this stage.
- [ ] The completion report accurately distinguishes tested behavior from the Stage 9 handoff.

## Completion Report

Report:

1. Files changed and the location of the canonical mode contract.
2. How Detailed and Overview are selected, including what works now and what is deferred to Stage 9.
3. Which information classes are hidden or retained in Overview and the rationale.
4. How existing company signs are scaled without duplicates, including the chosen visual scaling approach.
5. Render paths and screenshot dimensions used for both modes.
6. Results of lint, type-check, build, SVG generation, and SVG assembly checks as applicable.
7. Any remaining Stage 9 integration work or known limitations.
