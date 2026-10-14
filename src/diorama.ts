// Stage 9 — the inline diorama SVG: loading, local asset-token resolution and
// the display-mode class swap, isolated from page-level concerns.
//
// The diorama must be rendered INLINE so its embedded `dw-mode-*` styles apply
// (page CSS cannot reach into an SVG loaded as an <img>). It is trusted,
// repository-owned content assembled from src/svg/fragments by
// `npm run svg:assemble`; nothing user-controlled ever enters this path.
import dioramaSvg from './svg/diorama.svg?raw'
import { MODE_CLASS, type DisplayMode } from './display-mode'

// Raster assets are referenced by `__ASSET__<file>__` tokens in the SVG (see
// scripts/generate-geometry.mjs). Resolve them to the Vite-hashed URLs of the
// optimized derivatives in src/assets/serve/ (built by
// scripts/optimize-assets.py). Full-resolution masters live in src/assets/.
const assetUrls = import.meta.glob('./assets/serve/*', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

/**
 * Replace every `__ASSET__<file>__` token with its served, hashed URL. Fails
 * loudly (dev and build) if a referenced asset is missing rather than leaving
 * broken token text or image references in the output.
 */
export function resolveAssetTokens(svg: string): string {
  return svg.replace(/__ASSET__(.+?)__/g, (_match, name: string) => {
    const url = assetUrls[`./assets/serve/${name}`]
    if (!url) throw new Error(`Diorama asset not found: ${name}`)
    return url
  })
}

/**
 * Swap the root SVG element's single mode class. The assembled file ships with
 * `dw-mode-detailed`, so Detailed is a no-op replace; the contract itself lives
 * in src/display-mode.ts.
 */
export function applyModeClass(svg: string, mode: DisplayMode): string {
  return svg.replace(/class="dw-mode-(?:detailed|overview)"/, `class="${MODE_CLASS[mode]}"`)
}

/** The assembled SVG with its asset tokens resolved once (static local asset). */
export const DIORAMA_SVG = resolveAssetTokens(dioramaSvg)
