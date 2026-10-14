<script setup lang="ts">
// Stage 9 — page-level composition: resolve the display mode from the URL and
// compose the page. SVG loading/rendering lives in DioramaView; the mode
// contract lives in ./display-mode.
import DioramaView from './components/DioramaView.vue'
import { useDisplayMode } from './composables/useDisplayMode'
import { IDENTITY } from './data/career'

const { mode } = useDisplayMode()
</script>

<template>
  <main class="shell">
    <DioramaView :mode="mode" />
    <!-- Non-visual accessible link to the same destination as the sign's QR
         code; sourced from the authoritative career data. -->
    <a class="sr-only" :href="IDENTITY.linkedin">LinkedIn profile of {{ IDENTITY.name }}</a>
  </main>
</template>
