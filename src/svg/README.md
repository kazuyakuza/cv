# SVG Source

SVG is the primary visual source of the diorama. Files here are **editable
source artwork**, not generated output — they must stay hand-maintainable.

## Layout: fragments + assembled master (Stage 1)

The diorama is authored as **modular fragments** — one `<g>` per architectural
module — and assembled into a **single complete master SVG** (Stage 1 §3
requires one coherent architectural object for global proportion/alignment
validation):

```text
src/svg/
├── fragments/                  ← authoritative source (one root <g> each)
│   ├── terrain.svg, path.svg, entrance.svg, career-sign.svg
│   ├── floor-ground.svg, floor-01.svg … floor-05.svg
│   ├── staircase.svg, elevator.svg, labels.svg
└── diorama.svg                 ← assembled single-SVG deliverable (committed)
```

`npm run svg:assemble` regenerates `diorama.svg` from the fragments (plain
deterministic concatenation, no dependencies). The master stays fully
readable/editable, but the **fragments remain authoritative** — edit fragments,
then re-assemble.

## Shared geometry parameter block

All fragments are authored against these constants. Coordinates are meaningless
without them. Revision 2 (after Stage 1 visual review): higher bird's-eye view,
short entrance face, long left exposure, taller floors.

```text
viewBox        0 0 1200 1050
isometric axes width (0.8, -0.6)   depth (-0.92, -0.4)   height (0, -1)
               (steep width axis opens the floors toward the viewer;
                shallow depth axis sweeps the long side across the canvas)
front corner A (760, 860)          (nearest viewer, lower-right)
width  LW = 190 → w = (152, -114)    short entrance face A–B
depth  LD = 470 → d = (-432.4, -188) long left side A–C
floor height FH = 84 (6 floors)
levels at A: 860, 776, 692, 608, 524, 440, 356
corner columns A, B, C, D; kept walls: B–D (long back) and C–D (short back)
cutaway faces: front A–B (short) and long left A–C — slab edge bands run
down the left side, so floor divisions read from the left, not the front
ground floor (right → left): entrance hall (0–0.15d), Puelo Games (0.15–0.40d),
BA Technology (0.40–0.68d), Freelancer + staircase (0.68–1.0d, stairs inside
at 0.25w, rising 0.72d → 0.95d)
floor-1 (right → left): Health Platforms (0–0.35d), elevator (0.35–0.65d),
Nextcode (0.65–1.0d) — staircase arrives here
elevator shaft plan: A + 0.34w + 0.44d, size 0.32w × 0.12d
floor-3 partition at depth-fraction 0.75 (rear-left strip = Indelve)
```

## Group-ID naming

IDs describe architectural meaning, never generated names (`group42`, `rect891`):

| ID                          | Meaning                                   |
| --------------------------- | ----------------------------------------- |
| `terrain`                   | ground/base plane                         |
| `career-sign`               | personal identification sign (placeholder)|
| `path`                      | path from sign/foreground to entrance     |
| `entrance`                  | entrance threshold                        |
| `floor-ground`, `floor-01`… | stacked floor modules                     |
| `staircase`                 | stairs between stages (ground → floor 1)  |
| `elevator`                  | persistent vertical shaft, floor 1 up     |
| `labels`                    | temporary spatial-validation labels       |

## Architecture vs information layer

Keep architectural geometry separate from professional information. The
`labels` group holds small temporary identifiers only (Stage 1); the real
information layer (roles, dates, technologies) lives in Vue/HTML/CSS in a later
stage — never baked permanently into the architecture.

## Tooling rules

- Prettier ignores this directory (see `.prettierignore`): no formatting churn
  on hand-edited SVG.
- `npm run svg:optimize` writes optimized copies to `generated/svg/` — that
  output is disposable; this directory remains the source of truth. SVGO is
  configured to preserve semantic IDs and group structure.
