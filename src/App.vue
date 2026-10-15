<script setup lang="ts">
// Stage 9 — page-level composition: resolve the display mode from the URL and
// compose the page. SVG loading/rendering lives in DioramaView; the mode
// contract lives in ./display-mode.
// Stage 10 — adds the custom diorama zoom (a wrapper viewport + a floating
// toggle), independent of browser zoom.
import { computed, ref, watch } from 'vue'
import DioramaView from './components/DioramaView.vue'
import { useDisplayMode } from './composables/useDisplayMode'
import { useZoom } from './composables/useZoom'
import { IDENTITY } from './data/career'

const { mode } = useDisplayMode()

// The zoom viewport hosts the diorama; the composable measures the default SVG
// width from it and exposes the 1×/4× toggle state.
const viewport = ref<HTMLElement | null>(null)
const { zoomed, zoomWidth, zoomOut, toggleZoom } = useZoom(viewport)

// Custom zoom is a Detailed-mode affordance only. If the mode changes under us
// (browser back/forward), drop out of zoom so no hidden state lingers.
watch(mode, (m) => {
  if (m !== 'detailed') zoomOut()
})

// Only the enlarged width rides on a CSS custom property; at 1× the viewport
// keeps its normal flow layout.
const viewportStyle = computed<Record<string, string> | undefined>(() =>
  zoomed.value ? { '--dw-zoom-w': `${zoomWidth.value}px` } : undefined,
)
</script>

<template>
  <main class="shell">
    <div
      ref="viewport"
      class="zoom-viewport"
      :class="{ 'is-zoomed': zoomed }"
      :style="viewportStyle"
    >
      <DioramaView :mode="mode" />
    </div>

    <!-- Custom diorama zoom toggle (Detailed mode only): large and
         eye-catching at 1×, small once zoomed (where it is the zoom-out
         control). It never disappears while in Detailed mode. -->
    <button
      v-if="mode === 'detailed'"
      type="button"
      class="zoom-btn"
      :class="{ 'is-zoomed': zoomed }"
      :aria-pressed="zoomed"
      :aria-label="zoomed ? 'Zoom out of the diorama' : 'Zoom into the diorama'"
      @click="toggleZoom"
    >
      {{ zoomed ? 'Zoom -' : 'Zoom +' }}
    </button>

    <!-- Non-visual accessible link to the same destination as the sign's QR
         code; sourced from the authoritative career data. -->
    <a class="sr-only" :href="IDENTITY.linkedin">LinkedIn profile of {{ IDENTITY.name }}</a>
  </main>
</template>
