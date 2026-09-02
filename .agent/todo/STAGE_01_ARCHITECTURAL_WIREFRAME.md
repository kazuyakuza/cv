# Stage 1 — Complete Building Wireframe

## 1. Purpose

Stage 1 creates the **first complete SVG representation of the Professional Career Diorama**.

The goal is to validate the overall composition, spatial relationships, and architectural structure before introducing visual style, materials, textures, or detailed career-specific elements.

This stage should produce a deliberately simple **architectural blocking / wireframe model**.

It is expected to look unfinished.

The requirements for the career timeline, floor assignments, entrance concept, and visual direction are defined in:

```text
.agent/project-info/PROJECT_BRIEF.md
```

Use that document as the source of truth instead of duplicating its content here.

---

## 2. Inputs

Before implementation, read:

```text
AGENTS.md
.agent/project-info/PROJECT_BRIEF.md
.agent/project-info/IMPLEMENTATION_PLAN.md
.agent/project-info/STAGE_00_PROJECT_FOUNDATION.md
```

Do not invent or reinterpret career information defined by the Project Brief.

In particular, use the Brief for:

* career stages and chronology;
* floor assignments;
* entrance/sign requirements;
* building orientation;
* cutaway concept;
* undefined career-stage content.

This stage specification focuses on **how to construct and validate the first visual version**, not on redefining the project.

---

## 3. Primary Deliverable

Create **one complete editable SVG** containing the entire diorama.

The SVG must represent the complete building from the exterior entrance through the current unfinished floor.

Do not create separate SVGs for individual floors.

The first version should be constructed as one coherent architectural object so that proportions and alignment can be evaluated globally.

The SVG should remain easy to modify in subsequent stages.

---

## 4. Composition

Establish the overall composition described in the Project Brief.

The building must:

* use a coherent isometric / three-quarter perspective;
* occupy a substantial but not excessive portion of the canvas;
* leave sufficient surrounding space;
* establish a clear foreground;
* visually recede toward the upper-left;
* place the entrance/path in the foreground;
* allow all floors to be understood simultaneously.

The exact dimensions, camera angle, and proportions are intentionally **not fixed in advance**.

Choose them based on the rendered result.

Do not optimize for mobile yet.

Desktop composition is the primary target.

---

## 5. Building Geometry

Create a single vertically stacked building structure containing all required levels from the Project Brief.

At this stage, each floor may be represented primarily by:

* floor slab;
* simple structural boundaries;
* open interior area;
* basic partitions where required;
* minimal openings for stairs/elevator.

The floors must share a coherent:

* footprint;
* isometric projection;
* floor height;
* depth;
* major structural alignment.

The result must read as **one building**, not a collection of independently positioned boxes.

---

## 6. Required Spatial Relationships

Implement the important relationships from the Project Brief, especially:

### Ground floor

The three career areas must be spatially distinguishable and arranged in the specified sequence.

The entrance and path must lead naturally into this level.

### First floor

The staircase from the ground floor must arrive at the Nextcode side.

The elevator must occupy the central position between Nextcode and Health Platforms.

### Upper floors

The elevator must remain vertically aligned through the building.

The required divisions on Floors 2–4 must be represented spatially.

### Fifth floor

The current floor must be visibly different from the completed floors and communicate an unfinished / under-construction state using only basic geometry.

Do not add detailed visual metaphors yet.

---

## 7. Circulation

Create simplified versions of the building's primary circulation elements.

### Entrance

Include:

* entrance opening;
* simple threshold/platform if useful;
* path connecting the foreground to the entrance.

### Staircase

Represent the staircase connecting the ground floor to Floor 1.

Its most important requirement is that it visibly arrives at the Nextcode area.

Detailed stairs are not required.

### Elevator

Represent the elevator as a simple vertical shaft/opening.

It must remain aligned between the relevant areas on Floor 1 and continue consistently through the upper levels.

Detailed elevator mechanics, doors, controls, or interior elements are out of scope.

---

## 8. Exterior Elements

Include minimal geometry for:

* ground/terrain plane;
* entrance path;
* entrance;
* exterior career sign;
* simple viewer/foreground reference if useful for validating composition.

The sign is only a **placeholder at this stage**.

Do not implement the final profile photo, QR code, typography, or professional identity treatment yet.

---

## 9. Career Labels

Temporary labels may be included to make spatial validation possible.

Use only short identifiers such as:

```text
Puelo Games
BA Technology
Freelancer
Nextcode
Health Platforms
Interactica
Indelve
Pacer
CURRENT
```

Labels should be small and secondary to the geometry.

Do not add:

* descriptions;
* technology lists;
* dates;
* project information;
* skill lists;
* final professional titles.

The final information layer belongs to a later stage.

---

## 10. SVG Organization

Follow the semantic SVG organization established in Stage 0.

At minimum, provide meaningful groups for:

```text
terrain
path
entrance
career-sign
building
  floor-ground
  floor-01
  floor-02
  floor-03
  floor-04
  floor-05
  staircase
  elevator
viewer
labels
```

Career areas should also have meaningful identifiers where practical.

Prefer semantic IDs over generated IDs.

Do not flatten the SVG.

Do not optimize it in a way that destroys useful group structure.

---

## 11. Geometry Strategy

Establish reusable geometric logic for the floor modules.

Avoid independently guessing the geometry of every floor.

A floor should be derived from consistent parameters such as:

* width;
* depth;
* height;
* isometric axes;
* major corner positions.

Individual floors may then introduce specific differences such as:

* partitions;
* openings;
* incomplete structures;
* staircase/elevator locations.

The purpose is to make later geometric refinement possible without rebuilding the entire building.

---

## 12. Visual Style

Keep the Stage 1 appearance intentionally neutral.

Use:

* simple outlines;
* flat geometry;
* minimal visual hierarchy;
* restrained or monochrome colors.

Do **not** implement the final illustration style.

Specifically defer:

* hand-drawn linework;
* cross-hatching;
* material textures;
* realistic shadows;
* detailed lighting;
* architectural props;
* decorative objects;
* polished color palette;
* final typography.

The result should look like an architectural blocking model.

---

## 13. SVG Canvas

Use a deliberate `viewBox`.

The complete building, entrance, path, and relevant foreground elements must fit comfortably within it.

Avoid:

* excessive empty space;
* elements touching the canvas edges;
* cropping the upper floor;
* cropping the entrance or foreground.

The canvas should make the composition easy to evaluate at a glance.

---

## 14. Vue Integration

Render the Stage 1 SVG through the existing Vue application.

Use the simplest appropriate integration method.

Do not introduce a dedicated SVG component architecture yet.

Do not implement:

* floor interaction;
* hover states;
* animations;
* information panels;
* Overview/Detailed modes;
* dynamic career data.

The SVG itself is the primary deliverable.

---

## 15. Visual Validation

Stage 1 requires visual review.

A successful build is **not sufficient**.

Render the application and inspect the complete composition.

Evaluate:

* overall orientation;
* building proportions;
* floor alignment;
* visual balance;
* entrance/path relationship;
* staircase placement;
* elevator alignment;
* visibility of the interior;
* readability of the career progression;
* unfinished fifth-floor concept.

If the composition is incorrect, revise Stage 1.

Do not compensate for structural problems by adding detail.

---

## 16. Acceptance Criteria

Stage 1 is complete when:

* [ ] One complete editable SVG represents the entire diorama.
* [ ] All required floors from the Project Brief are present.
* [ ] The overall isometric composition is coherent.
* [ ] The building reads as one continuous architectural structure.
* [ ] Ground-floor career areas are spatially distinguishable.
* [ ] The entrance and path establish the beginning of the journey.
* [ ] The staircase connects the ground floor to Floor 1 and arrives at the correct area.
* [ ] The elevator has the required position and remains vertically aligned.
* [ ] Upper-floor divisions required by the Project Brief are represented.
* [ ] The fifth floor clearly reads as unfinished/current.
* [ ] The exterior sign exists as a structural placeholder.
* [ ] Semantic SVG groups and IDs are used.
* [ ] No detailed career information has been added prematurely.
* [ ] No final illustration styling has been introduced.
* [ ] The SVG is rendered through the Vue application.
* [ ] The rendered composition has been visually reviewed.
* [ ] Any significant composition problems have been corrected.

---

## 17. Stage Boundary

Do not use Stage 1 to solve problems belonging to later stages.

Explicitly defer:

* detailed architectural geometry;
* final wall/opening treatment;
* detailed stairs and elevator;
* architectural materials;
* textures;
* lighting and shadows;
* hand-drawn illustration style;
* career-specific props;
* final information design;
* responsive behavior;
* interaction;
* deployment.

The purpose of Stage 1 is simply:

> **Build the whole thing once, make the spatial relationships work, and establish a solid geometric foundation for refinement.**
