// Stage 4 — Architectural illustration style system (§5 line hierarchy).
// Single source of truth for the `.dw-*` palette embedded in diorama.svg.
// Fragments carry class names only; this module defines their visual weight.
//
// Line hierarchy (STAGE_04 §5):
//   Tier 1 — primary:   strongest. Building silhouette, floor slab edges,
//                       exterior boundaries, major walls, columns.
//   Tier 2 — secondary: visibly lighter. Partitions, elevator, staircase,
//                       doors, openings, plaques, the career sign.
//   Tier 3 — tertiary:  subtle. Terrain, path, guide/dashed lines.
// The building must stay dominant; nothing else may compete with it (§20).

export const svgStyle = `
    /* Tier 1 — primary structural lines */
    .dw-column { fill: none; stroke: #46443f; stroke-width: 1.6; stroke-linecap: round; }
    /* Floor top surfaces (Stage 4.5 §3.2): distinct warm base tone so floors
       read as physical surfaces, clearly apart from slab-edge poché and walls */
    .dw-floor { fill: #e7e2d6; stroke: #56534d; stroke-width: 1.2; }
    /* Cut faces (open-side slab bands, wall/partition cut ends): section
       poché — darker tone + restrained 45° hatch (Stage 4 §7, §24) */
    .dw-slab-edge { fill: url(#dw-cut); stroke: #56534d; stroke-width: 1.2; }
    .dw-wall { fill: #f3f1eb; stroke: #56534d; stroke-width: 1.2; }
    /* Thin wall/shaft top caps (not floors): wall-family tone (Stage 4.5) */
    .dw-slab { fill: #efede8; stroke: #56534d; stroke-width: 1.2; }
    /* Rear-wall inner faces: far side of the section — lighter lines and
       fill, reduced contrast for depth (Stage 4 §8) */
    .dw-wall-far { fill: #f0eee8; stroke: #7d7a73; stroke-width: 0.9; }
    /* Floor-3 section separation (Stage 4.5 §3.3): fill-only far tone that
       blends with the rear wall behind it; outline edges in the far stroke */
    .dw-wall-far-fill { fill: #f0eee8; stroke: none; }
    .dw-far-line { fill: none; stroke: #7d7a73; stroke-width: 0.9; }

    /* Tier 2 — secondary architectural lines */
    .dw-partition { fill: #faf8f4; stroke: #8a867d; stroke-width: 0.75; }
    .dw-opening { fill: none; stroke: #6f6c65; stroke-width: 0.9; }
    /* Elevator: solid architectural shaft (not glass), deeper door opening
       on the unfinished fifth floor (Stage 4 §13, §15) */
    .dw-shaft { fill: #efede7; stroke: #6f6c65; stroke-width: 1; }
    .dw-door { fill: #ddd9d1; stroke: #6f6c65; stroke-width: 1; }
    .dw-door-open { fill: #a7a39a; stroke: #6f6c65; stroke-width: 1; }
    .dw-stair { fill: #f4f2ec; stroke: #8a867d; stroke-width: 0.9; }
    .dw-stair-riser { fill: #e7e4dc; stroke: #8a867d; stroke-width: 0.9; }
    .dw-stair-side { fill: #eae7e0; stroke: #8a867d; stroke-width: 0.9; }
    .dw-tag { fill: #fffefb; stroke: #6f6c65; stroke-width: 0.9; }
    .dw-sign { fill: #fffefb; stroke: #75726a; stroke-width: 1.1; }

    /* Tier 3 — tertiary / subtle lines */
    .dw-terrain { fill: #f4f2ec; stroke: #b3afa4; stroke-width: 1; }
    .dw-path { fill: #eeebe4; stroke: #b3afa4; stroke-width: 1; }

    /* Fill-only pieces (re-layered over the elevator; no strokes of their own) */
    .dw-floor-fill { fill: #e7e2d6; stroke: none; }

    /* Plaque typography (system font kept; final typography is Stage 7) */
    .dw-tag-text { fill: #514e48; font: 9.5px system-ui, sans-serif; letter-spacing: 0.03em; }
    .dw-year { fill: #514e48; font: 9.5px system-ui, sans-serif; letter-spacing: 0.03em; }

    /* Physical attachment (Stage 4 §17): one subtle contact shadow per sign —
       plaques read as mounted on the wall, never as floating UI labels */
    .dw-tag-group { filter: drop-shadow(1px 1.25px 0.5px rgb(70 68 63 / 0.22)); }
    .dw-sign-group { filter: drop-shadow(1.5px 2px 1px rgb(70 68 63 / 0.18)); }
    /* Screw/nail heads flanking plaque text (Stage 4.5 user revision) */
    .dw-dot { fill: #9b968b; stroke: none; }
  `

// Hand-drawn texture (Stage 4 §6): one very weak displacement filter shared
// by the whole drawing. feTurbulence uses user-space coordinates, so the
// displacement field is global — overlapping/re-layered faces move together
// and no seams appear. scale 1.4 → max ±0.7 px: texture, not wobbling.
// The cut-face hatch (Stage 4 §24) is also user-space: every cut face shares
// one hatch phase, like a single drawing. Dense cross-hatching is avoided —
// one thin 45° line per 6 px tile on the darker poché tone.
export const svgDefs = `
    <defs>
      <filter id="dw-rough" x="-1%" y="-1%" width="102%" height="102%">
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.014" numOctaves="2" seed="7" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.4" xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <pattern id="dw-cut" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="6" height="6" fill="#ddd9d1" />
        <line x1="0" y1="0" x2="0" y2="6" stroke="#c2bdb2" stroke-width="0.8" />
      </pattern>
    </defs>
  `
