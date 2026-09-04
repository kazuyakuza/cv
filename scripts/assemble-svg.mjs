import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

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
// entrance, then the exterior path and sign in the foreground.
const rootOrder = ['terrain', 'building', 'entrance', 'path', 'career-sign']

// Vertical stacking order inside <g id="building"> (Stage 3.5 revision): the
// staircase sits under floor-01 (the slab occludes it); every shaft-crossing
// floor renders as one complete plane BELOW the elevator, while its story
// columns (-front) render as a layer over it. The experience tags mount on
// the back walls, so they render after all floor geometry (Stage 3.5 §20).
const buildingParts = [
  'floor-ground',
  'staircase',
  'floor-01',
  'floor-02',
  'floor-03',
  'floor-04',
  'floor-05',
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
  Professional Career Diorama — Stage 3 basic architectural structure.
  ASSEMBLED FILE: generated from src/svg/fragments/ by \`npm run svg:assemble\`.
  Fragment geometry is produced by \`npm run svg:generate\` from the shared
  parameters in src/svg/README.md. Edit parameters/fragments, not this file.
-->
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 1200 1050"
  role="img"
  aria-labelledby="diorama-title"
>
  <title id="diorama-title">Professional Career Diorama — architectural wireframe</title>
  <style>
    .dw-terrain { fill: #f6f5f2; stroke: #c2c0bb; stroke-width: 1; }
    .dw-path { fill: #efedea; stroke: #c2c0bb; stroke-width: 1; }
    .dw-sign { fill: #ffffff; stroke: #6b6b6b; stroke-width: 1; }
    .dw-wall { fill: #f4f4f2; stroke: #6b6b6b; stroke-width: 1; }
    .dw-slab { fill: #e9e8e6; stroke: #6b6b6b; stroke-width: 1; }
    .dw-slab-fill { fill: #e9e8e6; stroke: none; }
    .dw-slab-edge { fill: #d9d8d5; stroke: #6b6b6b; stroke-width: 1; }
    .dw-partition { fill: #fbfbfa; stroke: #8a8a88; stroke-width: 0.75; }
    .dw-column { fill: none; stroke: #5a5a58; stroke-width: 1.5; }
    .dw-shaft { fill: #f0efec; stroke: #8a8a88; stroke-width: 1; }
    .dw-door { fill: #dedcd9; stroke: #6b6b6b; stroke-width: 1; }
    .dw-shaft-dash { fill: none; stroke: #a5a5a3; stroke-width: 0.75; stroke-dasharray: 3 3; }
    .dw-stair { fill: #f2f1ee; stroke: #7a7a78; stroke-width: 1; }
    .dw-stair-riser { fill: #e3e2df; stroke: #7a7a78; stroke-width: 1; }
    .dw-open { fill: none; stroke: #9a9a98; stroke-width: 1; stroke-dasharray: 5 4; }
    .dw-door-open { fill: #b3b1ad; stroke: #6b6b6b; stroke-width: 1; }
    .dw-tag { fill: #ffffff; stroke: #6b6b6b; stroke-width: 1; }
    .dw-tag-text { fill: #555553; font: 9.5px system-ui, sans-serif; }
    .dw-year { fill: #555553; font: 9.5px system-ui, sans-serif; }
  </style>
${rootOrder.map((id) => indent(fragmentsById[id] ?? readFragment(id), 1)).join('\n')}
</svg>
`

writeFileSync(join(root, 'src', 'svg', 'diorama.svg'), svg)
console.log('Assembled src/svg/diorama.svg')
