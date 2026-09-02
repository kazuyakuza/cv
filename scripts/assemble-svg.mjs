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

// Vertical stacking order inside <g id="building"> (Stage 1 spec §10).
const buildingParts = [
  'floor-ground',
  'floor-01',
  'floor-02',
  'floor-03',
  'floor-04',
  'floor-05',
  'staircase',
  'elevator',
]

const building = [
  '  <g id="building">',
  ...buildingParts.map((name) => indent(readFragment(name), 4)),
  '  </g>',
].join('\n')

const svg = `<!--
  Professional Career Diorama — Stage 1 architectural wireframe.
  ASSEMBLED FILE: generated from src/svg/fragments/ by \`npm run svg:assemble\`.
  Edit the fragments, not this file. Geometry parameters: see src/svg/README.md.
-->
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 1200 900"
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
    .dw-slab-edge { fill: #d9d8d5; stroke: #6b6b6b; stroke-width: 1; }
    .dw-partition { fill: #fbfbfa; stroke: #8a8a88; stroke-width: 0.75; }
    .dw-column { fill: none; stroke: #5a5a58; stroke-width: 1.5; }
    .dw-shaft { fill: none; stroke: #8a8a88; stroke-width: 1; }
    .dw-shaft-dash { fill: none; stroke: #a5a5a3; stroke-width: 0.75; stroke-dasharray: 3 3; }
    .dw-stair { fill: none; stroke: #7a7a78; stroke-width: 1.25; }
    .dw-open { fill: none; stroke: #9a9a98; stroke-width: 1; stroke-dasharray: 5 4; }
    .dw-label {
      fill: #555553;
      stroke: #ffffff;
      stroke-width: 3px;
      paint-order: stroke;
      stroke-linejoin: round;
      font: 11px system-ui, sans-serif;
    }
  </style>
${indent(readFragment('terrain'), 1)}
${indent(readFragment('path'), 1)}
${indent(readFragment('entrance'), 1)}
${indent(readFragment('career-sign'), 1)}
${building}
${indent(readFragment('viewer'), 1)}
${indent(readFragment('labels'), 1)}
</svg>
`

writeFileSync(join(root, 'src', 'svg', 'diorama.svg'), svg)
console.log('Assembled src/svg/diorama.svg')
