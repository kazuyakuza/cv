# Stage 5.6 — Floor-by-Floor Architectural Refinement

## Purpose

Refine the current Stage 5.5 diorama by introducing **specific architectural interventions on individual floors and sections**, bringing the building visually closer to the project's primary StockCake reference.

Stage 5.5 already introduced career-related objects, people, equipment, screens, furniture and infrastructure. Do not use this stage to simply add more generic objects.

The goal is to make the **architecture itself** richer and more visually intentional.

The primary reference should be treated as a visual vocabulary rather than a list of objects to reproduce.

Reference characteristics to borrow include:

* stronger architectural outlines;
* partial exterior walls;
* visible slab thickness;
* wall-mounted fixtures;
* pipes and conduits;
* small lights;
* panels and switches;
* structural brackets;
* wall marks and scratches;
* mechanical connections;
* small color accents;
* varied floor/slab construction;
* an industrial, used, slightly dystopian atmosphere.

---

## Status — COMPLETE (2026-10-09)

Worked floor-by-floor, bottom-to-top, one user-reviewed render per pass.

**Done (user-approved):**
- **§2 Ground floor** — Puelo front + left partial walls (panel/switch/vent fixtures),
  BA stub partition, ground slab seams. Approved `generated/dev/r168.png`.
- **§3 First floor** — Health Platforms vent, Nextcode panel, C-D wall wear,
  left-edge wall section. Approved `r171.png`.
- **§4 Second floor** — Left Interactica lamp + marks + seam; Right Interactica
  rear-left wall + vent and front-right corner wall. Approved `r181.png`.
- **§5 Third floor** — Indelve wall marks (generic only) above the Trantorian
  logo; Interactica partial wall on the building's left edge (u = 0, v 75..161,
  full story, ragged ends, no caps); slab front-edge refinement
  `slabDetail(3*FH, { seams:[72], brackets:[40,150] })`. Approved `r188.png`.
- **§6 Fourth floor (Pacer)** — left C-D wall wear + lamp, right B-D wall vent,
  `slabDetail(4*FH, { seams:[64], brackets:[120] })`, elevator story-4
  maintenance panel + conduit. Approved `r189.png`.
- **§7 Fifth floor** — generated safety-railing sprite along the open left edge
  (`rail-01.png`; hand-drawn railing rejected and replaced), B-D-stub junction
  box + `segRun` conduit, `slabDetail(5*FH, { seams:[40,96,170,214],
  brackets:[56,140] })`, elevator story-5 minimal variant. Approved `r192.png`
  (railing repositioned after user edits to the sprite + removal of the chalk
  layout/rebar marks; final `r194.png`).
- **§8 Elevator variations** — per-story detail sets (1 riser, 2 indicator+seam,
  3 +warning, 4 panel+conduit, 5 indicator-only). Approved with M1/M3.
- **§9 Slabs** — `slabDetail` on every floor with controlled variation
  (ground finished, first edge+supports, second joints only, third joints+
  brackets, fourth joint+bracket, fifth most exposed). Approved with M1–M3.
- **§10–§15 global pass** — floor-2/3/5 wall wear (correct story heights),
  floor-3 B-D vent + conduit, and the §13 tier-1 line-weight bump. `r198.png`.

**Removed / rejected:** the floor-3 front-left corner "L" wall (r181); the
r185/r186 hand-drawn **and** sprite wall fixtures on the occluded C-D right
stretch, B-D right wall and elevator face; the hand-drawn SVG safety railing
(replaced by a generated sprite); the floor-5 chalk layout + rebar stakes
(removed on review); the floor-1/2 C-D wall wear that was mis-layered at ground
level (moved into `floor-ground`, beneath the Freelancer wall papers and the
staircase).

**Hard-won constraints:**
- The floor above occludes a wall face above **`h = (n+1)·FH − 0.495 · c`**,
  where `c` is the in-plane coordinate increasing away from the camera-front
  (u on the C-D far wall, v on the B-D right wall). Fixtures/wear only go on the
  visible wedge (e.g. floor-3 B-D is clear only past the taped app boards at
  v 5–103).
- Wall-mounted fixtures **must** use the generated sprite sheets via
  `wallFixture('fixture-*.png', plane, at, a0, hTop, w, h)` — **not** the
  hand-drawn `wallLight` / `ventGrille` / `boxOn*Wall` primitives; the user
  rejected the hand-drawn look. The shaft face takes only the built-in
  collar/indicator/seam/conduit vocabulary.
- `partialWall(...)` accepts **`cap: false`** to omit the top cap. The unused
  primitives (`ventGrille`, `wallLight`, `switchPlate`, `boxOnVWall`) are kept
  with `eslint-disable` directives; `segRun` and `boxOnUWall` are now used.

**Acceptance (§18):** all checklist items met — partial-wall fragments at
ground/first/second/third, wall-mounted sprite fixtures, localized wall wear,
per-floor slab construction, elevator story variants, fifth-floor construction
accents (generated railing), a stronger tier-1 contour hierarchy, the building
still clearly sectional/open, the entrance sign unchanged, and all Stage 5.5
career content intact. Documented in `src/svg/README.md` (Stage 5.6 section).

**Render/check pipeline:** `npm run svg:generate` → `npm run svg:assemble` →
`python generated\dev\make_chk.py` → headless msedge screenshot to
`generated/dev/rNN.png` (3000×2625) → PIL crops; then `npm run lint`,
`npm run type-check`, `npm run build`. `generated/` is gitignored.


---

# 1. Important Architectural Change: Selective Wall Segments

The current building intentionally removes most of the front and right-side walls to create the sectional/cutaway view.

**Do not close those walls again.**

However, the completely open geometry currently prevents some of the visual language of the reference from being reproduced.

Introduce **small, intentional wall fragments** in selected areas.

These are not full exterior walls.

They should behave as partial architectural surfaces that:

* frame a space;
* provide a surface for a light, panel, pipe or other fixture;
* create visual depth;
* partially conceal an otherwise empty area;
* make the cutaway feel like a real sectional building rather than a building with entire sides deleted.

A partial wall may occupy:

* a corner;
* the area between a structural line and a doorway;
* part of one side of a room;
* a short segment extending from an existing wall;
* a low or partial structural partition.

Do not add these systematically to every floor.

They should be strategically distributed.

---

# 2. Ground Floor — Puelo Games / B.A. Technology / Freelancer

The ground floor should receive some of the strongest examples of selective wall treatment because several areas currently have large open surfaces.

### Puelo Games corner

In the corner of the Puelo Games section facing the viewer:

* introduce a partial wall segment rather than leaving the entire corner completely open;
* extend the wall from the existing architectural line toward the entrance/door area;
* create a corresponding short wall segment on the adjacent side if necessary;
* leave the actual passage/entrance readable;
* use the new wall surface as an opportunity for one or two architectural details.

The wall should frame the area rather than enclosing it.

Do not create a complete room.

### B.A. Technology

Review the B.A. Technology section for a similar opportunity.

If an otherwise empty wall/corner can benefit from it, introduce a short wall fragment that:

* gives the space a stronger architectural boundary;
* creates a surface for a small fixture or technical element;
* maintains visibility into the section.

Avoid duplicating the exact Puelo Games treatment.

### Freelancer

Do not significantly close the Freelancer area because the staircase and open sectional relationship are important here.

Instead, use the existing walls and staircase area for:

* one small wall-mounted element;
* subtle surface marks;
* one technical/utility detail;
* stronger structural edge treatment.

---

# 3. First Floor — NextCode / HealthPlatforms

The first floor should receive a more technical architectural treatment.

### HealthPlatforms side

Add one or two small wall-mounted technical elements, such as:

* a compact panel;
* ventilation outlet;
* electrical box;
* small wall light;
* cable/conduit entry.

Place them on actual architectural surfaces rather than floating in the open space.

### NextCode side

Introduce:

* one small wall-mounted fixture;
* subtle wall marks or panel seams;
* one structural connection around the floor/slab edge.

Do not overload the room with additional furniture.

### Floor slab

Make the first-floor slab visibly constructed:

* strengthen its front edge;
* show a clearer underside;
* introduce one or two structural seams;
* optionally add a small support/bracket beneath part of the slab.

---

# 4. Second Floor — Interatica

The second floor currently has substantial career-related content.

Do not add a large amount of additional furniture.

Instead, focus on the architectural shell.

### Left Interatica section

Add:

* subtle wall scratches/marks;
* one small wall-mounted technical element;
* one localized light fixture;
* a visible panel/joint on an architectural surface.

The marks should be irregular and sparse.

### Right Interatica section

Add:

* one small technical fixture;
* one structural connection near the slab;
* one short conduit/cable run connected to an actual object or wall.

### Elevator area

The elevator core should become more visually integrated with the building.

On the second floor:

* add a small wall-mounted light or indicator near the elevator;
* add a subtle panel/technical marking;
* strengthen the elevator/slab intersection.

Do not redesign the elevator.

---

# 5. Third Floor — Interatica / Indelve

This floor should receive a stronger architectural treatment because it currently provides a large amount of open wall and floor area.

### Interatica section

Add:

* one wall-mounted light;
* subtle scratches/marks on one wall;
* one small technical panel;
* one short conduit;
* a stronger slab edge.

The light should be placed on a wall surface and oriented so that it reads as a real architectural fixture.

### Indelve section

Because no unsupported professional responsibilities should be invented, use only generic architectural/environmental elements.

Add:

* one wall-mounted fixture;
* one small panel or vent;
* subtle wall wear;
* one structural detail around the floor edge.

Do not add technology logos or objects implying specific Indelve responsibilities.

### Elevator wall

The elevator wall on this floor is a particularly useful surface.

Add:

* a small wall light facing outward from the elevator area;
* a compact indicator/panel;
* a subtle seam or maintenance access panel.

These should be visually integrated into the existing elevator structure.

---

# 6. Fourth Floor — Pacer

Do not add unsupported Pacer-specific objects.

Use this floor primarily to improve architectural character.

### Left and right Pacer areas

Introduce selected generic architectural details:

* one wall-mounted fixture;
* one small light;
* one vent or technical outlet;
* subtle scratches/marks;
* one structural connection.

Keep the two sides slightly different.

Do not mirror the exact same objects.

### Floor slab

Strengthen the fourth-floor slab visually:

* stronger edge;
* visible underside;
* one or two joints;
* one small structural support or connection.

---

# 7. Fifth Floor — Open / Under Construction

The fifth floor should receive the strongest "unfinished construction" treatment.

This floor is the best location for visible structural and mechanical elements.

Introduce:

* exposed structural framing;
* temporary-looking supports;
* visible slab edges;
* construction brackets;
* conduits;
* pipes;
* cable runs;
* unfinished wall/floor segments;
* exposed connections.

### Color accents

Use the reference as inspiration for introducing **red/orange structural or utility elements**.

For example:

* red/orange pipe;
* painted structural frame;
* temporary support;
* construction railing;
* exposed service component.

Do not turn the entire floor red/orange.

Use these colors as deliberate accents against the muted architectural palette.

### Floor surface

The fifth-floor surface should look less finished than lower floors.

Possible treatments:

* visible panel divisions;
* unfinished areas;
* exposed structure;
* construction markings;
* irregular material transitions.

This should clearly distinguish the fifth floor from completed career floors.

---

# 8. Elevator Core — Floor-Specific Details

Keep the existing elevator architecture.

Instead of redesigning it, introduce small variations at different levels.

For selected floors:

* small floor indicator;
* wall-mounted light;
* maintenance panel;
* conduit connection;
* small warning/technical marking.

Do not put the same decoration on every floor.

The elevator should become a recurring architectural element with small variations.

The fifth-floor elevator opening must remain compatible with the unfinished/open-air floor.

---

# 9. Floor Slabs — Specific Visual Treatment

Every floor should receive some slab refinement, but not necessarily the same treatment.

The current floors are too visually similar.

Introduce controlled variation such as:

### Ground floor

More finished / established construction.

### First floor

Clear slab edge and underside.

### Second floor

Subtle structural joints and technical detail.

### Third floor

Stronger visible edge and one support/connection.

### Fourth floor

More visible underside/infrastructure.

### Fifth floor

Most exposed/unfinished structural treatment.

Do not make the building look inconsistent.

The variation should communicate the different architectural conditions while preserving one building language.

---

# 10. Wall Marks and Surface Wear

Introduce localized wall wear rather than applying a global texture.

Recommended locations:

* one wall in the second-floor Interatica area;
* one wall in the third-floor Interatica area;
* one wall in the fourth-floor Pacer area;
* one wall near the elevator/service core;
* selected fifth-floor surfaces.

Use:

* scratches;
* faded marks;
* small cracks;
* panel seams;
* patched areas;
* minor discoloration.

Keep them subtle.

Do not apply identical textures repeatedly.

The reference's walls appear used and maintained, not destroyed.

---

# 11. Specific Reference-Inspired Fixtures

Introduce a limited number of small architectural fixtures inspired by the reference.

Examples:

* small red indicator light;
* wall lamp;
* ventilation outlet;
* electrical switch;
* technical panel;
* small screen;
* pipe valve;
* cable junction;
* wall-mounted box.

These should be placed on actual walls or structural surfaces.

Suggested distribution:

* one or two fixtures on the second floor;
* two or three on the third floor;
* one or two on the fourth floor;
* several construction/service elements on the fifth floor.

Do not add all fixture types to every floor.

---

# 12. External/Partial Walls as Detail Surfaces

When an area has no suitable wall for a reference-inspired detail, first consider whether a **small partial wall segment** would improve the architecture.

Examples:

* a short wall emerging from a corner;
* a wall segment ending before the open edge;
* a narrow vertical wall beside an entrance;
* a partial wall extending from an existing partition;
* a small structural enclosure around a technical element.

The partial wall should have a clear architectural reason.

It must not look like an arbitrary rectangle added solely to provide a surface for decoration.

---

# 13. Stronger Architectural Outlines

Increase line weight selectively.

Prioritize:

1. building silhouette;
2. slab edges;
3. partial exterior walls;
4. columns;
5. elevator structure;
6. major openings;
7. infrastructure;
8. small props.

The reference has much stronger contour definition than the current diagram.

The architectural outline should therefore become visibly more prominent.

Do not make all lines equally dark.

---

# 14. Infrastructure Distribution

The existing pipes on two floors are useful and should remain.

Extend the infrastructure language carefully.

At least a few new elements should:

* enter a wall;
* turn around a corner;
* cross a slab edge;
* connect to another component;
* terminate at a panel;
* run vertically between floors.

The important point is **connection**.

Avoid isolated decorative pipes.

---

# 15. Architectural Density Must Vary by Floor

Do not distribute the same number of details uniformly.

Use a deliberate density hierarchy:

* Ground: moderate;
* First: moderate;
* Second: moderate/high;
* Third: high;
* Fourth: moderate/high;
* Fifth: highest architectural/construction density.

This creates visual rhythm.

The fifth floor should feel unfinished and mechanically exposed.

Lower floors should feel more established.

---

# 16. Do Not Modify the Entrance Sign

The existing entrance sign is temporary.

**Leave it unchanged.**

Do not redesign, replace, relocate or restyle it during Stage 5.6.

A future stage will replace it with a projecting sign inspired by a separate visual reference supplied by the user.

---

# 17. Preserve the Current Career Content

Do not remove the visual content already introduced in Stage 5.5.

Do not invent:

* Indelve responsibilities;
* Pacer responsibilities;
* technologies;
* achievements;
* dates;
* unsupported professional information.

This stage is architectural refinement.

---

# 18. Acceptance Criteria

The result should demonstrate concrete changes at multiple specific locations, not merely a generalized increase in detail.

At minimum, verify:

* Ground/Puelo corner has been partially enclosed in a visually useful way.
* Ground/B.A. Technology area has been evaluated for a similar selective wall treatment.
* Freelancer remains sufficiently open around the staircase.
* First-floor sections contain selected wall-mounted architectural details.
* Second-floor Interatica sections contain localized wall wear and technical details.
* Third-floor Interatica/elevator area contains a visible wall-mounted fixture/light and additional architectural detail.
* Indelve receives only generic architectural treatment.
* Fourth-floor Pacer areas receive architectural detail without invented professional meaning.
* Fifth floor has the strongest unfinished/construction treatment.
* Fifth floor contains selected red/orange structural or utility accents inspired by the reference.
* Floor slabs have stronger construction/edge/underside definition.
* Selected walls contain subtle scratches, seams or marks.
* Some wall-mounted fixtures are present.
* Some infrastructure visibly connects to architecture.
* Line-weight hierarchy is noticeably stronger.
* At least some front/right-side openings now contain intentional partial wall segments.
* The building remains clearly sectional and open.
* The existing entrance sign remains unchanged.
* Existing career-specific content remains intact.
* The overall visual language is closer to the StockCake reference without directly copying it.

## Final Review

Compare the result against the reference and inspect each floor individually.

The review should ask:

**Ground:** Does the partial wall treatment make the open corner feel architectural rather than empty?

**First:** Are there enough small architectural details to avoid a generic open room?

**Second:** Do the wall marks, fixtures and slab treatment add character without clutter?

**Third:** Does the elevator area now have the kind of small technical details visible in the reference?

**Fourth:** Does Pacer have architectural character without inventing career information?

**Fifth:** Does the unfinished floor visibly communicate exposed construction and infrastructure?

**Whole building:** Does the combination of partial walls, stronger outlines, slab construction, fixtures, surface wear and infrastructure make the building feel like a constructed, modified industrial diorama rather than a stack of clean floors?

If any floor still looks like a generic empty architectural container, refine that specific floor before considering Stage 5.6 complete.
