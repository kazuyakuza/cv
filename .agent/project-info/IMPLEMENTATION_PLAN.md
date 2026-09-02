# Professional Career Diorama — Implementation Plan

## Purpose

This document provides a high-level implementation roadmap for the professional career diorama.

It intentionally remains an overview.

Each stage will have its own dedicated document containing the complete requirements, visual specification, technical instructions, acceptance criteria, and any prompts or SVG-generation instructions required for that stage.

The project should be implemented sequentially.

After each visual stage, the generated result should be reviewed before proceeding to the next stage.

Note: the stages files will be defined before starting each stage.

---

## Stage 0 — Project Foundation

Establish the repository structure, documentation conventions, SVG organization, naming conventions, and initial web/project scaffolding.

**Main objective:** create a clean foundation for iterative development.

Detailed specification:
`STAGE_00_PROJECT_FOUNDATION.md`

---

## Stage 1 — Complete Building Wireframe

Create the first complete SVG representation of the entire diorama using only extremely simple geometry and lines.

Include the complete composition:

- terrain/base;
- sign;
- path;
- entrance;
- ground floor;
- first floor;
- second floor;
- third floor;
- fourth floor;
- fifth floor;
- staircase;
- elevator;
- major floor divisions.

No visual styling beyond what is necessary to understand geometry.

**Main objective:** validate composition, perspective, proportions, stacking, and spatial relationships.

Detailed specification:
`STAGE_01_ARCHITECTURAL_WIREFRAME.md`

---

## Stage 2 — Geometry and Structural Refinement

Refine the wireframe based on visual inspection.

Focus on:

- perspective;
- floor proportions;
- building footprint;
- floor height;
- staircase placement;
- elevator continuity;
- entrance/path relationship;
- sign placement;
- alignment between stacked floors.

**Main objective:** make the architectural system structurally convincing before adding visual detail.

Detailed specification:
`STAGE_02_GEOMETRY_REFINEMENT.md`

---

## Stage 3 — Basic Architectural Structure

Turn the refined wireframe into a recognizable building.

Introduce:

- structural walls that remain visible;
- floors;
- openings;
- staircase geometry;
- elevator structure;
- basic partitions;
- structural framing.

The front and right walls remain initially removed unless specifically reintroduced.

**Main objective:** establish the building as a readable sectional architectural object.

Detailed specification:
`STAGE_03_ARCHITECTURAL_STRUCTURE.md`

---

## Stage 4 — Illustration Style

Introduce the visual language inspired by the selected architectural references.

Develop:

- linework;
- hand-drawn character;
- subtle irregularities;
- sectional illustration treatment;
- visual hierarchy;
- technical-illustration qualities.

**Main objective:** transform the structural SVG into a coherent illustrated architectural diorama.

Detailed specification:
`STAGE_04_ILLUSTRATION_STYLE.md`

---

## Stage 5 — Materials, Colors and Architectural Details

Add visual depth through:

- materials;
- restrained color palette;
- shading;
- surface treatment;
- architectural infrastructure;
- conduits;
- pipes;
- panels;
- structural connections;
- small believable construction details.

**Main objective:** make the building feel physically constructed and visually rich without becoming cluttered.

Detailed specification:
`STAGE_05_MATERIALS_AND_DETAILS.md`

---

## Stage 6 — Professional and Project Content

Populate the building with visual elements that communicate the professional history.

Add, as appropriate:

- company-specific areas;
- project representations;
- technology-related objects;
- professional environments;
- visual metaphors for important responsibilities;
- current AI-development elements.

**Main objective:** connect the architectural environment to the actual career narrative.

Detailed specification:
`STAGE_06_CAREER_CONTENT.md`

---

## Stage 7 — Information Design

Add the textual information layer.

Implement:

- company names;
- roles;
- years;
- technologies;
- skills;
- concise project descriptions;
- current professional identity;
- entrance sign content;
- profile photograph;
- LinkedIn QR code.

**Main objective:** make the visual representation informative while preserving the diorama aesthetic.

Detailed specification:
`STAGE_07_INFORMATION_LAYER.md`

---

## Stage 8 — Detailed and Overview Modes

Implement the two information-density modes.

Detailed mode:

- default;
- richer information;
- exploration-oriented.

Overview mode:

- query-parameter driven;
- significantly reduced information;
- screenshot-friendly;
- optimized for rapid comprehension.

**Main objective:** allow the same diorama to serve both detailed exploration and high-level presentation.

Detailed specification:
`STAGE_08_DISPLAY_MODES.md`

---

## Stage 9 — Vue Integration

Integrate the SVG/diorama into the Vue application.

Implement:

- component structure;
- SVG integration;
- information data model;
- mode selection;
- query parameter handling;
- basic interactions if required;
- responsive behavior.

**Main objective:** turn the static visual artifact into the actual web application.

Detailed specification:
`STAGE_09_VUE_INTEGRATION.md`

---

## Stage 10 — Final Polish and Deployment

Perform final visual and technical refinement.

Potential work:

- typography;
- spacing;
- visual consistency;
- responsive behavior;
- performance;
- accessibility;
- GitHub Pages configuration;
- final URL behavior;
- screenshot composition;
- cleanup of SVG structure.

**Main objective:** produce the final publishable version.

Detailed specification:
`STAGE_10_FINAL_POLISH.md`

---

## Iteration Rule

The stages are ordered, but the project is intentionally iterative.

A stage may be repeated or partially revised when visual inspection reveals a problem.

The next stage should not be considered mandatory if the previous stage has unresolved structural or visual issues.

The actual rendered SVG is the primary feedback mechanism.

---

## Repository Documentation Strategy

The repository should contain:

- `PROJECT_BRIEF.md`
- `IMPLEMENTATION_PLAN.md`
- one detailed specification file per stage
- source SVG assets
- application source
- supporting assets
- generated/output artifacts where useful

The project brief describes **what the project is**.

The implementation plan describes **how the project will be developed at a high level**.

Stage documents describe **exactly what must be done in each iteration**.
