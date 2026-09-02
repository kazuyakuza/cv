# Stage 1 — Complete Building Wireframe

## 1. Purpose

Stage 1 creates the **first complete SVG representation of the Professional Career Diorama**.

This is the first visual-development stage of the project.

The objective is not to produce a polished illustration.

The objective is to validate the fundamental spatial composition of the entire diorama:

* overall building footprint;
* vertical stacking of floors;
* isometric orientation;
* floor proportions;
* staircase continuity;
* elevator alignment;
* relationship between the exterior entrance and the building;
* relationship between the building and the viewer;
* position of the unfinished fifth floor;
* overall visual balance of the composition.

The result should be an intentionally simple architectural wireframe.

It should look closer to a **construction diagram or architectural blocking model** than to the final illustration.

No attempt should be made to reproduce the final hand-drawn visual style yet.

---

# 2. Stage 1 Philosophy

Stage 1 follows one principle:

> **Validate composition before adding detail.**

The first SVG should contain enough geometry to answer:

> "Does this building actually work as a coherent visual representation of the career?"

It should not attempt to answer:

> "Does this already look like the final illustration?"

The second question belongs to later stages.

Therefore, simplicity is intentional.

If the composition is incorrect, additional detail would only make the problem harder to fix.

---

# 3. Source of Truth

Before implementation, read:

```text
AGENTS.md
.agent/project-info/PROJECT_BRIEF.md
.agent/project-info/IMPLEMENTATION_PLAN.md
.agent/project-info/STAGE_00_PROJECT_FOUNDATION.md
```

The project brief is authoritative for:

* career chronology;
* floor assignments;
* building relationships;
* entrance/sign requirements;
* architectural concept;
* current fifth-floor concept.

This stage document defines how those requirements should be translated into the first visual wireframe.

Do not invent additional career information.

Do not invent responsibilities, technologies, dates, or achievements for undefined career stages.

In particular:

* do not invent content for Indelve;
* do not invent content for Pacer.

---

# 4. Stage 1 Scope

Stage 1 creates:

* one complete SVG;
* one complete building;
* all six visual levels;
* entrance;
* exterior path;
* exterior sign placeholder;
* staircase structure;
* elevator shaft/alignment;
* basic floor divisions;
* basic career-area divisions where required;
* unfinished fifth floor;
* minimal terrain/ground context;
* basic viewer/composition reference if needed.

The SVG should be sufficiently complete that the entire career timeline is spatially represented.

---

# 5. SVG as the Primary Artifact

The Stage 1 deliverable is an editable SVG.

Do not create the building first as:

* a raster image;
* a 3D model;
* a canvas drawing;
* a screenshot;
* a generated bitmap;
* a flattened image.

The SVG itself is the source artifact.

It must remain editable.

The geometry should be represented using normal SVG primitives wherever practical:

* `<polygon>`;
* `<polyline>`;
* `<line>`;
* `<rect>`;
* `<path>` where necessary.

At this stage, favor simple primitives over complex paths.

---

# 6. Overall Composition

The complete composition should follow the established visual orientation:

* the viewer is positioned toward the lower-right foreground;
* the building extends/recedes toward the upper-left;
* the building is viewed from an isometric/three-quarter perspective;
* the front and right sides are generally open because this is a sectional/cutaway building;
* the interior spaces remain visible;
* the building grows vertically through the career timeline.

The exact camera angle does not need to be final.

The important requirement is that the orientation is immediately understandable.

---

# 7. Coordinate System

Establish a consistent SVG coordinate system before drawing the building.

The exact numeric dimensions are implementation details, but the following relationships must remain consistent:

```text
                    upper-left
                         /
                        /
                 building
                    ↑
                    │
                    │
                    │
viewer  ─────────────┘
lower-right foreground
```

The implementation should use a coherent isometric projection rather than independently guessing the perspective of each floor.

All floors should share:

* the same horizontal footprint;
* the same isometric axes;
* compatible wall angles;
* compatible floor depth;
* compatible floor height.

Do not distort individual floors independently merely to fit the page.

---

# 8. Overall Building Structure

The building consists of:

```text
                 ┌───────────────────────────────┐
                 │       FLOOR 5 — CURRENT      │
                 │   unfinished / construction   │
                 ├───────────────────────────────┤
                 │          FLOOR 4              │
                 │            Pacer              │
                 ├───────────────────────────────┤
                 │          FLOOR 3              │
                 │      Interactica | Indelve    │
                 ├───────────────────────────────┤
                 │          FLOOR 2              │
                 │          Interactica          │
                 ├───────────────────────────────┤
                 │          FLOOR 1              │
                 │ Nextcode | Elevator | Health  │
                 ├───────────────────────────────┤
                 │        GROUND FLOOR           │
                 │ Puelo → BA → Freelancer       │
                 └───────────────────────────────┘
```

This diagram is conceptual.

The actual SVG must represent the structure in isometric perspective.

---

# 9. Ground Floor

The ground floor represents the beginning of the professional timeline.

It must contain three sequential career areas:

```text
Entrance
   ↓
Puelo Games
   ↓
BA Technology
   ↓
Freelancer Game Developer
   ↓
Staircase
```

The three areas should be spatially distinguishable.

At this stage, they may be represented simply as:

* rectangular floor zones;
* simple partition lines;
* minimal labels if necessary for validation.

Do not add career-specific objects yet.

The purpose is only to confirm that the three stages can coexist sequentially within the ground-floor footprint.

---

# 10. Entrance

The entrance is located outside the main building footprint.

It should establish a visual transition:

```text
viewer
  ↓
path
  ↓
entrance
  ↓
ground floor
```

The entrance should be represented using minimal geometry:

* doorway/opening;
* small entrance platform or threshold if useful;
* path leading toward it.

Do not create a detailed architectural doorway.

---

# 11. Exterior Path

A simple path must connect the viewer/foreground area to the entrance.

At this stage the path may be represented by:

* two lines;
* a simple polygon;
* a flat geometric shape.

The path should be visually subordinate to the building.

Its purpose is compositional:

> it establishes how the viewer enters the career timeline.

Do not add paving details, plants, lighting, or environmental decoration.

---

# 12. Entrance Sign

An exterior sign should exist near the entrance.

At Stage 1, it is only a **structural placeholder**.

Represent it with simple geometry such as:

* sign board;
* support/post;
* circular placeholder for profile image;
* rectangular placeholder for QR code;
* text placeholders or minimal labels.

The sign must not contain professional titles such as:

* Software Architect;
* Technical Lead.

The final identity/content treatment belongs to later stages.

The sign should simply establish its position and approximate scale.

---

# 13. First Floor

The first floor begins with the staircase from the ground floor.

The staircase should arrive directly at the Nextcode area.

The floor layout is:

```text
┌──────────────────────────────────────────┐
│              FIRST FLOOR                 │
│                                          │
│   Nextcode   │   Elevator   │  Health    │
│              │              │ Platforms  │
│              │              │            │
└──────────────────────────────────────────┘
```

The elevator must be visually centered between:

* Nextcode;
* Health Platforms.

The exact amount of floor space assigned to each area may be adjusted during visual iteration.

The key requirement is the relationship:

```text
Nextcode ← Elevator → Health Platforms
```

The staircase must connect the ground floor to the Nextcode side of the first floor.

---

# 14. Elevator

The elevator is one of the most important structural alignment elements in the building.

At Stage 1, represent it as a simple vertical shaft.

Requirements:

* centered between Nextcode and Health Platforms on Floor 1;
* continues vertically through the upper floors;
* maintains consistent horizontal alignment;
* visibly stops at each floor;
* reaches the upper/current floor structure.

The elevator does not need:

* doors with detail;
* control panels;
* cables;
* mechanical components;
* lighting;
* decorative treatment.

At this stage it is primarily a geometric alignment reference.

---

# 15. Second Floor

The entire second floor represents Interactica.

The floor should be represented as a predominantly open-plan area.

At Stage 1:

* no detailed offices;
* no desks;
* no project objects;
* no architectural decoration.

The important characteristic is:

> the second floor should read as one large continuous Interactica space.

The elevator continues through this floor.

---

# 16. Third Floor

The third floor contains two distinct career sections:

```text
┌──────────────────────────────────────────┐
│              THIRD FLOOR                 │
│                                          │
│            Interactica      │  Indelve  │
│                             │           │
│                             │           │
└──────────────────────────────────────────┘
```

The Interactica section is the larger area.

The Indelve section is smaller and visually distinct.

The exact boundary may be adjusted during composition.

Do not add any invented Indelve content.

At this stage, the distinction can be represented only through:

* partition geometry;
* floor-zone boundaries;
* temporary labels.

---

# 17. Fourth Floor

The entire fourth floor represents Pacer.

It should be visually distinct as one career stage.

No Pacer-specific responsibilities, technologies, objects, or achievements should be invented.

At Stage 1 it may simply be represented by:

* one floor volume;
* one spatial zone;
* an optional temporary "Pacer" label.

The elevator alignment must continue through this level.

---

# 18. Fifth Floor — Current Work

The fifth floor represents the user's current AI-driven software-development work.

This floor is intentionally different from the completed historical floors.

It should be represented as:

* open;
* unfinished;
* under construction;
* structurally incomplete.

Possible wireframe elements include:

* exposed floor slab;
* incomplete walls;
* simple structural columns;
* unfinished vertical elements;
* partial framework.

However, Stage 1 should keep these elements extremely simple.

Do not yet illustrate:

* autonomous coding agents;
* AI interfaces;
* code;
* specific models;
* detailed computers;
* futuristic technology.

The unfinished architectural state itself is the visual metaphor.

The floor should clearly read as:

> work in progress / current stage.

---

# 19. Floor-to-Floor Continuity

All floors must align vertically.

The following must remain consistent:

* overall building footprint;
* primary corners;
* elevator position;
* floor height;
* isometric axes;
* major structural edges.

The building should feel like one architectural object constructed over time.

It must not look like six unrelated boxes stacked on top of each other.

---

# 20. Staircase

At minimum, the wireframe must establish the vertical circulation system.

The staircase must connect:

```text
Ground → Floor 1
```

The exact treatment of later upper-floor circulation can remain visually minimal.

The most important requirement is that the staircase arrives directly at Nextcode on Floor 1.

If additional staircase geometry is necessary to make the upper-floor circulation believable, it may be included as simplified geometry, but it must not dominate the composition.

Detailed stairs belong to later stages.

---

# 21. Walls and Cutaway Logic

The building should be represented as a sectional/cutaway structure.

For Stage 1:

* major structural walls may be represented;
* floor slabs should be visible;
* interior spaces should remain exposed;
* front/right enclosure should not obscure the interior.

The viewer must be able to understand the building's internal organization without imagining that the building is fully enclosed.

Do not attempt to reproduce the final "opened wall" illustration technique yet.

That belongs to the geometry and architectural-structure stages.

---

# 22. Terrain / Ground Plane

Add a minimal ground plane beneath the building.

Its purpose is only to:

* anchor the building;
* establish scale;
* provide visual separation from the empty SVG canvas;
* support the entrance path and sign.

The ground plane may be a simple isometric polygon.

Do not add landscaping or environmental details.

---

# 23. Viewer Position

The composition should include enough visual context to establish the intended viewer position.

The viewer does not need to be a detailed character.

At Stage 1, a simple placeholder is acceptable, for example:

* small circle;
* simple silhouette;
* minimal geometric marker.

The purpose is to validate that:

* the building faces the viewer correctly;
* the entrance is readable;
* the composition has an intentional foreground.

A detailed person belongs to a later stage.

---

# 24. Labels

Labels are permitted in Stage 1 only when they help validate composition.

Recommended temporary labels:

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

They may be rendered as simple SVG text.

However, labels must remain visually secondary to the geometry.

Do not attempt final typography.

Do not add:

* descriptions;
* technology lists;
* project descriptions;
* dates;
* skill tags;
* long paragraphs.

Those belong to the information layer in later stages.

---

# 25. Temporary vs Final SVG Text

Stage 1 labels are considered **development aids**.

They exist to make spatial validation easier.

They do not define the final information architecture.

If the final implementation later moves these labels to HTML/Vue overlays, that is acceptable.

Do not design the Stage 1 SVG around large amounts of text.

---

# 26. Visual Style

The visual style at this stage should be intentionally neutral.

Allowed:

* thin or medium outlines;
* simple monochrome or near-monochrome geometry;
* subtle differences between floor planes;
* basic line hierarchy.

Avoid:

* hand-drawn texture;
* cross-hatching;
* detailed shadows;
* material textures;
* realistic lighting;
* decorative objects;
* complex colors;
* gradients;
* polished illustration effects.

The Stage 1 SVG should resemble:

> an architectural wireframe / blocking model.

Not:

> a finished illustration.

---

# 27. Color

Color should be minimal.

A neutral palette is preferred.

For example:

* background;
* ground;
* structural outline;
* floor planes;
* temporary labels.

Exact colors are not important.

The color system should be easy to replace later.

Do not spend significant effort defining the final palette.

---

# 28. Geometry Strategy

Use reusable geometry wherever possible.

The implementation should establish a conceptual floor module.

For example:

```text
FLOOR MODULE

top plane
──────────────
│            │
│   interior │
│            │
──────────────
lower slab
```

The same geometric logic should be reused for multiple floors.

Individual floors may then override:

* height;
* partition positions;
* open/unfinished areas;
* staircase openings;
* elevator opening.

Avoid manually constructing each floor from unrelated coordinates.

---

# 29. Floor Footprint

The exact footprint is intentionally not predetermined.

It should be chosen based on visual composition.

However, it must satisfy:

* enough width for required career sections;
* enough depth to read clearly in isometric view;
* enough vertical space for six levels;
* sufficient foreground space for entrance/path/sign;
* sufficient surrounding space to avoid crowding.

Do not optimize the composition for mobile screens yet.

Desktop composition is the primary target.

---

# 30. SVG ViewBox and Canvas

The SVG must use a deliberate `viewBox`.

Do not rely on arbitrary pixel dimensions alone.

The viewBox should provide:

* sufficient space around the building;
* visible foreground;
* visible upper area;
* room for the entrance/sign;
* room for the complete fifth floor.

The building should not touch the edges of the SVG canvas.

Some breathing room is required for visual evaluation.

---

# 31. Layer / Group Structure

The SVG should use meaningful groups.

A recommended structure is:

```xml
<svg>
  <g id="terrain">
    ...
  </g>

  <g id="path">
    ...
  </g>

  <g id="entrance">
    ...
  </g>

  <g id="career-sign">
    ...
  </g>

  <g id="building">

    <g id="floor-ground">
      ...
    </g>

    <g id="floor-01">
      ...
    </g>

    <g id="floor-02">
      ...
    </g>

    <g id="floor-03">
      ...
    </g>

    <g id="floor-04">
      ...
    </g>

    <g id="floor-05">
      ...
    </g>

    <g id="staircase">
      ...
    </g>

    <g id="elevator">
      ...
    </g>

  </g>

  <g id="viewer">
    ...
  </g>

  <g id="labels">
    ...
  </g>
</svg>
```

The exact hierarchy may differ if the implementation has a better organization.

The important requirement is semantic organization.

---

# 32. IDs and Naming

Use stable, meaningful IDs.

Examples:

```text
building
terrain
path
entrance
career-sign
viewer

floor-ground
floor-01
floor-02
floor-03
floor-04
floor-05

elevator
staircase-ground-to-first

zone-puelo
zone-ba-technology
zone-freelancer

zone-nextcode
zone-health-platforms

zone-interactica-floor-02
zone-interactica-floor-03
zone-indelve
zone-pacer
zone-current
```

Avoid generated IDs whenever practical.

Do not optimize the SVG in a way that destroys these IDs.

---

# 33. Career Information Representation

Stage 1 should represent only the **existence and location** of career stages.

The following information is sufficient:

| Area                      | Stage 1 representation  |
| ------------------------- | ----------------------- |
| Puelo Games               | floor zone + label      |
| BA Technology             | floor zone + label      |
| Freelancer Game Developer | floor zone + label      |
| Nextcode                  | floor zone + label      |
| Health Platforms          | floor zone + label      |
| Interactica               | floor zone + label      |
| Indelve                   | floor zone + label only |
| Pacer                     | floor zone + label only |
| Current AI work           | unfinished fifth floor  |

Do not encode detailed career information yet.

---

# 34. Current Professional Identity

Stage 1 does not need to display the final professional identity.

In particular, do not place:

* Software Architect;
* Technical Lead;

on the entrance sign.

If a temporary current-stage label is useful, use a generic label such as:

```text
CURRENT
```

The final professional identity belongs to a later information-design stage.

---

# 35. Information Density

The complete Stage 1 SVG should remain visually sparse.

A viewer should be able to understand the major structure within a few seconds.

If the implementation starts requiring:

* paragraphs;
* cards;
* icons;
* technology lists;
* project names;
* dates;

the stage has exceeded its intended scope.

---

# 36. Responsive Behavior

Do not implement final responsive behavior.

The Stage 1 target is desktop visualization.

The SVG itself should scale reasonably because it uses a viewBox, but no dedicated mobile composition is required.

Do not redesign the building for narrow screens.

---

# 37. Vue Integration

Stage 1 may integrate the SVG into the existing Vue application using the simplest practical mechanism.

The preferred goal is:

```text
Vue application
      ↓
renders Stage 1 SVG
```

Do not build a sophisticated SVG component system.

Do not implement:

* floor interaction;
* hover states;
* dynamic information panels;
* query-parameter modes;
* animations.

The SVG is the primary deliverable.

---

# 38. Visual Review Requirement

This stage cannot be considered complete merely because the SVG is syntactically valid.

The SVG must be rendered and visually inspected.

At minimum, review:

* development-server rendering;
* production build rendering if practical;
* the standalone SVG if it is convenient to open separately.

The visual review should focus on composition rather than aesthetics.

---

# 39. Review Questions

Before accepting Stage 1, answer:

### Composition

* Is the entire building visible at once?
* Does the building have a clear isometric orientation?
* Is the lower-right foreground clearly established?
* Does the building recede toward the upper-left?
* Is there enough breathing room around it?

### Architecture

* Do all floors align?
* Does the structure read as one building?
* Are the cutaway/open sides understandable?
* Are floor slabs distinguishable?

### Circulation

* Does the entrance lead naturally into the building?
* Does the staircase connect the ground floor to Floor 1?
* Does the staircase arrive at Nextcode?
* Is the elevator centered between Nextcode and Health Platforms?
* Does the elevator remain vertically aligned?

### Career structure

* Are all historical stages represented?
* Are the three ground-floor stages distinguishable?
* Is Floor 2 clearly Interactica?
* Is Floor 3 clearly divided between Interactica and Indelve?
* Is Floor 4 clearly Pacer?
* Is Floor 5 clearly current/unfinished?

### Visual metaphor

* Does the building feel like a career timeline growing upward?
* Does the unfinished fifth floor communicate "current / in progress"?
* Is the entrance clearly the beginning of the journey?

If any answer is "no", revise Stage 1 rather than proceeding to Stage 2.

---

# 40. Iteration Rule

Stage 1 may be repeated as many times as necessary.

Examples:

```text
Stage 1
  ↓
render
  ↓
review
  ↓
composition problem
  ↓
Stage 1 revision
  ↓
render again
```

Do not move to Stage 2 simply because the SVG exists.

Stage 2 should begin only when the overall composition is considered structurally sound.

---

# 41. What Stage 1 Must Not Solve

Do not use Stage 1 to solve:

* final architectural proportions;
* final wall construction;
* detailed isometric geometry;
* realistic stairs;
* detailed elevator mechanics;
* final materials;
* final colors;
* architectural textures;
* hand-drawn style;
* shadows and lighting;
* career-specific props;
* detailed information layout;
* final typography;
* responsive layout;
* animations;
* accessibility;
* deployment.

Those concerns belong to later stages.

---

# 42. Deliverables

At the end of Stage 1, the project should contain:

## Primary deliverable

One complete editable SVG representing the entire career diorama.

## Application integration

The Vue application should render the SVG.

## Structural organization

The SVG should contain meaningful groups for:

* terrain;
* path;
* entrance;
* sign;
* building;
* floors;
* elevator;
* staircase;
* career zones;
* viewer;
* labels.

## Visual validation

A rendered version must have been inspected.

Temporary screenshots may be created for review but should not automatically become committed project assets.

---

# 43. Definition of Done

Stage 1 is complete when all of the following are true:

* [ ] The repository remains clean and builds successfully.
* [ ] The complete diorama exists as one editable SVG.
* [ ] All six levels are visually represented.
* [ ] Ground floor contains Puelo Games, BA Technology, and Freelancer Game Developer zones.
* [ ] Floor 1 contains Nextcode, the centered elevator, and Health Platforms.
* [ ] Floor 2 is represented as Interactica.
* [ ] Floor 3 contains Interactica and a distinct Indelve section.
* [ ] Floor 4 is represented as Pacer.
* [ ] Floor 5 is visibly unfinished/current.
* [ ] The entrance is connected to the building by a path.
* [ ] The exterior sign placeholder exists.
* [ ] The staircase connects the ground floor to Floor 1 and arrives at Nextcode.
* [ ] The elevator remains vertically aligned through the building.
* [ ] The building uses a coherent isometric orientation.
* [ ] The building reads as one sectional/cutaway structure.
* [ ] Meaningful SVG group IDs are used.
* [ ] No invented Indelve or Pacer career information has been added.
* [ ] No final visual styling has been prematurely introduced.
* [ ] The SVG has been rendered and visually reviewed.
* [ ] Any identified composition problems have been resolved or explicitly documented.
* [ ] The result is considered stable enough to serve as the geometric foundation for Stage 2.

---

# 44. Transition to Stage 2

Do not begin Stage 2 automatically.

Once Stage 1 is accepted, the next stage is:

> **Stage 2 — Geometry and Structural Refinement**

Stage 2 should refine the geometry established here without changing the fundamental career composition.

Its purpose will be to transform the basic blocking model into a more convincing architectural cutaway structure while preserving the validated composition.

The key principle remains:

> **Do not add detail to compensate for incorrect geometry.**
