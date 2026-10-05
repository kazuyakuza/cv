# AGENTS.md

> IMPORTANT restriction: while reasoning, never consider over 30 images at the
> same time.

## Project Overview

Visual representation of a professional software-development career as an **isometric
architectural diorama**: a multi-floor building where each floor represents a career
stage, growing upward over time. Published as a web project (Vue.js) hosted on GitHub Pages.

The primary architectural geometry should preferably be represented as editable, modular SVG.
The project may use a hybrid SVG/raster approach when appropriate. Raster
images, textures, generated visual assets and other non-vector elements are
allowed when they materially improve the final visual result.

Do not force every visual element to be vectorized.

## Key Documents

- `.agent/project-info/PROJECT_BRIEF.md` — WHAT the project is (full career content, layout, visual concept)
- `.agent/project-info/IMPLEMENTATION_PLAN.md` — HOW it is developed (stage roadmap)
- Stage specs (`STAGE_XX_*.md`) — defined before starting each stage; contain exact requirements and acceptance criteria

## Development Status

- Stages 0–5 are complete (wireframe → geometry → structure → illustration
  style → materials/details); **Stage 5.5 (visual enrichment) is in
  progress** — iterative, user-reviewed rounds driven by rendered reviews
  (see `.agent/todo/STAGE_05.5_VISUAL_ENRICHMENT_CONTINUE_3.md` — the current
  handoff; `…_CONTINUE_2.md` and `…_CONTINUE.md` are the history).
- Remaining stages: 6 career content → 7 information layer → 8 display modes
  → 9 Vue integration → 10 polish/deployment.

## Core Principles

1. **Iterative, visual-first development.** Each stage's rendered SVG must be reviewed
   (by the user) before starting the next. Never try to predict every final detail in advance.
2. **Start extremely simple.** First versions validate composition and spatial
   relationships, not beauty. Style is added gradually (wireframe → ... → polish).
3. **Modularity.** The building is vertically stacked floor modules with compatible
   footprint, scale, perspective, floor height, staircase alignment, and elevator position.
4. **Sectional/cutaway building.** Front and right walls are absent by default; add
   enclosure only when visually justified.
5. **Layer separation.** Keep architectural SVG geometry separate from the information
   layer (HTML/Vue or SVG text): company names, roles, years, technologies, descriptions.
6. **Fixed content rules.** Indelve (3rd floor section) and Pacer (4th floor) content is
   NOT yet defined — do not invent responsibilities, technologies, dates, or achievements
   for them. The entrance sign must NOT contain current professional titles
   (Software Architect / Technical Lead belong in the building's upper area).
7. **Fifth floor is intentionally unfinished** (open-air / under construction) — it
   represents current AI-driven development work.

## Technical Direction

- SVG as primary visual representation (organized, meaningful groups/layers)
- Vue.js for web integration, view/state, and mode handling
- HTML/CSS for information overlays where useful
- Overview mode via query parameter (screenshot-friendly); Detailed mode is the default
- Hosted on GitHub Pages; avoid unnecessary implementation complexity
- **Raster assets are served as separate files, never base64.** The SVG generator
  emits `__ASSET__<file>__` tokens; `src/App.vue` resolves them to Vite-hashed URLs
  of the optimized derivatives in `src/assets/serve/` (built from the full-res
  masters in `src/assets/` by `scripts/optimize-assets.py`). Update the master, run
  that script, then `npm run svg:generate` + `svg:assemble`.
- **Image generation (nano-banana MCP)** is available for generating utility
  raster assets that may be included in the diorama. Use it sparingly — only
  when a generated asset materially improves the result (the AGENTS.md
  hybrid SVG/raster rule); never as a substitute for the editable SVG
  geometry, and never for the core architectural drawing.
- **SVG tooling MCPs**: `svg-optimizer` (SVGO optimization, no key) and
  `svgmaker` (AI SVG generate/edit; `SVGMAKER_API_KEY` is configured in
  `opencode.json`).
- **Iconify MCP (`iconify`)** provides search over 200k+ free, open-source
  vector icons (MIT/other OSI licenses) for UI details, furniture, plants,
  tech logos, etc.

## Free Asset Sources (always free only)

Prefer these sources for reusable visual assets. **Never use paid/premium
assets.** Download via webfetch and save into `generated/` or `src/assets/`;
prefer SVG (editable, stylable) over raster when both exist.

- **unDraw — https://undraw.co/illustrations** — free, open-source SVG
  illustrations (MIT). Browse/search on the site; each illustration has a
  direct SVG download URL.
- **SVGL — https://svgl.app/** — free SVG brand/technology logos (open
  source; the logo collection lives in the `svgl/svgl` GitHub repo, raw SVGs
  fetchable from `raw.githubusercontent.com/svgl/svgl/main/src/icons/...`).
  Useful for the technology keywords in the diorama.
- **Kenney — https://kenney.nl/** — CC0 game assets (models, icons, UI
  packs). Available as downloadable zips; some packs include SVGs. No
  attribution required.
- **IconScout — https://iconscout.com/** — free icons (filter by "Free"
  price); free assets only, never the premium ones.
- **Isocons (isometric icons) — https://community-en.eagle.cool/resource/isocons-isometric-icons**
  — free isometric icon set, useful for small 3D-style objects in the
  diorama. Download the pack and use its SVGs.

Rule: an asset is usable only if its source license permits free use.
When in doubt about a license, ask the user before including the asset.

## Non-Goals (initially)

No photorealism, no 3D render, no pixel art / sci-fi look, no game-like interaction,
no mobile-first optimization before desktop composition works, no encoding all text
permanently into the SVG architecture.
