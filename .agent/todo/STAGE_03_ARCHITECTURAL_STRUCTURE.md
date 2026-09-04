# Stage 3 — Basic Architectural Structure

## 1. Purpose

Transform the refined wireframe into a recognizable, physically coherent sectional building.

This stage builds on the geometry established in Stage 2 and specifically resolves the remaining structural problems visible in the current SVG:

* viewing angle and floor visibility;
* architectural depth and occlusion;
* elevator integration;
* staircase integration;
* entrance geometry;
* internal openings;
* floor-to-floor structural relationships.

The stage should remain structural and relatively simple.

Do not introduce the final illustration style, materials, detailed props, professional visual metaphors, or the information layer yet.

The complete career content and fixed building layout are defined in `PROJECT_BRIEF.md` and should be referenced rather than duplicated here.

---

## 2. References

Use:

* `PROJECT_BRIEF.md` as the source of truth for the complete building concept, fixed floor layout, circulation, career content, perspective concept, and architectural opening rules.
* `IMPLEMENTATION_PLAN.md` for the overall stage sequence.

This stage specification defines only the structural work to be performed now.

---

## 3. Primary Objective

At the end of this stage, the SVG must read clearly as:

> a multi-floor sectional/cutaway building viewed from a lower, more useful architectural angle, with physically understandable floors, walls, staircase, elevator, entrances, and internal connections.

The viewer should be able to understand:

* where each floor is;
* which surfaces are floors;
* which elements are walls;
* where the building entrance is;
* how the staircase connects the ground floor to the first floor;
* where the elevator shaft is;
* how the elevator connects to each floor;
* where the major internal sections are separated;
* how the building continues vertically.

The result does not need to look beautiful yet.

---

# 4. Critical Orientation

The SVG must consistently use the following spatial interpretation.

When looking at the rendered image:

* **Entrance side:** right/front side of the building.
* **Rear:** toward the left side of the composition.
* **Left wall:** the wall facing toward the viewer/front of the image.
* **Right wall:** the wall receding toward the rear of the building.

This orientation must be used consistently when positioning:

* entrance;
* staircase;
* elevator doors;
* internal openings;
* partitions;
* visible walls;
* floor boundaries.

Do not reinterpret the building orientation independently for individual elements.

---

# 5. Perspective and Camera Correction

Perspective is the highest-priority correction in this stage.

The current camera/view is too high and produces a strongly bird's-eye view. As a result, the vertical faces of the floors are visually compressed and the usable floor surfaces are difficult to read.

### Required correction

Adjust the projection/view angle so that:

* more of each floor's horizontal surface is visible;
* floor depth is visually readable;
* vertical floor separation remains clear;
* interior spaces remain visible;
* the building still recedes toward the upper-left;
* the viewer remains conceptually in the lower-right foreground.

The correction must come primarily from the projection/view geometry.

Do **not** solve the problem simply by making floors unnaturally tall.

Floor height should remain architecturally believable.

### Priority

The final angle does not need to be mathematically perfect.

A visually convincing and consistent architectural projection is more important than strict isometric correctness, as explicitly allowed by the Brief.

---

# 6. Floor Geometry

Each floor must become a real architectural slab/module rather than a simple isolated polygon.

For every floor:

* define a coherent floor plane;
* define its thickness where visible;
* maintain compatible footprint and perspective;
* align its edges with the building structure;
* ensure vertical stacking is consistent;
* ensure the floor does not visually float independently from the building.

The floor surfaces must remain sufficiently visible after the perspective correction.

Avoid excessive floor thickness.

The building should feel tall because it has multiple stacked floors, not because each floor is disproportionately thick.

---

# 7. Structural Layering and Occlusion

Correct the SVG drawing order so architectural elements visually intersect as they would in a real building.

The SVG must use an intentional layer order.

At minimum, the architecture should conceptually follow:

1. background/base;
2. rear/background structural elements;
3. interior floor structures;
4. staircase/elevator internal geometry where appropriate;
5. floor slabs and visible structural edges;
6. foreground-facing structural elements;
7. entrance elements;
8. exterior sign/path elements.

The exact implementation may differ, but the rendered result must obey physical occlusion.

### Important

A floor slab must not incorrectly appear behind an element that should be physically inside or below it.

In particular:

* the first-floor slab must correctly interact with the staircase;
* elevator shaft geometry must pass through the floor system correctly;
* elevator openings must not be hidden or exposed incorrectly;
* walls and partitions must intersect floor surfaces coherently.

Do not fix individual overlaps with arbitrary z-order changes if the underlying geometry is incorrect.

---

# 8. Building Walls

Introduce the basic permanent architectural walls.

Follow the cutaway rule from the Brief:

* the front wall remains absent;
* the right-side wall remains absent by default.

The purpose is to expose the interior.

Retain/add structural elements that establish:

* rear enclosure;
* left-side building boundary;
* floor boundaries;
* major vertical structural edges;
* selected framing where necessary.

Walls should have recognizable thickness where appropriate.

Avoid turning the building into a collection of infinitely thin lines.

At this stage, walls are structural geometry, not detailed architectural surfaces.

---

# 9. Elevator Shaft

The elevator must read as an integrated vertical building element rather than as an independent tower.

The shaft should:

* occupy the established central position;
* continue vertically through the relevant floors;
* align consistently from floor to floor;
* interact correctly with floor slabs;
* stop at the appropriate floor levels;
* remain structurally complete on its non-opening sides.

### Side walls

The elevator's side portions must be complete.

Do not leave unexplained holes or gaps in the shaft walls.

Openings should exist only where they represent an intentional architectural access.

### Elevator access orientation

The elevator doors/openings must face the **right wall of the building** according to the project orientation defined above.

Each floor's elevator access should therefore be represented on that side of the shaft.

Do not place elevator doors on arbitrary visible faces simply because they are easier to draw.

### First floor relationship

The elevator must clearly sit between:

> Nextcode | Elevator | Health Platforms

as defined in the Brief.

The elevator should visually function as the architectural divider/anchor between those two areas.

---

# 10. Ground-Floor Staircase

Correct the staircase so that it is a physically believable connection between the ground floor and first floor.

The staircase must:

* be positioned against the **rear wall** of the building;
* originate on the ground floor;
* rise toward the first floor;
* arrive directly at the Nextcode side of the first floor;
* maintain compatible alignment with the upper-floor circulation system;
* remain visually connected to both floor levels.

The staircase should not appear to float in the middle of the building.

### Stair/floor relationship

The first-floor slab must be visually above/over the staircase wherever physical occlusion requires it.

The staircase should visibly pass underneath the first-floor structure and emerge at the appropriate landing/opening.

Do not simply place the staircase in front of the complete slab.

The landing and opening should communicate an actual architectural connection.

---

# 11. Internal Section Connections

The career areas are spatially connected environments, not merely adjacent rectangles.

Where a floor is divided into multiple career sections, create a visible architectural passage/opening.

### Ground floor

The progression remains:

> Entrance → Puelo Games → BA Technology → Freelancer Game Developer → Staircase

The divisions between these areas may remain simple at this stage.

Where an actual wall separates areas, provide a believable passage/opening rather than making the wall completely continuous.

### Third floor

The Interactica and Indelve areas must eventually read as distinct areas while remaining part of the same floor.

Provide an architectural opening/passage rather than relying solely on an uninterrupted dividing wall.

For visibility, openings should preferentially be positioned on or near the **left-facing wall/visible side** of the relevant section when this produces the clearest result.

Do not add detailed doors yet.

A simple architectural opening is sufficient.

---

# 12. First-Floor Division

The first floor requires a more explicit architectural separation because of its layout:

> Nextcode | Elevator | Health Platforms

The elevator zone should act as the central divider.

Introduce a simple structural wall/partition associated with the elevator area so that the separation between the two sides is visually understandable.

The partition may connect to:

* the elevator shaft;
* the rear wall;
* or another structurally logical element.

It must not visually obstruct the elevator itself.

The result should read as three intentional architectural zones rather than three objects placed side by side.

---

# 13. Entrance Architecture

The entrance must become part of the building rather than an object placed near it.

The exterior sequence should read clearly as:

> path → threshold/step → entrance opening → interior

Correct the current relationship between:

* path;
* threshold/step;
* entrance;
* ground-floor interior.

The entrance should be positioned on the appropriate right/front side of the building.

The viewer should be able to visually follow the path into the building.

At this stage:

* a simple entrance opening is enough;
* a door does not need detailed modeling;
* no decorative facade is required;
* no signage typography is required.

The important goal is spatial clarity.

---

# 14. Exterior Sign

Correct the sign's physical placement and proportions.

The sign should:

* be larger than the current version;
* sit naturally beside the entrance path;
* remain clearly outside the building;
* have a simple, coherent physical support;
* feel like a small architectural object rather than a floating advertisement.

Remove the unexplained two-legged support currently visible.

Use one simple support structure or another visually coherent mounting solution.

The final sign contents belong to the later information stage; this stage only establishes its physical geometry and location.

The sign must not introduce current professional titles.

---

# 15. Floor-to-Floor Continuity

Verify the entire vertical stack from ground floor through fifth floor.

All floors must:

* share the same fundamental footprint system;
* remain aligned;
* preserve consistent perspective;
* have compatible floor heights;
* maintain consistent structural edges;
* align with the elevator;
* maintain compatible staircase/landing relationships.

The building must not appear to change coordinate systems between floors.

---

# 16. Fifth Floor

Preserve the existing conceptual treatment of the fifth floor as unfinished/open-air construction.

Do not significantly redesign it during this stage.

Only correct structural problems necessary for:

* alignment;
* floor stacking;
* perspective;
* elevator continuity;
* overall building coherence.

The unfinished character will be developed further in later stages.

The current AI-work content itself belongs to later career-content/information stages.

---

# 17. Structural Framing

Introduce only the minimum structural framing necessary to make the building believable.

Possible elements include:

* major vertical supports;
* slab edges;
* rear-wall framing;
* simple beams;
* elevator shaft boundaries;
* structural corners.

These should clarify architecture rather than decorate it.

Do not add:

* pipes;
* cables;
* mechanical systems;
* furniture;
* detailed construction hardware;
* surface textures.

Those belong to later stages.

---

# 18. SVG Organization

Keep the SVG modular and editable.

At minimum, preserve meaningful groups for:

* base/terrain;
* path;
* sign;
* entrance;
* ground floor;
* first floor;
* second floor;
* third floor;
* fourth floor;
* fifth floor;
* staircase;
* elevator;
* structural walls/framing;
* internal partitions.

Within each floor, keep major architectural elements grouped logically.

Avoid flattening the SVG into a single collection of unrelated paths.

The information layer must remain separate from architectural geometry, as defined by the Brief.

---

# 19. Geometry Quality Rules

All geometry introduced in this stage must satisfy:

* consistent perspective;
* intentional intersections;
* no unexplained floating objects;
* no unexplained gaps;
* no accidental overlaps;
* no duplicate structural lines where one edge is sufficient;
* no elements whose only purpose is to compensate for incorrect z-order;
* no arbitrary deformation of the building to imitate perspective.

When two architectural elements meet, the relationship should be understandable.

---

# 20. Visual Simplicity

Keep the visual language close to the current structural SVG.

This stage is **not** the illustration-style stage.

Use only enough visual differentiation to distinguish:

* floors;
* walls;
* slabs;
* openings;
* staircase;
* elevator;
* major structural elements.

Do not introduce the final hand-drawn linework, textures, colors, shading, or architectural micro-details yet.

Those are explicitly planned for Stages 4 and 5.

---

# 21. Validation Procedure

After implementation, render the complete SVG and inspect it at the same approximate scale used to evaluate the previous stages.

Review in this order:

### A. Camera

* Is substantially more floor surface visible?
* Does the building still recede toward the upper-left?
* Does the building avoid an excessively bird's-eye appearance?

### B. Structural stack

* Are all floors aligned?
* Are floor slabs physically understandable?
* Are there any floating or disconnected elements?

### C. Elevator

* Does it read as part of the building?
* Are the side walls complete?
* Are the openings facing the correct side?
* Does the shaft pass correctly through the floors?

### D. Staircase

* Is it against the rear wall?
* Does it connect ground floor and first floor?
* Does the first-floor slab correctly occlude it?
* Does it arrive at Nextcode?

### E. Internal connections

* Are ground-floor sections connected?
* Is the third-floor division understandable?
* Is the first-floor Nextcode/elevator/Health Platforms arrangement clear?

### F. Entrance

* Can the viewer visually follow path → threshold → entrance?
* Does the entrance clearly belong to the building?

### G. Sign

* Is it larger and better positioned?
* Does it have a coherent physical support?
* Does it remain clearly outside the building?

### H. Overall readability

At a glance, does the result look like one coherent sectional building rather than several independent geometric objects?

---

# 22. Acceptance Criteria

Stage 3 is complete when all of the following are true:

* [ ] The building has a lower, more useful viewing angle.
* [ ] Floor surfaces are sufficiently visible.
* [ ] The building still follows the intended lower-right → upper-left composition.
* [ ] Floor slabs form a coherent vertical stack.
* [ ] Structural walls establish a recognizable building.
* [ ] The front and right walls remain open unless a specific structural element justifies otherwise.
* [ ] The elevator is integrated into the building.
* [ ] Elevator side walls are complete.
* [ ] Elevator access faces the building's right wall.
* [ ] Elevator alignment is consistent across floors.
* [ ] The ground-floor staircase is against the rear wall.
* [ ] The staircase connects correctly to the first floor and Nextcode.
* [ ] Stair/floor occlusion is physically coherent.
* [ ] Internal section divisions contain understandable openings/passages.
* [ ] The first-floor Nextcode/elevator/Health Platforms relationship is structurally clear.
* [ ] The entrance reads as path → threshold → opening → interior.
* [ ] The sign is larger, correctly positioned, and physically supported.
* [ ] No major floating, disconnected, or incorrectly layered structural elements remain.
* [ ] The fifth floor remains visibly unfinished without being overdeveloped.
* [ ] The SVG remains modular and editable.
* [ ] No final illustration styling or professional-content detailing has been introduced prematurely.

---

# 23. Stage Boundary

Do **not** implement the following in Stage 3:

* final hand-drawn illustration style;
* texture;
* material rendering;
* detailed color palette;
* realistic shading;
* pipes/conduits/mechanical details;
* furniture;
* company-specific visual props;
* project-specific visual metaphors;
* detailed professional content;
* final typography;
* profile photograph;
* LinkedIn QR code implementation;
* Overview/Detailed mode;
* interactions;
* Vue state logic.

Those belong to subsequent stages according to `IMPLEMENTATION_PLAN.md`.
