# Stage 9 — Vue Integration

## Objective

Turn the completed SVG diorama and the Stage 8 mode behavior into a maintainable Vue application.

The project already has a working Vite/Vue scaffold, an inline SVG rendering path, asset-token resolution, and a canonical display-mode contract. Do not rebuild these from scratch. Inspect and extend the existing implementation so the application becomes a robust, responsive presentation of the existing diorama.

This stage integrates the artifact; it is not another illustration/content stage. Preserve the approved Stage 8 visuals in both modes unless a specific integration defect requires a minimal correction.

## Status — COMPLETE (2026-10-14)

Implemented and verified. Component split (`App.vue` page + `DioramaView.vue`
SVG + `useDisplayMode` URL layer), one-time `__ASSET__` resolution and mode-class
swap in `src/diorama.ts`, a typed facade (`src/data/career.ts` +
`scripts/career-data.d.mts`) over the authoritative `scripts/career-data.mjs`,
responsive shell sizing (full viewBox at desktop/tablet/mobile, no overflow),
and accessibility metadata (`<desc>`/`aria-describedby` + a visually hidden
LinkedIn link). URL-only mode selection — no in-page control; `popstate` keeps
the URL and the app in sync. Detailed is unchanged; Overview keeps all Stage 8
styling. `svg:generate`/`svg:assemble`, `lint`, `type-check`, `build` all clean.
See the Completion Report at the end of this file.

## Read First

Inspect the current repository state, not older assumptions in this document:

- `.agent/project-info/PROJECT_BRIEF.md`
- `.agent/project-info/IMPLEMENTATION_PLAN.md`
- `AGENTS.md`
- `package.json`
- `index.html`
- `src/main.ts`
- `src/App.vue`
- `src/display-mode.ts`
- `src/styles/base.css`
- `src/svg/README.md`
- `src/svg/diorama.svg`
- `scripts/assemble-svg.mjs`
- `scripts/style.mjs`
- `scripts/career-data.mjs` and the current generated information fragments
- The completed Stage 7 and Stage 8 specifications and their completion reports.

Render/launch the current app before making changes. Stage 8's committed Detailed and Overview states are the visual baseline.

## Scope A — Vue Component Structure

Refactor only as much as needed to make the app understandable and maintainable.

- Keep `src/App.vue` as the page-level composition unless inspection shows a clear reason to split it.
- Extract a dedicated diorama component if doing so meaningfully isolates SVG loading, asset resolution, and rendering from page-level responsibilities.
- Keep mode parsing/selection separate from visual rendering.
- Keep reusable UI components small and purposeful; do not create a component for every wrapper or SVG group.
- Keep TypeScript types explicit where they clarify the data model or mode contract.
- Preserve the existing Vite/Vue 3 setup and avoid adding dependencies without a concrete need.

A reasonable separation, if supported by the existing code, is:

- page/root component: resolves application state and composes the page;
- diorama component: loads/renders the assembled SVG and resolves its local asset tokens;
- display-mode module: canonical mode type, query parameter, parsing and serialization helpers;
- career data module: structured, verified professional information used by the application where applicable.

Do not force this exact file layout if the existing implementation already achieves the same separation cleanly.

## Scope B — SVG Integration

The diorama remains the primary visual artifact and must be rendered inline so its embedded SVG mode styles work.

- Preserve the existing `?raw` import or an equivalent reliable inline-SVG loading approach.
- Continue resolving `__ASSET__…__` tokens to the optimized assets in `src/assets/serve/`.
- Treat the SVG as trusted, repository-owned content. Do not add a general-purpose mechanism that injects arbitrary external SVG or HTML.
- Keep the SVG's aspect ratio and full viewBox intact. Do not stretch it to fill a viewport, crop floors, or crop the projecting sign.
- Keep SVG generation and assembly deterministic. Changes to generated SVG content must be made in its actual source/generator, not only in generated output.
- Fail clearly during development/build if an expected local asset token cannot be resolved; do not silently leave broken token text or broken image references.
- Avoid duplicating the large SVG as separate Detailed and Overview files. Both modes must use the same SVG and switch its existing root mode class.
- Preserve the standalone assembled SVG's Detailed default.

If the current inline rendering uses `v-html`, document why it is safe in this project and keep its input limited to the local, assembled SVG. Do not introduce user-controlled markup into that path.

## Scope C — Display Mode and URL Query Handling

Reuse `src/display-mode.ts` as the single source of truth. Do not reimplement parsing rules in components.

Canonical behavior:

- No `mode` parameter → `detailed`.
- `?mode=detailed` → `detailed`.
- `?mode=overview` → `overview`.
- Matching is case-insensitive and whitespace-trimmed.
- Empty or unknown values → `detailed`.

Implement the final application-level mode handling:

- Resolve the mode from the current URL on initial load.
- Apply the matching root SVG class: `dw-mode-detailed` or `dw-mode-overview`.
- Ensure a page refresh or a directly opened/shared URL selects the same mode.
- If the app offers an in-page mode control, keep it synchronized with the URL and use the canonical module to serialize the mode. Do not add such a control unless it is useful to the intended experience; query-parameter selection is required regardless.
- If a mode control is implemented, update browser history in a predictable way and respond to browser back/forward navigation. Do not reload the whole page unnecessarily.
- Do not create a second mode state that can diverge from the URL.
- Preserve unrelated query parameters when updating `mode`.
- Unknown parameters must not break rendering.

Do not introduce Vue Router solely to read one query parameter unless the existing app has already adopted it or future navigation clearly requires it. A small, well-typed URL synchronization layer is sufficient for this single-page presentation.

## Scope D — Information Data Model

The information content was established in Stage 7 and visually represented in the SVG. Stage 9 should make the information maintainable at the application level without destabilizing the illustration.

- Inspect `scripts/career-data.mjs` and existing information-fragment generation before deciding what needs to be moved or shared.
- Reuse the current verified career data where possible; avoid creating a competing second source of truth.
- If application-facing structured data is needed, define typed records for the established experiences and the fields actually used by the app, such as stable ID, company/experience name, period, role, floor/section association, and verified supporting details.
- Keep content in one authoritative place wherever practical. If SVG generation and Vue both need the same data, prefer a shared data source that both can consume, or clearly document why a small amount of generated duplication is necessary.
- Do not manually transcribe all SVG text into a second object merely to claim there is a data model.
- Do not regenerate the SVG from a new data model if that would risk changing the approved visual layout. Make any data-pipeline refactor incrementally and verify pixel/visual equivalence.
- Do not invent details for Indelve or Pacer. Preserve the verified content already present and keep unknown fields absent rather than filling them with guesses.
- Do not add new roles, technologies, descriptions, projects, metrics, or certifications in this stage.

The data model must support the application integration that actually exists. Do not build a speculative search, filtering, timeline, or CMS layer.

## Scope E — Responsive Behavior

The diorama is a detailed, wide/tall architectural composition. Responsiveness means preserving the whole illustration and keeping it usable on different screens, not rearranging its floors into a different diagram.

Implement and verify:

- SVG scales proportionally to the available content width.
- The complete viewBox remains visible, including the top rocket/open construction and the projecting sign.
- No horizontal overflow is introduced by the page shell or SVG container at common viewport widths.
- Desktop presentation uses the available viewport effectively without excessive empty margins.
- Tablet and mobile widths retain the complete composition; at narrow widths, the user may need to zoom/pan or scroll vertically, but the building must not be clipped or made unreadably tiny by forced fitting to a fixed viewport height.
- The dark atmospheric background remains visually consistent around the transparent SVG.
- Page padding adapts sensibly at narrow widths without changing the illustration's internal geometry.
- Both Detailed and Overview work responsively; Overview must retain its Stage 8 sign scaling and information-visibility rules at every size.
- Do not add mobile-specific alternate SVGs or reimplement the illustration in HTML.

Use CSS breakpoints only where they materially improve layout. Do not add a navigation menu, toolbar, modal, or other UI that is not required by the project.

## Scope F — Basic Interaction and Accessibility

Keep the experience intentionally simple. Do not invent interactions merely because the plan says “if required.”

Required or justified behavior:

- The LinkedIn QR code on the projecting sign must remain valid and scannable in the rendered SVG.
- If the LinkedIn URL is exposed as a clickable link in the app, it must open the correct destination and have an accessible name. Avoid adding an invisible or overlapping hit target that interferes with the illustration.
- Any mode control, if implemented, must be keyboard-operable, have an accessible name, and expose its selected state.
- Preserve meaningful document language, page title, and viewport metadata.
- Provide a concise accessible description of the diorama for assistive technology. If the SVG already has a suitable `title`/`desc`, reuse or improve it; avoid duplicating a long résumé in hidden text.
- Ensure focus indicators are visible for any actual interactive controls.
- Do not make decorative SVG objects individually focusable.
- Do not add hover animations, clickable floor hotspots, zoom controls, popups, or tooltips unless the current product brief or an approved interaction requirement calls for them.

## Scope G — Page Composition

Keep the diorama as the primary and dominant content.

- Do not add a conventional résumé panel beside or above the building.
- Do not add new introductory marketing copy, navigation, cards, or a footer merely to make the page look like a typical portfolio.
- Preserve the dark graphite atmosphere and the visual hierarchy already established.
- The page should open directly on the diorama rather than requiring a click to reveal it.
- Use the HTML document title and accessible description for basic identification; keep the on-canvas professional identity and sign content as defined in Stage 7.

## Explicitly Out of Scope

- Further illustration redesign, architectural changes, new props, or additional career content.
- Changing Stage 7 role, technology, company, date, project, identity, photo, QR, or LinkedIn content.
- Reworking Stage 8's visual decisions except to fix a demonstrable integration bug.
- Reintroducing separate SVG files for the two modes.
- A new data-management service, CMS, backend, API, analytics, or user accounts.
- Unrequested zoom/pan systems, clickable floor hotspots, popovers, modals, animations, or elaborate UI.
- Final GitHub Pages/deployment configuration and release validation; those belong to Stage 10 unless a small change is strictly required to test the app locally.

## Acceptance Criteria

- [x] The application runs through the existing Vue/Vite entry point and renders the complete diorama inline.
- [x] SVG asset tokens resolve to valid optimized local assets in development and production builds.
- [x] Detailed remains the default and visually matches the approved Stage 8 Detailed baseline.
- [x] Overview is selected through `?mode=overview` and preserves all Stage 8 Overview styling.
- [x] Explicit Detailed, missing parameters, empty values, unknown values, and case/whitespace variations follow the canonical contract.
- [x] If a mode control is added, it stays synchronized with the URL and browser navigation.
- [x] No separate SVG copy or competing mode parser has been introduced.
- [x] The information data model reuses verified existing data and does not create unnecessary duplication.
- [x] Indelve and Pacer content has not been invented or expanded.
- [x] The entire building and projecting sign remain visible without distortion at desktop, tablet, and mobile viewport widths.
- [x] The app has sensible page metadata and an accessible description; any real controls are keyboard-accessible.
- [x] No unnecessary UI or interaction has been added.
- [x] SVG generation/assembly, lint, type-check, and production build pass.
- [x] Stage 10 deployment work has not been pulled into this stage.

## Verification

1. Run `npm run svg:generate` and `npm run svg:assemble` if source/generator changes require them.
2. Run `npm run lint`, `npm run type-check`, and `npm run build`.
3. Run the development server and verify:
   - `/` → Detailed;
   - `/?mode=detailed` → Detailed;
   - `/?mode=overview` → Overview;
   - `/?mode=OVERVIEW` → Overview;
   - `/?mode=` → Detailed;
   - `/?mode=unknown` → Detailed.
4. If a mode control is added, test switching both directions, browser back/forward, refresh, and preservation of unrelated query parameters.
5. Inspect screenshots at representative desktop, tablet, and mobile viewport sizes. Compare both modes at the same dimensions.
6. Confirm the full SVG is visible, not stretched or cropped, and all local raster assets load.
7. Check the console and network panel for runtime errors or missing assets.

## Completion Report

Report:

1. Component/file structure and responsibilities.
2. How the SVG is imported, asset tokens are resolved, and the inline rendering remains safe.
3. How the URL mode contract is reused and whether an in-page control was added.
4. The information data model and its authoritative source.
5. Responsive behavior and the viewport sizes tested.
6. Results of SVG generation/assembly, lint, type-check, build, and mode tests.
7. Any known limitation intentionally deferred to Stage 10.

### Report

1. **Component/file structure.** `src/App.vue` — page composition: resolves the
   mode via `useDisplayMode()` and composes `<main class="shell">` (diorama +
   visually hidden LinkedIn link). `src/components/DioramaView.vue` — the inline
   SVG: takes a `mode` prop and renders the assembled SVG with the root mode
   class swapped. `src/diorama.ts` — loads the SVG (`?raw`), resolves
   `__ASSET__` tokens once, and exposes `resolveAssetTokens()`, `applyModeClass()`
   and the resolved `DIORAMA_SVG`. `src/composables/useDisplayMode.ts` — mirrors
   the URL mode into a reactive ref and re-syncs on `popstate`.
   `src/data/career.ts` (+ `scripts/career-data.d.mts`) — typed facade over the
   authoritative career data. `src/display-mode.ts` — unchanged canonical
   contract. No new dependency; Vite/Vue 3 setup preserved.
2. **SVG import / tokens / inline safety.** The SVG stays a `?raw` import of the
   local, assembled `src/svg/diorama.svg` and is rendered inline via `v-html`
   (required so the SVG's embedded `dw-mode-*` styles apply). It is trusted,
   repository-owned content — the input is limited to that single local file and
   no user-controlled markup enters the path. Tokens are resolved once against
   the Vite-hashed URLs of `src/assets/serve/*` (glob `?url`); a missing asset
   throws (dev and build), so broken tokens/references can never ship. Both modes
   use the same SVG (only the root class changes); the standalone file keeps its
   Detailed default.
3. **URL mode contract / control.** `useDisplayMode` imports `resolveMode` from
   `src/display-mode.ts` (the single source of truth) — no parsing rules are
   reimplemented. It resolves on load and re-reads on `popstate` (so a shared URL
   and back/forward select the same mode). **No in-page control was added** (the
   brief says Overview need not be discoverable); therefore no URL writes occur,
   unrelated query parameters are never touched, and there is no second mode
   state that could diverge from the URL. Verified: `/`→Detailed,
   `?mode=detailed`→Detailed, `?mode=DETAILED`→Detailed, `?mode=`→Detailed,
   `?mode=unknown`→Detailed, `?mode=overview`→Overview, `?mode=OVERVIEW`→Overview,
   `?mode=overview&x=1`→Overview (extra param preserved), `?x=1`→Detailed, and a
   synthetic `popstate` re-resolves the mode without a reload.
4. **Information data model.** `scripts/career-data.mjs` remains the single
   authoritative source (the generator renders it into the `information`
   fragments and the exterior sign). `src/data/career.ts` re-exports only
   `IDENTITY` (typed via `scripts/career-data.d.mts`) for the accessible link —
   no transcribing, no competing source, no invented Indelve/Pacer content and
   no speculative search/filter/timeline layer.
5. **Responsive behavior.** `src/styles/base.css` sizes the SVG at its intrinsic
   ratio with `max-width: 100%` and `max-height: calc(100dvh − 2·padding)`:
   width-bound on narrow screens (vertical scroll, never tiny), height-bound on
   desktop (centred, whole viewBox visible — top rocket + projecting sign, no
   crop/distortion). Shell uses `justify-content: safe center` (falls back to
   start) so it never clips when scrolling is needed; one `≤640px` breakpoint
   reduces padding. Verified with no horizontal overflow at **1440×900**
   (Detailed 803×852, Overview 803×852), **768×1024** (720×764) and **390×844**
   (366×388), both modes; 60 `<image>` assets load with 0 broken in every case;
   Overview still hides `.dw-logo` and scales `#tags .dw-tag-group` by 1.8 at
   every size.
6. **Checks.** `npm run svg:generate` + `svg:assemble` succeed; `diorama.svg`
   changed by only 2 lines (`aria-describedby` + `<desc>`) — fragments were
   regenerated byte-identical (deterministic). `npm run lint`, `npm run
   type-check` and `npm run build` all exit 0; the production build emits the
   hashed serve-assets (no base64 inlining) and a single JS bundle.
7. **Deferred to Stage 10.** GitHub Pages `base`/deployment and release
   validation; final typography/spacing polish; any ultra-wide-margin tuning.
   (Responsive rendering was verified against the production `dist` build via a
   Playwright request interception harness — no dev server left running.)
