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

- **Stages 0–6 are complete** (wireframe → geometry → structure →
  illustration style → materials/details → visual enrichment → floor-by-floor
  architectural refinement → career content/exterior sign). Stage 5.5 was
  closed on 2026-10-05 and Stage 5.6 on 2026-10-09 (see
  `.agent/todo/STAGE_05.5_VISUAL_ENRICHMENT_CONTINUE_3.md` and
  `STAGE_05.6_Floor-by-Floor_Architectural_Refinement.md`). Stage 6 (2026-10-10)
  removed the ground-standing entrance sign, added a vertical blade sign on the
  building's front-right corner projecting rear→front, shortened the path and
  cropped the composed `viewBox`; the career scenes were reviewed and left
  unchanged. Documented in `src/svg/README.md` and
  `STAGE_06_CAREER_CONTENT.md`.
- **Stage 7 (2026-10-13): COMPLETE — information layer.** Content is data-driven
  from `scripts/career-data.mjs` (per-section roles + identity) and
  `scripts/tech-logos.mjs` (brand marks), emitted into per-floor generated
  `information-*` SVG fragments: per-section role labels (`Unity Dev`,
  `Jr. Developer`, `Co-Founder`, `DBA`, `Dev`, `Tech Lead`, `Software
  Architect`) and technology logo plates (unity, c#, php, jquery, mysql,
  node, mongodb, angular, aws, a-frame, flutter, postgresql, salesforce,
  nestjs, microservices, and Pacer's githubactions/docker/opentelemetry;
  `angularMfe`/`microservices` are hand-authored marks), plus the current
  `Software Architect` / `Technical Lead` identity on the fifth-floor rear
  wall. Indelve intentionally carries no information content (its scene is the
  content) and the per-experience "project descriptions" are the scene sprites
  and visual references. The exterior `projecting-sign` carries the real
  content — circular profile photo (`src/assets/photo2_2.jpg`), name
  "J. E. Barrocal", a LinkedIn QR (generated with `qrcode`, ECC-H, centered
  LinkedIn mark) and the full LinkedIn URL; no titles on the sign. Existing
  `tags`/`elevator`/`entrance` fragments are unchanged; no Stage 8 mode
  logic/variants. See `src/svg/README.md` §Stage 7 and
  `STAGE_07_INFORMATION_LAYER.md`.
- **Stage 8 (2026-10-14): COMPLETE — display modes.** One canonical mode
  contract (`src/display-mode.ts`): `?mode=overview` selects Overview;
  missing/empty/unknown (and `?mode=detailed`) fall back to Detailed;
  case-insensitive. `src/App.vue` resolves `window.location.search` and swaps
  the root SVG's mode class; the assembled file ships `dw-mode-detailed`, so
  the standalone SVG stays Detailed and Detailed is pixel-identical to the
  Stage 7 `r224` render. Mode rules are embedded in the SVG `<style>`
  (`scripts/style.mjs`): Overview hides the technology-logo plates
  (`logoPlate()` wraps each in a `.dw-logo` group) and scales the company signs
  `1.8×` around their own centre (`#tags .dw-tag-group`, `fill-box`);
  `experienceTags()` emits `dw-tag-<slug>` classes and an optional role mini
  board above a sign. Overview keeps every role label — most are relocated onto
  a mini board above their company sign (Puelo, BA, Nextcode, Interactica f2),
  Pacer's onto a standalone board between its two signs — plus the identity
  block, year plaques and the projecting sign; only logos are hidden and signs
  enlarged. A 2026-10-14 review round added Overview-only label
  re-centring/enlarging (DBA, f3 Software Architect), year-plaque +15% and
  projecting-sign +25% scalings, and shared-source tweaks (Freelancer sign now
  `Freelancer Game Dev`; Indelve fleet under its sign).
  Query-parameter routing is exercised in the current scaffold; final
  routing/data-model integration stays in Stage 9. See `src/svg/README.md`
  §Stage 8 and `STAGE_08_DISPLAY_MODES.md`.
- **Stage 9 (2026-10-14): COMPLETE — Vue integration.** The diorama is now a
  maintainable, responsive Vue app. `src/App.vue` composes the page (resolves
  the mode, renders `DioramaView`, adds a visually hidden LinkedIn link);
  `src/components/DioramaView.vue` owns the inline SVG + root mode-class swap;
  `src/diorama.ts` holds the `?raw` import, the one-time `__ASSET__` resolution
  (fail-loud) and `applyModeClass()`; `src/composables/useDisplayMode.ts` mirrors
  the canonical contract (`src/display-mode.ts`) from the URL into a reactive ref
  and re-syncs on `popstate` (no in-page control → no divergent state).
  `src/data/career.ts` is a typed facade over the authoritative
  `scripts/career-data.mjs` (typed by `scripts/career-data.d.mts`), exposing only
  `IDENTITY` — no duplicated content. Responsive sizing in `src/styles/base.css`
  keeps the full viewBox visible at desktop/tablet/mobile with no horizontal
  overflow; the assembled SVG gained `<desc>`/`aria-describedby`. Detailed is
  unchanged (the only SVG-source change is the invisible `<desc>`). See
  `src/svg/README.md` §Stage 9 and `STAGE_09_VUE_INTEGRATION.md`.
- **Stage 10 (2026-10-14): COMPLETE — final polish + deployment.** Compared
  with Stage 9 the SVG artwork is unchanged. The whole exterior projecting sign
  is now ONE link (generator `svgLink()` wraps its complete `dw-sign-group` in a
  `target="_blank" rel="noopener noreferrer"` anchor). A custom diorama zoom
  (independent of browser zoom) was added: `src/composables/useZoom.ts` holds the
  `1×`/`4×` toggle and measures the default SVG width on activation;
  `src/App.vue` wraps `DioramaView` in a scrollable `.zoom-viewport` and renders a
  floating `Zoom` button (`src/styles/base.css`) — **Detailed mode only**;
  **large amber, fixed top-left** at 1×, **small** (still the zoom-out action)
  at 4×, never hidden within Detailed; the enlarged diorama pans natively with
  **scrollbars hidden** and a window resize returns to 1×. Deployment: Vite
  `base: '/cv/'` and `.github/workflows/deploy.yml` (official Pages artifact
  flow, Node 22, `npm ci` + lint + type-check + build, least-privilege
  permissions). Perf review found no justified optimization (raster assets served
  as files, never base64; the inlined SVG dominates the JS bundle by design). A
  one-time repo setting is still required (Settings → Pages → Source =
  "GitHub Actions"); the live deployment is not yet verified. See
  `STAGE_10_FINAL_POLISH.md` and `src/svg/README.md` §Stage 10.
- **Next: verify the live GitHub Pages deployment** after enabling the Pages
  source and pushing to `main`.

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
6. **Fixed content rules.** Indelve's information layer is intentionally empty
   (its illustrated scene is the content) and Pacer's role/technology content was
   supplied by the user in Stage 7 — **never invent** responsibilities,
   technologies, dates, or achievements for a section without verified source
   data. The entrance sign must NOT contain current professional titles
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
