<script setup lang="ts">
// Stage 1: the diorama is a single assembled SVG rendered inline.
// No component architecture, interaction, or information layers yet.
import dioramaSvg from './svg/diorama.svg?raw'

// Raster assets are referenced by `__ASSET__<file>__` tokens in the SVG (see
// scripts/generate-geometry.mjs). Resolve them here to the Vite-hashed URLs of
// the optimized derivatives in src/assets/serve/ (built by
// scripts/optimize-assets.py). Full-resolution masters live in src/assets/.
const assetUrls = import.meta.glob('./assets/serve/*', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const dioramaHtml = dioramaSvg.replace(/__ASSET__(.+?)__/g, (_match, name: string) => {
  const url = assetUrls[`./assets/serve/${name}`]
  if (!url) throw new Error(`Diorama asset not found: ${name}`)
  return url
})
</script>

<template>
  <main class="shell">
    <!-- Static, trusted local asset assembled from src/svg/fragments. -->
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div class="diorama" v-html="dioramaHtml" />
  </main>
</template>
