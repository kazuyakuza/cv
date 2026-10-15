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

**Stage 10 (final polish + deployment) is complete.** The Vue app composes the
page (`src/App.vue`), renders the inline, mode-swapped SVG
(`src/components/DioramaView.vue` + `src/diorama.ts`), keeps the app in sync with
the `?mode=` URL contract (`src/composables/useDisplayMode.ts`), and reads the
authoritative career data through a typed facade (`src/data/career.ts`). Stage 10
makes the whole exterior projecting sign a single LinkedIn link and adds a custom
diorama zoom (`src/composables/useZoom.ts`): a fixed top-left `Zoom` button
(Detailed mode only) toggles exactly 1×/4×, the enlarged diorama pans natively
with the scrollbars hidden, and browser zoom is never touched. The whole composition stays visible with no overflow at desktop,
tablet and mobile widths. Vite builds under the `/cv/` base and
`.github/workflows/deploy.yml` publishes `dist/` to GitHub Pages via the official
artifact flow — one manual step remains (Settings → Pages → Source = "GitHub
Actions"), and the live deployment is not yet verified. See `AGENTS.md` and
`src/svg/README.md` for details.
