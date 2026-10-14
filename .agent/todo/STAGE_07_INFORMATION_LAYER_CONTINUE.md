# Stage 07 Information Layer — Continuation #1 (closed)

> **STATUS: COMPLETE — CLOSED (2026-10-13).** The information layer was reviewed
> and approved by the user across eight iterative rounds (r206 → r224); Stage 7
> is complete (see `.agent/todo/STAGE_07_INFORMATION_LAYER.md` §Status/§Report).
> This file is kept as the development log; it is **no longer a live handoff**.
> The next stage is **Stage 8 (display modes)**.

## 0. Final status & commit (2026-10-13)

- **Base commit:** `c30e5b9` — "stage 7 WIP: information layer (per-section roles
  + tech logos + real projecting-sign content) + fresh-session handoff".
- **This stage's commits:** `bd14e30` (rounds r214–r217) and the Stage-7 COMPLETE
  commit (rounds r219–r224 — see git log).
- **Final round (r224):** Pacer "Software Architect" floor label moved up against
  the rear (C-D) wall. `npm run lint` / `type-check` / `build` clean.
- **State:** Stage 7 **COMPLETE**; all §5 open items marked approved by the user
  (Indelve has no information content by design — its scene is the content; the
  per-experience "project descriptions" are the scene sprites/visual references;
  all Interactica elements approved). Stage 8 may now start.
- **Git note:** `generated/` (dev scripts, `rNNN.png` renders, crops) and `dist/`
  are gitignored — re-render locally after checkout (`§2`).

## 1. Where the project stands

The career diorama (isometric cutaway, one floor per career stage) is built and
illustrated (Stages 0–6 complete). Stage 7 adds the **information layer**:
per-section role labels + technology logo plates, the current identity block,
and the real content on the exterior projecting sign. It is developed as an
**iterative, user-reviewed loop**: render `generated/dev/rNN.png`, the user sends
a revision list (often with screenshots + red annotations), implement, re-render,
review again.

Latest render: **`generated/dev/r218.png`** (full composition), re-rendered
2026-10-12 and byte-identical to `r217.png`; from revision rounds r214–r217
(2026-10-12). Crops: `r217b-*.png` (verification set). `npm run lint`,
`type-check`, `build` all clean at r217.

### Revision round r224 (applied 2026-10-13; awaiting user review)

Eighth feedback pass: the Pacer "Software Architect" floor label moved closer to
the rear wall — `floorLabel(S.pacer.role, 112, 512 → 566, 4·FH)`, i.e. ~14 units
off the C-D wall's inner face (v 580.5), closing the gap while staying clear of
the dev cluster. `npm run lint`, `type-check`, `build` clean; render
`generated/dev/r224.png` (crop `r224-pacerleft.png`).

### Revision round r223 (applied 2026-10-13; awaiting user review)

Seventh feedback pass.

- **Freelancer:** c# nudged another 5px toward the top-left (`dx,dy` 10,0 → 5,-5).
- **Pacer:** `SECTIONS.pacer.role` set to `'Software Architect'`; rendered as a
  floor label (`floorLabel`, reads along +u, parallel to the C-D rear wall) at
  `(u112, v512, 4·FH)` — on the left side between the rear wall and the dev
  cluster, clear of the Group-B logo row.

`npm run lint`, `type-check`, `build` clean; render `generated/dev/r223.png`
(crops `r223-*.png`).

### Revision round r222 (applied 2026-10-13; awaiting user review)

Sixth feedback pass (user list).

- **Freelancer:** both staircase-wall logos −15% (27 → 23).
- **Pacer (floor 4) — first logo content** (user-authorized tech list):
  - Added `TECH_LOGOS.docker` (#2496ED), `.githubactions` (#2088FF),
    `.opentelemetry` (#425CC7) from simple-icons; `SECTIONS.pacer = { role:null,
    tech:[githubactions,nestjs,postgresql,aws,docker,opentelemetry] }`.
  - New fragment **`information-04`** (`information04()`), assembled AFTER
    `floor-04-front` and before `floor-05-front`.
  - **Group A** (githubactions/nestjs/postgresql): floor row near the building's
    left (A-C) wall at the front corner A — `floorLogoDepth(...,u24,v62/132/202,
    4·FH)` (read along the depth axis).
  - **Group B** (aws/docker/opentelemetry): floor row near the rear (C-D) wall on
    the left, a line from just in front of the WhatsApp chat screen into the
    interior — `floorLogoDepth(...,u36,v560/495/430,4·FH)`.
  - All six use `floorLogoDepth` (flat on the floor, depth-axis reading).

`npm run lint`, `type-check`, `build` clean; render `generated/dev/r222.png`
(crops `r222-*.png`). Pacer placement is a first pass — the "left/right side of
the floor" wording was ambiguous, awaiting the user's correction.

### Revision round r221 (applied 2026-10-13; awaiting user review)

Fifth feedback pass (user list; items 1–3):

- **Puelo:** `c#` horizontally centred on its left-wall panel (`v 16 → 22`;
  measured panel centre), size 29 unchanged.
- **Freelancer:** c# nudged +10 svg-px right, unity +5/+5 down-right (new
  screen-space offsets).
- **Interactica f2-right:** mongodb nudged −10 svg-px left.
- **Tooling:** `logoPlate()` now takes optional `dx`/`dy` (SVG user units,
  applied as a `translate` before the plane matrix); `floorLogo`,
  `floorLogoDepth` and `frontLogo` forward them.

`npm run lint`, `type-check`, `build` clean; render `generated/dev/r221.png`
(crops `r221-*.png`). All placements **not yet approved**.

### Revision round r220 (applied 2026-10-12; awaiting user review)

Fourth feedback pass (user list). Changes:

- **Puelo:** `c#` reduced another 10% (32 → 29) and moved toward the front-left
  corner (`wallLogo(..., v 16, h 38)`) so it sits clearly on the left wall,
  clear of the vent.
- **BA:** added the **jQuery** brand logo (`simple-icons`, `#0769AD`) between
  php and mysql — new `TECH_LOGOS.jquery`, placed `floorLogoDepth('jquery', 26,
  305, 0, 45)`; `SECTIONS.ba.tech` now `['php','mysql','jquery']`.
- **Freelancer:** both staircase-wall logos reduced another 5% (28 → 27).
- **Nextcode:** "Co-Founder" enlarged another 25% (`.dw-role-floor-md` now 15px).
- **Interactica f2-left:** "Tech Lead" enlarged another 10% (`.dw-role-floor-xl`
  now 15.1px).
- **Halo bug fix:** `.dw-role-floor-md` and `.dw-role-floor-xl` were missing
  from the shared role-group selector, so Co-Founder and Tech Lead had lost the
  fill/font/light keyline halo — both classes are now in the group, giving the
  new labels the same white border as the other role labels.

`npm run lint`, `type-check`, `build` clean; render `generated/dev/r220.png`
(crops `r220-*.png`). All placements **not yet approved**.

### Revision round r219 (applied 2026-10-12; awaiting user review)

Third feedback pass (user list). Changes:

- **Puelo:** `c#` floor-left-wall logo reduced another 15% (size 38 → 32).
- **BA:** php + mysql logos rotated 90° on the floor plane to read along the
  depth axis (`FLOOR_MATRIX_D`; new `floorLogoDepth()` helper + the inline php
  decal matrix in `floor-ground`). User chose "option 1" but was unsure; review.
- **Freelancer:** both staircase-wall logos reduced another 10% (31 → 28).
- **Nextcode:** `Co-Founder` enlarged 20% via new `.dw-role-floor-md` (12px).
- **Health:** diamond spread — aws `hc+30 → hc+38`, mysql `hc−30 → hc−38`, to
  open the gap to the salesforce plate's top corners.
- **Interactica:**
  - f2-left `Tech Lead` +10% via new `.dw-role-floor-xl` (13.75px).
  - f2-right `nestjs` + `angular` re-layered: new fragment
    **`floor-02-front-base`** holds the opaque floor repaint (`slabTriangle`),
    `information-02-front` was moved BETWEEN it and `floor-02-front`, so the
    plates sit above the floor repaint but BELOW the kiosk sprite and the
    floor-2/3 corner line (`assemble-svg.mjs` `buildingParts` updated).
  - f3-right logos −10% (29 → 26); `Soft Arch` → two-row `Software` /
    `Architect` (`career-data.mjs` role `'Software Architect'`, split in
    `information03()`).
- **Floor 5 identity:** moved up to the right-wall arm's top border
  (`bdWallSheet(…, TOP_H − 8)` instead of `5·FH + 60`).

`npm run lint`, `type-check`, `build` clean; render `generated/dev/r219.png`
(crops `r219-*.png`). All placements **not yet approved**.

### Revision round r214/r215/r216/r217 (applied; awaiting user review)

Second feedback pass (user screenshots
`20261012T123351.png` = Co-Founder arrow, `20261012T124339.png` = Tech Lead
line). Changes:

- **Puelo:** `unity` floor logo →(170,42) size 45 (toward the kiosk/TV, clears
  the entrance jamb); `c#` wall logo size 38 (−15%) on the ground left wall
  below the vent.
- **BA:** `php` removed from `informationGround`; now an inline `logoPlate` in
  `floor-ground` BEFORE `baArchitecture()` with a literal floor matrix so the BA
  stub wall occludes its edge ("layer below the left-wall part"); `mysql` stays
  by the BA↔Freelancer door.
- **Freelancer:** both staircase-side logos size 31 (−15%).
- **Nextcode:** `Co-Founder` →`floorLabel(...,52,530,FH)` (read along the arrowed
  line); node/mongo now render below the desk/people via the new
  `nextcode-props` fragment (moved `assetWorkstation`, 2 crates, `DEV_GROUP`),
  assembled right after `information-01`.
- **Health:** DBA diamond on the left wall centred on v85 — `DBA` top (h FH+74),
  `aws` (+v) / `mysql` (−v) sides (h FH+48), `salesforce` bottom (h FH+22).
- **Interactica:** f2-left `Tech Lead` → `floorLabelDepth(...,55,537,2*FH,` +
  `dw-role-floor-lg`) so it reads along the depth axis (matches the red line);
  f2-right logos moved to `information-02-front` (after `floor-02-front`) so the
  `slabTriangle` no longer cuts them (`nestjs` (150,118) size 41, `mongodb`
  (46,178), `angular` (24,40)); f3-right `Soft Arch` + 2×2 logos centred on v118
  (−15% → size 29).

Verified on `r217b-*.png`: Health diamond correct, Tech Lead depth-reading
correct, f2-right logos visible/uncut, Puelo unity+c# and BA php visible.

### Revision round r209/r210 (applied; superseded by r214–r217 above)

Addressed the user's per-section list:

- **Puelo:** `Unity Dev` door label +15% (`dw-role-door-lg`); `unity` floor logo
  size 45 (+25%) moved to (119,48) off the entrance; `c#` moved to the
  ground-floor **left wall below the vent** (wall logo at v30, h42).
- **BA:** php/mysql size 45 (+25%); mysql moved to (26,378) by the BA↔Freelancer
  door. (php layer request not applicable — no A-C wall at BA's depth.)
- **Freelancer:** unity/c# moved onto the staircase's **solid side wall**
  (`v=STAIR_V0`) via new `frontLogo`, low along its base.
- **Nextcode:** new `nextcode-people` fragment (dev sprite drawn AFTER
  `information-01`) so `angular` renders **under** the people; `nodedotjs`
  →(156,560); `mongodb`→(140,479) (user's red circle, above the devs' heads);
  `Co-Founder`→(92,483). **Co-Founder intent still ambiguous — see §5.**
- **Health:** left wall reorganised into **3 stacked rows** (`wallLogoRowCentered`):
  `DBA` top (h=FH+72), `aws`+`mysql` middle (h=FH+44), `salesforce` bottom
  (h=FH+16), all centred on v130.
- **Interactica:** f2-left `Tech Lead` resized (`dw-role-floor-lg`) →(40,430);
  **A-Frame logo** now the user-supplied official brand raster
  (`src/assets/aframe-logo.png` via the `__ASSET__` pipeline; `tech-logos.mjs`
  `aframe.body` is an `<image>`); f2-right `Dev` added **over the "2"** via new
  fragment `information-elev` (placed after `elevator`); `nestjs` size 41
  (+15%); f2-right `mongodb`→(46,178) (off the kiosk cable); f3-right `Soft Arch`
  + 2×2 logos as 3 rows, and `information-03` now emitted **after `floor-03-front`**
  so it mounts on that partial wall (it was hidden behind it).
- **Identity block:** moved off the rear wall to the **B-D right wall at the D
  corner** (`bdWallSheet`), titles only (`Software Architect` / `Technical Lead`).
- `assemble-svg.mjs`: added `nextcode-people` + `information-elev`, removed the
  duplicated `information` entry, reordered `information-03`.

`npm run lint`, `type-check`, `build` clean. All placements are **not yet
approved** — the user reviews `r210.png`.

## 2. Dev workflow (exact commands, from repo root `C:\repo\cv`)

```powershell
npm run svg:generate        # scripts/generate-geometry.mjs -> src/svg/fragments/*.svg
npm run svg:assemble        # scripts/assemble-svg.mjs -> src/svg/diorama.svg
python generated\dev\make_chk.py     # wraps diorama.svg into chk.html (viewBox-aware, dark backdrop, assets inlined)
& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless --disable-gpu `
  --screenshot="C:\repo\cv\generated\dev\rNN.png" --window-size=2250,2387 --hide-scrollbars `
  "file:///C:/repo/cv/generated/dev/chk.html"
Start-Sleep -Seconds 6        # the file appears ~1-2 s AFTER msedge returns
python - <<crop script>>      # see §6 for the crop helper used this round
npm run lint ; npm run type-check ; npm run build
```

- Render is S=2.5; viewBox is `200 95 900 955` (Stage 6). Screen px =
  `((svgX-200)*2.5, (svgY-95)*2.5)`.
- `generated/` is gitignored (all dev scripts/renders). Committed artifacts:
  `src/svg/diorama.svg`, `src/svg/fragments/*.svg`, `src/assets/*` (+ `serve/`),
  `scripts/*.mjs`, `scripts/optimize-assets.py`.
- To replace the profile photo: swap the master in `src/assets/`, run
  `python scripts/optimize-assets.py` (it now scans `scripts/career-data.mjs`
  for `photo: '…'`), then generate + assemble.

## 3. Files touched in Stage 7

- **NEW `scripts/career-data.mjs`** — content source of truth: `IDENTITY`
  (name `J. E. Barrocal`, linkedin `https://www.linkedin.com/in/jebarrocal/`,
  photo `photo2_2.jpg`), `SECTIONS` (per-section `role` + `tech[]` keys),
  `CURRENT_IDENTITY` (`Software Architect` / `Technical Lead` / AI focus).
- **NEW `scripts/tech-logos.mjs`** — `TECH_LOGOS` map: brand mark path `d`
  (24×24 viewBox) + `color`, OR a raw `body` (used for the two authored marks).
  Keys present: `unity, csharp, php, jquery, mysql, nodedotjs, mongodb, angular, aws
  (amazonwebservices), aframe, flutter, postgresql, salesforce, nestjs,
  angularMfe, microservices`. Sources: Iconify `simple-icons` (free); the last
  two are hand-authored SVG (no official logo exists).
- **`scripts/generate-geometry.mjs`** — QR helper (`qrPath`), LinkedIn glyph,
  rewritten `projectingSign()`, and the per-floor information fragments
  (`informationGround`, `information01/02/03`, `information`) + helpers
  (`logoPlate`, `floorLogo`, `floorLogoRow`, `wallLogoRow`, `wallLabel`,
  `doorLabel`, `floorLabel`, `frontLabel`, `identityBlock`). See §4.
- **`scripts/style.mjs`** — `.dw-sign-name`, `.dw-sign-link`, `.dw-photo-ring`,
  `.dw-qr-plate`, `.dw-qr`, `.dw-ln`, `.dw-role-wall/door/floor`
  (dark bold text + light keyline halo, `paint-order: stroke`),
  `.dw-logo-plate`, `.dw-id-*`. The old `.dw-sign-bar` / `.dw-info*` were removed.
- **`scripts/assemble-svg.mjs`** — `buildingParts` now interleaves the per-floor
  info fragments so occlusion is correct (§4) and adds `information-ground`.
- **`scripts/optimize-assets.py`** — `REF_RE` also matches `photo:` and scans
  `career-data.mjs`.
- **`package.json`** — dev-dependency `qrcode`.
- **NEW assets** `src/assets/photo2_2.jpg` (+ `src/assets/serve/photo2_2.jpg`).
- **NEW fragments** `information-ground.svg`, `information-01.svg`,
  `information-02.svg`, `information-03.svg`, `information.svg`; regenerated
  `projecting-sign.svg`, `diorama.svg`. `tags.svg`, `elevator.svg`,
  `entrance.svg` are byte-identical to Stage 6 (company signs + year plaques
  preserved).

## 4. Implementation details (must-know)

### 4.1 Per-floor info fragments + layer order

The information layer is split **one fragment per floor** so the floor above
occludes deeper logos/labels exactly like a prop. The single-fragment version
was drawn last and floated over the building. `assemble-svg.mjs`
`buildingParts` order (relevant part):

```
floor-ground, staircase, freelancer-props, information-ground, floor-01,
information-01, floor-02, information-02, floor-03, floor-03-team,
information-03, floor-04, floor-05, architectural-details, elevator,
floor-02-front, floor-03-front, floor-04-front, floor-05-front, tags, information,
indelve-fleets
```

- `information-ground` sits after `freelancer-props` (so the Freelancer logos
  read as pasted on the staircase base) and BEFORE `floor-01` (so the floor-1
  slab base occludes the door labels' top — the user's "layer below the base of
  the 1st floor" request).
- `information-01/02/03` sit right after their floor and before the next floor.
- `information` (only the fifth-floor identity block) sits with `tags`.

### 4.2 Coordinate helpers (in `generate-geometry.mjs`)

- `FLOOR_MATRIX = '0.7071 -0.2475 0.7071 0.2475'` — floor plane,
  **orientation-preserving** (local +x→+u, +y→−v); a reflection matrix mirrors
  text/logos (fixed this round).
- `UPLANE_MATRIX = TAG_MATRIX = '0.7071 0.2475 0 1'` — the invisible left wall
  (u = `INFO_WALL_U` = −1.5), same plane as the company tags.
- `VPLANE_MATRIX = '0.7071 -0.2475 0 1'` — constant-v wall faces (e.g. above the
  elevator doors).
- `floorLogo(key,u,v,hTop,size=36)` lies flat on the floor; `floorLogoRow` steps
  by `size*1.28`. `wallLogoRow(keys,v0,h,size=34)` runs along +v on the left
  wall. `doorLabel(text,v)` is on the ground partition near face at u=42.5,
  h=`DOOR_H+9`. `frontLabel(text,u,v,h)` is on a constant-v face.
- Logo plates: a near-white rounded `dw-logo-plate` + the brand art (`.64*size`).

### 4.3 Current placements (u, v, h) — r208

Ground (`h=0`), fragment `information-ground`:
- `Unity Dev` door label at partition `PARTITION_G[0]` (~v 139.9); `Jr. Developer`
  at `PARTITION_G[1]` (~v 399.8).
- Puelo `unity` (119, 16) [inside the entrance], `csharp` (38, 16) [floor at the
  vent corner].
- BA `php` (26, 235), `mysql` (26, 285) [near the left wall].
- Freelancer `unity` (104, 501), `csharp` (62, 501) [stair base / PC at (82, 514.5)].

Floor 1 (`h=FH`), `information-01`:
- Nextcode `nodedotjs` (136, 560) [stair top], `mongodb` (188, 548) [past the desk
  at (149, 570)], `angular` (26, 408) [between boxes (27,470) and devs (20,346)];
  `Co-Founder` floor label (96, 492).
- Health `DBA` wall label (v 48, h FH+44); logos `mysql, aws, salesforce` on the
  left wall from v 88, step 43.5, h FH+44.

Floor 2 (`h=2*FH`), `information-02`:
- `Dev` front label on the elevator W2 outer face (u 24, v `SHAFT_V0-WALL_T`=222.5,
  h 2·FH+DOOR_H+18).
- `nestjs` (150, 118) [corner desks], `mongodb` (56, 200) [by the doors],
  `angular` (24, 40) [left-front corner].
- `Tech Lead` floor label (30, 452); logos `aws, aframe, unity` from (46, 470),
  step 46.

Floor 3 (`h=3*FH`), `information-03`:
- `Soft Arch` wall label (v 48, h 3·FH+44); logos
  `flutter, postgresql, angularMfe, microservices` on the left wall from v 88,
  step 43.5, h 3·FH+44.

Floor 5, `information`: `identityBlock()` — `Software Architect` / `Technical
Lead` + AI focus, on the rear C-D wall via `cdWallSheet(108, 80, …, 5*FH)`.

### 4.4 Projecting sign (`projectingSign()`)

- Blade widened 25%: `vFront = -122` (was -100), `vBack = -12`.
- Panel local layout (origin = top-back corner, `matrix(0.7071 0.2475 0 1 …)`):
  photo circle cx 55 cy 40 r 24; name y 86; QR 64² at (23,100) ECC-H with a
  centered LinkedIn mark; full URL `linkedin.com/in/jebarrocal` at y 180.
- **Photo bug fixed**: the ring used `class="dw-sign-frame"` whose CSS `fill`
  overrode `fill="none"`, painting a wood disc over the portrait; now a
  dedicated `.dw-photo-ring { fill: none }`.
- QR verified byte-for-byte against `QRCode.create(url,{errorCorrectionLevel:'H'})`
  (a disposable `generated/dev/qr_check.mjs`).

## 5. Open issues — RESOLVED (user-approved 2026-10-13)

All previously open items were approved by the user when closing Stage 7:

1. **Nextcode `Co-Founder`** — approved (reads along the arrowed line).
2. **BA `php`** layer — approved.
3. **Puelo `unity`** entrance placement — approved.
4. **Health diamond** / **f3 "Software Architect"** layout — approved.
5. **Indelve** — approved: it intentionally carries no information content (its
   scene is the content). **Pacer** — content supplied by the user (role +
   technology logos).
6. Plate sizing / general look — approved. All Interactica elements approved.

## 6. Crop helper used this round (paste into `python -`)

```python
from PIL import Image
im = Image.open(r"generated/dev/r210.png")
S=2.5; ox=200; oy=95
def crop(x0,y0,x1,y1,name,scale=2):
    b=(int((x0-ox)*S), int((y0-oy)*S), int((x1-ox)*S), int((y1-oy)*S))
    c=im.crop(b); c=c.resize((int(c.width*scale),int(c.height*scale)))
    c.save(f"generated/dev/r210-{name}.png")
crop(430,760,790,1000,"ground")   # etc.
```

Useful existing dev tools in `generated/dev/`: `make_chk.py`, `qr_check.mjs`,
`crop_r*.py`, `measure_props.py`, `ascii_cut.py`.

## 7. Acceptance criteria status (`STAGE_07_INFORMATION_LAYER.md` §Acceptance)

- [x] Info layer separated from geometry + maintainable (data-driven).
- [x] Existing company signs + year plaques preserved (byte-identical).
- [x] Role label per experience — present, approved (Indelve intentionally none).
- [x] Technologies selected for relevance — present, approved.
- [x] Project descriptions — the per-experience scene sprites / visual
      references are the descriptions (user decision, 2026-10-13).
- [x] Interactica two-floor continuity — f2 right `Dev` / f2 left `Tech Lead` /
      f3 `Software Architect`; approved.
- [x] Current identity in upper area — floor-5 rear wall; approved.
- [x] Exterior sign: photo + name + valid LinkedIn QR + URL; no titles.
- [x] No invented Indelve/Pacer content (Pacer supplied by the user).
- [x] No Stage 8 mode logic / query params / alternate sign sizes.
- [x] SVG generation/assembly functional; layer visible in a fresh render.
- [x] Legibility / no-obscuring — approved.

## 8. Close-out checklist (done)

1. Render the current state (`svg:generate` + `svg:assemble` + `make_chk` +
   msedge → `r224.png`).
2. All §5 open items approved by the user on 2026-10-13.
3. Corrections implemented in `career-data.mjs` / `tech-logos.mjs` (content) and
   `generate-geometry.mjs` (placement).
4. Completion Report filled in `STAGE_07_INFORMATION_LAYER.md`; `src/svg/README.md`
   §Stage 7 and `AGENTS.md` Development Status updated; committed.

## 9. Pacer logos — feasibility survey (r221; resolved in r222)

User (r221 item 4) wants Pacer-floor logos for: **nestjs, aws, data modeling,
postgresql, Logging & Traceability (microservices), SaaS, CI/CD, GitHub
Actions, docker**. Survey (all free/open-source licenses; ready to add to
`scripts/tech-logos.mjs`):

- **Already have an official mark in `TECH_LOGOS`:** `nestjs` (#E0234E), `aws`
  (#FF9900, `amazonwebservices`), `postgresql` (#4169E1).
- **Add from simple-icons (CC0, 24×24 path):**
  - **docker** — `simple-icons:docker` (#2496ED).
  - **GitHub Actions** — `simple-icons:githubactions` (#2088FF).
  - **Logging & Traceability** — propose **OpenTelemetry**
    (`simple-icons:opentelemetry`), the de-facto tracing/observability standard;
    a real brand rather than an invented glyph.
- **No official brand** (concept, not a product) — `data modeling`, `SaaS`,
  `CI/CD`. Two options:
  1. **Author small SVG marks** in the existing `angularMfe` / `microservices`
     hand-drawn style (full control, no attribution) — a schema/ER glyph, a
     cloud-in-a-box glyph, and an infinity/loop pipeline glyph.
  2. **Use free generic icons** (Material Design Icons, Apache-2.0, 24×24):
     e.g. `mdi:database-cog` (data modeling), `mdi:cloud-sync` /
     `mdi:cloud-check` (SaaS), `mdi:sync` / `mdi:refresh-auto` (CI/CD).
- Open questions for the user: whether to use OpenTelemetry for logging/tracing;
  author vs. generic for the three concepts; and whether "CI/CD" should instead
  be represented solely by the GitHub Actions mark.
