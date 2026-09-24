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

Last round: **UPDATE #52** (2026-09-24) — the two Indelve fleets moved to the
board's corners per the user's instruction (left fleet → the board's near-left
corner, other fleet → the far-right corner, which the elevator shaft hides —
explicitly allowed by the user). Each fleet capital now sits just inside its
corner (the fleet sprite carries its capital in the sprite's UPPER-LEFT, so the
anchor was solved for the capital, not the sprite rectangle's centre). Latest
render: `generated/dev/r91.png` (crops `chk-fleets`, `chk-indelve-wide`).

Earlier, **UPDATE #50/#51** — NEW spaceship fleets (`FLEET_A`/`FLEET_B`,
`fleet-a-01-cut.png` / `fleet-b-01-cut.png`; pipeline `make_wire_fleet.py` → NB2
(n=2 each) → `pick_fleet.py` picked the `_2` candidate for both →
`key_cut_fleet.py`, W_TARGET 42; each sprite = 1 capital + 4 fighters, painterly,
facing each other). #51 fixed the r87 review read ("ships parked on the floor"):
each fleet gained a board/floor-plane contact shadow 10u below its hull via a new
optional `bulge` arg on `spriteShadow` (1.5 for fleets vs 1 for standing
figures). Fleet anchors currently `A (u -34.4, v 395.4)`, `B (u 47.1, v 294.5)`,
both at `h = 3*FH + 10` — screen-space anchors, so their plan projection is
outside the board by design (see the comment in `indelveFleets()`).

Earlier, **UPDATE #49** — board retuned per the user: moved beside the elevator
(it is allowed to be partially hidden by the shaft) and shrunk 10% with floor
margin around it → `BOARD = { u0: 5, u1: 98.6, v0: 351, v1: 465, R: 9 }` (the
down-right move of the user's r79 review); hexes now filled with blue at 50%
(`.dw-hex` fill #1f7fd0, fill-opacity 0.5) and the rectangle border removed.

Earlier, **UPDATE #48** — NEW Indelve virtual-combat board (`indelveBoard()`):
`deep-space.jpg` nebula + SVG electric-blue hex grid on the floor.

Earlier, **UPDATE #47** — 3 queue copies with a ~5px gap between them.

Earlier, **UPDATE #40** — the `PCTOWERS` sprite was nudged +15 px right / +15 px
down on screen via a new optional screen offset on `assetProp`/`spriteShadow`
(this also fixed a latent `cx="NaN"` string-arithmetic bug in `spriteShadow`:
all sprite contact shadows were previously invisible and now render).

Earlier, **UPDATE #39** — the two Indelve PC towers became a **generated
sprite** (`PCTOWERS`, `src/assets/pctowers-01-cut.png`; pipeline:
`generated/dev/make_wire_towers.py` → `pctowers-wire.png` → NB2 (wireframe
input, n=2) → `pick_towers.py` picked `pctowers-cand.png` (silhouette err
0.037) → `key_cut_towers.py`, W_TARGET 23px, anchor = pair front-left foot).
They face the building's front wall (-v), are less tall / a little longer than
the retired SVG boxes (physical height ~19 u), and sit near the C-D wall at
`p(131, 564, 3*FH)`. Committed as `22ab3a8` together with `#37-#38`.

Earlier, **UPDATE #38** — Indelve wall logo + screen nudged right
(`indelveWallBranding`: logo u 10..62, screen u 72..) and the screen grown 10%
(image 53.46u, bezel 55.46 x 32.07); first cut of the PC towers + `.dw-cable`.

Earlier this session, **UPDATE #37** — (1) sheet B `IMC_HOME_BOARD` forced to
sheet A's exact paper size (`size: { W: 47.07, H: 73 }`) — `wallAppBoard` gained
an optional `size` and always letterboxes the screenshot inside the paper
(`xMidYMid meet`), so the portrait IMC shot sits centred (25.9 x 56) on the same
paper as HUB; the floor-4 slab lops its top-left corner (user accepted).
(2) Indelve rear-wall branding first added (`indelveWallBranding()` +
`cdWallSheet()`): the user's `trantorian-logo.png` and `trantorian-screen.jpg`.

**Pending on the user:** review `r91.png` (the fleets now sit on the board's
corners; the right-corner fleet B is fully hidden by the elevator — allowed).
UPDATE #40-#52 plus all the new assets (`presenter-01-cut.png`,
`trantorian-vr.png`, `queue-01-cut.png`, `deep-space.jpg`, `fleet-a-01-cut.png`,
`fleet-b-01-cut.png`) were COMMITTED together at the end of the session, so the
tree is clean here.

## 1b. Start-of-session checklist (fresh session)

1. Read this file, then `AGENTS.md` (the restriction on >30 images and the
   free-assets-only rule) — the full history in
   `STAGE_05.5_VISUAL_ENRICHMENT_CONTINUE.md` only on demand.
2. `git log --oneline -5` + `git status` — expect a CLEAN tree at the
   `stage 5.5 UPDATE #40-#52` commit (everything up to and including the Indelve
   fleets is committed).
3. Sanity-render before touching anything: the commands in §2 produce
   `generated/dev/rNN.png`; compare it with the previous round's PNG if the
   user reports something broken.
4. Wait for the user's revision list, implement, re-render, report with the
   render path + crop names. Commit only when the user asks.

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
  `x = p(anchor).x - ax`, `width = w*k`). `spriteShadow(sp, u, v, h, off,
  bulge = 1)` adds the soft contact ellipse (`bulge` scales it: 1 = a standing
  figure, ~1.5 = a hovering fleet).

## 4. Occlusion / layering rules and traps

Assembler order (`scripts/assemble-svg.mjs`) — this matters:
```
terrain, ground-shadow, building[ floor-ground, staircase, freelancer-props,
floor-01, floor-02, floor-03, floor-03-team, floor-04, floor-05,
architectural-details, elevator, floor-02-front, floor-03-front,
floor-04-front, floor-05-front, tags ], entrance, path, career-sign
```
- **TRAP: the `*-front` fragments are drawn AFTER `elevator`.** Anything that
  must be occluded by the shaft may NOT live there. Conversely, anything that
  must lie ON a floor surface (e.g. the SVG cables) must come after that
  floor's `slabTriangle` (which lives in the `-front` fragment) — but note the
  cables' route now avoids the triangle's rect entirely, so they can live in
  `floor-02` for the sake of the elevator layering.
- Current floor-2 stacking (r36):
  - `floor-02` = `slab` → `backWalls` → pipes → desks → AR/VR staffage
    (`spriteShadow` + `ARVR_PERSON` + `holoScreen`) → city board
    (`spriteShadow` + `CITY_BOARD`) → `kioskCables` → `serverRackFront` (so the
    cables, server, city and AR/VR vignette all sit BELOW the elevator layer;
    the cable run still ends in the server). The AR/VR person and city board do
    not overlap anything on screen, but floor-02 is the correct layer for the
    person because he stands physically behind the shaft.
  - `floor-02-front` = `slabTriangle` → `STANDKIOSK` → `columns` (the kiosk is
    therefore ABOVE the cables, which is what the user asked: the run emerges
    from under the kiosk's mini PC).
- Slab-cut envelope (CORRECTED in UPDATE #28): a slab's cut band hides points
  with `hBot ≤ h + 0.495·min(u,v) ≤ hTop`. On floor 1 everything must satisfy
  `h + 0.495·min(u,v) ≤ 197.5` (the floor-2 slab band). **TRAP: this is a
  ONE-SIDED bound with NO upper branch and NO exemption** — a point is hidden
  whenever `h + 0.495·min(u,v) ≥ hBot`, even for very large `min(u,v)`. (The
  older "objects at `min(u,v) ≳ 172` clear the band" / "the B-D-wall side is
  exempt" claims were WRONG; `r43.png` erased a whole cluster that way.) For
  floor 3 the band is `h_local + 0.495·min(u,v) ≤ 92.5`: seated devs (top ~20u)
  need `min(u,v) ≲ 146`, standing figures (top ~33u) need `min(u,v) ≲ 120`.
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
  vertical riser at u 227.5, v 60; base grounded in UPDATE #25 via `PIPE_DROP`),
  the two workstations WS_D and WS_C side by side against the B-D wall
  (`uBack = 213.5`, v 82 / 26), the Cleverlit stand kiosk at the front-left
  corner area (`assetProp(STANDKIOSK, 65, 11.5, 2*FH)`), the front-facing small
  data server beside the elevator (`serverRackFront(52, 68, 220, 2*FH,
  2*FH+38)`), and two SVG cable runs (`kioskCables`) from the kiosk's mini PC to
  the server, drawn below the kiosk. UPDATE #25 added the city-model board
  (`assetProp(CITY_BOARD, 123, 167, 2*FH)`, centre (144,188) — the user's first
  red mark). UPDATE #26 added the tech-lead vignette at the rear C-D wall:
  five seated devs with laptops (`SITDEVS`), a standing tech lead (`TECHLEAD`)
  pointing at an SVG graph screen (`graphScreen(90, 134, LD-WALL_T-1.5,
  2*FH+14, 2*FH+40)` — see the cutaway constraint note in the generator).
  UPDATE #27 (r38 review, following the user's red arrows) set the final
  positions: devs `assetProp(SITDEVS, 91, 531, 2*FH)` (v 559 → 531, ~36u off
  the wall), tech lead `assetProp(TECHLEAD, 98, 564, 2*FH)` (centred under the
  screen), AR/VR `assetProp(ARVR_PERSON, 24, 363, 2*FH)` + `holoScreen(4, 26,
  376, 2*FH+12, 2*FH+34)` (v 403 → 363, toward the elevator; the holo panel is
  emitted BEFORE the sprite so it sits in a layer below the person — r39
  review). The floor-2 left section now reads as a busy engineering room.
- **Floor 3 (Interactica large area + separate Indelve strip)**: UPDATE #34
  `assetProp(TEAMCROSS, 100, 80, 3*FH)` (cross of 4 desks + 8 seated devs,
  k 0.06568, sprite rect x 740..814 / y 563..626) and
  `assetProp(BOSSES, 52, 83, 3*FH)` (two bosses + tech lead debating over
  papers, k 0.0255) to its left. **Both live in the `floor-03-team` fragment,
  stacked between `floor-03` and `floor-04`** — below the floor-4 base (user
  requirement) but above the floor-03 slab. Two hard constraints:
  (1) the floor-4 slab occludes anything deeper (measured: 99% of the
  teamcross's pixels visible at v=68, 95% at v=80, 84% at v=96, 65% at
  v=100), so deep/left placement is capped; (2) keep u ≥ ~50 for the bosses
  (`slabTriangle(3*FH)` in `floor-03-front` repaints the front-left floor
  rectangle u 0..48.2, v 0..222.4 over anything earlier).   The A column
  (`floor-03-front`) still paints OVER the sprites.
- **Floor 3 wall boards (UPDATE #35/#36, resized #37)**: `wallAppBoard(cfg)`
  (end of `floor-03`) prints app screenshots on paper taped flat to the right
  (B-D) wall next to the B corner (`u = LW - WALL_T`): sheet B `IMC_HOME_BOARD`
  (`02-imc-home.png`, v 56..103.07) and sheet A `HUB_LIVE_BOARD`
  (`00-hub-menu.png`, v 5..52.07), both **47.07 x 73** (h 318..391), sheet A
  drawn last so its paper laps sheet B's shadow. One matrix per sheet on the
  wall plane: `matrix(0.7071 0.2475 0 1 ox oy)`; the local rect == `uFace(...)`.
  UPDATE #37: sheet B carries a fixed `size` (no slab auto-solve) and both
  screenshots are letterboxed inside their paper (`xMidYMid meet`) so nothing is
  stretched; the floor-4 slab clips sheet B's top-left (accepted). Marks are
  functions of `({ sx, sy, shot, k })` addressing the screenshot by fraction. NB
  `round()` returns a STRING — never use it inside arithmetic.
- **Floor 3 Indelve wall + floor (UPDATE #37/#38)**: `indelveWallBranding()`
  + `cdWallSheet()` (end of `floor-03`, after the boards) mounts the user's
  `trantorian-logo.png` (plain RGBA decal, u 10..62, local h 12..51.7) and a
  promo screen (`trantorian-screen.jpg`, dark `dw-graph-frame` bezel 55.46 x
  32.07 + 16:9 image, u 72..127.46) on the C-D rear wall's left end.
  `cdWallSheet` uses the wall-plane matrix `matrix(0.7071 -0.2475 0 1 ox oy)`
  anchored at `p(u0, LD-WALL_T-0.4, 3*FH + localH)` — REMEMBER the `3*FH` base
  (p() wants the GLOBAL height). `indelveFloorProps()` then adds two PC towers
  as a generated sprite (`PCTOWERS`, `pctowers-01-cut.png`, faces -v), pinned
  to the absolute screen top-left `TOWER_XY = [446, 468]` (offset derived from
  the plan anchor p(131, 564, 3*FH), so the plan anchor stays the wall-side
  foot), a `.dw-cable` that drops straight down the wall from the screen's
  bottom edge then runs along the floor into the towers' foot, the presenter
  sprite (`PRESENTER`, user-edited to face the B-D wall, foot at
  p(68, 546, 3*FH), 45.8u) between the logo and the screen, the AR/VR demo
  person (`TRANTORIAN_VR`, pinned to the absolute screen top-left
  `VR_XY = [455.5, 476]`, 34.5u) between the screen and the towers, and the
  queue of four people (`QUEUE`, user-inverted, anchor p(110, 485, 3*FH))
  repeated 3× along `-v` with a ~5px gap (`QUEUE_STEP = 34.8`, `qv` 485 /
  450.2 / 415.4) so it runs -v (down-right) behind the VR person and its tail
  is cut by the elevator shaft. The virtual-combat hex board (`indelveBoard()`,
  `BOARD` u 5..98.6 / v 351..465, `deep-space.jpg` + SVG hex grid, blue cells
  @50%, no rectangle border) lies on the floor beside the elevator (its far-right
  corner is hidden by the shaft: a floor point is occluded when `v-u` is in
  ~[174, 311]) and under/left of the queue. `indelveFleets()` then adds the two
  spaceship fleets on the board plane 10u above it (`h = 3*FH + 10`) — one over
  each of the board's left and right corners (the right one is hidden by the
  shaft), each with its contact shadow on the floor 10u below — see the
  UPDATE #50-#52 notes in §1.
  All drawn last so they paint over the cream section-divider fill; the floor-4
  slab clips the screen's top (user accepted).

- **Floors 4–5**: architectural shell + tags only. Floor 5 is intentionally
  unfinished (WIP). Props for 4/5 are deferred by user decision until 1–3 are
  settled.
- **Elevator**: shaft + doors + per-story open doors, service conduit +
  junction boxes (SHAFT_V1-relative), year plaques on the enclosure.

Sprite constants currently in `scripts/generate-geometry.mjs`:
`PUEL_KIOSK`, `PUEL_STOOLS`, `PUEL_TABLE`, `FREELANCER_PC`, `DEV_GROUP`,
`SITTER`, `STANDKIOSK`, `WS_C` (+`assetWorkstation`), `WS_D`, `PIPE_SPRITE`,
`PIPE_H_SPRITE`, `CITY_BOARD`, `ARVR_PERSON`, `SITDEVS`, `TECHLEAD`,
`TEAMCROSS`, `BOSSES`, `PCTOWERS`, `PRESENTER`, `TRANTORIAN_VR`, `QUEUE`,
`FLEET_A`, `FLEET_B`.

## 7. Next steps / open items

1. Take the user's next revision list (they review `rNN.png` + the crops). Next
   render is `r92.png` (they last saw `r91.png`: Indelve board + fleets on the
   board's corners). Known minor consequences to expect feedback on: at the
   corners the fleets straddle the board edge (the capital hull is partly over
   the wood floor) and their soft contact shadows fall partly off the board onto
   the floor — physically honest, but the user may want them pulled inboard or
   the shadows dropped.
2. Floor-2 left section is now busy (city board + AR/VR vignette + seated-dev
   group + tech lead + graph screen); floor 3 now has the Interactica team
   cluster + bosses. Likely next direction: more floor-3 content (the rest of
   the large Interactica area, or the Indelve strip — but do NOT invent Indelve
   content) or floors 4/5 props; **confirm with the user before starting 4/5**.
3. Housekeeping whenever convenient: `AGENTS.md` → "Development Status" is
   still stale boilerplate ("Stage 0 is next"); refresh it to Stages 0–5 done,
   5.5 in progress.
4. Keep the acceptance criteria of `.agent/todo/STAGE_05.5_VISUAL_ENRICHMENT.md`
   §17 as the guide for when 5.5 can be called complete.
5. After 5.5: Stage 6 (career content) → 7 (information layer) → 8 (display
   modes incl. the `?overview` query param) → 9 (Vue integration) → 10
   (polish/deploy to GitHub Pages).
6. Known Stage-10 item: `src/svg/diorama.svg` is ~15.8 MB, almost all of it
   base64 sprite PNGs (bosses 1.27 MB, sitdevs 1.03 MB, teamcross 0.95 MB,
   arvr 0.87 MB, techlead 0.76 MB, plus the two app screenshots). A
   downscale/re-encode pass (or external `<image href>` files) is needed
   before deployment.
7. Never commit `src/assets/*.tmp` (0-byte save leftovers from the user's
   image drops); they show up as untracked and must stay out of the commit.
