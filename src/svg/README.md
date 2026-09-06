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

## Layout: fragments + assembled master (Stage 2)

The diorama is authored as **modular fragments** — one `<g>` per architectural
module — and assembled into a **single complete master SVG**:

```text
src/svg/
├── fragments/                  ← authoritative source (one root <g> each)
│   ├── terrain.svg, path.svg, entrance.svg, career-sign.svg   (hand-edited;
│   │                                                            entrance/career-sign generated)
│   ├── floor-ground.svg, floor-01.svg … floor-05.svg          (generated)
│   ├── staircase.svg, elevator.svg, tags.svg                  (generated)
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
viewBox        0 0 1200 1050
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
Revision 22 (Stage 5, user revision): the floor-2 slab's left cut-face band
is split around the return wall's face — the front piece ends at the wall's
far edge (u = LW − WALL_T), the rear piece starts at the wall's near edge
(u = SHAFT_U + WALL_T, the W2 face's outer line) — because the full band's
bottom edge read as a stray line across the wall's clean white face between
the shaft and the c = 135 experience tag, and again right of the tag (the
omitted stretch projects exactly onto the wall face; only its middle hides
under the tag); the elevator's re-layered bands correspondingly span only
the shaft's depth (v from the W2 face's outer line to the W3 wall's plane)
instead of the full 0–LD, whose front and rear stretches repainted the same
stray line and duplicated band pieces each floor already draws
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
career-sign: single central post + larger placeholder panel (160×110) on the
terrain, outside the building coordinate system (screen-space geometry)
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
elevator, floor-02…05-front planes, tags) → `entrance` → `path` →
`career-sign`.

## Group-ID naming

IDs describe architectural meaning, never generated names (`group42`, `rect891`):

| ID                          | Meaning                                    |
| --------------------------- | ------------------------------------------ |
| `terrain`                   | ground/base plane                          |
| `ground-shadow`             | soft building contact shadow (Stage 5)     |
| `career-sign`               | personal identification sign (placeholder) |
| `path`                      | path from sign/foreground to entrance      |
| `entrance`                  | entrance threshold + portal frame          |
| `floor-ground`, `floor-01`… | stacked floor modules                      |
| `floor-02-front`…           | story column layers of shaft-crossing floors |
| `staircase`                 | stairs between stages (ground → floor 1)   |
| `elevator`                  | persistent vertical shaft, floor 1 up      |
| `architectural-details`     | sparse infrastructure + wall patch (Stage 5) |
| `tags`                      | career-stage signs on the left wall        |

## Architecture vs information layer

Keep architectural geometry separate from professional information. The
`tags` group holds small wall-mounted section identifiers only (Stage 3.5);
the real information layer (roles, dates, technologies) lives in Vue/HTML/CSS
in a later stage — never baked permanently into the architecture.

## Tooling rules

- Prettier ignores this directory (see `.prettierignore`): no formatting churn
  on hand-edited SVG.
- `npm run svg:optimize` writes optimized copies to `generated/svg/` — that
  output is disposable; this directory remains the source of truth. SVGO is
  configured to preserve semantic IDs and group structure.
