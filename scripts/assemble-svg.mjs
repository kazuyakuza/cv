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

const indent = (text, spaces) => text.replace(/^/gm, ' '.repeat(spaces))

// Root order inside the SVG (Stage 3 spec §7): background/base first, then
// the building (rear elements → interior → slabs → foreground faces), then
// entrance, then the exterior path and sign in the foreground. The ground
// shadow sits between terrain and building (Stage 5 §7 shading).
const rootOrder = ['terrain', 'ground-shadow', 'building', 'entrance', 'path', 'career-sign']

// Vertical stacking order inside <g id="building"> (Stage 3.5 revision): the
// staircase sits under floor-01 (the slab occludes it); every shaft-crossing
// floor renders as one complete plane BELOW the elevator, while its story
// columns (-front) render as a layer over it. The experience tags mount on
// the back walls, so they render after all floor geometry (Stage 3.5 §20).
const buildingParts = [
  'floor-ground',
  'staircase',
  'freelancer-props',
  'floor-01',
  'floor-02',
  'floor-03',
  'floor-03-team',
  'floor-04',
  'floor-05',
  'architectural-details',
  'elevator',
  'floor-02-front',
  'floor-03-front',
  'floor-04-front',
  'floor-05-front',
  'tags',
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
  viewBox="0 0 1200 1050"
  role="img"
  aria-labelledby="diorama-title"
>
  <title id="diorama-title">Professional Career Diorama — sectional architectural illustration</title>
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
