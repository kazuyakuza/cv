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
- `.agent/todo/STAGE_*.md` — per-stage specifications and completion reports
- `AGENTS.md` — conventions and constraints for coding agents
- `src/svg/README.md` — SVG source organization, geometry parameters and naming conventions

## Status

**Stage 9 (Vue integration) is complete.** The diorama is a maintainable,
responsive Vue app: `src/App.vue` composes the page, `DioramaView.vue` renders
the inline SVG, `src/diorama.ts` resolves the `__ASSET__` tokens and applies the
mode class, `src/composables/useDisplayMode.ts` keeps the app in sync with the
`?mode=` URL contract, and `src/data/career.ts` is a typed facade over the
authoritative `scripts/career-data.mjs`. Detailed and Overview are preserved
from Stage 8; the full composition stays visible (no overflow/clipping) at
desktop, tablet and mobile widths, and the page is accessible (SVG
title/desc + a hidden LinkedIn link). Next: **Stage 10 — final polish and
deployment**. See `AGENTS.md` and `src/svg/README.md` for details.
