# SVG Source

SVG is the primary visual source of the diorama. Files here are **editable
source artwork**, not generated output — they must stay hand-maintainable.

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
ground floor (right → left): Puelo Games (0–0.35d, entrance leads in),
BA Technology (0.35–0.68d), Freelancer + staircase (0.68–1.0d); partitions at
0.35d / 0.68d (WALL_T thick, full width, height STORY_H) with door-height
passages (u 15–70, height DOOR_H) near the open A–C side
floor-1: Health Platforms (0–0.46d), Nextcode (0.585–1.0d) — staircase arrives
here; return walls continue the shaft's W2 / W3 walls (v-bands
[SHAFT_V0−WALL_T, SHAFT_V0] and [SHAFT_V1, SHAFT_V1+WALL_T], u from SHAFT_U to
the B–D wall) so the floor reads as Nextcode | Elevator | Health Platforms;
each return wall has a door-height passage (u 75–130) near the open side
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
from floor 1 to the top; each crossing floor's slab is split — the mid strip
(u 0.171w–LW, v 0.46–0.585d) and the rear piece (v 0.585d–1.0d) belong to
floor-0X and render in layers BELOW the shaft, the front plane (v < 0.46d)
belongs to floor-0X-front and renders over the front of the shaft;
SLAB_T level bands cross the W1–W3 wall faces at every level
staircase: solid flight against the C–D rear wall (v 540.5–580.5), running along
the width axis, rising u 22 → 127 in 12 steps (rise 8.75, going 8.75), with a
clear gap to the open A-C side; floor-01 slab has a matching opening reaching
the C–D wall (no cut faces; the left edge band is continuous), so the rear
wall shows through it as one continuous surface crossed only by the floor
separation line; drawn before floor-01 so the slab occludes the lower flight
while the top re-emerges at the opening; the slab beyond u = 127 is the
landing into Nextcode
entrance: threshold platform (u 0.35–0.65w, 37.5 deep, SLAB_T thick) abutting
the A–B face at ground level, plus a minimal portal frame — two jambs (10 wide,
7.5 deep, extending down to the block base at -SLAB_T) and a header (52.5–60)
on the threshold; the right jamb (higher u) renders in a layer below the
entrance block; the hand-authored path starts exactly at the block's base
edge (v = -37.5, h = -SLAB_T)
career-sign: single central post + larger placeholder panel (160×110) on the
terrain, outside the building coordinate system (screen-space geometry)
experience tags: vertical signs flush with the invisible left wall (u = 0,
like the year plaques), one per section over its own floor, at the floor's
front level (band h −SLAB_T…−SLAB_T+16 — base on the slab's bottom line),
length fitted to the text; text on the wall plane (matrix-skewed, reading
toward the front corner); Freelancer Game Developer on a single line;
whole-floor sections duplicate their sign on the floor's left side
(Interactica on floor 2, Pacer on floor 4) — all left-side tags share
v ≈ 470 (the rear stretch's center), so Nextcode / Interactica / Indelve /
Pacer align vertically
```

### Layer order (Stage 3.5 revision)

Assembled in this order so occlusion obeys physical structure:
`terrain` → `building` (floor-ground, staircase, floor-01, floor-02…05 rear
groups — sections behind the shaft, elevator, floor-02…05-front planes,
tags) → `entrance` → `path` → `career-sign`.

## Group-ID naming

IDs describe architectural meaning, never generated names (`group42`, `rect891`):

| ID                          | Meaning                                    |
| --------------------------- | ------------------------------------------ |
| `terrain`                   | ground/base plane                          |
| `career-sign`               | personal identification sign (placeholder) |
| `path`                      | path from sign/foreground to entrance      |
| `entrance`                  | entrance threshold + portal frame          |
| `floor-ground`, `floor-01`… | stacked floor modules                      |
| `floor-02-front`…           | front slab planes of shaft-crossing floors |
| `staircase`                 | stairs between stages (ground → floor 1)   |
| `elevator`                  | persistent vertical shaft, floor 1 up      |
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
