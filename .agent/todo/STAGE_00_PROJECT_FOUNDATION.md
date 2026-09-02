# Stage 0 — Project Foundation

## 1. Purpose

Stage 0 establishes the technical and organizational foundation for the Professional Career Diorama before any visual construction work begins.

The project already exists inside a Git repository. This stage must therefore **not initialize a new Git repository** and must not replace or reorganize existing repository-level configuration unless explicitly required by the existing project instructions.

The objective is to leave the repository in a clean, minimal, reproducible state from which Stage 1 can create the first complete architectural SVG wireframe.

Stage 0 is a **foundation stage**, not a visual-development stage.

At the end of this stage:

* the project should have a working Vue.js / TypeScript development environment;
* the repository should have a clear source/assets structure;
* project documentation should have an unambiguous location;
* existing `AGENTS.md` / `.agents` instructions must remain authoritative and intact;
* basic quality tooling should work;
* the application should start, build, and preview successfully;
* the project should be ready for Stage 1 to create the first SVG;
* no meaningful architectural illustration should exist yet.

---

# 2. Source of Truth and Instruction Hierarchy

Before making changes, inspect the repository and read the project instructions that already exist.

The repository currently defines the following conceptual documentation roles:

* `PROJECT_BRIEF.md` — what the project is;
* `IMPLEMENTATION_PLAN.md` — the high-level development roadmap;
* `STAGE_XX_*.md` — the detailed specification for one implementation stage.

The existing `AGENTS.md` explicitly describes:

* the project as an isometric architectural career diorama;
* editable modular SVG as the primary visual source;
* iterative visual-first development;
* the requirement to review rendered SVGs between stages;
* modular floor construction;
* sectional/cutaway architecture;
* separation of architecture and information layers;
* restrictions around Indelve and Pacer content;
* the unfinished fifth floor;
* Vue.js, SVG, HTML/CSS, query-parameter modes, and GitHub Pages;
* the project's initial non-goals.

These instructions must be respected throughout Stage 0.

## Important

Do not silently modify the meaning or hierarchy of existing project instructions.

If instructions in `AGENTS.md`, `.agents`, or other repository-level agent files conflict with this stage document, stop and resolve the conflict explicitly rather than guessing.

---

# 3. Existing Git Repository

The repository already exists.

Before implementation, inspect:

```bash
git status
git branch --show-current
git remote -v
```

If the repository contains existing work that is unrelated to this project, do not delete it merely to make the repository look clean.

Stage 0 should be additive and conservative.

---

# 4. Repository Discovery

Before creating files, determine what is already present.

Do not create duplicate structures simply because this specification proposes a preferred layout.

If an equivalent structure already exists, reuse it.

If the repository is genuinely nearly empty, establish the structure described below.

---

# 5. Agent Instructions and `.agents`

`AGENTS.md` and the `.agents` directory are part of the project's development environment.

They are **not application assets**.

Stage 0 must:

1. inspect their contents;
2. understand their intended scope;
3. preserve them;
4. avoid duplicating their instructions unnecessarily;
5. follow any relevant coding-agent rules they define.

If `.agents` contains additional project-specific instructions, templates, skills, workflows, prompts, or conventions, those instructions must be incorporated into the implementation decisions for this stage.

Do not move or rename agent files merely for aesthetic consistency.

Do not add a second competing instruction system unless there is a concrete need.

If there are nested agent instructions, determine their scope according to their location and existing repository conventions before modifying files under those directories.

---

# 6. Documentation Structure

The project documentation should remain clearly separated by purpose.

The repository's current `AGENTS.md` references:

```text
.agent/project-info/PROJECT_BRIEF.md
.agent/project-info/IMPLEMENTATION_PLAN.md
```

The Stage 0 document should be stored alongside the project information documents:

```text
.agent/
└── project-info/
    ├── PROJECT_BRIEF.md
    ├── IMPLEMENTATION_PLAN.md
    └── STAGE_00_PROJECT_FOUNDATION.md
```

Future documents should follow the established naming convention:

```text
STAGE_01_ARCHITECTURAL_WIREFRAME.md
STAGE_02_GEOMETRY_REFINEMENT.md
STAGE_03_ARCHITECTURAL_STRUCTURE.md
...
```

Do not create future stage specifications during Stage 0 unless explicitly requested.

The implementation plan remains an overview.

Detailed implementation requirements belong in the corresponding stage document.

---

# 7. Technology Stack

The minimum intended application stack is:

* Vue.js;
* TypeScript;
* Vite;
* SVG;
* HTML;
* CSS.

The initial dependency set should remain deliberately small.

## Vue.js

Vue.js is the application framework.

At this stage Vue is primarily needed to establish a working web application shell.

Do not build the final component architecture for the diorama yet.

That belongs to the later Vue integration stage.

## TypeScript

Use TypeScript for application code.

The project is intended to become a structured interactive portfolio rather than a single static SVG file, so TypeScript should be established from the beginning.

## Vite

Vite is the recommended build and development environment.

Reasons:

* minimal configuration;
* fast development feedback;
* straightforward Vue integration;
* static build output suitable for GitHub Pages;
* no need for a larger application framework.

Do not introduce Nuxt or another full-stack framework.

The project does not require server-side rendering or a backend.

---

# 8. Supporting Libraries

Additional libraries should only be introduced when they solve a real problem.

The project should avoid dependency bloat.

## 8.1 ESLint — Recommended

Use ESLint for JavaScript, TypeScript, and Vue source code.

Purpose:

* catch common errors;
* maintain consistent source quality;
* reduce accidental technical debt during iterative development.

The configuration should remain minimal.

Do not introduce an unnecessarily elaborate linting system.

---

## 8.2 Prettier — Recommended

Use Prettier if it fits naturally with the repository's conventions.

Purpose:

* consistent formatting;
* reduced formatting noise;
* easier collaboration with coding agents.

Do not allow formatting of large hand-maintained SVG files to produce unnecessary massive diffs.

If necessary, exclude source SVG files from automatic formatting.

---

## 8.3 SVGO — Recommended

SVGO is a good candidate for this project because SVG is the primary visual artifact.

Potential uses:

* optimize SVG size;
* remove redundant SVG attributes;
* reduce unnecessary metadata;
* prepare production assets.

However, the editable source SVG remains authoritative.

Optimization must **not** destroy meaningful structure.

In particular, do not configure optimization to aggressively remove:

* semantic group IDs;
* useful group structure;
* important attributes;
* manually useful metadata.

The optimized result should be treated as generated output, not the editable source.

SVGO should therefore be considered a build/asset tool rather than a runtime dependency.

---

## 8.4 Vitest — Optional / Deferred

Vitest is a reasonable future testing solution because it integrates naturally with Vite.

It is not required to create a meaningful test suite during Stage 0.

Testing becomes useful when the project contains:

* career data transformations;
* mode-selection logic;
* reusable components;
* non-trivial application logic;
* SVG-related generation/transformation code.

Therefore:

* Vitest infrastructure may be introduced if useful;
* a complete test suite is explicitly out of scope.

Do not add tests merely to satisfy generic coverage expectations.

---

## 8.5 SVG Loader Libraries — Defer

Libraries such as `vite-svg-loader` may eventually be useful if the SVG is imported directly as a Vue component.

Do **not** add one automatically during Stage 0.

The final SVG integration strategy has not yet been decided.

Possible future strategies include:

* importing SVG as an asset;
* embedding SVG directly;
* injecting SVG into the DOM;
* treating SVG as a Vue component;
* combining static SVG geometry with Vue-generated information layers.

That decision belongs to the later Vue integration stage.

---

## 8.6 Libraries Explicitly Not Needed

Do not introduce:

* Three.js;
* Babylon.js;
* WebGL frameworks;
* canvas rendering frameworks;
* GSAP;
* game engines;
* UI component libraries;
* Pinia;
* Vue Router;
* Tailwind CSS.

This is not a prohibition against ever using them.

It is a Stage 0 dependency rule.

A later stage may introduce a dependency if an actual requirement justifies it.

---

# 9. Proposed Repository Structure

If the repository is sufficiently empty, use a structure approximately like:

```text
/
├── AGENTS.md
├── .agent/
│   └── project-info/
│       ├── PROJECT_BRIEF.md
│       ├── IMPLEMENTATION_PLAN.md
│       └── STAGE_00_PROJECT_FOUNDATION.md
├── public/
├── src/
│   ├── App.vue
│   ├── main.ts
│   ├── assets/
│   ├── components/
│   ├── data/
│   ├── styles/
│   └── svg/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── eslint.config.*
├── .prettierrc*
├── .gitignore
└── README.md
```

This is a target structure, not a requirement to create empty directories for every future concern.

Only create directories that have an actual purpose.

Do not create a large component hierarchy before components exist.

---

# 10. SVG Source Location

SVG is the primary visual source.

The source SVG should have a dedicated and clearly identifiable location.

Preferred:

```text
src/svg/
```

An alternative such as:

```text
src/assets/diorama/
```

is acceptable if the existing repository structure makes it more appropriate.

Choose one convention and document it.

The important properties are:

* source SVG is easy to find;
* SVG is treated as source/artwork rather than generated garbage;
* SVG remains editable;
* later stages can modify it without reverse-engineering a raster image.

**Do not create the Stage 1 SVG during Stage 0.**

---

# 11. Generated vs Source Assets

The project should distinguish clearly between source artifacts and generated artifacts.

Conceptually:

```text
SOURCE
  └── editable SVG

BUILD
  └── generated application output
```

Temporary artifacts should normally not be committed, including:

* screenshots;
* local previews;
* editor caches;
* temporary SVG exports;
* generated test artifacts.

If a later stage produces a deliberate visual-review artifact, keep it outside production source unless there is a reason to version it.

---

# 12. SVG Organization Principles

Stage 0 does not create the actual diorama geometry, but it establishes the organization rules that later SVG work must follow.

The SVG should eventually use meaningful groups.

Conceptually:

```xml
<svg>
  <g id="terrain">
    ...
  </g>

  <g id="entrance">
    ...
  </g>

  <g id="sign">
    ...
  </g>

  <g id="path">
    ...
  </g>

  <g id="building">
    <g id="floor-ground">
      ...
    </g>

    <g id="floor-01">
      ...
    </g>

    <g id="floor-02">
      ...
    </g>

    <g id="floor-03">
      ...
    </g>

    <g id="floor-04">
      ...
    </g>

    <g id="floor-05">
      ...
    </g>

    <g id="staircase">
      ...
    </g>

    <g id="elevator">
      ...
    </g>
  </g>
</svg>
```

This is an organizational model, not a Stage 0 implementation requirement.

IDs should describe architectural meaning.

Prefer:

```text
floor-ground
floor-01
elevator
staircase-ground-to-first
entrance
career-sign
```

over generated identifiers such as:

```text
group42
rect891
path123
```

Meaningful structure is important because later stages will iteratively modify the SVG.

---

# 13. Architecture Layer vs Information Layer

The project must maintain a conceptual separation between the architectural representation and professional information.

## Architectural layer

SVG/vector geometry:

* terrain;
* path;
* entrance;
* floors;
* walls;
* stairs;
* elevator;
* structural elements;
* architectural details;
* decorative objects.

## Information layer

HTML/CSS/Vue or SVG text where appropriate:

* company names;
* roles;
* dates;
* technologies;
* skills;
* project descriptions;
* current professional identity.

Do not hard-code the complete professional profile into the SVG during Stage 0.

Do not create the final career data model during Stage 0.

A temporary placeholder may exist if required for the application shell.

---

# 14. Initial Vue Application

Create the smallest useful Vue application.

At minimum:

* `main.ts` mounts the Vue application;
* `App.vue` renders the application shell;
* the application starts locally;
* the application builds successfully;
* the production build can be previewed.

The initial page should communicate that the project is running.

It should **not** attempt to represent the final diorama.

A minimal placeholder is sufficient:

* project title;
* short description;
* indication that the visual is under construction.

Do not spend visual-design effort on this placeholder.

Stage 1 will replace it with the architectural wireframe.

---

# 15. CSS Foundation

Create only a minimal CSS foundation.

The application should:

* occupy the available viewport appropriately;
* avoid unwanted browser default margins;
* use predictable box sizing;
* provide a neutral background;
* provide a sensible container for the future SVG.

Do not implement:

* final color palette;
* final typography;
* final responsive behavior;
* animations;
* visual effects.

The first visual target is desktop composition.

---

# 16. Package Manager

Package manager: npm.

---

# 17. Development Scripts

The project should support the following basic lifecycle.

For npm, the expected commands are conceptually:

```bash
npm run dev
npm run build
npm run preview
```

Where appropriate, also provide:

```bash
npm run lint
npm run format
npm run format:check
```

The exact script names may be adapted to existing repository conventions.

Do not create scripts that duplicate the same functionality under several names without a reason.

---

# 18. TypeScript Configuration

Configure TypeScript for Vue.

The configuration should:

* support `.ts`;
* support Vue SFC development;
* use strict checking where practical;
* avoid unnecessary compiler complexity;
* work correctly with Vite.

Do not disable strictness globally merely to make initial code compile.

If the repository already contains TypeScript configuration, adapt it instead of blindly replacing it.

---

# 19. Linting and Formatting

At the end of Stage 0, source-quality tooling should be usable.

Linting should cover:

* TypeScript;
* Vue source;
* relevant application code.

Formatting should cover:

* source code;
* configuration files;
* documentation if desired.

Formatting of large SVG files should be handled deliberately.

If automatic formatting produces noisy or destructive SVG diffs, exclude source SVG from formatting.

The objective is maintainability, not maximum tool coverage.

---

# 20. Git Ignore

Review the existing `.gitignore`.

At minimum, ensure appropriate handling of:

```text
node_modules/
dist/
*.log
.DS_Store
```

Do not overwrite an existing `.gitignore` wholesale.

Merge required entries into the existing configuration.

Do not ignore:

* source SVG;
* application source;
* project documentation;
* agent instructions.

---

# 21. README

If no README exists, create a minimal one.

It should explain:

* what the project is;
* that it is a professional career diorama;
* that SVG is the primary visual source;
* that Vue is used for the web application;
* that development is staged and iterative;
* where the project documentation lives;
* how to run the project locally.

Do not duplicate the complete contents of `PROJECT_BRIEF.md`.

The README is the developer entry point.

The project brief remains the detailed conceptual source of truth.

---

# 22. GitHub Pages Preparation

The final project will be hosted on GitHub Pages.

Stage 0 should ensure the chosen Vite setup is compatible with static hosting.

However, complete deployment belongs to Stage 10.

Do not create the complete deployment workflow yet.

Do not hard-code an invented repository name into the configuration.

The eventual base path should be determined from the actual repository when deployment is configured.

The Stage 0 application must remain usable locally regardless of the eventual GitHub Pages base path.

---

# 23. Environment Variables

No environment variables should be required for Stage 0.

This is a static portfolio project.

Do not introduce:

* backend secrets;
* authentication;
* API keys;
* database credentials;
* server-side configuration.

Future data such as the LinkedIn URL and QR code will be handled in later stages.

Never commit credentials or private keys.

---

# 24. Dependency Decision Record

Any dependency added during Stage 0 should have an obvious justification.

The intended baseline is approximately:

### Runtime

```text
vue
```

### Development/build

```text
vite
typescript
Vue TypeScript tooling required by the chosen setup
eslint
prettier (if adopted)
svgo (if adopted)
```

Potential future dependencies should not be installed speculatively.

Examples:

* no Pinia until global state actually exists;
* no Router until routing actually exists;
* no SVG loader until the SVG integration strategy is known;
* no animation library until animation is actually required;
* no 3D library because the project is intentionally SVG-based.

---

# 25. Stage 0 Scope Boundary

The following are explicitly **out of scope**.

Do not implement:

* final SVG geometry;
* complete building wireframe;
* exact floor dimensions;
* final isometric perspective;
* final architectural style;
* final colors;
* hand-drawn linework;
* architectural material textures;
* career-specific visual objects;
* company-specific illustrations;
* final professional text placement;
* QR code;
* profile photograph;
* Overview mode;
* Detailed mode;
* interactive floor selection;
* complex animations;
* final responsive behavior;
* GitHub Pages deployment;
* final accessibility pass;
* final performance optimization.

Those belong to later stages.

---

# 26. Stage 0 Deliverables

When Stage 0 is complete, the repository should contain a working project foundation.

## Documentation

* existing project documentation preserved;
* `STAGE_00_PROJECT_FOUNDATION.md` added in the correct documentation location.

## Application

* working Vue application;
* TypeScript configuration;
* Vite configuration;
* minimal CSS foundation.

## Tooling

* package manager and lockfile;
* linting;
* formatting if adopted;
* optional SVG optimization tooling if adopted.

## Structure

* clear location for source SVG;
* clear location for application source;
* clear location for project documentation.

## Repository hygiene

* appropriate `.gitignore`;
* no temporary build artifacts committed;
* no duplicate lockfiles;
* no unnecessary dependencies.

---

# 27. Transition to Stage 1

Do not begin Stage 1 automatically as part of Stage 0.

The next stage is:

> **Stage 1 — Complete Building Wireframe**

Stage 1 will create the first complete SVG representation of the entire diorama.

The Stage 1 specification must be consulted before creating that SVG.

The visual result must be rendered and reviewed before moving to Stage 2.
