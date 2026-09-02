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
│   ├── staircase.svg, elevator.svg
│   ├── viewer.svg, labels.svg
└── diorama.svg                 ← assembled single-SVG deliverable (committed)
```

`npm run svg:assemble` regenerates `diorama.svg` from the fragments (plain
deterministic concatenation, no dependencies). The master stays fully
readable/editable, but the **fragments remain authoritative** — edit fragments,
then re-assemble.

## Shared geometry parameter block

All fragments are authored against these constants. Coordinates are meaningless
without them.

```text
viewBox        0 0 1200 900
isometric axes width (0.866, -0.5)  depth (-0.866, -0.5)  height (0, -1)
front corner A (700, 770)        (nearest viewer, lower-right)
width  LW = 400 → w = (346.4, -200)
depth  LD = 240 → d = (-207.8, -120)
floor height FH = 68 (6 floors, levels L0…L6 at A: 770, 702, 634, 566, 498, 430, 362)
corner columns A, B, C, D; rear wall on C–D edge, left wall on A–C edge
front (A–B) and right (B–D) sides open (cutaway)
elevator shaft plan: A + 0.44w + 0.40d, size 0.12w × 0.12d
ground partitions at width-fractions 0.32 / 0.62 / 0.80
floor-1 partitions at width-fractions 0.40 / 0.60
floor-3 partition at depth-fraction 0.68 (rear strip = Indelve)
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
| `viewer`                    | viewer/foreground reference marker        |
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
