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
// Color (STAGE_05 §4, reworked in Stage 5.5 §3): restrained but richer —
//   * near/exterior wall faces read as muted cool concrete, clearly darker
//     than the interior;
//   * interior surfaces (rear wall inner faces, partitions) stay warm
//     greige so the section reads bright and readable;
//   * floors are warm mid surfaces, clearly apart from walls;
//   * cut faces keep the darker poché + hatch;
//   * terrain is a dark presentation base framing the building (5.5 §4);
//   * the mustard infrastructure accent is NOT introduced yet — it arrives
//     with the vertical infrastructure pass (5.5 §7).
// No gradients yet: flat tonal separation first.

export const svgStyle = `
    /* Tier 1 — primary structural lines */
    .dw-column { fill: none; stroke: #3a3833; stroke-width: 1.8; stroke-linecap: round; }
    /* Floor top surfaces: warm pale base tone, clearly apart from the walls.
       Per-floor material classes (dw-f0 … dw-f5) override this in Phase 2. */
    .dw-floor { fill: #cdc6b0; stroke: #4c4a44; stroke-width: 1.2; }
    /* Cut faces (open-side slab bands, wall/partition cut ends): section
       poché — darker warm tone + restrained 45° hatch (Stage 4 §7, §24) */
    .dw-slab-edge { fill: url(#dw-cut); stroke: #4c4a44; stroke-width: 1.2; }
    /* Near/exterior wall faces (entrance portal, fifth-floor wall arms):
       muted cool concrete — the exterior material identity (Stage 5 §6),
       now distinctly darker/cooler than the interior (Stage 5.5 §3) */
    .dw-wall { fill: #98a2a3; stroke: #4c4a44; stroke-width: 1.2; }
    /* Thin wall/shaft top caps: slightly lighter concrete than the wall
       faces, so horizontal surfaces read as catching light */
    .dw-slab { fill: #aab2b1; stroke: #4c4a44; stroke-width: 1.2; }
    /* Rear-wall inner faces: far side of the section — lighter lines and
       warm greige fill, reduced contrast for depth (Stage 4 §8).
       The interior stays warm and brighter than the cool exterior, but no
       longer near-white: recessed depth without losing readability. */
    .dw-wall-far { fill: #ddd5c2; stroke: #6e6b61; stroke-width: 0.9; }
    /* Floor-3 section separation (Stage 4.5 §3.3): fill-only face with
       outline edges in the far stroke, base unstroked. Stage 5 review
       (user revision): the face is clipped to the rear wall's inner-face
       polygon in the generator, so it only ever paints over that wall —
       it therefore takes the WALL tone and merges with it seamlessly; the
       floor behind the separation stays one continuous floor material. */
    .dw-wall-far-fill { fill: #ddd5c2; stroke: none; }
    .dw-far-line { fill: none; stroke: #4c4a44; stroke-width: 1.2; }
    /* Panel joints on the interior far walls (Stage 5.5 §8): sparse vertical
       seams, hashed per story — painted-wall articulation, hand-placed feel.
       Low contrast on purpose: readable up close, quiet at overview size. */
    .dw-wall-seam { fill: none; stroke: #c3b99e; stroke-width: 0.7; }

    /* Tier 2 — secondary architectural lines */
    /* Interior partitions: warm greige, slightly lighter than the far walls
       so the section's interior layering reads (Stage 5 §6) */
    .dw-partition { fill: #e7e0cd; stroke: #7a766b; stroke-width: 0.75; }
    .dw-opening { fill: none; stroke: #5d5a52; stroke-width: 0.9; }
    /* Elevator: solid architectural shaft (not glass). A distinctly darker,
       cooler structure than the floors and walls, so the shaft reads as its
       own material — including where it legitimately passes in front of a
       floor corner (Stage 5 §6, §10); deeper door opening on the unfinished
       fifth floor */
    .dw-shaft { fill: #8e9189; stroke: #5d5a52; stroke-width: 1; }
    /* Door panels: lighter than the shaft face so the doors read on it;
       the open doorway is the darkest interior tone so openings read as
       depth, not decoration */
    .dw-door { fill: #b2b0a2; stroke: #5d5a52; stroke-width: 1; }
    .dw-door-open { fill: #5b584e; stroke: #5d5a52; stroke-width: 1; }
    /* Door panel articulation (Stage 5.5 §8): one quiet horizontal groove
       per leaf — the doors read as metal panels, not blank quads */
    .dw-door-line { fill: none; stroke: #5d5a52; stroke-width: 0.7; }
    /* Stairs: warm concrete family, treads lightest, the solid side mass
       darkest of the three (restrained depth cue, Stage 4 §22) */
    .dw-stair { fill: #d9cfb5; stroke: #7a766b; stroke-width: 0.9; }
    .dw-stair-riser { fill: #c3b89d; stroke: #7a766b; stroke-width: 0.9; }
    .dw-stair-side { fill: #c5ba9e; stroke: #7a766b; stroke-width: 0.9; }
    /* Information-layer plaques and the career sign stay near-white:
       they must keep the highest readability (Stage 5 §15) — on the dark
       environment they intentionally stay the brightest flat surfaces */
    .dw-tag { fill: #fffefb; stroke: #5d5a52; stroke-width: 0.9; }
    .dw-sign { fill: #fffefb; stroke: #6b675e; stroke-width: 1.1; }
    /* Career sign (Stage 5.5 §12 user revision): the board frame reads as
       warm wood matching the crate family, so the sign reads as a built
       object planted in the terrain, not a floating UI card */
    .dw-sign-frame { fill: #9c8760; stroke: #4c4a44; stroke-width: 1; }

    /* Restrained structural shading (Stage 5 §7): stepped translucent bands
       under the slabs along the rear walls' tops. Steps instead of a linear
       gradient on purpose: a screen-space gradient cannot follow the
       isometric slope of the wall tops, while constant-h parallelograms hug
       it exactly — and the stepped wash keeps the flat, illustrated
       material language. No outlines: shade only, subordinate to lines. */
    .dw-shade-a { fill: #3a3833; fill-opacity: 0.15; stroke: none; }
    .dw-shade-b { fill: #3a3833; fill-opacity: 0.08; stroke: none; }
    .dw-shade-c { fill: #3a3833; fill-opacity: 0.04; stroke: none; }

    /* Floor/wall contact shadow (Stage 5.5 §9): a thin translucent band on
       the floor hugging each rear wall's base — quiet ambient occlusion so
       wall and floor visibly meet instead of floating apart */
    .dw-contact { fill: #3a3833; fill-opacity: 0.10; stroke: none; }

    /* Service pipes (Stage 5.5 §7): vertical runs come from the
       user-approved generated sprite (src/assets/pipe-01.png, inlined by the
       generator as a data URI); the sprite carries its own shading, straps
       and flanges. Dark steel utility elements (junction boxes, conduits,
       brackets) are the supporting cast */
    .dw-jbox { fill: #4a4842; stroke: #2e2c28; stroke-width: 0.8; }
    .dw-conduit { fill: #55534c; stroke: #3a3833; stroke-width: 0.7; }

    /* Server rack (Stage 5.5 §10): Health Platforms' DBA story. Same dark
       steel family as the junction boxes but as a full-height cabinet:
       graphite front, darker side, light-catching top cap, thin drive-slot
       lines and muted status LEDs (mostly green, one amber) — generic
       technical equipment, subordinate to the architecture */
    .dw-rack { fill: #46443e; stroke: #2e2c28; stroke-width: 0.8; }
    .dw-rack-side { fill: #3a3833; stroke: #2e2c28; stroke-width: 0.8; }
    .dw-rack-top { fill: #5d5b52; stroke: #2e2c28; stroke-width: 0.8; }
    .dw-rack-slot { fill: none; stroke: #78746a; stroke-width: 0.55; }
    .dw-rack-led { fill: #8aa878; stroke: none; }
    .dw-rack-led-amber { fill: #c29a4a; stroke: none; }
    /* Rack group detailing (Stage 5.5 §10 user revision): recessed plinth,
       inset door-frame outline, blanking panels, vent dots + cable notch */
    .dw-rack-plinth { fill: #33312c; stroke: #2e2c28; stroke-width: 0.8; }
    .dw-rack-frame { fill: none; stroke: #6b675e; stroke-width: 0.7; }
    .dw-rack-panel { fill: #514f48; stroke: #2e2c28; stroke-width: 0.55; }
    .dw-rack-vent { fill: #2e2c28; stroke: none; }

    /* Data cables (r25 review, Cleverlit stand kiosk): the mini PC's runs
       navigating the Interactica floor toward the elevator — thin dark
       strokes, a pair of them, quieter than any wall line */
    .dw-cable { fill: none; stroke: #3c3a35; stroke-width: 1.15; stroke-linecap: round; stroke-linejoin: round; }
    .dw-cable-2 { fill: none; stroke: #56534b; stroke-width: 0.8; stroke-linecap: round; stroke-linejoin: round; }

    /* AR/VR holographic panel (r36 review, Interactica story): a white floating
       screen with illegible text strokes — brighter than the architectural
       greys but a step below the information-layer plaques, and cool-tinted so
       it reads as a projected UI, not a physical sign */
    .dw-holo { fill: #eef3f5; fill-opacity: 0.94; stroke: #8aa6b4; stroke-width: 0.55; }
    .dw-holo-head { fill: #cbdde6; fill-opacity: 0.95; stroke: none; }
    .dw-holo-line { fill: none; stroke: #607d8c; stroke-width: 0.6; stroke-opacity: 0.75; stroke-linecap: round; }

    /* Graph screen on the rear C-D wall (r37 review, tech-lead vignette): a
       small dark presentation panel with a node diagram — the section's only
       glowing surface, but small and low-contrast so it stays subordinate to
       the architecture and the future information layer */
    .dw-graph-frame { fill: #3d4750; stroke: #262c31; stroke-width: 0.6; }
    .dw-graph-face { fill: #1f252a; stroke: none; }
    .dw-graph-title { fill: #33414b; stroke: none; }
    .dw-graph-tick { fill: none; stroke: #9fb7c2; stroke-width: 0.5; stroke-opacity: 0.7; stroke-linecap: round; }
    .dw-graph-node { fill: #567484; stroke: #a7c1cc; stroke-width: 0.45; }
    .dw-graph-nodeline { fill: none; stroke: #cfe0e6; stroke-width: 0.45; stroke-opacity: 0.8; stroke-linecap: round; }
    .dw-graph-arrow { fill: none; stroke: #8fb0bd; stroke-width: 0.45; stroke-linecap: round; stroke-linejoin: round; }

    /* Indelve floor cable (UPDATE #38/#39, user): the power/video run from the
       promo screen — drops straight down the wall, then crosses the floor to
       the PC towers. Dark, thin. */
    .dw-cable { fill: none; stroke: #2b2f33; stroke-width: 0.9; stroke-linecap: round; }

    /* Workstations (Stage 5.5 §10): dev desks come from generated
       sprites (src/assets/workstation-0X-cut.png, placed by
       assetWorkstation()); the old SVG desk classes were removed with them. */

    /* Puelo Games crates (Stage 5.5 §10): hand-drawn storage boxes in the
       warm-wood family, quieter than the floors so props stay subordinate */
    .dw-crate { fill: #b39d75; stroke: #4c4a44; stroke-width: 0.8; }
    .dw-crate-side { fill: #9c8760; stroke: #4c4a44; stroke-width: 0.8; }
    .dw-crate-top { fill: #c3ad83; stroke: #4c4a44; stroke-width: 0.8; }
    .dw-crate-line { fill: none; stroke: #8d7a58; stroke-width: 0.7; }

    /* Freelancer paper mess (Stage 5.5 §10): loose sheets and small stacks,
       hand-drawn SVG. Near-white but a step below the plaques so the
       information layer keeps the highest readability */
    .dw-paper { fill: #f4f1e6; stroke: #b9b3a3; stroke-width: 0.5; }
    /* Neat record reams (Health Platforms DBA vignette): a solid paper block
       reads as one clean tower where stacked flat quads merge into a heap.
       Top reuses .dw-paper; the near/left faces step down in tone like the
       crate family; sparse sheet lines suggest the individual records */
    .dw-ream { fill: #ece8db; stroke: #b9b3a3; stroke-width: 0.5; }
    .dw-ream-side { fill: #ded9c8; stroke: #b9b3a3; stroke-width: 0.5; }
    .dw-ream-line { fill: none; stroke: #c6c0af; stroke-width: 0.45; }
    /* Hand-written squiggle lines (Nextcode pamphlet): unreadable writing */
    .dw-scribble { fill: none; stroke: #4a463f; stroke-width: 0.35; stroke-opacity: 0.65; stroke-linecap: round; }

    /* BA Technology whiteboard (Stage 5.5 §10, user revision of the
       blackboard): light aluminum frame + white writing surface + marker
       spreadsheet. Ink stays dark/desaturated — visible content, never
       competing with the architecture */
    .dw-board-frame { fill: #b6b0a4; stroke: #6b675e; stroke-width: 0.8; }
    .dw-board-cap { fill: #c4beb2; stroke: #6b675e; stroke-width: 0.8; }
    .dw-board-face { fill: #f6f3ea; stroke: #b3ad9f; stroke-width: 0.6; }
    .dw-board-tray { fill: #a8a296; stroke: #6b675e; stroke-width: 0.7; }
    .dw-board-tray-top { fill: #bdb7ab; stroke: #6b675e; stroke-width: 0.6; }
    .dw-marker { fill: none; stroke: #4d5c7c; stroke-width: 0.5; stroke-opacity: 0.6; stroke-linecap: round; }
    .dw-marker-head { fill: #4d5c7c; fill-opacity: 0.08; stroke: none; }
    .dw-pen-blue { fill: none; stroke: #4d5c7c; stroke-width: 0.9; stroke-linecap: round; }
    .dw-pen-black { fill: none; stroke: #3a3f47; stroke-width: 0.9; stroke-linecap: round; }
    .dw-marker-text { fill: #383d46; fill-opacity: 0.85; font: 3.6px system-ui, sans-serif; letter-spacing: 0.02em; }

    /* Stage 5.5 §34 — Interactica wall board: a printed app mockup taped to
       the building's right (B-D) wall near the B corner, annotated with a
       marker during the meeting. Paper is a fresh warm white, the marker two
       felt-tip inks (terracotta + slate blue), the notes a tiny hand script
       that reads as scribble at diorama scale. */
    .dw-note-shadow { fill: #3a3833; fill-opacity: 0.20; stroke: none; }
    .dw-note-paper { fill: #fbfaf4; stroke: #b6b0a1; stroke-width: 0.5; }
    .dw-note-edge { fill: none; stroke: #8e8778; stroke-width: 0.35; }
    .dw-note-tape { fill: #ece5cf; fill-opacity: 0.9; stroke: #c6bfa9; stroke-width: 0.3; }
    .dw-note-ink { fill: none; stroke: #a8503c; stroke-width: 0.8; stroke-linecap: round; stroke-linejoin: round; }
    .dw-note-ink2 { fill: none; stroke: #47617a; stroke-width: 0.75; stroke-linecap: round; stroke-linejoin: round; }
    .dw-note-text { fill: #a8503c; fill-opacity: 0.92; font: 1.9px system-ui, sans-serif; letter-spacing: 0.01em; }

    /* Stage 5 §9 — stair/elevator details. (§8 sparse-infrastructure pieces
       were all removed on user review — pipe, wall patch, panel, vent — so
       only the banister line survives.) */
    .dw-rail { fill: none; stroke: #5d5a52; stroke-width: 1; stroke-linecap: round; }

    /* Tier 3 — tertiary / subtle lines. Stage 5.5 §4: the terrain is now a
       dark presentation base that frames the building — a quiet stage plane
       with a rim-lit edge and a slightly darker inner surface, so the
       diorama reads as an intentional model, not a floating polygon. The
       path stays warm/compacted so it reads as walked ground leading to
       the entrance, now tuned to stay visible on the dark base */
    .dw-terrain { fill: #3d4345; stroke: #666b6c; stroke-width: 1; }
    .dw-terrain-in { fill: #34393b; stroke: none; }
    .dw-path { fill: #5f5847; stroke: #453f31; stroke-width: 0.9; }

    /* Fill-only pieces (re-layered over the elevator; no strokes of their own).
       Must always match the floor material of their floor — they re-render
       parts of the floor top. (Fallback tone only: every use also carries a
       per-floor dw-fX class whose pattern wins.) */
    .dw-floor-fill { fill: #cdc6b0; stroke: none; }

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
    .dw-tag-text { fill: #45423c; font: 9.5px system-ui, sans-serif; letter-spacing: 0.03em; }
    .dw-year { fill: #45423c; font: 9.5px system-ui, sans-serif; letter-spacing: 0.03em; }
    /* Elevator floor indicator (user revision): the story number painted on
       the wall above each door — quieter than a plaque, no drop shadow.
       Light paint so it reads on the now-darker shaft face */
    .dw-floor-num { fill: #d6d3c6; font: bold 9px system-ui, sans-serif; }

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
        <rect width="6" height="6" fill="#a99f8b" />
        <line x1="0" y1="0" x2="0" y2="6" stroke="#8a8069" stroke-width="0.8" />
      </pattern>
      <!-- Ground floor (2013–2018): small warm ceramic tiles -->
      <pattern id="dw-f0" width="40" height="14" patternUnits="userSpaceOnUse">
        <rect width="40" height="14" fill="#cbc2a8" />
        <line x1="0" y1="14" x2="40" y2="0" stroke="#b7ab8e" stroke-width="0.8" />
        <line x1="0" y1="0" x2="40" y2="14" stroke="#b7ab8e" stroke-width="0.8" />
      </pattern>
      <!-- Floor 1 (2017–2019): large quiet concrete panels -->
      <pattern id="dw-f1" width="110" height="38.5" patternUnits="userSpaceOnUse">
        <rect width="110" height="38.5" fill="#cac2ad" />
        <line x1="0" y1="38.5" x2="110" y2="0" stroke="#b8ae99" stroke-width="0.8" />
        <line x1="0" y1="0" x2="110" y2="38.5" stroke="#b8ae99" stroke-width="0.8" />
      </pattern>
      <!-- Floors 2–3 (Interactica 2019–2025): wood strip flooring, planks
           running along the depth axis, with randomly placed butt joints
           perpendicular to the planks -->
      <pattern id="dw-f2" width="66" height="23.1" patternUnits="userSpaceOnUse">
        <rect width="66" height="23.1" fill="#cbb992" />
        <line x1="0" y1="0" x2="66" y2="23.1" stroke="#b7a67e" stroke-width="0.7" />
        <line x1="0" y1="7.7" x2="44" y2="23.1" stroke="#b7a67e" stroke-width="0.7" />
        <line x1="0" y1="15.4" x2="22" y2="23.1" stroke="#b7a67e" stroke-width="0.7" />
        <line x1="9" y1="5.65" x2="15" y2="3.55" stroke="#a9986d" stroke-width="0.7" />
        <line x1="28" y1="13.6" x2="36" y2="10.8" stroke="#a9986d" stroke-width="0.7" />
        <line x1="49" y1="20.75" x2="57" y2="17.95" stroke="#a9986d" stroke-width="0.7" />
        <line x1="20" y1="17.6" x2="26" y2="15.5" stroke="#a9986d" stroke-width="0.7" />
      </pattern>
      <pattern id="dw-f3" width="66" height="23.1" patternUnits="userSpaceOnUse">
        <rect width="66" height="23.1" fill="#cbb992" />
        <line x1="0" y1="0" x2="66" y2="23.1" stroke="#b7a67e" stroke-width="0.7" />
        <line x1="0" y1="7.7" x2="44" y2="23.1" stroke="#b7a67e" stroke-width="0.7" />
        <line x1="0" y1="15.4" x2="22" y2="23.1" stroke="#b7a67e" stroke-width="0.7" />
        <line x1="9" y1="5.65" x2="15" y2="3.55" stroke="#a9986d" stroke-width="0.7" />
        <line x1="28" y1="13.6" x2="36" y2="10.8" stroke="#a9986d" stroke-width="0.7" />
        <line x1="49" y1="20.75" x2="57" y2="17.95" stroke="#a9986d" stroke-width="0.7" />
        <line x1="20" y1="17.6" x2="26" y2="15.5" stroke="#a9986d" stroke-width="0.7" />
      </pattern>
      <!-- Floor 4 (Pacer 2025–2026): diamond tiles pointing toward the
           viewer and the rear wall (steep lattice, opposite emphasis to the
           ground floor's), cooler tone -->
      <pattern id="dw-f4" width="20" height="40.6" patternUnits="userSpaceOnUse">
        <rect width="20" height="40.6" fill="#c3bfb0" />
        <line x1="0" y1="0" x2="20" y2="40.6" stroke="#a49e8e" stroke-width="0.9" />
        <line x1="20" y1="0" x2="0" y2="40.6" stroke="#a49e8e" stroke-width="0.9" />
      </pattern>
      <!-- Floor 5 (current, unfinished): bare construction screed — random
           base-concrete marks, no finished surface -->
      <pattern id="dw-f5" width="120" height="120" patternUnits="userSpaceOnUse">
        <rect width="120" height="120" fill="#cac3ae" />
        <line x1="14" y1="30" x2="43" y2="19.85" stroke="#b6ae95" stroke-width="0.8" />
        <line x1="70" y1="22" x2="88" y2="15.7" stroke="#b6ae95" stroke-width="0.8" />
        <line x1="96" y1="55" x2="112" y2="60.6" stroke="#b6ae95" stroke-width="0.8" />
        <line x1="20" y1="72" x2="34" y2="76.9" stroke="#b6ae95" stroke-width="0.8" />
        <line x1="52" y1="96" x2="66" y2="91.1" stroke="#a8a088" stroke-width="0.9" />
        <line x1="90" y1="100" x2="104" y2="95.1" stroke="#b6ae95" stroke-width="0.8" />
        <line x1="40" y1="52" x2="58" y2="45.7" stroke="#b6ae95" stroke-width="0.8" />
        <line x1="8" y1="105" x2="22" y2="110.1" stroke="#a8a088" stroke-width="0.9" />
      </pattern>
      <!-- Floor 5, laid tiles: small-format tiles (smaller than the ground
           floor's) at the two upper corners of the bare screed -->
      <pattern id="dw-f5t" width="26" height="9.1" patternUnits="userSpaceOnUse">
        <rect width="26" height="9.1" fill="#d3cbb4" />
        <line x1="0" y1="9.1" x2="26" y2="0" stroke="#bfb69e" stroke-width="0.7" />
        <line x1="0" y1="0" x2="26" y2="9.1" stroke="#bfb69e" stroke-width="0.7" />
      </pattern>
    </defs>
  `
