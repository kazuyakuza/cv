# Stage 2 — Geometry and Structural Refinement

## 1. Purpose

Stage 2 refines the geometric structure created in Stage 1.

The overall composition established in Stage 1 should be preserved unless a concrete structural problem requires adjustment.

The objective is to transform the initial blocking model into a more convincing **sectional architectural structure**, while intentionally keeping the visual treatment simple.

This stage focuses on:

* geometric consistency;
* floor construction;
* wall planes;
* openings;
* structural alignment;
* staircase geometry;
* elevator shaft geometry;
* cutaway relationships.

It does **not** introduce the final illustration style.

---

## 2. Inputs

Before implementation, read:

```text
AGENTS.md
.agent/project-info/PROJECT_BRIEF.md
.agent/project-info/IMPLEMENTATION_PLAN.md
.agent/project-info/STAGE_01_ARCHITECTURAL_WIREFRAME.md
```

Use the Project Brief for all career-specific content and spatial requirements.

Stage 1 is the geometric starting point.

Do not redesign the career structure simply because the geometry is being refined.

---

## 3. Main Objective

The Stage 1 building currently establishes the overall composition using simple planes and lines.

Stage 2 should make those planes behave more consistently as architectural elements.

The result should communicate:

> "This is a cutaway building whose floors, walls, circulation, and structural elements belong to the same physical structure."

It should still look like a simplified architectural model.

---

## 4. Preserve the Validated Composition

Do not substantially change:

* overall building orientation;
* general footprint;
* number of floors;
* career-stage arrangement;
* entrance location;
* path direction;
* elevator's central relationship on Floor 1;
* staircase arrival at Nextcode;
* upper-floor sequence.

Small positional adjustments are allowed when required to correct geometry.

Large compositional changes should only be made if Stage 1 review reveals an actual structural problem.

---

## 5. Floor Construction

Refine the floor modules so that each level has a consistent physical construction.

Each floor should have:

* a clearly defined floor slab;
* consistent slab thickness;
* aligned outer edges;
* consistent floor-to-floor height;
* coherent isometric projection.

Avoid treating each floor as an isolated flat polygon.

The slabs should visually connect into a continuous building structure.

Where appropriate, expose the thickness of the slabs rather than representing them as single lines.

---

## 6. Structural Alignment

Review the complete building vertically.

The following elements should align consistently from floor to floor:

* primary outer corners;
* floor edges;
* major wall planes;
* elevator shaft;
* structural verticals;
* relevant openings.

If an element moves between floors without an architectural reason, correct it.

The goal is a structure that could plausibly be constructed as one building.

---

## 7. Cutaway Geometry

Begin establishing the actual sectional/cutaway construction.

The viewer should be able to see the interior because selected sides of the building are intentionally open.

Refine:

* exposed floor edges;
* remaining structural walls;
* open sides;
* interior boundaries;
* major vertical supports.

Do not completely enclose the building.

The cutaway must remain the dominant architectural characteristic.

At this stage, prioritize **correct geometry over visual realism**.

---

## 8. Walls

Introduce simple wall planes where they are structurally useful.

Walls should have:

* consistent thickness;
* consistent alignment;
* clear connections to floors;
* believable intersections.

Do not add windows, doors, brickwork, panels, or other architectural decoration yet.

The purpose is to establish the building's structural envelope.

---

## 9. Interior Partitions

Refine the major spatial divisions required by the Project Brief.

Partitions should read as actual architectural boundaries rather than arbitrary lines drawn on the floor.

Keep them simple.

Do not introduce furniture or career-specific objects.

The viewer should be able to distinguish the different spaces primarily through their geometry.

---

## 10. Elevator Shaft

The elevator should become a coherent vertical architectural element rather than a simple rectangular outline.

Refine:

* shaft boundaries;
* openings at each floor;
* vertical alignment;
* relationship with the surrounding floor slabs.

The elevator should remain visually centered between the required Floor 1 areas.

Do not add:

* mechanical equipment;
* cables;
* buttons;
* detailed doors;
* lighting.

Those belong to later stages.

---

## 11. Staircase

Replace the Stage 1 staircase placeholder with more coherent geometry.

The staircase should:

* connect Ground Floor and Floor 1;
* arrive at the Nextcode area;
* have consistent width;
* have a believable slope;
* intersect correctly with the two floor levels.

Individual steps may be represented if useful, but they should remain geometrically simple.

Do not add handrails, materials, lighting, or decorative details yet.

---

## 12. Openings and Connections

Review all places where architectural elements intersect.

In particular:

* staircase/floor intersections;
* elevator/floor intersections;
* wall/floor intersections;
* partition/floor intersections;
* entrance/building connection.

Avoid geometry that appears to pass through another structural element without explanation.

Small overlaps may be acceptable where they simplify the SVG, but visible structural contradictions should be corrected.

---

## 13. Fifth Floor

Refine the unfinished fifth floor structurally.

It should begin to look different from the completed floors through its geometry rather than through decorative styling.

Possible elements include:

* incomplete walls;
* exposed structural columns;
* partial floor boundaries;
* missing enclosure;
* unfinished vertical structures.

Keep this deliberately simple.

The objective is only to establish the architectural basis for the later "under construction" visual treatment.

---

## 14. Entrance and Sign Geometry

Refine the relationship between:

* terrain;
* path;
* entrance;
* sign;
* building.

The entrance should feel physically connected to the ground floor rather than simply placed beside it.

The sign should have a believable physical position and support.

Do not implement its final graphic content yet.

---

## 15. Viewer Relationship

Review the building from the intended viewing position.

The geometry should remain readable from the established perspective.

The viewer/foreground marker may remain extremely simple.

Its purpose is only to verify:

* scale;
* orientation;
* entrance relationship;
* visual depth.

Do not turn it into a detailed character.

---

## 16. Geometry Reuse

Continue using reusable geometry wherever practical.

Floor modules should share common construction logic.

If dimensions need to change, it should be possible to modify the building without manually correcting dozens of unrelated coordinates.

Prefer:

* shared dimensions;
* calculated coordinates;
* reusable SVG groups;
* consistent projection parameters.

Avoid unnecessary abstraction if it makes the SVG harder to edit.

The objective is **maintainable geometry**, not a geometry framework.

---

## 17. Visual Treatment

Keep the visual treatment close to Stage 1.

Allowed:

* simple fills;
* simple outlines;
* basic line hierarchy;
* subtle separation between structural planes.

Do not introduce the final visual style yet.

Specifically defer:

* hand-drawn imperfections;
* cross-hatching;
* material textures;
* detailed shadows;
* realistic lighting;
* final colors;
* decorative architectural elements.

Stage 2 is still primarily a geometry stage.

---

## 18. SVG Structure

Preserve the semantic SVG organization established in Stage 1.

Do not flatten groups while refining the geometry.

Keep architectural elements independently editable where practical.

If the Stage 1 organization proves insufficient, improve it rather than working around it with large monolithic paths.

---

## 19. Stage Boundary

Do not use Stage 2 to implement:

* final illustration style;
* hand-drawn line quality;
* textures;
* material rendering;
* detailed furniture;
* career-specific props;
* final information design;
* detailed typography;
* interactions;
* responsive behavior;
* deployment.

Those belong to later stages.
