# AGENTS.md

## Project Overview

Visual representation of a professional software-development career as an **isometric
architectural diorama**: a multi-floor building where each floor represents a career
stage, growing upward over time. Published as a web project (Vue.js) hosted on GitHub Pages.

The primary visual source is **editable, modular SVG geometry** — never a raster image.

## Key Documents

- `.agent/project-info/PROJECT_BRIEF.md` — WHAT the project is (full career content, layout, visual concept)
- `.agent/project-info/IMPLEMENTATION_PLAN.md` — HOW it is developed (stage roadmap)
- Stage specs (`STAGE_XX_*.md`) — defined before starting each stage; contain exact requirements and acceptance criteria

## Development Status

- Project is nearly empty; **Stage 0 (Project Foundation) is next**.
- Stages 0–10 proceed sequentially: wireframe → geometry → structure → illustration
  style → materials → career content → information layer → display modes → Vue
  integration → polish/deployment.

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

## Non-Goals (initially)

No photorealism, no 3D render, no pixel art / sci-fi look, no game-like interaction,
no mobile-first optimization before desktop composition works, no encoding all text
permanently into the SVG architecture.
