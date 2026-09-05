# Stage 4.5 — Architectural Illustration Fixes

## 1. Purpose

This is a corrective stage between Stage 4 and Stage 5.

Its purpose is **not to introduce new visual concepts**, but to resolve the remaining inconsistencies identified in the Stage 4 result before introducing materials, textures, architectural details, and career-specific visual elements in Stage 5.

The current composition, perspective, architectural geometry, staircase, elevator, experience plaques, and overall illustration style should be preserved unless a change is explicitly required below.

The result of this stage must be a clean and internally consistent version of the Stage 4 illustration.

---

## 2. Inputs

Use:

* `.agent/project-info/PROJECT_BRIEF.md`
* `.agent/project-info/IMPLEMENTATION_PLAN.md`
* `STAGE_04_*.md`
* the current Stage 4 SVG

Do not redefine information already established in those documents.

---

## 3. Required Fixes

### 3.1 Ground-Floor Base Artifact

Remove the small unexplained line/object currently visible near the bottom of the ground-floor base.

It appears as an accidental or leftover graphical fragment rather than an intentional architectural element.

After the fix:

* the ground-floor base must have a clean silhouette;
* no isolated line or shape should remain without a clear architectural purpose;
* do not replace it with another decorative element.

---

### 3.2 Basic Floor Surface Treatment

The floor surfaces currently appear excessively flat and empty compared with the rest of the illustration.

Introduce a **minimal architectural surface treatment** so that floors read as actual physical floor surfaces rather than plain white polygons.

At this stage:

* establish a subtle base tone/material distinction for floor surfaces;
* maintain clear separation between:

  * floor top surface,
  * floor/slab edge,
  * surrounding walls;
* use restrained tonal variation;
* maintain the existing illustration palette;
* preserve the sectional/cutaway readability.

Do **not** introduce a detailed tile or grid pattern yet.

A floor may contain extremely subtle linework if necessary to communicate its surface, but the result should remain visually simple.

### Explicit boundary

**Stage 4.5 is not the tile/material-detail stage.**

Do not add:

* regular tile grids;
* elaborate flooring patterns;
* wood/plank patterns;
* carpet textures;
* complex material textures;
* detailed floor wear or decoration.

Those belong to Stage 5.

The objective here is only to prevent the floors from reading as completely unfinished white areas.

---

### 3.3 Indelve Floor Color Transition

Correct the incorrect color/material transition currently visible around the Indelve section on the third floor.

The transition between the Interactica and Indelve areas must be visually coherent and intentional.

Requirements:

* no abrupt or unexplained color discontinuity;
* no color spill from one area into another;
* the Indelve area must remain clearly distinguishable as its own section;
* the floor surface must follow the same basic rendering logic established for the rest of the building;
* the correction must not invent any Indelve-specific visual identity or content.

The exact future material treatment of Indelve is deferred to Stage 5.

---

## 4. Global Surface Consistency Pass

After applying the specific fixes above, perform a short global consistency pass over all floors.

Check that:

* equivalent floor surfaces use equivalent base rendering logic;
* floor slabs have consistent visual hierarchy;
* wall/floor boundaries are readable;
* no floor unexpectedly remains completely flat while others receive surface treatment;
* there are no accidental color transitions;
* there are no isolated graphical artifacts;
* the illustration does not introduce unnecessary detail prematurely.

This is a consistency pass, not a redesign.

---

## 5. Exterior Profile / LinkedIn Sign Placeholder

The existing lower-right exterior element is intentional.

It is the **placeholder for the future personal/profile sign**, which will eventually contain elements such as:

* profile photograph;
* LinkedIn QR code;
* LinkedIn identification;
* potentially one or two minimal additional pieces of information.

For Stage 4.5:

**Do not redesign or remove this element.**

Its current simplified placeholder representation is acceptable.

The following are explicitly deferred:

* final size;
* final position;
* final proportions;
* final support/mounting;
* actual profile photograph;
* actual QR code;
* final typography;
* final LinkedIn information;
* detailed sign design.

Those decisions can be made during a later content/polish stage when the actual information layer is introduced.

---

## 6. Preserve Existing Architecture

The following elements are considered resolved enough for this stage and should not be redesigned:

* overall building proportions;
* camera angle and perspective;
* floor stacking;
* staircase geometry and placement;
* elevator position and orientation;
* elevator chronology;
* fifth-floor unfinished condition;
* sectional/cutaway configuration;
* experience plaque placement;
* main entrance structure.

Only make incidental corrections if something is clearly broken while performing the required fixes.

Do not use this stage to reopen previously resolved architectural decisions.

---

## 7. SVG Requirements

Maintain the existing modular SVG structure.

The fixes should remain:

* editable;
* grouped logically;
* separated by architectural function;
* free of rasterized replacement artwork.

Do not flatten the illustration.

Avoid introducing one-off paths that duplicate existing geometry when the correction can be made by modifying the appropriate existing group or element.

---

## 8. Visual Target

At the end of Stage 4.5, the building should look like a **clean, coherent illustrated architectural diorama**, but still intentionally simplified.

It should no longer contain:

* the stray ground-floor artifact;
* inconsistent floor rendering;
* the incorrect Indelve color transition;
* visually empty/unfinished-looking floor surfaces caused solely by completely flat white fills.

It should still **not** contain the detailed material treatment expected from Stage 5.

The profile/LinkedIn sign placeholder remains visible and intentionally simplified.

---

## 9. Acceptance Criteria

Stage 4.5 is complete when:

* [ ] The stray ground-floor base artifact has been removed.
* [ ] Floor surfaces have a subtle, consistent base treatment.
* [ ] Floor tops and slab edges remain visually distinguishable.
* [ ] No detailed tile/grid system has been introduced.
* [ ] The Indelve floor transition is visually coherent.
* [ ] No accidental color or material transitions remain.
* [ ] The existing perspective and architectural composition are preserved.
* [ ] Staircase and elevator remain unchanged unless an incidental correction is necessary.
* [ ] The fifth floor remains visibly unfinished.
* [ ] The profile/LinkedIn sign placeholder remains present.
* [ ] The placeholder has not been unnecessarily redesigned.
* [ ] No unexplained graphical artifacts remain.
* [ ] The SVG remains modular and editable.

---

## 10. Stage Boundary

Stage 4.5 ends once the existing Stage 4 illustration is visually consistent.

Do **not** use this stage to add:

* detailed floor tiles;
* detailed wall materials;
* pipes and conduits;
* structural micro-details;
* furniture;
* company-specific objects;
* project-specific visual metaphors;
* detailed career information;
* final profile/QR content;
* advanced information hierarchy.

Those belong to later stages, primarily Stage 5 and beyond.

---

## 11. Transition to Stage 5

After Stage 4.5 is visually approved, the building should be considered **architecturally and stylistically stable enough to receive detailed visual content**.

Stage 5 can then introduce:

* richer material differentiation;
* floor patterns and/or tile grids where appropriate;
* wall and structural materials;
* architectural micro-details;
* furniture and environmental objects;
* pipes, conduits, panels, brackets, seams, bolts, and similar details;
* stronger material-specific shading and texture;
* career-stage-specific visual storytelling.
