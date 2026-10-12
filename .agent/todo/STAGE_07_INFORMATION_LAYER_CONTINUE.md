# Stage 07 Information Layer — Continuation #1 (fresh session handoff)

> **STATUS: WIP — NOT COMPLETE.** Stage 7 is implemented but the information
> layer is still being iterated with the user (per-section placement/size
> reviews). This file is the self-contained handoff for the NEXT session: read
> it first, then `AGENTS.md`, `.agent/todo/STAGE_07_INFORMATION_LAYER.md` (the
> stage spec + acceptance criteria), `src/svg/README.md` §"Stage 7", and
> `.agent/project-info/PROJECT_BRIEF.md`.
>
> Do NOT mark Stage 7 complete or start Stage 8 until the user approves the
> renders.

## 0. Current status & commit (2026-10-12)

- **Base commit:** `c30e5b9` — "stage 7 WIP: information layer (per-section roles
  + tech logos + real projecting-sign content) + fresh-session handoff".
- **This commit:** `bd14e30` — second feedback round r214–r217 (details in §1):
  per-section placement/size fixes; new fragments `nextcode-props`,
  `information-02-front`, `information-elev`; A-Frame official raster logo wired
  through the `__ASSET__` pipeline; Health DBA diamond; Tech Lead depth-reading;
  Soft Arch 2×2 centring. `npm run lint` / `type-check` / `build` clean; render
  `generated/dev/r218.png` (byte-identical to `r217.png`), verified via
  `r217b-*.png`.
- **State:** Stage 7 **WIP — NOT COMPLETE**; placements await the user's review.
  Stage 8 must not start.
- **Continue in a new session:** read this file, then `AGENTS.md`,
  `.agent/todo/STAGE_07_INFORMATION_LAYER.md`, `src/svg/README.md` §"Stage 7",
  `.agent/project-info/PROJECT_BRIEF.md`. Re-render to confirm `r218`, get the
  user's verdict on the §5 open items, then iterate or close out Stage 7.
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
  Keys present: `unity, csharp, php, mysql, nodedotjs, mongodb, angular, aws
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

## 5. Open issues / user feedback not yet resolved (r217)

The r209–r217 rounds actioned the user's first two feedback passes. Still
needing the user's verdict (do NOT guess further — ask):

1. **Nextcode `Co-Founder`** now reads along the arrowed line at (52,530,FH).
   Confirm it matches the annotation.
2. **BA `php`** is an inline decal in `floor-ground` before the BA stub wall
   (literal floor matrix). Interpretation of "layer below the left-wall part"
   is still a guess — confirm.
3. **Puelo `unity`** at (170,42) is inside the entrance near the 2013 door;
   confirm it clears the jambs as intended.
4. **Health diamond** and **Soft Arch 2×2** centring (−15%) — confirm.
5. **Indelve / Pacer** — still no content (must not be invented).
6. General clutter / floating look of the larger plates remains a judgement call.

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
- [~] Role label per experience — present but placements not approved.
- [~] Technologies selected for relevance — present but placements not approved.
- [ ] Project descriptions — **not implemented** (user dropped the plaque
      approach; descriptions not currently rendered).
- [~] Interactica two-floor continuity — split as f2 right `Dev` / f2 left
      `Tech Lead` / f3 `Soft Arch`; not approved.
- [~] Current identity in upper area — present on floor-5 rear wall; confirm.
- [x] Exterior sign: photo + name + valid LinkedIn QR + URL; no titles.
- [x] No invented Indelve/Pacer content.
- [x] No Stage 8 mode logic / query params / alternate sign sizes.
- [x] SVG generation/assembly functional; layer visible in a fresh render.
- [ ] Legibility / no-obscuring — **not yet approved**.

## 8. Suggested next-session checklist

1. Render the current state first: `svg:generate` + `svg:assemble` + `make_chk` +
   msedge → `r218.png`; confirm it matches `r217.png`.
2. Get the user's per-section correction list (positions/sizes + which wall for
   DBA/Soft Arch). Do NOT guess further on the open items in §5 — ask.
3. Implement corrections in `career-data.mjs` / `tech-logos.mjs` (content) and
   `generate-geometry.mjs` (placement only). Regenerate + re-render + crops.
4. When the user approves: fill the Completion Report in
   `STAGE_07_INFORMATION_LAYER.md`, update `src/svg/README.md` §Stage 7 and
   `AGENTS.md` Development Status, and commit.
