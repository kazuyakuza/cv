# Stage 05.5 Visual Enrichment — Continuation #3 (fresh session handoff)

> Start here. This is the condensed, self-contained handoff for the NEXT session.
> History: `STAGE_05.5_VISUAL_ENRICHMENT_CONTINUE_2.md` (UPDATE #37–#56) and
> `STAGE_05.5_VISUAL_ENRICHMENT_CONTINUE.md` (UPDATE #1–#36) — read them only if
> you need the reasoning behind a decision. Also read `AGENTS.md` (the >30-images
> cap and the free-assets-only rule), `.agent/project-info/PROJECT_BRIEF.md` and
> `IMPLEMENTATION_PLAN.md`.

## 1. Where the project stands

The career diorama SVG (isometric cutaway of a multi-floor building, one floor
per career stage) is built and illustrated; **Stage 5.5 is an iterative,
user-reviewed visual-enrichment loop**: the user looks at a rendered PNG, sends a
revision list (often with exact numbers / red marks), the session implements it,
renders a new `rNN.png`, and the user reviews again.

Last round: **UPDATE #56** (2026-09-24) — the right Indelve fleet must read above
the queue people: inside `floor-03` it is now emitted AFTER `indelveFloorProps()`
(previously straight after `indelveBoard()`), so its bow paints over the queue's
feet, while staying inside `floor-03` so the elevator fragment still hides its
stern. Latest render: `generated/dev/r96.png` (crops `chk-fleets`,
`chk-indelve-wide`, and the 12x `chk-fleet-queue.png`).

Earlier this session (all in the same commit):
- **#55** — the user hand-placed both fleets and asked for SVG shadows on the
  board. Each fleet `<image>` is pinned to the exact screen top-left the user
  gave — A `x="410" y="525"`, B `x="480" y="530"` (the file had A `413.41,530.8`
  and B `491.69,541.58`) — via screen offsets `FLEET_A_OFF` / `FLEET_B_OFF`
  derived from the plan-anchor projection (same technique as the PC towers).
  NEW screen-space clip path `dw-clip-board-screen` (the board's top face emitted
  as a polygon by `indelveBoard()`) wraps each fleet's contact shadow, so a
  shadow can only show ON the board (the user's "a shadow below each fleet, just
  over the board"; before they straddled the edge onto the wood floor). The user
  also recoloured `src/assets/fleet-b-01-cut.png` in place — fleet B is now
  purple; dimensions unchanged (1269x648), so the constants still hold.
- **#54** — the board AND both fleets shifted ~20 units toward the building's
  rear (C-D) wall and the fleets shrank 15%. The board move is `+v` only
  (`BOARD` `v0/v1` 351/465 → 371/485) = screen (-14.1, -5.0); the fleets followed
  with re-solved anchors (solved so each CAPITAL keeps its place relative to the
  board's moved corner) and are now PLACED ~62.9 / 62.8 units wide.
- **#53** — the fleets were restored to the wireframe-implied size (the key-cut
  had shrunken them to `W_TARGET 42`; `generated/dev/key_cut_fleet.py` now
  defaults to 74), and the two-layer split was introduced: `indelveFleetA()` in
  the NEW `indelve-fleets` fragment (assembled after `tags`, so the near fleet
  paints over the "Indelve" plaque), `indelveFleetB()` in `floor-03` (under the
  elevator, so the shaft keeps occluding it).
- **#50–#52** — the fleets themselves: two generated painterly sprites (1 long
  capital + 4 detached fighters each, facing each other), each with a contact
  shadow (`spriteShadow` gained an optional `bulge`; the fleets use the default
  1).

**Pending on the user:** review `r96.png`. The last commit is
`stage 5.5 UPDATE #53-#56` (see `git log`), which also adds this file.
Open cosmetic questions the user may still react to: the fleet shadows are
subtle (dark `#141618` @22% over a dark nebula — raise their opacity if asked),
and the fleets' fighter spread reaches past the board edge onto the wood floor
(only the shadows are clipped to the board, not the sprites).

## 1b. Start-of-session checklist (fresh session)

1. Read this file, then `AGENTS.md` (the >30-images cap and the free-assets-only
   rule); the older continuation docs only on demand.
2. `git log --oneline -6` + `git status` — expect a CLEAN tree at the
   `stage 5.5 UPDATE #53-#56` commit (everything through the Indelve fleets,
   board move and shadow clipping is committed).
3. Sanity-render before touching anything (§2) and compare with the previous
   round's PNG if the user reports something broken.
4. Wait for the user's revision list, implement, re-render, report with the
   render path + crop names. **Commit only when the user asks.**
5. The user often edits `src/assets/*.png` IN PLACE between rounds (e.g. they
   recoloured fleet B). After such an edit: confirm the pixel size is unchanged,
   rebuild (the assets are base64-inlined by `npm run svg:generate`), and
   re-measure `ax/ay` only if the size changed.

## 2. Dev workflow (exact commands, from the repo root `C:\repo\cv`)

```powershell
npm run svg:generate        # scripts/generate-geometry.mjs -> src/svg/fragments/*.svg
npm run svg:assemble        # scripts/assemble-svg.mjs -> src/svg/diorama.svg
python generated\dev\make_chk.py             # wraps diorama.svg into chk.html (3000x2625, dark backdrop)
& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless --disable-gpu `
  --screenshot="C:\repo\cv\generated\dev\rNN.png" --window-size=3000,2625 --hide-scrollbars `
  "file:///C:/repo/cv/generated/dev/chk.html"
Start-Sleep -Seconds 4        # the PNG appears ~1s AFTER msedge returns
python generated\dev\crop_rNN.py generated\dev\rNN.png   # review crops
npm run lint                  # eslint, must stay clean
```

Notes:
- The screenshot path MUST be absolute; the render is S=2.5 (3000x2625 = SVG
  1200x1050 at 2.5x). Crop helpers use `S = 2.5` and SVG-unit boxes, e.g.
  `crop('chk-fleets', 400, 505, 600, 600, 5)`.
- `generated/` is gitignored — all dev scripts, probes and renders live there and
  are NOT committed. Committed artifacts: `src/svg/diorama.svg`,
  `src/svg/fragments/*.svg`, `src/assets/*`, `scripts/*.mjs` and the docs.
- Handy dev tools in `generated/dev/`: `make_chk.py`, `crop_rNN.py` (copy the
  previous one and retune the boxes), `crop_fleet_queue.py` (zoomed fleet/queue
  boundary), `list_images.py` (prints every `<image>` x/y/w/h in the assembled
  SVG), `check_fleets.py` (fleet placements + shadows + the board clip polygon),
  `probe_shadow.py` (pixel probe of the board), `fleet_blobs.py` (alpha blob
  measurement of a sprite), `ascii_cut.py <png>` (sprite silhouette as ASCII —
  invaluable without images), `pick_standkiosk.py` (silhouette match against a
  wireframe), `measure_asset.py`, `check_imgs.py`.
- Commit style: `stage 5.5 UPDATE #NN[-#NN]: <what changed>` (long, descriptive).

## 3. Geometry conventions (must-know)

Projection (`scripts/generate-geometry.mjs`):
```
AXIS_W = [ 0.7071, -0.2475]     AXIS_D = [-0.7071, -0.2475]
CORNER_A = [750, 985]           // nearest viewer corner, ground slab top
p(u, v, h) = (750 + 0.7071u - 0.7071v, 985 - 0.2475u - 0.2475v - h)   // + deterministic jitter ±0.5
```
- `u` = width 0..238 (`LW`), `v` = depth 0..588 (`LD`), `h` = height. `p()` wants
  the GLOBAL height (floor-3 content sits at `3*FH` + local). `+u` goes up-right
  on screen, `+v` up-left; the "rear wall" = the C-D wall at `v = LD - WALL_T`.
- `FH = 105`, `STORY_H = 92.5`, `SLAB_T = 12.5`, `WALL_T = 7.5`, `TOP_H = 6*FH`.
- Elevator shaft: `SHAFT_U = 40.698`, `SHAFT_V0 = 229.908`,
  `SHAFT_V1 = 303.408` (plan); `DOOR_H = 52.5`.
- **`round()` returns a STRING** — never use it inside arithmetic (it has bitten
  this project before: `cx="NaN"`).
- **jitter**: `p()` adds a deterministic ±0.55 px offset, so exact screen
  placements (PC towers, AR/VR person, both fleets) are pinned with the optional
  `off` argument: `off = target_screen − (p(anchor) − ax/ay)`, applied to the
  sprite AND its shadow. Verify with `generated/dev/list_images.py`.
- Sprites: `assetProp(sp, u, v, h, off)`; const `{ file, w, h, k, ax, ay }` with
  `ax/ay` in display px — the anchor is the sprite's BOTTOMMOST opaque pixel and
  the image is drawn at `x = p(u,v,h).x - ax`, `width = w*k`.
- `spriteShadow(sp, u, v, h, off, bulge = 1)` draws the soft contact ellipse
  (`filter="url(#dw-soft)"`, `#141618` @22%, `rx = 0.44·w·bulge`, `ry = 3.6·bulge`)
  centred at `(p().x - ax + w/2, p().y - 1)`.

Key floor-3 Indelve numbers (current):
- `BOARD = { u0: 5, u1: 98.6, v0: 371, v1: 485, R: 9 }` — the hex board, laid on
  the floor plane by one matrix; its screen corners at `h = 3*FH` are
  (491.2, 576.9) near, (557.4, 553.8) right, (476.8, 525.6) far, (410.6, 548.7)
  left. `deep-space.jpg` + pointy-top hex grid, `.dw-hex` cells filled `#1f7fd0`
  @50% with a `#5fdcff` stroke, no outer border.
- `FLEET_A` (left, points right): `k 0.0657, ax 24.15, ay 32.97` (958x505),
  anchor `(-27.3, 414.6)`, off `(-3.41, -5.8)` → SVG `<image x="410" y="525">`,
  shadow plan anchor `(5.2, 447.1)` — lives in `indelve-fleets`.
- `FLEET_B` (right, points left, PURPLE): `k 0.04953, ax 42.35, ay 31.94`
  (1269x648), anchor `(21.2, 326.9)`, off `(-11.69, -11.58)` →
  `<image x="480" y="530">`, shadow plan anchor `(53.1, 358.8)` — lives in
  `floor-03` after `indelveFloorProps()`.
  **A fleet sprite's "capital" is one long hull spanning nearly the whole sprite
  width; the 4 fighters are separate alpha blobs above/below it** (measure with
  `fleet_blobs.py`) — so the anchor is a fighter's bottom, far below the hull, and
  the hull's screen centre = anchor + `(blob_cx·k − ax, blob_cy·k − ay)`.
- `QUEUE`: `k 0.05415`, anchor `(110, 485, 3*FH)`, 3 copies at `qv`
  485 / 450.2 / 415.4 (`QUEUE_STEP 34.8`), runs `-v` behind the VR person.
  `TRANTORIAN_VR` pinned to `VR_XY = [455.5, 476]`; `PCTOWERS` pinned to
  `TOWER_XY = [446, 468]`; `PRESENTER` foot at `p(68, 546, 3*FH)`, 45.8u tall.

## 4. Occlusion / layering rules and traps

Assembler order (`scripts/assemble-svg.mjs`) — this matters:
```
terrain, ground-shadow, building[ floor-ground, staircase, freelancer-props,
floor-01, floor-02, floor-03, floor-03-team, floor-04, floor-05,
architectural-details, elevator, floor-02-front, floor-03-front,
floor-04-front, floor-05-front, tags, indelve-fleets ], entrance, path,
career-sign
```
- `tags` = the company/experience plaques (incl. "Indelve", floor 3, `c = 470`)
  and it is drawn AFTER every floor and the elevator. **Anything a plaque covers
  must live after `tags`** — that is why the near fleet has its own
  `indelve-fleets` fragment (stacked above `tags`, below nothing). The far fleet
  deliberately stays in `floor-03` (below `elevator`) so the shaft keeps occluding
  its stern, but after `indelveFloorProps()` so it paints over the queue people.
- **TRAP: the `*-front` fragments are drawn AFTER `elevator`.** Anything that
  must be occluded by the shaft may NOT live there. Anything that must lie ON a
  floor surface must come after that floor's `slabTriangle` (in the `-front`
  fragment).
- Slab-cut envelope: a slab's cut band hides points with
  `hBot ≤ h + 0.495·min(u,v) ≤ hTop`. For floor 3 the floor-4 band is
  `h_local + 0.495·min(u,v) ≤ 92.5`. It is a ONE-SIDED bound: a point is hidden
  whenever `h + 0.495·min(u,v) ≥ hBot`, with no upper branch and no exemption.
- Elevator-shaft occlusion of floor-3 floor points: a plan point is hidden when
  `v − u` is in ~[174, 311] (that is what cuts the board's far-right corner and
  the queue's tail).
- Painter order inside a floor is manual, far-to-near; billboards (staffage)
  always anchor at the bottommost pixel; `spriteShadow` exists because a u/v
  footprint quad reads as a stray streak.
- `dw-clip-board-screen` (UPDATE #55) is the board's top face as a screen-space
  polygon; it wraps the fleet shadows so they can only appear on the board.

## 5. Sprite generation pipeline (nano-banana, wireframe-only)

1. `generated/dev/make_wire_<name>.py` — draw the object's red wireframe in the
   diorama projection at S=10: `along = (-cos19.29°, -sin19.29°)·S`,
   `depth = (cos19.29°, -sin19.29°)·S`,
   `vert = (0, -4·sin19.29°·S)` (= 13.215 px per h-unit at S=10). Draw the front
   figure as a white silhouette so occlusion is communicated.
2. Generate with the nano-banana MCP: the wireframe as the ONLY input
   (`input_image_path_1`), `mode: generate`, `n: 2–3`. Extra inputs drag the
   style/projection off-model.
3. Pick a candidate — `generated/dev/pick_<name>.py` compares each candidate's
   per-column silhouette against the wireframe (normalized bbox); also check the
   corners are white (keyable).
4. `generated/dev/key_cut_<name>.py` — white→alpha (border flood + coarse seeded
   flood for enclosed pockets), despeckle, bbox crop, then print the constants.
   **SCALE TRAP**: the wireframe is drawn ~13.2x larger than the diorama, so
   `content_px / 13.215 = diorama units`; pick the placed width/height in diorama
   units, then `k = TARGET / content_px` and `ax/ay = bottommost_pixel · k`
   (`key_cut_fleet.py` uses `W_TARGET`; it is 74 for the fleets).
5. Integrate: add the `const` near the other sprites, call `assetProp(...)`,
   put the PNG in `src/assets/` (base64-inlined at build time).
6. **If the user hand-edits a sprite in place** (they do, e.g. the fleet-B
   recolour): compare against `git show HEAD:<path>` (write via
   `cmd /c "git show … > tmp.png"` — PowerShell redirection corrupts binaries),
   check the opaque bbox + bottommost row, re-measure `ax/ay` (and `k` only if
   the size changed), and note the reason in a comment.

## 6. Current content inventory

- **Ground**: entrance portal + threshold, career sign (placeholder content — the
  real text is Stage 7), terrain/path. Puelo Games: media kiosk (Space Invaders
  screen), stool pair, 3 crates. BA Technology: whiteboard on partition-2's face,
  round meeting table + chairs/people/papers at (78, 254). Freelancer: staircase,
  PC at (82, 514.5), paper mess, wall-base piles.
- **Floor 1 (2017–2019)**: Nextcode — pamphlet on the rear wall (u 26..90), WS_D
  desk at (110, 470), 2 crates, 4-dev sprite group at (20, 346). Health Platforms
  — 3 server racks on the B-D wall (u 230.5, v 20..94), electrical panel +
  conduit drop, the seated-DBA vignette (sitter at (160, 82), 4 ream towers, 3
  open paper boxes painted above the sitter).
- **Floor 2 (2019–2025, Interactica)**: yellow service pipes (riser at u 227.5,
  v 60, base grounded via `PIPE_DROP`), workstations WS_D / WS_C against the B-D
  wall (`uBack 213.5`, v 82 / 26), the Cleverlit stand kiosk at (65, 11.5), the
  front-facing server beside the elevator (`serverRackFront(52, 68, 220, …)`),
  two SVG cable runs (`kioskCables`), the city-model board (`CITY_BOARD` at
  (123, 167)), and the tech-lead vignette at the rear C-D wall: five seated devs
  (`SITDEVS` at (91, 531)), the lead (`TECHLEAD` at (98, 564)) + SVG
  `graphScreen(90, 134, v=LD-WALL_T-1.5, 2*FH+14, 2*FH+40)`, plus the AR/VR
  person (`ARVR_PERSON` at (24, 363)) with `holoScreen(4, 26, 376, …)`.
- **Floor 3 (Interactica large area + separate Indelve strip)**:
  - Interactica side: `TEAMCROSS` (cross of 4 desks + 8 seated devs) at
    (100, 80) and `BOSSES` at (52, 83), BOTH in the `floor-03-team` fragment
    (between `floor-03` and `floor-04`: below the floor-4 base but above the
    floor-03 slab); keep `u ≥ ~50` (the front-left `slabTriangle` repaints
    u 0..48.2, v 0..222.4).
  - Right (B-D) wall: two taped app screenshots via `wallAppBoard(cfg)` —
    `IMC_HOME_BOARD` (`02-imc-home.png`, v 56..103.07) and `HUB_LIVE_BOARD`
    (`00-hub-menu.png`, v 5..52.07), both 47.07 x 73 paper, letterboxed images.
  - Indelve (rear C-D wall + floor): `indelveWallBranding()`/`cdWallSheet()`
    mount `trantorian-logo.png` (u 10..62) and the promo screen
    (`trantorian-screen.jpg`, bezel 55.46 x 32.07, u 72..127.46). On the floor:
    `indelveBoard()` (the hex board above), `indelveFloorProps()` (two PC towers
    `PCTOWERS` pinned to `TOWER_XY [446, 468]` with a `.dw-cable` run from the
    screen, the `PRESENTER`, the AR/VR demo person `TRANTORIAN_VR` pinned to
    `VR_XY [455.5, 476]`, and the `QUEUE` of 3 people groups running `-v`), and
    the two fleets (`indelveFleetA()` in `indelve-fleets`, `indelveFleetB()` in
    `floor-03` after the props).
- **Floors 4–5**: architectural shell + tags only (floor 5 = WIP, unfinished, by
  design). **Do NOT invent Pacer (4th) or Indelve content** — the brief has none.
- **Elevator**: shaft + doors + per-story open doors, service conduit + junction
  boxes, year plaques (`vMid = 266.658`).

Sprite constants in `scripts/generate-geometry.mjs`: `PUEL_KIOSK`,
`PUEL_STOOLS`, `PUEL_TABLE`, `FREELANCER_PC`, `DEV_GROUP`, `SITTER`,
`STANDKIOSK`, `WS_C` (+`assetWorkstation`), `WS_D`, `PIPE_SPRITE`,
`PIPE_H_SPRITE`, `CITY_BOARD`, `ARVR_PERSON`, `SITDEVS`, `TECHLEAD`,
`TEAMCROSS`, `BOSSES`, `PCTOWERS`, `PRESENTER`, `TRANTORIAN_VR`, `QUEUE`,
`FLEET_A`, `FLEET_B`.

## 7. Pending work / next steps

1. **Continue the review loop** (the main pending work). The user reviews
   `generated/dev/r96.png`; the next render is `r97.png`. Expect a revision list
   with exact numbers; keep the §2 loop and commit only when asked.
2. **Known open cosmetic items on floor 3 Indelve** (candidates for the user's
   next list): the fleet shadows are subtle against the dark nebula (raise the
   opacity or add a dedicated `.dw-fleet-shadow` class if asked); both fleets'
   fighter spread extends past the board edge onto the wood floor (only the
   shadows are clipped, not the sprites); the near fleet's hull still crosses the
   board's near-left corner and the "Indelve" plaque's right edge (it is drawn
   over the plaque by design now); the board's far-right corner + fleet B's stern
   remain hidden behind the elevator (user-accepted).
3. **Not-yet-done content** (ask the user before starting): the rest of the large
   floor-3 Interactica area, any further Indelve props (do NOT invent Indelve
   content), and floors 4/5 props (**confirm with the user first** — Pacer content
   is undefined). Then Stage 6 (career content) → 7 (information layer) → 8
   (display modes incl. the `?overview` query param) → 9 (Vue integration) →
   10 (polish/deploy to GitHub Pages).
4. **Housekeeping**: `AGENTS.md` → "Development Status" is accurate (Stages 0–5
   done, 5.5 in progress) but its pointer still names the ORIGINAL continuation
   doc; point it at THIS file (done in the same commit that added this file — if
   you are reading a later round, check it again).
5. **Stage-10 item**: `src/svg/diorama.svg` is ~15.8 MB, almost all base64 sprite
   PNGs. A downscale/re-encode pass (or external `<image href>` files) is needed
   before deployment.
6. Never commit `src/assets/*.tmp` (0-byte save leftovers from the user's image
   drops) — they show up as untracked and must stay out of commits.
7. Acceptance criteria for calling 5.5 complete: `.agent/todo/STAGE_05.5_VISUAL_ENRICHMENT.md` §17.
