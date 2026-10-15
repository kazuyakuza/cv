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
    /* Tier 1 — primary structural lines.
       Stage 5.6 §13 (user: stronger contour): a further, clearly visible bump
       over the earlier conservative pass — the building silhouette, slab edges,
       near walls, columns and floor outlines now read noticeably heavier (the
       reference's strong contour definition), while tier-2/3 stay comparatively
       lighter so not all lines read equally dark. */
    .dw-column { fill: none; stroke: #3a3833; stroke-width: 2.25; stroke-linecap: round; }
    /* Floor top surfaces: warm pale base tone, clearly apart from the walls.
       Per-floor material classes (dw-f0 … dw-f5) override this in Phase 2. */
    .dw-floor { fill: #cdc6b0; stroke: #4c4a44; stroke-width: 1.5; }
    /* Cut faces (open-side slab bands, wall/partition cut ends): section
       poché — darker warm tone + restrained 45° hatch (Stage 4 §7, §24) */
    .dw-slab-edge { fill: url(#dw-cut); stroke: #4c4a44; stroke-width: 1.65; }
    /* Near/exterior wall faces (entrance portal, fifth-floor wall arms):
       muted cool concrete — the exterior material identity (Stage 5 §6),
       now distinctly darker/cooler than the interior (Stage 5.5 §3) */
    .dw-wall { fill: #98a2a3; stroke: #4c4a44; stroke-width: 1.55; }
    /* Thin wall/shaft top caps: slightly lighter concrete than the wall
       faces, so horizontal surfaces read as catching light */
    .dw-slab { fill: #aab2b1; stroke: #4c4a44; stroke-width: 1.45; }
    /* Rear-wall inner faces: far side of the section — lighter lines and
       reduced contrast for depth (Stage 4 §8).
       UPDATE #92 palette pass (reference, Stage 5.5 §3): the interior walls
       move from warm cream (#ddd5c2) to a cool light concrete, so the building
       reads cool-grey like the reference while the WARM floors supply the
       contrast. */
    .dw-wall-far { fill: #d2d2cb; stroke: #6e6b61; stroke-width: 0.9; }
    /* Floor-3 section separation (Stage 4.5 §3.3): fill-only face with
       outline edges in the far stroke, base unstroked. Stage 5 review
       (user revision): the face is clipped to the rear wall's inner-face
       polygon in the generator, so it only ever paints over that wall —
       it therefore takes the WALL tone and merges with it seamlessly; the
       floor behind the separation stays one continuous floor material. */
    .dw-wall-far-fill { fill: #d2d2cb; stroke: none; }
    .dw-far-line { fill: none; stroke: #4c4a44; stroke-width: 1.3; }
    /* Panel joints on the interior far walls (Stage 5.5 §8): sparse vertical
       seams, hashed per story — painted-wall articulation, hand-placed feel.
       Low contrast on purpose: readable up close, quiet at overview size. */
    .dw-wall-seam { fill: none; stroke: #b7bbb6; stroke-width: 0.7; }

    /* Tier 2 — secondary architectural lines */
    /* Interior partitions: slightly lighter than the far walls so the
       section's interior layering reads (Stage 5 §6); cool concrete to match
       the UPDATE #92 palette pass. */
    .dw-partition { fill: #dcddd8; stroke: #7a766b; stroke-width: 0.75; }
    .dw-opening { fill: none; stroke: #5d5a52; stroke-width: 1.05; }
    /* Elevator: solid architectural shaft (not glass). A distinctly darker,
       cooler structure than the floors and walls, so the shaft reads as its
       own material — including where it legitimately passes in front of a
       floor corner (Stage 5 §6, §10); deeper door opening on the unfinished
       fifth floor */
    .dw-shaft { fill: #8e9189; stroke: #5d5a52; stroke-width: 1.2; }
    /* Door panels: lighter than the shaft face so the doors read on it;
       the open doorway is the darkest interior tone so openings read as
       depth, not decoration */
    .dw-door { fill: #b2b0a2; stroke: #5d5a52; stroke-width: 1.1; }
    .dw-door-open { fill: #5b584e; stroke: #5d5a52; stroke-width: 1.1; }
    /* Door panel articulation (Stage 5.5 §8): one quiet horizontal groove
       per leaf — the doors read as metal panels, not blank quads */
    .dw-door-line { fill: none; stroke: #5d5a52; stroke-width: 0.7; }
    /* Stairs: warm concrete family, treads lightest, the solid side mass
       darkest of the three (restrained depth cue, Stage 4 §22) */
    .dw-stair { fill: #d9cfb5; stroke: #7a766b; stroke-width: 0.9; }
    .dw-stair-riser { fill: #c3b89d; stroke: #7a766b; stroke-width: 0.9; }
    .dw-stair-side { fill: #c5ba9e; stroke: #7a766b; stroke-width: 0.9; }
    /* Information-layer plaques and the sign stay near-white: they must keep
       the highest readability (Stage 5 §15) — on the dark environment they
       intentionally stay the brightest flat surfaces */
    .dw-tag { fill: #fffefb; stroke: #5d5a52; stroke-width: 0.9; }
    .dw-sign { fill: #fffefb; stroke: #6b675e; stroke-width: 1.1; }
    /* Projecting sign casing (Stage 5.5 §12 user revision, remounted Stage 6):
       the frame reads as warm wood matching the crate family, so the sign reads
       as a built object, not a floating UI card */
    .dw-sign-frame { fill: #9c8760; stroke: #4c4a44; stroke-width: 1; }
    /* Projecting sign content (Stage 7): the Stage 6 placeholder bars are
       replaced by the real identity content — name, profile photo (raster),
       LinkedIn QR and label. The QR keeps pure black on a white quiet-zone
       plate for contrast; the LinkedIn mark carries the brand blue. */
    .dw-sign-name { fill: #2f2c28; font: 700 11px system-ui, sans-serif; letter-spacing: 0.02em; }
    .dw-sign-link { fill: #3d6a97; font: 600 7.5px system-ui, sans-serif; letter-spacing: 0.02em; }
    .dw-photo-ring { fill: none; stroke: #4c4a44; stroke-width: 1; }
    .dw-qr-plate { fill: #fffefb; stroke: none; }
    .dw-qr { fill: #1b1a17; stroke: none; }
    .dw-ln { fill: #0a66c2; }

    /* Information layer (Stage 7): section role labels + technology logo
       plates. Role labels are dark bold text with a light keyline halo so they
       stay legible over concrete, wood or the open background, whether set on
       a wall, over a door, or lying flat on the floor. Logos sit on small
       near-white plates so any brand colour reads on the floor. */
    .dw-role-wall,
    .dw-role-door,
    .dw-role-floor,
    .dw-role-door-lg,
    .dw-role-floor-lg,
    .dw-role-floor-md,
    .dw-role-floor-xl {
      fill: #2f2c28;
      font: 700 10px system-ui, sans-serif;
      letter-spacing: 0.02em;
      paint-order: stroke;
      stroke: #f6f3ea;
      stroke-width: 1.7px;
      stroke-linejoin: round;
    }
    .dw-role-door-lg { font-size: 11.5px; }
    .dw-role-floor-lg { font-size: 12.5px; }
    .dw-role-floor-md { font-size: 15px; }
    .dw-role-floor-xl { font-size: 15.1px; }
    .dw-logo-plate { fill: #fbf9f2; fill-opacity: 0.94; stroke: #6b675e; stroke-width: 0.6; }
    /* Current-identity title block (fifth-floor rear wall). Carries the same
       light keyline halo as the role labels so it reads over the wall. */
    .dw-id-title { fill: #33302a; font: 700 14px system-ui, sans-serif; letter-spacing: 0.02em; paint-order: stroke; stroke: #f6f3ea; stroke-width: 1.7px; stroke-linejoin: round; }
    .dw-id-rule { stroke: #8a8579; stroke-width: 1; }
    .dw-id-sub { fill: #4a463f; font: 600 10px system-ui, sans-serif; letter-spacing: 0.02em; paint-order: stroke; stroke: #f6f3ea; stroke-width: 1.7px; stroke-linejoin: round; }
    .dw-id-focus { fill: #5c574e; font: 6px system-ui, sans-serif; }

    /* Restrained structural shading (Stage 5 §7): stepped translucent bands
       under the slabs along the rear walls' tops. Steps instead of a linear
       gradient on purpose: a screen-space gradient cannot follow the
       isometric slope of the wall tops, while constant-h parallelograms hug
       it exactly — and the stepped wash keeps the flat, illustrated
       material language. No outlines: shade only, subordinate to lines. */
    /* UPDATE #92 palette pass (reference): the recessed areas read a touch
       darker, for the reference's stronger under-slab / ceiling depth. */
    .dw-shade-a { fill: #3a3833; fill-opacity: 0.19; stroke: none; }
    .dw-shade-b { fill: #3a3833; fill-opacity: 0.10; stroke: none; }
    .dw-shade-c { fill: #3a3833; fill-opacity: 0.05; stroke: none; }

    /* Floor/wall contact shadow (Stage 5.5 §9): a thin translucent band on
       the floor hugging each rear wall's base — quiet ambient occlusion so
       wall and floor visibly meet instead of floating apart */
    .dw-contact { fill: #3a3833; fill-opacity: 0.13; stroke: none; }

    /* Service pipes (Stage 5.5 §7): vertical runs come from the
       user-approved generated sprite (src/assets/pipe-01.png, inlined by the
       generator as a data URI); the sprite carries its own shading, straps
       and flanges. Dark steel utility elements (junction boxes, conduits,
       brackets) are the supporting cast */
    .dw-jbox { fill: #4a4842; stroke: #2e2c28; stroke-width: 0.8; }
    .dw-conduit { fill: #55534c; stroke: #3a3833; stroke-width: 0.7; }
    /* Open service runs (segRun): stroke-only, so a polyline stays a tube-like
       line instead of filling the polygon it spans */
    .dw-conduit-line { fill: none; stroke: #3a3833; stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; }

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

    /* Indelve virtual-combat board (UPDATE #48, user): the deep-space nebula
       texture lying flat on the floor with an electric-blue hex grid over it
       (a "board base" like a chessboard). Cells are a faint blue wash so the
       nebula still reads through. */
    .dw-hex { fill: #1f7fd0; fill-opacity: 0.5; stroke: #5fdcff; stroke-width: 0.45; }

    /* Pacer legacy-stack corner (UPDATE #57, user): crisp SVG accents over the
       generated decaying-pile sprite — small electric sparks at the frayed
       cable ends (with a soft glow). The dust, sparks and flies are baked into
       the sprite raster; the SVG flies were removed in UPDATE #59 and the
       floor-side spark-2 accent in UPDATE #60. */
    .dw-spark { fill: none; stroke: #ffd45a; stroke-width: 0.55; stroke-linecap: round; }
    .dw-spark-glow { fill: none; stroke: #ffd45a; stroke-width: 1.7; stroke-opacity: 0.22; stroke-linecap: round; }

    /* Pacer spreadsheet "screenshot" (UPDATE #63, user): a white cardboard /
       Google-Sheets page lying flat on floor 4, containing a neutral mix of a
       functional-workflow and a sequence diagram. Light theme, editable SVG,
       drawn in the floor plane. */
    .dw-sheet-shadow { fill: #141618; fill-opacity: 0.15; filter: url(#dw-soft); }
    .dw-sheet { fill: #fbfaf4; stroke: #cfc9bb; stroke-width: 0.5; }
    .dw-sheet-grid { fill: none; stroke: #eae6dc; stroke-width: 0.14; }
    .dw-sheet-head { fill: #e8eef7; stroke: #b6c4d9; stroke-width: 0.3; }
    .dw-sheet-headtext { fill: #43506a; font: 3.1px system-ui, sans-serif; }
    .dw-sheet-life { fill: none; stroke: #b6c4d9; stroke-width: 0.26; stroke-dasharray: 1.3 1.3; }
    .dw-sheet-arrow { fill: none; stroke: #4a5b74; stroke-width: 0.34; stroke-linecap: round; }
    .dw-sheet-arrowhead { fill: #4a5b74; stroke: none; }
    .dw-sheet-label { fill: #3c4759; font: 2.5px system-ui, sans-serif; }
    .dw-sheet-note { fill: #fdf6e3; stroke: #c9bf94; stroke-width: 0.3; }
    .dw-sheet-flow { fill: #edf2e9; stroke: #b7c3ae; stroke-width: 0.3; }
    .dw-sheet-flowtext { fill: #46523f; font: 2.9px system-ui, sans-serif; }
    .dw-sheet-divider { fill: none; stroke: #ded9cd; stroke-width: 0.25; }
    .dw-sheet-tab { fill: #eceae2; stroke: #d3cec1; stroke-width: 0.25; }
    .dw-sheet-tab-on { fill: #ffffff; stroke: #b9c4d6; stroke-width: 0.3; }
    .dw-sheet-tabtext { fill: #6c6a61; font: 2.4px system-ui, sans-serif; }

    /* Pacer WhatsApp-bot chat screen (UPDATE #73, user): a tall wall-mounted
       display on the floor-4 C-D wall showing a WhatsApp-style chat — the bot's
       long incoming messages (white, left) and the user's short outgoing replies
       (green, right, time + blue double ticks). Editable SVG on the wall. */
    .dw-chat-shadow { fill: #3a3833; fill-opacity: 0.18; }
    .dw-chat-bezel { fill: #23272b; stroke: #14171a; stroke-width: 0.5; }
    .dw-chat-face { fill: #e6ddd4; }
    .dw-chat-doodle { fill: none; stroke: #d6cabd; stroke-width: 0.35; }
    .dw-chat-header { fill: #075e54; }
    .dw-chat-avatar { fill: #128c7e; }
    .dw-chat-bot { fill: none; stroke: #e9f4f2; stroke-width: 0.45; stroke-linecap: round; }
    .dw-chat-bot-dot { fill: #e9f4f2; }
    .dw-chat-name { fill: #ffffff; font: 3.2px system-ui, sans-serif; }
    .dw-chat-status { fill: #9fd6cc; font: 2.2px system-ui, sans-serif; }
    .dw-chat-dot { fill: #bfe6df; }
    .dw-chat-in { fill: #ffffff; stroke: #e2d9cf; stroke-width: 0.25; }
    .dw-chat-out { fill: #dcf8c6; stroke: #cbe9b5; stroke-width: 0.25; }
    .dw-chat-text { fill: #33383d; font: 2.35px system-ui, sans-serif; }
    .dw-chat-time { fill: #9aa0a4; font: 1.7px system-ui, sans-serif; }
    .dw-chat-tick { fill: none; stroke: #34b7f1; stroke-width: 0.45; stroke-linecap: round; stroke-linejoin: round; }
    .dw-chat-input { fill: #ffffff; stroke: #dad3c8; stroke-width: 0.25; }
    .dw-chat-inputtext { fill: #9aa0a4; font: 2.25px system-ui, sans-serif; }
    .dw-chat-icon { fill: none; stroke: #9aa0a4; stroke-width: 0.45; stroke-linecap: round; }
    .dw-chat-send { fill: #128c7e; }
    .dw-chat-mic { fill: #ffffff; }
    .dw-chat-mic-line { fill: none; stroke: #ffffff; stroke-width: 0.4; stroke-linecap: round; }

    /* Floor-5 whipper whip lash (UPDATE #76–#78, user): the lash is ONE crisp
       SVG curve from the person's hand to the toysite building; at the end a
       small grey cross marks the crack (a soft wide set + a crisp set). */
    .dw-whip { fill: none; stroke: #3a2c22; stroke-width: 1.0; stroke-linecap: round; }
    .dw-whip-hit { fill: none; stroke: #8f8f8a; stroke-width: 0.6; stroke-linecap: round; stroke-opacity: 0.9; }
    .dw-whip-hit-glow { fill: none; stroke: #c9c9c4; stroke-width: 1.5; stroke-linecap: round; stroke-opacity: 0.22; }

    /* Floor-5 elevator access ladder (UPDATE #80, user): the metal ladder on
       the shaft's rear-left, based on the slab and hooking over the roof —
       thick metallic-red rails + treads. */
    .dw-ladder { fill: none; stroke: #b0332a; stroke-width: 2.1; stroke-linecap: round; }
    .dw-ladder-rung { fill: none; stroke: #b0332a; stroke-width: 1.5; stroke-linecap: round; }
    .dw-ladder-bracket { fill: none; stroke: #7d221c; stroke-width: 1; stroke-linecap: round; }

    /* Floor-5 tossed CVs (UPDATE #85, user): the flying sheets the CV-tosser
       has just flung up. Fresh near-white paper (a step brighter than the
       floor papers so they read against the dark backdrop), a folded corner,
       and the letters "CV" on the sheets large enough to carry them. */
    .dw-paper-air { fill: #f7f5ee; stroke: #b3ac9c; stroke-width: 0.45; }
    .dw-paper-fold { fill: #e7e2d4; stroke: #b3ac9c; stroke-width: 0.35; }
    .dw-cv-text { fill: #3f4650; font-family: system-ui, sans-serif; font-weight: 700; text-anchor: middle; dominant-baseline: central; letter-spacing: -0.15; }

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

    /* Stage 5.6 — architectural-refinement vocabulary (floor-by-floor pass).
       Partial walls reuse the wall/partition families; the fixtures, surface
       wear, slab construction and red/orange construction accents live in
       their own quiet classes so they stay subordinate to the architecture
       and to the information layer. */
    /* Wall-mounted fixtures: panels, boxes, switches — light metal, a step
       below the information plaques */
    .dw-fixture { fill: #bcb8ad; stroke: #5d5a52; stroke-width: 0.7; }
    .dw-fixture-side { fill: #9a968b; stroke: #5d5a52; stroke-width: 0.7; }
    .dw-fixture-top { fill: #c9c5ba; stroke: #5d5a52; stroke-width: 0.6; }
    /* Ventilation grille: recessed dark opening with lighter slats */
    .dw-grille { fill: #57544c; stroke: #3a3833; stroke-width: 0.6; }
    .dw-grille-line { fill: none; stroke: #8f8b80; stroke-width: 0.55; }
    /* Switch plate + toggle */
    .dw-switch { fill: #c4c0b5; stroke: #5d5a52; stroke-width: 0.6; }
    .dw-switch-dot { fill: #4a4842; stroke: none; }
    /* Wall light: warm body + soft glow (a wash, never a hard UI glow) */
    .dw-lamp { fill: #b7b3a8; stroke: #5d5a52; stroke-width: 0.6; }
    .dw-lamp-core { fill: #f2e3b0; stroke: none; }
    .dw-lamp-warm { fill: #ffd98a; }
    .dw-glow { fill: #ffe4a6; fill-opacity: 0.16; stroke: none; }
    .dw-glow-red { fill: #e08a72; fill-opacity: 0.2; }
    /* Indicator/status lights */
    .dw-indicator { fill: #8aa878; stroke: none; }
    .dw-indicator-red { fill: #c0503f; stroke: none; }
    /* Surface wear (Stage 5.6 §10): quiet scratches, seams, cracks, patches —
       walls used and maintained, not destroyed */
    .dw-wear { fill: none; stroke: #9d998e; stroke-width: 0.5; stroke-opacity: 0.5; stroke-linecap: round; }
    .dw-wear-seam { fill: none; stroke: #b3afa4; stroke-width: 0.6; stroke-opacity: 0.55; }
    .dw-crack { fill: none; stroke: #8c877c; stroke-width: 0.55; stroke-opacity: 0.6; stroke-linecap: round; stroke-linejoin: round; }
    .dw-patch { fill: #c6c2b7; fill-opacity: 0.4; stroke: none; }
    /* Slab construction (Stage 5.6 §9) */
    .dw-slab-lip { fill: none; stroke: #b8b4a9; stroke-width: 1; stroke-linecap: round; }
    .dw-slab-seam { fill: none; stroke: #7d786d; stroke-width: 0.6; stroke-opacity: 0.7; }
    .dw-bracket { fill: none; stroke: #4a4842; stroke-width: 1.1; stroke-linecap: round; stroke-linejoin: round; }
    /* Red/orange construction & utility accents (Stage 5.6 §7): deliberate
       and sparse against the muted palette — never a whole red floor */
    .dw-accent-red { fill: #b0332a; stroke: #6e1f19; stroke-width: 0.7; }
    .dw-accent-red-line { fill: none; stroke: #b0332a; stroke-width: 1.6; stroke-linecap: round; }
    .dw-accent-orange { fill: #c06a34; stroke: #6e3a1a; stroke-width: 0.7; }
    .dw-accent-orange-line { fill: none; stroke: #c06a34; stroke-width: 1.4; stroke-linecap: round; }

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
    /* Role text on the Puelo mini board (Stage 8 Overview): smaller than the
       company-sign text so the two read as a hierarchy. */
    .dw-tag-role-text { fill: #45423c; font: 6.5px system-ui, sans-serif; letter-spacing: 0.03em; }
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

    /* --- Display modes (Stage 8) ------------------------------------------
       One query parameter (?mode=) selects the presentation; the root SVG
       element carries exactly one mode class (dw-mode-detailed /
       dw-mode-overview), set by the app (src/App.vue via
       src/display-mode.ts) and defaulted to Detailed in the assembled file
       (assemble-svg.mjs). Detailed is the baseline: no mode class means
       nothing below applies, so the standalone SVG keeps the approved
       Stage 7 appearance.

       Overview reduces information DENSITY, not the illustration:
         - technology-logo plates are hidden (too numerous for a full-frame
           screenshot); role labels, year plaques, the current-identity block
           and the exterior sign stay (user decision, 2026-10-13);
         - company-name signs are scaled up around their own visual centre so
           they read at full-composition scale. All experience tags live on
           the same invisible left wall (u = -1.5), so one screen-space scale
           serves every sign without distortion. Scoped to the #tags group so
           the elevator year plaques and the 2013 entrance sign stay untouched. */
    .dw-mode-overview .dw-logo { display: none; }
    .dw-mode-overview #tags .dw-tag-group {
      transform-box: fill-box;
      transform-origin: center;
      transform: scale(1.8);
    }
    /* Role mini boards (Stage 8 Overview): hidden in Detailed, shown in
       Overview. Each board sits just above its company sign (inside that
       sign's group, so it scales with it) — or, for Pacer, as a standalone
       board between the two Pacer signs. The section role label is then hidden
       in Overview so the role reads on the sign instead. */
    .dw-tag-role { display: none; }
    .dw-mode-overview .dw-tag-role { display: inline; }
    .dw-mode-overview .dw-role-puelo,
    .dw-mode-overview .dw-role-ba,
    .dw-mode-overview .dw-role-nextcode,
    .dw-mode-overview .dw-role-f2right,
    .dw-mode-overview .dw-role-f2left,
    .dw-mode-overview .dw-role-pacer {
      display: none;
    }
    /* Overview-only label adjustments (user review, 2026-10-14): the
       technology plates are hidden, so role labels stranded at the top of their
       wall parts are re-centred (a wrapper group carries the translate via
       --ovx/--ovy in px = SVG user units; the inner text keeps its plane
       matrix) and enlarged. Detailed is untouched. */
    .dw-mode-overview .dw-role-dba,
    .dw-mode-overview .dw-role-f3sa {
      transform: translate(var(--ovx, 0px), var(--ovy, 0px));
    }
    .dw-mode-overview .dw-role-dba text { font-size: 13.8px; }
    .dw-mode-overview .dw-role-f3sa text { font-size: 12.65px; }
    /* Overview: year plaques (the elevator story years and the 2013 entrance
       sign) scale up 15% around their own centre, and the projecting identity
       sign (photo + QR) scales up 25%, so both stay legible in a full-frame
       screenshot. Detailed keeps both at their Stage 7 size. */
    .dw-mode-overview #elevator .dw-tag-group,
    .dw-mode-overview #entrance .dw-tag-group {
      transform-box: fill-box;
      transform-origin: center;
      transform: scale(1.15);
    }
    .dw-mode-overview #projecting-sign {
      transform-box: fill-box;
      transform-origin: center;
      transform: scale(1.25);
    }
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
