<script setup lang="ts">
// Stage 9 — the diorama SVG, rendered inline so its embedded `dw-mode-*` styles
// apply. Loading and asset-token resolution happen once in ../diorama; only the
// inexpensive root-class swap reacts to the mode prop.
import { computed } from 'vue'
import { applyModeClass, DIORAMA_SVG } from '../diorama'
import type { DisplayMode } from '../display-mode'

const props = defineProps<{ mode: DisplayMode }>()

const html = computed(() => applyModeClass(DIORAMA_SVG, props.mode))
</script>

<template>
  <!-- Static, trusted local asset assembled from src/svg/fragments. -->
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div class="diorama" v-html="html" />
</template>
