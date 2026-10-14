<script setup lang="ts">
// Stage 1: the diorama is a single assembled SVG rendered inline.
// Stage 8: the display mode is selected by the `?mode=` query parameter and
// applied as the root SVG's mode class. The canonical contract lives in
// ./display-mode.ts (Stage 9 reuses it for real routing; this is only the
// minimal hook needed to exercise the two presentation states).
import dioramaSvg from './svg/diorama.svg?raw'
import { MODE_CLASS, resolveMode } from './display-mode'

// Raster assets are referenced by `__ASSET__<file>__` tokens in the SVG (see
// scripts/generate-geometry.mjs). Resolve them here to the Vite-hashed URLs of
// the optimized derivatives in src/assets/serve/ (built by
// scripts/optimize-assets.py). Full-resolution masters live in src/assets/.
const assetUrls = import.meta.glob('./assets/serve/*', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const mode = resolveMode(window.location.search)

const dioramaHtml = dioramaSvg
  .replace(/__ASSET__(.+?)__/g, (_match, name: string) => {
    const url = assetUrls[`./assets/serve/${name}`]
    if (!url) throw new Error(`Diorama asset not found: ${name}`)
    return url
  })
  // The assembled SVG ships with the Detailed mode class; swap it for the
  // resolved mode. MODE_CLASS.detailed re-applies the same token, so the
  // default path is a no-op replace.
  .replace(/class="dw-mode-(?:detailed|overview)"/, `class="${MODE_CLASS[mode]}"`)
</script>

<template>
  <main class="shell">
    <!-- Static, trusted local asset assembled from src/svg/fragments. -->
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div class="diorama" v-html="dioramaHtml" />
  </main>
</template>
