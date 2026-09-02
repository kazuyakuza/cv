# Professional Career Diorama

An isometric architectural diorama representing a professional
software-development career as a multi-floor building — each floor is a career
stage, growing upward over time. The visual source is **editable, modular SVG
geometry**; **Vue.js** provides the web application. Development is staged and
iterative: each stage's rendered SVG is reviewed before the next stage begins.

## Running locally

```bash
npm install
npm run dev       # development server
npm run build     # type-check + production build
npm run preview   # preview the production build
```

Additional tooling:

```bash
npm run lint          # eslint (TypeScript + Vue SFC)
npm run format        # prettier (source SVG excluded)
npm run format:check
npm run type-check    # vue-tsc --noEmit
npm run svg:optimize  # svgo → generated/svg (source in src/svg stays authoritative)
```

## Documentation

- `.agent/project-info/PROJECT_BRIEF.md` — what the project is (career content, layout, concept)
- `.agent/project-info/IMPLEMENTATION_PLAN.md` — the stage-by-stage roadmap
- `.agent/todo/STAGE_00_PROJECT_FOUNDATION.md` — current stage specification
- `AGENTS.md` — conventions and constraints for coding agents
- `src/svg/README.md` — SVG source organization and naming conventions

## Status

Stage 1 (Complete Building Wireframe) — the first full architectural wireframe
lives in `src/svg/` (fragments + assembled `diorama.svg`, rendered by the app).
Edit fragments, then run `npm run svg:assemble`. See `src/svg/README.md` for
geometry parameters and conventions.
