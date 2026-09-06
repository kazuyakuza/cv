import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

// Stage 2 geometry generator — emits the repetitive architectural fragments
// (floors, staircase, elevator, entrance, career-sign) from the shared
// parameter block documented in src/svg/README.md. terrain.svg, path.svg and
// labels.svg stay hand-authored. Edit parameters here, re-run
// `npm run svg:generate`, then `npm run svg:assemble`.

// ---------------------------------------------------------------------------
// Shared parameters (mirror of src/svg/README.md)
// ---------------------------------------------------------------------------
const AXIS_W = [0.7071, -0.2475] // isometric width axis (short entrance face A-B)
const AXIS_D = [-0.7071, -0.2475] // isometric depth axis (long left side A-C)
const CORNER_A = [750, 985] // nearest viewer corner, ground slab top
const LW = 238 // building width  (3D units along AXIS_W)
const LD = 588 // building depth  (3D units along AXIS_D)
const FH = 105 // floor-to-floor height
const SLAB_T = 12.5 // slab thickness
const WALL_T = 7.5 // back wall / partition thickness
const STORY_H = FH - SLAB_T // clear story height between slabs (92.5)

const SHAFT_U = 0.171 * LW // shaft inner edge, width fraction (narrowed four times)
const SHAFT_V0 = 0.46 * LD // shaft depth start  (Health Platforms side)
const SHAFT_V1 = 0.585 * LD // shaft depth end    (Nextcode side)
const DOOR_H = 52.5 // door opening height (passages); elevator door leaf height
// Closed double door on the W2 (right) wall face, like a normal elevator:
// two panels meeting at the center, drawn on the face toward Health Platforms.
const DOOR_U0 = 6.5
const DOOR_U1 = SHAFT_U + WALL_T - 6.5

const STAIR_U0 = 22 // flight inset from the open A-C side: visible gap to the left wall
const STAIR_RUN = 105 // horizontal run along the width axis (minimum to reach floor 1)
const STAIR_WIDTH = 40 // stair width across the depth axis
const STAIR_V0 = LD - WALL_T - STAIR_WIDTH // flight against the C-D rear wall
const STAIR_U1 = STAIR_U0 + STAIR_RUN // top of flight, arrives at floor-1 slab edge
const STAIR_V1 = STAIR_V0 + STAIR_WIDTH
const STAIR_STEPS = 12

// Wall-mounted stair banister (Stage 5 user revision): rail height above the
// treads/floor it serves, and the u where the diagonal crosses the floor-1
// level (h = FH) — the split point between the banister's two elements.
const RAIL_H = 28
const RAIL_MID_U = STAIR_U0 + FH - RAIL_H

const TAG_CHAR_W = 5.2 // plaque text width: approx glyph advance per char
// The floor-01 stair opening covers the flight's full footprint and reaches
// the C-D wall, so the whole final flight stays visible through it and the
// top step lands flush with the slab (a clear union with the landing).
const STAIR_HOLE_U1 = STAIR_U1
const STAIR_HOLE_V1 = STAIR_V1

const PARTITION_G = [0.28 * LD, 0.68 * LD] // ground floor partitions (Puelo Games reduced 20%)
const STUB_H = 50 // fifth-floor stub wall height
const STUB_LEN = 0.4 // stub wall length fraction along back walls
const D_CORNER_ARM = STUB_LEN * LW // fifth-floor D-corner wall arm length
const TOP_H = 6 * FH // intended top of fifth floor story

const FRAGMENTS_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'svg', 'fragments')

// ---------------------------------------------------------------------------
// Projection helpers
// ---------------------------------------------------------------------------
const round = (n) => {
  const r = Math.round(n * 100) / 100
  return Number.isInteger(r) ? String(r) : String(r)
}

// Hand-drawn character (Stage 4 §6): deterministic corner jitter, hashed on
// the quantized projected position so every face sharing a corner is
// perturbed identically — edges stay welded and no cracks open between
// faces. Amplitude is extremely small on purpose: precise drawing made by
// hand, not inaccurate drawing (±JITTER px per axis).
const JITTER = 0.55
const hash2 = (a, b) => {
  let n = (Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263)) >>> 0
  n = Math.imul(n ^ (n >>> 13), 1274126177) >>> 0
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296
}
const jitter = (x, y) => {
  const xi = Math.round(x * 100)
  const yi = Math.round(y * 100)
  return [x + (hash2(xi, yi) - 0.5) * 2 * JITTER, y + (hash2(yi, xi) - 0.5) * 2 * JITTER]
}

// Project a 3D point (u along width, v along depth, h above ground slab top).
const p = (u, v, h) => {
  const [x, y] = jitter(
    CORNER_A[0] + AXIS_W[0] * u + AXIS_D[0] * v,
    CORNER_A[1] + AXIS_W[1] * u + AXIS_D[1] * v - h,
  )
  return `${round(x)},${round(y)}`
}

const path = (pts) => `M${pts.join(' L')} Z`

// Per-floor floor material (Stage 5 §5): every floor-top piece carries a
// material class (dw-f0 … dw-f5) resolving to a pattern fill in style.mjs.
// userSpaceOnUse patterns keep all pieces of one floor (slab top, the
// shaft-crossing triangle re-layers, the entrance threshold) seamlessly in
// phase. Materials are intentionally shared where the career story shares a
// surface: Interactica keeps the same wood on floors 2 and 3.
const floorCls = (hTop) => `dw-f${Math.round(hTop / FH)}`

// Horizontal face (slab tops, treads, wall tops): normal +h (up).
const hFace = (u0, u1, v0, v1, h) => path([p(u0, v0, h), p(u1, v0, h), p(u1, v1, h), p(u0, v1, h)])

// Vertical face in a plane of constant u. Normal is -u when u is the greater
// coordinate of the material it bounds (faces toward the open A-C side).
const uFace = (u, v0, v1, h0, h1) => path([p(u, v0, h0), p(u, v1, h0), p(u, v1, h1), p(u, v0, h1)])

// Vertical face in a plane of constant v (faces toward viewer when v is the
// smaller coordinate of the material it bounds).
const vFace = (v, u0, u1, h0, h1) => path([p(u0, v, h0), p(u1, v, h0), p(u1, v, h1), p(u0, v, h1)])

// Vertical column line. Routed through p() so its endpoints share the same
// jittered corners as the slabs they meet; the tiny per-endpoint difference
// reads as a hand-drawn lean (Stage 4 §6).
const column = (u, v, h0, h1) => {
  const [x1, y1] = p(u, v, h0).split(',').map(Number)
  const [x2, y2] = p(u, v, h1).split(',').map(Number)
  return `<line class="dw-column" x1="${round(x1)}" y1="${round(y1)}" x2="${round(x2)}" y2="${round(y2)}" />`
}

const el = (cls, d, attrs = '') => `<path class="${cls}"${attrs} d="${d}" />`

// ---------------------------------------------------------------------------
// Floor fragments (slab + story walls + partitions + shaft story segment)
// ---------------------------------------------------------------------------
const stairHoleAt = (h) =>
  path([
    p(STAIR_U0, STAIR_V0, h),
    p(STAIR_HOLE_U1, STAIR_V0, h),
    p(STAIR_HOLE_U1, STAIR_HOLE_V1, h),
    p(STAIR_U0, STAIR_HOLE_V1, h),
  ])

// Slab construction for the slab whose TOP sits at height hTop. Emits the top
// face (with optional stair hole) and the two open-side edge bands. Every
// floor uses one complete slab; shaft-crossing floors render whole below the
// elevator (user revision).
function slab(hTop, { stairOpening = false } = {}) {
  const hBot = hTop - SLAB_T
  const holes = []
  if (stairOpening) holes.push(stairHoleAt(hTop))
  const topD = `${path([p(0, 0, hTop), p(LW, 0, hTop), p(LW, LD, hTop), p(0, LD, hTop)])}${holes.map((d) => ` ${d}`).join('')}`
  // Floor top surfaces use dw-floor (Stage 4.5 §3.2): a distinct warm base
  // tone so floors read as physical surfaces, not white polygons.
  const out = [
    holes.length
      ? `<path class="dw-floor ${floorCls(hTop)}" fill-rule="evenodd" d="${topD}" />`
      : el(`dw-floor ${floorCls(hTop)}`, topD),
  ]
  // Front edge band (A-B side, cut face at v = 0).
  out.push(el('dw-slab-edge', path([p(0, 0, hTop), p(LW, 0, hTop), p(LW, 0, hBot), p(0, 0, hBot)])))
  // Left edge band (A-C side, cut face at u = 0). Continuous: the stair
  // flight is inset from the open side (STAIR_U0 > 0), so the floor-01 slab
  // reads as one coherent plane around the stair opening.
  //
  // Floor-2 revision (user revision): where this band crosses the floor-1
  // return wall's face on screen, only the stretch between the wall's near
  // edge (the W2 face's outer line) and the passage's near jamb is dropped —
  // there its bottom edge read as a stray scratch on the clean white wall
  // between the elevator doors and the section's door. The rest stays one
  // continuous band: dropping the whole wall-face crossing read as the base
  // line breaking off at the shaft (user revision). Both cut ends land on
  // existing strokes — the front end at the passage jamb's screen x, the
  // rear end on the wall face's left edge.
  if (hTop === 2 * FH) {
    const vJamb = SHAFT_V0 - WALL_T - RET_DOOR_U0
    const vShaft = SHAFT_V0 - WALL_T - (SHAFT_U + WALL_T)
    out.push(
      el(
        'dw-slab-edge',
        path([p(0, 0, hTop), p(0, vJamb, hTop), p(0, vJamb, hBot), p(0, 0, hBot)]),
      ),
    )
    out.push(
      el(
        'dw-slab-edge',
        path([p(0, vShaft, hTop), p(0, LD, hTop), p(0, LD, hBot), p(0, vShaft, hBot)]),
      ),
    )
  } else {
    out.push(
      el('dw-slab-edge', path([p(0, 0, hTop), p(0, LD, hTop), p(0, LD, hBot), p(0, 0, hBot)])),
    )
  }
  if (stairOpening) {
    // No cut faces around the stair opening (user revision): the opening
    // reaches the C-D wall, so the rear wall shows through it as one
    // continuous surface crossed only by the floor separation line.
  }
  return out
}

// Floor triangle at the shaft's front-right (user revision): the slab strip
// between the building's left wall (u = 0), the elevator's doors side (W2
// outer face, v = SHAFT_V0 - WALL_T) and the shaft's width line (u =
// SHAFT_U + WALL_T). Re-layered in floor-0X-front OVER the elevator, so the
// W2 level band's lower sliver never paints over the floor; the shaft walls
// and doors sit exactly on the triangle's upper edge and stay fully visible.
// Fill only: the slab below is continuous, so stroked edges would read as
// spurious seams (its real edges coincide with the wall base and the open-
// side bands, which carry their own strokes).
function slabTriangle(hTop) {
  return [
    el(
      `dw-floor-fill ${floorCls(hTop)}`,
      path([
        p(0, 0, hTop),
        p(SHAFT_U + WALL_T, 0, hTop),
        p(SHAFT_U + WALL_T, SHAFT_V0 - WALL_T, hTop),
        p(0, SHAFT_V0 - WALL_T, hTop),
      ]),
    ),
  ]
}

// Ceiling shadow strips (Stage 5 §7): the slab above shades the top of each
// story's rear walls. Three stepped translucent bands of constant height —
// they follow the slanted wall tops exactly and read as a soft wash.
const CEIL_BANDS = [
  [0, 8, 'dw-shade-a'],
  [8, 18, 'dw-shade-b'],
  [18, 30, 'dw-shade-c'],
]
const ceilBands = (face, hTop, attrs = '') =>
  CEIL_BANDS.map(([d0, d1, cls]) => el(cls, face(hTop - d1, hTop - d0), attrs))

// Back wall story between slab tops hBase and hBase + FH. The wall extends
// up to the slab-above's TOP line so no gap shows through the stair opening
// at the slab band (user revision: extend the wall, no patch geometry). The
// wall top is covered by the slab above, so no top band is emitted for
// completed floors. B-D wall keeps u in [LW-WALL_T, LW], v in [0, LD-WALL_T];
// C-D wall covers the remaining corner strip.
function backWalls(hBase) {
  const hTop = hBase + FH
  const out = []
  // B-D wall (long back-right, plane u = LW): inner face + cut end at v = 0.
  // Inner faces use dw-wall-far: they sit deep inside the section and read
  // lighter for depth (Stage 4 §8); their cut ends stay section poché.
  out.push(el('dw-wall-far', uFace(LW - WALL_T, 0, LD - WALL_T, hBase, hTop)))
  out.push(el('dw-slab-edge', vFace(0, LW - WALL_T, LW, hBase, hTop)))
  // C-D wall (short back, plane v = LD): inner face + cut end at u = 0.
  out.push(el('dw-wall-far', vFace(LD - WALL_T, 0, LW, hBase, hTop)))
  out.push(el('dw-slab-edge', uFace(0, LD - WALL_T, LD, hBase, hTop)))
  // Ceiling washes over both inner faces (Stage 5 §7).
  out.push(...ceilBands((h0, h1) => uFace(LW - WALL_T, 0, LD - WALL_T, h0, h1), hTop))
  out.push(...ceilBands((h0, h1) => vFace(LD - WALL_T, 0, LW, h0, h1), hTop))
  return out
}

// Interior partition: thin volume across the full width at depth fv.
// With `opening`, a door-height passage near the open A-C side (visible side)
// connects the two sections; no detailed door, just the architectural opening.
const PART_OPEN_U0 = 15
const PART_OPEN_U1 = 70
function partition(fv, hBase, { opening = false } = {}) {
  const hTop = hBase + STORY_H
  const v0 = fv - WALL_T / 2
  const v1 = fv + WALL_T / 2
  const uEnd = LW - WALL_T // abut the B-D wall's inner face (user revision)
  const out = []
  if (opening) {
    // Front face (-v) with the passage notch reaching down to the floor.
    out.push(
      el(
        'dw-partition',
        path([
          p(0, v0, hBase),
          p(0, v0, hTop),
          p(uEnd, v0, hTop),
          p(uEnd, v0, hBase),
          p(PART_OPEN_U1, v0, hBase),
          p(PART_OPEN_U1, v0, hBase + DOOR_H),
          p(PART_OPEN_U0, v0, hBase + DOOR_H),
          p(PART_OPEN_U0, v0, hBase),
        ]),
      ),
    )
    // Far jamb over the face (user revision): the reveal is cut by the head
    // line on screen — its back-top corner drops by the screen-slope
    // compensation (moving WALL_T back along +v raises the projection by
    // 0.2475 · WALL_T, and the head line falls by the same amount over the
    // same screen run), so the reveal's top edge lies exactly on the head
    // line and nothing pokes above it. The front edge comes from the face
    // notch; the head line is re-drawn over the jamb's fill. No soffit.
    const jambDrop = 2 * -AXIS_D[1] * WALL_T
    out.push(
      el(
        'dw-partition',
        path([
          p(PART_OPEN_U1, v0, hBase),
          p(PART_OPEN_U1, v1, hBase),
          p(PART_OPEN_U1, v1, hBase + DOOR_H - jambDrop),
          p(PART_OPEN_U1, v0, hBase + DOOR_H),
        ]),
      ),
    )
    const [hx1, hy1] = p(PART_OPEN_U0, v0, hBase + DOOR_H).split(',')
    const [hx2, hy2] = p(PART_OPEN_U1, v0, hBase + DOOR_H).split(',')
    // Head line slightly stronger than the partition itself: the opening
    // reads as intentional architecture (Stage 4 §11), no door frames.
    out.push(`<line class="dw-opening" x1="${hx1}" y1="${hy1}" x2="${hx2}" y2="${hy2}" />`)
  } else {
    out.push(el('dw-partition', vFace(v0, 0, uEnd, hBase, hTop)))
  }
  out.push(el('dw-slab-edge', uFace(0, v0, v1, hBase, hTop)))
  return out
}

// Floor-1 return walls: continue the shaft's W2 / W3 walls toward the rear
// B-D wall, dividing the floor into Nextcode | Elevator | Health Platforms.
// Each carries a door-height passage near the open side (part visible),
// like the section separations on the ground floor.
const RET_DOOR_U0 = 75
const RET_DOOR_U1 = 130
function shaftReturnWalls(hBase) {
  const hTop = hBase + STORY_H
  const u0 = SHAFT_U + WALL_T // abut the shaft walls' outer ends
  const doorTop = hBase + DOOR_H
  // Face with the door notch reaching down to the floor.
  const faceWithDoor = (v) =>
    path([
      p(u0, v, hBase),
      p(u0, v, hTop),
      p(LW - WALL_T, v, hTop),
      p(LW - WALL_T, v, hBase),
      p(RET_DOOR_U1, v, hBase),
      p(RET_DOOR_U1, v, doorTop),
      p(RET_DOOR_U0, v, doorTop),
      p(RET_DOOR_U0, v, hBase),
    ])
  // Passage reveal (user revision): the same construction as the ground
  // partitions — far jamb over the face, its back-top corner dropped by the
  // screen-slope compensation so the reveal is cut by the head line, and one
  // `dw-opening` head line re-drawn over the jamb's fill. No soffit face:
  // the old hFace over the opening projected past the jamb (its back edge
  // lands left of the reveal) and read as a stray line floating between the
  // shaft and the passage head.
  const jambDrop = 2 * -AXIS_D[1] * WALL_T
  const passage = (v) => {
    const [hx1, hy1] = p(RET_DOOR_U0, v, doorTop).split(',')
    const [hx2, hy2] = p(RET_DOOR_U1, v, doorTop).split(',')
    return [
      el(
        'dw-partition',
        path([
          p(RET_DOOR_U1, v, hBase),
          p(RET_DOOR_U1, v + WALL_T, hBase),
          p(RET_DOOR_U1, v + WALL_T, doorTop - jambDrop),
          p(RET_DOOR_U1, v, doorTop),
        ]),
      ),
      `<line class="dw-opening" x1="${hx1}" y1="${hy1}" x2="${hx2}" y2="${hy2}" />`,
    ]
  }
  return [
    // Health Platforms side (continues W2), with passage lining for depth.
    el('dw-partition', faceWithDoor(SHAFT_V0 - WALL_T)),
    ...passage(SHAFT_V0 - WALL_T),
    el('dw-slab-edge', uFace(u0, SHAFT_V0 - WALL_T, SHAFT_V0, hBase, hTop)),
    // Nextcode side (continues W3), with passage lining for depth.
    el('dw-partition', faceWithDoor(SHAFT_V1)),
    ...passage(SHAFT_V1),
    el('dw-slab-edge', uFace(u0, SHAFT_V1, SHAFT_V1 + WALL_T, hBase, hTop)),
  ]
}

function columns(hBase, hTop, corners = ['A', 'B', 'C']) {
  const at = { A: [0, 0], B: [LW, 0], C: [0, LD], D: [LW, LD] }
  return corners.map((c) => column(at[c][0], at[c][1], hBase, hTop))
}

// Elevator shaft story segment. Walls are WALL_T-thick volumes:
// W1 on the u = SHAFT_U side, W2 / W3 on the v = SHAFT_V0 / SHAFT_V1 sides.
// W2 / W3 extend over the W1 corner (u to SHAFT_U + WALL_T) so the shaft is
// structurally complete; their cut ends show at the open A-C side.
// With `openDoors` the double door stands open (panels parked at the jambs,
// dark opening behind): the current/final floor exception (Stage 3.5 §18).
function shaftStory(hBase, hTop, { openDoors = false } = {}) {
  const out = [
    // W1 inner face (shaft side, plane u = SHAFT_U).
    el('dw-shaft', uFace(SHAFT_U, SHAFT_V0, SHAFT_V1, hBase, hTop)),
    // W1 exposed end face at v = SHAFT_V0 (reads the wall thickness).
    el('dw-shaft', vFace(SHAFT_V0, SHAFT_U, SHAFT_U + WALL_T, hBase, hTop)),
    // W3 inner face (v = SHAFT_V1), extended over the W1 corner.
    el('dw-shaft', vFace(SHAFT_V1, 0, SHAFT_U + WALL_T, hBase, hTop)),
    // W3 cut end at the open A-C side.
    el('dw-shaft', uFace(0, SHAFT_V1, SHAFT_V1 + WALL_T, hBase, hTop)),
    // W2 outer face toward Health Platforms, extended over the W1 corner.
    el('dw-shaft', vFace(SHAFT_V0 - WALL_T, 0, SHAFT_U + WALL_T, hBase, hTop)),
    // W2 cut end at the open A-C side.
    el('dw-shaft', uFace(0, SHAFT_V0 - WALL_T, SHAFT_V0, hBase, hTop)),
  ]
  if (openDoors) {
    // Open doorway: dark opening with both panels slid to the jambs.
    out.push(el('dw-door-open', vFace(SHAFT_V0 - WALL_T, DOOR_U0, DOOR_U1, hBase, hBase + DOOR_H)))
    out.push(el('dw-door', vFace(SHAFT_V0 - WALL_T, DOOR_U0, DOOR_U0 + 8, hBase, hBase + DOOR_H)))
    out.push(el('dw-door', vFace(SHAFT_V0 - WALL_T, DOOR_U1 - 8, DOOR_U1, hBase, hBase + DOOR_H)))
  } else {
    // Closed double door: two panels meeting at the center split.
    out.push(
      el(
        'dw-door',
        vFace(SHAFT_V0 - WALL_T, DOOR_U0, (DOOR_U0 + DOOR_U1) / 2, hBase, hBase + DOOR_H),
      ),
    )
    out.push(
      el(
        'dw-door',
        vFace(SHAFT_V0 - WALL_T, (DOOR_U0 + DOOR_U1) / 2, DOOR_U1, hBase, hBase + DOOR_H),
      ),
    )
  }
  // Floor indicator (user revision): the story number painted on the wall
  // above each door head — one small digit per floor, in the plaques' text
  // style, skewed onto the W2 face plane. The W2 face is a constant-v face:
  // its text baseline runs along +u, rising on screen — the SAME up-skew
  // matrix as the entrance year sign (the u-plane down-skew made the digits
  // lean the wrong way; only the straight "1" hid it).
  const [fx, fy] = p((DOOR_U0 + DOOR_U1) / 2, SHAFT_V0 - WALL_T, hBase + DOOR_H + 8)
    .split(',')
    .map(Number)
  const storyNum = Math.round(hBase / FH)
  out.push(
    `<text class="dw-floor-num" transform="matrix(0.7071 -0.2475 0 1 ${round(fx)} ${round(fy)})" text-anchor="middle" dominant-baseline="central">${storyNum}</text>`,
  )
  return out
}

// Compact chronological marker per story: a small sign plaque mounted on the
// enclosure wall (the building's left wall around the shaft), not above the
// door (user revision). The exact information design belongs to later stages.
// Each plaque carries two screw/nail dots flanking its text (Stage 4.5 user
// revision); plaques are sized so text + dots + clearance always fit.
const STORY_YEARS = [2017, 2019, 2021, 2025, 2026]
const YEAR_SIGN_HALF = 17.5 // plaque half-length along v (widened for the dots)
const YEAR_TEXT_HALF = (4 * TAG_CHAR_W) / 2 // "2017"-style text half-length
const DOT_R = 1.4 // screw head radius, screen px
const DOT_GAP = 4.5 // clearance between text edge and dot center (v-units)

// Screw/nail head on a plaque face. Dots live on the face's constant plane;
// at this size the projected ellipse reads as a plain circle.
const dot = (u, v, h) => {
  const [x, y] = p(u, v, h).split(',').map(Number)
  return `<circle class="dw-dot" cx="${round(x)}" cy="${round(y)}" r="${DOT_R}" />`
}

function yearPlaque(year, hBase) {
  const u = -1.5 // plaque proud of the u = 0 enclosure face
  const vMid = (SHAFT_V0 + SHAFT_V1) / 2
  const h0 = hBase + 34
  const h1 = hBase + 48
  const hMid = (h0 + h1) / 2
  const [x, y] = p(u, vMid, hMid).split(',')
  return [
    tagGroup([
      el('dw-tag', uFace(u, vMid - YEAR_SIGN_HALF, vMid + YEAR_SIGN_HALF, h0, h1)),
      el('dw-tag', hFace(u, u + 1.5, vMid - YEAR_SIGN_HALF, vMid + YEAR_SIGN_HALF, h1)),
      el('dw-tag', vFace(vMid - YEAR_SIGN_HALF, u, u + 1.5, h0, h1)),
      dot(u, vMid - YEAR_TEXT_HALF - DOT_GAP, hMid),
      dot(u, vMid + YEAR_TEXT_HALF + DOT_GAP, hMid),
      `<text class="dw-year" transform="matrix(0.7071 0.2475 0 1 ${x} ${y})" text-anchor="middle" dominant-baseline="central">${year}</text>`,
    ]),
  ]
}

const group = (id, lines) => `<g id="${id}">\n${lines.map((l) => `  ${l}`).join('\n')}\n</g>`

// Physical plaques (Stage 4 §16–17): each sign is wrapped so a single subtle
// drop-shadow can attach it to the wall — small identification plaques, not
// floating UI labels.
const tagGroup = (lines, cls = 'dw-tag-group') =>
  `<g class="${cls}">\n${lines.map((l) => `  ${l}`).join('\n')}\n</g>`

// --- floor-ground: slab-0, story-0 walls, two partitions, columns -----------
const floorGround = group('floor-ground', [
  ...slab(0),
  ...backWalls(0),
  ...partition(PARTITION_G[0], 0, { opening: true }),
  ...partition(PARTITION_G[1], 0, { opening: true }),
  ...columns(0, STORY_H),
])

// --- floor-01: slab-1 with stair opening, story-1 walls, shaft return walls -
const floor01 = group('floor-01', [
  ...slab(FH, { stairOpening: true }),
  ...backWalls(FH),
  // Stair banister, upper element (user revision): the diagonal's floor-1
  // stretch plus its landing return, drawn after the story walls (the stair
  // opening shows it) but BEFORE the columns — column C, nearer to the
  // viewer, must occlude the rail's top return.
  el(
    'dw-rail',
    `M ${p(RAIL_MID_U, LD - WALL_T, FH)} L ${p(STAIR_U1, LD - WALL_T, FH + RAIL_H)} L ${p(STAIR_U1 + 12, LD - WALL_T, FH + RAIL_H)}`,
  ),
  ...shaftReturnWalls(FH),
  ...columns(FH, FH + STORY_H),
])

// --- floors 02-04: full slab + story walls below the elevator, story
// columns over it (user revision: each shaft-crossing floor renders as one
// complete plane below the shaft, like floor-01 — no slab part may paint
// over the elevator) ----------------------------------------------
const floor02 = group('floor-02', [...slab(2 * FH), ...backWalls(2 * FH)])
const floor02Front = group('floor-02-front', [
  ...slabTriangle(2 * FH),
  ...columns(2 * FH, 2 * FH + STORY_H),
])

// The separation face is clipped to the rear wall's inner face (see
// floor-03).
const SEP_CLIP = ' clip-path="url(#dw-clip-sep3)"'

const floor03 = group('floor-03', [
  ...slab(3 * FH),
  ...backWalls(3 * FH),
  // Section separation continuing the shaft's left wall (W1) rearward to the
  // C-D wall: the rear-left strip beyond it becomes the distinct section.
  // Stage 4.5 §3.3: fill-only face, base unstroked, drawn after the rear
  // walls. Stage 5 review (user revision): the face renders ONLY within the
  // C-D wall's inner-face polygon (clip-path below). The face is a
  // full-story wall standing at u = SHAFT_U; unclipped, its projection
  // spilled across the floor behind it — strictly correct occlusion for a
  // solid wall, but the diorama reads interior partitions as room dividers,
  // not view blocks: the Indelve story must replicate the open Interactica
  // story below (wood floor reaching the rear wall under one wall band,
  // section marked by its sign). Clipped to the wall rectangle, the face
  // survives only as cream on the cream wall — seamless. Its outline
  // far-lines are dropped (user revision): clipped onto the wall band they
  // split it into apparent "two wall parts"; the wall must read as one
  // surface.
  `<defs><clipPath id="dw-clip-sep3"><path d="${vFace(LD - WALL_T, 0, LW, 3 * FH, 3 * FH + FH)}" /></clipPath></defs>`,
  el(
    'dw-wall-far-fill',
    uFace(SHAFT_U, SHAFT_V1 + WALL_T, LD - WALL_T, 3 * FH, 3 * FH + STORY_H),
    SEP_CLIP,
  ),
  // Wall/floor junction line (user revision): the clipped face's fill hides
  // the slab's rear-edge stroke, so the wood-to-wall boundary lost its
  // consistent line mid-span (it faded to a bare color abutment while the
  // Interactica story below kept a crisp edge). Restored on top of the face.
  el('dw-far-line', `M ${p(0, LD - WALL_T, 3 * FH)} L ${p(LW, LD - WALL_T, 3 * FH)}`),
  // The separation fill also covered the C-D wall's ceiling washes over the
  // section it marks (u from the shaft line to the corner): re-draw them
  // clipped to exactly that part, so the Indelve story is shaded like every
  // other one while the region left of the shaft keeps its original washes.
  ...ceilBands(
    (h0, h1) => vFace(LD - WALL_T, 0, LW, h0, h1),
    3 * FH + FH,
    ' clip-path="url(#dw-clip-sep3b)"',
  ),
  `<defs><clipPath id="dw-clip-sep3b"><path d="${vFace(LD - WALL_T, SHAFT_U, LW, 3 * FH, 3 * FH + FH)}" /></clipPath></defs>`,
])

const floor03Front = group('floor-03-front', [
  ...slabTriangle(3 * FH),
  ...columns(3 * FH, 3 * FH + STORY_H),
])

const floor04 = group('floor-04', [...slab(4 * FH), ...backWalls(4 * FH)])
const floor04Front = group('floor-04-front', [
  ...slabTriangle(4 * FH),
  ...columns(4 * FH, 4 * FH + STORY_H),
])

// --- floor-05: full slab + D column + D-corner wall section below the
// shaft; stub walls, exposed A/B/C columns and dashed perimeter over it ----
const floor05 = group('floor-05', [
  ...slab(5 * FH),
  // First tiles set at the two right-hand corners (user revision):
  // small-format tiles (smaller than the ground floor's) already laid where
  // the rear and right walls meet (D corner, inside the two D-corner wall
  // arms) and where the front and right walls meet (B corner, against the
  // B-D stub wall's inner face) — on the otherwise bare screed,
  // construction in progress. Fill-only: the tile patches are material, not
  // structure.
  el(
    'dw-floor dw-f5t',
    hFace(LW - D_CORNER_ARM, LW - WALL_T, LD - D_CORNER_ARM, LD - WALL_T, 5 * FH),
  ),
  el('dw-floor dw-f5t', hFace(150.5, LW - WALL_T, 7.5, 88, 5 * FH)),
  ...columns(5 * FH, TOP_H, ['D']),
  // D-corner wall section (user revision): part of the building's rear and
  // right walls meeting at the D corner, over the full fifth-story height.
  // Far faces like the other rear walls (Stage 4 §8).
  // Rear wall arm from the C-corner stub's length toward the corner.
  el('dw-wall-far', vFace(LD - WALL_T, LW - D_CORNER_ARM, LW, 5 * FH, TOP_H)),
  el('dw-slab-edge', uFace(LW - D_CORNER_ARM, LD - WALL_T, LD, 5 * FH, TOP_H)),
  el('dw-slab', hFace(LW - D_CORNER_ARM, LW, LD - WALL_T, LD, TOP_H)),
  // Right wall arm from the corner toward the B-corner stub.
  el('dw-wall', uFace(LW - WALL_T, LD - D_CORNER_ARM, LD - WALL_T, 5 * FH, TOP_H)),
  el('dw-slab-edge', vFace(LD - D_CORNER_ARM, LW - WALL_T, LW, 5 * FH, TOP_H)),
  el('dw-slab', hFace(LW - WALL_T, LW, LD - D_CORNER_ARM, LD - WALL_T, TOP_H)),
])
const floor05Front = group('floor-05-front', [
  ...slabTriangle(5 * FH),
  ...columns(5 * FH, TOP_H, ['A', 'B', 'C']),
  // Stub walls (incomplete masonry) on the two back walls with visible tops;
  // far faces like the completed floors' rear walls (Stage 4 §8).
  el('dw-wall-far', uFace(LW - WALL_T, 0, STUB_LEN * LD - WALL_T, 5 * FH, 5 * FH + STUB_H)),
  el('dw-slab-edge', vFace(0, LW - WALL_T, LW, 5 * FH, 5 * FH + STUB_H)),
  el('dw-slab', hFace(LW - WALL_T, LW, 0, STUB_LEN * LD - WALL_T, 5 * FH + STUB_H)),
  el('dw-wall-far', vFace(LD - WALL_T, 0, STUB_LEN * LW, 5 * FH, 5 * FH + STUB_H)),
  el('dw-slab-edge', uFace(0, LD - WALL_T, LD, 5 * FH, 5 * FH + STUB_H)),
  el('dw-slab', hFace(0, STUB_LEN * LW, LD - WALL_T, LD, 5 * FH + STUB_H)),
  // The dashed intended-top perimeter was removed (Stage 4.5 user revision):
  // the stub walls, exposed columns and open shaft already communicate the
  // unfinished state; the dashed guides read as construction leftovers.
])

// --- staircase: solid flight rising through the floor-01 opening ------------
// The flight runs along the WIDTH axis (parallel to the C-D back wall and the
// entrance face A-B), rising from the A-C open side toward the floor-1 slab
// edge at u = STAIR_U1, inside the Freelancer area (Nextcode side above).
function staircase() {
  const rise = FH / STAIR_STEPS
  const going = STAIR_RUN / STAIR_STEPS
  const v0 = STAIR_V0
  const v1 = STAIR_V1
  const out = []
  // Risers (faces toward the bottom of the flight, normal -u).
  for (let i = 1; i <= STAIR_STEPS; i++) {
    out.push(
      el('dw-stair-riser', uFace(STAIR_U0 + going * (i - 1), v0, v1, rise * (i - 1), rise * i)),
    )
  }
  // Treads (top faces).
  for (let i = 1; i <= STAIR_STEPS; i++) {
    out.push(
      el('dw-stair', hFace(STAIR_U0 + going * (i - 1), STAIR_U0 + going * i, v0, v1, rise * i)),
    )
  }
  // Solid side face at v = STAIR_V0 (normal -v, toward the entrance side):
  // sawtooth profile closed along the ground. Painted last: it occludes the
  // lower parts of the risers behind it.
  const profile = [p(STAIR_U0, v0, 0)]
  for (let i = 1; i <= STAIR_STEPS; i++) {
    profile.push(p(STAIR_U0 + going * (i - 1), v0, rise * i))
    profile.push(p(STAIR_U0 + going * i, v0, rise * i))
  }
  profile.push(p(STAIR_U1, v0, 0))
  // Solid side face slightly darker than the treads: reads as the stair's
  // solid mass, a restrained depth cue (Stage 4 §22).
  out.push(el('dw-stair-side', path(profile)))
  // Wall-mounted banister, ground element (user revision): lead-in at the
  // floor's base level + diagonal following the flight up to the floor-1
  // level, attached to the C-D rear wall. Drawn in this fragment — BEFORE
  // floor-01 — so the floor-1 slab's cut faces (its base band and the stair
  // opening's edge faces, all nearer to the viewer on screen) occlude the
  // diagonal where they cross it; the floor-01 wall itself never covers the
  // rail (it starts at h = 105, exactly where the rail tops out). The upper
  // element (diagonal on + landing return) lives in floor-01 before its
  // columns, so column C occludes the return.
  const rv = STAIR_V1
  out.push(
    el('dw-rail', `M ${p(10, rv, RAIL_H)} L ${p(STAIR_U0, rv, RAIL_H)} L ${p(RAIL_MID_U, rv, FH)}`),
  )
  return group('staircase', out)
}

// --- elevator: continuous shaft walls with floor bands crossing at each level
function elevator() {
  const out = []
  for (let story = 1; story <= 5; story++) {
    const hBase = story * FH
    out.push(...shaftStory(hBase, story < 5 ? hBase + STORY_H : TOP_H, { openDoors: story === 5 }))
  }
  // Enclosure, drawn after the story walls so it occludes the interior: the
  // building's invisible left wall closing the shaft's open A-C side from
  // floor 1 to the top — ONE face flush with the left-wall plane (u = 0),
  // no per-story cuts (user revision).
  out.push(el('dw-shaft', uFace(0, SHAFT_V0, SHAFT_V1, FH, TOP_H)))
  // Floor base lines across the shaft (user revision): from floor 2 up the
  // enclosure would hide each floor's left cut face, breaking the base line
  // that floor-01 shows. Re-layer the cut face over the enclosure (and the
  // W2 / W3 cut ends) so every level's base line reads as one continuous
  // band descending past the shaft's corner, exactly like floor-01.
  // Span revision (user revision): the span starts at the return wall's face
  // plane (the W2 face's outer line on screen) — the old full-depth band
  // repainted the floor-1 return wall's face, where the stretch between the
  // passage jamb and the shaft edge is dropped on the wall itself (see slab)
  // — and runs to the rear corner so the W3 cut end cannot notch the band's
  // rear end; the front stretch each floor already draws.
  for (let n = 2; n <= 5; n++) {
    out.push(
      el(
        'dw-slab-edge',
        uFace(0, SHAFT_V0 - WALL_T - (SHAFT_U + WALL_T), LD, n * FH - SLAB_T, n * FH),
      ),
    )
  }
  // Year signs on the enclosure wall, one per story.
  STORY_YEARS.forEach((year, i) => out.push(...yearPlaque(year, (i + 1) * FH)))
  // Visible top bands close the shaft at the fifth-floor story top.
  out.push(el('dw-slab', hFace(WALL_T, SHAFT_U + WALL_T, SHAFT_V0, SHAFT_V1, TOP_H)))
  out.push(el('dw-slab', hFace(0, WALL_T, SHAFT_V0, SHAFT_V1, TOP_H)))
  out.push(el('dw-slab', hFace(0, SHAFT_U + WALL_T, SHAFT_V0 - WALL_T, SHAFT_V0, TOP_H)))
  out.push(el('dw-slab', hFace(0, SHAFT_U + WALL_T, SHAFT_V1, SHAFT_V1 + WALL_T, TOP_H)))
  return group('elevator', out)
}

// --- entrance: threshold platform + minimal portal frame --------------------
// The front wall stays absent (cutaway rule); a simple portal (two jambs +
// header) gives the entrance opening structural context on the A-B face.
function entrance() {
  const u0 = 0.35 * LW
  const u1 = 0.65 * LW
  const depth = 37.5
  const jamb = 10 // jamb width along u
  const jambD = 7.5 // jamb/header depth along v (sits on the threshold)
  const portalH = DOOR_H
  const headerH = 7.5
  // Year sign attached to the door head (user revision): the same plaque
  // language as the shaft's year signs, on a face proud of the header's
  // front, reading toward the front corner like the entrance door.
  // Widened for the screw dots like the other plaques (Stage 4.5).
  const signHalf = YEAR_SIGN_HALF
  const signU = (u0 + u1) / 2
  const signV = -jambD - 1.5
  const signH0 = portalH + headerH - 14
  const signH1 = portalH + headerH
  const signHMid = (signH0 + signH1) / 2
  const [sx, sy] = p(signU, signV, signHMid).split(',')
  const out = [
    // Right jamb first: a layer below the entrance block (the block's front
    // region is nearer to the viewer and must occlude the jamb's base).
    el('dw-wall', vFace(-jambD, u1, u1 + jamb, -SLAB_T, portalH)),
    el('dw-wall', uFace(u1, -jambD, 0, -SLAB_T, portalH)),
    el('dw-slab', hFace(u1, u1 + jamb, -jambD, 0, portalH)),
    // Threshold platform abutting the A-B face at ground level; its top is a
    // walking surface, so it shares the ground floor's material (Stage 4.5 §4).
    el(`dw-floor ${floorCls(0)}`, hFace(u0, u1, -depth, 0, 0)),
    el('dw-slab-edge', vFace(-depth, u0, u1, -SLAB_T, 0)),
    el('dw-slab-edge', uFace(u0, -depth, 0, -SLAB_T, 0)),
    // Left jamb, extending down to the base level of the entrance block.
    el('dw-wall', vFace(-jambD, u0 - jamb, u0, -SLAB_T, portalH)),
    el('dw-wall', uFace(u0 - jamb, -jambD, 0, -SLAB_T, portalH)),
    el('dw-slab', hFace(u0 - jamb, u0, -jambD, 0, portalH)),
    // Header above the opening.
    el('dw-wall', vFace(-jambD, u0 - jamb, u1 + jamb, portalH, portalH + headerH)),
    el('dw-wall', uFace(u0 - jamb, -jambD, 0, portalH, portalH + headerH)),
    el('dw-slab', hFace(u0 - jamb, u1 + jamb, -jambD, 0, portalH + headerH)),
    // Year sign attached to the door head, proud of the header's front face.
    // Cap arguments follow the uFace/vFace order (u-range, v-range) — the
    // swapped form previously projected the cap as a stray sliver near the
    // first ground partition (Stage 4.5 §3.1).
    tagGroup([
      el('dw-tag', vFace(signV, signU - signHalf, signU + signHalf, signH0, signH1)),
      el('dw-tag', hFace(signU - signHalf, signU + signHalf, signV, -jambD, signH1)),
      el('dw-tag', uFace(signU - signHalf, signV, -jambD, signH0, signH1)),
      dot(signU - YEAR_TEXT_HALF - DOT_GAP, signV, signHMid),
      dot(signU + YEAR_TEXT_HALF + DOT_GAP, signV, signHMid),
      `<text class="dw-year" transform="matrix(0.7071 -0.2475 0 1 ${sx} ${sy})" text-anchor="middle" dominant-baseline="central">2013</text>`,
    ]),
  ]
  return group('entrance', out)
}

// --- ground-shadow: soft contact shadow under the building base -------------
// One blurred polygon: the base footprint (at the ground slab's bottom line)
// offset a little toward the light-away direction, the same down-right
// direction the plaques' drop shadows use. Drawn between terrain and the
// building so it reads as the building resting on the ground (Stage 5 §7).
function groundShadow() {
  const off = [13, 6]
  const corner = (u, v) => {
    const [x, y] = p(u, v, -SLAB_T).split(',').map(Number)
    return `${round(x + off[0])},${round(y + off[1])}`
  }
  const d = path([corner(0, 0), corner(LW, 0), corner(LW, LD), corner(0, LD)])
  return group('ground-shadow', [
    `<path d="${d}" fill="#46443f" fill-opacity="0.12" filter="url(#dw-soft)" />`,
  ])
}

// --- architectural-details: (empty placeholder) -----------------------------
// Stage 5 §8 aimed at sparse supporting infrastructure. On user review every
// candidate was removed: the Pacer pipe (stray vertical line), the Freelancer
// wall patch (floating square), the Nextcode electrical panel + conduits and
// the Interactica ventilation grille (both read as clutter on the bare
// stories). The fragment stays as a placeholder in case a later stage adds
// details that survive a glance.
function architecturalDetails() {
  return group('architectural-details', [])
}

// --- career-sign: posts and placeholder panel -------------------------------
// The sign stands on the open terrain in front-right of the building, outside
// the building's u/v coordinate system, so it is expressed in screen space.
function careerSign() {
  // Placeholder content stays (final content is Stage 7); the group wrapper
  // gives the physical sign its drop-shadow attachment like the plaques.
  return group('career-sign', [
    tagGroup(
      [
        // Single central post anchored in the terrain beside the path.
        '<line class="dw-column" x1="1110" y1="980" x2="1110" y2="1035" />',
        // Placeholder panel with photo circle and text bars.
        '<rect class="dw-sign" x="1030" y="870" width="160" height="110" />',
        '<circle class="dw-shaft" cx="1065" cy="905" r="22" />',
        '<rect x="1100" y="890" width="60" height="10" fill="#b5b3ae" />',
        '<rect x="1100" y="910" width="44" height="10" fill="#b5b3ae" />',
      ],
      'dw-sign-group',
    ),
  ])
}

// --- experience tags: section names on the invisible left wall --------------
// User revision: vertical signs exactly like the elevator year plaques, but
// mounted at floor level — flush with the building's invisible left wall
// (u = 0, like part of it), each over its own section, on the low band of its
// story (base on the floor slab's bottom line). Front-row tags share
// c = 135 and left-side tags share c = 470, so each row aligns vertically;
// whole-floor sections carry a duplicate on the floor's left side. The
// unfinished fifth floor carries WIP markers instead of a company name.
// Freelancer fits on a single line.
const TAG_H0 = -SLAB_T // floor-level band: base on the floor slab's bottom line
const TAG_H1 = -SLAB_T + 16
const TAG_MATRIX = '0.7071 0.2475 0 1' // reads toward the front corner (-v)
// Plaque length fits its content plus the screw-dot clearance: text half +
// per-side padding covering dot gap, dot radius and edge margin.
const TAG_HALF_PAD = 7.5
const FLOOR_TAGS = [
  { text: 'Puelo Games', floor: 0, c: 82 },
  { text: 'BA Technology', floor: 0, c: 282 },
  { text: 'Freelancer Game Developer', floor: 0, c: 477 },
  { text: 'Health Platforms', floor: 1, c: 135 },
  { text: 'Nextcode', floor: 1, c: 470 },
  { text: 'Interactica', floor: 2, c: 135 },
  { text: 'Interactica', floor: 2, c: 470 },
  { text: 'Interactica', floor: 3, c: 135 },
  { text: 'Indelve', floor: 3, c: 470 },
  { text: 'Pacer', floor: 4, c: 135 },
  { text: 'Pacer', floor: 4, c: 470 },
  { text: 'WIP', floor: 5, c: 135 },
  { text: 'WIP', floor: 5, c: 470 },
]

function experienceTags() {
  const out = []
  for (const tag of FLOOR_TAGS) {
    const h0 = tag.floor * FH + TAG_H0
    const h1 = tag.floor * FH + TAG_H1
    const textHalf = (tag.text.length * TAG_CHAR_W) / 2
    const half = textHalf + TAG_HALF_PAD
    // Thin depth like the year plaques: face proud of the wall (u = -1.5),
    // top cap and front-end side closing the 1.5 gap to the wall plane.
    const u = -1.5
    const hMid = (h0 + h1) / 2
    const [x, y] = p(u, tag.c, hMid).split(',')
    out.push(
      tagGroup([
        el('dw-tag', uFace(u, tag.c - half, tag.c + half, h0, h1)),
        el('dw-tag', hFace(u, 0, tag.c - half, tag.c + half, h1)),
        el('dw-tag', vFace(tag.c - half, u, 0, h0, h1)),
        dot(u, tag.c - textHalf - DOT_GAP, hMid),
        dot(u, tag.c + textHalf + DOT_GAP, hMid),
        `<text class="dw-tag-text" transform="matrix(${TAG_MATRIX} ${x} ${y})" text-anchor="middle" dominant-baseline="central">${tag.text}</text>`,
      ]),
    )
  }
  return group('tags', out)
}

// ---------------------------------------------------------------------------
// Emit fragments
// ---------------------------------------------------------------------------
const fragments = {
  'ground-shadow': groundShadow(),
  'floor-ground': floorGround,
  'floor-01': floor01,
  'floor-02': floor02,
  'floor-02-front': floor02Front,
  'floor-03': floor03,
  'floor-03-front': floor03Front,
  'floor-04': floor04,
  'floor-04-front': floor04Front,
  'floor-05': floor05,
  'floor-05-front': floor05Front,
  staircase: staircase(),
  elevator: elevator(),
  'architectural-details': architecturalDetails(),
  entrance: entrance(),
  'career-sign': careerSign(),
  tags: experienceTags(),
}

for (const [name, content] of Object.entries(fragments)) {
  writeFileSync(join(FRAGMENTS_DIR, `${name}.svg`), `${content}\n`)
  console.log(`wrote src/svg/fragments/${name}.svg`)
}
