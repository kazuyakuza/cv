# Professional Career Diorama — Project Brief

## 1. Project Overview

This project is a visual representation of a professional software-development career as an isometric architectural diorama.

The final result should depict a multi-floor building whose physical structure represents the progression of the career. Each professional experience occupies a specific architectural area, while the building itself communicates progression, increasing responsibility, technical growth, and the current stage of development.

The diorama is intended to be published as a web-based project, ultimately implemented with Vue.js and suitable for hosting on GitHub Pages.

The project should be developed iteratively. The initial visual implementation must be extremely simple and structural. Visual style, colors, architectural details, objects, professional information, interaction, and polish are added progressively in later stages.

The SVG representation is intended to become the primary visual source. The building should be constructed as editable SVG geometry rather than relying on a single raster image.

---

## 2. Core Concept

The visual metaphor is:

> A professional career represented as a building that grows upward over time.

The viewer approaches the building from the lower-right foreground.

The visual journey begins outside the building with a personal identification sign, continues along a path toward the entrance, and then proceeds upward through the building floor by floor.

The building is therefore both:

- a physical architectural object; and
- a visual timeline of professional development.

The upper floors represent later stages of the career.

The highest floor is intentionally unfinished and under construction because it represents the user's current work and ongoing development in AI-driven software-development workflows.

---

## 3. Visual Concept

The final visual should resemble a stylized architectural diorama / sectional architectural illustration.

Primary visual inspiration:

- detailed sectional architectural illustrations;
- isometric miniature architectural models;
- hand-drawn technical/architectural illustration;
- modular architectural structures;
- exposed interiors.

The visual language should eventually be closer to a sophisticated illustrated architectural model than to:

- a conventional corporate infographic;
- a flat UI diagram;
- a photorealistic 3D render;
- pixel art;
- a futuristic sci-fi environment.

The visual style will be developed incrementally.

The first implementation must NOT attempt to reproduce the final illustration style.

---

## 4. Perspective and Camera

The viewer is positioned approximately in the lower-right foreground.

The building recedes diagonally toward the upper-left.

The visual composition should therefore establish a clear diagonal progression from:

1. viewer;
2. personal sign;
3. path;
4. building entrance;
5. ground floor;
6. upper floors;
7. current/top floor.

The exact projection, angles, proportions, and coordinates are to be established during the first SVG stages and refined iteratively.

Consistency is more important than mathematical purity.

---

## 5. Building Opening / Visible Interior

The building is treated as a sectional/cutaway architectural object.

Initially, the following walls should be completely absent:

- front wall;
- right-side wall.

This exposes the interior directly to the viewer.

The rear wall and left-side structural elements remain available to communicate the building's physical structure.

Later stages may introduce selected portions of walls, architectural frames, columns, or partial facade elements if they improve the composition.

The default rule is:

> Start completely open; add enclosure only when visually justified.

---

## 6. Modular Building Structure

The building is composed conceptually as vertically stacked floor modules.

Each floor must use a compatible:

- footprint;
- scale;
- perspective;
- floor height;
- structural alignment;
- elevator position;
- staircase alignment.

The SVG implementation should preserve this modularity even if the final visual is eventually represented as a single SVG document.

The architectural system should make it possible to manipulate individual floors independently.

---

## 7. Vertical Circulation

### Staircase

The staircase represents progression between professional stages.

The ground floor contains the staircase leading to the first floor.

The first floor receives the staircase directly from the ground floor.

Subsequent floors should maintain compatible staircase/landing alignment.

### Elevator

The elevator is a persistent vertical architectural element.

It is centrally positioned on the first floor between Nextcode and Health Platforms.

The elevator shaft visually continues through the upper floors and stops at each floor.

The elevator should become an important visual anchor of the building.

---

## 8. Exterior Entrance Area

Before entering the building, the viewer encounters a small exterior composition containing:

1. personal identification sign;
2. path;
3. building entrance.

### Personal Sign

The sign should be positioned outside the building near the path.

It should contain, in the final version:

- circular profile photograph;
- first and last name;
- QR code;
- clear LinkedIn label.

The QR code should point to the user's LinkedIn profile.

The sign should NOT contain current professional titles such as:

- Software Architect;
- Technical Lead;
- similar current-role descriptors.

Those should be represented within the main building/current-career area.

The visual sign itself should be treated as a physical architectural object.

---

# 9. Complete Building Layout

The following spatial structure is fixed.

## Ground Floor

The entrance leads into the Puelo Games area.

The professional progression within the ground floor is:

> Entrance → Puelo Games → BA Technology → Freelancer Game Developer → Staircase

The three experiences should therefore be spatially connected rather than represented as unrelated rooms.

### Puelo Games
Desarrollador Unity

Duration: jul. 2014 - jul. 2015

Role/context:

- first formal job;
- small game-development startup;
- worked almost entirely with the owner.

Technology / skills:

- Unity;
- C#;
- 2D game development;
- 3D game development;
- web;
- Android;
- end-to-end game implementation;
- prototyping;
- Unity Asset Store packages/plugins.

Relevant work:

- approximately 2–3 simple 2D games;
- at least two 3D projects;
- 3D infinite runner involving a police car, obstacles, coins and a criminal chase;
- prototype inspired by an older PlayStation-era aircraft/alien-invasion game;
- 2D game involving growing bubbles/spheres while avoiding moving balls.

Development was largely performed independently, from ideas/examples through implementation and builds.

There was no formal version-control system; cloud backup was used.

---

### BA Technology

Duration: jul. 2015 - jul. 2017

Role:

- entered as Junior Developer.

Context:

- user worked in the web-development group;
- small development team;
- clients included Fitch and Petroplastic.

Technology / skills:

- PHP;
- vanilla/common JavaScript;
- Bootstrap;
- MySQL;
- Git;
- AJAX;
- JSON endpoints;
- backend development;
- business-process analysis;
- algorithm implementation;
- technical client communication.

Important contribution:

The user pushed adoption of AJAX/JSON endpoint patterns, moving away from purely server-rendered HTML request flows.

#### Fitch

Web administration/panel related to financial/contract information.

Work included:

- backend/base functionality;
- CRUD;
- derived data;
- initial implementation before another developer continued the project.

#### Petroplastic

Major project.

The client had complex engineering calculations implemented in Excel spreadsheets.

The work involved:

- analyzing spreadsheet formulas;
- translating spreadsheet logic into understandable algorithmic steps;
- implementing mathematical/engineering calculations;
- using product data stored in MySQL dynamically;
- accepting web-form inputs;
- calculating required products/models/dimensions/specifications;
- calculating costs and other derived values;
- extensive technical/functional communication with the client;
- validation against spreadsheet results;
- detailed calculation logging;
- recording intermediate calculation results and steps.

The detailed logs allowed the client to compare system execution against spreadsheet execution and validate every stage.

The system also included:

- calculation frontend;
- administration/back office;
- user management;
- product management;
- calculation history/details.

Both major projects were completed and delivered.

---

### Freelancer Game Developer

Duration: jul. 2013 - jul. 2018

Several years earlier than the current profile; old experience.

Context:

- independent/freelance game development;
- own games and prototypes;
- projects for interviews and clients.

Technology / skills:

- Unity;
- C#;
- 2D;
- 3D;
- web;
- desktop;
- Android;
- AdMob;
- UI libraries/packages;
- reusable game systems;
- independent implementation.

Relevant example:

A 3D parking/car game involving:

- traffic;
- obstacle avoidance;
- basic pseudo-AI;
- reusable systems.

The project was nearly completed and later shared as a reusable base/prototype after client communication ended.

There was no formal version-control system; backups were used.

This experience should be represented visually but should not dominate the overall professional narrative.

---

# 10. First Floor

The staircase from the ground floor arrives directly at the Nextcode area.

The floor contains:

> Nextcode | Elevator | Health Platforms

The elevator is centrally positioned between Nextcode and Health Platforms.

---

## Nextcode

Duration: may. 2017 - may. 2019

Context:

- mini startup founded with a friend;
- responsibilities effectively combined CEO/CTO/COO functions;
- approximately 3–4 projects.

Technology / skills:

- Node.js;
- Express;
- JavaScript;
- jQuery;
- Bootstrap;
- Unity;
- MongoDB;
- Angular
- web development;
- payment integration;
- architecture;
- project definition;
- hiring;
- client interaction;
- business operations.

Relevant projects:

### Ecommerce / sales platform

Main product.

Included:

- storefront;
- back office;
- product management;
- user management;
- payment gateway integration.

The user:

- designed technical architecture;
- defined functionality;
- contributed to visual/functional decisions;
- developed the backend;
- worked with Node.js and Express;
- hired developers;
- hired a designer;
- managed project execution;
- handled client and business responsibilities.

The project reached a functional presentation stage but sales/client completion failed.

A later potential client did not result in completion.

### Christmas / year-end event experience

A camera/screen experience where:

- a person recorded a message;
- the face was augmented with a Santa hat/beard;
- voice was modified;
- the result was sent by email.

The user hired and managed development support.

### Web game

A separate web-game project with limited direct involvement by the user.

The friend and a hired developer handled most implementation.

This should receive little visual emphasis.

The startup eventually closed.

---

## Health Platforms

Duration: jul. 2017 - ago. 2019

Role:

- DBA.

Context:

- entered with limited prior DBA experience;
- database responsibilities grew substantially over time;
- large company;
- sensitive medical data environment;
- worked with developers and infrastructure/DevOps teams.

Technology / skills:

- MySQL;
- AWS Redshift;
- AWS DMS;
- SQL;
- database administration;
- data transformation;
- data migration;
- automation;
- Salesforce integration;
- technical documentation.

Major work:

### Data operations

Regularly handled large doctor/lead datasets.

Activities included:

- filtering;
- normalization;
- restructuring;
- deduplication;
- comparison with existing records;
- importing new records;
- updating existing records.

The user added reusable database functions and partial automation to formerly manual DBA processes.

### Salesforce integration

Investigated and resolved discrepancies between internal data and Salesforce.

This involved moving and correcting data between systems.

### MySQL → AWS Redshift migration

A performance/reporting project.

Work included:

- deciding which data to migrate;
- adapting schemas and data types;
- accounting for unsupported large text fields and potential information loss;
- creating Redshift schemas;
- creating transformation/conversion functions;
- working with DevOps/infrastructure to automate migration;
- reviewing AWS DMS logs;
- resolving migration errors;
- extensive handoff documentation.

The user learned most practical database knowledge during this period.

---

# 11. Second Floor

The entire second floor represents part of Interactica.

The floor should be predominantly open-plan.

It represents a major phase of professional growth.

---

# 12. Third Floor

The third floor represents the remaining part of Interactica plus a separate Indelve section.

The exact architectural division should communicate:

- a large Interactica area;
- a smaller distinct Indelve area.

---

# 13. Interactica

Duration: sept. 2019 - mar. 2025

Interactica is one of the most important stages in the career narrative.

The user entered as a developer and progressed into technical leadership and architecture.

Approximate progression:

> Developer → Senior/Technical Lead → Architect / Technical Leadership

Important characteristics of this stage:

- strong ownership;
- problem solving beyond formal responsibilities;
- identifying unresolved problems;
- analyzing possible solutions;
- discussing solutions with relevant stakeholders;
- implementing solutions when possible;
- defining solutions and delegating implementation when time required;
- increasing responsibility for architecture and technology decisions.

The environment encouraged deeper technical involvement.

The user became technical lead after earlier developers left and there was a need for technical leadership.

At peak, approximately 10 people technically reported to or relied on the user across multiple concurrent projects.

The user did not conduct technical hiring interviews.

The user did participate in:

- technical brainstorming;
- architecture discussions;
- technical communication with client-side engineers;
- integrations with existing client APIs;
- code reviews;
- documentation;
- mentoring;
- technical standards;
- planning;
- Scrum;
- task definition and distribution.

AWS/infrastructure knowledge grew substantially here.

Technologies and practices included:

- AWS;
- VPS/server administration;
- API deployment;
- CI/CD;
- Bitbucket pipelines;
- S3;
- CloudFront;
- NestJS;
- Angular;
- MongoDB;
- Flutter;
- JavaScript/TypeScript;
- backend architecture;
- frontend architecture;
- technical leadership.

The environment was mostly not microservices-oriented, although limited microservice usage may have existed later.

### Documentation

Documentation was a significant part of the user's contribution.

Examples include:

- AWS/VPS/API deployment documentation;
- CI/CD documentation;
- onboarding documentation;
- architecture documentation;
- technical standards.

---

## Major Interactica Project: Cleverlit

A SaaS platform used at international congresses for:

- digital document distribution;
- interaction metrics;
- reporting.

The user:

- designed the architecture;
- implemented essentially the entire backend;
- contributed substantially to the frontend;
- contributed approximately half of the administration panel;
- contributed approximately half of the kiosk frontend.

The backend was implemented extensively by the user.

Potential public-facing representation:

The Cleverlit public landing page may be linked as a LinkedIn project.

The user's contribution should be described briefly and accurately.

---

## Major Interactica Project: Engineering Calculation Platform

Client:

- renewable-energy / battery company.

Problem:

- complex engineering calculations existed in Google Sheets / Excel.

The user:

- implemented the backend API;
- used NestJS;
- translated mathematical/physical/engineering spreadsheet algorithms into software;
- implemented detailed step-by-step calculation logs;
- enabled technical validation of calculations.

The system included:

- technical input frontend;
- calculation API;
- embedded Unity visualization of the final project.

The visualization represented a project layout with elements such as battery containers and transformers.

The user implemented almost all of the backend, reaching more than 90% completion before the project was cancelled because the client company disappeared/became insolvent.

Frontend and Unity visualization were implemented by another developer.

---

## Major Interactica Project: Configurable Event Hub

A larger configurable event platform.

Team:

- approximately 6–7 developers.

Technology:

- NestJS;
- MongoDB;
- Angular / responsive web frontend;
- backend APIs;
- administration/back office.

Features could vary by event/client and included:

- event/company information;
- quizzes;
- Q&A;
- document/information requests by email;
- schedules/calendars;
- configurable sections.

The user acted as:

- architect;
- technical lead;
- planner;
- task distributor;
- technical decision maker.

The project followed a relatively strict Scrum process.

---

## Other Interactica Work

Other work included:

- web-based augmented reality;
- another renewable-energy calculation system using 3D web technologies;
- mobile application architecture.

### Mobile application

For a healthcare/ophthalmology-related client, the user:

- participated in architectural discussions;
- compared alternatives;
- proposed Flutter;
- designed the architecture;
- worked with NestJS/Angular/MongoDB architecture for backend/admin.

Another developer learned and implemented Flutter.

The user's direct coding contribution to the mobile frontend was limited.

A film project in Spain had minimal user involvement and should generally be omitted from the visual narrative.

---

# 14. Indelve

Duration: sept. 2021 - jun. 2023

Indelve occupies a separate section of the third floor.

The current project specification intentionally leaves detailed Indelve content to be verified from the user's source CV/profile information before final visual content is produced.

Do not invent responsibilities, technologies, dates, or achievements for Indelve.

---

# 15. Fourth Floor — Pacer

Duration: feb. 2025 - feb. 2026

The fourth floor represents Pacer.

Detailed Pacer content is to be verified from the user's source CV/profile information before final content is produced.

Do not invent responsibilities, technologies, dates, or achievements for Pacer.

---

# 16. Fifth Floor — Current AI Work

The fifth floor represents the user's current work and should be visually distinct from the completed floors.

It should be an open-air / unfinished / under-construction architectural floor.

The metaphor is intentional:

> The career is still being built.

Current professional focus includes AI-driven software-development workflows and autonomous coding agents.

Relevant concept:

> Experienced in AI-driven software development workflows, leveraging autonomous coding agents to accelerate implementation while maintaining architectural ownership, code quality, and technical decision-making.

The final floor should visually communicate:

- active construction;
- experimentation;
- ongoing development;
- software development;
- AI-assisted/autonomous workflows;
- architecture and technical ownership.

The exact objects and visual metaphors will be designed in later implementation stages.

---

# 17. Professional Narrative

The most important narrative is not simply a chronological list of employers.

The building should communicate an evolution:

1. Early game development and hands-on implementation.
2. Formal software development.
3. Translation of complex business/engineering processes into software.
4. Database and data engineering responsibilities.
5. Increasing technical ownership.
6. Architecture and technical leadership.
7. Mentoring and team guidance.
8. Infrastructure and deployment knowledge.
9. Large configurable systems and complex engineering platforms.
10. Current AI-driven software development workflows.

A recurring professional characteristic should be represented in the final narrative:

> The user tends to take ownership of unresolved problems, even when they fall outside formal responsibilities, identify the problem, analyze possible solutions, discuss them with the appropriate people, and either implement the solution or define/delegate it when time or team constraints require it.

This ownership/problem-solving pattern is more important than any individual technology.

---

# 18. Detailed vs Overview Modes

The final web implementation will support two visual information densities.

## Detailed Mode

Default when the URL is opened.

Purpose:

- exploration;
- portfolio-style presentation;
- richer professional information.

May contain:

- company;
- role;
- years;
- technologies;
- skills;
- project names;
- concise project descriptions;
- architectural visual elements;
- additional explanatory text.

## Overview Mode

Explicitly enabled through a query parameter.

Purpose:

- fast visual comprehension;
- screenshot-friendly representation;
- approximately five-second comprehension.

It should show significantly less text.

Likely information:

- company;
- role;
- years;
- a small number of technology/skill keywords;
- one concise contribution/identity phrase where useful.

Overview mode does not need to be prominently discoverable.

It primarily exists so the user can generate a concise screenshot.

Both modes should use the same underlying diorama and architecture.

---

# 19. Information Layer vs Architecture Layer

The project should separate:

### Architectural layer

SVG/vector geometry:

- terrain;
- path;
- entrance;
- floors;
- walls;
- stairs;
- elevator;
- structural elements;
- architectural details;
- decorative objects.

### Information layer

HTML/Vue or separate SVG text where appropriate:

- company names;
- roles;
- years;
- technologies;
- project descriptions;
- current role;
- labels.

This separation should make the visual architecture editable without rewriting professional content.

---

# 20. Current Role / Top-Level Identity

Current professional identity should appear in the upper/main portion of the final composition rather than on the entrance sign.

The user currently identifies primarily as:

- Software Architect;

with related current descriptors such as:

- Technical Lead.

Exact wording and placement will be refined during the information-design stage.

---

# 21. Technical Direction

The final implementation is expected to use:

- SVG as the primary visual representation;
- Vue.js for web integration and view/state handling;
- HTML/CSS for information overlays where useful;
- GitHub Pages for hosting.

The user is responsible for the final repository and deployment workflow.

The project should avoid unnecessary implementation complexity.

A query parameter may be used to select Overview mode rather than introducing a complex runtime mode system.

---

# 22. SVG Strategy

The SVG should be:

- editable;
- modular;
- understandable;
- reasonably organized;
- composed of meaningful groups/layers;
- compatible with later manual editing.

The project should preserve conceptual separation between:

- ground/terrain;
- entrance/path;
- sign;
- each floor;
- staircase;
- elevator;
- architectural details;
- content elements.

The SVG should not become an opaque generated artifact that is impossible to maintain.

## Visual Asset Strategy

SVG is the preferred format for the building's primary architectural
geometry because it provides scalable, structured and editable geometry.

However, the project does NOT require every visual element to be 100%
vectorizable or editable.

Raster images, generated images, textures, image-based surface details or
other visual assets may be used/generated when they produce a significantly better
visual result.

The visual quality and coherence of the final diorama take priority over
forcing every element into SVG.

Whenever practical:

- architectural structure should remain SVG;
- important geometric elements should remain modular;
- raster assets should be used selectively;
- image assets should be isolated from the structural SVG where practical;
- assets should remain replaceable without restructuring the building.

The project should use a hybrid SVG/raster approach when appropriate.

---

# 23. Iterative Development Principle

The project must be built progressively.

The first SVG should intentionally be extremely simple.

Initial objective:

> Validate composition and spatial relationships, not visual beauty.

The first version may contain almost nothing more than:

- major outlines;
- floor planes;
- building footprint;
- path;
- sign;
- stairs;
- elevator;
- major divisions.

After each stage, the resulting visual should be inspected before defining the next level of detail.

The user will provide the rendered result for review.

Subsequent stages should respond to what the actual SVG looks like rather than attempting to predict every final detail in advance.

## Visual Priority

When implementing visual stages, prioritize the final visual appearance over implementation purity.
The target is a convincing illustrated architectural diorama.
Do not simplify or omit visual detail merely because reproducing it as editable SVG geometry would be inconvenient.
Conversely, do not add visual complexity merely because it is technically possible.
Every visual element should contribute to:

- architectural believability;
- depth;
- material differentiation;
- scale;
- career-stage storytelling;
- or the overall illustrated aesthetic.

---

# 24. Visual Development Principle

The final visual style should be introduced gradually.

Potential progression:

1. structural wireframe;
2. geometric refinement;
3. architectural structure;
4. illustrated linework;
5. color/materials;
6. small architectural details;
7. professional/project objects;
8. text/information;
9. final composition;
10. web integration/polish.

The reference architectural illustration should guide the later style-development stages, not constrain the initial geometry stage.

## Primary Visual Style Reference

The project uses the Stockcake image `./sectional-modular-habitat-stockcake.jpg` as the primary visual style reference.
The reference is used to guide the visual language, not to reproduce its composition or content.
Important characteristics to take from the reference include:

- sectional / cutaway architectural illustration;
- isometric architectural perspective;
- hand-drawn / ink-illustration character;
- fine but clearly visible outlines;
- slightly imperfect illustrated contours;
- muted, desaturated architectural colors;
- warm off-white / concrete-like surfaces;
- restrained accent colors;
- subtle hatching and surface linework;
- believable architectural infrastructure;
- pipes, conduits, panels, brackets, joints and structural connections;
- visible material variation;
- small-scale construction details;
- soft directional shading;
- a sophisticated technical-illustration / architectural-model aesthetic.

The reference is NOT a literal design template.
The career diorama must retain its own building geometry, floor structure, circulation, career layout, perspective and visual storytelling defined by this brief.

The visual reference defines STYLE, not CONTENT.
Do not reproduce its building, floor arrangement, objects, colors, infrastructure layout or composition.
Use it as inspiration for how the career building should be illustrated.

---

# 25. Explicit Non-Goals

The project should NOT initially attempt to:

- create a photorealistic building;
- create a fully rendered 3D scene;
- reproduce a reference image exactly;
- generate all career content inside an image-generation prompt;
- make every floor visually identical;
- add every historical detail immediately;
- create a complex game-like interaction system;
- optimize for mobile-first interaction before the desktop composition works;
- encode all text permanently into the SVG architecture.

---

# 26. Open Decisions

The following should remain iterative rather than being prematurely fixed:

- exact isometric angles;
- exact floor dimensions;
- exact building proportions;
- final color palette;
- final line-art treatment;
- amount of architectural detail;
- specific decorative objects;
- exact typography;
- exact information density;
- final placement of professional content;
- final Overview-mode composition.

The first implementation stages should be used to resolve these decisions through visual iteration.
