# Stage 5 — Materials, Colors and Architectural Details

## 1. Purpose

Stage 5 adds **materiality, restrained color, depth and believable architectural details** to the structure produced by the previous stages.

The geometry, perspective, proportions, floor arrangement, staircase, elevator, openings and sectional composition are already established. Do not redesign them unless a specific issue prevents the new visual treatment from working correctly.

The primary visual reference for this stage is the architectural illustration style identified in `PROJECT_BRIEF.md`.

The goal is to move from a clean architectural line drawing toward a **stylized sectional architectural diorama** with enough visual richness to feel constructed, while remaining clean and readable.

---

# 2. Main Objective

Transform the current structural SVG into a visually richer architectural object by introducing:

* a restrained color palette;
* differentiated floor and wall surfaces;
* basic material representation;
* subtle shading;
* architectural surface patterns;
* structural infrastructure;
* small construction details;
* controlled visual irregularity.

The result should feel **illustrated and physical**, not photorealistic.

Do not turn the building into a highly detailed 3D render.

---

# 3. Reference Style

Use the visual reference defined in `PROJECT_BRIEF.md` as the primary stylistic reference.

The reference should guide:

* color relationships;
* illustrated architectural appearance;
* surface treatment;
* simplified construction details;
* visual density;
* balance between clean geometry and hand-crafted appearance.

Do **not** copy the reference literally.

The project has its own geometry and composition. The reference establishes the visual language, not the building design.

---

# 4. Color Palette

Introduce color gradually and keep the palette restrained.

The building should no longer consist primarily of white, unfilled surfaces.

Use a limited family of compatible tones for:

* structural walls;
* floor surfaces;
* ceiling/underside surfaces;
* stairs;
* elevator structure;
* exterior/terrain;
* architectural accents.

Colors should provide enough contrast to distinguish adjacent architectural elements without turning every element into a different color.

Avoid:

* highly saturated colors;
* excessive gradients;
* neon colors;
* strong photographic lighting;
* excessive shadows;
* visually noisy textures.

The palette should remain coherent across every floor.

---

# 5. Floor Surfaces

The floors are currently visually too flat.

Introduce a subtle surface treatment so that each floor reads as an actual constructed floor rather than a plain polygon.

Possible treatments include:

* simplified tiles;
* modular floor panels;
* subtle grid patterns;
* concrete slabs;
* wooden or neutral architectural surfaces;
* other restrained patterns consistent with the reference style.

The exact material does not need to be identical on every floor.

However, differences should be intentional and visually coherent.

### Important

Do not create a highly detailed texture covering every square pixel.

The floor treatment must remain subordinate to the career information that will eventually occupy the building.

---

# 6. Walls and Structural Surfaces

Give the visible structural walls a material identity.

Introduce subtle differences between:

* exterior structural surfaces;
* interior partitions;
* floor slabs;
* elevator structure;
* stair elements.

The sectional/cutaway nature of the building must remain obvious.

Do not close the currently open front and right sides merely to add material detail.

The building must continue to function visually as a sectional architectural object.

---

# 7. Shading and Depth

Introduce restrained shading to reinforce the existing perspective.

Use shading to communicate:

* floor thickness;
* depth of slabs;
* recessed areas;
* interior/exterior separation;
* stair depth;
* elevator structure;
* wall thickness.

Shading should be primarily structural rather than dramatic.

Prefer:

* subtle tonal differences;
* simple shadows;
* limited gradients where genuinely useful;
* controlled ambient depth.

Avoid:

* realistic global illumination;
* strong cast shadows;
* glossy materials;
* photorealistic rendering.

---

# 8. Architectural Infrastructure

Begin introducing small architectural elements that make the building feel constructed.

Potential elements include:

* pipes;
* conduits;
* cables;
* electrical panels;
* ventilation elements;
* structural brackets;
* beams;
* joints;
* rails;
* utility boxes;
* small service elements.

These elements should be used selectively.

They are **supporting details**, not the main visual subject.

Do not distribute random infrastructure uniformly across every surface.

---

# 9. Stairs

The existing staircase geometry and position are already established.

Do not redesign the staircase during this stage.

Instead, improve its visual integration through:

* material;
* step definition;
* subtle shading;
* structural connections;
* handrail or other small details if visually appropriate.

Any additions must preserve the established staircase proportions and connection to the first floor.

---

# 10. Elevator

The elevator should become visually identifiable without dominating the composition.

Apply material treatment to the elevator structure and surrounding surfaces.

The elevator shaft should have enough visual definition to distinguish it from ordinary walls.

Possible details include:

* subtle panel divisions;
* floor indicators;
* doors;
* structural framing;
* restrained glass/translucent treatment where appropriate.

Do not reintroduce the large glass-heavy appearance previously rejected.

The elevator should remain relatively narrow and visually integrated into the building.

The uppermost elevator opening should remain compatible with the unfinished fifth-floor concept.

---

# 11. Existing Career Sections

The existing floor divisions must remain unchanged.

Do not move or merge:

* Puelo Games;
* B.A. Technology;
* Freelancer;
* NextCode;
* HealthPlatforms;
* Interatica;
* Indelve;
* Pacer;
* current AI-driven work.

The architectural material treatment should reinforce these sections rather than obscure their boundaries.

The existing company labels are part of the information layer and should not be replaced by decorative architectural elements.

---

# 12. Visual Irregularity

The final reference style contains a degree of illustration rather than perfectly sterile CAD geometry.

Introduce subtle irregularity where appropriate:

* minor line-weight variation;
* slightly imperfect surface patterns;
* small variations in architectural details;
* hand-drawn character in selected elements.

Do not distort the fundamental geometry.

The building must remain structurally clean and readable.

The desired effect is:

> professionally illustrated architecture rather than mechanically generated CAD.

---

# 13. Textures and Non-SVG Assets

SVG remains the primary visual representation, but **not every visual element must be constructed exclusively from primitive SVG geometry**.

If a small raster texture, image-based surface treatment, or other graphical asset produces a substantially better result, it may be considered.

However:

* do not replace the complete building with a raster image;
* do not flatten the architectural structure;
* do not make the visual dependent on a single raster composition;
* preserve the existing modular SVG architecture;
* keep important structural elements editable.

Raster or external graphical assets should be treated as supplementary visual material.

When possible, keep them isolated in clearly identified layers/groups.

---

# 14. Layer Organization

Maintain meaningful SVG grouping.

At minimum, preserve the conceptual separation between:

```text
terrain
entrance
building
  floor-ground
  floor-01
  floor-02
  floor-03
  floor-04
  floor-05
  staircase
  elevator
architectural-details
```

Additional material/detail groups may be introduced where useful.

Do not flatten the SVG into a single unstructured path collection.

The SVG must remain understandable and modifiable in later stages.

---

# 15. Information Hierarchy

Architectural detail must not compete with future professional information.

The visual hierarchy should remain approximately:

1. overall building silhouette;
2. floor/section structure;
3. career information;
4. architectural material/detail;
5. decorative micro-details.

If a decorative element makes company names, roles, dates or technology tags harder to read later, simplify or remove the decorative element.

---

# 16. Scope Control

This stage is **not** intended to complete the final illustration.

Do not implement:

* final career descriptions;
* technology tags;
* final typography;
* detailed information overlays;
* QR code;
* profile photograph;
* final Overview/Detailed modes;
* animations;
* interactive behavior;
* final responsive layout.

Those belong to later stages.

Likewise, do not attempt to fill every available surface with details.

The objective is to establish the **material and architectural visual language** that later stages can build upon.

---

# 17. Visual Review Criteria

Before considering Stage 5 complete, render the complete building and verify:

### Materiality

* floors no longer look completely flat;
* walls and structural elements have identifiable surfaces;
* different architectural elements are visually distinguishable.

### Color

* the palette is restrained;
* colors work consistently across all floors;
* no individual section contains an accidental or unexplained color transition.

### Depth

* floor thickness is readable;
* stairs have visual depth;
* elevator structure is understandable;
* shading reinforces rather than obscures the existing perspective.

### Architecture

* the building still reads clearly as a sectional/cutaway structure;
* the open front and right sides remain visually intentional;
* existing floor divisions remain clear;
* architectural details feel plausible rather than randomly decorative.

### Style

* the result is closer to the illustrated architectural reference;
* the drawing has some handcrafted character;
* it does not look photorealistic;
* it does not look like a generic 3D render;
* it does not become visually cluttered.

### Modularity

* existing SVG groups remain identifiable;
* structural geometry has not been flattened;
* future stages can continue modifying the building without rebuilding it from scratch.

---

# 18. Completion Criteria

Stage 5 is complete when the current wireframe/structural illustration has become a **coherent colored architectural diorama** with:

* a restrained palette;
* recognizable materials;
* readable floor surfaces;
* basic structural shading;
* visible architectural infrastructure;
* subtle illustrated irregularity;
* sufficient visual richness to support the career information layer.

The building should now feel like a finished **architectural illustration framework**, while still leaving room for the career-specific content and final information layer to be added in subsequent stages.

Do not proceed to the next stage until the complete rendered result has been visually reviewed.
