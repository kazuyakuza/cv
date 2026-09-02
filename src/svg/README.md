# SVG Source

SVG is the primary visual source of the diorama. Files here are **editable
source artwork**, not generated output — they must stay hand-maintainable.

## Layout: modular fragments

The diorama is developed as one SVG file per architectural module, later
assembled into a master diorama SVG (assembly strategy is decided when the
geometry exists):

```text
src/svg/
├── terrain.svg
├── career-sign.svg
├── path.svg
├── entrance.svg
├── floor-ground.svg
├── floor-01.svg ... floor-05.svg
├── staircase-ground-to-first.svg ...
└── elevator.svg
```

Stage 0 deliberately creates **no geometry** — Stage 1 owns the first wireframe.

## Group-ID naming

IDs describe architectural meaning, never generated names (`group42`, `rect891`):

| ID                          | Meaning                                   |
| --------------------------- | ----------------------------------------- |
| `terrain`                   | ground/base                               |
| `career-sign`               | personal identification sign              |
| `path`                      | path from sign to entrance                |
| `entrance`                  | building entrance                         |
| `floor-ground`, `floor-01`… | stacked floor modules                     |
| `staircase-ground-to-first` | stairs between stages                     |
| `elevator`                  | persistent vertical shaft, first floor up |

## Architecture vs information layer

Keep architectural geometry separate from professional information (company
names, roles, years, technologies). Information lives in Vue/HTML/CSS or a
clearly separated SVG text layer — never baked permanently into the
architecture.

## Tooling rules

- Prettier ignores this directory (see `.prettierignore`): no formatting churn
  on hand-edited SVG.
- `npm run svg:optimize` writes optimized copies to `generated/svg/` — that
  output is disposable; this directory remains the source of truth. SVGO is
  configured to preserve semantic IDs and group structure.
