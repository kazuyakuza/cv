import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { svgDefs, svgStyle } from './style.mjs'

// Assembles the single master diorama SVG (Stage 1 deliverable) from the
// per-module fragments in src/svg/fragments/. Plain deterministic
// concatenation — no dependencies, no template logic. Fragments are
// authoritative; edit them and re-run `npm run svg:assemble`.
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const fragmentsDir = join(root, 'src', 'svg', 'fragments')

const readFragment = (name) => readFileSync(join(fragmentsDir, `${name}.svg`), 'utf8').trim()

// Composition frame (Stage 6 revision): cropped from the original
// "0 0 1200 1050" to remove the empty side/foreground margins left once the
// entrance sign was removed, re-centred on the building + blade so the
// diorama fills the frame. Keeps the blade sign (right) and fifth floor (top).
const VIEW_BOX = '200 95 900 955'

// Display-mode contract (Stage 8): the root <svg> carries exactly one mode
// class. The assembled file defaults to Detailed so the standalone SVG keeps
// the approved Stage 7 appearance; the app swaps this token for
// `dw-mode-overview` when `?mode=overview` is requested (src/App.vue, via
// src/display-mode.ts, which is the canonical contract). The class must stay
// in sync with MODE_CLASS there and with the `.dw-mode-*` rules in style.mjs.
const MODE_CLASS_DEFAULT = 'dw-mode-detailed'

const indent = (text, spaces) => text.replace(/^/gm, ' '.repeat(spaces))

// Root order inside the SVG (Stage 3 spec §7): background/base first, then
// the building (rear elements → interior → slabs → foreground faces), then
// entrance, then the exterior path and sign in the foreground. The ground
// shadow sits between terrain and building (Stage 5 §7 shading).
const rootOrder = ['terrain', 'ground-shadow', 'building', 'entrance', 'path', 'projecting-sign']

// Vertical stacking order inside <g id="building"> (Stage 3.5 revision): the
// staircase sits under floor-01 (the slab occludes it); every shaft-crossing
// floor renders as one complete plane BELOW the elevator, while its story
// columns (-front) render as a layer over it. The experience tags mount on
// the back walls, so they render after all floor geometry (Stage 3.5 §20).
const buildingParts = [
  'floor-ground',
  'staircase',
  'freelancer-props',
  // Ground-floor role labels + logos: BELOW floor-01 so the first-floor slab
  // base occludes their top (Stage 7 review), but above the staircase so they
  // read as pasted on its base.
  'information-ground',
  'floor-01',
  'information-01',
  // Nextcode desk/crates/devs, drawn ABOVE information-01 so the floor
  // tech-logo decals render under them (Stage 7 review).
  'nextcode-props',
  'floor-02',
  'information-02',
  'floor-03',
  'floor-03-team',
  'floor-04',
  'floor-05',
  'architectural-details',
  'elevator',
  // Elevator-mounted role label (Dev over the floor-2 digit): must sit above
  // the elevator fragment, which paints its W2 face.
  'information-elev',
  // Floor-2 front split into two layers so the f2-right info plates can sit
  // between them: the opaque floor repaint (base) stays BELOW the plates, the
  // kiosk sprite + corner columns sit ABOVE them (Stage 7 r219 revision).
  'floor-02-front-base',
  // Interactica f2-right floor logos: above the floor repaint, below the kiosk
  // sprite and the floor-2/3 corner line.
  'information-02-front',
  'floor-02-front',
  // Left-wall information for floor 3 is emitted AFTER the floor-03 partial
  // wall so it reads as mounted on that wall (like the floor-1 Health labels).
  'floor-03-front',
  'information-03',
  'floor-04-front',
  // Pacer (floor-4) technology logos: above the floor-04 front slab repaint /
  // legacy layers, below the floor-5 front shell (Stage 7 r222).
  'information-04',
  'floor-05-front',
  // Stage 8 (user revision, 2026-10-14): the near (left) Indelve fleet now
  // renders UNDER the "Indelve" experience tag (previously over it, UPDATE
  // #53), so the enlarged Overview sign stays readable. The far fleet stays in
  // `floor-03` under the elevator shaft.
  'indelve-fleets',
  'tags',
  'information',
]

const fragmentsById = {
  building: [
    '  <g id="building">',
    ...buildingParts.map((name) => indent(readFragment(name), 4)),
    '  </g>',
  ].join('\n'),
}

const svg = `<!--
  Professional Career Diorama — Stage 4 hand-drawn sectional illustration.
  ASSEMBLED FILE: generated from src/svg/fragments/ by \`npm run svg:assemble\`.
  Fragment geometry is produced by \`npm run svg:generate\` from the shared
  parameters in src/svg/README.md; the palette lives in scripts/style.mjs.
  Edit parameters/fragments/style, not this file.
-->
<svg
  xmlns="http://www.w3.org/2000/svg"
  class="${MODE_CLASS_DEFAULT}"
  viewBox="${VIEW_BOX}"
  role="img"
  aria-labelledby="diorama-title"
  aria-describedby="diorama-desc"
>
  <title id="diorama-title">Professional Career Diorama — sectional architectural illustration</title>
  <desc id="diorama-desc">A sectional isometric illustration of a six-level building whose floors represent the stages of a software-development career, from a 2014 game-development start to current AI-driven work on the unfinished top floor. Company signs, role labels, technology logos and an exterior LinkedIn sign carry the professional information.</desc>
  <style>${svgStyle}</style>
  ${svgDefs}
  <!-- Hand-drawn texture: one global displacement field over the whole drawing -->
  <g filter="url(#dw-rough)">
${rootOrder.map((id) => indent(fragmentsById[id] ?? readFragment(id), 1)).join('\n')}
  </g>
</svg>
`

writeFileSync(join(root, 'src', 'svg', 'diorama.svg'), svg)
console.log('Assembled src/svg/diorama.svg')
