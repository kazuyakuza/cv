# Stage 05.5 Visual Enrichment — Continuation #2 (fresh session handoff)

> Start here. This is the condensed, self-contained handoff for the NEXT
> session. The full history of every round lives in
> `STAGE_05.5_VISUAL_ENRICHMENT_CONTINUE.md` (read only if you need the
> reasoning behind a decision). Also read `AGENTS.md`,
> `.agent/project-info/PROJECT_BRIEF.md` and
> `.agent/project-info/IMPLEMENTATION_PLAN.md`.

## 1. What this project is doing right now

The career diorama SVG is built and illustrated (Stages 0–5 complete). **Stage
5.5 is an iterative, user-reviewed visual-enrichment loop**: the user looks at a
rendered PNG, sends a revision list (often with screenshots and red marks), the
session implements it, renders a new `rNN.png`, and the user reviews again.

Last round: **UPDATE #23** (2026-09-18) — data server nudged toward the rear
wall, kiosk screen art hand-edited by the user. Latest render:
`generated/dev/r34.png`. Last commit: `stage 5.5 UPDATE #23 …`.

**Pending on the user:** the next revision list. Nothing is blocked.

## 2. Dev workflow (exact commands, from the repo root `C:\repo\cv`)

```powershell
npm run svg:generate        # scripts/generate-geometry.mjs -> src/svg/fragments/*.svg
npm run svg:assemble        # scripts/assemble-svg.mjs -> src/svg/diorama.svg
python generated\dev\make_chk.py             # wraps diorama.svg into chk.html (3000x2625, dark backdrop)
& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless --disable-gpu `
  --screenshot="C:\repo\cv\generated\dev\rNN.png" --window-size=3000,2625 --hide-scrollbars `
  "file:///C:/repo/cv/generated/dev/chk.html"
Start-Sleep -Seconds 4        # the file appears ~1s AFTER msedge returns
python generated\dev\crop_rNN.py generated\dev\rNN.png   # review crops + overview
npm run lint                  # eslint, must stay clean
```

Notes:
- The screenshot path MUST be absolute and the render is S=2.5 (3000x2625 →
  SVG 1200x1050 at 2.5x).
- `generated/` is gitignored: all dev scripts, probes and renders live there
  and are NOT committed. The committed artifacts are
  `src/svg/diorama.svg`, `src/svg/fragments/*.svg`, `src/assets/*.png`,
  `scripts/*.mjs`.
- Useful dev tools in `generated/dev/`: `make_chk.py`, `crop_rNN.py` (copy the
  previous one and retune boxes), `check_imgs.py <fragment…>` (prints every
  sprite's placed x/y/w/h), `ascii_cut.py <png> [cols]` (reads a sprite's
  silhouette as ASCII — invaluable when you cannot view images),
  `pick_standkiosk.py` (silhouette-match a candidate against its wireframe),
  `measure_props.py`, `probe_*.py` (pixel probes of a render).
- Commit style: `stage 5.5 UPDATE #NN: <what changed>`.

## 3. Geometry conventions (must-know)

Projection (`scripts/generate-geometry.mjs`):
```
AXIS_W = [ 0.7071, -0.2475]     AXIS_D = [-0.7071, -0.2475]
CORNER_A = [750, 985]           // nearest viewer corner, ground slab top
p(u, v, h) = (750 + 0.7071u - 0.7071v, 985 - 0.2475u - 0.2475v - h)  // + deterministic jitter ±0.5
```
- `u` = width 0..238 (LW), `v` = depth 0..588 (LD), `h` = height (1 h-unit = 1
  screen px; the plan axes are 0.7492 px/unit → vertical is exaggerated ~1.33).
- `FH = 105` (floor-to-floor), `STORY_H = 92.5`, `SLAB_T = 12.5`,
  `WALL_T = 7.5`, `TOP_H = 6*FH = 630`.
- Elevator shaft: `SHAFT_U = 0.171*LW = 40.698`,
  `SHAFT_V0 = 0.46*LD*0.85 = 229.908`,
  `SHAFT_V1 = SHAFT_V0 + 0.125*LD = 303.408` (shaft depth 73.5, still off-centre
  after UPDATE #16), `DOOR_H = 52.5`.
- Ground partitions: `PARTITION_G = [0.28*LD*0.85, 0.68*LD] = [139.944, 399.84]`
  (Puelo | BA Technology | Freelancer).
- Stairs: `STAIR_U0 = 22`, `STAIR_RUN = 105`, `STAIR_WIDTH = 40`,
  `STAIR_V0 = LD - WALL_T - 40 = 540.5`.
- Section tags (`FLOOR_TAGS`) are placed on the u = 0 plane at `v = c`
  (`c = 82/282/477` ground, `135/470` on each upper floor). Year plaques sit on
  the shaft enclosure at `vMid = (SHAFT_V0+SHAFT_V1)/2 = 266.658`.
- Sprites are placed with `assetProp(sp, uAnchor, vAnchor, hBase)`: the anchor
  is the sprite's BOTTOMMOST opaque pixel; constants are
  `{ file, w, h, k, ax, ay }` with `ax/ay` in display px (image is drawn at
  `x = p(anchor).x - ax`, `width = w*k`). `spriteShadow(sp, u, v, h)` adds the
  soft contact ellipse.

## 4. Occlusion / layering rules and traps

Assembler order (`scripts/assemble-svg.mjs`) — this matters:
```
terrain, ground-shadow, building[ floor-ground, staircase, freelancer-props,
floor-01, floor-02, floor-03, floor-04, floor-05, architectural-details,
elevator, floor-02-front, floor-03-front, floor-04-front, floor-05-front, tags ],
entrance, path, career-sign
```
- **TRAP: the `*-front` fragments are drawn AFTER `elevator`.** Anything that
  must be occluded by the shaft may NOT live there. Conversely, anything that
  must lie ON a floor surface (e.g. the SVG cables) must come after that
  floor's `slabTriangle` (which lives in the `-front` fragment).
- Current floor-2 stacking (r34): `floor-02-front` =
  `slabTriangle` → `kioskCables` → `serverRackFront` → `STANDKIOSK` → `columns`.
- Slab-cut envelope (re-derived in UPDATE #6): a slab's left cut band at u = 0
  (`h ∈ [hBot,hTop]`) hides points with `hBot ≤ h + 0.495u ≤ hTop` (when
  `v ≥ u`); **the B-D-wall side (`v < u`) is exempt** — that is why the right
  side props are fully visible. On floor 1 everything must satisfy
  `h + 0.495·min(u,v) ≤ 197.5` (the floor-2 slab band).
- BA props behind partition-1 are visible iff `u < v - 139.944` (left wedge) or
  above the cut; the meeting table keeps ~13u margin.
- Painter order is manual and far-to-near; when two props overlap in depth they
  are ordered by which is nearer. Billboards (staffage) always anchor at the
  bottommost pixel.
- `spriteShadow` exists because a u/v-footprint quad reads as a stray streak
  under a billboard.

## 5. Sprite generation pipeline (nano-banana, wireframe-only)

Proven recipe for new props/staffage:
1. `generated/dev/make_wire_<name>.py` — draw the object's red wireframe in the
   diorama projection at S=10: `along = (-cos19.29°, -sin19.29°)·S`,
   `depth = (cos19.29°, -sin19.29°)·S`,
   `vert = (0, -4·sin19.29°·S)` (= 13.215 px per h-unit at S=10; note this is
   NOT 10 px/unit — see the scale trap below). Draw the front figure as a white
   silhouette so occlusion is communicated.
2. Generate with the nano-banana MCP: pass the wireframe as the ONLY input
   (`input_image_path_1`), `mode: generate`, `n: 3`. Extra inputs drag the
   style/projection off-model.
3. Pick a candidate — `generated/dev/pick_standkiosk.py` compares each
   candidate's per-column silhouette to the wireframe's (normalized bbox) and
   reports the mean error; also check the corners are white (keyable).
4. `generated/dev/key_cut_<name>.py` — white→alpha via border flood + a coarse
   seeded flood for enclosed pockets, despeckle, bbox crop, then print the
   constants. **SCALE TRAP**: the wireframe's 640-px content is
   `640/13.215 = 48.4` DIORAMA px, not 64 — compute the target from extreme
   points via `p()`, then `k = TARGET_H / crop_height`, and
   `ax/ay = bottommost_pixel · k`.
5. Integrate: add the `const` near the other sprites, call `assetProp(...)`,
   put the PNG in `src/assets/` (it is base64-inlined at build time).
6. **If the user hand-edits a sprite in place** (they do this often): compare
   the file against `git show HEAD:<path>` (write it with `cmd /c "git show
   … > tmp.png"`, PowerShell redirection corrupts binaries), check the opaque
   bbox + bottommost row, and re-measure `ax/ay` (and `k` only if the height
   changed). Encode the reason for the change in a comment.

## 6. Current content inventory (what exists where)

- **Ground**: entrance portal + threshold, career sign (placeholder content —
  final text is Stage 7), terrain/path. Puelo Games: media kiosk w/ Space
  Invaders screen, stool pair, 3 crates (front-left of the section after
  UPDATE #16). BA Technology: whiteboard on partition-2's face, round meeting
  table (+ chairs/people/papers sprite) at (78, 254). Freelancer: staircase, PC
  at (82, 514.5), paper mess (sheets/stacks/pamphlet), wall-base piles.
- **Floor 1 (2017–2019)**: Nextcode — pamphlet on the rear wall (u 26..90),
  WS_D notebook desk at (110, 470), 2 crates, the 4-dev sprite group at
  (20, 346). Health Platforms — 3 server racks on the B-D wall (u 230.5,
  v 20..94), electrical panel + conduit drop (v 168..192), the seated-DBA
  vignette (sitter at (160, 82); 4 ream towers in a line at u 195, v 109/97/85/73;
  3 open paper boxes at u 80..110, v 20..110, painted ABOVE the sitter).
- **Floor 2 (2019–2025, Interactica)**: yellow service pipes (horizontal +
  vertical riser at u 227.5, v 60), the two workstations WS_D and WS_C side by
  side against the B-D wall (`uBack = 213.5`, v 82 / 26), the Cleverlit stand
  kiosk at the front-left corner area (`assetProp(STANDKIOSK, 65, 11.5, 2*FH)`),
  the front-facing small data server beside the elevator
  (`serverRackFront(52, 68, 220, 2*FH, 2*FH+38)`), and two SVG cable runs
  (`kioskCables`) from the kiosk's mini PC to the server, drawn below the kiosk.
  **The floor-2 left half is still empty — the obvious next content area.**
- **Floors 3–5**: architectural shell + tags only. Floor 5 is intentionally
  unfinished (WIP). Props for 3/4/5 are deferred by user decision until 1–2 are
  done.
- **Elevator**: shaft + doors + per-story open doors, service conduit +
  junction boxes (SHAFT_V1-relative), year plaques on the enclosure.

Sprite constants currently in `scripts/generate-geometry.mjs`:
`PUEL_KIOSK`, `PUEL_STOOLS`, `PUEL_TABLE`, `FREELANCER_PC`, `DEV_GROUP`,
`SITTER`, `STANDKIOSK`, `WS_C` (+`assetWorkstation`), `WS_D`, `PIPE_SPRITE`,
`PIPE_H_SPRITE`.

## 7. Next steps / open items

1. Take the user's next revision list (they review `rNN.png` + the crops).
2. Likely content direction: **fill floor-2 Interactica's left half**, then
   floors 3/4/5 props (user said deferred until 1–2 are finished; 1–2 are
   essentially done now — confirm with the user before starting 3+).
3. Housekeeping whenever convenient: `AGENTS.md` → "Development Status" is
   still stale boilerplate ("Stage 0 is next"); refresh it to Stages 0–5 done,
   5.5 in progress.
4. Keep the acceptance criteria of `.agent/todo/STAGE_05.5_VISUAL_ENRICHMENT.md`
   §17 as the guide for when 5.5 can be called complete.
5. After 5.5: Stage 6 (career content) → 7 (information layer) → 8 (display
   modes incl. the `?overview` query param) → 9 (Vue integration) → 10
   (polish/deploy to GitHub Pages).
