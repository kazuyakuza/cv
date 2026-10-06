# Stage 5.5 — Visual Enrichment, Assets and Diorama Atmosphere

> **STATUS: COMPLETE (2026-10-05).** Every requirement below was implemented and
> user-reviewed; the acceptance criteria (§17) were met. See
> `.agent/todo/STAGE_05.5_VISUAL_ENRICHMENT_CONTINUE_3.md` for the final handoff.
> Stages 6–10 are out of scope for 5.5 (future sessions).

## Purpose

Significantly improve the visual quality of the current diorama without redesigning its established architecture.

Stage 5 established the initial materials, colors, shading and architectural detailing. The current result is structurally correct and usable as a base, but it still looks too flat, empty and diagrammatic compared with the project's primary visual reference.

This stage is a **visual enrichment pass** focused on transforming the current building from a colored architectural structure into a richer illustrated architectural diorama.

The existing geometry, floor arrangement, career structure, sectional composition and camera should remain the foundation.

Use `PROJECT_BRIEF.md` and `AGENTS.md` as the authoritative sources for project-wide rules and visual references.

---

## 1. Primary Visual Target

Use the primary StockCake reference defined in `PROJECT_BRIEF.md` as the main visual direction.

The goal is **not to reproduce the reference literally**.

Instead, adopt its visual principles:

* illustrated industrial/architectural appearance;
* strong material differentiation;
* dark structural elements contrasted with lighter surfaces;
* restrained but richer color palette;
* visible infrastructure;
* pipes, conduits, panels and mechanical elements;
* believable construction details;
* layered depth;
* controlled visual irregularity;
* richer interior spaces;
* small functional objects;
* subtle wear and surface variation;
* strong visual hierarchy.

The result should feel like a **designed architectural illustration / diorama**, not a CAD diagram.

---

## 2. Correct the Current Flat Appearance

The current building is too uniform in:

* wall color;
* floor color;
* line treatment;
* lighting;
* interior density;
* material differentiation;
* visual contrast.

Increase depth through several coordinated layers rather than simply adding more detail.

Prioritize:

1. material contrast;
2. light/dark separation;
3. interior depth;
4. structural elements;
5. infrastructure;
6. small objects and props;
7. surface variation;
8. controlled color accents.

Do not solve flatness by adding random decorations everywhere.

---

## 3. Rework the Overall Palette

The current pale/cream appearance should be substantially improved.

Introduce a richer illustrated palette inspired by the primary reference:

* muted structural darks;
* cool or desaturated wall tones;
* warmer floor/material tones;
* darker recessed areas;
* restrained accent colors;
* occasional stronger colors for important infrastructure or objects.

The palette should remain cohesive and professional.

Avoid:

* neon colors;
* excessive saturation;
* rainbow-like variation;
* photographic color grading;
* excessive gradients;
* generic "flat UI" colors.

The building should have clear tonal hierarchy even before any text is added.

---

## 4. Replace the Current Light Background

The current white/light background should no longer be treated as the final visual direction.

Replace it with a darker or more atmospheric background that better supports the illustrated building.

The background should:

* provide contrast against the building;
* visually frame the diorama;
* make the building feel like a standalone illustrated object;
* work with the future information overlays;
* remain subordinate to the architecture.

Do not simply use pure black.

Prefer a dark, muted, desaturated environment or illustrated backdrop compatible with the project's palette.

The ground/base area should also be reconsidered. The current pale green polygon feels disconnected from the building and should be replaced or substantially redesigned into a more intentional environment/base.

Possible directions include:

* dark neutral ground;
* muted industrial surface;
* illustrated architectural presentation base;
* subtle environmental plane;
* restrained shadow/ambient area around the building.

The exact implementation should be chosen based on the visual result rather than forced into a particular material.

---

## 5. Increase Interior Visual Density

The largest visual weakness of the current result is that many floor sections are essentially empty rooms.

Each major career section should receive a small number of meaningful visual elements.

Examples include:

* desks;
* workstations;
* computers/monitors;
* shelves;
* storage;
* tools;
* equipment;
* technical panels;
* server/network elements;
* cables;
* plants;
* lamps;
* chairs;
* machinery;
* small architectural objects.

These objects should communicate the character of the space without turning the project into a literal office simulation.

Use objects selectively.

A floor should feel **occupied and constructed**, not cluttered.

---

## 6. Use the Available Asset and Icon Tooling

The newly available MCP tools should be actively considered during this stage.

### Iconify

Use `iconify` when an appropriate existing vector icon can improve a small visual element.

Potential uses include:

* technology-related objects;
* computers;
* networking equipment;
* tools;
* plants;
* furniture;
* small UI-like technical elements;
* recognizable technology symbols.

Do not place logos or icons simply because they are available.

They must make visual sense inside the corresponding career section.

---

### Free SVG Asset Sources

Use the free asset sources defined in `AGENTS.md` when appropriate:

* unDraw;
* SVGL;
* Kenney;
* IconScout free assets only;
* Isocons.

Prefer SVG assets when they integrate naturally with the illustration.

Respect the project's licensing rules.

Do not introduce premium or unclear-license assets.

---

### Nano Banana

`nano-banana` may be used to generate small utility raster assets when a generated image would materially improve the composition.

Appropriate examples may include:

* small illustrated objects;
* subtle environmental elements;
* unique equipment;
* decorative but functional architectural props;
* texture elements;
* small visual elements that are difficult or inefficient to create manually as SVG.

Generated raster assets must remain supplementary.

Never use generated raster imagery as the core building, floors, walls, stairs, elevator or architectural structure.

---

### SVG Generation / Editing MCPs

Use the available SVG tooling when useful:

* `tjboudreaux-cc-skills-svg-generator`
* `genwavellc/svgmaker-mcp`
* `undirectlookable-svgo-mcp`

These tools may be used to create, refine or optimize reusable SVG elements.

Keep architectural SVG structure modular and editable.

Do not flatten the complete illustration into a single SVG or raster image.

---

## 7. Introduce Vertical Infrastructure

The primary reference gains much of its visual character from infrastructure crossing multiple levels.

Introduce selected elements such as:

* pipes;
* conduits;
* cable runs;
* vertical service pipes;
* ventilation;
* electrical lines;
* junction boxes;
* structural brackets;
* rails;
* supports;
* utility panels.

Some elements should visibly connect multiple floors where appropriate.

This is especially useful around:

* elevator/service core;
* side structural areas;
* floor edges;
* utility areas;
* technical sections.

Infrastructure should have a reason to exist.

Avoid random decorative pipes.

---

## 8. Improve Material Differentiation

Different architectural elements should no longer feel like variations of the same flat surface.

Differentiate:

* concrete/structural slabs;
* painted walls;
* metal components;
* elevator components;
* stairs;
* floor surfaces;
* technical equipment;
* glass where appropriate;
* structural beams;
* doors/panels.

Use simplified illustrated representations rather than photorealistic textures.

Subtle:

* seams;
* panel boundaries;
* joints;
* scratches;
* surface variation;
* edge wear;
* tonal inconsistencies

may be introduced where they improve the result.

Do not make every surface noisy.

---

## 9. Improve Lighting and Depth

Introduce a coherent illustrated lighting model.

The goal is not physically accurate rendering.

Use:

* darker recessed areas;
* stronger underside contrast;
* interior shadowing;
* subtle contact shadows;
* floor/wall separation;
* darker structural components;
* controlled highlights;
* tonal separation between adjacent materials.

The open sectional areas should remain clearly readable.

Avoid heavy photographic shadows or excessive global illumination.

---

## 10. Add Meaningful Props to Career Areas

Objects may be used to subtly reinforce the character of different career stages.

Examples:

* game-development related objects around Puelo Games / Freelancer;
* development workstations around software-development sections;
* database/server/network equipment around HealthPlatforms;
* technical/product-oriented objects around other relevant sections;
* technology symbols or tools where they genuinely help.

Do not invent specific professional responsibilities for Indelve or Pacer.

Their spaces may receive generic architectural/technical props, but no unsupported career-specific claims should be visually encoded.

---

## 11. Preserve the Information Layer

Architectural enrichment must not compromise future career information.

Maintain the hierarchy:

1. building silhouette;
2. floor and section structure;
3. career/company information;
4. major architectural elements;
5. props and infrastructure;
6. micro-details.

Do not place important objects directly over areas reserved for future labels or descriptions.

The architecture should remain understandable without the text layer.

---

## 12. Improve the Ground / Entrance Composition

The entrance area should feel like part of the same illustrated environment as the building.

Review:

* entrance platform;
* path;
* ground plane;
* entrance structure;
* sign;
* surrounding shadow;
* relationship between sign and building.

The existing sign may remain as a placeholder.

Do not implement the final profile photo, QR code or final personal information yet.

---

## 13. Controlled Visual Imperfection

Preserve the illustrated character introduced during Stage 4.

Continue using subtle variation in:

* line weight;
* surface boundaries;
* object placement;
* texture;
* small construction details.

However, keep the main architecture precise.

The target is:

**structured geometry + illustrated imperfection**

not:

**rough or inaccurate geometry**.

---

## 14. Asset Integration Rules

External or generated assets must be integrated into the illustration rather than appearing as pasted-on clip art.

For every imported asset:

* adapt scale;
* adapt perspective;
* adapt colors where possible;
* adapt line treatment where appropriate;
* apply consistent shading;
* place it intentionally within the architecture.

Prefer assets that visually belong to the same illustration language.

If an asset looks stylistically disconnected, do not use it simply because it is technically available.

---

## 15. Preserve Modularity

Keep the SVG architecture modular.

Maintain meaningful groups/layers for at least:

* background;
* ground/base;
* entrance;
* building structure;
* individual floors;
* elevator;
* staircase;
* architectural infrastructure;
* props/assets;
* labels/information layer.

New assets should be isolated in appropriate groups.

Do not flatten the illustration.

Run SVG optimization only after the visual structure is stable.

---

## 16. What This Stage Must NOT Do

Do not:

* redesign the established floor arrangement;
* change the career chronology;
* invent Indelve responsibilities;
* invent Pacer responsibilities;
* close the open front/right sectional view;
* redesign the staircase;
* redesign the elevator architecture;
* add final career descriptions;
* add final typography;
* add the final profile photo;
* add the final QR code;
* implement overview/detailed modes;
* add animations;
* optimize for mobile yet.

This stage is primarily a **visual quality and atmosphere pass**.

---

## 17. Acceptance Criteria

Stage 5.5 is complete when the result clearly feels different from the current Stage 5 output.

Specifically:

* the white/light background has been replaced with a more intentional atmospheric environment;
* the ground/base integrates visually with the building;
* the building has substantially stronger tonal contrast;
* materials are visually distinguishable;
* floor interiors no longer feel uniformly empty;
* selected career sections contain meaningful props;
* infrastructure appears in multiple areas;
* some infrastructure connects or visually relates to multiple floors;
* architectural surfaces have subtle variation;
* recessed areas have readable depth;
* the illustration has a richer, more coherent palette;
* assets/icons, when used, look integrated rather than pasted on;
* the StockCake reference's visual principles are noticeably reflected;
* the result still reads as the same building and career structure;
* SVG architecture remains modular and editable;
* the visual hierarchy remains clear.

### Final visual test

At the end of the stage, compare the result directly against the primary reference.

The important question is not:

> "Does the building contain more details?"

It is:

> "Does this now look like an illustrated architectural diorama rather than a flat architectural diagram?"

If the answer is still no, continue refining the visual treatment before moving to Stage 6.
