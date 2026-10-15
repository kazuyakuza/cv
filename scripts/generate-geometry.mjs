import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import QRCode from 'qrcode'
import { IDENTITY, SECTIONS, CURRENT_IDENTITY } from './career-data.mjs'
import { TECH_LOGOS } from './tech-logos.mjs'

// Stage 2 geometry generator — emits the repetitive architectural fragments
// (floors, staircase, elevator, entrance, projecting-sign) from the shared
// parameter block documented in src/svg/README.md. terrain.svg, path.svg and
// labels.svg stay hand-authored. Edit parameters here, re-run
// `npm run svg:generate`, then `npm run svg:assemble`.

// Utility raster assets (Stage 5.5): the generator emits a `__ASSET__<file>__`
// token per image instead of inlining base64 bytes. `src/App.vue` maps each
// token to the Vite-hashed URL of the matching optimized derivative in
// `src/assets/serve/` (built by `scripts/optimize-assets.py`); the dev preview
// (`generated/dev/make_chk.py`) resolves the same tokens to inline data URIs.
// Full-resolution masters live in `src/assets/` and are never modified.
const inlineAsset = (name) => `__ASSET__${name}__`

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
const SHAFT_V0 = 0.46 * LD * 0.85 // shaft depth start (Health Platforms side; user r23: -15%)
const SHAFT_V1 = SHAFT_V0 + 0.125 * LD // shaft depth end    (Nextcode side; keeps 0.125·LD depth)
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

const PARTITION_G = [0.28 * LD * 0.85, 0.68 * LD] // ground floor partitions (Puelo Games reduced 15%, user r23)
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

// ---------------------------------------------------------------------------
// Stage 5.6 — architectural-refinement vocabulary
// ---------------------------------------------------------------------------
// Reusable primitives for the floor-by-floor pass (partial walls, wall
// fixtures, surface wear, slab construction, brackets and connected
// infrastructure). All are authored in the building's own u/v/h projection
// through the same p()/uFace()/vFace()/hFace() helpers, so they carry the
// shared hand-drawn jitter and stay editable. Class names resolve in
// scripts/style.mjs.

// Mirror of boxOnUWall for a constant-v wall plane: the box is mounted against
// the wall at vWall and protrudes toward -v (toward the viewer). Near v should
// be < the wall's v.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const boxOnVWall = (vFront, vWall, u0, u1, h0, h1, cls = 'dw-jbox') => [
  el(cls, vFace(vFront, u0, u1, h0, h1)),
  el(cls, hFace(u0, u1, vFront, vWall, h1)),
  el(cls, uFace(u1, vFront, vWall, h0, h1)),
]

// Partial wall fragment (Stage 5.6 §1/§12): a short wall volume with a chosen
// near face toward the viewer, a top cap and both cut ends. `plane` is the
// axis the wall RUNS along; `at` is its viewer-side coordinate; the wall is
// WALL_T thick away from the viewer.
//   plane 'u' -> runs along u (a..a+t span), thickness along v
//   plane 'v' -> runs along v (a..a+t span), thickness along u
// `face` is the near-face material class (dw-wall for exterior concrete,
// dw-wall-far / dw-partition for interior surfaces).
// `ends` = [bool, bool] draws each end's thickness cap; `scrap` = [bool, bool]
// makes that end a ragged section cut (user r165: the added wall ends should
// look "scrapped"/cut to reveal the interior, not cleanly terminated). The
// profile's top/bottom corners stay exact, so the top cap always closes.
function partialWall(plane, a0, a1, at, h0, h1, opts = {}) {
  const {
    t = WALL_T,
    face = 'dw-wall',
    cap = 'dw-slab',
    end = 'dw-slab-edge',
    ends = [true, true],
    scrap = [false, false],
    scrapSeed = 0,
    scrapAmp = 4.5,
    outline = true,
  } = opts
  // Vertical profile at an end: straight (two points) or a ragged cut (n steps,
  // deterministic, corners exact).
  const prof = (a, ragged) => {
    if (!ragged) return [[a, h0], [a, h1]]
    const n = 5
    const pts = []
    for (let i = 0; i <= n; i++) {
      const h = h0 + (h1 - h0) * (i / n)
      const jitter =
        i === 0 || i === n
          ? 0
          : (hash2(Math.round(a * 11) + scrapSeed * 97, (plane === 'u' ? i * 13 : i * 17) + 5) - 0.5) * 2 * scrapAmp
      pts.push([a + jitter, h])
    }
    return pts
  }
  const L = prof(a0, scrap[0])
  const R = prof(a1, scrap[1])
  const poly = [L[0], ...R, ...L.slice(1).reverse()]
  const faceAttrs = outline === false ? ' style="stroke:none"' : typeof outline === 'number' ? ` style="stroke-width:${outline}"` : ''
  const out = []
  if (plane === 'u') {
    const v0 = at
    const v1 = at + t
    out.push(el(face, path(poly.map(([a, h]) => p(a, v0, h))), faceAttrs))
    if (ends[0]) out.push(el(end, path([...L.map(([a, h]) => p(a, v0, h)), ...L.slice().reverse().map(([a, h]) => p(a, v1, h))])))
    if (ends[1]) out.push(el(end, path([...R.map(([a, h]) => p(a, v0, h)), ...R.slice().reverse().map(([a, h]) => p(a, v1, h))])))
    if (cap) out.push(el(cap, hFace(a0, a1, v0, v1, h1)))
  } else {
    const u0 = at
    const u1 = at + t
    out.push(el(face, path(poly.map(([a, h]) => p(u0, a, h))), faceAttrs))
    if (ends[0]) out.push(el(end, path([...L.map(([a, h]) => p(u0, a, h)), ...L.slice().reverse().map(([a, h]) => p(u1, a, h))])))
    if (ends[1]) out.push(el(end, path([...R.map(([a, h]) => p(u0, a, h)), ...R.slice().reverse().map(([a, h]) => p(u1, a, h))])))
    if (cap) out.push(el(cap, hFace(u0, u1, a0, a1, h1)))
  }
  return out
}

// Wall-mounted ventilation grille (Stage 5.6 §11): a shallow recessed box on a
// constant-u or constant-v wall face with a row of slats. `a0..a1` is the
// in-plane horizontal span; `h0..h1` the vertical span.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ventGrille(plane, at, a0, a1, h0, h1) {
  const out = []
  const out2 = plane === 'u' ? el('dw-grille', vFace(at, a0, a1, h0, h1)) : el('dw-grille', uFace(at, a0, a1, h0, h1))
  out.push(out2)
  const n = 4
  for (let i = 1; i <= n; i++) {
    const a = a0 + ((a1 - a0) * i) / (n + 1)
    out.push(el('dw-grille-line', `M ${pv(plane, at, a, h0 + 0.8)} L ${pv(plane, at, a, h1 - 0.8)}`))
  }
  return out
}

// Point on a constant plane in the building projection (in-plane axis a,
// height h): constant-u plane for plane 'u', constant-v for plane 'v'.
const pv = (plane, at, a, h) => (plane === 'u' ? p(a, at, h) : p(at, a, h))

// Small wall-mounted switch plate (Stage 5.6 §11): a tiny plate with one
// toggle dot, proud of the wall.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function switchPlate(plane, at, a, h) {
  const w = 3.4
  const hh = 4.2
  const [x, y] = pv(plane, at, a, h).split(',').map(Number)
  const out = []
  out.push(plane === 'u' ? el('dw-switch', vFace(at, a - w / 2, a + w / 2, h - hh / 2, h + hh / 2)) : el('dw-switch', uFace(at, a - w / 2, a + w / 2, h - hh / 2, h + hh / 2)))
  out.push(`<circle class="dw-switch-dot" cx="${round(x)}" cy="${round(y - 0.6)}" r="0.9" />`)
  return out
}

// Small wall light fixture (Stage 5.6 §5/§11): a compact body proud of the
// wall plus a soft warm glow. Returns a group of raw strings.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function wallLight(plane, at, a, h, { glow = 9, warm = false } = {}) {
  const out = []
  const arm = plane === 'u' ? el('dw-lamp', vFace(at, a - 1.6, a + 1.6, h - 1.2, h + 1.2)) : el('dw-lamp', uFace(at, a - 1.6, a + 1.6, h - 1.2, h + 1.2))
  out.push(arm)
  const [x, y] = pv(plane, at, a, h).split(',').map(Number)
  out.push(`<circle class="dw-glow" cx="${round(x)}" cy="${round(y + (warm ? 3 : 1.4))}" r="${round(glow)}" />`)
  out.push(`<circle class="${warm ? 'dw-lamp-core dw-lamp-warm' : 'dw-lamp-core'}" cx="${round(x)}" cy="${round(y)}" r="1.5" />`)
  return out
}

// Small indicator/status light (Stage 5.6 §8): a tiny colored dot with a soft
// halo, for the elevator and maintenance panels.
function indicatorLight(plane, at, a, h, { red = false, r = 1.5 } = {}) {
  const [x, y] = pv(plane, at, a, h).split(',').map(Number)
  const cls = red ? 'dw-indicator-red' : 'dw-indicator'
  return [
    `<circle class="dw-glow ${red ? 'dw-glow-red' : ''}" cx="${round(x)}" cy="${round(y)}" r="${round(r * 4)}" />`,
    `<circle class="${cls}" cx="${round(x)}" cy="${round(y)}" r="${round(r)}" />`,
  ]
}

// Wall-mounted fixture sprite (Stage 5.6 §11, user-approved generated sheet):
// a flat front-view fixture image (src/assets/fixture-*.png) laid on a wall
// plane with the wall's own skew matrix, so it belongs to the wall exactly
// like the pinned app boards. plane 'u' = a constant-v face (faces -v, local
// +x = +u); plane 'v' = a constant-u face (faces -u, local +x = -v). (a0,hTop)
// is the local (0,0) corner; w/h are the on-wall size in wall units.
function wallFixture(file, plane, at, a0, hTop, w, h) {
  const [ox, oy] = (plane === 'u' ? p(a0, at, hTop) : p(at, a0, hTop)).split(',').map(Number)
  const m = plane === 'u' ? '0.7071 -0.2475 0 1' : '0.7071 0.2475 0 1'
  return `<g transform="matrix(${m} ${round(ox)} ${round(oy)})"><image href="${inlineAsset(file)}" x="0" y="0" width="${round(w)}" height="${round(h)}" preserveAspectRatio="none" /></g>`
}

// Structural L-bracket (Stage 5.6 §3/§9/§14): a small steel angle under a slab
// edge or against a wall, in a constant plane. `dir` points away from the
// mounting surface (+1 / -1 over the in-plane axis).
function bracket(plane, at, a, h0, h1, { dir = 1, leg = 5, cls = 'dw-bracket' } = {}) {
  const out = []
  out.push(el(cls, `M ${pv(plane, at, a, h1)} L ${pv(plane, at, a, h0)} L ${pv(plane, at, a + dir * leg, h0)}`))
  out.push(el(cls, `M ${pv(plane, at, a, h0 + (h1 - h0) * 0.5)} L ${pv(plane, at, a + dir * leg * 0.6, h0 + (h1 - h0) * 0.5)}`))
  return out
}

// Localized surface wear (Stage 5.6 §10): deterministic sparse scratches, one
// panel seam, one short crack and a faint patch on a chosen wall face — the
// reference's walls read used but maintained, not destroyed. `seed` re-rolls
// the layout so no two walls repeat. Kept subtle and few on purpose.
function surfaceWear(plane, at, a0, a1, h0, h1, seed = 0) {
  const span = a1 - a0
  const hspan = h1 - h0
  const rnd = (i, k) => hash2(Math.round(at * 7) + seed * 131 + i * 17, k * 29 + 7)
  const out = []
  const q = (a, h) => pv(plane, at, a, h)
  // scratches: short hand strokes, a slight tilt
  const n = Math.max(2, Math.round(span / 22))
  for (let i = 0; i < n; i++) {
    const a = a0 + 0.08 * span + rnd(i, 1) * span * 0.84
    const h = h0 + 0.12 * hspan + rnd(i, 2) * hspan * 0.72
    const len = 2.5 + rnd(i, 3) * 6
    const dh = (rnd(i, 4) - 0.5) * 3
    out.push(el('dw-wear', `M ${q(a, h)} L ${q(a + len, h + dh)}`))
  }
  // one quiet panel seam
  const sa = a0 + (0.3 + 0.4 * rnd(0, 5)) * span
  out.push(el('dw-wear-seam', `M ${q(sa, h0 + 1)} L ${q(sa, h1 - 1)}`))
  // one short crack
  const ca = a0 + (0.2 + 0.55 * rnd(1, 6)) * span
  const ch = h0 + 0.25 * hspan
  out.push(el('dw-crack', `M ${q(ca, ch)} L ${q(ca + 1.4, ch + 3.6)} L ${q(ca - 0.7, ch + 7) } L ${q(ca + 0.5, ch + 10.5)}`))
  // one faint patched area
  const pa0 = a0 + 0.12 * span
  const pa1 = a0 + 0.38 * span
  const ph0 = h0 + 0.55 * hspan
  const ph1 = h0 + 0.88 * hspan
  out.push(el('dw-patch', plane === 'u' ? vFace(at, pa0, pa1, ph0, ph1) : uFace(at, pa0, pa1, ph0, ph1)))
  return out
}

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

// Small data server facing the building's FRONT wall (r25 review, Interactica
// story 2): the serverRack idiom mirrored — the cabinet's door face is a
// constant-v plane looking toward −v (the front/cutaway), the visible side
// face is at u0, the body extends 9u deeper (+v). Same detail language as the
// floor-1 racks (plinth, frame, blanking panels, LED row, vents, seams).
function serverRackFront(u0, u1, vFront, hBase, hTop) {
  const vBack = vFront + 9
  const hB = hBase + 4
  const out = [
    el('dw-contact', hFace(u0 - 1.5, u1 + 1.5, vFront - 1.5, vBack + 1.5, hBase)),
    el('dw-rack-plinth', vFace(vFront + 1, u0 + 1, u1 - 1, hBase, hB)),
    el('dw-rack-plinth', uFace(u0, vFront + 1, vBack - 1, hBase, hB)),
    el('dw-rack', vFace(vFront, u0, u1, hB, hTop)),
    el('dw-rack-side', uFace(u0, vFront, vBack, hB, hTop)),
    el('dw-rack-top', hFace(u0, u1, vFront, vBack, hTop)),
    el('dw-rack-frame', vFace(vFront, u0 + 2.2, u1 - 2.2, hB + 3, hTop - 2.5)),
  ]
  out.push(rackDot('dw-rack-vent', (u0 + u1) / 2, vFront, hTop - 0.9, 1.1))
  for (let i = 0; i < 5; i++) out.push(rackLed(u0 + 3.8 + i * 2.6, vFront, hTop - 5, i === 2))
  let h = hTop - 9.5
  while (h - 3.2 > hB + 6.5) {
    out.push(el('dw-rack-panel', vFace(vFront, u0 + 3.4, u1 - 3.4, h - 3.2, h)))
    out.push(el('dw-rack-slot', `M ${p(u0 + 3.4, vFront, h - 4.6)} L ${p(u1 - 3.4, vFront, h - 4.6)}`))
    out.push(el('dw-rack-slot', `M ${p(u0 + 3.4, vFront, h - 5.1)} L ${p(u1 - 3.4, vFront, h - 5.1)}`))
    h -= 5.6
  }
  for (let row = 0; row < 2; row++) {
    for (let i = 0; i < 4; i++) out.push(rackVent(u0 + 4.2 + i * 3.6, vFront, hB + 4.6 + row * 2.4))
  }
  for (const sv of [vFront + 2.2, vFront + 5.4]) {
    const [x1, y1] = p(u0, sv, hB + 2).split(',').map(Number)
    const [x2, y2] = p(u0, sv, hTop - 1).split(',').map(Number)
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

// --- Cleverlit stand kiosk (r25 review) -------------------------------------
// A congress information point: a touch-screen panel on a slim pillar with a
// webcam/card reader clipped at its side, a mini PC box at the pillar base and
// a person using it. Wireframe-only pipeline: generated/dev/
// make_wire_standkiosk.py → standkiosk-wire.png → NB2 (wireframe as the ONLY
// input) → candidate standkiosk-cand.png (picked of three by silhouette match)
// → generated/dev/key_cut_standkiosk.py → src/assets/standkiosk-01-cut.png
// (385x777). The art's composition is ~24% wider than the wireframe, so k is
// matched to the VERTICAL extent (the object's content measures 48.6 diorama
// px — the wireframe draws at ~13.215 px per h-unit, NOT at S=10 in diorama
// px). USER EDIT (r25 review part 2): the sprite was mirrored horizontally
// (verified: identical to the flip of the committed original) so the person
// looks toward the building's right wall — the anchor (bottommost opaque
// pixel) moved from sprite-x 239 to 136, hence ax 14.95 → 8.51.
const STANDKIOSK = { file: 'standkiosk-01-cut.png', w: 385, h: 777, k: 0.062548, ax: 8.51, ay: 48.41 }

// Data cables from the kiosk's mini PC across the Interactica floor to the
// small data server beside the elevator (r25 review part 2: the server moves
// next to the shaft, so the run ENDS in it). Smooth quadratic path through the
// waypoints. The start sits under the kiosk sprite (the mini PC's drawn
// position, so the cables come out from under it — the kiosk is emitted after
// these cables), the end lands on the server's front face at v ≈ 210.
// Route constraint: every waypoint stays outside the floor-2 slab triangle's
// rect (u <= 48.2 AND v <= 222.4) — that slab surface lives in the
// 'floor-02-front' fragment, which the assembler draws AFTER the elevator, and
// anything under it is hidden; the cables themselves are emitted there too,
// after the slab surface.
function smoothRun(pts, h) {
  const P = pts.map(([u, v]) => p(u, v, h))
  let d = `M ${P[0]}`
  for (let i = 1; i < P.length - 1; i++) {
    const [mx, my] = [P[i], P[i + 1]].map((s) => s.split(',').map(Number)).reduce((a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2])
    d += ` Q ${P[i]} ${round(mx)},${round(my)}`
  }
  d += ` L ${P[P.length - 1]}`
  return d
}
function kioskCables(h) {
  const main = [
    [81, 37], [79, 50], [76, 72], [73, 100], [70, 130], [67, 160], [64, 192], [60, 219],
  ]
  const second = [
    [80, 40], [77, 55], [74, 80], [71, 108], [68, 138], [65, 168], [62, 198], [64, 223],
  ]
  return [el('dw-cable', smoothRun(main, h)), el('dw-cable-2', smoothRun(second, h))]
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
// staircase. Anchor = the sprite's bottommost pixel (the keyboard's near
// corner). User revision: hand-edited the art so the CRT faces the
// entrance side — the anchor pixel moved to sprite-px ~(169.5, 541) →
// ax 9.69 (ay unchanged). Latest revision: stands toward the END of the
// flight's run (anchor u 82; the flight runs u 22..127).
const FREELANCER_PC = { file: 'freelancer-pc-01-cut.png', w: 475, h: 544, k: 0.05717, ax: 9.69, ay: 30.93 }
// Nextcode dev staffage (user request, Stage 5.5 §10): the four-developer
// group as a generated sprite (wireframe-only pipeline: generated/dev/
// make_wire_devs.py → devs-wire.png → key_cut_devs.py). Originally placed as
// the approved SVG staffage — visible pair green (v 438, u 56) / blue
// (v 424, u 44), peeking pair grey (v 386, u 34) rear / brown (v 372,
// u 20) front behind the shaft's W3 cut edge. Since UPDATE #16 the shaft
// moved forward and the group stands fully visible in the enlarged
// Nextcode (no more peek). r24 review: moved right toward the elevator and
// +5%; r25 review: another +5% (total ×1.1025) and a further step toward
// the shaft. k/ax/ay scale together so the anchor pixel stays put.
// Constraint: the sprite's VISIBLE content ends at sprite-px ≈ 553 (the
// 554..673 columns are empty except a 1px white keying leftover at 674),
// i.e. content right edge ≈ 524 at anchor v=346 — ~6px clear of the shaft's
// far-left silhouette (x ≈ 530.5), so nothing is occluded.
const DEV_GROUP = { file: 'devs-01-cut.png', w: 675, h: 962, k: 0.0667674, ax: 32.248125, ay: 64.0332 }
// Health Platforms seated-DBA staffage (user request, Stage 5.5 §10): ONE
// person sitting on the floor reading a handful of papers, placed left of
// the server racks (v 20..94) in the room centre pulled toward the B-D wall.
// Wireframe-only pipeline: generated/dev/make_wire_sitter.py →
// sitter-wire.png → key_cut_sitter.py. Anchor = the sprite's bottom-row
// centre (the foot contact; wireframe foot at u 205.5) placed at
// p(160, 82, FH); k keeps the seated height at 35.24u (user revisions:
// doubled from 20.73u, then reduced 15% — "double was too much"). He faces
// the B-D wall (profile billboard, like the devs). The head sits ~15.7u
// forward of the anchor (which lifts it on screen); the floor-2 slab cut
// caps the height at that spot at h + 0.495·v ≤ 197.5, which is why v came
// forward from 130 to 82 — the (-u,-v) view diagonal kept his screen x
// where the user approved it.
const SITTER = { file: 'sitter-01-cut.png', w: 481, h: 605, k: 0.058735, ax: 22.85, ay: 35.36 }
// Interactica city-model board (r36 review, user request): a miniature
// isometric city board — a '#' street grid, a central block of white battery
// containers, and grass/trees/a utility pole/cars/parking around it — lying
// flat on the floor like a board game left behind. Wireframe-only pipeline:
// generated/dev/make_wire_cityboard.py → cityboard-wire.png → NB2/Pro
// (wireframe as the ONLY input) → cityboard-cand.png → key_cut_cityboard.py.
// Anchor = the board's near corner (bottommost opaque pixel), placed at
// p(123, 167, 2*FH); the board spans u 123..165, v 167..209 (42u square,
// projected width 59.4 px like the user's red mark).
const CITY_BOARD = { file: 'cityboard-01-cut.png', w: 2289, h: 1041, k: 0.02601, ax: 29.86, ay: 27.0 }
// Interactica AR/VR staffage (r36 review, user): a person seen from BEHIND
// wearing an AR/VR headset, with small shapeless holographic models floating
// around him. Wireframe-only pipeline: generated/dev/make_wire_ar.py →
// arvr-wire.png → NB2/Pro → arvr-cand_2.png → key_cut_ar.py. Anchor = the
// bottommost opaque pixel (a foot), placed at p(70, 403, 2*FH) — behind the
// shaft, so his projection lands screen-left of the elevator (the user's
// marked spot); k is matched to the GROUP height (37.71u), giving the person
// a ~31u standing height like the Nextcode devs. r36 follow-up (user):
// +5% size (k/ax/ay all scaled ×1.05 about the foot) and nudged down-right
// on screen (anchor (68,415) → (70,403): Δx ≈ +10, Δy ≈ +2.5 px).
const ARVR_PERSON = { file: 'arvr-01-cut.png', w: 1036, h: 1815, k: 0.02187, ax: 10.59, ay: 39.63 }
// Interactica seated-devs group (r37 review, user): five developers sitting on
// the floor with laptops, seen from behind, facing the rear (C-D) wall. One
// sprite for the whole group. Wireframe-only pipeline: generated/dev/
// make_wire_sitdevs.py → sitdevs-wire.png → NB2/Pro → sitdevs-cand_2.png →
// key_cut_sitdevs.py. k is matched to the group WIDTH (56px, the row of five)
// because the model spread the row a little wider than the wireframe; height
// then lands ~33px. Anchor = the nearest dev's foot, placed at p(92, 559, 2*FH).
const SITDEVS = { file: 'sitdevs-01-cut.png', w: 1588, h: 943, k: 0.03538, ax: 9.18, ay: 33.25 }
// Interactica single seated dev (Stage 5.5 UPDATE #68, user): `sitdev-01.png`, a
// lone cross-legged developer with a laptop (same character family as the
// SITDEVS row above). Placed on the RIGHT Interactica half, just west of the
// city board, at the user's red mark. Height matched to the SITDEVS group
// (~33u); anchor = the bottommost pixel (a foot), centre-x of the seat.
// UPDATE #69 (user): 15% smaller (k/ax/ay x0.85) and moved to a layer ABOVE the
// city board (emitted after CITY_BOARD).
// UPDATE #70 (user): another 5% smaller (k/ax/ay x0.95) and nudged up-left toward
// the elevator just enough that the sprite clears the board's rect.
// UPDATE #71 (user): moved along the red arrow in the screenshot — its head maps
// to floor (91.8, 180.6) (shot scale 6.377 px/u from the dev's own anchor + the
// board's west corner), so the dev now sits just in FRONT of the board's west
// corner (nearer: u+v 273 < 332, so it may legally overlap that corner).
const SITDEV = { file: 'sitdev-01.png', w: 412, h: 536, k: 0.04974, ax: 7.64, ay: 26.62 }
const SITDEV_ANCHOR = [92, 181]
// Interactica tech-lead staffage (r37 review, user): a standing person seen
// from behind, right arm raised, pointing at the wall-mounted graph screen.
// Wireframe-only pipeline: generated/dev/make_wire_techlead.py →
// techlead-wire.png → NB2/Pro → techlead-cand_2.png → key_cut_techlead.py.
// k matched to HEIGHT (32.7u standing). Anchor = the foot, placed at
// p(72, 572, 2*FH); he stands just left of the seated devs, at the wall.
const TECHLEAD = { file: 'techlead-01-cut.png', w: 726, h: 1851, k: 0.01771, ax: 3.69, ay: 32.74 }
// Floor-3 Interactica table cluster (r40 review, user): four small desks in a
// cross/plus, each seating two developers (one per long side, laptops and
// papers on the desks), eight people total. One sprite for the whole cluster.
// Wireframe-only pipeline: generated/dev/make_wire_teamcross.py →
// teamcross-wire.png → NB2/Pro → teamcross2-cand_3.png →
// key_cut_teamcross.py. k matched to the cluster WIDTH (~29.5px), then ×1.25 on
// the r41 review (the devs read as ants). Anchor = the nearest dev's foot,
// placed at p(172, 125, 3*FH) so the cross centres on ~(186, 128) — the middle
// of the visible floor-3 Interactica area, pushed toward the right (B-D) wall.
// u ≈ 186 / v ≈ 128 keeps every seated dev inside the floor-4 slab-cut
// envelope (h_local + 0.495·min(u,v) ≤ 92.5; devs top ~18.5u → min(u,v) ≲ 149).
const TEAMCROSS = { file: 'teamcross-01-cut.png', w: 1128, h: 970, k: 0.06568, ax: 24.02, ay: 63.50 }
// Floor-3 Interactica bosses (r40 review, user): two bosses plus a tech lead
// standing close together, seen from behind, debating over papers they hold.
// Wireframe-only pipeline: generated/dev/make_wire_bosses.py →
// bosses-wire.png → NB2/Pro → bosses-cand.png → key_cut_bosses.py. k matched
// to HEIGHT (32.7u standing). Re-measured after the user hand-edited the cut
// PNG (r41 review): ax moved 8.68 → 18.48 (bottommost foot shifted right).
// Anchor = the nearest foot, placed at p(136, 90, 3*FH) — just in front of the
// cluster and toward the left (A-C) wall: the two groups share a screen x with
// the bosses ~21px lower. min(u,v) = 90 keeps the standing trio clear of the
// floor-4 slab cut.
const BOSSES = { file: 'bosses-01-cut.png', w: 1226, h: 1480, k: 0.0255, ax: 21.25, ay: 37.65 }
// Floor-3 Indelve PC towers (UPDATE #39, user): two desktop towers side by
// side, front panels facing the building's front wall (-v). Wireframe-only
// pipeline: generated/dev/make_wire_towers.py -> pctowers-wire.png -> NB2
// (wireframe as the ONLY input) -> pctowers-cand.png (best of 2 by silhouette)
// -> key_cut_towers.py (W_TARGET 23px). Anchor = the pair's front-left foot,
// placed at p(131, 564, 3*FH) right of the promo screen and near the C-D wall.
const PCTOWERS = { file: 'pctowers-01-cut.png', w: 669, h: 798, k: 0.03464, ax: 10.84, ay: 27.54 }
// Floor-3 Indelve presenter (UPDATE #42, user): a standing person seen from
// behind (he faces the building's right B-D wall), black t-shirt, a microphone
// to his mouth and the other hand pointing up-right at the promo screen.
// Wireframe-only pipeline: generated/dev/make_wire_presenter.py ->
// presenter-wire.png -> NB2 (wireframe input, n=3) -> pick_presenter.py picked
// presenter-cand_2.png -> key_cut_presenter.py. The user then HAND-EDITED the
// cut PNG (turned him to face the right wall), asked to double it and then to
// reduce it 30%; final size measured from the edited PNG (k 0.058318 = 45.78u
// tall, ax/ay 11.34 / 45.9 from its bottommost foot). Anchor = the foot, placed
// at p(52, 554, 3*FH): same screen x as the original (u-v unchanged) but
// min(u,v)=52, clear of the floor-4 slab cut.
const PRESENTER = { file: 'presenter-01-cut.png', w: 307, h: 790, k: 0.058318, ax: 11.34, ay: 45.9 }
// Floor-3 Indelve AR/VR demo person (UPDATE #42, user): the user's sprite
// `trantorian-vr.png`, hand-derived from arvr-01-cut.png — a person seen from
// behind wearing a VR headset. UPDATE #44 (user): size +15% (height 30 → 34.5u)
// and the image top-left pinned to the absolute point `VR_XY` (see below);
// measured with measure_asset.py, no wireframe/NB run needed.
const TRANTORIAN_VR = { file: 'trantorian-vr.png', w: 359, h: 1592, k: 0.0216845, ax: 2.8, ay: 34.5 }
// Floor-3 Indelve queue (UPDATE #45, user): four different people waiting in a
// line behind the AR/VR demo person, seen from behind. Wireframe-only pipeline:
// generated/dev/make_wire_queue.py -> queue-wire.png -> NB2 (n=3) ->
// pick_queue.py picked queue-cand.png -> key_cut_queue.py. The user then
// HAND-EDITED the cut PNG to invert the queue direction; re-measured with
// measure_asset.py (k 0.05415, ax/ay 21.36 / 37.91). Anchor = the bottommost
// foot (now the NEAR end of the queue, the green sweater), placed so the queue
// runs along -v (down-right, per the user's red line) just behind the VR
// person's drawn foot.
const QUEUE = { file: 'queue-01-cut.png', w: 485, h: 703, k: 0.05415, ax: 21.36, ay: 37.91 }
// Floor-3 Indelve virtual-combat fleets (UPDATE #50, user): two painterly
// fleets (1 long capital + 4 detached fighters each) floating over the hex
// board, facing each other (A points right, B points left). Wireframe-only
// pipeline: generated/dev/make_wire_fleet.py -> fleet-a/b-wire.png -> NB2 (n=2
// each) -> pick_fleet.py picked the _2 candidate for both -> key_cut_fleet.py.
// Anchors are the sprites' bottommost pixels, and each capital is a single long
// hull spanning nearly the whole sprite width (fighters are separate blobs
// above/below it), so `ax/ay` are far below the hull centre.
// UPDATE #53 (user review of r91 — "get back the size, they should occupy most
// of the board"): the key-cut had scaled both to `W_TARGET 42`, well under the
// wireframe's implied scale, so both are now PLACED at a 74-unit width (about
// the capital = 2/3 of the board's long side): `k` and the `ax/ay` anchor
// offsets were scaled by 74/42.2 = 1.7536 (equivalent to re-cutting at
// `W_TARGET 74`; the keyed PNGs themselves already carry that resolution).
// UPDATE #54 (user): that width is reduced 15% -> 62.9 / 62.8u (k and ax/ay
// scaled by 0.85 from the #53 values).
const FLEET_A = { file: 'fleet-a-01-cut.png', w: 958, h: 505, k: 0.0657, ax: 24.15, ay: 32.97 }
const FLEET_B = { file: 'fleet-b-01-cut.png', w: 1269, h: 648, k: 0.04953, ax: 42.35, ay: 31.94 }
// Pacer (floor 4) legacy-stack corner sprite (Stage 5.5 UPDATE #57, user): the
// first authorized Pacer content — "one of the reasons I entered Pacer was to
// replace its very old system (vanilla PHP etc.) with a newer tech stack." The
// decaying old side of that story: three LOW old server boxes (not the tall
// floor-2 racks) bursting with spaghetti cables, litter around them, dust,
// sparks and flies. Wireframe-only pipeline: generated/dev/
// make_wire_pacer_legacy.py -> pacer-legacy-wire.png -> NB2 Pro (wireframe as
// the ONLY input, n=3) -> picked candidate pro_..._1 -> key_cut_pacer_legacy.py
// (W_TARGET 38px). UPDATE #58 (user): the whole sprite is DOUBLED (k/ax/ay x2
// -> ~76px wide, ~49u tall). UPDATE #59 (user): the user hand-edited the cut
// PNG (size still 931x592; its bottommost pixel moved to x~804) and asked for
// the sprite's TOP-LEFT to be pinned to the absolute screen point PACER_XY via
// a derived screen offset (same technique as the fleets/PC towers), so ax/ay
// were re-measured from the edited PNG. UPDATE #60 (user): PACER_XY nudged to
// (815, 470) and the SVG cables follow the sprite (see PACER_CABLE_AX). UPDATE
// #62 (user): the pile SHRINKS 15% (k/ax/ay x0.85) while keeping its corner
// location — PACER_XY is re-solved so the sprite's bottom-right (its floor +
// wall contact, image bottom-right = old 891.42, 518.59) stays put. UPDATE #67
// (user): another 10% smaller (k/ax/ay x0.9); PACER_XY re-solved the same way
// to keep the bottom-right contact fixed (→ 833.0, 481.4).
const PACER_LEGACY = { file: 'pacer-legacy-01-cut.png', w: 931, h: 592, k: 0.06279, ax: 50.49, ay: 36.98 }
// Absolute screen top-left of the sprite (UPDATE #59/#60/#62/#67). #67 value
// keeps the pile's bottom-right corner fixed while it scales.
const PACER_XY = [833.0, 481.4]
// The cable runs / spark accents were authored against the sprite's ORIGINAL
// plan pose (top-left = p(anchor) - (old ax, ay) = -10.34, -48.34). They are
// kept attached to the pinned sprite by shifting them by the delta between
// PACER_XY and that authored pose.
const PACER_CABLE_AX = 10.34
// Pacer floor two-person vignette (Stage 5.5 UPDATE #61, user): a man carrying
// an axe walks toward the decaying pacer-legacy pile, and a second man just
// behind him catches his shoulder to hold him back. Generated from two
// back-view figures facing +u (the pile's direction): generated/dev/
// make_wire_pacer_axe.py -> pacer-axe-wire.png -> NB2 Pro -> key_cut_pacer_axe.py
// (H_TARGET 36px, scale set from height since the pair is tall/narrow). Anchor
// = the rear man's back foot (bottommost pixel), placed on floor 4 to the LEFT
// of the pile, walking up-right toward it. UPDATE #62 (user): +50% (k/ax/ay
// x1.5); the anchor (rear foot) stays at PACER_AXE_ANCHOR so the location holds.
// UPDATE #67 (user): 10% smaller (k/ax/ay x0.9); anchor unchanged.
const PACER_AXE = { file: 'pacer-axe-01-cut.png', w: 736, h: 806, k: 0.06067, ax: 12.72, ay: 48.73 }
const PACER_AXE_ANCHOR = [108, 30]
// Pacer floor "team + tech lead" billboards (Stage 5.5 UPDATE #65, user): the
// user supplied HORIZONTAL MIRRORS ("reflex") of the floor-2 tech-lead and
// seated-dev sprites, to re-use on floor 4 as the Pacer team around the
// spreadsheet. Same `k` as their floor-2 originals (verified exact mirror with
// ImageChops); only the anchor x is mirrored — the bottommost foot centre flips
// side (ax_new = mirrored foot x * k), ay unchanged.
// UPDATE #66 (user): TECHLEAD2 grows +15% (k/ax/ay x1.15) and moves toward the
// building's left-front walls corner (u,v -> 0,0) until its toes clear the
// sheet's near edge (v < v0 = 110.5).
// UPDATE #67 (user): another +10% (k/ax/ay x1.10) and ~10u further in the same
// direction; also moved in the group order to BEFORE `columns()` so the A-corner
// vertical line (the edge joining the floor-4 and floor-5 corners) draws OVER it.
const TECHLEAD2 = { file: 'techlead-01-cut-2.png', w: 726, h: 1851, k: 0.02241, ax: 11.57, ay: 41.42 }
const SITDEVS2 = { file: 'sitdevs-01-cut-2.png', w: 1588, h: 943, k: 0.03538, ax: 46.97, ay: 33.25 }
// Placement on floor 4, taken from the user's red markers: the tech lead stands
// just in FRONT of the sheet's near edge, between the sheet and the axe pair;
// the seated-dev row sits just in front of the sheet's left edge, along the
// marked constant-u line (u≈68).
const TECHLEAD2_ANCHOR = [101, 93]
const SITDEVS2_ANCHOR = [68, 150]
// Pacer (floor 4) left-side dev clusters (Stage 5.5 UPDATE #68, user): TWO
// instances of the floor-3 Interactica team sprite TEAMCROSS (the cross of desks
// with eight seated devs), filling the left half of floor 4. Anchors kept at
// u >= ~58 (clear of the front-left `slabTriangle` repaint) and v >= ~230
// (behind the sheet), stacked along v.
// UPDATE #69 (user): moved ~20u toward the building's REAR wall (+v) and into
// the `floor-04` group (drawn BEFORE floor-05), so they sit BELOW the floor-5
// slab and the elevator.
// UPDATE #70 (user): another 15u further in the same direction.
// UPDATE #71 (user): the LEFT cluster (larger v) another 15u toward the rear
// wall; the other one 10u toward the building's RIGHT wall (B-D wall, u = LW).
// UPDATE #72 (user): the right cluster another 20u toward the right wall.
const PACER_TEAMCROSS = [
  [88, 285],
  [58, 435],
]
// Floor-5 toysite sprite (Stage 5.5 UPDATE #74, user): a HALF-BUILT TOY BUILDING
// with FOUR humanoid worker robots assembling it, placed in the B (front-right)
// corner of the unfinished fifth floor. User-authorized content (the floor-5
// scene). Wireframe-only pipeline: generated/dev/make_wire_toysite.py ->
// toysite-wire.png -> NB2 Pro (wireframe the only input, n=3) -> picked
// toysite-robots_2 -> key_cut_toysite.py (W_TARGET 85u -> ~61.7u tall; the
// building reads ~45u, robots ~22u). Anchor = the nearest robot's foot (the
// sprite's bottommost pixel), placed on the floor-5 tile patch at the front of
// the cluster; the building sits up-right (deeper, into the corner).
// UPDATE #75 (user): +15% (k/ax/ay x1.15) and shifted toward the elevator
// (-u / +v, screen up-left) so the right-hand robot no longer paints over the
// building's right wall.
const TOYSITE = { file: 'toysite-01-cut.png', w: 918, h: 668, k: 0.10706, ax: 36.40, ay: 71.20 }
const TOYSITE_ANCHOR = [122, 40]
// UPDATE #76 (user): pin the sprite's top-left to the exact requested screen
// point (790, 345) via a screen offset derived from the plan projection (same
// technique as the fleets / PC towers). Prior top-left was (771.93, 349.1).
const TOYSITE_OFF = [790 - 771.93, 345 - 349.1]
// Floor-5 WHIPPER sprite (Stage 5.5 UPDATE #76, user): the person with a raised
// arm holding a whip, standing to the LEFT of the Toysite crew and facing +u
// (toward the robots). Wireframe-only pipeline: generated/dev/
// make_wire_whipper.py -> whipper-wire.png -> NB2 Pro (n=3) -> picked candidate
// 2 (reads as a whip: handle up-left + a hanging lash loop) -> key_cut_whipper.py
// (H_TARGET 44u -> body ~40u). Anchor = the person's back foot (bottommost
// pixel). The long lash is continued as crisp SVG from the hand toward the crew
// (see whipperWhip()).
// UPDATE #77 (user): +15% (k/ax/ay x1.15) and moved NEARER the Toysite
// (WHIPPER_ANCHOR [34,64] -> [94,64], i.e. +u) so the crew fills the frame on
// its right; the SVG lash rebuilt as a tapered ribbon.
const WHIPPER = { file: 'whipper-01-cut.png', w: 381, h: 1029, k: 0.04942, ax: 10.26, ay: 50.70 }
const WHIPPER_ANCHOR = [94, 64]
// Floor-5 construction SAFETY RAILING sprite (Stage 5.6 §7, user revision: the
// hand-drawn SVG railing "looked horrible"). Generated from a wireframe guide
// drawn in the diorama's exact constant-u projection (generated/dev/
// make_wire_rail.py -> rail-wire.png -> nano-banana Pro -> rail-gen.png ->
// key_cut_rail.py -> src/assets/rail-01.png). The sprite's own geometry carries
// the 19.29° recede, so it is placed as a billboard: anchor = the near (front)
// post base; k maps the sprite's 1081 px width to the projected length of the
// run (906 wire px × 0.7471/8 = 84.6 units).
const RAIL = { file: 'rail-01.png', w: 1081, h: 693, k: 0.07826, ax: 80.7, ay: 53.9 }
const RAIL_ANCHOR = [0, 8]

// Floor-5 CV-TOSSER sprite (Stage 5.5 UPDATE #85, user): a person standing on
// the open fifth-floor slab midway between the elevator and the building's
// right wall, LOOKING AT THE VIEWER. One hand holds a stack of BLANK WHITE
// sheets (his CVs); the other hand is OPEN above his head — he has just flung
// his CVs up into the air (the story: spamming his CV at every opportunity).
// Wireframe-only pipeline: generated/dev/make_wire_cvtoss.py -> cvtoss-wire.png
// -> NB2 Pro (n=3) -> picked cvtoss-gen_1 (front view, blank sheets, open
// raised hand) -> key_cut_cvtoss.py (H_TARGET 50u -> body ~40u). Anchor = the
// feet (bottommost pixel). The flying/loose papers are crisp SVG
// (cvTossPapers()), NOT baked into the raster.
const CVTOSS = { file: 'cvtoss-01-cut.png', w: 288, h: 995, k: 0.05051, ax: 10.03, ay: 50.10 }
const CVTOSS_ANCHOR = [140, 210]
// Floor-5 WORRIED person (Stage 5.5 UPDATE #88, user). REVISED from #87: the
// screen is on the REAR wall, so a person looking at it faces AWAY from the
// viewer — this is now a REAR THREE-QUARTER view (his back to us, turned up-left
// toward the wall, his LEFT cheek toward the camera). Worried: a drop of sweat on
// his LEFT cheek and his RIGHT hand (image right, as seen from behind) raised
// scratching the top of his head. Wireframe-only pipeline (rear 3/4 view):
// generated/dev/make_wire_worried2.py -> worried2-wire.png -> NB2 Pro (n=3) ->
// picked worried2-gen_1 -> key_cut_worried.py (H_TARGET 45u -> body ~40u). Anchor =
// the feet. UPDATE #89 (user, red arrow): moved to HIS LEFT (down-left on screen,
// toward the viewer) — now standing in front of the screen, its right edge just
// behind his shoulder.
const WORRIED = { file: 'worried-01-cut.png', w: 283, h: 834, k: 0.05428, ax: 6.24, ay: 45.11 }
const WORRIED_ANCHOR = [51, 552]
function spritePlace(sp, uAnchor, vAnchor, hBase) {
  const [bx, by] = p(uAnchor, vAnchor, hBase).split(',').map(Number)
  return { x: round(bx - sp.ax), y: round(by - sp.ay) }
}
function assetProp(sp, uAnchor, vAnchor, hBase, off) {
  const { x, y } = spritePlace(sp, uAnchor, vAnchor, hBase)
  const [ox, oy] = off || [0, 0]
  return `<image href="${inlineAsset(sp.file)}" x="${round(Number(x) + ox)}" y="${round(Number(y) + oy)}" width="${round(sp.w * sp.k)}" height="${round(sp.h * sp.k)}" preserveAspectRatio="none" />`
}
// Soft contact shadow under a billboard sprite (user revision for the seated
// sitter: a u/v footprint quad reads as a stray streak — a billboard has no
// honest plan footprint). Screen-space ellipse sized to the sprite's base,
// locked to the sprite via spritePlace; same blurred language as the
// ground contact shadow (#141618, dw-soft).
function spriteShadow(sp, uAnchor, vAnchor, hBase, off, bulge = 1, shade = {}) {
  const { x, y } = spritePlace(sp, uAnchor, vAnchor, hBase)
  const [ox, oy] = off || [0, 0]
  const w = sp.w * sp.k
  const fill = shade.fill ?? '#141618'
  const opacity = shade.opacity ?? 0.22
  return `<ellipse cx="${round(Number(x) + w / 2 + ox)}" cy="${round(Number(y) + sp.ay - 1 + oy)}" rx="${round(w * 0.44 * bulge)}" ry="${round(3.6 * bulge)}" fill="${fill}" fill-opacity="${opacity}" filter="url(#dw-soft)" />`
}

// Floating holographic panel for the AR/VR vignette (r36 review, user): a
// white screen with illegible text lines, hanging in the air to the person's
// left and in front of him (he faces the rear C-D wall, so "in front" is +v).
// Drawn in a constant-v plane so its bottom/top edges carry the building's
// 19.29° recede (it belongs to the diorama, not a flat UI overlay). The text
// is just short strokes of varied length — deliberately unreadable.
function holoScreen(u0, u1, v, h0, h1) {
  const out = [el('dw-holo', vFace(v, u0, u1, h0, h1))]
  // title bar
  out.push(el('dw-holo-head', vFace(v, u0 + 0.6, u1 - 0.6, h1 - 3.6, h1 - 1.4)))
  // text lines (a left column of wide lines + a right column of short ones)
  const rows = 5
  for (let i = 0; i < rows; i++) {
    const h = h1 - 5.6 - i * 3.1
    if (h < h0 + 1.6) break
    const long = i % 2 === 0
    const a = u0 + 1.2
    const b = long ? u1 - 3.2 : u1 - 6.6
    out.push(el('dw-holo-line', `M ${p(a, v, h)} L ${p(b, v, h)}`))
    out.push(el('dw-holo-line', `M ${p(u1 - 3.0, v, h)} L ${p(u1 - 1.4, v, h)}`))
  }
  return out
}

// Graph screen on the rear (C-D) wall for the tech-lead vignette (r37 review,
// user): a wall-mounted dark panel showing a node diagram — rounded nodes with
// illegible text ticks, joined by arrows. Drawn in the wall's constant-v plane
// so it belongs to the architecture. NOTE the cutaway constraint: at height h
// the floor-3 slab hides a point on a v>=u wall when 302.5 <= h + 0.495u <=
// 315, so the panel is kept low/left enough that only its top-right corner is
// grazed by the ceiling cut.
function graphScreen(u0, u1, v, h0, h1) {
  const out = [el('dw-graph-frame', vFace(v, u0, u1, h0, h1))]
  out.push(el('dw-graph-face', vFace(v, u0 + 1.0, u1 - 1.0, h0 + 1.0, h1 - 1.0)))
  out.push(el('dw-graph-title', vFace(v, u0 + 1.6, u1 - 1.6, h1 - 4.2, h1 - 1.8)))
  out.push(el('dw-graph-tick', `M ${p(u0 + 2.2, v, h1 - 3.0)} L ${p(u1 - 6.4, v, h1 - 3.0)}`))
  const F = [
    [0.14, 0.66], [0.46, 0.80], [0.86, 0.62],
    [0.30, 0.28], [0.68, 0.24],
  ].map(([fx, fy]) => [
    u0 + 1.8 + fx * (u1 - u0 - 3.6),
    h0 + 2.2 + fy * (h1 - h0 - 7.6),
  ])
  const EDGES = [[0, 1], [1, 2], [0, 3], [1, 4], [3, 4]]
  for (const [a, b] of EDGES) {
    const [ua, ha] = F[a]
    const [ub, hb] = F[b]
    out.push(el('dw-graph-arrow', `M ${p(ua, v, ha)} L ${p(ub, v, hb)}`))
    const du = ub - ua
    const dh = hb - ha
    const L = Math.hypot(du, dh) || 1
    const ux = du / L
    const uh = dh / L
    const bx = ub - ux * 2.2
    const by = hb - uh * 2.2
    const px = -uh
    const py = ux
    out.push(
      el(
        'dw-graph-arrow',
        `M ${p(bx + px * 1.2, v, by + py * 1.2)} L ${p(ub, v, hb)} L ${p(bx - px * 1.2, v, by - py * 1.2)}`,
      ),
    )
  }
  for (const [u, h] of F) {
    out.push(el('dw-graph-node', vFace(v, u - 2.5, u + 2.5, h - 1.8, h + 1.8)))
    out.push(el('dw-graph-nodeline', `M ${p(u - 1.6, v, h + 0.45)} L ${p(u + 1.6, v, h + 0.45)}`))
    out.push(el('dw-graph-nodeline', `M ${p(u - 1.6, v, h - 0.65)} L ${p(u + 0.3, v, h - 0.65)}`))
  }
  return out
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
// Neat ream of processed records (Health Platforms DBA vignette): an
// A4-sized (4 x 5.6u) solid paper block with a top face and sparse sheet
// lines on the near/left faces — the "very tall ordered stack" of the DBA
// vignette. A block reads as one clean tower where a pile of flat quads at
// this scale merges into a heap. n sheets at 0.36u pitch set the height.
function paperReam(u, v, n, hBase = 0) {
  const w = 4.0
  const d = 5.6
  const u0 = u - w / 2
  const u1 = u + w / 2
  const v0 = v - d / 2
  const v1 = v + d / 2
  const h1 = hBase + n * 0.36
  const out = [
    el('dw-ream', vFace(v0, u0, u1, hBase, h1)),
    el('dw-ream-side', uFace(u0, v0, v1, hBase, h1)),
    el('dw-paper', hFace(u0, u1, v0, v1, h1)),
  ]
  for (let h = hBase + 2.2; h < h1 - 1; h += 2.2) {
    out.push(el('dw-ream-line', `M ${p(u0, v0, h)} L ${p(u1, v0, h)}`))
    out.push(el('dw-ream-line', `M ${p(u0, v0, h)} L ${p(u0, v1, h)}`))
  }
  return out
}
// Open cardboard box full of unordered papers (Health Platforms DBA
// vignette): the incoming-data pile. Four walls with the top open, sheets
// filling the box below the rim and jittered sheets overflowing over it.
// Painter order: interior (floor, inner far/right faces, fill sheets),
// outer left/near walls, rim strips, then the overflow sheets on top.
// `seed` re-rolls the deterministic sheet layout so a file of boxes does not
// read as identical clones (seed 0 keeps the original arrangement).
function paperBox(u0, u1, v0, v1, h0, h1, seed = 0) {
  const T = 2.8 // cardboard thickness (rim strips) — scales with the box
  const out = [
    // interior reads as paper (user revision): floor and inner walls share
    // the sheet colour so the open box looks full of paper at a glance
    el('dw-paper', hFace(u0, u1, v0, v1, h0)),
    el('dw-paper', vFace(v1, u0, u1, h0, h1)),
    el('dw-paper', uFace(u1, v0, v1, h0, h1)),
  ]
  // sheets filling the box below the rim (the near wall hides their fronts)
  const fill = h1 - h0 - 3
  const fw = (u1 - u0) * 0.35
  const fd = (v1 - v0) * 0.35
  for (let i = 0; i < 9; i++) {
    const jx = (hash2(i * 13 + 1, 7 + seed) - 0.5) * fw
    const jy = (hash2(i * 17 + 2, 9 + seed) - 0.5) * fd
    const rot = (hash2(i * 19 + 3, 11 + seed) - 0.5) * 0.5
    out.push(paperSheet((u0 + u1) / 2 + jx, (v0 + v1) / 2 + jy, h0 + 2 + (i * fill) / 8, 6.5, 9, rot))
  }
  out.push(el('dw-crate', uFace(u0, v0, v1, h0, h1)))
  out.push(el('dw-crate', vFace(v0, u0, u1, h0, h1)))
  out.push(el('dw-crate-top', hFace(u0, u1, v0, v0 + T, h1)))
  out.push(el('dw-crate-top', hFace(u0, u0 + T, v0 + T, v1, h1)))
  out.push(el('dw-crate-top', hFace(u0 + T, u1, v1 - T, v1, h1)))
  out.push(el('dw-crate-top', hFace(u1 - T, u1, v0 + T, v1 - T, h1)))
  // unordered sheets overflowing over the rim
  const ow = (u1 - u0) * 0.7
  const od = (v1 - v0) * 0.7
  for (let i = 0; i < 10; i++) {
    const jx = (hash2(i * 23 + 5, 13 + seed) - 0.5) * ow
    const jy = (hash2(i * 29 + 6, 17 + seed) - 0.5) * od
    const rot = (hash2(i * 31 + 7, 19 + seed) - 0.5) * 1.2
    out.push(paperSheet((u0 + u1) / 2 + jx, (v0 + v1) / 2 + jy, h1 - 2 + i * 0.95, 6.5, 9, rot))
  }
  return out
}
function wallSheet(u, h, rot) {
  return vWallSheet(LD - WALL_T - 0.4, u, h, rot)
}
// Sheet pasted on any constant-v wall face, proud toward -v by 0.4u: the rear
// C-D wall (v = LD-WALL_T-0.4), the partition front faces (BA/freelancer
// dividers) and the staircase's solid side face (v = STAIR_V0-0.4). Centered
// at in-plane width u and height h; rot rotates within the wall plane.
function vWallSheet(v, u, h, rot) {
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
// r36 review (user): drop the vertical run so its base sits fully on the
// section floor instead of hovering a few px above it. The run length grows
// by the same amount, keeping the top flush with the floor above.
const PIPE_DROP = 5
function assetPipe(u, v, hBase, hLen) {
  const [cx, by] = p(u, v, hBase).split(',').map(Number)
  const x = cx - PIPE_SPRITE.w * PIPE_SPRITE.axis
  const y = by - hLen
  return `<image href="${inlineAsset(PIPE_SPRITE.file)}" x="${round(x)}" y="${round(y)}" width="${PIPE_SPRITE.w}" height="${round(hLen)}" preserveAspectRatio="none" />`
}
// UPDATE #92 (reference): one service riser now runs the FULL building height.
// Floor 2's single pipe was already reference-inspired ("like the reference's
// pipes"); repeating it every story at the same plan position makes a bold
// yellow run that reads as continuous vertical infrastructure crossing floors
// (Stage 5.5 §7 + the primary reference's signature), instead of a one-floor
// fragment. Each segment lives inside its own floor group, so the story above
// occludes its top exactly like the floor-2 original.
const RISER_U = 227.5
const RISER_V = 60
const serviceRiser = (hBase) => assetPipe(RISER_U, RISER_V, hBase - PIPE_DROP, STORY_H + PIPE_DROP)

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

// Slab construction detail (Stage 5.6 §9): strengthens the visible slab edge
// and underside at the open (front, A-B) side without changing the slab's
// footprint. `seams` are u positions for vertical joint lines across the front
// cut band; `brackets` are u positions for a small support under that edge.
function slabDetail(hTop, { seams = [], brackets = [] } = {}) {
  const hBot = hTop - SLAB_T
  const out = [el('dw-slab-lip', `M ${p(0, 0, hBot)} L ${p(LW, 0, hBot)}`)]
  for (const u of seams) out.push(el('dw-slab-seam', `M ${p(u, 0, hTop)} L ${p(u, 0, hBot)}`))
  for (const u of brackets) out.push(...bracket('u', 0, u, hBot - 7, hBot, { dir: 1, leg: 2.4 }))
  return out
}

// Straight-segment service run (Stage 5.6 §14) through explicit [u, v, h]
// waypoints, so a conduit/pipe can climb, turn a corner and enter a wall in
// one editable path. Class defaults to the dark-steel conduit family.
function segRun(pts, cls = 'dw-conduit-line') {
  return el(cls, `M ${pts.map(([u, v, h]) => p(u, v, h)).join(' L ')}`)
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

// Stage 10 — one external link covering a whole generated group. Used so the
// entire projecting sign (photo, name, QR + mark, URL, casing, arms, background)
// is a single click target, with no nested anchors and no dead regions. The
// link opens safely in a new tab; an aria-label keeps it readable to assistive
// tech even though its graphic content is not text.
const svgLink = (href, inner, label = '') =>
  `<a href="${href}" target="_blank" rel="noopener noreferrer"${label ? ` aria-label="${label}"` : ''}>\n${inner}\n</a>`

// --- floor-ground: slab-0, story-0 walls, two partitions, props, columns ----
// Puelo Games props (Stage 5.5 §10, user batch decisions): the demo kiosk
// against the B-D wall with the SVG Space Invaders screen, the stool pair
// facing it (soft SVG contact shadow — the stools sprite carries none), and
// hand-drawn storage crates deeper along the same wall. Batches 2-3 (BA
// Technology, Freelancer) will slot between the partitions.
const pueloProps = [
  // kiosk: anchor = the cabinet's near-bottom corner; its back edge stays
  // flush with the B-D wall inner face (230.5 = 220.14 + 10.36 depth);
  // user r23 (UPDATE #15): the section shrinks 15% — the whole group shifts
  // toward the entrance by Δv = −24.7 with the partition wall
  assetProp(PUEL_KIOSK, 220.14, 11.3, 0),
  kioskScreenOverlay(spritePlace(PUEL_KIOSK, 220.14, 11.3, 0)),
  // stools in front of the screen (anchor = the pair's near leg tip)
  el('dw-contact', hFace(198, 216, 7, 43, 0)),
  assetProp(PUEL_STOOLS, 200.1, 8.3, 0),
  // crates pushed into the section's rear corner (partition at v=139.94),
  // beside the kiosk/stools deeper along the wall
  ...crate(212.5, 230.5, 121.3, 137.3, 0, 15),
  ...crate(216, 230, 123.3, 137.3, 15, 28),
  ...crate(213.5, 230.5, 106.3, 119.3, 0, 12),
]

// --- BA Technology props (Stage 5.5 §10, second batch) ----------------------
// BA Technology whiteboard (user revision of the old blackboard): white
// marker board on partition-2's front face (the wall visible behind the
// meeting table). The left-bottom corner stays fixed at the blackboard's
// (u 78, h 8); the board now rises to the passage head height (DOOR_H) and
// spans double width (u 78..142). Content: a spreadsheet grid with a header
// row and engineering-calc entries in marker ink (the Petroplastic
// spreadsheet-to-software story), legible as numbers.
function whiteboard() {
  const vW = PARTITION_G[1] - WALL_T / 2 // 396.09: partition-2 front face
  const vF = vW - 2 // board face, 2u proud of the wall
  const u0 = 78 // left-bottom corner fixed (user request)
  const u1 = 142 // double width (was 110)
  const h0 = 8 // left-bottom corner fixed (user request)
  const h1 = DOOR_H // top edge level with the passage head line
  const out = [
    el('dw-board-cap', uFace(u0, vF, vW, h0, h1)),
    el('dw-board-cap', hFace(u0, u1, vF, vW, h1)),
    el('dw-board-frame', vFace(vF, u0, u1, h0, h1)),
    // white writing surface inset within the frame
    el('dw-board-face', vFace(vF + 0.4, u0 + 2.5, u1 - 2.5, h0 + 2.5, h1 - 2.5)),
    // marker tray along the bottom frame + two pens lying on it
    el('dw-board-tray', vFace(vF - 1.1, u0 + 4, u1 - 4, h0 - 0.4, h0 + 1.2)),
    el('dw-board-tray-top', hFace(u0 + 4, u1 - 4, vF - 1.1, vF + 1.2, h0 + 1.2)),
  ]
  // pens on the tray: one blue, one black, lying along u
  out.push(el('dw-pen-blue', `M ${p(u0 + 8, vF - 0.5, h0 + 0.4)} L ${p(u0 + 13, vF - 0.5, h0 + 0.4)}`))
  out.push(el('dw-pen-black', `M ${p(u1 - 13, vF - 0.5, h0 + 0.4)} L ${p(u1 - 8, vF - 0.5, h0 + 0.4)}`))
  // spreadsheet grid (columns along u, rows along h)
  const cols = 4
  const rows = 3
  const cu0 = u0 + 6
  const du = (u1 - u0 - 12) / cols
  const ch0 = h0 + 7
  const dh = (h1 - h0 - 14) / rows
  const vC = vF + 0.3
  // light header band across the top row, then the grid over it
  out.push(el('dw-marker-head', vFace(vC, cu0, cu0 + cols * du, ch0 + (rows - 1) * dh, ch0 + rows * dh)))
  for (let j = 0; j <= cols; j++) {
    out.push(el('dw-marker', `M ${p(cu0 + j * du, vC, ch0)} L ${p(cu0 + j * du, vC, ch0 + rows * dh)}`))
  }
  for (let k = 0; k <= rows; k++) {
    out.push(el('dw-marker', `M ${p(cu0, vC, ch0 + k * dh)} L ${p(cu0 + cols * du, vC, ch0 + k * dh)}`))
  }
  // header row + visible equation/number entries, hand-jittered (deterministic)
  const entries = [
    ['A', 'B', 'C', 'D'],
    ['q=12.4', 'L=6.2', 'P=48.6', 'M=PL/4'],
    ['V=41.2', '=75.3', 'Σ=118.4', 'k=1.35'],
  ]
  for (let k = 0; k < rows; k++) {
    for (let j = 0; j < cols; j++) {
      const uc = cu0 + (j + 0.5) * du + (hash2(j * 31 + k * 7, 211) - 0.5) * 1.4
      const hc = ch0 + (rows - 1 - k + 0.5) * dh + (hash2(j * 13 + k * 5, 211) - 0.5) * 1.0
      const [tx, ty] = p(uc, vC, hc).split(',')
      out.push(
        `<text class="dw-marker-text" transform="matrix(0.7071 -0.2475 0 1 ${tx} ${ty})" text-anchor="middle">${entries[k][j]}</text>`,
      )
    }
  }
  // hand strokes: a circled result and a wavy underline (deterministic)
  const [cx, cy] = p(cu0 + 1.5 * du, vC, ch0 + 0.5 * dh).split(',')
  out.push(
    `<ellipse class="dw-marker" transform="matrix(0.7071 -0.2475 0 1 ${cx} ${cy}) rotate(-5)" cx="0" cy="0" rx="6.2" ry="4.2" />`,
  )
  const [wx1, wy1] = p(cu0 + 2 * du, vC, ch0 + 1.1).split(',').map(Number)
  const [wcx, wcy] = p(cu0 + 2.5 * du, vC, ch0 + 0.2).split(',').map(Number)
  const [wx2, wy2] = p(cu0 + 3 * du, vC, ch0 + 1.2).split(',').map(Number)
  out.push(el('dw-marker', `M ${wx1} ${wy1} Q ${wcx} ${wcy} ${wx2} ${wy2}`))
  return group('whiteboard', out)
}

// Meeting corner (user request): round table, three chairs, two people seated
// seen from behind, papers on the tabletop. User revisions: displayed at true
// scale (k 0.1185, was 0.15713 — 1.33x too large); moved to the visible
// centre of the BA section (anchor = the near chair leg, object (14, 4));
// then nudged deeper toward the B-D (right) wall (anchor u 36 → 54 → 62),
// then again toward the right wall (r24 review: 62 → 78; the partition-1
// move to v = 139.94 widened the left wedge to u < v − 139.94, so the
// sprite keeps ~12u of margin).
const baProps = [
  whiteboard(),
  assetProp(PUEL_TABLE, 78, 254, 0),
  el('dw-contact', hFace(68, 132, 246, 326, 0)),
]
// Nextcode pamphlet (user request): a big white sheet pinned on the rear
// wall's left corner just above where the staircase rises into floor 1,
// covered in unreadable hand-written lines. User revision: doubled in
// width and tripled in height (u 26..90, h 107..167) with the squiggle
// count raised to fill the larger area; the top-right corner tucks under
// the floor-02 slab cut (hidden where h + 0.495·u >= 197.5, i.e. beyond
// u ~61.6 at h = 167) — the accepted cutaway read, like the whiteboard's.
// Emitted in floor-01 AFTER backWalls(FH) so the story's rear wall does
// not cover it; the story's own banister diagonal (nearer) still paints
// over its lower stretch.
function nextcodePamphlet() {
  const v = LD - WALL_T - 0.4
  const u0 = 26
  const u1 = 90
  const h0 = 107
  const h1 = 167
  const out = [
    el('dw-paper', vFace(v, u0, u1, h0, h1)),
    // inner writing area slightly inset
    el('dw-paper', vFace(v - 0.3, u0 + 1.4, u1 - 1.4, h0 + 1.4, h1 - 1.4)),
  ]
  // hand-written squiggle lines, deterministic (one per 2.1u, same pitch
  // as the original seven, now covering the full height)
  const lines = Math.floor((h1 - h0 - 7) / 2.1)
  for (let k = 0; k < lines; k++) {
    const hL = h0 + 3.6 + k * 2.1
    const uR = u0 + 4 + hash2(k * 3, 41) * (u1 - u0 - 8)
    const [x1, y1] = p(u0 + 2.4, v - 0.3, hL).split(',').map(Number)
    const [xm, ym] = p((u0 + uR) / 2, v - 0.3, hL + (hash2(k, 43) - 0.5) * 0.7).split(',').map(Number)
    const [x2, y2] = p(uR, v - 0.3, hL + (hash2(k, 47) - 0.5) * 0.5).split(',').map(Number)
    out.push(el('dw-scribble', `M ${round(x1)} ${round(y1)} Q ${round(xm)} ${round(ym)} ${round(x2)} ${round(y2)}`))
  }
  const [px, py] = p((u0 + u1) / 2, v - 0.3, h1 - 1.3).split(',').map(Number)
  out.push(`<circle class="dw-dot" cx="${round(px)}" cy="${round(py)}" r="0.9" />`)
  return out
}
// --- Stage 5.6 ground-floor architecture (§2) ------------------------------
// The ground floor gets the strongest selective-wall treatment because several
// areas currently read as large open boxes. Each section gets a DIFFERENT
// intervention (the spec forbids duplicating one treatment everywhere).
function pueloArchitecture() {
  const out = []
  // Two wall sections forming the building's front-left (A) corner. User
  // revisions: r164 built them corner->door / corner->tag; r165 ragged cut
  // ends; r167 removed the side caps and tried no outline; r168 halves the
  // corner (both arms) and keeps a THIN line on the vertical borders.
  //  Front wall: corner -> half the distance to the entrance's left jamb.
  //  Left wall:  corner -> v = 41 (half of the earlier tag-middle length).
  const frontLen = (0.35 * LW - 10) * 0.5 // half toward the entrance
  const leftLen = 41
  out.push(...partialWall('u', 0, frontLen, 0, 0, STORY_H, { face: 'dw-wall', ends: [false, false], scrap: [false, true], scrapSeed: 3, outline: 0.5 }))
  out.push(...partialWall('v', 0, leftLen, 0, 0, STORY_H, { face: 'dw-wall', ends: [false, false], scrap: [false, true], scrapSeed: 8, outline: 0.5 }))
  // Surface marks (kept) + a reduced set of generated wall fixtures that fit
  // the smaller walls (panel + switch on the front wall, vent on the left).
  out.push(...surfaceWear('u', 0, 4, frontLen - 3, 10, 84, 3))
  out.push(...surfaceWear('v', 0, 6, leftLen - 4, 10, 84, 5))
  out.push(wallFixture('fixture-panel-01.png', 'u', -0.3, 7, 72, 15, 19))
  out.push(wallFixture('fixture-switch-01.png', 'u', -0.3, 27, 40, 6, 8.5))
  out.push(wallFixture('fixture-vent-01.png', 'v', -0.3, 33, 70, 17, 17))
  return out
}

function baArchitecture() {
  const out = []
  // BA Technology: a short low stub partition emerging from partition-1's
  // BA-side face at the OPEN LEFT corner (u ≈ 3) — clear of the door-height
  // passage (u 15–70), so the opening stays readable. Both end caps are hidden
  // (the near end butts into partition-1; the far end must not read as an open
  // cut from outside — user r164 mark 3). Thin border line (user r168).
  const vFace0 = PARTITION_G[0] + WALL_T / 2
  out.push(...partialWall('v', vFace0, vFace0 + 40, 3, 0, 54, { face: 'dw-partition', ends: [false, false], scrap: [false, true], scrapSeed: 12, outline: 0.5 }))
  out.push(...surfaceWear('v', 3, vFace0 + 5, vFace0 + 36, 8, 48, 7))
  return out
}

const floorGround = group('floor-ground', [
  ...slab(0),
  // Ground slab construction (Stage 5.6 §9): the most "finished/established"
  // surface — a clean lip and two quiet joints, no exposed supports.
  ...slabDetail(0, { seams: [35, 205] }),
  ...backWalls(0),
  // Stage 5.6 §3/§4 C-D wall wear (user r195 revision): the floor-1 and
  // floor-2 wall marks sit on the ground-level C-D wall behind the
  // staircase/Freelancer area, so they must render UNDER the Freelancer wall
  // papers and UNDER the staircase and the floor-1 layer — hence emitted here
  // at the top of `floor-ground`, not in `floor-01`/`floor-02`.
  ...surfaceWear('u', LD - WALL_T - 0.3, 0, 88, 6, 84, 27),
  ...surfaceWear('u', LD - WALL_T - 0.3, 44, 84, 6, 84, 33),
  serviceRiser(0),
  // Paper piles hugging partition-2's base on the freelancer side (user
  // screenshot 1 + 2, "correct layer"): emitted BEFORE the wall so the
  // wall's face paints over their far halves — they read as tucked under
  // the divider instead of pasted on it.
  ...paperStack(4, 408, 2),
  ...paperStack(16, 416, 2),
  // Freelancer piles seen THROUGH partition-2's passage (user revision):
  // the former BA-side stacks by the doorway were moved deep into the
  // freelancer section so the opening reveals them near the head line
  // (h = 52.5). Placement rule derived from the projection: a floor point
  // (u, v) behind the wall shows through the notch iff its sight ray
  // crosses the wall plane (v0 = 396.09) within u' = u - v + 396.09 in
  // [15, 70] and h' = 0.495 (v - 396.09) in [0, 52.5]. The chosen trio
  // keeps every sheet's near corner ~2-7u under the head and clear of the
  // PC sprite's screen bbox and the far jamb's sliver.
  ...paperStack(112, 484, 2),
  ...paperStack(134, 489, 2),
  ...paperStack(148, 492, 1),
  // Deep freelancer stacks that were painting over partition-2's cut-end
  // edge (user Image 2 circles): emitted here too, so the wall's end face
  // clips their far tips under the rough filter instead of the reverse.
  ...paperStack(80, 495, 3),
  ...paperStack(74, 482, 2),
  // (50,460) measured the same overhang (far tip x 466.8 > the wall's
  // cut-end edge at 464.6) — same treatment.
  ...paperStack(50, 460, 4),
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
  // more rear-wall sheets (user red pins, upper-left stretch)
  wallSheet(5, 40, 0.15),
  wallSheet(21, 55, -0.08),
  wallSheet(19, 86, 0.08),
  wallSheet(7, 78, 0.1),
  wallSheet(13, 90, -0.08),
  // (Stage 5.6 §2 Freelancer wall element removed on user review r164 — the
  // SVG box/conduit read badly; a generated sprite may replace it later.)
  // BA-side paper piles near the passage were moved into the freelancer
  // section (floor-ground, before partition-2) so the doorway reveals them.
  ...baProps,
  // BA php decal, emitted BEFORE the BA wall/partition geometry so the
  // left-side wall parts occlude its far edge (user revision: "php in a layer
  // below the building's left wall part in that section"). Read along the depth
  // axis (floor-plane matrix rotated 90°) like the BA mysql plate.
  ...logoPlate(TECH_LOGOS.php, ...p(26, 235, 0).split(',').map(Number), '0.7071 0.2475 -0.7071 0.2475', 45),
  ...baArchitecture(),
  ...partition(PARTITION_G[0], 0, { opening: true }),
  ...pueloProps,
  ...pueloArchitecture(),
  ...columns(0, STORY_H),
])

// --- freelancer-props: floor PC + paper mess (Stage 5.5 §10, user request) --
// The PC stands on the floor beside the staircase, keyboard and monitor
// facing the entrance side (user hand-edited art). User revision: the PC
// sits toward the END of the flight's run (anchor u 82; the flight runs
// u 22..127). Emitted as its own fragment AFTER the staircase so the PC
// correctly paints over the stair's lower steps it stands in front of. The
// paper sheets in front of the stair (v < STAIR_V0) join it here; sheets
// behind the stair are emitted in floor-ground so the stair occludes them.
const freelancerProps = group('freelancer-props', [
  el('dw-contact', hFace(80, 102, 512, 543, 0)),
  assetProp(FREELANCER_PC, 82, 514.5, 0),
  ...paperStack(12, 430, 3),
  ...paperStack(30, 445, 1),
  ...paperStack(18, 470, 1),
  ...paperStack(65, 480, 2),
  ...paperStack(35, 495, 1),
  // (80,495 / 74,482 moved into floor-ground BEFORE partition-2: their far
  // tips were painting over the wall's cut-end edge — user Image 2 circles.)
  // (95,510 / 110,525 / 100,535 / 125,535 dropped: at the PC's end-of-run
  // position their sheets entered the PC sprite's screen bbox; the stacks
  // below were re-audited and verified clear of it)
  ...paperStack(55, 490, 1),
  ...paperStack(10, 528, 1),
  ...paperStack(20, 513, 3),
  // more floor sheets (user red pins): the wedge between the flight's base
  // and the PC; (4,410) moved into floor-ground as (4,408) so partition-2
  // paints over its far half (correct layer, user screenshot 1)
  ...paperStack(6, 420, 1),
  ...paperStack(6, 500, 2),
  ...paperStack(16, 540, 2),
  ...paperStack(46, 522, 2),
  ...paperStack(60, 530, 2),
  ...paperStack(68, 508, 2),
  // sheets dropped on the stair treads, rising with the flight (user pins)
  paperSheet(35, 562, 17.5 + 0.4, 6, 8.5, 0.3),
  paperSheet(48, 570, 26.25 + 0.4, 6, 8.5, -0.2),
  paperSheet(53, 566, 35 + 0.4, 6, 8.5, 0.15),
  paperSheet(61, 566, 43.75 + 0.4, 6, 8.5, 0.25),
  paperSheet(78, 568, 61.25 + 0.4, 6, 8.5, -0.2),
  paperSheet(96, 570, 78.75 + 0.4, 6, 8.5, 0.3),
  paperSheet(108, 568, 87.5 + 0.4, 6, 8.5, -0.2),
  paperSheet(113, 570, 96.25 + 0.4, 6, 8.5, -0.25),
  // sheets pasted on the flight's solid side face (v = STAIR_V0), kept below
  // the 1:1 profile top (h + 4.5 <= u - STAIR_U0 - 2)
  vWallSheet(STAIR_V0 - 0.4, 65, 24, 0.1),
  vWallSheet(STAIR_V0 - 0.4, 95, 42, -0.12),
])

// --- floor-01: slab-1 with stair opening, story-1 walls, shaft return walls -
const floor01 = group('floor-01', [
  ...slab(FH, { stairOpening: true }),
  // Stage 5.6 §9 — first-floor slab: a clear edge lip, one joint and supports
  // under the open front edge (clear of the entrance portal at u 83..155).
  ...slabDetail(FH, { seams: [96], brackets: [50, 210] }),
  ...backWalls(FH),
  // (The C-D wall wear that used to live here is now emitted in `floor-ground`,
  // before the Freelancer wall papers and the staircase — user r195 revision.)
  // Nextcode pamphlet (user request): a big white sheet pinned on the rear
  // wall's left corner just above where the staircase rises into floor 1
  // (u 26..58, h 107..127), covered in unreadable hand-written lines. Drawn
  // right after this story's rear wall so the wall covers it (the
  // floor-ground copy was hidden under backWalls(FH)); the story's own
  // banister diagonal (nearer) still paints over its lower stretch.
  ...nextcodePamphlet(),
  // Electrical panel on the Health Platforms stretch (data-operations
  // floor — a service panel is the believable piece here), with a conduit
  // drop feeding it from the fifth-floor slab line (Stage 5.5 §7/§8).
  ...boxOnUWall(222, 230.5, 168, 192, FH + 34, FH + 60),
  el('dw-conduit', uFace(227.5, 178.5, 181.5, FH, FH + 34)),
  dot(222, 173, FH + 47),
  dot(222, 187, FH + 47),
  // --- Health Platforms DBA vignette (user request, Stage 5.5 §10) ---------
  // The data-operations metaphor: an open box of unordered incoming records,
  // the DBA sitting on the floor parsing/comparing them (centre, facing the
  // B-D wall) and four tall ordered reams of processed data in a line toward
  // the front wall (toward the server racks that hold the database).
  // Latest (user r23, UPDATE #15): the whole group moves in FRONT of the
  // sitter — the three boxes (file along the depth axis, touching) into the
  // red-marked floor area below him, the reams into a straight line at u 195
  // toward v = 0 (nearest ream v 109 kept). r24 review: the boxes shift
  // toward the LEFT wall so the seated DBA is never painted over them.
  // r25 review: that move was too much — revert 50% (u 28..58 → 64..94, i.e.
  // half of the original −72u step), then nudge a little back toward him
  // (u 64..94 → 72..102, "a little more near the seated dev"); and put the
  // boxes in the layer ABOVE the sitter. At u 72..102 the front/middle box
  // tops (x up to 809) start at y ≥ 833, below the sitter's sprite canvas
  // (x 782.3..810.6 / y 784.7..820.3), so they still do not cover him — the
  // upper layer keeps the near rows painting over him correctly if the
  // geometry ever grazes. All well inside the floor-2 slab envelope
  // (h + 0.495·min(u,v) ≤ 197.5) and clear of the electrical panel + conduit
  // drop (v 168..192, high on the B-D wall) and of the entrance portal
  // (u 83..155 on the front face). Emitted: reams, sitter, then boxes
  // (upper layer, v 80..110 / 50..80 / 20..50 far-to-near), then the racks
  // (v 20..94).
  el('dw-contact', hFace(78, 112, 18, 112, FH)),
  el('dw-contact', hFace(190, 231, 68, 114, FH)),
  spriteShadow(SITTER, 160, 82, FH),
  ...paperReam(195, 109, 30, FH),
  ...paperReam(195, 97, 30, FH),
  ...paperReam(195, 85, 30, FH),
  ...paperReam(195, 73, 30, FH),
  assetProp(SITTER, 160, 82, FH),
  // Open paper boxes in the layer ABOVE the sitter (r25 review: "if the open
  // boxes end under the seated DBA layer, move them to a upper layer") — the
  // three rows sit in front of / at the sitter's depth (v 20..110 vs his
  // v = 82), so nearer-paints-later is also the geometrically correct order.
  // r25 review part 2: nudged again toward him (u 72..102 → 80..110).
  ...paperBox(80, 110, 80, 110, FH, FH + 16, 2),
  ...paperBox(80, 110, 50, 80, FH, FH + 16, 1),
  ...paperBox(80, 110, 20, 50, FH, FH + 16),
  // Server rack group (Stage 5.5 §10, user revision): two tall cabinets and
  // one short one on the Health Platforms stretch, standing on the B-D
  // wall's near stretch where the sight line keeps them fully visible.
  // Emitted in inverse order (far first, near last) so nearer cabinets
  // correctly paint over the ones behind them; the short cabinet stands at
  // the near end so the row rises toward the back.
  ...serverRack(230.5, 72, 94, FH, FH + 66),
  ...serverRack(230.5, 46, 68, FH, FH + 62),
  ...serverRack(230.5, 20, 42, FH, FH + 38),
  // Nextcode section props (desk + crates) and the dev staffage now live in
  // the later `nextcode-props` fragment so the floor tech-logo decals
  // (information-01) render UNDER them (user revision).
  // Stair banister, upper element (user revision): the diagonal's floor-1
  // stretch plus its landing return, drawn after the story walls (the stair
  // opening shows it) but BEFORE the columns — column C, nearer to the
  // viewer, must occlude the rail's top return.
  el(
    'dw-rail',
    `M ${p(RAIL_MID_U, LD - WALL_T, FH)} L ${p(STAIR_U1, LD - WALL_T, FH + RAIL_H)} L ${p(STAIR_U1 + 12, LD - WALL_T, FH + RAIL_H)}`,
  ),
  ...shaftReturnWalls(FH),
  // Stage 5.6 §3 — first-floor wall-mounted technical elements (generated
  // fixture sprites), each on an actual wall surface inside the visible
  // envelope: a vent grille on the B-D wall's front stretch (clear of the
  // server racks, v 20..94) and a compact panel on the C-D wall's left stretch
  // (Nextcode). Emitted after the return walls so they sit on their faces,
  // before the columns. (The W2 return-wall junction box was removed on user
  // review r171 — it read badly against the elevator.)
  wallFixture('fixture-vent-01.png', 'v', LW - WALL_T - 0.3, 16, FH + 58, 14, 14),
  wallFixture('fixture-panel-01.png', 'u', LD - WALL_T - 0.3, 6, FH + 50, 12, 15),
  // Stage 5.6 — partial wall section on floor 1 (user r173 mark 2): the left
  // edge on the Health Platforms side of the elevator, full story. No side
  // caps (no internal borders shown), matching the Puelo treatment (r176).
  ...partialWall('v', 20, 150, 0, FH, FH + STORY_H, { face: 'dw-wall', ends: [false, false], scrap: [true, true], scrapSeed: 42, outline: 0.5 }),
  ...columns(FH, FH + STORY_H),
])

// --- floors 02-04: full slab + story walls below the elevator, story
// columns over it (user revision: each shaft-crossing floor renders as one
// complete plane below the shaft, like floor-01 — no slab part may paint
// over the elevator) ----------------------------------------------
const floor02 = group('floor-02', [
  ...slab(2 * FH),
  // Stage 5.6 §9 — second-floor slab: subtle structural joints (no exposed
  // supports, so it differs from the floors above and below).
  ...slabDetail(2 * FH, { seams: [60, 170] }),
  ...backWalls(2 * FH),
  // (The C-D wall wear that used to live here is now emitted in `floor-ground`,
  // beneath the floor-1 layer and the Freelancer wall papers — r195 revision.)
  // Stage 5.6 §4/§10 — Left Interactica wall wear at the CORRECT story height
  // (the mis-placed ground-level copy moved to `floor-ground`), on the C-D
  // wall's left stretch near the service core (shaft at u 0..48), clear of the
  // lamp (u 50+) and the graph screen (u 90+).
  ...surfaceWear('u', LD - WALL_T - 0.3, 0, 42, 2 * FH + 6, 2 * FH + 70, 34),
  // Stage 5.6 §4 — Left Interactica: a visible panel joint and one localized
  // light on the C-D rear wall's left stretch (clear of the graph screen at
  // u 90..134, and of the floor-2 rear-left partial wall).
  seamLine(46, LD - WALL_T - 0.2, 2 * FH + 6, 2 * FH + 78),
  wallFixture('fixture-lamp-01.png', 'u', LD - WALL_T - 0.3, 50, 2 * FH + 64, 10, 13),
  // Tech-lead vignette (r37 review, user): a group of five seated developers
  // with laptops (backs to the viewer, facing the rear C-D wall) and a standing
  // tech lead pointing at a graph screen mounted on that wall. Drawn right
  // after the rear wall so the screen sits on it and the figures stand in
  // front of it. Kept low/left on the wall so the floor-3 slab's ceiling cut
  // only grazes the screen's top-right corner (see graphScreen).
  // r38 review (user): the seated group was too near the rear wall — moved
  // along the arrow (a pure -v screen move) v 559 -> 531 (row now v ~524..544,
  // ~36u clear of the wall face); the tech lead was moved right to sit centred
  // under the graph screen (+26u, -8v): (72,572) -> (98,564).
  ...graphScreen(90, 134, LD - WALL_T - 1.5, 2 * FH + 14, 2 * FH + 40),
  spriteShadow(SITDEVS, 91, 531, 2 * FH),
  assetProp(SITDEVS, 91, 531, 2 * FH),
  spriteShadow(TECHLEAD, 98, 564, 2 * FH),
  assetProp(TECHLEAD, 98, 564, 2 * FH),
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
  // r36 review (user): the base hovered ~3 screen px above the floor line.
  // Lower the anchor by PIPE_DROP and lengthen the run by the same amount so
  // the top stays flush under the floor-3 slab while the base now contacts
  // (slightly beds into) the section floor.
  assetPipe(227.5, 60, 2 * FH - PIPE_DROP, STORY_H + PIPE_DROP),
  // The dev workstations on the Interactica story (Stage 5.5 §10): the
  // wireframe-matched generated sprites (WS_C monitor desk, WS_D notebook
  // desk side by side), pulled off the wall face so the pipe run passes
  // behind them; drawn after the pipes. Paint order far-to-near (r24 review:
  // WS_D sits deeper at v = 82, WS_C nearer at v = 26, so WS_D must be
  // emitted first — previously they were swapped and the nearer desk was
  // painted under the farther one). r25 review: pulled further off the B-D
  // wall (uBack 221.5 → 213.5).
  assetWorkstation(WS_D, 213.5, 82, 2 * FH),
  assetWorkstation(WS_C, 213.5, 26, 2 * FH),
  // (Stage 5.6 §4 Right Interactica additions — junction box, conduit run and
  // slab bracket — removed on user review r173: all read badly.)
  // AR/VR vignette (r36 review, user): the person stands behind the shaft
  // (v 403) so his projection is screen-left of the elevator — the spot the
  // user circled. Drawn first (farther than the city board), then his
  // floating holographic panel (in front of him, +v, and screen-left); the
  // r36 follow-up moved the person down-right, and the panel follows so it
  // stays attached to the sprite. Both live in floor-02 (below the elevator
  // layer), which is correct: the person is physically behind the shaft, so
  // the shaft may occlude him if the silhouette ever overlaps.
  // r37 review (user): slid the whole vignette (person + panel) toward the
  // building's left wall (u = 0) so it hugs the open border (now u 24; the
  // u=0 floor edge at v403 is SVG x ~465, the sprite's left edge ~471).
  // r38 review (user): nudged toward the elevator along the arrow = -40v
  // (a pure -v screen move, down-right), so v 403 -> 363.
  // r39 review (user): the holographic panel must sit in a layer BELOW the
  // person's sprite, so it is emitted first — where the two overlap, the
  // person's sprite paints over the screen.
  ...holoScreen(4, 26, 376, 2 * FH + 12, 2 * FH + 34),
  spriteShadow(ARVR_PERSON, 24, 363, 2 * FH),
  assetProp(ARVR_PERSON, 24, 363, 2 * FH),
  // Single seated dev on the right Interactica half (UPDATE #68, user): placed
  // just WEST of the city board at the user's red mark. UPDATE #69 (user): moved
  // to a layer ABOVE the board (emitted AFTER it).
  // City-model board (r36 review, user): flat on the floor in the middle of
  // the left Interactica half, inside the user's red mark (screen centre
  // ≈ SVG (720, 693) -> floor point (u 144, v 188)). Its anchor is the
  // board's near corner at (u 123, v 167); the board is 42u square. No screen
  // overlap with the desks (u >= 196), the data server (v 220) or the cable
  // run (u 60..81), so the floor-02 layer is enough. Emitted before the cables
  // (farther than the near-left run) — depth order stays far-to-near.
  spriteShadow(CITY_BOARD, 123, 167, 2 * FH),
  assetProp(CITY_BOARD, 123, 167, 2 * FH),
  spriteShadow(SITDEV, SITDEV_ANCHOR[0], SITDEV_ANCHOR[1], 2 * FH),
  assetProp(SITDEV, SITDEV_ANCHOR[0], SITDEV_ANCHOR[1], 2 * FH),
  // Data cables from the Cleverlit kiosk's mini PC (r25 review): drawn ON the
  // floor — after the slab surface — and in a layer BELOW the kiosk sprite
  // (the kiosk lives in the later 'floor-02-front' fragment), so the run
  // emerges from under its mini PC box. Route: along the left side across the
  // section to the small data server beside the elevator.
  ...kioskCables(2 * FH + 0.4),
  // Small data server (r25 review part 2): the floor-1 rack idiom mirrored to
  // look toward the building's FRONT wall, standing on the floor just right
  // of the elevator shaft's front corner ("side to the elevator", its back
  // near W1's near edge at v 229.9). Emitted after the cables so the run ends
  // right in it. MUST stay in this fragment (below the elevator layer) so the
  // shaft's faces can occlude it if they ever overlap.
  ...serverRackFront(52, 68, 220, 2 * FH, 2 * FH + 38),
  // Stage 5.6 — partial wall sections on floor 2 (user r180): the rear-left
  // wall (with the vent on its outer face) AND the front-right corner wall.
  ...partialWall('v', 540, 580, 0, 2 * FH, 2 * FH + STORY_H, { face: 'dw-wall', ends: [false, false], scrap: [true, false], scrapSeed: 41, outline: 0.5 }),
  wallFixture('fixture-vent-01.png', 'v', -0.3, 570, 2 * FH + 52, 14, 14),
  ...partialWall('u', 216, 238, 0, 2 * FH, 2 * FH + STORY_H, { face: 'dw-wall', ends: [false, false], scrap: [true, false], scrapSeed: 43, outline: 0.5 }),
])
// The floor repaint over the elevator (slabTriangle) is its OWN base layer so
// the f2-right information plates can render ABOVE it (still visible) while
// sitting BELOW the kiosk sprite and the corner columns — the user's r219
// revision (both nestjs and angular must go under the floor-2/3 corner line
// and under the kiosk). Assembled before `information-02-front`.
const floor02FrontBase = group('floor-02-front-base', [
  ...slabTriangle(2 * FH),
])
const floor02Front = group('floor-02-front', [
  // Cleverlit stand kiosk (r25 review): the congress info point in the
  // FRONT-LEFT corner area — the corner formed by the building's left wall
  // (u = 0) and front wall (v = 0) — but not 100% in the corner: aligned in u
  // with the data server's column (server u 52..68, kiosk u ≈ 50..71) and set
  // off the front edge with a little breathing room (object origin (50, 15),
  // anchor = the mirrored person's foot at (65, 11.5) → ~11u of clear floor
  // between the kiosk and the front edge). Emitted here (above the cables and
  // the f2-right info plates) so it paints over the cable start.
  assetProp(STANDKIOSK, 65, 11.5, 2 * FH),
  ...columns(2 * FH, 2 * FH + STORY_H),
])

// The separation face is clipped to the rear wall's inner face (see
// floor-03).
const SEP_CLIP = ' clip-path="url(#dw-clip-sep3)"'

// --- Interactica wall boards (r58/r60 review, user) -------------------------
// Printed app screenshots taped flat on the building's RIGHT (B-D) wall just
// left of the B corner (where the right wall meets the absent front wall),
// side by side along the wall, annotated with a marker like a review printout.
//
// Everything is authored in each board's own 2D space — x: 0..W left to right
// AS SEEN by the viewer, y: 0..H top edge down — and placed with ONE matrix on
// the wall plane u = LW - WALL_T. The local axes (+x -> -v, +y -> screen down)
// are exactly the wall's iso skew, so plain rects, ellipses and text land on
// the wall (verticals stay vertical, horizontals ride the wall) and stay fully
// editable; the local rect (0,0,W,H) is identical to
// uFace(u, vLeft, vRight, hBot, hTop).
//
// Sheet height is capped by the floor-4 slab, whose front edge crosses this
// wall along h = `ceiling - slope * vLeft` (empirically the slab's TOP surface
// edge is what cuts): solving that against the sheet's aspect gives the
// tallest paper that still stands fully in front of the slab.
const WALL_BOARD = {
  margin: 7, // white padding all round the screenshot (annotation space)
  marginBottom: 10, // deeper foot margin for the hand notes
  hBot: 318, // sheet bottom, just above the story slab (315)
  ceiling: 420.16, // hTop <= ceiling - slope * vLeft
  slope: 0.4957,
  safe: 3, // keep the sheet clear of the slab silhouette
}
function wallAppBoard({ file, srcW, srcH, vRight, marks, size }) {
  const { margin: m, marginBottom: mB, hBot, ceiling, slope, safe } = WALL_BOARD
  const ratio = srcW / srcH
  let W
  let H
  if (size) {
    // Fixed paper size (UPDATE #37, user): sheet B is forced to sheet A's exact
    // paper size so the two printouts read as a matched pair. The floor-4 slab
    // then lops the top-left corner off the sheet (accepted on review); the
    // screenshot is letterboxed inside the paper, never stretched.
    W = size.W
    H = size.H
  } else {
    const hShot = Math.floor(
      (ceiling - slope * (vRight + 2 * m) - hBot - m - mB - safe) / (1 + slope * ratio),
    )
    W = 2 * m + ratio * hShot
    H = m + hShot + mB
  }
  // Largest screenshot that fits the paper's inner area at its own aspect,
  // centred (letterboxed), so no image is ever distorted.
  const inner = { w: W - 2 * m, h: H - m - mB }
  const wShot = inner.w / inner.h > ratio ? ratio * inner.h : inner.w
  const hShot = wShot / ratio
  const shot = {
    x0: m + (inner.w - wShot) / 2,
    y0: m + (inner.h - hShot) / 2,
    w: wShot,
    h: hShot,
  }
  const vLeft = vRight + W
  const hTop = hBot + H
  const [ox, oy] = p(LW - WALL_T, vLeft, hTop).split(',').map(Number)
  // Marks address the screenshot by FRACTION of its own size, so they stay
  // pinned to real UI elements whatever resolution the asset is saved at.
  const sx = (fx) => shot.x0 + fx * shot.w
  const sy = (fy) => shot.y0 + fy * shot.h
  // `k` scales the fixed-size bits of a mark (stroke offsets, ticks, arrow
  // heads) so the same handwriting reads the same on a smaller sheet.
  const k = shot.w / 33
  return [
    `<g transform="matrix(0.7071 0.2475 0 1 ${ox} ${oy})">`,
    `  <rect class="dw-note-shadow" x="1.7" y="2.3" width="${round(W)}" height="${round(H)}" />`,
    `  <rect class="dw-note-paper" x="0" y="0" width="${round(W)}" height="${round(H)}" />`,
    `  <image href="${inlineAsset(file)}" x="${round(shot.x0)}" y="${round(shot.y0)}" width="${round(shot.w)}" height="${round(shot.h)}" preserveAspectRatio="xMidYMid meet" />`,
    `  <rect class="dw-note-edge" x="${shot.x0}" y="${shot.y0}" width="${round(shot.w)}" height="${shot.h}" />`,
    `  <rect class="dw-note-tape" x="-3.4" y="4.2" width="7.8" height="3.6" transform="rotate(-7 -3.4 4.2)" />`,
    `  <rect class="dw-note-tape" x="${round(W - 4.4)}" y="${round(H - 4.6)}" width="7.8" height="3.6" transform="rotate(6 ${round(W - 4.4)} ${round(H - 4.6)})" />`,
    ...marks({ sx, sy, shot, W, H, k }).map((l) => `  ${l}`),
    `</g>`,
  ]
}

// Sheet A — HUB LIVE attendee app menu (375x635, the user's own asset).
const HUB_LIVE_BOARD = {
  file: '00-hub-menu.png',
  srcW: 375,
  srcH: 635,
  vRight: 5,
  marks: ({ sx, sy, shot }) => {
    const mid = sx(0.508)
    const row = (f0, f1) => (sy(f0) + sy(f1)) / 2
    const halfW = (sx(0.952) - sx(0.048)) / 2
    const rowH = (sy(0.921) - sy(0.795)) / 2 + 0.6
    const noteY = shot.y0 + shot.h
    return [
      // Red felt-tip: circle the Scavenger Hunt row (the one to build first)
      // and run an arrow down the right margin into it.
      `<ellipse class="dw-note-ink" cx="${round(mid)}" cy="${round(row(0.795, 0.921))}" rx="${round(halfW + 2.4)}" ry="${round(rowH)}" />`,
      `<path class="dw-note-ink" d="M ${round(sx(0.952) + 3)} ${round(row(0.449, 0.63) - 2)} Q ${round(sx(0.952) + 9)} ${round(row(0.63, 0.795))} ${round(sx(0.952) + 2)} ${round(row(0.795, 0.921) - 4)}" />`,
      `<path class="dw-note-ink" d="M ${round(sx(0.952) + 2)} ${round(row(0.795, 0.921) - 4)} l 3.4 -3.2 M ${round(sx(0.952) + 2)} ${round(row(0.795, 0.921) - 4)} l 3 2.9" />`,
      // Blue felt-tip: E-Literature is crossed out (out of v1 scope).
      `<path class="dw-note-ink2" d="M ${round(mid - 3)} ${round(sy(0.46))} l 6 ${round(sy(0.564) - sy(0.46))} M ${round(mid + 3)} ${round(sy(0.46))} l -6 ${round(sy(0.564) - sy(0.46))}" />`,
      // Red tick beside Schedule a Meeting.
      `<path class="dw-note-ink" d="M ${round(sx(0.952) + 2.2)} ${round(row(0.63, 0.756)) - 1} l 1.4 2 l 3 -4.2" />`,
      // Circle the score band, cross the top-right corner doodle.
      `<ellipse class="dw-note-ink" cx="${round(mid)}" cy="${round(row(0.047, 0.098))}" rx="${round(halfW - 0.5)}" ry="${round(rowH * 0.5)}" />`,
      `<path class="dw-note-ink" d="M ${round(sx(0.987))} ${round(sy(0.006))} l 2.6 2.8 M ${round(sx(0.987) + 2.6)} ${round(sy(0.006))} l -2.6 2.8" />`,
      // Illegible hand notes in the bottom margin (1.9px script = scribble at
      // diorama scale) over a wavy underline.
      `<text class="dw-note-text" x="${round(shot.x0)}" y="${round(noteY + 4.2)}">ask about badge printing</text>`,
      `<path class="dw-note-ink" d="M ${round(shot.x0)} ${round(noteY + 5.4)} q 4.2 -1.3 8.4 0 q 4.2 1.3 8.4 0 q 4.2 -1.3 8.4 0 q 4.2 1.3 8.4 0" />`,
      `<text class="dw-note-text" x="${round(shot.x0)}" y="${round(noteY + 8.2)}">wifi + screen for demo</text>`,
      `<path class="dw-note-ink" d="M ${round(sx(0.995))} ${round(row(0.795, 0.921) + rowH + 3)} q 2.6 2.2 0 4.4 q -2.6 2.2 0 4.4" />`,
    ]
  },
}

// Sheet B — the IMC rewards/news app home screen (428x926, the user's own
// asset), taped to the LEFT of sheet A. Marks address the same landmarks as
// sheet A does (the greeting, the middle quick-action card, the news feed,
// the sponsored banner) but the fixed bits are scaled by `k` because this
// sheet is shorter.
const IMC_HOME_BOARD = {
  file: '02-imc-home.png',
  srcW: 428,
  srcH: 926,
  vRight: 56,
  // UPDATE #37 (user): forced to sheet A's exact paper size (HUB_LIVE_BOARD's
  // auto-solved 47.07 x 73) so the two mockups match; the portrait screenshot
  // is letterboxed inside the same paper.
  size: { W: 47.07, H: 73 },
  marks: ({ sx, sy, shot, k }) => {
    const noteY = shot.y0 + shot.h
    const tick = () => `l ${round(1.4 * k)} ${round(2 * k)} l ${round(3 * k)} ${round(-4.2 * k)}`
    return [
      // Red felt-tip: ring the Cargar Compra card — the receipt-upload flow, the
      // one to build first — and run an arrow down the right margin into it.
      `<ellipse class="dw-note-ink" cx="${round(sx(0.499))}" cy="${round(sy(0.188))}" rx="${round(sx(0.155))}" ry="${round(sy(0.05))}" />`,
      `<path class="dw-note-ink" d="M ${round(sx(1.04))} ${round(sy(0.16))} Q ${round(sx(1.12))} ${round(sy(0.30))} ${round(sx(1.02))} ${round(sy(0.40))}" />`,
      `<path class="dw-note-ink" d="M ${round(sx(1.02))} ${round(sy(0.40))} l ${round(2.2 * k)} ${round(-2.6 * k)} M ${round(sx(1.02))} ${round(sy(0.40))} l ${round(2.6 * k)} ${round(2.2 * k)}" />`,
      // Blue felt-tip: the second news story is placeholder copy (crossed out).
      // NOTE: arithmetic must happen INSIDE round(): round() returns a STRING,
      // so `round(a) + round(b)` would concatenate digits (this produced the
      // malformed `M 19.913.14 …` path fixed in UPDATE #91).
      `<path class="dw-note-ink2" d="M ${round(sx(0.36))} ${round(sy(0.58))} l ${round(4 * k)} ${round(sy(0.68) - sy(0.58))} M ${round(sx(0.36) + 4 * k)} ${round(sy(0.58))} l ${round(-4 * k)} ${round(sy(0.68) - sy(0.58))}" />`,
      // Red tick beside Catálogo de Premios, ring the user name + points line
      // (they have to come from the API, not be hard-coded).
      `<path class="dw-note-ink" d="M ${round(sx(0.96))} ${round(sy(0.19))} ${tick()}" />`,
      `<ellipse class="dw-note-ink" cx="${round(sx(0.32))}" cy="${round(sy(0.1))}" rx="${round(sx(0.29))}" ry="${round(sy(0.03))}" />`,
      // Illegible hand notes in the bottom margin over a wavy underline.
      `<text class="dw-note-text" x="${round(shot.x0)}" y="${round(noteY + 4.2)}">nombre y puntos desde la API</text>`,
      `<path class="dw-note-ink" d="M ${round(shot.x0)} ${round(noteY + 5.4)} q ${round(3 * k)} ${round(-1.2 * k)} ${round(6 * k)} 0 q ${round(3 * k)} ${round(1.2 * k)} ${round(6 * k)} 0 q ${round(3 * k)} ${round(-1.2 * k)} ${round(6 * k)} 0" />`,
      `<text class="dw-note-text" x="${round(shot.x0)}" y="${round(noteY + 8.2)}">banner patrocinado: revisar</text>`,
    ]
  },
}

// --- Indelve rear-wall branding (UPDATE #37, user) --------------------------
// The section's logo and a promo screen, both mounted on the C-D rear wall at
// the LEFT end of the story (left of the floor-1 Nextcode pamphlet below and
// of the floor-2 graph screen). Sizes follow the user's references: the logo
// is a little smaller than the Nextcode pamphlet (64u wide) and the screen is
// ~15% bigger than the floor-2 graph screen (44x26). Both are drawn on the
// wall plane with ONE matrix (like the wall boards) so they stay editable and
// lie flat on the wall. Emitted last in floor-03 so they paint over the cream
// section-divider fill; the floor-4 slab clips the screen's top-right (user
// accepted partial hiding).
// hTop is the LOCAL story height; p() needs the global height. `hBase` defaults
// to the floor-3 story (3 * FH) so the Indelve branding calls are unchanged;
// the floor-4 chat screen overrides it (UPDATE #73).
function cdWallSheet(u0, hTop, children, hBase = 3 * FH) {
  const [ox, oy] = p(u0, LD - WALL_T - 0.4, hBase + hTop).split(',').map(Number)
  return [
    `<g transform="matrix(0.7071 -0.2475 0 1 ${round(ox)} ${round(oy)})">`,
    ...children.map((c) => `  ${c}`),
    `</g>`,
  ]
}
function indelveWallBranding() {
  // Logo decal (transparent emblem), u 10..62, centred on local h = 32.
  const LOGO_W = 52
  const LOGO_H = LOGO_W * (238 / 314) // height follows the logo's aspect
  // Screen: dark bezel + 16:9 promo image, u 72.., same centre line. UPDATE
  // #38 (user): moved right with the logo and grown a further 10%.
  const SCR_IW = 53.46
  const SCR_IH = (SCR_IW * 9) / 16
  const SCR_W = SCR_IW + 2
  const SCR_H = SCR_IH + 2
  return [
    ...cdWallSheet(10, 32 + LOGO_H / 2, [
      `<image href="${inlineAsset('trantorian-logo.png')}" x="0" y="0" width="${round(LOGO_W)}" height="${round(LOGO_H)}" preserveAspectRatio="xMidYMid meet" />`,
    ]),
    ...cdWallSheet(72, 32 + SCR_H / 2, [
      `<rect class="dw-graph-frame" x="0" y="0" width="${round(SCR_W)}" height="${round(SCR_H)}" />`,
      `<image href="${inlineAsset('trantorian-screen.jpg', 'image/jpeg')}" x="1" y="1" width="${round(SCR_IW)}" height="${round(SCR_IH)}" preserveAspectRatio="xMidYMid meet" />`,
    ]),
  ]
}

// --- Indelve virtual-combat board (UPDATE #48, user): a hex-grid "board base"
// lying flat on the floor-3 Indelve area (the user's red-marked region), over
// the user's `deep-space.jpg` nebula, with an electric-blue hex grid drawn in
// SVG on top (faint blue cells so the nebula still reads through). Everything
// is authored in the floor plane's local (u, v) space via one matrix, so the
// board stays editable and lies flat on the floor. Placed under the queue /
// presenter so they stand on it. Spaceships are added on top later.
// UPDATE #54 (user): shifted ~20 units toward the building's rear (C-D) wall —
// that is +v only, so on screen the board (and the fleets, moved with it) travel
// up-left by (-0.7071, -0.2475) * 20 = (-14.1, -5.0).
const BOARD = { u0: 5, u1: 98.6, v0: 371, v1: 485, R: 9 }
function indelveBoard() {
  const { u0, u1, v0, v1, R } = BOARD
  const W = u1 - u0
  const H = v1 - v0
  const [ox, oy] = p(u0, v0, 3 * FH).split(',').map(Number)
  // The board's TOP FACE as a screen-space polygon (the same 0.7071/-0.2475
  // plane the matrix above uses). The fleets' SVG contact shadows are clipped by
  // it (UPDATE #55, user: "a shadow below each fleet, just over the board"), so
  // a shadow can only ever show on the board, never on the wood floor.
  const sc = (lx, ly) =>
    `${round(ox + 0.7071 * lx - 0.7071 * ly)},${round(oy - 0.2475 * lx - 0.2475 * ly)}`
  const out = [
    // floor-plane matrix: local +x -> +u (up-right), local +y -> +v (up-left)
    `<g transform="matrix(0.7071 -0.2475 -0.7071 -0.2475 ${round(ox)} ${round(oy)})">`,
    `  <defs><clipPath id="dw-clip-board"><rect x="0" y="0" width="${round(W)}" height="${round(H)}" /></clipPath></defs>`,
    `  <g clip-path="url(#dw-clip-board)">`,
    `    <image href="${inlineAsset('deep-space.jpg', 'image/jpeg')}" x="0" y="0" width="${round(W)}" height="${round(H)}" preserveAspectRatio="none" />`,
  ]
  // pointy-top hex grid, odd-r offset
  const colW = Math.sqrt(3) * R
  const rowH = 1.5 * R
  const nCols = Math.ceil(W / colW) + 1
  const nRows = Math.ceil(H / rowH) + 1
  for (let row = 0; row < nRows; row++) {
    for (let col = 0; col < nCols; col++) {
      const cx = col * colW + (row % 2 ? colW / 2 : 0)
      const cy = row * rowH
      const pts = []
      for (let k = 0; k < 6; k++) {
        const a = ((30 + 60 * k) * Math.PI) / 180
        pts.push(`${round(cx + R * Math.cos(a))},${round(cy + R * Math.sin(a))}`)
      }
      out.push(`    <polygon class="dw-hex" points="${pts.join(' ')}" />`)
    }
  }
  out.push(`  </g>`)
  out.push(`</g>`)
  out.push(
    `<defs><clipPath id="dw-clip-board-screen"><polygon points="${sc(0, 0)} ${sc(W, 0)} ${sc(W, H)} ${sc(0, H)}" /></clipPath></defs>`,
  )
  return out
}

// --- Indelve fleets (UPDATE #50, user): the two fleets hover 10u above the
// board, facing each other (A's stern at the board's near-left corner, B's at
// the far-right corner), bows meeting in the middle so together they cover most
// of the board. Each carries a contact shadow 10u below its capital (not below
// the sprite anchor, which is a fighter's bottom): `spriteShadow` with a
// separate plan anchor under the hull, so the ellipse lands on the floor under
// the capital; at the board's corner that floor point is half off the board, so
// the shadow straddles the board edge — physically what a hovering ship casts.
// UPDATE #53 (user): each fleet's TERMINATOR is the elevator shaft, so the
// fleets are emitted from TWO layers — `indelveFleetB()` stays in `floor-03`
// (the shaft, drawn later, hides its stern; only the bow shows in front of the
// shaft), while `indelveFleetA()` lives in its own `indelve-fleets` fragment
// assembled AFTER `tags`, so the left fleet paints OVER the "Indelve" plaque
// (and the floor base) instead of being clipped by it — the user's r91 review.
// UPDATE #56 (user): inside `floor-03` the far fleet is emitted AFTER
// `indelveFloorProps()`, so its bow reads above the queue's feet rather than
// behind them — the people no longer paint over the hull.
// UPDATE #54 (user): both fleets (and their shadows) move with the board ~20
// units toward the rear wall and shrink 15% — the anchors below were re-solved
// so each CAPITAL keeps its position relative to the board's moved corner.
// UPDATE #55 (user): each `<image>` is pinned to the exact screen top-left the
// user asked for (A 410/525, B 480/530) with an `off` from the plan-anchor
// projection (the same technique as the PC towers), and each shadow is wrapped
// in `dw-clip-board-screen` so it can only show ON the board (the user's "a
// shadow below each fleet, just over the board"); the off is added to the shadow
// too, so it stays under its hull.
const FLEET_A_OFF = [410 - 413.41, 525 - 530.8]
const FLEET_B_OFF = [480 - 491.69, 530 - 541.58]
// UPDATE #91 (user): the default 22% near-black contact shadow vanished against
// the dark `deep-space.jpg` nebula. The hovering hulls use a stronger, wider
// shade so they visibly seat on the board (still clipped to the board polygon).
const FLEET_SHADE = { fill: '#04060a', opacity: 0.5 }
const FLEET_SHADE_BULGE = 1.2
function indelveFleetA() {
  const H = 3 * FH + 10
  return [
    `<g clip-path="url(#dw-clip-board-screen)">${spriteShadow(FLEET_A, 5.2, 447.1, H - 10, FLEET_A_OFF, FLEET_SHADE_BULGE, FLEET_SHADE)}</g>`,
    assetProp(FLEET_A, -27.3, 414.6, H, FLEET_A_OFF),
  ]
}
function indelveFleetB() {
  const H = 3 * FH + 10
  return [
    `<g clip-path="url(#dw-clip-board-screen)">${spriteShadow(FLEET_B, 53.1, 358.8, H - 10, FLEET_B_OFF, FLEET_SHADE_BULGE, FLEET_SHADE)}</g>`,
    assetProp(FLEET_B, 21.2, 326.9, H, FLEET_B_OFF),
  ]
}

// --- Indelve floor props (UPDATE #38/#39, user): two PC towers stand on the
// floor to the right of the promo screen, as a generated sprite (`PCTOWERS`,
// see the const) facing the building's front wall. A `.dw-cable` run drops
// straight down the wall from the screen's bottom edge, then crosses the floor
// to the towers. Emitted after the section-divider fill (the towers sit in
// front of the wall), so the floor-4 slab clips at most their very top.
// UPDATE #41 (user): the sprite is pinned to the ABSOLUTE screen point
// (446, 468) — the requested top-left — by deriving the screen offset from the
// plan-anchor projection, so the top-left lands exactly there; the cable's
// floor run is re-aimed at the towers' new foot.
const TOWER_XY = [446, 468]
// Absolute screen top-left requested for the AR/VR demo person (UPDATE #44,
// nudged up-right in #45 per the user's red arrow).
const VR_XY = [455.5, 476]
function indelveFloorProps() {
  const H = 3 * FH
  const vWall = LD - WALL_T - 0.4
  const [bx, by] = p(131, 564, H).split(',').map(Number)
  const off = [TOWER_XY[0] - (bx - PCTOWERS.ax), TOWER_XY[1] - (by - PCTOWERS.ay)]
  const out = [
    spriteShadow(PCTOWERS, 131, 564, H, off),
    assetProp(PCTOWERS, 131, 564, H, off),
  ]
  // Cable: screen-bottom -> straight down the wall -> along the floor into the
  // towers' front foot (sprite-local bottommost pixel). UPDATE #42: extended so
  // the run visibly meets the sprite instead of stopping short of it.
  const [x0, y0] = p(120, vWall, H + 15.96).split(',').map(Number)
  const [x1, y1] = p(120, vWall, H + 1).split(',').map(Number)
  const ex = TOWER_XY[0] + PCTOWERS.ax + 2
  const ey = TOWER_XY[1] + PCTOWERS.ay - 2
  out.push(el('dw-cable', `M ${round(x0)} ${round(y0)} L ${round(x1)} ${round(y1)}`))
  out.push(
    el(
      'dw-cable',
      `M ${round(x1)} ${round(y1)} Q ${round((x1 + ex) / 2 + 2)} ${round((y1 + ey) / 2 + 3)} ${round(ex)} ${round(ey)}`,
    ),
  )
  // AR/VR demo person pinned to the absolute screen top-left VR_XY (farthest:
  // drawn first), then the presenter, then the queue copies (each nearer).
  const [vx, vy] = p(126, 574, H).split(',').map(Number)
  const vrOff = [VR_XY[0] - (vx - TRANTORIAN_VR.ax), VR_XY[1] - (vy - TRANTORIAN_VR.ay)]
  out.push(spriteShadow(TRANTORIAN_VR, 126, 574, H, vrOff))
  out.push(assetProp(TRANTORIAN_VR, 126, 574, H, vrOff))
  // Presenter (reduced 30%, moved right per the user's red arrow) in the
  // logo/screen gap.
  out.push(spriteShadow(PRESENTER, 68, 546, H))
  out.push(assetProp(PRESENTER, 68, 546, H))
  // Queue of four people behind the AR/VR person: runs -v (down-right) from
  // just behind his drawn foot, per the user's red line. UPDATE #46/#47 (user):
  // repeated twice more along the same direction (3 copies total). The step is
  // the sprite's own length (~28u in v) plus a ~5px screen gap, so consecutive
  // copies read as separate groups with a minimal empty space between them.
  const QUEUE_STEP = 34.8
  for (const i of [0, 1, 2]) {
    const qv = 485 - i * QUEUE_STEP
    out.push(spriteShadow(QUEUE, 110, qv, H))
    out.push(assetProp(QUEUE, 110, qv, H))
  }
  return out
}


const H3 = 3 * FH // floor-3 story base height (Stage 5.6 §5)

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
  // Right wall, left of the B corner: the two app mockups (screenshots the
  // team pinned up), printed on paper, taped, then marker-annotated. The
  // left-hand sheet is drawn first so the nearer sheet's paper laps over its
  // shadow.
  ...wallAppBoard(IMC_HOME_BOARD),
  ...wallAppBoard(HUB_LIVE_BOARD),
  // Indelve section: logo + promo screen on the rear wall's left end.
  ...indelveWallBranding(),
  // The virtual-combat hex board on the floor, then the props/people standing on
  // it, then the far (right) fleet OVER them — the user's r95 review: its bow
  // overlaps the queue's feet, and the fleet must read above the people. It is
  // still emitted here in `floor-03`, i.e. BELOW the elevator fragment, so the
  // shaft keeps occluding its stern (only the bow shows in front of the shaft).
  // The near (left) fleet lives in `indelve-fleets` instead (assembled after
  // `tags`) so it paints over the "Indelve" plaque.
  ...indelveBoard(),
  ...indelveFloorProps(),
  ...indelveFleetB(),
  // Stage 5.6 §5 — third floor Indelve: subtle wall marks above the Trantorian
  // logo (the one r185 detail kept on user review). Generic treatment only.
  ...surfaceWear('u', LD - WALL_T - 0.3, 0, 38, H3 + 60, H3 + 76, 52),
  // Stage 5.6 §10/§11/§14 — third floor Interactica: architectural detail on
  // the B-D wall just past the two taped app boards (which occupy v 5..103):
  // sparse wall wear, a ventilation outlet with a conduit drop into the slab
  // (infrastructure → floor connection). Generic treatment only (no invented
  // Interactica specifics). The visible wall wedge here is narrow, so this is
  // a single fixture rather than a cluster.
  ...surfaceWear('v', LW - WALL_T - 0.3, 120, 134, H3 + 6, H3 + 30, 44),
  ...segRun([
    [LW - WALL_T, 111, H3 + 24],
    [LW - WALL_T, 111, H3 + 1],
    [LW - WALL_T - 7, 116, H3 + 0.5],
  ]),
  wallFixture('fixture-vent-01.png', 'v', LW - WALL_T - 0.3, 118, H3 + 38, 14, 14),
])

const floor03Front = group('floor-03-front', [
  ...slabTriangle(3 * FH),
  ...columns(3 * FH, 3 * FH + STORY_H),
  // Stage 5.6 §5/§1 — Interactica partial wall (user r186, red-marked): a
  // section of the building's left edge (u = 0) framing the front of the
  // floor-3 Interactica area (v ~75..161), full story, ragged free ends, no
  // side caps, thin outline. `cap: false` (user r187 follow-up) drops the top
  // cap: its visible fold read as a spurious flap above the wall. Emitted after
  // the elevator so it layers over the shaft's re-layered floor bands.
  ...partialWall('v', 75, 161, 0, 3 * FH, 3 * FH + STORY_H, { face: 'dw-wall', cap: false, ends: [false, false], scrap: [true, true], scrapSeed: 49, outline: 0.5 }),
  // Stage 5.6 §9 — third-floor slab: a stronger visible front edge, one joint
  // and support brackets under the open edge (Interactica and Indelve sides).
  ...slabDetail(3 * FH, { seams: [72], brackets: [40, 150] }),
])

// --- floor-03-team: Interactica team cluster + bosses (r40/r42/r51/r54
// reviews). The cross of desks with the eight seated devs, and the bosses +
// tech lead debating in front of it (cluster first, bosses after — nearer to
// camera). This is its OWN fragment, stacked in `assemble-svg.mjs` directly
// between `floor-03` and `floor-04`, for two reasons:
//   1. it must sit BELOW the floor-04 base (user revision) — the ceiling slab
//      then correctly occludes anything pushed too deep, and the sprite can
//      never paint over the floor-4 floor surface;
//   2. it must sit ABOVE the floor-03 slab (and the front-left `slabTriangle`
//      in `floor-03-front`, which repaints that floor rectangle much later in
//      the stack — anything at plan u < 48.2, v < 222.4 would get its lower
//      half covered; hence both anchors keep u >= ~50).
// The A column (`floor-03-front`) still paints over the sprites.
const floor03Team = group('floor-03-team', [
  spriteShadow(TEAMCROSS, 100, 80, 3 * FH),
  assetProp(TEAMCROSS, 100, 80, 3 * FH),
  spriteShadow(BOSSES, 52, 83, 3 * FH),
  assetProp(BOSSES, 52, 83, 3 * FH),
])

// --- Pacer (floor-4) legacy-stack corner vignette (UPDATE #57, user) --------
// Content is user-authorized: Pacer's legacy (vanilla PHP era) system being
// replaced by a newer stack. This first vignette shows the legacy side at the
// building's front-right (B) corner: the generated pile sprite (three low old
// boxes + spaghetti cables + litter + dust + sparks + flies baked into the
// raster), SVG cables that spill from the boxes over the floor's v=0 front edge
// with 2-3 frayed ends draping to (never past) the floor's base line, and crisp
// SVG spark accents. UPDATE #58: sprite doubled, cables shortened. UPDATE #59:
// the SVG flies removed (the sprite already has them) and the sprite pinned to
// PACER_XY. Real tech names/logos are deferred. Emitted at the END of
// floor-04-front so it sits on the slab over the corner column and is not hidden
// by any lower floor.
const PACER_U = 158 // plan reference (its screen projection feeds the pin offset)
const PACER_V = 18
// Smooth run through waypoints carrying an explicit height each ([u, v, h]).
function cablePathFit(pts) {
  const P = pts.map(([u, v, h]) => p(u, v, h))
  let d = `M ${P[0]}`
  for (let i = 1; i < P.length - 1; i++) {
    const a = P[i].split(',').map(Number)
    const b = P[i + 1].split(',').map(Number)
    d += ` Q ${P[i]} ${round((a[0] + b[0]) / 2)},${round((a[1] + b[1]) / 2)}`
  }
  d += ` L ${P[P.length - 1]}`
  return d
}
function pacerLegacyCorner() {
  const H = 4 * FH
  const at = (u, v, h) => p(u, v, h).split(',').map(Number)
  const spark = (x, y, s, cls) => {
    const d = [
      `M ${round(x - s)} ${round(y)} L ${round(x + s)} ${round(y)}`,
      `M ${round(x)} ${round(y - s)} L ${round(x)} ${round(y + s)}`,
      `M ${round(x - s * 0.7)} ${round(y - s * 0.7)} L ${round(x + s * 0.7)} ${round(y + s * 0.7)}`,
    ].join(' ')
    return el(cls, d)
  }
  const out = []
  // Cables drawn BEFORE the sprite so each strand reads as emerging from under
  // the boxes. Three cross the v=0 edge and drape down the slab face, stopping
  // AT the floor's base line (h = H - SLAB_T); the middle one is the quieter
  // secondary tone. They are wrapped in a screen translate so they follow the
  // pinned sprite (UPDATE #60).
  const [c0x, c0y] = at(PACER_U, PACER_V, H)
  const cableShift = [
    PACER_XY[0] - (c0x - PACER_CABLE_AX),
    PACER_XY[1] - (c0y - PACER_LEGACY.ay),
  ]
  const cables = []
  const edgeU = [200, 208, 216]
  edgeU.forEach((eu, i) => {
    const pts = [
      [eu - 13, 26 + i * 2, H],
      [eu - 6, 15 + i, H],
      [eu - 1.5, 5, H],
      [eu, 0, H],
      [eu + 1.5, -1.5, H - 4],
      [eu + 2.5, -2.5, H - 7 - i],
      [eu + 3.2, -3, H - 10 - i],
    ]
    cables.push(el(i === 1 ? 'dw-cable-2' : 'dw-cable', cablePathFit(pts)))
    const [ex, ey] = at(eu + 3.2, -3, H - 10 - i)
    cables.push(spark(ex, ey, 2.2, 'dw-spark-glow'))
    cables.push(spark(ex, ey, 1.1, 'dw-spark'))
  })
  out.push(`<g transform="translate(${round(cableShift[0])} ${round(cableShift[1])})">${cables.join('')}</g>`)
  // Sprite pinned to the user's absolute screen top-left (UPDATE #59): derive
  // the offset from the plan-reference projection, then apply it to the sprite
  // AND its shadow so they stay locked together.
  const [pxx, pyy] = at(PACER_U, PACER_V, H)
  const off = [PACER_XY[0] - (pxx - PACER_LEGACY.ax), PACER_XY[1] - (pyy - PACER_LEGACY.ay)]
  out.push(spriteShadow(PACER_LEGACY, PACER_U, PACER_V, H, off, 0.8))
  out.push(assetProp(PACER_LEGACY, PACER_U, PACER_V, H, off))
  // The two men (UPDATE #61): drawn AFTER the pile so they read in front
  // (nearer: u+v smaller), walking up-right toward the pile from the left.
  out.push(spriteShadow(PACER_AXE, PACER_AXE_ANCHOR[0], PACER_AXE_ANCHOR[1], H))
  out.push(assetProp(PACER_AXE, PACER_AXE_ANCHOR[0], PACER_AXE_ANCHOR[1], H))
  return out
}
// --- Pacer spreadsheet "screenshot" (UPDATE #63, user): a LARGE "white
// cardboard" lying flat on the right-centre of floor 4 that is really a
// screenshot of a Google-Sheets page holding a neutral mix of a functional
// workflow diagram and a sequence diagram (light theme, NORMAL arrows, no
// browser chrome, no real business meaning). Authored in the floor plane's
// local space via ONE matrix — local +x -> +u (up-right), local +y -> -v
// (down-right, toward the front) — so it lies flat and stays editable. Emitted
// in `floor-04` (BEFORE `floor-05`), so the floor-5 slab would paint over its
// far part if it reached back that far. UPDATE #64 (user): the sheet is made
// ~25% deeper in the front-ward direction (local +y -> -v): v0 132 -> 110.5
// (the far edge v1 stays put, the near edge comes toward the front), and the
// diagram is filled out with more lanes' steps, a self-call and a sheet-tab row.
const PACER_SHEET = { u0: 92, u1: 210, v0: 110.5, v1: 218 }
function pacerSheet() {
  const H = 4 * FH
  const { u0, u1, v0, v1 } = PACER_SHEET
  const W = u1 - u0
  const V = v1 - v0
  const [ox, oy] = p(u0, v1, H).split(',').map(Number)
  const r = (n) => round(n)
  const rect = (cls, x, y, w, h, attrs = '') =>
    `<rect class="${cls}" x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(h)}"${attrs} />`
  const line = (cls, x1, y1, x2, y2) =>
    `<line class="${cls}" x1="${r(x1)}" y1="${r(y1)}" x2="${r(x2)}" y2="${r(y2)}" />`
  const txt = (cls, x, y, s) => `<text class="${cls}" x="${r(x)}" y="${r(y)}" text-anchor="middle">${s}</text>`
  const head = (x, y, dir) =>
    `<polygon class="dw-sheet-arrowhead" points="${r(x)},${r(y)} ${r(x - dir * 2.4)},${r(y - 1.1)} ${r(x - dir * 2.4)},${r(y + 1.1)}" />`
  // matrix: local +x -> +u, local +y -> -v (origin = far-left corner p(u0, v1))
  const out = [`<g transform="matrix(0.7071 -0.2475 0.7071 0.2475 ${r(ox)} ${r(oy)})">`]
  // cardboard: soft shadow, then the white sheet
  out.push(rect('dw-sheet-shadow', 1.2, 1.8, W, V, ' rx="1"'))
  out.push(rect('dw-sheet', 0, 0, W, V, ' rx="1"'))
  // faint spreadsheet grid
  for (let x = 5.9; x < W - 0.2; x += 5.9) out.push(line('dw-sheet-grid', x, 0, x, V))
  for (let y = 5.37; y < V - 0.2; y += 5.37) out.push(line('dw-sheet-grid', 0, y, W, y))
  // --- sequence diagram: 5 lanes -------------------------------------------
  const names = ['Client', 'Gateway', 'Auth', 'Database', 'Worker']
  const m = 4
  const laneW = (W - 2 * m) / names.length
  const xc = names.map((_, i) => m + laneW * (i + 0.5))
  const hy0 = 3
  const hh = 7
  names.forEach((nm, i) => {
    out.push(rect('dw-sheet-head', xc[i] - 9, hy0, 18, hh, ' rx="0.8"'))
    out.push(txt('dw-sheet-headtext', xc[i], hy0 + hh / 2 + 1.1, nm))
    out.push(line('dw-sheet-life', xc[i], hy0 + hh, xc[i], 78))
  })
  const seq = [
    [0, 1, 16, 'request'],
    [1, 2, 22, 'verify'],
    [2, 3, 28, 'lookup'],
    [3, 2, 34, 'found'],
    [2, 1, 40, 'grant'],
    [1, 4, 46, 'dispatch'],
    [4, 3, 52, 'write'],
    [4, 1, 58, 'ack'],
    [1, 0, 64, 'result'],
    [0, 4, 70, 'notify'],
  ]
  for (const [a, b, y, lab] of seq) {
    const x0 = xc[a]
    const x1 = xc[b]
    out.push(line('dw-sheet-arrow', x0, y, x1, y))
    out.push(head(x1, y, x1 > x0 ? 1 : -1))
    out.push(txt('dw-sheet-label', (x0 + x1) / 2, y - 1.3, lab))
  }
  // self-call on the Database lifeline
  out.push(rect('dw-sheet-note', xc[3], 71, 12, 5.5, ' rx="0.6"'))
  out.push(txt('dw-sheet-label', xc[3] + 6, 74.6, 'retry'))
  out.push(line('dw-sheet-arrow', xc[3] + 12, 75, xc[3], 75))
  out.push(head(xc[3], 75, -1))
  // --- functional workflow row --------------------------------------------
  out.push(line('dw-sheet-divider', m, 80, W - m, 80))
  const steps = ['Input', 'Validate', 'Process', 'Persist', 'Done']
  const bw = 17
  const gap = (W - 2 * m - steps.length * bw) / (steps.length - 1)
  const by = 84
  const bh = 12
  steps.forEach((s, i) => {
    const x = m + i * (bw + gap)
    out.push(rect('dw-sheet-flow', x, by, bw, bh, ' rx="1"'))
    out.push(txt('dw-sheet-flowtext', x + bw / 2, by + bh / 2 + 1.2, s))
    if (i < steps.length - 1) {
      out.push(line('dw-sheet-arrow', x + bw, by + bh / 2, x + bw + gap, by + bh / 2))
      out.push(head(x + bw + gap, by + bh / 2, 1))
    }
  })
  // sheet tabs strip (Google-Sheets cue)
  out.push(line('dw-sheet-divider', m, 99.5, W - m, 99.5))
  const tabs = ['Sheet1', 'Flow', 'Notes']
  tabs.forEach((t, i) => {
    const x = m + i * 19
    out.push(rect(i === 0 ? 'dw-sheet-tab-on' : 'dw-sheet-tab', x, 101, 17, 5, ' rx="1"'))
    out.push(txt('dw-sheet-tabtext', x + 8.5, 104.4, t))
  })
  out.push('</g>')
  return out
}

// --- Pacer WhatsApp-bot chat screen (UPDATE #73, user): a tall wall-mounted
// display on the C-D rear wall of floor 4, in the Pacer left half — the same
// column as the Trantorian logo (u 10..62), just left of the Indelve promo
// screen, so the logo (floor 3) and the chat screen (floor 4) stack in one
// column. NOTE (geometry): the floor-5 slab juts over the C-D wall, so the
// visible story height falls off with u (h_ceiling ≈ 104.97 - 0.495·u local);
// at the promo screen's u ≈ 72..127 only ~42..69 units show. This column keeps
// the full story, hence the screen is here rather than directly above the
// Indelve screen. It shows an editable-SVG WhatsApp-style chat: the bot's LONG
// messages arrive on the left (white incoming bubbles) and the user's SHORT
// replies go out on the right (green, time + blue double ticks) — a user
// talking to a WhatsApp bot. Neutral placeholder copy only (no product facts).
// Authored in the wall plane via cdWallSheet (one matrix), so it stays editable
// and lies flat on the wall. Top at local 66 clears the ceiling (which falls
// from ~100 at u 10 to ~70 at u 60); bottom at 4 sits just above the floor.
const PACER_CHAT = { u0: 10, W: 50, hBot: 4, hTop: 66 }
function pacerChatScreen() {
  const { u0, W, hBot, hTop } = PACER_CHAT
  const H = hTop - hBot
  const r = round
  const rect = (cls, x, y, w, h, attr = '') =>
    `<rect class="${cls}" x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(h)}"${attr} />`
  const circle = (cls, cx, cy, rad) =>
    `<circle class="${cls}" cx="${r(cx)}" cy="${r(cy)}" r="${r(rad)}" />`
  const txt = (cls, x, y, s, extra = '') =>
    `<text class="${cls}" x="${r(x)}" y="${r(y)}"${extra}>${s}</text>`
  // Incoming (bot, LEFT) bubble: rounded pad + left tail + time bottom-right.
  const inBub = (x, y, w, h, lines, time) => [
    rect('dw-chat-in', x, y, w, h, ' rx="2"'),
    `<polygon class="dw-chat-in" points="${r(x)},${r(y + h - 3.2)} ${r(x - 1.6)},${r(y + h - 2.2)} ${r(x)},${r(y + h - 1.2)}" />`,
    ...lines.map((ln, i) => txt('dw-chat-text', x + 2, y + 3.6 + i * 3.4, ln)),
    txt('dw-chat-time', x + w - 2, y + h - 1.3, time, ' text-anchor="end"'),
  ]
  // Outgoing (user, RIGHT) bubble: right tail + time + blue double tick.
  const outBub = (x, y, w, h, lines, time) => [
    rect('dw-chat-out', x, y, w, h, ' rx="2"'),
    `<polygon class="dw-chat-out" points="${r(x + w)},${r(y + h - 3.2)} ${r(x + w + 1.6)},${r(y + h - 2.2)} ${r(x + w)},${r(y + h - 1.2)}" />`,
    ...lines.map((ln, i) => txt('dw-chat-text', x + 2, y + 3.4 + i * 3.4, ln)),
    txt('dw-chat-time', x + w - 5.4, y + h - 1.3, time, ' text-anchor="end"'),
    `<path class="dw-chat-tick" d="M ${r(x + w - 4.4)} ${r(y + h - 2.3)} l 1 1 l 1.5 -2 M ${r(x + w - 2.9)} ${r(y + h - 2.3)} l 1 1 l 1.5 -2" />`,
  ]
  const out = [rect('dw-chat-shadow', 0.9, 1.4, W, H, ' rx="1.4"'), rect('dw-chat-bezel', 0, 0, W, H, ' rx="1.4"')]
  // screen face + faint chat-wall doodles
  out.push(rect('dw-chat-face', 1.6, 1.6, W - 3.2, H - 3.2, ' rx="1"'))
  const doodles = [
    [12, 17, 1.4],
    [29, 21, 1.9],
    [42, 15, 1.3],
    [16, 31, 1.7],
    [37, 41, 1.4],
    [24, 48, 1.8],
    [44, 37, 1.3],
    [10, 43, 1.2],
  ]
  for (const [dx, dy, rad] of doodles) out.push(circle('dw-chat-doodle', dx, dy, rad))
  // header (teal) with bot avatar + neutral name/status + menu dots
  out.push(rect('dw-chat-header', 1.6, 1.6, W - 3.2, 8))
  out.push(circle('dw-chat-avatar', 7.4, 5.8, 2.7))
  out.push(circle('dw-chat-bot-dot', 6.9, 5.4, 0.36))
  out.push(circle('dw-chat-bot-dot', 8.0, 5.4, 0.36))
  out.push(`<path class="dw-chat-bot" d="M 6.5 6.5 a 0.9 0.9 0 0 0 1.7 0" />`)
  out.push(`<line class="dw-chat-bot" x1="7.4" y1="3.1" x2="7.4" y2="2.4" />`)
  out.push(circle('dw-chat-bot-dot', 7.4, 2.1, 0.35))
  out.push(txt('dw-chat-name', 11.4, 5.2, 'Asistente'))
  out.push(txt('dw-chat-status', 11.4, 8.0, 'en línea'))
  for (const cx of [43.4, 45.4, 47.4]) out.push(circle('dw-chat-dot', cx, 5.8, 0.55))
  // conversation: short outgoing (right) then long incoming (left)
  out.push(...outBub(W - 3 - 14, 11.0, 14, 6.2, ['Hola'], '12:30'))
  out.push(...inBub(3, 18.4, 36, 8.8, ['¡Hola! Soy tu asistente.', '¿En qué puedo ayudarte?'], '12:31'))
  out.push(...outBub(W - 3 - 21, 28.4, 21, 6.2, ['¿Puedes ayudarme?'], '12:32'))
  out.push(...inBub(3, 35.8, 36, 8.2, ['Claro, reviso tu solicitud', 'y te confirmo enseguida.'], '12:33'))
  out.push(...outBub(W - 3 - 15, 45.2, 15, 6.2, ['Gracias'], '12:34'))
  // input bar: pill + paperclip + placeholder + send/mic button
  out.push(rect('dw-chat-input', 3, 52.0, W - 14, 5.4, ' rx="2.7"'))
  out.push(`<path class="dw-chat-icon" d="M 6.6 53.1 l -2 2 a 1.3 1.3 0 0 0 1.8 1.8 l 2.2 -2.2" />`)
  out.push(txt('dw-chat-inputtext', 10, 55.6, 'Escribe un mensaje'))
  out.push(circle('dw-chat-send', W - 6, 54.7, 2.9))
  out.push(rect('dw-chat-mic', W - 6.57, 53.3, 1.2, 2.0, ' rx="0.6"'))
  out.push(`<path class="dw-chat-mic-line" d="M ${r(W - 7.3)} 54.9 a 1.35 1.35 0 0 0 2.7 0 M ${r(W - 5.95)} 56.1 l 0 0.6 M ${r(W - 6.75)} 56.7 l 1.6 0" />`)
  return cdWallSheet(u0, hTop, out, 4 * FH)
}
const floor04 = group('floor-04', [
  ...slab(4 * FH),
  ...backWalls(4 * FH),
  // Tall WhatsApp-bot chat screen on the C-D rear wall, above the Indelve promo
  // (UPDATE #73, user). On the wall, drawn after the wall so it sits proud.
  ...pacerChatScreen(),
  ...pacerSheet(),
  // Stage 5.6 §6 — fourth floor (Pacer) architectural shell. Generic only, no
  // invented Pacer meaning; the two sides stay deliberately different:
  //   left  — subtle wear + one wall light on the C-D wall's right stretch,
  //           clear of the chat screen (u 10..60);
  //   right — a vent outlet on the B-D wall's visible near stretch (v ≲ 212),
  //           plus slab construction.
  // (Ceiling for this story falls as ~105 - 0.495·c local, so both fixtures
  // sit low where the wall is fully visible.)
  ...surfaceWear('u', LD - WALL_T - 0.3, 66, 104, 4 * FH + 8, 4 * FH + 46, 61),
  wallFixture('fixture-lamp-01.png', 'u', LD - WALL_T - 0.3, 70, 4 * FH + 46, 10, 13),
  wallFixture('fixture-vent-01.png', 'v', LW - WALL_T - 0.3, 30, 4 * FH + 52, 14, 14),
  // Floor slab (§9): visible edge + one joint, a stronger underside than the
  // floors below and a support bracket under the open front edge.
  ...slabDetail(4 * FH, { seams: [64], brackets: [120] }),
  // Two floor-3 Interactica team clusters (UPDATE #68/#69, user) filling the
  // Pacer left half — far-to-near order (larger v first). In THIS group (before
  // floor-05) so the floor-5 slab and the elevator paint OVER them.
  ...[...PACER_TEAMCROSS]
    .sort((a, b) => b[1] - a[1])
    .flatMap(([u, v]) => [
      spriteShadow(TEAMCROSS, u, v, 4 * FH),
      assetProp(TEAMCROSS, u, v, 4 * FH),
    ]),
])
const floor04Front = group('floor-04-front', [
  ...slabTriangle(4 * FH),
  // TECHLEAD2 BEFORE the columns (UPDATE #67, user): the A-corner vertical line
  // (the edge joining the floor-4 and floor-5 corners) must draw OVER the man.
  spriteShadow(TECHLEAD2, TECHLEAD2_ANCHOR[0], TECHLEAD2_ANCHOR[1], 4 * FH),
  assetProp(TECHLEAD2, TECHLEAD2_ANCHOR[0], TECHLEAD2_ANCHOR[1], 4 * FH),
  ...columns(4 * FH, 4 * FH + STORY_H),
  spriteShadow(SITDEVS2, SITDEVS2_ANCHOR[0], SITDEVS2_ANCHOR[1], 4 * FH),
  assetProp(SITDEVS2, SITDEVS2_ANCHOR[0], SITDEVS2_ANCHOR[1], 4 * FH),
  ...pacerLegacyCorner(),
])

// Whip lash (UPDATE #76–#78, user): the lash continues from the whipper's
// handle tip (the raster has the handle + a short hanging loop) as ONE smooth
// SVG curve cracking toward the Toysite, ending near the building with a small
// grey cross "impact" effect. Authored from the sprite's own top-left, so it
// stays glued to the hand if WHIPPER_ANCHOR moves.
function whipperWhip() {
  const [sx, sy] = p(WHIPPER_ANCHOR[0], WHIPPER_ANCHOR[1], 5 * FH).split(',').map(Number)
  const ox = sx - WHIPPER.ax
  const oy = sy - WHIPPER.ay
  const at = (px, py) => [ox + px * WHIPPER.k, oy + py * WHIPPER.k]
  // handle tip -> one smooth arc -> end near the toysite building
  const p0 = at(232, 6)
  const c1 = at(480, -330)
  const c2 = at(820, -230)
  const p3 = at(1100, 300)
  const [ex, ey] = p3
  // grey cross "impact" lines at the tip (a soft wide set + a crisp set)
  const cross = (s, cls) => [
    `<line class="${cls}" x1="${round(ex - s)}" y1="${round(ey)}" x2="${round(ex + s)}" y2="${round(ey)}" />`,
    `<line class="${cls}" x1="${round(ex)}" y1="${round(ey - s)}" x2="${round(ex)}" y2="${round(ey + s)}" />`,
    `<line class="${cls}" x1="${round(ex - s * 0.7)}" y1="${round(ey - s * 0.7)}" x2="${round(ex + s * 0.7)}" y2="${round(ey + s * 0.7)}" />`,
    `<line class="${cls}" x1="${round(ex - s * 0.7)}" y1="${round(ey + s * 0.7)}" x2="${round(ex + s * 0.7)}" y2="${round(ey - s * 0.7)}" />`,
  ]
  return [
    el('dw-whip', `M ${round(p0[0])} ${round(p0[1])} C ${round(c1[0])} ${round(c1[1])} ${round(c2[0])} ${round(c2[1])} ${round(ex)} ${round(ey)}`),
    ...cross(4.6, 'dw-whip-hit-glow'),
    ...cross(2.7, 'dw-whip-hit'),
  ]
}

// Floor-5 tossed CVs (Stage 5.5 UPDATE #85, user): the flying paper sheets the
// CV-TOSSER has flung up. Authored from the sprite's own top-left (like
// whipperWhip), so the sheets stay glued to the hand when CVTOSS_ANCHOR is
// nudged: ~5 sheets tumble just above/around the open raised hand, and ~6 arc
// toward +u (up-right on screen) — the building's right wall — passing over it
// into the dark. Sheets big enough to read carry the letters "CV"; small or
// edge-on ones stay blank white. A paper is a rotated quad with a folded
// corner, so it reads as a fresh sheet turning in the air.
function cvTossPapers() {
  const [sx, sy] = p(CVTOSS_ANCHOR[0], CVTOSS_ANCHOR[1], 5 * FH).split(',').map(Number)
  const ox = sx - CVTOSS.ax
  const oy = sy - CVTOSS.ay
  const at = (px, py) => [ox + px * CVTOSS.k, oy + py * CVTOSS.k]
  const [hx, hy] = at(172, 58) // the open hand near the top of the sprite
  const out = []
  const paper = (dx, dy, w, h, rot, cv, fold = 1) => {
    const cx = hx + dx
    const cy = hy + dy
    const r = (rot * Math.PI) / 180
    const c = Math.cos(r)
    const s = Math.sin(r)
    const P = (x, y) => `${round(cx + x * c - y * s)},${round(cy + x * s + y * c)}`
    out.push(el('dw-paper-air', `M ${P(-w / 2, -h / 2)} L ${P(w / 2, -h / 2)} L ${P(w / 2, h / 2)} L ${P(-w / 2, h / 2)} Z`))
    // folded corner (top-right for fold>0, top-left for fold<0): a curling sheet
    const fx = fold >= 0 ? w / 2 : -w / 2
    const f = h * 0.34
    out.push(el('dw-paper-fold', `M ${P(fx, -h / 2)} L ${P(fx - fold * f, -h / 2)} L ${P(fx, -h / 2 + f * 0.7)} Z`))
    if (cv) {
      out.push(
        `<text class="dw-cv-text" transform="translate(${round(cx)} ${round(cy)}) rotate(${round(rot)})" font-size="${round(h * 0.46)}">CV</text>`,
      )
    }
  }
  // 5 sheets tumbling just over the head, around the open raised hand
  paper(-30, 8, 12, 9, -30, true, 1)
  paper(2, -28, 10.5, 7.5, 16, false, -1)
  paper(38, -4, 11.5, 8.5, 44, true, 1)
  paper(-14, -32, 9.5, 7, -12, true, -1)
  paper(18, -52, 10.5, 7.5, 4, false, 1)
  // Denser fan INSIDE the flurry triangle above the hand (user revision r149):
  // sheets spread from just above the head out to the upper-right, instead of a
  // single thin trail into the dark.
  paper(10, -95, 10.5, 8, -20, true, 1)
  paper(46, -60, 11, 8.5, 30, true, -1)
  paper(64, -108, 10, 7.5, -8, false, 1)
  paper(100, -80, 12, 9, 42, true, 1)
  paper(128, -112, 10, 7.5, 12, true, -1)
  paper(34, -128, 9.5, 7, 6, false, -1)
  // Only a short trail continues to the right edge (the far-off sheets were
  // removed — they wandered too far out of the flurry).
  paper(150, -48, 10.5, 8, 48, true, -1)
  paper(184, -72, 12.5, 9, -14, false, 1)
  return out
}

// Floor-5 AI-workflow board (UPDATE #79, user): the tall vertical
// ai-workflow.jpg mounted on the C-D REAR wall at the D (rear-right) corner of
// the unfinished fifth floor. Authored on the wall plane via cdWallSheet with
// hBase = 5*FH (like the Indelve branding). The asset is very tall (1220x4139),
// so it reads as a slim vertical workflow display with a thin dark bezel.
const AIWF = { u0: 192, W: 26, hTop: 96 }
function aiWorkflowBoard() {
  const H = AIWF.W * (4139 / 1220) // preserve the asset aspect (~88.2u tall)
  const b = 0.9
  return cdWallSheet(
    AIWF.u0,
    AIWF.hTop,
    [
      `<rect class="dw-graph-frame" x="${round(-b)}" y="${round(-b)}" width="${round(AIWF.W + 2 * b)}" height="${round(H + 2 * b)}" rx="0.6" />`,
      `<image href="${inlineAsset('ai-workflow.jpg', 'image/jpeg')}" x="0" y="0" width="${round(AIWF.W)}" height="${round(H)}" preserveAspectRatio="none" />`,
    ],
    5 * FH,
  )
}

// Floor-5 AI-acceleration screen (Stage 5.5 UPDATE #86, user): the user-supplied
// AI-Acceleration.png (1536x1024, a 3:2 "AI acceleration" headline collage)
// mounted as a framed info screen on the unfinished fifth floor's REAR (C-D)
// wall stub at the C corner — the surface the user's red circle marked, left of
// the AI-workflow board. Same wall-plane sheet idiom as the Indelve promo screen
// (cdWallSheet: dark bezel + inset image), with hBase = 5*FH so it sits on the
// fifth story. Centred on the stub's mid-height (local h = 25) and about the
// stub's u-centre (~47), so it fits inside the 50u-tall stub (u 0..95.2).
const AISCREEN = { u0: 19, W: 56, hMid: 25 } // outer bezel: u 19..75, centred at h 25
function aiAccelerationScreen() {
  const b = 1 // bezel thickness
  const imgW = AISCREEN.W - 2 * b
  const imgH = imgW / (1536 / 1024) // preserve the asset's 3:2 aspect
  const H = imgH + 2 * b
  const hTop = AISCREEN.hMid + H / 2
  return cdWallSheet(
    AISCREEN.u0,
    hTop,
    [
      `<rect class="dw-graph-frame" x="0" y="0" width="${round(AISCREEN.W)}" height="${round(H)}" rx="0.8" />`,
      `<image href="${inlineAsset('AI-Acceleration.png')}" x="${round(b)}" y="${round(b)}" width="${round(imgW)}" height="${round(imgH)}" preserveAspectRatio="none" />`,
    ],
    5 * FH,
  )
}

// Floor-5 elevator access ladder (UPDATE #80, user): a ladder on the LEFT side
// of the shaft, standing on the floor-5 slab just behind the shaft's rear-left
// corner (where the red mark points), climbing up to get over the shaft roof.
// Because it is drawn BELOW the `elevator` fragment and sits behind the shaft,
// the shaft occludes its near rail below the roof — that rail only shows above
// the roof — while the far rail (left of the shaft's silhouette) stays fully
// visible from the slab up. Each rail tops out in a hook that curves over the
// roof (-v) and ends on it.
const LADDER = { vL: 312, uC: -1.4, railGap: 4.6, hBot: 5 * FH, hTop: TOP_H, hookR: 7, run: 10, treads: 14 }
function elevatorLadder() {
  const { vL, uC, railGap, hBot, hTop, hookR, run, treads } = LADDER
  const out = []
  const uA = uC - railGap // far/left rail — stays visible below the roof
  const uB = uC + railGap // near/right rail — hidden by the shaft below the roof
  const hKnee = hTop + 1 // rail top; the hook starts just over the roof
  const at = (u, h) => p(u, vL, h).split(',').map(Number)
  const seg = (u0, h0, u1, h1, cls) => {
    const [x1, y1] = at(u0, h0)
    const [x2, y2] = at(u1, h1)
    out.push(`<line class="${cls}" x1="${round(x1)}" y1="${round(y1)}" x2="${round(x2)}" y2="${round(y2)}" />`)
  }
  const pt = (u, v, h) => {
    const [x, y] = p(u, v, h).split(',').map(Number)
    return `${round(x)} ${round(y)}`
  }
  // each rail: straight up from the slab, then a rounded 90° hook (in the v-h
  // plane) turning -v over the roof, ending in a short bar lying on the roof.
  const N = 14
  for (const u of [uA, uB]) {
    const d = [`M ${pt(u, vL, hBot)}`, `L ${pt(u, vL, hKnee)}`]
    for (let i = 1; i <= N; i++) {
      const phi = Math.PI - (Math.PI / 2) * (i / N)
      d.push(`L ${pt(u, vL - hookR * (1 + Math.cos(phi)), hKnee + hookR * Math.sin(phi))}`)
    }
    d.push(`L ${pt(u, vL - hookR - run, hKnee + hookR)}`)
    out.push(`<path class="dw-ladder" d="${d.join(' ')}" />`)
  }
  // treads along u (the ladder's width) from the slab up to the roof
  for (let i = 0; i <= treads; i++) {
    const h = hBot + ((hTop - hBot) * i) / treads
    seg(uA, h, uB, h, 'dw-ladder-rung')
  }
  return out
}

// Floor-5 ASTRONAUT climbing the elevator access ladder (Stage 5.5 UPDATE #84,
// user): a plain WHITE-suited astronaut (no logos/words), helmet held in the
// RIGHT hand, LEFT hand gripping a rung above the head, near the TOP end of the
// ladder. He stands on the FAR side of the ladder — his BACK is to the building's
// REAR wall and his FACE is toward the ELEVATOR ROOF — so we see his FRONT.
// Generated with the nano-banana model (gemini-3-pro-image-preview) from a red
// wireframe guide (generated/dev/make_wire_astro.py, _nb_gen_astro.py; picked
// astro-gen_2 — front view, skin-toned face, fist gripping a rung, no ladder, no
// floating backpack), keyed/cut with generated/dev/key_cut_astro.py.
// UPDATE #84 r3 (user): (a) the face must have a normal SKIN tone (astro-gen_3
// rendered a bald WHITE head — gen_2 replaces it); (b) the astronaut sits in a
// layer UNDER the ladder, so emitted in `floor-05` BEFORE `elevatorLadder()` —
// the red ladder rails/rungs draw OVER him (he grips it from the far side).
const ASTRO = { file: 'astro-01-cut.png', w: 357, h: 891, k: 0.04740, ax: 8.22, ay: 42.09 }
const ASTRO_ANCHOR = [-6.0, 312, 585] // [u, v = ladder plane, h = foot on a rung] (a bit left of LADDER.uC: the shaft hides anything right of its edge u=0)
// UPDATE #84 r4 (user): exact screen point for the sprite — moves the <image>
// from (516.71, 282.12) to (518.5, 275).
const ASTRO_OFF = [518.5 - 516.71, 275 - 282.12] // = [1.79, -7.12]

// Floor-5 elevator-roof starship (Stage 5.5 UPDATE #81, user): the silver
// Starship-like rocket standing on the shaft roof, nose to the sky. The user
// supplied src/assets/starship.png — a photo of a metal model, ALREADY
// alpha-cut — and asked for the sprite instead of the hand-drawn SVG (a first
// SVG attempt was rejected). Cut/measured with generated/dev/cut_starship.py.
// Billboard sprite; ax/ay = the CYLINDER BASE CENTRE (not the bottommost pixel,
// which is a fin tip 17px lower), so the base sits flush on the platform.
// UPDATE #82 (user): −10% and CENTERED on the roof, standing on a NEW SVG
// platform block — the stack reads [roof] -> [platform] -> [starship].
// Placed with assetProp/starshipShadow at the END of floor-05-front (AFTER
// `elevator`).
const STARSHIP = { file: 'starship-01-cut.png', w: 437, h: 1613, k: 0.10150, ax: 22.43, ay: 162.0 }
const STARSHIP_ANCHOR = [24.1, 266.66] // = the roof's plan centre (SHAFT_U+WALL_T)/2, (V0+V1)/2
// UPDATE #84 r5 (user): nudge ONLY the rocket sprite to an exact screen point —
// the <image> moves (556.3, 112.49) -> (555, 117.5). The launch platform stays
// centred on the roof (r4), so this is a sprite-only offset (it does NOT move
// the base).
const STARSHIP_OFF = [555 - 556.3, 117.5 - 112.49] // = [-1.3, 5.01]
// The SVG launch platform (block) between the roof and the rocket. Concrete
// like the building (dw-slab top + dw-wall sides + a dw-contact seat).
// UPDATE #83 (user): −50% height (16 → 8), +10% footprint (17 → 18.7).
const STARSHIP_BASE = { halfU: 18.7, halfV: 18.7, h: 8 }
function starshipBase() {
  const { halfU, halfV, h } = STARSHIP_BASE
  const [uC, vC] = STARSHIP_ANCHOR
  const u0 = uC - halfU, u1 = uC + halfU
  const v0 = vC - halfV, v1 = vC + halfV
  const h1 = TOP_H + h
  const b = 1.4 // seat overhang
  return [
    el('dw-contact', hFace(u0 - b, u1 + b, v0 - b, v1 + b, TOP_H)), // soft seat on the roof
    el('dw-slab', hFace(u0, u1, v0, v1, h1)), // top (the rocket stands here)
    el('dw-wall', uFace(u0, v0, v1, TOP_H, h1)), // -u side (toward the viewer)
    el('dw-wall', vFace(v0, u0, u1, TOP_H, h1)), // -v side (toward the viewer)
  ]
}
function starshipShadow() {
  const { h } = STARSHIP_BASE
  const [sx, sy] = p(STARSHIP_ANCHOR[0], STARSHIP_ANCHOR[1], TOP_H + h).split(',').map(Number)
  // narrow base shadow: the sprite's width is mostly thin wire fins, so the
  // default spriteShadow width (0.44 * placed width) would be far too wide.
  return [
    `<ellipse cx="${round(sx)}" cy="${round(sy + 0.4)}" rx="11" ry="4.4" fill="#141618" fill-opacity="0.22" filter="url(#dw-soft)" />`,
  ]
}

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
  // AI-workflow board on the rear wall at the D corner (UPDATE #79, user).
  ...aiWorkflowBoard(),
  // Astronaut climbing the access ladder (UPDATE #84, user): emitted HERE, in
  // `floor-05`, BEFORE `elevatorLadder()` — i.e. UNDER the ladder — so the red
  // rails/rungs draw OVER his body (he grips the ladder from its far side, back
  // to the rear wall, face toward the elevator roof). Also under `elevator`, but
  // he sits left of the shaft's silhouette so the shaft does not cover him.
  assetProp(ASTRO, ASTRO_ANCHOR[0], ASTRO_ANCHOR[1], ASTRO_ANCHOR[2], ASTRO_OFF),
  // Floor-5 elevator access ladder (UPDATE #80, user): BELOW the `elevator`
  // fragment, so the shaft occludes its back rail below the roof.
  ...elevatorLadder(),
])

// Stage 5.6 §7 — fifth-floor construction vocabulary. The unfinished top floor
// gets the strongest architectural/mechanical treatment: a service drop on the
// B-D stub wall (infrastructure → wall connection) plus the generated RAIL
// sprite along the open left edge (assetProp, not hand-drawn SVG). The earlier
// chalk layout + rebar stakes were removed on user review (they read as clutter
// between the railing and the elevator).
function floor5Construction() {
  const H = 5 * FH
  const out = []
  // Service connection on the B-D stub wall: a wall-mounted junction box with a
  // conduit drop that turns onto the floor (infrastructure → wall connection).
  // Uses the building-projection box idiom (not a flat sprite), so it reads as
  // mounted, like the Stage 5.5 junction boxes. Placed at the near (front) end
  // of the stub, clear of the toysite's screen footprint.
  out.push(...boxOnUWall(224, LW - WALL_T, 12, 26, H + 8, H + 22))
  out.push(
    ...segRun([
      [LW - WALL_T, 19, H + 8],
      [LW - WALL_T, 19, H + 1],
      [LW - WALL_T - 6, 24, H + 0.5],
    ]),
  )
  return out
}

const floor05Front = group('floor-05-front', [
  ...slabTriangle(5 * FH),
  // Stage 5.6 §9 — the most exposed/unfinished slab: extra joints and support
  // brackets under the open front edge (clear of the Pacer legacy corner below
  // the B end, hence u ≤ 196).
  ...slabDetail(5 * FH, { seams: [40, 96, 170, 214], brackets: [56, 140] }),
  ...columns(5 * FH, TOP_H, ['A', 'B', 'C']),
  // Stub walls (incomplete masonry) on the two back walls with visible tops;
  // far faces like the completed floors' rear walls (Stage 4 §8).
  el('dw-wall-far', uFace(LW - WALL_T, 0, STUB_LEN * LD - WALL_T, 5 * FH, 5 * FH + STUB_H)),
  el('dw-slab-edge', vFace(0, LW - WALL_T, LW, 5 * FH, 5 * FH + STUB_H)),
  el('dw-slab', hFace(LW - WALL_T, LW, 0, STUB_LEN * LD - WALL_T, 5 * FH + STUB_H)),
  el('dw-wall-far', vFace(LD - WALL_T, 0, STUB_LEN * LW, 5 * FH, 5 * FH + STUB_H)),
  el('dw-slab-edge', uFace(0, LD - WALL_T, LD, 5 * FH, 5 * FH + STUB_H)),
  el('dw-slab', hFace(0, STUB_LEN * LW, LD - WALL_T, LD, 5 * FH + STUB_H)),
  // Stage 5.6 §10 — fifth-floor stub wall wear: a used, unfinished surface
  // (right of the AI-acceleration screen at u 19..75, on the visible stub).
  ...surfaceWear('u', LD - WALL_T - 0.3, 78, 94, 5 * FH + 6, 5 * FH + 40, 55),
  // Stage 5.6 §7 — construction service intervention (B-D stub junction box +
  // conduit). Drawn after the stub walls so the box sits on the B-D stub;
  // before the people so they read in front of it.
  ...floor5Construction(),
  // The generated temporary safety railing, standing along the open left edge
  // (billboard anchored on the near post base). Emitted here, on the floor, so
  // the people nearby read in front of it.
  spriteShadow(RAIL, RAIL_ANCHOR[0], RAIL_ANCHOR[1], 5 * FH, undefined, 1.5, { opacity: 0.16 }),
  assetProp(RAIL, RAIL_ANCHOR[0], RAIL_ANCHOR[1], 5 * FH),
  // AI-acceleration screen on the rear-wall stub (UPDATE #86, user): the user's
  // red-marked surface. Drawn AFTER the stub so it paints on the wall.
  ...aiAccelerationScreen(),
  // Worried person reacting to the AI-acceleration screen (UPDATE #87/#88, user):
  // stands on the floor just right of the screen, turned to FACE it (rear 3/4
  // view). Drawn after the screen so he reads in front of the wall.
  spriteShadow(WORRIED, WORRIED_ANCHOR[0], WORRIED_ANCHOR[1], 5 * FH),
  assetProp(WORRIED, WORRIED_ANCHOR[0], WORRIED_ANCHOR[1], 5 * FH),
  // CV-TOSSER (UPDATE #85, user): the person flinging his CVs up and toward the
  // right wall, in the centre of the open fifth-floor area between the elevator
  // and the right wall. Farther from the viewer than the toysite/whipper (larger
  // v), so emitted before them.
  spriteShadow(CVTOSS, CVTOSS_ANCHOR[0], CVTOSS_ANCHOR[1], 5 * FH),
  assetProp(CVTOSS, CVTOSS_ANCHOR[0], CVTOSS_ANCHOR[1], 5 * FH),
  ...cvTossPapers(),
  // Toysite (UPDATE #74, user): the half-built toy building + four worker robots
  // in the B (front-right) corner. Drawn LAST so the scene reads in front of the
  // right-wall stub; sits on the floor-5 slab (h = 5 * FH).
  spriteShadow(TOYSITE, TOYSITE_ANCHOR[0], TOYSITE_ANCHOR[1], 5 * FH, TOYSITE_OFF, 1.1),
  assetProp(TOYSITE, TOYSITE_ANCHOR[0], TOYSITE_ANCHOR[1], 5 * FH, TOYSITE_OFF),
  // Whipper (UPDATE #76, user): to the LEFT of the crew, facing the robots.
  spriteShadow(WHIPPER, WHIPPER_ANCHOR[0], WHIPPER_ANCHOR[1], 5 * FH),
  assetProp(WHIPPER, WHIPPER_ANCHOR[0], WHIPPER_ANCHOR[1], 5 * FH),
  // The whip lash cracking from his hand toward the robots.
  ...whipperWhip(),
  // Starship on the elevator roof (UPDATE #81–#84, user): an SVG launch
  // platform, then the silver sprite on top — [roof] -> [platform] ->
  // [starship] — the platform centred on the roof's plan centre (no nudge, so
  // it never overhangs), and the SPRITE nudged to the exact requested screen
  // point (STARSHIP_OFF). Drawn here — AFTER `elevator`.
  ...starshipBase(),
  ...starshipShadow(),
  assetProp(STARSHIP, STARSHIP_ANCHOR[0], STARSHIP_ANCHOR[1], TOP_H + STARSHIP_BASE.h, STARSHIP_OFF),
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
// Floor-specific elevator detailing (Stage 5.6 §4/§8): a wall-mounted
// indicator and a small maintenance panel beside the doors, plus a base collar
// at the slab junction, so the core reads as part of the building. Each story
// gets a DIFFERENT combination (the spec forbids repeating one decoration on
// every floor); hand-drawn fixture sprites stay off the shaft face (user
// rejected them in r185/r186) — only the built-in collar, indicator, seam and
// conduit vocabulary is used.
function elevatorStoryDetails(
  hBase,
  { indicator = true, seam = true, panel = false, conduit = false, riser = false, warning = false } = {},
) {
  const vW2 = SHAFT_V0 - WALL_T
  const out = []
  // base collar at the slab intersection (just above the floor line)
  out.push(el('dw-slab-edge', vFace(vW2 - 0.2, 0, SHAFT_U + WALL_T, hBase + 0.5, hBase + 4)))
  // indicator light right of the doors
  if (indicator) out.push(...indicatorLight('u', vW2 - 0.5, DOOR_U1 + 5, hBase + DOOR_H - 12, { r: 1.2 }))
  // subtle technical marking (a seam) right of the doors
  if (seam)
    out.push(el('dw-door-line', `M ${p(DOOR_U1 + 3, vW2 - 0.4, hBase + 20)} L ${p(DOOR_U1 + 3, vW2 - 0.4, hBase + 46)}`))
  // full-height service riser beside the doors (story 1 variant)
  if (riser)
    out.push(
      el('dw-conduit-line', `M ${p(DOOR_U1 + 3.5, vW2 - 0.4, hBase + 1)} L ${p(DOOR_U1 + 3.5, vW2 - 0.4, hBase + STORY_H)}`),
    )
  // compact maintenance access panel: a plain rectangular outline low beside
  // the doors (a marking, not a fixture sprite)
  if (panel) {
    const u0 = DOOR_U1 + 1.5
    const u1 = DOOR_U1 + 5.5
    const p0 = hBase + 9
    const p1 = hBase + 26
    out.push(
      el('dw-door-line', `M ${p(u0, vW2 - 0.4, p0)} L ${p(u1, vW2 - 0.4, p0)} L ${p(u1, vW2 - 0.4, p1)} L ${p(u0, vW2 - 0.4, p1)} Z`),
    )
  }
  // short conduit connection from the panel down into the slab
  if (conduit)
    out.push(el('dw-conduit-line', `M ${p(DOOR_U1 + 3.5, vW2 - 0.4, hBase + 9)} L ${p(DOOR_U1 + 3.5, vW2 - 0.4, hBase + 4)}`))
  // small red warning/technical mark beside the doors
  if (warning) out.push(...indicatorLight('u', vW2 - 0.5, DOOR_U1 + 3.5, hBase + 32, { red: true, r: 1.0 }))
  return out
}

function elevator() {
  const out = []
  for (let story = 1; story <= 5; story++) {
    const hBase = story * FH
    out.push(...shaftStory(hBase, story < 5 ? hBase + STORY_H : TOP_H, { openDoors: story === 5 }))
    // A DIFFERENT combination per story (spec §8): no single decoration repeats.
    // Story 1: collar + a full-height service riser (no light).
    if (story === 1) out.push(...elevatorStoryDetails(hBase, { indicator: false, seam: false, riser: true }))
    // Story 2: collar + indicator + seam (the approved baseline).
    if (story === 2) out.push(...elevatorStoryDetails(hBase))
    // Story 3: collar + indicator + seam + a red warning mark.
    if (story === 3) out.push(...elevatorStoryDetails(hBase, { warning: true }))
    // Story 4: collar + indicator + maintenance panel + conduit drop.
    if (story === 4) out.push(...elevatorStoryDetails(hBase, { seam: false, panel: true, conduit: true }))
    // Story 5 (open doors, unfinished): a minimal collar + indicator only, so
    // the core stays compatible with the open-air construction floor.
    if (story === 5) out.push(...elevatorStoryDetails(hBase, { seam: false }))
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
  out.push(el('dw-conduit', uFace(-1.5, SHAFT_V1 - 12, SHAFT_V1 - 9, FH, TOP_H)))
  for (let story = 1; story <= 5; story++) {
    out.push(...boxOnUWall(-1.5, 0, SHAFT_V1 - 15, SHAFT_V1 - 3, story * FH + 22, story * FH + 34))
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

// --- QR code (Stage 7 information layer) ------------------------------------
// Build a single-path QR for `text` with high error correction (level H, so a
// centered logo is safely recoverable). Modules are run-length merged per row
// to keep the path compact. Returns the path data and the module count
// including the quiet-zone margin.
function qrPath(text, margin = 2) {
  const qr = QRCode.create(text, { errorCorrectionLevel: 'H' })
  const n = qr.modules.size
  const data = qr.modules.data
  const dark = (r, c) => (r >= 0 && r < n && c >= 0 && c < n ? data[r * n + c] : 0)
  let d = ''
  for (let r = 0; r < n; r++) {
    let c = 0
    while (c < n) {
      if (dark(r, c)) {
        let c2 = c
        while (c2 < n && dark(r, c2)) c2++
        d += `M${c + margin} ${r + margin}h${c2 - c}v1h-${c2 - c}z`
        c = c2
      } else c++
    }
  }
  return { d, total: n + 2 * margin }
}

// LinkedIn "in" mark (Ant Design `linkedin-filled`, MIT, viewBox 1024) drawn
// with fill-rule evenodd so the inner cutouts read as the glyph. Used only as
// the QR centre logo.
const LINKEDIN_GLYPH =
  'M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32M349.3 793.7H230.6V411.9h118.7zm-59.3-434a68.8 68.8 0 1 1 68.8-68.8c-.1 38-30.9 68.8-68.8 68.8m503.7 434H675.1V608c0-44.3-.8-101.2-61.7-101.2c-61.7 0-71.2 48.2-71.2 98v188.9H423.7V411.9h113.8v52.2h1.6c15.8-30 54.5-61.7 112.3-61.7c120.2 0 142.3 79.1 142.3 181.9z'

// --- projecting-sign: vertical blade at the front-right corner --------------
// Stage 6: a vertical blade sign mounted at the building's front-right corner
// (corner B) projecting outward along the DEPTH axis, rear -> front. Broad
// faces are constant-u; the -u face is the one the camera sees. Stage 7 now
// supplies the real personal-identification content: circular profile photo,
// first + last name, a LinkedIn QR code and the LinkedIn URL (PROJECT_BRIEF.md
// §8). Stage 7 review widened the blade 25% (deeper along -v) so the content
// could be larger and more legible. The casing, mounting arms, perspective and
// placement are unchanged; the sign carries NO current job titles, company or
// technology lists.
//
// The panel content is authored in the panel's own local coordinates via one
// matrix (like the wall sheets): origin at the panel's top-back corner, local
// +x along -v (toward the viewer), local +y downward in h. This foreshortens
// the content exactly with the sign face, so the decal reads as painted on the
// blade rather than pasted facing the camera.
function projectingSign() {
  const uNear = LW - 11 // visible (-u) broad face
  const uFar = LW - 1 // hidden (+u) broad face (blade thickness 10)
  const vBack = -12 // blade inner edge: small gap off the building front
  const vFront = -122 // blade outer (front) edge (was -100; +25% width review)
  const h0 = FH + 2 // spans the floor-2 story...
  const h1 = 3 * FH - 2 // ...and the floor-3 story
  const out = []
  // Closed volume: far face, bottom/top caps and the front end edge.
  out.push(el('dw-sign', uFace(uFar, vFront, vBack, h0, h1)))
  out.push(el('dw-sign-frame', hFace(uNear, uFar, vFront, vBack, h0)))
  out.push(el('dw-sign-frame', hFace(uNear, uFar, vFront, vBack, h1)))
  out.push(el('dw-sign-frame', vFace(vFront, uNear, uFar, h0, h1)))
  // Two mounting arms bridging the gap from the wall's front end (v = 0) to the
  // blade, each with a wall plate and screw/nail attachment points.
  const armH = 8
  for (const ha of [h0 + 20, h1 - 20 - armH]) {
    out.push(el('dw-jbox', uFace(uNear, vBack, 0, ha, ha + armH)))
    out.push(el('dw-jbox', hFace(uNear, uFar, vBack, 0, ha + armH)))
    out.push(el('dw-jbox', vFace(0, uNear, uFar, ha, ha + armH)))
    out.push(dot(uNear + 1.5, -1.5, ha + armH / 2))
    out.push(dot(uFar - 1.5, -1.5, ha + armH / 2))
  }
  // Casing frame + inset panel on the visible (-u) face.
  out.push(el('dw-sign-frame', uFace(uNear, vFront, vBack, h0, h1)))
  out.push(el('dw-sign', uFace(uNear - 0.7, vFront + 5, vBack - 5, h0 + 5, h1 - 5)))

  // Panel-local matrix: local x (0..110, panel width toward -v), local y
  // (0..206, panel height downward). Origin = panel top-back corner.
  const [ox, oy] = p(uNear, vBack, h1).split(',').map(Number)
  const cx = 55 // panel-local horizontal centre
  const panel = []
  // Circular profile photo (raster master, replaceable via IDENTITY.photo).
  const pcy = 40
  const pr = 24
  panel.push(
    `<defs><clipPath id="dw-sign-photo"><circle cx="${cx}" cy="${pcy}" r="${pr}" /></clipPath></defs>`,
  )
  panel.push(
    `<image href="${inlineAsset(IDENTITY.photo)}" x="${cx - pr}" y="${pcy - pr}" width="${pr * 2}" height="${pr * 2}" preserveAspectRatio="xMidYMid slice" clip-path="url(#dw-sign-photo)" />`,
  )
  // Ring must be a dedicated fill:none class — a presentation fill attribute
  // would be overridden by the CSS class (Stage 6 sign had none, so the wood
  // fill painted a disc over the photo).
  panel.push(`<circle class="dw-photo-ring" cx="${cx}" cy="${pcy}" r="${round(pr + 0.6)}" />`)
  // First + last name.
  panel.push(`<text class="dw-sign-name" x="${cx}" y="86" text-anchor="middle">${IDENTITY.name}</text>`)
  // LinkedIn QR (ECC-H) with a centered LinkedIn logo.
  const qr = qrPath(IDENTITY.linkedin, 2)
  const qrSize = 64
  const qrX = cx - qrSize / 2
  const qrY = 100
  const qs = qrSize / qr.total
  panel.push(
    `<rect class="dw-qr-plate" x="${round(qrX - 3)}" y="${round(qrY - 3)}" width="${qrSize + 6}" height="${qrSize + 6}" />`,
  )
  panel.push(
    `<g transform="translate(${round(qrX)} ${round(qrY)}) scale(${round(qs)})"><path class="dw-qr" d="${qr.d}" /></g>`,
  )
  const gcx = qrX + qrSize / 2
  const gcy = qrY + qrSize / 2
  const gplate = 15
  const gsize = 11.5
  panel.push(
    `<rect class="dw-qr-plate" x="${round(gcx - gplate / 2)}" y="${round(gcy - gplate / 2)}" width="${gplate}" height="${gplate}" rx="1.6" />`,
  )
  panel.push(
    `<g transform="translate(${round(gcx - gsize / 2)} ${round(gcy - gsize / 2)}) scale(${round(gsize / 1024)})"><path class="dw-ln" fill-rule="evenodd" d="${LINKEDIN_GLYPH}" /></g>`,
  )
  // Full LinkedIn URL (the QR is the scannable copy).
  const urlLabel = IDENTITY.linkedin.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
  panel.push(`<text class="dw-sign-link" x="${cx}" y="${round(qrY + qrSize + 16)}" text-anchor="middle">${urlLabel}</text>`)

  out.push(`<g transform="matrix(0.7071 0.2475 0 1 ${round(ox)} ${round(oy)})">`, ...panel.map((p2) => `  ${p2}`), `</g>`)
  // Stage 10 — the sign's complete graphical group is one link to the
  // canonical profile, so clicking the photo, the name, the QR, the printed
  // URL or any background/border area all open the same destination.
  return group('projecting-sign', [
    svgLink(IDENTITY.linkedin, tagGroup(out, 'dw-sign-group'), 'Open LinkedIn profile'),
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
  // `role` (optional, Stage 8): a second mini board ABOVE the company sign
  // carrying the section role, so Overview associates the two (the role label
  // moves off its door/wall/floor onto the sign). Hidden in Detailed.
  { text: 'Puelo Games', floor: 0, c: 82, role: SECTIONS.puelo.role },
  { text: 'BA Technology', floor: 0, c: 282, role: SECTIONS.ba.role },
  { text: 'Freelancer Game Dev', floor: 0, c: 477 },
  { text: 'Health Platforms', floor: 1, c: 135 },
  { text: 'Nextcode', floor: 1, c: 470, role: SECTIONS.nextcode.role },
  { text: 'Interactica', floor: 2, c: 135, role: SECTIONS.interactica2right.role },
  { text: 'Interactica', floor: 2, c: 470, role: SECTIONS.interactica2left.role },
  { text: 'Interactica', floor: 3, c: 135 },
  { text: 'Indelve', floor: 3, c: 470 },
  { text: 'Pacer', floor: 4, c: 135 },
  { text: 'Pacer', floor: 4, c: 470 },
  { text: 'WIP', floor: 5, c: 135 },
  { text: 'WIP', floor: 5, c: 470 },
]

// A small role plaque on the invisible left wall (Stage 8 Overview): the board
// faces + the role text, sized to the role string. Shared by the mini board
// above a company sign and the standalone Pacer mid board.
function roleMiniBoard(u, c, h0, h1, role) {
  const roleHalf = (role.length * TAG_CHAR_W * 0.72) / 2 + 5
  const hMid = (h0 + h1) / 2
  const [x, y] = p(u, c, hMid).split(',')
  return [
    el('dw-tag', uFace(u, c - roleHalf, c + roleHalf, h0, h1)),
    el('dw-tag', hFace(u, 0, c - roleHalf, c + roleHalf, h1)),
    el('dw-tag', vFace(c - roleHalf, u, 0, h0, h1)),
    `<text class="dw-tag-role-text" transform="matrix(${TAG_MATRIX} ${x} ${y})" text-anchor="middle" dominant-baseline="central">${role}</text>`,
  ]
}

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
    // Stable per-sign class (Stage 8) so a specific company sign can be
    // scaled/tuned individually in Overview mode without duplicating it or
    // touching inline attributes (see the `.dw-tag-*` rules in style.mjs).
    const slug = tag.text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const children = [
      el('dw-tag', uFace(u, tag.c - half, tag.c + half, h0, h1)),
      el('dw-tag', hFace(u, 0, tag.c - half, tag.c + half, h1)),
      el('dw-tag', vFace(tag.c - half, u, 0, h0, h1)),
      dot(u, tag.c - textHalf - DOT_GAP, hMid),
      dot(u, tag.c + textHalf + DOT_GAP, hMid),
      `<text class="dw-tag-text" transform="matrix(${TAG_MATRIX} ${x} ${y})" text-anchor="middle" dominant-baseline="central">${tag.text}</text>`,
    ]
    // Optional role mini board above the sign (Stage 8, Overview): the section
    // role sits on its own smaller plaque just above the company sign, so it
    // scales with the sign and reads as one unit. Hidden in Detailed
    // (`.dw-tag-role`), shown in Overview.
    if (tag.role) {
      const rh0 = h1 + 2.5
      children.push(
        `<g class="dw-tag-role">`,
        ...roleMiniBoard(u, tag.c, rh0, rh0 + 10, tag.role).map((l) => `  ${l}`),
        `</g>`,
      )
    }
    out.push(tagGroup(children, `dw-tag-group dw-tag-${slug}`))
  }
  // Pacer (Stage 8 Overview): "Software Architect" is a standalone mid board
  // BETWEEN the two Pacer signs (c 135 and 470), i.e. centred on the elevator's
  // depth (c ≈ 302.5). It is its own `.dw-tag-group` so the Overview 1.8× rule
  // scales it in place like the company signs; `.dw-tag-role` hides it in
  // Detailed.
  const pacerMidH0 = 4 * FH + TAG_H0 + 3
  out.push(
    tagGroup(
      roleMiniBoard(-1.5, 302.5, pacerMidH0, pacerMidH0 + 10, SECTIONS.pacer.role),
      'dw-tag-group dw-tag-role dw-tag-mid',
    ),
  )
  return group('tags', out)
}

// --- information: section roles + technology logos (Stage 7) -----------------
// The information layer (STAGE_07_INFORMATION_LAYER.md). ALL content comes from
// scripts/career-data.mjs (SECTIONS) and scripts/tech-logos.mjs — never from
// geometry. Stage 7 review: the earlier all-in-one experience plaques were
// removed in favour of two lighter devices, placed per section:
//   - a small role label (e.g. "Unity Dev", "DBA", "Tech Lead"), set either
//     over a section door, on the building's invisible left wall, or flat on
//     the floor;
//   - brand technology logos, lying flat on the section's floor (or on the
//     left wall for the DBA / architect sections).
// The current professional identity stays on the fifth-floor rear wall.
// Everything is one `information` group so a future display-mode switch
// (Stage 8) can show/hide it as a unit; no switch is implemented here.
const INFO_WALL_U = -1.5 // the invisible left wall (same plane as the tags)
// Floor plane, orientation-preserving: local +x → +u (up-right), local +y → -v
// (down-right) so glyph "up" points up-left and text/logos are not mirrored.
const FLOOR_MATRIX = '0.7071 -0.2475 0.7071 0.2475'
// Floor plane rotated 90° in-plan (local +x → -v): text reads along the depth
// axis (down-right), like the wall tags; used for the floor-2 "Tech Lead".
const FLOOR_MATRIX_D = '0.7071 0.2475 -0.7071 0.2475'
const UPLANE_MATRIX = TAG_MATRIX // constant-u wall: +x→-v, +y down
const VPLANE_MATRIX = '0.7071 -0.2475 0 1' // constant-v wall: +x→+u, +y down

// One technology logo on its small plate, centred at local origin of `matrix`.
// `dx`/`dy` are an optional SCREEN-space nudge (SVG user units) applied after
// the plane projection — used for the user's fine per-logo position tweaks.
// The wrapper carries the `dw-logo` class so the WHOLE plate (rect + brand art)
// can be hidden as one unit in Overview mode (Stage 8) — hiding only
// `.dw-logo-plate` would leave the logo artwork painted.
function logoPlate(logo, ox, oy, matrix, size, dx = 0, dy = 0) {
  const s = (size * 0.64) / 24 // 24 is the logo viewBox
  const half = size / 2
  const art = logo.body
    ? `<g transform="translate(${round(-12 * s)} ${round(-12 * s)}) scale(${round(s)})">${logo.body}</g>`
    : `<g transform="translate(${round(-size * 0.32)} ${round(-size * 0.32)}) scale(${round(s)})"><path fill="${logo.color}" d="${logo.d}" /></g>`
  const shift = dx || dy ? `translate(${round(dx)} ${round(dy)}) ` : ''
  return [
    `<g class="dw-logo" transform="${shift}matrix(${matrix} ${round(ox)} ${round(oy)})">`,
    `  <rect class="dw-logo-plate" x="${-half}" y="${-half}" width="${size}" height="${size}" rx="${round(size * 0.16)}" />`,
    `  ${art}`,
    `</g>`,
  ]
}

// A row of logo plates lying flat on a floor (u0 start, given v, given hTop).
function floorLogoRow(keys, u0, v, hTop, size = 36) {
  const step = size * 1.28
  return keys.flatMap((key, i) => floorLogo(key, u0 + i * step, v, hTop, size))
}
function floorLogo(key, u, v, hTop, size = 36, dx = 0, dy = 0) {
  const logo = TECH_LOGOS[key]
  if (!logo) return []
  const [ox, oy] = p(u, v, hTop).split(',').map(Number)
  return logoPlate(logo, ox, oy, FLOOR_MATRIX, size, dx, dy)
}

// Like floorLogo, but read ALONG THE DEPTH AXIS: the floor plane rotated 90°
// (same orientation as the f2 "Tech Lead" label). Still lying flat on the
// floor, just reading rear↔front instead of across the width.
function floorLogoDepth(key, u, v, hTop, size = 36, dx = 0, dy = 0) {
  const logo = TECH_LOGOS[key]
  if (!logo) return []
  const [ox, oy] = p(u, v, hTop).split(',').map(Number)
  return logoPlate(logo, ox, oy, FLOOR_MATRIX_D, size, dx, dy)
}

// One logo plate on the invisible left wall at (v, h).
function wallLogo(key, v, h, size = 34) {
  const logo = TECH_LOGOS[key]
  if (!logo) return []
  const [ox, oy] = p(INFO_WALL_U, v, h).split(',').map(Number)
  return logoPlate(logo, ox, oy, UPLANE_MATRIX, size)
}

// A row of left-wall logos CENTRED on vCenter (runs along +v).
function wallLogoRowCentered(keys, vCenter, h, size = 34) {
  const step = size * 1.28
  const start = vCenter - (step * (keys.length - 1)) / 2
  return keys.flatMap((key, i) => {
    const logo = TECH_LOGOS[key]
    if (!logo) return []
    const [ox, oy] = p(INFO_WALL_U, start + i * step, h).split(',').map(Number)
    return logoPlate(logo, ox, oy, UPLANE_MATRIX, size)
  })
}

// One logo plate on a constant-v wall face (faces the viewer, -v); local +x
// runs along +u. Used for logos mounted on the staircase's solid side wall.
function frontLogo(key, u, v, h, size = 36, dx = 0, dy = 0) {
  const logo = TECH_LOGOS[key]
  if (!logo) return []
  const [ox, oy] = p(u, v, h).split(',').map(Number)
  return logoPlate(logo, ox, oy, VPLANE_MATRIX, size, dx, dy)
}

const label = (text, x, y, matrix, cls) =>
  `<text class="${cls}" transform="matrix(${matrix} ${x} ${y})" text-anchor="middle" dominant-baseline="central">${text}</text>`

// Role text on the invisible left wall.
function wallLabel(text, v, h, cls = 'dw-role-wall') {
  if (!text) return []
  const [x, y] = p(INFO_WALL_U, v, h).split(',')
  return [label(text, x, y, UPLANE_MATRIX, cls)]
}
// Role text over a ground-floor section door (on the partition's near face).
function doorLabel(text, v, cls = 'dw-role-door') {
  if (!text) return []
  const [x, y] = p(42.5, v, DOOR_H + 9).split(',')
  return [label(text, x, y, VPLANE_MATRIX, cls)]
}
// Role text lying flat on a floor.
function floorLabel(text, u, v, h, cls = 'dw-role-floor') {
  if (!text) return []
  const [x, y] = p(u, v, h).split(',')
  return [label(text, x, y, FLOOR_MATRIX, cls)]
}
// Role text lying flat on a floor, read along the depth axis.
function floorLabelDepth(text, u, v, h, cls = 'dw-role-floor') {
  if (!text) return []
  const [x, y] = p(u, v, h).split(',')
  return [label(text, x, y, FLOOR_MATRIX_D, cls)]
}
// Role text on a constant-v wall face (e.g. above the elevator doors).
function frontLabel(text, u, v, h, cls = 'dw-role-wall') {
  if (!text) return []
  const [x, y] = p(u, v, h).split(',')
  return [label(text, x, y, VPLANE_MATRIX, cls)]
}

// Wrap role-label element(s) so Overview can reposition them (Stage 8): the
// inner text keeps its plane matrix; the wrapper <g> carries the Overview
// screen-space translate (user units) as CSS custom properties, applied by the
// matching `.dw-mode-overview .<cls>` rule in style.mjs. Detailed is untouched.
function modeLabelWrap(cls, dx, dy, lines) {
  return [`<g class="${cls}" style="--ovx:${round(dx)}px;--ovy:${round(dy)}px">`, ...lines, `</g>`]
}

// --- information layer, per floor (Stage 7) ---------------------------------
// The layer is split into ONE fragment per floor so the floor above occludes
// the deeper logos/labels exactly like any other prop (the earlier single
// fragment was drawn last and floated over the building). Each fragment is
// assembled immediately after its floor (see assemble-svg.mjs) and stays a
// single toggleable group. Content comes from scripts/career-data.mjs and
// scripts/tech-logos.mjs.
function informationGround() {
  const S = SECTIONS
  const out = []
  out.push(...doorLabel(S.puelo.role, PARTITION_G[0], 'dw-role-door-lg dw-role-puelo')) // Unity Dev (Overview: moved onto the sign's mini board)
  out.push(...doorLabel(S.ba.role, PARTITION_G[1], 'dw-role-door dw-role-ba')) // over the BA↔Freelancer door (Overview: moved onto the sign's mini board)
  // Puelo: unity on the floor, moved toward the kiosk/TV (+u) so the entrance
  // jambs no longer cover it; c# mounted on the ground-floor left wall toward
  // the front-left corner, clearly on the wall (moved off the vent area), and
  // reduced another 10%.
  out.push(...floorLogo(S.puelo.tech[0], 170, 42, 0, 45)) // unity (+25%)
  out.push(...wallLogo(S.puelo.tech[1], 22, 38, 29)) // c# (-10% again): horizontally centred on the left wall
  // BA: both logos lie flat on the floor but read ALONG THE DEPTH AXIS
  // (user revision: "oriented from the building's right to left wall", still on
  // the floor plane) — the same floor-plane matrix as the f2 "Tech Lead".
  // (php is emitted inside `floor-ground` BEFORE the BA wall/partition geometry
  // so those occlude its far edge — user revision "in a layer below the
  // left-wall part".) jQuery sits between php and mysql (user revision).
  out.push(...floorLogoDepth(S.ba.tech[1], 26, 378, 0, 45)) // mysql: by the BA↔Freelancer door
  out.push(...floorLogoDepth('jquery', 26, 305, 0, 45)) // jquery: between php (v235) and mysql (v378)
  // Freelancer: both logos attached to the staircase's solid side wall
  // (v = STAIR_V0). User r221: c# +10px right, unity +5px down-right.
  // User r222: both −15%.
  out.push(...frontLogo(S.freelancer.tech[1], 58, STAIR_V0 - 0.4, 15, 23, 5, -5)) // c# (r223: 5px left-top)
  out.push(...frontLogo(S.freelancer.tech[0], 88, STAIR_V0 - 0.4, 40, 23, 5, 5)) // unity
  return group('information-ground', out)
}

function information01() {
  const S = SECTIONS
  const out = []
  out.push(...floorLogo('nodedotjs', 156, 560, FH)) // stair top, toward the right wall
  out.push(...floorLogo('mongodb', 140, 479, FH)) // around/behind the dev sprites
  out.push(...floorLogo('angular', 26, 408, FH)) // between the boxes and the people
  // Co-Founder: moved onto the floor beside the staircase opening and read
  // along the arrowed line (user revision), i.e. the u-axis at v ~ 530. Enlarged
  // 25% and given the same light keyline halo as the other role labels
  // (`.dw-role-floor-md`, in the role group).
  out.push(...floorLabel(S.nextcode.role, 52, 530, FH, 'dw-role-floor-md dw-role-nextcode'))
  // Health Platforms (left-wall part, centred on v 85): a diamond — DBA at the
  // top, aws/mysql on the sides, salesforce at the bottom. aws pulled further
  // left (+v) and mysql further right (−v) to open the gap to the salesforce
  // plate's top corners (user revision). Stage 8 Overview: the logo plates are
  // hidden, so the DBA label is moved down (and enlarged) to the CENTRE of the
  // wall part (the partial wall v 20–150, h FH–FH+STORY_H → centre h 151.25);
  // Detailed keeps it at the top of the diamond. Δh = 151.25 − (FH+74) = −27.75.
  const hc = 85
  out.push(...modeLabelWrap('dw-role-dba', 0, 27.75, wallLabel(S.health.role, hc, FH + 74)))
  out.push(...wallLogo(S.health.tech[1], hc + 38, FH + 48, 34)) // aws (+v side)
  out.push(...wallLogo(S.health.tech[0], hc - 38, FH + 48, 34)) // mysql (−v side)
  out.push(...wallLogo(S.health.tech[2], hc, FH + 22, 34)) // salesforce (bottom)
  return group('information-01', out)
}

function information02() {
  const S = SECTIONS
  const out = []
  // f2-left: "Tech Lead" on the floor beside the tech-lead + seated devs,
  // read along the depth axis (user revision, matching the red line).
  out.push(...floorLabelDepth(S.interactica2left.role, 55, 537, 2 * FH, 'dw-role-floor-xl dw-role-f2left')) // Tech Lead (Overview: moved onto the sign's mini board)
  out.push(...floorLogoRow(S.interactica2left.tech, 46, 470, 2 * FH))
  return group('information-02', out)
}

// Interactica f2-right floor logos. Assembled AFTER `floor-02-front-base` (the
// opaque floor repaint) so they stay visible, but BEFORE `floor-02-front` — so
// nestjs and angular sit BELOW the kiosk sprite and the floor-2/3 corner line
// (user r219 revision).
function information02Front() {
  const out = []
  out.push(...floorLogo('nestjs', 150, 118, 2 * FH, 41)) // +15%, same corner desks
  out.push(...floorLogo('mongodb', 46, 178, 2 * FH, 36, -10, 0)) // off the kiosk cable; user r221: 10px left
  out.push(...floorLogo('angular', 24, 40, 2 * FH)) // near the left front wall corner
  return group('information-02-front', out)
}

function information03() {
  const S = SECTIONS
  const out = []
  // Interactica f3 right ("Software Architect"): the label is two rows
  // ("Software" / "Architect", user revision) over the floor-3 left-wall part
  // (partialWall v 75..161 → centre 118); tech logos −10%. Stage 8 Overview:
  // the logos are hidden, so the two-row label moves down (and enlarges) to the
  // CENTRE of the wall part (partial wall h 3·FH–3·FH+STORY_H → centre 361.25;
  // the two rows currently centre at 389.5). Δh = 361.25 − 389.5 = −28.25.
  const c = 118
  const [l1, l2] = S.interactica3right.role.split(' ')
  out.push(
    ...modeLabelWrap('dw-role-f3sa', 0, 28.25, [
      ...wallLabel(l1, c, 3 * FH + 80), // "Software"
      ...wallLabel(l2, c, 3 * FH + 69), // "Architect"
    ]),
  )
  out.push(...wallLogoRowCentered([S.interactica3right.tech[0], S.interactica3right.tech[1]], c, 3 * FH + 44, 26))
  out.push(...wallLogoRowCentered([S.interactica3right.tech[2], S.interactica3right.tech[3]], c, 3 * FH + 16, 26))
  return group('information-03', out)
}

// Pacer (floor-4) technology logos (user r222). Two floor rows, no role label:
//   - GROUP A — near the building's LEFT wall (A-C) at the front (A) corner,
//     read along the depth axis ("oriented to that side").
//   - GROUP B — near the building's REAR wall (C-D), on the left, a line running
//     from just in front of the WhatsApp chat screen into the interior.
// Both rows lie flat on the floor. Emitted in their own fragment, assembled
// AFTER `floor-04-front` (so the front slab repaint/legacy layers don't cut
// them) and before `floor-05-front`.
function information04() {
  const S = SECTIONS
  const H = 4 * FH
  const out = []
  // Pacer role label on the left side, close to the rear (C-D) wall (inner face
  // at v 580.5) and clear of the dev cluster (v 435), reading PARALLEL to the
  // rear wall (along the width axis, +u).
  out.push(...floorLabel(S.pacer.role, 112, 566, H, 'dw-role-pacer')) // Software Architect (+15% in Overview)
  out.push(...floorLogoDepth(S.pacer.tech[0], 24, 62, H)) // githubactions
  out.push(...floorLogoDepth(S.pacer.tech[1], 24, 132, H)) // nestjs
  out.push(...floorLogoDepth(S.pacer.tech[2], 24, 202, H)) // postgresql
  out.push(...floorLogoDepth(S.pacer.tech[3], 36, 560, H)) // aws
  out.push(...floorLogoDepth(S.pacer.tech[4], 36, 495, H)) // docker
  out.push(...floorLogoDepth(S.pacer.tech[5], 36, 430, H)) // opentelemetry
  return group('information-04', out)
}

// Elevator-mounted role labels. The elevator fragment paints the W2 face, so a
// label there must be assembled AFTER `elevator`; it lives in its own fragment
// (see assemble-svg.mjs).
function informationElev() {
  const S = SECTIONS
  const out = []
  out.push(...frontLabel(S.interactica2right.role, (DOOR_U0 + DOOR_U1) / 2, SHAFT_V0 - WALL_T, 2 * FH + DOOR_H + 18, 'dw-role-wall dw-role-f2right')) // Dev over the "2" (Overview: moved onto the sign's mini board)
  return group('information-elev', out)
}

// Nextcode staffage (desk, crates and the dev group sprite), lifted out of
// floor-01 into its own fragment so the floor tech-logo decals in
// information-01 render BELOW the desk and the people (user revision).
// Assembled right after information-01, before floor-02.
const nextcodeProps = group('nextcode-props', [
  assetWorkstation(WS_D, 110, 470, FH),
  ...crate(26, 36, 468, 478, FH, FH + 12),
  ...crate(28, 44, 452, 466, FH, FH + 15),
  assetProp(DEV_GROUP, 20, 346, FH),
])

// Author a sheet on the B-D (right) wall (u = LW - WALL_T). Origin = the
// sheet's top-left corner as seen on the wall; local +x runs toward -v, local
// +y is screen-down (same iso skew as the taped app boards). Used for the
// current identity block, which now lives on the empty right-wall stretch at
// the D corner (where the right wall meets the rear wall).
function bdWallSheet(vLeft, hTop, children) {
  const [ox, oy] = p(LW - WALL_T, vLeft, hTop).split(',').map(Number)
  return [
    `<g transform="matrix(0.7071 0.2475 0 1 ${round(ox)} ${round(oy)})">`,
    ...children.map((c) => `  ${c}`),
    `</g>`,
  ]
}

// Current identity block on the fifth floor's right-wall corner at the D
// corner (user revision): the two verified titles only — no focus lines. Moved
// up to the wall arm's TOP border (user r219 revision): the right-wall arm
// spans 5·FH…TOP_H, so anchor the block's top edge just under TOP_H.
function identityBlock() {
  const [w1, w2] = CURRENT_IDENTITY.primary.split(' ')
  const children = [
    `<text class="dw-id-title" x="0" y="15">${w1}</text>`,
    `<text class="dw-id-title" x="0" y="30">${w2}</text>`,
    `<line class="dw-id-rule" x1="0" y1="38" x2="46" y2="38" />`,
    `<text class="dw-id-sub" x="0" y="50">${CURRENT_IDENTITY.secondary}</text>`,
  ]
  return bdWallSheet(LD - WALL_T - 6, TOP_H - 8, children)
}

function information() {
  return group('information', identityBlock())
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
  'floor-02-front-base': floor02FrontBase,
  'floor-02-front': floor02Front,
  'floor-03': floor03,
  'floor-03-team': floor03Team,
  'floor-03-front': floor03Front,
  'floor-04': floor04,
  'floor-04-front': floor04Front,
  'floor-05': floor05,
  'floor-05-front': floor05Front,
  staircase: staircase(),
  elevator: elevator(),
  'architectural-details': architecturalDetails(),
  entrance: entrance(),
  'projecting-sign': projectingSign(),
  tags: experienceTags(),
  'information-ground': informationGround(),
  'information-01': information01(),
  'information-02': information02(),
  'information-02-front': information02Front(),
  'information-03': information03(),
  'information-04': information04(),
  information: information(),
  'nextcode-props': nextcodeProps,
  'information-elev': informationElev(),
  // The near (left) Indelve fleet must paint over the "Indelve" experience tag
  // (user r91 review), so it is emitted from its own fragment, assembled AFTER
  // `tags` (see assemble-svg.mjs); the far fleet stays in `floor-03` so the
  // elevator shaft still occludes it.
  'indelve-fleets': group('indelve-fleets', indelveFleetA()),
}

for (const [name, content] of Object.entries(fragments)) {
  writeFileSync(join(FRAGMENTS_DIR, `${name}.svg`), `${content}\n`)
  console.log(`wrote src/svg/fragments/${name}.svg`)
}
