// Stage 5 — Materials & color system on top of the Stage 4 line hierarchy.
// Single source of truth for the `.dw-*` palette embedded in diorama.svg.
// Fragments carry class names only; this module defines their visual weight.
//
// Line hierarchy (STAGE_04 §5) is unchanged:
//   Tier 1 — primary:   strongest. Building silhouette, floor slab edges,
//                       exterior boundaries, major walls, columns.
//   Tier 2 — secondary: visibly lighter. Partitions, elevator, staircase,
//                       doors, openings, plaques, the career sign.
//   Tier 3 — tertiary:  subtle. Terrain, path, guide/dashed lines.
// The building must stay dominant; nothing else may compete with it (§20).
//
// Color (STAGE_05 §4): one restrained family guided by the reference —
//   * near/exterior wall faces read as muted grey-blue concrete;
//   * interior surfaces (rear wall inner faces, partitions) stay warm
//     off-whites so the section reads bright and readable;
//   * floors are warm pale surfaces, clearly apart from walls;
//   * cut faces keep the darker poché + hatch;
//   * terrain/path are warm sand tones resting on the paper background;
//   * accents (mustard / signal red) are NOT introduced in Phase 1 —
//     they arrive with the infrastructure details (Stage 5 §8).
// No gradients yet: flat tonal separation first (Phase 3 may add limited
// gradients where structurally useful).

export const svgStyle = `
    /* Tier 1 — primary structural lines */
    .dw-column { fill: none; stroke: #46443f; stroke-width: 1.6; stroke-linecap: round; }
    /* Floor top surfaces: warm pale base tone, clearly apart from the walls.
       Per-floor material classes (dw-f0 … dw-f5) override this in Phase 2. */
    .dw-floor { fill: #e6dfcc; stroke: #56534d; stroke-width: 1.2; }
    /* Cut faces (open-side slab bands, wall/partition cut ends): section
       poché — darker warm tone + restrained 45° hatch (Stage 4 §7, §24) */
    .dw-slab-edge { fill: url(#dw-cut); stroke: #56534d; stroke-width: 1.2; }
    /* Near/exterior wall faces (entrance portal, fifth-floor wall arms):
       muted grey-blue concrete — the exterior material identity (Stage 5 §6) */
    .dw-wall { fill: #c9d0cd; stroke: #56534d; stroke-width: 1.2; }
    /* Thin wall/shaft top caps: slightly lighter concrete than the wall
       faces, so horizontal surfaces read as catching light */
    .dw-slab { fill: #d6dad3; stroke: #56534d; stroke-width: 1.2; }
    /* Rear-wall inner faces: far side of the section — lighter lines and
       warm off-white fill, reduced contrast for depth (Stage 4 §8).
       The interior stays warm/bright against the cooler exterior. */
    .dw-wall-far { fill: #f2edde; stroke: #7d7a73; stroke-width: 0.9; }
    /* Floor-3 section separation (Stage 4.5 §3.3): fill-only face with
       outline edges in the far stroke, base unstroked. Stage 5 review
       (user revision): the face is clipped to the rear wall's inner-face
       polygon in the generator, so it only ever paints over that wall —
       it therefore takes the WALL tone and merges with it seamlessly; the
       floor behind the separation stays one continuous floor material. */
    .dw-wall-far-fill { fill: #f2edde; stroke: none; }
    .dw-far-line { fill: none; stroke: #56534d; stroke-width: 1.2; }

    /* Tier 2 — secondary architectural lines */
    /* Interior partitions: near-white warm, lighter than the far walls so
       the section's interior layering reads (Stage 5 §6) */
    .dw-partition { fill: #f6f2e6; stroke: #8a867d; stroke-width: 0.75; }
    .dw-opening { fill: none; stroke: #6f6c65; stroke-width: 0.9; }
    /* Elevator: solid architectural shaft (not glass). Clearly darker than
       the floors and distinct from the grey-blue walls, so the shaft reads
       as its own darker structure — including where it legitimately passes
       in front of a floor corner (Stage 5 §6, §10); deeper door opening on
       the unfinished fifth floor */
    .dw-shaft { fill: #cdc9b8; stroke: #6f6c65; stroke-width: 1; }
    /* Door panels: lighter than the shaft face so the doors read on it;
       the open doorway is the darkest interior tone so openings read as
       depth, not decoration */
    .dw-door { fill: #dbd7ca; stroke: #6f6c65; stroke-width: 1; }
    .dw-door-open { fill: #8f8a7e; stroke: #6f6c65; stroke-width: 1; }
    /* Stairs: warm concrete family, treads lightest, the solid side mass
       darkest of the three (restrained depth cue, Stage 4 §22) */
    .dw-stair { fill: #f1e9d4; stroke: #8a867d; stroke-width: 0.9; }
    .dw-stair-riser { fill: #ddd3ba; stroke: #8a867d; stroke-width: 0.9; }
    .dw-stair-side { fill: #ddd3bd; stroke: #8a867d; stroke-width: 0.9; }
    /* Information-layer plaques and the career sign stay near-white:
       they must keep the highest readability (Stage 5 §15) */
    .dw-tag { fill: #fffefb; stroke: #6f6c65; stroke-width: 0.9; }
    .dw-sign { fill: #fffefb; stroke: #75726a; stroke-width: 1.1; }

    /* Restrained structural shading (Stage 5 §7): stepped translucent bands
       under the slabs along the rear walls' tops. Steps instead of a linear
       gradient on purpose: a screen-space gradient cannot follow the
       isometric slope of the wall tops, while constant-h parallelograms hug
       it exactly — and the stepped wash keeps the flat, illustrated
       material language. No outlines: shade only, subordinate to lines. */
    .dw-shade-a { fill: #46443f; fill-opacity: 0.11; stroke: none; }
    .dw-shade-b { fill: #46443f; fill-opacity: 0.06; stroke: none; }
    .dw-shade-c { fill: #46443f; fill-opacity: 0.03; stroke: none; }

    /* Stage 5 §8–9 — sparse infrastructure and stair/elevator details.
       Supporting cast only: one or two small elements per area, never
       distributed uniformly (§8). The muted terracotta panel is the single
       accent the palette allows itself (§4). */
    .dw-rail { fill: none; stroke: #6f6c65; stroke-width: 1; stroke-linecap: round; }
    .dw-panel { fill: #dbd7ca; stroke: #6f6c65; stroke-width: 0.9; }
    .dw-panel-accent { fill: #b9776b; stroke: #6f6c65; stroke-width: 0.9; }
    .dw-vent { fill: #ece6d6; stroke: #8a867d; stroke-width: 0.75; }
    .dw-detail { fill: none; stroke: #8a867d; stroke-width: 0.9; stroke-linecap: round; }

    /* Tier 3 — tertiary / subtle lines. Terrain is a cool grey — clearly
       apart from the warm interior floors it must not be mistaken for
       (Stage 5 review fix); the path stays warm/compacted so it reads as
       walked ground leading to the entrance */
    .dw-terrain { fill: #d8dbcd; stroke: #a9a99c; stroke-width: 1; }
    .dw-path { fill: #e2d8c1; stroke: #b3afa4; stroke-width: 1; }

    /* Fill-only pieces (re-layered over the elevator; no strokes of their own).
       Must always match the floor material of their floor — they re-render
       parts of the floor top. */
    .dw-floor-fill { fill: #e6dfcc; stroke: none; }

    /* Per-floor floor materials (Stage 5 §5): one restrained, intentional
       surface per floor, telling the same story as the career stages —
       small warm tiles at the start, corporate panels, wood floors through
       the Interactica years (2 and 3 share the material: one company),
       diamond tiles at Pacer, bare screed on the unfinished top floor (with
       a few small-format tiles already laid at its two upper corners).
       All patterns are userSpaceOnUse, so re-layered floor pieces stay in
       phase with their slab; grid lines follow the isometric axes
       (slope ±0.35, cell height locked to 0.35·cell width so the lattice
       tiles seamlessly). Subordinate to the future information layer: low
       contrast, thin lines, no dense texture. */
    .dw-f0 { fill: url(#dw-f0); }
    .dw-f1 { fill: url(#dw-f1); }
    .dw-f2 { fill: url(#dw-f2); }
    .dw-f3 { fill: url(#dw-f3); }
    .dw-f4 { fill: url(#dw-f4); }
    .dw-f5 { fill: url(#dw-f5); }
    .dw-f5t { fill: url(#dw-f5t); }

    /* Plaque typography (system font kept; final typography is Stage 7) */
    .dw-tag-text { fill: #514e48; font: 9.5px system-ui, sans-serif; letter-spacing: 0.03em; }
    .dw-year { fill: #514e48; font: 9.5px system-ui, sans-serif; letter-spacing: 0.03em; }
    /* Elevator floor indicator (user revision): the story number painted on
       the wall above each door — quieter than a plaque, no drop shadow */
    .dw-floor-num { fill: #6f6c65; font: bold 9px system-ui, sans-serif; }

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
      <!-- Building ground-contact shadow (Stage 5 §7): one soft blurred
           polygon under the base footprint, offset toward the light-away
           direction like the plaques' drop shadows -->
      <filter id="dw-soft" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="5" />
      </filter>
      <pattern id="dw-cut" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="6" height="6" fill="#d5cdb9" />
        <line x1="0" y1="0" x2="0" y2="6" stroke="#b5ac96" stroke-width="0.8" />
      </pattern>
      <!-- Ground floor (2013–2018): small warm ceramic tiles -->
      <pattern id="dw-f0" width="40" height="14" patternUnits="userSpaceOnUse">
        <rect width="40" height="14" fill="#e9e1cc" />
        <line x1="0" y1="14" x2="40" y2="0" stroke="#d9ceb6" stroke-width="0.8" />
        <line x1="0" y1="0" x2="40" y2="14" stroke="#d9ceb6" stroke-width="0.8" />
      </pattern>
      <!-- Floor 1 (2017–2019): large quiet concrete panels -->
      <pattern id="dw-f1" width="110" height="38.5" patternUnits="userSpaceOnUse">
        <rect width="110" height="38.5" fill="#e4decd" />
        <line x1="0" y1="38.5" x2="110" y2="0" stroke="#d2cab8" stroke-width="0.8" />
        <line x1="0" y1="0" x2="110" y2="38.5" stroke="#d2cab8" stroke-width="0.8" />
      </pattern>
      <!-- Floors 2–3 (Interactica 2019–2025): wood strip flooring, planks
           running along the depth axis, with randomly placed butt joints
           perpendicular to the planks -->
      <pattern id="dw-f2" width="66" height="23.1" patternUnits="userSpaceOnUse">
        <rect width="66" height="23.1" fill="#e6d9be" />
        <line x1="0" y1="0" x2="66" y2="23.1" stroke="#d6c8a8" stroke-width="0.7" />
        <line x1="0" y1="7.7" x2="44" y2="23.1" stroke="#d6c8a8" stroke-width="0.7" />
        <line x1="0" y1="15.4" x2="22" y2="23.1" stroke="#d6c8a8" stroke-width="0.7" />
        <line x1="9" y1="5.65" x2="15" y2="3.55" stroke="#d2c3a0" stroke-width="0.7" />
        <line x1="28" y1="13.6" x2="36" y2="10.8" stroke="#d2c3a0" stroke-width="0.7" />
        <line x1="49" y1="20.75" x2="57" y2="17.95" stroke="#d2c3a0" stroke-width="0.7" />
        <line x1="20" y1="17.6" x2="26" y2="15.5" stroke="#d2c3a0" stroke-width="0.7" />
      </pattern>
      <pattern id="dw-f3" width="66" height="23.1" patternUnits="userSpaceOnUse">
        <rect width="66" height="23.1" fill="#e6d9be" />
        <line x1="0" y1="0" x2="66" y2="23.1" stroke="#d6c8a8" stroke-width="0.7" />
        <line x1="0" y1="7.7" x2="44" y2="23.1" stroke="#d6c8a8" stroke-width="0.7" />
        <line x1="0" y1="15.4" x2="22" y2="23.1" stroke="#d6c8a8" stroke-width="0.7" />
        <line x1="9" y1="5.65" x2="15" y2="3.55" stroke="#d2c3a0" stroke-width="0.7" />
        <line x1="28" y1="13.6" x2="36" y2="10.8" stroke="#d2c3a0" stroke-width="0.7" />
        <line x1="49" y1="20.75" x2="57" y2="17.95" stroke="#d2c3a0" stroke-width="0.7" />
        <line x1="20" y1="17.6" x2="26" y2="15.5" stroke="#d2c3a0" stroke-width="0.7" />
      </pattern>
      <!-- Floor 4 (Pacer 2025–2026): diamond tiles pointing toward the
           viewer and the rear wall (steep lattice, opposite emphasis to the
           ground floor's), cooler tone -->
      <pattern id="dw-f4" width="20" height="40.6" patternUnits="userSpaceOnUse">
        <rect width="20" height="40.6" fill="#e2ddd0" />
        <line x1="0" y1="0" x2="20" y2="40.6" stroke="#c9c2b2" stroke-width="0.9" />
        <line x1="20" y1="0" x2="0" y2="40.6" stroke="#c9c2b2" stroke-width="0.9" />
      </pattern>
      <!-- Floor 5 (current, unfinished): bare construction screed — random
           base-concrete marks, no finished surface -->
      <pattern id="dw-f5" width="120" height="120" patternUnits="userSpaceOnUse">
        <rect width="120" height="120" fill="#e6dfcc" />
        <line x1="14" y1="30" x2="43" y2="19.85" stroke="#d7cfbb" stroke-width="0.8" />
        <line x1="70" y1="22" x2="88" y2="15.7" stroke="#d7cfbb" stroke-width="0.8" />
        <line x1="96" y1="55" x2="112" y2="60.6" stroke="#d7cfbb" stroke-width="0.8" />
        <line x1="20" y1="72" x2="34" y2="76.9" stroke="#d7cfbb" stroke-width="0.8" />
        <line x1="52" y1="96" x2="66" y2="91.1" stroke="#cfc7b2" stroke-width="0.9" />
        <line x1="90" y1="100" x2="104" y2="95.1" stroke="#d7cfbb" stroke-width="0.8" />
        <line x1="40" y1="52" x2="58" y2="45.7" stroke="#d7cfbb" stroke-width="0.8" />
        <line x1="8" y1="105" x2="22" y2="110.1" stroke="#cfc7b2" stroke-width="0.9" />
      </pattern>
      <!-- Floor 5, laid tiles: small-format tiles (smaller than the ground
           floor's) at the two upper corners of the bare screed -->
      <pattern id="dw-f5t" width="26" height="9.1" patternUnits="userSpaceOnUse">
        <rect width="26" height="9.1" fill="#ebe3d0" />
        <line x1="0" y1="9.1" x2="26" y2="0" stroke="#d8cfba" stroke-width="0.7" />
        <line x1="0" y1="0" x2="26" y2="9.1" stroke="#d8cfba" stroke-width="0.7" />
      </pattern>
    </defs>
  `
