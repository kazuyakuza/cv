# SVG Source

SVG is the primary visual source of the diorama. Files here are **editable
source artwork**, not generated output — they must stay hand-maintainable.

## Illustration style (Stage 4)

The visual language lives in two places, separate from the geometry:

- **`scripts/style.mjs`** — the `.dw-*` palette embedded in `diorama.svg`,
  organized as a three-tier line hierarchy (§5): primary (silhouette, slab
  edges, columns, near walls), secondary (partitions, elevator, stairs, doors,
  plaques), tertiary (terrain, path, guides). It also defines the cut-face
  poché hatch (`#dw-cut` pattern, one 45° line per 6 px tile, user-space so
  every cut face shares one hatch phase), the far-wall depth class
  (`.dw-wall-far`, lighter rear inner faces, §8), and the plaque contact
  shadows (`.dw-tag-group` drop-shadow, §17).
- **`scripts/generate-geometry.mjs`** — deterministic hand-drawn jitter
  (§6): every projected corner is perturbed ±0.55 px (`JITTER`) by a hash of
  its quantized position, so all faces sharing a corner are perturbed
  identically and no cracks open between faces. Regeneration is stable
  (identical output). Columns route through the same projection and gain a
  ≤0.55 px hand-drawn lean.
- **Assembled master** — one global `feTurbulence` + `feDisplacementMap`
  filter (`#dw-rough`, scale 1.4 → max ±0.7 px) wraps the whole drawing in
  user space, so re-layered faces move together. Text wobbles ≤0.7 px with
  it; exclude text if it reads blurry in review.
- **Page background** — the warm paper tone (§21) is set in
  `src/styles/base.css`; the SVG stays transparent.

Tuning knobs: `JITTER` (generate-geometry.mjs), filter `scale`/`baseFrequency`
and hatch tile (style.mjs).

## Stage 4.5 — illustration fixes

Corrective pass before Stage 5 (see `STAGE_04.5_ARCHITECTURAL_ILLUSTRATION_FIXES.md`):

- **Entrance 2013 sign cap (§3.1)** — the cap's `hFace` call had swapped
  u/v arguments, projecting a stray 1.5 px sliver near the first ground
  partition (the "BA Technology door artifact"). Arguments now follow the
  u-range/v-range order; the cap renders on the sign.
- **Floor surfaces (§3.2)** — slab tops use `dw-floor` (distinct warm base
  tone, no tiles); the re-layered shaft triangles use `dw-floor-fill` (same
  tone, no stroke). `dw-slab` now covers only thin wall/shaft top caps in a
  wall-family tone; the entrance threshold top shares `dw-floor` (walking
  surface, §4).
- **Floor-3 separation (§3.3)** — the Indelve section separation is rendered
  with the far-wall logic: fill-only `dw-wall-far-fill` (blends with the C-D
  wall face behind it; base unstroked) and `dw-far-line` outline edges. The
  one-off shaft-tone patch (`dw-shaft-fill`) is retired, along with
  `dw-slab-fill`.
- **User addendum** — the fifth-floor dashed intended-top perimeter is
  removed (`dw-open` class retired): the stub walls, exposed columns and
  open shaft already communicate the unfinished state. All plaques (company
  tags, elevator year plaques, the 2013 entrance sign) carry two
  screw/nail dots (`dw-dot`) flanking their text; plaques are widened so
  text + dots + clearance always fit (tag half = text half + 7.5, year
  plaques half-length 17.5).

## Stage 5 — materials, colors, shading and details

Material system (STAGE_05 §4–§7, `scripts/style.mjs` + per-floor patterns in
`svgDefs`):

- **Restrained warm/concrete palette** — near/exterior faces grey-blue
  concrete (`.dw-wall`), interior far faces warm off-white (`.dw-wall-far`),
  partitions lighter warm (`.dw-partition`), floors warm pale, shaft its own
  darker structure (`.dw-shaft`), stairs a three-tone warm concrete family.
  (The palette's single terracotta accent — the electrical panel — was
  removed on user review; the palette is now fully muted.)
- **Per-floor materials** (`dw-f0`…`dw-f5t` patterns, userSpaceOnUse so
  re-layered pieces stay in phase): small warm tiles (ground), large quiet
  concrete panels (floor 1), wood strip flooring with random butt joints
  (floors 2–3 share one material: one company), large diamond tiles pointing
  toward viewer/rear (Pacer, floor 4), bare construction screed with random
  marks (floor 5) plus two small laid-tile patches (`.dw-f5t`) at the D and B
  corners. Patterns follow the isometric axes (slope ±0.35, cell height =
  0.35·cell width) so lattices tile seamlessly.
- **Structural shading (§7)** —
  - ceiling washes: three stepped translucent bands (`dw-shade-a/b/c`) under
    each slab along the rear walls' tops; steps instead of a linear gradient
    because a screen-space gradient cannot follow the isometric slope while
    constant-h parallelograms hug it. Floor-3 re-draws the C-D wash clipped
    to the section the separation fill covers (`#dw-clip-sep3b`) so the
    Indelve story is shaded like every other. Fifth-floor stubs get none
    (open air, no roof). (An entrance header gradient shadow was tried and
    removed on user review — it read as a stain.)
  - ground-contact shadow: one blurred polygon (`#dw-soft`, stdDeviation 5)
    under the base footprint, offset (13, 6) toward the plaques' shadow
    direction; fragment `ground-shadow` between terrain and building.
- **Floor-3 junction line** — the clipped separation fill covers the slab's
  rear-edge stroke, so an explicit `dw-far-line` junction line is drawn on
  top (same weight as the slab edges).
- **Stair/elevator details (§9–§10)** — wall-mounted stair banister: one
  clean diagonal on the C-D wall following the flight, split into two
  elements for honest layering (user revision): the ground-floor element
  (lead-in at the floor's base level, diagonal to the floor-1 level) lives
  in `staircase`, BEFORE floor-01 — the floor-1 slab's cut faces (its base
  band and the stair opening's edge faces, all nearer to the viewer) occlude
  the diagonal where they cross it on screen, while the floor-01 wall never
  covers it (the wall starts at h = 105, where the rail tops out); the
  floor-1 element (diagonal on + landing return) is drawn in `floor-01`
  between its walls and columns, so column C — nearer to the viewer —
  occludes the rail's top return. The story number (`dw-floor-num`) painted
  on the wall above each elevator door head, skewed with the v-plane face
  (up along +u, like the entrance sign). Proportions and geometry untouched.
- **Sparse infrastructure (§8)** — fragment `architectural-details` is an
  empty placeholder: every candidate was removed on user review — the Pacer
  rising pipe (stray vertical line in the bare story), the Freelancer wall
  patch (floating square), the Nextcode electrical panel + two conduit drops
  and the Interactica ventilation grille (both read as clutter on the bare
  stories; §12's imperfect-surface note is carried by the jitter/displacement
  system instead). The fragment stays in the assembly chain in case a later
  stage adds details that survive a glance. No raster assets were needed (§13).

## Stage 5.5 — visual enrichment (in progress, iterative)

- **Iteration 1 — atmosphere & palette** — page backdrop is now a dark muted
  graphite with a soft radial spotlight falloff (`src/styles/base.css`; the SVG
  stays transparent so a future stars layer can sit between backdrop and
  diorama). Palette reworked in `style.mjs`: cool darker concrete exteriors
  (`.dw-wall`), warm greige interiors (`.dw-wall-far`/`.dw-partition`, no
  longer near-white), darker shaft/doors/openings, deepened poché cut faces,
  light paint for the elevator story numbers. Terrain is now a dark
  presentation base (`.dw-terrain` fill + rim-lit stroke) with a darker inner
  surface (`.dw-terrain-in`); the warm compacted path and the ground contact
  shadow (`#141618` @ 0.32, generator) were re-tuned for the dark base. The
  mustard infrastructure accent is still unused (arrives in iteration 3).
- **Iteration 2 — materials & depth** — sparse hashed vertical panel seams on
  the interior far walls (`.dw-wall-seam`, 3/story on B-D, 2/story on C-D,
  drawn under the ceiling washes); thin floor/wall contact-shadow bands
  (`.dw-contact`, 12 units deep along both rear-wall bases, split around the
  floor-01 stair opening); one horizontal groove per elevator door leaf
  (`.dw-door-line`); stronger section poché (`#dw-cut` base `#a99f8b`); the
  ceiling washes strengthened a step (0.15/0.08/0.04); columns read slightly
  heavier (1.8). The unfinished fifth floor keeps no seams/washes (open air).

- **Iteration 3 — vertical infrastructure (mustard accent)** — the empty
  `architectural-details` fragment now carries the building's service spine:
  ONE continuous mustard riser (`.dw-pipe`, 6 plan units ≈ 4.2 px) on the B-D
  wall at v = 120 crossing every completed story, horizontal branches on
  stories 0/2/4 (`.dw-pipe` quads hugging the wall, narrow crown sliver, dark
  junction collar at the T), support brackets, and a dark junction box
  (`.dw-jbox`) per story. The shaft's enclosure gains a dark steel conduit
  riser (`.dw-conduit`, proud of u = 0 so it visibly crosses the re-layered
  floor bands) with a junction box per story; floor-01 gains an electrical
  panel + conduit drop on the Health Platforms (data-ops) stretch; floor-03
  gains an Indelve service drop on the separation wall (generic technical
  prop, no invented career specifics); the riser re-emerges as a capped stub
  through the open-air fifth floor. Pipes are drawn after the floor groups —
  along their silhouette nothing occludes them, so the continuous read is
  correct occlusion.

- **Iteration 3 — vertical infrastructure (user-reviewed twice)** — first
  attempt (a flat-quad mustard "pipe spine") was removed on user review:
  flat bars floating in front of the building read nothing like pipes.
  Second attempt (hand-drawn SVG cylinder) was also superseded: **the pipe
  building block is now a nano-banana generated sprite**
  (`src/assets/pipe-01.png`, inlined as a base64 data URI by
  `inlineAsset()`/`assetPipe()` in the generator — the assembled master stays
  self-contained, so dev server, build and standalone file all render it).
  Vertical runs are placed per floor INSIDE the owning floor fragment so the
  floors above occlude the run where the sight line crosses their slabs — a
  deep wall pipe is mostly hidden by the story above's floor surface (the
  visible room volume is a wedge near the front edges), so pipes belong on
  the walls' near stretches, like the reference. One pipe is placed on the
  Interactica story (B-D wall near stretch, v=60). The dark-steel elements
  from the first pass: the elevator-enclosure conduit + junction boxes stay
  (user: acceptable); the Indelve drop was removed on user review (it
  floated unattached); the floor-1 electrical panel is still in place,
  pending review; the `architectural-details` group is an empty placeholder
  again.

## Stage 5.6 — floor-by-floor architectural refinement

A pass that enriches the **architecture itself** (not more generic objects),
developed floor-by-floor with a user-reviewed render each pass (see
`STAGE_05.6_Floor-by-Floor_Architectural_Refinement.md`). The goal is the
reference's vocabulary — partial walls, visible slab construction, wall
fixtures, surface wear, infrastructure and stronger outlines — applied at
specific locations.

**Vocabulary** (`scripts/generate-geometry.mjs`): `partialWall(plane,a0,a1,at,h0,h1,opts)`
(short wall fragments; `cap:false` omits the top cap, `scrap:[…]` gives ragged
cut ends, `outline` sets a thin/thick border), `wallFixture(file,plane,at,a0,hTop,w,h)`
(generated fixture **sprites** laid on a wall plane with the wall's skew),
`surfaceWear(plane,at,a0,a1,h0,h1,seed)` (sparse scratches + one seam + one
crack + one patch), `slabDetail(hTop,{seams,brackets})` (front-edge lip, joints,
underside brackets), `bracket`, `segRun` (connected conduit polylines) and
`indicatorLight`. The hand-drawn `ventGrille`/`wallLight`/`switchPlate`/
`boxOnVWall` primitives are kept but **unused** — the user rejected the
hand-drawn wall-fixture look; fixtures use the generated sprites
(`fixture-lamp/panel/switch/vent-01.png`; masters for alarm/exit/firstaid/
intercom/meter/thermostat/junction/valve also exist).

**Per floor:** ground — Puelo front/left partial walls + panel/switch/vent
sprites, a BA stub partition, slab seams; first — a vent + panel sprite, a
left-edge partial wall, slab edge + brackets; second — left-Interactica lamp +
panel joint, rear-left + front-right partial walls, slab joints; third —
Indelve wear (generic only) and an Interactica partial wall on the open left
edge, a B-D-wall vent + conduit and wear, slab joints + brackets; fourth —
left lamp + wear, right vent, slab joint + bracket; fifth — the strongest
construction treatment (see below).

**Generated safety railing (§7):** the hand-drawn railing was replaced by a
sprite. `generated/dev/make_wire_rail.py` draws an isometric wireframe in the
diorama's exact constant-u projection → nano-banana (Pro) renders it →
`key_cut_rail.py` keys it to `src/assets/rail-01.png` → placed as a billboard
(`RAIL` spec, anchored on the near post base) along the open left edge of the
fifth floor. The fifth floor also has a B-D-stub junction box + `segRun`
conduit (infrastructure → wall connection).

**Elevator (§8):** `elevatorStoryDetails(hBase, opts)` gives each story a
different detail set (1: service riser; 2: indicator + seam; 3: + red warning;
4: maintenance panel + conduit; 5: indicator only, compatible with the open
doors). No fixture sprites on the shaft face (user rejected those).

**Line-weight hierarchy (§13, `style.mjs`):** a further tier-1 bump — columns
2.25, slab edges 1.65, near walls 1.55, floors 1.5, slab caps 1.45, shaft 1.2,
openings 1.05, doors 1.1 — while tier-2/3 stay comparatively lighter.

**Hard-won constraints:** the floor above occludes a wall face above
`h = (n+1)·FH − 0.495·c` (`c` = u on C-D, v on B-D), so fixtures/wear only go
on the visible wedge (e.g. floor-3 B-D is clear only past the taped app boards
at v 5–103). The floor-1/floor-2 C-D wall wear is emitted at the top of
`floor-ground` (beneath the Freelancer wall papers and the staircase) — its
marks sit at ground level and must layer under them.

## Stage 6 — career content: exterior sign redesign

A restrained content pass (see `STAGE_06_CAREER_CONTENT.md`). The career scenes
were reviewed floor-by-floor and **left unchanged** — no specific, documented
omission was found, and the brief forbids inventing Indelve/Pacer/floor-5
content (Stage 7 adds the information layer; Stage 8 the display modes).

**Removed:** the old ground-standing entrance sign (`career-sign`: two posts +
a framed 160×110 placeholder board with a screen-space photo disc and two grey
text bars, cast on the terrain in the lower-right foreground). Its posts, board
and contact shadow are gone; the `career-sign` fragment is deleted.

**Added:** `projecting-sign` — a vertical blade sign mounted at the building's
front-right corner (corner B, where the absent front wall A‑B meets the right
wall B‑D) and projecting outward along the building's **depth axis, rear → front**
(toward the viewer / −v), i.e. parallel to an arrow from the C‑D rear wall to
the A‑B front wall. It mounts on the right wall's front end (v = 0) with a small
gap. The blade is a closed box (thickness 10 along `u`, u 227…237; depth 88 along
`v`, v −100…−12; spanning the floor‑2/floor‑3 stories); its broad faces are
constant‑`u`, and the visible `−u` face carries the casing frame, near-white
inset panel and the **same placeholder motif reflowed vertically** (photo disc
above two name bars) — wording/meaning preserved, no new copy. It bolts to the
wall through two `dw-jbox` arms bridging the gap, with wall plates and `dw-dot`
attachment points.

**Composition:** the now-terminal `path` (fragment hand-authored) was shortened
(~40%) so it no longer leads to the removed sign, and the assembled `viewBox`
was cropped from `0 0 1200 1050` to `200 95 900 955` (`VIEW_BOX` in
`assemble-svg.mjs`) to cut the empty side/foreground margins left behind —
re-centred on the building + blade. All content (building, blade sign, terrain,
fifth floor) stays; the terrain's far right/anterior is clipped at the frame
edge, which reads as ground reaching the border.

## Layout: fragments + assembled master (Stage 2)

The diorama is authored as **modular fragments** — one `<g>` per architectural
module — and assembled into a **single complete master SVG**:

```text
src/svg/
├── fragments/                  ← authoritative source (one root <g> each)
│   ├── terrain.svg, path.svg, entrance.svg, projecting-sign.svg (hand-edited;
│   │                                                            entrance/projecting-sign generated)
│   ├── floor-ground.svg, floor-01.svg … floor-05.svg          (generated)
│   ├── staircase.svg, elevator.svg, tags.svg                  (generated)
│   ├── information-ground.svg, information-01.svg … information-04.svg    (generated, Stage 7)
│   ├── information-02-front.svg, information-elev.svg, information.svg     (generated, Stage 7)
│   ├── nextcode-props.svg, floor-02-front-base.svg            (generated, Stage 7 occlusion)
│   ├── ground-shadow.svg, architectural-details.svg           (generated, Stage 5)
│   └── (labels.svg removed in Stage 3.5 — replaced by tags.svg)
└── diorama.svg                 ← assembled single-SVG deliverable (committed)
```

`npm run svg:generate` regenerates the architectural fragments from the
parameter block below (`scripts/generate-geometry.mjs`); `npm run
svg:assemble` then concatenates them into `diorama.svg`. The master stays fully
readable/editable, but **regenerate instead of hand-editing the generated
fragments** — `terrain.svg` and `path.svg` are hand-authored.

## Shared geometry parameter block

All generated fragments derive from these constants
(`scripts/generate-geometry.mjs`). Coordinates are meaningless without them.
Revision 15 (Stage 3.5, user revision): the passage jamb is cut by the head
line on screen — its back-top corner drops by the screen-slope compensation
(2 · 0.2475 · WALL_T), so the reveal's top edge lies exactly on the head line
and nothing pokes above it; the shaft's enclosure no longer breaks the floor
base lines: the elevator group re-layers each floor's left cut-face band
segment (across the shaft's depth) over the enclosure from floor 2 up, so
every level's base line reads as passing in front of the shaft like floor-01.
Revision 16 (Stage 3.5, user revision): the ground partitions abut the B-D
wall's inner face (their faces end at u = LW − WALL_T), so the right end line
starts at the junction with the building's right wall; the floor-03 section
separation wall (W1 continuation) is fill-only with explicit end/top edges —
its base line no longer reads on the Indelve floor; the entrance gained a
2013 year sign attached to the portal's door head, proud of the header's
front face, reading along +u like the entrance face.
Revision 15 (Stage 3.5, user revision): the ground-floor passage jambs are cut
by the head line on screen (their back-top corner drops by the screen-slope
compensation 2 · 0.2475 · WALL_T), so the reveal's top edge lies exactly on
the head line and nothing pokes above it; the per-level shaft bands
(shaftLevelBands) are removed and each completed floor's left cut face
(u = 0, full depth) is re-layered OVER the shaft enclosure for floors 2–5,
so every level's floor base line reads as one continuous band descending
past the shaft's corner — exactly the floor-01 look.
Revision 14 (Stage 3.5, user revision): ground-floor passages draw the
door-height far jamb OVER the front face and re-draw the head line on top —
the head line finishes on the jamb's front (right) line while the jamb's
back-top corner caps just above it; the shaft-crossing floors re-layer the
floor triangle at the shaft's front-right (between the left wall, the W2
doors side and the shaft's width line) in floor-0X-front OVER the elevator
as a fill-only piece (dw-slab-fill), so the W2 level band's lower sliver
never paints over the floor while the shaft's right side stays visible.
Revision 13 (Stage 3.5, user revision): the shaft-crossing floors' slab split
is gone — each renders as ONE complete slab in its floor-0X group, below the
elevator exactly like floor-01 (this removes the notch/slab-sliver artifacts
at the shaft's right edge on floors 2–5); the -front groups now carry only
the story columns (floor-05 also the stub walls and dashed perimeter);
ground-floor passage jambs are plain door-height reveals (per reference
image) — the head line finishes on the jamb, whose back-top corner caps just
above it; no soffit, no clipping.
Revision 12 (Stage 3.5, user revision): ground-floor passage jambs are
door-height with the top edge clipped to the head line's screen height — no
reveal line exceeds the door head; the Puelo Games ground section is reduced
20% (first partition moved to 0.28d, Puelo Games tag re-centered at v ≈ 82,
BA Technology at v ≈ 282); company tags gain the year plaques' thin depth
(face proud of the wall at u = −1.5, top cap + front-end side); the shaft-
crossing floors' front slab pieces notch their rear-right corner back to the
W2 wall's outer face (u > SHAFT_U + WALL_T keeps full depth), so the slab
never paints over the shaft wall's base on floors 2–5, matching floor-01.
Revision 11 (Stage 3.5, user revision): ground-floor passages get a
full-height far jamb with NO soffit (per reference image) — the right reveal
runs to the ceiling and the head line ends on it, so the opening's top-right
corner reads clean; the stair slab opening covers the flight's full footprint
(STAIR_HOLE_U1 = STAIR_U1), keeping the whole final flight visible with the
top step landing flush on the slab; front-row tags aligned at c = 135
(Health Platforms, Interactica ×2, Pacer) and left-side tags at c = 470
(Nextcode, Interactica, Indelve, Pacer); the fifth floor carries WIP markers
(both tag positions) instead of a company name.
Revision 10 (Stage 3.5, user revision): the stair slab opening extends all the
way to the C-D wall (STAIR_HOLE_V1 = STAIR_V1) and each story's back walls
extend up to the slab-above's top line (h + FH) — the rear wall reads
continuous behind the staircase with only the floor separation line crossing
it (walls extended, no patch geometry); ground-floor passages keep the
f1-identical lining (soffit + far jamb — without the soffit the jamb's
top-back corner pokes above the head line and breaks the opening's top-right
corner); whole-floor sections (Interactica on floor 2, Pacer on floor 4)
duplicate their tag on the floor's left side, all left-side tags aligned at
v ≈ 470 (the rear stretch's center, level with Nextcode and Indelve); the
fifth floor gains a D-corner wall section (rear + right wall arms, length
0.4w each, full story height) as part of the floor-05 rear group, rendering
below the elevator.
Revision 9 (Stage 3.5, user revision): passages keep a visible-depth lining —
far jamb in partition color (reads as passage surfaces, not a lintel
band); the stair slab opening stopped clear of the C-D wall (STAIR_HOLE_V1)
and stopped below the slab underside with no cut faces (STAIR_HOLE_U1), with a
wall band behind the opening so no hole showed through; shaft
narrowed again (u 0–0.171w); the shaft's open A-C side is enclosed from floor
1 to the top by ONE continuous face flush with the building's invisible left
wall (u = 0, no per-story cuts), with the year signs mounted on it as small
plaques (mid-story, centered on the wall); company tags are vertical signs on
the same invisible left wall (u = 0, flush, like part of it), one per section
over its own floor, at the floor's front level (band h −SLAB_T…−SLAB_T+16 —
base on the floor slab's bottom line), length fitted to the text
(chars × 5.2 + 12), styled like the year plaques; Freelancer Game Developer
on a single line.
Revision 8 (Stage 3.5): opening soffits removed so the wall above every
passage reads as a continuous surface (no lintel line); staircase inset from
the open side (STAIR_U0 22) and reduced (run 105, width 40, 12 steps) with a
continuous floor-01 left edge band around the stair opening; shaft narrowed
again (u 0–0.19w, v 0.46–0.585d) with compact double doors; fifth-story doors
stand open (panels parked at the jambs, dark opening) as the current-floor
exception; per-story start-year markers (2017 2019 2021 2025 2026) on the W2
face above the doors; experience tags introduced as thin plaques on the back
walls (B-D, C-D and the floor-3 separation wall) with wall-plane text; the
temporary `labels` group (incl. `CURRENT`) removed.

Tag placement constraints: the shaft's screen silhouette covers the B-D wall
beyond v ≈ 450 at every story, so B-D plaques stay at v ≤ 440 ("upper-left of
the visible section" = the left end of the unoccluded stretch); the Freelancer
tag uses its C-D wall stretch beside the staircase (the flight blocks the left
part of that stretch); Indelve mounts on the floor-3 separation wall face (the
Indelve strip has no B-D stretch); no tag on the fifth floor.
Revision 6 (Stage 3, user revision): floor slabs 02–05 split so the sections
BEHIND the shaft (mid strip + rear piece, `floor-0X`) render in layers BELOW
the elevator while the front plane (`floor-0X-front`) renders over it; the
floor-3 section separation is a continuation of the shaft's left wall (W1)
rearward to the C–D wall (Indelve = rear-left strip), replacing the old
full-width partition; the floor-1 return walls carry door-height passages
(u 75–130); the portal's right jamb renders in a layer below the entrance
block.
Revision 5 (Stage 3, user revision): elevator shaft 15% narrower (u 0–0.255w),
doorless for this iteration, walls rebuilt as WALL_T-thick volumes (W2/W3
extend over the W1 corner, cut ends visible at the open A-C side); floors
02–05 are split into a rear shell (`floor-0X`, drawn behind the shaft) and a
front plane (`floor-0X-front`, drawn over it) so the floor planes read as
layers passing over the elevator; staircase drawn under floor-01; path meets
the entrance block at its base level; portal jambs extend to the same base.
Earlier Revision 4: consistent corner-on isometric projection (3D yaw of the
plan about the vertical axis at the entrance, rear swung ~10° toward the image
center; verticals stay vertical), elevator doors moved to the interior-facing
W1 face, staircase relocated against the C–D rear wall, passages in the section
partitions, floor-1 return walls, entrance portal, single-post sign.

```text
viewBox        200 95 900 955   (model space is 1200×1050; Stage 6 crops the
                                empty side margins — see VIEW_BOX in assemble-svg.mjs)
isometric axes width (0.7071, -0.2475)   depth (-0.7071, -0.2475)   height (0, -1)
               (corner-on symmetric isometric; both plan axes drop equally,
                rear corner D recedes up-left at ~40° toward image center)
front corner A (750, 985)          (nearest viewer, lower-right)
width  LW = 238 → w = (168.3, -58.9)   short entrance face A–B
depth  LD = 588 → d = (-415.8, -145.5) long left side A–C
floor height FH = 105 (6 floor slabs, 5 stories)
slab thickness SLAB_T = 12.5 → clear story height STORY_H = 92.5
wall thickness WALL_T = 7.5 (back walls, partitions, shaft walls, return walls)
corner columns A, B, C per story (D hidden inside walls); all four exposed on
the fifth floor
cutaway faces: front A–B (short) and long left A–C — slab edge bands (SLAB_T
deep) run down both open sides, so floor divisions read from the left and front
back walls B–D (long) and C–D (short) are thin volumes: visible inner face
(-u / -v), cut end at the open side; each story's walls extend from its slab
top up to the slab-above's top line (h + FH) so no gap shows at the slab band;
tops are covered by the slab above
ground floor (right → left): Puelo Games (0–0.28d, entrance leads in),
BA Technology (0.28–0.68d), Freelancer + staircase (0.68–1.0d); partitions at
0.35d / 0.68d (WALL_T thick, full width, height STORY_H) with door-height
passages (u 15–70, height DOOR_H) near the open A–C side; each passage's far
jamb (u = 70) runs the full story height so the head line ends on it
floor-1: Health Platforms (0–0.46d), Nextcode (0.585–1.0d) — staircase arrives
here; return walls continue the shaft's W2 / W3 walls (v-bands
[SHAFT_V0−WALL_T, SHAFT_V0] and [SHAFT_V1, SHAFT_V1+WALL_T], u from SHAFT_U to
the B–D wall) so the floor reads as Nextcode | Elevator | Health Platforms;
each return wall has a door-height passage (u 75–130) near the open side;
passage reveals use the ground-floor construction (Revision 21, user
revision): far jamb dropped by the screen-slope compensation, one
`dw-opening` head line, no soffit — the old hFace soffit projected past the
jamb and read as a stray line floating between the shaft and the head
Revision 22 (Stage 5, user revision): the stray line on the Health Platforms
wall between the elevator doors and the passage was NOT the floor-2 slab
band (earlier attempts split and restored that band — it stays one
continuous cut face, full depth, like every floor) — it was the W3-side
(Nextcode) return wall's base edge painting over the nearer W2-side wall's
face: shaftReturnWalls drew the rear wall last, so its edge strokes showed
across the front wall's clean face. The rear wall is now drawn FIRST and
the front wall over it; through the passage opening the rear wall's base
still reads correctly as the far wall's base. The elevator's re-layered
bands are back to full depth (0–LD), matching the continuous per-floor
bands
floor-3: section separation = continuation of the shaft's left wall W1
(u [SHAFT_U, SHAFT_U+WALL_T]) rearward from v 0.60d+WALL_T to the C–D wall;
Indelve = the rear-left strip left of it (u < SHAFT_U, v > 0.60d), Interactica
the rest of the floor
elevator shaft plan: u 0–0.171w against the A-C edge, v 0.46–0.585d; walls are
WALL_T-thick volumes just outside the slab opening — W1 (u = 0.171w side),
W2 / W3 (v = SHAFT_V0 / SHAFT_V1 sides) extending over the W1 corner (u to
0.171w + WALL_T) so the shaft is structurally complete; the open A-C side is
closed by the enclosure face flush with the invisible left wall (u = 0, from
floor 1 to the top, continuous); a closed
double door (two dw-door panels, u 6.5 to 0.171w+WALL_T−6.5, height DOOR_H,
center split) is drawn on the W2 outer face
toward Health Platforms at every story except the fifth, where the doors stand
open (dark dw-door-open quad + panels parked at the jambs); a small year-sign
plaque (dw-tag + dw-year, wall-plane text) is mounted on the enclosure face at
each story (2017/2019/2021/2025/2026); the shaft rises per story
from floor 1 to the top; each crossing floor's slab is one complete plane in
floor-0X, rendering below the shaft like floor-01; the floor triangle at the
shaft's front-right re-renders over the shaft in floor-0X-front (fill only,
no seams); the story columns belong
to floor-0X-front and render over the shaft; each completed floor's left cut
face (u = 0, full depth) re-renders over the enclosure in the elevator group
for floors 2–5, so the base line stays continuous like floor-01
staircase: solid flight against the C–D rear wall (v 540.5–580.5), running along
the width axis, rising u 22 → 127 in 12 steps (rise 8.75, going 8.75), with a
clear gap to the open A-C side; floor-01 slab has a matching opening covering
the flight's full footprint (u 22–127, v to the C–D wall; no cut faces; the
left edge band is continuous), so the final flight stays visible and the top
step lands flush with the slab — the landing into Nextcode; drawn before
floor-01 so the slab edges frame the opening
entrance: threshold platform (u 0.35–0.65w, 37.5 deep, SLAB_T thick) abutting
the A–B face at ground level, plus a minimal portal frame — two jambs (10 wide,
7.5 deep, extending down to the block base at -SLAB_T) and a header (52.5–60)
on the threshold; the right jamb (higher u) renders in a layer below the
entrance block; the hand-authored path starts exactly at the block's base
edge (v = -37.5, h = -SLAB_T)
projecting-sign: vertical blade sign at the building's front-right corner
(corner B), projecting along the depth axis rear → front (−v, toward the
viewer). Mounted on the right wall's front end (v = 0) with a 12-unit gap; the
blade is thickness 10 along u (u 227…237), depth 88 along v (v −100…−12),
spanning the floor-2 and floor-3 stories (h FH+2…3·FH−2); broad faces are
constant-u (the −u face is visible), two wall-bolted arms at h0+20 / h1−20 with
attachment dots, a wood casing frame and near-white inset panel, and the
placeholder identity motif (photo disc + two name bars) reflowed vertically —
no real copy (Stage 7)
experience tags: vertical signs like the year plaques (thin depth: face proud
of the invisible left wall at u = −1.5, top cap + front-end side), one per
section over its own floor, at the floor's
front level (band h −SLAB_T…−SLAB_T+16 — base on the slab's bottom line),
length fitted to the text; text on the wall plane (matrix-skewed, reading
toward the front corner); Freelancer Game Developer on a single line;
front-row tags share c = 135, left-side tags share c = 470 (both rows align
vertically); whole-floor sections duplicate their sign on the floor's left
side (Interactica on floor 2, Pacer on floor 4); the fifth floor carries
WIP markers at both positions
```

### Layer order (Stage 3.5 revision)

Assembled in this order so occlusion obeys physical structure:
`terrain` → `ground-shadow` → `building` (floor-ground, staircase, floor-01,
floor-02…05 rear groups — sections behind the shaft, architectural-details,
elevator, floor-02…05-front planes, tags, information, indelve-fleets) →
`entrance` → `path` → `projecting-sign`.

## Group-ID naming

IDs describe architectural meaning, never generated names (`group42`, `rect891`):

| ID                          | Meaning                                    |
| --------------------------- | ------------------------------------------ |
| `terrain`                   | ground/base plane                          |
| `ground-shadow`             | soft building contact shadow (Stage 5)     |
| `projecting-sign`           | exterior identity sign, blade on the front-right corner (Stage 6) |
| `path`                      | path from foreground to entrance           |
| `entrance`                  | entrance threshold + portal frame          |
| `floor-ground`, `floor-01`… | stacked floor modules                      |
| `floor-02-front`…           | story column layers of shaft-crossing floors |
| `staircase`                 | stairs between stages (ground → floor 1)   |
| `elevator`                  | persistent vertical shaft, floor 1 up      |
| `architectural-details`     | sparse infrastructure + wall patch (Stage 5) |
| `tags`                      | career-stage signs on the left wall        |
| `information`               | roles/periods/technologies/descriptions + current identity (Stage 7) |

## Architecture vs information layer

Keep architectural geometry separate from professional information. The
`tags` group holds the primary company/section identifiers and the `information`
group (Stage 7) holds the secondary/supporting content — roles, periods,
selected technologies and short project notes. Both are generated from
`scripts/career-data.mjs` (a plain data module) into their own fragments, so
changing a role/date/technology is a data edit that touches no geometry. The
Stage 8 display-mode switch acts on this layer by class (see §Stage 8) rather
than hiding the whole `information` group. Final typography/HTML overlays and
the data-model binding belong to later stages (Stage 9 Vue integration).

## Stage 7 — information layer

The career is now readable as well as illustrated (see
`STAGE_07_INFORMATION_LAYER.md`). Content lives in `scripts/career-data.mjs`
(section roles + identity) and `scripts/tech-logos.mjs` (brand logo paths).
The generated `information` fragment holds two light devices, placed per
section (no résumé plaques):

- **Section role labels** — short text (`Unity Dev`, `Jr. Developer`,
  `Co-Founder`, `DBA`, `Dev`, `Tech Lead`, `Software Architect`) set over a
  section door (on the partition's near face), on the invisible left wall, or
  lying flat on the floor. Dark bold text with a light keyline halo
  (`.dw-role-*`, `paint-order: stroke`) so it stays legible over concrete, wood
  or the open background.
- **Technology logo plates** — monochrome brand marks on small near-white
  plates (`.dw-logo-plate`), lying flat on each section's floor (or on the left
  wall for the DBA / architect sections). Only verified brands with a logo are
  used; AWS DMS, "SQL", "angular micro-frontends" and "microservices" have no
  logo and are dropped.
  - floor plane matrix is **orientation-preserving**
    (`0.7071 -0.2475 0.7071 0.2475`) so text/logos are not mirrored; the BA
    logos use the in-plane 90° variant (`FLOOR_MATRIX_D`, via
    `floorLogoDepth()`) so they read along the depth axis.
  - the f2-right plates live in `information-02-front`, assembled between
    `floor-02-front-base` (the opaque floor repaint over the elevator) and
    `floor-02-front` (kiosk sprite + corner columns), so they render above the
    floor but below the kiosk and the floor-2/3 corner line.
- **Current identity** — `Software Architect` / `Technical Lead` + the
  AI-workflow focus line, on the fifth (current-work) floor's rear C-D wall via
  `cdWallSheet` (the wall itself is untouched). Never on the exterior sign.
- **Projecting sign** (`projecting-sign` fragment) — the Stage 6 placeholder
  bars are replaced by the real personal-identification content: a circular
  profile photo (`__ASSET__photo2_2.jpg__`, replaceable via `IDENTITY.photo`),
  the name, a LinkedIn QR with a centered LinkedIn mark, and the full LinkedIn
  URL. Stage 7 review widened the blade 25% (deeper along −v) and enlarged the
  content. The photo ring uses a dedicated `fill:none` class (`dw-photo-ring`) —
  a presentation `fill` attribute would be overridden by the CSS class and paint
  a disc over the photo. Casing/arms/perspective unchanged; no job titles,
  companies or technologies on the sign.
- **QR**: generated deterministically from `IDENTITY.linkedin` by
  `scripts/generate-geometry.mjs` via the `qrcode` dev-dependency (ECC level H
  so the center logo is recoverable; run-length-merged single path; 2-module
  quiet zone). The embedded module matrix was verified byte-for-byte against the
  encoder output for the URL during review (a disposable dev check lives in the
  gitignored `generated/dev/` workspace).

Pacer carries a `Software Architect` role label plus GitHub Actions / NestJS /
PostgreSQL / AWS / Docker / OpenTelemetry logo plates (user-supplied content,
Stage 7). Indelve intentionally carries no information content — its illustrated
scene is the content — and the per-experience "project descriptions" are the
scene sprites and visual references rather than textual plaques (user decisions,
2026-10-13). Stage 7 is **complete**. If the profile photo changes, update the
master in `src/assets/` and re-run `scripts/optimize-assets.py` (it scans
`career-data.mjs` for `photo: '…'` too), then `npm run svg:generate` +
`svg:assemble`.

## Stage 8 — detailed & overview display modes

The same diorama serves two presentation states selected by **one** query
parameter (`?mode=`). The contract lives in **`src/display-mode.ts`** (the
single source of truth; Stage 9 routing must import it):

- no parameter, `?mode=detailed`, or any unknown/empty value → **Detailed**
  (the default);
- `?mode=overview` → **Overview**; matching is case-insensitive.

`src/App.vue` resolves `window.location.search` with `resolveMode()` and swaps
the root SVG's mode class accordingly. The assembled file ships with
`class="dw-mode-detailed"` (set by `assemble-svg.mjs`), so the **standalone
`diorama.svg` always renders Detailed**. The mode rules are embedded in the
SVG's own `<style>` (`scripts/style.mjs`), so they travel with
regeneration/assembly:

- `.dw-mode-overview .dw-logo { display: none; }` — the technology-logo plates
  (`logoPlate()` now wraps each plate in a `.dw-logo` group, so the rect *and*
  the brand art hide together) are dropped; too numerous for a full-frame
  screenshot.
- `.dw-mode-overview #tags .dw-tag-group { transform-box: fill-box;
  transform-origin: center; transform: scale(1.8); }` — company-name signs are
  scaled **around their own visual centre** for full-composition legibility,
  with no duplicated elements. Every experience tag lives on the same invisible
  left wall (`u = -1.5`), so one screen-space scale fits them all. Scoping to
  `#tags` leaves the elevator year plaques and the 2013 entrance sign untouched.
  `experienceTags()` emits a stable `dw-tag-<slug>` class per sign for per-sign
  tweaks (currently unused — the Nextcode top-edge origin hack was reverted on
  user review).

Per user decision (2026-10-13) Overview keeps **all** role labels, the current
identity block, the year plaques and the projecting sign; only the technology
plates are hidden and only the company signs are enlarged.

**Overview-only information fixes (user review, 2026-10-14).** Because the logo
plates are hidden, role labels that were positioned relative to them are
re-tuned in Overview without touching Detailed:

- **Role mini boards** — `experienceTags()` renders an optional second, smaller
  plaque (`roleMiniBoard()` → `<g class="dw-tag-role">`, `.dw-tag-role-text`)
  *above* a company sign when its `FLOOR_TAGS` entry has a `role`, so the role
  label moves off its door/wall/floor onto the sign and scales with it. Applied
  to Puelo `Unity Dev`, BA `Jr. Developer`, Nextcode `Co-Founder`, Interactica
  f2-front `Dev` and f2-left `Tech Lead`. Hidden in Detailed
  (`.dw-tag-role { display: none }`), shown in Overview; the matching role
  labels (`.dw-role-puelo/-ba/-nextcode/-f2right/-f2left`) are hidden in
  Overview.
- **Pacer mid board** — `Software Architect` is instead a standalone
  `.dw-tag-group.dw-tag-role` board *between* the two Pacer signs, centred on
  the elevator's depth (c ≈ 302.5, floor 4), so it scales in place like the
  signs; the floor label `.dw-role-pacer` is hidden in Overview.
- **Re-centred role labels** — `modeLabelWrap(cls, dx, dy, lines)` wraps a label
  in a group carrying the Overview translate as CSS custom properties
  (`--ovx`/`--ovy` in px = SVG user units); the inner text keeps its plane
  matrix. `.dw-mode-overview .dw-role-dba` / `.dw-role-f3sa` apply it, moving
  the `DBA` and floor-3 `Software Architect` labels down to the centre of their
  partial walls (which the hidden logo rows had left them above) and enlarging
  them (+20% / +15%).
- **Year plaques & projecting sign** — Overview scales the year plaques (the
  elevator story years and the 2013 entrance sign, `#elevator`/`#entrance`
  `.dw-tag-group`) up **15%** and the projecting identity sign (photo + QR,
  `#projecting-sign`) up **25%**, both around their own centre.

Two shared-source changes from the same review also affect Detailed: the
Freelancer company sign now reads **`Freelancer Game Dev`**, and the near
Indelve fleet is assembled **under** the `Indelve` sign (`assemble-svg.mjs`) so
the enlarged Overview sign stays readable. Detailed therefore differs from the
Stage 7 `r224` render only in those two places.

Gotcha: `svgStyle` is a JS template literal and, because an inline SVG `<style>`
is parsed as HTML raw text, **no `<` may appear in the CSS comments** — a
literal `<svg>` (or `<g>`) in a comment is parsed as an element and silently
truncates the rest of the stylesheet. Write "the root SVG element", not `<svg>`.

## Stage 9 — Vue integration

The diorama is now presented by a small, purposeful Vue app (see
`STAGE_09_VUE_INTEGRATION.md`). The SVG artifact, the `__ASSET__` pipeline and
the display-mode contract are unchanged; Stage 9 only wires them into the
application and adds responsiveness + accessibility.

- **Components.** `src/App.vue` is the page composition: it resolves the mode
  and composes the page (`<main class="shell">` → diorama + a visually hidden
  LinkedIn link). `src/components/DioramaView.vue` owns the inline SVG: it takes
  a `mode` prop and renders the assembled SVG with the root mode class swapped.
  `src/diorama.ts` holds the SVG `?raw` import, the one-time `__ASSET__` token
  resolution (fails loudly on a missing asset) and the `applyModeClass()` swap.
- **Mode / URL.** `src/composables/useDisplayMode.ts` mirrors
  `resolveMode(window.location.search)` (the canonical contract in
  `src/display-mode.ts`) into a reactive ref and re-reads it on `popstate`, so a
  shared/edited URL and back/forward select the same mode. **No in-page mode
  control** was added (Overview need not be discoverable per the brief), so no
  second mode state exists that could diverge from the URL. The same single SVG
  serves both modes — only its root class changes.
- **Data model.** `src/data/career.ts` is a typed facade over the authoritative
  `scripts/career-data.mjs` (typed by `scripts/career-data.d.mts`); it re-exports
  only the field the interface actually uses (`IDENTITY`, for the accessible
  link). No career content is transcribed or duplicated — the generator and the
  app consume the same module. Indelve/Pacer rules are unchanged.
- **Responsive.** `src/styles/base.css` keeps the dark radial backdrop and sizes
  the SVG with `max-width: 100%` + `max-height: calc(100dvh - 2·padding)` at its
  intrinsic ratio, so the whole viewBox (top rocket + projecting sign) is always
  visible: width-bound on narrow screens (vertical scroll, never tiny), height-
  bound on desktop (centred, no excessive margins). One `≤640px` breakpoint
  reduces the page padding; the illustration's internal geometry is untouched.
- **Accessibility.** The assembled SVG carries `<title>` + a concise `<desc>`
  (`aria-labelledby`/`aria-describedby`, set in `assemble-svg.mjs`). The
  projecting-sign QR is unchanged; the same LinkedIn destination is also a
  visually hidden, keyboard-focusable link in the page.

## Stage 10 — whole-sign link, custom zoom & deployment

- **Whole-sign link.** The generator gained `svgLink()`; `projectingSign()` now
  wraps its complete graphical group (`dw-sign-group`: casing, inset panel,
  photo, name, QR + LinkedIn mark, URL and mounting arms) in ONE SVG anchor to
  `IDENTITY.linkedin` (`target="_blank" rel="noopener noreferrer"`,
  `aria-label="Open LinkedIn profile"`). The photo, name, QR, printed URL,
  casing and background are therefore a single click target with no nested
  anchors or dead regions. This lives in `scripts/generate-geometry.mjs` — edit
  it and re-run `npm run svg:generate` + `svg:assemble`; the sign's appearance,
  size, position and content are unchanged, and the link is active in Detailed
  and Overview alike.
- **Custom diorama zoom** does not touch the SVG source: `src/composables/useZoom.ts`
  and the `.zoom-viewport`/`.zoom-btn` rules in `src/styles/base.css` scale the
  rendered diorama (1×/4×) while the `viewBox`, artwork and inline mode styles
  stay exactly as authored.
- **Deployment.** Vite's `base: '/cv/'` (GitHub project-page subpath) only
  affects how the built HTML references assets; the `__ASSET__` tokens still
  resolve to Vite-hashed URLs at runtime, so the generator/assembly pipeline is
  unchanged.

## Tooling rules

- Prettier ignores this directory (see `.prettierignore`): no formatting churn
  on hand-edited SVG.
- `npm run svg:optimize` writes optimized copies to `generated/svg/` — that
  output is disposable; this directory remains the source of truth. SVGO is
  configured to preserve semantic IDs and group structure.
