# Stage 05.5 Visual Enrichment — Continuation

## Session Context

Rolling handoff log for Stage 05.5 (visual enrichment of the SVG career
diorama): the newest update is at the top, older sessions below. Read only
the top update plus any section it references; the older updates are
historical but keep the derived placement rules and traps (each is still
valid unless a later update says otherwise).

**UPDATE #17 is the newest session (r24 review revisions) — implemented and
committed; user review pending. UPDATE #15 was implemented by UPDATE #16.**

## UPDATE #17 — 2026-09-17, seventeenth session (r24 review: four prop revisions; user review pending)

Four small revisions from the user's r24 review, all implemented and verified
in `generated/dev/r25.png` (crops `chk-hp`, `chk-hpwide`, `chk-ba`,
`chk-devs`, `chk-interactica`, `overview`; crop script
`generated/dev/crop_r25.py`, probe `generated/dev/probe_r25.py`,
`probe_sitter.py`). Lint clean.

1. **BA Technology — meeting table toward the building's right (B-D) wall.**
   `assetProp(PUEL_TABLE, 62, 254, 0)` → `(78, 254, 0)` (+16u; contact shadow
   `hFace(52,116,…)` → `hFace(68,132,246,326,0)`). Sprite x 561.9 → 572.8.
   Still fully inside partition-1's left wedge (r24's wall move to v=139.94
   widened the rule to u < v − 139.94; the sprite's max u ≈ 101 vs limit
   114.06 → ~13u margin) and fully left of the wall's cut edge (x 641.6 <
   651.0). Probe: only 11 cream pixels in the sprite rect (sprite's own light
   tones), no clipping.
2. **Nextcode — the 4 devs right toward the elevator, 5% bigger.**
   Anchor `p(20, 372)` → `p(20, 358)` (14u toward the shaft) and the sprite
   ×1.05 (`DEV_GROUP.k` 0.06056 → 0.063588, `ax`/`ay` ×1.05 → 30.7125 /
   60.984, so the anchor pixel stays put). img x 471.9 → 480.7, width
   40.9 → 42.9, height 58.3 → 61.2. Still fully visible: canvas right edge
   523.6 < the shaft's far-left silhouette 535.5 (~12px clear).
3. **Health Platforms — open boxes toward the building's left wall so the
   seated DBA is never over them.** u band 100..130 → **28..58** (row contact
   shadow `hFace(26, 60, 18, 112, FH)`); v bands and seeds unchanged. The
   binding constraint: the box row's near-right corner is at (u1, v = 20),
   so u1 ≤ ~66.6 keeps the whole group left of the sitter's sprite canvas
   (x 782.3..810.6). Probe on r25: crate-top bbox x 696.0..774.8 (right edge
   ~7.6px clear) and **0** crate-coloured pixels inside the sitter's canvas
   (r24 had the overlap the user circled). The boxes now sit lower-left of
   him (screen x 692..777, y 822..868) — still the red-mark read ("below him,
   extending screen-left"). Known/accepted: the foreground corner column A
   (screen x ≈ 750, v = 0) crosses the box group's right portion — correct
   foreground occlusion, same language as before (UPDATE #12 note).
4. **Interactica floor 2 — desk paint order inverted.** `assetWorkstation`
   calls swapped: `WS_D` (v = 82, deeper, screen-LEFT) is now emitted FIRST,
   `WS_C` (v = 26, nearer, screen-RIGHT) second, so the nearer desk paints
   over the farther one. Fragment order confirmed: floor-02.svg images
   x=805.19 (WS_D) then x=844.84 (WS_C).
5. User review pending on all four. Next session: continue from the user's
   next revision list (floors 1–2 enrichment; floor-2 Interactica's left
   half is still empty).

## UPDATE #16 — 2026-09-16, sixteenth session (UPDATE #15 IMPLEMENTED)

UPDATE #15 implemented in full; verified in `generated/dev/r24.png` (crops
`chk-hp`, `chk-hpwide`, `chk-puelo`, `chk-elev`, `chk-devs`, `overview`;
crop script `generated/dev/crop_r24.py`, probes `generated/dev/probe_r24.py`
+ `check_puelo.py`). Lint clean.

1. **Change B — elevator shaft forward 40.57u.**
   `SHAFT_V0 = 0.46 * LD * 0.85` = 229.908, `SHAFT_V1 = SHAFT_V0 + 0.125 * LD`
   = 303.408; everything follows from the constants (shaft walls/doors/
   open story-5 doors + floor digits, return walls, enclosure, re-layered
   cut faces, `slabTriangle`, year plaques at the new vMid 266.66, top
   bands, floor-3 section separation wall which lengthens rearward — the
   Indelve boundary reads correctly, clipped fill + washes). The enclosure
   conduit + per-story junction boxes re-expressed as `SHAFT_V1 − 12/−9`
   and `SHAFT_V1 − 15/−3` (identical offsets as before). Render probes:
   enclosure left silhouette at x ≈ 530.5 (expected 535.5), conduit at
   x ≈ 541.4 (expected 541.6), junction box front face present at
   (540.8, 777) — all aligned; year plaques + text pixels present at the
   new vMid. **Devs**: user decision (chat, before implementation) — the
   four-dev group is left FULLY VISIBLE in the enlarged Nextcode (no
   retune of `DEV_GROUP`); the engineered peek look is intentionally
   retired. Render probe confirms no shaft fill anywhere in the group's
   screen bbox; group pixels confirmed at x 472..513 (spans x 471.9..512.8),
   fully visible and clear of the WS_D desk (x ≈ 483..495 — the group is
   nearer in depth, so it correctly paints over the desk's left edge; read
   as staffage in front of it, `zoom-f1h` no longer describes the look).
2. **Change B — floor-1 Health Platforms re-layout.** The three paper boxes
   re-laid into the red-marked area in FRONT of the seated DBA:
   `paperBox(100, 130, 80, 110, FH, FH+16, 2)` / `(100, 130, 50, 80, …, 1)` /
   `(100, 130, 20, 50, …)` (touching along the depth axis, front wall 20u
   clear); row contact shadow `hFace(98, 132, 18, 112, FH)`. The reams form
   a straight line at u 195 toward the front wall: `(195, 109)` kept,
   `(195, 97)`, `(195, 85)`, `(195, 73)`; band shadow `hFace(190, 231, 68,
   114, FH)`. Emission far-to-near: boxes → reams → sitter → racks.
   Render probes: crate-top pixels at the new box tops, ream-paper pixels
   along the u 195 line, sitter sprite pixels intact. Envelope/paint
   pre-checks (computed, all comfortable): boxes top-back rim 160.6 ≤ 197.5;
   ream v 73 top 151.9 ≤ 197.5; ream far rim (v 70.2) vs the short rack's
   far corner (v 20, screen x 898.9 — reams end at x ≈ 836.4) — no
   intersection. The sitter's left-edge sliver (box-row near face at
   x 782–785, ~3px) does not visibly clip him (footprint rule held; verify
   in the r24 crops).
3. **Change A — Puelo Games −15%.** `PARTITION_G = [0.28 * LD * 0.85,
   0.68 * LD]` (wall at v 139.94); passage opening + slabs travel with the
   wall. Props shifted Δv = −24.7: kiosk `assetProp(PUEL_KIOSK, 220.14,
   11.3, 0)` + matching `kioskScreenOverlay(spritePlace(…))`, stools
   `assetProp(PUEL_STOOLS, 200.1, 8.3, 0)` + contact `hFace(198, 216, 7,
   43, 0)`, crates v 121.3..137.3 / 123.3..137.3 / 106.3..119.3 (all ≤ the
   wall, 2.6u clearance). Render probes: kiosk img at (876.64, 882.41)
   (expected 876.65, 882.45), stools img at (851.74, 905.25) (expected
   851.75, 905.28), crate-top pixels at the new corner, BA-side unchanged
   (meeting table img (561.96, 855.76) identical). Sprites stay inside the
   floor (kiosk bottom ≈2.9u above the v = 0 cut line at its u, stools
   ≈1.4u); tags verified in fragments (Puelo c=82, BA c=282 inside the
   resized sections).
4. NOTE — the pre/post comparison probes were done against `r23.png` (the
   r23 review render) and the two UPDATE #15 renders (`r24a.png` = after
   Change B only, `r24.png` = after both changes). `r24a` vs `r24` differ
   ONLY in the Puelo/entrance area, as intended.
5. User review pending on: the vignette read vs the red mark (box row
   position/tuning), the Puelo section's new look near the entrance (props
   ~8–11u from the entrance face), and the devs' fully-visible arrangement.
   Next session: continue from the user's revision list (floors 1–2
   enrichment continues; floor-2 Interactica's left half is still empty).

## UPDATE #15 — 2026-09-14, PENDING SPEC (IMPLEMENTED by UPDATE #16) (two big layout changes — NOT implemented yet)

User request from the r23 review: two big changes, written down here so a new
session can implement them. IMPLEMENTED by UPDATE #16 (2026-09-16) — kept
below as the original spec.

### Change A — ground floor: enlarge BA Technology by shrinking Puelo Games 15%

Goal: more visible floor in BA Technology. The wall separating Puelo Games and
BA Technology is `PARTITION_G[0]` (Puelo Games sits between the entrance face
v = 0 and this wall).

- Numbers: Puelo Games is currently `0.28 * LD` = 164.64 deep. Reduce it 15% →
  139.94, i.e. move the wall TOWARD THE ENTRANCE by Δv = −24.7:
  `const PARTITION_G = [0.28 * LD * 0.85, 0.68 * LD]` (or 0.238·LD).
  The partition's passage opening (u 15..70) travels with the wall
  automatically (`partition(PARTITION_G[0], 0, { opening: true })`, ~line 1066).
- Move the Puelo props by the same Δv = −24.7 (user: "move the boxes and the
  other elements in this section in the same direction") — `pueloProps`
  (~line 874):
  - kiosk `assetProp(PUEL_KIOSK, 220.14, 36, 0)` → `(220.14, 11.3, 0)`
    (+ `kioskScreenOverlay` follows);
  - stools `assetProp(PUEL_STOOLS, 200.1, 33, 0)` → `(200.1, 8.3, 0)`; its
    contact quad `hFace(198, 216, 32, 68, 0)` → `hFace(198, 216, 7, 43, 0)`;
  - the three crates beside the wall — `crate(212.5, 230.5, 146, 162, …)`,
    `crate(216, 230, 148, 162, …)`, `crate(213.5, 230.5, 131, 144, …)` →
    v − 24.7 each (121.3..137.3 / 123.3..137.3 / 106.3..119.3).
- Unaffected: entrance portal, partition-2 (`PARTITION_G[1]`, BA/freelancer)
  and everything in the BA/freelancer sections (whiteboard, meeting table,
  paper piles, the piles moved through partition-2's doorway, PC, staircase).
- Checks: kiosk/stools now sit ~8–11u from the entrance face — their sprites
  must stay inside the floor (nothing pokes below the v = 0 cut band) and they
  must not crowd the entrance portal (portal u 83..155, props at u ≥ 198 —
  clear). Crates must stay on the Puelo side of the new wall (v ≤ 139.9).
- Tags: "Puelo Games" (c = 82) and "BA Technology" (c = 282) stay — both still
  inside their (resized) sections.

### Change B — move the whole elevator/shaft forward, enlarging Nextcode

Goal: more visible space in Nextcode. The elevator shaft (floors 1–5) moves
toward the building's front wall; the elevator no longer sits at the plan
centre (user: no problem with this). Health Platforms shrinks 15%; Nextcode
grows by the same amount.

- Numbers: Health Platforms spans v 0..`SHAFT_V0` = 270.48. Reduce 15% →
  229.91: `const SHAFT_V0 = 0.46 * LD * 0.85` (≈ 0.391·LD). The shaft keeps
  its depth (`SHAFT_V1 − SHAFT_V0` = 0.125·LD = 73.5):
  `const SHAFT_V1 = SHAFT_V0 + 0.125 * LD` (= 303.41). Whole-structure
  Δv = −40.57.
- Follows AUTOMATICALLY from those two constants (no other edits):
  `shaftStory` (W1/W2/W3 walls, doors, open doors on story 5, floor-number
  digits), `shaftReturnWalls` (the Health/Nextcode side walls + passages), the
  enclosure `uFace(0, SHAFT_V0, SHAFT_V1, FH, TOP_H)`, the visible top bands,
  the story year plaques (`yearPlaque` uses the vMid), `slabTriangle` in
  floor-02-front … floor-05-front, and the floor-3 section separation wall
  (~line 1258, `uFace(SHAFT_U, SHAFT_V1 + WALL_T, LD − WALL_T, …)`) — the
  latter STARTS at the shaft, so it lengthens by 40.6u. FLAG for review: does
  the Indelve/Interactica boundary stay visually right when the wall grows?
- Manual edits (hardcoded v in `elevator()`):
  - `el('dw-conduit', uFace(-1.5, 332, 335, FH, TOP_H))` → make it
    SHAFT_V1-relative (`SHAFT_V1 − 12`, `SHAFT_V1 − 9`);
  - `boxOnUWall(-1.5, 0, 329, 341, …)` → `SHAFT_V1 − 15`, `SHAFT_V1 − 3`.
- Floor-1 Health Platforms re-layout (user, guided by a red-marked screenshot
  — a rough rectangle on the floor in FRONT of the seated DBA, i.e. screen
  below him, extending screen-left; the image is a chat attachment, not in the
  repo):
  1. **The 3 open boxes move "below" the seated DBA** — from their current
     v 124..214 to the floor area in front of him, inside the red-marked area.
     Keep the one-beside-the-other arrangement (touching along the depth
     axis). Suggested first try: **u 100..130, v 20..50 / 50..80 / 80..110**
     (tune against the red mark + render). Keep clear of the sitter's sprite
     footprint (screen x ≈ 782..810): anything nearer than v = 82 that overlaps
     that footprint must be emitted AFTER the sitter or shifted left; the
     front-most wall stays ≳ 6u from the v = 0 cut. The single row contact
     quad follows the row.
  2. **Seated DBA stays** at `assetProp(SITTER, 160, 82, FH)` (user).
  3. **The 4 paper reams in front of the servers form a line toward the front
     wall**: keep the ream nearest the sitter (`paperReam(195, 109, 30, FH)`)
     untouched; move the other three into a straight line toward v = 0 at the
     same u — suggested `(195, 97)`, `(195, 85)`, `(195, 73)` (12u steps; the
     reams are 5.6u deep, gaps stay clear). The reams' contact band
     (`hFace(190, 231, 104, 114, FH)`) becomes a band along the new line.
  4. Unaffected: the server racks (v 20..94), the electrical panel + conduit
     drop (v 168..192 — still inside the shrunken Health Platforms), the
     sitter's soft shadow.
- Tags: "Health Platforms" (c = 135) and "Nextcode" (c = 470) still fall inside
  their resized sections — verify visually.
- **Trap — Nextcode devs' peek** (engineered in UPDATE #7/#9): the two peeking
  devs (`DEV_GROUP` at p(20, 372, FH)) read through the sliver left of the
  shaft's W3 cut face. Moving the shaft forward (W3 344 → 303.4) slides that
  cut face on screen and changes the hidden region — re-verify the peek at 12×
  zoom and re-tune the dev group if the sliver changed.
- **Trap — floor-2 slab envelope** (floor 1): visible iff
  `h + 0.495·min(u,v) ≤ 197.5`. The new box line (v ≤ 110) and ream line
  (v ≥ 73) are comfortably inside, but re-check after placement.
- **Trap — painter order** in `floor-01`: emit far-to-near (boxes → reams →
  sitter → racks); the boxes are now partly NEARER than the sitter, so verify
  each object's emission order against its actual v range.
- Also check: 5th-floor open-air top (shaft top bands, stub walls), year
  plaques vs the floor bands, story numbers, and the racks' sight lines.

### Suggested order for the new session

1. Change B constants + the two hardcoded conduit/junction values; rebuild +
   render; check the shaft, doors, plaques, conduit alignment, devs peek,
   floor-3 separation wall, 5th-floor top.
2. Change B floor-1 prop re-layout (boxes, reams, contact shadows).
3. Change A (partition + Puelo props).
4. Render r24, retune `crop_r14.py` boxes (the vignette moves), lint, commit,
   write UPDATE #16 with what actually changed.

## UPDATE #14 — 2026-09-14, thirteenth session (user correction: box file runs toward the rear wall, not diagonally)

User correction on UPDATE #13: "you add them in diagonal, and must be one side
other in direction to the building's rear wall."

1. The two added boxes are re-laid in a file along the DEPTH axis instead of
   the diagonal: same u band as the original box (128..158), v stepping 30u
   per box so the walls touch — `paperBox(128, 158, 154, 184, FH, FH+16, 1)`
   and `paperBox(128, 158, 184, 214, FH, FH+16, 2)`; the original
   `(128, 158, 124, 154)` is unchanged. On screen the row recedes up-left
   toward the building's rear (C-D) wall; each box half-hides behind the
   nearer one (isometric depth overlap) — the expected read for boxes queued
   on the floor.
2. The three per-box contact quads are replaced by ONE row shadow
   (`hFace(126, 160, 122, 216, FH)`) — touching boxes share one footprint.
3. Known minor interaction (same slab-cut language as elsewhere): the deeper
   boxes' top-back corners tuck a hair under the floor-2 slab cut
   (h + 0.495·min(u,v) ≤ 197.5); the farthest box's back rim clips ~1.7u and
   a few overflow sheet tips near it. Reads as the established cutaway.
4. Verified in `generated/dev/r23.png` (crops `chk-hp.png`, `chk-hpwide.png`,
   `overview.png`). Lint clean.

## UPDATE #13 — 2026-09-14, twelfth session (user request: two more open boxes in file toward the elevator door)

User request: "add in file in direction to the door 2 more open boxes. you may
just c&p current one, and only change its position."

1. **Two more paper boxes** copied at the current size (30×30×16) and placed
   in file toward the elevator door — the section's only door (shaft W2 face,
   u 6.5..41.7, v 263). The file runs along the diagonal from the original
   box centre (143,139) to the door centre (24,263): one 44u step per box so
   the three queue corner-to-corner without intersecting —
   `paperBox(98, 128, 156, 186, FH, FH+16, 1)` and
   `paperBox(67, 97, 187, 217, FH, FH+16, 2)`; the original
   `(128, 158, 124, 154, FH, FH+16)` is unchanged. Contact-shadow quads per
   box; emission stays far-to-near (box 3 → 2 → 1 → reams → sitter → racks).
2. **`paperBox` gained a `seed` parameter** mixed into its deterministic
   sheet hashes (seed 0 keeps the original arrangement) so the file does not
   read as identical clones — each box's spill differs.
3. Verified in `generated/dev/r22.png` (crops `chk-hp.png`, `chk-hpwide.png`,
   `overview.png`; crop boxes widened to cover the file). Lint clean.

## UPDATE #12 — 2026-09-14, eleventh session (user revision: box further left-down + 50% wider/deeper; sitter −15% and nearer the wall; contact shadow fixed)

User revision on UPDATE #11's render: "move the open box some more to the same
direction, and increase 50% its width and depth. it seems that double the size
of the seated DBA was too much, reduce it 15%, and move it a little more near
to the B-D wall, and also fix the shadow under him."

1. **Sitter −15%** (`k` 0.0691 → 0.058735): seated height 41.46u → 35.24u
   (`ax`/`ay` 22.85/35.36). Moved +6u toward the B-D wall:
   `assetProp(SITTER, 160, 82, FH)` (screen x +4.2px).
2. **Contact shadow fixed**: the old u/v footprint quad read as a stray
   streak (a billboard has no honest plan footprint). New
   `spriteShadow(sp, u, v, h)` helper: a soft screen-space ellipse sized to
   the sprite's base (rx = 44% of the sprite width, ry 3.6, `#141618` @ 0.22,
   `dw-soft`), locked to the sprite via `spritePlace()` — same blurred
   language as the career sign. Replaces the sitter's `dw-contact` quad.
3. **Box moved further left-down and grown 50% in width/depth**:
   `paperBox(128, 158, 124, 154, FH, FH + 16)` — 30×30×16 (was 20×20×16),
   centre screen x 760 → 753 (the section centre), y 809 → 802. Fill/overflow
   sheet counts and jitter now scale with the box plan (9 fill / 10 overflow,
   jitter ±35% / ±70% of the size).
4. **Reams moved 6u forward** (v 115 → 109, screen +4.2px) so the sitter's
   +6u move keeps the same clearance to the first stack (his hand overlaps
   its left ~3px as before). Contact shadow band follows (v 104..114).
5. Known interaction (user to judge): the foreground corner column A
   (screen x ≈ 750.2, v = 0 — in front of everything) now crosses the box's
   middle-left. Correct occlusion, but it reads as a line through the box;
   fallback if it bothers: nudge the box so the column lands on its edge.
6. Verified in `generated/dev/r20.png` (crops `chk-hp.png`, `chk-hpwide.png`,
   `overview.png`; crop boxes widened in `crop_r14.py`). Lint clean.
7. **Box interior recoloured to the paper tone** (user revision: "change the
   INTERNAL color of it to same color of the papers, to simulate that is full
   of papers"): the interior floor and inner far/right faces switch from
   `dw-crate-side` to `dw-paper`; outer walls and rim strips stay cardboard.
   Verified in `generated/dev/r21.png`.

## UPDATE #11 — 2026-09-14, tenth session (user revision: DBA vignette box + sitter doubled)

User revision on UPDATE #10's render: "double the size of the open box ... and
move it a little to the left down diagonal (in direction to the center of the
section); double the size of the seated DBA, position is okay."

1. **Sitter doubled** (`k` 0.03455 → 0.0691, `ax`/`ay` doubled): seated
   height 20.73u → 41.46u (now taller than the 32.7u standing devs — flagged
   to the user). **Position constraint**: at this size the head's effective
   height is ~151u (the sprite's head sits ~18.5u forward of the anchor,
   which lifts it), and the floor-2 slab cut caps anything at that spot at
   `h + 0.495·v ≤ 197.5`; at the approved v=130 the head would be hidden
   behind the floor-2 slab. Moved along the (-u,-v) view diagonal to
   `assetProp(SITTER, 154, 82, FH)` — same screen x as approved, ~22px lower.
2. **Box doubled** (10×10×8 → 20×20×16) and moved left-down the view diagonal
   toward the section centre: `paperBox(148, 168, 134, 154, FH, FH+16)`
   (screen centre 782.5 → 759.9 x, 793 → 809 y). Rim thickness, fill-sheet
   pitch/count and overflow count scale with the box (T 1.4 → 2.8, 6 fill
   sheets spread over the inner height, 8 overflow sheets).
3. Vignette emission order is now far-to-near: box (v 134..154), reams
   (v 115), sitter (v 82); contact shadows follow.
4. Verified in `generated/dev/r19.png` (crops `chk-hp.png`, `chk-hpwide.png`,
   `overview.png`; crop boxes retuned in `crop_r14.py`). Lint clean.
5. Open question for the next review: the reams (10.8u) now read small next
   to the doubled sitter and sit 33u behind him (unchanged per instruction);
   if the user wants, scale/move them with the vignette.

## UPDATE #10 — 2026-09-14, ninth session (Health Platforms DBA vignette; dark review renders)

User task: "first add something more to the Health Platforms section" — a
DBA-work vignette left of the server racks. Implemented and verified in the
render (`generated/dev/r18.png`; crops `chk-hp.png`, `chk-hpwide.png`,
`overview.png`; crop script `generated/dev/crop_r14.py`). Lint clean.

1. **Review renders now match production.** `generated/dev/make_chk.py`
   paints the `base.css` dark radial backdrop behind the transparent SVG, so
   r13+ review renders show the real Stage 5.5 atmosphere (r12 and earlier
   were reviewed on white).

2. **Health Platforms DBA vignette** (floor 1, room centre pulled toward the
   B-D wall, left of the racks; the whole group stays inside the floor-2
   slab envelope `h + 0.495·min(u,v) ≤ 197.5` and clear of the electrical
   panel/conduit drop at v 168..192). Emitted in `floor-01` after
   `backWalls(FH)`, far-to-near: electrical panel → box → sitter → reams →
   server racks (the section was reordered; the racks previously preceded
   the panel).
   - **Sitter** — one person sitting on the floor, papers in both hands,
     looking at them, facing the B-D wall. Nano-banana wireframe-only
     pipeline: `generated/dev/make_wire_sitter.py` → `sitter-wire.png` →
     NB2 n=1 → `sitter-cand.png` → `key_cut_sitter.py` →
     `src/assets/sitter-01-cut.png` (481×605). Constants
     `SITTER = { k: 0.03455, ax: 13.44, ay: 20.8 }`, anchor = the sprite's
     bottom-row centre (foot contact; wireframe foot at u 205.5) placed at
     `assetProp(SITTER, 202, 130, FH)`. Seated height 20.73u. The model drew
     the figure wider than the wireframe (aspect 0.79 vs 0.35) — reviewed
     and accepted; the anchor keeps the floor contact right.
   - **Four tall ordered reams at his right** — new `paperReam(u, v, n,
     hBase)` helper: a solid A4-sized paper block (top face + near/left
     faces + sparse sheet lines), because 30 stacked flat quads merged into
     a heap at this scale. n=30 (10.8u tall) at v 115, u 195/205.5/216/226.5.
     New style classes `dw-ream`, `dw-ream-side`, `dw-ream-line` (the top
     reuses `dw-paper`).
   - **Open box of unordered papers at his left** — new `paperBox(u0, u1,
     v0, v1, h0, h1)` helper: open-top crate (inner far/right faces, outer
     left/near walls, cardboard rim strips) with large jittered sheets
     overflowing the rim; an earlier leaning back-flap was removed (it
     rendered as a stray line). Box u 193..203 × v 147..157 × h 105..113.
   - `dw-contact` shadows under the box, the sitter and the ream row.

3. **Traps re-confirmed**: the ream helper initially ignored the floor
   height (sheets landed at h ≈ 0 — present in the fragment but invisible in
   the render); billboard staffage keeps the `assetProp` anchor = bottommost
   row centre; the floor-2 slab envelope governs everything on floor 1.

4. Next session: the user's next revision list (floors 1–2 are still being
   enriched; floor 2 Interactica's left half is still empty). Floors 3/4/5
   props are deferred until floors 1–2 are finished (user decision).
   Rebuild/render workflow unchanged, except `make_chk.py` now includes the
   dark backdrop.

## UPDATE #9 — 2026-09-13, eighth session (UPDATE #8 items DONE: dev sprite, pamphlet ×2/×3, doorway piles, wall-base layer)

All four UPDATE #8 items implemented and verified in the render
(`generated/dev/r12.png`; crops `chk-pamphlet.png`, `chk-doorway.png`,
`chk-wallbase.png`, `chk-devs.png`, `chk-f1wide.png`, `chk-ba.png`,
`overview.png`; crop boxes in `generated/dev/crop_r12.py`). Lint clean.

1. **Nextcode devs are now a nano-banana sprite** (one composite image for
   the whole group, per user decision). Pipeline:
   - `generated/dev/make_wire_devs.py` → `devs-wire.png`: red outlines of the
     four figures (current proportions, 32.7u tall) at the exact projected
     positions; the front figure of each pair is drawn as a solid white
     silhouette so the rear figure's outline survives only where visible.
   - nano-banana (NB2, wireframe-only input, n=1) → `devs-cand.png` (chosen;
     `devs-cand2.png` / `devs-cand3.png` discarded — stronger prompts made the
     model spread the pairs further apart, and cand3 flattened the depth
     offsets entirely).
   - `generated/dev/key_cut_devs.py` → `src/assets/devs-01-cut.png` (675×962);
     anchor = the front peeker's foot (bottom-row centre), k = 0.06056
     (group screen height 57.96u).
   - Integration: `DEV_GROUP` constant + `assetProp(DEV_GROUP, 20, 372, FH)`
     replacing the four `devFigure()` calls, in the same layer slot (floor-01
     AFTER `backWalls(FH)`, BEFORE `shaftReturnWalls`); `devFigure`,
     `DEV_SHIRTS` and the `dw-dev-*` styles removed.
   - **Known deviation, reviewed and ACCEPTED by the user (2026-09-13):** the
     generated art's internal arrangement is not pixel-exact. Grey sits
     ~3.5 screen-px left of brown, so the peek sliver is ~2.5× wider than
     the old SVG's (both heads plus body edges show through the W3 cut-face
     window, x < 501.5) — read as "two devs peeking from behind the
     elevator" and kept as-is. The visible pair lands ~3-5px left / 2-3px
     lower than the old geometry; brown's foot sits exactly at its old
     position. No follow-up needed; if ever revisited, the fallbacks are
     splitting into two sprites (visible pair / peeking pair) or nudging
     the anchor right (trades peek width against the visible pair's x).

2. **Pamphlet ×2/×3** (user-approved size, cutaway accepted): u 26..90 ×
   h 107..167 (was 26..58 × 107..127); squiggles 7 → 25 (same 2.1u pitch);
   inner sheet + pin dot follow. The top-right corner tucks under the
   floor-02 slab cut (hidden where h + 0.495·u ≥ 197.5, i.e. u > 61.6 at
   h = 167) — clean diagonal, same language as the whiteboard's tuck.

3. **BA-side piles moved through the doorway** (user: "move them in direction
   to the freelancer section, under the door's head"): the three stacks now
   live deep in the freelancer section at `(112,484,2)`, `(134,489,2)`,
   `(148,492,1)`, emitted in `floor-ground` BEFORE
   `partition(PARTITION_G[1], …)`. The passage notch (u 15..70, h 0..52.5 at
   v0 = 396.09) reveals them near the head line. Placement rule (now in the
   code comment): a floor point (u, v) behind the wall shows through the
   notch iff its sight ray crosses the wall plane within
   u' = u − v + 396.09 ∈ [15, 70] and h' = 0.495 (v − 396.09) ∈ [0, 52.5].

4. **Wall-base layer fixed**: `(80,495,3)` and `(74,482,2)` moved from
   `freelancer-props` into the before-partition-2 group, so the wall's
   cut-end quad (screen x 464.6..469.9) clips their far tips coherently
   under `dw-rough`. Pixel scan of the render confirms the paper now ends at
   x ≤ 463.6 (no white over the cut end). Also caught and moved `(50,460,4)`,
   which had the same overhang (tip x 466.8) but was not in the user's
   circles.

5. Housekeeping: `.gitignore` += `.git-credentials`; new `.ignore` with the
   same entry. `crop_r12.py` is this session's crop script. AGENTS.md
   "Development Status" is still stale boilerplate ("Stage 0 is next").

6. **Session closed: user reviewed the render and approved all four items
   (2026-09-13).** No open issues carried over. Next session: continue
   Stage 5.5 from the user's next revision list (the stage spec's §17
   acceptance criteria remain the guide); UPDATE #8 below is historical —
   every item it listed is closed here. Rebuild/render workflow unchanged:
   `npm run svg:generate` → `svg:assemble` → `generated/dev/make_chk.py` →
   headless Edge screenshot (S=2.5, 3000×2625) → crop script. Known cleanup
   whenever convenient: refresh AGENTS.md's stale "Development Status".

## UPDATE #8 — 2026-09-12 (HISTORICAL — all items closed by UPDATE #9; kept for context)

User listed these for a future session; no code was changed for them yet.

1. **Nextcode devs must become nano-banana sprites, not SVG geometry.**
   The four `devFigure()` staffage cutouts look "too rare" (off-style).
   Replace with generated sprite(s): ONE image with the whole group, or at
   most TWO — never more. **Positions are correct and must stay**:
   visible pair `(438,56)` green / `(424,44)` blue; peeking pair
   `(386,34)` grey (rear) / `(372,20)` brown (front). Use the established
   wireframe-only pipeline (`generated/dev/make_wire_*.py` →
   nano-banana → `key_cut_*.py` → measure k/ax/ay) and keep the current
   layering: emit in `floor-01` AFTER `backWalls(FH)` and BEFORE
   `shaftReturnWalls` — the shaft's faces (elevator fragment, later) must
   paint over the peeking pair automatically. Remember the peek window is
   only `x < ~501` (left of the shaft's W3 u=0 cut face): if the sprite is
   placed as-is, the shaft covers the right part — verify the visible
   sliver reads like the current version (`zoom-f1h.png` at 14×).

2. **Nextcode pamphlet must be bigger: width ×2, height ×3.**
   Currently `nextcodePamphlet()` at u 26..58 × h 107..127. Target
   ≈ u 26..90 × h 107..167. Style/position are approved. Watch the
   slab-cut envelope `h + 0.495·u < 197.5` (floor-02 slab band): at the new
   size the top-right corner (u>61 at h=167) tucks under the cut — decide
   whether to accept the cutaway look or anchor the growth leftward/down.
   Also add more squiggle lines for the larger area (currently 7).

3. **Move the 3 BA-side piles into the freelancer section, just under the
   door's head.** The three piles currently at `(28,372,2)`, `(58,386,2)`,
   `(80,392,1)` (BA floor, in front of partition-2 — the circled ones in
   the user's Image 1) must move to the freelancer side so they show
   THROUGH the partition-2 passage opening, just below the head line
   (h = 52.5). Target zone: freelancer floor behind the doorway,
   ≈ u 20..65 × v 405..425 (screen x 480..519, y 824..877 — clear of the
   PC's bbox x [434.5,461.7] y [806.2,837.3]). Emit them in `floor-ground`
   BEFORE `partition(PARTITION_G[1], …)` so the wall face's notch shows
   them through the opening (the passage hole is u 15..70, h 0..52.5).

4. **Two piles still in the wrong layer (user's Image 2 circles).**
   The circled spots at partition-2's base below the PC are the stacks
   `(80,495,3)` and `(74,482,2)` (both emitted in `freelancer-props` AFTER
   the divider; measured xmax 466–467, i.e. just 3px short of the wall's
   edge at 469.9 — with the rough-filter jitter their tips can wobble over
   the wall's base/edge line). Fix: move them into the before-partition-2
   group in `floor-ground` (same treatment as `(4,408,2)`/`(16,416,2)`), or
   shift them left so their far tips clear x ≤ 466 with margin. Verify at
   high zoom (`zoom-wallbase.png` region, SVG 445..485 × 845..895).

## UPDATE #7 — 2026-09-12, seventh session (paper layers + floor-1 pamphlet & devs)

User revision list, verified in render (`generated/dev/r11.png`, crops
`zoom-f1d.png` / `zoom-f1h.png` / `zoom-ba2.png` / `zoom-fl.png` / `overview.png`):

1. **Puelo-section sheets removed.** The two `vWallSheet`s on partition-1's
   front face (u_p 100 h 35 / u_p 148 h 22) are gone — the user reads that
   stretch as the Puelo Games section.
2. **Screenshot-1 circles fixed (correct layer).** The three sheets pasted
   on partition-2's front face (u_p 8/150/172) were the "papers above the
   wall" — all removed. The near-wall floor piles are now emitted BEFORE
   partition-2 in `floor-ground`, so the divider paints over their far
   halves and they read as tucked under it: `(4,410,2)` moved from
   freelancer-props and re-laid as `(4,408,2)`, plus new `(16,416,2)`.
3. **More piles per screenshot-2 pins**: rear wall `wallSheet(7,78,0.1)`
   and `(13,90,-0.08)`; tread sheets on steps 4 and 10
   (`paperSheet(53,566,35.4)`, `(108,568,87.9)`); freelancer floor
   `paperStack(68,508,2)`, `(74,482,2)`; BA-side piles in front of the
   passage (correct layer: divider behind them) `(28,372,2)`, `(58,386,2)`,
   `(80,392,1)`.
4. **Nextcode pamphlet** (floor-1 rear wall's left corner, just above the
   flight's rise): big white sheet u 26..58 × h 107..127 + 7 deterministic
   hand-writing squiggle lines (`dw-scribble`) + pin dot. **Painter-order
   trap**: it must live in floor-01 AFTER `backWalls(FH)` — the floor-ground
   copy was completely hidden under the floor-1 story's rear wall (which is
   drawn in floor-01). At the corrected height the banister diagonal no
   longer crosses it (the earlier concern was for the ground-story height).
5. **Floor-1 dev staffage** (user request: group of 4 right of the crates,
   2 mostly behind the elevator): new `devFigure(v, u, shirt)` helper — flat
   cutout (legs, torso, arms, head, hair) in the constant-v plane, muted
   tones + thin outline. Two stand fully visible (`(438,56,'green')`,
   `(424,44,'blue')`); the hidden pair revealed a hard geometric fact:
   **from this camera the shaft's own mass covers the return wall's passage
   entirely** (the W3 wall's u=0 cut face spans screen x 501.0..506.5 and the
   W2 face x 564.1..598.1 — nothing of the notch's 559.8..598.6 window shows).
   The only peek window is `x < ~501` (left of the shaft's cut face): the
   pair stands in a row there — `(386,34,'grey')` rear and `(372,20,'brown')`
   front — so the rear one's head shows above the front one's shoulder
   (~35% of each figure visible). Verified at 14× zoom (`zoom-f1h.png`).
6. Style additions: `.dw-scribble`, `.dw-dev-legs/-blue/-green/-brown/
   -grey/-skin/-hair`.
7. Lint clean; commit `dc7dc90`. User review pending — especially the
   hidden-devs read at overview scale (they are ~2px slivers there) and the
   BA-side pile placements.

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
