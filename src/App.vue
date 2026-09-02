<script setup lang="ts">
// Stage 1: the diorama is a single assembled SVG rendered inline.
// No component architecture, interaction, or information layers yet.
import dioramaSvg from './svg/diorama.svg?raw'
</script>

<template>
  <main class="shell">
    <!-- Static, trusted local asset assembled from src/svg/fragments. -->
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div class="diorama" v-html="dioramaSvg" />
  </main>
</template>
