# Stage 05.5 Visual Enrichment — Continuation

## Session Context

This file documents the state of Stage 05.5 (visual enrichment of the SVG
career diorama) at the end of the session of 2026-09-08. The previous
handoff (from the prior session) is in the AGENTS.md work state; this file
covers ONLY what happened in this session.

## UPDATE #6 — 2026-09-11, sixth session (PC recalibrated + end-of-run; paper storm; floor-1 Nextcode)

1. **User hand-edited `src/assets/freelancer-pc-01-cut.png`** (CRT now faces
   the entrance side). Sprite dims unchanged (475×544) but the anchor pixel
   moved in-canvas: bottommost opaque pixel now at sprite-px ≈(169.5, 541)
   → constants `ax 16.98 → 9.69`, ay unchanged (30.93). k stays 0.05717.
2. **PC nudged to the END of the flight's run** (user request):
   `assetProp(FREELANCER_PC, 82, 514.5, 0)` (was 53; flight u 22..127).
   Contact shadow follows (`hFace(80,102,512,543,0)`).
3. **BA round table nudged "just a little more to the right"**: anchor
   `(54, 254, 0)` → `(62, 254, 0)`; shadow `hFace(52,116,246,326,0)`.
   Wedge margin ~3-4u (limit 89.4); render confirms no clipping.
4. **Occlusion envelope rule DISCOVERED (important for all future props):**
   the left cut band of a slab (at u=0, h ∈ [hBot,hTop]) hides points with
   `hBot ≤ h + 0.495·u ≤ hTop` (when v ≥ u; nearer along the view dir
   d = (1,1,-0.495)·norm). This explains the handoff note's
   `h < 92.5 - 0.495u` (the floor-01 band, hBot=92.5) and gives floor-1's
   envelope `197.5 ≤ h + 0.495u ≤ 210` — floor-1 props fully visible at
   u ≲ 114 (desk tops ~127) unless v < u (the B-D-wall side is exempt,
   which is why the floor-1 rack is fully visible).
5. **Paper audit at the new PC position** (PC sprite screen bbox
   x 434.5..461.7, y 806.2..837.3): a front-of-stair stack at (u,v)
   overlaps iff `-445.4 < u-v < -398.6` AND `581.3 < u+v < 722.8`
   (sheet 6.5u×9u far tip included; partition-2 face also caps u-v ≤ -402.5).
   Deleted the four stacks inside the band: (95,510), (110,525),
   (100,535), (125,535) — these were the user-circled artifacts (piles
   painting over the stair side face / PC).
6. **Paper storm extended (user red pins)**: 4 more tread sheets rising
   with the flight (steps 5/7/9/11: u 61/78/96/113, h step+0.4); 2 sheets
   pasted on the flight's solid side face (v = STAIR_V0-0.4, u 65 h 24 /
   u 95 h 42, kept below the 1:1 profile top); 3 sheets on partition-2's
   front face (u_p 8 h 30 left of the passage; u_p 150 h 16 and u_p 172 h 8
   right of the whiteboard, inside the slab-cut envelope); 2 sheets on
   partition-1's front face right of its passage (u_p 100 h 35, u_p 148
   h 22); 3 more rear-wall sheets (u 5 h 40, u 21 h 55, u 19 h 86); 6 more
   floor stacks (front-left strip 4,410/6,420 and the flight-base wedge
   6,500/16,540/46,522/60,530). Helper generalized: `vWallSheet(v, u, h,
   rot)` — one function for the rear C-D wall, the partition front faces
   and the stair side face; `wallSheet()` delegates to it.
7. **Floor-1 pass (user: "after that we can continue with 1st floor")**:
   Nextcode section populated — `assetWorkstation(WS_D, 110, 470, FH)`
   (the notebook-desk sprite, same furniture language as floor-2) + two
   shipping crates (`crate(26,36,468,478,FH,FH+12)`,
   `crate(28,44,452,466,FH,FH+15)`). Fully visible per the new envelope
   (h_top+0.495·110 = 181 < 197.5). Health Platforms stretch left as-is
   (rack + panel already carry it).
8. Verified in render (`generated/dev/r6.png`, crops `zoom-f1.png`,
   `zoom-fl4.png`, `zoom-fl5.png`, `overview.png`); lint clean. User
   review pending.

## UPDATE #5 — 2026-09-11, fifth session (BA whiteboard + table, PC mid-run, physical sign)

User revision list, all verified in render (`generated/dev/r3.png`, crops
`zoom-ba2.png` / `zoom-ba.png` / `zoom-fl.png` / `zoom-sign.png` / `overview.png`):

1. **BA meeting table nudged deeper into the section.** Anchor (near chair
   leg) moved `assetProp(PUEL_TABLE, 36, 254, 0)` → `(54, 254, 0)` (+18u
   toward the B-D/right wall). Contact shadow follows
   (`hFace(44,108,246,326,0)`). Wedge margin still ~12u inside the
   `u < v - 164.6` left-wedge rule (limit 89.4 at v=254); render confirms
   the sprite fully visible.

2. **Blackboard → whiteboard** (`blackboard()` rewritten as
   `whiteboard()`, group id `whiteboard`). Same wall (partition-2 front
   face, proud 2u). Left-bottom corner FIXED at (u 78, h 8) per user
   request; top edge raised to the passage head height `h1 = DOOR_H =
   52.5` (was 36) and width doubled to `u1 = 142` (32u → 64u). White
   writing surface + light aluminum frame + marker tray with two pens
   (blue/black). Content: 4 cols × 3 rows spreadsheet grid with header
   row (A–D) and LEGIBLE engineering-calc entries (q=12.4, L=6.2,
   P=48.6, M=PL/4, V=41.2, =75.3, Σ=118.4, k=1.35) as SVG `<text>` on
   the wall-face plane `matrix(0.7071 -0.2475 0 1 …)` — the Petroplastic
   spreadsheet metaphor now readable. Hand strokes: circled result +
   wavy underline (deterministic). Classes: `dw-board-slate` →
   `dw-board-face` (white), `dw-chalk*` → `dw-marker*`; new
   `dw-pen-blue` / `dw-pen-black` / `dw-board-tray[-top]` /
   `dw-marker-head` / `dw-marker-text`.

3. **Known render fact (user to judge at review):** the whiteboard's
   top-right region tucks under the floor-1 slab cut (the slab's left
   cut band at u=0 occludes board points where `h + 0.495u > ~105`).
   The cut is a clean diagonal consistent with the cutaway language;
   if it reads wrong, fallbacks: cap the width (~u 131 keeps the full
   door height visible) or lower the top.

4. **Freelancer PC moved to mid-run** (user: "too near the beginning").
   `assetProp(FREELANCER_PC, 26, 514.5, 0)` → `(53, 514.5, 0)`; the flight
   runs u 22..127 (STAIR_U0=22, STAIR_RUN=105, rise 1:1) so the anchor now
   sits at the run's middle; tower back stays flush on the stair's solid
   side face (v = STAIR_V0 = 540.5), keyboard/monitor facing -u. Contact
   shadow follows (`hFace(51,73,512,543,0)`).

5. **Paper-mess audit vs the new PC position.** Collision rule derived:
   a front-of-stair stack at (u,v) overlaps the PC sprite's screen bbox
   iff `-493 < u-v < -437.9` AND `551.8 < u+v < 692.4` (sheet plan size
   6.5u × 9u far-tip included). Fixes: `(70,525,3)` → `(20,513,3)`
   (left cluster, clear of the PC), `(55,510,1)` → `(55,490,1)`,
   `(45,535,2)` dropped (2px tip into the PC's left edge), and the
   earlier `(90,535)` nudge corrected to `(100,535)` (the first nudge
   still overlapped — the u-v band check catches it). All remaining
   stacks + the two tread sheets verified outside the PC bbox.
   **Partition-2 wall face verified clear**: every freelancer sheet's
   screen bbox ends at x ≤ 464.6, the partition-2 face starts at x 470.

6. **Career sign is now a physical object** (user decision). `careerSign()`
   rewritten in screen space: wood-framed board (172×122, `dw-sign-frame`
   in the crate-wood family) on TWO posts planted in the terrain (right
   post nearer, ground line lower), soft blurred contact shadow ellipse on
   the terrain. Placeholder content unchanged (photo circle + two text
   bars; final content remains Stage 7).

7. Housekeeping: `scripts/tmp-build-html.mjs` deleted (it wrote into the
   unreadable temp dir). `.gitignore` += `.playwright-mcp/`, `Thumbs.db`,
   `Desktop.ini` (rest reviewed: node_modules/dist/generated/logs/
   opencode.json already covered; `src/svg/diorama.svg` stays committed as
   the shipped artifact). NOTE: AGENTS.md "Development Status" still says
   "Stage 0 is next" — stale boilerplate, should be refreshed at some point.

8. Lint clean. User review pending (items 3 and the sign's frame weight
   are the visual calls).

## UPDATE #4 — 2026-09-11, fourth session (BA blackboard + freelancer PC/papers)

User revisions, all verified in render (`generated/dev/chk.png`, crops
`zoom-ba2.png` / `zoom-fl.png` / `zoom-ground.png` / `overview.png`):

1. **Meeting table corrected to true scale and centred.** Root cause found:
   the earlier `key_cut_table.py` set `SPAN_TARGET = (u_ext+v_ext)*0.7071`
   (128*0.7071 = 90.51) but the group's actual horizontal span is the
   `(max(u-v) - min(u-v))` span = 96*0.7071 = 67.88 px — the table was
   1.33x oversized. Constants now `k=0.11846, ax=52.36, ay=50.94` (user's
   hand-edited `meeting-01-cut.png` re-measured: bottommost pixel moved
   441,434 → 442,430). Anchor (object (14,4), the near chair leg) placed at
   `assetProp(PUEL_TABLE, 36, 254, 0)` — the visible centre of the BA
   section; contact shadow follows (`hFace(26,90,246,326,0)`). Visibility
   rule for BA props behind partition-1: visible iff `u < v - 164.6`
   (passes left of the wall) OR `h + 0.495(v-164.6) > 92.5` (over the top);
   the new position keeps every point in the left wedge (margin ~30u).

2. **Blackboard moved to the visible wall.** The old board sat on the B-D
   wall (u=228.5) which is invisible below the floor-1 slab — confirmed by
   render. Rewritten on partition-2's front face (`vW = PARTITION_G[1] -
   WALL_T/2`), proud by 2u, at `u 78..110, h 8..36` (right of the doorway,
   inside the slab-visible envelope `h < 92.5 - 0.495u`). Chalk spreadsheet
   grid (6 cols x 4 rows) + number/equation scribbles, full SVG, classes
   unchanged (`dw-board-*`, `dw-chalk*`).

3. **Freelancer desk removed.** `freelancer-desk-01-cut.png` moved to
   `generated/drop/`; the constant and its `assetProp` call are gone.

4. **Floor PC integrated** (`src/assets/freelancer-pc-01-cut.png`, generated
   by the wireframe-only pipeline: `make_wire_pc.py` → `pc-cand.png` →
   `key_cut_pc.py`). True-scale constants `k=0.05717, ax=16.98, ay=30.93`
   (same span pitfall as the table: actual (u-v) span 38, not 44). Placed
   `assetProp(FREELANCER_PC, 26, 514.5, 0)`: tower back flush against the
   staircase's solid side face (v = STAIR_V0 = 540.5), beside the stair
   base, keyboard/monitor facing -u; soft `dw-contact` quad underneath.

5. **Papers everywhere (SVG).** New helpers `paperSheet` / `paperStack` /
   `wallSheet` + `.dw-paper` style (near-white, below the plaques). Sheets
   scattered across the freelancer floor wedge (`u < v-399.8`), pasted on
   the C-D wall (u<22), and dropped on the lower stair treads. Painter
   order matters: sheets in FRONT of the stair (v < 540.5) live in the new
   `freelancer-props` fragment (assembled AFTER `staircase`, so the PC and
   those sheets paint over the stair); sheets behind/left of the stair and
   the C-D wall sheets stay in `floor-ground` so the staircase occludes
   them correctly. All placements verified inside the visible wedges.

6. **Pipeline notes for future sprites.** Compute `SPAN_TARGET` from the
   true horizontal span `(max(u-v)-min(u-v))*0.7071`, NOT from the
   bounding u_ext+v_ext — groups not anchored at the (0,0) corner (like the
   meeting table and the PC) were oversized by 16-33%. Keep sprite anchors
   at the bottommost pixel and re-measure after any hand edit.

7. AGENTS.md corrected: `SVGMAKER_API_KEY` IS configured in `opencode.json`
   (the old "leave unset until the user provides it" note was wrong).


## UPDATE #3 — 2026-09-09, third session (workstation WS_C INTEGRATED)

1. **The 2-input EDIT (cand_3 + wireframe) FAILED** → `workstation-cand_4.png`:
   the style reference dragged the projection back (recede 28.1/27.6 deg,
   same 15.5u-too-short proportions). Nano-banana (Gemini 3 Pro Image)
   follows geometry only when the wireframe is the ONLY input.
2. **Self-built wireframe** `generated/dev/make_wireframe.py` →
   `generated/dev/ws-wire-own.png`: exact diorama projection derived from
   `p()` (AXIS 19.29 deg, |AXIS|=0.74953 screen-px per u/v unit, 1 h-unit =
   1 px vertical → vertical exaggeration 1.321; footprint 44x17u, desktop
   22u → 440x170x290.7 px at S=10).
3. **Wireframe-only generation** → `workstation-cand_5.png` (1215x864):
   table desk + monitor + keyboard + mouse + swivel chair, white bg.
   MEASURED: receding edges 19.32/19.34 deg, proportions 44.00 x 17.01,
   desk height 21.97u — essentially a perfect match to targets 44/17/22.
   GATE PASSED.
4. **Key/cut pipeline** `generated/dev/key_cut_ws.py` →
   `src/assets/workstation-03-cut.png` (787x735, offset 272,28 in cand_5).
   Two pitfalls fixed (see Technical Notes): the model kept the wireframe's
   floor rectangle as a thin "footprint" line, and the CHAIR splits the
   under-desk void into white compartments a border flood-fill cannot reach.
   Fix: protected erase of the footprint line + seeded floods
   (bg 626,950 → 840,945 px). RGB zeroed under alpha=0.
5. **Integration**: `WS_C` replaces WS_A/WS_B (constants in UPDATE #2 are
   obsolete). `assetWorkstation(WS_C, 221.5, 26, 2 * FH)` — ONE desk at
   v=26 per the user's earlier decision. Rack code untouched (verified
   earlier). depth=17.01 (the art's true u-depth, NOT 21.8) so the desk's
   back edge lands flush at uBack=221.5 keeping the 9u pipe gap.
6. **Verified in render** (own pipeline in generated/dev: make_chk.py,
   headless-Edge at S=2.5, crop_chk.py): story-2 zoom + overview — desk
   on-model with the architecture, legs grounded, pipe passes BEHIND the
   desk, under-desk void transparent (wall/floor show through), no white
   box. Lint clean. User review pending.
7. Dev tooling note: `C:\Users\ibej_\AppData\Local\Temp\opencode` is NOT
   readable by this session's tool permissions — all dev scripts now live
   in `C:\repo\cv\generated\dev\` (make_wireframe, measure_sprite,
   key_cut_ws, find_white_blobs, make_chk, crop_chk, list_floor02).

8. **Notebook VARIANT added** (user request): `workstation-cand_6.png`
   generated from the same wireframe (desk + open laptop + chair) →
   `src/assets/workstation-04-cut.png` (787x697). Measured 19.30/19.40 deg,
   44.00 x 16.98 x 21.88u — same gate pass. NOT integrated (variant for
   later choice). Ready-to-paste WS_D constants (k/ax/ay/depth/deskH):
   k=0.05511, ax=31.26, ay=16.37, depth=16.98, deskH=21.88.
   `key_cut_ws.py` now takes `<src> <dst>` args; seeding generalized to the
   full void height (between the desktop front edge and the floor lines).
   Both cut files verified blob-free (find_white_blobs.py).
9. **Unused sprite assets moved to `generated/drop/`** (user request):
   workstation-01-cut.png, workstation-02-cut.png, workstation-02-iso.png.
   Stale CSS comment in style.mjs updated. The user then hand-edited BOTH
   workstation sprites manually (cleaned the footprint-line stubs, subtle
   polish); geometry verified unchanged (corner deltas <=1px, gates still
   19.3 deg / 44 / 17 / 22).

10. **Style-enrichment pass done; notebook desk integrated.** Per-sprite
    Pro-tier nano-banana edit ("restoration-style polish": wood grain,
    warmer tones, sage screens kept) — an NB2/Flash attempt first REDESIGNED
    the desk and was discarded. Enriched candidates re-keyed with a
    bbox-relative rewrite of key_cut_ws.py (auto ranges, corner fits before
    seeding; the Pro renders carried no footprint line and no enclosed
    voids). Gates: 03 = 19.35/19.30 deg, 44.00 x 16.98 x 21.79u (1062x992);
    04 = 19.28/19.44 deg, 44.00 x 17.13 x 21.84u (1102x976).
    New WS_C constants k=0.04067 ax=31.15 ay=18.36 depth=16.98 deskH=21.79;
    WS_D (notebook variant) integrated BESIDE it on the Interactica floor:
    assetWorkstation(WS_D, 221.5, 82, 2*FH), constants k=0.03930 ax=31.16
    ay=16.40 depth=17.13 deskH=21.84. Render verified: both desks side by
    side, horizontal pipe + riser pass behind, under-desk voids transparent.
    User's pre-enrichment edits backed up in generated/dev/user-edit-backup/.
    crop_chk.py zoom-desks box retuned (794,650,900,732) to frame both desks.

## UPDATE #2 — 2026-09-08, second session (rack verified; ready for nano-banana)

1. **Rack order: VERIFIED by user.** Rebuilt (`svg:generate` + `svg:assemble`)
   and re-rendered. The row reads left-to-right `[tall-66][tall-62][short-38]`
   (tall far-left partially behind the floor-2 slab — correct depth cue;
   short near-right, painted last). User confirmed this is the intended
   order. Pending issue #1 below is RESOLVED — do not touch the rack code.
2. **Decision: ONE workstation sprite on floor-2** (user). At integration,
   replace BOTH `assetWorkstation(WS_A, ...)` and `assetWorkstation(WS_B, ...)`
   calls with a single `WS_C` sprite. Suggested slot: v=26 (near, best
   story-2 visibility) — final v chosen at integration.
3. **nano-banana MCP reconnected by the user, but tool exposure happens only
   in a NEW session.** The next session MUST do Phase 2 first thing:
   2-input EDIT (input 1 = `generated/workstation-cand_3.png`, input 2 =
   `C:\Users\ibej_\AppData\Local\Temp\opencode\ws-wire-ref.png`), prompt
   forcing the perspective change (both receding edges 19.29° = 35px rise
   per 100px horizontal; vertical emphasized; desk front face = 2/3 of the
   long edge's length), n=1 per call to avoid the previous timeouts.
4. **Render pipeline proven this session** (scripts in
   `C:\Users\ibej_\AppData\Local\Temp\opencode\`):
   - `make_chk.py` — wraps `src/svg/diorama.svg` into `chk.html` at S=2.5
     (3000×2625)
   - headless Edge screenshot:
     `& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless --disable-gpu --screenshot=chk.png --window-size=3000,2625 file:///.../chk.html`
   - `crop_chk.py <png>` — story-2 desk zoom (SVG 750-950 × 630-755),
     rack zoom (SVG 815-930 × 715-840), overview (thumb 1500)

## What Was Attempted This Session

### 1. Workstation sprite: affine correction attempt
- Discovered `generated/workstation-01-clean.png` was broken (the previous
  session's `fix_sprite.py` affine had buggy matrix math — the output was a
  sheared fragment of the sprite).
- Generated `workstation-02.png` via nano-banana with the story-2 zoom as
  reference (the SVG desks at the correct 19.29° projection).
- Measured the new sprite's desk-top corners (cut coords):
  - V (near vertex) = (2100, 1560)
  - L (left corner) = (205, 595)
  - R (right corner) = (2860, 1200)
  - Width edge: 2126 px at 27.0°
  - Depth edge: 841 px at 25.3°
  - Desk height (V → ground below V): 1226 px (NOT 1720 as previously read)
- Built affine A mapping edges to ±19.29° targets (width anchored to 44u).
- Baked at 10× resolution → `src/assets/workstation-02-iso.png` (521×383).
- **Problem discovered:** the affine squashes the vertical to 0.63× because
  the art's iso (30°) and our projection (19.29° with vertical = 2× the
  plan-diagonal) are not linearly related. With the wrong ART_H=1720, the
  desks FLOAT 6.5u above the floor. With the correct 1226px, the desk
  height at width-match (44u) = 15.5u (too short; target 22u).
- **Conclusion:** no linear map can simultaneously fix the angles AND the
  proportions. The art's vertical emphasis (~1.6×) partially compensates
  but not enough.

### 2. Switch to raw generated sprites
- Per user request: place the raw keyed sprites (no angle correction).
- Two candidates side-by-side:
  - WS_A = workstation-01-cut.png (k=0.0744, deskH=17.8u, depth=31.3u)
  - WS_B = workstation-02-cut.png (k=0.01717, deskH=21.1u, depth=21.8u)
- Both grounded correctly (legs on floor), wall gap kept (uBack=221.5).
- **User feedback:** both look bad because of the incorrect angle (~26-27°
  vs the building's 19.29°). The desks read tilted vs the walls/floor.

### 3. Rack rewrite
- Replaced the single-cabinet `serverRack()` with a detailed 3-cabinet
  group:
  - 2 tall cabinets (h+66, h+62) + 1 short (h+38)
  - Details: plinth, door-frame outline, blanking panels, slot bands,
    vent-dot grid, LED row (one amber), cable notch, side seams, contact
    shadow
- New style classes: `dw-rack-plinth`, `dw-rack-frame`, `dw-rack-panel`,
  `dw-rack-vent`
- **User feedback:** "the rack should be added in the inverse order" —
  wants the code order [long-2][long-1][short-one] where the visible
  left-to-right is [short][long-1][long-2]. The current code already has
  this order (far-to-near paint order, short at the near end), but the
  user's dev server may still show the stale build.

### 4. Regeneration attempt with wireframe guide
- Built `ws-wire-ref.png`: a clean red wireframe on white showing the desk's
  exact geometry (floor footprint 44×17 at 19.29°, desktop surface 22u
  above, vertical at the near corner).
- Attempted nano-banana generation with 2 inputs (style reference +
  wireframe guide) — MCP timed out but saved 3 candidates server-side:
  - `workstation-cand.png`, `workstation-cand_2.png`, `workstation-cand_3.png`
- Measured all 3: all at ~29° width / ~28-35° depth — same wrong projection.
- **User found another candidate image** (attached as [Image 1] in chat) —
  wants me to EDIT it with a clear perspective-change instruction.
- Nano-banana MCP then failed ("Not connected") — needs retry.

## Current File State

### Modified files
- `C:\repo\cv\scripts\generate-geometry.mjs`:
  - `WS_A` and `WS_B` constants (raw sprite placement data)
  - `assetWorkstation(sp, uBack, v0, hBase)` function (raw placement)
  - Detailed `serverRack()` with plinth/frame/panels/vents/LEDs/seams
  - Floor-01: 3 rack calls (72..94 h+66, 46..68 h+62, 20..42 h+38)
  - Floor-02: 2 workstation calls (WS_A at v=26, WS_B at v=82)
- `C:\repo\cv\scripts\style.mjs`:
  - Added: `dw-rack-plinth`, `dw-rack-frame`, `dw-rack-panel`, `dw-rack-vent`
  - Removed: `dw-desk`, `dw-desk-top`, `dw-monitor`, `dw-screen`
  - Added comment about workstation sprites

### Assets
- `C:\repo\cv\src\assets\workstation-01-cut.png` (642×695, keyed)
- `C:\repo\cv\src\assets\workstation-02-cut.png` (2858×2924, keyed)
- `C:\repo\cv\src\assets\workstation-02-iso.png` (521×383, baked affine — NOT USED)
- `C:\repo\cv\generated\workstation-cand*.png` (3 candidates, all ~29°)
- `C:\repo\cv\generated\workstation-02.png` (4.2MB, the generated sprite)

### Assembled SVG
- `C:\repo\cv\src\svg\diorama.svg` (last built with raw sprites + rack group)

## Key Measurements

### Workstation-02-cut (the better sprite)
- Desk top corners: V(2100,1560), L(205,595), R(2860,1200)
- Width edge: 2126 px at 27.0° (target 19.29°)
- Depth edge: 841 px at 25.3° (target 19.29°)
- Desk height (V to ground): 1226 px
- At width-match (k=0.01717, desk width=49u): height = 21.1u ✓
- The art's h:w ratio (screen) = 0.577; physical at our projection = 0.67

### Workstation-01-cut
- Desk height: 239 px
- Width edge: 490.5 px at ~27°
- At width-match (k=0.0744): height = 17.8u (too short)

### The affine's vertical squash
- The art's iso (30°) and our projection (19.29°) are not linearly related
- The affine maps edges correctly but squashes vertical to 0.63×
- The art's vertical is pre-emphasized ~1.6×, partially compensating
- With correct height (1226px): the baked desk = 15.5u tall (target 22u)
- With wrong height (1720px): the desk floats 6.5u above the floor

## Pending Issues

### 1. Rack order — RESOLVED (UPDATE #2)
User confirmed the current code order and render. No action needed.

### 2. Workstation sprite: need correct 19.29° projection
- All generated sprites (01, 02, cand_1/2/3) have ~26-29° recede
- nano-banana is reconnected; its tools are available from UPDATE #2's next session
- Do the 2-input EDIT of workstation-cand_3.png with ws-wire-ref.png (see UPDATE #2, item 3)

### 3. Integration — ONE sprite only (user decision, UPDATE #2)
- Once a correctly-angled sprite is obtained:
  - Key/cut it (reuse the cut pipeline used for workstation-01-cut/02-cut)
  - Measure its corners (V, L, R, ground below V)
  - Compute placement constants (k, ax, ay, depth, deskH)
  - Replace BOTH WS_A and WS_B calls with a single WS_C call
  - Rebuild + render + review

## Next Steps

1. ~~Verify rack order~~ — DONE (UPDATE #2, user-confirmed)

2. ~~nano-banana edit~~ — DONE via the fallback route (UPDATE #3):
   2-input edit failed (27 deg); wireframe-only generation PASSED the gate.

3. ~~Integrate the single WS_C sprite~~ — DONE (UPDATE #3):
   workstation-03-cut.png at v=26, replaces WS_A+WS_B.

4. **User review of the integrated desk** (story-2 zoom + overview shown;
   renders in generated/dev/zoom-desk.png, zoom-rack.png, overview.png)

5. Then continue Stage 5.5: next visual enrichment items per the stage
   spec (this desk closes the "meaningful props" item for the Interactica
   story; the rack closed it for Health Platforms).

## Technical Notes

### The vertical squash problem
The root cause: the art's iso projection (30° recede, vertical 1:1 with plan) and our diorama's projection (19.29° recede, vertical = 2× the plan-diagonal) are not linearly related. A 2×2 affine can map the two edge directions correctly, but the vertical comes out as 0.63× the physical. The art's vertical emphasis (~1.6×) partially compensates but not enough. The only fix is to generate the sprite with the correct projection baked in.

### Nano-banana MCP issues
The MCP server timed out on n=3 and n=1 calls, then returned "Not connected". The generations completed server-side (files saved in generated/) but the tool calls failed. Retry with n=1, lower thinking_level if needed, or wait for the MCP to stabilize.

### Rack paint order
For objects receding up-left along the wall (increasing v), the painter's algorithm requires far-first, near-last (the nearer cabinet paints over the farther where they overlap). The current code emits: v=72..94 (far, tallest) first, then v=46..68, then v=20..42 (near, short) last. This is correct.

## References

- Previous session's handoff: in AGENTS.md work state
- The wireframe guide: `C:\Users\ibej_\AppData\Local\Temp\opencode\ws-wire-ref.png`
- The measurement scripts: `C:\Users\ibej_\AppData\Local\Temp\opencode\measure_cands.py`, `measure_ws3.py`, `test_sprite4.py`, `bake_ws.py`
- The render pipeline: `C:\Users\ibej_\AppData\Local\Temp\opencode\crop_wschk.py` (adjust S=2.5 for current renders)
