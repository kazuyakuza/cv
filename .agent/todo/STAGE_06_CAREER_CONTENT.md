# Stage 6 — Professional Content Review and Exterior Sign Redesign

## Objective

Perform a restrained, targeted pass on the existing career diorama after Stages 5.5 and 5.6.

The current illustration is already densely populated with career-related scenes, people, furniture, equipment, project representations, and architectural details. Do not treat this stage as a request to add more objects to every floor. Preserve the established career narrative and existing scenes unless inspection of the current SVG reveals a specific, meaningful omission that can be corrected without inventing professional facts.

The main concrete change in this stage is to remove and replace the existing exterior entrance sign. Use the freed-up visual space to reduce the emphasis on the entrance and path, keeping the building itself as the primary subject.

This stage concerns visual and architectural content only. It does not implement the textual information layer or the two display modes.

## Status — COMPLETE (2026-10-10)

Implemented as a restrained content pass. `npm run svg:generate` + `svg:assemble`
regenerated; `npm run lint`, `npm run type-check`, `npm run build` all clean.
Verification renders: `generated/dev/r201-overview.png` (full composition) and
`generated/dev/r201-sign.png` (close crop of the new sign).

1. **Removed / replaced.** The old ground-standing entrance sign (`career-sign`:
   two `dw-column` posts + a framed 160×110 `dw-sign-frame`/`dw-sign` board with
   a screen-space photo disc and two grey name bars, cast in the lower-right
   foreground) was deleted completely — posts, board, shadow and the whole
   `career-sign` fragment. It is replaced by `projecting-sign`, a vertical blade
   that carries the **same placeholder motif reflowed vertically** (photo disc
   above two name bars). No new copy, photo, QR, company name or job title was
   added; the Software Architect / Technical Lead identity was not moved here.
2. **Where / how mounted.** At the building's **front-right corner** (corner B,
   where the absent front wall A‑B meets the right wall B‑D), projecting outward
   along the building's **depth axis, rear → front** (toward the viewer / −v) —
   the same direction as an arrow from the C‑D rear wall to the A‑B front wall.
   It mounts on the right wall's front end (v = 0) with a 12-unit gap. The blade
   is a closed box: thickness 10 along u (u 227…237), depth 88 along v
   (v −100…−12), spanning the floor-2/floor-3 stories (h FH+2…3·FH−2). Two
   `dw-jbox` arms bridge the gap to the wall, each with a wall plate and two
   `dw-dot` attachment points; a wood casing frame (`dw-sign-frame`), near-white
   inset panel (`dw-sign`) and the disc + `dw-sign-bar` motif sit on the visible
   −u broad face, which is perpendicular to the front wall.
3. **Composition / viewBox.** The hand-authored `path` fragment was shortened
   ~40% so it no longer leads to the removed sign. The assembled `viewBox` was
   then cropped from `0 0 1200 1050` to **`200 95 900 955`** (new `VIEW_BOX`
   constant in `assemble-svg.mjs`) to cut the empty side/foreground margins left
   after the sign's removal, re-centring the frame on the building + blade. All
   content is preserved; the terrain's far right/anterior is clipped at the frame
   edge. No other exterior element was changed.
4. **Career-scene additions.** **None.** A floor-by-floor review of the render
   found no specific, documented omission that the existing scenes do not already
   cover; all existing scenes/objects were retained and Indelve, Pacer and the
   unfinished fifth floor were left unchanged.
5. **Signage / scope.** Company tags, year plaques and the 2013 entrance sign are
   unchanged. No alternate company-sign versions, hidden mode-specific elements,
   or Detailed/Overview logic were introduced, and no Stage 7 information-layer
   content was added.
6. **Verification.** `generated/dev/r201-overview.png` and
   `generated/dev/r201-sign.png` inspected at full-composition and close scale.

## Read First

Before editing, inspect:

- `.agent/project-info/PROJECT_BRIEF.md`
- `.agent/project-info/IMPLEMENTATION_PLAN.md`
- `AGENTS.md`
- `src/svg/diorama.svg`
- The previous visual-stage specifications, especially Stage 5.5 and Stage 5.6.

Render the current SVG and compare it with the latest user-provided screenshot. Treat the actual SVG and rendered output as the source of truth; do not reconstruct the design from stage descriptions alone.

## Scope A — Replace the Existing Exterior Sign

### Remove the old sign

- Remove the existing exterior/personal sign from its current entrance-area location completely.
- Remove any sign-specific supporting geometry that becomes obsolete after the sign is removed.
- Do not leave a hidden, transparent, or unused duplicate of the old sign.
- Do not remove or redesign the building entrance itself. The entrance and path may remain, but they should no longer dominate the composition.

### Create a vertical projecting sign

Create a new physical sign projecting outward from the building's **right-hand exterior side**, approximately spanning the vertical area around floors 2 and 3. Inspect the current SVG geometry to identify the correct wall plane, perspective, and coordinates; do not guess coordinates without checking the source.

The sign should:

- Be a vertical, blade-style/projecting sign, inspired by these visual references:
  - https://www.shutterstock.com/image-photo/vintage-vertical-sign-lorraine-hotel-600w-2689662553.jpg
  - https://c7.alamy.com/comp/W1Y5XC/vertical-hotel-sign-text-on-billboard-outdoor-mock-up-neon-sign-informing-passing-people-tourist-pedestrian-or-car-drivers-attached-to-the-wall-of-hot-W1Y5XC.jpg
  - https://www.sceneryexpress.com/images/ME68811-A.gif
- Read clearly as a physical object mounted perpendicular to the exterior wall, rather than a flat panel pasted onto the building face.
- Include a plausible mounting bracket or arm, frame or casing, visible thickness, and attachment points. Keep these details consistent with the diorama's illustrated architectural style and perspective.
- Use a vertical layout that makes the **existing sign content** easier to read at a larger size. Reflow the existing content only as necessary to fit the new shape; preserve its wording and meaning.
- Have a clear silhouette against the background and enough contrast to remain legible at the full-composition scale.
- Avoid excessive neon, elaborate ornament, or a style that clashes with the existing industrial/architectural illustration. Subtle illumination is optional only if it fits the existing visual language.
- Be positioned so it does not obscure important interior scenes, floor edges, company signs, or the elevator.
- Be large enough to serve as a useful general reference to the portfolio's content, but not so dominant that it competes with the building.

The references are visual inspiration only. Do not download, trace, embed, or reproduce copyrighted stock/reference imagery. Build the sign as editable SVG geometry.

### Preserve content boundaries

- Preserve the sign's current content exactly in substance; inspect the existing SVG to establish what it currently says.
- Do not add a profile photo, QR code, LinkedIn label, new personal details, company names, job titles, or other new copy in this stage.
- Do not move the current Software Architect / Technical Lead identity onto this exterior sign.
- Any future textual information layer belongs to Stage 7. Stage 8 is responsible for Detailed and Overview modes.

### SVG implementation

- Keep the new sign in a clearly named, dedicated SVG group.
- Use meaningful IDs and maintainable geometry so the sign can be repositioned or restyled later.
- Reuse existing style conventions and SVG definitions where appropriate.
- Remove obsolete sign geometry and references rather than merely covering the old sign.
- Do not flatten the sign into a raster image.

## Scope B — Rebalance the Exterior Composition

Removing the old entrance-area sign should reduce the visual weight of the entrance/path region and allow the building to become the dominant subject.

After removing the old sign and adding the new projecting sign:

- Inspect the complete composition at the same scale as the current screenshot.
- Adjust the framing, viewBox, or nearby exterior elements only if needed to use the newly freed space effectively.
- Keep the building, floors, existing scenes, and overall perspective intact.
- Do not make the path, sidewalk, entrance, or exterior ground into a new focal point.
- Do not crop important parts of the building, the top unfinished floor, or the new sign.
- Avoid large unrelated composition changes. The goal is a focused improvement, not a new layout.

## Scope C — Conservative Review of Existing Career Scenes

The career-specific scenes have already received substantial visual development. This is a review for clear omissions, not a general enrichment pass.

1. Inspect the current rendered SVG floor by floor.
2. Preserve existing scenes, objects, and visual metaphors that already communicate the career narrative.
3. Add an element only if all of the following are true:
   - It represents a clearly documented aspect of the career.
   - The existing scene does not already communicate that aspect adequately.
   - The element would materially improve understanding.
   - It can be integrated naturally into the existing scene without clutter.
4. Prefer no additions over redundant or speculative additions.

Do not add technology names, technology logos, role labels, skill lists, dates, company names, project descriptions, or other information-layer content as part of this review. That content belongs to Stage 7.

Do not add a logo such as HP to BA Technology merely as decoration; its current scene is considered sufficiently developed unless direct inspection reveals a specific, evidence-based omission beyond what is already represented.

Do not invent or infer responsibilities, technologies, achievements, or project details for Indelve or Pacer. Preserve their current visual representations.

The fifth floor must remain an open, unfinished/under-construction representation of current AI-driven development work. Do not replace its existing scene with generic AI iconography.

If no clear omission is found, make no scene additions. Record briefly in the completion summary that the existing career scenes were retained because no specific addition was justified.

## Explicitly Out of Scope

- Implementing Detailed and Overview modes, query parameters, or visibility toggles. This is Stage 8.
- Creating alternate company-sign sizes or hidden duplicates for a future mode.
- Increasing company-name sign sizes specifically for Overview/screenshot mode. That presentation behavior must be implemented with the display modes in Stage 8; keep existing company signs unchanged in this stage.
- Adding or redesigning the information layer: roles, technologies, skills, dates, descriptions, current identity, profile photo, or LinkedIn QR code. This is Stage 7.
- General decoration, additional people/furniture/equipment, or broad floor-by-floor redesign.
- Changing career chronology, company/floor allocation, building structure, elevator/stair placement, or the established perspective.
- Reworking the current company-name signs or year plaques. Preserve them as they are.

## Acceptance Criteria

- [ ] The old exterior entrance sign is completely removed.
- [ ] A new vertical projecting sign is mounted on the building's right-hand side around floors 2–3.
- [ ] The new sign preserves the existing sign content and improves its legibility at the overall composition scale.
- [ ] The sign has convincing thickness, mounting hardware, perspective, and integration with the architectural illustration.
- [ ] The new sign does not obscure important interior content or compete excessively with the building.
- [ ] The freed-up entrance/path area has less visual prominence; the building remains the clear primary subject.
- [ ] Existing company signs, year plaques, floor scenes, career chronology, and architectural layout remain intact.
- [ ] No alternate company-sign versions, hidden mode-specific elements, or mode logic have been introduced.
- [ ] No Stage 7 information-layer content or Stage 8 display-mode behavior has been implemented.
- [ ] Any additional career-scene element is justified by a documented fact and a clearly identified gap; otherwise existing scenes remain unchanged.
- [ ] The SVG remains editable and organized, with no obsolete duplicate sign geometry.
- [ ] A fresh render has been inspected at full-composition scale and at a closer scale around the new sign.

## Completion Report

After implementation, report:

1. What was removed and what replaced it.
2. Where and how the new sign is mounted.
3. Any composition/viewBox adjustments and why they were necessary.
4. Whether any career-scene additions were justified; if none, explicitly say so.
5. Confirmation that company signs and year plaques were left unchanged and no Stage 7/8 work was introduced.
6. The rendered output used for visual verification.