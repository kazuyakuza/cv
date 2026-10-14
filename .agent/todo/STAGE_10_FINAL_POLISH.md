# Stage 10 — Final Polish and Deployment

## Objective

Finish the current Vue/Vite diorama as a reliable, responsive, deployable web experience. This stage is implementation and delivery polish, not another illustration stage: preserve the approved SVG artwork, its information hierarchy, the existing Detailed/Overview mode contract, and the current dark atmospheric presentation.

The primary deliverables are:
1. a lightweight, evidence-based performance pass;
2. reliable full-width rendering on mobile;
3. deployment to GitHub Pages;
4. a single clickable target covering the entire projecting LinkedIn sign in Detailed mode;
5. a custom 4× diorama zoom button, independent of browser zoom.

## Status

Not started.

## Read First

Inspect the latest repository state before editing:
- `AGENTS.md`
- `.agent/project-info/PROJECT_BRIEF.md`
- `.agent/project-info/IMPLEMENTATION_PLAN.md`
- `package.json`, `index.html`, `vite.config.ts`
- `src/App.vue`, `src/components/DioramaView.vue`, `src/diorama.ts`
- `src/display-mode.ts`, `src/composables/useDisplayMode.ts`
- `src/styles/base.css`
- `src/data/career.ts`, `scripts/career-data.mjs`
- `src/svg/diorama.svg`, `src/svg/fragments/projecting-sign.svg`, and the source/generator responsible for the sign
- `scripts/assemble-svg.mjs`, `scripts/style.mjs`, and relevant asset-generation scripts
- all current `.github/workflows/` files, if present.

Also inspect the deployment workflow in the user's reference project:
https://github.com/kazuyakuza/cobranza-app_landing/

Do not assume the code or file layout still matches an older stage document. Keep changes small and consistent with the actual current implementation.

## Scope A — Performance Review

Run the existing validation/build commands and inspect the production output before deciding whether optimization is needed.

At minimum:
- run `npm ci` when appropriate, followed by `npm run lint`, `npm run type-check`, and `npm run build`;
- inspect the generated `dist/` output and its asset sizes;
- identify whether the assembled inline SVG, raster assets, or JavaScript bundles cause a meaningful loading cost;
- confirm that image assets are emitted as files rather than unexpectedly inlined as base64, respecting the existing `assetsInlineLimit: 0` configuration.

Make only evidence-based improvements. Prefer existing tooling and asset pipelines. Do not add a performance library, rewrite the SVG pipeline, or make broad structural changes without a demonstrated need. Do not compromise image quality, visual appearance, or the editable SVG source just to reduce a negligible amount of bytes.

Record what was checked and any material changes in the completion report. If no additional optimization is justified, state that clearly rather than inventing work.

## Scope B — Responsive Mobile Presentation

The diorama must remain readable and fit the available viewport width on narrow screens.

Requirements:
- Preserve the SVG's full `viewBox` and intrinsic aspect ratio.
- At the default zoom level, fit the SVG to the available content width without cropping any part of the building, unfinished top floor, terrain, or projecting sign.
- Keep the current dark background and established desktop composition.
- On mobile, use the available width efficiently; reduce surrounding padding if needed.
- Allow normal vertical page scrolling when the illustration is taller than the viewport. Do not shrink the illustration aggressively just to fit the viewport height.
- Do not create a separate mobile SVG, alter the illustration's proportions, or remove approved content.
- Ensure the floating Zoom control remains visible, tappable, and does not obscure important content unnecessarily.
- Verify both default Detailed mode and `?mode=overview` at a narrow mobile viewport and at desktop width.

The existing Stage 9 responsive behavior is the baseline. Adjust it only where real testing identifies a problem.

## Scope C — GitHub Pages Deployment

Configure this Vite project for deployment from the existing repository:
https://github.com/kazuyakuza/cv

Unless repository inspection shows otherwise, expect the project URL to use the repository subpath (typically `https://kazuyakuza.github.io/cv/`). Configure Vite's `base` accordingly while keeping local development at `localhost` working normally.

Requirements:
- Inspect and use the deployment pattern from `kazuyakuza/cobranza-app_landing` as the user's reference, adapting it to this repository rather than copying it blindly.
- Add or update a GitHub Actions workflow that installs dependencies reproducibly, runs the project's relevant validation/build commands, and publishes the generated `dist/` directory to GitHub Pages on pushes to the intended deployment branch.
- Use the existing npm scripts and Node version compatible with the project.
- Ensure the built HTML, JavaScript, styles, SVG-linked assets, favicon, and other public assets resolve correctly under the repository subpath.
- Preserve URL query behavior: the root page with no parameter is Detailed; `?mode=overview` is Overview; `?mode=detailed` remains Detailed. Query parameters must not be stripped or rewritten by deployment.
- Do not add routing infrastructure or a dependency just to support the current query-parameter modes.
- Include any required one-time repository Pages configuration in the completion notes if it cannot be configured from the repository workflow itself. Do not claim the public deployment is live until a successful deployment has actually been verified.

Use least-privilege workflow permissions where supported and avoid exposing secrets. The reference workflow currently uses `peaceiris/actions-gh-pages@v4`; reusing that approach is acceptable if it is still the simplest reliable option for this repository. If choosing GitHub's official Pages artifact workflow instead, keep it straightforward and document any required repository settings.

## Scope D — Make the Entire Projecting LinkedIn Sign Clickable

In Detailed mode (the default), clicking anywhere on the existing projecting LinkedIn sign must open the LinkedIn profile in a new browser tab.

Canonical destination (from `scripts/career-data.mjs`):
`https://www.linkedin.com/in/jebarrocal/`

The single click target must cover the complete visible sign, including:
- the profile photograph;
- the name;
- the QR code and its embedded LinkedIn mark;
- the printed LinkedIn URL;
- the sign background, border, and all other graphical elements belonging to the sign.

Implementation requirements:
- Prefer one SVG `<a>` around the sign's complete graphical group, or one equivalent hit target covering the full sign. Choose the approach compatible with the current SVG generator/fragment assembly.
- Set `target="_blank"` and `rel="noopener noreferrer"` on the link.
- Keep the sign's appearance, dimensions, position, and content unchanged.
- Do not create overlapping links, nested anchors, or dead click regions inside the sign.
- Do not make unrelated parts of the diorama open LinkedIn.
- Preserve the existing accessible, visually hidden LinkedIn link in the Vue page unless inspection shows a concrete reason it is redundant or incorrect.
- If the sign uses generated SVG, implement the change at its authoritative source/generator and regenerate the assembled SVG; do not edit generated output alone.
- The click target must not be intercepted by zoom/reset handlers.
- The same link may remain active in Overview too if this can be achieved without mode-specific complexity; Detailed mode is the mandatory acceptance case.

Verify that clicking the photo, QR code, printed URL, name, and empty/background area of the sign all activate the same single link, and that keyboard focus/activation remains possible.

## Scope E — Custom 4× Diorama Zoom

Add one floating button labelled exactly **Zoom**, centered horizontally near the bottom edge of the viewport. It controls the diorama's rendered size, not browser zoom.

### Default state

- On initial load, the diorama is at its existing normal size (scale `1×`).
- Show the floating Zoom button.
- The button should be visually consistent with the current dark, restrained presentation, with a clear focus indicator and usable touch target.
- Keep it fixed near the bottom center of the viewport, respecting mobile safe-area insets where practical.

### Zoomed state

- Clicking Zoom changes the diorama to a scale of exactly `4×` relative to its default rendered size.
- This is an initial fixed zoom level, not a slider or a multi-step zoom control. Do not add zoom libraries or browser-zoom APIs.
- Hide the Zoom button whenever the current scale is anything other than `1×`.
- Keep the enlarged artwork inspectable: provide a simple way to pan/scroll through the scaled diorama rather than leaving most of it permanently inaccessible. Prefer native scrolling and a minimal CSS/DOM solution over a custom canvas or complex gesture implementation.
- Zoom must not change the browser's zoom level or the URL query parameter used for display mode.
- Keep the SVG's aspect ratio and artwork intact. Do not stretch, redraw, crop the source SVG, or generate a second version.
- Ensure the 4× view works with both Detailed and Overview modes, including on mobile.

### Returning to default

Since the Zoom button is hidden while zoomed, provide a simple, discoverable way to return to the original view without reloading the page. Prefer Escape and/or a click/tap on a non-interactive area of the diorama, with an unobtrusive hint if needed. Keep this behavior minimal; do not add a second prominent control unless testing proves it necessary.

Do not let the reset handler consume clicks on the projecting LinkedIn sign or other genuine interactive links. Clicking the sign while zoomed must still open LinkedIn. Avoid resetting when a user is merely interacting with the scrollable viewport to inspect another part of the enlarged diorama.

Use Vue state for the zoom state and keep its transitions explicit. Avoid applying a global transform to the entire page: only the diorama should scale. The page background, unrelated HTML, and floating UI must not be scaled with it.

### Technical direction

Start by checking whether the existing DOM structure can support a small viewport wrapper around the SVG. A reasonable approach is a dedicated zoom viewport containing the existing diorama component, with a class or inline style controlling the 1×/4× state. Ensure the scaled element's layout dimensions and scrollable area match its visual dimensions; CSS transforms alone do not increase normal-flow dimensions, so do not leave the user unable to scroll to the enlarged artwork's edges.

Avoid relying on the deprecated SVG `zoomAndPan` mechanism or on browser/DevTools gestures. Do not add dependencies unless a concrete browser-compatibility problem proves they are necessary.

The exact 4× scale is the initial baseline requested by the user. After testing, the user may decide whether to adjust the factor or refine how the custom zoom interacts with trackpad gestures.

## Scope F — Preserve Existing Behavior

- Detailed remains the default mode.
- `?mode=overview` continues to select Overview through the existing canonical mode contract.
- Do not introduce an in-page mode selector.
- Preserve all approved illustration content, sign content, career data, and information hierarchy.
- Keep the SVG inline so its embedded mode styles work.
- Keep asset-token resolution and SVG assembly deterministic.
- Avoid unrelated refactors, new dependencies, visual redesign, or content additions.
- Do not change professional facts or invent new career content.

## Acceptance Criteria

### Build and performance
- [ ] `npm run lint` passes.
- [ ] `npm run type-check` passes.
- [ ] `npm run build` passes.
- [ ] Production asset output has been inspected and any optimizations are evidence-based.
- [ ] No broken or unresolved asset tokens/references appear in the production build.

### Responsive behavior
- [ ] At default zoom, the entire diorama fits within the available width on a narrow mobile viewport.
- [ ] The SVG remains proportional and uncropped; vertical scrolling is available when needed.
- [ ] The desktop composition remains visually consistent.
- [ ] The Zoom control is visible and usable on desktop and mobile.

### Zoom
- [ ] Initial scale is `1×`, and the Zoom button is visible.
- [ ] Activating Zoom sets the diorama to exactly `4×`; browser zoom remains unchanged.
- [ ] The Zoom button is hidden at `4×`.
- [ ] The enlarged diorama can be panned/scrolled to inspect its full extent.
- [ ] The user can return to `1×` without reloading.
- [ ] Zoom works in Detailed and Overview and does not break the LinkedIn sign link.

### LinkedIn sign
- [ ] The whole sign is covered by one link to `https://www.linkedin.com/in/jebarrocal/`.
- [ ] The link opens in a new tab with safe target attributes.
- [ ] The sign's visual appearance is unchanged.
- [ ] No unrelated SVG element becomes clickable to LinkedIn.

### GitHub Pages
- [ ] Vite assets use the correct base path for the repository deployment.
- [ ] A GitHub Actions workflow builds and deploys `dist/` on the intended branch.
- [ ] The deployed root URL loads without missing assets.
- [ ] The deployed `?mode=overview` and `?mode=detailed` URLs render their expected modes.
- [ ] Completion notes distinguish a successful build/workflow setup from a publicly verified deployment.

## Completion Report

At the end of this stage, append a concise report covering:
- the implementation and files changed;
- validation/build results and any meaningful performance findings;
- responsive viewport checks;
- zoom behavior and the reset interaction;
- whole-sign link verification;
- deployment workflow, Vite base path, and actual GitHub Pages status;
- any repository settings the user still needs to change manually.

Do not mark the stage complete or claim successful deployment until its acceptance criteria have been checked.
