import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

// Stage 2 geometry generator — emits the repetitive architectural fragments
// (floors, staircase, elevator, entrance, career-sign) from the shared
// parameter block documented in src/svg/README.md. terrain.svg, path.svg and
// labels.svg stay hand-authored. Edit parameters here, re-run
// `npm run svg:generate`, then `npm run svg:assemble`.

// Utility raster assets (Stage 5.5 §6): small generated elements embedded
// into the SVG as base64 data URIs so the assembled master stays
// self-contained (dev server, static build and standalone file all work).
const ASSETS_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'assets')
const inlineAsset = (name, mime = 'image/png') =>
  `data:${mime};base64,${readFileSync(join(ASSETS_DIR, name)).toString('base64')}`

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

// Small utility box mounted against a constant-u wall plane (protruding
// toward -u, i.e. toward the open side): front face, top cap, larger-v side.
const boxOnUWall = (uFront, uWall, v0, v1, h0, h1, cls = 'dw-jbox') => [
  el(cls, uFace(uFront, v0, v1, h0, h1)),
  el(cls, hFace(uFront, uWall, v0, v1, h1)),
  el(cls, vFace(v1, uFront, uWall, h0, h1)),
]

// Server rack (Stage 5.5 §10, user revision): a GROUP of three cabinets on
// the Health Platforms stretch (DBA story — database/server equipment is
// the believable piece) — two tall, one short — each drawn with the same
// three-face box idiom as the wall junction boxes (editable SVG, on-model
// with the building's projection): graphite body on a recessed plinth,
// inset door-frame outline, blanking panels with drive-slot bands between
// them, a vent-dot grid, a muted LED row (one amber), a cable notch at the
// top edge and vertical seams on the side face. Generic technical
// equipment; subordinate to the walls.
const rackSlot = (u, v0, v1, h) => el('dw-rack-slot', `M ${p(u, v0, h)} L ${p(u, v1, h)}`)
const rackDot = (cls, u, v, h, r) => {
  const [x, y] = p(u, v, h).split(',').map(Number)
  return `<circle class="${cls}" cx="${round(x)}" cy="${round(y)}" r="${r}" />`
}
const rackLed = (u, v, h, amber = false) =>
  rackDot(`dw-rack-led${amber ? ' dw-rack-led-amber' : ''}`, u, v, h, 0.75)
const rackVent = (u, v, h) => rackDot('dw-rack-vent', u, v, h, 0.6)
function serverRack(uBack, v0, v1, hBase, hTop) {
  const uFront = uBack - 9
  const hB = hBase + 4 // plinth top = body base
  const out = [
    // floor contact shadow under the cabinet
    el('dw-contact', hFace(uFront - 1.5, uBack, v0 - 1.5, v1 + 1.5, hBase)),
    // recessed plinth
    el('dw-rack-plinth', uFace(uFront + 1, v0 + 1, v1 - 1, hBase, hB)),
    el('dw-rack-plinth', vFace(v0, uFront + 1, uBack, hBase, hB)),
    // body: front face, side face, light-catching top cap
    el('dw-rack', uFace(uFront, v0, v1, hB, hTop)),
    el('dw-rack-side', vFace(v0, uFront, uBack, hB, hTop)),
    el('dw-rack-top', hFace(uFront, uBack, v0, v1, hTop)),
    // inset door-frame outline on the front face
    el('dw-rack-frame', uFace(uFront, v0 + 2.2, v1 - 2.2, hB + 3, hTop - 2.5)),
  ]
  // cable notch at the top edge center
  out.push(rackDot('dw-rack-vent', uFront, (v0 + v1) / 2, hTop - 0.9, 1.1))
  // muted LED row near the top (one amber status dot)
  for (let i = 0; i < 5; i++) out.push(rackLed(uFront, v0 + 3.8 + i * 2.6, hTop - 5, i === 2))
  // blanking panels with drive-slot bands between, adapting to the cabinet
  let h = hTop - 9.5
  while (h - 3.2 > hB + 6.5) {
    out.push(el('dw-rack-panel', uFace(uFront, v0 + 3.4, v1 - 3.4, h - 3.2, h)))
    out.push(rackSlot(uFront, v0 + 3.4, v1 - 3.4, h - 4.6))
    out.push(rackSlot(uFront, v0 + 3.4, v1 - 3.4, h - 5.1))
    h -= 5.6
  }
  // vent-dot grid near the base
  for (let row = 0; row < 2; row++) {
    for (let i = 0; i < 4; i++) out.push(rackVent(uFront, v0 + 4.2 + i * 3.6, hB + 4.6 + row * 2.4))
  }
  // vertical seams on the side face
  for (const su of [uFront + 2.2, uFront + 5.4]) {
    const [x1, y1] = p(su, v0, hB + 2).split(',').map(Number)
    const [x2, y2] = p(su, v0, hTop - 1).split(',').map(Number)
    out.push(`<line class="dw-rack-slot" x1="${round(x1)}" y1="${round(y1)}" x2="${round(x2)}" y2="${round(y2)}" />`)
  }
  return out
}

// Workstation sprite (Stage 5.5 §10, user decision: ONE desk on the
// Interactica story): nano-banana generation from a precise red wireframe
// built in the building's own projection (19.29 deg recedes, vertical = 2x
// plan-diagonal), white-keyed and cut. Measured on the art: receding edges
// 19.32/19.34 deg, footprint 44.00 x 17.01, desktop 21.97u above the floor —
// matches the 44/17/22 targets, so the sprite is placed raw (uniform scale,
// no angle correction). Anchored at its desk top's near vertex; uBack keeps
// the gap to the wall face where the pipe run lives. Replaces the earlier
// WS_A/WS_B comparison sprites (wrong ~27 deg projection).
//   WS_C — wireframe-matched sprite (table desk, monitor, keyboard, chair);
//   WS_D — sibling variant (table desk, open notebook laptop, chair). Both are
//   style-enriched re-renders of the user's hand-polished edit (Pro-tier edit
//   pass kept the projection: 19.3x/44.00/17/22 gates pass), re-keyed from
//   white. Constants re-measured per file after the enrichment.
const WS_C = { file: 'workstation-03-cut.png', w: 1062, h: 992, k: 0.04067, ax: 31.15, ay: 18.36, depth: 16.98, deskH: 21.79 }
const WS_D = { file: 'workstation-04-cut.png', w: 1102, h: 976, k: 0.03930, ax: 31.16, ay: 16.40, depth: 17.13, deskH: 21.84 }
function assetWorkstation(sp, uBack, v0, hBase) {
  const uFront = uBack - sp.depth
  const [cx, cy] = p(uFront, v0, hBase + sp.deskH).split(',').map(Number)
  return `<image href="${inlineAsset(sp.file)}" x="${round(cx - sp.ax)}" y="${round(cy - sp.ay)}" width="${round(sp.w * sp.k)}" height="${round(sp.h * sp.k)}" preserveAspectRatio="none" />`
}

// --- Ground-floor prop sprites (Stage 5.5 §10, wireframe-only pipeline) -----
// Generated sprites (generated/dev/make_wire_props.py / make_wire_table.py;
// candidates kiosk-cand2, stools-cand, table-cand). Each anchor (ax/ay display
// px) is the sprite's measured reference corner, placed directly at
// p(uAnchor, vAnchor, hBase) — grounding/flush semantics documented per call.
// Kiosk: media cabinet 30u long (v), ~10.4u deep, ~14u tall, receding edges
// 19.3-19.6deg; the model rendered the screen as a WIDE TV (face 36u x ~20u,
// top at h~45) instead of the portrait wireframe panel — accepted as-is.
// Stools: pair of tall padded stools (~16u seats), drawn ~28u high.
// Meeting: round table (top h22) + 3 chairs + 2 seated people + papers.
// Anchor = the sprite's bottommost pixel (the near chair's floor leg,
// object ~(14, 4) at the group origin). User revision: corrected to true
// scale (the old k 0.15713 made the group 1.33x too large) and moved toward
// the visible centre of the BA section.
const PUEL_KIOSK = { file: 'kiosk-01-cut.png', w: 578, h: 895, k: 0.0513, ax: 21.09, ay: 45.23 }
const PUEL_STOOLS = { file: 'stools-01-cut.png', w: 904, h: 744, k: 0.03767, ax: 34.02, ay: 27.99 }
const PUEL_TABLE = { file: 'meeting-01-cut.png', w: 581, h: 437, k: 0.11846, ax: 52.36, ay: 50.94 }
// Freelancer floor PC (user spec): beige tower + bulky CRT monitor + keyboard
// + mouse, cables connected to the tower; stands on the floor beside the
// staircase base. Anchor = the keyboard's near-bottom corner (object u-6, v0).
const FREELANCER_PC = { file: 'freelancer-pc-01-cut.png', w: 475, h: 544, k: 0.05717, ax: 16.98, ay: 30.93 }
function spritePlace(sp, uAnchor, vAnchor, hBase) {
  const [bx, by] = p(uAnchor, vAnchor, hBase).split(',').map(Number)
  return { x: round(bx - sp.ax), y: round(by - sp.ay) }
}
function assetProp(sp, uAnchor, vAnchor, hBase) {
  const { x, y } = spritePlace(sp, uAnchor, vAnchor, hBase)
  return `<image href="${inlineAsset(sp.file)}" x="${x}" y="${y}" width="${round(sp.w * sp.k)}" height="${round(sp.h * sp.k)}" preserveAspectRatio="none" />`
}

// Space Invaders on the kiosk's dark screen (user request): the game is drawn
// as SVG over the sprite, clipped to the measured screen-face quad (sprite px)
// and placed inside a translate+scale group matching the <image> transform, so
// the overlay stays locked to the art. Deliberately low detail — a hint of the
// game, subordinate to the architecture.
const KIOSK_SCREEN = { tl: [43.3, 32.3], tr: [561.7, 201.7], br: [561.7, 531.7], bl: [43.3, 362.3] }
const kioskPt = (fx, fy) => {
  const { tl, tr, bl } = KIOSK_SCREEN
  const x = tl[0] + fx * (tr[0] - tl[0]) + fy * (bl[0] - tl[0])
  const y = tl[1] + fx * (tr[1] - tl[1]) + fy * (bl[1] - tl[1])
  return [round(x), round(y)]
}
const kioskRect = (fx, fy, w, h, fill, o = 0.9) => {
  const [x, y] = kioskPt(fx, fy)
  return `<rect x="${x}" y="${y}" width="${round(w)}" height="${round(h)}" fill="${fill}" fill-opacity="${o}" />`
}
// Classic 8-bit invader crab (top-half silhouette) built from unit cells.
const INVADER_CELLS = [[1, 0], [3, 0], [0, 1], [2, 1], [4, 1], [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [1, 3], [3, 3]]
const kioskInvader = (fx, fy, fill) => {
  const [x, y] = kioskPt(fx, fy)
  const cells = INVADER_CELLS.map(([c, r]) => `M${x + c * 8},${y + r * 8} h8 v8 h-8 Z`).join(' ')
  return `<path d="${cells}" fill="${fill}" fill-opacity="0.9" />`
}
function kioskScreenOverlay(place) {
  const { tl, tr, br, bl } = KIOSK_SCREEN
  const clip = `M${tl.join(',')} L${tr.join(',')} L${br.join(',')} L${bl.join(',')} Z`
  const game = [
    // two invader rows + the amber saucer
    kioskInvader(0.18, 0.16, '#86a97e'),
    kioskInvader(0.38, 0.16, '#86a97e'),
    kioskInvader(0.58, 0.16, '#86a97e'),
    kioskInvader(0.78, 0.16, '#6f9372'),
    kioskInvader(0.28, 0.42, '#6f9372'),
    kioskInvader(0.48, 0.42, '#6f9372'),
    kioskInvader(0.68, 0.42, '#6f9372'),
    kioskRect(0.84, 0.04, 30, 14, '#c29a4a', 0.85),
    // bunkers + player cannon
    kioskRect(0.20, 0.74, 54, 24, '#4f6a58', 0.8),
    kioskRect(0.46, 0.74, 54, 24, '#4f6a58', 0.8),
    kioskRect(0.72, 0.74, 54, 24, '#4f6a58', 0.8),
    kioskRect(0.46, 0.9, 48, 14, '#9db8a2', 0.95),
  ].join('\n')
  return [
    `<defs><clipPath id="dw-kiosk-screen"><path d="${clip}" /></clipPath></defs>`,
    `<g transform="translate(${place.x} ${place.y}) scale(${PUEL_KIOSK.k})" clip-path="url(#dw-kiosk-screen)">`,
    game,
    `</g>`,
  ].join('\n')
}

// Wooden crates (hand-drawn SVG, user request): storage in the Puelo Games
// corner. Same face pattern as the server rack — top, -u front, -v side —
// with quiet slat lines and the shared warm-wood family.
function crate(u0, u1, v0, v1, h0, h1) {
  const hMid = h0 + (h1 - h0) * 0.4
  return [
    el('dw-crate-side', vFace(v0, u0, u1, h0, h1)),
    el('dw-crate', uFace(u0, v0, v1, h0, h1)),
    el('dw-crate-top', hFace(u0, u1, v0, v1, h1)),
    el('dw-crate-line', `M ${p(u0, v0, hMid)} L ${p(u0, v1, hMid)}`),
  ]
}

// Loose paper sheets (hand-drawn SVG, user request): small light quads with a
// thin outline, scattered flat on the floor or pasted on a wall. Deterministic
// jitter keeps the hand-placed feel without randomness across rebuilds.
function paperSheet(u, v, h, w = 6.5, d = 9, rot = 0) {
  const c = Math.cos(rot)
  const s = Math.sin(rot)
  const pts = [
    [-w / 2, -d / 2],
    [w / 2, -d / 2],
    [w / 2, d / 2],
    [-w / 2, d / 2],
  ].map(([a, b]) => p(u + a * c - b * s, v + a * s + b * c, h))
  return el('dw-paper', path(pts))
}
function paperStack(u, v, n) {
  const out = []
  for (let i = 0; i < n; i++) {
    const jx = (hash2(u * 10 + i, 1) - 0.5) * 1.8
    const jy = (hash2(v * 10 + i, 2) - 0.5) * 1.8
    const rot = (hash2(u * 10 + v + i, 3) - 0.5) * 0.6
    out.push(paperSheet(u + jx, v + jy, 0.3 + i * 0.4, 6.5, 9, rot))
  }
  return out
}
function wallSheet(u, h, rot) {
  const v = LD - WALL_T - 0.4
  const c = Math.cos(rot)
  const s = Math.sin(rot)
  const pts = [
    [-3.25, -4.5],
    [3.25, -4.5],
    [3.25, 4.5],
    [-3.25, 4.5],
  ].map(([a, b]) => p(u + a * c - b * s, v, h + a * s + b * c))
  return el('dw-paper', path(pts))
}

// A vertical service pipe from the generated sprite (user decision: the
// nano-banana asset is the pipe building block). The sprite's full height
// maps to the requested run length; its pipe axis sits at 32.2% from the
// sprite's left edge (the straps' mounting tabs extend to the right). The
// <image> is emitted inside the owning floor fragment so the floors above
// occlude the run where the sight line crosses their slabs.
const PIPE_SPRITE = { file: 'pipe-01.png', w: 7.36, axis: 0.322 }
function assetPipe(u, v, hBase, hLen) {
  const [cx, by] = p(u, v, hBase).split(',').map(Number)
  const x = cx - PIPE_SPRITE.w * PIPE_SPRITE.axis
  const y = by - hLen
  return `<image href="${inlineAsset(PIPE_SPRITE.file)}" x="${round(x)}" y="${round(y)}" width="${PIPE_SPRITE.w}" height="${round(hLen)}" preserveAspectRatio="none" />`
}

// Horizontal wall run from the pre-tilted sprite: the approved flat pipe
// sprite rotated -19.29 deg once at full resolution with PIL (left end up,
// matching the B-D wall's recede along +v) — the browser only translates and
// scales it, no runtime rotation, so the tube edges stay crisp at zoom.
// Anchor = the run's NEAR end (sprite's lower-right tip, plain cut end that
// butts behind the riser); uniform scale k chosen so the run reaches v=161,
// past the sight-line cut (v~150) where the story above occludes it — the
// far end and its collar vanish under the slab instead of stopping mid-wall.
const PIPE_H_SPRITE = { file: 'pipe-h-iso-03.png', w: 2858, h: 1236, nearX: 2820, nearY: 1030, k: 0.026 }
function assetPipeH(u, v, h) {
  const [cx, cy] = p(u, v, h).split(',').map(Number)
  const s = PIPE_H_SPRITE.k
  return `<image href="${inlineAsset(PIPE_H_SPRITE.file)}" x="${round(cx - PIPE_H_SPRITE.nearX * s)}" y="${round(cy - PIPE_H_SPRITE.nearY * s)}" width="${round(PIPE_H_SPRITE.w * s)}" height="${round(PIPE_H_SPRITE.h * s)}" preserveAspectRatio="none" />`
}

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
  out.push(el('dw-slab-edge', path([p(0, 0, hTop), p(0, LD, hTop), p(0, LD, hBot), p(0, 0, hBot)])))
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

// Material seams (Stage 5.5 §8): sparse vertical panel joints on the interior
// far walls — deterministic, hashed per story so no two stories repeat.
// Painted-wall articulation that keeps the hand-placed feel; drawn before the
// ceiling washes so the wash overlays them like light over geometry.
const seamLine = (u, v, h0, h1) => {
  const [x1, y1] = p(u, v, h0).split(',').map(Number)
  const [x2, y2] = p(u, v, h1).split(',').map(Number)
  return `<line class="dw-wall-seam" x1="${round(x1)}" y1="${round(y1)}" x2="${round(x2)}" y2="${round(y2)}" />`
}

function wallSeams(hBase) {
  const hTop = hBase + FH
  const out = []
  // B-D wall (v 0..LD-WALL_T): three joints per story.
  for (let i = 0; i < 3; i++) {
    const s = hash2(Math.round(hBase * 7), 1000 + i * 11)
    const v = Math.round((LD - WALL_T) * (0.17 + 0.31 * i) + (s - 0.5) * 44)
    out.push(seamLine(LW - WALL_T, v, hBase, hTop))
  }
  // C-D wall (u 0..LW): two joints per story.
  for (let i = 0; i < 2; i++) {
    const s = hash2(Math.round(hBase * 7), 2000 + i * 11)
    const u = Math.round(LW * (0.32 + 0.36 * i) + (s - 0.5) * 26)
    out.push(seamLine(u, LD - WALL_T, hBase, hTop))
  }
  return out
}

// Floor/wall contact shadow (Stage 5.5 §9): a thin darker band on the floor
// hugging each rear wall's base — quiet ambient occlusion so the surfaces
// visibly meet. On floor-01 the C-D band splits around the stair opening
// (the hole reaches the C-D wall, so that stretch has no floor).
function contactBands(hBase) {
  const out = [
    el('dw-contact', hFace(LW - WALL_T - 12, LW - WALL_T, 0, LD - WALL_T, hBase)),
  ]
  if (hBase === FH) {
    out.push(el('dw-contact', hFace(0, STAIR_U0, LD - WALL_T - 12, LD - WALL_T, hBase)))
    out.push(el('dw-contact', hFace(STAIR_HOLE_U1, LW, LD - WALL_T - 12, LD - WALL_T, hBase)))
  } else {
    out.push(el('dw-contact', hFace(0, LW, LD - WALL_T - 12, LD - WALL_T, hBase)))
  }
  return out
}

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
  // Panel joints (Stage 5.5 §8), then ceiling washes over both inner faces
  // (Stage 5 §7), then the floor/wall contact shadow (Stage 5.5 §9).
  out.push(...wallSeams(hBase))
  out.push(...ceilBands((h0, h1) => uFace(LW - WALL_T, 0, LD - WALL_T, h0, h1), hTop))
  out.push(...ceilBands((h0, h1) => vFace(LD - WALL_T, 0, LW, h0, h1), hTop))
  out.push(...contactBands(hBase))
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
    // Nextcode side (continues W3) FIRST: it is the farther wall, so the
    // nearer Health-side wall drawn after it must occlude it. Both faces
    // share the partition fill, but the rear wall's own edge strokes (its
    // base line especially) would otherwise paint a stray line across the
    // front wall's clean face between the elevator doors and the passage
    // (user revision).
    el('dw-partition', faceWithDoor(SHAFT_V1)),
    ...passage(SHAFT_V1),
    el('dw-slab-edge', uFace(u0, SHAFT_V1, SHAFT_V1 + WALL_T, hBase, hTop)),
    // Health Platforms side (continues W2), with passage lining for depth.
    el('dw-partition', faceWithDoor(SHAFT_V0 - WALL_T)),
    ...passage(SHAFT_V0 - WALL_T),
    el('dw-slab-edge', uFace(u0, SHAFT_V0 - WALL_T, SHAFT_V0, hBase, hTop)),
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
    const doorLeaf = (u0, u1) =>
      el('dw-door', vFace(SHAFT_V0 - WALL_T, u0, u1, hBase, hBase + DOOR_H))
    out.push(doorLeaf(DOOR_U0, (DOOR_U0 + DOOR_U1) / 2))
    out.push(doorLeaf((DOOR_U0 + DOOR_U1) / 2, DOOR_U1))
    // One quiet horizontal groove per leaf, low on the panel (Stage 5.5
    // §8): the doors read as metal leaves, not blank quads.
    const grooveLine = (u0, u1, h) => {
      const [x1, y1] = p(u0, SHAFT_V0 - WALL_T, h).split(',')
      const [x2, y2] = p(u1, SHAFT_V0 - WALL_T, h).split(',')
      return `<line class="dw-door-line" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />`
    }
    out.push(grooveLine(DOOR_U0 + 3, (DOOR_U0 + DOOR_U1) / 2 - 3, hBase + 14))
    out.push(grooveLine((DOOR_U0 + DOOR_U1) / 2 + 3, DOOR_U1 - 3, hBase + 14))
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

// --- floor-ground: slab-0, story-0 walls, two partitions, props, columns ----
// Puelo Games props (Stage 5.5 §10, user batch decisions): the demo kiosk
// against the B-D wall with the SVG Space Invaders screen, the stool pair
// facing it (soft SVG contact shadow — the stools sprite carries none), and
// hand-drawn storage crates deeper along the same wall. Batches 2-3 (BA
// Technology, Freelancer) will slot between the partitions.
const pueloProps = [
  // kiosk: anchor = the cabinet's near-bottom corner; its back edge stays
  // flush with the B-D wall inner face (230.5 = 220.14 + 10.36 depth);
  // user revision: the whole group sits deeper along the wall
  assetProp(PUEL_KIOSK, 220.14, 36, 0),
  kioskScreenOverlay(spritePlace(PUEL_KIOSK, 220.14, 36, 0)),
  // stools in front of the screen (anchor = the pair's near leg tip)
  el('dw-contact', hFace(198, 216, 32, 68, 0)),
  assetProp(PUEL_STOOLS, 200.1, 33, 0),
  // crates pushed into the section's rear corner (partition at v=164.6),
  // beside the kiosk/stools deeper along the wall
  ...crate(212.5, 230.5, 146, 162, 0, 15),
  ...crate(216, 230, 148, 162, 15, 28),
  ...crate(213.5, 230.5, 131, 144, 0, 12),
]

// --- BA Technology props (Stage 5.5 §10, second batch) ----------------------
// Big chalk blackboard on partition-2's front face (user request): the wall
// visible behind the meeting table in the BA section. Wood frame box proud of
// the wall by 2u, dark slate inset, chalk spreadsheet grid + number/equation
// scribbles — deliberately illegible at overview scale. Kept right of the
// partition doorway and inside the visible envelope (h < 92.5 - 0.495u).
function blackboard() {
  const vW = PARTITION_G[1] - WALL_T / 2 // 396.09: partition-2 front face
  const vF = vW - 2 // board face, 2u proud of the wall
  const u0 = 78
  const u1 = 110
  const h0 = 8
  const h1 = 36
  const out = [
    el('dw-board-cap', uFace(u0, vF, vW, h0, h1)),
    el('dw-board-cap', hFace(u0, u1, vF, vW, h1)),
    el('dw-board-frame', vFace(vF, u0, u1, h0, h1)),
    // slate inset within the frame
    el('dw-board-slate', vFace(vF + 0.4, u0 + 2.5, u1 - 2.5, h0 + 2.5, h1 - 2.5)),
  ]
  // chalk: spreadsheet grid (columns along u, rows along h) + scribbles
  const cols = 6
  const rows = 4
  const cu0 = u0 + 5
  const du = (u1 - u0 - 10) / cols
  const ch0 = h0 + 6
  const dh = (h1 - h0 - 10) / rows
  const vC = vF + 0.3
  for (let j = 0; j <= cols; j++) {
    out.push(el('dw-chalk', `M ${p(cu0 + j * du, vC, ch0)} L ${p(cu0 + j * du, vC, ch0 + rows * dh)}`))
  }
  for (let k = 0; k <= rows; k++) {
    out.push(el('dw-chalk', `M ${p(cu0, vC, ch0 + k * dh)} L ${p(cu0 + cols * du, vC, ch0 + k * dh)}`))
  }
  // number/equation scribbles inside the cells (deterministic)
  for (let j = 0; j < cols; j++) {
    for (let k = 0; k < rows; k++) {
      const n = 1 + Math.floor(hash2(j * 31 + k, 7) * 3)
      for (let i = 0; i < n; i++) {
        const us = cu0 + j * du + 1 + hash2(j * 17 + k * 7 + i, 11) * (du - 4)
        const hs = ch0 + k * dh + 0.8 + hash2(j * 13 + k * 5 + i, 13) * (dh - 2.6)
        const len = 2 + hash2(j * 19 + k * 3 + i, 17) * 2.6
        const wob = (hash2(j * 23 + k + i, 19) - 0.5) * 1.2
        out.push(el('dw-chalk', `M ${p(us, vC, hs)} L ${p(us + len, vC, hs + wob)}`))
      }
    }
  }
  return group('blackboard', out)
}

// Meeting corner (user request): round table, three chairs, two people seated
// seen from behind, papers on the tabletop. User revision: displayed at true
// scale (k 0.1185, was 0.15713 — 1.33x too large) and moved to the visible
// centre of the BA section (anchor = the near chair leg, object (14, 4)).
const baProps = [
  blackboard(),
  assetProp(PUEL_TABLE, 36, 254, 0),
  el('dw-contact', hFace(26, 90, 246, 326, 0)),
]
const floorGround = group('floor-ground', [
  ...slab(0),
  ...backWalls(0),
  // Painter order, far to near: partition-2 (deepest divider), freelancer
  // props that sit behind/around the stair (emitted here so the staircase
  // fragment occludes them correctly), BA props between the partitions,
  // partition-1, Puelo props, columns.
  ...partition(PARTITION_G[1], 0, { opening: true }),
  // Freelancer paper mess, part 1 (user request, SVG): sheets on the floor
  // beside the staircase and pasted on the C-D wall. The front-of-stair
  // sheets live in the freelancer-props fragment (after the staircase).
  ...paperStack(8, 552, 2),
  ...paperStack(14, 566, 1),
  ...paperStack(6, 578, 3),
  ...paperStack(135, 552, 1),
  ...paperStack(142, 566, 2),
  ...paperStack(148, 578, 1),
  wallSheet(6, 15, 0.1),
  wallSheet(12, 30, -0.12),
  wallSheet(18, 45, 0.08),
  wallSheet(9, 60, -0.15),
  wallSheet(15, 72, 0.12),
  ...baProps,
  ...partition(PARTITION_G[0], 0, { opening: true }),
  ...pueloProps,
  ...columns(0, STORY_H),
])

// --- freelancer-props: floor PC + paper mess (Stage 5.5 §10, user request) --
// The PC stands on the floor beside the staircase base, its tower back
// against the stair's solid side face (v = STAIR_V0), keyboard and monitor
// facing -u. Emitted as its own fragment AFTER the staircase so the PC
// correctly paints over the stair's lower steps it stands in front of. The
// paper sheets in front of the stair (v < STAIR_V0) join it here; sheets
// behind the stair are emitted in floor-ground so the stair occludes them.
const freelancerProps = group('freelancer-props', [
  el('dw-contact', hFace(24, 46, 512, 543, 0)),
  assetProp(FREELANCER_PC, 26, 514.5, 0),
  ...paperStack(12, 430, 3),
  ...paperStack(30, 445, 1),
  ...paperStack(50, 460, 4),
  ...paperStack(18, 470, 1),
  ...paperStack(65, 480, 2),
  ...paperStack(35, 495, 1),
  ...paperStack(80, 495, 3),
  ...paperStack(55, 510, 1),
  ...paperStack(95, 510, 2),
  ...paperStack(10, 528, 1),
  ...paperStack(70, 525, 3),
  ...paperStack(110, 525, 1),
  ...paperStack(45, 535, 2),
  ...paperStack(90, 535, 1),
  ...paperStack(125, 535, 1),
  // a couple of sheets dropped on the lower stair treads
  paperSheet(35, 562, 17.5 + 0.4, 6, 8.5, 0.3),
  paperSheet(48, 570, 26.25 + 0.4, 6, 8.5, -0.2),
])

// --- floor-01: slab-1 with stair opening, story-1 walls, shaft return walls -
const floor01 = group('floor-01', [
  ...slab(FH, { stairOpening: true }),
  ...backWalls(FH),
  // Server rack group (Stage 5.5 §10, user revision): two tall cabinets and
  // one short one on the Health Platforms stretch, standing on the B-D
  // wall's near stretch where the sight line keeps them fully visible.
  // Emitted in inverse order (far first, near last) so nearer cabinets
  // correctly paint over the ones behind them; the short cabinet stands at
  // the near end so the row rises toward the back.
  ...serverRack(230.5, 72, 94, FH, FH + 66),
  ...serverRack(230.5, 46, 68, FH, FH + 62),
  ...serverRack(230.5, 20, 42, FH, FH + 38),
  // Electrical panel on the Health Platforms stretch (data-operations
  // floor — a service panel is the believable piece here), with a conduit
  // drop feeding it from the fifth-floor slab line (Stage 5.5 §7/§8).
  ...boxOnUWall(222, 230.5, 168, 192, FH + 34, FH + 60),
  el('dw-conduit', uFace(227.5, 178.5, 181.5, FH, FH + 34)),
  dot(222, 173, FH + 47),
  dot(222, 187, FH + 47),
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
const floor02 = group('floor-02', [
  ...slab(2 * FH),
  ...backWalls(2 * FH),
  // A/B test 2: horizontal wall run from the pre-tilted sprite, starting at
  // the vertical pipe's base (skirting level — low runs stay visible from
  // this camera) and receding behind the story above. Drawn BEFORE the
  // vertical run so the riser reads as passing in front at the T.
  assetPipeH(227.5, 60, 2 * FH + 16),
  // Prototype service pipe on the B-D wall's near stretch, from the
  // user-approved generated sprite. Lives INSIDE this floor fragment so the
  // floors above occlude its upper part where the sight line crosses their
  // slabs — the run rises from its floor and disappears behind the story
  // above, like the reference's pipes.
  assetPipe(227.5, 60, 2 * FH, STORY_H),
  // The dev workstations on the Interactica story (Stage 5.5 §10): the
  // wireframe-matched generated sprites (WS_C monitor desk, WS_D notebook
  // desk side by side), pulled off the wall face so the pipe run passes
  // behind them; drawn after the pipes.
  assetWorkstation(WS_C, 221.5, 26, 2 * FH),
  assetWorkstation(WS_D, 221.5, 82, 2 * FH),
])
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
  // (Indelve service drop removed on user review — it floated unattached.)
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
  // that floor-01 shows. Re-layer the FULL cut face over the enclosure (and
  // the W2 / W3 cut ends) so every level's base line reads as one continuous
  // band descending past the shaft's corner, exactly like floor-01.
  for (let n = 2; n <= 5; n++) {
    out.push(el('dw-slab-edge', uFace(0, 0, LD, n * FH - SLAB_T, n * FH)))
  }
  // Year signs on the enclosure wall, one per story.
  STORY_YEARS.forEach((year, i) => out.push(...yearPlaque(year, (i + 1) * FH)))
  // Service conduit on the enclosure face (Stage 5.5 §7): the shaft's dark
  // steel service riser, proud of the u = 0 plane so it visibly crosses the
  // re-layered floor bands with the shaft; a junction box per story.
  out.push(el('dw-conduit', uFace(-1.5, 332, 335, FH, TOP_H)))
  for (let story = 1; story <= 5; story++) {
    out.push(...boxOnUWall(-1.5, 0, 329, 341, story * FH + 22, story * FH + 34))
  }
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
    `<path d="${d}" fill="#141618" fill-opacity="0.32" filter="url(#dw-soft)" />`,
  ])
}

// --- architectural-details: (empty placeholder) -----------------------------
// Vertical service pipes come from the user-approved generated sprite
// (src/assets/pipe-01.png, Stage 5.5 §6/§7), placed per floor via assetPipe()
// in the owning floor fragment so occlusion stays correct.
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
        '<rect x="1100" y="890" width="60" height="10" fill="#a8a49c" />',
        '<rect x="1100" y="910" width="44" height="10" fill="#a8a49c" />',
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
  'freelancer-props': freelancerProps,
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
